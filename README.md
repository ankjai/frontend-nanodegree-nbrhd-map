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

Now by running
```
grunt connect
```
should start web server at **http://localhost:8080**

###### Locally w/o Web Server
From browser, open `dist/index.html`. 

Either of this technique should open **Neighborhood Map** app in your browser.
