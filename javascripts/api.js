/**
 * [apiCall description]
 * @param  {[type]}   url      [description]
 * @param  {[type]}   method   [description]
 * @param  {[type]}   dataType [description]
 * @param  {[type]}   data     [description]
 * @param  {Function} callback [description]
 * @param  {[type]}   arg1     [description]
 * @return {[type]}            [description]
 */
function apiCall(url, method, dataType, data, callback, arg1) {
    $.ajax({
            url: url,
            type: method,
            dataType: dataType,
            data: data
        })
        .done(function(results, textStatus, jqXHR) {
            callback(textStatus, 'OK', arg1, results);
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

            callback(textStatus, msg, arg1);
        });
}
