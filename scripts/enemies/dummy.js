 class Dummy extends Enemy {
    constructor(scene, x, y) {
        super(scene, x, y);
        this.initSprite('dummy.png', 0.75,0, 5);
    }

     initStatsCustom() {
         this.health = 80;
         this.isAsleep = true;
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

         if (this.canAngryEyes && !this.angryEyes) {
             this.angryEyes = true;
             this.flash = this.scene.add.sprite(this.x - 200, this.y - 82, 'lowq', 'flash.webp').setOrigin(0.5, 0.5).setScale(this.sprite.startScale * 0.5).setDepth(999);
             this.brows = this.scene.add.sprite(this.x - 200, this.y - 82, 'enemies', 'dummybrows.png').setOrigin(0.5, 0.75).setScale(this.sprite.startScale * 0.25).setDepth(999);

             PhaserScene.tweens.add({
                 targets: this.brows,
                 scaleX: this.sprite.startScale + 0.5,
                 scaleY: this.sprite.startScale + 0.5,
                 ease: 'Quad.easeOut',
                 duration: 800,
             });

             PhaserScene.tweens.add({
                 targets: this.flash,
                 rotation: 3,
                 scaleX: this.sprite.startScale * 2,
                 scaleY: this.sprite.startScale * 2,
                 ease: 'Quad.easeIn',
                 duration: 800,
                 onComplete: () => {
                     PhaserScene.tweens.add({
                         targets: this.flash,
                         rotation: 6,
                         scaleX: 0,
                         scaleY: 0,
                         duration: 800,
                         onComplete: () => {
                             this.flash.destroy();
                         }
                     });
                     PhaserScene.tweens.add({
                         targets: this.brows,
                         x: this.x - 3,
                         y: this.y - 82,
                         scaleX: this.sprite.startScale + 0.05,
                         scaleY: this.sprite.startScale + 0.05,
                         duration: 3500,
                         ease: 'Quad.easeInOut',
                         onComplete: () => {
                             if (this.eyes) {
                                 this.removeExtraSprite(this.eyes);
                                 this.eyes.destroy();
                             }
                             this.brows.destroy();
                             if (this.health > 0) {
                                 this.setSprite('dummy_angry.png', 0.75);
                                 this.currAnim = PhaserScene.tweens.add({
                                     targets: this.sprite,
                                     scaleX: this.sprite.startScale + 0.2,
                                     scaleY: this.sprite.startScale + 0.2,
                                     duration: 500,
                                     ease: 'Quart.easeOut',
                                     onComplete: () => {
                                         this.currAnim = PhaserScene.tweens.add({
                                             targets: this.sprite,
                                             scaleX: this.sprite.startScale,
                                             scaleY: this.sprite.startScale,
                                             duration: 375,
                                             ease: 'Quart.easeIn',
                                             onComplete: () => {
                                                 zoomTemp(1.03);
                                                 if (newHealth <= 0) {
                                                     this.playDeathAnimation();
                                                 } else {
                                                     this.isAsleep = false;
                                                     this.currentAttackSetIndex = 0;
                                                     this.nextAttackIndex = 0;
                                                 }

                                                 let shinePattern = this.scene.add.sprite(this.x, this.y, 'spells', 'brickPattern2.png').setScale(this.sprite.startScale + 0.25).setDepth(-1);
                                                 PhaserScene.tweens.add({
                                                     targets: shinePattern,
                                                     scaleX: this.sprite.startScale * 0.5,
                                                     scaleY: this.sprite.startScale * 0.5,
                                                     duration: 1000,
                                                     ease: 'Cubic.easeIn'
                                                 });
                                                 PhaserScene.tweens.add({
                                                     targets: shinePattern,
                                                     alpha: 0,
                                                     ease: 'Cubic.easeIn',
                                                     duration: 1000,
                                                 });
                                             }
                                         });
                                     }
                                 });
                             }
                         }
                     });
                 }
             });
         }

         if (prevHealthPercent >= 0.92) {
             if (currHealthPercent < 0.92) {
                 this.canAngryEyes = true;
                 this.eyes = this.scene.add.sprite(this.x - 3, this.y - 79, 'enemies', 'dummyeyes.png').setOrigin(0.5, 0.75).setScale(this.sprite.startScale, 0);
                 PhaserScene.tweens.add({
                     targets: this.eyes,
                     scaleY: this.sprite.startScale,
                     ease: "Back.easeOut",
                     duration: 350
                 });
                 this.addExtraSprite(this.eyes, -3, -79)
             }
         }
     }

     playDeathAnimation() {
        if (this.isPlayingDeathAnim) {
            return;
        }
        this.isPlayingDeathAnim = true;
         if (this.eyes) {
             this.eyes.destroy();
         }
        if (this.flash) {
            this.flash.destroy();
        }
        if (this.brows) {
            this.brows.destroy();
        }
        if (this.currAnim) {
            this.currAnim.stop();
        }
        this.sprite.setScale(this.sprite.startScale);

        this.x += 10;
         this.y += this.sprite.height * this.sprite.scaleY * 0.45; this.sprite.y = this.y;
         this.sprite.setOrigin(0.5, 0.95);
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
             rotation: -1.25,
             ease: "Cubic.easeIn",
             duration: 1000,
             onComplete: () => {
                 this.x -= 80;
                 this.y += 39;
                 this.setSprite('dummy_broken.png', this.sprite.scaleX);
                 this.sprite.setOrigin(0.5, 0.95);
                 this.flash = this.scene.add.sprite(this.x, this.y - 75, 'lowq', 'flash.webp').setOrigin(0.5, 0.5).setScale(this.sprite.startScale * 0.5).setDepth(999);

                 PhaserScene.tweens.add({
                     targets: this.flash,
                     rotation: 2,
                     scaleX: this.sprite.startScale,
                     scaleY: this.sprite.startScale,
                     ease: 'Quad.easeIn',
                     duration: 500,
                     onComplete: () => {
                         PhaserScene.tweens.add({
                             targets: this.flash,
                             rotation: 4,
                             scaleX: 0,
                             scaleY: 0,
                             duration: 500,
                             ease: 'Quad.easeOut',
                             onComplete: () => {
                                 this.flash.destroy();
                             }
                         });
                     }
                 });

                 let rune = this.scene.add.sprite(this.x, this.y - 75, 'circle', 'rune_reinforce_glow.png').setOrigin(0.5, 0.15).setScale(0.8).setDepth(999);
                 PhaserScene.tweens.add({
                     targets: rune,
                     x: gameConsts.halfWidth,
                     scaleX: 2,
                     scaleY: 2,
                     ease: "Cubic.easeOut",
                     duration: 1500,
                     onComplete: () => {
                         let banner = this.scene.add.sprite(gameConsts.halfWidth, gameConsts.halfHeight - 40, 'misc', 'victory_banner.png').setScale(100, 1.3).setDepth(998).setAlpha(0);
                         let victoryText = this.scene.add.sprite(gameConsts.halfWidth, gameConsts.halfHeight - 40, 'misc', 'victory_text.png').setScale(0.95).setDepth(998).setAlpha(0);
                         let runeAcquired = this.scene.add.text(gameConsts.halfWidth, gameConsts.halfHeight + 2, 'NEW RUNE ACQUIRED').setAlpha(0).setOrigin(0.5, 0.5).setAlign('center').setDepth(998).setFontSize(22);
                         let continueText = this.scene.add.text(gameConsts.width - 15, gameConsts.halfHeight + 2, 'CONTINUE').setAlpha(0).setOrigin(1, 0.5).setAlign('right').setDepth(998).setFontSize(22);

                         PhaserScene.tweens.add({
                             targets: banner,
                             alpha: 0.75,
                             duration: 500,
                         });

                         PhaserScene.tweens.add({
                             targets: [victoryText, runeAcquired],
                             alpha: 1,
                             ease: 'Quad.easeOut',
                             duration: 500,
                         });
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
                             y: "+=23",
                             ease: 'Cubic.easeOut',
                             duration: 400,
                             onComplete: () => {
                                 this.dieClickBlocker.setOnMouseUpFunc(() => {
                                     PhaserScene.tweens.add({
                                         targets: [victoryText, runeAcquired, banner],
                                         alpha: 0,
                                         duration: 400,
                                         onComplete: () => {
                                             victoryText.destroy();
                                             runeAcquired.destroy();
                                             banner.destroy();
                                             continueText.destroy();
                                             playReaperAnim(this);
                                         }
                                     });
                                     PhaserScene.tweens.add({
                                         targets: rune,
                                         y: "+=90",
                                         ease: 'Quad.easeOut',
                                         duration: 400,
                                         onComplete: () => {
                                             rune.destroy();
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
                         // PhaserScene.tweens.add({
                         //     targets: rune,
                         //     scaleX: 1.5,
                         //     scaleY: 1.5,
                         //     ease: "Cubic.easeInOut",
                         //     duration: 800,
                         // });
                         // PhaserScene.tweens.add({
                         //     targets: rune,
                         //     y: gameConsts.halfHeight + 100,
                         //     alpha: 0,
                         //     ease: "Cubic.easeIn",
                         //     duration: 800,
                         //     onComplete: () => {
                         //         rune.destroy();
                         //     }
                         // });
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
                     name: "TACKLE }10 ",
                     chargeAmt: 250,
                     damage: 10,
                    hitAnimFunc: () => {
                        let dmgEffect = this.scene.add.sprite(gameConsts.halfWidth + (Math.random() - 0.5) * 20, globalObjects.player.getY() - 150, 'spells', 'damageEffect1.png').setDepth(998).setScale(1.5);
                        setTimeout(() => {
                            dmgEffect.destroy();
                        }, 150)
                    }
                 },
                 {
                     name: "HEADBUTT }15",
                     chargeAmt: 350,
                     damage: 15,
                     function: () => {
                         let dmgEffect = this.scene.add.sprite(gameConsts.halfWidth - 15, globalObjects.player.getY() - 150, 'spells', 'damageEffect1.png').setDepth(998).setScale(1.6);
                         setTimeout(() => {
                             dmgEffect.x += 30;
                             dmgEffect.y += 10;
                             setTimeout(() => {
                                 dmgEffect.destroy();
                             }, 150)
                         }, 75)
                     }
                 },
                 {
                     name: "ULTIMATE ATTACK }40 (WATCH OUT!)",
                     chargeAmt: 600,
                     damage: 50,
                     function: () => {
                         let dmgEffect = this.scene.add.sprite(gameConsts.halfWidth, globalObjects.player.getY() - 110, 'spells', 'brickPattern2.png').setDepth(998).setScale(0.75);
                         PhaserScene.tweens.add({
                             targets: dmgEffect,
                             rotation: 1,
                             alpha: 0,
                             duration: 800,
                             onComplete: () => {
                                 dmgEffect.destroy();
                             }
                         });
                     }
                 },
                 {
                     name: "TAKING A BREAK",
                     chargeAmt: 250,
                     damage: 0
                 },
                 {
                     name: "TACKLE }10 ",
                     chargeAmt: 250,
                     damage: 10,
                     hitAnimFunc: () => {
                         let dmgEffect = this.scene.add.sprite(gameConsts.halfWidth + (Math.random() - 0.5) * 20, globalObjects.player.getY() - 150, 'spells', 'damageEffect1.png').setDepth(998).setScale(1.5);
                         setTimeout(() => {
                             dmgEffect.destroy();
                         }, 150)
                     }
                 },
                 {
                     name: "HEADBUTT }15",
                     chargeAmt: 350,
                     damage: 15,
                     function: () => {
                         let dmgEffect = this.scene.add.sprite(gameConsts.halfWidth - 15, globalObjects.player.getY() - 150, 'spells', 'damageEffect1.png').setDepth(998).setScale(1.6);
                         setTimeout(() => {
                             dmgEffect.x += 30;
                             dmgEffect.y += 10;
                             setTimeout(() => {
                                 dmgEffect.destroy();
                             }, 150)
                         }, 75)
                     }
                 },
                 {
                     name: "ULTIMATE ATTACK }40 (WATCH OUT!)",
                     chargeAmt: 600,
                     damage: 50,
                     function: () => {
                         let dmgEffect = this.scene.add.sprite(gameConsts.halfWidth, globalObjects.player.getY() - 110, 'spells', 'brickPattern2.png').setDepth(998).setScale(0.75);
                         PhaserScene.tweens.add({
                             targets: dmgEffect,
                             rotation: 1,
                             alpha: 0,
                             duration: 800,
                             onComplete: () => {
                                 dmgEffect.destroy();
                             }
                         });
                     }
                 },
                 {
                     name: "GOING BACK TO SLEEP...",
                     chargeAmt: 250,
                     damage: 0,
                     function: () => {
                         this.setSprite('dummy.png', 0.75);
                         this.setAsleep();
                     }
                 },
             ]
         ];
     }

    // update(dt) {}

    // reset(x, y) {
    //     this.x = x;
    //     this.y = y;
    // }

}
