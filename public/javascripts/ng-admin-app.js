angular.module('adminApp', ['ngRoute', 'ui.bootstrap']).
  config(function($routeProvider, $locationProvider) {
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
  }).
  controller('HomeController', function($http) {
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

  }).
  controller('AboutController', function($http) {
    var about = this;
  });
