/**
 * [call description]
 * @return {[type]} [description]
 */
function apiCall(url, method, dataType, data, callback, arg1) {
    console.log("call");

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
