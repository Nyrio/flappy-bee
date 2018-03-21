/// <reference path="../node_modules/excalibur/dist/excalibur.d.ts" />

import { Bee } from "./bee";

const WIDTH = 800;
const HEIGHT = 600;

var game = new ex.Engine({
    width: WIDTH,
    height: HEIGHT,
     displayMode: DisplayMode.Fixed
});


// scene initalization

var gameScene = new ex.Scene();
var bee = new ex.Bee();
game.add("game", gameScene);

// create an asset loader
var loader = new ex.Loader();
var resources = {

    /* include resources here */
    //txPlayer: new ex.Texture("assets/tex/player.png")

};

// queue resources for loading
for (var r in resources) {
    loader.addResource(resources[r]);
}

// uncomment loader after adding resources
game.start(/* loader */).then(() => {
    game.goToScene("game");
});