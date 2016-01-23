/**
 * Function to make async jQuery.ajax() call to url
 * @param  {String}   url      base url
 * @param  {String}   method   http method
 * @param  {String}   dataType response data type
 * @param  {Object}   data     request data
 * @param  {Function} callback callback function
 * @param  {Object}   placeObj google place obj
 * @return {Object}            response data, status, error msg
 */
function apiCall(url, method, dataType, data, callback, placeObj) {
    $.ajax({
            url: url,
            type: method,
            dataType: dataType,
            data: data
        })
        .done(function(results, textStatus, jqXHR) {
            callback(textStatus, 'OK', placeObj, results);
        })
        .fail(function(jqXHR, textStatus, errorThrown) {
            // Error logic here
            var msg = '';
            if (jqXHR.status === 0) {
                msg = 'Not connect.\n Verify Network.';
            } else if (jqXHR.status == 404) {
                msg = 'Requested page not found. [404]';
            } else if (jqXHR.status == 500) {
                msg = 'Internal Server Error [500].';
            } else if (exception === 'parsererror') {
                msg = 'Requested JSON parse failed.';
            } else if (exception === 'timeout') {
                msg = 'Time out error.';
            } else if (exception === 'abort') {
                msg = 'Ajax request aborted.';
            } else {
                msg = 'Uncaught Error.\n' + jqXHR.responseText;
            }

            callback(textStatus, msg, placeObj);
        });
}
