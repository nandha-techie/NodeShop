// console.log('mainctrl.js');
var app = angular.module('shop',["shop.factory", "shop.cpanel", "ui.router","ngDialog","ui.bootstrap","ngAnimate"]);
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
		    state("userlogin", {
		        url: "/userlogin",
		        controller: 'LoginCtrl',
		        templateUrl: '/fontView/pages/login.html'
		    }).
		    state("userHome", {
		        url: "/facebook/callback/?code",
		        controller: 'UserHomeCtrl',
		        templateUrl: '/fontView/pages/userDashboard.html'
		    }).
		    state("userDashboard", {
		        url: "/userdashboard",
		        controller: 'UserDashboardCtrl',
		        templateUrl: '/fontView/pages/userDashboard.html'
		    });
		    
	});   

app.controller('appCtrl', function($scope, $state, $rootScope, Cpanel, UserService) {
	$scope.getAll = function(){
		Cpanel.previewAll().success(function(res, status){
			console.log(res);
			$scope.products = res.data;
		});
		
	};
	$scope.currentPage = 1;
	$scope.pageSize = 8;
	$scope.getAll();
});

app.controller('signupCtrl', function($scope, $state, $rootScope, UserService) {
	$scope.signup = function(input){
		console.log(input);
		UserService.createUser(input).success(function(res, status){
			if(res) $state.go('userlogin');
		}).error(function(error, status){
			if(status == 409){
				state.go('signup');
			}else{
				$state.go('index');
			}
		});
	};
});

app.controller('LoginCtrl',function($scope, $state, $rootScope, UserService) {
	$scope.login = function(input){
		console.log(input);
		UserService.userLogin(input).success(function(res, status){
			$state.go('userDashboard');
		}).error(function(error, status){
			//console.log(error.message);
		});
	};
	$scope.fblogin = function(){
		UserService.fb().success(function(res, status){
			//$state.go('userDashboard');
		}).error(function(error, status){
			//console.log(error.message);
		});
	};
});

app.controller('UserHomeCtrl',function($scope, $state, $rootScope, UserService) {
	$scope.login = function(input){
		UserService.userLogin(input).success(function(status, res){
			$state.go('dashboard');
		});
	};
	UserService.profile().success(function(res, status){
			//$state.go('dashboard');
			console.log(res);
	});
	console.log('ttttttttttttt');
}); 

app.controller('UserDashboardCtrl',function($scope, $state, $rootScope,Cpanel, UserService) {
	$scope.getAll = function(){
		UserService.allProducts().success(function(res, status){
			console.log(res);
			$scope.products = res.data;
			$scope.user = res.user;
		}).error(function(error, status){
			$state.go('userlogin');
		});
		
	};
	$scope.logout = function(){
		UserService.logoutUser().success(function(res, status){
			$state.go('userlogin');
		}).error(function(error, status){
			$state.go('userlogin');
		});
	}
	$scope.currentPage = 1;
	$scope.pageSize = 8;
	$scope.getAll();
}); 
     	 

