var translator = require('./translatorModule.js');

var https = require('https');
var http = require('http');

var urlTumblr = "http://api.tumblr.com/v2/tagged?tag=music&api_key=fuiKNFp9vQFvjLNvx4sUwti4Yb5yGutBN4Xh10LXZhhRKjWlV4";
var urlYoutube = 'https://gdata.youtube.com/feeds/api/standardfeeds/most_popular?v=2&alt=jsonc&max%C2%ADresults=50&time=today';

var fileTumblr = __dirname + '/tumblrTranslater.json';
var fileYoutube = __dirname + '/youtubeTranslater2.json';

var youtubeFunctions = {
	"getUrl" : function(value,jsonObj){
					return "youtube.com/watch?v="+value;
				}
				,
	"addRank" : function(value, jsonObj){
				var likeCount = translator.getValueFromAPI(jsonObj,{"0" : "likeCount"});
				var results = Math.floor(value+likeCount/10);
				return results;
				}
				,
	"addRoutingDate" : function(value,jsonObj){
						return value.substring(0,7);
				}
};

{
        method:"GET",
        path:'/api/translator',
        config:controller.api.wordlink_translator
    },
translator.wordLinkTranslate(urlTumblr,fileTumblr,'/api/tumblr',http,function(jsonFromServer){return jsonFromServer.response});
translator.wordLinkTranslate(urlYoutube,fileYoutube,'/api/youtube',https,function(jsonFromServer){return jsonFromServer.data.items},youtubeFunctions);