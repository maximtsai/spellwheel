 class KillerRobot extends Enemy {
     constructor(scene, x, y, level) {
         super(scene, x, y, level);
         this.initSprite('robot0.png', 1);
         this.shieldAdded = false;

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
         this.shieldSprite.setFrame('shockEffect9.png').setAlpha(0);

         this.eyeShine = PhaserScene.add.sprite(this.sprite.x, this.sprite.y - 67, 'enemies', 'roboteye.png').setAlpha(0).setScale(this.sprite.startScale * 0.8).setDepth(this.sprite.depth);
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
                             onComplete: () => {
                                 this.sprite.setOrigin(0.5, 0.5).setPosition(this.sprite.x, spriteOrigY).setRotation(0);
                                 this.setDefaultSprite('robot1.png');
                                 globalObjects.magicCircle.enableMovement();

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
         if (prevHealthPercent >= 0.99) {
             if (currHealthPercent < 0.99) {
                 this.currentAttackSetIndex = 1;
                 this.nextAttackIndex = 0;
                 // Going to shield
             }
         }
         if (this.shieldAdded) {
             if (this.shield == 0) {
                 // shield must have broke
                 this.shieldAdded = false;
                 this.interruptCurrentAttack();
                 this.currentAttackSetIndex = 1;
                 this.nextAttackIndex = 0;
             }
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
     }

     shootBullets(damage = 4) {
         if (!this.fireEffect) {
             this.fireEffect = PhaserScene.add.sprite(this.sprite.x, this.sprite.y - 15, 'enemies', 'robot_fire_1.png').setDepth(11);
             this.addToDestructibles(this.fireEffect);
         }
         let fireDelay = 120;
         PhaserScene.time.delayedCall(135, () => {
             if (!this.dead && this.shieldAdded) {
                 this.fireEffect.setVisible(true);
                 this.flashBullet(this.fireEffect, 'big_gun_pow_1', damage)
                 PhaserScene.time.delayedCall(fireDelay, () => {
                     if (!this.dead && this.shieldAdded) {
                         this.fireEffect.setFrame('robot_fire_2.png');
                         this.flashBullet(this.fireEffect, 'big_gun_pow_2', damage)
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
         });
     }

     initAttacks() {
         this.attacks = [
             [
                 // 0
                 {
                     name: gameVars.isHardMode ? "SHINY FORCE FIELD {150 " : "SHINY FORCE FIELD  {120 ",
                     block: gameVars.isHardMode ? 150 : 120,
                     chargeAmt: 50,
                     chargeMult: 5,
                     damage: -1,
                     attackFinishFunction: () => {
                         this.currentAttackSetIndex = 2;
                         this.nextAttackIndex = 0;
                         this.shieldAdded = true;
                     }
                 }
             ],
             [
                 // 1
                 {
                     name: "PROCESSING MISSING SHIELD",
                     chargeAmt: gameVars.isHardMode ? 250 : 300,
                     chargeMult: 5,
                     damage: 0,
                     attackFinishFunction: () => {
                         console.log("Hey")
                     }
                 },
                 {
                     name: "REBOOTING",
                     chargeAmt: gameVars.isHardMode ? 500 : 600,
                     block: gameVars.isHardMode ? 175 : 150,
                     chargeMult: 5,
                     startFunction: () => {
                         this.setDefaultSprite('robot_hide.png');
                     },
                     attackFinishFunction: () => {
                         this.currentAttackSetIndex = 3;
                         this.nextAttackIndex = 0;
                         this.shieldAdded = true;
                         this.setDefaultSprite('robot_laser.png');

                         let oldScale = this.sprite.scaleX;
                         this.sprite.setScale(this.sprite.scaleX * 1.01);
                         this.currAnim = PhaserScene.tweens.add({
                             targets: this.sprite,
                             scaleX: oldScale,
                             scaleY: oldScale,
                             duration: 600,
                             completeDelay: 100,
                             onComplete: () => {
                                 if (!this.dead) {
                                     this.setDefaultSprite('robot1.png');
                                 }
                             }
                         });
                     }
                 }
             ],
             [
                 // 2
                 {
                     name: gameVars.isHardMode ? "}8x2 " : "}8x2 ",
                     chargeAmt: 200,
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
                         let powEffect = getTempPoolObject('spells', 'damageEffect1.png', 'damageEffect1', 150)
                         powEffect.setPosition(gameConsts.halfWidth + (Math.random() - 0.5) * 20).setDepth(998).setScale(1.5);
                     }
                 },
                 {
                     name: gameVars.isHardMode ? "}6x5 " : "}4x5 ",
                     chargeAmt: 250,
                     damage: -1,
                     startFunction: () => {
                         this.pullbackScale = 0.99;
                         this.attackScale = 1.03;
                     },
                     attackStartFunction: () => {
                         if (!this.dead && this.shieldAdded) {
                             playSound('voca_gun');
                             this.setDefaultSprite('robot_shoot.png');
                         }
                     },
                     attackFinishFunction: () => {
                        this.shootBullets(4);
                     }
                 },
             ],
             [
                 // 3
                 {
                     name: "REALIZING SHIELD IS BROKEN",
                     chargeAmt: gameVars.isHardMode ? 250 : 300,
                     chargeMult: 2,
                     damage: 0
                 },
                 {
                     name: "TAKING OUT KNIVES!",
                     chargeAmt: gameVars.isHardMode ? 250 : 300,
                     chargeMult: 5,
                     startFunction: () => {
                         this.setDefaultSprite('gobbo3.png', 0.75);
                     },
                     attackFinishFunction: () => {
                         this.currentAttackSetIndex = 4;
                         this.nextAttackIndex = 0;
                         this.setDefaultSprite('gobbo4.png', 0.75);
                         let oldScale = this.sprite.scaleX;
                         this.sprite.setScale(this.sprite.scaleX * 1.01);
                         this.currAnim = PhaserScene.tweens.add({
                             targets: this.sprite,
                             scaleX: oldScale,
                             scaleY: oldScale,
                             duration: 600,
                             completeDelay: 100,
                             onComplete: () => {
                                 this.setDefaultSprite('gobbo5.png', 0.75);
                             }
                         });
                     }
                 }
             ],
             [
                 // 4 - dual wield attacks
                 {
                     name: "}4x2 ",
                     chargeAmt: gameVars.isHardMode ? 120 : 180,
                     damage: 4,
                     attackTimes: 2,
                     attackSprites: ['gobboAttack1.png', 'gobboAttack2.png']
                 },
                 {
                     name: "}4x3 ",
                     chargeAmt: gameVars.isHardMode ? 130 : 190,
                     damage: 4,
                     attackTimes: 3,
                     attackSprites: ['gobboAttack1.png', 'gobboAttack2.png']
                 },
                 {
                     name: "}4x4 ",
                     chargeAmt: gameVars.isHardMode ? 140 : 200,
                     damage: 4,
                     attackTimes: 4,
                     attackSprites: ['gobboAttack1.png', 'gobboAttack2.png']
                 },
                 {
                     name: "}4x5 ",
                     chargeAmt: gameVars.isHardMode ? 150 : 210,
                     damage: 4,
                     attackTimes: 5,
                     attackSprites: ['gobboAttack1.png', 'gobboAttack2.png']
                 },
                 {
                     name: "LAUGH IN YOUR FACE",
                     chargeAmt: 200,
                     chargeMult: 5,
                     damage: -1,
                     tease: true,
                     attackSprites: ['gobbo4.png']
                 }
             ],
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

}
