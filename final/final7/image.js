var MongoClient = require("mongodb").MongoClient;

MongoClient.connect('mongodb://localhost:27017/photo', function(err, db) {
	if(err) throw err;

	var query = { };
	var cursor = db.collection("images").find(query);

	cursor.each(function(err, doc) {
		if(err) throw err;

		if(doc == null) return;

		var id = doc["_id"];
		db.collection("albums").count({"images" : id}, function(err, cnt) {
			if(err) throw err;

			if(cnt == 0)
				db.collection("images").remove({"_id" : id}, function(err, state) {
					if(err) throw err;
				});
		});
	});

	return; 
});

