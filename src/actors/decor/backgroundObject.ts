import * as ex from 'excalibur';
import { Resource } from '../../resource';
import { GameSettings } from '../../gamesettings';
import { GameScene } from '../../scenes/gameScene/gamescene';

const objSprites = [Resource.ChemicalPlant, Resource.RadioTower];

class BackgroundObject extends ex.Actor {
    protected gameScene: GameScene;


    constructor(scene: GameScene) {
        super();

        this.x = 1.1*GameSettings.WIDTH + Math.floor(Math.random() * GameSettings.BG_VARIABILITY);
        this.y = GameSettings.HEIGHT - GameSettings.GROUND_HEIGHT;
        
        var randi = Math.floor(Math.random() * objSprites.length);

        this.anchor.setTo(0, 0);

        var sprite = objSprites[randi].asSprite();
        sprite.anchor.setTo(0, 1);
        this.addDrawing(sprite);

        this.setHeight(sprite.height);
        this.setWidth(sprite.width);

        this.gameScene = scene;
    }

    public onInitialize(engine: ex.Engine) {
        // do stuff
    }

    public update(engine: ex.Engine, delta: number) {
      super.update(engine, delta); // call base update logic

      if(this.gameScene.gameOver || !this.gameScene.gameStarted)
          return;

      this.x -= GameSettings.BG_HSPEED * delta/1000;

        if(this.x < -GameSettings.WIDTH/2) {
            this.kill();
        }
   }
}

export { BackgroundObject };