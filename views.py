from flask import Blueprint , jsonify , request , session, redirect
from pymongo import MongoClient
from decimal import *
import pymongo
from werkzeug import secure_filename
from bson.objectid import ObjectId
import re,os,hashlib,random, string ,time , urllib2,time 
import requests , datetime

mongodb  = MongoClient()
userdb = mongodb.userDB

api_module = Blueprint('views',__name__)

@api_module.route("/")
def index():
	return render_template("loginpage.html")

@api_module.route("/logout")
def logoutUser():
	session.pop('userdetails',None)
	return redirect("/")