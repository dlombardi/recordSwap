angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {})

//.controller('ChatsCtrl', function($scope, Chats) {
//    $scope.chats = Chats.all();
//    $scope.remove = function(chat) {
//        Chats.remove(chat);
//    };
//})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope, $state, storageService, accountService) {
  $scope.user = storageService.load("user");
  $scope.data = {};
  $scope.record = {};
  $scope.record.picture = "http://blogs.luc.edu/hubbub/files/2012/12/5027967-vinyl-record-with-a-color-center-on-a-white-background.jpg";

  $scope.addRecord = function(record){
    record.user = $scope.user._id
    accountService.addRecord(record)
    .success(function(data){
      console.log("britney spears is banned from this service");
      record = {};
    })
  }

  $scope.deleteRecord = function(record){
    console.log("I'm in")
    console.log(record);
    accountService.deleteRecord({"rid": record._id})
    .success(function(data){
      console.log(data);
    });
  }

  accountService.getUserRecords($scope.user._id)
  .success(function(data){
    $scope.stache = data.records;
  })


  $scope.logout = function(){
    storageService.removeItem("user");
    $state.go("login");
  };

  // accountService.getUserRecords()
  // .success(function(data, status) {
  //   $scope.stache = data;
  // })


})

.controller('swapMeetCtrl', function($scope, userService, swapService, $state, storageService, $ionicModal, $ionicSlideBoxDelegate) {
  $ionicModal.fromTemplateUrl('templates/modal.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  $scope.togglePendingTrades = function(){
    if($scope.pendingTrades){
      $scope.pendingTrades = false;
    } else {
      $scope.pendingTrades = true;
    }
  }



  $scope.createContact = function(u) {
    $scope.contacts.push({ name: u.firstName + ' ' + u.lastName });
    $scope.modal.hide();
  };

  $scope.nextSlide = function() {
    $ionicSlideBoxDelegate.next();
  }

  $scope.user = storageService.load("user");

  swapService.getRecords()
  .success(function(data){
    $scope.items = data;
    console.log("user:", $scope.user);
  });

  $scope.selectRecord = function(record){

  };

  $scope.click = function(propID) {
    $state.go('tab.manager');
    propertyService.current = propID;
  };

  $scope.logout = function(){
    storageService.removeItem("user");
    $state.go("login");
  };

  $scope.confirmTrade = function(selectedRecord, desiredRecord){
    console.log("selectedRecord:", selectedRecord);
    console.log("desiredRecord:", desiredRecord);
  };

})


.controller('aptCtrl', function($scope, userService, $state, storageService) {
  $scope.user = storageService.load("user");

  aptService.get()
  .success(function(data, status) {
    aptService.apartments = data;
    $scope.apartments = data;
    console.log(data);
    console.log(status);
  })
  $scope.click = function(aptID) {
    $state.go('tab.aptDetail');
    aptService.current = aptID;
  }

})
//!user.isTenant && !applied || (!user.isAdmin || !user.isManager)


.controller('loginCtrl', function($scope, userService, $state, storageService) {
  $scope.data = {};
  $scope.newOne = "false";

  $scope.data = storageService.load("user");
  console.log($scope.data);
  if ($scope.data && $scope.data!==undefined) {
    changeState($scope.data);
  } else {
    $scope.data = {};
  }
  function changeState(data) {
    if (data.isManager) {
      $state.go('tab.manager');
    } else if (data.isTenent) {
      $state.go('tab.aptDetail');
    } else {
      $state.go('tab.swapMeet');
    }
  }
  $scope.newAccount = function() {
    $scope.newOne = true;
    $scope.buttonText = "Create Account";
    $scope.data = {};
  }
  $scope.login = function() {
    userService.login($scope.data)
    .success(function(data, status) {
      console.log(data);
      storageService.save("user", data);
      userService.user = data;
      changeState(data);
    })
    .error(function(err) {
      if (err !== undefined) {
        console.error(err);
      }
    })
  }

  $scope.createAccount = function() {
    userService.register($scope.data)
    .success(function(data, status) {
      console.log(data);
      $scope.login();
    })
    .error(function(err) {
      if (err !== undefined) {
        console.error(err);
      }
    })
  }

  $scope.checkInput = function() {
    if ($scope.data === undefined) {
      console.log("data is undefined")
      return false;
    }
    if ($scope.data.username === undefined) {
      return false;
    }
    if ($scope.data.password === undefined) {
      return false;
    }
    if ($scope.data.confirmPassword === undefined) {
      return false;
    }
    if ($scope.data.password !== $scope.data.confirmPassword) {
      return false;
    }
    return true;
  }
})
