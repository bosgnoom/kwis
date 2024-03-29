///////////////////
// CLIENT
///////////////////

// Import ...stuff... Needed?
//import { Template } from 'meteor/templating';
//import { ReactiveVar } from 'meteor/reactive-var';

// Connect to the gamestatus (should be pushed from server.js)
var gamestatus_subscription = Meteor.subscribe('gamestatus');
Session.setDefault("userId", null);

// For debugging
Meteor.subscribe('kwis_gebruikers');
Meteor.subscribe('kwis_vragen');
Meteor.subscribe('kwis_namen');

///////////////////////////////////////////////////
// Template functions    
///////////////////////////////////////////////////
Template.kieseenrol.helpers({
    // Helper functions here

    'statusbeschikbaar': function() {
        // Check whether gamestatus is available for client use
        return gamestatus_subscription.ready();
    },
    
    'gamestatus': function() {
        // Return actual gamestatus
        //console.log("gamestatus: " + kwis_status.findOne().gamestatus);
        return kwis_status.findOne().gamestatus;
    },
    
    'gamestatusIs': function(welke) {
        // Test what value gamestatus has
        var returnvalue = kwis_status.findOne().gamestatus;
        //console.log("welke: " + returnvalue);
        return returnvalue==welke;
    },
    
    'thereisanuserId': function(){
        // Check whether an userId is set
        var userId = Session.get('userId');
        //console.log("checking for userId: " + userId);
        return userId != null;
    },
    
    'userId': function(){
        // Return the userId
        //console.log("Returning userid");
        return Session.get('userId');
    },
    
    'userisadmin': function(){
    	// Check if user is admin
    	// And yes, very insecure!
    return Session.get('isAdmin')
    },
    
    'username': function(){
    	return Session.get('username');
  	}
    	
});

Template.kieseenrol.events({
    // Events go here
    'submit form': function(event) {
        // Prevent form submission
        event.preventDefault();
        return true;
        },
    
    'click .kieseenrol': function(event) {
        // Change the role of the player
        var nieuwe_rol = event.target.value;
        var user = Session.get('userId');
       
        Meteor.call('veranderRol', user, nieuwe_rol, function(error, result){
            if (error) console.log("Error: " + error);
            if (result) console.log("Result: " + result);
            });
        
        if (nieuwe_rol == "admin") {
            //console.log("ADMIN");
            // Yes, very insecure!
            Session.set('isAdmin', true);
            Meteor.call('update_gamestatus', 1);
            };
            
        if (nieuwe_rol == "host") {
        	Session.set('isHost', true);
        	Meteor.call('update_gamestatus', 2);
      	};

    },
    
    'submit .vulnaamin': function(event) {
        // Request userId and set the player name
        var username = event.target.naam.value;
        //console.log("Username: '" + username + "'");
        Session.set("username", username);
        Meteor.call("getUserId", username, function(error, result){
            if (error) console.log("Error: " + error);
            if (result) {
                console.log("Result_getuserId: " + result);
                Session.set("userId", result);
                }
            });
        console.log("userid gevonden:" + Session.get("userId"));
            
    }
    
});

Template.admin_screen.helpers({
// Helpers for the admin screen
	kwis_titels: function() {
		return kwis_namen.find({}, {sort: {naam: 1}});
	},
		
	isCreatingkwis: function() {
		return Session.get("isCreatingkwis");
	},
	
	isEditingKwis: function(){
		//return Session.get('editedKwisId') === this._id;
		return Session.get('editedKwisId') != null;
	},
	
	isPrintingKwis: function(){
	    return Session.get('printKwisId') != null;
    },
    
    vragen_van_de_kwis: function(){
        var kwis = Session.get('printKwisId');
        return kwis_vragen.find(
            { kwisId: kwis },
            { sort: { volgorde:1 }});
    },

    antwoord: function(welk){
        return 'ABCD'[welk-1];
    }
});

Template.admin_screen.events({
	'submit form': function(event) {
	  // Prevent form submission
	  event.preventDefault();
	  return true;
  },
        
	'click a.create': function() {
		Session.set('isCreatingkwis', true);
	},
	
	'click a.cancel': function() {
		Session.set('isCreatingkwis', false);
		Session.set('editedKwisId', null);
	},
	
	'click a.edit': function(event){
		//console.log("Going to edit kwis");
		Session.set('editedKwisId', this._id);
	},
	
	'click a.printen': function(event){
	    Session.set('username', this.naam);
	    Session.set('printKwisId', this._id);
    },
	
    'click a.remove': function(event){
        if (confirm("Weet je het zeker dat de kwis verwijderd moet worden?")) {
      	    Meteor.call("verwijderkwis", this._id, function(error, result){
	            if (error) console.log("Error: " + error);
                if (result) {
                    console.log("verwijderkwis: " + result);
                }
            });
        }
	},
	
	'submit form.Creatingkwis': function(event) {
		var kwisnaam = event.target.naam.value;
		//console.log("kwisnaam: " + kwisnaam);
		Meteor.call("voegkwisnaamtoe", kwisnaam, function(error, result){
 			if (error) console.log("Error: " + error);
 			if (result) console.log("voegkwisnaamtoe: " + result);
    });
    Session.set("isCreatingkwis", false);
  }
	
});

Template.resetknop.events({
	'submit .resetknop': function(event){
		event.preventDefault();
		
		// Remove all Session variables
		// First set all Session variables to null (reactive)
		for (prop in Session.keys) {
			//console.log(prop + ": " + Session.get(prop));
			Session.set(prop, null);
		}
		// Then, remove all keys (not reactive)
		Session.keys = {};
		
		var iets = Meteor.call('resetKwis');		
	}

});

