export namespace Communication {
    // class ScoreMessage {
    //     public messageType: string;
    //     public score: number;

    //     constructor() {
    //         this.messageType = "SCORE";
    //     }
    // }

    export function postScore (newScore: number) {
        var msg = {messageType: "SCORE", score: newScore};
        window.parent.postMessage(msg, "*");
        //console.log(msg);
    }
}