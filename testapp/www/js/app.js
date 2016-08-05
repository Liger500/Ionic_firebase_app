// Ionic Starter App
//Asam Mahmood-CRUD-FIREBASE_ANDROID_IONIC
// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module("todoList", ["ionic", "firebase"])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

/** skeleton to hold firebase object*/
.factory("ToDos", function($firebaseArray) {
  var toDosRef = new Firebase("https://ionic-firebase-99942.firebaseio.com/ionic-firebase-99942");
  return $firebaseArray(toDosRef);
})

/** controller that has the functionality to handle model */
.controller("TodoListCtrl", function($scope, ToDos, $ionicPopup, $ionicLoading) {

  $ionicLoading.show({
    template: 'Loading...'
  });

  /** config for list */
  $scope.shouldShowDelete = false;
  $scope.shouldShowReorder = false;
  $scope.listCanSwipe = true

  /** ToDos holds the ref */
  $scope.toDos = ToDos;

  $scope.toDos.$loaded().then(function (todo) {
      $ionicLoading.hide();
  });

  /** this function is the delete */
  $scope.delete_ = function (item) {

    $scope.toDos.$remove(item).then(function(ref) {
      ref.key() === item.$id; // true
      console.log("ID: " + item.$id + " Deleted successfully");
    });

  }

  /** This function is to edit */
  $scope.edit = function (toDo) {

    $scope.data = {
      "EDITToDO": toDo.name
    };

      var myPopup = $ionicPopup.show({
        template: '<input type="text" ng-model="data.EDITToDO">',
        title: 'edit to what?',
        scope: $scope,
        buttons: [
          { text: 'Cancel' },
          {
            text: '<b>save</b>',
            type: 'button-positive',
            onTap: function(e) {

              console.log($scope.data.EDITToDO);
              if (!$scope.data.EDITToDO) {
                console.log("Didn't do anything");
                //don't allow the user to close unless he enters wifi password
                e.preventDefault();
              } else {
                console.log("Edited " +  $scope.data.EDITToDO);

                toDo.name = $scope.data.EDITToDO;

                $scope.toDos.$save(toDo).then(function(ref) {
                  ref.key() === toDo.$id; // true
                  console.log("Edit successfully " + toDo.$id);
                });

                return $scope.data.EDITToDO;
              }
            }
          }
        ]
      });
  }

  /** function to add to list*/
  $scope.addition = function() {

    $scope.data = {};

      var myPopup = $ionicPopup.show({
        template: '<input type="text" ng-model="data.NEWToDo">',
        title: 'Add  to list',
        scope: $scope,
        buttons: [
          { text: 'Cancel' },
          {
            text: '<b>save</b>',
            type: 'button-positive',
            onTap: function(e) {

              console.log($scope.data.NEWToDo);
              if (!$scope.data.NEWToDo) {
                console.log("Didnt do anything");
                //don't allow the user to close unless he enters wifi password
                e.preventDefault();
              } else {
                console.log("edited " +  $scope.data.NEWToDo);

                /** Ssave in firebase */
                $scope.toDos.$add({
                  "name": $scope.data.NEWToDo
                });

                return $scope.data.NEWToDo;
              }
            }
          }
        ]
      });

  };
});
