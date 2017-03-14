var mongoose = require('mongoose');
var mongoose.connect('mongodb://username:userspass123@ds145369.mlab.com:45369/drifter');

var bottleModel = mongoose.model('Bottle',new mongoose.Schema({
	bottle:Array,
	message:Array
},{
	collection:'bottles'
}));

export.save = function(picker,_bottle,callback) {
	var bottle = {bottle:[],message:[]};
	bottle.bottle.push(picker);
	bottle.message.push([_bottle.owner,_bottle.time,_bottle.content]);
	bottle = new bottleModel(bottle);
    bottle.save(function(err){
    	callback(err);
    });
};

exports.getAll = function(user,callback){
	bottleModel.find({"bottle":user},function(err,bottles){
		if(err){
			return callback({code:0,msg:"liebiao shi bai"});
		}
		callback({code:1,msg:bottles});
	});
};

exports.getOne=function(_id,callback){
	bottleModel.findById(_id,function(err,bottle){
		if(err){
			return callback({code:0,msg:"duqu shibai "});
		}
		callback({code:1,msg:bottle});
	});
};

exports.reply = function(_id,reply,callback){
	reply.time = reply.time||Date.now();
	bottleModel.findById(_id,function(err,_bottle){
		if(err){
			return callback({code:0,msg:"huifu shibai "});
		}
		var newBottle = {};
		newBottle.bottle = _bottle.bottle;
		newBottle.message = _bottle.message;
		if(newBottle.bottle.length === 1){
			newBottle.bottle.push(_bottle.message[0][0]);
		}
		newBottle.message.push([reply.user,reply.time,reply.content]);
		bottleModel.findByIdAndUpdate(_id,newBottle,function(err,bottle){
			if(err){
				return callback({code:0,msg:"huifu shibai "});
			}
			callback({code:1,msg:bottle});
		});
	});
};

exports.delete = function(_id,callback){
	bottleModel.findByIdAndRemove(_id,function(err){
		if(err){
			return callback({code:0,msg:"shanchu shibai "});
		}
		callback({code:1,msg:"shanchu chenggong "});
	});
};