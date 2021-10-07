class Obstacles extends Phaser.Scene {
  constructor()
  {
    super();
  }
  setUp(obs)
  {
    obs.body.allowGravity = false;
    obs.body.immovable = true;
    obs.body.moves = false;
    obs.x = game.config.width ;
    obs.y = game.config.height/2;
    obs.setScale(.3);
    obs.setOrigin(.5);
    obs.active = true; 
  }
}