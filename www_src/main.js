
/*******************************************************************;
 *              _        *  Project        :  STONE    
 *        _____/\_\      * -----------------------------------------;
 *       /\   / / /      *  Program name   :  main
 *    __/_ \  \/_/ \     * -----------------------------------------;
 *   /\___\ \_______\    *  Author         :  www.otrisovano.ru
 *   \/___/ /  __   /    * -----------------------------------------;
 *      \  /  /\ \ /     *  Date           :  01.11.2017 
 *       \/___\ \_\      * -----------------------------------------;
 *             \/_/      *  Purpose        :  game 2d
 *                       * -----------------------------------------;
 *                       *  License        :  MIT         
 *******************************************************************/


'use strict' 


/** IMPORT *********************************************************/ 

import Ui from './Ui' 
import Client from './Client'
import Ctx from './Ctx'

const ui     = new Ui()
const client = new Client()
const ctx    = new Ctx()


/** GAME VARS ******************************************************/

let timerFindEnemy            = null, 
intervalListenChoiceEnemy     = null,
timerRound                    = null,
timerUpdateGameResult         = null,
timerEndFatality              = null,
gameStatus                    = 'none', // play | made-choice-and-wait | wait-choice-fatality | fatality
                                        // play-bot | made-choice-and-wait-bot | waite-fat-bot | fat-bot 
randomFatalityHash            = null,

gooutBrowserTime              = null       


/** INIT GAME ******************************************************/

const init = () => {

  return new Promise(( resolve ) => {
      ctx.loadAssets( resolve )
  })
  .then(() => {
    return new Promise(( resolve ) => { 
      ui.init()    
      ctx.drawFrame()
      ctx.setStartSign() 
      initButtonSearchEnemy()
      initButtonStopSearchEnemy()      
      initButtonPlayWithBot()       
      initErrorConnection()
      initGooutBrowserTabError()                           
      resolve()
    })
  })
  .then(() => {
    if ( removeStartLoader ) removeStartLoader()
    connectFirst()
  })
}
  

const initErrorConnection = () => {

  client.setFunctionResponseError( () => {
    ui.setMessage( 'GAME DISCONNECTED' )
    clearErrorScreen()
  })
}


const initGooutBrowserTabError = () => {
  
  window.onblur = () => {
    if ( gameStatus != 'play' || gameStatus != 'made-choice-and-wait' ) return
    gooutBrowserTime = new Date()
  }
  window.onfocus = function () {
    if ( gooutBrowserTime == null ) return
    if ( new Date() - gooutBrowserTime > 200000 ) {
      gooutBrowserTime = null
      clearErrorScreen()
      ctx.setStartSign() 
      ui.showButtonSearch()      
    } 
  }
}


const clearErrorScreen = () => {

  ctx.removeBadSign( true, true ) 
  ctx.removeGoodSign( true, true )
  ctx.removeAnimationKulak( true, true )
  ctx.removeAnimationWait( true, true )  
  ctx.removePlayersChoices()    
  ctx.removeAnimationFatality()
  ui.hideButtonsChoice()
  clearAllTimers()       
  endBattle()      
}


const initStartButton = () => {

  ui.initStartButton(() => { 
    if ( removeStartScreen ) removeStartScreen()
    ui.showButtonSearch()
  })
} 


const initButtonSearchEnemy = () => {

  ui.clickButtonSearchEnemy(() => {
    initButtonsChoiceHero()
    ctx.removeGoodSign( true, false )
    ctx.removeBadSign( true, false )  
    ctx.removeAnimationFatality()
    ctx.removeStartSign()
    ctx.startAnimationWait( true, false )
    ui.clearScreen()
    ui.hideButtonSearch()
    apiFindEnemy()
  })       
}  
  

const initButtonStopSearchEnemy = () => {

  ui.initButtonStopSearchEnemy(() => {
    clearTimeout( timerFindEnemy )
    ui.hideButtonStopSearch()
    ui.showButtonSearch()
    ui.clearScreen()
    ctx.removeAnimationWait( true, false )
    ctx.setStartSign() 
  }) 
}
  
  
      
/** START FUNCTIONS ************************************************/

const connectFirst = () => {
  
  client.getSignIfConnectFirst(( serverResult ) => {
    ui.setConnectionMessage( serverResult.name )
  })
}
    
  
const apiFindEnemy = () => {

  client.sendSignToFindEnemy(( serverResult ) => {
    if ( serverResult.state === 'playing' ) { 
      gameStatus = 'play'
      meetingPlayers()					
    } else { 
      timerFindEnemy = setTimeout( apiFindEnemy, 500 ); 
    }      
  })
}
    

    
const meetingPlayers = () => {

  client.getSignAboutUpdateGameResult(( serverResult ) => {
    ui.setMessageSearchEnemy( serverResult.enemy.name )
    ctx.removeAnimationWait( true, false )
    ctx.prepearCanvasToFight( () => { 
      startRound()
    })	    
  }) 
}


/** FUNCTIONS PLAY ROUND *******************************************/

const startRound = () => {

  gameStatus = 'play'
  ui.hideButtonSearch()
  ui.startAnimationRoundTimer( 7000 )
  ui.redrawChoiceButtons( 'show' )
  ui.showButtonsChoice()  
  ctx.startAnimationKulak( true, true )

  intervalListenChoiceEnemy = setInterval( waitEnemyChoice, 1000 )
  timerRound = setTimeout( endTimerRound, 7000 )		
}
    
  
const waitEnemyChoice = () => {

  client.getSignAboutUpdateGameResult(( serverResult ) => {

    if ( serverResult.enemyMadeChoice ) {	
      ctx.stopAnimationKulak( false, true )
      clearInterval( intervalListenChoiceEnemy )		
    }
  })
}		
    

const initButtonsChoiceHero = () => {

  ui.clickButtonsChoiceHero( 
    ( e ) => {     
      if ( gameStatus === 'play' ) {	
        gameStatus = 'made-choice-and-wait' 
        sendHeroChoice( e.target.value )
        return 
      }
      if ( gameStatus === 'wait-choice-fatality' ) {
        checkFatalityDone( e.target.value )
      }        		
    }, 
    isUpdadeButtonsImgs
  )     
}


const isUpdadeButtonsImgs = () => {

  if ( gameStatus === 'play' ) return true
  return false
}


const sendHeroChoice = ( choice ) => {

  ctx.stopAnimationKulak( true, false )
  client.sendHeroChoice( choice, ( serverResult ) => {
    updateGameResult( serverResult )
  }) 
}	 


const endTimerRound = () => {  
  
  clearInterval( intervalListenChoiceEnemy )
  client.sendHeroChoice( 'timeout', ( serverResult ) => {
    updateGameResult( serverResult )
  })
}


const updateGameResult = ( serverResult ) => {	 
 
  if ( serverResult.state == 'oneOfPlayersDisconnected' ) {
    clearAllTimers()
    drawEnemyDisconnection()
    return
  }
  if ( serverResult.enemyMadeChoice ) {	
    clearAllTimers()

    ui.drawRoundResult( serverResult.results[ serverResult.results.length-1 ] )       
    ctx.drawPlayersChoices( serverResult.results[ serverResult.results.length-1 ] )

    setTimeout( nextRound, 4000 )
  } else {
    timerUpdateGameResult = setTimeout( () => {
      client.getSignAboutUpdateGameResult(( serverResult ) => {
        updateGameResult( serverResult )
      })            				
    }, 500 )
  }  
}


const clearAllTimers = () => {
  
  clearInterval( intervalListenChoiceEnemy )
  intervalListenChoiceEnemy = null    
  clearTimeout( timerUpdateGameResult )
  timerUpdateGameResult = null    
  clearTimeout( timerRound )
  timerRound = null        
} 


const nextRound = () => {
  
  client.sendReadyForNextRound(( serverResult ) => {
    clearAllTimers()  
    ctx.removePlayersChoices()
    ui.redrawChoiceButtons( 'show' )    
    if ( serverResult.state === 'play' || serverResult.state === 'wait_ready' ) {
      startRound()
      return		
    }
    if ( serverResult.state === 'wait_fatality') { 
      startFatality( serverResult )
      return 
    }     
    if ( serverResult.state === 'over' || serverResult.state === 'fatality' ) {
      endBattle()
      return
    }
  })
}

  
/** FUNCTIONS END GAME *********************************************/

const drawEnemyDisconnection = () => {

  client.postEnemyIsDisconnected()
  ui.setMessage('ENEMY RUN FROM BATTLE<br/>You WIN !')
  ui.hideButtonsChoice()
  ctx.stopAnimationKulak( true, true )
  ctx.removeAnimationKulak( true, true )  
  ctx.removePlayersChoices()  
  ctx.addGoodSign( true, false )    
  endBattle()   
} 


const startFatality = ( serverResult ) => {
  
  gameStatus = 'wait-choice-fatality'
  if ( serverResult.winner === 'me' ) {
    
    ui.setMessageStartFatality( 'me' )
    ui.showButtonsChoice()
    ctx.startAnimationWait( true, false )
    ctx.startAnimationComa( false, true )
    
    makeHashFatality()

    timerEndFatality = setTimeout( () => { 
      postWinnerResultFatality( 'miss' ) 
    }, 8000 )    
  }
  if ( serverResult.winner === 'enemy' ) {

    ui.hideButtonsChoice()  
    ui.setMessageStartFatality( 'enemy' )
    ctx.startAnimationWait( false, true )
    ctx.startAnimationComa( true, false )  
    
    loserWaitResultFatality()

    timerEndFatality = setTimeout( () => { endFatality() }, 14000 )    
  }
}
  
  
const makeHashFatality = () => {

  randomFatalityHash = []
  for ( let i = 0; i < 5; i ++ ) {
    let n = Math.floor( Math.random()*3 )
    if ( n == 0 ) { setValueInHash( 'stone' ) }
    if ( n == 1 ) { setValueInHash( 'scissors' ) }
    if ( n == 2 ) { setValueInHash( 'paper' )	}					
  }
}


const setValueInHash = value => {

  randomFatalityHash.push( value )
  ui.addValueFatality( value ) 
}    
  
  
const checkFatalityDone = choice => {

  if ( choice == randomFatalityHash[0] ) {		
    randomFatalityHash.splice( 0, 1 );
    if ( randomFatalityHash.length == 0 ) {
      postWinnerResultFatality( 'done' )
    }
  } else {
    postWinnerResultFatality( 'miss' )      
  }	 			   	
}
  
  
const postWinnerResultFatality = resultFatality => {

  client.postWinnerResultFatality( resultFatality, ( serverResult ) => {
    endFatality( serverResult )
  })
}
  
    
const loserWaitResultFatality = () => {

  client.loserWaitResultFatality(( serverResult ) => {
    if ( serverResult.fatality == 'none' ) {
      setTimeout( loserWaitResultFatality, 300 )
    } 
    if ( serverResult.fatality != 'none' ) {
      endFatality( serverResult )	
    }	      
  }) 
}  


const endFatality = serverResult => {

  if ( timerEndFatality !== null ) {
    clearTimeout( timerEndFatality )
    timerEndFatality = null     
  }
  ctx.removeAnimationWait( true, true )
  ctx.stopAnimationComa( true, true )
  ui.hideButtonsChoice()
  if ( serverResult ) {     
    if ( serverResult.winner == 'me' && serverResult.fatality == 'done' ) {
      ctx.startAnimationFatality( true )
    }
    if ( serverResult.winner == 'me' && serverResult.fatality == 'miss' ) {
      ctx.addBadSign( true, false )
      ctx.addGoodSign( false, true )      
    }  
    if ( serverResult.winner == 'enemy' && serverResult.fatality == 'done' ) { 
      ctx.startAnimationFatality( false )      
    }    
    if ( serverResult.winner == 'enemy' && serverResult.fatality == 'miss' ) {      
      ctx.addBadSign( false, true )
      ctx.addGoodSign( true, false )       
    }
  }
  if ( ! serverResult ) {
     ctx.addBadSign( false, true )
     ctx.addGoodSign( true, false )        
  }
  ui.removeFatalityBar()
  endBattle()  
}
  

const endBattle = () => setTimeout( clearEnemyFromScreen, 2000 ) 
  
  
const clearEnemyFromScreen = () => {

  gameStatus = 'none'
  ctx.removeGoodSign( false, true )
  ctx.removeBadSign( false, true )
  ui.showButtonSearch()  
  connectFirst() 
}


/** LOCAL BOT ******************************************************/

let gameBot = null 

const initButtonPlayWithBot = () => {
  ui.initButtonPlayWithBot(() => {
    
    gameBot = {
      myChoice:              null,
      enemyChoice:           null,
      winner:                null,
      enemyRoundChoiceTimer: null, 
      results:               [],
      fatality:              null
    }

    initButtonsChoiceHeroBot()
    ui.clearScreen()    
    ui.setMessageSearchEnemy( 'bot' )
    ui.hideButtonSearch()
    ctx.removeGoodSign( true, false )
    ctx.removeBadSign( true, false )  
    ctx.removeAnimationFatality()
    ctx.removeStartSign()        
    ctx.prepearCanvasToFight( () => { 
      startRoundBot()
    })	    
  })
}

const startRoundBot = () => {

  ctx.removePlayersChoices()
  gameStatus = 'play-bot'
  ui.startAnimationRoundTimer( 7000 )
  ui.redrawChoiceButtons( 'show' )
  ui.showButtonsChoice()  
  ctx.startAnimationKulak( true, true )
  setRandomBotChoice()
  timerRound = setTimeout( endTimerRoundBot, 7000 )		
}

const setRandomBotChoice = () => {
  gameBot.enemyRoundChoiceTimer = setTimeout( makeChoiceBot, Math.random()*8000 )
}

const makeChoiceBot = () => {
  let choice = Math.floor( Math.random()*3 )
  if ( choice == 0 ) gameBot.enemyChoice = 'stone'
  if ( choice == 1 ) gameBot.enemyChoice = 'scissors'
  if ( choice == 2 ) gameBot.enemyChoice = 'paper'
  ctx.stopAnimationKulak( false, true )
  checkEndRoundBot()
}

const initButtonsChoiceHeroBot = () => {
  ui.clickButtonsChoiceHero( 
    ( e ) => {     
      if ( gameStatus === 'play-bot' ) {	
        gameStatus = 'made-choice-and-wait-bot' 
        gameBot.myChoice = e.target.value
        ctx.stopAnimationKulak( true, false )
        checkEndRoundBot()        
        return 
      }
      if ( gameStatus === 'wait-fat-bot' ) {
        checkFatalityDoneBOT( e.target.value )
      }        		
    }, 
    isUpdadeButtonsImgsBot
  )     
}

const isUpdadeButtonsImgsBot = () => {
  if ( gameStatus === 'play-bot' ) { return true }
  return false
}


const endTimerRoundBot = () => {  
  clearTimeout( gameBot.enemyRoundChoiceTimer )
  if ( gameBot.myChoice == null ) gameBot.myChoice = 'timeout' 
  if ( gameBot.enemyChoice == null ) gameBot.enemyChoice = 'timeout' 
  checkEndRoundBot()
}

const checkEndRoundBot = () => {
  if ( gameBot.myChoice == null ) return
  if ( gameBot.enemyChoice == null ) return
  
  gameBot.winner = checkRoundWinnerBot()
  gameBot.results.push( gameBot.winner ) 

  ui.drawRoundResult( gameBot )
  ctx.removeAnimationKulak( true, true )  
  ctx.drawPlayersChoices( gameBot )
  
  clearTimeout( timerRound )  
  gameBot.myChoice = gameBot.enemyChoice = gameBot.winner = null

  if ( ! checkGameWinnerBot() ) { 
    setTimeout( startRoundBot, 4000 )
  } else {
    startFatalityBot( checkGameWinnerBot() )
  }  
}

const checkRoundWinnerBot = () => {
  if ( gameBot.myChoice == gameBot.enemyChoice ) { return 'draw' }
  if ( gameBot.myChoice == 'timeout' ) { return 'enemy' }
  if ( gameBot.enemyChoice == 'timeout' ) { return  'me' }
  if ( gameBot.myChoice == 'stone' ) {
    if ( gameBot.enemyChoice == 'scissors' ) { return 'me' }
    if ( gameBot.enemyChoice == 'paper' ) { return 'enemy' }         
  }
  if ( gameBot.myChoice == 'scissors' ) {
    if ( gameBot.enemyChoice == 'stone' ) { return 'enemy' }
    if ( gameBot.enemyChoice == 'paper' ) { return 'me' }         
  }
  if ( gameBot.myChoice == 'paper' ) {
    if ( gameBot.enemyChoice == 'stone' ) { return 'me' }
    if ( gameBot.enemyChoice == 'scissors' ) { return 'enemy' }         
  }   
}

const checkGameWinnerBot = () => {
   let winsHero = 0
   let winsEnemy = 0
   for ( let i = 0; i < gameBot.results.length; i ++ ) {
     if ( gameBot.results[i] == 'me' ) winsHero ++ 
     if ( gameBot.results[i] == 'enemy' ) winsEnemy ++ 
   }
   if ( winsHero > winsEnemy && winsHero > 2 ) { return 'me' }
   if ( winsEnemy > winsHero && winsEnemy > 2 ) { return 'enemy'}
   return false 
}

const startFatalityBot = v => {
  ctx.removePlayersChoices()
  if ( v == 'me' ) {
    gameStatus = 'wait-fat-bot'
    ui.setMessageStartFatality( 'me' )
    ui.redrawChoiceButtons( 'show' )
    ctx.startAnimationWait( true, false )
    ctx.startAnimationComa( false, true )
    makeHashFatality()    
    timerEndFatality = setTimeout( () => { drawFatalityBOT( 'me', false ) } , 7000 ) 
  }
  if ( v == 'enemy' ) {
    setMessageStartFatality( 'enemy' )
    ui.hideButtonsChoice()
    ctx.startAnimationWait( false, true )
    ctx.startAnimationComa( true, false )
    setTimeout( 
      () => {
        let isFat = null
        Math.random() < 0.8 ? isFat = true : isFat = false   
        drawFatalityBOT( 'enemy', isFat )
      }, 
      Math.random()*4000 + 2000 )    
  } 
}

const checkFatalityDoneBOT = choice => {
  if ( choice == randomFatalityHash[0] ) {		
    randomFatalityHash.splice( 0, 1 );
    if ( randomFatalityHash.length == 0 ) {
      drawFatalityBOT( 'me', true )      
    }
  } else {
    drawFatalityBOT( 'me', false )  
  }	 			   	
}

const drawFatalityBOT = ( who, isFat) => {

  clearTimeout( timerEndFatality )
  ctx.removeAnimationWait( true, true )
  ctx.stopAnimationComa( true, true )
  ui.hideButtonsChoice()
  ui.removeFatalityBar()

  if ( who == 'me' && isFat == true ) {
    ctx.startAnimationFatality( true )    
  }
  if ( who == 'me' && isFat == false ) {
    ctx.addBadSign( true, false )
    ctx.addGoodSign( false, true )        
  }
  if ( who == 'enemy' && isFat == true ) {
    ctx.startAnimationFatality( false )    
  }
  if ( who == 'enemy' && isFat == false ) {
    ctx.addBadSign( false, true )
    ctx.addGoodSign( true, false )  
  }    
  endBattle()  
}


/** RESIZE WIDDOW **************************************************/

const reckonWindowSize = () => {
  ctx.reckonWindowSize()
  ui.resizeUi()
}

window.addEventListener( 'resize', reckonWindowSize, false )


/** START INIT *****************************************************/

init()


