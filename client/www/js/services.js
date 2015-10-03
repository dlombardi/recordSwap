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
  this.apply = function(data){
    return $http.post("http://localhost:1337/pendingApproval", data);
  }
   this.getApplicants = function (id) {
    return $http.get("http://localhost:1337/showApplicants?aid=" + id);
  }
   this.acceptApplicant = function (data){
     return $http.post("http://localhost:1337/addTenant", data);
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
  this.viewTrades = function() {
    return $http.get('http://localhost:1337/trade');
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
//
// .service('aptService', function ($http) {
//   this.current = "";
//   this.get = function (){
//      return $http.get("http://localhost:1337/apartment");
//   }
//   this.add = function (data) {
//       return $http.post("http://localhost:1337/addApartment", data);
//   }
// })
// .service('propertyService', function ($http) {
//   this.current = "";
//   this.get = function (){
//      return $http.get("http://localhost:1337/showProperties");
//   }
//   this.add = function (data) {
//       return $http.post("http://localhost:1337/addProperty", data);
//   }
// })
