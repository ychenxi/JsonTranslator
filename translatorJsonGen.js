var bl = require('bl');
var fs = require('fs');
var http = require('http');

var url = "http://api.tumblr.com/v2/tagged?tag=music&api_key=fuiKNFp9vQFvjLNvx4sUwti4Yb5yGutBN4Xh10LXZhhRKjWlV4";

http.get(url, function(resForhttp) {
  		resForhttp.setEncoding('utf8');
  		resForhttp.pipe(bl(function(err,data){
			var originalData = JSON.parse(data);
			var translator = {};

			for(var key_trans in originalData){
				if(originalData.hasOwnProperty(key_trans)){
				var value_trans = originalData[key_trans];
				//console.log(JSON.stringify(value_trans));
				var wordlinkTraceArray = [];
				digInto(key_trans,value_trans,wordlinkTraceArray,translator);

				}
			}
			//console.log(translator);
			fs.writeFile('tumblrTranslator1.json', JSON.stringify(translator), function (err) {
  				if (err) throw err;
  				console.log('It\'s saved!');
			});

  		}));

	}).on('error', function(e) {
  		console.log("Got error: " + e.message);
		});

function digInto(key_trans,value_trans,wordlinkTraceArray,wordlinkOneItemObj){
	if(typeof value_trans == 'string'||typeof value_trans ==='number'||typeof value_trans === 'boolean'){	

		defineObjectAndSetValue(wordlinkOneItemObj,wordlinkTraceArray,0,key_trans,false); 
	}
	else if(value_trans instanceof Array){
		
		if(typeof value_trans[0] == 'string'||typeof value_trans[0] ==='number'||value_trans.length==0){
			defineObjectAndSetValue(wordlinkOneItemObj,wordlinkTraceArray,0,key_trans,false);
		}else{

			var resultTranslator = arrayCreater(value_trans);
			//console.log(resultTranslator);
			if(typeof resultTranslator != "undefined"){
				defineObjectAndSetValue(wordlinkOneItemObj,wordlinkTraceArray,0,key_trans,true,resultTranslator);
			}
		}
	}
	else if(typeof value_trans === 'object'){
		wordlinkTraceArray.push(key_trans);
		for(key_trans_nested1 in value_trans){
			var value_trans_nested1 = value_trans[key_trans_nested1];
			digInto(key_trans_nested1,value_trans_nested1,wordlinkTraceArray,wordlinkOneItemObj);
		}
		wordlinkTraceArray.pop();
	}	

}
function defineObjectAndSetValue(wordlinkOneItemObj,wordlinkTraceArray,num,key_trans,isArray,value_trans){
	//console.log(wordlinkTraceArray);
	
 	if(num<wordlinkTraceArray.length){ 
 		if(typeof wordlinkOneItemObj[wordlinkTraceArray[num]] === 'undefined'){  
 			wordlinkOneItemObj[wordlinkTraceArray[num]] = {};
 			defineObjectAndSetValue(wordlinkOneItemObj[wordlinkTraceArray[num]],wordlinkTraceArray,num+1,key_trans,isArray,value_trans);
 			return;
 		}else{
 			defineObjectAndSetValue(wordlinkOneItemObj[wordlinkTraceArray[num]],wordlinkTraceArray,num+1,key_trans,isArray,value_trans);
 			return;
 		}
 	}else if(isArray){

 		value_trans["position_of_array"]=setValue(wordlinkTraceArray,key_trans);
 		if(wordlinkOneItemObj[key_trans]&&wordlinkOneItemObj[key_trans].hasOwnProperty("xxx")){
 			//TODO: use condition
 		}else if(wordlinkOneItemObj[key_trans]&&wordlinkOneItemObj[key_trans].hasOwnProperty("arra")){
 			var previousTranslator = wordlinkOneItemObj[key_trans]["arra"];
					for(var key in previousTranslator){
						if(!value_trans.hasOwnProperty(key)){
							value_trans[key]=previousTranslator[key];
						}
					}

 		}
 		//console.log(value_trans);
		
		//console.log(key_trans);
		var resultObj= {};
		resultObj["arra"] = value_trans
 		wordlinkOneItemObj[key_trans] = resultObj;
 		//if(key_trans==="items"){console.log(wordlinkOneItemObj)};
 		return;
 	}else {
 		if(wordlinkOneItemObj[key_trans]&&wordlinkOneItemObj[key_trans].hasOwnProperty("xxx")){
 			return;
 		}
 		//console.log(value1);
 		var result = {};
 		result['xxx'] = setValue(wordlinkTraceArray,key_trans);
 		wordlinkOneItemObj[key_trans] = result;
 		return;
 	}
 }
 function setValue(wordlinkTraceArray,key_trans){
 	var value = {};
 	for(var i=0;i<wordlinkTraceArray.length;i++){
 			value[i.toString()] = wordlinkTraceArray[i]
 		}

 	value[wordlinkTraceArray.length.toString()] = key_trans;
 	return value;
 }

function arrayCreater(originalArray){
	
	if(originalArray !== undefined){
		var translator = {};
		arrayLength = originalArray.length;
		//console.log(arrayLength);
		for(var i = 0; i < arrayLength; i++){
				var oneItem = originalArray[i];
				for(var key_trans in oneItem){
					if(oneItem.hasOwnProperty(key_trans)){
						var value_trans = oneItem[key_trans];
						var wordlinkTraceArray = [];
						digInto(key_trans,value_trans,wordlinkTraceArray,translator);
					}
				}
			}
	}
	return translator;
			

}
