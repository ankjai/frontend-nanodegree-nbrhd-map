var viewModel = new AppViewModel();

function AppViewModel() {
    console.log("AppViewModel");
    var self = this;

    self.map;
    self.infowindow;
    self.staticArray = [];
    self.markers = [];
    self.displayList = ko.observableArray();
    self.keyword = ko.observable("");


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

        self.infowindow = new google.maps.InfoWindow();

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
            // store results in staticArray
            self.staticArray = results.slice();

            // populate list and markers on initial page load
            for (var i = 0; i < self.staticArray.length; i++) {
                self.createMarker(self.staticArray[i]);
                self.displayList.push(self.staticArray[i]);
            };
        }
    }

    // create map marker
    self.createMarker = function(place) {
        var marker = new google.maps.Marker({
            map: self.map,
            position: place.geometry.location
        });

        // on initial page load
        // store every marker in markers array
        self.markers.push(marker);

        // add click listener on every marker
        // which displays infowindow
        google.maps.event.addListener(marker, 'click', function() {
            self.infowindow.setContent(place.name);
            self.infowindow.open(self.map, this);
        });
    }

    // remove marker
    self.setMarker = function() {
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

        // create an array of filtered objects
        var temp = self.staticArray.filter(filterList);

        try {
            // unset all markers on map
            self.setMarker();

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
                self.createMarker(temp[i]);
                self.displayList.push(temp[i]);
            };
        }

    }
}

ko.applyBindings(viewModel);


// make call
viewModel.apiCall();
