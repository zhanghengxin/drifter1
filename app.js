var express = require('express');
var redis = require('./models/redis.js');
var bodyParser=require('body-parser');
var jsonParser = bodyParser.json();
var mongodb = require('./models/mongodb.js');

var app = express();

app.use(bodyParser.urlencoded({
  extended: true
}));

app.post('/',jsonParser,function (req, res) {
	console.log("post data");
	if (!(req.body.owner && req.body.type && req.body.content)) {
		if (req.body.type && (["male", "female"].indexOF(req.body.type) === -1)) {
			return res.json({code:0,msg:"lei xing cuo wu"});
		}
		return res.json({code:0,msg:"xin xi bu wan quan "});
	}
	redis.throw(req.body,function(result){
		res.json(result);
	});
});

// app.post('/',function(req,res){
// 	console.log("post data");
// })

app.get('/',function(req,res){
	console.log("get res");
	if(!req.query.user){
		return res.json({
			code:0,
			msg:"xin xi bu wan zheng "
		});
	}
	if(req.query.type && (["male","female"].indexOf(req.query.type) === -1)){
		return res.json({
			code:0,
			msg:"lei xing cuo le 啊"
		});
	}
	redis.pick(req.query,function(result){
		if(result.code === 1){
			mongodb.save(req.query.user,result.msg,function(err){
				if(err){
					return res.json({code:0,msg:"qingchongshi"});
				}
				return res.json(result);
			});
		}
		res.json(result);
	});
});
app.post('/back',function(req,res){
	redis.throwBack(req.body,function(result){
		res.json(result);
	})
})
app.get('/user/:user',function(){
	mongodb.getAll(req.params.user,function(result){
		res.json(result);
	});
});

app.get('/bottle/:_id',function(req,res){
	mongodb.getOne(req.params._id,function(result){
		res,json(result);
	});
});

app.listen(3017);

console.log("listening @ 3017");
 









