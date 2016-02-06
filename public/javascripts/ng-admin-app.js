angular.module('adminApp', ['ui.bootstrap']).
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

  });
