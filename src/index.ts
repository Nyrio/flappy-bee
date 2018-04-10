import * as ex from 'excalibur';
import { GameScene } from './scenes/gameScene/gamescene';
import { Player } from './actors/player/player';
import { Resource } from './resource';
import { GameSettings } from './gamesettings';
import { Communication } from './communication';

class Game extends ex.Engine {
    constructor() {
        super({ width: GameSettings.WIDTH,
                height: GameSettings.HEIGHT,
                displayMode: ex.DisplayMode.Fixed,
                pointerScope: ex.Input.PointerScope.Canvas });

        // This message allows the store to adapt to content size
        Communication.postSettings(GameSettings.WIDTH, GameSettings.HEIGHT);
    }

    public start(loader?: ex.ILoader) {
        return super.start(loader);
    }
}

// All the resources are pre-loaded
var loader = new ex.Loader();
for(var resource in Resource){
    loader.addResource(Resource[resource]);
}

// Creating the game and the unique scene
const game = new Game();
const gameScene = new GameScene();
game.add('gameScene', gameScene);

game.start(loader).then(() => {
    game.goToScene('gameScene');
});
