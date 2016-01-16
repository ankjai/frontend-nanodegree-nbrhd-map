var viewModel = new AppViewModel();
var map;
var infowindow;
var restaurantsArray = [];

/**
 * [AppViewModel description]
 */
function AppViewModel() {
    console.log("AppViewModel");

    var self = this;

    self.displayList = ko.observableArray();
    self.keyword = ko.observable("");

    // update
    self.updateList = function() {
        console.log('updateList');
        for (var i = 0; i < restaurantsArray.length; i++) {
            self.displayList.push(restaurantsArray[i].google);
        };
        console.log("length:" + self.displayList().length);
    }
}

// Activate KO
ko.applyBindings(viewModel);

/**
 * [makeMap description]
 * @return {[type]} [description]
 */
function makeMap() {
    console.log("makeMap");

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
    console.log('initMap');
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
    console.log("callback");
    if (status === google.maps.places.PlacesServiceStatus.OK) {
        // make 4square calls
        for (var i = 0; i < results.length; i++) {
            console.log(results[i]);
            getDetailsFrom4SQ(results[i]);
        };

        // create market
        // update list async
        viewModel.updateList();
    }
}

/**
 * [getDetailsFrom4SQ description]
 * @param  {[type]} place [description]
 * @return {[type]}       [description]
 */
function getDetailsFrom4SQ(place) {
    console.log("getDetailsFrom4SQ");

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
    console.log('buildLocDetailsObj');
    console.log(place);
    console.log(results.response);
    var restaurantsList = {};
    restaurantsList.google = place;
    restaurantsList.foursquare = results.response;

    restaurantsArray.push(restaurantsList);

    console.log(restaurantsArray.length);
    console.log(restaurantsArray);
}

// initiate
makeMap();
