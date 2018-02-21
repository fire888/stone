/*********************************************;
*  Project        : STONE
*  Program name   : Client
*  Author         : www.otrisovano.ru
*  Date           : 01.11.2017 
*  Purpose        : game client   
 *********************************************/	

 
/*********************************************;
 *  Object CLIENT
 *********************************************/
			
const Client = {
	
    timerRound: null,
  
    /** prepear buttons */
    init: () => { 
        $('#buttonSearch').click( () => {
            $('#info').append("Searching enemy:...");
            $('#buttonSearch').hide();
            startAnimationWait();				
            Client.apiFindEnemy();	
        });		
        $('.buttonsChoice').click( (e) => {
	        $('.buttonsChoice').hide();	
            Client.sendHeroChoice( e.target.value );		
        }); 	
        $('.buttonsChoice').hide();
	    $('#buttonSearch').hide();	
	    return Client.connectFirst();
    },	
  
    /** connect to server */	
    connectFirst: () => {	  
        $.get('/api/session/hello')
            .done(function(result) {		  
		        $('#info').append('Connecting done! <br/> your name: ' + result.name + '<br/>---------------------------------------<br/>');
		        $('#buttonSearch').show();					
        });
    },
  
    /** search enemy */
    apiFindEnemy: () => {
	    $.post("/api/user/find-game")
		    .then(function(result) {
			    if (result.state === 'playing') {
				    stopAnimationWait();
				    return Client.meetingPlayers();					  
			    } else { 
				    setTimeout( Client.apiFindEnemy, 500 ); 
			    }
		    });
    },
  
    /** get First gameObject */
    meetingPlayers: () => {
	    $.get('/api/game', function(result) {
	        $('#info').append('ok.<br/ >---------------------------------------<br/>Find Enemy: ' + result.enemy.name);  
            Client.startRound(); 		
	    });
    },
  
    /** start round */
    startRound: () => {
        $('#info').append('<br/>---------------------------------------<br/>Round: ');
        startAnimationWait();
        $('.buttonsChoice').show();	
	    Client.timerRound = setInterval(Client.waitEnemyChoice, 500);  	  
    },

    /** get Results round */
    updateGameResult: (result) => { 	
        if (result.enemyMadeChoice) {	
            var allresults = result.results;
            var lastresult = allresults.length-1;
	        $('#info').append("<br/>Hero: " + lastresult.myChoise + "/ Enemy: " + lastresult.enemyChoice);
	        stopAnimationWait();
	        clearInterval( Client.timerRound );	  
	        Client.nextRound();
	    } else {
            setTimeout( () => {
                $.get('/api/game').done(Client.updateGameResult)
            }, 500);
	    }  
    },
  
    /** waite enemy Choice */
    waitEnemyChoice: () => {
        $.get('/api/game').done(function(results) {
            if (results.enemyMadeChoice) {
                $('#info').append('Enemy made choice. ')	 	  
            }
        })
    },

    /** send player Choice */
    sendHeroChoice: (choice) => { 
	    //console.log(choice);
        $.post('/api/game/move?choice=' + choice)
            .then(Client.updateGameResult); 
    },	 
  
    /** endTimer fight round */
    endTimerRound: () => { 
	    $.post('/api/game/move?choice=timeout')
		    .then(Client.updateGameResult)
    },
  
    /** next round */
    nextRound: () => {
        $.post('/api/game/next-round')
           .then(function(result) {
                if (result.state === 'over') {
		            Client.endBattle();
                } else {
		            Client.startRound();
                }
        });
    },
  
    endBattle: () => {
	     $('#info').append('<br/>EndBattle'); 
    }
}; 


/*********************************************;
 *  Functions
 *********************************************/

let intervalAnimation = false; 
const startAnimationWait = () => {
    $('<div/>',{ 'id' : 'loadBar' }).appendTo('#info');	
    intervalAnimation = setInterval( waitProgress, 1000 );
}
const waitProgress = () => {
    $('#loadBar').append('*');	
} 
const stopAnimationWait = () => {
    clearInterval( intervalAnimation );
    $('#loadBar').remove();	
}
 
 
/*********************************************;
 *  INIT GAME
 *********************************************/
  
Client.init();

