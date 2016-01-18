var viewModel = new AppViewModel();
var map;
var infowindow;
var restaurantsArray = [];
var markerArray = [];

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
    }

    // filter
    self.enterSearch = function(data, event) {
        function filterList(element, index, array) {
            if (element.google.name.toLowerCase().includes(self.keyword().toLowerCase())) {
                return true;
            } else {
                return false;
            }
        }

        var temp = restaurantsArray.filter(filterList);
        var markerTemp = markerArray.filter(filterList);

        try {
            // unset all markers on map
            for (var i = 0; i < markerArray.length; i++) {
                markerArray[i].marker.setMap(null);
            };

            // empty list on left nav
            // before filling w/ new filtered values
            if (self.displayList().length > 0) {
                self.displayList.removeAll();
            };
        } catch (err) {
            console.error(err);
        } finally {
            // update list w/ filtered values
            for (var i = 0; i < temp.length; i++) {
                // createMarker(markerTemp[i].google, false);
                markerTemp[i].marker.setMap(map);
                self.displayList.push(temp[i].google);
            };
        }
    }
}

// Activate KO
ko.applyBindings(viewModel);

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

    apiCall(url, 'GET', 'jsonp', data, function() {
        initMap();
    });
}

/**
 * [initMap description]
 * @return {[type]} [description]
 */
function initMap() {
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
        };

        // timeout to retrieve all data
        setTimeout(markerInfoWindow, 1000);
        // markerInfoWindow();
    }
}

function createMarker(googlePlace, updateMarkerArray) {
    var marker = new google.maps.Marker({
        map: map,
        position: googlePlace.geometry.location
    });

    if (updateMarkerArray) {
        var markerList = {};
        markerList.google = googlePlace;
        markerList.marker = marker;
        markerArray.push(markerList);
    };
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
function buildLocDetailsObj(place, results) {
    var restaurantsList = {};
    restaurantsList.google = place;
    restaurantsList.foursquare = results.response;
    restaurantsArray.push(restaurantsList);
}

function markerInfoWindow() {
    console.log(restaurantsArray);
    for (var i = 0; i < markerArray.length; i++) {
        let j = i;

        // find this google loc's 4sq obj
        let foursquareObj;
        for (var k = 0; k < restaurantsArray.length; k++) {
            if (restaurantsArray[k].google.name === markerArray[j].google.name) {
                foursquareObj = restaurantsArray[k].foursquare;
                break;
            };
        };

        let contentString = '<div id="infowindow">' +
            '<div id="infoUpper"><div id="infoUpperLeft"><img id="icon" src="' + restaurantsArray[j].google.icon + '" alt="icon"></div>' +
            '<div id="infoUpperRight"><h3>' + foursquareObj.venues[0].name + '</h3><div id="venueDetails01"><div id="venueScore"><div>' + restaurantsArray[j].google.rating + '</div></div><div id="venueAddrCusine"><h5>' + restaurantsArray[j].google.formatted_address + '</h5><h6>' + foursquareObj.venues[0].categories[0].name + '</h6></div></div></div></div>' +
            '<hr>' +
            '<div id="infoLower"><div id="infoLowerLeft"><a href="tel:' + foursquareObj.venues[0].contact.phone + '">' + foursquareObj.venues[0].contact.formattedPhone + '</a></div>' +
            '<div id="infoLowerRight"><a href="' + foursquareObj.venues[0].menu.url + '">View Menu</a></div></div>' +
            '</div>';
        let tempMarker = markerArray[j].marker;
        // let tempPlaceName = markerArray[j].google.name;

        google.maps.event.addListener(tempMarker, 'click', function() {
            infowindow.setContent(contentString);
            infowindow.open(map, tempMarker);
        });
    };
}

// initiate
makeMap();
