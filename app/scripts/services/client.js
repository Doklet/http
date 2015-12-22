'use strict';


angular.module('httpApp')
  .service('Client', function() {

    var _sessionId;
    var _account;

    this.getSessionId = function() {
      return _sessionId;
    };

    this.setSessionId = function(sessionId) {
      _sessionId = sessionId;
    };

    this.getAccount = function() {
      return _account;
    };

    this.setAccount = function(account) {
      _account = account;
    };

  });
