Meteor.publish('gamestatus', function() {
	return kwis_status.find();
});
    
Meteor.publish('kwis_namen', function() {
	return kwis_namen.find();
});

Meteor.publish('kwis_vragen', function() {
	return kwis_vragen.find();
});


// For debugging!
Meteor.publish('kwis_gebruikers', function() {
	return kwis_gebruikers.find();
});


