
var amqp = require('amqp')
  , crypto = require('crypto');
 
var TIMEOUT=80000; //time to wait for response in ms
var CONTENT_TYPE='application/json';
var CONTENT_ENCODING='utf-8';
var self;
 
exports = module.exports = AmqpRpc;
 
function AmqpRpc(connection){
  self = this;
  this.connection = connection; 
  this.requests = {}; //hash to store request in wait for response
  this.response_queue = false; //placeholder for the future queue
}


AmqpRpc.prototype.makeRequest = function(queue_name, content, callback){
	
  self = this;
  
  console.log("inside amqprpc");
  console.log("queue_name is " + queue_name);
  console.log("msg_payload is " + content);
  console.log("self is"+ self);
  //generate a unique correlation id for this call
  var correlationId = crypto.randomBytes(16).toString('hex');
  console.log("coreltn id" + correlationId);
  
  //create a timeout for what should happen if we don't get a response
  var tId = setTimeout(function(corr_id){
    //if this ever gets called we didn't get a response in a 
    //timely fashion
    callback(new Error("timeout " + corr_id));
    //delete the entry from hash
    delete self.requests[corr_id];
  }, TIMEOUT, correlationId);
 
  //create a request entry to store in a hash
  var entry = {
    callback:callback,
    timeout: tId //the id for the timeout so we can clear it
  };
  console.log("callback is" + callback)
  
  //put the entry in the hash so we can match the response later
  self.requests[correlationId]=entry;
  
	  console.log("requests is jkbjbj: "+ entry);
  
  //make sure we have a response queue
    self.setupResponseQueue(function(){
	  
    //put the request on a queue
    self.connection.publish(queue_name, content, { //first point of request on server
      correlationId:correlationId,
      contentType:CONTENT_TYPE,
      contentEncoding:CONTENT_ENCODING,
      replyTo:self.response_queue});
    
    
  });
};
 
 
AmqpRpc.prototype.setupResponseQueue = function(next){
	console.log("inside setupresponce");
  //don't mess around if we have a queue
  if(this.response_queue) return next();
  console.log(this.response_queue);
  self = this;
  //create the queue
  
  self.connection.queue('', {exclusive:true}, function(q){  
	  
    //store the name
    self.response_queue = q.name;
    console.log("response_queue is:" + q.name);
    //subscribe to messages
    q.subscribe(function(message, headers, deliveryInfo, m){    
      //get the correlationId
    	console.log("message is" +  message);
      var correlationId = m.correlationId;
      
      
      console.log("correlationId"+correlationId);
      console.log("\m.replyTo"+m.replyTo);
      //is it a response to a pending request
      if(correlationId in self.requests){
        //retreive the request entry
        var entry = self.requests[correlationId];
        console.log("entry"+entry);
        //make sure we don't timeout by clearing it
        clearTimeout(entry.timeout);
        //delete the entry from hash
        delete self.requests[correlationId];
        //callback, no err
        entry.callback(null, message);
      }
    });
    return next();    
  });
};


