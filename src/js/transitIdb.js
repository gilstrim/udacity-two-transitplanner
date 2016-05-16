// idb functionality
transitIdb = function () {
    
    // declare variables
    var dbPromise = null;
    var liveDeparturesCard = $("#liveDeparturesCard");
    var notificationsCard = $("#notificationsCard");

    // function to initialise the page
    var initPage = function () {
        // create idb objects
        dbPromise = openDatabases();
    };
    
    // function to create idb object
    var openDatabases = function () {
        // open db
        return idb.open(constants.IDB_NAME, 1, function (upgradeDb) {
            upgradeDb.createObjectStore(constants.IDB_STATION_OBJECT_STORE, { keyPath: 'code' });
            upgradeDb.createObjectStore(constants.IDB_SCHEDULE_OBJECT_STORE, { keyPath: ['departureStationCode', 'arrivalStationCode', 'departureDay', 'departureTime', 'arrivalTime'] });
        });
    };

    // function to get statsion from idb
    var getStationsFromCache = function () {
        return dbPromise.then(function (db) {
            // validate if db is valid            
            if (!db || stations.stationsLoaded()) return;

            // initialise transaction
            var tx = db.transaction(constants.IDB_STATION_OBJECT_STORE);
            var keyValStore = tx.objectStore(constants.IDB_STATION_OBJECT_STORE);

            // add stations
            return keyValStore.getAll().then(function (stationArr) {

                // append stations to dropdown
                stationArr.map(function (station) {
                    stations.appendStationsToControl(stations.departureStation, station.code, station.stationName);
                    stations.appendStationsToControl(stations.arrivalStation, station.code, station.stationName);
                });

                // process select
                $('select').material_select();
            });
        });
    };

    // function to add stations to idb
    var addStationsToCache = function (stations) {
        return dbPromise.then(function (db) {
            // validate if db is valid
            if (!db) return;

            // initialise transaction
            var tx = db.transaction(constants.IDB_STATION_OBJECT_STORE, 'readwrite');
            var keyValStore = tx.objectStore(constants.IDB_STATION_OBJECT_STORE);

            // add stations
            for (var counter = 0; counter < stations.length; counter++) {
                keyValStore.put({
                    code: stations[counter].abbr,
                    stationName: stations[counter].name
                });
            }

            // return complete
            return tx.complete;
        });
    };

    // function to add schedule to idb
    var getPartialScheduleFromCache = function (schedule) {
        return dbPromise.then(function (db) {
            // validate if db is valid            
            if (!db) return;

            // initialise transaction
            var tx = db.transaction(constants.IDB_SCHEDULE_OBJECT_STORE);
            var keyValStore = tx.objectStore(constants.IDB_SCHEDULE_OBJECT_STORE);

            // add stations
            return keyValStore.getAll().then(function (scheduleArr) {
                // clear schedule table
                schedules.removeStaticSchedulesToControl();

                // hide online tables
                liveDeparturesCard.hide();
                notificationsCard.hide();

                // sort out the schedule array from earliest to latest time
                /*
                    Method from Shobit Sharma at http://stackoverflow.com/questions/17064603/sort-string-array-containing-time-in-format-0900-am
                */
                scheduleArr.sort(function (a, b) {
                    return new Date('1970/01/01 ' + a.departureTime) - new Date('1970/01/01 ' + b.departureTime);
                });

                // append stations to dropdown
                scheduleArr.map(function (schedule) {
                    // initialise variables
                    var departureStationCode = stations.getDepartureStation();
                    var arrivalStationCode = stations.getArrivalStation();
                    var departureDay = moment(applicableDateTime).isoWeekday() < 6 ? 'weekday' : 'weekend';
                    var departureTime = moment(applicableDateTime).format("hh:mma");

                    // validate keys against inputs
                    if (
                            departureStationCode === schedule.departureStationCode &&
                            arrivalStationCode === schedule.arrivalStationCode &&
                            departureDay === schedule.departureDay &&
                            moment(schedule.departureTime, "hh:mma").isAfter(moment(departureTime, "hh:mma"))
                        )
                    {
                        schedules.appendStaticSchedulesToControl(schedule.departureTime, schedule.arrivalStationCode, schedule.arrivalTime, departureDay);
                    }                    
                });

                // attach events to newly formed table
                $('#scheduleTable tbody tr td').on('click', function () {
                    var rowParameters = $(this).parent().data().rowinfo.split(';');
                    getRouteInfo(rowParameters[0], rowParameters[1], rowParameters[2], rowParameters[3], rowParameters[4]);                    
                });
            });
        });
    };

    // function to add schedule to idb
    var addPartialScheduleToCache = function (schedule) {
        return dbPromise.then(function (db) {
            // validate if db is valid
            if (!db) return;

            // initialise transaction
            var tx = db.transaction(constants.IDB_SCHEDULE_OBJECT_STORE, 'readwrite');
            var keyValStore = tx.objectStore(constants.IDB_SCHEDULE_OBJECT_STORE);

            // add stations
            for (var counter = 0; counter < schedule.trip.length; counter++) {
                // get departure day
                var departureDay = moment(applicableDateTime).isoWeekday() < 6 ? 'weekday' : 'weekend';                

                // add to store
                keyValStore.put({
                    departureStationCode: schedule.trip[counter]._origin,
                    arrivalStationCode: schedule.trip[counter]._destination,
                    departureDay: departureDay,
                    departureTime: schedule.trip[counter]._origTimeMin,                    
                    arrivalTime: schedule.trip[counter]._destTimeMin,
                    tripLegs: schedule.trip[counter].leg
                });
            }

            // return complete
            return tx.complete;
        });
    };

    // function to information cards about routes
    var getRouteInfo = function (departureStationCode, arrivalStationCode, departureDay, departureTime, arrivalTime) {
        return dbPromise.then(function (db) {
            // validate if db is valid            
            if (!db) return;

            // initialise transaction
            var tx = db.transaction(constants.IDB_SCHEDULE_OBJECT_STORE);
            var keyValStore = tx.objectStore(constants.IDB_SCHEDULE_OBJECT_STORE);

            // add stations
            return keyValStore.getAll().then(function (scheduleArr) {
                // append stations to dropdown
                scheduleArr.map(function (schedule) {
                    // validate keys against inputs
                    if (
                            departureStationCode === schedule.departureStationCode &&
                            arrivalStationCode === schedule.arrivalStationCode &&
                            departureDay === schedule.departureDay &&
                            departureTime === schedule.departureTime &&
                            arrivalTime === schedule.arrivalTime
                        )
                    {
                        addRouteInformation(schedule.tripLegs);
                    }
                });

            });
        });
    };

    // expose public methods
    return {
        initPage: initPage,
        getStationsFromCache: getStationsFromCache,
        addStationsToCache: addStationsToCache,
        getPartialScheduleFromCache: getPartialScheduleFromCache,
        addPartialScheduleToCache: addPartialScheduleToCache,
        getRouteInfo: getRouteInfo
    };
}();