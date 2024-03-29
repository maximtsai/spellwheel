 class Magician extends Enemy {
    constructor(scene, x, y) {
        super(scene, x, y);
        this.initSprite('time_magi.png', 0.75,0, 5);
        ELEMENT_ARRAY = [RUNE_MATTER, RUNE_MIND, RUNE_MIND, RUNE_MATTER, null, null , RUNE_MATTER];
        EMBODIMENT_ARRAY = [RUNE_STRIKE, RUNE_STRIKE, RUNE_ENHANCE, RUNE_PROTECT, null, null, null, RUNE_REINFORCE, RUNE_PROTECT, RUNE_ENHANCE];
    }

     initStatsCustom() {
         this.health = 160;
         this.damageNumOffset = 45;
         this.timeObjects = [];
     }

     createTimeObject(name, x, y, delay = 0) {
         let newObj = PhaserScene.add.sprite(x, y, 'enemies', name).setRotation((Math.random() - 0.5) * 3).setScale(0).setDepth(110);
         this.timeObjects.push(newObj);
         this.scene.tweens.add({
             delay: delay,
             targets: newObj,
             scaleX: 1,
             scaleY: 1,
             ease: 'Back.easeOut',
             easeParams: [2],
             rotation: '+=1',
             duration: 300
         });
     }

     fireTimeObjects(damage = 10) {
        let totalTimeObjects = this.timeObjects.length;
        let projDur = 550 - Math.floor(Math.sqrt(totalTimeObjects) * 50);
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
                    let dur = 250 - Math.sqrt(totalTimeObjects) * 40;
                    let rot = dur * 0.004;
                    let hitEffect = PhaserScene.add.sprite(currObj.x, currObj.y, 'spells', 'timeRed.png').setRotation((Math.random() - 0.5) * 3).setScale(0.25).setDepth(195);
                    this.scene.tweens.add({
                        targets: hitEffect,
                        scaleX: 0.75,
                        scaleY: 0.75,
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
                    messageBus.publish("selfTakeDamage", damage);
                }
            });
            this.scene.tweens.add({
                targets: currObj,
                delay: delayAmt,
                x: gameConsts.halfWidth * 0.85 + currObj.x * 0.15,
                ease: 'Back.easeIn',
                easeParams: [3],
                duration: projDur
            });
        }

     }

     setHealth(newHealth) {
         super.setHealth(newHealth);
         let prevHealthPercent = this.prevHealth / this.healthMax;
         let currHealthPercent = this.health / this.healthMax;
         if (newHealth <= 0) {
             this.playDeathAnimation();
         }
         if (currHealthPercent == 0) {
             // dead, can't do anything
             return;
         }
         if (this.specialDamageAbsorptionActive) {
             this.animateShake();
             let healthBarRatio = 1 + this.healthBarLengthMax * this.health / this.healthMax;
             this.healthBarCurr.scaleX = healthBarRatio;
             this.healthBarText.setText(this.health);
             if (this.health <= 0) {
                 this.die();
             }
         }


         if (this.usingTimeFreeze) {
             // no change
         } else if (this.health <= 14 && this.usedTimeShield) {
             if (this.launchedTimeFreeze && !this.isTerrified) {
                 this.isTerrified = true;
                 this.setDefaultSprite('time_magi_terrified.png', 0.75);
                 this.currentAttackSetIndex = 6;
                 this.nextAttackIndex = 0;
             }
         } else if (currHealthPercent < 0.4 && !this.usedTimeShield && !this.isTerrified && this.launchedTimeFreeze) {
             this.usedTimeShield = true;
             this.setDefaultSprite('time_magi_nervous.png', 0.75);
             this.interruptCurrentAttack();
             this.currentAttackSetIndex = 4;
             this.nextAttackIndex = 0;
         } else if (currHealthPercent < 0.65 && !this.launchedTimeFreeze) {
             this.currentAttackSetIndex = 3;
             this.nextAttackIndex = 0;
             this.launchedTimeFreeze = true;
             this.usingTimeFreeze = true;
         } else if (currHealthPercent < 0.999 && !this.launchedTimeFreeze && !this.usedTimeCurse) {
             this.usedTimeCurse = true;
             this.currentAttackSetIndex = 1;
             this.nextAttackIndex = 0;
         }

     }

     die() {
        super.die();

         if (this.currAnim) {
             this.currAnim.stop();
         }
         this.setDefaultSprite('time_magi_terrified.png', 0.72);
         globalObjects.magicCircle.cancelTimeSlowFromEnemy();
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

     setupTimeShield() {
         this.specialDamageAbsorptionActive = true;

         this.clockShield = PhaserScene.add.sprite(gameConsts.halfWidth, this.y, 'spells', 'clock_back_large_red.png').setDepth(1).setScale(0.4).setAlpha(0.7);
         this.scene.tweens.add({
             targets: this.clockShield,
             duration: 15000,
             rotation: "+=3.1415",
             repeat: -1
         });
         this.scene.tweens.add({
             targets: this.clockShield,
             duration: 600,
             alpha: 0.1,
             rotation: "+=2",
             ease: 'Cubic.easeOut',
         });
     }

     handleSpecialDamageAbsorption(amt) {
         if (!this.statuses[0]) {
             let healthText = this.scene.add.bitmapText(gameConsts.halfWidth, 100, 'damage', '', 60).setDepth(999).setOrigin(0.5, 0.5);
             healthText.setText(amt);
             healthText.setScale(0.7 + 0.01 * amt);
             let statusObj = {};
             statusObj = {
                 animObj: healthText,
                 duration: amt,
                 onUpdate: () => {
                     healthText.setText(Math.max(0, statusObj.duration - 1));
                     healthText.setScale(0.7 + 0.01 * statusObj.duration);
                     this.setHealth(this.health - 1);
                 },
                 cleanUp: () => {
                     statusObj.animObj.destroy();
                     this.statuses[0] = null;
                 }
             }
             this.statuses[0] = statusObj;
         } else {
             this.statuses[0].duration += amt;
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
                             messageBus.publish("enemyMadeAttack");
                         }
                         this.triggerVoidFeedback();
                         if (this.dead){
                             return;
                         }

                         if (this.health > 0) {
                             messageBus.publish("selfTakeDamage", this.nextAttack.damage);
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

    // update(dt) {}

    // reset(x, y) {
    //     this.x = x;
    //     this.y = y;
    // }
     initAttacks() {
         this.attacks = [
             [
                 // 0
                 {
                     name: "}5 ",
                     desc: "The Time Magician cautiously\npokes you with his\nwand.",
                     chargeAmt: 250,
                     damage: 5,
                     prepareSprite: 'time_magi_cast.png'
                 },
             ],
             [
                 // 1
                 {
                     name: "CURSE OF TIME (???)",
                     desc: "A deadly spell that\nslowly drains your life.",
                     chargeAmt: 375,
                     damage: 1,
                     prepareSprite: 'time_magi_cast_big.png',
                     attackFinishFunction: () => {
                         let currHealthPercent = this.health / this.healthMax;
                         if (currHealthPercent < 0.65) {
                             this.currentAttackSetIndex = 3;
                             this.nextAttackIndex = 0;
                         } else {
                             this.currentAttackSetIndex = 2;
                             this.nextAttackIndex = 0;
                         }
                         messageBus.publish('playerAddDelayedDamage', 29);
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

                     }
                 }
             ],
             [
                 // 2
                 {
                     name: "}8 ",
                     desc: "A basic magic attack.",
                     chargeAmt: 250,
                     damage: -1,
                     prepareSprite: 'time_magi_cast.png',
                     attackStartFunction: () => {
                         this.createTimeObject('clock3.png', this.x - 75, this.y - 20);
                         setTimeout(() => {
                             this.fireTimeObjects(8);
                         }, 300);
                     },
                 },
                 {
                     name: "}6x3 ",
                     desc: "An advanced magic attack.",
                     chargeAmt: 340,
                     damage: -1,
                     prepareSprite: 'time_magi_cast_big.png',
                     attackStartFunction: () => {
                         this.createTimeObject('clock2.png', this.x - 110, this.y - 40);
                         this.createTimeObject('clock3.png', this.x - 60, this.y - 75, 150);
                         this.createTimeObject('clock4.png', this.x + 5, this.y - 90, 300);
                         setTimeout(() => {
                             this.fireTimeObjects(6);
                         }, 800);
                     },
                 }
             ],
             [
                 // 3
                 {
                     name: "TIME FREEZE (???)",
                     desc: "The Time Magician prepares\nhis most powerful magics.",
                     chargeAmt: 450,
                     prepareSprite: 'time_magi_cast_big.png',
                     attackFinishFunction: () => {
                         globalObjects.magicCircle.timeSlowFromEnemy();
                     }
                 },
                 {
                     name: "TIME-STOPPED ATTACK }7x6 ",
                     desc: "A devastating barrage\nof offensive magic.",
                     chargeAmt: 1000,
                     chargeMult: 15,
                     prepareSprite: 'time_magi_cast_big.png',
                     attackStartFunction: () => {
                         this.createTimeObject('clock3.png', this.x - 200, 130, 0);
                         this.createTimeObject('clock4.png', this.x - 120, 105, 100);
                         this.createTimeObject('clock3.png', this.x - 40, 115, 200);
                         this.createTimeObject('clock4.png', this.x + 40, 100, 300);
                         this.createTimeObject('clock3.png', this.x + 120, 135, 400);
                         this.createTimeObject('clock4.png', this.x + 200, 125, 500);

                     },
                     attackFinishFunction: () => {
                         setTimeout(() => {
                             this.fireTimeObjects(7);
                             setTimeout(() => {
                                 globalObjects.magicCircle.cancelTimeSlowFromEnemy();
                             }, 300);
                         }, 500);
                         let currHealthPercent = this.health / this.healthMax;
                         if (currHealthPercent < 0.35 && !this.isTerrified ) {
                             this.setDefaultSprite('time_magi_nervous.png', 0.75);
                             this.interruptCurrentAttack();
                             this.currentAttackSetIndex = 4;
                             this.nextAttackIndex = 0;
                         }
                         this.usingTimeFreeze = false;
                     }
                 },
                 {
                     name: "TAKING A BREATHER...",
                     desc: "Time Magician is trying\nto think what to do...",
                     chargeAmt: 125,
                     chargeMult: 1.5,
                     damage: 0,
                     attackFinishFunction: () => {
                         let currHealthPercent = this.health / this.healthMax;
                         if (this.isTerrified) {

                         } else if (currHealthPercent < 0.4) {
                             this.setDefaultSprite('time_magi_nervous.png', 0.75);
                             this.interruptCurrentAttack();
                             this.currentAttackSetIndex = 4;
                             this.nextAttackIndex = 0;
                         } else {
                             // normal attacks
                             this.currentAttackSetIndex = 2;
                             this.nextAttackIndex = 0;
                         }
                     }
                 }
             ],
             [
                 // 4
                 {
                     name: "TIME SHIELD (???)",
                     desc: "The Time Magician is\ngetting worried",
                     chargeAmt: 300,
                     chargeMult: 1.5,
                     prepareSprite: 'time_magi_cast_big.png',
                     startFunction: () => {
                         this.setDefaultSprite('time_magi_nervous.png', 0.75);
                     },
                     attackFinishFunction: () => {
                         this.setupTimeShield();
                         this.currentAttackSetIndex = 5;
                         this.nextAttackIndex = 0;
                     }
                 },
             ],
             [
                 // 5
                 {
                     name: "}7 ",
                     desc: "The Time Magician is\nout of magic.",
                     chargeAmt: 200,
                     chargeMult: 1.1,
                     damage: 7,
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

}
