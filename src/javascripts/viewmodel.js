var viewModel = new AppViewModel();

/**
 * Knockout ViewModel
 */
function AppViewModel() {
    var self = this;

    self.displayList = ko.observableArray();
    self.keyword = ko.observable("");

    // update restaurants list on left nav
    self.updateList = function(googlePlace) {
        self.displayList.push(googlePlace);
    };

    // filter list based on user input
    self.enterSearch = function(data, event) {
        function filterList(element, index, array) {
            if (element.google.name.toLowerCase().includes(self.keyword().toLowerCase())) {
                return true;
            } else {
                return false;
            }
        }

        // temp arrays to store filtered list of restaurants
        var restaurantsArrayTemp = restaurantsArray.filter(filterList);
        var markerArrayTemp = markerArray.filter(filterList);

        try {
            // unset all markers on map
            for (var i = 0; i < markerArray.length; i++) {
                markerArray[i].marker.setMap(null);
            }

            // empty list on left nav
            // before filling w/ new filtered values
            if (self.displayList().length > 0) {
                self.displayList.removeAll();
            }
        } catch (err) {
            console.error(err);
        } finally {
            // iterate over markerArrayTemp and locate correct googleObj
            for (var j = 0; j < markerArrayTemp.length; j++) {
                var googleObj;
                var markerObj;
                for (var k = 0; k < restaurantsArrayTemp.length; k++) {
                    if (restaurantsArrayTemp[k].google.name === markerArrayTemp[j].google.name) {
                        googleObj = restaurantsArrayTemp[k].google;
                        markerObj = markerArrayTemp[j].marker;
                        break;
                    }
                }
                // update filtered list
                self.displayList.push(googleObj);
                // set filtered marker
                markerObj.setMap(map);
                // trigger marker click event on 'li' click event
                addLiListener(markerObj, googleObj.name);
            }
        }
    };
}

// Activate KO
ko.applyBindings(viewModel);
