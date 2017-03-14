var request = require('request');

for(var i=1;i<=5;i++){
	(function(i){
		console.log("for");
		request.post({
	        url:"http://127.0.0.1:3017",
		    json:{
		    	"owner":"bottle"+i,
		    	"type":"male",
		    	"content":"content"+i
		    }
		});
	})(i);
}

for(var i=6;i<=10;i++){
	(function(i){
		console.log("for 2");
	    request.post({
	        url:"http://127.0.0.1:3017",
			json:{
				"owner":"bottle"+i,
				"type":"female",
				"content":"content"+i
			}
		});
	})(i);
}







