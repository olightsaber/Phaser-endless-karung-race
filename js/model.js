class Model {
    constructor() {
        this.numberOfColors = 4;
        this.score = 0;
        //
        //
        this._musicOn = true;
        this._sfxOn = true;
        this.gameTitle="Game\nTitle\nHere";
        this.instructionText="Instructions Here";

        // background speed
        this.bgSpeed = 3;
        this.bounceHeight = 300;
        this.charGravity = 1200;
        this.charPower = 1200;
        this.obstacleSpeed = 250;
        this.obstacleDistanceRange = [100, 250];
        this.localStorageName = 'bestballscore';
    }
    set musicOn(val) {
        this._musicOn = val;
        console.log(val);
        mt.emitter.emit(mt.constants.MUSIC_CHANGED);
    }
    get musicOn() {
        return this._musicOn;
    }
    set sfxOn(val) {
        this._sfxOn = val;
        console.log(val);
        mt.emitter.emit(mt.constants.SOUND_CHANGED);
    }
    get sfxOn() {
        return this._sfxOn;
    }
}