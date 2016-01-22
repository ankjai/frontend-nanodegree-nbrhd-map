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

var map;
var infowindow;
var restaurantsArray = [];
var markerArray = [];

/**
 * entry point to draw google map
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
 * callback function
 * get executed when we get response from google map api
 * 
 * @param  {String} textStatus   response status
 * @param  {String} errorMessage error msg in case of fail response
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
 * PlacesService callback function
 * @param  {Object}   results textSearch results
 * @param  {String}   status  response status
 */
function callback(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
            // make async calls to
            // first create markers
            createMarker(results[i], true);
            // secondly update rest. list on left nav
            viewModel.updateList(results[i]);
            // parallely based on the response, make call
            // to foursquare (3rd party API) for more
            // info on restaurants
            getDetailsFrom4SQ(results[i]);
        }

        // timeout until all data models are updated
        // by api calls to 4sq
        setTimeout(markerInfoWindow, 1500);
    }
}

/**
 * create map marker objs
 * @param  {Object} googlePlace       place obj
 * @param  {Array} updateMarkerArray  array consisting of markerList obj
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
 * function to make calls to foursquare APIs
 * @param  {Object} place google place obj
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
 * build restaurantsList obj for restaurantsArray
 * @param  {String} textStatus      response status
 * @param  {String} responseMessage response msg
 * @param  {Object} place           google place obj
 * @param  {Object} results         response data from 4sq
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
 * create markerInfoWindow on markers
 */
function markerInfoWindow() {
    for (var x = 0; x < markerArray.length; x++) {
        // 'let' keyword to define variables inside this block
        // and avoid bugs caused bcoz of creation of anonymous func
        // inside a for loop
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

        // construct markerInfoWindow's content
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


        // add click listener on markers
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
 * func to addLiListener
 * @param {Object} marker  marker object
 * @param {String} locName location name
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
 * Knockout ViewModel
 */
function AppViewModel() {
    var self = this;

    self.displayList = ko.observableArray();
    self.keyword = ko.observable("");

    // update restaurants list on left nav
    self.updateList = function(googlePlace) {
        self.displayList.push(googlePlace);
    };

    // filter list based on user input
    self.enterSearch = function(data, event) {
        function filterList(element, index, array) {
            if (element.google.name.toLowerCase().includes(self.keyword().toLowerCase())) {
                return true;
            } else {
                return false;
            }
        }

        // temp arrays to store filtered list of restaurants
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
