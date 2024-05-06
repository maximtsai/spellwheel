 class Magician extends Enemy {
    constructor(scene, x, y, level) {
        super(scene, x, y, level);
        this.initSprite('time_magi.png', 0.75,0, 5);
        ELEMENT_ARRAY = [RUNE_MATTER, RUNE_MIND, RUNE_MIND, RUNE_MATTER, null, null , RUNE_MATTER];
        EMBODIMENT_ARRAY = [RUNE_STRIKE, RUNE_STRIKE, RUNE_ENHANCE, RUNE_PROTECT, null, null, null, RUNE_REINFORCE, RUNE_PROTECT, RUNE_ENHANCE];
        setTimeout(() => {
            this.tutorialButton = createTutorialBtn(this.level);
            this.addToDestructibles(this.tutorialButton);
            this.customBgMusic = playSound('magician_theme_1', 0.95, true);
        }, 1500)
        this.sprite.startY = this.sprite.y;
        this.repeatTweenBreathe();
    }

     initStatsCustom() {
         this.health = 75;
         this.damageNumOffset = 45;
         this.timeObjects = [];
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
         } else if (currHealthPercent < 0.999 && !this.usedTimeShield) {
             this.currentAttackSetIndex = 1;
             this.nextAttackIndex = 0;
         } else if (this.health <= 14 && this.usedTimeShield) {
             if (this.statuses[0] && this.statuses[0].duration >= this.health && !this.isTerrified) {
                 this.isTerrified = true;
                 this.interruptCurrentAttack();
                 this.currentAttackSetIndex = 6;
                 this.nextAttackIndex = 0;
                 this.startReaper();
                 if (this.customBgMusic) {
                     fadeAwaySound(this.customBgMusic, 1000, '');
                 }
                 if (this.clocktickbg) {
                     fadeAwaySound(this.clocktickbg, 1000, '');
                 }
                 setTimeout(() => {
                     if (!this.dead) {
                         this.customBgMusic = playSound('magician_theme_4', 0.4, true);
                         fadeInSound(this.customBgMusic, 0.8);
                     }
                 }, 750)

             }
         } else if (this.health <= 4 && !this.timeTerrified) {
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
             this.scene.tweens.add({
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
         if (this.clocktickbg) {
             this.clocktickbg.stop();
         }
         globalObjects.magicCircle.cancelTimeSlow();
         if (this.clockShield) {
             this.clockShield.alpha += 0.15;
             this.scene.tweens.add({
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

         this.scene.tweens.add({
             targets: this.timeObjects,
             scaleX: 0,
             scaleY: 0,
             duration: 300,
             ease: 'Quad.easeInOut',
             rotation: "+=3",
             onComplete: () => {
                 for (let i = 0; i < this.timeObjects.length; i++) {
                     this.timeObjects[i].destroy();
                 }
                 this.timeObjects = [];
             }
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
     }

     showRune() {
         let rune = this.scene.add.sprite(this.x, this.y - 60, 'tutorial', 'rune_time_large.png').setOrigin(0.5, 0.5).setScale(0.5).setDepth(9999);
         playSound('victory_2');
         this.showFlash(this.x, this.y);
         let banner = this.scene.add.sprite(gameConsts.halfWidth, gameConsts.halfHeight - 40, 'misc', 'victory_banner.png').setScale(100, 1.3).setDepth(9998).setAlpha(0);
         let victoryText = this.scene.add.sprite(gameConsts.halfWidth, gameConsts.halfHeight - 40, 'misc', 'victory_text.png').setScale(0.95).setDepth(9998).setAlpha(0);
         let continueText = this.scene.add.text(gameConsts.width - 15, gameConsts.halfHeight + 2, 'CONTINUE').setAlpha(0).setOrigin(1, 0.5).setAlign('right').setDepth(9998).setFontSize(22);

         PhaserScene.tweens.add({
             targets: rune,
             x: gameConsts.halfWidth,
             scaleX: 1,
             scaleY: 1,
             ease: "Cubic.easeOut",
             duration: 1500,
             onComplete: () => {
             }
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

         PhaserScene.tweens.add({
             targets: rune,
             y: gameConsts.halfHeight - 110,
             ease: 'Cubic.easeOut',
             duration: 400,
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
        this.blackBackground = PhaserScene.add.sprite(gameConsts.halfWidth, gameConsts.halfHeight, 'blackPixel').setScale(500).setAlpha(0).setDepth(-1)
         this.floatingDeath = getFloatingDeath();
         gameVars.deathFlutterDelay = 600;
         this.floatingDeathAnim = this.scene.tweens.add({
             targets: this.floatingDeath,
             duration: 19000,
             alpha: 0.75,
             scaleX: 0.7,
             scaleY: 0.7,
             ease: 'Quad.easeInOut',
         });
         this.scene.tweens.add({
             targets: this.blackBackground,
             duration: 19000,
             alpha: 0.7,
             ease: 'Quad.easeOut',
         });
     }

     setupTimeShield() {
        let lostHealth = this.healthMax - this.health;
         this.heal(Math.floor(lostHealth * 0.33));
         this.specialDamageAbsorptionActive = true;

         this.clockShield = PhaserScene.add.sprite(gameConsts.halfWidth, this.y, 'spells', 'clock_back_large_red.png').setDepth(1).setScale(0.4).setAlpha(0.75);

         this.scene.tweens.add({
             targets: this.clockShield,
             duration: 600,
             alpha: 0.2,
             rotation: "+=2",
             ease: 'Cubic.easeOut',
             onComplete: () => {
                 this.scene.tweens.add({
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
                         setTimeout(() => {
                             this.die();
                         }, 1000);
                     } else {
                         healthText.setText(Math.max(0, statusObj.duration - 1));
                         this.setHealth(this.health - 1);
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
             this.scene.tweens.add({
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
         this.breatheTween = this.scene.tweens.add({
             targets: this.sprite,
             duration: duration,
             y: this.sprite.startY - vertMove,
             ease: 'Quad.easeInOut',
             completeDelay: 150,
             onComplete: () => {
                 this.breatheTween = this.scene.tweens.add({
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
         this.attackAnim = this.scene.tweens.add({
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
                 this.attackAnim = this.scene.tweens.add({
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
                             this.attackAnim = this.scene.tweens.add({
                                 targets: this.sprite,
                                 scaleX: this.sprite.startScale,
                                 scaleY: this.sprite.startScale,
                                 rotation: 0,
                                 duration: 550 * extraTimeMult,
                                 ease: 'Cubic.easeInOut'
                             });
                             setTimeout(() => {
                                 if (!this.dead) {
                                     this.setSprite(this.defaultSprite);
                                 }
                             }, 550 * extraTimeMult * 0.65);
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
                     name: "}4 ",
                     desc: "The Time Magician cautiously\npokes you with his\nwand.",
                     chargeAmt: 300,
                     damage: -1,
                     prepareSprite: 'time_magi_cast_big.png',
                     attackStartFunction: () => {
                         this.createTimeObject('clock2.png', this.x - 25, this.y - 110);
                         setTimeout(() => {
                             this.fireTimeObjects(4);
                         }, 800);
                     },
                 },
             ],
             [
                 {
                     name: "+{DELAY INJURIES{+",
                     desc: "The Time Magician\nslows down his health",
                     chargeAmt: 250,
                     prepareSprite: 'time_magi_cast_big.png',
                     startFunction: () => {
                         this.usedTimeShield = true;
                     },
                     attackFinishFunction: () => {
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
                     chargeAmt: 250,
                     damage: -1,
                     prepareSprite: 'time_magi_cast.png',
                     attackStartFunction: () => {
                         this.createTimeObject('clock2.png', this.x - 120, this.y + 30);
                         this.createTimeObject('clock3.png', this.x - 75, this.y - 20);
                         setTimeout(() => {
                             this.fireTimeObjects(5);
                         }, 300);
                     },
                 },
                 {
                     name: "}4x3 ",
                     desc: "An advanced magic attack.",
                     chargeAmt: 300,
                     damage: -1,
                     prepareSprite: 'time_magi_cast_big.png',
                     attackStartFunction: () => {
                         this.createTimeObject('clock2.png', this.x - 110, this.y - 40);
                         this.createTimeObject('clock3.png', this.x - 60, this.y - 75, 150);
                         this.createTimeObject('clock4.png', this.x + 5, this.y - 90, 300);
                         setTimeout(() => {
                             this.fireTimeObjects(4);
                         }, 800);
                     },
                 },
                 {
                     name: "CURSE OF TIME (20?)",
                     desc: "A deadly spell that\nslowly drains your life.",
                     chargeAmt: 350,
                     damage: -1,
                     prepareSprite: 'time_magi_cast_big.png',
                     attackFinishFunction: () => {
                         playSound('time_body');
                         this.currentAttackSetIndex = 3;
                         this.nextAttackIndex = 0;
                         messageBus.publish('playerAddDelayedDamage', 20);
                         let hitEffect = PhaserScene.add.sprite(gameConsts.halfWidth, globalObjects.player.getY(), 'spells', 'clock_back_large_red.png').setDepth(110).setScale(0.6);
                         this.scene.tweens.add({
                             targets: hitEffect,
                             rotation: "-=1",
                             ease: 'Cubic.easeOut',
                             duration: 900,
                             onComplete: () => {
                                 hitEffect.destroy();
                             }
                         });
                         this.scene.tweens.add({
                             targets: hitEffect,
                             alpha: 0,
                             scaleX: 0.65,
                             scaleY: 0.65,
                             duration: 900
                         });
                         this.usedTimeCurse = true;
                     }
                 },
             ],
             [
                 // 3

                 {
                     name: "!!TIME FREEZE!!",
                     desc: "The Time Magician prepares\nhis most powerful magics.",
                     chargeAmt: 400,
                     chargeMult: 1.5,
                     isBigMove: true,
                     prepareSprite: 'time_magi_cast_big.png',
                     startFunction: () => {
                         setTimeout(() => {
                             let myCustomMusic = this.customBgMusic;
                             fadeAwaySound(myCustomMusic, 2000, ' ');
                             setTimeout(() => {
                                 if (!this.timeBarraged) {
                                     this.tickSlow = playSound('tickslow');
                                 }
                             }, 1000);
                         }, 750);
                         this.usingTimeFreeze = true;
                     },
                     attackFinishFunction: () => {
                         this.timeBarraged = true;
                         if (this.tickSlow) {
                             fadeAwaySound(this.tickSlow, 400, ' ');
                         }
                         playSound('timeSlow');
                         this.magicianTimeEpicTheme = playSound('magician_theme_3', 0.8)
                         globalObjects.magicCircle.timeSlowFromEnemy();
                     }
                 },
                 {
                     name: "TIME-STOPPED ATTACK |6x3 ",
                     desc: "A devastating barrage\nof offensive magic.",
                     chargeAmt: 500,
                     chargeMult: 16,
                     prepareSprite: 'time_magi_cast_big.png',
                     startFunction: () => {
                     },
                     attackStartFunction: () => {
                         this.createTimeObject('clock3.png', this.x - 100, 115, 200);
                         this.createTimeObject('clock4.png', this.x, 100, 300);
                         this.createTimeObject('clock3.png', this.x + 100, 115, 400);
                     },
                     attackFinishFunction: () => {
                         setTimeout(() => {
                             this.fireTimeObjects(6);
                         }, 400);
                     }
                 },
                 {
                     name: "TIME-STOPPED ATTACK |6x6 ",
                     desc: "A devastating barrage\nof offensive magic.",
                     chargeAmt: 750,
                     chargeMult: 16,
                     prepareSprite: 'time_magi_cast_big.png',
                     attackStartFunction: () => {
                         this.createTimeObject('clock4.png', this.x - 200, 105, 100);
                         this.createTimeObject('clock3.png', this.x - 120, 115, 200);
                         this.createTimeObject('clock4.png', this.x - 40, 85, 300);
                         this.createTimeObject('clock3.png', this.x + 40, 105, 400);
                         this.createTimeObject('clock4.png', this.x + 120, 100, 500);
                         this.createTimeObject('clock3.png', this.x + 200, 125, 500);
                     },
                     attackFinishFunction: () => {
                         setTimeout(() => {
                             this.fireTimeObjects(6);
                         }, 500);
                     }
                 },
                 {
                     name: "TIME-STOPPED ATTACK |18 ",
                     desc: "A devastating barrage\nof offensive magic.",
                     chargeAmt: 750,
                     chargeMult: 16,
                     prepareSprite: 'time_magi_cast_big.png',
                     attackStartFunction: () => {
                         this.createTimeObject('clock1.png', this.x - 95, 80, 100, 1.4);
                     },
                     attackFinishFunction: () => {
                         setTimeout(() => {
                             this.fireTimeObjects(18, 500);
                         }, 300);
                     }
                 },
                 {
                     name: "TAKING A BREATHER...",
                     desc: "Time Magician is trying\nto think what to do...",
                     chargeAmt: 200,
                     chargeMult: 1.5,
                     damage: 0,
                     startFunction: () => {
                         globalObjects.magicCircle.cancelTimeSlow();
                         if (!this.dead) {
                             setTimeout(() => {
                                 if (!this.isTerrified) {
                                     this.clocktickbg = playSound('clocktick', 0.2, true);
                                     fadeInSound(this.clocktickbg, 1)
                                 }
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
                     chargeAmt: 300,
                     chargeMult: 1.5,
                     damage: -1,
                     prepareSprite: 'time_magi_cast_big.png',
                     attackStartFunction: () => {
                         this.createTimeObject('clock3.png', this.x - 25, this.y - 110);
                         setTimeout(() => {
                             this.fireTimeObjects(6);
                         }, 800);
                     },
                 },
                 {
                     name: "}4x2 ",
                     desc: "An advanced magic attack.",
                     chargeAmt: 300,
                     chargeMult: 1.5,
                     damage: -1,
                     prepareSprite: 'time_magi_cast_big.png',
                     attackStartFunction: () => {
                         this.createTimeObject('clock2.png', this.x - 110, this.y - 70);
                         this.createTimeObject('clock3.png', this.x - 35, this.y - 100);
                         setTimeout(() => {
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
                     name: "COWER }1 ",
                     desc: "The Time Magician is\nafraid of death.",
                     chargeAmt: 1000,
                     chargeMult: 1.1,
                     damage: 1,
                 },
             ]
         ];
     }
     createTimeObject(name, x, y, delay = 0, durMult = 1) {
         let newObj = PhaserScene.add.sprite(x, y, 'enemies', name).setRotation((Math.random() - 0.5) * 3).setScale(0).setDepth(110);
         newObj.durMult = durMult;
         this.timeObjects.push(newObj);
         this.scene.tweens.add({
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

     fireTimeObjects(damage = 10, durBonus = 0) {
         let totalTimeObjects = this.timeObjects.length;
         let projDur = 550 - Math.floor(Math.sqrt(totalTimeObjects) * 50) + durBonus;
         let timeObjectsFired = 0;
         while (this.timeObjects.length > 0) {
             let currObj = this.timeObjects.shift();
             let delayAmt = timeObjectsFired * 160;
             timeObjectsFired++;
             this.scene.tweens.add({
                 targets: currObj,
                 delay: delayAmt,
                 y: globalObjects.player.getY() - 175 + Math.random() * 10,
                 ease: 'Quad.easeIn',
                 duration: projDur,
                 rotation: (Math.random() - 0.5) * 3,
                 onStart: () => {
                     currObj.setScale(1);
                 },
                 onComplete: () => {
                     currObj.destroy();
                     let dur = 280 - Math.sqrt(totalTimeObjects) * 40;
                     let rot = dur * 0.004;
                     let scaleMult = 1 + durBonus / 800;
                     let hitEffect = PhaserScene.add.sprite(currObj.x, currObj.y, 'spells').play('timeRed').setRotation((Math.random() - 0.5) * 3).setScale(0.35 * scaleMult).setDepth(195);
                     this.scene.tweens.add({
                         targets: hitEffect,
                         scaleX: 0.7 * scaleMult,
                         scaleY: 0.7 * scaleMult,
                         ease: 'Cubic.easeOut',
                         duration: dur,
                         onComplete: () => {
                             hitEffect.destroy();
                         }
                     });
                     this.scene.tweens.add({
                         targets: hitEffect,
                         rotation: "-="+rot,
                         alpha: 0,
                         duration: dur
                     });
                     if (Math.random() < 0.6) {
                         playSound('time_strike_hit');
                     } else {
                         playSound('time_strike_hit_2');
                     }
                     messageBus.publish("selfTakeDamage", damage);
                 }
             });
             this.scene.tweens.add({
                 targets: currObj,
                 delay: delayAmt,
                 x: gameConsts.halfWidth * 0.92 + currObj.x * 0.15,
                 ease: 'Back.easeIn',
                 easeParams: [3],
                 duration: projDur
             });
         }

     }

}
