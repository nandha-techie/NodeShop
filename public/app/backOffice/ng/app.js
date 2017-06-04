// console.log('aaaapp.js');
var app = angular.module('shop.cpanel',["ngFileUpload"]);
app.config(function($stateProvider) {
    $stateProvider.
    state("dashboard", {
        url:"/cpanel/dashboard",
        controller:'dashCtrl',
        templateUrl:'backOffice/ng/dashboard.html'
    }).
    state("orderlist", {
        url:"/cpanel/orders",
        controller:'OrderListCtrl',
        templateUrl:'backOffice/ng/orders/list.html'
    }).
    state("OrderAdd", {
        url:"/cpanel/orders/add",
        controller:'OrderAddCtrl',
        templateUrl:'backOffice/ng/orders/add.html'
    }).
    state("editProduct", {
        url:"/cpanel/orders/edit/:id",
        controller:'EditProductCtrl',
        templateUrl:'backOffice/ng/orders/edit.html'
    }).
    state("cpanel", {
        url: "/cpanel",
        controller: 'cpanelCtrl',
        templateUrl: '/backOffice/login.html'
	});
});   


app.controller('dashCtrl',function($scope){
	console.log('fffffffff');
	
});

app.controller('cpanelCtrl',function($scope, $state, $rootScope, Cpanel) {
	$scope.login = function(input){
		Cpanel.adminLogin(input).success(function(status, res){
			$state.go('dashboard');
		}).error(function(error, status){
			// if(status != 409){
			// 	state.go('');
			// }else{
			// 	$state.go('index');
			// }
		});
	};
});

	app.controller('OrderListCtrl', function($scope, $state, Cpanel, $uibModal){
		$scope.productList = function(add){
			Cpanel.productList().success(function(res, status){
				$scope.productList = res.data;
			}).error(function(error, status){
				if(status == 401){
					if(status == 401) $state.go('cpanel');
				}else{
					 $state.go('cpanel');
				}
			});
		};
		$scope.currentPage = 1;
		$scope.pageSize = 5;
		$scope.edit = function(id){
			$state.go('editProduct', {id: id});
		};
		$scope.logout = function(){
			Cpanel.adminLogout().success(function(res, status){
				$state.go('cpanel');
			});
		};
		$scope.productList();
	});

	app.controller('OrderAddCtrl', function($scope, $state, $rootScope, ngDialog, $state, Cpanel){
		$scope.loader = false;
		$scope.add = {};
		$scope.imgShow = false;
		//console.log(window.location.origin);
		$scope.addProduct = function(add){
			Cpanel.postAddProduct(add).success(function(res, status){
				$state.go('orderlist');
			});
		};
		$scope.selectedFiles = function(file, err){
			if(err.length > 0){
				console.log(err);
			}else{
				$scope.fileData = file;
				$scope.uploadFile();
			}	
		};
		$scope.uploadFile = function(){
			var files = $scope.fileData,
				fd = new FormData();
    		fd.append("file", files);
			Cpanel.imageUpload(fd).success(function(res, status){
				if(res.filePath){
					$scope.imgShow = true;
					$scope.add.original_path = res.rootPath;
					$scope.add.image_path  = res.filePath;
				}	
			});
		};
		$scope.logout = function(){
			Cpanel.adminLogout().success(function(res, status){
				$state.go('cpanel');
			});
		};
	});

	app.controller('EditProductCtrl', function($uibModal, $state, $scope, $stateParams, $rootScope, Cpanel, ngDialog){
		$scope.productId = $stateParams.id;
		$scope.checkUpload = true;
		$scope.getProduct = function(){
			Cpanel.getProductEdit($scope.productId).success(function(res, status){
				if(res.data.image_path) $scope.imgShow = true;
				$scope.productEditData = res.data;
				$scope.image = $scope.productEditData.image_path;
			}).error(function(error, status){
				if(status == 401){
					if(status == 401) $state.go('cpanel');
				}else{
					 $state.go('cpanel');
				}
			});
		};	
		$scope.selectedFiles = function(file, err){
			if(err.length > 0){
				console.log(err);
			}else{
				$scope.fileData = file;
				$scope.checkUpload = false;
				$scope.uploadFile();
			}
		};
		$scope.uploadFile = function(){
			var files = $scope.fileData,
				fd = new FormData();
    		fd.append("file", files);
			Cpanel.imageUpload(fd).success(function(res, status){
				ngDialog.close();
				if(res.filePath){
					$scope.imgShow = true;
					$scope.productEditData.original_path = res.rootPath;
					$scope.productEditData.image_path  = res.filePath
				}	
			});
		};
		$scope.updateProduct = function(data){
			data._id = $scope.productId;
			Cpanel.postUpdateProduct($scope.productEditData).success(function(res, status){
				$state.go('orderlist');
			});
		};
		$scope.logout = function(){
			Cpanel.adminLogout().success(function(res, status){
				$state.go('cpanel');
			});
		};
		$scope.getProduct();		
	});