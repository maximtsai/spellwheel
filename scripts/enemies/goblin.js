 class Goblin extends Enemy {
     constructor(scene, x, y, level) {
         super(scene, x, y, level);
         this.initSprite('gobbo0.png', 0.95);
         this.bgMusic = playSound('fightbg1', 0.7, true);
         this.shieldAdded = false;

         // ELEMENT_ARRAY = [RUNE_MATTER, RUNE_MIND, RUNE_MIND, null, null, null , RUNE_MATTER];

         setTimeout(() => {
             this.tutorialButton = createTutorialBtn(this.level);
             this.addToDestructibles(this.tutorialButton);
         }, 1500)

     }

     initStatsCustom() {
         this.health = gameVars.isHardMode ? 120 : 95;
         this.slashEffect = this.scene.add.sprite(globalObjects.player.getX(), globalObjects.player.getY() - 25, 'misc', 'slash1.png').setScale(0.9).setDepth(130).setAlpha(0);
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
                 if (this.breatheTween) {
                     this.breatheTween.stop();
                 }
                 this.setDefaultSprite('gobbo2.png', 0.95);
                 this.interruptCurrentAttack();
                 this.currentAttackSetIndex = 3;
                 this.nextAttackIndex = 0;
                 playSound('goblin_grunt');
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
                     attackSprites: ['gobbo0_atk.png'],
                     attackFinishFunction: () => {
                         this.makeSlashEffect();
                         playSound('sword_hit', 0.75);
                     }
                 }
             ],
             [
                 // 1
                 {
                     name: gameVars.isHardMode ? "FANCY SHIELD {50 " : "FANCY SHIELD {40 ",
                     desc: "The goblin hoists his\ntrusty shield (which\nwas definitely not stolen)",
                     block: gameVars.isHardMode ? 50 : 40,
                     customCall: " ",
                     chargeAmt: 180,
                     attackFinishFunction: () => {
                         playSound('clunk');

                         this.setDefaultSprite('gobboshield1.png', 0.95).play('gobboshield');
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
                     damage: gameVars.isHardMode ? 12 : 7,
                     attackFinishFunction: () => {
                         playSound('body_slam')
                         let dmgEffect = this.scene.add.sprite(gameConsts.halfWidth + (Math.random() - 0.5) * 20, globalObjects.player.getY() - 185, 'spells', 'damageEffect1.png').setDepth(998).setScale(1.5);
                         setTimeout(() => {
                             dmgEffect.destroy();
                         }, 150)
                     }
                 },
             ],
             [
                 // 3
                 {
                     name: "REALIZING SHIELD BROKE...",
                     chargeAmt: gameVars.isHardMode ? 250 : 300,
                     chargeMult: 2,
                     customCall: " ",
                     damage: 0
                 },
                 {
                     name: "GETTING KNIVES!",
                     chargeAmt: gameVars.isHardMode ? 250 : 250,
                     chargeMult: 5,
                     isBigMove: true,
                     startFunction: () => {
                         this.setDefaultSprite('gobbo3.png', 0.95);
                     },
                     attackFinishFunction: () => {
                         playSound('goblin_aha');
                         this.currentAttackSetIndex = 4;
                         this.nextAttackIndex = 0;
                         this.setDefaultSprite('gobbo4.png', 0.95);
                         let oldScale = this.sprite.scaleX;
                         this.sprite.setScale(this.sprite.scaleX * 1.01);
                         this.currAnim = PhaserScene.tweens.add({
                             targets: this.sprite,
                             scaleX: oldScale,
                             scaleY: oldScale,
                             duration: 600,
                             completeDelay: 100,
                             onComplete: () => {
                                 this.setDefaultSprite('gobbo5.png', 0.95);
                                 this.repeatTweenBreathe(800, 0.5)
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
                     prepareSprite: "",
                     attackSprites: ['gobboAttack1.png', 'gobboAttack2.png'],
                     attackFinishFunction: () => {
                         this.makeSlashEffect();
                     }
                 },
                 {
                     name: "}4x3 ",
                     chargeAmt: gameVars.isHardMode ? 130 : 190,
                     damage: 4,
                     attackTimes: 3,
                     attackSprites: ['gobboAttack1.png', 'gobboAttack2.png'],
                     attackFinishFunction: () => {
                         this.makeSlashEffect();
                     }
                 },
                 {
                     name: "}4x4 ",
                     chargeAmt: gameVars.isHardMode ? 140 : 200,
                     damage: 4,
                     attackTimes: 4,
                     attackSprites: ['gobboAttack1.png', 'gobboAttack2.png'],
                     attackFinishFunction: () => {
                         this.makeSlashEffect();
                     }
                 },
                 {
                     name: "}4x5 ",
                     chargeAmt: gameVars.isHardMode ? 150 : 210,
                     damage: 4,
                     attackTimes: 5,
                     attackSprites: ['gobboAttack1.png', 'gobboAttack2.png'],
                     attackFinishFunction: () => {
                         this.makeSlashEffect();
                     }
                 },
                 {
                     name: "LAUGH IN YOUR FACE",
                     chargeAmt: 250,
                     chargeMult: 5,
                     damage: -1,
                     tease: true,
                     attackSprites: ['gobbo4.png'],
                     attackFinishFunction: () => {
                         playSound('goblin_aha');
                     }
                 }
             ],
         ];
     }

     makeSlashEffect() {
         playSound('sword_slice', 0.7);
         if (this.slashEffectAnim) {
             this.slashEffectAnim.stop();
         }
         let isFlipped = this.slashEffect.scaleX > 0;
         this.slashEffect.setAlpha(1).setScale(isFlipped ? -0.5 : 0.5, 0.4);
         this.slashEffectAnim = PhaserScene.tweens.add({
             targets: this.slashEffect,
             scaleX: isFlipped ? -1 : 1,
             scaleY: 0.6,
             duration: 250,
             ease: 'Cubic.easeOut',
             alpha: 0,
         });
     }

     initSpriteAnim(scale) {
         super.initSpriteAnim(scale);
         this.sprite.startX = this.sprite.x;

         this.repeatTweenBreathe();
     }

     repeatTweenBreathe(duration = 1500, magnitude = 1) {
         if (this.breatheTween) {
             this.breatheTween.stop();
         }
         let horizMove = Math.ceil(3.5 * magnitude);
         this.breatheTween = this.scene.tweens.add({
             targets: this.sprite,
             duration: duration * (Math.random() * 0.5 + 1),
             rotation: -0.02 * magnitude,
             x: this.sprite.startX - horizMove,
             ease: 'Cubic.easeInOut',
             completeDelay: 150,
             onComplete: () => {
                 this.breatheTween = this.scene.tweens.add({
                     targets: this.sprite,
                     duration: duration * (Math.random() * 0.5 + 1),
                     rotation: 0.02 * magnitude,
                     x: this.sprite.startX + horizMove,
                     ease: 'Cubic.easeInOut',
                     completeDelay: 150,
                     onComplete: () => {
                         this.repeatTweenBreathe(duration, magnitude);
                     }
                 });
             }
         });
     }

     destroy() {
         super.destroy();
         this.slashEffect.destroy();
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
             duration: 25,
             onComplete: () => {
                 this.setSprite('gobboDead.png');
                 this.sprite.setRotation(0);
                 this.x -= 5;
                 this.y += 48;
                 setTimeout(() => {
                     this.showFlash(this.x, this.y);
                    setTimeout(() => {
                        let rune = this.scene.add.sprite(this.x, this.y, 'tutorial', 'rune_protect_large.png').setScale(0.5).setDepth(9999);
                        playSound('victory_2');
                        PhaserScene.tweens.add({
                            targets: rune,
                            x: gameConsts.halfWidth,
                            y: gameConsts.halfHeight - 170,
                            scaleX: 1,
                            scaleY: 1,
                            ease: "Cubic.easeOut",
                            duration: 1500,
                            onComplete: () => {
                                this.showVictory(rune);
                            }
                        });
                    }, 250)
                 }, 1400);
             }
         });

     }

}
