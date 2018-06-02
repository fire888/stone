/***********************************************;
*  Project        : STONE
*  Program name   : Client
*  Author         : www.otrisovano.ru
*  Date           : 01.11.2017 
*  Purpose        : game client   
 ***********************************************/	


/***********************************************;
 *  Object CLIENT
 ***********************************************/
			
const Client = {
	
    timerListenChoiceEnemy: null,
	timerRound: null,
	timerUpdateGameResult: null,
	
	gameStatus: 'none',
	randomFatalityHash: null,	
	timerEndFatality: null,

			
	
    /** FUNCTIONS INIT/CONNECTION **************/
    
    init: () => { 
	
        $( '#buttonSearch' ).click( () => {
            $( '#info' ).append( 'Searching enemy:...' );
            $( '#buttonSearch' ).hide();
            startAnimationWait();				
            Client.apiFindEnemy();	
        });
	
        $( '.buttonsChoice' ).click(( e ) => {
			if (Client.gameStatus != 'wait-choice-fatality' ){			
				$('.buttonsChoice').hide();				
				Client.sendHeroChoice( e.target.value );
			}else{
				Client.checkFatalityDone( e.target.value );
			}				
        }); 
			
        $( '.buttonsChoice' ).hide();
	    $( '#buttonSearch' ).hide();	
		
	    return Client.connectFirst();
    },	
  
	
    connectFirst: () => {	  

		$.get( '/api/session/hello' )
            .done(function(result) {		  
                $( '#info' ).append( 'Connecting done! <br/>' + 'your name: ' + result.name + line );	
                $( '#buttonSearch' ).show();					
        });
    },
  

    apiFindEnemy: () => {

	    $.post( '/api/user/find-game' )
		    .then(function(result) {
			    if (result.state === 'playing') {
				    stopAnimationWait();
				    return Client.meetingPlayers();						
			    } else { 
				    setTimeout( Client.apiFindEnemy, 500 ); 
			    }
		    });
    },
  

    meetingPlayers: () => {

	    $.get( '/api/game', function( result ) {
            $( '#info' ).append( 'ok.' + line + 'Find Enemy: ' + result.enemy.name);
            Client.startRound(); 		
	    });
    },
	
	
    /** FUNCTIONS PLAY ROUND *******************/
	
    startRound: () => {

        $( '#info' ).append( line + 'Round:<br/>' );
        startAnimationWait();
        $( '.buttonsChoice' ).show();	
        Client.timerListenChoiceEnemy = setInterval( Client.waitEnemyChoice, 1000 );
        Client.timerRound = setTimeout(Client.endTimerRound, 7000);		
    },
	

    waitEnemyChoice: () => {

        $.get('/api/game').done( function( results ) {
            if ( results.enemyMadeChoice ) {	
			
				clearInterval( Client.timerListenChoiceEnemy );			
				$( '#info' ).append( 'Enemy made choice.' );
            }
        })
    },		
	

	sendHeroChoice: ( choice ) => { 

		$( '#info' ).append( 'You: ' + choice + '<br/>' );	
		$.post( '/api/game/move?choice=' + choice)
			.then( Client.updateGameResult ); 
	},	 
  
    
	endTimerRound: () => { 

		clearInterval( Client.timerListenChoiceEnemy );
		$.post( '/api/game/move?choice=timeout' )
			.then( Client.updateGameResult );
	},
	
    
    updateGameResult: ( result ) => {	
	
		if ( result.enemyMadeChoice ) {	
			clearTimeout( Client.timerUpdateGameResult );
			clearTimeout( Client.timerRound );
			stopAnimationWait();			
			$('#info').append(
					'<br/>Your: ' + result.results[result.results.length-1].myChoice + 
					' / Enemy: ' + result.results[result.results.length-1].enemyChoice + 
					' / Winner: ' + result.results[result.results.length-1].winner + 
					'<br/>'
			);		
			setTimeout( Client.nextRound, 2000 );						
		} else {
			Client.timerUpdateGameResult = setTimeout( () => {				
				$.get('/api/game').done( Client.updateGameResult )
			}, 500);
		}  
	},	
  

	nextRound: () => {

		$.post( '/api/game/next-round' )
			.then( function( result ) {

				if (result.state === 'over') {
                    Client.endBattle();
				}
				
				if ( result.state === 'wait_fatality') { 
					Client.gameStatus = 'wait-choice-fatality';
					Client.startFatality( result );		
				}
				 		
				if ( result.state !== 'fatality' && result.state !== 'wait_fatality'   ) {
					Client.startRound();		
				}
			});
	},
	
	
    /** FUNCTIONS END GAME *********************/
  
	startFatality: ( result ) => {

		Client.gameStatus = 'wait-choice-fatality'
		Client.timerEndFatality = setTimeout( Client.endFatality, 20000 );	
		startAnimationWait();
		
		if ( result.winner === 'me' ) {	
			Client.makeHashFatality();		
			$( '.buttonsChoice' ).show();		
		}

		if ( result.winner === 'enemy' ) {
		   $( '#info' ).append( '<br/>wait Death...' );
		   Client.loserWaitResultFatality();		
		}
	},
	

	makeHashFatality: () => {		

		Client.randomFatalityHash = [];
		$( '#info' ).append( '<br/>Fatality: ' );
		for ( let i = 0; i < 5; i ++ ) {
			let n = Math.floor( Math.random()*3 );
			if ( n == 0 ) {
				Client.randomFatalityHash.push( 'stone' );
				$('#info').append( ' stone' );
			}
			if ( n == 1 ) {
				Client.randomFatalityHash.push( 'scissors' );
				$( '#info' ).append( ' scissors' );				
			}
			if ( n == 2 ) {
				Client.randomFatalityHash.push( 'paper' );
				$( '#info' ).append( ' paper' );				
			}					
		}
	},
	

	checkFatalityDone: ( choice ) => {

		if ( choice == Client.randomFatalityHash[0] ) {		
			
			Client.randomFatalityHash.splice( 0, 1 );
			if ( Client.randomFatalityHash.length == 0 ) {
			    Client.postWinnerResultFatality( 'done' )
			}

		} else {

			Client.postWinnerResultFatality( 'miss' )
		
		} 	 			   	
	},


	postWinnerResultFatality: ( resultFatality ) => {
		$.post( '/api/game/fatality?is=' + resultFatality )
			.then( function( result ) {
		   		Client.endFatality( result )	
			});		
	},


	loserWaitResultFatality: () => {
		$.post( '/api/game/isFatalityDoneForLoser' )
		   .then( function( result ) {
			
			  if ( result.fatality == 'none' ) {
				setTimeout( Client.loserWaitResultFatality, 300 )
			  } 
			  
			  if ( result.fatality != 'none' ) {
				Client.endFatality( result )	
			  }	  
		   })	
	},
	

	endFatality: ( result ) => {		

		clearTimeout( Client.timerEndFatality )
		$( '.buttonsChoice' ).hide();	
		stopAnimationWait();
        

		if ( result.winner == 'me' && result.fatality == 'done' ) 	$('#info').append('<br/>Fatality #$%$$%%$ !!!!!!#@ !!!  <br/>');
		if ( result.winner == 'me' && result.fatality == 'miss' ) 	$('#info').append('<br/>Fatality Crach :(  <br/>');	
		if ( result.winner == 'enemy' && result.fatality == 'done' ) 	$('#info').append('<br/> BLOOOD MORE :< FATALITY DONE <br/>');
		if ( result.winner == 'enemy' && result.fatality == 'miss' ) 	$('#info').append('<br/> Fatality Miss  <br/>');			
	
        Client.endBattle();
	},

	
    endBattle: () => {

		$('#info').append('<br/>EndBattle'); 
		Client.connectFirst()
    }
}; 


/*********************************************;
 *  DRAW SCREEN FUNCTIONS
 *********************************************/

const line = '<br/>--------------------------------------------------------------<br/>'; 
 
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

