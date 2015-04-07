angular.module('starter', ['ionic', 'firebase'])

.factory('Projects', ["$firebaseArray", function($firebaseArray) {

  var ref = new Firebase("https://croissants.firebaseio.com/projects");
  return $firebaseArray(ref);
}])

.factory('Tasks', ["$firebaseArray", function($firebaseArray) {
  var ref = new Firebase("https://croissants.firebaseio.com/tasks");
  return $firebaseArray(ref);
}])

.controller('TodoCtrl', function($scope, $timeout, $ionicModal, Projects, Tasks, $ionicSideMenuDelegate, $firebaseArray) {

  $scope.projects = Projects;
  $scope.tasks = Tasks;

  var ref = new Firebase("https://croissants.firebaseio.com/last_active");
  ref.once('value', function(snap) {
    var activeId = snap.val();
    Projects.$loaded().then(function(data) {
      data.forEach(function(key, value) {
        if (activeId === key.$id) {
          $scope.activeProject = key;
        }
      });
    });
  });

  var createProject = function(projectTitle) {
    $scope.projects.$add({'title': projectTitle});
  };

  $scope.newProject = function() {
    var projectTitle = prompt('Project name');
    if (projectTitle) {
      createProject(projectTitle);
    }
  };

  $scope.selectProject = function(project) {
    $scope.activeProject = project;
    var ref = new Firebase("https://croissants.firebaseio.com/last_active");
    ref.set(project.$id);
    $ionicSideMenuDelegate.toggleLeft(false);
  };

  // Create and load the Modal
  $ionicModal.fromTemplateUrl('new-task.html', function(modal) {
    $scope.taskModal = modal;
  }, {
    scope: $scope,
    animation: 'slide-in-up'
  });

  // Called when the form is submitted
  $scope.createTask = function(task) {
    console.log(task);
    $scope.projectRef = $firebaseArray(new Firebase('https://croissants.firebaseio.com/projects/' + $scope.activeProject.$id + '/tasks/'));


    $scope.projectRef.$add({
      title: task.title
    });
    $scope.taskModal.hide();

    task.title = "";
  };

  $scope.completeTask = function(task, key) {
    $scope.taskRef = new Firebase('https://croissants.firebaseio.com/projects/' + $scope.activeProject.$id + '/tasks/' + key);
    $scope.taskRef.child('status').set('completed');
  };

  // Open our new task modal
  $scope.newTask = function() {
    $scope.taskModal.show();
  };

  // Close the new task modal
  $scope.closeNewTask = function() {
    $scope.taskModal.hide();
  };

  $scope.toggleProjects = function() {
    $ionicSideMenuDelegate.toggleLeft();
  };
});
