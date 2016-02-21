"use strict";

angular.module('adminApp', ['ngRoute', 'ui.bootstrap', 'angularUtils.directives.dirPagination']).
  config(['$routeProvider', '$locationProvider',
  function($routeProvider, $locationProvider) {
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

    //
    // Remove # from Angular urls
    //
    $locationProvider.html5Mode({
      enabled: true,
      requireBase: false
    });
}]).
  controller('HomeController', ['$http', 'utils', '$uibModal',
  function($http, utils, $uibModal) {
    var home = this;

    console.log('in homecontroller');


    //home.sample();
  }]).
  controller('AboutController', ['$http',
  function($http) {
    var about = this;
  }]);
