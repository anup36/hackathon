/**
 * Users.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */
var uuid = require('node-uuid');
module.exports = {

  attributes: {

  },

    add: function(data, cb){
        ES.index(data, {id: uuid.v4()}, function(err, result){
        	if(err){
        		sails.log.error("ES :index user err", err);
        		cb(err);
        	}else{
        		cb(null, result);
        	}
        });  	
    },

    login: function(data, cb){
    	// sails.log.debug("data", data);
    	var query = {"query":{"bool": {"should": [{ "term": { "Mobile": data.Mobile}},{ "term": { "Emergency Contact No": data.Mobile}}]}}};
    	ES.search(null, query, true, function(err, user){
    		if(err || user.hits.hits.length <= 0){
    			sails.log.error("User not found");
            cb({status: 404, msg: "User not found"});
    		}else{
    			cb(null, {status:200, userDetails:user});
    		}
    	});
    },

    compute: function(data, cb){
        Users.login(data, function(err, user){
        	if(err){
        			cb({status: 404, msg: "You are not register on Mantra employe_sheet"});
        		}else{
        			// sails.log.debug("location", user);
        		var userId = (user.userDetails) ? user.userDetails.hits.hits[0]._id : user._id;
                var user = _.pluck(user.userDetails.hits.hits, "_source");
                var dataObj =  _.pick(data, 'online', 'email', 'punchIn_pass');
                sails.log.debug("status", dataObj);
        		ES.update(dataObj, {id: userId}, function(err, result){
        			if(err){
        				sails.log.error("User update err:",err);
        				cb(err);
        			}else{
        				sails.log.debug("User updated", dataObj.online);
                        result.user = user;
                        sails.log.debug("result", result);
                        cb(null, result);
                        var query = {
                                   "query" : {
                                      "filtered" : {
                                         "filter" : {
                                            "exists" : {
                                               "field" : "email"
                                            }
                                         },
                                         "query" : {
                                            "match" : {
                                               "_id" : userId
                                            }
                                         }
                                      }
                                   }
                                };
                        ES.search(null, query, true, function(err, user){
                            if(err || user.hits.hits.length <= 0){
                                sails.log.error({msg: "PLease Subscribe to Automate PunchIn feature"});
                            }else{
                                var user = _.pluck(user.hits.hits, "_source");
                                user = user[0];
                                var data = {
                                    status: (dataObj.online) ? 'in' : 'out',
                                    email: user.email,
                                    password: user.password
                                 };
                                checkUserStatusAndPunchINOUT(data);
                            }
                        });
                        // if(!data.online){
                        //     ES.search()
                        //     var clearTimeOutId = setTimeOut(function(){
                        //         console.log("Automate PunchIn");
                        //     }, 3000);


                        //     ES.update({"TimeOutId": clearTimeOutId}, {id: userId}, function(err, updatedUser){
                        //         if(err){
                        //             sails.log.error("ES: user TimeOutId err");
                        //         }ese{
                        //             sails.log.debug("ES: user TimeOutId updated", updatedUser);
                        //         }
                        //     });
                        // }
        			}
        		});
            }
        });
    },

    update: function(data, cb){
        sails.log.debug("data", data);
        ES.update(data, {id: data.userId}, function(err, result){
            if(err){
                cb(err);
            }else{
                cb(null, result);
            }
        });
    },


    list: function(data, cb){
    	var query ={
    			"query": {
                "bool": {
                  "must": [
                    {
                      "term": {
                        "online": true
                      }
                    }
                  ]
                }
            }
        };
    	ES.search({size: 200}, query, true, function(err, result){
    		if(err){
    			cb(err);
    		}else{
    			cb(null, {status: 200, data: _.pluck(result.hits.hits, "_source")});
    		}
    	});
    }


};

checkUserStatusAndPunchINOUT = function(data){
    var options = {
        url: 'http://192.168.0.143:8080/' +'autopunch',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body:{
            status : data.status,
            email : data.email, 
            password  : data.password
        },
        json: true
    };
    // sails.log.debug("options", options);
    pyService.invoke(options, function(err, result){
        if(err){
            sails.log.error(err);
        }else{
            sails.log.debug(null, result);
        }
    });
};

