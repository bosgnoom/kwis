//Meteor.subscribe('gebruikers');

Template.chooseKwis.helpers({

	'kwisLijst': function(){
		return kwis_namen.find({}, {sort: {naam: 1}});
	}

});

Template.chooseKwis.events({

	'click a.hostKiestKwis': function(){
		Session.set('activeKwis', this._id);
		Meteor.call('thisKwis', this._id);
		Meteor.call('update_gamestatus', 3);
	}
	
});

Template.waitRoom.helpers({

	'spelers': function(){
		return kwis_gebruikers.find({ rol: null });
	},
	
	'isHost': function(){
		return Session.get('isHost');
	}
	
});

Template.waitRoom.events({

	'submit form': function(event) {
		// Prevent form submission
		event.preventDefault();
    return true;
  },
  
	'submit .startGame': function(){
		Meteor.call('update_gamestatus', 4);		
		//Meteor.call('currentQuestion', 0);
	}
	  
});

Template.questionRoom.helpers({

	'isHost': function(){
		return Session.get('isHost');
	},
	
	'startTimer': function(){
		Meteor.call('startTimer');
		//return true;
	},
	
	'questionCount': function(){
		//console.log(Session.get('activeKwis'));
		return kwis_vragen.find({ kwisId: Session.get('activeKwis') }).count() - 1;
	},
	
	'currentQuestion': function(){
		//console.log("vraag");
		var nr = kwis_status.findOne().currentQuestion;
		var vraag = kwis_vragen.find({ kwisId: Session.get('activeKwis')}).fetch()[nr];
		console.dir(vraag);
		return vraag.vraag;
	},
	
	'currentQuestionNumber': function(){
		return kwis_status.findOne().currentQuestion + 1;
	}

});

Template.questionRoom.events({
	'click .antwoorden': function(event, tracker){
		console.dir(event);
		console.dir(tracker);
		console.dir(this);
		console.log(event.target.innerHTML);
	}

});

Template.answerRoom.helpers({
	'isHost': function(){
		return Session.get('isHost');
	},
	
	'notEndgame': function(){
		var numberOfQuestions = kwis_vragen.find({ kwisId: Session.get('activeKwis') }).count() - 1;
		var currentQuestion = kwis_status.findOne().currentQuestion;
		//console.log("n: " + numberOfQuestions);
		//console.log("x: " + currentQuestion);
		if (currentQuestion > numberOfQuestions) {
			Meteor.call('update_gamestatus', 6);
		}
		return currentQuestion < numberOfQuestions;
	},
	
	'currentAnswer': function(){
		var nr = kwis_status.findOne().currentQuestion;
		console.log("nr: " + nr);
		var vraag = kwis_vragen.find({ kwisId: Session.get('activeKwis')}).fetch()[nr];
		console.dir(vraag);
		//console.dir(vraag);
		switch (vraag.goede) {
			case "1": 
				return "A: " + vraag.antwoord1;
				break;
			case "2":
				return "B: " + vraag.antwoord2;
				break;
			case "3":
				return "C: " + vraag.antwoord3;
				break;
			case "4":
				return "D: " + vraag.antwoord4;
				break;
			default:
				return "Er is iets mis gegaan met het antwoord...";
				break;
			}
		return false;
	}
		
	
});

Template.answerRoom.events({
	'submit form': function(event) {
		// Prevent form submission
		event.preventDefault();
    return true;
  },

	'submit .nextQuestion': function(){
		Meteor.call('nextQuestion');
		Meteor.call('update_gamestatus', 4);		
		return true;
	},
	
	'submit .gotoEndgame': function(){
		Meteor.call('update_gamestatus', 6);
		return true;
	},
	
	'.click': function(){
		console.log(this);
	}


});



