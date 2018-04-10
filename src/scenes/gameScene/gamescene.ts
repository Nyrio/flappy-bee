import * as ex from 'excalibur';
import { Resource } from '../../resource';
import { Player } from '../../actors/player/player';
import { Pesticide } from '../../actors/obstacles/pesticide';
import { BackgroundObject } from '../../actors/decor/backgroundObject';
import { GameSettings } from '../../gamesettings';
import { Communication } from '../../communication';


// The game scene runs forevers, being able to reset its own state to create a new game.
class GameScene extends ex.Scene {

    public score: number;
    public bestScore: number;

    public player: Player;
    protected centerLabel: ex.Label;
    protected restartLabel: ex.Label;
    protected scoreLabel: ex.Label;
    protected bestScoreLabel: ex.Label;

    protected lastObstacleTime: number;
    protected lastObstacleY: number;
    public lastPest: number;
    protected lastBackgroundTime: number;

    public gameStarted: boolean;
    public gameOver: boolean;
    public resetScene: boolean;
    public canRestart: boolean;

    public ground: ex.Actor;

    public onInitialize(engine: ex.Engine) {
        this.score = 0;
        this.bestScore = 0;

        var background = new ex.Actor();
        background.addDrawing(Resource.Background.asSprite());
        this.add(background);
        background.x = GameSettings.WIDTH/2;
        background.y = GameSettings.HEIGHT/2;
        background.z = -10;

        this.player = new Player(this);
        this.add(this.player);
        this.player.z = 7;

        this.lastObstacleTime = GameSettings.TIME_INTERVAL;
        this.lastObstacleY = GameSettings.HEIGHT/2;
        this.lastPest = -1;
        this.lastBackgroundTime = GameSettings.BG_TIME_INTERVAL;

        this.centerLabel = new ex.Label("Click to start flapping.", GameSettings.WIDTH/2, GameSettings.HEIGHT/2, "Arial");
        this.centerLabel.textAlign = ex.TextAlign.Center;
        this.centerLabel.baseAlign = ex.BaseAlign.Middle;
        this.centerLabel.fontSize = 42;
        this.centerLabel.color = ex.Color.White;
        this.add(this.centerLabel);
        this.centerLabel.z = 10;

        this.restartLabel = new ex.Label("click to restart", GameSettings.WIDTH/2, GameSettings.HEIGHT/2 + 32, "Arial");
        this.restartLabel.textAlign = ex.TextAlign.Center;
        this.restartLabel.baseAlign = ex.BaseAlign.Top;
        this.restartLabel.fontSize = 28;
        this.restartLabel.color = ex.Color.White;
        this.add(this.restartLabel);
        this.restartLabel.z = 10;
        this.restartLabel.visible = false;

        this.scoreLabel = new ex.Label("0", 32, 32, "Arial");
        this.scoreLabel.textAlign = ex.TextAlign.Left;
        this.scoreLabel.baseAlign = ex.BaseAlign.Top;
        this.scoreLabel.fontSize = 42;
        this.scoreLabel.color = ex.Color.White;
        this.add(this.scoreLabel);
        this.scoreLabel.z = 10;

        this.bestScoreLabel = new ex.Label("Best: 0", GameSettings.WIDTH-32, 32, "Arial");
        this.bestScoreLabel.textAlign = ex.TextAlign.Right;
        this.bestScoreLabel.baseAlign = ex.BaseAlign.Top;
        this.bestScoreLabel.fontSize = 42;
        this.bestScoreLabel.color = ex.Color.White;
        this.add(this.bestScoreLabel);
        this.bestScoreLabel.z = 10;

        this.gameStarted = false;
        this.gameOver = false;
        this.resetScene = false;
        this.canRestart = false;

        this.ground = new ex.Actor();
        this.ground.addDrawing(Resource.Ground.asSprite());
        this.ground.x = GameSettings.WIDTH/2;
        this.ground.y = GameSettings.HEIGHT - GameSettings.GROUND_HEIGHT/2;
        this.ground.setWidth(GameSettings.WIDTH);
        this.ground.setHeight(GameSettings.GROUND_HEIGHT);
        this.add(this.ground);
        this.ground.z = 5;

        engine.input.pointers.primary.on("down", this.onPress);
        //engine.input.keyboard.on("press", (evt: Input.KeyEvent) => { if(evt.key == Input.Keys.Space) this.onSpace() });

        window.addEventListener("message", this.receiveMessage, false);
        Communication.loadRequest();

        this.camera.pos = new ex.Vector(GameSettings.WIDTH/2, GameSettings.HEIGHT/2);
    }

    public onPress = () => {
        if(!this.gameStarted) {
            this.gameStarted = true;
            this.centerLabel.visible = false;
        }

        if(this.gameOver && this.canRestart)
            this.resetScene = true;
    }

    // Function called by an event listener to handle messages from the store.
    public receiveMessage = (event: any) => {
        if(event.data.messageType == "LOAD") {
            //console.log("received message");
            this.bestScore = Math.max(this.bestScore, event.data.gameState.bestScore);
        }
    }


    public update(engine: ex.Engine, delta: number) {
        super.update(engine, delta);

        this.bestScoreLabel.text = "Best: " + this.bestScore;

        // There's a timer after game over before the player can click restart, just to avoid to restart
        // accidentally because the player is tapping the screen before they notice the game has ended.
        if(this.gameOver && !this.canRestart) {
            this.lastObstacleTime += delta/1000;
            if(this.lastObstacleTime > 1) {
                this.canRestart = true;
                this.restartLabel.visible = true;
            }
        }

        // This allows to reset the game completely after a game over and restart.
        if(this.resetScene) {
            for(var ac in this.actors) {
                if(this.actors[ac] instanceof Pesticide || this.actors[ac] instanceof BackgroundObject) {
                    this.actors[ac].kill();
                }
            }

            this.player.reset();

            this.score = 0;
            this.restartLabel.visible = false;
            this.centerLabel.text = "Click to start flapping.";

            this.gameStarted = false;
            this.gameOver = false;
            this.canRestart = false;

            this.lastObstacleTime = GameSettings.TIME_INTERVAL;
            this.lastObstacleY = GameSettings.HEIGHT/2;

            this.lastBackgroundTime = GameSettings.BG_TIME_INTERVAL;

            this.resetScene = false;
        }

        // Doing nothing if game isn't active
        else if(this.gameOver || !this.gameStarted)
            return;

        else {

            this.lastObstacleTime += delta/1000;
            this.lastBackgroundTime += delta/1000;

            if(this.lastObstacleTime > GameSettings.TIME_INTERVAL) {
                var posx = GameSettings.WIDTH + Math.floor(Math.random() * GameSettings.VARIABILITY);
                var spaceY = Math.floor(GameSettings.MAX_SPACE - (GameSettings.MAX_SPACE - GameSettings.MIN_SPACE) / GameSettings.SCORE_MAX_DIFF);
                var posy;
                do {
                    posy = Math.floor(spaceY + Math.random() * (GameSettings.HEIGHT - GameSettings.GROUND_HEIGHT - 2*spaceY))
                } while(Math.abs(posy - this.lastObstacleY) > (GameSettings.START_V_LIMIT + (GameSettings.END_V_LIMIT - GameSettings.START_V_LIMIT) * this.score / GameSettings.SCORE_MAX_DIFF) * GameSettings.HEIGHT);
                //alert(posx + " " + posy + " " + spaceY);

                this.add(new Pesticide(posx, posy, spaceY, this));
                this.lastObstacleY = posy;
                this.lastObstacleTime = 0;
            }


            if(this.lastBackgroundTime > GameSettings.BG_TIME_INTERVAL) {
                var bg = new BackgroundObject(this)
                this.add(bg);
                bg.z = -3
                this.lastBackgroundTime = 0;
            }

            this.scoreLabel.text = this.score.toString();
        }
    }

    // Called by the obstacles when they detect collision
    public setGameOver = () => {
        this.gameOver = true;
        this.centerLabel.text = "Game Over"
        this.centerLabel.visible = true;
        this.lastObstacleTime = 0;

        if(this.score > this.bestScore) {
            this.bestScore = this.score;
            Communication.postGameState(this.bestScore);
        }

        Communication.postScore(this.score);
    }

    public onActivate() {}
    public onDeactivate() {}
}

export { GameScene };