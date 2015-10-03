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

.controller('AccountCtrl', function($scope, $state, userService, aptService, propertyService, storageService) {
   $scope.user = storageService.load("user");
    $scope.data = {};
    $scope.managers = [];
//    $scope.user = userService.user;
    $scope.property = {};
      $scope.logout = function(){
      storageService.removeItem("user");
      $state.go("login");
    }
    $scope.chooseProp = function(name) {
        $scope.propertyName = name;
    }

    $scope.addApartment = function() {
        $scope.properties.forEach(function(property) {
            console.log($scope.data)
            console.log(property.name, $scope.propertyName);
            if (property.name === $scope.propertyName) {
                $scope.data.property = property._id;
            }
        })
        aptService.add($scope.data);
        console.log("scopedata", $scope.data);
    }
    userService.get()
        .success(function(data, status) {
            $scope.users = data;
            data.forEach(function(user) {
                if (user.isManager) {
                    $scope.managers.push(user);
                }
            })
        })
    $scope.addProperty = function() {
        console.log($scope.property);
        $scope.managers.forEach(function(mgr) {
            if (mgr.username === $scope.property.managerName) {
                $scope.property._id = mgr._id;
            }
        })

        propertyService.add($scope.property)
            .success(function(data, status) {
                console.log(data);
                $state.go('tab.properties');
            })
    }
    propertyService.get()
        .success(function(data, status) {
            $scope.properties = data;
            if (data.length > 0) {
                $scope.propertyName = data[0].name
            }
            console.log(data);
        })
})

.controller('propCtrl', function($scope, userService, propertyService, $state, storageService) {
  $scope.user = storageService.load("user");
  propertyService.get()  
        .success(function(data, status) {

            propertyService.properties = data;
            $scope.properties = data;
            console.log(data);
            console.log(status);
        })
    $scope.click = function(propID) {
        $state.go('tab.manager');
        propertyService.current = propID;
    }
})


.controller('aptCtrl', function($scope, aptService, userService, $state, storageService) {
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
.controller('aptDetailCtrl', function($scope, aptService, userService, storageService) {
    $scope.applied = false;
    $scope.user = userService.user;
    $scope.user = storageService.load("user");
    $scope.apply = function() {
        userService.apply({
            aid: aptService.current,
            uid: userService.user._id
        })
            .success(function(data, status) {
                $scope.applied = true;
                console.log(data);
            })
    }
    if (aptService.apartments.length > 0) {
        findApt(aptService.current)
        console.log("current", aptService.current);
    } else {
        aptService.get()
            .success(function(data, status) {
                aptService.apartments = data;
                console.log(data);
                findApt(userService.user.apartmentNum);
            })
    };
    $scope.checkButton = function() {
        if (userService.user.isTenant || $scope.applied || userService.user.isManager) {
            return false;
        } else {
            return true
        }
    }
    userService.getApplicants(aptService.current)
        .success(function(data, status) {
            $scope.applicants = data;
        })
    $scope.acceptApplicant = function(applicant) {
        userService.acceptApplicant({
            aid: aptService.current,
            uid: applicant._id
        })
            .success(function() {
                $scope.info.tenants.push(applicant);
                var i = $scope.applicants.indexOf(applicant);
                $scope.applicants.splice(i, 1);
            })
    }

    function findApt(id) {
        aptService.apartments.forEach(function(apt) {
            console.log(apt._id, id);
            if (apt._id === id) {
                $scope.info = apt;
            }
        })
    }
})

.controller('loginCtrl', function($scope, userService, $state, aptService, storageService) {
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
            $state.go('tab.properties');
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