var map;
var infowindow;

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
        types: ['restaurant']
    }, callback);
}

function callback(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
            createMarker(results[i]);
        }
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