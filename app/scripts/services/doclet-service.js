'use strict';

angular.module('httpApp')
  .service('DocletService', function($http) {

    this.list = function() {
      return $http.get('/api/doclet');
    };

  });
