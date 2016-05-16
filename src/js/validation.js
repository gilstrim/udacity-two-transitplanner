// form validations
formValidation = function () {

    // function to initialise the page
    var initPage = function (formId, validatePasswordField) {

        // initialise variables
        var hasValidCompletedFields = true;        
        var isFieldValid = true;

        // validate required fields
        $(formId + ' input[required],' + formId + ' select[required],' + formId + ' textarea[required]').each(function () {
            var isFieldValid = $(this)[0].checkValidity() && ($(this).val() !== '' || (this.nodeName === 'SELECT' && $('#' + $(this).attr('id') + ' option:selected').val() !== ''));

            if (!isFieldValid) {
                if (this.nodeName === 'SELECT') {
                    $(this).parent().addClass('invalid');
                    $('label[for="' + $(this).attr('id') + '"]').attr('data-error', 'This is a required field.');
                }
                else {
                    $(this).addClass('invalid');
                    $('label[for="' + $(this).attr('id') + '"]').attr('data-error', 'This is a required field.');
                }

                hasValidCompletedFields = false;
            }
            else {
                if (this.nodeName === 'SELECT') {
                    $(this).parent().addClass('valid');
                    $(this).parent().removeClass('invalid');
                    $('label[for="' + $(this).attr('id') + '"]').attr('data-success', 'This is a valid selection.');
                }
                else {
                    $(this).addClass('valid');
                    $(this).parent().removeClass('invalid');
                    $('label[for="' + $(this).attr('id') + '"]').attr('data-success', 'This is a valid selection.');
                }
            }
        });

        // return result
        return hasValidCompletedFields;
    };

    // function to validate departure and arrival stations
    var validateStations = function () {
        // initialise variables
        var departureStation = $('#cboDepartureStation');
        var arrivalStation = $('#cboArrivalStation');
        
        // validate that same values aren't selected
        if (departureStation.val() === arrivalStation.val() && departureStation.val() !== '' && arrivalStation.val() !== '' && departureStation.val() !== null && arrivalStation.val() !== null)
        {
            // flag as invalid
            departureStation.parent().addClass('invalid');
            arrivalStation.parent().addClass('invalid');

            // remove valid flags
            departureStation.parent().removeClass('valid');
            arrivalStation.parent().removeClass('valid');

            // show error message
            $('label[for="' + departureStation.attr('id') + '"]').attr('data-error', 'Please ensure that different departure and arrival stations have been selected.');
            $('label[for="' + arrivalStation.attr('id') + '"]').attr('data-error', 'Please ensure that different departure and arrival stations have been selected.');

            // return invalid
            return false;
        }
        else if (departureStation.val() !== arrivalStation.val() && departureStation.val() !== '' && arrivalStation.val() !== '' && departureStation.val() !== null && arrivalStation.val() !== null)
        {
            // flag as valid
            departureStation.parent().addClass('valid');
            arrivalStation.parent().addClass('valid');

            // remove invalid flags
            departureStation.parent().removeClass('invalid');
            arrivalStation.parent().removeClass('invalid');

            // show error message
            $('label[for="' + departureStation.attr('id') + '"]').attr('data-success', 'This is a valid selection.');
            $('label[for="' + arrivalStation.attr('id') + '"]').attr('data-success', 'This is a valid selection.');

            // return valid
            return true;
        }
        
    };

    // expose public methods
    return { initPage: initPage, validateStations: validateStations };
}();