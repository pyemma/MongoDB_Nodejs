var MongoClient = require("mongodb").MongoClient;

MongoClient.connect('mongodb://localhost:27017/weather', function(err, db) {
	if(err) throw err;
	
	var query = { };
	var cursor = db.collection("data").find(query);

	var operator = {"$set" : {"month_high" : true}};
	cursor.sort([["State" , 1], ["Temperature" , -1]]);
	var pre = "";

	cursor.each( function (err, doc) {
		if(err) throw err;

		if(doc == null)
			return;

		if(doc["State"] != pre) {
			query["_id"] = doc["_id"];
			db.collection("data").update(query, operator, function (err, updated) {
				if(err) throw err;
				console.log("The document has been updated " + updated );
			});
		}

		pre = doc["State"];
	});

	return;
});