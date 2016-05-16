// initialise variables
var applicableDateTime = '';
var desktopStartDateTime = $("#txtDesktopStartDateTime");
var mobileStartDateTime = $("#txtMobileStartDateTime");
var processRouteButton = $("#btnProcessRoute");
var scheduleCard = $("#scheduleCard");
var liveDeparturesCard = $("#liveDeparturesCard");
var notificationsCard = $("#notificationsCard");
var indexLiveScheduleNotification = $('#liveScheduleNotification');
var formInputs = $('input');
var routeCollection = $("#routeCollection");
var routeModal = $('#routeModal');

// process logic on load
$(document).ready(function () {    
    // process date logic
    processDates();

    // create idb objects
    transitIdb.initPage();

    // retrieve stations
    stations.initPage();

    // register service worker
    registerServiceWorker();

    // hide fields
    hideShowFields(true);

    // hook events
    hookEvents();

    // validate form on load
    formValidation.initPage('#routeForm');
});

// function to hookEvents
var hookEvents = function () {

    // process route logic
    processRouteButton.on('click', function () {                
        // check validity of form
        var isFormValid = formValidation.initPage('#routeForm');
        var isStationsValid = formValidation.validateStations();

        // process functionality if valid
        if (isFormValid && isStationsValid)
        {
            // re-process date logic
            reProcessDates();

            // initialise variables
            var departureStation = stations.getDepartureStation();
            var arrivalStation = stations.getArrivalStation();
            var departureDate = applicableDateTime;

            // retrieve schedule
            schedules.initPage();

            // retrieve live schedule
            schedules.getLiveScheduleForStation(departureStation);

            // show fields
            hideShowFields(false);
        }
    });

    // input validation on change
    formInputs.on('change', function () { formValidation.initPage('#routeForm'); });
};

// function to process date fields
var processDates = function () {
    // configure material date time picker for start date time
    mobileStartDateTime.bootstrapMaterialDatePicker
    ({
        format: 'YYYY-MM-DD[T]HH:mm',
        minDate: new Date()
    });

    // default dates to today
    mobileStartDateTime.val(moment().format('YYYY-MM-DD[T]HH:mm'));
    desktopStartDateTime.val(moment().format('YYYY-MM-DD[T]HH:mm'));
    
    // hide / show dates based on screen size
    var mediaQuery = window.matchMedia("only screen and (min-width: 993px)");
    mediaQuery.addListener(hideShowDates);
    hideShowDates(mediaQuery);
};

// function to hide or show date fields
var hideShowDates = function (mediaQuery) {
    // if media query is met
    if (mediaQuery.matches) {
        // show desktop date field        
        desktopStartDateTime.parent().show();

        // hide mobile date field
        mobileStartDateTime.parent().hide();

        // set is mobile flag
        applicableDateTime = desktopStartDateTime.val();
    }
    else {
        // hide desktop date field
        desktopStartDateTime.parent().hide();

        // show mobile date field
        mobileStartDateTime.parent().show();

        // set is mobile flag
        applicableDateTime = mobileStartDateTime.val();
    }
};

// function to reprocess date selection logic
var reProcessDates = function () {
    // hide / show dates based on screen size
    var mediaQuery = window.matchMedia("only screen and (min-width: 993px)");
    mediaQuery.addListener(hideShowDates);
    hideShowDates(mediaQuery);
};

// function to register the service worker
var registerServiceWorker = function () {
    // verify if service worker is supported
    if (navigator.serviceWorker) {
        // register the service worker
        navigator.serviceWorker.register('sw.js').then(function (registration) {

            // if in waiting state, refresh immediately
            if (registration.waiting) {
                navigator.serviceWorker.controller.postMessage({ action: 'skipWaiting' });
                return;
            }

            // log success message
            console.log('Service worker was successfully registered');
        }).catch(function (error) {
            // log error message
            console.log('Service worker registration failed: ', error);
        });
    }
};

// function to hide or show fields
var hideShowFields = function (hideFields) {
    if (hideFields) {
        // hide schedule card
        scheduleCard.hide();

        // hide live departures card
        liveDeparturesCard.hide();

        // hide notications card
        notificationsCard.hide();
    }
    else {
        // hide schedule card
        scheduleCard.addClass('animated fadeIn').show();

        // hide live departures card
        liveDeparturesCard.addClass('animated fadeIn').show();

        // hide notications card
        notificationsCard.addClass('animated fadeIn').show();
    }

    // hide table
    indexLiveScheduleNotification.hide();
};

// function to add route information
var addRouteInformation = function(routeLegs) {
    // initialise variables
    var counter = 0;

    // clear previous entries
    routeCollection.empty();

    // loop through each leg of the route
    if (routeLegs.length === undefined) {
        // increment counter
        counter++;

        // form html
        var html = '<li class="collection-item avatar"><i class="material-icons circle">stars</i><span class="title">LEG ' + counter.toString() + '</span><p><b>From:</b> ' + stations.getStationNameFromCode(routeLegs._origin) + '<br><b>Departure:</b> ' + routeLegs._origTimeMin + ' <br><b>To:</b> ' + stations.getStationNameFromCode(routeLegs._destination) + ' <br><b>Departure:</b> ' + routeLegs._destTimeMin + ' <br><b>Line</b>: ' + routeLegs._line + ' <br></p></li>';

        // append html
        routeCollection.append(html);
    }
    else { 
        routeLegs.map(function (routeLeg) {
            // increment counter
            counter++;

            // form html
            var html = '<li class="collection-item avatar"><i class="material-icons circle">stars</i><span class="title">LEG ' + counter.toString() + '</span><p><b>From:</b> ' + stations.getStationNameFromCode(routeLeg._origin) + '<br><b>Departure:</b> ' + routeLeg._origTimeMin + ' <br><b>To:</b> ' + stations.getStationNameFromCode(routeLeg._destination) + ' <br><b>Departure:</b> ' + routeLeg._destTimeMin + ' <br><b>Line</b>: ' + routeLeg._line + ' <br></p></li>';

            // append html
            routeCollection.append(html);
        });
    }

    //show modal window
    routeModal.openModal();
};