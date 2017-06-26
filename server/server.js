/////////////////////////
// SERVER
/////////////////////////

// import { Meteor } from 'meteor/meteor';
// import { Random } from 'meteor/random';
//

Meteor.startup(() => {
    // code to run on server at startup
  
    // Remove all users from system
    kwis_gebruikers.remove({});
    
    // Clear game state
    kwis_status.remove({});
    kwis_status.insert({ gamestatus: 0 }); // Status = 0, give 1st user choice
    kwis_status.insert({ thisKwis: null });
    //kwis_status.insert({ showchoices: true }); // Show choice admin/host/user
    
});

Meteor.methods({
    'update_gamestatus': function(nieuwe_status){
        //console.log("Method - nieuwe status:" + nieuwe_status);
        // update
        var id = kwis_status.findOne({}, {fields: {'gamestatus':1}})._id;
        kwis_status.update({ _id: id }, { gamestatus: nieuwe_status });
        return id;
    },
    
    'getUserId': function(username){
        //console.log("New user: " + username);
        var iets = kwis_gebruikers.insert({ name: username, score: 0, rol: null });
        //console.log("id from insert: " + iets);
        //console.log(kwis_gebruikers.find().fetch());
        return iets;
    },
    
    'veranderRol': function(userid, role){
        console.log("Changing user role for id: " + userid);
        console.log("New role: " + role);
        var iets = kwis_gebruikers.update({ _id: userid }, {$set: { rol: role }});
        console.log("Iets: " + iets);
        console.log(kwis_gebruikers.find().fetch());
        return iets;
    },
    
    'voegkwisnaamtoe': function(kwisnaam){
    	console.log(kwisnaam);
    	var iets = kwis_namen.insert({ naam: kwisnaam });
    	console.log("Iets: " + iets);
      console.log(kwis_namen.find().fetch());
      return iets;
  	},
  	
  	'verwijderkwis': function(kwisid) {
			var iets = kwis_namen.remove({ _id: kwisid });
    	console.log("Iets: " + iets);
      console.log(kwis_namen.find().fetch());
      return iets;
    },
    
    'veranderKwisNaam': function(kwisId, kwisNaam){
    	//console.log("kwisId: " + kwisId);
    	//console.log("kwisNaam: " + kwisNaam);
    	var iets = kwis_namen.update({ _id: kwisId}, {$set: { naam: kwisNaam }});
    	//console.log("iets: " + iets);
    	return iets;
  	},
  	
  	'vraagToevoegen': function(kwisId, vraag, antwoord1, antwoord2, 
					antwoord3, antwoord4, goede){
			console.log("Vraag toevoegen");
			var iets = kwis_vragen.insert({ kwisId: kwisId, 
					vraag: vraag,
					antwoord1: antwoord1,
					antwoord2: antwoord2,
					antwoord3: antwoord3,
					antwoord4: antwoord4,
					goede: goede });
			return iets;
		},
		
		'verwijderVraag': function(vraagId){
			console.log("Vraag verwijderen");
			var iets = kwis_vragen.remove({ _id: vraagId });
			return iets;
		},
		
		'thisKwis': function(kwisId){
			console.log("Kwis: " & kwisId);
			//var iets = kwis_status.update( thisKwis: kwisId );
			return true;
		},
		
		'startTimer': function(){
			console.log("Timer gestart...");
			Meteor.setTimeout(function(){
        var id = kwis_status.findOne({}, {fields: {'gamestatus':1}})._id;
        kwis_status.update({ _id: id }, { gamestatus: 5 });
        }, 5000);
      return true;
    }

    
});

