'use strict';

angular.module('httpApp')
  .controller('MainCtrl', function($scope, $location, $window, Client, AccountService, PipeService, DocletService) {

    $scope.METHOD = {
      HEAD: 'head',
      GET: 'get',
      POST: 'post',
      PUT: 'put',
      DELETE: 'delete'
    };

    $scope.FORMAT = {
      RAW: 0,
      TABLE: 1
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
      processing: false,
      result: undefined,
      format: $scope.FORMAT.RAW
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

      DocletService.list()
        .success(function(doclets) {
          Client.setDoclets(doclets);
          $scope.doclets = Client.getDoclets();
        })
        .error(function() {
          $scope.info = undefined;
          $scope.error = 'Failed to fetch doclets';
        });
    }

    $scope.keys = function(obj) {
      return obj ? Object.keys(obj) : [];
    };

    $scope.isTableOutput = function() {
      // If the output is a array it's valid
      if ($scope.out.result instanceof Array) {
        return true;
      }
      // otherwise it's a not a valid table output
      return false;
    };

    $scope.run = function() {

      $scope.out.result = undefined;

      var commands = 'http';
      commands += ' --url=' + $scope.in.url;
      commands += ' --method=' + $scope.in.method;
      // commands += ' --content=' + $scope.in.content;

      $scope.out.processing = true;

      PipeService.execute(commands, $scope.in.text)
        .success(function(response) {
          $scope.out.processing = false;
          $scope.out.format = $scope.FORMAT.RAW;
          $scope.out.result = response;
        })
        .error(function(response) {
          $scope.out.processing = false;
          $scope.out.format = $scope.FORMAT.RAW;
          $scope.out.result = response;
          $scope.error = 'Failed to execute request';
        });

    };

    $scope.saveTo = function(doclet) {

      // Execute the pipe with the provided parameters
      var commands = 'http';
      commands += ' --url=' + $scope.in.url;
      commands += ' --method=' + $scope.in.method;

      var cmd = 'brick --name=New --cmds="' + $window.btoa(commands) + '" --bricksid=' + doclet.id;

      // Set the type depending on selected output view
      switch ($scope.out.format) {
        case $scope.FORMAT.TABLE:
          cmd += ' --table';
          break;
        default:
          cmd += ' --text';
      }

      PipeService.execute(cmd)
        .success(function() {
          var home = $window.unescape($location.search().home);
          $window.top.location = home + '/' + doclet.id;
        })
        .error(function() {
          $scope.info = undefined;
          $scope.error = 'Failed to save brick';
        });

    };

  });
