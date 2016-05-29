var request = require('request');


exports.invoke = function (options, cb) {
    // var headers = (options.headers) ? options.headers : 'Content-Type: application/json';
    var http = options.http;

    var req_options = options;
    
    if(options.method == 'POST' || options.method == 'PUT'){
    	req_options.body = options.body;
    }
    
	var callback = function(error, response, body) {
        if(error){
            if(http)
                http.res.serverError('API: '+req_options.url+' seems to be having an issue', error);
            else
                cb({status: 503, message: 'API: '+req_options.url+' seems to be having an issue', error: error});
        }else if (response.statusCode == 200) {
            cb(null, body);
        }else if (response.statusCode == 403) {
            cb(JSON.parse({status: 403, body: response.body}));
        }else if (response.statusCode == 422) { 
            cb(null, JSON.parse(body));
            // cb(JSON.parse({status: 422, body: response.body}));
        }else if(response.statusCode == 404){
            cb({status: 404, msg:body});
        }else if (response.statusCode == 500) {
            cb({status: 500, body: response.body});
        }else{
            if(http)
                http.res.serverError(response.body);
            else
                cb({status: 500, message: response.body});
        }
    };

    // Set up the request
    var req = request(req_options, callback);
    // console.log("req", req);
}

