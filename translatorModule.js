var bl = require('bl');
var fs = require('fs');
var Hapi = require('hapi');
var https = require('https');
var url = require('url');
var server = Hapi.createServer('localhost',8000);
//?url=http%3A%2F%2Fapi.tumblr.com%2Fv2%2Ftagged%3Ftag%3Dmusic%26api_key%3DfuiKNFp9vQFvjLNvx4sUwti4Yb5yGutBN4Xh10LXZhhRKjWlV4
//?url=https%3A%2F%2Fgdata.youtube.com%2Ffeeds%2Fapi%2Fstandardfeeds%2Fmost_popular%3Fv%3D2%26alt%3Djsonc%26max%25C2%25ADresults%3D50%26time%3Dtoday
server.route({
	path: '/{result?}',
	method: 'GET',
	handler: {
		 directory: { path: './public', listing: false, index: true }
	}
});

server.route({
	path:'/translator',
	method:'GET',
	handler: response

});

server.start();
		


function response (request, reply) {
	var name = url.parse(request.query.url).hostname
	//console.log(url.parse(request.query.url).hostname);
	//console.log(config[name].getDataArray);
	wordLinkTranslate(config[name].http,request.query.url,config[name].translatorFile,config[name].functions,function(jsondata){
	 		reply(jsondata); 
	 	});
	
	};
var youtubeFunctions = {
	"getUrl" : function(value,jsonObj){
					return "youtube.com/watch?v="+value;
				}
				,
	"addRank" : function(value, jsonObj){
				var likeCount = getJsonValueFromAPI(jsonObj,{"0" : "likeCount"});
				var results = Math.floor(value+likeCount/10);
				return results;
				}
				,
	"addRoutingDate" : function(value,jsonObj){
						return value.substring(0,7);
				}
};

var config = {
	"gdata.youtube.com" :{
		"http" : "https",
		"translatorFile" : './youtubeTranslator3.json'
	},
	"api.tumblr.com" : {
		"http" : "http",
		"translatorFile" : './tumblrTranslator3.json'
	}
}




function wordLinkTranslate(httpOrhttps,url,file,functions,callback){
	get_json(httpOrhttps,url,file,function(jsonFromServer,jsonTranslater){
	
	//console.log(JSON.stringify(jsonFromServer));
	var wordlinkOneItemObj = {};

	for(var key_trans in jsonTranslater){
			if(jsonTranslater.hasOwnProperty(key_trans)&&key_trans !== "name"){
				var value_trans = jsonTranslater[key_trans];
				//console.log(JSON.stringify(value_trans));
				var wordlinkTraceArray = [];
				digInto(jsonFromServer,key_trans,value_trans,wordlinkTraceArray,wordlinkOneItemObj,functions);
			}
		}

	callback(wordlinkOneItemObj);
	});
}

function get_json(httpOrhttps,url,file,callback){
	require(httpOrhttps).get(url, function(resForhttp) {
  		resForhttp.setEncoding('utf8');
  		resForhttp.pipe(bl(function(err,data){
			var stringFromServer = data.toString();

			var buffer = fs.readFile(file,'utf-8',function(err,data){
				if(err) throw err;
				if (data){
					var jsonTranslater=JSON.parse(data); 
					var jsonFromServer = JSON.parse(stringFromServer);
					callback(jsonFromServer,jsonTranslater);
					}
				});
  		}));

	}).on('error', function(e) {
  		console.log("Got error: " + e.message);
		});
}

console.log("App listening on port 8000");


function callbackFunction(value,jsonObj,callback){
	return callback(value,jsonObj);
}





function getJsonValueFromAPI(jsonAPI,valueObj,functions){
	return getValue(jsonAPI,jsonAPI,valueObj,functions,0);
}
function getValue(jsonObj,jsonObj1,valueObj,getFunction,num){
	//console.log(num+" "+valueObj[num.toString()]);
	var value = jsonObj1[valueObj[num.toString()]];
	//console.log(typeof value);
	if(typeof value == 'string'||typeof value ==='number'||value instanceof Array||typeof value === 'boolean'){ 
		if(valueObj.hasOwnProperty("callback")){
			var functionName = valueObj["callback"];
			return callbackFunction(value,jsonObj,getFunction[functionName]);

		}else{
			return value;
		}

		
	}
	else if(value !== null && typeof value === 'object'){
		return getValue(jsonObj,value,valueObj,getFunction,num+1); 
	}
	else{
		return null;
	}
}





function defineObjectAndSetValue(wordlinkOneItemObj,wordlinkTraceArray,num,key_trans,youtubeValue){

 	if(num<wordlinkTraceArray.length){ 
 		if(typeof wordlinkOneItemObj[wordlinkTraceArray[num]] === 'undefined'){  
 			wordlinkOneItemObj[wordlinkTraceArray[num]] = {};
 			defineObjectAndSetValue(wordlinkOneItemObj[wordlinkTraceArray[num]],wordlinkTraceArray,num+1,key_trans,youtubeValue);
 			return;
 		}else{
 			defineObjectAndSetValue(wordlinkOneItemObj[wordlinkTraceArray[num]],wordlinkTraceArray,num+1,key_trans,youtubeValue);
 			return;
 		}
 	}else{
 		wordlinkOneItemObj[key_trans] = youtubeValue;
 		return;
 	}
 }

function condition(jsonObj,conditionObj,getFunction,num){
	var valuePath = conditionObj[num.toString()];
	if(typeof valuePath === 'undefined'){
		return null;
	}
	var result = getJsonValueFromAPI(jsonObj,valuePath,getFunction);
	if(result === null){
		return condition(jsonObj,conditionObj,getFunction,num+1);
	}else{
		return result;
	}
}
function conditionSelect(jsonAPI,conditionObj,functions){
	return condition(jsonAPI,conditionObj,functions,0);
}

function digInto(youtube,key_trans,value_trans,wordlinkTraceArray,wordlinkOneItemObj,functions){

	if(value_trans.hasOwnProperty("xxx")){
		var valueObj = value_trans.xxx;			
		var youtubeValue = getJsonValueFromAPI(youtube,valueObj,functions);
		if(youtubeValue !== null){
			defineObjectAndSetValue(wordlinkOneItemObj,wordlinkTraceArray,0,key_trans,youtubeValue); 
			}
	}
	else if(value_trans.hasOwnProperty("cond")){
		var conditionObj = value_trans.cond;
		var result = conditionSelect(youtube,conditionObj,functions);
		if(result !== null){
			defineObjectAndSetValue(wordlinkOneItemObj,wordlinkTraceArray,0,key_trans,result); 
		}

	}
	else if(value_trans.hasOwnProperty("arra")){
		
		//console.log(value_trans["arra"]["position_of_array"]);
		var initialArray = getJsonValueFromAPI(youtube,value_trans["arra"]["position_of_array"]);
		if(initialArray){
			var resultArray = syncArrayCreater(initialArray,value_trans["arra"],functions);
			//console.log(resultArray);
			if(resultArray.length>0){
				defineObjectAndSetValue(wordlinkOneItemObj,wordlinkTraceArray,0,key_trans,resultArray);
			}
		}
	}
	else if(typeof value_trans === 'object'){
		wordlinkTraceArray.push(key_trans);
		for(key_trans_nested1 in value_trans){
			var value_trans_nested1 = value_trans[key_trans_nested1];
			digInto(youtube,key_trans_nested1,value_trans_nested1,wordlinkTraceArray,wordlinkOneItemObj,functions);
		}
		wordlinkTraceArray.pop();
	}

}
//TODO: to change to async loop
// function loop(init, fnCondition, fnUpdate, fnRun, fnDone){
// 		var index = 0;
// 		index = (init.constructor.name === "function")?init():init;
// 		function next(){
// 			index = fnUpdate(index);
// 			if(fnCondition(index)){
// 				setTimeout(function(){
// 					fnRun(index, next);
// 				}, 0);
// 			}else{
// 				if(fnDone) fnDone(index);
// 			}
// 		}
// 		fnRun(index,next);
// 	}
function syncArrayCreater(originalArray,translator,functions){
	//console.log(originalArray);
	var translatedArray = [];
	if(originalArray !== undefined && originalArray instanceof Array){
	var arrayLength = originalArray.length;
    for(var i=0; i<arrayLength;i++){
    	var wordlinkOneItemObj = {};
		var oneItem = originalArray[i];
		for(var key_trans in translator){
			if(translator.hasOwnProperty(key_trans)&&key_trans !== "position_of_array"){
				var value_trans = translator[key_trans];
				var wordlinkTraceArray = [];
				digInto(oneItem,key_trans,value_trans,wordlinkTraceArray,wordlinkOneItemObj,functions);
			}
		}

		translatedArray.push(wordlinkOneItemObj);
	}
}
    
    return translatedArray;
    

	// loop(0, function(i){return i<arrayLength;}, function(i){return i+1;},oneLoop,
	// 					function(i){ 
 //     		 							callback(translatedArray);
 //     		 						});

}