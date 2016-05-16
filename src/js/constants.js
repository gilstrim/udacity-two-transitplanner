// constants functionality
constants = function () {

    // declare constants
    var BART_API_STATION_URL = 'https://api.bart.gov/api/stn.aspx?cmd=stns&key=MW9S-E7SL-26DU-VV8V';
    var BART_API_SCHEDULE_URL = 'https://api.bart.gov/api/sched.aspx?cmd=depart&orig=$departureStation&dest=$arrivalStation&date=$departureDate&time=$departureTime&key=MW9S-E7SL-26DU-VV8V&b=$numEntriesBefore&a=$numEntriesAfter&l=1';
    var BART_API_FULL_SCHEDULE_URL = 'https://api.bart.gov/api/sched.aspx?cmd=stnsched&orig=$departureStation&key=MW9S-E7SL-26DU-VV8V&l=1&date=$departureDate';
    var BART_API_LIVE_SCHEDULE_URL = 'https://api.bart.gov/api/etd.aspx?cmd=etd&orig=$departureStation&key=MW9S-E7SL-26DU-VV8V';
    var IDB_STATION_OBJECT_STORE = 'stations';
    var IDB_SCHEDULE_OBJECT_STORE = 'schedules';
    var IDB_NAME = 'transitDatabase';
    var IDB_VERSION_NUMBER = 1;
    var NUM_SCHEDULE_ENTRIES_BEFORE = 1;
    var NUM_SCHEDULE_ENTRIES_AFTER = 4;

    // expose constants
    return {
        BART_API_STATION_URL: BART_API_STATION_URL,
        IDB_STATION_OBJECT_STORE: IDB_STATION_OBJECT_STORE,
        IDB_SCHEDULE_OBJECT_STORE: IDB_SCHEDULE_OBJECT_STORE,
        IDB_NAME: IDB_NAME,
        IDB_VERSION_NUMBER: IDB_VERSION_NUMBER,
        BART_API_SCHEDULE_URL: BART_API_SCHEDULE_URL,
        BART_API_FULL_SCHEDULE_URL: BART_API_FULL_SCHEDULE_URL,
        BART_API_LIVE_SCHEDULE_URL: BART_API_LIVE_SCHEDULE_URL,
        NUM_SCHEDULE_ENTRIES_BEFORE: NUM_SCHEDULE_ENTRIES_BEFORE,
        NUM_SCHEDULE_ENTRIES_AFTER: NUM_SCHEDULE_ENTRIES_AFTER
    };

}();