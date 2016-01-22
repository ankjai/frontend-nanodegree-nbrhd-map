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

var map;
var infowindow;
var restaurantsArray = [];
var markerArray = [];

/**
 * [makeMap description]
 * @return {[type]} [description]
 */
function makeMap() {
    var url = 'https://maps.googleapis.com/maps/api/js';
    var data = {
        key: 'AIzaSyCo449F-wVfaVbN7PG9dG1ygJW2UoJHba0',
        signed_in: false,
        libraries: 'places'
    };

    apiCall(url, 'GET', 'jsonp', data, initMap);
}

/**
 * [initMap description]
 * @return {[type]} [description]
 */
function initMap(textStatus, errorMessage) {
    if (textStatus === 'error') {
        $('#map').append('<p style="color:red;text-align:center">ERROR: ' + errorMessage + '</p>');
        return;
    }

    var sfo = {
        lat: 37.773972,
        lng: -122.431297
    };

    map = new google.maps.Map(document.getElementById('map'), {
        center: sfo,
        zoom: 13
    });

    infowindow = new google.maps.InfoWindow();

    var service = new google.maps.places.PlacesService(map);
    service.textSearch({
        location: sfo,
        radius: 10000,
        query: 'restaurants'
    }, callback);
}

/**
 * [callback description]
 * @param  {[type]}   results [description]
 * @param  {[type]}   status  [description]
 * @return {Function}         [description]
 */
function callback(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
        // first add google 
        for (var i = 0; i < results.length; i++) {
            createMarker(results[i], true);
            viewModel.updateList(results[i]);
            getDetailsFrom4SQ(results[i]);
        }

        // timeout to retrieve all data
        setTimeout(markerInfoWindow, 1500);
    }
}

/**
 * [createMarker description]
 * @param  {[type]} googlePlace       [description]
 * @param  {[type]} updateMarkerArray [description]
 * @return {[type]}                   [description]
 */
function createMarker(googlePlace, updateMarkerArray) {
    var marker = new google.maps.Marker({
        map: map,
        animation: google.maps.Animation.DROP,
        position: googlePlace.geometry.location
    });

    if (updateMarkerArray) {
        var markerList = {};
        markerList.google = googlePlace;
        markerList.marker = marker;
        markerArray.push(markerList);
    }
}

/**
 * [getDetailsFrom4SQ description]
 * @param  {[type]} place [description]
 * @return {[type]}       [description]
 */
function getDetailsFrom4SQ(place) {
    var url = 'https://api.foursquare.com/v2/venues/search';
    var data = {
        client_id: 'ZYRAEHGI0G5Z2A3ESQXA0SFT24GW0X00H3MQHZMCWCEHRGO4',
        client_secret: 'UTU0XYNCVNFPN1WORMZCNDNLTR4WCWGEETYVBHQS0K3CRYAG',
        v: '20160115',
        limit: 1,
        ll: place.geometry.location.lat() + ',' + place.geometry.location.lng(),
        query: place.name
    };

    apiCall(url, 'GET', 'json', data, buildLocDetailsObj, place);
}

/**
 * [buildLocDetailsObj description]
 * @param  {[type]} place   [description]
 * @param  {[type]} results [description]
 * @return {[type]}         [description]
 */
function buildLocDetailsObj(textStatus, responseMessage, place, results) {
    var restaurantsList = {};

    restaurantsList.textStatus = textStatus;
    restaurantsList.responseMessage = responseMessage;
    restaurantsList.google = place;

    if (textStatus === 'success') {
        restaurantsList.foursquare = results.response;
    }

    restaurantsArray.push(restaurantsList);
}

/**
 * [markerInfoWindow description]
 * @return {[type]} [description]
 */
function markerInfoWindow() {
    for (var x = 0; x < markerArray.length; x++) {
        let j = x;
        let textStatusObj;
        let responseMessageObj;
        let foursquareObj;
        let googleObj;
        let markerObj;
        let contentString;

        for (var k = 0; k < restaurantsArray.length; k++) {
            textStatusObj = restaurantsArray[k].textStatus;
            responseMessageObj = restaurantsArray[k].responseMessage;

            if (restaurantsArray[k].google.name === markerArray[j].google.name) {
                if (textStatusObj === 'success') {
                    foursquareObj = restaurantsArray[k].foursquare;
                }
                googleObj = restaurantsArray[k].google;
                markerObj = markerArray[j].marker;
                break;
            }
        }

        if (textStatusObj === 'success') {
            contentString = '<div id="infowindow">' +
                '<div id="infoUpper"><div id="infoUpperLeft"><img id="icon" src="' + googleObj.icon + '" alt="icon"></div>' +
                '<div id="infoUpperRight"><h3>' + foursquareObj.venues[0].name + '</h3><div id="venueDetails01"><div id="venueScore"><div>' + googleObj.rating + '</div></div><div id="venueAddrCusine"><h5>' + googleObj.formatted_address + '</h5><h6>' + foursquareObj.venues[0].categories[0].name + '</h6></div></div></div></div>' +
                '<hr>' +
                '<div id="infoLower"><div id="infoLowerLeft"><a href="tel:' + foursquareObj.venues[0].contact.phone + '">' + foursquareObj.venues[0].contact.formattedPhone + '</a></div>' +
                '<div id="infoLowerRight"><a href="' + foursquareObj.venues[0].menu.url + '">View Menu</a></div></div>' +
                '</div>';
        } else if (textStatusObj === 'error') {
            contentString = '<div id="infowindow"><p style="color:red;text-align:center">ERROR: ' + responseMessageObj + '</p></div>';
        }


        google.maps.event.addListener(markerObj, 'click', function() {
            markerObj.setAnimation(google.maps.Animation.BOUNCE);
            infowindow.setContent(contentString);
            infowindow.open(map, markerObj);

            setTimeout(function() {
                markerObj.setAnimation(null);
            }, 1400);
        });

        // trigger marker click event on 'li' click event
        addLiListener(markerObj, googleObj.name);
    }
}

/**
 * [addLiListener description]
 * @param {[type]} marker  [description]
 * @param {[type]} locName [description]
 */
function addLiListener(marker, locName) {
    google.maps.event.addDomListener($('li:contains(' + locName + ')').get(0), 'click', function() {
        google.maps.event.trigger(marker, 'click');
    });
}

// initiate
makeMap();

var viewModel = new AppViewModel();

/**
 * [AppViewModel description]
 */
function AppViewModel() {
    var self = this;

    self.displayList = ko.observableArray();
    self.keyword = ko.observable("");

    // update
    self.updateList = function(googlePlace) {
        self.displayList.push(googlePlace);
    };

    // filter
    self.enterSearch = function(data, event) {
        function filterList(element, index, array) {
            if (element.google.name.toLowerCase().includes(self.keyword().toLowerCase())) {
                return true;
            } else {
                return false;
            }
        }

        var restaurantsArrayTemp = restaurantsArray.filter(filterList);
        var markerArrayTemp = markerArray.filter(filterList);

        try {
            // unset all markers on map
            for (var i = 0; i < markerArray.length; i++) {
                markerArray[i].marker.setMap(null);
            }

            // empty list on left nav
            // before filling w/ new filtered values
            if (self.displayList().length > 0) {
                self.displayList.removeAll();
            }
        } catch (err) {
            console.error(err);
        } finally {
            // iterate over markerArrayTemp and locate correct googleObj
            for (var j = 0; j < markerArrayTemp.length; j++) {
                var googleObj;
                var markerObj;
                for (var k = 0; k < restaurantsArrayTemp.length; k++) {
                    if (restaurantsArrayTemp[k].google.name === markerArrayTemp[j].google.name) {
                        googleObj = restaurantsArrayTemp[k].google;
                        markerObj = markerArrayTemp[j].marker;
                        break;
                    }
                }
                // update filtered list
                self.displayList.push(googleObj);
                // set filtered marker
                markerObj.setMap(map);
                // trigger marker click event on 'li' click event
                addLiListener(markerObj, googleObj.name);
            }
        }
    };
}

// Activate KO
ko.applyBindings(viewModel);
