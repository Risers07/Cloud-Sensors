var main = angular.module('main', []);
main.controller('mainController', function($scope, $http) {
	$scope.find_sensors = function(req,res){
		
		var x = document.getElementById("sel_location");
		var strUser = x.options[x.selectedIndex].value;
		$http.post('/fetch_sensors_of_location',
				
				{
					 
					"location" : strUser
					
					
						
			}).success(function(response) {
				window.location.assign("fetch_sensors_of_location");

			}).error(function(error) {
				window.alert("errororroror");

			});
	}
	
$scope.subscribe_sensor = function(vendor_id, sensor_name, sensor_id,location, address, description, payment_type, status, billing_id, req, res){
		
		//console.log(sensor_det);
		$http.post('/subscribe_sensor',
				
				{
					"vendor_id" : vendor_id,
					"sensor_name" : sensor_name,
					"sensor_id" : sensor_id,
					"location" : location,
					"address" : address,
					"description" : description,
					"payment_type" : payment_type,
					"status" : status,
					"billing_id" : billing_id
					
					
						
			}).success(function(response) {
				window.location.assign("userlandingpage2");

			}).error(function(error) {
				window.alert("errororroror");

			});
	}
$scope.unsubscribe = function(sensor_name,req,res){
	
	$http.post('/unsubscribe_sensor',
			
			{
				 
				"sensor_name" : sensor_name
				
				
					
		}).success(function(response) {
			window.location.assign("userlandingpage2");

		}).error(function(error) {
			window.alert("errororroror");

		});
}

$scope.show_bill = function(sensor_name, req,res){
	
	console.log("sensor name is " +sensor_name);
	alert(sensor_name);
	$http.post('/show_sensorBill_4',
			
			{
				 
				"sensor_name" : sensor_name
				
				
					
		}).success(function(response) {
			alert("Ok goog");
			window.location.assign("show_sensorBill_5");

		}).error(function(error) {
			alert("error");
			window.location.assign("show_sensorBill_5");
		});
};

$scope.show_data = function(sensor_name, req,res){
	
	console.log("sensor name is " +sensor_name);
	//alert(sensor_name);
	$http.post('/show_sensor_data',
			
			{
				 
				"sensor_name" : sensor_name
				
				
					
		}).success(function(response) {
			alert("Ok goog");
			window.location.assign("/show_sensor_data_1");

		}).error(function(error) {
			alert("error");
			window.location.assign("/show_sensor_data_1");
		});
};



$scope.toggle_sensor = function(vendor_id, sensor_name, sensor_id,location, address, description, payment_type, status, billing_id, req, res){
	
	//console.log(sensor_det);
	$http.post('/toggle_sensor',
			
			{
				"vendor_id" : vendor_id,
				"sensor_name" : sensor_name,
				"sensor_id" : sensor_id,
				"location" : location,
				"address" : address,
				"description" : description,
				"payment_type" : payment_type,
				"status" : status,
				"billing_id" : billing_id
				
				
					
		}).success(function(response) {
			window.location.assign("configure_controller_sensor");

		}).error(function(error) {
			window.alert("errororroror");

		});
};

$scope.delete_sensor = function(vendor_id, sensor_name, sensor_id,location, address, description, payment_type, status, billing_id, req, res){
	
	//console.log(sensor_det);
	$http.post('/delete_sensor',
			
			{
				"vendor_id" : vendor_id,
				"sensor_name" : sensor_name,
				"sensor_id" : sensor_id,
				"location" : location,
				"address" : address,
				"description" : description,
				"payment_type" : payment_type,
				"status" : status,
				"billing_id" : billing_id
				
				
					
		}).success(function(response) {
			window.location.assign("configure_controller_sensor");

		}).error(function(error) {
			window.alert("errororroror");

		});
};

$scope.pay_sensorbill = function(req,res){
	alert("here /i am ");
	window.location.assign("userlandingpage2");
};	

});