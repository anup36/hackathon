from flask import Flask,render_template,request,session,redirect,make_response,jsonify
from pymongo import MongoClient
import pymongo
from bson.objectid import ObjectId
import re,os,hashlib,random, string ,time , urllib2,time 
import requests , datetime


app = Flask(__name__)


mongodb  = MongoClient()
jobdb = mongodb.jobdb

@app.route("/skill",methods=['POST','GET'])
def skillSet():
	reg = re.compile(request.form['skills'], re.IGNORECASE )
	return common({"skills" : { "$regex" : request.form['skills'] } })


@app.route("/location",methods=['POST','GET'])
def locationFilter():
	reg = re.compile(request.form['location'] , re.IGNORECASE)
	return common({"location" : { "$regex" : reg   }   })

@app.route("/experience",methods=['POST','GET'])
def experience():
	return common({ "maxE" : {  "$lte" : int(request.form['experience'] )   }  })

@app.route("/")
def index():
	return render_template("loginpage.html")

@app.route("/socialregister",methods=['POST'])
def socialregister():
	try:		
		userCollection = jobdb.user
		result = userCollection.find_one({ "email" : request.form['email'] } )
		if result is None:
			salt=randomWord()
			password	=	hashlib.sha224( randomWord(5) ).hexdigest() + salt
			
			if request.form['createdby'] == "fb":
				url = "https://graph.facebook.com/oauth/access_token"
				querystring = {"client_id":"338514119500740","client_secret":"0637fe66849c2c0e774e754393f6254e","grant_type":"fb_exchange_token","fb_exchange_token": request.form['accesstoken'] }
				response = requests.request("GET", url,  params=querystring)
				if response.text[:12] !="access_token":
					return operationFailed("Not authorized")
			
			post =	{ "name" : request.form['name'] , "createdby" : request.form['createdby'] , "email" : request.form['email'] , "accesstoken" : request.form['accesstoken'], "socialid" : request.form['socialid'] ,  "password" : password ,  "imageurl" : request.form['image'], "dateofcreation" : time.time() , "active" : 1   }
			userid=userCollection.insert( post )
			
			
			
			session['userdetails'] = { 'userid' : str(userid) , "name" : request.form['name'] , "email" : request.form['email']  ,  "hash" : password[56:] , "imageurl" : request.form['image'] }
			return jsonify({ "status" : 200 })			
		else:
				if request.form['createdby'] == "fb":
					url = "https://graph.facebook.com/oauth/access_token"
					querystring = {"client_id":"338514119500740","client_secret":"0637fe66849c2c0e774e754393f6254e","grant_type":"fb_exchange_token","fb_exchange_token": request.form['accesstoken'] }
					response = requests.request("GET", url,  params=querystring) 
					if response.text[:12] !="access_token":
						return operationFailed("Not authorized")
			
				session['userdetails'] = { 'userid' : str(result['_id']) , "name" : result['name'] , "email" : result['email']  , "imageurl" : result['imageurl'] , "hash" : result['password'][56:] }
				return jsonify({ "status" : 200  })
			
					
	except Exception as e:
		print e
		return operationFailed("Error in "+e.message)



def common(query,paginate=0,limit_num=10):
	jobSet = jobdb.JobPosting
	result    = jobSet.find(query).skip(paginate).limit(limit_num)
	filtered_Result = []
	for x in result:
		x['_id'] = str(x['_id'])
		filtered_Result.append(x)
	return jsonify({"data" : filtered_Result })	


def operationFailed(msg):
	return jsonify({ "message" : msg })

def randomWord(length=9):
   return ''.join(random.choice(string.lowercase) for i in range(length))

if __name__ =="__main__":
	app.secret_key="h1o56p2e9it4w18o4rk67s12t9h00i1s89time"
	app.run(host="0.0.0.0",debug=True,port=8080,threaded=True)