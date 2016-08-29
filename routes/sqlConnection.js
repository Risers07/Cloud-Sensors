var mysql = require("mysql");
function getConnection(){
	var pool = mysql.createPool({
		connectionLimit:100,
		host : 'localhost', 
		user : 'root',
		password : '12345',
		database : 'cmpe281'
	});
	return pool;
} 

function fetchData(callback, sqlQuery){
		//console.log("query is " + sqlQuery);
		var pool = new getConnection();
		pool.getConnection(function(err, connection){
			if(err){
				console.log(err);
			}
			else{
				connection.query(sqlQuery, function(err,result){
					if(err){
						console.log(err);	
					}
					else{
						console.log(sqlQuery);
						console.log(result);
						callback(null, result);
					}
				});
				connection.release();
				//connection.end();	
			}
		});
}

exports.fetchData = fetchData;
