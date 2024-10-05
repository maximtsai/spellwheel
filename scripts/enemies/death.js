 class Death extends Enemy {
     constructor(scene, x, y, level) {
         super(scene, x, y, level);
         this.initSprite('blank.png', 0.7);
        this.sprite.setOrigin(0.5, 0.45);
        swirlInReaperFog(1.25);
        this.setupCustomDeathSprite();
         setFloatingDeathVisible(true);

        setTimeout(() => {
            this.windSfx = playSound('wind', 0.01, true);
            fadeInSound(this.windSfx, 0.85, 2000);
            globalObjects.player.reInitStats();
            globalObjects.player.resetRecentDamage();
             this.setAsleep();
            globalObjects.magicCircle.disableMovement();
            this.healthBarCurr.setFrame('yellow_pixel.png');
            this.mainScythe = this.addSprite(this.x, this.y + 175, 'misc', 'scythe1.png').setDepth(200).setAlpha(0).setRotation(-0.6).setOrigin(0.5, 0.9);
         }, 10)
     }

     initStatsCustom() {
         this.health = 4;
         this.timesAttacked = 0;
         this.spellsCastCounter = 0;
         this.customAngry = "angrybone";
         this.scytheObjects = [];
         this.listOfAngryPopups = [];
     }

     swingScythe(damage = 444, fadeOutScythe = true, flipped = false, onComplete) {
         let flipMult = flipped ? -1 : 1;
         this.mainScythe.setPosition(this.x, 160).setDepth(999).setAlpha(0).setScale(0.65*flipMult, 0.65).setRotation(-1.5);
         let scythe = this.mainScythe;
         scythe.play('scytheFlash');
         PhaserScene.tweens.add({
             targets: scythe,
             alpha: 1,
             duration: 450
         })

         PhaserScene.tweens.add({
             targets: scythe,
             x: gameConsts.halfWidth + 5*flipMult,
             y: 100,
             scaleX: flipMult*0.75,
             scaleY: 0.75,
             rotation: -1.35,
             ease: 'Quart.easeIn',
             duration: 400,
             onComplete: () => {
                 PhaserScene.time.delayedCall(820, () => {
                     if (globalObjects.deathLeftHand.currAnim) {
                         globalObjects.deathLeftHand.currAnim.stop();
                         globalObjects.deathRightHand.currAnim.stop();
                     }
                     tweenObjectRotationTo(globalObjects.deathLeftHand, -0.2, 500, "Cubic.easeOut");
                     tweenObjectRotationTo(globalObjects.deathRightHand, 0.1, 500, "Cubic.easeOut");
                 })
                 PhaserScene.tweens.add({
                     targets: scythe,
                     scaleX: flipMult*0.85,
                     scaleY: 0.85,
                     y: 90,
                     ease: 'Cubic.easeInOut',
                     duration: 900,
                     onComplete: () => {
                         let leftBell = this.addImage(50, 40, 'deathfinal', 'bell.png').setScale(0.5).setAlpha(0).setOrigin(0.5, 0.1).setRotation(0.6);
                         let rightBell = this.addImage(gameConsts.width - 50, 40, 'deathfinal', 'bell.png').setScale(0.5).setAlpha(0).setOrigin(0.5, 0.1).setRotation(-0.6);
                         this.addTween({
                            delay: 200,
                            targets: [leftBell, rightBell],
                            duration: 1300,
                            ease: 'Quad.easeIn',
                            alpha: 0.35,
                            scaleX: 0.55,
                            scaleY: 0.55,
                            onComplete: () => {
                                playSound('death_cast', 0.65);
                                this.addDelay(() => {
                                    playSound('death_cast', 0.35)
                                }, 3000)

                                 this.addTween({
                                    targets: [leftBell, rightBell],
                                    duration: 4500,
                                    ease: 'Quad.easeOut',
                                    alpha: 0,
                                    onComplete: () => {
                                        leftBell.destroy();
                                        rightBell.destroy();
                                    }
                                 })
                            }
                         });
                         this.addTween({
                            targets: leftBell,
                            duration: 1500,
                            ease: 'Cubic.easeInOut',
                            rotation: -0.6,
                            yoyo: true,
                            repeat: 2
                         })
                         this.addDelayIfAlive(() => {
                             this.addTween({
                                targets: rightBell,
                                duration: 1500,
                                ease: 'Cubic.easeInOut',
                                rotation: 0.6,
                                yoyo: true,
                                repeat: 2
                             })
                         }, 200)
                     }
                 });
                 PhaserScene.tweens.add({
                     targets: scythe,
                     rotation: -0.5,
                     ease: 'Quart.easeOut',
                     duration: 900,
                     completeDelay: 200,
                     onComplete: () => {
                         scythe.play('scytheReap');

                         PhaserScene.tweens.add({
                             targets: scythe,
                             rotation: "-=1.5",
                             ease: 'Quint.easeIn',
                             duration: 125,
                             onComplete: () => {
                                 let fogSlice = getFogSlice();
                                 fogSlice.setPosition(gameConsts.halfWidth + 8, 25);
                                 let fogSliceDarken = getFogSliceDarken();
                                 fogSliceDarken.setPosition(gameConsts.halfWidth, gameConsts.halfHeight + 50);
                                 PhaserScene.tweens.add({
                                     targets: fogSliceDarken,
                                     alpha: 0.75,
                                     ease: 'Cubic.easeOut',
                                     duration: 500,
                                 });
                                 let oldSwirlAlpha = globalObjects.fogSwirl ? globalObjects.fogSwirl.alpha : 1;

                                 PhaserScene.tweens.add({
                                     targets: globalObjects.fogSwirl,
                                     alpha: 0.25,
                                     ease: 'Cubic.easeIn',
                                     duration: 300,
                                     onComplete: () => {
                                         PhaserScene.tweens.add({
                                             delay: 100,
                                             targets: globalObjects.fogSwirl,
                                             ease: 'Cubic.easeInOut',
                                             alpha: oldSwirlAlpha,
                                             duration: 1000,
                                         });
                                     }
                                 });
                                 PhaserScene.tweens.add({
                                     delay: 50,
                                     targets: [fogSlice],
                                     alpha: 1,
                                     ease: 'Quad.easeOut',
                                     duration: 200,
                                     onComplete: () => {
                                         PhaserScene.tweens.add({
                                             delay: 200,
                                             targets: [fogSlice, fogSliceDarken],
                                             ease: 'Quart.easeIn',
                                             alpha: 0,
                                             duration: 1400,
                                         });
                                     }
                                 });
                                 PhaserScene.tweens.add({
                                     delay: 50,
                                     targets: [fogSlice],
                                     scaleX: 1.08,
                                     scaleY: 1.08,
                                     ease: 'Quint.easeOut',
                                     duration: 300,
                                     onComplete: () => {
                                         PhaserScene.tweens.add({
                                             targets: [fogSlice],
                                             scaleX: 1.09,
                                             scaleY: 1.09,
                                             duration: 1500,
                                         });
                                     }
                                 });
                                 PhaserScene.tweens.add({
                                     delay: 50,
                                     targets: fogSlice,
                                     scaleX: 1.2,
                                     scaleY: 1.2,
                                     rotation: -0.85,
                                     ease: 'Quad.easeOut',
                                     duration: 1500,
                                 });
                                 setTimeout(() => {
                                     playSound('death_attack').detune = 0;
                                     messageBus.publish("selfTakeDamage", damage);
                                     messageBus.publish('showCircleShadow', 0.9, undefined, 985);
                                     messageBus.publish('tempPause', 350, 0.015);
                                     screenShake(20);
                                 }, 75);
                                 this.createScytheAttackSfx();
                                 PhaserScene.tweens.add({
                                     targets: scythe,
                                     scaleX: flipMult*1.35,
                                     scaleY: 1.35,
                                     ease: 'Quart.easeOut',
                                     duration: 200,
                                     onComplete: () => {
                                         PhaserScene.tweens.add({
                                             targets: scythe,
                                             scaleX: 1.05,
                                             scaleY: 1.05,
                                             ease: 'Quart.easeInOut',
                                             duration: 500,
                                         })
                                     }
                                 })
                                 PhaserScene.tweens.add({
                                     targets: scythe,
                                     rotation: -3.5,
                                     x: flipped ? "+=10" : "-=10",
                                     ease: 'Quint.easeOut',
                                     duration: 500,
                                     onComplete: () => {
                                         repeatDeathHandsRotate();
                                         if (!fadeOutScythe) {
                                             if (onComplete) {
                                                 onComplete();
                                             }
                                         } else {
                                             PhaserScene.tweens.add({
                                                 delay: 200,
                                                 targets: scythe,
                                                 rotation: "+=0.1",
                                                 x: flipped ? "+=12" : "-=12",
                                                 ease: 'Quart.easeInOut',
                                                 duration: 2000,
                                             })
                                             PhaserScene.tweens.add({
                                                 targets: scythe,
                                                 alpha: 0,
                                                 delay: 1000,
                                                 scaleX: flipMult * 0.6,
                                                 scaleY: 0.6,
                                                 ease: 'Cubic.easeIn',
                                                 duration: 600,
                                                 completeDelay: 1000,
                                                 onComplete: onComplete
                                             });
                                         }
                                     }
                                 });
                             }
                         });
                     }
                 });
             }
         });
     }

     repeatTweenBreathe(duration = 1500, magnitude = 1) {
         if (this.breatheTween) {
             this.breatheTween.stop();
         }
     }

     setupCustomDeathSprite() {
        this.floatingDeath = getFloatingDeath();
        // this.floatingDeath1 = PhaserScene.add.sprite(gameConsts.halfWidth, gameConsts.halfHeight - 300, 'enemies', 'max_death_1a.png').setDepth(1).setScale(0.3).setAlpha(0);
        // this.floatingDeath2 = PhaserScene.add.sprite(gameConsts.halfWidth, gameConsts.halfHeight - 300, 'enemies', 'max_death_1b.png').setDepth(1).setScale(0.3).setAlpha(0);
        // this.floatingDeath1.fakeAlpha = 0;
        // this.floatingDeath2.fakeAlpha = 0;
        // this.deathBreathe();
        repeatDeathHandsRotate();
        startDeathFlutterAnim();
        tweenFloatingDeath(0.667, 1, gameVars.showFinaleDeathSpeech ? 1800 : 1550, "Cubic.easeOut", () => {
            if (gameVars.showFinaleDeathSpeech) {
                gameVars.showFinaleDeathSpeech = false;

                globalObjects.bannerTextManager.setDialog([getLangText('deathFight1a'), getLangText('deathFight1b')]);
                globalObjects.bannerTextManager.setPosition(gameConsts.halfWidth, gameConsts.halfHeight + 10, 0);
                globalObjects.bannerTextManager.showBanner(0.5);
                globalObjects.bannerTextManager.setOnFinishFunc(() => {
                    this.beginFightReal();
                })
            } else {
                this.beginFightReal();
            }

        });
     }


     beginFightReal() {
         this.bgMusic = playMusic('heartbeat', 0.75, true);
         setTimeout(() => {
             fadeAwaySound(this.windSfx, 5000);
         }, 1000)
         globalObjects.magicCircle.enableMovement();
         this.setAwake();
         globalObjects.encyclopedia.showButton();
         globalObjects.options.showButton();
     }
/*
     deathBreathe() {
        if (this.flutterAnim) {
            this.flutterAnim.stop();
        }

        this.flutterAnim = PhaserScene.tweens.add({
            targets: this.floatingDeath2,
            alpha: this.floatingDeath2.fakeAlpha,
            duration: 500,
            ease: 'Cubic.easeIn',
            onComplete: () => {
                this.flutterAnim = PhaserScene.tweens.add({
                    targets: this.floatingDeath1,
                    alpha: 0,
                    duration: 500,
                    ease: 'Cubic.easeOut',
                    completeDelay: 700,
                    onComplete: () => {
                        this.floatingDeath2.setDepth(this.floatingDeath1.depth - 1);
                        this.flutterAnim = PhaserScene.tweens.add({
                            targets: this.floatingDeath1,
                            alpha: this.floatingDeath1.fakeAlpha,
                            duration: 500,
                            ease: 'Cubic.easeIn',
                            onComplete: () => {
                                this.flutterAnim = PhaserScene.tweens.add({
                                    targets: this.floatingDeath2,
                                    alpha: 0,
                                    duration: 500,
                                    ease: 'Cubic.easeOut',
                                    completeDelay: 700,
                                    onComplete: () => {
                                        this.floatingDeath2.setDepth(this.floatingDeath1.depth + 1);
                                        this.deathBreathe();
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });

     }
*/


     createScytheAttackSfxSmall(x, y) {
         let darkScreen = PhaserScene.add.image(gameConsts.halfWidth, gameConsts.halfHeight, 'blackPixel').setScale(500).setDepth(80).setAlpha(1)
         let flashPlain = getTempPoolObject('lowq', 'flashplain.webp', 'flashplain', 850);
         let extraRot = (x - gameConsts.halfWidth) * 0.01;
         flashPlain.setDepth(1002).setPosition(x, y).setAlpha(1.1).setScale(0.75, 0.75).setRotation(Math.PI * 0.5 + extraRot);

         PhaserScene.tweens.add({
             targets: [darkScreen],
             alpha: 0,
             duration: 600,
             ease: 'Quad.easeOut',
             onComplete: () => {
                 darkScreen.destroy();
             }
         });
         PhaserScene.tweens.add({
             targets: flashPlain,
             scaleX: 1.2,
             scaleY: 0.95,
             easeParams: [3],
             ease: 'Back.easeOut',
             duration: 100,
             onComplete: () => {
                 PhaserScene.tweens.add({
                     targets: flashPlain,
                     scaleX: 0,
                     scaleY: 0,
                     ease: 'Quint.easeIn',
                     duration: 450,
                 });
             }
         });
     }

     createScytheAttackSfx(flipped, isFast) {
         let darkScreen = PhaserScene.add.image(gameConsts.halfWidth, gameConsts.halfHeight, 'blackPixel').setScale(500).setDepth(980).setAlpha(isFast ? 0.95 : 1.1)
         if (!this.scytheBlur) {
             this.scytheBlur = PhaserScene.add.image(gameConsts.halfWidth, this.y + 125, 'blurry', 'scytheblur.png').setDepth(1002).setBlendMode(Phaser.BlendModes.LIGHTEN)
         }

         let flipScale = flipped ? -1 : 1;
         this.scytheBlur.setAlpha(1.1).setScale(flipScale, 1).setRotation(-0.15);
         PhaserScene.tweens.add({
             targets: [darkScreen],
             alpha: 0,
             duration: isFast ? 1200 : 1800,
             ease: 'Quad.easeOut',
             onComplete: () => {
                 darkScreen.destroy();
             }
         });
         PhaserScene.tweens.add({
             targets: [this.scytheBlur],
             alpha: 0,
             scaleX: 1.02*flipScale,
             scaleY: 1.01,
             ease: 'Cubic.easeOut',
             duration: isFast ? 700 : 900,
         });
     }

     adjustDamageTaken(amt, isAttack, isTrue = false) {
         if (isAttack) {
             this.timesAttacked++;
             if (this.timesAttacked === 1) {
                 messageBus.publish("showCombatText", getLangText('deathFightCombat1a'));
                 this.addTimeout(() => {
                     this.playerSpellCastSub = messageBus.subscribe('playerCastedSpell', () => {
                         this.spellsCastCounter++;
                         if (this.spellsCastCounter > 1) {
                             this.playerSpellCastSub.unsubscribe();
                             messageBus.publish("closeCombatText")
                         }
                     });
                     this.addTimeout(() => {
                         messageBus.publish("closeCombatText")
                     }, 3000);
                 }, 2000)
             } else if (this.timesAttacked === 7) {
                 messageBus.publish("showCombatText", getLangText('deathFightCombat1b'));
                 this.addTimeout(() => {
                     this.spellsCastCounter = 0;
                     this.playerSpellCastSub = messageBus.subscribe('playerCastedSpell', () => {
                         this.spellsCastCounter++;
                         if (this.spellsCastCounter > 2) {
                             this.playerSpellCastSub.unsubscribe();
                             messageBus.publish("closeCombatText")
                         }
                     });
                     this.addTimeout(() => {
                         messageBus.publish("closeCombatText")
                     }, 5000);
                 }, 4000)
             }
         }

         return super.adjustDamageTaken(amt, isAttack, isTrue);
     }

     setHealth(newHealth) {
        messageBus.publish('animateBlockNum', gameConsts.halfWidth, this.sprite.y + 50, 'IMMATERIAL', 0.8, {y: "+=5", ease: 'Quart.easeOut'}, {alpha: 0, scaleX: 1.1, scaleY: 1.1});



         // super.setHealth(newHealth);
         // let prevHealthPercent = this.prevHealth / this.healthMax;
         // let currHealthPercent = this.health / this.healthMax;
         // if (currHealthPercent == 0) {
         //     // dead, can't do anything
         //     return;
         // }
     }



     initAttacks() {
         this.attacks = [
             [
                 {
                     name: ";444",
                     chargeAmt: 800,
                     chargeMult: 1.5,
                     finishDelay: 3000,
                     damage: -1,
                     isBigMove: true,
                     attackStartFunction: () => {
                         // this.hideCurrentAttack();
                         this.timesAttacked = 5;
                         messageBus.publish("closeCombatText");
                         this.swingScythe(444, true, false, () => {
                             if (!globalObjects.player.dead) {
                                 this.setAsleep();
                                 super.setHealth(3);
                                 globalObjects.bannerTextManager.setDialog([getLangText('deathFight1c'), getLangText('deathFight1d')]);
                                 globalObjects.bannerTextManager.setPosition(gameConsts.halfWidth, gameConsts.halfHeight + 10, 0);
                                 globalObjects.bannerTextManager.showBanner(0.5);
                                 globalObjects.bannerTextManager.setOnFinishFunc(() => {
                                     this.interruptCurrentAttack();
                                     this.setAwake();
                                     fadeInSound(this.bgMusic, 0.85);
                                 });
                             }
                         })
                     },
                     startFunction: () => {
                     },
                     finaleFunction: () => {
                         this.timesAttacked = Math.max(0, this.timesAttacked - 5);
                     }
                 },
                 {
                     name: gameVars.isHardMode ? "}5x12}" : "}4x12}",
                     chargeAmt: 1350,
                     chargeMult: 1.3,
                     finishDelay: 5000,
                     damage: -1,
                     isBigMove: true,
                     startFunction: () => {
                         this.finishedChargingMulti = false;
                         tweenFloatingDeath(0.6, 0.1, 250, "Cubic.easeIn", () => {
                             setFloatingDeathVisible(false);
                             this.setDefaultSprite('max_death_1_cast.png', this.sprite.startScale);
                             this.sprite.setScale(this.sprite.startScale - 0.1);
                             this.addTween({
                                 targets: this.sprite,
                                 scaleX: this.sprite.startScale + 0.05,
                                 scaleY: this.sprite.startScale + 0.05,
                                 duration: 300,
                                 ease: 'Cubic.easeOut',
                                 onComplete: () => {
                                     this.sprite.currAnim = this.addTween({
                                         targets: this.sprite,
                                         y: "+=6",
                                         ease: 'Cubic.easeInOut',
                                         yoyo: true,
                                         repeat: 3,
                                         duration: 1000
                                     })
                                 }
                             })
                         })

                         this.startChargingMulti();
                     },
                     attackStartFunction: () => {
                         this.finishedChargingMulti = true;
                     },
                     attackFinishFunction: () => {
                         this.setAsleep();
                         this.timesAttacked = Math.max(0, this.timesAttacked - 5);

                         // this.hideCurrentAttack();
                         this.fireScytheObjects(gameVars.isHardMode ? 5 : 4, undefined, () => {
                             if (!globalObjects.player.dead) {
                                 super.setHealth(2);
                                 globalObjects.bannerTextManager.setDialog([getLangText('deathFight1f'), getLangText('deathFight1g')]);
                                 globalObjects.bannerTextManager.setPosition(gameConsts.halfWidth, gameConsts.halfHeight + 10, 0);
                                 globalObjects.bannerTextManager.showBanner(0.5);
                                 globalObjects.bannerTextManager.setOnFinishFunc(() => {
                                     this.interruptCurrentAttack();
                                     this.setAwake();
                                 });
                             }
                         });
                     },
                 },
                 {
                     name: ";20x5",
                     chargeAmt: 1300,
                     chargeMult: 1.35,
                     finishDelay: 5000,
                     damage: -1,
                     isBigMove: true,
                     attackStartFunction: () => {
                         // this.hideCurrentAttack();
                         this.swingScytheFastIntro(20, false, false,() => {
                             this.swingScytheFast(20, false, true,() => {
                                 this.swingScytheFast(20, false, false,() => {
                                     this.swingScytheFast(20, false, true,() => {
                                         this.swingScytheFast(20, false, false,() => {
                                             super.setHealth(1);
                                             PhaserScene.tweens.add({
                                                 targets: this.mainScythe,
                                                 alpha: 0,
                                                 ease: 'Quad.easeOut',
                                                 duration: 500,
                                             });
                                         })
                                     })
                                 })
                             })
                         })
                     },
                     finaleFunction: () => {
                         this.timesAttacked = Math.max(0, this.timesAttacked - 8);
                     }
                 },
                 {
                     name: ";88",
                     chargeAmt: 850,
                     chargeMult: 1.5,
                     finishDelay: 5000,
                     damage: -1,
                     isBigMove: true,
                     startFunction: () => {
                         this.listOfAngryPopups = [];

                         this.addDelay(() => {
                             this.nextAttack.chargeMult = 4.5;
                             let angryPopup = this.addSprite(this.x +8, this.y - 15, 'misc', 'angry1.png').play('angry').setScale(0.3);
                             this.listOfAngryPopups.push(angryPopup);
                             this.addTween({
                                 targets: angryPopup, scaleX: 2.5, scaleY: 2.5, rotation: 0.1,
                                 ease: 'Quart.easeOut', duration: 200,
                                 onComplete: () => {
                                     this.addTween({
                                         targets: angryPopup, scaleX: 0.75, scaleY: 0.75, rotation: 0.1, easeParams: [3],
                                         ease: 'Back.easeOut', duration: 300
                                     });
                                 }
                             });
                         }, 900)

                     },
                     attackStartFunction: () => {
                         this.scytheCanBreak = true;
                         this.swingScytheFastIntro(88, true, false, () => {
                             this.addTween({
                                 targets: this.listOfAngryPopups, scaleX: 0, scaleY: 0,
                                 ease: 'Back.easeIn', duration: 400,
                                 onComplete: () => {
                                     for (let i in this.listOfAngryPopups) {
                                         this.listOfAngryPopups[i].destroy();
                                     }
                                 }
                             });
                             this.addTween({
                                 targets: this.mainScythe,
                                 rotation: "+=0.7",
                                 ease: 'Quart.easeInOut',
                                 duration: 700,
                                 onComplete: () => {
                                     if (!globalObjects.player.dead) {
                                         super.setHealth(0);
                                         this.die();
                                     } else {
                                         this.addTween({
                                             targets: this.mainScythe,
                                             alpha: 0,
                                             duration: 1000
                                         })
                                     }
                                 }
                             })
                         })
                     },
                     finaleFunction: () => {
                     }
                 },
             ]
         ];
     }

     cleanUp() {
         console.log("cleanup?");
         super.cleanUp();
         if (this.windSfx) {
             this.windSfx.stop();
         }
         if (this.reaperHidden) {
            setFloatingDeathVisible(false);
         } else {
             clearReaper();
             clearDeathFog();
         }

     }

     die() {
         fadeAwaySound(this.bgMusic);
         globalObjects.encyclopedia.hideButton();
         globalObjects.options.hideButton();
         gameVars.latestLevel = this.level;
         localStorage.setItem("latestLevel", gameVars.latestLevel.toString());
         gameVars.maxLevel = Math.max(gameVars.maxLevel, this.level);
         localStorage.setItem("maxLevel", gameVars.maxLevel.toString());

         PhaserScene.tweens.add({
            targets: this.mainScythe,
            alpha: 1,
            scaleX: 0.7,
            scaleY: 0.7,
            rotation: -0.4,
            x: gameConsts.halfWidth + 170,
            y: this.y + 310,
            duration: 1500,
            ease: 'Cubic.easeInOut',
            completeDelay: 700,
            onComplete: () => {
                super.die();
                globalObjects.magicCircle.disableMovement();
                PhaserScene.tweens.add({
                    targets: this.mainScythe,
                    rotation: -0.55,
                    y: this.y + 320,
                    duration: 600,
                    ease: 'Cubic.easeInOut',
                    onComplete: () => {
                        globalObjects.floatingDeath.flutterAnim.stop();
                        tweenFloatingDeath(0.65, 0, 400, "Cubic.easeIn", () => {
                            stopDeathFlutterAnim();
                            setFloatingDeathVisible(false);
                        })
                        this.flashCover = this.addImage(this.sprite.x, this.sprite.y + 80, 'blurry', 'flash_bg.webp').setScale(0.1, 0.15).setRotation(Math.PI * 0.5).setDepth(91);

                        this.setDefaultSprite('max_death_1b_angry.png');
                        this.sprite.setAlpha(0).setDepth(92);
                        this.addTween({
                            targets: this.sprite,
                            alpha: 1,
                            duration: 400,
                            ease: 'Quad.easeIn',
                        })
                        globalObjects.bannerTextManager.setDialog([getLangText('deathFight1h'), getLangText('deathFight1i')]);
                        globalObjects.bannerTextManager.setDialogFunc([undefined, () => {
                            PhaserScene.tweens.add({
                                targets: this.mainScythe,
                                rotation: "-=0.3",
                                duration: 500,
                                ease: 'Cubic.easeInOut',
                                onComplete: () => {
                                    PhaserScene.tweens.add({
                                        targets: this.mainScythe,
                                        rotation: "+=0.4",
                                        ease: 'Cubic.easeIn',
                                        duration: 150,
                                        onComplete: () => {
                                            this.addTimeout(() => {
                                                playSound('clunk').pan = 0.4;
                                            }, 500);
                                            PhaserScene.tweens.add({
                                                targets: this.mainScythe,
                                                rotation: "+=10",
                                                x: "+=900",
                                                duration: 1000,
                                                onComplete: () => {
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        }]);
                        globalObjects.bannerTextManager.setPosition(gameConsts.halfWidth, gameConsts.halfHeight + 10, 0);
                        globalObjects.bannerTextManager.showBanner(0.5);
                        globalObjects.bannerTextManager.setOnFinishFunc(() => {
                            this.reaperHidden = true;
                            clearDeathFog();
                            this.darkOverlay = this.addImage(gameConsts.halfWidth,gameConsts.halfHeight, 'blackPixel').setScale(500).setAlpha(0).setDepth(90);
                            this.whiteDeath = this.addImage(this.sprite.x, this.sprite.y + 0.5, 'enemies', 'max_death_1b_angry_white.png').setScale(this.sprite.scaleX).setAlpha(0).setDepth(92).setOrigin(0.5, 0.45);
                            playSound('whoosh');
                            this.addTween({
                                targets: [this.sprite, this.whiteDeath],
                                scaleX: 0.38,
                                scaleY: 0.38,
                                y: "+=12",
                                ease: 'Cubic.easeInOut',
                                duration: 2750,
                                onComplete: () => {
                                    this.sprite.alpha = 0;
                                    setFloatingDeathVisible(false);
                                }
                            })
                            this.addTween({
                                targets: [this.flashCover],
                                scaleX: 3.7,
                                scaleY: 5.4,
                                alpha: 1,
                                ease: 'Cubic.easeIn',
                                duration: 2800,
                                onComplete: () => {
                                    this.addTween({
                                        targets: [this.flashCover],
                                        scaleX: 3,
                                        scaleY: 4.5,
                                        alpha: 0,
                                        ease: 'Cubic.easeOut',
                                        duration: 2100,
                                        onComplete: () => {
                                            this.flashCover.destroy();
                                        }
                                    })
                                }
                            })

                            this.addTween({
                                targets: [this.darkOverlay, this.whiteDeath],
                                alpha: 1,
                                duration: 2800,
                                onComplete: () => {
                                    playSound('deep_swish');
                                    this.whiteDeath.destroy();
                                    this.muscleDeathWhite = this.addImage(this.sprite.x, 82, 'deathfinal', 'max_death_2_white.png').setScale(0.46, 0.45).setDepth(90).setOrigin(0.5, 0.2);
                                    this.addTween({
                                        targets: this.muscleDeathWhite,
                                        scaleX: 0.56,
                                        scaleY: 0.57,
                                        y: 55,
                                        ease: 'Cubic.easeInOut',
                                        duration: 1100,
                                        onComplete: () => {
                                            this.addTween({
                                                targets: this.muscleDeathWhite,
                                                scaleX: 0.95,
                                                scaleY: 0.95,
                                                y: 90,
                                                ease: 'Quint.easeIn',
                                                duration: 700,
                                                onComplete: () => {
                                                    playSound('stomp');
                                                    screenShake(2);
                                                    this.darkOverlay.destroy();
                                                    this.beginDeath2();
                                                }
                                            })
                                        }
                                    })
                                    // this.whiteOverlay = this.addImage(gameConsts.halfWidth,gameConsts.halfHeight, 'whitePixel').setScale(500).setAlpha(0).setDepth(99999);

                                }
                            })
                        });
                    }
                })
            }

        })
     }

     fireScytheObjects(damage = 5, interval = 120, onComplete) {
         let totalScytheObjects = this.scytheObjects.length;
         let projDur = 600 - Math.floor(Math.sqrt(totalScytheObjects) * 50);
         let scytheObjectsFired = 0;
         while (this.scytheObjects.length > 0) {
             let currObj = this.scytheObjects.pop();
             currObj.rotTween.stop();
             let currObj2 = this.scytheObjects.pop();
             currObj2.rotTween.stop();
             let isLastObj = this.scytheObjects.length === 0;

             let delayAmt = scytheObjectsFired * interval;
             scytheObjectsFired++;
             if (isLastObj) {
                 this.tweenFireScythe(currObj, damage, projDur, delayAmt, this.scytheObjects.length, true)
                 this.tweenFireScythe(currObj2, damage, projDur, delayAmt, this.scytheObjects.length, false, onComplete)
             } else {
                 this.tweenFireScythe(currObj, damage, projDur, delayAmt, this.scytheObjects.length, true)
                 this.tweenFireScythe(currObj2, damage, projDur, delayAmt, this.scytheObjects.length, false)
             }
         }
     }

     tweenFireScythe(currObj, damage, projDur, delayAmt, currScytheObjCount, hasSfx, onComplete) {
         this.addTween({
             targets: currObj,
             delay: delayAmt,
             y: globalObjects.player.getY() - 175 + Math.random() * 10,
             ease: 'Quad.easeIn',
             duration: projDur,
             rotation: (Math.random() - 0.5) * 3,
             onStart: () => {
                 currObj.setDepth(150);
             },
             onComplete: () => {
                 if (onComplete) {
                     setTimeout(() => {
                         onComplete();
                     }, 1500)
                 }
                 let hitEffect = getTempPoolObject('lowq', 'sharpflashred.webp', 'sharpflashred', 400);
                 hitEffect.setPosition(currObj.x + 10 - Math.random() * 20, currObj.y - 10 - Math.random() * 15).setDepth(195).setScale(0.25, 0.1).setVisible(true);
                 hitEffect.setRotation((currObj.x - gameConsts.halfWidth) * 0.01);
                 let extraScale = Math.random() * 0.45;
                 this.addTween({
                     targets: hitEffect,
                     scaleX: 0.35 + extraScale,
                     scaleY: 0.4 + extraScale * 1.2,
                     ease: 'Quart.easeIn',
                     duration: 150,
                     onComplete: () => {
                         this.addTween({
                             targets: hitEffect,
                             scaleX: 0,
                             scaleY: 0.05,
                             ease: 'Quad.easeOut',
                             duration: 200,
                             onComplete: () => {
                                 hitEffect.setVisible(false);
                             }
                         });
                     }
                 });
                 if (hasSfx) {
                     if (currScytheObjCount % 3 == 0) {
                         screenShake(2);
                     }
                     if (currScytheObjCount % 12 == 0) {
                         messageBus.publish('showCircleShadow', 0.6, -100, 985);
                         messageBus.publish('tempPause', 200, 0.05);

                         playSound('death_attack', 0.4).detune = 1200;
                        this.createScytheAttackSfxSmall(currObj.x, currObj.y - 20);
                     } else {
                         playSound('sword_slice').detune = 400 - Math.floor(Math.random() * 800)
                     }
                 }
                 messageBus.publish("selfTakeDamage", damage);
                 currObj.destroy();

             }
         });
         this.addTween({
             targets: currObj,
             delay: delayAmt,
             x: gameConsts.halfWidth * 0.92 + currObj.x * 0.15,
             rotation: "-=4",
             easeParams: [3],
             duration: projDur
         });
     }

     startChargingMulti() {
         let scytheMultCount = 12;
         for (let i = 0; i < scytheMultCount*3; i++) {
             let startX = this.x;
             let startY = this.y + 100;
             let multAmt = 120;
             let angleIdx = i;
             if (i < scytheMultCount) {
                 multAmt = 120;
             } else if (i < scytheMultCount*2) {
                 angleIdx -=12;
                 multAmt = 180;
             } else if (i < scytheMultCount*3) {
                 angleIdx -=scytheMultCount*2;
                 multAmt = 240;
             }
             let dirAngle = -Math.PI / 4 + angleIdx * Math.PI / (scytheMultCount * 2) + Math.PI * 0.5;
             let offsetX = Math.sin(dirAngle) * multAmt;
             let offsetY = -Math.cos(dirAngle) * multAmt;
             if (i % 2 == 0) {
                 // right

             } else {
                 offsetX = -offsetX;
                 // left
             }

             let xPos = startX + offsetX; let yPos = startY + offsetY;
             let scytheObj = this.addImage(xPos, yPos, 'misc', "miniscythe.png").setScale(0).setDepth(-2);
             scytheObj.setScale(0).setRotation((Math.PI / 18) * i);
             this.scytheObjects.push(scytheObj);
            scytheObj.rotTween = this.addTween({
                targets: scytheObj,
                rotation: "-=6.281",
                duration: 10000,
                repeat: -1
            })
         }
         let firstThird = [];
         let secondThird = [];
         let thirdThird = [];
         for (let j = 0; j < scytheMultCount; j++) {
             let currScythe = this.scytheObjects[j];
            firstThird.push(currScythe);
         }
         for (let k = scytheMultCount; k < scytheMultCount*2; k++) {
             let currScythe = this.scytheObjects[k];
             secondThird.push(currScythe);
         }
         for (let l = scytheMultCount*2; l < scytheMultCount*3; l++) {
             let currScythe = this.scytheObjects[l];
             thirdThird.push(currScythe);
         }
         this.addTween({
             delay: 100,
             duration: 450,
             targets: firstThird,
             scaleX: 1,
             scaleY: 1,
             ease: 'Quart.easeOut',
             onStart: () => {
                 if (!this.finishedChargingMulti) {
                     playSound('enemy_attack');
                     // this.sprite.setScale(this.sprite.startScale * 1.05);
                     // this.sprite.setRotation(0.1);
                     this.attackName.setText(gameVars.isHardMode ? "}}}5x12}}}" : "}}}4x12}}}");
                     this.repositionAngrySymbol();
                 }
             },
             onComplete: () => {
                 this.addTween({
                     duration: 300,
                     targets: firstThird,
                     scaleX: 0.6,
                     scaleY: 0.6,
                     ease: 'Back.easeOut',
                     onComplete: () => {

                     }
                 })
             }
         })

         this.addTween({
             delay: 1300,
             duration: 450,
             targets: secondThird,
             scaleX: 1.1,
             scaleY: 1.1,
             ease: 'Quart.easeOut',
             onStart: () => {
                 if (!this.finishedChargingMulti) {
                     playSound('enemy_attack_2');
                     // this.sprite.setScale(this.sprite.startScale * 1.05);
                     // this.sprite.setRotation(0.1);
                     this.attackName.setText(gameVars.isHardMode ? "|||5x24|||" : "|||4x24|||");
                     this.repositionAngrySymbol();
                 }
             },
             onComplete: () => {
                 this.addTween({
                     duration: 300,
                     targets: secondThird,
                     scaleX: 0.64,
                     scaleY: 0.64,
                     ease: 'Back.easeOut',
                 })
             }
         })
         this.addTween({
             delay: 2600,
             duration: 450,
             targets: thirdThird,
             scaleX: 1.2,
             scaleY: 1.2,
             ease: 'Quart.easeOut',
             onStart: () => {
                 if (!this.finishedChargingMulti) {
                     playSound('enemy_attack_major');
                     // this.sprite.setScale(this.sprite.startScale * 1.05);
                     // this.sprite.setRotation(0.1);
                     this.attackName.setText(gameVars.isHardMode ? ";;;5x36;;;" : ";;;4x36;;;");
                     this.repositionAngrySymbol();
                 }
             },
             onComplete: () => {
                 this.addTween({
                     duration: 300,
                     targets: thirdThird,
                     scaleX: 0.68,
                     scaleY: 0.68,
                     ease: 'Back.easeOut',
                     onComplete: () => {
                         if (this.sprite.currAnim) {
                             this.sprite.currAnim.stop();
                         }
                         this.addTween({
                             targets: this.sprite,
                             scaleX: this.sprite.startScale - 0.03,
                             scaleY: this.sprite.startScale - 0.03,
                             duration: 300,
                             ease: 'Cubic.easeIn',
                             onComplete: () => {
                                 this.setDefaultSprite('blank.png', this.sprite.startScale, true);
                             }
                         })
                         tweenFloatingDeath(0.667, 0, 25, "Cubic.easeOut", () => {
                             setFloatingDeathVisible(true);
                             tweenFloatingDeath(0.667, 1, 300, "Cubic.easeIn", () => {

                             })
                         })
                     }
                 })
             }
         })
     }

     swingScytheFastIntro(damage = 444, fadeOutScythe = true, flipped = false, onComplete) {
         this.mainScythe.setPosition(this.x, 160).setDepth(999).setAlpha(0).setScale(0.65, 0.65).setRotation(-1.5);
         let scythe = this.mainScythe;
         scythe.play('scytheFlash');
         PhaserScene.tweens.add({
             targets: scythe,
             alpha: 1,
             duration: 350
         })

         PhaserScene.time.delayedCall(780, () => {
             if (globalObjects.deathLeftHand.currAnim) {
                 globalObjects.deathLeftHand.currAnim.stop();
                 globalObjects.deathRightHand.currAnim.stop();
             }
             tweenObjectRotationTo(globalObjects.deathLeftHand, -0.2, 500, "Cubic.easeOut");
             tweenObjectRotationTo(globalObjects.deathRightHand, 0.1, 500, "Cubic.easeOut");
         })
         PhaserScene.tweens.add({
             targets: scythe,
             scaleX: 0.8,
             scaleY: 0.8,
             y: 90,
             ease: 'Cubic.easeInOut',
             duration: 800,
         });
         PhaserScene.tweens.add({
             targets: scythe,
             rotation: -0.75,
             x: gameConsts.halfWidth + 5,
             y: 100,
             ease: 'Quart.easeInOut',
             duration: 800,
             completeDelay: 50,
             onComplete: () => {
                 scythe.play('scytheReap');
                 PhaserScene.tweens.add({
                     targets: scythe,
                     rotation: "-=1.5",
                     ease: 'Quint.easeIn',
                     duration: 100,
                     onComplete: () => {
                         setTimeout(() => {
                             playSound('death_attack').detune = 0;
                             messageBus.publish("selfTakeDamage", damage);
                             messageBus.publish('showCircleShadow', 0.8, undefined, 985);
                             messageBus.publish('tempPause', this.scytheCanBreak ? 600 : 300, 0.02);
                             screenShake(this.scytheCanBreak ? 1 : 10);
                             if (this.scytheCanBreak) {
                                 this.addDelay(() => {
                                     scythe.stop();
                                     scythe.setFrame('scythebroke.png')
                                     playSound('clunk2')
                                 }, 100)
                             }
                         }, this.scytheCanBreak ? 65 : 80);
                         this.createScytheAttackSfx(false, true);
                         PhaserScene.tweens.add({
                             targets: scythe,
                             scaleX: 1.35,
                             scaleY: 1.35,
                             ease: 'Quart.easeOut',
                             duration: 150,
                             onComplete: () => {
                                 PhaserScene.tweens.add({
                                     targets: scythe,
                                     scaleX: 0.9,
                                     scaleY: 0.9,
                                     ease: 'Cubic.easeIn',
                                     duration: 200,
                                 })
                             }
                         })
                         let rotAmt = -1.8;
                         PhaserScene.tweens.add({
                             targets: scythe,
                             rotation: "+=" + rotAmt,
                             x: flipped ? "+=10" : "-=10",
                             duration: 250,
                             onComplete: () => {
                                 //repeatDeathHandsRotate();
                                 if (onComplete) {
                                     onComplete();
                                 }
                             }
                         });
                     }
                 });
             }
         });
     }

     swingScytheFast(damage = 4444, fadeOutScythe = true, flipped = false, onComplete) {

         let flipMult = flipped ? -1 : 1;
         let scythe = this.mainScythe;
         PhaserScene.tweens.add({
             targets: scythe,
             alpha: 1,
             duration: 350
         })
         PhaserScene.time.delayedCall(720, () => {
             if (globalObjects.deathLeftHand.currAnim) {
                 globalObjects.deathLeftHand.currAnim.stop();
                 globalObjects.deathRightHand.currAnim.stop();
             }
             tweenObjectRotationTo(globalObjects.deathLeftHand, -0.2, 500, "Cubic.easeOut");
             tweenObjectRotationTo(globalObjects.deathRightHand, 0.1, 500, "Cubic.easeOut");
         })
         PhaserScene.tweens.add({
             targets: scythe,
             alpha: 0,
             ease: 'Quad.easeOut',
             duration: 150,
             onComplete: () => {
                 PhaserScene.tweens.add({
                     delay: 150,
                     targets: scythe,
                     alpha: 1,
                     ease: 'Quad.easeIn',
                     duration: 250,

                 });
             }
         });
         PhaserScene.tweens.add({
             targets: scythe,
             scaleX: 0.8 * flipMult,
             scaleY: 0.8,
             y: 90,
             ease: 'Quart.easeInOut',
             duration: 550,
         });
         PhaserScene.tweens.add({
             targets: scythe,
             rotation: -0.75 * flipMult,
             x: gameConsts.halfWidth + 5 * flipMult,
             ease: 'Quart.easeOut',
             duration: 700,
             completeDelay: 50,
             onComplete: () => {
                 scythe.play('scytheReap');
                 PhaserScene.tweens.add({
                     targets: scythe,
                     rotation: flipped ? "+=1.5" : "-=1.5",
                     ease: 'Quint.easeIn',
                     duration: 100,
                     onComplete: () => {
                         setTimeout(() => {
                             playSound('death_attack').detune = 0;
                             messageBus.publish("selfTakeDamage", damage);
                             messageBus.publish('showCircleShadow', 0.7, -150, 985);
                             messageBus.publish('tempPause', 250, 0.035);
                             screenShake(8 * flipMult);
                         }, 80);
                         this.createScytheAttackSfx(flipped, true);
                         PhaserScene.tweens.add({
                             targets: scythe,
                             scaleX: 1.35 * flipMult,
                             scaleY: 1.35,
                             ease: 'Quart.easeOut',
                             duration: 100,
                             onComplete: () => {
                                 PhaserScene.tweens.add({
                                     targets: scythe,
                                     scaleX: 0.9 * flipMult,
                                     scaleY: 0.9,
                                     ease: 'Cubic.easeIn',
                                     duration: 200,
                                 })
                             }
                         })
                         let rotAmt = -1.8 * flipMult;
                         PhaserScene.tweens.add({
                             targets: scythe,
                             rotation: "+=" + rotAmt,
                             x: flipped ? "+=10" : "-=10",
                             duration: 250,
                             onComplete: () => {
                                 repeatDeathHandsRotate();
                                 if (onComplete) {
                                     onComplete();
                                 }
                             }
                         });
                     }
                 });
             }
         });

     }

     beginDeath2() {
         beginLevel(12, true)
        // createEnemy()
        this.destroy();
     }
     destroy() {
         super.destroy();
         if (this.playerSpellCastSub) {
             this.playerSpellCastSub.unsubscribe();
         }
     }
}
