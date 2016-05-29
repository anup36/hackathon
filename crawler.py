from bs4 import *
from pymongo import MongoClient
import urllib2, time, os

mongodb  = MongoClient()
jobdb = mongodb.jobdb
excetionPreventor=1
def initializeUrls(url_Link):
	linksRecord = jobdb.linksRecord
	link = urllib2.urlopen( url_Link ).read()
	soup = BeautifulSoup(link,"html.parser")
	s 	 = soup.find_all("div", { "class" : "multiColumn colCount_four" } )
	for x in s:
		links = x.find_all("a")
		for y in links:
			#print y['href']
			result = linksRecord.find_one({ "urltitle" : y['href'] })
			if result is None:
				linksRecord.insert({ "urltitle" : y['href'] ,  "crawled" :  False })
	lookAheadUrls()

def lookAheadUrls():
	linksRecord = jobdb.linksRecord
	result = linksRecord.find({ "crawled" : False })
	for x in result:
		crawl(x['urltitle'])


def crawl(urlLink,turn=1):
	global excetionPreventor
	backup_counter = turn
	print urlLink
	
	if turn < 3:
		try:
			link = urllib2.urlopen( urlLink+"-"+str(turn) ).read()
			soup = BeautifulSoup(link,"html.parser")
			s    = soup.find_all("div",{ "itemtype" : "http://schema.org/JobPosting" })
			
			for x in s:
				post_id = x['id']
				titles = x.find( "span", { "class" : "desig" } )
				#print "title 	" ,titles['title']
				company = x.find("span", { "class" : "org"})
				#print "company 	",company.text
				exp = x.find("span", { "class" : "exp" })
				rr =exp.text.split(' ')
				minE,maxE = rr[0].split('-')
				#print "exp 	",exp.text
				loc = x.find("span", { "itemprop" : "jobLocation" })
				#print "location  ",loc.text
				skills = x.find("span", { "itemprop" : "skills" })
				#print "skills    ",skills.text
				description = x.find("span", { "itemprop" : "description"  })
				if description is not None:
				#	print description.text
					description = description.text
				
				ctc = x.find("span", {  "itemprop" : "baseSalary" })
				if ctc is not None:
				#	print ctc.text
					ctc = ctc.text

				date = x.find("span" , { "class" : "date" })
				if date is not None:
				#	print date.text
					date = date.text
				linkUrl = x.find("a",{"class" : "content"})
				#print linkUrl['href']
				#print turn
				#print "#---------------------------#"
				saveJobPosting(post_id, titles['title'], company.text, exp.text, loc.text, skills.text, description, ctc, date, linkUrl['href'],urlLink,minE ,maxE )

			crawl(urlLink,turn+1 )
		except:
			excetionPreventor+=1
			if excetionPreventor<3:
				crawl(urlLink,backup_counter)
			else:
				excetionPreventor=1
	else:
		print "Stopped crawling"

def saveJobPosting(post_id, title, company, experience, location, skills, description, ctc, date, link, originateLink,minE, maxE):
	jobPosting = jobdb.JobPosting
	jobPosting.insert({ "post_id" : post_id , "title" : title, "company" : company, "experience" : experience, "location" : location, "skills" : skills, "description" : description, "ctc" : ctc, "date" : date, "link" : link , "originateLink" : originateLink , "minE" : int(minE) , "maxE" : int(maxE) })

initializeUrls(raw_input())		


#crawl(raw_input())

