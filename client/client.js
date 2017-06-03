///////////////////
// CLIENT
///////////////////

import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

//import './main.html';

var gamestatus_subscription = Meteor.subscribe('gamestatus');
//var gamestatus = null;

console.log(Session.get('gamestate'));

Template.kieseenrol.helpers({
    // Helper functions here

    'statusbeschikbaar': function() {
        return gamestatus_subscription.ready();
    },
    
    'gamestatus': function() {
        return kwis_status.findOne().gamestatus;
    },
    
    'gamestatusIs_0': function() {
        var returnvalue = kwis_status.findOne().gamestatus;
        console.log(returnvalue);
        return returnvalue==0;
    },
    
    'gamestatusIs_1': function() {
        var returnvalue = kwis_status.findOne().gamestatus;
        console.log(returnvalue);
        return returnvalue==1;
    },
    
    'gamestatusIs_2': function() {
        var returnvalue = kwis_status.findOne().gamestatus;
        console.log(returnvalue);
        return returnvalue==2;
    },
    
    'gamestatusIs_3': function() {
        var returnvalue = kwis_status.findOne().gamestatus;
        console.log(returnvalue);
        return returnvalue==3;
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
                    
    }
    
});

