## Project 5-1: Neighborhood Map Project


#### Project Overview

Develop a single page application featuring a map of your neighborhood or a neighborhood you would like to visit. You will then add additional functionality to this map including highlighted locations, third-party data about those locations and various ways to browse the content.


#### How to Run the App

###### Grunt
If you already have node.js/npm and grunt-cli installed, then you can resolve project dependencies by running
```
npm install
```
from inside the app directory (i.e. where package.json is located) will install the dependencies for this app. These will be placed in ./node_modules relative to package.json file (it's slightly more complex than this, so check the npm docs [here](https://docs.npmjs.com/files/folders#more-information)).

To run the build process, just do
```
grunt
```

and now by running
```
grunt connect
```
should start web server at **http://localhost:8080**

![](https://cloud.githubusercontent.com/assets/6732675/12528766/b3f1a4de-c156-11e5-8c99-119c2b0d549f.png)

###### Locally w/o Web Server
From browser, open `dist/index.html`. 

Either of this technique should open **Neighborhood Map** app in your browser.
![](https://cloud.githubusercontent.com/assets/6732675/12528805/1024f9bc-c158-11e5-9d28-bf3a620bd47f.png)



#### Features

###### Search Bar
Filters both the locations in the list and the markers on the map.
![](https://cloud.githubusercontent.com/assets/6732675/12529321/1756319c-c167-11e5-9094-e79b71a723c9.gif)

###### List View
Shows locations that have been searched for, additionally clicking on location activates its associated map marker.
![](https://cloud.githubusercontent.com/assets/6732675/12529356/00bdc2aa-c168-11e5-8bc7-2bca479861e6.gif)

###### Map
Shows each searched locations as markers, each marker can be clicked and shows unique information about a location in infowindow. Marker shows bouncing animation when clicked.
![](https://cloud.githubusercontent.com/assets/6732675/12529392/d690d200-c168-11e5-8ddc-db3b3c958ffc.gif)



#### Responsive Layout

###### Phone
Features are responsive on mobile platform.

![](https://cloud.githubusercontent.com/assets/6732675/12705092/e40c2d96-c81e-11e5-89f9-fe99e91f4fce.gif)
