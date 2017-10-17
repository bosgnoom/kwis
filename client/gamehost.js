Template.chooseKwis.helpers({

	'kwisLijst': function(){
		return kwis_namen.find({}, {sort: {naam: 1}});
	}

});

Template.chooseKwis.events({

	'click a.hostKiestKwis': function(){
		Session.set('activeKwis', this._id);
        
        var kwis_naam = kwis_namen.findOne( {_id: this._id} );
        //console.log(kwis_naam);
        Session.set('username', kwis_naam.naam);

		Meteor.call('thisKwis', this._id);
		Meteor.call('update_gamestatus', 3);
	}
	
});

Template.waitRoom.helpers({

	'spelers': function(){
		return kwis_gebruikers.find({ rol: 'user' });
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
        var elem = document.getElementById("progressBar"); 
        var width = 100;
        var progress_id = setInterval(frame, 250);
        
        function frame() {
            var elem = document.getElementById("progressBar"); 
            //console.log("Progress bar element: " + elem);
            if (width > 0 && elem) {
                width--; 
                elem.style.width = width + '%'; 
                
                if ((width < 30) && (width >= 10)) {
                    elem.style.backgroundColor = "orange";
                    }
                if (width < 10) {
                    elem.style.backgroundColor = "red";
                    }
                } else {
                    clearInterval(progress_id);
                }
            } 
                //else {
                   // clearInterval(progress_id);
              //  }
           // }
       // }

		//return true;
	},

	'questionCount': function(){
		//console.log(Session.get('activeKwis'));
		return kwis_vragen.find({ kwisId: Session.get('activeKwis') }).count() - 1;
	},
	
	'currentQuestion': function(){
		//console.log("vraag");
		var nr = kwis_status.findOne().currentQuestion;
		var vraag = kwis_vragen.find(
			{ kwisId: Session.get('activeKwis')},
			{ sort: { volgorde: 1}}
			).fetch()[nr];
		console.dir(vraag);
		return vraag.vraag;
	},
	
	'currentQuestionNumber': function(){
		return kwis_status.findOne().currentQuestion + 1;
	},
	
	'currentAnswer': function(welke){
		var nr = kwis_status.findOne().currentQuestion;
		var vraag = kwis_vragen.find(
			{ kwisId: Session.get('activeKwis')},
			{ sort: { volgorde: 1}}
			).fetch()[nr];
		if (welke == 1) return vraag.antwoord1;
		if (welke == 2) return vraag.antwoord2;
		if (welke == 3) return vraag.antwoord3;
		if (welke == 4) return vraag.antwoord4;
    },
    	
	'resetPlayerAnswer': function(){
		Session.set('playerAnswer', null);
	},
	
	'playerAnswer': function(){
		return Session.get('playerAnswer');
	}

});

Template.questionRoom.events({
	'click a.answers': function(event){
		Session.set('playerAnswer', event.target.innerHTML);
		// return player answer to server
		Meteor.call('submitPlayerAnswer', Session.get('userId'), event.target.innerHTML);
		//console.log(Date.now());
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
		//console.log("nr: " + nr);
		var vraag = kwis_vragen.find(
			{ kwisId: Session.get('activeKwis')}, 
			{sort: { volgorde: 1 }}
			).fetch()[nr];
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
	},
	
	'spelerScores': function(){
		return kwis_gebruikers.find({ rol: 'user' });
	},

	'spelerTopScores': function(){
		return kwis_gebruikers.find(
            { rol: 'user' },
            { sort: { score: -1 }, limit: 10});
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
	}

});

Template.playerAnswerScreen.helpers({
	'answerColor': function(){
		var iets = kwis_status.findOne().currentAnswer;
		var goedAntwoord = 'ABCD'[iets-1]
		//console.log("Goed antwoord: " + goedAntwoord);
		var antwoord = Session.get('playerAnswer');
		//console.log("Antwoord gegeven: " + antwoord);
		
		if (iets) {
			// timer has ended
			if (antwoord === goedAntwoord) {
				return "green";
			} else {
				return "red";
			}
		} else {
			// waiting for timer to end
			return "grey";
		}
	},
	
	'playerAnswer': function(){
		return Session.get('playerAnswer');
	}
	
});

Template.endgame.helpers({
    'wie_hebben_er_gewonnen': function(){
        return kwis_gebruikers.find(
            {rol: 'user'},
            {sort: {score: -1}, limit: 10});
    },
    
	'isHost': function(){
		return Session.get('isHost');
	},
	
	'eind_score': function(){
        var user_id = Session.get('userId');
        return kwis_gebruikers.findOne({ _id: user_id }).score;
    }	    

});





