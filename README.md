# VHMode
A simple state machine for AngularJS

## Usage
This package was created to simplify logic and reduce a count of variables and methods in angularjs views and controllers.
If you have something like that in your application you will enjoy VHMode:

```html
<div ng-controller="UserController">
  <div ng-if="isEditUser">
    <form ng-submit="updateUser()">
      <label>Name</label>
      <input type="text" ng-model="form.name"/>
      ...
      <a ng-click="cancelEdit()">Cancel</a>
      <input type="submit" value="Update"/>
    </form>
  </div>
  <div ng-if="isChangePassword">
    <form ng-submit="changePassword()">
      <label>Password</label>
      <input type="password" ng-model="form.password"/>
      ...
      <a ng-click="cancelPasswordChange()">Cancel</a>
      <input type="submit" value="Change"/>
    </form>
  </div>
  <div ng-if="!isEditUser && !isChangePassword">
    <label>Name</label> {{ user.name }}
    ...
    <a ng-click="initEdit()">Edit</a>
    <a ng-click="initPasswordChange()">Change Password</a>
  </div>
</div>
```

```js
controller("UserController", ["$scope", "User",
  function($scope, User) {
    User.get().then(function(user) {
      $scope.user = user;
    });

    $scope.initEdit = function() {
      var user = $scope.user;
      // `form` variable is used for easy reverting on cancel
      $scope.form = { name: user.name, ... };
      $scope.isEditUser = true;
    }
    $scope.cancelEdit = function() { $scope.isEditUser = false; }
    $scope.updateUser = function() {
      User.update($scope.user, $scope.form).then(function(user) {
        $scope.user = user;
        $scope.isEditUser = false;
      });
    }

    $scope.initPasswordChange = function() {
      $scope.form = {};
      $scope.isChangePassword = true;
    }
    $scope.cancelPasswordChange = function() { $scope.isChangePassword = true; }
    $scope.changePassword = function() {
      User.changePassword($scope.user, $scope.form).then(function() {
        $scope.isChangePassword = false;
      })
    }
  }
])
```

As you can see handling states of angularjs pages requires a decent amount of additional code. You probably can split this states by apply routing, but VHMode helps you to stay simple:

```html
<div ng-controller="UserController">
  <div ng-if="mode.is('edit')">
    <form ng-submit="updateUser()">
      <label>Name</label>
      <input type="text" ng-model="form.name"/>
      ...
      <a ng-click="mode.reset()">Cancel</a>
      <input type="submit" value="Update"/>
    </form>
  </div>
  <div ng-if="mode.is('changePassword')">
    <form ng-submit="changePassword()">
      <label>Password</label>
      <input type="password" ng-model="form.password"/>
      ...
      <a ng-click="mode.reset()">Cancel</a>
      <input type="submit" value="Change"/>
    </form>
  </div>
  <div ng-if="mode.isInit()">
    <label>Name</label> {{ user.name }}
    ...
    <a ng-click="mode.set('edit')">Edit</a>
    <a ng-click="mode.set('changePassword', 'additional', 'arguments')">Change Password</a>
  </div>
</div>
```

```js
angular.module('app', ['vh-mode']).
controller("UserController", ["$scope", "User", "VHMode",
  function($scope, User, VHMode) {
    User.get().then(function(user) {
      $scope.user = user;
    });

    var mode = $scope.mode = new VHMode({
      // callback on `edit` state
      edit: function() {
        var user = $scope.user;
        // `form` variable is used for easy reverting on cancel
        $scope.form = { name: user.name, ... };
      },
      // callback on `changePassword` state
      changePassword: function(arg1, arg2) {
        console.log(arg1 + " " + arg2); // => 'additional arguments'
        $scope.form = {};
      }
    });

    $scope.updateUser = function() {
      User.update($scope.user, $scope.form).then(function(user) {
        $scope.user = user;
        mode.reset();
      });
    }

    $scope.changePassword = function() {
      User.changePassword($scope.user, $scope.form).then(mode.reset);
    }
  }
])
```
