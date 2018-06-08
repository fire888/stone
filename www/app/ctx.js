
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


var renderer = new PIXI.CanvasRenderer(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.view);

var stage = new PIXI.Stage;

PIXI.loader
    .add('app/imgs/signs.json')
    .load(onAssetsLoaded);

function onAssetsLoaded()
{

    /** ANIMATION CHOICE */

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
    stage.addChild( waitHero );

    let animEnemy = new PIXI.extras.AnimatedSprite( framesWait );
    animEnemy.x = window.innerWidth/2;   
    animEnemy.y = 200
    animEnemy.anchor.set(0.5);  
    animEnemy.rotation = Math.PI
    animEnemy.animationSpeed = 0.15;
    animEnemy.play()
    stage.addChild(animEnemy);  
    
    
    /** ANIMATION COMA */

    var framesComa = []
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
    stage.addChild( comaHero ); 
    

    /** ANIMATION CHOICE */

    var framesChoice = []
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
    stage.addChild( choiceHero );   
    

    /** ANIMATION Stone */

    var framesStone = []
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
    stage.addChild( stoneHero );
    

    /** ANIMATION PAPER */

    var framesPaper = []
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
    stage.addChild( paperHero );
    

    /** ANIMATION SCISSORS */

    var framesScissors = []
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
    stage.addChild( scissorsHero );
    

    /** ANIMATION SIGNS */

    var framesSign = []
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
    stage.addChild( signHero );      


}


var zombieTexture = PIXI.Texture.fromImage('app/imgs/h01.png'); 
var zombie = new PIXI.Sprite(zombieTexture);

zombie.anchor.set(0.5);

zombie.position.x = 200
zombie.position.y = 300

stage.addChild(zombie)

function draw() { renderer.render(stage); requestAnimationFrame(draw); }

draw(); 
