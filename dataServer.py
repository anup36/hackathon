from flask import Flask,render_template,request,session,redirect,make_response,jsonify,redirect
from pymongo import MongoClient
import pymongo
from bson.objectid import ObjectId
import re,os,hashlib,random, string ,time , urllib2,time 
import requests 
import views as view
import hashlib
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
import time
import requests
from datetime import datetime
app = Flask(__name__)


mongodb  = MongoClient()
caterdb = mongodb.cateringDB

@app.route("/testlink",methods=['GET'])
def test():
	return "hello world"

@app.route("/transactions",methods=['GET','POST'])
def transaction():
	try:
		user_id = request.form['userid']
		amount  = float(request.form['amount'])
		remarks = request.form['remarks']
		product_id = request.form['product_id']
		userCollection = caterdb.transactions
		userCollection.insert({"product_id" : product_id , "user_id" : user_id , "amount" : amount , "remarks" : remarks,"createdAt" : datetime.now(),"status" : False })
		adminCollection = caterdb.admin
		adminCollection.update({ "user" : "ramesh" },{  "$inc" : {  "revenue" : amount   }  })
		return jsonify({"status" : 200 , "message" : "transaction successful" })
	except Exception as e:
		return jsonify({"status" : 400 , "message" : str(e) })

@app.route("/transactions/details")
def transactionDetails():
	try:
		userCollection = caterdb.transactions
		count=0
		result = userCollection.find().sort("createdAt",-1)
		dump=[]
		for x in result:
			x['_id'] = str(x['_id'])
			dump.append(x)

			count+=1
		return jsonify({"status" : 200 , "data" : dump , "count" : count})
	except Exception as e:
		return jsonify({"status" : 400 , "message" : str(e) })

@app.route("/self")
def selfdetails():
	try:
		userCollection = caterdb.admin
		result = userCollection.find_one()
		result['_id'] = str(result['_id'])
		return jsonify({"data" : result , "status" : 200})
	except Exception as e:
		return jsonify({"status" : 400 , "message" : str(e) })

@app.route("/autopunch",methods=['GET','POST'])
def autoPunch():
	try:
		print request.json
		
		if request.json['status'] == 'in':
			email = request.json['email']
			password = request.json['password']
			driver =webdriver.Firefox()
			driver.get("http://hr.mantralabsglobal.com")
			elem = driver.find_element_by_name("txtUsername")
			#elem.send_keys("abhishek.rana@mantralabsglobal.com")
			elem.send_keys(email)
			elemPass = driver.find_element_by_name("txtPassword")
			#elemPass.send_keys("abc123")
			elemPass.send_keys(password)
			elemBtnLogin = driver.find_element_by_id("btnLogin")
			elemBtnLogin.send_keys(Keys.RETURN)
			time.sleep(6)
			driver.get("http://hr.mantralabsglobal.com/symfony/web/index.php/attendance/punchIn")
			elemPunchInBtn = driver.find_element_by_id("btnPunch")
			time.sleep(10)
			elemPunchInBtn.send_keys(Keys.RETURN)
			print elemPunchInBtn , "PUNCH BUTTON ______________________$$$$$$$"
			return jsonify({"status" : 200 })
		else:
			return jsonify({"status"  : 200 })
	except Exception as e:
		return jsonify({ "status" : 400 , "message" : str(e) })

@app.route("/adminlogin",methods=['POST'])
def adminLogin():
	try:
		m=hashlib.md5()
		m.update(request.form['password'].encode('utf-8'))
		password = m.hexdigest()
		userCollection = caterdb.admin
		result = userCollection.find_one({ "user" : request.form['user'], "password" : password } )
		print request.form['user'], password
		if result is None:
			return jsonify({"status" : 400 , "message" : "invalid login" })
		session['userdetails'] = {"user" : request.form['user'] }
		return jsonify({"status" : 200 , "message" : "success"})
	except Exception as e:
		return jsonify({"status" : 400 , "message" : str(e) })
@app.route('/user/list',methods=['GET'])
def userList():
	data = [{ "id" : "3242342342", "name" : "abhishek" , "phone" : 9432123123  },{ "id" : "3242342342", "name" : "abhisheksingh" , "phone" : 9432123123  }  ]
	return jsonify({ "data" : data , "status" : 200 })

@app.route("/item")
def userItems():
	try:
		if session['userdetails']:
			return render_template("/additems")
	except Exception as e:
		return jsonify({ "status" : 400 , "message" : str(e) })


@app.route("/location",methods=['POST','GET'])
def locationFilter():
	reg = re.compile(request.form['location'] , re.IGNORECASE)
	return common({"location" : { "$regex" : reg   }   })

@app.route("/maxE",methods=['POST','GET'])
def experience():
	return common({ "maxE" :  int(request.form['maxE'] )     })

@app.route("/")
def index():
	return render_template("login.html")

@app.route("/logout")
def logoutUser():
	session.pop('userdetails',None)
	return redirect("/")

@app.route("/userStory")
def userPage():
	try:
		if session['userdetails']:
			return render_template("index.html")
	except:
		return redirect("/")

@app.route("/profile")
def profile():
	#try:
	#	if session['userdetails']:
			return render_template("profile.html")
	#except:
#		return redirect("/")

@app.route("/dashboard")
def dashboard():
	try:
		if session['userdetails']:
			return render_template("index.html")
	except:
		return redirect("/")

@app.route("/jobfeedsFilter")
def ajaxJobFeedrs():
	try:
		if session['userdetails']:
			jobSet 	  = jobdb.JobPosting
			ids = request.args.get("ids")
			filters = request.args.get("filter")

			#result    = jobSet.find(   ).limit(10)

			filtered_Result = []
			for x in result:
				x['_id'] = str(x['_id'])
				filtered_Result.append(x)
			return jsonify({"data" : filtered_Result })	
	except:
		return redirect("/")		


@app.route("/feeds")
def feeds():
	try:
		if session['userdetails']:
			return render_template("modals.html")
	except:
		return redirect("/")

@app.route("/item/add",methods=['POST'])
def itemAdd():
	try:
		if session['userdetails']:
			userCollection = caterdb.products
			print request.form
			userCollection.insert({"name" : request.form['name'] , "price" : request.form['price'] , "category" : request.form['category'] , "image" : request.form['image'] })
			return jsonify({"status" : 200})
	except Exception as e:
		return jsonify({"status" : 400 , "message" : str(e) })			
@app.route("/items")
def items():

			userCollection = caterdb.products
			d=[]
			result = userCollection.find()
			for x in result:
				x['_id'] = str(x['_id'])
				d.append(x)
			return jsonify({"data" : d})
	

@app.route("/counts")
def count():
	try:
		if session['userdetails']:
			jobSet = jobdb.JobPosting
			totalJobs = jobSet.find()
			counts=0
			maxE = 0
			for x in totalJobs:

				maxE = (maxE + x['maxE'] )/2

				counts+=1
		return jsonify({ "data" : {  "JobPosting" : counts , "averageExp" : maxE  } })
	except:
		return redirect("/")

@app.route("/jobfeeds")
def ajaxJobFeeds():
	try:
		if session['userdetails']:
			jobSet = jobdb.JobPosting
			ids = request.args.get("ids")
			signal = request.args.get("signal")
			print ids,signal
			result=[]
			if signal == "1":
				if ids!="0":
					result    = jobSet.find( { "_id" : { "$gt" :  ObjectId( ids )   }  }  ).limit(10)
				else:
					result    = jobSet.find( ).limit(10)
			else:
				print "LESS THAN"
				result    = jobSet.find( { "_id" : { "$lt" :  ObjectId( ids )   }  }  ).limit(10) 
			filtered_Result = []
			for x in result:
				x['_id'] = str(x['_id'])
				filtered_Result.append(x)
			return jsonify({"data" : filtered_Result })	
	except:
		return redirect("/")		


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
				print "sss"
				session['userdetails'] = { 'userid' : str(result['_id']) , "name" : result['name'] , "email" : result['email']  , "imageurl" : result['imageurl'] , "hash" : result['password'][56:] }
				return jsonify({ "status" : 200  })
			
					
	except Exception as e:
		print e
		return operationFailed("Error in "+e.message)


if __name__ =="__main__":
	app.secret_key="h1o56p2e9it4w18o4rk67s12t9h00i1s89time"
	app.run(host="0.0.0.0",debug=True,port=8080,threaded=True)