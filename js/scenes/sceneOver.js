class SceneOver extends Phaser.Scene {
    constructor() {
        super('SceneOver');
    }
    preload() {}
    create() {
        this.bg = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'kampoeng', 'background.png').setOrigin(0,0);
        this.bg.tilePositionY = 450;
        this.bg.tilePositionX = 1700;
        
        this.aGrid = new AlignGrid({
            scene: this,
            rows: 14,
            cols: 12
        });
        //    this.aGrid.showNumbers();
        //
        //
        //
        this.titleText = this.add.text(0, 0, mt.model.gameOverTitle, {
            fontSize: game.config.width / 5,
            color: "#FFF"
        }).setOrigin(.5, .5);
        Align.scaleToGameW(this.titleText, .5);
        this.aGrid.placeAtIndex(17, this.titleText)
        this.tweens.add({
            targets: this.titleText,
            y: 50,
            duration: 1500,
            ease: 'Sine.easeInOut',
            repeat: -1,
            yoyo: true
        });
        

        this.scoreText = this.add.text(0, 0, "score:" + mt.model.scoreResult, {
            fontSize: game.config.width / 5,
            color: "#fff"
        })
        Align.scaleToGameW(this.scoreText, .3);
        this.aGrid.placeAtIndex(39, this.scoreText)
        //
        //

        // PLAYER
        this.player = this.physics.add.sprite(0, 0, 'kampoeng', 'char-1.png').setScale(.5);
        this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNames('kampoeng', {
                start: 0, end: 2, zeroPad: 1, prefix: 'char-', suffix: '.png'
            }),
            frameRate: 5,
            repeat: -1
        });
        this.player.play('walk');
        this.aGrid.placeAtIndex(89, this.player);

        this.btnHome = new TextButton({
            scene: this,
            key: "blue",
            event: mt.constants.SHOW_TITLE,
            params: this.scene,
            text: "Home",
            scale: .30,
            textScale: 30,
            textColor: '#fff'
        });
        this.aGrid.placeAtIndex(153, this.btnHome)
        //
        //
        //
        this.playAgain = new TextButton({
            scene: this,
            key: "green",
            event: mt.constants.START_GAME,
            params: this.scene,
            text: "Play Again",
            scale: .30,
            textScale: 30,
            textColor: '#fff'
        });
        this.aGrid.placeAtIndex(129, this.playAgain);
        // this.btnSettings = new TextButton({
        //     scene: this,
        //     key: "orange",
        //     event: mt.constants.SHOW_SETTINGS,
        //     params: this.scene,
        //     text: "Settings",
        //     scale: .35,
        //     textScale: 30,
        //     textColor: '#000000'
        // });
        // this.aGrid.placeAtIndex(85, this.btnSettings);
    }
}