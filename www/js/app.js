/*********************************************;
*  Project        : STONE
*  Program name   : Client
*  Author         : www.otrisovano.ru
*  Date           : 01.11.2017 
*  Purpose        : game client   
 *********************************************/	
alert('!')
 
/*********************************************;
 *  Object CLIENT
 *********************************************/
			
const Client = {
	
    timerListenChoiceEnemy: null,
	timerRound: null,
	timerUpdateGameResult: null,
	
	gameStatus: "none",
	randomFatalityHash: null,
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
			if (Client.gameStatus != "wait-choice-fatality" ){			
				$('.buttonsChoice').hide();				
				Client.sendHeroChoice( e.target.value );
			}else{
				Client.checkFatalityDone( e.target.value );
			}				
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
        Client.timerListenChoiceEnemy = setInterval(Client.waitEnemyChoice, 1000);
        Client.timerRound = setTimeout(Client.endTimerRound, 7000);		
    },
	
    /** waite enemy Choice */
    waitEnemyChoice: () => {	
        $.get('/api/game').done(function(results) {
            if (results.enemyMadeChoice) {	
			
				clearInterval( Client.timerListenChoiceEnemy );			
				$('#info').append('Enemy made choice.');
				console.log(results);	
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
		clearInterval(Client.timerListenChoiceEnemy);
		$.post('/api/game/move?choice=timeout')
			.then(Client.updateGameResult);
	},
	
    /** Check round winner */
    updateGameResult: (result) => {	
		if (result.enemyMadeChoice) {	
			clearTimeout( Client.timerUpdateGameResult );
			clearTimeout(Client.timerRound);
			stopAnimationWait();			
			$('#info').append(
					"<br/>Your: " + result.results[result.results.length-1].myChoice + 
					" / Enemy: " + result.results[result.results.length-1].enemyChoice + 
					" / Winner: " + result.results[result.results.length-1].winner );
					
					setTimeout(Client.nextRound, 2000);		
							
		} else {
			Client.timerUpdateGameResult = setTimeout( () => {				
				$.get('/api/game').done(Client.updateGameResult)
			}, 500);
		}  
	},	
  
    /** next round */
	nextRound: () => {
		$.post('/api/game/next-round')
			.then(function(result) {
				console.log(result);	
				if (result.state === 'over') {
                    Client.endBattle();
				}
				
				if ( result.state === 'wait_fatality'){ 
					Client.gameStatus = "wait-choice-fatality";
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
		Client.timerEndFatality = setTimeout(Client.endFatality, 50000);	
		startAnimationWait();
		
		if (result.winner === "me"  ){	
			Client.makeHashFatality();		
			$('.buttonsChoice').show();		
		}else{
			$('#info').append('<br/>wait Death...');						
		}	
		
	},
	
	makeHashFatality: () => {		
		Client.randomFatalityHash = [];
		$('#info').append('<br/>Fatality: ');
		for ( let i=0; i < 5; i++ ){
			let n = Math.floor(Math.random()*3);
			if ( n == 0){
				Client.randomFatalityHash.push("stone");
				$('#info').append(" stone");
			}
			if ( n == 1){
				Client.randomFatalityHash.push("scissors");
				$('#info').append(" scissors");				
			}
			if ( n == 2){
				Client.randomFatalityHash.push("paper");
				$('#info').append(" paper");				
			}					
		}
	},
	
	checkFatalityDone: (choice) => {

		console.log(choice) 
		//if (choice == Client.randomFatalityHash[0]){		
			//Client.hrandomFatalityHash.splice(0, 1);
			//if (Client.randomFatalityHash.length == 0){
			//	$('#info').append("<br/>FATALITY !!!!");
			//		$.post('/api/game/fatalityDone')
			//			.then( function(){
			//				endFatality();						
			//			});	
			//}
		//}else{
		console.log('wrongFatality');
			//$.post('/api/game/fatalityCrash')
			//	.then( function(){
		Client.endFatality();
			//   });
		//}
	},
	
	endFatality: () => {
		$('.buttonsChoice').hide();		
		stopAnimationWait();	
		$('#info').append("<br/>Fatality Crash !! <br/>");

		$.post('/api/game/fatalityDone')
			.then( function(){
		        //endFatality();						
	    });
		//Client.connectFirst();		
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

