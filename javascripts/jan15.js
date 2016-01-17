var viewModel = new AppViewModel();
var map;
var infowindow;
var restaurantsArray = [];
var markerArray = [];

/**
 * [AppViewModel description]
 */
function AppViewModel() {
    // console.log("AppViewModel");

    var self = this;

    self.displayList = ko.observableArray();
    self.keyword = ko.observable("");

    // update
    self.updateList = function(googlePlace) {
        // console.log('updateList');
        self.displayList.push(googlePlace);
        // console.log("length:" + self.displayList().length);
    }

    // filter
    self.enterSearch = function(data, event) {
        // console.log(data);
        // console.log(event);

        function filterList(element, index, array) {
            // console.log(element);
            if (element.google.name.toLowerCase().includes(self.keyword().toLowerCase())) {
                return true;
            } else {
                return false;
            }
        }

        var temp = restaurantsArray.filter(filterList);
        console.log(temp);
        var markerTemp = markerArray.filter(filterList);
        console.log(markerTemp);
        console.log(markerArray.length);

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
    // console.log("makeMap");

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
    // console.log('initMap');
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
    // console.log("callback");
    if (status === google.maps.places.PlacesServiceStatus.OK) {
        // first add google 
        for (var i = 0; i < results.length; i++) {
            // console.log(results[i]);
            createMarker(results[i], true);
            viewModel.updateList(results[i]);
            getDetailsFrom4SQ(results[i]);
        };

        // timeout to retrieve all data
        // setTimeout(markerInfoWindow, 500);
        markerInfoWindow();
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
        // console.log(markerArray);
    };
}

/**
 * [getDetailsFrom4SQ description]
 * @param  {[type]} place [description]
 * @return {[type]}       [description]
 */
function getDetailsFrom4SQ(place) {
    // console.log("getDetailsFrom4SQ");

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
    // console.log('buildLocDetailsObj');
    // console.log(place);
    // console.log(results.response);
    var restaurantsList = {};
    restaurantsList.google = place;
    restaurantsList.foursquare = results.response;

    restaurantsArray.push(restaurantsList);

    // console.log(restaurantsArray.length);
    // console.log(restaurantsArray);
}

function markerInfoWindow() {
    // console.log("markerInfoWindow");
    for (var i = 0; i < markerArray.length; i++) {
        let j = i;
        let tempMarker = markerArray[j].marker;
        let tempPlaceName = markerArray[j].google.name;

        google.maps.event.addListener(tempMarker, 'click', function() {
            infowindow.setContent(tempPlaceName);
            infowindow.open(map, tempMarker);
        });
    };
}

// initiate
makeMap();