export namespace Communication {
    export function postScore (newScore: number) {
        var msg = {messageType: "SCORE", score: newScore};
        window.parent.postMessage(msg, "*");
        //console.log(msg);
    }
}