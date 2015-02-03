var MongoClient = require("mongodb").MongoClient;

MongoClient.connect('mongodb://localhost:27017/school', function (err, db) {
	if(err) throw err;

	var cursor = db.collection('students').find({ });
	var count = 0;
	db.collection('students').count( function (err, doc) {
		if(err) throw err;
		count = doc;
		console.log('There are total ' + count + ' student record in the collection');

		var cnt = 0;
		cursor.each( function (err, doc) {
			if(err) throw err;

			if(doc == null)
				return;
			
			var id = doc['_id'];
			var min = 100;
			for(var i = 0; i < doc['scores'].length; i++) {
				if(doc['scores'][i]['type'] == 'homework' && doc['scores'][i]['score'] < min) {
					min = doc['scores'][i]['score']
				}
			}
			var query = {'_id' : id};
			var operate = {'$pull' : {'scores' : {'type' : 'homework', 'score' : min}}};
			db.collection('students').update(query, operate, function (err, updated) {
				if(err) throw err;
				cnt++;
				console.log('Updated ' + cnt + ' students');
				if(cnt == count) 
					db.close();
			});
		});
	});

});