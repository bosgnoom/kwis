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
    kwis_status.insert({ gamestatus: 0, thisKwis: null, currentQuestion: 0 });
});

Meteor.methods({
    'update_gamestatus': function(nieuwe_status){
        var id = kwis_status.findOne()._id;
	    kwis_status.update({ _id: id }, {$set: { gamestatus: nieuwe_status }});
	    return id;
    },
    
    'getUserId': function(username){
        // Add a user to the game, return his/hers userId
        //console.log("New user: " + username);
        var iets = kwis_gebruikers.insert(
            { name: username, score: 0, rol: 'user' });
        //console.log("id from insert: " + iets);
        //console.log(kwis_gebruikers.find().fetch());
        return iets;
    },
    
    'veranderRol': function(userid, role){
        var iets = kwis_gebruikers.update(
            { _id: userid }, {$set: { rol: role }});
        return iets;
    },
    
    'voegkwisnaamtoe': function(kwisnaam){
        console.log(kwisnaam);
    	var iets = kwis_namen.insert({ naam: kwisnaam });
    	//console.log("Iets: " + iets);
        //console.log(kwis_namen.find().fetch());
        return iets;
  	},
  	
    'verwijderkwis': function(kwisid) {
        var iets = kwis_namen.remove({ _id: kwisid });
    	//console.log("Iets: " + iets);
        //console.log(kwis_namen.find().fetch());
        return iets;
    },
    
    'veranderKwisNaam': function(kwisId, kwisNaam){
    	//console.log("kwisId: " + kwisId);
    	//console.log("kwisNaam: " + kwisNaam);
    	var iets = kwis_namen.update(
    	    { _id: kwisId}, {$set: { naam: kwisNaam }});
    	//console.log("iets: " + iets);
    	return iets;
  	},
  	
  	'vraagToevoegen': function(kwisId, vraag, antwoord1, antwoord2,
  	        antwoord3, antwoord4, goede){
		//console.log("Vraag toevoegen");
		var hoogste = kwis_vragen.findOne({ kwisId: kwisId }, {sort: {volgorde: -1}});
	    if (!hoogste) {
	        //There is no "hoogste found", defaulting to 0
	        hoogste = { volgorde:0 };
        }
		var iets = kwis_vragen.insert({ kwisId: kwisId, 
				vraag: vraag,
				antwoord1: antwoord1,
				antwoord2: antwoord2,
				antwoord3: antwoord3,
				antwoord4: antwoord4,
				goede: goede,
				volgorde: hoogste.volgorde + 1 });
		return iets;
	},

    'vraagWijzigen': function(vraagId, vraag, antwoord1, antwoord2,
  	        antwoord3, antwoord4, goede){
		console.log("Vraag wijziging...");
		var iets = kwis_vragen.update({ _id: vraagId},
            { $set: { 
				vraag: vraag,
				antwoord1: antwoord1,
				antwoord2: antwoord2,
				antwoord3: antwoord3,
				antwoord4: antwoord4,
				goede: goede}
            });
        console.log(iets);
		return iets;
	},
		
	'verwijderVraag': function(vraagId){
        //console.log("Vraag verwijderen");
		var iets = kwis_vragen.remove({ _id: vraagId });
		return iets;
	},
		
	'up_vraag': function(vraagId){
		//console.log('Vraag omhoog');
		var iets = kwis_vragen.update({ _id: vraagId}, {$inc: { volgorde: -1 }});
		return iets;
	},
		
	'down_vraag': function(vraagId){
		//console.log('Vraag omlaag');
		var iets = kwis_vragen.update({ _id: vraagId}, {$inc: { volgorde: 1 }});
		return iets;
	},
		
	'thisKwis': function(kwisId){
		//console.log("Kwis: " & kwisId);
		var id = kwis_status.findOne()._id;
		kwis_status.update({ _id: id }, {$set: { thisKwis: kwisId }});
		return id;
	},
		
	'startTimer': function(){
		//console.log("Timer gestart...");
		var id = kwis_status.findOne()._id;
		kwis_status.update({ _id: id}, 
    		{$set: { currentAnswer: false, startTime: Date.now()} });

		Meteor.setTimeout(function(){
    		// Set gamestatus to 5 (AnswerRoom) when timer expires
    		var id = kwis_status.findOne()._id;
            kwis_status.update({ _id: id }, 
                {$set: { gamestatus: 5 }});
        
            // Set currentAnswer to give player feedback
            var nr = kwis_status.findOne().currentQuestion;
            //console.log("Antwoord zoeken, nr: " + nr);
            var kwisId = kwis_status.findOne().thisKwis;
			var vraag = kwis_vragen.find(
					{ kwisId: kwisId }, 
					{sort: { volgorde: 1 }}
					).fetch()[nr];
			//console.log("Antwoord zoeken, vraag: " + vraag);
			kwis_status.update({ _id: id}, {$set: { currentAnswer: vraag.goede }});
			
			// Calculate scores for all users
            if (nr > 0) {
                var gebruikers = kwis_gebruikers.find({ rol: 'user' });
			    var startTime = kwis_status.findOne().startTime;
			    gebruikers.forEach(function(user){
			        var score = Math.round((25000 - (user.clickTime - startTime))/250);
			        //console.log("Score: " + score);
			        //console.log(user.currentAnswer + '--' + vraag.goede);
			        if (user.currentAnswer == 'ABCD'[vraag.goede-1] &&
                        score <= 100 ) {
			            kwis_gebruikers.update(user._id, 
			                { $inc: { score: score }});
			            
		                }
                    });
                }
			
				
            }, 25000);  // 10 second question time... As user entry??
      return true;
    },
    
    'nextQuestion': function(){
		//console.log("nextQuestion...");
	    var id = kwis_status.findOne()._id;
		kwis_status.update({ _id: id }, {$inc: { currentQuestion: 1 }});
		return id;
	},
		
	'resetKwis': function(){
  	    // Remove all users from system
        kwis_gebruikers.remove({});
    
        // Clear game state
        kwis_status.remove({});
        kwis_status.insert(
            { gamestatus: 0, thisKwis: null, currentQuestion: 0 });
	},
		
	'submitPlayerAnswer': function(playerId, playerAnswer){
		//console.log("Player: " + playerId + " Answer: " + playerAnswer);
		clickTime = Date.now();
		kwis_gebruikers.update(
		    { _id: playerId}, 
		    {$set: { clickTime: clickTime, currentAnswer: playerAnswer } });
	}    
    
});

