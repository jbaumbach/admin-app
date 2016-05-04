"use strict";

angular.module('adminApp', ['ngRoute', 'ui.bootstrap', 'angularUtils.directives.dirPagination']).
  config(['$routeProvider', '$locationProvider',
  function($routeProvider, $locationProvider) {
    $routeProvider.
      when('/', {
        controller: 'HomeController as home',
        templateUrl: '/views/home.html'
      }).
      when('/about', {
        controller: 'AboutController as about',
        templateUrl: '/views/about.html'
      }).
      otherwise({
        controller: '404Controller as errorPage',
        templateUrl: '/views/404.html'
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

    //
    // Grab list of users from the backend
    //
    $http({ method: 'GET', url: '/api/v1/users'}).
    then(function success(response) {
      home.users = response.data.results;
    }, function error(err) {
      // oops
    });

  }]).
  controller('AboutController', ['$http',
  function($http) {
    var about = this;
  }]).
  controller('NavController', ['User',
  function(User) {
    var nav = this;
    nav.user = User;
  }]).
  controller('404Controller', ['$location',
  function($location) {
    var errorPage = this;
    errorPage.page = $location.absUrl();
  }]).
  factory('User', [
  function() {
    var userFactory = globalConfig.user || {};
    return userFactory;
  }]);
