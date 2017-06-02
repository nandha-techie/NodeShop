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
	};
})

