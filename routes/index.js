var pool1 = require('./sqlConnection');
var mysql = require('mysql');
var vendor_sensors = [];
var vendor_controllers = [];
var mongo = require("./mongo");
var airnow = require('airnow');
var location_sensor_det;
var controller_sensor_det;
var sensor_billing;
var id;
var sensor_name_bill;
var sensor_name_data;
var controller_fetch;
//var client = airnow({apiKey: 'B98F2B84-963D-48A2-B9EF-B93196AF6C7C'});
var client = airnow({ apiKey: 'B98F2B84-963D-48A2-B9EF-B93196AF6C7C' });
var mongoURL = "mongodb://localhost:27017/cmpe281";
exports.index = function(req, res) {
	res.render('start1', {
		title : 'Express'
	});
};
 /////Code to inpuut data again and again

setInterval(function(){
	var status = "active";
	var showSensorsDet = "select sensor_id, sensor_name, location, billing_id, address, status, vendor_id, controller_id, lat, lon  from vendor where status='"+status+"';";
	//console.log("Query is " +showSensorsDet);
	//var json_responses;
	//var x = document.getElementById("sel_location");
	//var strUser = x.options[x.selectedIndex].value;
	pool1.fetchData(function(err,result){
		if(err){
			console.log(err);
			//res.end(err);
			
		}
		else{
				if(result == undefined || result == null || result == 'undefined')
				{	
					//json_responses = {"statusCode" : 401};
					console.log("error in fetching data from vendor");
					//res.send(json_responses);
				}
				else
				{   
					for(var i = 0; i < result.length; i++) {
						!function outer(ii) {
						console.log("LAt lon is " + result[i].lat + result[i].lon)	;
						var options = {
								latitude: result[i].lat,
								longitude: result[i].lon,
								distance: 20,
								format: "application/json"
							};
						///////////////////////////////////////////
						client.getObservationsByLatLng(options, function(err, observations){
							console.log("Inside api method");
							console.log("Lat lon inside api is " + options.latitude + options.longitude);
							if (err){
								console.log('derp! an error calling getObservationsByLatLng: ' + err);
							} else {
								// the world is good! start processing the observations 
							
						
						
							console.log(observations);
							console.log("New line");
							//console.log(observations[0]);
							
							//console.log("Value is " + observations[1].ParameterName);
						
						
						mongo.connect(mongoURL, function(){
							console.log('Connected to mongo at: ' + mongoURL);
							var coll = mongo.collection('sensor_data');
					        console.log("coll is:" + coll);
					        console.log("The sensor_name is /...sd...." + result[ii].sensor_name);
					        
					        coll.update(
					        		   { sensor_name: result[ii].sensor_name },
					        		   { $push: { data : { 
                                   	    DateObserved: observations[0].DateObserved,
                                	    HourObserved:  observations[0].HourObserved,
                                	    LocalTimeZone:  observations[0].LocalTimeZone,
                                	    ReportingArea: observations[0].ReportingArea,
                                	    StateCode:  observations[0].StateCode,
                                	    Latitude:  observations[0].Latitude,
                                	    Longitude:  observations[0].Longitude,
                                	    Ozone:  observations[0].AQI,
                                		PPM:  observations[0].AQI + 10,
                                		N2O:  observations[0].AQI + 3,
                                		CO:  observations[0].AQI + 5,
                                		SO2:  observations[0].AQI + 8
                                	  
                                   } } }  )
                                   
					        
					});
									
				}	
		});
					}(i)
					}
				}
		}
			
	},showSensorsDet);//;//res.render('buy_sensor_user');
	},4000);

exports.controller = function(req, res) {
	res.render('controller');
};
exports.monitor = function(req, res) {
	res.render('monitor');
};
exports.configure = function(req, res) {
	var showLocations = "select distinct controller_id as location from controller;";
	console.log("Query is " +showLocations);
	var json_responses;
	pool1.fetchData(function(err,result){
		if(err){
			console.log(err);
			res.end(err);
			
		}
		else{
				if(result == undefined || result == null || result == 'undefined')
				{	
					json_responses = {"statusCode" : 401};
					res.send(json_responses);
				}
				else
				{
					
					json_responses = {"statusCode" : 200};
					//res.send(json_responses);
					console.log("result is " + result[0].location);
					res.render('configure',{location:result});
				}	
		}
			
	},showLocations);//;//res.render('configure');
};

exports.sensor = function(req, res) {
	//$('#loadMap').click(initialize);
	res.render('Current_loc');
};

exports.profile = function(req, res) {
	res.render('profile');
};




exports.add_sensor = function(req, res) {
	console.log("I am here");
	res.render('add_sensor');
};

exports.add_controller = function(req, res) {
	//console.log("I am here");
	res.render('add_controller');
};
exports.billing_info = function(req, res) {
	//console.log("I am here");
	res.render('billing_info');
};


exports.vendor_main = function(req, res) {
	//console.log("I am here");
	res.render('index');
};


exports.fetch_data = function(req, res) {
	//console.log("I am here");
	

	

	// get the observations by a bounded box monitoring site
	
};

exports.fetch_sensors = function(req, res) {
	var retriveSesnors = "select sensor_id as id, sensor_name as name, location as location, billing_id as billing_id, status as status, address as address, controller_id as controller_id from vendor where vendor_id ='"+ 2+ "';";
	pool1.fetchData(function(err,result){
		if(err){
			console.log(err);
			res.end(err);
			
		}
		else{
				if(result == undefined || result == null || result == 'undefined')
				{	
					json_responses = {"statusCode" : 401};
					res.send(json_responses);
				}
				else
				{
					var i = 0;
					while(i < result.length) {
						vendor_sensors.push({
							id:result[i].id,
							sensor_name:result[i].name,
							location:result[i].location,
							billing_id:result[i].billing_id,
							status:result[i].status,
							address:result[i].address,
							controller_id:result[i].controller_id
						})
						i++;
					}
					console.log("sensors are" + vendor_sensors.length);
					for(var j = 0; j < vendor_sensors.length; j++) {
						console.log(vendor_sensors[j].sensor_name)
					}
					
					json_responses = {"statusCode" : 200};
					res.send({a:json_responses, b:vendor_sensors});
				}	
		}
			
	},retriveSesnors);
};

exports.fetch_controllers = function(req, res) {
	var json_responses;
	var retriveControllers = "select controller_id as id, controller_name as name, location as location, No_of_sensors as Number_of_sensors from controller where vendor_id ='"+ 2+ "';";
	pool1.fetchData(function(err,result){
		if(err){
			console.log(err);
			res.end(err);
			
		}
		else{
				if(result == undefined || result == null || result == 'undefined')
				{	
					json_responses = {"statusCode" : 401};
					res.send(json_responses);
				}
				else
				{
					var i = 0;
					while(i < result.length) {
						vendor_controllers.push({
							id:result[i].id,
							controller_name:result[i].name,
							location:result[i].location,
							No_of_sensors:result[i].Number_of_sensors							
						});
						i++;
					}
					/*console.log("sensors are" + vendor_sensors.length);
					for(var j = 0; j < vendor_sensors.length; j++) {
						console.log(vendor_sensors[j].sensor_name)
					}*/
					
					json_responses = {"statusCode" : 200};
					res.send({a:json_responses, b:vendor_controllers});
				}	
		}
			
	},retriveControllers);
};




exports.save_sensor = function(req, res) {
	var json_responses;
	var status = "active";
	
	console.log("billing is"+ req.body.sensor_name);
	console.log("controller is"+ req.body.sensor_location);
	var saveSensor = "insert into vendor (sensor_name, location, vendor_id, billing_id, status, address, controller_id, lat, lon) values('"+ req.body.sensor_name +"','" + req.body.sensor_location + "','"+ 2 + "','" + req.body.sensor_billing + "', '" + status + "', '" + req.body.sensor_address + "', '" + req.body.sensor_controllerId + "', '" + req.body.lat + "', '" + req.body.lng + "');";
	console.log("Query is " +saveSensor);
	pool1.fetchData(function(err,result){
		if(err){
			console.log(err);
			res.end(err);
			
		}
		else{
				if(result == undefined || result == null || result == 'undefined')
				{	
					json_responses = {"statusCode" : 401};
					res.send(json_responses);
				}
				else
				{
					console.log(req.body.lat + "ohhahaha " + req.body.lng);
					var options = {
							latitude: req.body.lat,
							longitude: req.body.lng,
							distance: 10,
							format: "application/json"
						};
					///////////////////////////////////////////
					client.getObservationsByLatLng(options, function(err, observations){
						if (err){
							console.log('derp! an error calling getObservationsByLatLng: ' + err);
						} else {
							// the world is good! start processing the observations 
						
					
					
						console.log(observations);
						console.log("New line");
						console.log(observations[0]);
						//console.log("Value is " + observations[1].ParameterName);
					
					
					mongo.connect(mongoURL, function(){
						console.log('Connected to mongo at: ' + mongoURL);
						var coll = mongo.collection('sensor_data');
				        console.log("coll is:" + coll);
				        
				        coll.insert({"vendor_id":id, "controller_id":req.body.sensor_controllerId, "sensor_name":req.body.sensor_name, data : [
				                                                                                                                              {
				                                                                                                                            	    DateObserved: observations[0].DateObserved,
				                                                                                                                            	    HourObserved:  observations[0].HourObserved,
				                                                                                                                            	    LocalTimeZone:  observations[0].LocalTimeZone,
				                                                                                                                            	    ReportingArea: observations[0].ReportingArea,
				                                                                                                                            	    StateCode:  observations[0].StateCode,
				                                                                                                                            	    Latitude:  observations[0].Latitude,
				                                                                                                                            	    Longitude:  observations[0].Longitude,
				                                                                                                                            	    Ozone:  observations[0].AQI,
				                                                                                                                            		PPM:  observations[0].AQI + 2,
				                                                                                                                            		N2O:  observations[0].AQI + 5,
				                                                                                                                            		CO:  observations[0].AQI + 4,
				                                                                                                                            		SO2:  observations[0].AQI + 8
				                                                                                                                            	  
				                                                                                                                              }]}, function(err, user){
							console.log("user is:" + user);
							if (user) {
								
								// This way subsequent requests will know the user is logged in.
								//req.session.email = user.email;
								res.code = "200";
								var json_responses = {"statusCode" : 201};
								
								console.log("success");
								//res.value = "Succes Login";
								res.send(json_responses);
						        console.log("ethhet ethhet");
						        
					}
					else{
						var json_responses = {"statusCode" : 401};
						console.log("failed");
						//res.value = "Succes Login";
						res.send(json_responses);
					}
							
					//callback(null, res);
				});
					           });
					
					};
				});
					
					
					////////////////////////////////////////////////
					
				}	
		}
			
	},saveSensor);
};

exports.save_controller = function(req, res) {
	var json_responses;
	
	//console.log("billing is"+ req.body.sensor_name);
	//console.log("controller is"+ req.body.sensor_location);
	var saveController = "insert into controller (controller_name, vendor_id, location, No_of_sensors) values('"+ req.body.controller_name +"','"+ 2 + "','" + req.body.controller_location + "', '" + req.body.No_of_sensors + "');";
	console.log("Query is " +saveController);
	pool1.fetchData(function(err,result){
		if(err){
			console.log(err);
			res.end(err);
			
		}
		else{
				if(result == undefined || result == null || result == 'undefined')
				{	
					json_responses = {"statusCode" : 401};
					res.send(json_responses);
				}
				else
				{
					
					json_responses = {"statusCode" : 200};
					res.send(json_responses);
				}	
		}
			
	},saveController);
};

exports.signupInsert = function(req, res) {
	var json_responses;
	
	//console.log("billing is"+ req.body.sensor_name);
	//console.log("controller is"+ req.body.sensor_location);
	var signupInsert = "insert into user_details (name, password, email, type) values('"+ req.body.name +"','"+ req.body.password + "','" + req.body.email + "', '" + req.body.Type + "');";
	console.log("Query is " +signupInsert);
	pool1.fetchData(function(err,result){
		if(err){
			console.log(err);
			res.end(err);
			
		}
		else{
				if(result == undefined || result == null || result == 'undefined')
				{	
					json_responses = {"statusCode" : 401};
					res.send(json_responses);
				}
				else
				{
					
					res.render('start1');
				}	
		}
			
	},signupInsert);
};
exports.fetch_sensors_of_controller= function(req, res) {
	var json_responses1 = {"statusCode" : 200};
	controller_fetch = req.body.controller_id;
	console.log("Inside name is "+ controller_fetch);
	 res.send(json_responses1);
};

exports.fetch_sensors_of_controller1 = function(req, res) {
	var showSensorsDet = "select sensor_id, sensor_name, location, a.billing_id, address, status, a.vendor_id, b.description, b.payment_type from vendor as a left outer join billing_plan as b on a.billing_id = b.billing_id where a.controller_id='"+controller_fetch+"';";
	console.log("Query is " +showSensorsDet);
	var json_responses;
	//var x = document.getElementById("sel_location");
	//var strUser = x.options[x.selectedIndex].value;
	pool1.fetchData(function(err,result){
		if(err){
			console.log(err);
			res.end(err);
			
		}
		else{
				if(result == undefined || result == null || result == 'undefined')
				{	
					json_responses = {"statusCode" : 401};
					res.send(json_responses);
				}
				else
				{
					
					//controller_sensor_det = result;
					res.render('configure_controller_sensor',{sensor_det:result});
					
					//console.log("result is " + result[0].location);
					//res.render('buy_sensor_user',{sensor_det:result});
				}	
		}
			
	},showSensorsDet);//;//res.render('buy_sensor_user');
	
};

exports.toggle_sensor = function(req, res) {
	var inactive = "inactive";
	var showLocations = "update vendor set status = ( CASE when (status = 'active') then 'inactive' when (status = 'inactive') then 'active' END) where vendor_id = '"+req.body.vendor_id+"' and sensor_id = '"+req.body.sensor_id+"'";
	console.log("Query is " +showLocations);
	var json_responses;
	pool1.fetchData(function(err,result){
		if(err){
			console.log(err);
			res.end(err);
			
		}
		else{
				if(result == undefined || result == null || result == 'undefined')
				{	
					json_responses = {"statusCode" : 401};
					res.send(json_responses);
				}
				else
				{
					
					json_responses = {"statusCode" : 200};
					res.send(json_responses);
					
				}	
		}
			
	},showLocations);//;
};

exports.delete_sensor = function(req, res) {
	
	var showLocations = "delete from vendor where vendor_id = '"+req.body.vendor_id+"' and sensor_id = '"+req.body.sensor_id+"'";
	console.log("Query is " +showLocations);
	var json_responses;
	pool1.fetchData(function(err,result){
		if(err){
			console.log(err);
			res.end(err);
			
		}
		else{
				if(result == undefined || result == null || result == 'undefined')
				{	
					json_responses = {"statusCode" : 401};
					res.send(json_responses);
				}
				else
				{
					
					json_responses = {"statusCode" : 200};
					res.send(json_responses);
					
				}	
		}
			
	},showLocations);//;
};
/////////////////////////////////////////////////////AMITESH//////////////////////////////////////
exports.signIn = function(req,res){
	res.render('signin1');
};

exports.signUp = function(req,res){
	res.render('signUp1');
};


exports.admin_landing1 = function(req,res){
	res.render('admin_landing_page');
};


exports.signInCheck = function(req,res){
	var https = require('https');
	var username = req.body.username;
	var password = req.body.password;
	var type= req.body.Type;
	//var type = $('input[name="genderS"]:checked').value();
	console.log("email: "+username+ " password: "+password);
	console.log("type: "+type);
	/*var conn=mysql.createConnection({
		host: 'localhost',
		user: 'root',
		password: '12345',
		database: 'cmpe281',
		
	});*/
	var checkSignin = "select user_id, name from user_details where email='"+username+"' and password='"+password+"' and type ='"+type+"' ;";
	pool1.fetchData(function(err,result){
		if(err){
			console.log(err);
			res.end(err);
			
		}
		else{
	
			if((result.length)>0){
				 
				 console.log("stage: 1");
				 			 
				 id=result[0].user_id;
				 if(type === "user") 
			     {		 
				 //var id= 2;
				 var name=result[0].name;
				 console.log("name: "+name+", id: "+id );
				 var query1="select sensor_id, sensor_name, user_id, location, status, address from user where user_id='"+id+"';";
				pool1.fetchData(function(err1,result1){
						if(err1){
							console.error(err1);
						}
						 else{
							 if((result1.length)>0){
								 //console.log("stage: 2: "+result1[0].sensor_name+"--"+result1[0].location);
								 //console.log("stage: 2: "+result1[1].sensor_name+"--"+result1[1].location);
								 //res.render('user_landing_page',{"name":"name", "result1":"result1"});
								 
								 //res.send({status:200});
								 res.render('user_landing_page1',{result_set:result1});
							   //conn.end();
							 }
							 else{
								 console.log("not valid records");
								 res.render('edit_profile_user', {title:"No existing sensors"});
							 }
						 }
						 },query1);
						
					}
					else if(type === "vendor") {
						 res.render("index");
					 }
					 else
						 res.render("admin_landing_page");
				 }
			 
			else {
				 console.log("not valid records");
				 res.render('start1');
				 //res.render('/', {title:"No existing friends"});
			} 
		}	
			 },checkSignin);
	
};
		

exports.add_sensor_user = function(req, res) {
	var showLocations = "select distinct location as location from vendor;";
	console.log("Query is " +showLocations);
	var json_responses;
	pool1.fetchData(function(err,result){
		if(err){
			console.log(err);
			res.end(err);
			
		}
		else{
				if(result == undefined || result == null || result == 'undefined')
				{	
					json_responses = {"statusCode" : 401};
					res.send(json_responses);
				}
				else
				{
					
					json_responses = {"statusCode" : 200};
					//res.send(json_responses);
					console.log("result is " + result[0].location);
					res.render('add_sensor_user',{location:result});
				}	
		}
			
	},showLocations);//;
};

exports.delete_sensors = function(req, res) {
	var query1="select sensor_id, sensor_name, user_id, location, status, address from user where user_id='"+id+"';";
	pool1.fetchData(function(err1,result1){
			if(err1){
				console.error(err1);
			}
			 else{
				 if((result1.length)>0){
					 //res.send({status:200});
					 res.render('delete_sensors_user',{result_set:result1});
				   //conn.end();
				 }
				 else{
					 console.log("not valid records");
					 
				 }
			 }
			 },query1);
};

exports.unsubscribe_sensor = function(req, res) {
	var query1="delete from user where user_id='"+id+"' and sensor_name='"+req.body.sensor_name+"';";
	pool1.fetchData(function(err1,result1){
			if(err1){
				console.error(err1);
			}
			 else{
				 
					 res.send({status:200});
					 //res.render('delete_sensors_user',{result_set:result1});
				   //conn.end();
				 
			 }
			 },query1);
};

exports.userlandingpage2 = function(req, res) {
	var query1="select sensor_id, sensor_name, user_id, location, status, address from user where user_id='"+id+"';";
	pool1.fetchData(function(err1,result1){
			if(err1){
				console.error(err1);
			}
			 else{
				 if((result1.length)>0){
					 //res.send({status:200});
					 res.render('userlandingpage2',{result_set:result1});
				   //conn.end();
				 }
				 else{
					 console.log("not valid records");
					 res.render('edit_profile_user', {title:"No existing sensors"});
				 }
			 }
			 },query1);
};

exports.show_sensor_data = function(req, res) {
	var json_responses1 = {"statusCode" : 200};
	sensor_name_data = req.body.sensor_name;
	console.log("Inside name aasasdsd is "+ sensor_name_data);
	 res.send(json_responses1);
	};
	
	exports.show_sensor_data_1 = function(req, res) {
		mongo.connect(mongoURL, function(){
			console.log('Connected to mongo at: ' + mongoURL);
			var coll = mongo.collection('sensor_data');
	        console.log("coll is:" + coll);
	        console.log("sensor name is in mongo" +sensor_name_data );
	        //coll.find({sensor_name: sensor_name_bill});
	        coll.find({sensor_name : sensor_name_data}, {data:1}).toArray(function(err, user){
	        	if (user) {
	        		console.log(user[0].data);
	        		console.log("sensor_name: "+sensor_name_data);
	        		var ozone = new Array();
	        		var no2 = new Array();
	        		var ppm = new Array();
	        		var co = new Array();
	        		var so2 = new Array();
	        		
	        		var arr = user[0].data;
	        		for(var i=0; i<arr.length; i++){
	        			ozone.push(arr[i].Ozone);
	        			no2.push(arr[i].N2O);
	        			co.push(arr[i].CO);
	        			ppm.push(arr[i].PPM);
	        			so2.push(arr[i].SO2)
	        			//console.log("ozone: "+ozone);
	        		}
	        		
	        		for(var j = 0; j < ozone.length; j++)
	        		{
	        			console.log("Ozone data is " + ozone[j]);
	        		}
	        		
	        		res.render('show_sensor_data_user', {data : user[0].data, sensor_name : sensor_name_data, ozone:ozone , ppm:ppm, no2:no2, so2:so2, co:co});
	        	}
	        });
		});	
		
	};	
	
	
	

exports.billing_details = function(req, res) {
	res.render('billing_detail_user');
};
exports.edit_profile = function(req, res) {
	res.render('edit_profile_user');
};
exports.fetch_sensors_of_location = function(req, res) {
	var showSensorsDet = "select sensor_id, sensor_name, location, a.billing_id, address, status, a.vendor_id, b.description, b.payment_type from vendor as a left outer join billing_plan as b on a.billing_id = b.billing_id where a.location='"+req.body.location+"';";
	//console.log("Query is " +showLocations);
	var json_responses;
	//var x = document.getElementById("sel_location");
	//var strUser = x.options[x.selectedIndex].value;
	pool1.fetchData(function(err,result){
		if(err){
			console.log(err);
			res.end(err);
			
		}
		else{
				if(result == undefined || result == null || result == 'undefined')
				{	
					json_responses = {"statusCode" : 401};
					res.send(json_responses);
				}
				else
				{
					
					location_sensor_det = result;
					res.send(json_responses);
					
					//console.log("result is " + result[0].location);
					//res.render('buy_sensor_user',{sensor_det:result});
				}	
		}
			
	},showSensorsDet);//;//res.render('buy_sensor_user');
};


exports.subscribe_sensor = function(req, res) {
///var date1 = ;
	var addSensor_User = "insert into user (sensor_id, sensor_name, location, billing_id, status, address, user_id, buy_date, billing_desc, payment_cycle) values('"+req.body.sensor_id+"','"+req.body.sensor_name+"','"+req.body.location+"','"+req.body.billing_id+"','"+req.body.status+"','"+req.body.address+"','"+id+"', CURDATE(),'"+req.body.description+"','"+req.body.payment_type+"');";
	//console.log("Query is " +showLocations);
	var json_responses;
	//var x = document.getElementById("sel_location");
	//var strUser = x.options[x.selectedIndex].value;
	pool1.fetchData(function(err,result){
		if(err){
			console.log(err);
			res.end(err);
			
		}
		else{
				if(result == undefined || result == null || result == 'undefined')
				{	
					json_responses = {"statusCode" : 401};
					res.send(json_responses);
				}
				else
				{
					
					//location_sensor_det = result;
					res.send(json_responses);
					
					//console.log("result is " + result[0].location);
					//res.render('buy_sensor_user',{sensor_det:result});
				}	
		}
			
	},addSensor_User);//;//res.render('buy_sensor_user');
};

exports.show_sensorBill_4 = function(req, res) {
	
	var json_responses1 = {"statusCode" : 200};
	sensor_name_bill = req.body.sensor_name;
	console.log("Inside name is "+ sensor_name_bill);
	 res.send(json_responses1);
	};
	
	exports.show_sensorBill_5 = function(req, res) {
		console.log("Pawit5");
		
		var updateBill = "update user set bill = ((DATEDIFF(CURDATE(),buy_date)) + 1 * billing_desc) where user_id = '"+id+"' and sensor_name = '"+sensor_name_bill+"';";
		
		var json_responses;
		
		pool1.fetchData(function(err,result){
			if(err){
				console.log(err);
				res.end(err);
				console.log("Pawit");
			}
			else{
					
					if(result == undefined || result == null || result == 'undefined')
					{	
						json_responses = {"statusCode" : 401};
						console.log("Pawit1");
						res.send(json_responses);
					}
					else
					{
						var query1="select sensor_name, location, status, buy_date, billing_desc, bill from user where user_id='"+id+"' and sensor_name = '"+sensor_name_bill+"';";
						pool1.fetchData(function(err1,result1){
								if(err1){
									console.error(err1);
									console.log("Pawit2");
								}
								 else{
									 if((result1.length)>0){
										 
										 
										 console.log("Pawit3");
										 res.render('billing_detail_user',{sensor_billing:result1});
										 //var json_responses1 = {"statusCode" : 200};
										 //res.send(json_responses1);
										 
									 }
									 else{
										 console.log("not valid records");
										 console.log("Pawit4");
										 
									 }
								 }
								 },query1);

						
						
					}	
			}
				
		},updateBill);
		
	};	

exports.fetch_sensors_of_location1 = function(req, res) {
	
	res.render('buy_sensor_user',{sensor_det:location_sensor_det});
};

exports.admin = function(req, res) {
	res.render('admin_landing_page');
};
exports.show_users = function(req, res) {
	res.render('show_users_admin');
};
exports.show_vendors = function(req, res) {
	res.render('show_vendors_admin');
};
