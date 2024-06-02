 class Magician extends Enemy {
    constructor(scene, x, y, level) {
        super(scene, x, y, level);
        this.initSprite('time_magi.png', 0.75,0, 5);
        this.popupTimeout = this.addTimeout(() => {
            this.tutorialButton = createTutorialBtn(this.level);
            this.addToDestructibles(this.tutorialButton);
        }, 3500)
        this.addTimeout(() => {
            if (!this.isDestroyed) {
                this.customBgMusic = playMusic('magician_theme_1', 0.95, true);
            }
        }, 1500)
        

        this.magicianReaped = messageBus.subscribe('reapedEnemyGong', () => {
            this.zoomAwayClocks();
        });

        this.sprite.startY = this.sprite.y;
        this.repeatTweenBreathe();
    }

     initStatsCustom() {
         this.health = 90;
         this.damageNumOffset = 45;
         this.timeObjects = [];
         this.initTemporalObjects();
     }


     setHealth(newHealth) {
         super.setHealth(newHealth);
         let prevHealthPercent = this.prevHealth / this.healthMax;
         let currHealthPercent = this.health / this.healthMax;
         if (currHealthPercent == 0) {
             // dead, can't do anything
             return;
         }
         if (this.specialDamageAbsorptionActive) {
             // this.animateShake();
             let healthBarRatio = 1 + this.healthBarLengthMax * this.health / this.healthMax;
             this.healthBarCurr.scaleX = healthBarRatio;
             this.healthBarText.setText(this.health);
             if (this.health <= 0) {
                 this.die();
             }
            if (this.statuses[0] && this.statuses[0].duration > newHealth + 1) {
                this.statuses[0].duration = newHealth + 1;
                this.statuses[0].animObj.setText(this.statuses[0].duration);

            }

         }


         if (!this.isNervous && this.statuses[0] && this.statuses[0].duration >= this.health) {
             this.isNervous = true;
             this.setDefaultSprite('time_magi_nervous.png', 0.75);
         }
         if (this.usingTimeFreeze) {
             // no change
         } else if (currHealthPercent < 0.999 && !this.preppingTimeShield) {
             this.currentAttackSetIndex = 1;
             this.nextAttackIndex = 0;
         } else if (this.health <= 13 && this.usedTimeShield && !this.isTerrified && this.statuses[0] && this.statuses[0].duration >= this.health) {
             this.isTerrified = true;
             this.interruptCurrentAttack();
             this.currentAttackSetIndex = 6;
             this.nextAttackIndex = 0;
             this.startReaper();
             if (this.customBgMusic) {
                 fadeAwaySound(this.customBgMusic, 1000, '');
             }
             this.addTimeout(() => {
                 if (!this.dead) {
                     this.customBgMusic = playMusic('magician_theme_4', 0.4, true);
                     fadeInSound(this.customBgMusic, 0.8);
                 }
             }, 750)
         } else if (this.health <= 4 && !this.timeTerrified && this.usedTimeShield) {
             this.timeTerrified = true;
             this.setDefaultSprite('time_magi_terrified.png', 0.72);
         }

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
             this.clockShield.alpha += 0.15;
             this.addTween({
                 targets: this.clockShield,
                 scaleX: 0.75,
                 scaleY: 0.75,
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

     die() {
         if (this.dead) {
             return;
         }
        super.die();

         if (this.currAnim) {
             this.currAnim.stop();
         }
        globalObjects.encyclopedia.hideButton();
        globalObjects.options.hideButton();
        this.cleanUp();
         this.showVictory();

         this.setDefaultSprite('time_magi_terrified.png', 0.72);

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

     destroy() {
        super.destroy();
        if (this.customBgMusic) {
            this.customBgMusic.stop();
        }
        this.magicianReaped.unsubscribe();
     }

     showRune() {
         let rune = PhaserScene.add.image(this.x, this.y - 45, 'tutorial', 'rune_time_large.png').setOrigin(0.5, 0.5).setScale(0.5).setDepth(9999);
         playSound('victory_2');
         this.showFlash(this.x, this.y);
         let banner = PhaserScene.add.image(gameConsts.halfWidth, gameConsts.halfHeight - 40, 'misc', 'victory_banner.png').setScale(100, 1.3).setDepth(9998).setAlpha(0);
         let victoryText = PhaserScene.add.image(gameConsts.halfWidth, gameConsts.halfHeight - 40, 'misc', 'victory_text.png').setScale(0.95).setDepth(9998).setAlpha(0);
         let continueText = PhaserScene.add.text(gameConsts.width - 15, gameConsts.halfHeight + 2, 'CONTINUE').setAlpha(0).setOrigin(1, 0.5).setAlign('right').setDepth(9998).setFontSize(22);

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
             duration: 450,
             onComplete: () => {
                 this.dieClickBlocker.setOnMouseUpFunc(() => {
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
                             globalObjects.magicCircle.enableMovement();
                             globalObjects.postFightScreen.createWinScreen(this.level);
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
            playReaperDialog(['YOUR TIME IS UP'], () => {
                 PhaserScene.tweens.add({
                     targets: this.timeFallObjs,
                     duration: 1000,
                 });
                globalObjects.reapSound = 'magician_end';
                playReaperAnim(this, () => {
                    setTimeout(() => {
                        this.showRune();
                    }, 1200);
                });
            });

            this.dieClickBlocker.setOnMouseUpFunc(() => {
                this.dieClickBlocker.destroy();
            })
        }, 500);
     }



     startReaper() {
        this.blackBackground = this.addSprite(gameConsts.halfWidth, gameConsts.halfHeight, 'blackPixel').setScale(500).setAlpha(0).setDepth(-1)
         this.floatingDeath = getFloatingDeath();
         this.floatingDeath.alpha = 0;
         gameVars.deathFlutterDelay = 600;
         this.floatingDeathAnim = this.addTween({
             targets: this.floatingDeath,
             duration: 19000,
             alpha: 0.75,
             scaleX: 0.7,
             scaleY: 0.7,
             ease: 'Quad.easeInOut',
         });
         this.addTween({
             targets: this.blackBackground,
             duration: 19000,
             alpha: 0.7,
             ease: 'Quad.easeOut',
         });
     }

     setupTimeShield() {
        let lostHealth = (this.healthMax - 12) - this.health;
        lostHealth = Math.max(0, lostHealth);
         this.heal(Math.floor(lostHealth * 0.5));
         this.specialDamageAbsorptionActive = true;

         this.clockShield = this.addSprite(gameConsts.halfWidth, this.y, 'spells', 'clock_back_large_red.png').setDepth(1).setAlpha(0.75);

         this.addTween({
             targets: this.clockShield,
             duration: 600,
             alpha: 0.2,
             rotation: "+=2",
             ease: 'Cubic.easeOut',
             onComplete: () => {
                 this.addTween({
                     targets: this.clockShield,
                     duration: 15000,
                     rotation: "+=3.1415",
                     repeat: -1
                 });
             }
         });
     }

     handleSpecialDamageAbsorption(amt) {
         if (!this.statuses[0]) {
             if (amt > this.health) {
                 amt = this.health + 1;
             }

             let healthText = this.scene.add.bitmapText(gameConsts.halfWidth, 100, 'damage', '', 60).setDepth(999).setOrigin(0.5, 0.5);
             healthText.setText(amt);
             healthText.setScale(0.7 + 0.01 * amt);
             let statusObj = {};
             statusObj = {
                 animObj: healthText,
                 duration: amt,
                 onUpdate: () => {
                     healthText.setScale(0.7 + 0.01 * statusObj.duration);
                     if (this.health == 1) {
                         // drag out last second
                         this.addTimeout(() => {
                             this.die();
                         }, 1000);
                     } else {
                         healthText.setText(Math.max(0, statusObj.duration - 1));
                         this.setHealth(this.health - 1);
                        this.castAggravateCharge = 50;

                         if (!this.isTerrified && !this.freezingTime && this.timeBarraged) {
                            if (this.health % 2 == 0) {
                                if (this.health % 4 == 0) {
                                    playSound('clocktick2', 1);
                                } else {
                                    playSound('clocktick1', 1);
                                }
                            }
                         }
                     }
                 },
                 cleanUp: () => {
                     statusObj.animObj.destroy();
                     this.statuses[0] = null;
                 }
             }
             this.statuses[0] = statusObj;
             messageBus.publish('animateBlockNum', gameConsts.halfWidth + 25 - Math.random()*50, this.sprite.y + 25 - Math.random() * 50, 'DELAYED', 0.9);
         } else {
             messageBus.publish('animateBlockNum', gameConsts.halfWidth + 75 - Math.random()*150, this.sprite.y + 50 - Math.random() * 100, 'DELAYED', 0.75);

             this.statuses[0].duration = Math.min(this.statuses[0].duration + amt, this.health + 1);
             this.statuses[0].animObj.setText(Math.max(0, this.statuses[0].duration - 1));
             this.statuses[0].animObj.setScale(0.7 + 0.01 * this.statuses[0].duration);
         }

         if (this.clockShield.alpha < 0.3) {
             this.clockShield.alpha = 0.5;
             this.addTween({
                 targets: this.clockShield,
                 duration: 400,
                 alpha: 0.15,
                 rotation: "+=0.785",
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
                     rotation: 0.02 * magnitude,
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

     launchAttack(attackTimes = 1, prepareSprite, attackSprites = [], isRepeatedAttack = false) {
         if (this.dead){
             return;
         }
         let extraTimeMult = 0.25 + 0.75 * gameVars.timeSlowRatio;
         if (prepareSprite) {
             this.setSprite(prepareSprite, this.sprite.startScale);
         }
         if (this.nextAttack.attackStartFunction) {
             this.nextAttack.attackStartFunction();
         }
         let pullbackScale = 0.9 * this.sprite.startScale;
         this.attackAnim = this.addTween({
             targets: this.sprite,
             scaleX: pullbackScale,
             scaleY: pullbackScale,
             rotation: 0,
             duration: isRepeatedAttack ? 250 * extraTimeMult : 300 * extraTimeMult,
             ease: 'Cubic.easeOut',
             onComplete: () => {
                 if (this.dead){
                     return;
                 }
                 if (!prepareSprite) {
                     this.setSprite(this.defaultSprite);
                     this.sprite.setScale(pullbackScale);
                 }
                 let attackScale = 1.09 * this.sprite.startScale
                 this.attackAnim = this.addTween({
                     targets: this.sprite,
                     scaleX: attackScale,
                     scaleY: attackScale,
                     duration: isRepeatedAttack ? 300 * extraTimeMult : 350 * extraTimeMult,
                     rotation: 0,
                     ease: 'Cubic.easeIn',
                     onComplete: () => {
                         if (this.dead){
                             return;
                         }
                         if (!isRepeatedAttack) {
                             messageBus.publish("enemyMadeAttack", this.nextAttack.damage);
                         }
                         if (this.dead){
                             return;
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
                             this.launchAttack(attackTimes - 1, prepareSprite, attackSprites, true);
                         } else {
                             this.attackAnim = this.addTween({
                                 targets: this.sprite,
                                 scaleX: this.sprite.startScale,
                                 scaleY: this.sprite.startScale,
                                 rotation: 0,
                                 duration: 550 * extraTimeMult,
                                 ease: 'Cubic.easeInOut'
                             });
                             this.addTimeout(() => {
                                 if (!this.dead) {
                                     this.setSprite(this.defaultSprite);
                                 }
                             }, 550 * extraTimeMult * 0.65 + 200);
                         }
                     }
                 });
             }
         });
     }


     initAttacks() {
         this.attacks = [
             [
                 // 0
                 {
                     name: "}4x2 ",
                     desc: "The Time Magician cautiously\npokes you with his\nwand.",
                     chargeAmt: 550,
                     damage: -1,
                     prepareSprite: 'time_magi_cast.png',
                     attackStartFunction: () => {
                         this.createTimeObject('clock2.png', this.x - 110, this.y - 70);
                         this.createTimeObject('clock3.png', this.x - 35, this.y - 100);
                         this.addTimeout(() => {
                             this.fireTimeObjects(4);
                         }, 800);
                     },
                 },
             ],
             [
                 {
                     name: "+{DELAY INJURIES{+",
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
                 // 1
             ],
             [
                 // 2
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
                         }, 300);
                     },
                 },
                 {
                     name: "}4x3 ",
                     desc: "An advanced magic attack.",
                     chargeAmt: 450,
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
                 {
                     name: "CURSE OF TIME (20?)",
                     desc: "A deadly spell that\nslowly drains your life.",
                     chargeAmt: 450,
                     damage: -1,
                     prepareSprite: 'time_magi_cast_big.png',
                     attackFinishFunction: () => {
                         playSound('time_body');
                         this.currentAttackSetIndex = 3;
                         this.nextAttackIndex = 0;
                         messageBus.publish('playerAddDelayedDamage', 20);
                         let hitEffect = this.addSprite(gameConsts.halfWidth, globalObjects.player.getY(), 'spells', 'clock_back_large_red.png').setDepth(110).setScale(1.2);
                         this.addTween({
                             targets: hitEffect,
                             rotation: "-=1",
                             ease: 'Cubic.easeOut',
                             duration: 900,
                             onComplete: () => {
                                 hitEffect.destroy();
                             }
                         });
                         this.addTween({
                             targets: hitEffect,
                             alpha: 0,
                             scaleX: 1,
                             scaleY: 1,
                             duration: 900
                         });
                         this.usedTimeCurse = true;
                     }
                 },
             ],
             [
                 // 3
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
                             this.addTimeout(() => {
                                 if (!this.timeBarraged) {
                                     this.tickSlow = playSound('tickslow');
                                 }
                             }, 1000);
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
                         if (this.tickSlow) {
                             fadeAwaySound(this.tickSlow, 400, ' ');
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
                     name: "TIME-ATTACK |16 ",
                     desc: "A devastating barrage\nof offensive magic.",
                     chargeAmt: 750,
                     chargeMult: 16,
                     prepareSprite: 'time_magi_cast_big.png',
                     attackStartFunction: () => {
                         this.createTimeObjectHuge('clock1.png', this.x - 95, 60, 100, 1.4);
                     },
                     attackFinishFunction: () => {
                         this.addTimeout(() => {
                             this.fireTimeObjects(16, 600);
                         }, 350);
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
                         this.usingTimeFreeze = false;
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
                 // 4
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
                 // 5
                 {
                     name: "}4 ",
                     desc: "The Time Magician is\nout of magic.",
                     chargeAmt: 500,
                     damage: 4,
                     prepareSprite: ['time_magi_cast.png']
                 },
             ],
             [
                 // 6
                 {
                    name: "COWER",
                    isPassive: true,
                    desc: "The Time Magician is\nafraid of death.",
                    chargeAmt: 1000,
                    chargeMult: 1.1,
                    damage: 0,
                 },
             ]
         ];
     }
     createTimeObject(name, x, y, delay = 0, durMult = 1) {
         let newObj = this.addSprite(x, y, 'enemies', name).setRotation((Math.random() - 0.5) * 3).setScale(0).setDepth(110);
         newObj.durMult = durMult;
         this.timeObjects.push(newObj);
         this.addTween({
             delay: delay,
             targets: newObj,
             scaleX: 1,
             scaleY: 1,
             ease: 'Back.easeOut',
             easeParams: [2],
             rotation: '+=1',
             duration: 300 * durMult,
             onStart: () => {
                 playSound('time_strike');
             }
         });
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

     fireTimeObjects(damage = 10, durBonus = 0) {
         let totalTimeObjects = this.timeObjects.length;
         let projDur = 600 - Math.floor(Math.sqrt(totalTimeObjects) * 50) + durBonus;
         let timeObjectsFired = 0;
         while (this.timeObjects.length > 0) {
             let currObj = this.timeObjects.shift();
             let delayAmt = timeObjectsFired * 160;
             timeObjectsFired++;
             this.addTween({
                 targets: currObj,
                 delay: delayAmt,
                 y: globalObjects.player.getY() - 175 + Math.random() * 10,
                 ease: 'Quad.easeIn',
                 duration: projDur,
                 rotation: (Math.random() - 0.5) * 3,
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
                     messageBus.publish("selfTakeDamage", damage);
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
        if (!this.freezingTime) {
            for (let i = 0; i < this.timeFallObjs.length; i++) {
                let clock = this.timeFallObjs[i];
                clock.y += 0.4 * dt;
                clock.rotation += dt * clock.rotSpeed * 0.004;
                if (clock.y > gameConsts.height + 75) {

                    clock.y = -75;
                    let randFrame = 'temporal' + Math.floor(Math.random() * 10) + ".png";
                    clock.setFrame(randFrame).setRotation(Math.random() * 6);
                    let randDist = 0.25 + Math.random() * 0.45;
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
            let randDist = 0.25 + Math.random() * 0.45;

            let randFrame = 'temporal' + Math.floor(Math.random() * 10) + ".png";
            let newClock = this.addSprite(0, (i * gameConsts.height / (numObjects - 2)) - 70, 'lowq', randFrame).setRotation(Math.random() * 6).setScale(randDist).setDepth(-1);
            newClock.setAlpha(0);

             this.addTween({
                 targets: newClock,
                 alpha: newClock.scaleX * 0.5 - 0.05,
                 duration: 500
             });

            newClock.rotSpeed = (1 + Math.random()) * (Math.random < 0.5 ? 1 : -1);
            this.timeFallObjs.push(newClock);

            newClock.x = gameConsts.width * ((this.availableIndicies[this.lastPlacedIndex] + 0.5) / 5);
            this.lastPlacedIndex = (this.lastPlacedIndex + 1) % this.availableIndicies.length;
        } 
    }
}
