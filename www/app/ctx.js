
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
    .add('app/imgs/wait.json')
    .load(onAssetsLoaded);

function onAssetsLoaded()
{
    var frames = [];

    for ( var i = 1; i < 11; i++ ) {
      var val = i < 10 ? '0' + i : i;
      frames.push(PIXI.Texture.fromFrame('wait' + val + '.png'));
    }
    var anim = new PIXI.extras.AnimatedSprite(frames);
    anim.x = window.innerWidth / 2;
    anim.y = window.innerHeight / 2 + 50;
    anim.anchor.set(0.5);
    anim.animationSpeed = 0.15;
    anim.play();
    stage.addChild(anim);

    let animEnemy = new PIXI.extras.AnimatedSprite(frames);
    animEnemy.x = window.innerWidth / 2;   
    animEnemy.y = 600
    anim.anchor.set(0.5);  
    animEnemy.rotation = Math.PI
    animEnemy.animationSpeed = 0.15;
    animEnemy.play()
    stage.addChild(animEnemy);    

}


var zombieTexture = PIXI.Texture.fromImage('app/imgs/h01.png'); 
var zombie = new PIXI.Sprite(zombieTexture);

zombie.anchor.set(0.5);

zombie.position.x = 200
zombie.position.y = 300

stage.addChild(zombie)

function draw() { renderer.render(stage); requestAnimationFrame(draw); }

draw(); 
