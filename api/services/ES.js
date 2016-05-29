var elasticsearch = require('elasticsearch');
var host = 'http://localhost:9200';

var client = new elasticsearch.Client({
  host: host
});


exports.index = function(doc, options, cb){
	// sails.log.debug('indexing doc ', doc, 'with options', options);
	client.index({
	  index: options && options.index ? options.index : 'pkb',
	  type : options && options.type ? options.type : 'users',
	  body: doc,
	  id: options.id
	}, function (err, resp) {
	  	if(err){
	  		cb(err);
	  	}else {
		  	cb(null, resp);	  		
	  	}
	});
};

exports.update = function(data, options, cb){
    // sails.log.debug('data', data, 'options', options);
    var body = {
        doc: data
    };
    client.update({
        index: options && options.index ? options.index : 'pkb',
        type : options && options.type ? options.type : 'users',
        id: options.id,
        body: body,
    }, function(err, resp){
        if(err){
            console.log("ES Error", err);
            cb(err);
        }else {
            // resp = _.pluck(resp.hits.hits, "_source");
            // console.log('Es Resp',resp);
            cb(null, resp);
        }        
    })            
};

exports.search = function(options, query, override, cb) {
	var body = override ? query : { "query": query };

	// console.log('ES: search query ', JSON.stringify(body));
	client.search({
		index: options && options.index ? options.index : 'pkb',
		type : options && options.type ? options.type : 'users',
		body: body,
		size: options && options.size ? options.size : 10
	}, function(err, resp){
		if(err){
			cb(err);
		}else {
            // resp = (resp.aggregations) ? resp.aggregations.categories.buckets : _.pluck(resp.hits.hits, "_source");
			cb(null, resp);
		}
	});
};

exports.delete = function(options, cb){
    // var body = query;
    // console.log('ES: search query ', body);
    console.log("options", options)
    client.delete({
        index: options && options.index ? options.index : 'hotify',
        type : options && options.type ? options.type : 'article',
        id: options.id
    }, function (error, response) {
        cb(error, response);
    });
};

exports.isOnline = function(location, options, cb) {
    var dataQuery = {
    "query": {
        "bool" : {
            "filter" : {
                "geo_distance" : {
                    "distance" : "1km",
                        "location" : location
                        }
                    }
                }
        }
    };
    client.search({
        index: options && options.index ? options.index : 'pkb',
        type : options && options.type ? options.type : 'users',
        body: dataQuery        
    }, function(err, resp){
        if(err){
            cb(err);
        }else{
            resp = _.pluck(resp.hits.hits, "_source");  
            cb(null, resp);
        }
    });

};

exports.count = function(query, options, override, cb) {
    var body = override ? query : { query: {match: query} };
    // sails.log.debug('body', body);
    client.search({
        index: options && options.index ? options.index : 'hotify',
        type : options && options.type ? options.type : 'article',
        body: body
        // size: options && options.size ? options.size : 10
    }, function(err, resp){
        // sails.log.debug('resp ', resp);
        if(!err && resp.hits.total){
            resp = resp.hits.total;
            cb(null, resp);            
        }else {
            sails.log.error("ES Error", err);
            cb(err);
        }
    });
};  
