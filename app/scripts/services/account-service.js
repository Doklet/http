'use strict';

angular.module('httpApp')
  .service('AccountService', function($http) {

    this.fetchAccount = function(accountId) {
      return $http.get('/api/account/' + accountId);
    };

  });
