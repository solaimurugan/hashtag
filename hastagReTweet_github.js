//sudo npm install mongodb
//sudo npm install twit

// RUN by node hashtagReTweet.js
//https://developer.twitter.com/en/docs/tweets/filter-realtime/api-reference/post-statuses-filter.html
//https://developer.twitter.com/en/docs/tweets/search/api-reference/get-search-tweets.html
//db.imagedmk.aggregate([     {"$group" : {_id:"$tid", count:{$sum:1}}}, {$sort:{"count":-1}} ])
//db.imagedmk.aggregate([     {"$group" : {_id:"$tuser", count:{$sum:1}}}, {$sort:{"count":-1}} ])

//db.imagedmk.count({image:{$exists:1}})
// db.imagedmk.find({image:{$exists:1}}).pretty()
///////////////////////////////////////////////////////////////////////////////////////////////////////
// use tweetsdmk
// db.imagedmk.getIndexes()
//only unique values
//db.imagedmk.createIndex( { "image_url": 1 }, { unique: true } )
//unique with null values
//db.imagedmk.createIndex( { "image_url": 1 },  { partialFilterExpression: { image_url: { $exists: true } } } )
///////////////////////////////////////////////////////////////////////////////////////////////////////


var Twit = require('twit')
var T = new Twit({
    consumer_key:         'Z7Ww83km4ElGyxePAHVkK1ktt',
    consumer_secret:      'B64oPhYkqH6AR4Zzd03TYLTr0zNMeauXBtiD2JIe0miDWKEyTm',
    access_token:         '1015296632168931329-rjUhJK81rTjb6kouaESjAYPSzO6l4V',
    access_token_secret:  'muryPklbv9n9XQVRUVZgMp7gstQz3MML0nHM5ye45oALR',
})
/*
// To connect using the mongo shell: 
mongo ds163330.mlab.com:63330/tweetsdmk -u <dbuser> -p <dbpassword> 

// To connect using a driver via the standard MongoDB URI (what's this?): 
mongodb://<dbuser>:<dbpassword>@ds163330.mlab.com:63330/tweetsdmk
mongodb://solai:solairaj12*@ds163330.mlab.com:63330/tweetsdmk

*/
//const T = require("./Twit.js");


//DATABASE connection
var MongoClient = require('mongodb').MongoClient;
//var url = "mongodb://localhost:27017/";
//var url = "mongodb://10.184.36.131:27017";
//url = MongoClient("mongodb://admin:pass@bossdb-shard-00-00-w54dc.mongodb.net:27017,bossdb-shard-00-01-w54dc.mongodb.net:27017,bossdb-shard-00-02-w54dc.mongodb.net:27017/test?ssl=true&replicaSet=BOSSDB-shard-0&authSource=admin&retryWrites=true")

//CREATE ACCOUNT in MONGODB Atlas
url = "mongodb://solai:solairaj12*@ds163330.mlab.com:63330/tweetsdmk"
//url = "mongodb://"+dbUserName+":"+dbUserPwd+"@ds163330.mlab.com:63330/tweetsdmk"


/*
//INSERT Document
function insertTweet(tid, ttext, tuser) { 
		console.log("inside Insert")
	MongoClient.connect(url, function(err, db) {
		if (err) throw err;
		var dbo = db.db("tweetsdmk");
		var myobj = { "tid": tid, "ttext":ttext, "tuser":tuser};
	
		dbo.collection("imagedmk").findOne({"tid":tid}, function(err, result) {
			if (err) throw err;
			if(result) {
				console.log(result.name);
				db.close();
			return false
			}else if(!result){
			        console.log("Not in docs");
				dbo.collection("imagedmk").insertOne(myobj, function(err, res) {
				if (err) throw err;
				console.log("1 tweet inserted" + tid);
				db.close();
				});
			return true;
			}
		});
}); 
}

*/

//  RETWEET, tweet stream base on  # //
//tweet date format :Wed Jun 20 12:06:49 +0000 2018
//todaye date :      Wed Jun 20 2018 19:39:42 GMT+0530 (IST)

console.log("Waiting foe an Event");
var tcount = 0;

var findAndReTweet = ['#Marina4Kalaignar','#கலைஞர்']; 

//var stream = T.stream('statuses/filter', {track: '#DMKITwing'});
var stream = T.stream('statuses/filter', {track: findAndReTweet});

stream.on('tweet', function (tweet) {
	//console.log("Event received : tweet.id_str :"+tweet.id_str, " "+tweet.text + " tweet.user.screen_name "+tweet.user.screen_name)
	console.log("Event received")
	
//Associated hastag info
var ahastag =  [];
var amention = [];


 if(tweet.text.search("RT") < 0 ) {
  console.log("NOT RT??");
	//if (users.indexOf(tweet.user.id_str) > -1) { //1
		console.log("*****************Even received From listed User *****************  :" +tweet.user.screen_name);
		console.log("tweet.in_reply_to_user_id::"+tweet.in_reply_to_user_id)
	//To avoid the Reply from User
	if(tweet.in_reply_to_user_id) {
		console.log("its Reply \n");
	}else{
		//console.log("Even received From listed User :" +tweet.user.screen_name + ": " + tweet.text + " tweet.user.id_str::"+tweet.user.id_str);
		//var insert_sts = insertTweet(tweet.id_str, tweet.text, tweet.user.name)
	


	var tid = tweet.id_str
	var ttext = tweet.text
	var tuser = tweet.user.screen_name
	
	//console.log("inside Insert")
	MongoClient.connect(url, function(err, db) {
		if (err) throw err;
		var dbo = db.db("tweetsdmk");
		
	
		dbo.collection("imagedmk").findOne({"tweet_id":tid}, function(err, result) {
			if (err) throw err;
			if(result) {
				console.log("Tweet Already Inserted "+tid);
				db.close();
			}else if(!result){
			        console.log("Not in docs");
	//for hastag and mention
	//var ahastag = tweet.entities.hashtags.text
	//var amention = tweet.entities.user_mentions.screen_name
	//console.log("ahastag :"+ahastag +"  amention : "+amention)
	if(tweet.entities && tweet.entities.hashtags && tweet.entities.hashtags.length > 0) {
		tweet.entities.hashtags.forEach(function(m) {
		ahastag.push(m.text)
		});
	console.log("A-Hastag ######## :"+ahastag )
	}

	//mentioned user name in tweet
	if(tweet.entities && tweet.entities.user_mentions && tweet.entities.user_mentions.length > 0) {
		tweet.entities.user_mentions.forEach(function(m) {
		amention.push(m.screen_name)
		});
	console.log("A-Mentions @@@@@@@ :"+amention )
	}

var myobj = { "tweet_id": tid, "tweet":ttext, "user":tuser,"date":Date.now() , "amention":amention, "ahastag":ahastag};

				// For getting media image url store into database for future references and upload photo into insta
				if(tweet.entities && tweet.entities.media && tweet.entities.media.length > 0) {
					tweet.entities.media.forEach(function(m) {
					var myobj_image = { "tweet_id": tid, "tweet":ttext, "user":tuser, "status":"fromTwitter", "image":"new", "image_url":m.media_url, "date":Date.now(), "amention":amention, "ahastag":ahastag};
						console.log("media_url2 :: " +m.media_url);
//			record1.insert_one({'image_url':imgUrl, 'status':'fromTwitter', 'date':datetime.datetime.now(), 'tweet':twt_er, 'tweet_id':twt_id,'image':'new'})		
						dbo.collection("imagedmk").insertOne(myobj_image, function(err, res) {
						//if (err) throw err;  //1
						if (err) { 
							stream.on('reconnect', function (request, response, connectInterval) {
							console.log('Trying to reconnect to Twitter API in ' + connectInterval + ' ms'); });
						}
							console.log("1 document with IMAGE inserted :" + tid +" , tcount is :"+tcount + "\n");
							db.close();
							tcount = tcount+1;
							/*if(tcount >= 5){
								stopReconnect()
								} */
							});
						});
					} else {
					dbo.collection("imagedmk").insertOne(myobj, function(err, res) {
						//if (err) throw err;  //1
						if (err) { 
							stream.on('reconnect', function (request, response, connectInterval) {
							console.log('Trying to reconnect to Twitter API in ' + connectInterval + ' ms'); });
						}
						console.log("1 tweet inserted :" + tid +" , tcount is :"+tcount + "\n");
						db.close();		
						tcount = tcount+1;
							/*if(tcount >= 5){ //1
								stopReconnect()
								}	*/	
						});
					}
		setTimeout(function(){
			T.post('statuses/retweet/:id', { id: tweet.id_str }, function (err, data, response) { //1
			if (err) throw err;
			//console.log(data)
			//console.log(" media_url ::"+tweet.entities.media[media_url]);
			//console.log("TWEET DONE")
			}) //1

		}, 40000); 							
			}


		});
	}); 




/*		console.log(" insert_sts ::"+insert_sts)
		if(insert_sts)
		{
 //       		T.post('statuses/retweet/:id', { id: tweet.id_str }, function (err, data, response) {
//        		console.log(data)
			console.log("TWEET DONE")
	//		}) //1
		}
*/	
		 }
//Listed User if ends here
	 /*}else{
	//	console.log("Event Received From - Non listed Users ::"+ tweet.user.screen_name + '\n');
		//console.log("Event Received From - Non listed Users ::"+ tweet.user.screen_name + " ID:: "+tweet.user.id_str );//+"tweet.text :: "+tweet.text);
			
		if(tweet.entities && tweet.entities.media && tweet.entities.media.length > 0) {
					tweet.entities.media.forEach(function(m) {
						console.log("tweet.entities.media.media_url :: " +m.media_url+'\n');	
					});
				}

		/*if(tweet.entities.media){
			console.log("tweet.entities.media.media_url ::"+tweet.entities.media);
			} 

	}
*/
	  

   }else{
	console.log("its ReTweet \n");
	}

  
})



function stopReconnect(){
console.log('Inisde StopReconnect \n')
tcount = 0;
stream.on('disconnect', function (message) {
    console.log('Disconnected from Twitter API. Message: ' + message);
});

setTimeout(function(){
	console.log("Inside TIME")
	//stream.stop()
	stream.on('reconnect', function (request, response, connectInterval) {
	console.log('Trying to reconnect to Twitter API in ' + connectInterval + ' ms');
});
}, 10000); 


}

setTimeout(function(){
	console.log("Inside TIME")
	//stream.stop()
}, 10000); 



//
// filter the public stream by english tweets containing //
//  # #IoT #BigData #DataAnalytics #Malware #CyberAttack #CyberSecurity
//


//var findAndReTweet = [ 'IoT', '#AI','DeepLearning' , 'DataAnalytics', 'CyberSecurity', '#BigData','#analytics', '#chatbot' , '#visualization','#VisualAnalytics'];

/* //1
var findAndReTweet = ['#AI'];

//setTimeout(function(){
console.log(".......................WAIT 30 sec FIRST.....................");

var streamwords = T.stream('statuses/filter', { track: findAndReTweet, language: 'en' });

	streamwords.on('tweet', function (tweet) {
tweetdate = new Date(tweet.created_at);
var today = new Date();
if(tweet.retweeted_status) {
console.log("retweet_status is ::"+tweet.retweeted_status);     
 if(tweet.retweet_count==0) {
console.log("retweet count is in IF : "+tweet.retweet_count);     
			      console.log(tweetdate.getTime());	
				console.log("Today date : "+today.getTime() + " condition :" +(today.getTime()-1200));		
// GET the retweeted User Information 
var retwwetedUsers = T.get('statuses/retweets/:id', { id: tweet.id_str}, function (err, data, response) {
console.log(" RETWEETED USER IDS");
console.log(data);
})

//		setTimeout(function(){
//		        T.post('statuses/retweet/:id', { id: tweet.id_str}, function (err, data, response) {
		   //         console.log(data)
			       //console.log(tweetdate.getTime());	
				//console.log("Today date : "+today.getTime() );		
				if((today.getTime()-1200000)<=tweetdate.getTime()){

			      console.log("INSIDE FOR LOOP");	
				console.log("RETWEETED DONE")	
			      console.log(tweetdate.getTime());	
				console.log("Today date : "+today.getTime() + " condition :" +(today.getTime()-1200));		
		         //console.log(data)
}
//			})    //do what you need here POST teewt end
//		}, 30000); // 30 sec once, it will retweet

	console.log(".......................WAIT 30 sec.....................");
}//end of if 
else{console.log("ELSE retweet count is : "+tweet.retweet_count);}
}
else{
console.log("NO retweet_status is ::"+tweet.retweeted_status);  
console.log("RETWEETED NOT DONE")	  
}
	})

//}, 30000);

 */ //1
