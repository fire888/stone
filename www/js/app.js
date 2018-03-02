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
	
    timerListenChoiceEnemy: null,
	timerRound: null,
	
	hashFatality: null,
	strFatality: "",	
	userChoiseFatality: null,
	timerEndFatality: null,

			
	
    /** FUNCTIONS INIT/CONNECTION =========== */
    /** ======================================*/
  
    /** prepear buttons */
    init: () => { 
	
		/** button Search */
        $('#buttonSearch').click( () => {
            $('#info').append("Searching enemy:...");
            $('#buttonSearch').hide();
            startAnimationWait();				
            Client.apiFindEnemy();	
        });

		/** buttons Stone,Scissors,Paper */	
        $('.buttonsChoice').click( (e) => {
	        $('.buttonsChoice').hide();				
			Client.sendHeroChoice( e.target.value );
		
        }); 
			
        $('.buttonsChoice').hide();
	    $('#buttonSearch').hide();	
		
		/** end init, start */
	    return Client.connectFirst();
    },	
  
    /** connect to server */	
    connectFirst: () => {	  
        $.get('/api/session/hello')
            .done(function(result) {		  
		        
                $('#info').append(
                   'Connecting done! <br/>' +
                   'your name: ' + result.name + line);
					
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
            $('#info').append('ok.' + line + 
                'Find Enemy: ' + result.enemy.name);
				
            Client.startRound(); 		
	    });
    },
	
	
    /** FUNCTIONS PLAY ROUND ================ */
    /** ===================================== */	
	
    /** start round */
    startRound: () => {
        $('#info').append( line + 'Round:<br/>');
        startAnimationWait();
        $('.buttonsChoice').show();	
        Client.timerListenChoiceEnemy = setInterval(Client.waitEnemyChoice, 500);
        Client.timerRound = setTimeout(Client.endTimerRound, 7000);		
    },
	
    /** waite enemy Choice */
    waitEnemyChoice: () => {
        $.get('/api/game').done(function(results) {
            if (results.enemyMadeChoice) {
				clearInterval( Client.timerListenChoiceEnemy );	
				$('#info').append('Enemy made choice.');					
            }
        })
    },		
	
    /** send player Choice */
	sendHeroChoice: (choice) => { 
		$('#info').append('You: ' + choice + '<br/>');	
		$.post('/api/game/move?choice=' + choice)
			.then(Client.updateGameResult); 
	},	 
  
    /** endTimer fight round */
	endTimerRound: () => { 
		$.post('/api/game/move?choice=timeout')
			.then(Client.updateGameResult);
	},
	
    /** Check round winner */
    updateGameResult: (result) => {
		if (result.enemyMadeChoice) {	

			clearTimeout(Client.timerRound);
			clearInterval(Client.timerListenChoiceEnemy);
			
			stopAnimationWait();			
			$('#info').append(
					"<br/>Your: " + result.results[result.results.length-1].myChoice + 
					" / Enemy: " + result.results[result.results.length-1].enemyChoice + 
					" / Winner: " + result.results[result.results.length-1].winner );
					
					setTimeout(Client.nextRound, 2000);		
							
		} else {
			setTimeout( () => {				
				$.get('/api/game').done(Client.updateGameResult)
			}, 500);
		}  
	},	
  
    /** next round */
	nextRound: () => {
		$.post('/api/game/next-round')
			.then(function(result) {	
				console.log(result)
				if (result.state === 'over') {
                    Client.endBattle();
				}
				
				if ( result.state === 'wait_fatality'){ 
					Client.startFatality( result );		
				}
				 		
				if ( result.state !== 'fatality' && result.state !== 'wait_fatality'   ) {
					Client.startRound();		
				}
			});
		},
	
	
    /** FUNCTIONS END GAME ================== */
    /** ======================================*/	
  
	startFatality: (result) => {
		Client.timerEndFatality = setTimeout(Client.endFatality, 7000);	
		startAnimationWait();
		
		if (result.winner === "me"  ){	
			Client.makeHashFatality();		
			$('.buttonsChoice').show();		
		}else{
			$('#info').append('<br/>wait Death..');						
		}	
		
	},
	
	makeHashFatality: () => {		
		Client.hashFatality = [];
		$('#info').append('<br/>Fatality: ');
		for ( let i=0; i < 5; i++ ){
			let n = Math.floor(Math.random()*3);
			if ( n == 0){
				Client.hashFatality.push("stone");
				$('#info').append(" stone");
			}
			if ( n == 1){
				Client.hashFatality.push("scissors");
				$('#info').append(" scissors");				
			}
			if ( n == 2){
				Client.hashFatality.push("paper");
				$('#info').append(" paper");				
			}					
		}
	},
	
	endFatality: () => {
		$('.buttonsChoice').hide();		
		stopAnimationWait();	
		$('#info').append("<br/> HERE GAME NOT WORKING <br/>");
		Client.connectFirst();		
	},
	
    endBattle: () => {
        $('#info').append('<br/>EndBattle'); 
    }
}; 


/*********************************************;
 *  DRAW SCREEN FUNCTIONS
 *********************************************/

const line = '<br/>------------------' +
             '----------------------' +
             '----------------------<br/>'; 
 
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

