# Senior Web Developer Nanodegree - Project 2 - Transit Planner

This is the second project for the Udacity Nanodegree: a transit planner. 

# Technical Dependencies

- Material design (built on the framework from http://www.materializecss.com)
- jQuery 2.1.1
- Bootstrap material date-time picker (https://github.com/T00rk/bootstrap-material-datetimepicker)
- IndexedDB promise library (https://github.com/jakearchibald/indexeddb-promised)
- XML to JSON library (https://github.com/abdmob/x2js)
- BART (Bay Area Rapid Transit) API (http://api.bart.gov/docs/overview/index.aspx)
- Animate.css library (https://daneden.github.io/animate.css/)

# Build Steps

In order to run the application, clone or download the repo:
```
npm install
```
This will download all the relevant node package dependencies. To build in a releasable state, execute:
```
grunt release
```
The application can then be run by directing your browser to:
```
http://localhost:<PortNumber>/dist/index.html
```