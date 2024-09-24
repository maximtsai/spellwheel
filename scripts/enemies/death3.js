class Death3 extends Enemy {
    constructor(scene, x, y, level) {
        super(scene, x, y, level);
        gameVars.isDeathThree = true;
        playSound("whoosh")
        globalObjects.encyclopedia.hideButton();
        globalObjects.options.hideButton();
        this.initSprite('max_death_3_white.png', 1, 0, 0, 'deathfinal');
        this.bgtemp = this.addImage(gameConsts.halfWidth, gameConsts.halfHeight, 'backgrounds', 'waterfall.png').setDepth(-6).setScale(1, 1.03);
        this.bgtemprocks = this.addImage(gameConsts.halfWidth, gameConsts.halfHeight, 'backgrounds', 'waterfallrocks.png').setDepth(-4).setScale(1,1.03);
        this.bgtemp2 = this.addImage(gameConsts.halfWidth, gameConsts.halfHeight, 'backgrounds', 'waterfall.png').setBlendMode(Phaser.BlendModes.ADD).setDepth(-6).setScale(1,1.03).setAlpha(0);
        this.addTween({
            targets: this.bgtemp2,
            alpha: 0.1,
            duration: 2000,
            ease: 'Cubic.easeInOut',
            repeat: -1,
            yoyo: true
        })
        globalObjects.magicCircle.disableMovement();
        this.hourglassdark = this.addSprite(x - 67, y - 55, 'blurry', 'dark_blur.png').setDepth(-3).setRotation(0.09).setAlpha(0.65).setScale(1.5, 1.2).setOrigin(0.5, 0.42);
        this.hourglassdark.startY = this.hourglassdark.y;
        this.cape = this.addSprite(x - 99, y - 35, 'deathfin', 'frame0000.png').setDepth(-3).play('ladydeathcape').setAlpha(0);
        this.hood = this.addSprite(x - 99, y - 35, 'deathfin', 'hood0001.png').setDepth(9).play('ladydeathhood').setAlpha(0);
        this.hood.startY = this.hood.y;
        this.hourglassglow = this.addSprite(x - 67, y - 105, 'blurry', 'lantern_glow.png').setDepth(-3).setRotation(0.09).setAlpha(0.75).setScale(1.07).setOrigin(0.5, 0.11).setBlendMode(Phaser.BlendModes.ADD);
        this.hourglass = this.addSprite(x - 67, y - 105, 'deathfinal', 'hourglass.png').setDepth(-3).setRotation(0.09).setOrigin(0.5, 0.03);
        this.addExtraSprite(this.hood);
        this.addExtraSprite(this.hourglass);
        this.addExtraSprite(this.hourglassglow);

        this.adjustChargeBar();

        this.animateDeath3In();

        this.addRocks();

        this.addTimeout(() => {
            this.setAsleep();
            this.tweenHourglass();
            this.pullbackScale = 1;
            this.attackScale = 1;
        }, 10)
    }

    destroy() {
        gameVars.isDeathThree = false;
        super.destroy();
    }

    addRocks() {
       this.rock1 = this.addImage(gameConsts.halfWidth - 250, gameConsts.halfHeight - 240, 'deathfinal', 'claw.png').setDepth(-5).setBlendMode(Phaser.BlendModes.LIGHTEN).setScale(0.85).setRotation(0.2).setAlpha(0.7)
        this.rock1b = this.addImage(gameConsts.halfWidth - 250, gameConsts.halfHeight - 240, 'deathfinal', 'claw.png').setDepth(-5).setBlendMode(Phaser.BlendModes.MULTIPLY).setScale(0.85).setRotation(0.2).setAlpha(1)
        this.rock2 = this.addImage(gameConsts.halfWidth + 250, gameConsts.halfHeight - 270, 'deathfinal', 'palm.png').setDepth(-5).setBlendMode(Phaser.BlendModes.LIGHTEN).setScale(0.7).setRotation(-0.4).setAlpha(0.7)
        this.rock2b = this.addImage(gameConsts.halfWidth + 250, gameConsts.halfHeight - 270, 'deathfinal', 'palm.png').setDepth(-5).setBlendMode(Phaser.BlendModes.MULTIPLY).setScale(0.7).setRotation(-0.4).setAlpha(1)

    }

    tweenHourglass() {
        this.hourglassTween = this.addTween({
            targets: [this.hourglass, this.hourglassglow, this.hourglassdark],
            rotation: -0.1,
            ease: 'Quad.easeInOut',
            duration: 3000,
            repeat: -1,
            yoyo: true
        })
    }

    setDeathFace(face) {
        if (!face) {
            if (this.deathFaceSprite) {
                this.addTween({
                    targets: this.deathFaceSprite,
                    alpha: 0,
                    duration: 300,
                })
            }
            return;
        }
        if (!this.deathFaceSprite) {
            this.deathFaceSprite = this.addSprite(this.sprite.x, this.sprite.y, 'deathfinal', face).setDepth(this.sprite.depth);
            this.addExtraSprite(this.deathFaceSprite);
        } else {
            this.deathFaceSprite.setFrame(face);
        }

        this.hood.y = this.hood.startY - 1.5;
        this.addTween({
            targets: this.hood,
            y: this.hood.startY,
            easeParams: [3],
            ease: 'Back.easeIn',
            duration: 500,
        })
        this.sprite.setScale(1.01, 1.012);
        this.addTween({
            targets: this.sprite,
            scaleX: 1,
            scaleY: 1,
            easeParams: [3],
            ease: 'Back.easeIn',
            duration: 500,
        })

        this.deathFaceSprite.setScale(1.15, 1.012);
        this.deathFaceSprite.setAlpha(0.90);
        this.addTween({
            targets: this.deathFaceSprite,
            scaleX: 1,
            scaleY: 1,
            alpha: 1,
            easeParams: [3],
            ease: 'Back.easeIn',
            duration: 500,
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
                 this.whiteoutTemp = this.addImage(this.sprite.x, this.sprite.y + 60, 'spells', 'whiteout_circle.png').setScale(4, 1).setOrigin(0.5, 0.45);
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
                         this.canInterruptSpeech = true;
                         this.bgMusic = playMusic('death3_harp', 0.63, true);
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
        if (this.health <= 0) {
            return;
        }
        super.setHealth(newHealth, isTrue);
        if (this.canInterruptSpeech) {
            this.canInterruptSpeech = false;
            if (!this.firstWarning) {
                this.setDeathFace('max_death_3d.png')
                this.firstWarning = true;
                this.leftOffIndex = this.nextAttackIndex - 1;
                this.currentAttackSetIndex = 1;
                this.nextAttackIndex = 0;
            } else if (!this.secondWarning) {
                this.setDeathFace('max_death_3d.png')
                this.secondWarning = true;
                this.leftOffIndex = this.nextAttackIndex - 1;
                this.currentAttackSetIndex = 2;
                this.nextAttackIndex = 0;
            }
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
                    chargeAmt: 450,
                    chargeMult: 2,
                    transitionFast: true,
                    isPassive: true,
                    customCall: 'flip1',
                    startFunction: () => {
                        globalObjects.bannerTextManager.closeBanner();
                        messageBus.publish("showCombatText", getLangText('death3_a'), 15);
                    },
                    finaleFunction: () => {
                    }
                },
                {
                    name: " ",
                    chargeAmt: 350,
                    chargeMult: 2.5,
                    isPassive: true,
                    transitionFast: true,
                    customCall: 'flip2',
                    startFunction: () => {
                        messageBus.publish("showCombatText", getLangText('death3_b'), 15);

                        this.addTween({
                            targets: this.hourglassdark,
                            alpha: 1,
                            scaleX: 2.5,
                            scaleY: 2,
                            duration: 600,
                            ease: 'Cubic.easeIn',
                        })
                        this.addTween({
                            targets: this.hourglassglow,
                            alpha: 1.2,
                            scaleX: 1.5,
                            scaleY: 1.5,
                            y: this.hourglass.y - 30,
                            duration: 600,
                            ease: 'Cubic.easeIn',
                            onComplete: () => {
                                let glowTemp = this.addSprite(this.hourglassglow.x, this.hourglass.y + 65, 'blurry', 'lantern_glow.png').setDepth(-3).setAlpha(1).setScale(1.5).setOrigin(0.5, 0.5).setBlendMode(Phaser.BlendModes.ADD);
                                this.addTween({
                                    targets: glowTemp,
                                    alpha: 0,
                                    scaleX: 3,
                                    scaleY: 2,
                                    duration: 1200,
                                    ease: 'Cubic.easeOut',
                                });
                                this.addTween({
                                    targets: this.hourglassglow,
                                    alpha: 0.95,
                                    scaleX: 1.4,
                                    scaleY: 1.4,
                                    y: this.hourglass.y - 25,
                                    duration: 600,
                                    ease: 'Cubic.easeOut',
                                });
                                this.addDelay(() => {
                                    let sfx = playSound('matter_enhance_2', 0.6);
                                    sfx.detune = -900;
                                    sfx.pan = -0.3;
                                }, 200)

                                this.addTween({
                                    targets: [this.rock1, this.rock1b],
                                    x: "-=250",
                                    alpha: 1,
                                    rotation: "-=1",
                                    ease: 'Back.easeIn',
                                    duration: 1000,
                                    completeDelay: 200,
                                    onComplete: () => {
                                        this.addDelay(() => {
                                            let sfx = playSound('matter_enhance_2', 0.6);
                                            sfx.detune = -1300;
                                            sfx.pan = 0.3;
                                        }, 200)
                                        this.addTween({
                                            targets: [this.rock2, this.rock2b],
                                            x: "+=250",
                                            alpha: 1,
                                            rotation: "+=1",
                                            ease: 'Back.easeIn',
                                            duration: 1000,
                                            onComplete: () => {
                                                this.rock1.destroy();
                                                this.rock1b.destroy();
                                                this.rock2.destroy();
                                                this.rock2b.destroy();
                                                this.addTween({
                                                    targets: this.hourglassdark,
                                                    alpha: 0.65,
                                                    scaleX: 1.5,
                                                    scaleY: 1.2,
                                                    duration: 2400,
                                                    ease: 'Back.easeOut',
                                                })
                                                this.addTween({
                                                    targets: this.hourglassglow,
                                                    alpha: 0.75,
                                                    scaleX: 1.07,
                                                    scaleY: 1.07,
                                                    duration: 2400,
                                                    y: this.hourglass.y,
                                                    ease: 'Back.easeOut',
                                                })
                                            }
                                        })
                                    }
                                })
                            }
                        })


                    },
                    finaleFunction: () => {
                    }
                },
                {
                    name: " ",
                    chargeAmt: 400,
                    chargeMult: 2.5,
                    isPassive: true,
                    transitionFast: true,
                    customCall: 'flip2',
                    startFunction: () => {
                        this.bgtemprocks.destroy();
                        messageBus.publish("showCombatText", getLangText('death3_c'), 15);
                    },
                    finaleFunction: () => {
                    }
                },
                {
                    name: " ",
                    chargeAmt: 400,
                    chargeMult: 2.5,
                    isPassive: true,
                    transitionFast: true,
                    customCall: 'flip1',
                    startFunction: () => {
                        this.setDeathFace('max_death_3b.png')
                        messageBus.publish("showCombatText", getLangText('death3_understand'), 15);
                    },
                    finaleFunction: () => {
                    }
                },
                {
                    name: " ",
                    chargeAmt: 300,
                    chargeMult: 2.5,
                    isPassive: true,
                    transitionFast: true,
                    customCall: 'flip3',
                    startFunction: () => {
                        this.setDeathFace()
                        messageBus.publish("showCombatText", getLangText('death3_obsess'), 15);
                        this.addTween({
                            targets: this.hourglassdark,
                            alpha: 0.8,
                            scaleX: 15,
                            scaleY: 15,
                            duration: 3000,
                            ease: 'Cubic.easeInOut',
                        })
                    },
                },
                {
                    name: " ",
                    chargeAmt: 300,
                    chargeMult: 2.5,
                    isPassive: true,
                    transitionFast: true,
                    customCall: 'flip1',
                    startFunction: () => {
                        this.setDeathFace('max_death_3b.png')
                        messageBus.publish("showCombatText", getLangText('death3_odyssey'), 15);
                    },
                },
                {
                    name: " ",
                    chargeAmt: 400,
                    chargeMult: 2.5,
                    isPassive: true,
                    transitionFast: true,
                    customCall: 'flip2',
                    startFunction: () => {
                        messageBus.publish("showCombatText", getLangText('death3_indulgence'), 15);
                    },
                },
                {
                    name: " ",
                    chargeAmt: 400,
                    chargeMult: 2.5,
                    isPassive: true,
                    transitionFast: true,
                    customCall: 'flip1',
                    startFunction: () => {
                        messageBus.publish("showCombatText", getLangText('death3_yield'), 15);
                    },
                },
                {
                    name: " ",
                    chargeAmt: 500,
                    chargeMult: 2.5,
                    isPassive: true,
                    transitionFast: true,
                    customCall: 'flip3',
                    startFunction: () => {
                        this.setDeathFace()
                        messageBus.publish("showCombatText", getLangText('death3_within'), 15);
                    },
                },
                {
                    name: " ",
                    chargeAmt: 300,
                    chargeMult: 2.5,
                    isPassive: true,
                    transitionFast: true,
                    customCall: 'flip1',
                    startFunction: () => {
                        this.setDeathFace('max_death_3b.png')
                        messageBus.publish("showCombatText", getLangText('death3_both'), 15);
                    },
                },
                {
                    name: " ",
                    chargeAmt: 450,
                    chargeMult: 2.5,
                    isPassive: true,
                    transitionFast: true,
                    customCall: 'flip2',
                    startFunction: () => {
                        messageBus.publish("showCombatText", getLangText('death3_strength'), 15);
                    },
                },
                {
                    name: " ",
                    chargeAmt: 300,
                    chargeMult: 2.5,
                    isPassive: true,
                    transitionFast: true,
                    customCall: 'flip1',
                    startFunction: () => {
                        this.setDeathFace()
                        messageBus.publish("showCombatText", getLangText('death3_letting'), 15);
                    },
                },
                {
                    name: " ",
                    chargeAmt: 400,
                    chargeMult: 2.5,
                    isPassive: true,
                    transitionFast: true,
                    customCall: 'flip3',
                    startFunction: () => {
                        messageBus.publish("showCombatText", getLangText('death3_memory'), 15);
                    },
                },
                {
                    name: " ",
                    chargeAmt: 200,
                    chargeMult: 2.5,
                    isPassive: true,
                    transitionFast: true,
                    customCall: 'flip1',
                    startFunction: () => {
                        messageBus.publish("showCombatText", getLangText('now...'), 15);
                    },
                },
                {
                    name: " ",
                    chargeAmt: 400,
                    chargeMult: 3,
                    isPassive: true,
                    transitionFast: true,
                    customCall: 'flip2',
                    startFunction: () => {
                        this.setDeathFace('max_death_3c.png')
                        messageBus.publish("showCombatText", getLangText('death3_calm'), 15);
                        this.addTween({
                            targets: this.hourglassdark,
                            alpha: 0,
                            scaleX: 15,
                            scaleY: 15,
                            duration: 4500,
                            ease: 'Cubic.easeInOut',
                        })
                    },
                },
                {
                    name: " ",
                    chargeAmt: 400,
                    chargeMult: 3,
                    isPassive: true,
                    transitionFast: true,
                    customCall: 'flip1',
                    startFunction: () => {
                        messageBus.publish("showCombatText", getLangText('death3_patience'), 15);
                    },
                },
                {
                    name: " ",
                    chargeAmt: 500,
                    chargeMult: 1.1,
                    isPassive: true,
                    transitionFast: true,
                    customCall: 'flip3',
                    startFunction: () => {
                        fadeAwaySound(this.bgMusic, 3500, 'Quad.easeIn');
                        this.addTimeout(() => {
                            showCutscene3();
                        }, 500)
                        messageBus.publish("showCombatText", getLangText('death3_once'), 15);
                    },
                },
                {
                    name: "...",
                    chargeAmt: 500,
                    isPassive: true,
                    transitionFast: true,
                    customCall: 'flip3',
                },
            ],
            [
                {
                    name: " ",
                    chargeAmt: 400,
                    chargeMult: 4,
                    isPassive: true,
                    transitionFast: true,
                    startFunction: () => {
                        this.setDeathFace('max_death_3d.png')
                        messageBus.publish("showCombatText", getLangText('death3_warn1a'), -9);
                    },
                },
                {
                    name: " ",
                    chargeAmt: 400,
                    chargeMult: 4,
                    isPassive: true,
                    transitionFast: true,
                    startFunction: () => {
                        this.setDeathFace()
                        messageBus.publish("showCombatText", getLangText('death3_warn1b'), -9);
                    },
                },
                {
                    name: " ",
                    chargeAmt: 250,
                    chargeMult: 4,
                    isPassive: true,
                    transitionFast: true,
                    customCall: 'flip3',
                    startFunction: () => {
                        messageBus.publish("showCombatText", getLangText('death3_warn0'), -9);
                        this.currentAttackSetIndex = 0;
                        this.nextAttackIndex = this.leftOffIndex;
                    },
                    finaleFunction: () => {
                        this.canInterruptSpeech = true;
                    }
                },
            ],
            [
                {
                    name: " ",
                    chargeAmt: 400,
                    chargeMult: 3,
                    isPassive: true,
                    transitionFast: true,
                    startFunction: () => {
                        this.setDeathFace('max_death_3d.png')
                        messageBus.publish("showCombatText", getLangText('death3_warn2a'), -9);
                    },
                    finaleFunction: () => {
                    }
                },
                {
                    name: " ",
                    chargeAmt: 400,
                    chargeMult: 3,
                    isPassive: true,
                    transitionFast: true,
                    startFunction: () => {
                        messageBus.publish("showCombatText", getLangText('death3_warn2b'), -9);
                    },
                    finaleFunction: () => {
                    }
                },
                {
                    name: " ",
                    chargeAmt: 250,
                    chargeMult: 4,
                    isPassive: true,
                    transitionFast: true,
                    customCall: 'flip3',
                    startFunction: () => {
                        this.setDefense(-999);
                        this.setDeathFace()
                        messageBus.publish("showCombatText", getLangText('death3_warn0'), -9);
                        this.currentAttackSetIndex = 0;
                        this.nextAttackIndex = this.leftOffIndex;
                    },
                    finaleFunction: () => {
                        this.canInterruptSpeech = true;
                    }
                },
            ]
        ];
    }

    die() {
        if (this.dead) {
            return;
        }
        super.die();
        globalObjects.encyclopedia.hideButton();
        globalObjects.options.hideButton();
        globalObjects.magicCircle.disableMovement();
        this.deathFaceSprite.destroy();
        this.setDefaultSprite('max_death_3e.png', undefined, true);
        this.bgtemp2.destroy();
        this.cape.stop();
        this.hood.stop();
        this.addTween({
            delay: 2000,
            targets: [this.cape],
            alpha: 0,
            ease: 'Quad.easeIn',
            duration: 1000,
            onComplete: () => {
                this.addTween({
                    targets: [this.hood],
                    alpha: 0,
                    ease: 'Quad.easeIn',
                    duration: 2000,
                    completeDelay: 500,
                    onComplete: () => {
                        playSound('sound_of_death').setSeek(0.25);
                        this.showDeathHead();
                        this.addDelay(() => {
                            showCutscene2();
                        }, 600)
                    }
                })
            }
        })
        this.hood.y -= 3;
        fadeAwaySound(this.bgMusic);
        this.hourglassTween.stop();
        messageBus.publish("closeCombatText");
        this.hourglassdark.visible = false;
        // this.addImage(gameConsts.halfWidth, this.sprite.y, 'deathfinal', 'death_2_laugh.png').setDepth(-4);
        this.addTween({
            targets: [this.hourglass],
            x: "-=60",
            rotation: -Math.PI * 0.46,
            duration: 650,
             onComplete: () => {
                 this.hourglass.rotation = -Math.PI * 0.5;
             }
        })
        this.addTween({
            targets: [this.hourglassglow],
            x: "-=10",
            duration: 650,
        })
        this.addTween({
            targets: [this.hourglassglow],
            originX: 0.5,
            originY: 0.5,
            y: this.y + 37,
            duration: 650,
            ease: 'Quad.easeIn',
        })
        this.addTween({
            targets: [this.hourglass],
            y: this.y + 106,
            ease: 'Quad.easeIn',
            duration: 650,
            onComplete: () => {
                playSound('glass_break')
                this.hourglassglow.alpha = 1;
                this.addTween({
                    targets: [this.hourglassglow],
                    alpha: 0,
                    duration: 1000,
                    onComplete: () => {
                        this.hourglassglow.visible = false;
                    }
                })
                let bgDark = getBackgroundBlackout();
                bgDark.setDepth(-4);
                bgDark.setAlpha(0.5)
            }
        })
    }

    showDeathHead() {
        let deathHead = this.addImage(this.x, this.y + 10, 'deathfinal', 'death_2_laugh.png').setScale(0.85, 0.55).setOrigin(0.5, 0.45).setAlpha(0).setDepth(-1)
        this.addTween({
            targets: deathHead,
            alpha: 0.6,
            ease: 'Quint.easeIn',
            duration: 500,
            scaleX: 0.9,
            scaleY: 0.75,
            onComplete: () => {
                let redFlash = this.addImage(gameConsts.halfWidth, gameConsts.halfHeight, 'pixels', 'red_pixel.png').setScale(500).setAlpha(0.6).setDepth(-1)
                this.addTween({
                    targets: redFlash,
                    alpha: 0,
                    ease: 'Cubic.easeOut',
                    duration: 400,
                    onComplete: () => {
                        redFlash.destroy();
                    }
                })
                deathHead.setAlpha(0.9).setScale(1, 0.95)
                this.setAwake();
                this.addTween({
                    targets: deathHead,
                    alpha: 0,
                    duration: 1800,
                    onComplete: () => {
                        deathHead.destroy();
                    }
                })
                this.addTween({
                    targets: deathHead,
                    ease: 'Quart.easeOut',
                    duration: 80,
                    scaleX: "-=0.015",
                    scaleY: "-=0.025",
                    onComplete: () => {
                        screenShakeLong(10);
                        this.addTween({
                            targets: deathHead,
                            duration: 20,
                            scaleX: "+=0.03",
                            scaleY: "+=0.06",
                            onComplete: () => {
                                this.addTween({
                                    targets: deathHead,
                                    ease: 'Quart.easeOut',
                                    duration: 80,
                                    scaleX: "-=0.015",
                                    scaleY: "-=0.025",
                                    onComplete: () => {
                                        this.addTween({
                                            targets: deathHead,
                                            duration: 20,
                                            scaleX: "+=0.03",
                                            scaleY: "+=0.06",
                                            onComplete: () => {
                                                this.addTween({
                                                    targets: deathHead,
                                                    ease: 'Quart.easeOut',
                                                    duration: 80,
                                                    scaleX: "-=0.015",
                                                    scaleY: "-=0.025",
                                                    onComplete: () => {
                                                        this.addTween({
                                                            targets: deathHead,
                                                            duration: 20,
                                                            scaleX: "+=0.03",
                                                            scaleY: "+=0.06",
                                                            onComplete: () => {
                                                                screenShakeLong(10);
                                                                    this.addTween({
                                                                    targets: deathHead,
                                                                    ease: 'Quart.easeOut',
                                                                    duration: 100,
                                                                    scaleX: "-=0.015",
                                                                    scaleY: "-=0.03",
                                                                    onComplete: () => {
                                                                        this.addTween({
                                                                            targets: deathHead,
                                                                            duration: 40,
                                                                            scaleX: "+=0.03",
                                                                            scaleY: "+=0.06",
                                                                            onComplete: () => {
                                                                                screenShakeLong(10);
                                                                                this.addTween({
                                                                                    targets: deathHead,
                                                                                    ease: 'Quart.easeOut',
                                                                                    duration: 120,
                                                                                    scaleX: "-=0.015",
                                                                                    scaleY: "-=0.03",
                                                                                    onComplete: () => {
                                                                                        deathHead.setScale(deathHead.scaleX + 0.05, deathHead.scaleY + 0.07);
                                                                                        this.addTween({
                                                                                            targets: deathHead,
                                                                                            ease: 'Cubic.easeIn',
                                                                                            alpha: 0,
                                                                                            duration: 1400,
                                                                                            scaleX: "-=0.15",
                                                                                            scaleY: "-=0.08",
                                                                                            onComplete: () => {
                                                                                                deathHead.destroy();
                                                                                            }
                                                                                        })
                                                                                    }
                                                                                })
                                                                            }
                                                                        })
                                                                    }
                                                                })
                                                            }
                                                        })
                                                    }
                                                })
                                            }
                                        })
                                    }
                                })
                            }
                        })
                    }
                })
            }
        })
    }
}
