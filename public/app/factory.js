var app = angular.module('shop.factory',["ui.router"]);

app.factory('Cpanel', function($http){
	return {
		adminLogin: function(data){
			return $http.post(window.location.origin + '/cpanel/login', data);
		},
		/*getInfo: function(callback){
			return $http.get(window.location.origin + '/moderator/profile?' + moment().format("YYYYMMDDHHmmssSS"));
		},*/
		imageUpload: function(data){
			return $http.post(window.location.origin + '/imageUpload', data, {withCredentials: true, transformRequest: angular.identity, headers: {'Content-Type': undefined}});
		},
		postAddProduct: function(data){
			return $http.post(window.location.origin + '/addproduct', data);
		},
		productList: function(){
			return $http.get(window.location.origin + '/productlist');
		},
		getProductEdit: function(id){
			return $http.get(window.location.origin + '/getProductEdit/' + id);
		},
		postUpdateProduct: function(data){
			return $http.post(window.location.origin + '/postUpdateProduct', data);
		},
		adminLogout: function(id){
			return $http.get(window.location.origin + '/adminLogout');
		},
		previewAll: function(){
			return $http.get(window.location.origin + '/previewAll');
		},
		deleteProduct: function(id){
			return $http.get(window.location.origin + '/deleteProduct/'+id);
		},
	};
});

app.factory('UserService', function($http){
	return {
		createUser: function(data){
			return $http.post(window.location.origin + '/signup', data);
		},
		userLogin: function(data){
			return $http.post(window.location.origin + '/userLogin', data);
		},
		fb: function(){
			return $http.get(window.location.origin + '/auth/facebook');
		},
		profile: function(){
			return $http.get(window.location.origin + '/facebooklogin/callback');
		},
		allProducts: function(){
			return $http.get(window.location.origin + '/allProducts');
		},
		logoutUser: function(){
			return $http.get(window.location.origin + '/logoutUser');
		},
	};
});
