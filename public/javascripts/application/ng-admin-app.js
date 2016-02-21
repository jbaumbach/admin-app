"use strict";

angular.module('adminApp', ['ngRoute', 'ui.bootstrap', 'ngFileUpload', 'uiGmapgoogle-maps', 'ngSanitize', 'ngCsv', 'angularUtils.directives.dirPagination']).
  config(['$routeProvider', '$locationProvider', 'uiGmapGoogleMapApiProvider',
  function($routeProvider, $locationProvider, uiGmapGoogleMapApiProvider) {
    $routeProvider.
      when('/', {
        controller: 'HomeController as home',
        templateUrl: 'home.html'
      }).
      when('/about', {
        controller: 'AboutController as about',
        templateUrl: 'about.html'
      }).
      otherwise({
        redirectTo: '/'
      });

    $locationProvider.html5Mode({
      enabled: true,
      requireBase: false
    });

    uiGmapGoogleMapApiProvider.configure({
      key: globalWWMConfig.googleMapsAPIKey,
      v: '3.20', //defaults to latest 3.X
      libraries: 'geometry,visualization'
    });

}]).
  controller('HomeController', ['$http', 'Upload', 'utils', '$uibModal', 'testData',
  function($http, Upload, utils, $uibModal, testData) {
    var home = this;

    // todo: move controllers to separate files under /controllers subdir

    home.showSampleTheaterButton = globalWWMConfig.developerMode.showSampleTheaterButton;
    home.threshold = 50;

    function init(data) {
      home.needsCorrection = [];
      home.withinTolerance = [];
      home.unmapped = [];

      if (home.corrected && home.corrected.length > 0) {
        var correctedData = home.correctedData();
        console.log('got correctedData', correctedData);
        home.savedCorrectedMap = home.toHashMap(correctedData);
        console.log('got savedCorrectedMap', home.savedCorrectedMap);
      }

      home.corrected = [];
      home.originalData = data;
    }

    home.setNewLocation = (theater) => {
      var mapSelectionModal = $uibModal.open({
        controller: 'MapSelection as mapSelection',
        resolve: {
          theater: theater
        },
        size: 'lg',
        templateUrl: 'modals/map-selection.html'
      });

      mapSelectionModal.result.then(function closed(selectedItem) {
        if (selectedItem) {
          home.correctTheater(theater, selectedItem);
        }
      }, function dismissed(reason) {

      });
    };

    home.addVerification = function(theater, correctSource) {
      theater.verifiedLocation = correctSource;
    };

    home.correctTheater = function(theater, correctSource) {
      home.addVerification(theater, correctSource);
      var index = home.needsCorrection.indexOf(theater);
      home.corrected.push(home.needsCorrection.splice(index, 1)[0]);
    };

    home.uncorrectTheater = function(theater) {
      delete theater.verifiedLocation;
      var index = home.corrected.indexOf(theater);
      home.dispositionTheaterByDistance(home.corrected.splice(index, 1)[0]);
    };

    home.correctedData = function() {
      return home.corrected.map(function(theater) {
        return {
          id: theater.id,
          name: theater.cs.name,
          correct_source: theater.verifiedLocation.source,
          correct_lat: theater.verifiedLocation.lat,
          correct_lon: theater.verifiedLocation.lon
        }
      });
    };

    home.toHashMap = function(correctedData) {
      return correctedData.reduce(function(memo, theater) {
        memo[theater.id] = theater;
        return memo;
      }, {});
    };

    home.sample = function() {
      //var data = _.take(testData.apiResponse, 1950);
      var data = testData.apiResponse;
      home.originalData = data;
      home.buildResults(data);
    };

    home.dispositionTheaterByDistance = function(theater) {
      if (theater.originalDistance > home.threshold) {
        home.needsCorrection.push(theater);
      } else {
        home.withinTolerance.push(theater);
      }
    };

    home.buildResults = function(data) {
      data = data || [];
      init(data);
      var mapHash = {};

      angular.forEach(data, function(theater) {
        var id = theater.id;
        if (id) {
          if (theater.source === 'bms') {
            id = 'BMSI' + theater.id;
          }
        }

        if (id) {
          mapHash[id] = mapHash[id] || {};
          mapHash[id][theater.source] = theater;
        } else {
          home.unmapped.push(theater);
        }
      });

      angular.forEach(mapHash, function(theater, key) {
        if (theater.bms && theater.cs) {
          theater.id = key;
          theater.csLatLon = theater.cs.lat + '/' + theater.cs.lon;
          theater.bmsLatLon = theater.bms.lat + '/' + theater.bms.lon;
          var distance = utils.distanceBetweenCoords(
            theater.bms.lat, theater.bms.lon,
            theater.cs.lat, theater.cs.lon
          );
          theater.originalDistance = distance;
          if (home.savedCorrectedMap && home.savedCorrectedMap[theater.id]) {
            home.addVerification(theater, theater[home.savedCorrectedMap[theater.id].correct_source]);
            home.corrected.push(theater);
          } else {
            home.dispositionTheaterByDistance(theater);
          }
        } else {
          home.unmapped.push(theater.bms || theater.cs);
        }
      });

      home.totalItemsCount = home.needsCorrection.length +
        home.withinTolerance.length +
        home.unmapped.length +
        home.corrected.length;

    };

    home.rebuildResults = function() {
      home.buildResults(home.originalData);
    };

    home.submit = function() {
      this.upload([this.bmsFile, this.csFile]);
    };

    home.upload = function(file) {
      home.uploading = true;
      home.clearAllAlerts();
      home.uploadProgress = 0;
      Upload.upload({
        url: '/api/v1/theaterlocations/upload',
        data: { file: file }
      }).then(function success(response) {
        home.uploading = false;
        home.buildResults(response.data);
      }, function error(err) {
        console.log('got error: ', err);
        home.uploading = false;
        home.addAlert('danger', err.data.msg);
      }, function events(evt) {
        var pct = parseInt(100.0 * evt.loaded / evt.total);
        home.uploadProgress = pct;
      });

    };

    home.addAlert = function(type, msg) {
      // type: 'danger' or 'success'
      home.alerts = home.alerts || [];
      home.alerts.push({type: type, msg: msg});
    };

    home.closeAlert = function(index) {
      home.alerts.splice(index, 1);
    };

    home.clearAllAlerts = function() {
      home.alerts = [];
    };

    //home.sample();
  }]).
  controller('AboutController', ['$http',
  function($http) {
    var about = this;
  }]);
