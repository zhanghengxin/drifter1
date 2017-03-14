var redis = require('redis');
var client = redis.createClient('3500');
var client2 = redis.createClient('3500');
var client3 = redis.createClient('3500');

exports.throw = function(bottle,callback){
	client2.select(2,function(){
		client2.get(bottle.owner,function(err,result){
			if(result>=10){
				return callback({code:0,msg:"mei ji hui la"});
			}
			client2.incr(bottle.owner,function(){
				client2.ttl(bottle.owner,function(err,ttl){
					if(ttl === -1){
					    client2.expire(bottle.owner,86400);
				    }
				});
			});
		});
	});
	bottle.time = (bottle.time || Date.now());
	var bottleID = Math.random().toString(16);
	var type = {male:0,female:1};

	client.SELECT(type[bottle.type],function(){
		client.HMSET(bottleID,bottle,function(err,result){
			if(err){
				return callback({code:0,msg:"cuo wu"});
			}
			callback({code:1,msg:result});
			client.EXPIRE(bottleID,86400);
		});
	});
}

exports.pick = function(info,callback){
	client3.select(3,function(){
		client3.get(info.user,function(err,result){
			if(result>=10){
				return callback({code:0,msg:""});
			}
			client3.incr(info.user,function(){
				client3.ttl(info.user,function(err,ttl){
					if(ttl === -1){
						client3.expire(info.user,86400);
					}
				});
			});
		});
	});

	if(Math.random()<=0.2){
		return callback({code:0,msg:"小星星"});
	}
	var type = {all:Math.round(Math.random()),male:0,female:1};
	info.type = info.type || 'all';
	client.select(type[info.type],function(){
		client.randomkey(function(err,bottleID){
			if(Math.random()<=0.5){
				return callback({code:0,msg:"此海为死海"});
			}
			if(!bottleID){
				return callback({code:0,msg:"kongkong"});
			}
			client.hgetall(bottleID,function(err,bottle){
				if(err){
					return callback({code:0,msg:"po le"});
				}
				callback({code:1,msg:bottle});
				client.del(bottleID);
			});
		});
	});
}

exports.throwBack=function(bottle,callback){
	var type = {male:0,female:1};
	var bottleID = Math.random().toString(16);
	client.select(type,function(){
		client.HMSET(bottleID,bottle,function(err,result){
			if(err){
				return callback({code:0,msg:"!!"});
			}
			callback({code:1,msg:result});
			client.pexpire(bottleID,bottle.time+86400000-Date.now());
		});
	});
}















