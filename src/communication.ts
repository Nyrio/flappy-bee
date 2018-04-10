export namespace Communication {
    export function loadRequest () {
        var msg = { messageType: "LOAD_REQUEST" };
        window.parent.postMessage(msg, "*");
    }

    export function postScore (newScore: number) {
        var msg = {messageType: "SCORE", score: newScore};
        window.parent.postMessage(msg, "*");
    }

    export function postSettings (width: number, height: number) {
        var msg = {messageType: "SETTING", options: {"width": width, "height": height}};
        window.parent.postMessage(msg, "*");
    }

    export function postGameState (highScore: number) {
        var msg = { messageType: "SAVE", gameState: { bestScore: highScore } };
        window.parent.postMessage(msg, "*");
    }
}