class Death3 extends Enemy {
    constructor(scene, x, y) {
        super(scene, x, y);
        this.initSprite('max_death_3_white.png', 1, 0, 0, 'deathfinal');
        this.bgtemp = this.addImage(gameConsts.halfWidth, gameConsts.halfHeight, 'backgrounds', 'waterfall.png').setDepth(-5).setScale(1, 1.03);
        this.cape = this.addSprite(x - 99, y - 35, 'deathfin', 'frame0000.png').setDepth(-3).play('ladydeathcape').setAlpha(0);
        this.hood = this.addSprite(x - 99, y - 35, 'deathfin', 'hood0001.png').setDepth(9).play('ladydeathhood').setAlpha(0);
        this.hourglass = this.addSprite(x - 67, y - 105, 'deathfinal', 'hourglass.png').setDepth(-3).setRotation(0.1).setOrigin(0.5, 0.03);

        this.adjustChargeBar();

        this.animateDeath3In();

        this.addTimeout(() => {
            this.setAsleep();
            this.tweenHourglass();
            this.pullbackScale = 1;
            this.attackScale = 1;
        }, 10)
    }

    tweenHourglass() {
        this.hourglassTween = this.addTween({
            targets: this.hourglass,
            rotation: -0.1,
            ease: 'Quad.easeInOut',
            duration: 3000,
            repeat: -1,
            yoyo: true
        })
    }

    animateDeath3In() {
        let blackBG = getBackgroundBlackout();
        blackBG.setDepth(-2).setAlpha(1);

        this.flashCover = this.addImage(gameConsts.halfWidth, gameVars.flashCoverY || 105, 'blurry', 'flash_bg.webp').setScale(3, 3.75).setRotation(Math.PI*0.5).setDepth(1);
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

        let flashStar = this.addImage(this.flashCover.x, this.flashCover.y + 10, 'blurry', 'star_blur.png').setScale(3.25).setDepth(this.flashCover.depth)
        this.addTween({
            targets: flashStar,
            scaleX: 2.6,
            scaleY: 2.6,
            ease: 'Cubic.easeOut',
            duration: 3000,
        })
        if (gameVars.fromDeath2Plus) {
            this.addTween({
                targets: flashStar,
                alpha: 0,
                duration: 3000,
                onComplete: () => {
                    flashStar.destroy();
                }
            })
        } else {
            flashStar.setAlpha(0);
            console.log(flashStar.alpha)
            this.addTween({
                targets: flashStar,
                alpha: 1,
                ease: 'Cubic.easeOut',
                duration: 300,
                onComplete: () => {
                    this.addTween({
                        targets: flashStar,
                        alpha: 0,
                        duration: 2700,
                        onComplete: () => {
                            flashStar.destroy();
                        }
                    })
                }
            })
        }

        this.sprite.setScale(0.8, 0.65).setAlpha(0.4);
        this.sprite.y -= 50;
        this.addTween({
            targets: this.sprite,
            y: this.sprite.y + 45,
            alpha: 1,
            duration: gameVars.fromDeath2Plus ? 3000 : 2600,
            ease: 'Cubic.easeOut',
            scaleX: 1.06,
            scaleY: 1.06,
            onComplete: () => {

                playSound('water_drop');
                this.setDefaultSprite('max_death_3.png', 1);
                gameVars.fromDeath2Plus = false;
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
                 });

                this.startFightLogic();
            }
        })
    }

    startFightLogic() {
        if (!this.redEffect) {
            this.redEffect = this.addImage(this.sprite.x, this.sprite.y + 130, 'lowq', 'circle_blue2.png').setScale(0.4, 0.09).setOrigin(0.5, 0.45).setDepth(-4).setBlendMode(Phaser.BlendModes.MULTIPLY);
        } else {
            this.redEffect.setAlpha(0.65).setScale(0.4, 0.09);
        }
        this.setAwake();

         this.addTween({
             targets: this.redEffect,
             scaleX: 3,
             scaleY: 0.7,
             duration: 3500,
             ease: "Cubic.easeOut",
             onComplete: () => {
             }
         });
         this.addTween({
             targets: this.redEffect,
             alpha: 0,
             duration: 3500,
             onComplete: () => {
                this.startFightLogic();
             }
         });
    }

    initStatsCustom() {
        this.health = 111;
    }

    setHealth(newHealth, isTrue) {
        super.setHealth(this.health);
        if (this.health < 100 && !this.firstWarning) {
            this.firstWarning = true;
            this.leftOffIndex = this.nextAttackIndex;
            this.currentAttackSetIndex = 1;
            this.nextAttackIndex = 0;
        }

    }

    repeatTweenBreathe(duration = 1500, magnitude = 1) {
        if (this.breatheTween) {
            this.breatheTween.stop();
        }
    }


    adjustChargeBar() {
        this.chargeBarWarning.y = -100;
        this.chargeBarCurr.destroy();

        this.chargeBarMax.scaleY = 6;
        this.voidPause.scaleY = this.chargeBarMax.scaleY - 2;
        this.chargeBarCurr.scaleY = this.chargeBarMax.scaleY - 2;
        this.chargeBarAngry.scaleY = this.chargeBarMax.scaleY - 2;
        this.chargeBarOutline.scaleY = this.chargeBarMax.scaleY + 2;

        this.chargeBarCurr = this.scene.add.image(this.x, this.chargeBarMax.y, 'pixels', 'white_pixel.png');
        this.chargeBarCurr.setScale(0, this.chargeBarMax.scaleY - 2);
        this.chargeBarCurr.setOrigin(0.5, 0.5);
        this.chargeBarCurr.alpha = 0.9;
        this.chargeBarCurr.setDepth(9);
        this.chargeBarAngry.midAlpha = 0;

        // this.chargeBarAngry = this.scene.add.image(x, this.chargeBarMax.y, 'pixels', 'red_pixel.png');
        // this.chargeBarAngry.setScale(0, this.chargeBarMax.scaleY - 2);
        // this.chargeBarAngry.setOrigin(0.5, 0.5);
        // this.chargeBarAngry.alpha = 0.9;
        // this.chargeBarAngry.setDepth(9);
        // this.chargeBarAngry.visible = false;
    }

    showAngrySymbol() {

    }

    initAttacks() {

        this.attacks = [
            [
                {
                    name: " ",
                    chargeAmt: 400,
                    chargeMult: 2,
                    isPassive: true,
                    startFunction: () => {
                        globalObjects.bannerTextManager.closeBanner();
                        messageBus.publish("showCombatText", getLangText('death3_a'), 0);
                    },
                    finaleFunction: () => {
                    }
                },
                {
                    name: " ",
                    chargeAmt: 400,
                    chargeMult: 2,
                    isPassive: true,
                    startFunction: () => {
                        messageBus.publish("showCombatText", getLangText('death3_b'), 0);
                    },
                    finaleFunction: () => {
                    }
                },
            ],
            [
                {
                    name: " ",
                    chargeAmt: 400,
                    chargeMult: 3,
                    isPassive: true,
                    startFunction: () => {
                        messageBus.publish("showCombatText", "Please, do not interrupt me\nwhile I am speaking.", -14);
                    },
                    finaleFunction: () => {
                    }
                },
            ]
        ];
    }

    die() {
        console.log("die right");
        fadeAwaySound(this.bgMusic);
        this.hourglassTween.stop();

    }
}
