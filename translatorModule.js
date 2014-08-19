var bl = require('bl');
var fs = require('fs');

var express  = require('express');
var app      = express(); 

app.use(express.static(__dirname)); 

exports.getValueFromAPI = getJsonValueFromAPI;
exports.wordLinkTranslate= function (url,file,path,httpOrhttps,funA,functions){
	readTranslatorAndGetPath(url,file,path,httpOrhttps,function(jsonFromServer,jsonTranslater,res){
	var wordlinkArray = new Array();
	var apiItemsArray = funA(jsonFromServer);
	var arrayLength = apiItemsArray.length;
    var oneLoop = function(i,next){
    	var wordlinkOneItemObj = {};
		var oneItem = apiItemsArray[i];
		for(var key_trans in jsonTranslater){
			if(jsonTranslater.hasOwnProperty(key_trans)){
				var value_trans = jsonTranslater[key_trans];
				var wordlinkTraceArray = [];
				digInto(oneItem,key_trans,value_trans,wordlinkTraceArray,wordlinkOneItemObj,functions);
			}
		}

		wordlinkArray.push(wordlinkOneItemObj);
		next();

    };
    
    function loop(init, fnCondition, fnUpdate, fnRun, fnDone){
		var index = 0;
		index = (init.constructor.name === "function")?init():init;
		function next(){
			index = fnUpdate(index);
			if(fnCondition(index)){
				setTimeout(function(){
					fnRun(index, next);
				}, 0);
			}else{
				if(fnDone) fnDone(index);
			}
		}
		fnRun(index,next);
	}

	loop(0, function(i){return i<arrayLength;}, function(i){return i+1;},oneLoop,
						function(i){ 
										var stringFromWordlink = JSON.stringify(wordlinkArray);
     		 							res.json(JSON.parse(stringFromWordlink));
     		 						});
	
	});
}
function readTranslatorAndGetPath(url,file,path,httpOrhttps,callback){
	app.get(path, function(req, res) {
	
	httpOrhttps.get(url, function(resForhttp) {
  		resForhttp.setEncoding('utf8');
  		resForhttp.pipe(bl(function(err,data){
			var stringFromServer = data.toString();
			if (err)
				res.send(err);

			
			var buffer = fs.readFile(file,'utf-8',function(err,data){
				if(err) throw err;
				if (data){
					var jsonTranslater=JSON.parse(data).data; 
					var jsonFromServer = JSON.parse(stringFromServer);
					callback(jsonFromServer,jsonTranslater,res);
					}
				});
			}));
		}).on('error', function(e) {
  		console.log("Got error: " + e.message);
		});

});
}


app.listen(8000);
console.log("App listening on port 8000");


function callbackFunction(value,jsonObj,callback){
	return callback(value,jsonObj);
}

function getValue(jsonObj,jsonObj1,valueObj,getFunction,num){
	//console.log(num+" "+valueObj[num.toString()]);
	var value = jsonObj1[valueObj[num.toString()]];
	//console.log(typeof value);
	if((typeof value == 'string'&& value.length > 0)||typeof value ==='number'){ 
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
function getJsonValueFromAPI(jsonAPI,valueObj,functions){
	return getValue(jsonAPI,jsonAPI,valueObj,functions,0);
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
	else if(typeof value_trans === 'object'){
		wordlinkTraceArray.push(key_trans);
		for(key_trans_nested1 in value_trans){
			var value_trans_nested1 = value_trans[key_trans_nested1];
			digInto(youtube,key_trans_nested1,value_trans_nested1,wordlinkTraceArray,wordlinkOneItemObj,functions);
		}
		wordlinkTraceArray.pop();
	}

}