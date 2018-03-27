import * as ex from 'excalibur';
import { Resource } from '../../resource';
import { GameSettings } from '../../gamesettings';
import { GameScene } from '../../scenes/gameScene/gamescene';

const pestSprites = [Resource.Rndp, Resource.Smrtx, Resource.InsctWasp, Resource.Chogo];

class Pesticide extends ex.Actor {
    protected topPart: ex.Actor;
    protected bottomPart: ex.Actor;
    protected gameScene: GameScene;
    protected passed: boolean;

    constructor(xi: number, yi: number, ySpace: number, scene: GameScene) {
        super();

        this.x = xi;
        this.setWidth(0.8*GameSettings.PEST_WIDTH);
        this.setHeight(ySpace + 2 * GameSettings.PEST_HEIGHT);

        var randi;
        do {
            randi = Math.floor(Math.random() * pestSprites.length);
        } while(randi == scene.lastPest);
        scene.lastPest = randi;

        this.topPart = new ex.Actor();
        var topSprite = new ex.Sprite(pestSprites[randi], 0, 0, GameSettings.PEST_WIDTH, GameSettings.PEST_HEIGHT);
        topSprite.flipVertical = true;
        this.topPart.addDrawing(topSprite);
        this.topPart.x = 0;
        this.topPart.y = yi - (GameSettings.PEST_HEIGHT + ySpace) / 2;
        this.topPart.setWidth(GameSettings.PEST_WIDTH);
        this.topPart.setHeight(GameSettings.PEST_HEIGHT);
        this.add(this.topPart);

        this.bottomPart = new ex.Actor();
        var bottomSprite = new ex.Sprite(pestSprites[randi], 0, 0, GameSettings.PEST_WIDTH, GameSettings.PEST_HEIGHT);
        //bottomSprite.flipVertical = false;
        this.bottomPart.addDrawing(bottomSprite);
        this.bottomPart.x = 0;
        this.bottomPart.y = yi + (GameSettings.PEST_HEIGHT + ySpace) / 2;
        this.bottomPart.setWidth(GameSettings.PEST_WIDTH);
        this.bottomPart.setHeight(GameSettings.PEST_HEIGHT);
        this.add(this.bottomPart);

        this.gameScene = scene;
        this.passed = false;
    }

    public onInitialize(engine: ex.Engine) {
        // do stuff
    }

    public update(engine: ex.Engine, delta: number) {
      super.update(engine, delta); // call base update logic

      if(this.gameScene.gameOver || !this.gameScene.gameStarted)
          return;

      this.x -= GameSettings.HSPEED * delta/1000;

      if(this.topPart.collides(this.gameScene.player) != null || this.bottomPart.collides(this.gameScene.player) != null)
         this.gameScene.setGameOver();

      if(this.x < GameSettings.PEST_WIDTH/2) {
          if(!this.passed) {
              this.passed = true;
              this.gameScene.score++;
          }

          if(this.x < -GameSettings.PEST_WIDTH/2) {
              this.kill();
          }
      }
   }
}

export { Pesticide };