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
            globalObjects.encyclopedia.hideButton();
            globalObjects.options.hideButton();
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

    introSpeech() {
        globalObjects.bannerTextManager.setDialog([getLangText('deathFight2a')]);
        globalObjects.bannerTextManager.setPosition(gameConsts.halfWidth, gameConsts.halfHeight + 10, 0);
        globalObjects.bannerTextManager.showBanner(0);
        globalObjects.bannerTextManager.setOnFinishFunc(() => {
            this.setAwake();
            globalObjects.magicCircle.enableMovement();
            globalObjects.encyclopedia.showButton();
            globalObjects.options.showButton();
            this.bgMusic = playMusic('but_never_forgotten', 1, true);
        })
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
         this.idleAnimations.push(this.addTween({
             targets: this.sprite,
             y: "+=4",
             scaleY: this.sprite.startScale * 0.983,
             yoyo: true,
             ease: 'Cubic.easeInOut',
             repeat: -1,
             duration: 2000
         }));

         this.idleAnimations.push(this.addTween({
             targets: this.leftArm,
             rotation: -0.07,
             y: "+=3",
             yoyo: true,
             ease: 'Cubic.easeInOut',
             repeat: -1,
             duration: 2000
         }));
         this.idleAnimations.push(this.addTween({
             targets: this.rightArm,
             rotation: 0.07,
             y: "+=3",
             yoyo: true,
             ease: 'Cubic.easeInOut',
             repeat: -1,
             duration: 2000
         }));
         this.idleAnimations.push(this.addTween({
             targets: this.leftShoulder,
             y: "+=3",
             yoyo: true,
             ease: 'Cubic.easeInOut',
             repeat: -1,
             duration: 2000
         }));
     }


    initStatsCustom() {
        this.health = 600;
        this.fistObjects = [];
        this.thornsList = [];
        this.idleAnimations = [];
        this.attackScale = 1.13;
        this.lastAttackLingerMult = 0.9;
        this.extraRepeatDelay = 500;
        this.pullbackHoldRatio = 0.5;
        this.attackSlownessMult = 1;
        this.attackEase = 'Quint.easeIn';
        this.customInitialPullback = 'Quint.easeOut';
        this.customRepeatPullback = 'Quart.easeInOut';
        this.shieldOffsetY = 95;
        this.shieldTextOffsetY = -40;
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

                 this.preventArmsVisible = true;
                 this.isPreppingFists = false;
                 this.interruptCurrentAttack();
                this.clearFistObjects();
                 playSound('clunk');
                 this.setArmsVisible(false);
                 this.forceOverrideSprite = 'death2crouch.png';
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
         this.thornsAmt = 0;
         this.addTween({
             targets: this.thornsList,
             scaleX: 0,
             scaleY: 0,
             alpha: 0,
             ease: 'Quad.easeIn',
             duration: 1000,
             onComplete: () => {
                 for (let i = 0; i < this.thornsList.length; i++) {
                     this.thornsList[i].destroy();
                 }
             }
         })
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
                    chargeAmt: 350,
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
                    finishDelay: 1200,
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
                        globalObjects.encyclopedia.showButton();
                        globalObjects.options.showButton();
                    },
                    attackStartFunction: () => {
                        // this.setDefaultSprite('death2charge.png', null, true)
                        // this.sprite.setFrame('max_death_2.png')
                        globalObjects.encyclopedia.hideButton();
                        globalObjects.options.hideButton();
                    },
                    attackFinishFunction: () => {
                        playSound('death_attack', 1);
                        screenShake(6);
                        let fakeDeathBG = this.addImage(gameConsts.halfWidth, gameConsts.halfHeight, 'backgrounds', 'fake_death_bg.png').setScale(2).setDepth(30);
                        fakeDeathBG.scrollFactorX = -0.1;
                        fakeDeathBG.scrollFactorY = 0;
                        this.addTween({
                            targets: fakeDeathBG,
                            alpha: 0,
                            ease: "Quad.easeOut",
                            duration: 3200,
                            onComplete: () => {
                                fakeDeathBG.destroy();
                            }
                        })
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
                    chargeAmt: 700,
                    finishDelay: 1000,
                    chargeMult: 10,
                    damage: -1,
                    isPassive: true,
                    isBigMove: true,
                    startFunction: () => {
                        this.pullbackScale = 0.95;
                        this.attackScale = 1.05;
                        this.attackSlownessMult = 1;
                    },
                    attackStartFunction: () => {
                        this.createThornsAnimation();
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
                        this.thornsAmt = 6;
                        this.setDefense(6);
                        this.hasThorns = true;
                    },
                    finaleFunction: () => {
                        this.preventArmsVisible = false;
                        this.forceOverrideSprite = null;
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
                     delay: 120,
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
                                     delay: 150,
                                     targets: [punchFist],
                                     ease: 'Quart.easeIn',
                                     scaleY: 0,
                                     duration: 250,
                                     onComplete: () => {
                                         punchFist.destroy();
                                     }
                                 })
                                 this.addTween({
                                     targets: [punchFist, punchPortal],
                                     ease: 'Cubic.easeIn',
                                     alpha: 0,
                                     duration: 350
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
         if (this.preventArmsVisible && val) {
             return;
         }
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
         for (let i = 0; i < this.idleAnimations.length; i++) {
             this.idleAnimations[i].stop();
         }
         this.clearFistObjects();
         if (this.bgMusic) {
             fadeAwaySound(this.bgMusic);
         }
        this.setArmsVisible(false);
        this.forceOverrideSprite = 'death2fall.png';
        this.setDefaultSprite('death2fall.png', this.sprite.startScale);
        this.clearThorns();


    }

    createAnimatedHellBG() {
        this.bg1 = this.addImage(gameConsts.halfWidth, gameConsts.halfHeight - 15, 'backgrounds', 'firebg1.png').setDepth(-5);
        this.bg2 = this.addImage(gameConsts.halfWidth, gameConsts.halfHeight - 15, 'backgrounds', 'firebg2.png').setDepth(-5);
        this.nextBG = 0;
        this.useFirstBG = true;
        this.animateBGRepeat();
    }

    createThornsAnimation() {
         let yOffset = 120;
        this.thorns1 = this.addImage(this.x, this.y + yOffset, 'enemies', 'thorns.png').setDepth(8).setRotation(1.57 + 3.1415).setOrigin(0.5, -0.55).setScale(0.7, 0.5);
        this.thorns2 = this.addImage(this.x, this.y + yOffset, 'enemies', 'thorns.png').setDepth(8).setRotation(1.57 + 3.1415).setOrigin(0.5, -0.55).setScale(0.7, 0.5);
        this.thorns3 = this.addImage(this.x, this.y + yOffset, 'enemies', 'thorns.png').setDepth(8).setRotation(1.57 + 3.1415).setOrigin(0.5, -0.55).setScale(0.7, 0.5);
        this.thorns4 = this.addImage(this.x, this.y + yOffset, 'enemies', 'thorns.png').setDepth(8).setRotation(1.57).setOrigin(0.5, -0.55).setScale(0.7, 0.5);
        this.thorns5 = this.addImage(this.x, this.y + yOffset, 'enemies', 'thorns.png').setDepth(8).setRotation(1.57).setOrigin(0.5, -0.55).setScale(0.7, 0.5);
        this.thorns6 = this.addImage(this.x, this.y + yOffset, 'enemies', 'thorns.png').setDepth(8).setRotation(1.57).setOrigin(0.5, -0.55).setScale(0.7, 0.5);

        this.thornsList.push(this.thorns1);
        this.thornsList.push(this.thorns2);
        this.thornsList.push(this.thorns3);
        this.thornsList.push(this.thorns4);
        this.thornsList.push(this.thorns5);
        this.thornsList.push(this.thorns6);

        this.thorns1.alpha = 0;
        this.thorns2.alpha = 0;
        this.thorns3.alpha = 0;
        this.thorns4.alpha = 0;
        this.thorns5.alpha = 0;
        this.thorns6.alpha = 0;
        this.addTween({
            targets: [this.thorns1, this.thorns2, this.thorns3, this.thorns4, this.thorns5, this.thorns6],
            scaleX: 1,
            scaleY: 1,
            ease: 'Cubic.easeOut',
            duration: 1000,
            alpha: 1,
        });
        this.addTween({
            targets: [this.thorns1, this.thorns2, this.thorns3],
            x: "+=20",
            ease: 'Quad.easeIn',
            duration: 500,
            onComplete: () => {
                this.addTween({
                    targets: [this.thorns2, this.thorns3],
                    x: "+=60",
                    ease: 'Quad.easeOut',
                    duration: 350,
                    onComplete: () => {
                        this.addTween({
                            targets: [this.thorns3],
                            x: "+=60",
                            ease: 'Quart.easeOut',
                            duration: 350,
                            completeDelay: 200,
                            onComplete: () => {
                                this.addTween({
                                    targets: [this.thorns2, this.thorns3],
                                    x: "-=60",
                                    ease: 'Cubic.easeIn',
                                    duration: 350,
                                    onComplete: () => {
                                        this.thorns2.destroy();
                                        this.thorns1.setScale(1.2)
                                        this.addTween({
                                            targets: [this.thorns1],
                                            scaleX: 1.1,
                                            scaleY: 1.1,
                                            ease: 'Back.easeOut',
                                            duration: 200,
                                        })
                                        this.addTween({
                                            targets: [this.thorns3],
                                            x: "-=50",
                                            ease: 'Cubic.easeIn',
                                            duration: 350,
                                            onComplete: () => {
                                                this.thorns3.destroy();
                                                this.thorns1.setFrame('thorns2.png').setScale(0.8).setOrigin(0.5, -0.15);
                                                this.finishThornsAnimation();
                                                this.addTween({
                                                    targets: [this.thorns1],
                                                    scaleX: 0.65,
                                                    scaleY: 0.65,
                                                    alpha: 0.78,
                                                    ease: 'Back.easeOut',
                                                    duration: 200,
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
        this.addTween({
            targets: [this.thorns4, this.thorns5, this.thorns6],
            x: "-=20",
            ease: 'Quad.easeIn',
            duration: 500,
            onComplete: () => {
                this.addTween({
                    targets: [this.thorns5, this.thorns6],
                    x: "-=60",
                    ease: 'Quad.easeOut',
                    duration: 350,
                    onComplete: () => {
                        this.addTween({
                            targets: [this.thorns6],
                            x: "-=60",
                            ease: 'Quart.easeOut',
                            duration: 350,
                            completeDelay: 200,
                            onComplete: () => {
                                this.addTween({
                                    targets: [this.thorns5, this.thorns6],
                                    x: "+=60",
                                    ease: 'Cubic.easeIn',
                                    duration: 350,
                                    onComplete: () => {
                                        this.thorns5.destroy();
                                        this.thorns4.setScale(1.2)
                                        this.addTween({
                                            targets: [this.thorns4],
                                            scaleX: 1.1,
                                            scaleY: 1.1,
                                            ease: 'Back.easeOut',
                                            duration: 200,
                                        })
                                        this.addTween({
                                            targets: [this.thorns6],
                                            x: "+=50",
                                            ease: 'Cubic.easeIn',
                                            duration: 350,
                                            onComplete: () => {
                                                this.thorns6.destroy();
                                                this.thorns4.setFrame('thorns2.png').setScale(0.8).setOrigin(0.5, -0.15)
                                                this.addTween({
                                                    targets: [this.thorns4],
                                                    scaleX: 0.65,
                                                    scaleY: 0.65,
                                                    ease: 'Back.easeOut',
                                                    alpha: 0.78,
                                                    duration: 200,
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

     finishThornsAnimation() {
         this.clearShield();
         if (this.dead) {
             return;
         }
         this.thorns7 = this.addImage(this.x, 0, 'enemies', 'thorns2.png').setDepth(-1).setOrigin(0.5, 0.5).setScale(0.9, 0).setRotation(-0.5);
         this.thorns8 = this.addImage(-15, 110, 'enemies', 'thorns2.png').setDepth(-1).setOrigin(0.5, 0.5).setScale(0.9, 0).setRotation(Math.PI * -0.5 + 0.24 - 0.5);
         this.thorns9 = this.addImage(gameConsts.width + 15, 110, 'enemies', 'thorns2.png').setDepth(-1).setOrigin(0.5, 0.5).setScale(0.9, 0).setRotation(Math.PI * 0.5 - 0.24 -0.5);

         this.thornsList.push(this.thorns7);
         this.thornsList.push(this.thorns8);
         this.thornsList.push(this.thorns9);

         this.addTween({
             targets: [this.thorns7, this.thorns8, this.thorns9],
             duration: 750,
             rotation: "+=0.5",
             easeParams: [3],
             ease: 'Back.easeOut',
             scaleX: 1,
             scaleY: 1.1,
             onComplete: () => {
                 this.addTween({
                     targets: [this.thorns7],
                     duration: 550,
                     ease: 'Cubic.easeInOut',
                     scaleY: 0.9,
                 })
             }
         })
         this.addTween({
             targets: [this.thorns7],
             duration: 1250,
             ease: 'Cubic.easeInOut',
             alpha: 0.78,
             y: -25,
         })
         this.addTween({
             targets: [this.thorns8],
             duration: 1250,
             ease: 'Cubic.easeInOut',
             alpha: 0.78,
             x: -20,
         })
         this.addTween({
             targets: [this.thorns9],
             duration: 1250,
             ease: 'Cubic.easeInOut',
             alpha: 0.78,
             x: gameConsts.width + 20,
         })
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

     adjustDamageTaken(amt, isAttack, isTrue ) {
         if (isAttack && this.hasThorns && !isTrue && !this.dead) {
             let glowSpike = getTempPoolObject('enemies', 'glowSpike2.png', 'glowSpike2', 1800);
             let isLeft = Math.random() < 0.5;
             glowSpike.setScale(0.5).setAlpha(0.9).setPosition(gameConsts.halfWidth + (isLeft ? -50 : 50), this.y).setDepth(999).setRotation(isLeft ? -8 : 8);

             this.addTween({
                 targets: glowSpike,
                 x: gameConsts.halfWidth + (isLeft ? -80 : 80),
                 ease: 'Cubic.easeOut',
                 duration: 300,
                 rotation: 0,
                 onComplete: () => {
                     this.addTween({
                         rotation: isLeft ? 10 : -10,
                         targets: glowSpike,
                         ease: 'Cubic.easeIn',
                         x: gameConsts.halfWidth,
                         duration: 1100,
                     });
                 }
             });
             this.addTween({
                 targets: glowSpike,
                 ease: 'Quart.easeIn',
                 scaleX: 1.8,
                 scaleY: 1.8,
                 duration: 300,
                 onComplete: () => {
                     playSound('matter_body');
                     this.addTween({
                         targets: glowSpike,
                         ease: 'Cubic.easeOut',
                         scaleX: 1,
                         scaleY: 1,
                         duration: 1100,
                         onComplete: () => {
                             glowSpike.setScale(1.15);
                         }
                     });
                 }
             });

             this.addTween({
                 targets: glowSpike,
                 y: globalObjects.player.getY() - 270,
                 alpha: 1.2,
                 duration: 1300,
                 easeParams: [2.5],
                 ease: 'Back.easeIn',
                 onComplete: () => {
                     glowSpike.setDepth(20);
                     this.addTween({
                         targets: glowSpike,
                         y: globalObjects.player.getY() - 205,
                         duration: 100,
                         onComplete: () => {
                             messageBus.publish("selfTakeDamage", this.thornsAmt, false, glowSpike.x);
                             playSound('razor_leaf', 0.75)
                             this.addTween({
                                 targets: glowSpike,
                                 alpha: 0,
                                 ease: 'Cubic.easeIn',
                                 duration: 300,
                             });
                         }
                     });
                 }
             });

             this.thorns1.setScale(0.8).setAlpha(1);
             this.thorns4.setScale(0.8).setAlpha(1);
             this.thornsTween = this.addTween({
                 targets: [this.thorns1, this.thorns4],
                 scaleX: 0.65,
                 scaleY: 0.65,
                 alpha: 0.78,
                 ease: 'Quart.easeOut',
                 duration: 400,
             });
         }
         return super.adjustDamageTaken(amt, isAttack, isTrue);
     }
}
