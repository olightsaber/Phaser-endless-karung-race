class SceneLoad extends Phaser.Scene {
    constructor() {
        super('SceneLoad');
    }
    preload() {
        this.progText = this.add.text(0, 0, "0%", {
            color: '#ffffff',
            fontSize: game.config.width / 10
        });
        this.progText.setOrigin(0.5, 0.5);
        Align.center(this.progText);
        Effect.preload(this, 7);
        this.load.on('progress', this.showProgress, this);
        this.load.image("btnStart", "images/btnStart.png");
        this.load.image("titleBack", "images/titleBack.jpg");
        this.load.image("blue", "images/buttons/blue.png");
        this.load.image("red", "images/buttons/red.png");
        this.load.image("orange", "images/buttons/orange.png");
        this.load.image("green", "images/buttons/green.png");
        this.load.image("sample", "images/sample.png");
        //
        //
        //
        this.load.image("grass", "images/assets/grass.png");
        this.load.spritesheet('obstacle', 'images/assets/obstacle.png', { frameWidth: 100, frameHeight: 100 })
        this.load.multiatlas('kampoeng', 'images/assets/kampoeng.json', 'images/assets/');        

        /* this.load.audio("right", "audio/right.wav");*/
        this.load.audio("over", "audio/catch.wav");
        this.load.audio("over", "audio/wrong.wav");
        this.load.audio("jump", "audio/right.wav");
        this.load.audio("bg_song", "audio/background.mp3");
    }
    create() {
        mt.emitter = new Phaser.Events.EventEmitter();
        mt.controller = new Controller();
        mt.mediaManager = new MediaManager({
            scene: this
        });
        this.scene.start("SceneMain");
    }
    showProgress(prog) {
        var per = Math.floor((prog / 1) * 100);
        this.progText.setText(per + "%");
        
    }
    update() {}
}