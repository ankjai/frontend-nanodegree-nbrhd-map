var map;
var infowindow;
var viewModel = new AppViewModel();

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
        viewModel.updateList(results);
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

function AppViewModel() {
    var self = this;
    var staticResultSet = [];
    self.displayList = ko.observableArray();
    self.keyword = ko.observable("");

    self.updateList = function(list) {
        staticResultSet = Array.from(list);
        for (var i = 0; i < list.length; i++) {
            self.displayList.push(list[i]);
        };
    }

    self.enterSearch = function(data, event) {
        function filterList(element, index, array) {
            if (element.name.toLowerCase().includes(self.keyword().toLowerCase())) {
                return true;
            } else {
                return false;
            }
        }

        var filteredList = staticResultSet.filter(filterList);
        self.displayList.removeAll();
        for (var i = 0; i < filteredList.length; i++) {
            self.displayList.push(filteredList[i]);
        };
    }
}

ko.applyBindings(viewModel);
