 class Dummyshield extends Dummypractice {
    constructor(scene, x, y, level) {
        super(scene, x, y, level);
    }

     initStatsCustom() {
         this.health = 100;
         this.isAsleep = true;
        this.attackScale = 1;
        this.pullbackScale = 1;
     }



     initTutorial() {
        this.bgMusic = playMusic('bite_down_simplified', 0.65, true);
        globalObjects.magicCircle.disableMovement();
        globalObjects.bannerTextManager.setDialog(["This new rune that the last\nenemy dropped could come in useful"]);
        globalObjects.bannerTextManager.setPosition(gameConsts.halfWidth, gameConsts.height - 130, 0);
        globalObjects.bannerTextManager.showBanner(false);
        let runeDepth = globalObjects.bannerTextManager.getDepth() + 1;
        this.rune1 = this.addSprite(gameConsts.halfWidth - 270, gameConsts.height - 130, 'tutorial', 'rune_mind_large.png').setDepth(runeDepth).setScale(0.8, 0.8).setAlpha(0);
        this.rune1 = this.addSprite(gameConsts.halfWidth + 270, gameConsts.height - 130, 'tutorial', 'rune_mind_large.png').setDepth(runeDepth).setScale(0.8, 0.8).setAlpha(0);
         this.addTween({
             targets: [this.rune1, this.rune2],
             alpha: 1,
             scaleX: 1,
             scaleY: 1,
             duration: 400,
         });
        globalObjects.bannerTextManager.setOnFinishFunc(() => {
            globalObjects.magicCircle.enableMovement();
            globalObjects.bannerTextManager.setOnFinishFunc(() => {});
            globalObjects.bannerTextManager.closeBanner();
             this.addTween({
                 targets: [this.rune1, this.rune2],
                 alpha: 0,
                 duration: 200,
             });
        });
    }


     setHealth(newHealth) {
         super.setHealth(newHealth);
         let prevHealthPercent = this.prevHealth / this.healthMax;
         let currHealthPercent = this.health / this.healthMax;
         if (currHealthPercent == 0) {
             // dead, can't do anything
             return;
         }
     }

     die() {
         if (this.dead) {
             return;
         }
        super.die();
         if (this.rune1) {
             this.rune1.visible = false;
             this.rune2.visible = false;
         }
         if (this.eyes) {
             this.removeExtraSprite(this.eyes);
             this.eyes.destroy();
             this.eyes = null;
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
        if (this.glowHealth) {
            this.glowHealth.destroy();
        }
        globalObjects.textPopupManager.hideInfoText();

        this.x += 10;
         this.y += this.sprite.height * this.sprite.scaleY * 0.45; this.sprite.y = this.y;
         this.sprite.setOrigin(0.51, 0.96);
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
         this.addTween({
             targets: this.sprite,
             rotation: -1.31,
             ease: "Cubic.easeIn",
             duration: 1000,
             onComplete: () => {
                 this.x -= 80;
                 this.y += 39;
                 this.setSprite('dummy_broken.png', this.sprite.scaleX);
                 this.sprite.setRotation(0);
                 this.sprite.setOrigin(0.85, 0.78);
                 playSound('victory_2');

                 this.showFlash(this.x, this.y - 75);

                 let rune = this.addSprite(this.x, this.y - 75, 'tutorial', 'rune_mind_large.png').setScale(0.5).setDepth(9999);
                 this.addTween({
                     targets: rune,
                     x: gameConsts.halfWidth,
                     scaleX: 1,
                     scaleY: 1,
                     ease: "Cubic.easeOut",
                     duration: 1500,
                     onComplete: () => {
                        this.showVictory(rune);
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
                     name: "}5 ",
                     chargeAmt: 300,
                     damage: 5,
                     isBigMove: true,
                    attackFinishFunction: () => {
                        playSound('body_slam')
                        let dmgEffect = this.addSprite(gameConsts.halfWidth + (Math.random() - 0.5) * 20, globalObjects.player.getY() - 185, 'spells', 'damageEffect1.png').setDepth(998).setScale(1.5);
                        this.addTimeout(() => {
                            dmgEffect.destroy();
                        }, 150)
                    }
                 },
                 {
                     name: "|10 ",
                     chargeAmt: 550,
                     damage: 10,
                     attackFinishFunction: () => {
                         let dmgEffect = this.addSprite(gameConsts.halfWidth - 15, globalObjects.player.getY() - 185, 'spells', 'damageEffect1.png').setDepth(998).setScale(1.6);
                         this.addTimeout(() => {
                             dmgEffect.x += 30;
                             dmgEffect.y += 10;
                             this.addTimeout(() => {
                                 dmgEffect.destroy();
                             }, 150)
                         }, 75);
                         playSound('body_slam')

                         this.snort.setScale(this.sprite.startScale * 0.8).setAlpha(1);
                         this.addTween({
                             targets: this.snort,
                             scaleX: this.sprite.startScale * 1.1,
                             scaleY: this.sprite.startScale * 1.1,
                             duration: 400,
                             ease: 'Cubic.easeOut'
                         });
                         this.addTween({
                             targets: this.snort,
                             duration: 400,
                             alpha: 0,
                             ease: 'Quad.easeIn',
                         });
                     }
                 },
                 {
                     name: ";15",
                     chargeAmt: 850,
                     damage: 15,
                     isBigMove: true,
                     attackFinishFunction: () => {
                         playSound('body_slam')
                         let dmgEffect = poolManager.getItemFromPool('brickPattern2')
                         if (!dmgEffect) {
                             dmgEffect = this.addSprite(gameConsts.halfWidth, globalObjects.player.getY() - 120, 'spells', 'brickPattern2.png').setDepth(998).setScale(0.75);
                         }
                         dmgEffect.setDepth(998).setScale(0.75);
                         this.addTween({
                             targets: dmgEffect,
                             rotation: 1,
                             alpha: 0,
                             duration: 800,
                             onComplete: () => {
                                 poolManager.returnItemToPool(dmgEffect, 'brickPattern2');
                             }
                         });


                         this.snort.setScale(this.sprite.startScale * 0.8).setAlpha(1);
                         this.addTween({
                             targets: this.snort,
                             scaleX: this.sprite.startScale * 1.1,
                             scaleY: this.sprite.startScale * 1.1,
                             duration: 400,
                             ease: 'Cubic.easeOut'
                         });
                         this.addTween({
                             targets: this.snort,
                             duration: 400,
                             alpha: 0,
                             ease: 'Quad.easeIn',
                         });
                     }
                 },
                 {
                     name: " TAKING A BREAK...",
                     chargeAmt: 400,
                     damage: 0,
                     startFunction: () => {
                         this.setDefaultSprite('dummy_w_eyes.png', 0.95);
                     },
                     attackFinishFunction: () => {
                         this.setDefaultSprite('dummy_angry.png', 0.95);
                     }
                 },
                 {
                     name: "}10 ",
                     chargeAmt: 500,
                     damage: 10,
                     attackFinishFunction: () => {
                         let dmgEffect = this.addSprite(gameConsts.halfWidth + (Math.random() - 0.5) * 20, globalObjects.player.getY() - 185, 'spells', 'damageEffect1.png').setDepth(998).setScale(1.5);
                         this.addTimeout(() => {
                             dmgEffect.destroy();
                         }, 150)
                         this.snort.setScale(this.sprite.startScale * 0.8).setAlpha(1);
                         this.addTween({
                             targets: this.snort,
                             scaleX: this.sprite.startScale * 1.1,
                             scaleY: this.sprite.startScale * 1.1,
                             duration: 400,
                             ease: 'Cubic.easeOut'
                         });
                         this.addTween({
                             targets: this.snort,
                             duration: 400,
                             alpha: 0,
                             ease: 'Quad.easeIn',
                         });
                     }
                 },
                 {
                     name: "}15",
                     chargeAmt: 500,
                     damage: 15,
                     attackFinishFunction: () => {
                         let dmgEffect = this.addSprite(gameConsts.halfWidth - 15, globalObjects.player.getY() - 185, 'spells', 'damageEffect1.png').setDepth(998).setScale(1.6);
                         this.addTimeout(() => {
                             dmgEffect.x += 30;
                             dmgEffect.y += 10;
                             this.addTimeout(() => {
                                 dmgEffect.destroy();
                             }, 150)
                         }, 75)
                         this.snort.setScale(this.sprite.startScale * 0.8).setAlpha(1);
                         this.addTween({
                             targets: this.snort,
                             scaleX: this.sprite.startScale * 1.1,
                             scaleY: this.sprite.startScale * 1.1,
                             duration: 400,
                             ease: 'Cubic.easeOut'
                         });
                         this.addTween({
                             targets: this.snort,
                             duration: 400,
                             alpha: 0,
                             ease: 'Quad.easeIn',
                         });
                     }
                 },
                 {
                     name: "ULTIMATE ATTACK }50",
                     chargeAmt: 800,
                     damage: 50,
                     attackFinishFunction: () => {
                         let dmgEffect = this.addSprite(gameConsts.halfWidth, globalObjects.player.getY() - 110, 'spells', 'brickPattern2.png').setDepth(998).setScale(0.75);
                         this.addTween({
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
                     attackFinishFunction: () => {
                         this.setSprite('dummy.png', 0.95);
                         this.setAsleep();
                     }
                 },
             ]
         ];
     }
}
