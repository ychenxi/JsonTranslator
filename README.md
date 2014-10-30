JsonTranslator
==============
#JsonTranslator
-To run the codes, use `node translatorModule.js`
-JsonTranslator is using to translate json file into different formats. The file using to translate is also a json file.
-The example translator json file is:

```javascript
{
	"name" : "YouTube Translator",
	"data" : {
				"routing" : {"xxx":{"0" : "uploaded",
									"callback" : "addRoutingDate"}},
				"id" : {"xxx":{"0" : "id"}},
				"url" : {"xxx":{"0" : "id",
								"callback" : "getUrl"}},
				"pDate" : {"xxx":{"0" : "uploaded"}},
				"author" : {"xxx":{"0" : "uploader"}},
				"title" : {"xxx":{"0" : "title"}},
				"description" : {"xxx":{"0" : "description"}},
				"imgs" : {
					"100" : {"xxx":{"0" : "thumbnail",
								    "1" : "sqDefault"}},
					"1" : {"xxx":{"0" : "thumbnail",
								  "1" : "hqDefault"}}
				},
				"embed" : {
					"0" : {"xxx":{"0" : "player",
								  "1" : "default"}},
					"1" : {"xxx":{"0" : "player",
								  "1" : "mobile"}}
				},
				"category" : {"xxx":{"0" : "category"}},
				"iranking" : {
					"duration" : {"xxx":{"0" : "duration"}},
					"rating" : {"xxx":{"0" : "rating"}},
					"likes" : {"xxx":{"0" : "likeCount"}},
					"ratings" : {"xxx":{"0" : "ratingCount"}},
					"views" : {"xxx":{"0" : "viewCount"}},
					"favorites" : {"xxx":{"0" : "favoriteCount"}},
					"comments" : {"xxx":{"0" : "commentCount"}}
					},
				"rank" : {"xxx":{"0" : "commentCount",
								 "callback" : "addRank"}},
				"location" : {
					"coordinates" : {
						"lat" : {"xxx":{"0" : "geoCoordinates",
								  		"1" : "latitude"}},
						"lng" : {"xxx":{"0" : "geoCoordinates",
								  		"1" : "longitude"}}
						}
				}

	}
}
```



