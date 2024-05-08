 class KillerRobot extends Enemy {
     constructor(scene, x, y, level) {
         super(scene, x, y, level);
         this.initSprite('robot0.png', 1);
         this.shieldAdded = false;
         this.sprite.startY = y;

         setTimeout(() => {
             globalObjects.magicCircle.disableMovement();

         }, 900);
         this.sprite.alpha = 0;
         this.sprite.setScale(this.sprite.startScale * 0.75);
         setTimeout(() => {
             this.initPreBattleLogic();
         }, 1200);
         // ELEMENT_ARRAY = [RUNE_MATTER, RUNE_MIND, RUNE_MIND, null, null, null , RUNE_MATTER];
     }

     initPreBattleLogic() {
         this.setAsleep();
         this.shieldSprite.setFrame('shockEffect4.png').setVisible(false).setOrigin(0.5, 0.43);
         this.shieldSprite.startScale = 3;
         this.lastAttackLingerMult = 1.75;
         this.attackSlownessMult = 1.25;

         this.eyeShine = PhaserScene.add.sprite(this.sprite.x, this.sprite.y - 67, 'enemies', 'roboteye.png').setAlpha(0).setScale(this.sprite.startScale * 0.8).setDepth(this.sprite.depth);
         this.blush = PhaserScene.add.sprite(this.sprite.x, this.sprite.y, 'enemies', 'robot_blush.png').setAlpha(0).setScale(this.sprite.startScale * 0.8).setDepth(this.sprite.depth + 1);
         this.scene.tweens.add({
             targets: this.sprite,
             duration: 2500,
             scaleX: this.sprite.startScale * 1.05,
             scaleY: this.sprite.startScale * 1.05,
             ease: 'Quad.easeOut',
         });
         this.scene.tweens.add({
             delay: 250,
             targets: this.eyeShine,
             duration: 500,
             scaleX: this.sprite.startScale,
             scaleY: this.sprite.startScale,
             alpha: 0.75,
             ease: 'Back.easeOut',
             onStart: () => {
                 playSound('power_surge_plain');
             },
             onComplete: () => {
                 this.scene.tweens.add({
                     targets: this.eyeShine,
                     duration: 2000,
                     alpha: 1,
                     scaleX: this.sprite.startScale * 1.2,
                     scaleY: this.sprite.startScale * 1.05,
                     ease: 'Quad.easeOut',
                     onComplete: () => {
                         this.showStartupAnim();
                     }
                 });
             }
         });
         this.scene.tweens.add({
             targets: this.sprite,
             duration: 2500,
             alpha: 1,
             onComplete: () => {
             }
         });
     }

     showStartupAnim() {
         this.tunnelBG = PhaserScene.add.sprite(gameConsts.halfWidth, gameConsts.halfHeight * 0.7, 'backgrounds', 'tunnel2.png').setScale(1).setDepth(-9).setAlpha(0).setOrigin(0.5, 0.35);
         this.scene.tweens.add({
             targets: this.tunnelBG,
             duration: 1400,
             alpha: 1,
         });
         this.scene.tweens.add({
             targets: [this.sprite],
             duration: 700,
             scaleX: this.sprite.startScale * 1.25,
             scaleY: this.sprite.startScale * 1.25,
             ease: 'Cubic.easeOut',
             onComplete: () => {
                 this.scene.tweens.add({
                     targets: [this.sprite],
                     duration: 700,
                     scaleX: this.sprite.startScale * 0.98,
                     scaleY: this.sprite.startScale * 0.98,
                     ease: 'Cubic.easeIn',
                     onComplete: () => {
                         globalObjects.magicCircle.enableMovement();
                         playSound('voca_hello', 0.8);
                         this.sprite.setScale(this.sprite.startScale);
                         this.scene.tweens.add({
                             targets: this.eyeShine,
                             duration: 150,
                             alpha: 0,
                             scaleX: this.sprite.startScale * 0.5,
                             scaleY: this.sprite.startScale * 0.5,
                             rotation: 0,
                         });
                         this.tunnelBG.setFrame('tunnel3.png').setScale(1.02).setOrigin(0.5, 0.35);
                         this.scene.tweens.add({
                             targets: this.tunnelBG,
                             duration: 500,
                             alpha: 0.9,
                             ease: 'Quad.easeOut',
                             scaleX: 1,
                             scaleY: 1,
                         });
                         this.setDefaultSprite('robot_laser.png');
                         let spriteOrigY = this.sprite.y;
                         this.sprite.setOrigin(0.5, 0.95).setPosition(this.sprite.x, this.sprite.y + 150);
                         this.scene.tweens.add({
                             delay: 800,
                             targets: this.sprite,
                             duration: 900,
                             rotation: -0.06,
                             ease: 'Cubic.easeIn',
                             scaleX: this.sprite.startScale * 0.985,
                             scaleY: this.sprite.startScale * 0.985,
                             onStart: () => {
                                 playSound('robot_sfx_1');
                             },
                             onComplete: () => {
                                 this.sprite.setOrigin(0.5, 0.5).setPosition(this.sprite.x, spriteOrigY).setRotation(0);
                                 this.setDefaultSprite('robot1.png');

                                 this.setAwake();
                                 this.loadUpHealthBar();
                                 this.scene.tweens.add({
                                     targets: this.tunnelBG,
                                     duration: 1500,
                                     alpha: 0.8,
                                     ease: 'Quad.easeOut',
                                     scaleX: 1,
                                     scaleY: 1,
                                 });
                             }
                         });
                     }
                 });
             }
         });
         this.scene.tweens.add({
             targets: this.eyeShine,
             duration: 700,
             alpha: 0.95,
             scaleX: this.sprite.startScale * 1.5,
             scaleY: this.sprite.startScale * 1.5,
             rotation: -0.2,
             y: "-=10",
             ease: 'Cubic.easeOut',
             onComplete: () => {
                 this.scene.tweens.add({
                     targets: this.eyeShine,
                     duration: 700,
                     alpha: 1.3,
                     scaleX: this.sprite.startScale * 2.5,
                     scaleY: this.sprite.startScale * 2.5,
                     rotation: 0,
                     y: "+=10",
                     ease: 'Cubic.easeIn',
                 });
             }
         });
     }

     initPreStats() {
         this.delayLoad = true;
         // this.loadUpHealthBar();
     }

     initStatsCustom() {
         this.health = gameVars.isHardMode ? 600 : 500;
         this.nextShieldHealth = 120;
         this.shieldsBroken = 0;
         this.missileObjects = [];
     }

     // update(dt) {}


     setHealth(newHealth) {
         super.setHealth(newHealth);
         let prevHealthPercent = this.prevHealth / this.healthMax;
         let currHealthPercent = this.health / this.healthMax;
         if (currHealthPercent == 0) {
             // dead, can't do anything
             return;
         }
         if (this.shieldAdded && !this.shieldIgnoreGone) {
             if (this.shield == 0) {
                 // shield must have broke
                 playSound('cutesy_down');
                 this.shieldsBroken++;
                 this.cleanUpTweens();
                 this.shieldAdded = false;
                 this.interruptCurrentAttack();
                 this.currentAttackSetIndex = 1;
                 this.nextAttackIndex = 0;
             }
         }
     }

     cleanUpTweens() {
         if (this.backgroundTween) {
             this.backgroundTween.stop();
         }
         if (this.laserTween) {
             this.laserTween.stop();
         }
         if (this.bulletTween) {
             this.bulletTween.stop();
         }
         let backgroundBlack = getBackgroundBlackout();
         backgroundBlack.setAlpha(0);
     }

     initAttacks() {
         this.attacks = [
             [
                 // 0
                 {
                     name: "SHINY FORCE FIELD {" + this.nextShieldHealth + " ",
                     block: this.nextShieldHealth,
                     chargeAmt: 600,
                     chargeMult: 15,
                     damage: -1,
                     attackStartFunction: () => {
                         this.shieldAdded = true;
                         this.shieldIgnoreGone = true;
                         setTimeout(() => {
                             playSound('cutesy_up', 0.8);
                         }, 100);
                     },
                     attackFinishFunction: () => {
                         this.shieldIgnoreGone = false;
                         this.currentAttackSetIndex = 2;
                         this.nextAttackIndex = 0;
                     }
                 }
             ],
             [
                 // 1
                 {
                     name: "ERROR: SHIELD MISSING",
                     chargeAmt: gameVars.isHardMode ? 400 : 400,
                     damage: 0,
                     startFunction: () => {
                         this.blushAnim = PhaserScene.tweens.add({
                             targets: this.blush,
                             scaleX: this.sprite.startScale,
                             scaleY: this.sprite.startScale,
                             alpha: 0.5,
                             ease: 'Back.easeOut',
                             duration: 350,
                             onComplete: () => {
                                 this.blushAnim = PhaserScene.tweens.add({
                                     targets: this.blush,
                                     alpha: 1,
                                     duration: 3000,
                                 })
                             }
                         })
                     },
                     finaleFunction: () => {
                         if (this.blushAnim) {
                             this.blushAnim.stop();
                         }
                     }
                 },
                 {
                     name: "REBOOTING {" + this.nextShieldHealth + " ",
                     chargeAmt: gameVars.isHardMode ? 1000 : 1200,
                     block: this.nextShieldHealth,
                     chargeMult: 5,
                     damage: -1,
                     startFunction: () => {
                         let scaleAmt = gameVars.isHardMode ? 40 : 30;
                         this.nextShieldHealth += 120 + scaleAmt * this.shieldsBroken;
                         this.setDefaultSprite('robot_hide.png');
                         playSound('voca_kya');
                         this.sprite.rotation = 0.15;
                         PhaserScene.tweens.add({
                             targets: [this.sprite, this.blush],
                             y: 240,
                             ease: 'Cubic.easeIn',
                             duration: 550,
                             onComplete: () => {
                                 playSound('clunk2');
                                 setTimeout(() => {
                                     playSound('clunk', 0.6);
                                     setTimeout(() => {
                                         playSound('clunk2', 0.3);
                                     }, 200);
                                 }, 500);
                                 PhaserScene.tweens.add({
                                     targets: this.sprite,
                                     rotation: 0,
                                     ease: 'Bounce.easeOut',
                                     duration: 700,
                                 })
                             }
                         })
                     },
                     attackStartFunction: () => {
                         this.shieldAdded = true;
                         this.shieldIgnoreGone = true;
                         setTimeout(() => {
                             if (!this.dead && this.shieldAdded) {
                                 playSound('robot_sfx_1');

                                 playSound('cutesy_up');
                                 this.setDefaultSprite('robot_laser.png');
                                 this.sprite.y = this.sprite.startY;
                                 this.blush.y = this.sprite.startY;
                                 this.blushAnim = PhaserScene.tweens.add({
                                     targets: this.blush,
                                     alpha: 0,
                                     duration: 500,
                                 })
                                 let oldScale = this.sprite.scaleX;
                                 this.sprite.setScale(this.sprite.scaleX * 1.01);
                                 this.currAnim = PhaserScene.tweens.add({
                                     targets: this.sprite,
                                     scaleX: oldScale,
                                     scaleY: oldScale,
                                     duration: 10,
                                     completeDelay: 600,
                                     onComplete: () => {
                                         if (!this.dead && this.shieldAdded) {
                                             this.setDefaultSprite('robot1.png');
                                         }
                                     }
                                 });
                             }
                         }, 100);
                     },
                     attackFinishFunction: () => {
                         this.shieldIgnoreGone = false;
                         if (this.shieldsBroken === 1) {
                             this.currentAttackSetIndex = 4;
                         } else if (this.shieldsBroken === 2) {
                             this.currentAttackSetIndex = 5;
                         } else if (this.shieldsBroken >= 3) {
                             this.currentAttackSetIndex = 6;
                         }
                         this.nextAttackIndex = 0;
                     }
                 }
             ],
             [
                 // 2
                 {
                     name: "}8x2 ",
                     chargeAmt: 400,
                     damage: 8,
                     attackTimes: 2,
                     attackSprites: ['robot_claw_1.png', 'robot_claw_1.png'],
                     startFunction: () => {
                         this.claw1Attacked = false;
                         this.pullbackScale = this.pullbackScaleDefault;
                         this.attackScale = this.attackScaleDefault;
                     },
                     attackFinishFunction: () => {
                         this.claw1Attacked = !this.claw1Attacked;
                         playSound(this.claw1Attacked ? 'voca_claw_1' : 'voca_claw_2', 0.8);
                         playSound('sword_hit');
                         setTimeout(() => {
                             if (!this.dead && this.shieldAdded) {
                                 this.sprite.setFrame(this.claw1Attacked ? 'robot_claw_2.png' : 'robot_claw_1.png')
                             }
                         }, 80);
                         let powEffect = getTempPoolObject('spells', 'damageEffect1.png', 'damageEffect1', 150);
                         let xOffset = this.claw1Attacked ? -30 : 30;
                         powEffect.setPosition(gameConsts.halfWidth + xOffset, globalObjects.player.getY() - 170).setDepth(998).setScale(1.5);
                     }
                 },
                 {
                     name: "}4x5 ",
                     chargeAmt: 500,
                     damage: -1,
                     startFunction: () => {
                         this.pullbackScale = 0.99;
                         this.attackScale = 1.03;
                     },
                     attackStartFunction: () => {
                         if (!this.dead && this.shieldAdded) {
                             setTimeout(() => {
                                 if (!this.dead && this.shieldAdded) {
                                     playSound('voca_gun');
                                 }
                             }, 200);
                             this.setDefaultSprite('robot_shoot.png');
                         }
                     },
                     attackFinishFunction: () => {
                        this.shootBullets(4);
                     }
                 },
                 {
                     name: "}14 ",
                     chargeAmt: 400,
                     damage: 14,
                     attackTimes: 1,
                     attackSprites: ['robot_claw_1.png'],
                     startFunction: () => {
                         this.claw1Attacked = false;
                         this.pullbackScale = this.pullbackScaleDefault;
                         this.attackScale = this.attackScaleDefault;
                     },
                     attackFinishFunction: () => {
                         this.claw1Attacked = !this.claw1Attacked;
                         playSound('voca_claw_1', 0.7);
                         playSound('voca_claw_2', 0.7);
                         playSound('sword_hit');
                         setTimeout(() => {
                             if (!this.dead && this.shieldAdded) {
                                 this.sprite.setFrame(this.claw1Attacked ? 'robot_claw_2.png' : 'robot_claw_1.png')
                             }
                         }, 80);
                         let powEffect = getTempPoolObject('spells', 'damageEffect1.png', 'damageEffect1', 150);
                         powEffect.setPosition(gameConsts.halfWidth, globalObjects.player.getY() - 170).setDepth(998).setScale(2);
                     }
                 },
             ],
             [
                 // 3
                 {
                     name: "}8x2 ",
                     chargeAmt: 200,
                     damage: 8,
                     attackTimes: 2,
                     attackSprites: ['robot_claw_1.png', 'robot_claw_1.png'],
                     startFunction: () => {
                         this.claw1Attacked = true;
                         this.pullbackScale = this.pullbackScaleDefault;
                         this.attackScale = this.attackScaleDefault;
                     },
                     attackFinishFunction: () => {
                         this.claw1Attacked = !this.claw1Attacked;
                         playSound(this.claw1Attacked ? 'voca_claw_1' : 'voca_claw_2', 0.8);
                         playSound('sword_hit');
                         setTimeout(() => {
                             if (!this.dead && this.shieldAdded) {
                                 this.sprite.setFrame(this.claw1Attacked ? 'robot_claw_2.png' : 'robot_claw_1.png')
                             }
                         }, 80);
                         let powEffect = getTempPoolObject('spells', 'damageEffect1.png', 'damageEffect1', 150)
                         let xOffset = this.claw1Attacked ? -30 : 30;
                         powEffect.setPosition(gameConsts.halfWidth + xOffset, globalObjects.player.getY() - 170).setDepth(998).setScale(1.5);
                     }
                 },
                 {
                     name: "}14 ",
                     chargeAmt: 400,
                     damage: 14,
                     attackTimes: 1,
                     attackSprites: ['robot_claw_1.png'],
                     startFunction: () => {
                         this.claw1Attacked = false;
                         this.pullbackScale = this.pullbackScaleDefault;
                         this.attackScale = this.attackScaleDefault;
                     },
                     attackFinishFunction: () => {
                         this.claw1Attacked = !this.claw1Attacked;
                         playSound('voca_claw_1', 0.7);
                         playSound('voca_claw_2', 0.7);
                         playSound('sword_hit');
                         setTimeout(() => {
                             if (!this.dead && this.shieldAdded) {
                                 this.sprite.setFrame(this.claw1Attacked ? 'robot_claw_2.png' : 'robot_claw_1.png')
                             }
                         }, 80);
                         let powEffect = getTempPoolObject('spells', 'damageEffect1.png', 'damageEffect1', 150);
                         powEffect.setPosition(gameConsts.halfWidth, globalObjects.player.getY() - 170).setDepth(998).setScale(2);
                     }
                 },
             ],
             [
                 // 4 laser
                 {
                     name: "}30 ",
                     chargeAmt: 700,
                     damage: -1,
                     isBigMove: true,
                     startFunction: () => {
                         this.pullbackScale = 0.99;
                         this.attackScale = 1.03;
                     },
                     attackStartFunction: () => {
                         if (!this.dead && this.shieldAdded) {
                             setTimeout(() => {
                                 if (!this.dead && this.shieldAdded) {
                                     playSound('voca_laser');
                                 }
                             }, 200);
                             this.setDefaultSprite('robot_heart.png');
                         }
                     },
                     attackFinishFunction: () => {
                         this.fireLaser(30);
                         this.currentAttackSetIndex = 3;
                         this.nextAttackIndex = 0;
                     }
                 },
             ],
             [
                 // 5 missiles
                 {
                     name: "}6x8 ",
                     chargeAmt: 200,
                     damage: -1,
                     isBigMove: true,
                     startFunction: () => {
                         this.pullbackScale = 0.99;
                         this.attackScale = 1.03;
                     },
                     attackStartFunction: () => {
                         if (!this.dead && this.shieldAdded) {
                             playSound('voca_missile');
                             this.createMissileObject(this.x - 75, this.y + 5, -0.5, 300);
                             this.createMissileObject(this.x + 75, this.y + 5, 0.5, 350);

                             this.createMissileObject(this.x - 60, this.y - 20, -0.3, 200);
                             this.createMissileObject(this.x + 60, this.y - 20, 0.3, 250);

                             this.createMissileObject(this.x - 40, this.y - 30, -0.12, 100);
                             this.createMissileObject(this.x + 40, this.y - 30, 0.12, 150);

                             this.createMissileObject(this.x - 15, this.y - 35, -0.03, 0);
                             this.createMissileObject(this.x + 15, this.y - 35, 0.03, 50);
                         }
                     },
                     attackFinishFunction: () => {
                         this.fireMissiles(6);
                         this.currentAttackSetIndex = 3;
                         this.nextAttackIndex = 0;
                     }
                 },
             ],
             [
                 {
                     name: "}5x5 ",
                     chargeAmt: 500,
                     damage: -1,
                     startFunction: () => {
                         this.pullbackScale = 0.99;
                         this.attackScale = 1.03;
                     },
                     attackStartFunction: () => {
                         if (!this.dead && this.shieldAdded) {
                             setTimeout(() => {
                                 if (!this.dead && this.shieldAdded) {
                                     playSound('voca_gun');
                                 }
                             }, 200);
                             this.setDefaultSprite('robot_shoot.png');
                         }
                     },
                     attackFinishFunction: () => {
                         this.shootBullets(5);
                     }
                 },
                 {
                     name: "}14 ",
                     chargeAmt: 400,
                     damage: 14,
                     attackTimes: 1,
                     attackSprites: ['robot_claw_1.png'],
                     startFunction: () => {
                         this.claw1Attacked = false;
                         this.pullbackScale = this.pullbackScaleDefault;
                         this.attackScale = this.attackScaleDefault;
                     },
                     attackFinishFunction: () => {
                         this.claw1Attacked = !this.claw1Attacked;
                         playSound('voca_claw_1', 0.7);
                         playSound('voca_claw_2', 0.7);
                         playSound('sword_hit');
                         setTimeout(() => {
                             if (!this.dead && this.shieldAdded) {
                                 this.sprite.setFrame(this.claw1Attacked ? 'robot_claw_2.png' : 'robot_claw_1.png')
                             }
                         }, 80);
                         let powEffect = getTempPoolObject('spells', 'damageEffect1.png', 'damageEffect1', 150);
                         powEffect.setPosition(gameConsts.halfWidth, globalObjects.player.getY() - 170).setDepth(998).setScale(2);
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
        if (this.currAnim) {
            this.currAnim.stop();
        }
         this.cleanUpTweens();
         globalObjects.textPopupManager.hideInfoText();

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


         PhaserScene.tweens.add({
             targets: this.sprite,
             rotation: -0.2,
             ease: "Cubic.easeIn",
             duration: 10,
             onComplete: () => {
                 this.setSprite('gobboDead.png', this.sprite.scaleX);
                 this.sprite.setRotation(0);
                 this.x -= 5;
                 this.y += 48;
                this.showFlash(this.x, this.y);


                 let rune = this.scene.add.sprite(this.x, this.y, 'circle', 'rune_protect_glow.png').setOrigin(0.5, 0.15).setScale(0.8).setDepth(9999);
                 PhaserScene.tweens.add({
                     targets: rune,
                     x: gameConsts.halfWidth,
                     y: gameConsts.halfHeight - 170,
                     scaleX: 2,
                     scaleY: 2,
                     ease: "Cubic.easeOut",
                     duration: 1500,
                     onComplete: () => {
                        this.showVictory(rune);
                     }
                 });

             }
         });

     }

     createMissileObject(x, y, rotation = 0, delay = 0) {
         let newObj = PhaserScene.add.sprite(x, y, 'enemies', 'missile.png').setRotation(rotation).setScale(0).setDepth(0).setOrigin(0.5, 1.1);
         this.missileObjects.push(newObj);
         this.scene.tweens.add({
             delay: delay,
             targets: newObj,
             scaleX: 1,
             scaleY: 1,
             ease: 'Back.easeOut',
             easeParams: [2],
             duration: 400
         });
     }

     fireMissiles(damage = 6) {
         let totalObjects = this.missileObjects.length;
         let isFirstMissile = true;
         while (this.missileObjects.length > 0) {
             let currObj = this.missileObjects.pop();
             let missileIndex = this.missileObjects.length;
             let delayAmt = this.missileObjects.length * 140;
             let xGoal = Math.sin(currObj.rotation) * 250;
             let yGoal = -Math.cos(currObj.rotation) * 250;
             this.scene.tweens.add({
                 delay: delayAmt,
                 targets: currObj,
                 x: "+=" + xGoal,
                 y: "+=" + yGoal,
                 duration: 140,
                 onStart: () => {
                     if (isFirstMissile) {
                         playSound('missile_launch_1', 0.8);
                         isFirstMissile = false;
                     } else if (missileIndex === 0) {
                         playSound('missile_launch_1', 0.7);
                     } else if (missileIndex % 2 == 0) {
                         playSound('missile_launch_2', 0.7);
                     }
                 },
                 onComplete: () => {
                     let startX = gameConsts.halfWidth * 0.6 + currObj.x * 0.4;
                     let xOffset = gameConsts.halfWidth - startX;
                     this.scene.tweens.add({
                         targets: currObj,
                         delay: 300,
                         y: globalObjects.player.getY() - 195 + Math.abs(xOffset * 0.3),
                         x: gameConsts.halfWidth * 0.65 + startX * 0.35,
                         ease: 'Quad.easeIn',
                         duration: 300,
                         onStart: () => {
                             currObj.setPosition(startX, -100);
                             currObj.setRotation(Math.PI - xOffset * 0.0007);
                             currObj.setDepth(90);
                         },
                         onComplete: () => {
                             let powEffect = getTempPoolObject('spells', 'damageEffect1.png', 'damageEffect1', 200);
                             powEffect.setPosition(currObj.x, currObj.y).setDepth(999).setScale(1.5).setAlpha(1.2).setRotation(Math.random() - 0.5);
                             this.scene.tweens.add({
                                 targets: powEffect,
                                 scaleX: 2.4,
                                 scaleY: 2.4,
                                 ease: 'Cubic.easeOut',
                                 duration: 200,
                             })
                             this.scene.tweens.add({
                                 targets: powEffect,
                                 alpha: 0,
                                 ease: 'Quad.easeIn',
                                 duration: 200,
                             })
                             currObj.destroy();
                             zoomTemp(1.01);

                             playSound('razor_leaf', 0.75);
                             messageBus.publish("selfTakeDamage", damage);
                         }
                     });
                 }
             });
         }
     }

     flashBullet(bullet, sfx, damage) {
         bullet.setScale(1.05);
         if (this.bulletTween) {
             this.bulletTween.stop();
         }
         this.bulletTween = PhaserScene.tweens.add({
             targets: bullet,
             scaleX: 1,
             scaleY: 1,
             ease: 'Cubic.easeOut',
             duration: 100,
         })
         playSound(sfx);
         messageBus.publish("selfTakeDamage", damage);
         let powEffect = getTempPoolObject('spells', 'damageEffect1.png', 'damageEffect1', 250);
         let randVal = Math.random() - 0.5;
         let yOffset = Math.abs(randVal) * 10 + Math.random() * 5;
         powEffect.setPosition(gameConsts.halfWidth + (Math.random() - 0.5) * 20, globalObjects.player.getY() - 170 + yOffset).setDepth(998).setScale(1.5);
         powEffect.play('damageEffect')
     }

     shootBullets(damage = 4) {
         let fireDelay = 120;
         if (!this.dead && this.shieldAdded) {
             if (!this.fireEffect) {
                 this.fireEffect = PhaserScene.add.sprite(this.sprite.x, this.sprite.y - 15, 'enemies', 'robot_fire_1.png').setDepth(11);
                 this.addToDestructibles(this.fireEffect);
             }
             this.fireEffect.setVisible(true);
             this.flashBullet(this.fireEffect, 'big_gun_pow_1', damage)
             PhaserScene.time.delayedCall(fireDelay, () => {
                 if (!this.dead && this.shieldAdded) {
                     this.fireEffect.setFrame('robot_fire_2.png');
                     this.flashBullet(this.fireEffect, 'big_gun_pow_2', damage);
                     PhaserScene.time.delayedCall(fireDelay, () => {
                         if (!this.dead && this.shieldAdded) {
                             this.fireEffect.setFrame('robot_fire_1.png')
                             this.flashBullet(this.fireEffect, 'big_gun_pow_1', damage)
                             PhaserScene.time.delayedCall(fireDelay, () => {
                                 if (!this.dead && this.shieldAdded) {
                                     this.fireEffect.setFrame('robot_fire_2.png');
                                     this.flashBullet(this.fireEffect, 'big_gun_pow_2', damage)
                                     PhaserScene.time.delayedCall(fireDelay, () => {
                                         if (!this.dead && this.shieldAdded) {
                                             this.fireEffect.setFrame('robot_fire_1.png');
                                             this.flashBullet(this.fireEffect, 'big_gun_pow_1', damage)
                                             PhaserScene.time.delayedCall(fireDelay, () => {
                                                 this.fireEffect.setVisible(false);
                                                 setTimeout(() => {
                                                     if (!this.dead && this.shieldAdded) {
                                                         this.setDefaultSprite('robot1.png');
                                                         this.setSprite('robot1.png');
                                                     }
                                                 }, 250);
                                             });
                                         }
                                     });
                                 }
                             });
                         }
                     });
                 }
             });
         }
     }

     fireLaser(damage = 30) {
         if (!this.dead && this.shieldAdded) {
             if (!this.laserBeam) {
                 this.laserCharge = PhaserScene.add.sprite(this.sprite.x, this.sprite.y - 15, 'enemies', 'robot_charge.png').setDepth(11)
                 this.laserHeart = PhaserScene.add.sprite(this.sprite.x, this.sprite.y - 15, 'enemies', 'robot_blast.png').setDepth(11).setOrigin(0.5, 0.65);
                 this.laserBeam = PhaserScene.add.sprite(this.sprite.x, this.sprite.y - 5, 'enemies', 'robot_laser_fire.png').setDepth(11).setOrigin(0.5, 0.1);
                 this.addToDestructibles(this.laserHeart);
                 this.addToDestructibles(this.laserCharge);
                 this.addToDestructibles(this.laserBeam);
             }
             let backgroundBlack = getBackgroundBlackout();
             backgroundBlack.setDepth(-1).setAlpha(0);
             this.backgroundTween = PhaserScene.tweens.add({
                 targets: backgroundBlack,
                 alpha: 0.4,
                 duration: 1000,
             });

             this.laserCharge.setScale(0.2).setAlpha(0.5);
             this.laserHeart.setScale(0.25).setAlpha(0);
             this.laserBeam.setScale(1).setVisible(false);
             this.laserTween = PhaserScene.tweens.add({
                 targets: this.laserCharge,
                 scaleX: 0.3,
                 scaleY: 0.3,
                 alpha: 0.75,
                 easeParams: [4],
                 ease: 'Back.easeOut',
                 duration: 400,
                 onComplete: () => {
                     this.laserCharge.setAlpha(0.5);
                     this.laserCharge.setRotation(this.laserCharge.rotation + 0.4 + Math.random() * 0.4);
                     this.laserTween = PhaserScene.tweens.add({
                         targets: this.laserCharge,
                         scaleX: 0.5,
                         scaleY: 0.5,
                         alpha: 0.75,
                         easeParams: [4],
                         ease: 'Back.easeOut',
                         duration: 400,
                         onComplete: () => {
                             this.laserCharge.setAlpha(0.5);
                             this.laserCharge.setRotation(this.laserCharge.rotation + 0.4 + Math.random() * 0.4);
                             this.laserTween = PhaserScene.tweens.add({
                                 targets: this.laserCharge,
                                 scaleX: 0.75,
                                 scaleY: 0.75,
                                 alpha: 0.85,
                                 easeParams: [4],
                                 ease: 'Back.easeOut',
                                 duration: 600,
                                 onComplete: () => {
                                     this.laserCharge.setRotation(this.laserCharge.rotation + 0.4 + Math.random() * 0.4).setScale(0.65);
                                     this.laserHeart.setAlpha(1.1);
                                     PhaserScene.tweens.add({
                                         targets: this.laserHeart,
                                         scaleX: 0.75,
                                         scaleY: 0.75,
                                         ease: 'Quint.easeOut',
                                         duration: 750,
                                     })

                                     PhaserScene.tweens.add({
                                         targets: this.laserHeart,
                                         alpha: 0,
                                         ease: 'Quad.easeIn',
                                         duration: 750,
                                     });
                                     this.animateLaserBeam(damage);
                                 }
                             })
                         }
                     })
                 }
             })
         }
     }

     animateLaserBeam(damage) {
         if (this.backgroundTween) {
             this.backgroundTween.stop();
         }
         let backgroundBlack = getBackgroundBlackout();
         playSound('robot_laser');
         backgroundBlack.setAlpha(0.7);
         this.laserBeam.setVisible(true);
         let delayInterval = 50;
         this.laserTween = PhaserScene.tweens.add({
             delay: delayInterval,
             targets: this.laserBeam,
             scaleX: 1.08,
             scaleY: 1.08,
             duration: 10,
             ease: 'Quint.easeOut',
             onComplete: () => {
                 this.laserCharge.setRotation(this.laserCharge.rotation + 0.4 + Math.random() * 0.4).setScale(0.65);
                 this.laserTween = PhaserScene.tweens.add({
                     delay: delayInterval,
                     targets: this.laserBeam,
                     scaleX: 1,
                     scaleY: 1,
                     duration: 10,
                     ease: 'Quint.easeOut',
                     onComplete: () => {
                         this.laserCharge.setRotation(this.laserCharge.rotation + 0.4 + Math.random() * 0.4).setScale(0.65);
                         this.laserTween = PhaserScene.tweens.add({
                             delay: delayInterval,
                             targets: this.laserBeam,
                             scaleX: 1.1,
                             scaleY: 1.08,
                             duration: 10,
                             ease: 'Quint.easeOut',
                             onComplete: () => {
                                 zoomTemp(1.01);
                                 this.laserCharge.setRotation(this.laserCharge.rotation + 0.4 + Math.random() * 0.4).setScale(0.65);
                                 this.laserTween = PhaserScene.tweens.add({
                                     delay: delayInterval,
                                     targets: this.laserBeam,
                                     scaleX: 1,
                                     scaleY: 1,
                                     duration: 10,
                                     ease: 'Quint.easeOut',
                                     onComplete: () => {
                                         zoomTemp(1.01);
                                         this.laserCharge.setRotation(this.laserCharge.rotation + 0.4 + Math.random() * 0.4).setScale(0.65);
                                         this.laserTween = PhaserScene.tweens.add({
                                             delay: delayInterval,
                                             targets: this.laserBeam,
                                             scaleX: 1.15,
                                             scaleY: 1.08,
                                             duration: 10,
                                             ease: 'Quint.easeOut',
                                             onComplete: () => {
                                                 this.laserCharge.setRotation(this.laserCharge.rotation + 0.4 + Math.random() * 0.4).setScale(0.65);
                                                 this.laserTween = PhaserScene.tweens.add({
                                                     delay: delayInterval * 0.5,
                                                     targets: this.laserBeam,
                                                     scaleX: 1.1,
                                                     scaleY: 1.05,
                                                     duration: 10,
                                                     ease: 'Quint.easeOut',
                                                     onComplete: () => {
                                                         zoomTemp(1.02);
                                                         this.laserCharge.setRotation(this.laserCharge.rotation + 0.4 + Math.random() * 0.4).setScale(0.65);
                                                         this.laserTween = PhaserScene.tweens.add({
                                                             delay: delayInterval * 0.5,
                                                             targets: this.laserBeam,
                                                             scaleX: 1.25,
                                                             scaleY: 1.1,
                                                             duration: 10,
                                                             ease: 'Quint.easeOut',
                                                             onComplete: () => {
                                                                 this.laserCharge.setRotation(this.laserCharge.rotation + 0.4 + Math.random() * 0.4).setScale(0.65);
                                                                 this.laserHeart.setAlpha(1).setScale(0.25).setPosition(gameConsts.halfWidth, globalObjects.player.getY() - 150);
                                                                 PhaserScene.tweens.add({
                                                                     targets: this.laserHeart,
                                                                     scaleX: 0.65,
                                                                     scaleY: 0.65,
                                                                     duration: 900,
                                                                     ease: 'Cubic.easeOut',
                                                                 });
                                                                 PhaserScene.tweens.add({
                                                                     targets: this.laserHeart,
                                                                     alpha: 0,
                                                                     ease: 'Quad.easeIn',
                                                                     duration: 900,
                                                                 });
                                                                 backgroundBlack.setAlpha(1);
                                                                 playSound('time_strike_hit_2');
                                                                 messageBus.publish("selfTakeDamage", damage);
                                                                 zoomTemp(1.02);
                                                                 PhaserScene.tweens.add({
                                                                     targets: backgroundBlack,
                                                                     alpha: 0,
                                                                     duration: 400,
                                                                 });
                                                                 PhaserScene.tweens.add({
                                                                     targets: this.laserCharge,
                                                                     alpha: 0,
                                                                     scaleX: 0.5,
                                                                     scaleY: 0.5,
                                                                     duration: 150,
                                                                     ease: 'Cubic.easeIn',
                                                                 });
                                                                 this.laserTween = PhaserScene.tweens.add({
                                                                     delay: delayInterval,
                                                                     targets: this.laserBeam,
                                                                     scaleX: 1,
                                                                     scaleY: 1,
                                                                     duration: 500,
                                                                     ease: 'Quint.easeOut',
                                                                     onStart: () => {
                                                                         this.laserBeam.setVisible(false);
                                                                     },
                                                                     onComplete: () => {
                                                                         playSound('robot_sfx_2');
                                                                         this.setDefaultSprite('robot1.png');
                                                                     }
                                                                 });
                                                             }
                                                         });
                                                     }
                                                 });
                                             }
                                         });
                                     }
                                 });
                             }
                         });
                     }
                 });
             }
         });
     }

}
