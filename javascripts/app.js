var viewModel = new AppViewModel();

function AppViewModel() {
    console.log("AppViewModel");
    var self = this;

    self.map;
    self.infowindow;
    self.displayList = ko.observableArray();
    self.keyword = ko.observable("");
    // self.staticArray = new google.maps.places.PlaceResult();
    self.staticArray = [];
    self.markers = [];


    // call to google API
    self.apiCall = function() {
        console.log("apiCall");
        $.ajax({
                url: 'https://maps.googleapis.com/maps/api/js?key=AIzaSyCo449F-wVfaVbN7PG9dG1ygJW2UoJHba0&signed_in=false&libraries=places',
                type: 'GET',
                dataType: 'jsonp',
            })
            .done(function() {
                console.log("success");
                self.initMap();
            })
            .fail(function() {
                console.log("error");
            })
            .always(function() {
                console.log("complete");
            });
    }

    // initMap
    self.initMap = function() {
        var sfo = {
            lat: 37.773972,
            lng: -122.431297
        };

        self.map = new google.maps.Map(document.getElementById('map'), {
            center: sfo,
            zoom: 13
        });

        infowindow = new google.maps.InfoWindow();

        var service = new google.maps.places.PlacesService(self.map);
        service.nearbySearch({
            location: sfo,
            radius: 10000,
            types: ['food', 'restaurant']
        }, self.callback);
    }

    // callback
    self.callback = function(results, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            console.log("results length:" + results.length);
            for (var i = 0; i < results.length; i++) {
                self.staticArray[i] = results[i];
            };
            console.log("staticArray length:" + self.staticArray.length);
            for (var i = 0; i < self.staticArray.length; i++) {
                self.createMarker(self.staticArray[i]);
                self.displayList.push(self.staticArray[i]);
            };
        }
    }

    // create map marker
    self.createMarker = function(place) {
        // var placeLoc = place.geometry.location;
        var marker = new google.maps.Marker({
            map: self.map,
            position: place.geometry.location
        });

        // add it to markers array
        self.markers.push(marker);

        google.maps.event.addListener(marker, 'click', function() {
            self.infowindow.setContent(place.name);
            self.infowindow.open(self.map, self);
        });
    }

    // remove marker
    self.removeMarker = function() {
        for (var i = 0; i < self.markers.length; i++) {
            self.markers[i].setMap(null);
        };
    }

    // filter
    self.enterSearch = function(data, event) {
        function filterList(element, index, array) {
            if (element.name.toLowerCase().includes(self.keyword().toLowerCase())) {
                return true;
            } else {
                return false;
            }
        }

        var filteredList = self.staticArray.filter(filterList);
        console.log("filteredList: " + filteredList.length);
        console.log(filteredList);
        self.removeMarker();
    }
}

ko.applyBindings(viewModel);


// make call
viewModel.apiCall();

// display list and map markers
console.log("display");
// viewModel.firstDisplay();
