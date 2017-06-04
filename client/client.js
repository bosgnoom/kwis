///////////////////
// CLIENT
///////////////////

// Import ...stuff...
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

// Connect to the gamestatus (should be pushed from server.js)
var gamestatus_subscription = Meteor.subscribe('gamestatus');
Session.setDefault("userId", null);

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
        console.log("checking for userId: " + userId);
        return userId != null;
    },
    
    'userId': function(){
        // Return the userId
        console.log("Returning userid");
        return Session.get('userId');
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
        var nieuwe_status = null;
        
        if (nieuwe_rol == "admin") nieuwe_status = 1;
        if (nieuwe_rol == "host") nieuwe_status = 2;
        if (nieuwe_rol == "user") nieuwe_status = 3;
        
        //console.log("Nieuwe status: " + nieuwe_status);
        
        var kwis_status_id = kwis_status.findOne()._id;
        //console.log(kwis_status_id);  
        
        Meteor.call('update_gamestatus', nieuwe_status, function(error, result){
            if (error) console.log("Error: " + error);
            if (result) console.log("Result: " + result);
        });

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

