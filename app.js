var express = require('express')
  , routes = require('./routes')
  , sensor = require('./routes/sensor')
  , user = require('./routes/users')
  , http = require('http')
  , vendor = require('./routes/vendor')
  , bodyParser = require('body-parser')
  ,  onclick = require('./routes/onclick')
  , path = require('path');
var app = express();
var mongoURL = "mongodb://localhost:27017/cmpe281";
var mongo = require("./routes/mongo");

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
/*app.post('/vendor', function(req,res) {
	var arr1 = req.body;
	console.log(req.body);
	mongo.connect(mongoURL, function(){
		console.log('Connected to mongo at: ' + mongoURL);
		var coll = mongo.collection('sensor_data');
        console.log("coll is:" + coll);
        
        coll.insert({"vendor_id":2, "sensor_name":req.body.sensor_name, data : [
                                                                                                                              {
                                                                                                                            	    DateObserved: new Date().getTime(),
                                                                                                                            	    Location : req.body.Location,
                                                                                                                            	    Latitude:  req.body.Latitude,
                                                                                                                            	    Longitude:  req.body.Longitude,
                                                                                                                            	    Ozone:  req.body.Ozone,
                                                                                                                            		PPM:  req.body.PPM,
                                                                                                                            		N2O:  req.body.SO2,
                                                                                                                            		CO:  req.body.N2O,
                                                                                                                            		SO2:  req.body.CO
                                                                                                                            	  
                                                                                                                              }]}, function(err, user){
			console.log("user is:" + user);
			if (user) {
				
				// This way subsequent requests will know the user is logged in.
				//req.session.email = user.email;
				res.code = "200";
				res.value = "Succes Login";
		        console.log("ethhet ethhet");
		        
	}
	else{
		res.code = "401";
		res.value = "Failed Login";
	}
			
	//callback(null, res);
});
	           });	
});*/
app.get('/', routes.index);
//app.get('/current_loc', sensor.current_loc);
app.get('/profile', routes.profile);
app.get('/controller', routes.controller);
app.get('/admin_landing1', routes.admin_landing1);
app.get('/sensor', routes.sensor);
app.get('/index', routes.vendor_main);
app.post('/fetch_sensors', routes.fetch_sensors);
app.get('/add_sensor', routes.add_sensor);
app.get('/add_controller', routes.add_controller);
app.post('/save_sensor', routes.save_sensor);
app.post('/save_controller', routes.save_controller);
app.post('/fetch_controllers', routes.fetch_controllers);
app.get('/billing', routes.billing_info);
app.get('/monitor', routes.monitor);
app.get('/configure', routes.configure);
app.get('/onclick',onclick.checkbutton);
app.get('/togglesensor',vendor.togglesensor);
app.get('/fetch_data',routes.fetch_data);
app.post('/toggle_sensor',routes.toggle_sensor);
app.post('/delete_sensor',routes.delete_sensor);
app.post('/fetch_sensors_of_controller', routes.fetch_sensors_of_controller);
app.get('/fetch_sensors_of_controller', routes.fetch_sensors_of_controller1);
app.get('/configure_controller_sensor', routes.fetch_sensors_of_controller1);
///////////////////////AMITESH/////////////////////////////////////////
app.get('/SignIn', routes.signIn);
app.get('/SignUp', routes.signUp);
app.post('/userLandingPage', routes.signInCheck);
app.post('/show_sensorBill_4', routes.show_sensorBill_4);
app.get('/show_sensorBill_5', routes.show_sensorBill_5);
app.get('/add_sensors_user', routes.add_sensor_user);
app.get('/delete_sensors', routes.delete_sensors);
app.post('/unsubscribe_sensor', routes.unsubscribe_sensor);
app.post('/show_sensor_data', routes.show_sensor_data);
app.get('/show_sensor_data_1', routes.show_sensor_data_1);
//app.get('/billing_details', routes.billing_details);
app.get('/edit_profile', routes.edit_profile);
app.get('/userlandingpage2', routes.userlandingpage2);
app.post('/signupInsert', routes.signupInsert);
/////////////////AMITESH ADMIN////////////////////
app.get('/admin', routes.admin);
app.get('/show_users', routes.show_users);
app.get('/show_vendors', routes.show_vendors);
//app.get('/current_loc', sensor.current_loc);
app.post('/fetch_sensors_of_location', routes.fetch_sensors_of_location);
app.get('/fetch_sensors_of_location', routes.fetch_sensors_of_location1);

app.post('/subscribe_sensor', routes.subscribe_sensor);
http.createServer(app).listen(app.get('port'), function(){
	  console.log('Express server listening on port ' + app.get('port'));
	});

