var main = angular.module('main', ['ngRoute']);
main.config(function($routeProvider) {
	$routeProvider

		// route for the home page
		.when('/profile', {
			templateUrl : 'profile',
			controller  : 'mainController'
		})
		.when('/vendor', {
			templateUrl : 'profile',
			controller  : 'mainController'
		})
		
		.when('/monitor', {
			templateUrl : 'monitor',
			controller  : 'monitor'
		})
		
		.when('/configure', {
			templateUrl : 'configure',
			controller  : 'configure'
		})

		// route for the about page
		.when('/controller', {
			templateUrl : 'controller',
			controller  : 'Controller'
		})
		
		
		
		// route for the contact page
		.when('/sensor', {
			templateUrl : 'sensor',
			controller  : 'sensorController'
		})
		.when('/billing', {
		templateUrl : 'billing',
		controller  : 'billingController'
	});
	
});


main.controller('sensorController', function($scope, $http) {
	console.log("Begin");
	$http({
		method : "POST",
		url : '/fetch_sensors',
		data : {
					
		}		
	}).success(function(response) {
		$scope.sensors = response.b;
		if(response.a.statusCode === 200) {
			var map;
			var geocoder;
			var counter = 0;
			function initialize() {
				geocoder = new google.maps.Geocoder();
				  var mapProp = {
				    center:new google.maps.LatLng(37.333551,-121.884503),
				    zoom:7,
				    mapTypeId:google.maps.MapTypeId.ROADMAP
				  };
				  map=new google.maps.Map(document.getElementById("googleMap"),mapProp);
				  console.log("Done");
				};
				initialize();
			for(var i = 0; i < response.b.length; i++) {
				!function outer(ii) {
				var address = response.b[i].address;
				console.log("address is" + address);
				
				geocoder.geocode( { 'address': address}, function(results, status) {
				      if (status == google.maps.GeocoderStatus.OK) {
				    	  //console.log("Inside address is" + response.b[i].address);
				    	   var marker_content = "<b> Sensor_Id: " + response.b[ii].id + "</b> </br>" + 
						   "<b> Sensor_name: " + response.b[ii].sensor_name + "</b> </br>" +
						   "<b> Billing_Id: " + response.b[ii].billing_id + "</b> </br>" +
						   "<b> Status: " + response.b[ii].status + "</b> </br>" +
						   "<b> Address: " + response.b[ii].address + "</b> </br>" +
						   "<b> Controller: " + response.b[ii].controller_id + "</b>";
				    	  	if(counter == 0)
				    		{
				    	  		map.setCenter(results[0].geometry.location);
				    	  		counter++;
				    		}
				    	  	 var infowindow = new google.maps.InfoWindow({
				    	  	    content: marker_content
				    	  	  });

				        var marker = new google.maps.Marker({
				            map: map,
				            position: results[0].geometry.location
				        });
				        marker.addListener('click', function() {
				            infowindow.open(map, marker);
				          });
				      } else {
				        //alert("Geocode was not successful for the following reason: " + status);
				      }
				    });
			}(i)
			}
			}  
		
		
}).error(function(error) {
/*
$scope.unexpected_error = false;
$scope.invalid_login = true;*/
window.alert("errororroror");

});
	
	
	
	
		
});

main.controller('add_sensor', function($scope, $http) {
	$scope.hello = true;
	// create a message to display in our view
	$scope.add_sensor = function(req, res) {
		window.location.assign("/add_sensor");
	};
	$scope.save = function(req,res) {
		var map;
		var geocoder;
		function initialize() {
			geocoder = new google.maps.Geocoder();
			  var mapProp = {
			    center:new google.maps.LatLng(37.333551,-121.884503),
			    zoom:12,
			    mapTypeId:google.maps.MapTypeId.ROADMAP
			  };
			  map=new google.maps.Map(document.getElementById("googleMap"),mapProp);
			  console.log("Done");
			};
			initialize();
		
		var lat;
		var lng;
		//window.alert($scope.sensor_name + " " + $scope.sensor_billing);
		//alert("Inside save");
		//geocoder = new google.maps.Geocoder();
		//alert($scope.sensor_address);
		geocoder.geocode( { 'address': $scope.sensor_address}, function(results, status) {
			if (status == google.maps.GeocoderStatus.OK) {
				//alert(results[0].geometry.location);
				lat = results[0].geometry.location.lat();
				lng = results[0].geometry.location.lng();
			   //alert(lat + " " + lng);
			   $http.post('/save_sensor',
						
						{
							"sensor_name" : $scope.sensor_name,
							"sensor_location" : $scope.sensor_location,
							"sensor_billing" : $scope.sensor_billing,
							"sensor_address" : $scope.sensor_address,
							"sensor_controllerId" : $scope.sensor_controllerId,
							"lat" : lat,
							"lng" : lng
								
					}).success(function(response) {
						window.location.assign("index");
				
					}).error(function(error) {
						window.alert("errororroror");

					});
			}else {
		         
		     }
			
		 });
};
$scope.reset = function(){
	$scope.sensor_name = "";
	$scope.sensor_location = "";
	$scope.sensor_billing = "";
	$scope.sensor_address = "";
	$scope.sensor_controllerId = "";
 };
 $scope.reset();

$scope.add_controller = function(req, res) {
	window.location.assign("/add_controller");
};

$scope.save_controller = function(req,res) {
	//window.alert($scope.sensor_name + " " + $scope.sensor_billing);
	//alert("Inside save");
	$http.post('/save_controller',
		
		{
			"controller_name" : $scope.controller_name,
			"controller_location" : $scope.controller_location,
			"No_of_sensors" : $scope.No_of_sensors
			
				
	}).success(function(response) {
		window.location.assign("index");

	}).error(function(error) {
		window.alert("errororroror");

	});   
};
});





main.controller('mainController', function($scope) {
	// create a message to display in our view
	//window.location.assign('/billing_info');
	
});

main.controller('Controller', function($scope,$http) {
	$http({
		method : "POST",
		url : '/fetch_controllers',
		data : {
					
		}		
	}).success(function(response) {
		$scope.controller = response.b;
		if(response.a.statusCode === 200) {
			var map;
			var geocoder;
			var counter = 0;
			function initialize() {
				geocoder = new google.maps.Geocoder();
				  var mapProp = {
				    center:new google.maps.LatLng(51.508742,-0.120850),
				    zoom:7,
				    mapTypeId:google.maps.MapTypeId.ROADMAP
				  };
				  map=new google.maps.Map(document.getElementById("googleMap"),mapProp);
				  console.log("Done");
				}
				initialize();
			for(var i = 0; i < response.b.length; i++) {
				!function outer(ii) {
				var location = response.b[i].location;
				//console.log("address is" + address);
				
				geocoder.geocode( { 'address': location}, function(results, status) {
				      if (status == google.maps.GeocoderStatus.OK) {
				    	  //console.log("Inside address is" + response.b[i].address);
				    	  var marker_content = "<b> Controller ID: " + response.b[ii].id + "</b> </br>" + 
						   "<b> Controller_name: " + response.b[ii].controller_name + "</b> </br>" +
						   "<b> Location: " + response.b[ii].location + "</b> </br>" +
						   "<b> Number of sensors: " + response.b[ii].No_of_sensors + "</b>";
				    	  	if(counter == 0)
				    		{
				    	  		map.setCenter(results[0].geometry.location);
				    	  		counter++;
				    		}
				    	  	 var infowindow = new google.maps.InfoWindow({
				    	  	    content: marker_content
				    	  	  });

				        var marker = new google.maps.Marker({
				            map: map,
				            position: results[0].geometry.location
				        });
				        marker.addListener('click', function() {
				            infowindow.open(map, marker);
				          });
				      } else {
				        alert("Geocode was not successful for the following reason: " + status);
				      }
				    });
			}(i)
			}
		}  
		
		
}).error(function(error) {
/*
$scope.unexpected_error = false;
$scope.invalid_login = true;*/
window.alert("errororroror");

});
});
main.controller('monitor', function($scope) {
	
});
main.controller('configure', function($scope, $http) {
	$scope.find_controller_sensor = function(req, res) {
	var x = document.getElementById("sel_location");
	var strUser = x.options[x.selectedIndex].value;
	alert("Controller_id is " + strUser);
	$http.post('/fetch_sensors_of_controller',
			
			{
				 
				"controller_id" : strUser
				
				
					
		}).success(function(response) {
			alert("success");
			window.location.assign("fetch_sensors_of_controller");

		}).error(function(error) {
			window.alert("errororroror");

		});
	};
	//window.location.assign("/fetch_data");
});
main.controller('billingController', function($scope) {
	
});