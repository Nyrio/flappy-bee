# Flappy Bee

This game was made as a part of a student project: creating a game store with Django, a web game, and add the game and other groups' games to the store.

A functional requirement for the game is to implement a system to exchange messages with the store for scores, and loading and saving game state. You will find more information about this system below. The game works even if it not run through the store.

## Credits

All the content has been created by [Doruk Gezici](http://dorukgezici.com) and [Louis Sugy](https://github.com/Nyrio) and released under MIT license. Programming by Doruk Gezici and Louis Sugy, assets by Louis Sugy.

## Compiling the game

You will need NodeJS and npm installed.

    npm install    # install dependencies
    npm run start  # run locally (changes in code updated in real time)
    npm run build  # build project to dist/ folder


## Technical documentation

### About ExcaliburJS

[ExcaliburJS](https://excaliburjs.com/) is an open-source 2D HTML5 game engine. We write the game in [TypeScript](http://www.typescriptlang.org/) and compile in HTML & JS.

This engine provide abstraction for the game loop and to draw in a canvas through scenes and actors.

### Game architecture

The game is structured with the following hierarchy:

 - `assets`
 - `src`
     - `scenes`
         - `gameScene`: the class `GameScene` handles most of the game logic, and its scene graph contains all the graphical elements to display in the canvas.
     - `actors`
         - `player`: the class `Player` handles player movement and animation.
         - `obstacles`: this handles obstacles scrolling and collision with the player.
         - `decor`: this handles the decor scrolling.
     - `index.ts`: starting point of the app, creating the game and the main and only scene.
     - `communication.ts`: namespace containing functions to send messages to the store.
     - `gamesettings.ts`: all the settings of the game are grouped here. From here it's possible to change the difficulty, how the game is displayed, etc.
     - `resource.ts`: the class `Resource` allows to preload the assets and then use them from anywhere in the code.
     
We followed the engine conventions (which are pretty standard in game industry), by inheriting the engine classes and overriding the method `update` for game logic, letting the engin manage graphics.

### Message system

In chronological order, here are the messages exchanged between game and store:

 - When the game is initialized, the game sends a `SETTING` message indicating its resolution.
 - When the main scene is ready to listen to messages, a `LOAD_REQUEST` message is sent to the store to ask to send game state (in our case, the previous best score).
 - Then the game can receive a `LOAD` message from the server with a previously saved state.
 - When the user ends a game, the game sends a `SCORE` message, and if it is a best score, it also sens a `SAVE` message.
 

Here are some examples of messages following the protocol described above:


Inform the store about the settings:

    {
        messageType: "SETTING",
        options: {
            "width": 800,
            "height": 600
        } 
    };


Request to load best score:

    {
        messageType: "LOAD_REQUEST"
    };


Publish a new score:

    {
        messageType: "SCORE",
        score: 13
    };


Save best score:

    {
        messageType: "SAVE",
        gameState: {
            bestScore: 42
        }
    };

Load best score:

    {
        messageType: "LOAD",
        gameState: {
            bestScore: 42
        }
    };
    
## Game Design

We didn't want to create an original idea given the purpose of the game and the time allocated. So we decided to create a clone of an existing concept. Something enjoyable, which would work as a web game. Doruk had the idea of making a flappy bird clone with a bee (ITU's mascot), and Louis had the idea of making it an engaged game against chemical pollution which kills bees.

Then we developed the game in an incremental process: first implementing the gameplay with rectangles and tweaking it through testing, then adding graphics (drawn with a drawing tablet on the free and open source software [Krita](https://krita.org/) - the Krita files are included in `art_source` folder), and finally implementing the communication protocol.
