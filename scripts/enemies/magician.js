 class Magician extends Enemy {
    constructor(scene, x, y, level) {
        super(scene, x, y, level);
        this.initSprite('time_magi.png', 1, 0, 5);
        this.popupTimeout = this.addTimeout(() => {
            this.tutorialButton = createTutorialBtn(this.level);
            this.addToDestructibles(this.tutorialButton);
        }, 2500)
        this.addTimeout(() => {
            if (!this.isDestroyed) {
                this.customBgMusic = playMusic('magician_theme_1', 0.95, true);
            }
        }, 1500)


        this.addSubscription('reapedEnemyGong', () => {
            this.zoomAwayClocks();
        });

        this.sprite.startY = this.sprite.y;
        this.repeatTweenBreathe();
    }

     initStatsCustom() {
         this.health = gameVars.isHardMode ? 120 : 100;
         this.damageNumOffset = 45;
         this.chargeBarOffsetY = 4;
         this.damageNumOffsetDefault = this.damageNumOffset;
         this.lifeOne = true;
         this.timeObjects = [];
         this.numTimesHealed = 0;
         this.pullbackScale = 0.8;
         this.initTemporalObjects();
     }

     takeEffect(newEffect) {
         if (this.sprite) {
             if (newEffect.name == 'mindStrike' && this.lifeOne && !this.dead && !this.isBeingFlattened) {
                 this.sprite.stop();
                 this.isBeingShocked = true;
                 this.setSprite('time_magi_shock1.png');
                 this.addDelay(() => {
                     this.sprite.setFrame('time_magi_shock2.png');
                     this.addDelay(() => {
                         this.setSpriteIfNotInactive(this.defaultSprite);
                         this.isBeingShocked = false;
                     }, 100);
                 }, 100);
             }
         }
         super.takeEffect(newEffect)
     }

     setHealth(newHealth) {
         let lastHealthLost = this.health - newHealth;
         let canFlatten = false;
         if (this.lifeOne && lastHealthLost >= 32) {
             canFlatten = true;
             this.damageNumOffset = -44;
         }
         super.setHealth(newHealth);
         if (this.invulnHealthBar) {
             this.healthBarText.setText("INVINCIBLE");
         }
        // if (this.invincible) {
        //     messageBus.publish('animateBlockNum', gameConsts.halfWidth + 75 - Math.random()*150, this.sprite.y + 50 - Math.random() * 100, 'DELAYED', 0.75);
        //     return;
        // }
         let prevHealthPercent = this.prevHealth / this.healthMax;
         let currHealthPercent = this.health / this.healthMax;
         if (this.health === 0) {
             // dead, can't do anything
             return;
         }
         if (canFlatten) {
             this.isBeingFlattened = true;
             if (!this.bonk) {
                 this.bonk = this.addImage(this.x, this.y - 80, 'enemies', 'bonk.png');
             }
             this.bonk.setScale(0.7);
             this.addTween({
                 targets: this.bonk,
                 scaleX: 1.08,
                 scaleY: 1.08,
                 ease: 'Back.easeOut',
                 duration: 300,
                 onComplete: () => {
                     this.addTween({
                         delay: 700,
                         targets: this.bonk,
                         scaleX: 0,
                         scaleY: 0,
                         ease: 'Cubic.easeIn',
                         duration: 250,
                     })
                 }
             })
             this.forceOverrideSprite = 'time_magi_flattened.png';
             this.setSprite('time_magi_flattened.png');
             playSound('derp', 0.3).detune = -500;
             playSound('punch2', 0.65);
             this.addTween({
                 targets: this.sprite,
                 delay: 1200,
                 duration: 700,
                 scaleX: 0.95,
                 scaleY: 1.14,
                 onComplete: () => {
                     this.sprite.scaleX = 1;
                     this.sprite.scaleY = 1.04;
                     this.forceOverrideSprite = null;
                     this.damageNumOffset = this.damageNumOffsetDefault;
                     this.setSprite(this.defaultSprite);
                     this.addTween({
                         targets: this.sprite,
                         duration: 150,
                         scaleY: 1.1,
                         ease: 'Quart.easeOut',
                         onComplete: () => {
                             this.isBeingFlattened = false;

                             this.addTween({
                                 targets: this.sprite,
                                 duration: 250,
                                 scaleY: 1,
                                 ease: 'Back.easeOut',
                             });
                         }
                     })
                 }
             })
         }

         // if (!this.isNervous && this.statuses[0] && this.statuses[0].duration >= this.health) {
         //     this.isNervous = true;
         //     this.setDefaultSprite('time_magi_nervous.png', 1);
         // }
         // if (this.usingTimeFreeze) {
         //     // no change
         // } else if (currHealthPercent < 0.999 && !this.preppingTimeShield) {
         //     this.currentAttackSetIndex = 1;
         //     this.nextAttackIndex = 0;
         // } else if (this.health <= 13 && this.usedTimeShield && !this.isTerrified && this.statuses[0] && this.statuses[0].duration >= this.health) {
         //     this.isTerrified = true;
         //     this.interruptCurrentAttack();
         //     this.currentAttackSetIndex = 6;
         //     this.nextAttackIndex = 0;
         //     this.startReaper();
         //     if (this.customBgMusic) {
         //         fadeAwaySound(this.customBgMusic, 1000, '');
         //     }
         //     this.addTimeout(() => {
         //         if (!this.dead) {
         //             this.customBgMusic = playMusic('magician_theme_4', 0.4, true);
         //             fadeInSound(this.customBgMusic, 0.8);
         //         }
         //     }, 750)
         // } else if (this.health <= 4 && !this.timeTerrified && this.usedTimeShield) {
         //     this.timeTerrified = true;
         //     this.setDefaultSprite('time_magi_terrified.png', 0.95);
         // }

     }

     cleanUp(spareDeath) {
        if (this.cleanedUp) {
            return;
        }
         if (this.breatheTween) {
             this.breatheTween.stop();
         }
        this.cleanedUp = true;
         if (this.floatingDeathAnim) {
             this.floatingDeathAnim.stop().destroy();
             this.addTween({
                 targets: this.blackBackground,
                 alpha: 0,
                 duration: 3000,
                 onComplete: () => {
                     this.blackBackground.destroy();
                 }
             });
         }
         if (this.magicianTimeEpicTheme) {
             this.magicianTimeEpicTheme.stop();
         }
         globalObjects.magicCircle.cancelTimeSlow();

         if (this.clockShield) {
            if (this.clockShield.hitTween) {
                this.clockShield.hitTween.stop();
            }
            if (this.clockShield.currAnim) {
                this.clockShield.currAnim.stop();
            }
             this.clockShield.alpha += 0.15;
             this.addTween({
                 targets: this.clockShield,
                 scaleX: 1.2,
                 scaleY: 1.2,
                 alpha: 0,
                 duration: 300,
                 ease: 'Cubic.easeOut',
                 onComplete: () => {
                     this.clockShield.destroy();
                 }
             });
         }
         if (this.statuses[0]) {
             this.statuses[0].cleanUp();
         }

         this.addTween({
             targets: this.timeObjects,
             scaleX: 0,
             scaleY: 0,
             duration: 300,
             rotation: "+=3",
             onComplete: () => {
                 for (let i = 0; i < this.timeObjects.length; i++) {
                     this.timeObjects[i].destroy();
                 }
                 this.timeObjects = [];
             }
         });
     }

     zoomAwayClocks() {
        this.addTween({
            targets: this.timeFallObjs,
            scaleX: 0,
            scaleY: 0,
            duration: 600,
            ease: 'Quad.easeOut',
            rotation: "+=3"
        });
     }

     manaulClearTimeObjects() {
         while (this.timeObjects.length > 0) {
             let currObj = this.timeObjects.shift();
             this.addTween({
                 targets: currObj,
                 scaleX: 0,
                 scaleY: 0,
                 ease: 'Back.easeIn',
                 duration: 600,
                 onComplete: () => {
                     currObj.destroy();
                 }
             })
         }
     }

     die() {
         if (this.dead || this.invincible) {
             return;
         }
         this.forceOverrideSprite = null;

        if (this.currAnim) {
            this.currAnim.stop();
        }
        if (this.playerSpellCastSub) {
            this.playerSpellCastSub.unsubscribe();
            this.playerSpellCastSub = null;
        }
        messageBus.publish("closeCombatText");
        globalObjects.magicCircle.cancelTimeSlow();
        if (this.lifeOne) {
            this.manaulClearTimeObjects();
            this.interruptCurrentAttack();
            this.setAsleep();
            playSound('time_hard');

            this.invincible = true;
            this.lifeOne = false;
            this.customBgMusic.stop();
             this.setDefaultSprite('time_magi_fade.png', 1);
             this.sprite.setRotation(-0.5);
             for (let i = 0; i < 5; i++) {
                let textIndex = i * 2;
                let text = 'temporal' + textIndex + ".png";
                let tempClock = this.addImage(this.x, this.y, 'lowq', text).setScale(0.6).setRotation(Math.random() * 6).setAlpha(0.6);
                let randScale = 0.95 + Math.random() * 0.25;
                let randDur1 = 150 + Math.floor(Math.random() * 100);
                let randDur2Bonus = Math.floor(Math.random() * 200);
                let randDur2 = 1500 + randDur2Bonus;
                let totalDur = randDur1 + randDur2;
                let randRot = "+=" + 6 * (Math.random() < 0.5 ? 1 : -1)
                this.addTween({
                    targets: tempClock,
                    scaleX: randScale,
                    scaleY: randScale,
                    duration: randDur1,
                    ease: 'Cubic.easeOut',
                    onComplete: () => {
                        this.addTween({
                            targets: tempClock,
                            scaleX: 0,
                            scaleY: 0,
                            duration: randDur2,
                        });
                    }
                });
                this.addTween({
                    targets: tempClock,
                    rotation: randRot,
                    duration: totalDur,
                    ease: 'Quad.easeOut',
                });

                let randDir = Math.random() * 12.5;
                let xDir = (150 + randDur2Bonus * 0.2) * Math.sin(randDir);
                let yDir = (150 + randDur2Bonus * 0.2) * Math.cos(randDir);
                this.addTween({
                    targets: tempClock,
                    x: "+=" + xDir,
                    y: "+=" + yDir,
                    duration: totalDur,
                    ease: 'Cubic.easeOut',
                    onComplete: () => {
                        tempClock.destroy();
                    }
                });
             }
            this.addTimeout(() => {
                this.revive();
            }, 2400)
        } else {
            super.die();

            globalObjects.encyclopedia.hideButton();
            globalObjects.options.hideButton();
            this.cleanUp();
             this.showVictory();

             this.setDefaultSprite('time_magi_terrified.png', 0.98);

             this.dieClickBlocker = new Button({
                 normal: {
                     ref: "blackPixel",
                     x: gameConsts.halfWidth,
                     y: gameConsts.halfHeight,
                     alpha: 0.001,
                     scaleX: 1000,
                     scaleY: 1000
                 },
                 onMouseUp: () => {

                 }
             });
        }
     }

     destroy() {
        super.destroy();
        if (this.customBgMusic) {
            this.customBgMusic.stop();
        }

         if (this.playerSpellCastSub) {
             this.playerSpellCastSub.unsubscribe();
             this.playerSpellCastSub = null;
         }
     }

     showRune() {
         let rune = PhaserScene.add.image(this.x, this.y - 45, 'tutorial', 'rune_time_large.png').setOrigin(0.5, 0.5).setScale(0.5).setDepth(9999);
         playSound('victory_2');
         this.showFlash(this.x, this.y);
         let banner = PhaserScene.add.image(gameConsts.halfWidth, gameConsts.halfHeight - 35, 'misc', 'victory_banner.png').setScale(100, 1.2).setDepth(9998).setAlpha(0);
         let victoryText = PhaserScene.add.image(gameConsts.halfWidth, gameConsts.halfHeight - 44, 'misc', 'victory_text.png').setScale(0.95).setDepth(9998).setAlpha(0);
         let continueText = PhaserScene.add.text(gameConsts.halfWidth, gameConsts.halfHeight + 2, getLangText('cont_ui'), {fontFamily: 'garamondmax', color: '#F0F0F0', fontSize: 18}).setAlpha(0).setOrigin(0.5, 0.5).setAlign('right').setDepth(9998);

         PhaserScene.tweens.add({
             targets: rune,
             x: gameConsts.halfWidth,
             scaleX: 1,
             scaleY: 1,
             ease: "Cubic.easeOut",
             duration: 1500,
         });

         PhaserScene.tweens.add({
             targets: banner,
             alpha: 0.75,
             duration: 500,
         });

         PhaserScene.tweens.add({
             targets: [victoryText],
             alpha: 1,
             ease: 'Quad.easeOut',
             duration: 500,
         });
         playSound('victory');
         setTimeout(() => {
             continueText.alpha = 1;
         }, 1000);
         PhaserScene.tweens.add({
             targets: victoryText,
             scaleX: 1,
             scaleY: 1,
             duration: 800,
         });

         // KEEP THIS TWEEN
         PhaserScene.tweens.add({
             targets: rune,
             y: gameConsts.halfHeight - 110,
             ease: 'Cubic.easeOut',
             duration: 500,
             onComplete: () => {
                 if (canvas) {
                     canvas.style.cursor = 'pointer';
                 }
                 this.dieClickBlocker.setOnMouseUpFunc(() => {
                     if (canvas) {
                         canvas.style.cursor = 'default';
                     }
                     this.dieClickBlocker.destroy();
                     PhaserScene.tweens.add({
                         targets: [victoryText, banner],
                         alpha: 0,
                         duration: 400,
                         onComplete: () => {
                             victoryText.destroy();
                             banner.destroy();
                             continueText.destroy();
                         }
                     });
                     PhaserScene.tweens.add({
                         targets: rune,
                         y: "+=90",
                         ease: 'Quad.easeOut',
                         duration: 400,
                         onComplete: () => {
                             rune.destroy();
                             setTimeout(() => {
                                 globalObjects.magicCircle.enableMovement();
                                 globalObjects.postFightScreen.createWinScreen(this.level);
                             }, 50)
                         }
                     });
                     PhaserScene.tweens.add({
                         targets: rune,
                         alpha: 0,
                         duration: 400,
                     });
                 })
             }
         });
    }

     showVictory() {
        globalObjects.magicCircle.disableMovement();
        swirlInReaperFog();
        setTimeout(() => {
            playReaperDialog([getLangText('magician_death')], [], () => {
                 PhaserScene.tweens.add({
                     targets: this.timeFallObjs,
                     duration: 1000,
                 });
                globalObjects.reapSound = 'magician_end';
                playReaperAnim(this, () => {
                    setTimeout(() => {
                        this.showRune();
                    }, 900);
                }, false);
            });
        }, 500);
     }

     startReaper() {
        this.blackBackground = this.addSprite(gameConsts.halfWidth, gameConsts.halfHeight, 'blackPixel').setScale(500).setAlpha(0).setDepth(-1)
         this.floatingDeath = getFloatingDeath();
         this.floatingDeath.alpha = 0;
         globalObjects.floatingDeath2.alpha = 0;
         globalObjects.deathLeftHand.alpha = 0;
         globalObjects.deathRightHand.alpha = 0;
         gameVars.deathFlutterDelay = 600;
        setFloatingDeathScale(0.35)

        tweenFloatingDeath(0.71, 0.75, 16000, "Quad.easeInOut");

         this.floatingDeathAnim = this.addTween({
             targets: this.floatingDeath,
             duration: 16000,
             alpha: 0.75,
             scaleX: 0.7,
             scaleY: 0.7,
             ease: 'Quad.easeInOut',
         });
         this.addTween({
             targets: this.blackBackground,
             duration: 16000,
             alpha: 0.7,
             ease: 'Quad.easeOut',
         });
     }

    tickTimeShield() {
        if (this.dead || this.exhausted) {
            return;
        }
         this.clockShield.currAnim = this.addTween({
             targets: this.clockShield,
             duration: 250,
             rotation: "+=0.2618",
             ease: 'Back.easeOut',
             completeDelay: 1250,
             onComplete: () => {
                this.tickTimeShield();
             }
         });
    }

     setupTimeShield() {
        if (this.specialDamageAbsorptionActive) {
            return;
        }
         this.specialDamageAbsorptionActive = true;

         this.clockShield = this.addSprite(gameConsts.halfWidth, 190, 'enemies', 'red_clock_back_large_red.png').setDepth(1).setAlpha(0.75);
        this.clockShieldArm = this.addImage(this.clockShield.x, this.clockShield.y, 'enemies', 'red_clock_arm_large.png').setDepth(-1).setOrigin(0.5, 1).setRotation(-0.4).setAlpha(0);

         this.clockShield.currAnim = this.addTween({
             targets: this.clockShield,
             duration: 600,
             alpha: 0.2,
             rotation: "+=2",
             ease: 'Cubic.easeOut',
             onComplete: () => {
                this.tickTimeShield();
             }
         });

         let healthText = this.scene.add.bitmapText(gameConsts.halfWidth, 100, 'damage', this.healthMax, 60).setDepth(999).setOrigin(0.5, 0.5);
         let glow = this.addImage(healthText.x, healthText.y, 'blurry', 'glow.webp').setDepth(998).setAlpha(0);

         healthText.startY = healthText.y;
         healthText.setScale(0);
         let statusObj = {};
         statusObj = {
             animObj: healthText,
             glowObj: glow,
             duration: this.healthMax,
             onUpdate: () => {
                if (this.usingTimeFreeze) {
                    statusObj.duration++;
                    return;
                }
                this.invulnHealthBar = false;

                 healthText.y = healthText.startY + 4;
                 let bonusScale = this.health <= 1 ? 0.2 : 0;
                 this.addTween({
                     targets: healthText,
                     duration: 150,
                     scaleX: 1.35 - 0.02 * statusObj.duration + bonusScale,
                     scaleY: 1.35 - 0.02 * statusObj.duration + bonusScale,
                     ease: 'Cubic.easeOut',
                     onComplete: () => {
                         this.addTween({
                             targets: healthText,
                             duration: 600,
                             scaleX: 1.2 - 0.015 * statusObj.duration + bonusScale,
                             scaleY: 1.2 - 0.015 * statusObj.duration + bonusScale,
                             ease: 'Back.easeOut',
                         });
                     }
                 });
                 glow.setScale(healthText.scaleX);
                 this.addTween({
                     targets: glow,
                     duration: 850,
                     alpha: 0.6 - 0.02 * statusObj.duration,
                     scaleX: 1 - 0.02 * statusObj.duration + bonusScale,
                     ease: 'Cubic.easeOut',
                 });
                 this.addTween({
                     targets: healthText,
                     duration: 850,
                     y: healthText.startY,
                     ease: 'Cubic.easeInOut',
                 });

                 if (this.health === 0) {
                     // drag out last second
                     healthText.setText(0);

                 } else {
                     healthText.setText(Math.max(0, statusObj.duration - 1));
                     this.setHealth(this.health - 1);
                     let goalRotArm = (this.health / this.healthMax) * Math.PI * 2;
                     this.clockShieldArm.setRotation(goalRotArm - 0.06);
                     this.addTween({
                         targets: this.clockShieldArm,
                         duration: 200,
                         rotation: "+=0.08",
                         ease: 'Quart.easeOut',
                         onComplete: () => {
                             this.addTween({
                                 targets: this.clockShieldArm,
                                 duration: 300,
                                 rotation: "-=0.02",
                                 ease: 'Back.easeOut',
                                 onComplete: () => {

                                 }
                             });
                         }
                     });

                     let isLeft = this.health % 2 === 0;
                     this.clockShield.x = gameConsts.halfWidth + (isLeft ? 4 : -4);
                     this.addTween({
                         targets: this.clockShield,
                         x: gameConsts.halfWidth,
                         ease: 'Bounce.easeOut',
                         duration: 300,
                     })

                     this.clockShield.setAlpha(0.4 + (this.health / this.healthMax) * 0.6);
                     if (this.health === 0) {
                         if (this.halo) {
                             this.addTween({
                                 targets: this.halo,
                                 alpha: 0,
                                 scaleX: 0,
                                 scaleY: 0,
                                 ease: 'Back.easeIn',
                                 duration: 350,
                             })
                         }
                        this.addTimeout(() => {
                            this.invincible = false;
                             this.die();
                         }, 1000);
                     }

                     if (!this.isTerrified) {
                        if (this.health < 13) {
                            this.pullbackScale = 1;
                            this.attackScale = 1;
                            this.isTerrified = true;
                            this.startReaper();
                             if (this.customBgMusic) {
                                 fadeAwaySound(this.customBgMusic, 1000, '');
                             }

                             this.addTimeout(() => {
                                 this.customBgMusic = playMusic('magician_theme_4', 0.4, true);
                                 fadeInSound(this.customBgMusic, 0.8);
                                 this.setDefaultSprite('time_magi_nervous.png')
                             }, 750)
                        }
                        if (this.health % 2 == 0) {
                            if (this.health % 4 == 0) {
                                playSound('clocktick1', 1).detune = -300;
                            } else {
                                playSound('clocktick1', 1).detune = 0;
                            }
                        }
                     } else {
                        if (this.health < 6 && this.currentAttackSetIndex !== 8) {
                            this.setDefaultSprite('time_magi_terrified.png')
                            this.currentAttackSetIndex = 8;
                            this.nextAttackIndex = 0;
                            this.interruptCurrentAttack();
                        }
                     }
                 }
             },
             cleanUp: () => {
                 statusObj.animObj.setText(0).setScale(1.5);
                 this.addTween({
                     targets: [statusObj.animObj, statusObj.glowObj, this.clockShieldArm, this.clockShield],
                     scaleX: 1.65,
                     scaleY: 1.65,
                     duration: 850,
                     alpha: 0,
                     onComplete: () => {
                        statusObj.animObj.destroy();
                        statusObj.glowObj.destroy();
                        this.clockShieldArm.destroy();
                     }
                 });
                this.statuses[0] = null;
             }
         }
         this.statuses[0] = statusObj;

     }

     handleSpecialDamageAbsorption(amt) {
        if (amt === 1) {
            messageBus.publish('animateBlockNum', gameConsts.halfWidth + 25 - Math.random()*50, this.sprite.y - Math.random() * 50, 'INVINCIBLE', 0.75);
        } else {
            messageBus.publish('animateBlockNum', gameConsts.halfWidth, this.sprite.y + 20, 'INVINCIBLE', 1.25);
        }

         if (this.clockShield.alpha < 0.3) {
             this.clockShield.alpha = 0.5;
             this.clockShield.setScale(0.9);
             this.clockShield.hitTween = this.addTween({
                 targets: this.clockShield,
                 duration: 400,
                 alpha: 0.15,
                 scaleX: 1,
                 scaleY: 1,
                 ease: 'Cubic.easeOut',
             });
         }

         return 0;
     }

     repeatTweenBreathe(duration = 1500, magnitude = 1) {
         if (this.breatheTween) {
             this.breatheTween.stop();
         }
         let vertMove = Math.ceil(3.5 * magnitude);
         this.breatheTween = this.addTween({
             targets: this.sprite,
             duration: duration,
             y: this.sprite.startY - vertMove,
             ease: 'Quad.easeInOut',
             completeDelay: 150,
             onComplete: () => {
                 this.breatheTween = this.addTween({
                     targets: this.sprite,
                     duration: duration * (Math.random() * 0.5 + 1),
                     y: this.sprite.startY + vertMove,
                     ease: 'Quad.easeInOut',
                     completeDelay: 150,
                     onComplete: () => {
                         this.repeatTweenBreathe(duration, magnitude);
                     }
                 });
             }
         });
     }

    launchAttack(attackTimes = 1, prepareSprite, preAttackSprite, attackSprites = [], isRepeatedAttack = false, finishDelay, transitionFast = false) {
        if (this.dead || this.isDestroyed){
            return;
        }
        this.isUsingAttack = true;

        let extraTimeMult = 1 * this.attackSlownessMult;

        if (this.nextAttack.attackStartFunction) {
            this.nextAttack.attackStartFunction();
        }
        let pullbackScale = this.pullbackScale * this.sprite.startScale;
        let pullbackDurMult = Math.sqrt(Math.abs(this.pullbackScale - this.pullbackScaleDefault) * 10) + 1;
        pullbackDurMult *= this.pullbackDurMult ? this.pullbackDurMult : 1;
        let timeSlowMult = 1;

        let durationPullback = isRepeatedAttack ? 200 * extraTimeMult * pullbackDurMult + this.extraRepeatDelay : 300 * extraTimeMult * pullbackDurMult;

        if (prepareSprite) {
            if (isRepeatedAttack) {
                setTimeout(() => {
                    this.setSpriteIfNotInactive(prepareSprite, this.sprite.startScale);
                }, durationPullback * this.pullbackHoldRatio);
            } else {
                this.setSpriteIfNotInactive(prepareSprite, this.sprite.startScale);
            }
        }

        // First pull back
        this.attackAnim = this.scene.tweens.add({
            targets: this.sprite,
            scaleX: pullbackScale,
            scaleY: pullbackScale,
            rotation: 0,
            duration: durationPullback * timeSlowMult,
            ease: 'Cubic.easeOut',
            onComplete: () => {
                if (this.dead || this.isDestroyed){
                    return;
                }
                let attackDuration = isRepeatedAttack ? 150 * extraTimeMult : 175 * extraTimeMult
                let attackScale = this.attackScale * this.sprite.startScale * timeSlowMult;
                attackDuration += Math.floor(this.attackScale * 200);
                this.attackAnim = this.scene.tweens.add({
                    targets: this.sprite,
                    scaleX: attackScale,
                    scaleY: attackScale,
                    duration: attackDuration,
                    rotation: 0,
                    ease: this.attackEase ? this.attackEase : 'Cubic.easeIn',
                    onComplete: () => {
                        if (this.dead || this.isDestroyed){
                            return;
                        }
                        if (!isRepeatedAttack) {
                            messageBus.publish("enemyMadeAttack", this.nextAttack.damage);
                        }
                        if (this.dead || this.isDestroyed){
                            return;
                        }
                        if (attackSprites.length > 0) {
                            //if (!prepareSprite) {
                                if (this.sprite.attackNum === undefined) {
                                    this.sprite.attackNum = 0;
                                } else {
                                    this.sprite.attackNum = (this.sprite.attackNum + 1) % attackSprites.length;
                                }
                                this.setSpriteIfNotInactive(attackSprites[this.sprite.attackNum], this.sprite.startScale, undefined, 10);
                            //}
                        }
                        if (this.health > 0) {
                            if (this.nextAttack.damage > 0) {
                                messageBus.publish("selfTakeDamage", this.nextAttack.damage);
                            }
                            if (this.nextAttack.message) {
                                messageBus.publish(this.nextAttack.message, this.nextAttack.messageDetail);
                            }
                            if (this.nextAttack.attackFinishFunction) {
                                this.nextAttack.attackFinishFunction();
                            }
                        }
                        if (attackTimes > 1) {
                            this.launchAttack(attackTimes - 1, prepareSprite, preAttackSprite, attackSprites, true, finishDelay, transitionFast);
                        } else {
                            this.attackAnim = this.scene.tweens.add({
                                targets: this.sprite,
                                scaleX: this.sprite.startScale,
                                scaleY: this.sprite.startScale,
                                rotation: 0,
                                duration: 500 * extraTimeMult * timeSlowMult,
                                ease: this.returnEase ? this.returnEase : 'Cubic.easeInOut'
                            });
                            setTimeout(() => {
                                this.isUsingAttack = false;
                            }, finishDelay);
                            setTimeout(() => {
                                if (!this.dead && !this.isDestroyed) {
                                    this.setSpriteIfNotInactive(this.defaultSprite, undefined, true);
                                    if (this.nextAttack.finaleFunction) {
                                        this.nextAttack.finaleFunction();
                                    }
                                }
                            }, 400 * extraTimeMult * this.lastAttackLingerMult + 100);
                        }
                    }
                });
            }
        });
    }

    revive() {
        this.backClock = PhaserScene.add.image(this.x, this.y, 'lowq', 'temporal9.png').setDepth(-1).setAlpha(0.05).setScale(0.55);
        this.backClock.baseScale = this.backClock.scaleX;
        let delayAmt = 0;
        let delayAdded = 460;
        for (let i = 0; i < this.timeFallObjs.length; i++) {
            let clock = this.timeFallObjs[i];
            delayAmt += delayAdded;
            delayAdded = Math.floor(delayAdded * 0.84);
            this.addTween({
                delay: delayAmt,
                targets: clock,
                x: this.x,
                y: this.y,
                duration: 275,
                ease: 'Quad.easeIn',
                onStart:() => {
                    let detuneAmt = i * 30 - 600;
                    if (i % 2 == 0) {
                        playSound('time_strike').detune = detuneAmt;
                    } else {
                        playSound('time_strike_alt').detune = detuneAmt;
                    }
                },
                onComplete: () => {
                    let rotateAmt = 0.07 + (i * 0.005);
                    this.backClock.baseScale += 0.08;
                    this.backClock.setScale(this.backClock.baseScale + 0.07)
                    this.backClock.alpha += 0.08;
                    if (i === this.timeFallObjs.length - 1) {
                        this.backClock.baseScale += 0.3;
                        this.backClock.setScale(this.backClock.baseScale - 0.5)
                        this.backClock.alpha = 1;
                        playSound('time_strike_hit');
                        this.addTween({
                            targets: this.sprite,
                            duration: 250,
                            rotation: 0,
                            ease: 'Quart.easeOut',
                        });
                        this.addTween({
                            targets: this.backClock,
                            duration: 400,
                            scaleX: this.backClock.baseScale,
                            scaleY: this.backClock.baseScale,
                            easeParams: [3],
                            ease: 'Back.easeOut',
                            completeDelay: 100,
                            onComplete: () => {
                                clock.destroy();
                                this.beginPhaseTwo();
                                this.addTween({
                                    targets: this.backClock,
                                    duration: 1200,
                                    rotation: "+=2",
                                    scaleX: "+=1",
                                    scaleY: "+=1",
                                    alpha: 0,
                                    ease: 'Cubic.easeOut',
                                    onComplete: () => {

                                    }
                                });
                            }
                        });
                    } else {
                        this.addTween({
                            targets: this.backClock,
                            duration: 220 - i * 4,
                            rotation: "-=" + rotateAmt,
                            scaleX: this.backClock.baseScale,
                            scaleY: this.backClock.baseScale,
                            easeParams: [5],
                            ease: 'Bounce.easeOut',
                            onComplete: () => {
                                clock.destroy();
                            }
                        });
                    }

                }
            });
            this.addTween({
                delay: delayAmt,
                targets: clock,
                alpha: 0,
                duration: 300,
                ease: 'Cubic.easeIn',
                onStart: () => {
                    clock.setAlpha(1);
                },
            });
        }
    }

    beginPhaseTwo() {
        globalObjects.bannerTextManager.setDialog([getLangText('magician_c'), getLangText('magician_d')]);
        globalObjects.bannerTextManager.setPosition(gameConsts.halfWidth, gameConsts.halfHeight - 20, 0);
        globalObjects.bannerTextManager.showBanner(0.5);
        globalObjects.bannerTextManager.setOnFinishFunc(() => {
            this.addTween({
                targets: this.sprite,
                scaleX: this.sprite.startScale - 0.2,
                scaleY: this.sprite.startScale - 0.2,
                duration: 250,
                ease: 'Cubic.easeOut',
                onComplete: () => {
                    this.halo = this.addImage(this.sprite.x, 189, 'blurry', 'spellcircle_pulse.png').setScale(0.45).setAlpha(0).setDepth(189);
                    this.addTween({
                        delay: 50,
                        targets: this.halo,
                        scaleX: 1.52,
                        scaleY: 1.52,
                        alpha: 0.96,
                        ease: 'Quart.easeIn',
                        duration: 400,
                        onComplete: () => {
                            this.halo.setScale(1.55).setAlpha(1);
                            this.addTween({
                                targets: this.halo,
                                scaleX: 1.52,
                                scaleY: 1.52,
                                ease: 'Back.easeIn',
                                duration: 150,
                            })
                            messageBus.publish('animateHealNum', gameConsts.halfWidth, this.sprite.y + 84, 'INVINCIBLE', 1.55, {}, {duration: 1000, ease: 'Quint.easeIn'});
                        }
                    })
                    this.addTween({
                        targets: this.sprite,
                        scaleX: this.sprite.startScale + 0.2,
                        scaleY: this.sprite.startScale + 0.2,
                        duration: 500,
                        ease: 'Cubic.easeIn',
                        onComplete: () => {
                            this.setMaxHealth(20);
                            this.heal(this.healthMax);
                            this.invulnHealthBar = true;
                            this.healthBarCurr.setFrame('yellow_pixel.png');
                            this.healthBarText.setText("INVINCIBLE");
                            this.setDepth(200);

                            this.setAwake();
                            this.setupTimeShield();

                            // this.customBgMusic = playMusic('magician_theme_3', 0.8);
                             playSound('timeSlow');
                             this.magicianTimeEpicTheme = playMusic('magician_theme_3', 0.8)
                             globalObjects.magicCircle.timeSlowFromEnemy();
                             this.usingTimeFreeze = true;

                            this.currentAttackSetIndex = 2;
                            this.nextAttackIndex = 0;
                            this.setSprite('time_magi_cast.png', undefined, true);
                            this.addTween({
                                targets: this.sprite,
                                scaleX: this.sprite.startScale,
                                scaleY: this.sprite.startScale,
                                duration: 450,
                                ease: 'Quart.easeOut',
                                onComplete: () => {
                                    this.setSprite('time_magi.png', undefined, true);
                                },
                            });
                        },
                    });
                },
            });
        })
    }

    startChargingUltimate() {
        let damageAmt = gameVars.isHardMode ? 3 : 2;
        let totalAmt = gameVars.isHardMode ? 20 : 20;
        let angleDivider = gameVars.isHardMode ? 10 : 10;
        for (let i = 0; i < totalAmt; i++) {
            this.addTween({
                delay: i * 190,
                duration: 300,
                targets: this.sprite,
                scaleX: this.sprite.startScale,
                scaleY: this.sprite.startScale,
                rotation: 0,
                ease: 'Cubic.easeInOut',
                onStart: () => {
                    if (!this.finishedChargingUltimate) {
                        if (i % 2 === 0) {
                            this.sprite.setScale(this.sprite.startScale * 1.03);
                            this.sprite.setRotation(0.06);
                        }

                        let startX = this.x;
                        let startY = this.y + 10;
                        let dirAngle = i * Math.PI / angleDivider;
                        let offsetX = Math.sin(dirAngle) * 90;
                        let offsetY = -Math.cos(dirAngle) * 80;
                        let isExtraLarge = false;
                        if (gameVars.isHardMode) {
                            isExtraLarge = i % 5 === 0;
                        } else {
                            isExtraLarge = i === 0 || i === 10 || i === 5 || i === 15;
                        }
                        let clockName = 'clock2.png';
                        if (isExtraLarge) {
                            clockName = 'clock4.png';
                        }

                        let xPos = startX + offsetX; let yPos = startY + offsetY;
                        let timeObj = this.createTimeObject(clockName, xPos, yPos, 0, 2, -300 + i * 30);
                        timeObj.setDepth(199);
                        this.addTween({
                            duration: 400,
                            targets: timeObj,
                            x: startX + offsetX * (isExtraLarge ? 1.55 : 1.6),
                            y: startY + offsetY * (isExtraLarge ? 1.55 : 1.6),
                            ease: 'Quart.easeOut'
                        });
                        let numAttacks = (i + 1) * 2;
                        if (i < 6) {
                            this.attackName.setText("}" + damageAmt + "x" + numAttacks + "}");
                        } else if (i < 12) {
                            this.attackName.setText("}}" + damageAmt + "x" + numAttacks + "}}");
                            this.repositionAngrySymbol();
                        } else if (i < 19) {
                            this.attackName.setText("}}}" + damageAmt + "x" + numAttacks + "}}}");
                            this.repositionAngrySymbol();
                        } else {
                            this.attackName.setText("}}}}" + damageAmt + "x" + numAttacks + "}}}}");
                            this.repositionAngrySymbol();
                            this.nextAttack.chargeMult = 7.5;
                            this.setDefaultSprite('time_magi.png');
                        }
                    }
                },
            })
        }
    }

    showTiredText() {
        if (this.dead) {
            return;
        }
        messageBus.publish("showCombatText", getLangText('magician_e'), 8);
        this.addTimeout(() => {
            this.playerSpellCastSub = this.addSubscription('playerCastedSpell', () => {
                this.playerSpellCastSub.unsubscribe();
                clearTimeout(this.spellCastTimeout);
                this.showTiredText2();
            });
            this.spellCastTimeout = this.addTimeout(() => {
                this.playerSpellCastSub.unsubscribe();
                this.showTiredText2();
            }, 2000);
        }, 3500)
    }


    showTiredText2() {
        if (this.dead) {
            return;
        }
        messageBus.publish("showCombatText", getLangText('magician_f'), 8);
        this.addTimeout(() => {
            this.playerSpellCastSub = this.addSubscription('playerCastedSpell', () => {
                this.playerSpellCastSub.unsubscribe();
                clearTimeout(this.spellCastTimeout);
                this.showTiredText3();
            });
            this.spellCastTimeout = this.addTimeout(() => {
                this.playerSpellCastSub.unsubscribe();
                this.showTiredText3();
            }, 2000);
        }, 3500)
    }

    showTiredText3() {
        if (this.dead) {
            return;
        }
        messageBus.publish("showCombatText", getLangText('magician_g'), 8);
        this.addTimeout(() => {
            this.playerSpellCastSub = this.addSubscription('playerCastedSpell', () => {
                this.playerSpellCastSub.unsubscribe();
                clearTimeout(this.spellCastTimeout);
                messageBus.publish("closeCombatText")
            });
            this.spellCastTimeout = this.addTimeout(() => {
                this.playerSpellCastSub.unsubscribe();
                messageBus.publish("closeCombatText")
            }, 3000);
        }, 3500)
    }

     initAttacks() {
         this.attacks = [
             [
                 // 0
                 {
                     name: "}4x3 ",
                     desc: "An advanced magic attack.",
                     chargeAmt: gameVars.isHardMode ? 400 : 445,
                     damage: -1,
                     prepareSprite: 'time_magi_cast_big.png',
                     attackStartFunction: () => {
                         this.createTimeObject('clock2.png', this.x - 120, this.y - 70);
                         this.createTimeObject('clock3.png', this.x - 40, this.y - 95, 150);
                         this.createTimeObject('clock4.png', this.x + 40, this.y - 80, 300);
                         this.addTimeout(() => {
                             this.fireTimeObjects(4);
                         }, 800);
                     },
                     attackFinishFunction: () => {
                        if (this.health < this.healthMax - 20) {
                            // health low-ish, go heal
                            this.currentAttackSetIndex = 1;
                            this.nextAttackIndex = 0;
                        }
                    }
                 },
                 {
                     name: "}3x2 ",
                     desc: "The Time Magician cautiously\npokes you with his\nwand.",
                     chargeAmt: gameVars.isHardMode ? 350 : 405,
                     damage: -1,
                     prepareSprite: 'time_magi_cast.png',
                     attackStartFunction: () => {
                         this.createTimeObject('clock2.png', this.x - 120, this.y - 70);
                         this.createTimeObject('clock3.png', this.x - 40, this.y - 95, 150);
                         this.createTimeObject('clock2.png', this.x + 40, this.y - 80, 300);
                         this.addTimeout(() => {
                             this.fireTimeObjects(3);
                         }, 800);
                     },
                     attackFinishFunction: () => {
                        if (this.health < this.healthMax - 20) {
                            // health low-ish, go heal
                            this.currentAttackSetIndex = 1;
                            this.nextAttackIndex = 0;
                        }
                    }
                 },
             ],
             [
                // 1
                 {
                     name: "\\50% MISSING HEALTH",
                     chargeAmt: gameVars.isHardMode ? 280 : 305,
                     isPassive: true,
                     damage: -1,
                     prepareSprite: 'time_magi_cast_big.png',
                     attackStartFunction: () => {

                     },
                     attackFinishFunction: () => {
                        this.numTimesHealed++;
                        let lostHealth = this.healthMax - this.health;
                        let healedAmt = Math.floor(lostHealth * 0.5);
                        this.heal(healedAmt);
                        playSound('magic', 0.6);
                        messageBus.publish('animateHealNum', this.x, this.y - 50, '+' + healedAmt, 0.5 + Math.sqrt(healedAmt) * 0.2);
                        if (!this.healSprite) {
                            this.healSprite = this.addImage(gameConsts.halfWidth, this.y - 90, 'misc', 'heal.png').setScale(0.9).setDepth(999).setAlpha(1);
                        }
                        this.healSprite.setAlpha(1).setPosition(gameConsts.halfWidth, this.y - 90);
                        this.scene.tweens.add({
                            targets: this.healSprite,
                            y: "-=30",
                            duration: 1000,
                        });
                        this.scene.tweens.add({
                            targets: this.healSprite,
                            alpha: 0,
                            duration: 1000,
                            ease: 'Cubic.easeIn',
                            onComplete: () => {
                                if (this.numTimesHealed === 2) {
                                    globalObjects.bannerTextManager.setDialog([getLangText('magician_a'), getLangText('magician_b')]);
                                    globalObjects.bannerTextManager.setPosition(gameConsts.halfWidth, gameConsts.halfHeight - 5, 0);
                                    globalObjects.bannerTextManager.showBanner(0.5);
                                }
                            }
                        });
                        if (this.numTimesHealed >= 2) {

                        } else {
                            this.currentAttackSetIndex = 0;
                            this.nextAttackIndex = 0;
                        }
                     },
                 },
                 {
                     name: ";20 ",
                     desc: "A devastating barrage\nof offensive magic.",
                     chargeAmt: gameVars.isHardMode ? 550 : 520,
                     isBigMove: true,
                     prepareSprite: 'time_magi_cast_big.png',
                     attackStartFunction: () => {
                         this.createTimeObjectHuge('clock1.png', this.x - 95, 60, 100, 1.4);
                     },
                     attackFinishFunction: () => {
                         this.addTimeout(() => {
                             this.fireTimeObjects(20, 600);
                         }, 550);
                        this.currentAttackSetIndex = 0;
                        this.nextAttackIndex = 0;
                     }
                 },
            ],
            [
                // 2
                {
                     name: gameVars.isHardMode ? "}3x1}" : "}2x1}",
                     desc: "The Time Magician\nuses his ultimate attack",
                     chargeAmt: 1300,
                     isBigMove: true,
                     chargeMult: gameVars.isHardMode ? 4 : 3,
                     damage: -1,
                    finishDelay: 4200,

                     isPassive: true,
                     startFunction: () => {
                        this.setSprite('time_magi_cast_big.png');
                         this.finishedChargingUltimate = false;
                        this.startChargingUltimate();
                     },
                     attackStartFunction: () => {
                         this.finishedChargingUltimate = true;
                     },
                     attackFinishFunction: () => {
                        this.fireTimeObjects(gameVars.isHardMode ? 3 : 2, undefined, 135, true);
                         this.currentAttackSetIndex = 3;
                         this.nextAttackIndex = 0;
                     },
                     finaleFunction: () => {
                     }
                }
            ],
             [
                // 3
                 {
                     name: "EXHAUSTED...",
                     chargeAmt: 300,
                     chargeMult: 3,
                     isPassive: true,
                     startFunction: () => {
                        this.setDefaultSprite('time_magi_fade.png', 1);
                        this.exhausted = true;
                         globalObjects.magicCircle.cancelTimeSlow();
                        this.clockShield.currAnim.stop();
                        let extraRotations = Math.floor(this.clockShield.rotation / (Math.PI * 2));
                        this.clockShield.rotation -= extraRotations * Math.PI * 2;
                        if (this.clockShield.rotation > 0) {
                            this.clockShield.rotation -= Math.PI * 2;
                        }
                        this.addTween({
                            delay: 300,
                            targets: this.clockShield,
                            duration: 700,
                            scaleX: 0.85,
                            scaleY: 0.85,
                            rotation: Math.PI * 2,
                            alpha: 0.75,
                            ease: 'Cubic.easeIn',
                            onStart: () => {
                                this.halo.setDepth(-8)
                                this.addTween({
                                    targets: this.halo,
                                    alpha: 0.67,
                                    scaleX: 1.31,
                                    scaleY: 1.31,
                                    ease: 'Quart.easeOut',
                                    duration: 450
                                })
                            },
                            onComplete: () => {
                                this.statuses[0].animObj.setScale(0.8);
                                this.clockShield.alpha = 1;
                                this.clockShieldArm.setRotation(-0.4);
                                this.addTween({
                                    targets: this.clockShieldArm,
                                    duration: 200,
                                    rotation: 0,
                                    alpha: 1,
                                    ease: 'Cubic.easeOut',
                                });

                                this.usingTimeFreeze = false;
                            }
                        });
                     }
                 },
                 {
                     name: "TIRED...",
                     chargeAmt: 400,
                     damage: -1,
                     startFunction: () => {
                        this.showTiredText();
                     },
                     attackStartFunction: () => {

                     },
                 },
                 {
                     name: ":(",
                     chargeAmt: 400,
                     damage: -1,
                     attackStartFunction: () => {

                     },
                 },
                 // 1
             ],
             [
                // 4
                 {
                     name: "\\{DELAY INJURIES{\\",
                     desc: "The Time Magician\nslows down his health",
                     chargeAmt: 350,
                     prepareSprite: 'time_magi_cast_big.png',
                     isPassive: true,
                     startFunction: () => {
                        this.preppingTimeShield = true;
                     },
                     attackFinishFunction: () => {
                         this.usedTimeShield = true;
                         playSound('time_shield', 0.6)
                         this.setupTimeShield();
                         this.currentAttackSetIndex = 3;
                         this.nextAttackIndex = 0;
                     }
                 },
             ],
             [
                 // 5
                 {
                     name: "}5x2 ",
                     desc: "A basic magic attack.",
                     chargeAmt: 350,
                     damage: -1,
                     prepareSprite: 'time_magi_cast.png',
                     attackStartFunction: () => {
                         this.createTimeObject('clock2.png', this.x - 120, this.y + 30);
                         this.createTimeObject('clock3.png', this.x - 75, this.y - 20);
                         this.addTimeout(() => {
                             this.fireTimeObjects(5);
                         }, 500);
                     },
                 },
                 {
                     name: "}4x3 ",
                     desc: "An advanced magic attack.",
                     chargeAmt: 480,
                     damage: -1,
                     prepareSprite: 'time_magi_cast_big.png',
                     attackStartFunction: () => {
                         this.createTimeObject('clock2.png', this.x - 110, this.y - 40);
                         this.createTimeObject('clock3.png', this.x - 60, this.y - 75, 150);
                         this.createTimeObject('clock4.png', this.x + 5, this.y - 90, 300);
                         this.addTimeout(() => {
                             this.fireTimeObjects(4);
                         }, 800);
                     },
                 },
             ],
             [
                 // 6
                 {
                     name: "}4x3 ",
                     desc: "An advanced magic attack.",
                     chargeAmt: 450,
                     damage: -1,
                     prepareSprite: 'time_magi_cast_big.png',
                     attackStartFunction: () => {
                         this.createTimeObject('clock2.png', this.x - 120, this.y - 70);
                         this.createTimeObject('clock3.png', this.x - 40, this.y - 80, 125);
                         this.createTimeObject('clock4.png', this.x + 40, this.y - 80, 250);
                         this.addTimeout(() => {
                             this.fireTimeObjects(4);
                         }, 500);
                     },
                 },
                 {
                     name: "TIME FREEZE ;4x!!!",
                     desc: "The Time Magician prepares\nhis most powerful magics.",
                     chargeAmt: 900,
                     isBigMove: true,
                     prepareSprite: 'time_magi_cast_big.png',
                     startFunction: () => {
                         this.addTimeout(() => {
                             let myCustomMusic = this.customBgMusic;
                             fadeAwaySound(myCustomMusic, 2000, ' ');

                         }, 750);
                         this.usingTimeFreeze = true;
                     },
                     attackFinishFunction: () => {
                         this.timeBarraged = true;
                         this.freezingTime = true;
                        for (let i = 0; i < this.timeFallObjs.length; i++) {
                            let clock = this.timeFallObjs[i];
                            clock.setAlpha(0);
                        }

                         playSound('timeSlow');
                         this.magicianTimeEpicTheme = playMusic('magician_theme_3', 0.8)
                         globalObjects.magicCircle.timeSlowFromEnemy();
                     }
                 },
                 {
                     name: "TIME-ATTACK |4x5 ",
                     desc: "A devastating barrage\nof offensive magic.",
                     chargeAmt: 550,
                     chargeMult: 16,
                     prepareSprite: 'time_magi_cast_big.png',
                     startFunction: () => {
                     },
                     attackStartFunction: () => {
                         this.createTimeObject('clock2.png', this.x - 150, 115, 0);
                         this.createTimeObject('clock4.png', this.x - 75, 100, 75);
                         this.createTimeObject('clock3.png', this.x, 105, 150);
                         this.createTimeObject('clock3.png', this.x + 75, 105, 225);
                         this.createTimeObject('clock4.png', this.x + 150, 115, 300);
                         this.addTimeout(() => {
                             this.fireTimeObjects(4);
                         }, 800);
                     },
                     attackFinishFunction: () => {

                     }
                 },
                 {
                     name: "TIME-ATTACK |4x7 ",
                     desc: "A devastating barrage\nof offensive magic.",
                     chargeAmt: 700,
                     chargeMult: 16,
                     prepareSprite: 'time_magi_cast_big.png',
                     attackStartFunction: () => {
                         this.createTimeObject('clock2.png', this.x - 220, 125, 75);
                         this.createTimeObject('clock3.png', this.x - 150, 115, 150);
                         this.createTimeObject('clock4.png', this.x - 75, 100, 225);
                         this.createTimeObject('clock3.png', this.x, 105, 300);
                         this.createTimeObject('clock4.png', this.x + 75, 115, 375);
                         this.createTimeObject('clock3.png', this.x + 150, 110, 450);
                         this.createTimeObject('clock2.png', this.x + 220, 125, 525);
                         this.addTimeout(() => {
                             this.fireTimeObjects(4);
                         }, 900);
                     },
                     attackFinishFunction: () => {

                     }
                 },
                 {
                     name: "RESTING...",
                     desc: "Time Magician is trying\nto think what to do...",
                     isPassive: true,
                     chargeAmt: 250,
                     chargeMult: 1.5,
                     damage: 0,
                     startFunction: () => {
                         this.freezingTime = false;
                        for (let i = 0; i < this.timeFallObjs.length; i++) {
                            let clock = this.timeFallObjs[i];
                            clock.setAlpha(0.01 + clock.scaleX * 0.45);
                        }

                         globalObjects.magicCircle.cancelTimeSlow();
                         if (!this.dead) {
                             this.addTimeout(() => {
                                 fadeAwaySound(this.magicianTimeEpicTheme, 1500);
                             }, 1500);
                         }
                     },
                     attackFinishFunction: () => {
                         if (this.isTerrified) {

                         } else {
                             // normal attacks
                             this.currentAttackSetIndex = 4;
                             this.nextAttackIndex = 0;
                         }
                     }
                 }
             ],
             [
                 // 7
                 {
                     name: "}6 ",
                     desc: "The Time Magician cautiously\npokes you with his\nwand.",
                     chargeAmt: 550,
                     damage: -1,
                     prepareSprite: 'time_magi_cast_big.png',
                     attackStartFunction: () => {
                         this.createTimeObject('clock3.png', this.x - 25, this.y - 110);
                         this.addTimeout(() => {
                             this.fireTimeObjects(6);
                         }, 800);
                     },
                 },
                 {
                     name: "}4x2 ",
                     desc: "An advanced magic attack.",
                     chargeAmt: 350,
                     damage: -1,
                     prepareSprite: 'time_magi_cast_big.png',
                     attackStartFunction: () => {
                         this.createTimeObject('clock2.png', this.x - 110, this.y - 70);
                         this.createTimeObject('clock3.png', this.x - 35, this.y - 100);
                         this.addTimeout(() => {
                             this.fireTimeObjects(4);
                         }, 800);
                     },
                 }
             ],
             [
                 // 8
                 {
                    name: "COWER",
                    isPassive: true,
                    desc: "The Time Magician is\nafraid of death.",
                    chargeAmt: 1000,
                    chargeMult: 1.1,
                    damage: 0,
                    startFunction: () => {

                    }
                 },
             ]
         ];
     }
     createTimeObject(name, x, y, delay = 0, durMult = 1, detune = 0) {
         let newObj = this.addSprite(x, y, 'enemies', name).setRotation((Math.random() - 0.5) * 3).setScale(0).setDepth(110);
         newObj.durMult = durMult;
         this.timeObjects.push(newObj);
         this.addTween({
             delay: delay,
             targets: newObj,
             scaleX: 1,
             scaleY: 1,
             ease: 'Back.easeOut',
             easeParams: [3],
             rotation: '+=1',
             duration: 300 * durMult,
             onStart: () => {
                 let sound = playSound('time_strike');
                 sound.detune = detune;
             }
         });
         return newObj;
     }

     createTimeObjectHuge(name, x, y, delay = 0, durMult = 1) {
         let newObj = this.addSprite(x, y, 'enemies', name).setRotation((Math.random() - 0.5) * 3).setScale(0).setDepth(110);
         newObj.durMult = durMult;
         newObj.endScale = 1.4;
         this.timeObjects.push(newObj);
         this.addTween({
             delay: delay,
             targets: newObj,
             scaleX: 0.9,
             scaleY: 0.9,
             ease: 'Back.easeOut',
             easeParams: [2],
             rotation: '+=1',
             duration: 350,
             onStart: () => {
                 playSound('time_strike');
             },
             onComplete: () => {
                 this.addTween({
                    delay: 100,
                     targets: newObj,
                     scaleX: 1.4,
                     scaleY: 1.4,
                     ease: 'Back.easeOut',
                     easeParams: [2.5],
                     rotation: '+=1',
                     duration: 400,
                     onStart: () => {
                         let sfx = playSound('time_strike', 1.2);
                         sfx.detune = 500;
                     }
                 });
             }
         });
     }

     fireTimeObjects(damage = 10, durBonus = 0, interval = 175, hitTwice = false) {
         let totalTimeObjects = this.timeObjects.length;
         let projDur = 600 - Math.floor(Math.sqrt(totalTimeObjects) * 50) + durBonus;
         let timeObjectsFired = 0;
         while (this.timeObjects.length > 0) {
             let currObj = this.timeObjects.shift();
             let delayAmt = timeObjectsFired * interval;
             timeObjectsFired++;
             this.addTween({
                 targets: currObj,
                 delay: delayAmt,
                 y: globalObjects.player.getY() - 170 + Math.random() * 10 - currObj.width * 0.5,
                 ease: 'Quad.easeIn',
                 duration: projDur,
                 rotation: (Math.random() - 0.5) * 3,
                 onStart: () => {
                     this.addDelay(() => {
                         currObj.depth = 3;
                     }, projDur * 0.9);
                 },
                 onComplete: () => {
                     let dur = 280 - Math.sqrt(totalTimeObjects) * 40;
                     let rot = dur * 0.004;
                     let scaleMult = 1 + durBonus / 800;
                     let hitEffect = this.addSprite(currObj.x, currObj.y, 'spells', 'timeRed1.png').setRotation((Math.random() - 0.5) * 3).setScale(0.35 * scaleMult).setDepth(195);
                     this.addTween({
                         targets: hitEffect,
                         scaleX: 0.7 * scaleMult,
                         scaleY: 0.7 * scaleMult,
                         ease: 'Cubic.easeOut',
                         duration: dur,
                         onComplete: () => {
                             hitEffect.destroy();
                         }
                     });
                     this.addTween({
                         targets: hitEffect,
                         rotation: "-="+rot,
                         alpha: 0,
                         duration: dur
                     });
                     if (currObj.scaleX > 1.1) {
                        playSound('body_slam', 0.5);
                     }
                     if (Math.random() < 0.6) {
                         playSound('time_strike_hit');
                     } else {
                         playSound('time_strike_hit_2');
                     }
                     messageBus.publish("selfTakeDamage", damage, undefined, currObj.x + 20);
                     if (hitTwice) {
                         setTimeout(() => {
                             messageBus.publish("selfTakeDamage", damage, undefined, currObj.x - 20);
                         }, 50)
                     }
                     currObj.destroy();

                 }
             });
             this.addTween({
                 targets: currObj,
                 delay: delayAmt,
                 x: gameConsts.halfWidth * 0.92 + currObj.x * 0.15,
                 ease: 'Back.easeIn',
                 easeParams: [3],
                 duration: projDur
             });
         }
     }

     update(dt) {
        super.update(dt);
        if (this.lifeOne) {
            for (let i = 0; i < this.timeFallObjs.length; i++) {
                let clock = this.timeFallObjs[i];
                clock.y += 0.4 * dt;
                clock.rotation += dt * clock.rotSpeed * 0.004;
                if (clock.y > gameConsts.height + 75) {

                    clock.y = -75;
                    let randFrame = 'temporal' + Math.floor(Math.random() * 10) + ".png";
                    clock.setFrame(randFrame).setRotation(Math.random() * 6);
                    let randDist = 0.3 + Math.random() * 0.55;
                    clock.setScale(randDist);
                    clock.rotSpeed = (1 + Math.random()) * (Math.random < 0.5 ? 1 : -1);
                    clock.setScale(clock.scaleX);
                    clock.setAlpha(clock.scaleX * 0.5 - 0.05);

                    clock.x = gameConsts.width * ((this.availableIndicies[this.lastPlacedIndex] + 0.5) / 5);
                    this.lastPlacedIndex = (this.lastPlacedIndex + 1) % this.availableIndicies.length;
                }
            }
        }
    }

    initTemporalObjects() {
        this.timeFallObjs = [];
        this.lastPlacedIndex = 0;
        this.availableIndicies = [
            0, 3, 1, 4, 2,
            0, 1, 3, 2, 4,
            1, 0, 3, 2, 4,
            3, 0, 2, 4, 1,
            3, 1, 0, 4, 2,
            1, 4, 3, 2, 0];
        let numObjects = 15;
        for (let i = 0; i < numObjects; i++) {
            let randDist = 0.3 + Math.random() * 0.55;

            let randFrame = 'temporal' + Math.floor(Math.random() * 10) + ".png";
            let newClock = this.addSprite(0, (i * gameConsts.height / (numObjects - 2)) - 70, 'lowq', randFrame).setRotation(Math.random() * 6).setScale(randDist).setDepth(-1);
            newClock.setAlpha(0);

             this.addTween({
                 targets: newClock,
                 alpha: newClock.scaleX * 0.34,
                 duration: 500
             });

            newClock.rotSpeed = (1 + Math.random()) * (Math.random < 0.5 ? 1 : -1);
            this.timeFallObjs.push(newClock);

            newClock.x = gameConsts.width * ((this.availableIndicies[this.lastPlacedIndex] + 0.5) / 5);
            this.lastPlacedIndex = (this.lastPlacedIndex + 1) % this.availableIndicies.length;
        }
    }
}
