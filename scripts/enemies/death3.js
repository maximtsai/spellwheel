class Death3 extends Enemy {
    constructor(scene, x, y) {
        super(scene, x, y);
        this.initSprite('max_death_3_white.png', 1, 0, 0, 'deathfinal');
        this.bgtemp = this.addImage(gameConsts.halfWidth, gameConsts.halfHeight, 'backgrounds', 'waterfall.png').setDepth(-5).setScale(1, 1.03);
        this.cape = this.addSprite(x - 99, y - 35, 'deathfin', 'frame0000.png').setDepth(-3).play('ladydeathcape').setAlpha(0);
        this.hood = this.addSprite(x - 99, y - 35, 'deathfin', 'hood0000.png').setDepth(9).play('ladydeathhood').setAlpha(0);

        this.animateDeath3In();

        this.addTimeout(() => {
            this.setAsleep();
        }, 10)
    }

    animateDeath3In() {
        let blackBG = getBackgroundBlackout();
        blackBG.setDepth(-2).setAlpha(1);
        this.flashCover = this.addImage(gameConsts.halfWidth, gameVars.flashCoverY || 45, 'blurry', 'flash_bg.webp').setScale(3.5).setRotation(Math.PI*0.5).setDepth(1);
        this.addTween({
            targets: [this.flashCover],
            scaleX: 0.5,
            scaleY: 0.5,
            rotation: Math.PI,
            ease: 'Cubic.easeOut',
            duration: 1400,
        });
        this.addTween({
            targets: [this.flashCover],
            alpha: 0,
            ease: 'Cubic.easeIn',
            duration: 1400,
            onComplete: () => {
                this.flashCover.destroy();
            }
        });
        this.sprite.setScale(0.8).setAlpha(0.4);
        this.sprite.y -= 50;
        this.addTween({
            targets: this.sprite,
            y: this.sprite.y + 45,
            alpha: 1,
            duration: gameVars.fromDeath3 ? 3000 : 2600,
            ease: 'Cubic.easeOut',
            scaleX: 1.06,
            scaleY: 1.06,
            onComplete: () => {

                playSound('water_drop');
                this.setDefaultSprite('max_death_3.png', 1);
                this.sprite.y += 5;
                 this.addTween({
                     targets: blackBG,
                     alpha: 0,
                     duration: 500,
                     ease: "Quad.easeOut"
                 })
                 this.whiteoutTemp = this.addImage(this.sprite.x, this.sprite.y + 50, 'spells', 'whiteout_circle.png').setScale(4, 1).setOrigin(0.5, 0.45);
                 this.addTween({
                     targets: this.whiteoutTemp,
                     alpha: 0,
                     duration: 1200,
                 })
                 this.addTween({
                    targets: [this.cape],
                    alpha: 1,
                    duration: 200
                 })
                 this.addTween({
                    delay: 800,
                    targets: [this.hood],
                    alpha: 1,
                    duration: 200
                 })
                 this.addTween({
                     targets: this.whiteoutTemp,
                     scaleX: 20,
                     scaleY: 5,
                     duration: 1200,
                     ease: "Quint.easeOut",
                     onComplete: () => {
                         this.whiteoutTemp.destroy();
                        globalObjects.magicCircle.enableMovement();
                        globalObjects.encyclopedia.showButton();
                        globalObjects.options.showButton();
                     }
                 })

            }
        })
    }

    initStatsCustom() {
        this.health = 100;
    }

    repeatTweenBreathe(duration = 1500, magnitude = 1) {
        if (this.breatheTween) {
            this.breatheTween.stop();
        }
    }


    setHealth(newHealth) {
        // messageBus.publish('animateBlockNum', gameConsts.halfWidth, this.sprite.y + 50, 'IMMATERIAL', 0.8, {y: "+=5", ease: 'Quart.easeOut'}, {alpha: 0, scaleX: 1.1, scaleY: 1.1});

        super.setHealth(newHealth);
        let currHealthPercent = this.health / this.healthMax;
        if (currHealthPercent == 0) {
            // dead, can't do anything
            return;
        } else {
            let prevHealthPercent = this.prevHealth / this.healthMax;
            if (prevHealthPercent > 0.5 && currHealthPercent <= 0.5 && !this.thornForm) {
                this.thornForm = true;
                this.interruptCurrentAttack();
            }
        }
    }


    initAttacks() {
        this.attacks = [
            [
                {
                    name: "|8x2",
                    chargeAmt: 600,
                    chargeMult: 2,
                    finishDelay: 3000,
                    damage: -1,
                    isBigMove: true,
                    attackStartFunction: () => {

                    },
                    finaleFunction: () => {
                    }
                },

            ]
        ];
    }

    die() {
        fadeAwaySound(this.bgMusic);

    }
}
