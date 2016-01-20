var viewModel = new AppViewModel();

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

        var restaurantsArrayTemp = restaurantsArray.filter(filterList);
        var markerArrayTemp = markerArray.filter(filterList);

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
            // iterate over markerArrayTemp and locate correct googleObj
            for (var i = 0; i < markerArrayTemp.length; i++) {
                var googleObj;
                var markerObj;
                for (var k = 0; k < restaurantsArrayTemp.length; k++) {
                    if (restaurantsArrayTemp[k].google.name === markerArrayTemp[i].google.name) {
                        googleObj = restaurantsArrayTemp[k].google;
                        markerObj = markerArrayTemp[i].marker;
                        break;
                    };
                };
                // update filtered list
                self.displayList.push(googleObj);
                // set filtered marker
                markerObj.setMap(map);
                // trigger marker click event on 'li' click event
                addLiListener(markerObj, googleObj.name);
            };
        }
    }
}

// Activate KO
ko.applyBindings(viewModel);
