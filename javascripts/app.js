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
                url: 'https://maps.googleapis.com/maps/api/js',
                type: 'GET',
                dataType: 'jsonp',
                data: {
                    key: 'AIzaSyCo449F-wVfaVbN7PG9dG1ygJW2UoJHba0',
                    signed_in: false,
                    libraries: 'places'
                }
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
        service.textSearch({
            location: sfo,
            radius: 10000,
            query: 'restaurants'
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
                self.getPlaceDetails(self.staticArray[i]);
            };
        }
    }

    // create map marker
    self.createMarker = function(place) {
        // console.log(place);
        // console.log(place.name);
        // console.log(place.formatted_address);
        // console.log(place.photos[0].getUrl());
        // console.log(place.geometry.location.lat());
        // console.log(place.geometry.location.lng());

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

    // 4square
    self.getPlaceDetails = function(place) {
        $.ajax({
                url: 'https://api.foursquare.com/v2/venues/search',
                type: 'GET',
                dataType: 'json',
                data: {
                    client_id: 'ZYRAEHGI0G5Z2A3ESQXA0SFT24GW0X00H3MQHZMCWCEHRGO4',
                    client_secret: 'UTU0XYNCVNFPN1WORMZCNDNLTR4WCWGEETYVBHQS0K3CRYAG',
                    v: '20160115',
                    limit: 1,
                    ll: place.geometry.location.lat() + ',' + place.geometry.location.lng(),
                    query: place.name
                },
            })
            .done(function(data) {
                console.log("success");
                // console.log(data);
                // console.log("Name:" + data.response.venues[0].name);
                // console.log("Ph No:" + data.response.venues[0].contact.formattedPhone);
                // console.log("twitter:" + data.response.venues[0].contact.twitter);
                // console.log("Addr:" + data.response.venues[0].location.formattedAddress);
                // console.log("URL:" + data.response.venues[0].url);
                // console.log("Cusine:" + data.response.venues[0].categories[0].name);
                // console.log("Menu:" + data.response.venues[0].menu.url);
            })
            .fail(function() {
                console.log("error");
            })
            .always(function() {
                console.log("complete");
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
