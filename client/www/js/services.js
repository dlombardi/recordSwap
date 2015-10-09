angular.module('starter.services', [])

.service('loginService', function ($http) {
  var loggedIn = false;
})

.service('storageService', function (localStorageService) {
    this.save = function(key, data){
      localStorageService.set(key, data)
    }
    this.load = function(key){
    return localStorageService.get(key);
    }
    this.removeItem = function(key){
      return localStorageService.remove(key)
    }
})

.service('userService', function ($http, $state) {

  this.login = function (data) {
    return $http.post("http://localhost:1337/login", data);
  }
  this.register = function (data) {
    return $http.post("http://localhost:1337/register", data);
  }
  this.get = function () {
    return $http.get("http://localhost:1337/showUsers");
  }
})


.service('swapService', function($http){
  this.current = "";
  this.getRecords = function(){
    return $http.get("http://localhost:1337/record");
  }
  this.requestSwap = function(data) {
    return $http.post('http://localhost:1337/trade', data);
  }
  this.showTrades = function() {
    console.log('init');
    return $http.get('http://localhost:1337/trade')
  }
  this.acceptTrade = function(data){
    return $http.post('http://localhost:1337/acceptTrade', data)
  }
})

.service('accountService', function($http){
  this.getUserRecords = function(uid){
    return $http.get("http://localhost:1337/user?uid=" + uid);
  }
  this.deleteRecord = function(data){
    return $http.delete("http://localhost:1337/deleteRecord?rid=" + data.rid);
  }

  this.addRecord = function(data){
    return $http.post("http://localhost:1337/addRecord", data)
  }
})
