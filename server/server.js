/////////////////////////
// SERVER
/////////////////////////

import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';

Meteor.startup(() => {
    // code to run on server at startup
  
    // Remove all users from system
    kwis_gebruikers.remove({});
    
    // Clear game state
    kwis_status.remove({});
    kwis_status.insert({ gamestatus: 0 }); // Status = 0, give 1st user choice
    kwis_status.insert({ showchoices: true }); // Show choice admin/host/user
  
    Meteor.publish('gamestatus', function() {
        return kwis_status.find({}, {fields: {'gamestatus':1}}); 
    });
    
    Meteor.publish('kwis_gebruikers', function() {
        return kwis_gebruikers;
    });
   
});

Meteor.methods({
    'update_gamestatus': function(nieuwe_status){
        //console.log("Method - nieuwe status:" + nieuwe_status);
        // update
        var id = kwis_status.findOne({}, {fields: {'gamestatus':1}})._id;
        kwis_status.update({ _id: id }, { gamestatus: nieuwe_status });
    },
    
    'getUserId': function(username){
        console.log("New user: " + username);
        var iets = kwis_gebruikers.insert({ name: username, score: 0 });
        console.log("id from insert: " + iets);
        return iets;
    }
    
});
