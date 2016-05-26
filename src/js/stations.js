// station functionality
stations = function () {
    
    // declare variables            
    var departureStation = $('#cboDepartureStation');
    var arrivalStation = $('#cboArrivalStation');

    // initialise xml to json library
    var x2js = new X2JS();

    // function to initialise the page
    var initPage = function () {

        // retrieve a list of stations
        transitIdb.getStationsFromCache().then(function () {
            getStationsOnline();
        });
    };  

    // function to retrieve train stations
    var getStationsOnline = function () {
        // fetch data
        fetch(constants.BART_API_STATION_URL)
        .then(function (response) {
            // convert response to text
            return response.text();
        })
        .then(function (response) {
            // convert xml string to a JSON object
            var jsonObject = JSON.parse(JSON.stringify(x2js.xml_str2json(response)));
            
            // add stations
            if (!stationsLoaded())
            {
                // append stations to ui
                for (var counter = 0; counter < jsonObject.root.stations.station.length; counter++) {
                    appendStationsToControl(arrivalStation, jsonObject.root.stations.station[counter].abbr, jsonObject.root.stations.station[counter].name);
                    appendStationsToControl(departureStation, jsonObject.root.stations.station[counter].abbr, jsonObject.root.stations.station[counter].name);                
                }

                // add stations to idb
                transitIdb.addStationsToCache(jsonObject.root.stations.station);
            }
            else
            {
                // add stations to idb
                transitIdb.addStationsToCache(jsonObject.root.stations.station);
            }

            // process select
            $('select').material_select();
        })
        .catch(function (error) {
            console.log('Fetch error retrieving stations: ' + error);
        });
    };  

    // function to determine if stations have already been loaded
    var stationsLoaded = function () {
        // return whether stations have been loaded
        return departureStation.find('option').length > 1 ? true : false;
    };

    // function to append options to a dropdown control
    var appendStationsToControl = function (control, code, value) {
        control.append($('<option>', { value: code, text: value }));
    };

    // function to retrieve departure station
    var getDepartureStation = function () {
        return departureStation.val();
    };

    // function to retrieve arrival station
    var getArrivalStation = function () {
        return arrivalStation.val();
    };

    // function to retrieve station name from code
    var getStationNameFromCode = function (stationCode) {
        return arrivalStation.find('option[value="' + stationCode + '"]').text();
    };

    // expose public methods
    return {
        initPage: initPage,
        stationsLoaded: stationsLoaded,
        getDepartureStation: getDepartureStation,
        getArrivalStation: getArrivalStation,
        getStationNameFromCode: getStationNameFromCode,
        appendStationsToControl: appendStationsToControl,
        departureStation: departureStation,
        arrivalStation: arrivalStation
    };
}();