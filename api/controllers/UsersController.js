/**
 * UsersController
 *
 * @description :: Server-side logic for managing Users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	
	signup: function(req, res){
		var data = req.body;
		// sails.log.debug("signup data", data);
		Users.add(data, function(err ,users){
			if(err){
				res.negotiate(err);
			}else{
				res.json(users);
			}
		});
	},

	login: function(req, res){
		var phone_number = req.body.phone_number;

		Users.login(phone_number, function(err, user){
			if(err){
				res.negotiate({msg: "You are not register on Mantra employe_sheet"});
			}else{
				res.json(user);
			}
		});
	},

	compute: function(req, res){
		sails.log.debug("req.body update", req.body);
		if(req.body && req.body.Mobile){
			Users.compute(req.body, function(err, user){
				if(err){
					res.negotiate(err);
				}else{
					res.json(user);
				}
			});		
		}else{
			res.json({status: 404, msg: "lcoation missing"});
		}

	},

	edit: function(req, res){
		if(req.body){
			Users.update(req.body, function(err, result){
				if(err){
					res.negotiate(err);
				}else{
					res.json(result);
				}
			});			
		}else{
			res.negotiate({msg:"req.body is empty"});
		}

	},

	list: function(req, res){
		Users.list(req.body, function(err, list){
			if(err){
				res.negotiate(err);
			}else{
				res.json(list);
			}
		});
	},

	store: function(req, res){
		sails.log.debug("dsfd");
		//Converter Class
		var Converter = require("csvtojson").Converter;
		var converter = new Converter({});

		//end_parsed will be emitted once parsing finished
		converter.on("end_parsed", function (jsonArray) {
		   console.log(jsonArray); //here is your result jsonarray
		   _.map(jsonArray, function(data){
		   		data.isOnline = false;
		   		data.timer = false;
		   		ES.index(data, {id: data.s}, function(err, result){
		   			if(err){
		   				sails.log.error("ES :index user err", err);
		   			}else{
		   				sails.log.debug("ES: user indexed", result);
		   			}
		   		});
		   });

		});
		require("fs").createReadStream("assets/templates/employe_sheet.csv").pipe(converter);
	}

};

