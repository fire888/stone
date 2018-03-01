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
	
	flagEnemyChoice: false,
	flagOldEnemyChoice: false,
	
	flagHeroChoise: false,
	
	
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
			Client.flagHeroChoise = true; 			
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
        //Client.timerRound = setTimeout(Client.endTimerRound, 14000);		
    },
	
    /** waite enemy Choice */
    waitEnemyChoice: () => {
        $.get('/api/game').done(function(results) {
            if (results.enemyMadeChoice) {
				
				Client.flagEnemyChoice = true;
				if (Client.flagEnemyChoice != Client.flagOldEnemyChoice){
					console.log("Enemy made choise: " + results.enemyMadeChoice);
					Client.flagOldEnemyChoice = true;									
	
					//Client.updateGameResult(results);
					//$('#info').append('Enemy made choice. ');			
				} 				
            }
        })
    },	

    /** get Results round */
    //updateGameResult: (result) => { 	
        //if ( Client.flagEnemyChoice && !Client.flagHeroChoise ) {
		//	return;		
		//}
		
		//if ( Client.flagEnemyChoice && Client.flagHeroChoise ){
		//	console.log('round done');		
		//}
        //    var allresults = result.results;
         //   var lastresult = allresults.length-1;

         //   $('#info').append("<br/>Hero: " + 
         //       lastresult.myChoise + "/ Enemy: " + 
         //       lastresult.enemyChoice);
				
	        //stopAnimationWait();
	        //clearInterval( Client.timerListenChoiceEnemy );	  
	        //Client.nextRound();
			
        //    console.log(result);
        //} else {
         //   setTimeout( () => {
         //       $.get('/api/game').done(Client.updateGameResult)
         //   }, 500);
        // }  
    //},
  

    /** send player Choice */
    //sendHeroChoice: (choice) => { 
     //   $.post('/api/game/move?choice=' + choice)
      //      .then(Client.updateGameResult); 
    //},	 
  
    /** endTimer fight round */
    //endTimerRound: () => { 
	 //   $.post('/api/game/move?choice=timeout')
	//	    .then(Client.updateGameResult)
    //},
  
    /** next round */
    //nextRound: () => {
    //    $.post('/api/game/next-round')
    //       .then(function(result) {				
     //           if (result.state === 'over') {
	//	            Client.endBattle();
    //            } else {
	//	            Client.startRound();
    //            }
     //   });
    //},
	
	
    /** FUNCTIONS END GAME ================== */
    /** ======================================*/	
  
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

