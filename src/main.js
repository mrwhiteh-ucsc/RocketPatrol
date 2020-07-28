let config = {
    type: Phaser.CANVAS,
    width: 640,
    height: 480,
    scene: [ Menu, Play ]
}

//game declaration statement
let game = new Phaser.Game(config);

// define game settings
game.settings = {
    spaceshipSpeed: 3,
    gameTimer: 60000   
}

// reserve keyboard bindings
let keyF, keyLEFT, keyRIGHT;