
/*******************************************************************;
 *              _        *  Project        :  STONE
 *        _____/\_\      * -----------------------------------------;
 *       /\   / / /      *  Program name   :  draw canvas
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

class Ctx {
  constructor() {
    this.renderer = new PIXI.CanvasRenderer( window.innerHeight, window.innerHeight )
    document.body.appendChild( this.renderer.view )
    this.renderer.view.style.margin = '0 auto'
    this.stage = new PIXI.Stage
    
    this.stepX = null  
    this.stepY = null
    this.reckonWindowSize()
  }

  reckonWindowSize() {
    this.stepY = window.innerHeight/20
    this.stepX = window.innerHeight/20
  }

  initAnimation( onInit ) {
    PIXI.loader
      .add( 'app/imgs/signs.json' )
      .load(() => { 
        this.onAssetsLoaded( onInit ) 
      })
  }

  onAssetsLoaded( onInit ) {
    
    let framesWait = []
    for ( let i = 1; i < 8; i ++ ) {
      let val = i < 10 ? '0' + i : i
      framesWait.push( PIXI.Texture.fromFrame( 'wait' + val + '.png' ) )
    }

    this.waitHero = new PIXI.extras.AnimatedSprite( framesWait )
    this.waitHero.x = window.innerWidth/2;
    this.waitHero.y = window.innerHeight/2 + 50;
    this.waitHero.anchor.set(0.5);
    this.waitHero.animationSpeed = 0.12;

    /*
    let animEnemy = new PIXI.extras.AnimatedSprite( framesWait );
    animEnemy.x = window.innerWidth/2;   
    animEnemy.y = 200
    animEnemy.anchor.set(0.5);  
    animEnemy.rotation = Math.PI
    animEnemy.animationSpeed = 0.15;
    animEnemy.play()
    this.stage.addChild(animEnemy);  
    */
    
    /** ANIMATION COMA */

    /*
    let framesComa = []
    for ( i = 1; i < 11; i ++ ) {
      val = i < 10 ? '0' + i : i;
      framesComa.push( PIXI.Texture.fromFrame( 'coma' + val + '.png' ) )
    }
    var comaHero = new PIXI.extras.AnimatedSprite( framesComa )
    comaHero.x = window.innerWidth/2 - 150;
    comaHero.y = window.innerHeight/2 + 50;
    comaHero.anchor.set(0.5);
    comaHero.animationSpeed = 0.12;
    comaHero.play();
    this.stage.addChild( comaHero ); 
    */

    /** ANIMATION CHOICE */

    let framesChoice = []
    for ( let  i = 1; i < 7; i ++ ) {
      let val = i < 10 ? '0' + i : i
      framesChoice.push( PIXI.Texture.fromFrame( 'choice' + val + '.png' ) )
    }
    this.choiceHero = new PIXI.extras.AnimatedSprite( framesChoice)
    this.choiceHero.x = this.stepX*10
    this.choiceHero.y = this.stepY*12
    this.choiceHero.anchor.set( 0.5 )
    this.choiceHero.animationSpeed = 0.12

    this.choiceEnemy = new PIXI.extras.AnimatedSprite( framesChoice)
    this.choiceEnemy.x = this.stepX*10
    this.choiceEnemy.y = this.stepY*8
    this.choiceEnemy.rotation = Math.PI
    this.choiceEnemy.anchor.set( 0.5 )
    this.choiceEnemy.animationSpeed = 0.12  
   
    /** ANIMATION Stone */

    let framesStone = []
    for ( let i = 1; i < 4; i ++ ) {
      let val = i < 10 ? '0' + i : i
      framesStone.push( PIXI.Texture.fromFrame( 'stone' + val + '.png' ) )
    }
    this.stoneHero = new PIXI.extras.AnimatedSprite( framesStone )
    this.stoneHero.x = this.stepX*10
    this.stoneHero.y = this.stepY*12
    this.stoneHero.anchor.set(0.5)
    this.stoneHero.animationSpeed = 0.05
    this.stoneHero.loop = false
  
    /** ANIMATION PAPER */
    /* 
    let framesPaper = []
    for ( i = 2; i < 5; i ++ ) {
      val = i < 10 ? '0' + i : i;
      framesPaper.push( PIXI.Texture.fromFrame( 'paper' + val + '.png' ) )
    }
    var paperHero = new PIXI.extras.AnimatedSprite( framesPaper )
    paperHero.x = window.innerWidth/2 + 150;
    paperHero.y = window.innerHeight/2 + 50;
    paperHero.anchor.set(0.5);
    paperHero.animationSpeed = 0.05;
    paperHero.play();
    this.stage.addChild( paperHero );
    */

    /** ANIMATION SCISSORS */
    /*
    let framesScissors = []
    for ( i = 2; i < 5; i ++ ) {
      val = i < 10 ? '0' + i : i;
      framesScissors.push( PIXI.Texture.fromFrame( 'scissors' + val + '.png' ) )
    }
    var scissorsHero = new PIXI.extras.AnimatedSprite( framesScissors )
    scissorsHero.x = window.innerWidth/2 + 250;
    scissorsHero.y = window.innerHeight/2 + 50;
    scissorsHero.anchor.set(0.5);
    scissorsHero.animationSpeed = 0.05;
    scissorsHero.play();
    this.stage.addChild( scissorsHero );
    */


    /** ANIMATION SIGNS */
  
   let framesSign = []
    for ( let i = 0; i < 13; i ++ ) {
      let val = i < 10 ? '0' + i : i
      framesSign.push( PIXI.Texture.fromFrame( 'sign' + val + '.png' ) )
    }
    this.signHero = new PIXI.extras.AnimatedSprite( framesSign )
    this.signHero.x = this.stepX*12
    this.signHero.y = this.stepY*10
    this.signHero.anchor.set( 0.5 )
    this.signHero.animationSpeed = 0.05

    this.signEnemy = new PIXI.extras.AnimatedSprite( framesSign )
    this.signEnemy.x = this.stepX*8
    this.signEnemy.y = this.stepY*10
    this.signEnemy.rotation = Math.PI 
    this.signEnemy.anchor.set( 0.5 )
    this.signEnemy.animationSpeed = 0.05
    
    onInit()
  }

  setStartSign() {
    this.signHero.gotoAndStop(0)
    this.signHero.x = window.innerWidth/2
    this.signHero.y = window.innerHeight/2 + 100  
    this.stage.addChild( this.signHero )
  }

  removeStartSign() {
    this.stage.removeChild( this.signHero )   
  }

  startHeroWaitAnimation() {
    this.waitHero.play()
    this.stage.addChild( this.waitHero )
  }

  stopHeroWaitAnimation() {
    this.waitHero.stop()
    this.stage.removeChild( this.waitHero )
  }  

  prepearCanvasToFight( canvasReady ) {
    this.signHero.gotoAndStop( Math.floor( Math.random()*12 + 1 ) )
    this.stage.addChild( this.signHero )
    this.signEnemy.gotoAndStop( Math.floor( Math.random()*12 + 1 ) )
    this.stage.addChild( this.signEnemy )
    setTimeout( () => { 
        this.canvasReadyToFight( canvasReady ) 
      }, 1500 )
  }  

  canvasReadyToFight( canvasReady ) {
    this.stage.removeChild( this.signHero )
    this.stage.removeChild( this.signEnemy )    
    canvasReady()
  }

  startAnimationChoice( hero, enemy ) {
    if ( hero ) {
      this.choiceHero.play()
      this.stage.addChild( this.choiceHero )    
    }
    if ( enemy ) {
      this.choiceEnemy.play()
      this.stage.addChild( this.choiceEnemy )    
    }    
  } 

  stopAnimationChoice( hero, enemy ) {
    if ( hero ) {
      this.choiceHero.gotoAndStop( 5 )    
    }
    if ( enemy ) {
      this.choiceEnemy.gotoAndStop( 5 )     
    }    
  }
  
  drawPlayersChoices( heroChoice, enemyChoice ) {
    this.stage.removeChild( this.choiceEnemy )
    this.stage.removeChild( this.choiceHero )
    //let spriteChoiceHero = this.getSprite( true, false, heroChoice ).play()
    //this.stage.addChild( spriteChoiceHero )
  }

  getSprite( hero, enemy, choice ) {
    let sp = null
    if ( hero ) {
      if ( choice == 'stone' ) {
        sp = this.stoneHero 
      }
      if ( choice == 'paper' ) {
        sp = this.paperHero 
      }
      if ( choice == 'scissors' ) {
        sp = this.scissorsHero 
      }         
    }
    return sp
  }

  /** DRAW EVERY FRAME */

  draw() { 
    this.renderer.render( this.stage )
    requestAnimationFrame(() => { 
      this.draw() 
    })
  }
}   

/*************************************************************** */
/*
const loadFatality = () => {
  PIXI.loader
  .add('app/imgs/fat01.json')
  .load(onAssetsLoadedFatality)
}

const onAssetsLoadedFatality = () => {
  */ 
    /** FATALITY HERO  */
    
 /*   let framesSign = []

    for ( i = 0; i < 8; i ++ ) {
      val = i < 10 ? '0' + i : i;
      framesSign.push( PIXI.Texture.fromFrame( 'fat01_' + val + '.png' ) )
    }
    let fatHero = new PIXI.extras.AnimatedSprite( framesSign )
    fatHero.x = window.innerWidth/2 + 400;
    fatHero.y = window.innerHeight/2 + 50;
    fatHero.anchor.set(0.5);
    fatHero.animationSpeed = 0.05;
    fatHero.play();
    stage.addChild( fatHero );    
}


var zombieTexture = PIXI.Texture.fromImage('app/imgs/h01.png'); 
var zombie = new PIXI.Sprite(zombieTexture);

zombie.anchor.set(0.5);

zombie.position.x = 200
zombie.position.y = 300

stage.addChild(zombie)
*/
export default Ctx

