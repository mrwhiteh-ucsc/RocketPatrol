class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        // load images/tile sprites
        this.load.image('trap', './assets/trap.png');
        this.load.image('rat', './assets/rat.png');
        this.load.image('floor', './assets/floor.png');
        this.load.image('UI', './assets/UI.png');
        this.load.image('roach', './assets/roach.png');
        // load spritesheet
        this.load.spritesheet('snap', './assets/snap.png', {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 9});
        this.load.spritesheet('squish', './assets/squish.png', {frameWidth: 32, frameHeight: 16, startFrame: 0, endFrame: 9});
    }

    create() {
        // place tile sprite
        this.floor = this.add.tileSprite(0, 0, 640, 480, 'floor').setOrigin(0, 0);

        
        // add trap (p1)
        this.p1trap = new trap(this, game.config.width/2, 431, 'trap').setScale(0.5, 0.5).setOrigin(0, 0);

        // add rats (x3)
        this.rat01 = new rat(this, game.config.width + 192, 132, 'rat', 0, 30).setOrigin(0,0);
        this.rat02 = new rat(this, game.config.width + 96, 196, 'rat', 0, 20).setOrigin(0,0);
        this.rat03 = new rat(this, game.config.width, 260, 'rat', 0, 10).setOrigin(0,0);

        // add roach (x2)
        this.roach01 = new roach(this, game.config.width, 172, 'roach', 50).setOrigin(0,0);
        this.roach02 = new roach(this, game.config.width + 52, 224, 'roach', 40).setOrigin(0,0);

        // define keys
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

        this.UI = this.add.tileSprite(0, 0, 640, 480, 'UI').setOrigin(0, 0);
        // white rectangle borders
        //this.add.rectangle(5, 5, 630, 32, 0xFFFFFF).setOrigin(0, 0);
        //this.add.rectangle(5, 443, 630, 32, 0xFFFFFF).setOrigin(0, 0);
        //this.add.rectangle(5, 5, 32, 455, 0xFFFFFF).setOrigin(0, 0);
        //this.add.rectangle(603, 5, 32, 455, 0xFFFFFF).setOrigin(0, 0);
        // green UI background
        //this.add.rectangle(37, 42, 566, 64, 0x00FF00).setOrigin(0, 0);

        // animation config
        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('snap', { start: 0, end: 9, first: 0}),
            frames: this.anims.generateFrameNumbers('squish', { start: 0, end: 9, first: 0}),
            frameRate: 30
        });

        // score
        this.p1Score = 0;
        // score display
        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }
        this.scoreLeft = this.add.text(69, 54, this.p1Score, scoreConfig);
        this.scoreRight = this.add.text(500, 54, 'Time: ' + this.clock, scoreConfig);

        // game over flag
        this.gameOver = false;

        // 60-second play clock
        scoreConfig.fixedWidth = 0;
        this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
            this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', scoreConfig).setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2 + 64, '(F)ire to Restart', scoreConfig).setOrigin(0.5);
            this.gameOver = true;
        }, null, this);
    }

    update() {
        // check key input for restart
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyF)) {
            this.scene.restart(this.p1score);
        }
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.scene.start("menuScene");
        }

        //scroll tile sprite
        this.floor.tilePositionX -= 4;
        //sprite updates
        if (!this.gameOver) {     
            //update trap          
            this.p1trap.update();
            //and rats
            this.rat01.update();
            this.rat02.update();
            this.rat03.update();
            //and roaches
            this.roach01.update();
            this.roach02.update();
        }             
        // check collisions
        if(this.checkCollision(this.p1trap, this.rat03)) {
            this.p1trap.reset();
            this.ratExplode(this.rat03);   
        }
        if (this.checkCollision(this.p1trap, this.rat02)) {
            this.p1trap.reset();
            this.ratExplode(this.rat02);
        }
        if (this.checkCollision(this.p1trap, this.rat01)) {
            this.p1trap.reset();
            this.ratExplode(this.rat01);
        }
        if (this.checkCollision(this.p1trap, this.roach01)) {
            this.p1trap.reset();
            this.roachExplode(this.roach01);
        }if (this.checkCollision(this.p1trap, this.roach02)) {
            this.p1trap.reset();
            this.roachExplode(this.roach02);
        }
        //this.scoreRight.text = this.clock;
    }

    checkCollision(trap, rat) {
        // simple AABB checking
        if (trap.x < rat.x + rat.width && 
            trap.x + trap.width > rat.x && 
            trap.y < rat.y + rat.height &&
            trap.height + trap.y > rat. y) {
                return true;
        }
        //now for roaches
        else if (trap.x < roach.x + roach.width && 
            trap.x + trap.width > roach.x && 
            trap.y < roach.y + roach.height &&
            trap.height + trap.y > roach.y) {
                return true;
            }
         else {
            return false;
        }
    }

    ratExplode(rat) {
        //hide rat
        rat.alpha = 0;
        // create snap sprite at rat's position
        let boom = this.add.sprite(rat.x, rat.y, 'snap').setOrigin(0, 0);
        boom.anims.play('explode');             // play explode animation
        boom.on('animationcomplete', () => {    // callback after animation completes
            rat.reset();                       // reset rat position
            rat.alpha = 1;                     // make rat visible again
            boom.destroy();                     // remove snap sprite
        });
        // score increment and repaint
        this.p1Score += rat.points;
        this.scoreLeft.text = this.p1Score;     
        // play sound
        this.sound.play('sfx_snap'); 
        this.sound.play('sfx_rat'); 
    }
    //repeat for le roach
    roachExplode(roach) {
        roach.alpha = 0;
        let bang = this.add.sprite(roach.x, roach.y, 'squish').setOrigin(0,0);
        boom.anims.play('explode');
        boom.on('animationcomplete', () => {
            roach.reset();
            roach.alpha = 1;
            boom.destroy();
        });
        //roach scores
        this.p1Score += roach.points;
        this.scoreLeft.text = this.p1Score;
        this.sound.play('sfx_squish');
        this.sound.play('sfx_roach');
    }
}