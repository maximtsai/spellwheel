 class KillerRobot extends Enemy {
     constructor(scene, x, y, level) {
         super(scene, x, y, level);
         this.initSprite('robot0.png', 0.65);
         this.shieldAdded = false;

         globalObjects.magicCircle.disableMovement();
         this.sprite.alpha = 0;
         this.sprite.setScale(this.sprite.startScale * 0.75);
         setTimeout(() => {
             this.initPreBattleLogic();
         }, 1200);
         // ELEMENT_ARRAY = [RUNE_MATTER, RUNE_MIND, RUNE_MIND, null, null, null , RUNE_MATTER];
     }

     initPreBattleLogic() {
         this.setAsleep()

         this.eyeShine = PhaserScene.add.sprite(this.sprite.x, this.sprite.y - 67, 'enemies', 'roboteye.png').setAlpha(0).setScale(this.sprite.startScale * 0.8).setDepth(this.sprite.depth);
         this.scene.tweens.add({
             targets: this.sprite,
             duration: 3000,
             scaleX: this.sprite.startScale * 1.05,
             scaleY: this.sprite.startScale * 1.05,
             ease: 'Quad.easeOut',
         });
         this.scene.tweens.add({
             delay: 1000,
             targets: this.eyeShine,
             duration: 500,
             scaleX: this.sprite.startScale,
             scaleY: this.sprite.startScale,
             alpha: 0.75,
             ease: 'Back.easeOut',
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
             duration: 3200,
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
                     scaleX: this.sprite.startScale,
                     scaleY: this.sprite.startScale,
                     ease: 'Cubic.easeIn',
                     onComplete: () => {
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
         if (this.shieldAdded && this.currentAttackSetIndex == 2) {
             if (this.shield == 0) {
                 // shield must have broke
                 this.setDefaultSprite('gobbo2.png', 0.75);
                 this.interruptCurrentAttack();
                 this.currentAttackSetIndex = 3;
                 this.nextAttackIndex = 0;
             }
         }
     }

     initAttacks() {
         this.attacks = [
             [
                 // 0
                 {
                     name: gameVars.isHardMode ? "}8 " : "}5 ",
                     desc: "The goblin waves his\nlittle knife in front\nof your face",
                     chargeAmt: 350,
                     damage: gameVars.isHardMode ? 8 : 5,
                     attackSprites: ['gobbo0_atk.png']
                 }
             ],
             [
                 // 1
                 {
                     name: gameVars.isHardMode ? "READYING FANCY SHIELD {50 " : "READYING FANCY SHIELD {40 ",
                     desc: "The goblin hoists his\ntrusty shield (which\nwas definitely not stolen)",
                     block: gameVars.isHardMode ? 50 : 40,
                     chargeAmt: 180,
                     attackFinishFunction: () => {
                         this.setDefaultSprite('gobbo1.png', 0.75);
                         this.currentAttackSetIndex = 2;
                         this.nextAttackIndex = 0;
                         this.shieldAdded = true;
                     }
                 }
             ],
             [
                 // 2 - attacks from behind shield
                 {
                     name: gameVars.isHardMode ? "}12 " : "}7 ",
                     desc: "Goblin rams you with\nhis shield",
                     chargeAmt: 500,
                     damage: gameVars.isHardMode ? 12 : 7
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
