// console.log('mainctrl.js');
var app = angular.module('shop',["shop.factory", "ui.router","ngDialog","ui.bootstrap","ngAnimate", "shop.cpanel"]);
	app.config(function($stateProvider){
	    $stateProvider.
		    state("index", {
		        url: "",
		        controller: 'appCtrl as app',
		        templateUrl: 'fontView/home.html'
		    }).
		    state("signup", {
		        url: "/signup",
		        controller: 'signupCtrl',
		        templateUrl: '/fontView/pages/signup.html'
		    }).
		    state("cpanel", {
		        url: "/cpanel",
		        controller: 'cpanelCtrl',
		        templateUrl: '/backOffice/login.html'
		    });
	});   

app.controller('appCtrl', function($scope, $state, $rootScope, Cpanel) {
	$scope.getAll = function(){
		Cpanel.previewAll().success(function(res, status){
			console.log(res);
		});
		
	};
	$scope.getAll();
});

app.controller('signupCtrl', function($scope, $state, $rootScope, Cpanel, UserService) {
	$scope.signup = function(input){
		console.log(input);
		UserService.createUser(input).success(function(res, status){
			console.log(res);
		});
	};
});

app.controller('cpanelCtrl',function($scope, $state, $rootScope, Cpanel) {
	$scope.login = function(input){
		Cpanel.adminLogin(input).success(function(status, res){
			$state.go('dashboard');
		});
	};
});     	 

