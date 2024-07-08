 class Death2 extends Enemy {
     constructor(scene, x, y) {
         super(scene, x, y);
         this.initSprite('max_death_2.png', 0.85, 0, 0, 'deathfinal');
         this.sprite.setOrigin(0.5, 0.2)
         this.whiteBG = this.addImage(gameConsts.halfWidth, gameConsts.halfHeight, 'whitePixel').setScale(500).setAlpha(0.5);
         this.blackBG = this.addImage(gameConsts.halfWidth, gameConsts.halfHeight, 'blackPixel').setScale(500).setAlpha(0).setDepth(-2);
         this.createAnimatedHellBG();
         globalObjects.player.reInitStats();
         globalObjects.player.refreshHealthBar();
         this.createArms();

         this.addTween({
            targets: this.whiteBG,
            alpha: 0,
            duration: 1000,
            onComplete: () => {
                this.whiteBG.destroy();
            }
         })
        globalObjects.magicCircle.disableMovement();
        setTimeout(() => {
             this.setAsleep();
             this.introSpeech();
         }, 10)
     }

     initSpriteAnim(scale) {
         this.sprite.setScale(scale);
         if (!this.delayLoad) {
             this.scene.tweens.add({
                 targets: this.sprite,
                 duration: gameVars.gameManualSlowSpeedInverse * 750,
                 ease: 'Quad.easeOut',
                 alpha: 1
             });
         }
     }

     createArms() {
         let xOffsetLeft = -56 * this.sprite.startScale;
         let xOffsetRight = 72 * this.sprite.startScale;
         let yOffsetLeft = + 59 * this.sprite.startScale;
         let yOffsetRight = + 58 * this.sprite.startScale;
         this.leftArm = this.addImage(this.x + xOffsetLeft, this.y + yOffsetLeft, 'deathfinal', 'max_death_2_left.png').setDepth(2).setScale(this.sprite.startScale);
         this.rightArm = this.addImage(this.x + xOffsetRight, this.y + yOffsetRight, 'deathfinal', 'max_death_2_right.png').setDepth(2).setScale(this.sprite.startScale);
         this.leftShoulder = this.addImage(this.x, this.y, 'deathfinal', 'max_death_2_shoulder.png').setDepth(2).setScale(this.sprite.startScale).setOrigin(0.5, this.sprite.originY);

         this.leftArm.setRotation(0.08);
         this.rightArm.setRotation(-0.08);
         this.idleAnim();
     }

     idleAnim() {
         this.addTween({
             targets: this.sprite,
             y: "+=4",
             scaleY: this.sprite.startScale * 0.983,
             yoyo: true,
             ease: 'Cubic.easeInOut',
             repeat: -1,
             duration: 2000
         });

         this.addTween({
             targets: this.leftArm,
             rotation: -0.07,
             y: "+=3",
             yoyo: true,
             ease: 'Cubic.easeInOut',
             repeat: -1,
             duration: 2000
         });
         this.addTween({
             targets: this.rightArm,
             rotation: 0.07,
             y: "+=3",
             yoyo: true,
             ease: 'Cubic.easeInOut',
             repeat: -1,
             duration: 2000
         })
         this.addTween({
             targets: this.leftShoulder,
             y: "+=3",
             yoyo: true,
             ease: 'Cubic.easeInOut',
             repeat: -1,
             duration: 2000
         })
     }

    introSpeech() {
        globalObjects.bannerTextManager.setDialog([getLangText('deathFight2a')]);
        globalObjects.bannerTextManager.setPosition(gameConsts.halfWidth, gameConsts.halfHeight + 10, 0);
        globalObjects.bannerTextManager.showBanner(0);
        globalObjects.bannerTextManager.setOnFinishFunc(() => {
            this.setAwake();
            globalObjects.magicCircle.enableMovement();
        })
    }

    initStatsCustom() {
        this.health = 600;
        this.fistObjects = [];
        this.attackScale = 1.13;
        this.lastAttackLingerMult = 0.9;
        this.extraRepeatDelay = 500;
        this.pullbackHoldRatio = 0.5;
        this.attackSlownessMult = 1;
        this.attackEase = 'Quint.easeIn';
        this.customInitialPullback = 'Quint.easeOut';
        this.customRepeatPullback = 'Quart.easeInOut';
        this.shieldOffsetY = 120;
        this.shieldTextOffsetY = -60;
        this.shieldScale = 1.3;
        this.fistObjectPosX = [-140, 140, -75, 75, -250, 250, -220, 220, 0];
        this.fistObjectPosY = [100, 100, -15, -15, 160, 160, 20, 20, 65];
    }

     repeatTweenBreathe(duration = 1500, magnitude = 1) {
         if (this.breatheTween) {
             this.breatheTween.stop();
         }
     }


     setHealth(newHealth) {

         super.setHealth(newHealth);
         let currHealthPercent = this.health / this.healthMax;
         if (currHealthPercent == 0) {
             // dead, can't do anything
             return;
         } else {
             let prevHealthPercent = this.prevHealth / this.healthMax;
             if (prevHealthPercent > 0.5 && currHealthPercent <= 0.5 && !this.thornForm) {
                 this.thornForm = true;
                 this.isPreppingFists = false;
                 this.interruptCurrentAttack();
                this.clearFistObjects();
                 playSound('clunk');
                 this.setArmsVisible(false);
                 this.setDefaultSprite('death2crouch.png');
                 messageBus.publish("enemyAddShield", 120);
                 this.currentAttackSetIndex = 1;
                 this.nextAttackIndex = 0;
                 this.setAsleep();
                 globalObjects.bannerTextManager.setDialog([getLangText('deathFight2c')]);
                 globalObjects.bannerTextManager.setPosition(gameConsts.halfWidth, gameConsts.halfHeight + 10, 0);
                 globalObjects.bannerTextManager.showBanner(0);
                 globalObjects.bannerTextManager.setOnFinishFunc(() => {
                     this.setAwake();
                 })
             }
         }
     }


     setSpriteIfNotInactive(name, scale, noAnim, depth = 1) {
         super.setSpriteIfNotInactive(name, scale, noAnim, depth);
         if (name !== "max_death_2") {
             this.setArmsVisible(false);
         }
         if (name === "death2windup.png" || name === "death2windupflip.png") {
             if (!this.windupVfx) {
                 this.windupVfx = this.addImage(this.x, this.y, 'deathfinal', 'death2windupvfx.png').setOrigin(0.5, 0.12);
             }
             let isFlipped = name === "death2windupflip.png";
             this.windupVfx.setScale(isFlipped ? -1.1 : 1.1, 1.1).setAlpha(1);
             this.addTween({
                 targets: this.windupVfx,
                 duration: 400,
                 alpha: 0,
             });
             this.addTween({
                 targets: this.windupVfx,
                 duration: 400,
                 scaleX: isFlipped ? -1.25 : 1.25,
                 scaleY: 1.2,
                 ease: 'Cubic.easeOut',
             });
         }

     }

     clearThorns() {

     }

    initAttacks() {
        this.attacks = [
            [
                {
                    name: "|12",
                    chargeAmt: 450,
                    damage: 12,
                    attackTimes: 1,
                    chargeMult: 4,
                    prepareSprite: 'death2windup.png',
                    attackSprites: ['death2punch.png'],
                    startFunction: () => {
                        this.pullbackScale = 0.88;
                        this.attackScale = 1.13;
                    },
                    finaleFunction: () => {
                        this.setArmsVisible(true);
                    },
                    attackFinishFunction: () => {
                        // this.makeSlashEffect();
                        this.createPunchEffect();
                    },
                },
                {
                    name: "|8x2",
                    chargeAmt: 450,
                    damage: 8,
                    attackTimes: 2,
                    prepareSprite: ['death2windup.png', 'death2windupflip.png'],
                    attackSprites: ['death2punch.png', 'death2punchflip.png'],
                    startFunction: () => {
                        this.pullbackScale = 0.88;
                        this.attackScale = 1.13;
                    },
                    finaleFunction: () => {
                        this.setArmsVisible(true);
                    },
                    attackFinishFunction: () => {
                    // this.makeSlashEffect();
                        this.createPunchEffect();
                    },
                },
                {
                    name: ";30",
                    chargeAmt: 500,
                    damage: 30,
                    attackTimes: 1,
                    prepareSprite: "death2crouch.png",
                    preAttackSprite: 'death2charge.png',
                    attackSprites: ['death2charge.png'],
                    finishDelay: 2000,
                    startFunction: () => {
                        this.setSpriteIfNotInactive('max_death_2_full.png', undefined, true)
                        this.pullbackScale = 0.6;
                        this.attackScale = 1.5;
                        this.pullbackHoldRatio = 0.9;
                        this.pullbackInitialDelay = 450;
                        this.attackSlownessMult = 2;
                        this.attackDurMult = 0.4;
                    },
                    finaleFunction: () => {
                        this.pullbackInitialDelay = 0;
                        // this.setDefaultSprite('max_death_2.png', null, true)
                        this.setArmsVisible(true);
                        this.pullbackHoldRatio = 0.5;
                    },
                    attackStartFunction: () => {
                        // this.setDefaultSprite('death2charge.png', null, true)
                        // this.sprite.setFrame('max_death_2.png')
                    },
                    attackFinishFunction: () => {
                        playSound('showdown_bell', 1);
                        // this.makeSlashEffect();

                    },
                },
                {
                    name: "}6   ",
                    chargeAmt: 880,
                    finishDelay: 1200,
                    chargeMult: 2,
                    damage: 6,
                    isBigMove: true,
                    attackSprites: ['death2punch.png'],
                    startFunction: () => {
                        this.pullbackScale = 0.9;
                        this.attackScale = 1.1;
                        this.attackSlownessMult = 1;
                        this.nextAttack.chargeMult = 2;
                        this.setArmsVisible(false)
                        this.setDefaultSprite('death2windup.png');
                        this.addDelay(() => {
                            this.isPreppingFists = true;
                            this.prepareManyFists();
                        }, 900)
                    },
                    attackStartFunction: () => {
                        this.isPreppingFists = false;
                        this.addTween({
                            targets: this.blackBG,
                            alpha: 0,
                            duration: 600
                        })
                        this.launchFists();
                    },
                    attackFinishFunction: () => {
                        // this.makeSlashEffect();
                        playSound('punch');
                        let powEffect = getTempPoolObject('spells', 'damageEffect1.png', 'damageEffect1', 400);
                        powEffect.setPosition(gameConsts.halfWidth, globalObjects.player.getY() - 185).setDepth(998).setScale(1.45);
                    },
                    finaleFunction: () => {
                        this.setDefaultSprite('max_death_2.png');
                        this.setArmsVisible(true);
                    },
                },
            ],
            [
                {
                    name: "THORNS {6",
                    chargeAmt: 900,
                    finishDelay: 1000,
                    chargeMult: 10,
                    damage: -1,
                    isPassive: true,
                    isBigMove: true,
                    startFunction: () => {
                    },
                    attackStartFunction: () => {
                        this.thorns1 = this.addImage(this.x - 4, this.y - 95, 'enemies', 'thorns.png').setDepth(8).setRotation(1.57 + 3.1415).setOrigin(0.5, -0.6).setScale(0.7, 0.5);
                        this.thorns2 = this.addImage(this.x - 4, this.y - 95, 'enemies', 'thorns.png').setDepth(8).setRotation(1.57).setOrigin(0.5, -0.6).setScale(0.7, 0.5);
                        this.thorns1.alpha = 0;
                        this.thorns2.alpha = 0;

                    },
                    attackFinishFunction: () => {
                        this.currentAttackSetIndex = 0;
                        this.nextAttackIndex = 0;
                        let goalScale = 1.35;
                        let param = {
                            duration: 400,
                            ease: 'Quad.easeOut',
                            y: "-=1",
                            scaleX: goalScale,
                            scaleY: goalScale,
                        }
                        let param2 = {
                            alpha: 0,
                            duration: 1600,
                            scaleX: goalScale * 0.95,
                            scaleY: goalScale * 0.95
                        }

                        messageBus.publish('animateArmorNum', gameConsts.halfWidth, this.y + 120, "+6 THORNS", goalScale, param, param2);
                        this.setDefense(2);
                        this.hasThorns = true;
                    },
                    finaleFunction: () => {
                        this.setDefaultSprite('max_death_2.png');
                        this.setArmsVisible(true);
                    },
                },
            ]
        ];
    }

    prepareManyFists() {
        if (!this.isPreppingFists || this.dead) {
            return;
        }
        let isLast = false;
        if (this.fistObjects.length >= 9) {
            this.nextAttack.chargeMult = 5;
            return;
        } else if (this.fistObjects.length == 8) {
            isLast = true;
            playSound('slice_in', 1).detune = 250;
        } else {
            let detuneAmt = (this.fistObjects.length + 1 % 4) * 150 - 800 + 25 * this.fistObjects.length;
            playSound('slice_in', 0.85).detune = detuneAmt;

        }
        this.blackBG.alpha = 0.05 + 0.03 * this.fistObjects.length;
        let xPos = this.x + this.fistObjectPosX[this.fistObjects.length];
        let yPos = this.y + this.fistObjectPosY[this.fistObjects.length];
        let markObj = this.addImage(xPos, yPos, 'deathfinal', 'marker.png').setAlpha(0.1).setRotation(-Math.PI * 1.2).setScale(isLast ? 3 : 1.25);
        if (isLast) {
            markObj.setDepth(-1);
        }
        this.addTween({
            targets: markObj,
            scaleX: isLast ? 1.8 : 0.55,
            scaleY: isLast ? 1.8 : 0.55,
            rotation: -Math.PI * 0.25,
            duration: isLast ? 750 : 500,
            ease: 'Quart.easeIn',
            onComplete: () => {
                if (isLast) {
                    this.addTween({
                        targets: markObj,
                        scaleX: 2.1,
                        scaleY: 2.1,
                        ease: 'Quint.easeOut',
                        duration: 900
                    })
                } else {
                    markObj.setScale(0.75);
                    this.addTween({
                        targets: markObj,
                        scaleX: 0.6,
                        scaleY: 0.6,
                        ease: 'Back.easeIn',
                        duration: 180,
                        onComplete: () => {
                            markObj.currAnim = this.addTween({
                                targets: markObj,
                                x: "+=3",
                                duration: 100,
                                yoyo: true,
                                repeat: 300
                            })
                        }
                    })
                }
            }
        })
        this.addTween({
            targets: markObj,
            alpha: 1,
            duration: 500,
            ease: 'Quad.easeIn'
        })
        this.fistObjects.push(markObj);
        let attackNum = this.fistObjects.length + 1;
        if (attackNum < 3) {
            this.attackName.setText("}6x" + attackNum);
        } else if (attackNum < 6) {
            this.attackName.setText("}}6x" + attackNum);
        } else {
            this.attackName.setText("}}}6x" + attackNum);

        }
        this.addDelay(() => {
            this.prepareManyFists();
        }, 3000);
    }

    launchFists() {
         let tempFistObjs = [...this.fistObjects];
        for (let i = 0; i < this.fistObjects.length; i++) {
            let markObj = tempFistObjs[i];
            if (markObj.currAnim) {
                markObj.currAnim.stop();
            }
            this.addTween({
                targets: markObj,
                delay: 600 + 220 * i,
                ease: 'Quart.easeIn',
                scaleX: 0,
                scaleY: 0,
                duration: 500,
                onComplete: () => {
                    this.createLaunchedFist(markObj.x);
                    markObj.destroy();
                }
            })
        }
        this.fistObjects = [];
    }

    createLaunchedFist(x) {
         if (this.dead) {
             return;
         }
         let isLeft = x < gameConsts.halfWidth;
         let punchPortal = getTempPoolObject('deathfinal', 'punchportal.png', 'punchPortal', 2000);
        let randScale = 0.88 + Math.random() * 0.08;
         punchPortal.setPosition(gameConsts.halfWidth * 0.5 + x * 0.5, globalObjects.player.getY() - 210 - randScale * 100 - Math.abs(x - gameConsts.halfWidth) * 0.1).setScale(0);
         let rotAmt = 0.0015*(x - gameConsts.halfWidth);
         punchPortal.setRotation(rotAmt).setDepth(119);
         this.addTween({
             targets: punchPortal,
             scaleX: randScale,
             scaleY: randScale,
             ease: 'Quart.easeOut',
             duration: 250,
             completeDelay: 50,
             onComplete: () => {
                 punchPortal.setDepth(120);
                let punchFist = this.addImage(punchPortal.x, punchPortal.y, 'deathfinal', 'puncharmblur.png');
                 let punchFistFade = this.addImage(punchPortal.x, punchPortal.y, 'deathfinal', 'puncharmblur.png');
                 punchFist.setScale(isLeft ? 0.85 : -0.85, 0).setRotation(punchPortal.rotation * 0.4).setDepth(121);
                 punchFist.setOrigin(0.6, 0.5);
                 punchFist.x += isLeft ? 27 : - 27;
                 punchFistFade.setScale(punchFist.scaleX, punchFist.scaleY).setRotation(punchFist.rotation).setDepth(punchFist.depth + 1);
                 punchFistFade.setOrigin(0.6, 0.5).setAlpha(0.3);
                 punchFistFade.x = punchFist.x;
                 this.addTween({
                     targets: punchFistFade,
                     scaleX: isLeft ? randScale * 1.1: randScale * -1.1,
                     rotation: punchPortal.rotation * 1.1,
                     scaleY: randScale * 1.15,
                     alpha: 0.6,
                     ease: 'Cubic.easeIn',
                     duration: 140,
                     onComplete: () => {
                         this.addTween({
                             targets: punchFistFade,
                             scaleX: isLeft ? randScale : -randScale,
                             scaleY: randScale,
                             rotation: punchPortal.rotation,
                             ease: 'Back.easeOut',
                             alpha: 0,
                             duration: 40,
                         })
                     }
                 })
                 this.addTween({
                     delay: 150,
                     targets: punchFist,
                     scaleX: isLeft ? randScale * 1.1: randScale * -1.1,
                    rotation: punchPortal.rotation * 1.1,
                     scaleY: randScale * 1.15,
                     ease: 'Cubic.easeIn',
                     duration: 150,
                     onComplete: () => {
                         punchFist.setFrame('puncharm.png');
                         punchFist.setOrigin(0.6, 0.5);
                         messageBus.publish("selfTakeDamage", 6);
                         let powEffect = getTempPoolObject('spells', 'damageEffect1.png', 'damageEffect1', 150);
                         powEffect.setPosition(gameConsts.halfWidth * 0.4 + 0.6 * punchPortal.x, globalObjects.player.getY() - 185).setDepth(998).setScale(1.4);
                         screenShake(2);
                         playSound(isLeft ? 'punch' : 'punch2');
                         this.addTween({
                             targets: punchFist,
                             scaleX: isLeft ? randScale : -randScale,
                             scaleY: randScale,
                             rotation: punchPortal.rotation,
                             ease: 'Back.easeOut',
                             duration: 40,
                             onComplete: () => {
                                 this.addTween({
                                     delay: 100,
                                     targets: [punchFist],
                                     ease: 'Quart.easeIn',
                                     scaleY: 0,
                                     duration: 200,
                                     onComplete: () => {
                                         punchFist.destroy();
                                     }
                                 })
                                 this.addTween({
                                     targets: [punchFist, punchPortal],
                                     ease: 'Cubic.easeIn',
                                     alpha: 0,
                                     duration: 250
                                 })
                             }
                         })
                     }
                 })
             }
         })
    }

    createPunchEffect() {
        let isSwingingLeft = this.sprite.attackNum % 2 == 0;
        playSound(isSwingingLeft ? 'punch' : 'punch2');
        screenShake(2);
         let powEffect = getTempPoolObject('spells', 'damageEffect1.png', 'damageEffect1', 400);
         let xOffset = isSwingingLeft ? -30 : 30;
         powEffect.setPosition(gameConsts.halfWidth + xOffset, globalObjects.player.getY() - 185).setDepth(998).setScale(1.5);

         let fistEffect = getTempPoolObject('deathfinal', 'deathfist.png', 'fist', 360);
         let xOffset2 = isSwingingLeft ? -34 : 39;
        let yOffset2 = isSwingingLeft ? 50 : 58;
         let leftMult = isSwingingLeft ? 1 : -1;
         fistEffect.setPosition(this.sprite.x + xOffset2, this.y + yOffset2).setDepth(11).setScale(1.24 * leftMult, 1.24);
         this.addTween({
             delay: 10,
             targets: fistEffect,
             duration: 340,
             y: '-=5',
             scaleX: this.sprite.startScale * 0.82 * leftMult,
             scaleY: this.sprite.startScale * 0.82,
             ease: 'Quart.easeIn',
         });

    }

     useMove() {
         // if (this.nextAttack.damage !== 0) {
         //     this.leftArm.visible = false;
         //     this.rightArm.visible = false;
         //     this.leftShoulder.visible = false;
         // }
         super.useMove();
     }

     setArmsVisible(val) {
         this.leftArm.visible = val;
         this.rightArm.visible = val;
         this.leftShoulder.visible = val;
     }

     clearFistObjects() {
         if (this.fistObjects.length > 0) {
             PhaserScene.add.tween({
                 targets: this.fistObjects,
                 duration: 500,
                 ease: 'Back.easeIn',
                 scaleX: 0,
                 scaleY: 0,
                 onComplete: () => {
                     for (let i = 0; i < this.fistObjects.length; i++) {
                         this.fistObjects[i].destroy();
                     }
                     this.fistObjects = [];
                 }
             })
         }
     }

    die() {
         super.die();
         this.clearFistObjects();
        fadeAwaySound(this.bgMusic);
    }

    createAnimatedHellBG() {
        this.bg1 = this.addImage(gameConsts.halfWidth, gameConsts.halfHeight - 15, 'backgrounds', 'firebg1.png').setDepth(-5);
        this.bg2 = this.addImage(gameConsts.halfWidth, gameConsts.halfHeight - 15, 'backgrounds', 'firebg2.png').setDepth(-5);
        this.nextBG = 0;
        this.useFirstBG = true;
        this.animateBGRepeat();
    }
    animateBGRepeat() {
        this.bg1.setDepth(-5); this.bg2.setDepth(-5);
        let bgToUse = this.useFirstBG ? this.bg1 : this.bg2;
        let newFrame = 'firebg' + this.nextBG + '.png';
        bgToUse.setFrame(newFrame);
        this.nextBG = (this.nextBG + 1) % 3;
        bgToUse.setAlpha(0).setDepth(-4);
        this.addTween({
            targets: bgToUse,
            duration: 1200,
            alpha: 1,
            onComplete: () => {
                this.useFirstBG = !this.useFirstBG;
                this.animateBGRepeat();
            }
        })
    }
}
