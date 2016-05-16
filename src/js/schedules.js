// schedules functionality
schedules = function () {
    
    // declare variables                
    var stationScheduleTable = $('#scheduleTable tbody');
    var liveStationSchedule = $('#liveScheduleTable');
    var liveStationScheduleTable = $('#liveScheduleTable tbody');
    var stationNameLabel = $('#lblStationName');
    var liveStationNameLabel = $('#lblLiveStationName');
    var liveScheduleNotification = $('#liveScheduleNotification');
    var liveDeparturesCard = $("#liveDeparturesCard");
    var notificationsCard = $("#notificationsCard");
    var notificationsDiv = $("#notificationsDiv");

    // initialise xml to json library
    var x2js = new X2JS();

    // function to initialise the page
    var initPage = function () {
        // set label on schedule
        stationNameLabel.text(stations.getStationNameFromCode(stations.getDepartureStation()));
        liveStationNameLabel.text(stations.getStationNameFromCode(stations.getDepartureStation()));

        // retrieve a list of stations
        transitIdb.getPartialScheduleFromCache().then(function () {
            // initialise variables
            var departureStationCode = stations.getDepartureStation();
            var arrivalStationCode = stations.getArrivalStation();            

            // retrieve schedule online
            getPartialScheduleOnline(departureStationCode, arrivalStationCode, applicableDateTime);
        });
    };

    // function to hook events
    var hookEvents = function () {
        // row click
        $('#scheduleTable tbody tr td').on('click', function () {
            var rowParameters = $(this).parent().data().rowinfo.split(';');
            transitIdb.getRouteInfo(rowParameters[0], rowParameters[1], rowParameters[2], rowParameters[3], rowParameters[4]);
        });
    };

    // function to retrieve train station schedules
    var getPartialScheduleOnline = function (departureStationCode, arrivalStationCode, departureDate) {

        // insert values into url
        var apiUrl = constants.BART_API_SCHEDULE_URL
                        .replace('$departureStation', departureStationCode)
                        .replace('$arrivalStation', arrivalStationCode)
                        .replace('$departureDate', moment(departureDate).format('MM/DD/YYYY'))
                        .replace('$departureTime', moment(departureDate).format('h:mma'))
                        .replace('$numEntriesBefore', constants.NUM_SCHEDULE_ENTRIES_BEFORE)
                        .replace('$numEntriesAfter', constants.NUM_SCHEDULE_ENTRIES_AFTER);

        // fetch data
        fetch(apiUrl)
        .then(function (response) {
            // convert response to text
            return response.text();
        })
        .then(function (response) {
            // convert xml string to a JSON object
            var jsonObject = JSON.parse(JSON.stringify(x2js.xml_str2json(response)));

            // clear schedule table
            removeStaticSchedulesToControl();

            // add schedules           
            for (var counter = 0; counter < jsonObject.root.schedule.request.trip.length; counter++) {                    
                appendStaticSchedulesToControl(                                                
                    jsonObject.root.schedule.request.trip[counter]._origTimeMin,
                    jsonObject.root.schedule.request.trip[counter]._destination,
                    jsonObject.root.schedule.request.trip[counter]._destTimeMin,
                    moment(applicableDateTime).isoWeekday() < 6 ? 'weekday' : 'weekend'
                );

                // add schedules to idb
                transitIdb.addPartialScheduleToCache(jsonObject.root.schedule.request);
            }

            // attach events to newly formed table
            hookEvents();

            // show online tables
            liveDeparturesCard.show();
            notificationsCard.show();

            // append special notification messages
            notificationsDiv.empty();
            notificationsDiv.append('<div class="card-panel red lighten-4"><span>' + jsonObject.root.message.special_schedule + '</div>');
        })
        .catch(function (error) {
            return error;
        });
    };

    // function to retrieve train station schedules
    var getLiveScheduleForStation = function (departureStationCode) {
        // insert values into url
        var apiUrl = constants.BART_API_LIVE_SCHEDULE_URL.replace('$departureStation', departureStationCode);

        // fetch data
        fetch(apiUrl)
        .then(function (response) {
            // convert response to text
            return response.text();
        })
        .then(function (response) {
            // convert xml string to a JSON object
            var jsonObject = JSON.parse(JSON.stringify(x2js.xml_str2json(response)));

            // clear table
            removeLiveSchedulesToControl();

            // add schedules            
            if (jsonObject.root.station.etd === undefined)
            {
                // hide table
                liveStationSchedule.hide();

                // show notification message
                liveScheduleNotification.show();
            }
            else
            {
                // show table
                liveStationSchedule.show();

                // hide notification message
                liveScheduleNotification.hide();

                for (var counter = 0; counter < jsonObject.root.station.etd.length; counter++) {
                    if (Array.isArray(jsonObject.root.station.etd[counter].estimate)) {
                        for (var counter2 = 0; counter2 < jsonObject.root.station.etd[counter].estimate.length; counter2++) {
                            appendLiveSchedulesToControl(liveStationScheduleTable, jsonObject.root.station.name, jsonObject.root.station.etd[counter].destination, jsonObject.root.station.etd[counter].estimate[counter2].minutes, jsonObject.root.station.etd[counter].estimate[counter2].color);
                        }
                    }
                    else {
                        appendLiveSchedulesToControl(liveStationScheduleTable, jsonObject.root.station.name, jsonObject.root.station.etd[counter].destination, jsonObject.root.station.etd[counter].estimate.minutes, jsonObject.root.station.etd[counter].estimate.color);
                    }
                }
            }
        })
        .catch(function (error) {
            return error;
        });
    };

    // function to determine if schedules have already been loaded
    var schedulesLoaded = function () {
        // return whether schedules have been loaded
        return stationScheduleTable.find('tr').length > 1 ? true : false;
    };

    // function to append options to a dropdown control
    var appendStaticSchedulesToControl = function (departureTime, arrivalStation, arrivalTime, departureDay) {
        // var row key
        var rowKey = stations.getDepartureStation() + ';' + arrivalStation + ';' + departureDay + ';' + departureTime + ';' + arrivalTime;

        // append row to table
        stationScheduleTable.append('<tr data-rowinfo="' + rowKey + '"><td>' + departureTime + '</td><td>' + stations.getStationNameFromCode(arrivalStation) + '</td><td>' + arrivalTime + '</td></tr>');
    };

    // function to clear out existing schedule entries
    var removeStaticSchedulesToControl = function (departureTime, arrivalStation, arrivalTime) {
        stationScheduleTable.empty();
    };

    // function to append options to a dropdown control
    var appendLiveSchedulesToControl = function (control, stationName, destination, minutes, routeLine) {
        control.append('<tr><td>' + destination + '</td><td>' + routeLine + '</td><td>' + minutes + (minutes === 'Leaving' ? '' : ' minutes') + '</td></tr>');
    };

    // function to clar out existing live schedule entries
    var removeLiveSchedulesToControl = function (departureTime, arrivalStation, arrivalTime) {
        liveStationScheduleTable.empty();
    };
    
    // expose public methods
    return {
        initPage: initPage,                
        getLiveScheduleForStation: getLiveScheduleForStation,
        schedulesLoaded: schedulesLoaded,
        appendStaticSchedulesToControl: appendStaticSchedulesToControl,
        removeStaticSchedulesToControl: removeStaticSchedulesToControl,
        removeLiveSchedulesToControl: removeLiveSchedulesToControl,
        hookEvents: hookEvents
    };
}();