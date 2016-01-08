var map;
var infowindow;
var staticResultSet = [];
var displayList = ko.observableArray();

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
    service.nearbySearch({
        location: sfo,
        radius: 10000,
        types: ['food', 'restaurant']
    }, callback);
}

function callback(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
            // push result in both static and dynamic list
            staticResultSet[i] = results[i];
            displayList.push(results[i]);
            createMarker(results[i]);
        }
        display();
    }
}

function createMarker(place) {
    var placeLoc = place.geometry.location;
    var marker = new google.maps.Marker({
        map: map,
        position: place.geometry.location
    });

    google.maps.event.addListener(marker, 'click', function() {
        infowindow.setContent(place.name);
        infowindow.open(map, this);
    });
}

function AppViewModel() {
    var self = this;
    self.keyword = ko.observable("");
    self.enterSearch = function(data, event) {
        console.log(data);
        console.log(event);
        console.log(self.keyword());
    }
}

ko.applyBindings(new AppViewModel());


/* *********TEMP CODE********* */
function display() {
    // body...
    console.log("staticResultSet length:" + staticResultSet.length);
    console.log("displayList length:" + displayList().length);
}
