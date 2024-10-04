 class Dummypractice extends Enemy {
    constructor(scene, x, y, level) {
        super(scene, x, y, level);
        this.initSprite('palm.png', 0.6, 0, 5, 'deathfinal');
        this.initMisc();
        globalObjects.encyclopedia.showButton();
        globalObjects.options.showButton();
        this.addTimeout(() => {
            this.initTutorial();
        }, 10)
    }

     initStatsCustom() {
         this.health = 200;
         this.isAsleep = true;
        this.attackScale = 1;
        this.pullbackScale = 1;
        this.damageCanEmit = true;
         this.shieldAmts = 0;
         this.shieldTextFont = "void";
     }

     initTutorial() {
        this.bgMusic = playMusic('bite_down_simplified', 0.65, true);
    }

    initMisc() {
        this.shieldExtraText = this.scene.add.bitmapText(gameConsts.halfWidth, this.y + this.shieldTextOffsetY + 24, 'void', 'SHIELDED', 52).setOrigin(0.5).setDepth(18).setVisible(false);
    }


     setHealth(newHealth) {
         super.setHealth(newHealth);
         let prevHealthPercent = this.prevHealth / this.healthMax;
         let currHealthPercent = this.health / this.healthMax;
         if (currHealthPercent == 0) {
             // dead, can't do anything
             return;
         } else if (currHealthPercent <= 0.9 && !this.gainedShield) {
             this.gainedShield = true;
             this.createVoidShield(10);
         }
     }

     createVoidShield(amt) {
         this.shieldExtraText.setVisible(true).setScale(0.4).setAlpha(1);
         this.addTween({
             targets: this.shieldExtraText,
             scaleX: 1,
             scaleY: 1,
             ease: 'Back.easeOut',
             duration: 150,
             completeDelay: 1800,
             onComplete: () => {
                 this.addTween({
                     targets: this.shieldExtraText,
                     scaleX: 0.2,
                     scaleY: 0.25,
                     alpha: 0,
                     ease: 'Quart.easeIn',
                     duration: 400,
                 })
             }
         })

         this.shieldText.visible = true;
         this.shieldText.setText(amt);
         this.shieldText.setScale(0.1);
         this.shieldText.startX = this.shieldText.x;
         this.shieldText.startScale = 0.82;
         this.scene.tweens.add({
             targets: this.shieldText,
             scaleX: this.shieldText.startScale,
             scaleY: this.shieldText.startScale,
             ease: 'Back.easeOut',
             duration: gameVars.gameManualSlowSpeedInverse * 250,
         });
         playSound('void_shield');
         this.voidShield1b.setScale(this.voidShield1b.startScale * 1.15).setAlpha(0.5);
         this.addTween({
             targets: [this.voidShield1b],
             scaleX: this.voidShield1b.startScale,
             scaleY: this.voidShield1b.startScale,
             duration: 200,
             alpha: 1,
             ease: 'Cubic.easeIn',
             onComplete: () => {
                 this.voidShield1b.repeatTween = this.addTween({
                     targets: this.voidShield1b,
                     alpha: 0.8,
                     duration: 2000,
                     scaleX: this.voidShield1b.startScale * 0.99,
                     scaleY: this.voidShield1b.startScale * 0.99,
                     yoyo: true,
                     repeat: -1,
                     ease: 'Quad.easeInOut'
                 })
             }
         });

         this.shieldAmts = amt;
     }

     die() {
         if (this.dead) {
             return;
         }
        super.die();

        globalObjects.textPopupManager.hideInfoText();
        this.dieClickBlocker = createGlobalClickBlocker(false);
        this.sprite.setScale(this.sprite.startScale).setRotation(0);
        let darkDummy = this.addSprite(this.sprite.startX, this.sprite.y, 'dummyenemy', 'dummy_paper_dark.png').setScale(this.sprite.startScale).setDepth(11).setAlpha(0.1);
        if (this.currDummyAnim) {
            this.currDummyAnim.stop();
        }
         this.addTween({
             targets: darkDummy,
             alpha: 0.7,
             ease: "Cubic.easeIn",
             duration: 1800,
         });
         this.addTween({
             targets: [this.sprite, darkDummy],
             scaleY: 0,
             rotation: 0.06,
             ease: "Quad.easeIn",
             duration: 1800,
             onComplete: () => {
                darkDummy.setAlpha(0.25);
                 this.sprite.setFrame('dummy_paper_back.png');
                 this.sprite.setRotation(0);
                 playSound('victory_2');
                 this.addTween({
                     targets: [this.sprite, darkDummy],
                     scaleY: -0.2,
                     ease: "Cubic.easeOut",
                     duration: 900,
                     onComplete: () => {
                        this.showComplete(darkDummy);
                     }
                 });
                 this.addTween({
                     targets: [this.sprite, darkDummy],
                     rotation: 0.22,
                     ease: "Quad.easeOut",
                     duration: 1000,
                     onComplete: () => {

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
                        let dmgEffect = this.addSprite(gameConsts.halfWidth + (Math.random() - 0.5) * 20, globalObjects.player.getY() - 185, 'spells', 'damageEffect1.png').setDepth(998).setScale(1.4);
                        this.addTimeout(() => {
                            dmgEffect.destroy();
                        }, 150)
                    }
                 },
             ]
         ];
     }

    showComplete(darkDummy) {
        globalObjects.encyclopedia.hideButton();
        globalObjects.options.hideButton();
        globalObjects.magicCircle.disableMovement();
        let banner = this.scene.add.sprite(gameConsts.halfWidth, gameConsts.halfHeight - 35, 'misc', 'victory_banner.png').setScale(100, 1.2).setDepth(9998).setAlpha(0);
        let victoryText = this.scene.add.sprite(gameConsts.halfWidth, gameConsts.halfHeight - 44, 'misc', 'complete.png').setScale(0.95).setDepth(9998).setAlpha(0);
        let continueText = this.scene.add.text(gameConsts.width - 15, gameConsts.halfHeight + 2, getLangText('cont_ui'), {fontFamily: 'Verdana', color: '#F0F0F0', fontSize: 20}).setAlpha(0).setOrigin(1, 0.5).setAlign('right').setDepth(9998);

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
        this.addTimeout(() => {
             continueText.alpha = 1;
         }, 1000);

         PhaserScene.tweens.add({
             targets: victoryText,
             scaleX: 1,
             scaleY: 1,
             duration: 800,
             onComplete: () => {
                this.dieClickBlocker.setOnMouseUpFunc(() => {
                    PhaserScene.tweens.add({
                         targets: [this.sprite, darkDummy],
                         alpha: 0,
                         duration: 800,
                    });

                    hideGlobalClickBlocker();
                    continueText.destroy();
                    PhaserScene.tweens.add({
                         targets: [victoryText, banner],
                         alpha: 0,
                         duration: 800,
                        completeDelay: 200,
                         onComplete: () => {
                            victoryText.destroy();
                            banner.destroy();
                            // globalObjects.magicCircle.enableMovement();
                             // TODO: maybe just skip straight to enemy
                            // globalObjects.postFightScreen.createWinScreenMin();
                             beginPreLevel(this.targetLevel ? this.targetLevel : -this.level + 1);
                        }
                    });
                });
             }
         });
     }
}
