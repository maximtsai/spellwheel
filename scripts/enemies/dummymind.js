 class Dummymind extends Dummypractice {
    constructor(scene, x, y, level) {
        super(scene, x, y, level);

        this.addTimeout(() => {
            this.playerSpellCastSub = messageBus.subscribe('resetCircle', () => {
                this.healAnim();
            });
        }, 100)
    }

     initStatsCustom() {
         this.health = 50;
         this.isAsleep = true;
        this.attackScale = 1;
        this.pullbackScale = 1;
        this.numTimesHealed = 0;
     }

     initTutorial() {
        this.bgMusic = playMusic('bite_down_simplified', 0.65, true);
        globalObjects.magicCircle.disableMovement();
        globalObjects.bannerTextManager.setDialog([getLangText('level1_train_diag_a')]);
        globalObjects.bannerTextManager.setPosition(gameConsts.halfWidth, gameConsts.height - 130, 0);
        globalObjects.bannerTextManager.showBanner(false);
        let runeDepth = globalObjects.bannerTextManager.getDepth() + 1;
        this.rune1 = this.addImage(gameConsts.halfWidth - 260, gameConsts.height - 130, 'tutorial', 'rune_mind_large.png').setDepth(runeDepth).setScale(0.8, 0.8).setAlpha(0);
        this.rune2 = this.addImage(gameConsts.halfWidth + 260, gameConsts.height - 130, 'tutorial', 'rune_mind_large.png').setDepth(runeDepth).setScale(0.8, 0.8).setAlpha(0);
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
             this.canShowShieldTip = true;
             this.showGoal();
             // messageBus.publish('enemyAddShield', 500)
        });
    }

    showGoal() {
        this.backingBox = this.addImage(0, 0, 'blackPixel').setAlpha(0);
        this.text = PhaserScene.add.text(10, 10, getLangText('level1_train_tut_a'), {fontFamily: 'garamondmax', fontSize: 24, color: '#FFFFFF', align: 'left'}).setAlpha(0).setOrigin(0, 0).setDepth(100);
        this.backingBox.setScale(this.text.width * 0.5 + 10, this.text.height * 0.5 + 10).setOrigin(0, 0);
        this.addToDestructibles(this.text);
        this.highlightGoal();
    }

    highlightGoal() {
        this.text.setScale(0.98);
        this.addTween({
             targets: [this.text],
             alpha: 1,
             scaleX: 1,
             scaleY: 1,
             ease: 'Back.easeOut',
             duration: 600,
         });
         this.addTween({
             targets: [this.backingBox],
             alpha: 0.8,
             duration: 600,
         });
         this.addTimeout(() => {
            this.fadeGoal();
         }, 4000)
    }

    fadeGoal() {
         this.addTween({
             targets: [this.text],
             alpha: 0.8,
             duration: 600,
         });
         this.addTween({
             targets: [this.backingBox],
             alpha: 0.6,
             duration: 600,
         });
    }

    healAnim() {
        this.currDummyAnim = this.addTween({
            delay: 2300,
            targets: this.sprite,
            scaleX: this.sprite.startScale * 0.82,
            scaleY: this.sprite.startScale * 0.82,
            rotation: -0.25,
            ease: "Quint.easeOut",
            duration: 750,
            onComplete: () => {
                this.highlightGoal();
                this.currDummyAnim = this.addTween({
                    targets: this.sprite,
                    scaleX: this.sprite.startScale * 1.2,
                    scaleY: this.sprite.startScale * 1.2,
                    rotation: 0.07,
                    ease: "Quart.easeIn",
                    duration: 600,
                    onComplete: () => {
                        playSound('magic', 0.6);
                        this.heal(this.healthMax);
                        this.numTimesHealed++
                        messageBus.publish('animateHealNum', this.x, this.y - 50, '+' + this.healthMax, 0.5 + Math.sqrt(this.healthMax) * 0.2);
                        if (!this.healSprite) {
                            this.healSprite = this.addImage(gameConsts.halfWidth, this.y - 90, 'misc', 'heal.png').setScale(0.9).setDepth(999).setAlpha(1);
                        }
                        this.healSprite.setAlpha(1).setPosition(gameConsts.halfWidth, this.y - 90);
                        this.scene.tweens.add({
                            targets: this.healSprite,
                            y: "-=30",
                            duration: 1000,
                        });
                        this.scene.tweens.add({
                            targets: this.healSprite,
                            alpha: 0,
                            duration: 1000,
                            ease: 'Cubic.easeIn',
                            onComplete: () => {
                                if (this.numTimesHealed === 2) {
                                    globalObjects.bannerTextManager.setDialog([getLangText('level1_train_diag_b')]);
                                    globalObjects.bannerTextManager.setPosition(gameConsts.halfWidth, gameConsts.height - 130, 0);
                                    globalObjects.bannerTextManager.showBanner(0.5);
                                } else if (this.numTimesHealed === 4) {
                                    globalObjects.bannerTextManager.setDialog([getLangText('level1_train_diag_c')]);
                                    globalObjects.bannerTextManager.setPosition(gameConsts.halfWidth, gameConsts.height - 130, 0);
                                    globalObjects.bannerTextManager.showBanner(0.5);
                                }
                            }
                        });

                        this.currDummyAnim = this.addTween({
                            targets: this.sprite,
                            scaleX: this.sprite.startScale,
                            scaleY: this.sprite.startScale,
                            rotation: 0,
                            easeParams: [2],
                            ease: "Bounce.easeOut",
                            duration: 600,
                        })
                    }
                })
            }
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
         if (this.canShowShieldTip) {
            this.canShowShieldTip = false;
             this.addTimeout(() => {
                 let runeDepth = globalObjects.bannerTextManager.getDepth() + 1;
                 this.rune3 = this.addImage(gameConsts.width - 124, gameConsts.halfHeight + 4, 'circle', 'rune_mind_glow.png').setDepth(runeDepth).setScale(0.8, 0.8).setAlpha(0);
                 this.rune4 = this.addImage(gameConsts.width - 50, gameConsts.halfHeight + 4, 'circle', 'rune_strike_glow.png').setDepth(runeDepth).setScale(0.8, 0.8).setAlpha(0);
                 globalObjects.textPopupManager.setInfoText(gameConsts.width, gameConsts.halfHeight - 100, getLangText('dummy_mind_tut'), 'right');
                 this.addTween({
                     targets: [this.rune3, this.rune4],
                     alpha: 1,
                     duration: 200,
                     completeDelay: 1000,
                     onComplete: () => {
                        this.playerSpellCastSub = messageBus.subscribe('playerCastedSpell', () => {
                            this.playerSpellCastSub.unsubscribe();
                            this.addTimeout(() => {
                                 this.addTween({
                                     targets: [this.rune3, this.rune4],
                                     alpha: 0,
                                     duration: 300,
                                     onComplete: () => {
                                        this.rune3.visible = false;
                                        this.rune4.visible = false;
                                     }
                                 });
                                globalObjects.textPopupManager.hideInfoText();
                            }, 1000);
                        });
                     }
                 });
             }, 500)
         }
     }

     die() {
         if (this.dead) {
             return;
         }
        globalObjects.textPopupManager.hideInfoText();
         if (this.rune1) {
             this.rune1.visible = false;
             this.rune2.visible = false;
         }
         if (this.currDummyAnim) {
            this.currDummyAnim.stop()
         }
        this.playerSpellCastSub.unsubscribe();

         if (this.backingBox) {
             this.addTween({
                 targets: [this.text, this.backingBox],
                 alpha: 0,
                 duration: 300,
             });
         }
         if (this.rune3) {
            this.rune3.visible = false;
         }
         if (this.rune4) {
            this.rune4.visible = false;
         }
        super.die();

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
             ]
         ];
     }
}
