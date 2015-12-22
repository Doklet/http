'use strict';

angular.module('httpApp')
  .controller('MainCtrl', function($scope, $location, $window, Client, AccountService, PipeService) {

    $scope.METHOD = {
      HEAD: 'head',
      GET: 'get',
      POST: 'post',
      PUT: 'put',
      DELETE: 'delete'
    };

    $scope.CONTENT = {
      TEXT: 'text',
      JSON: 'json'
    };

    $scope.account = undefined;

    $scope.in = {
      method: $scope.METHOD.GET,
      content: $scope.CONTENT.TEXT,
      url: undefined,
      text: undefined
    };

    $scope.out = {
      result: undefined
    };

    if (Client.getAccount() === undefined) {

      var sessionId = $location.search().token;
      if (sessionId !== undefined) {
        Client.setSessionId($window.unescape(sessionId));
      }

      var accountId = $window.unescape($location.search().accountId);

      AccountService.fetchAccount(accountId)
        .success(function(account) {
          Client.setAccount(account);
          $scope.account = account;
          $scope.in.url = account.auth.url;
        })
        .error(function() {
          $scope.error = 'Failed to fetch account';
        });
    }

    $scope.run = function() {

      $scope.out.result = undefined;

      var commands = 'http';
      commands += ' --url=' + $scope.in.url;
      commands += ' --method=' + $scope.in.method;
      // commands += ' --content=' + $scope.in.content;

      PipeService.execute(commands, $scope.in.text)
        .success(function(response) {
          $scope.out.result = response;
        })
        .error(function() {
          $scope.error = 'Failed to execute request';
        });

    };

  });
