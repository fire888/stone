
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


class Ctx {
  constructor() {
    this.renderer = new PIXI.CanvasRenderer( window.innerWidth, window.innerHeight )
    document.body.appendChild( this.renderer.view )
    this.stage = new PIXI.Stage     
  }

  initAnimation( onInit ) {
    PIXI.loader
      .add( 'app/imgs/signs.json' )
      .load(() => { 
        this.onAssetsLoaded( onInit ) 
      })
  }

  onAssetsLoaded( onInit ) {
    
    var framesWait = []
    for ( var i = 1; i < 8; i ++ ) {
      var val = i < 10 ? '0' + i : i;
      framesWait.push( PIXI.Texture.fromFrame( 'wait' + val + '.png' ) )
    }

    var waitHero = new PIXI.extras.AnimatedSprite( framesWait )
    waitHero.x = window.innerWidth/2;
    waitHero.y = window.innerHeight/2 + 50;
    waitHero.anchor.set(0.5);
    waitHero.animationSpeed = 0.12;
    waitHero.play();
    this.stage.addChild( waitHero );

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

    /*
    let framesChoice = []
    for ( i = 1; i < 7; i ++ ) {
      val = i < 10 ? '0' + i : i;
      framesChoice.push( PIXI.Texture.fromFrame( 'choice' + val + '.png' ) )
    }
    var choiceHero = new PIXI.extras.AnimatedSprite( framesChoice)
    choiceHero.x = window.innerWidth/2 - 250;
    choiceHero.y = window.innerHeight/2 + 50;
    choiceHero.anchor.set(0.5);
    choiceHero.animationSpeed = 0.12;
    choiceHero.play();
    this.stage.addChild( choiceHero );   
    */

    /** ANIMATION Stone */

    /*
    let framesStone = []
    for ( i = 1; i < 4; i ++ ) {
      val = i < 10 ? '0' + i : i;
      framesStone.push( PIXI.Texture.fromFrame( 'stone' + val + '.png' ) )
    }
    var stoneHero = new PIXI.extras.AnimatedSprite( framesStone )
    stoneHero.x = window.innerWidth/2 - 350;
    stoneHero.y = window.innerHeight/2 + 50;
    stoneHero.anchor.set(0.5);
    stoneHero.animationSpeed = 0.05;
    stoneHero.play();
    this.stage.addChild( stoneHero );
    */

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
   /* 
   let framesSign = []
    for ( i = 0; i < 13; i ++ ) {
      val = i < 10 ? '0' + i : i;
      framesSign.push( PIXI.Texture.fromFrame( 'sign' + val + '.png' ) )
    }
    var signHero = new PIXI.extras.AnimatedSprite( framesSign )
    signHero.x = window.innerWidth/2 + 400;
    signHero.y = window.innerHeight/2 + 50;
    signHero.anchor.set(0.5);
    signHero.animationSpeed = 0.05;
    signHero.play();
    this.stage.addChild( signHero );
    */
    onInit()
  }

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

