/****************************
// Editing kwis
//
// Edit kwis name, add kwis, delete kwis
// Add, edit and delete questions for a kwis
// ***************************/


Template.editingKwis.helpers({
	'deKwis': function(){
		// Debug something: show all Session variables in use
		//for (prop in Session.keys) {
		//	console.log(prop + ": " + Session.get(prop));
		//	}
			
		var iets = kwis_namen.findOne({ _id: Session.get('editedKwisId')});
		return iets.naam;
	},
	
	'vragenVanDeKwis': function(){
		return kwis_vragen.find(
			{ kwisId: Session.get('editedKwisId')}, 
			{ sort: { volgorde: 1 }}
		);
	},
	
	'isVraagAanHetMaken': function(){
		return Session.get("isVraagAanHetMaken") || Session.get('editedVraag');
	},
	
	'deVraag': function(){
		var iets = kwis_vragen.findOne({ _id: Session.get('editedVraag')});
		return iets.vraag;
	},

    'hetAntwoord': function(welke_vraag){
        var iets = kwis_vragen.findOne({ _id: Session.get('editedVraag')});
        //console.log("Het antwoord zoeken...");
        //console.log(iets);
        var return_value = "";
        if (welke_vraag == 1) return_value = iets.antwoord1;
        if (welke_vraag == 2) return_value = iets.antwoord2;
        if (welke_vraag == 3) return_value = iets.antwoord3;
        if (welke_vraag == 4) return_value = iets.antwoord4;
        return return_value;
    },

    'dezeAankruisen': function(welke_dan){
        var iets = kwis_vragen.findOne({ _id: Session.get('editedVraag')});
        if (welke_dan == iets.goede) {
            return "checked";
            } 
        else {
            return "";
        }
    },
    
    'aantalKerenAntwoord': function(ABCofD){
        // Needs fixing, but this is quick n dirty
        //console.log("Welk antwoord zoeken: " + ABCofD);
        if (ABCofD == 1) deze = '1';
        if (ABCofD == 2) deze = '2';
        if (ABCofD == 3) deze = '3';
        if (ABCofD == 4) deze = '4';
        var iets = kwis_vragen.find(
            { kwisId: Session.get('editedKwisId'),
              goede: deze}).count();
        //console.log(iets);
        return iets;
    }
});

Template.editingKwis.events({
  'submit form.editingKwis': function(event){
		var kwisNaam = event.target.naam.value;
		var kwisId = Session.get("editedKwisId");
	
  	if (kwisNaam.length){
  		//console.log("Update kwisnaam: " + kwisId);
  		Meteor.call("veranderKwisNaam", kwisId, kwisNaam, function(error, result){
  			if (error) console.log("Error: " + error);
 				if (result) console.log("voegkwisnaamtoe: " + result);
  		});	
  		Session.set('editedKwisId', null);
		}
	},
	
	'submit form.VraagMaken': function(event){
		var kwisId = Session.get("editedKwisId");
        var vraagId = Session.get("editedVraag");

		var vraag = event.target.VraagNaam.value;
		var antwoord1 = event.target.antwoord1.value;
		var antwoord2 = event.target.antwoord2.value;
		var antwoord3 = event.target.antwoord3.value;
		var antwoord4 = event.target.antwoord4.value;
		var goede = event.target.goede.value;
		
        if (goede) { 
            // If there is a radio button selected, most likely the question
            // is filled in...
			//console.log("Vraag toevoegen...");
            if (vraagId) {
                // There is a question being edited...
                //console.log("Add method to develop question");
                Meteor.call("vraagWijzigen", vraagId, vraag, antwoord1, antwoord2,
                    antwoord3, antwoord4, goede);
                Session.set("editedVraag", false);
            } else {
                // Add a new question
			    Meteor.call("vraagToevoegen", kwisId, vraag, antwoord1, antwoord2, 
					antwoord3, antwoord4, goede, function(error, result){
  			            if (error) console.log("Error: " + error);
 				        if (result) console.log("voegkwisnaamtoe: " + result);
			        });
			Session.set('isVraagAanHetMaken', false);
            }
		}
	},
	
	'click a.CreateVraag': function(){
		Session.set("isVraagAanHetMaken", true);
		Session.set('editedVraag', false);
		//for (prop in Session.keys) {
		//	console.log(prop + ": " + Session.get(prop));
		//}
	},
	
	'click a.CancelVraag': function(){
		Session.set("isVraagAanHetMaken", false);
		Session.set('editedVraag', false);
	},
	
	'click a.del_vraag': function(){
		if (confirm("Weet je het zeker?")) {
		    Meteor.call('verwijderVraag', this._id, function(error, result){
			    if (error) console.log("Error: " + error);
			    if (result) console.log("voegkwisnaamtoe: " + result);
		    });
	    }
	},
	
	'click a.edit_vraag': function(){
		Session.set('editedVraag', this._id);
	},
	
	'click a.up_vraag': function(){
		Meteor.call('up_vraag', this._id);
	},
	
	'click a.down_vraag': function(){
		Meteor.call('down_vraag', this._id);
	}
		

});


