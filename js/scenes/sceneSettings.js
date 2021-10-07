class SceneSettings extends Phaser.Scene {
    constructor() {
        super('SceneSettings');
    }
    preload() {}
    create() {
        console.log("SceneSettings!");
        this.back = this.add.image(0, 0, "titleBack");
        this.back.setOrigin(0, 0);
        this.back.displayWidth = game.config.width;
        this.back.displayHeight = game.config.height;
        this.aGrid = new AlignGrid({
            scene: this,
            rows: 11,
            cols: 11
        });
       // this.aGrid.showNumbers();
        //
        //
        this.btnSound = new TextButton({
            scene: this,
            key: "green",
            event: mt.constants.TOGGLE_SOUND,
            text: "",
            scale: .35,
            textScale: 30,
            textColor: '#000000'
        });
        this.aGrid.placeAtIndex(16, this.btnSound);
        //
        //
        //
        this.btnMusic = new TextButton({
            scene: this,
            key: "green",
            event: mt.constants.TOGGLE_MUSIC,
            text: "",
            scale: .35,
            textScale: 30,
            textColor: '#000000'
        });
        this.aGrid.placeAtIndex(38, this.btnMusic);

        this.btnDone = new TextButton({
            scene: this,
            key: "red",
            event: mt.constants.SHOW_TITLE,
            params:this.scene,
            text: "Done",
            scale: .35,
            textScale: 30,
            textColor: '#000000'
        });
        this.aGrid.placeAtIndex(60, this.btnDone);


        mt.emitter.on(mt.constants.MUSIC_CHANGED, this.updateButtons, this);
        mt.emitter.on(mt.constants.SOUND_CHANGED, this.updateButtons, this);
        this.updateButtons();
    }
    updateButtons() {
        var soundText = "Sound Is On";
        if (mt.model.sfxOn == false) {
            soundText = "Sound Is Off";
        }
        var musicText = "Music Is On";
        if (mt.model.musicOn == false) {
            musicText = "Music Is Off";
        }
        this.btnSound.textfield.setText(soundText);
        this.btnMusic.textfield.setText(musicText);
    }
    update() {}
}