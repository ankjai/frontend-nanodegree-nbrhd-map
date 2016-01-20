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
        .done(function(results) {
            console.log("success");

            // execute callback
            callback(arg1, results);
        })
        .fail(function() {
            console.log("error");
        })
        .always(function() {
            console.log("complete");
        });
}
