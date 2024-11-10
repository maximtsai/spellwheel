 class Dummytime extends Dummypractice {
    constructor(scene, x, y, level) {
        super(scene, x, y, level);
    }

     initStatsCustom() {
        this.health = 105;
        this.isAsleep = true;
        this.attackScale = 1;
        this.pullbackScale = 1;
        this.damageCanEmit = true;
         this.spellsCastCount = 0;
     }

    initTutorial() {
        this.playerSpellCastSub = this.addSubscription('playerCastedSpell', () => {
            this.spellsCastCount++;
            if (this.spellsCastCount >= 2) {
                this.playerSpellCastSub.unsubscribe();
                this.addTween({
                    targets: [this.text, this.backingBox],
                    alpha: 0,
                    duration: 600,
                });
            }
        })
        this.addDelay(() => {
            this.showGoal();
        }, 1000)
    }

     showGoal() {
         this.backingBox = this.addImage(0, 0, 'blackPixel').setAlpha(0);
         this.text = PhaserScene.add.text(8, 8, getLangText('level4_train_tut_a'), {fontFamily: 'garamondmax', fontSize: 24, color: '#FFFFFF', align: 'left'}).setAlpha(0).setOrigin(0, 0).setDepth(100);
         this.backingBox.setScale(this.text.width * 0.5 + 8, this.text.height * 0.5 + 8).setOrigin(0, 0);
         this.addToDestructibles(this.text);
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
     }

     startFight() {
         super.startFight();
         this.bgMusic = playMusic('bite_down_simplified', 0.7, true);
     }

     setHealth(newHealth) {
         super.setHealth(newHealth);
         let prevHealthPercent = this.prevHealth / this.healthMax;
         let currHealthPercent = this.health / this.healthMax;
         if (currHealthPercent < 0.999 && !this.fightStarted) {
            this.startFight();
            this.addDelay(() => {
                this.addTween({
                    targets: [this.text, this.backingBox],
                    alpha: 0,
                    duration: 600,
                });
            }, 3000)
         }
         if (currHealthPercent == 0) {
             // dead, can't do anything
             return;
         }
     }

     cleanUp() {
         if (this.runSfxLoop) {
            fadeAwaySound(this.runSfxLoop, 300)
         }
     }

     die() {
         if (this.dead) {
             return;
         }
         if (this.playerSpellBodyTrack) {
             this.playerSpellBodyTrack.unsubscribe();
         }
         if (this.playerSpellBodyTrack2) {
             this.playerSpellBodyTrack2.unsubscribe();
         }
         if (this.playerSpellCastSub) {
             this.playerSpellCastSub.unsubscribe();
         }
         if (this.runea) {
             this.runea.destroy();
             this.runeb.destroy();
         }
         if (this.rune1) {
             this.rune1.destroy();
             this.rune2.destroy();
         }
         if (this.rune3) {
            this.rune3.destroy();
            this.rune4.destroy();
            this.rune5.destroy();
            if (this.rune6) {
                this.rune6.destroy();
            }
         }

        playSound('clunk2');
         if (this.runTween) {
            this.runTween.stop();
         }
         if (this.runSfxLoop) {
            fadeAwaySound(this.runSfxLoop, 300)
         }
        super.die();
     }

     healAnim(healAmt = null) {
         if (!healAmt) {
             healAmt = this.healthMax;
         }
         this.currDummyAnim = this.addTween({
             targets: this.sprite,
             scaleX: this.sprite.startScale * 0.82,
             scaleY: this.sprite.startScale * 0.82,
             rotation: -0.25,
             ease: "Quint.easeOut",
             duration: 750,
             onComplete: () => {
                 this.currDummyAnim = this.addTween({
                     targets: this.sprite,
                     scaleX: this.sprite.startScale * 1.2,
                     scaleY: this.sprite.startScale * 1.2,
                     rotation: 0.07,
                     ease: "Quart.easeIn",
                     duration: 600,
                     onComplete: () => {
                         playSound('magic', 0.6);
                         this.heal(healAmt);
                         messageBus.publish('animateHealNum', this.x, this.y - 70, '+' + healAmt, 0.5 + Math.sqrt(this.healthMax) * 0.2);
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


     initAttacks() {
         this.attacks = [
             [
                 // 0
                 {
                     name: ";15x5;",
                     chargeAmt: 620,
                     finishDelay: 3400,
                     isBigMove: true,
                     transitionFast: true,
                     damage: -1,
                    startFunction: () => {
                        this.addDelay(() => {
                            globalObjects.textPopupManager.setInfoText(gameConsts.width, gameConsts.halfHeight - 160, getLangText('level4_train_tut_b1'), 'right');
                            let runeYPos = globalObjects.textPopupManager.getBoxBottomPos();
                            let centerXPos = globalObjects.textPopupManager.getCenterPos();

                            this.runea = this.addSprite(centerXPos - 31, runeYPos + 17, 'circle', 'bright_rune_protect.png').setDepth(globalObjects.textPopupManager.getDepth() + 1).setScale(0.75).setAlpha(0);
                            this.runeb = this.addSprite(centerXPos + 29, runeYPos + 17, 'circle', 'bright_rune_time.png').setDepth(globalObjects.textPopupManager.getDepth() + 1).setScale(0.75).setAlpha(0);
                            this.addTween({
                                targets: [this.runea, this.runeb],
                                alpha: 1,
                                duration: 200,
                            });
                            this.addTween({
                                targets: [this.runea, this.runeb],
                                scaleX: 1.1,
                                scaleY: 1.1,
                                ease: 'Quart.easeOut',
                                duration: 600,
                                onComplete: () => {
                                    this.addTween({
                                        targets: [this.runea, this.runeb],
                                        scaleX: 0.85,
                                        scaleY: 0.85,
                                        ease: 'Back.easeOut',
                                        duration: 400,
                                    });
                                }
                            });
                            this.playerSpellShieldTrack = this.addSubscription('recordSpell', (spellId) => {
                                if (spellId === 'timeProtect') {
                                    this.playerSpellShieldTrack.unsubscribe();
                                    this.playerSpellShieldTrack = null;
                                    globalObjects.textPopupManager.hideInfoText();
                                    this.addTween({
                                        targets: [this.runea, this.runeb],
                                        alpha: 0,
                                        duration: 200,
                                        onComplete: () => {
                                            this.runea.visible = false;
                                            this.runeb.visible = false;
                                        }
                                    });
                                }
                            })
                        }, 1500)


                    },
                    attackStartFunction: () => {
                        this.hidePosterFast();

                    },
                    attackFinishFunction: () => {
                        this.throwWeapon('sword.png', 15, 5);
                    }
                 },
                 {
                     name: "OUT OF AMMO...",
                     chargeAmt: 220,
                     transitionFast: true,
                     isPassive: true,
                     damage: -1,
                     startFunction: () => {
                         globalObjects.textPopupManager.setInfoText(gameConsts.width, gameConsts.halfHeight - 170, getLangText('level4_train_tut_b'), 'right');
                         let runeYPos = globalObjects.textPopupManager.getBoxBottomPos();
                         let centerXPos = globalObjects.textPopupManager.getCenterPos();
                         if (this.runea) {
                             this.addTween({
                                 targets: [this.runea, this.runeb],
                                 alpha: 0,
                                 duration: 200,
                             });
                         }

                         this.rune1 = this.addSprite(centerXPos - 31, runeYPos + 18, 'circle', 'bright_rune_reinforce.png').setDepth(globalObjects.textPopupManager.getDepth() + 1).setScale(0.75).setAlpha(0);
                         this.rune2 = this.addSprite(centerXPos + 28, runeYPos + 18, 'circle', 'bright_rune_time.png').setDepth(globalObjects.textPopupManager.getDepth() + 1).setScale(0.75).setAlpha(0);
                         this.addTween({
                             targets: [this.rune1, this.rune2],
                             alpha: 1,
                             duration: 200,
                         });
                         this.addTween({
                             targets: [this.rune1, this.rune2],
                             scaleX: 1.1,
                             scaleY: 1.1,
                             ease: 'Quart.easeOut',
                             duration: 600,
                             onComplete: () => {
                                 this.addTween({
                                     targets: [this.rune1, this.rune2],
                                     scaleX: 0.85,
                                     scaleY: 0.85,
                                     ease: 'Back.easeOut',
                                     duration: 400,
                                 });
                             }
                         });
                         if (this.playerSpellShieldTrack) {
                             this.playerSpellShieldTrack.unsubscribe();
                         }
                         this.playerSpellBodyTrack = this.addSubscription('recordSpell', (spellId) => {
                             if (spellId === 'timeReinforce') {
                                 this.playerSpellBodyTrack.unsubscribe();
                                 this.playerSpellBodyTrack = null;
                                 globalObjects.textPopupManager.hideInfoText();
                                 this.addTween({
                                     targets: [this.rune1, this.rune2],
                                     alpha: 0,
                                     duration: 200,
                                     onComplete: () => {
                                         this.rune1.visible = false;
                                         this.rune2.visible = false;
                                     }
                                 });
                             }
                         })
                     },
                     attackStartFunction: () => {
                         globalObjects.textPopupManager.hideInfoText();
                         if (this.rune1) {
                             this.addTween({
                                 targets: [this.rune1, this.rune2],
                                 alpha: 0,
                                 duration: 200,
                             });
                         }
                         this.currentAttackSetIndex = 1;
                         this.nextAttackIndex = 0;
                     }
                 },
             ],
             [
                 {
                     name: "FULL HEAL! \\100",
                     chargeAmt: 480,
                     finishDelay: 2000,
                     transitionFast: true,
                     isBigMove: true,
                     damage: -1,
                     startFunction: () => {
                        if (this.health > 30 && !this.flipShow) {
                            this.flipShow = true;
                            globalObjects.textPopupManager.setInfoText(gameConsts.width, gameConsts.halfHeight - 187, getLangText('level4_train_tut_c'), 'right');
                             let runeYPos = globalObjects.textPopupManager.getBoxTopPos();
                             let centerXPos = globalObjects.textPopupManager.getCenterPos();
                            if (this.rune1) {
                                this.addTween({
                                    targets: [this.rune1, this.rune2],
                                    alpha: 0,
                                    duration: 200,
                                });
                            }

                            if (!this.rune3) {
                                 this.rune3 = this.addSprite(centerXPos - 48, runeYPos + 83, 'circle', 'bright_rune_enhance.png').setDepth(globalObjects.textPopupManager.getDepth() + 1).setScale(0.71).setAlpha(0);
                                 this.rune4 = this.addSprite(centerXPos - 0, runeYPos + 83, 'circle', 'bright_rune_enhance.png').setDepth(globalObjects.textPopupManager.getDepth() + 1).setScale(0.71).setAlpha(0);
                                 this.rune5 = this.addSprite(centerXPos + 48, runeYPos + 83, 'circle', 'bright_rune_enhance.png').setDepth(globalObjects.textPopupManager.getDepth() + 1).setScale(0.71).setAlpha(0);
                            }
                             this.addTween({
                                 targets: [this.rune3, this.rune4, this.rune5],
                                 alpha: 1,
                                 duration: 200,
                             });
                             this.addTween({
                                 targets: [this.rune3, this.rune4, this.rune5],
                                 scaleX: 1,
                                 scaleY: 1,
                                 ease: 'Quart.easeOut',
                                 duration: 600,
                                 onComplete: () => {
                                     this.addTween({
                                         targets: [this.rune3, this.rune4, this.rune5],
                                         scaleX: 0.78,
                                         scaleY: 0.78,
                                         ease: 'Back.easeOut',
                                         duration: 400,
                                     });
                                 }
                             });
                             this.addDelay(() => {
                                 if (this.playerSpellBodyTrack) {
                                     this.playerSpellBodyTrack.unsubscribe();
                                 }
                                 this.playerSpellBodyTrack2 = this.addSubscription('recordSpell', (spellId) => {
                                     if (spellId === 'timeEnhance' || spellId === 'matterEnhance') {
                                         this.playerSpellBodyTrack2.unsubscribe();
                                         this.playerSpellBodyTrack2 = null;
                                         globalObjects.textPopupManager.hideInfoText();
                                         this.addTween({
                                             targets: [this.rune3, this.rune4, this.rune5],
                                             alpha: 0,
                                             duration: 200,
                                         });
                                     }
                                 })
                             }, 2000)
                        } else {
                            this.flipShow = false;
                        }

                     },
                     attackStartFunction: () => {
                         this.healAnim(100);
                         this.currentAttackSetIndex = 2;
                         this.nextAttackIndex = 0;
                     }
                 },
             ],
             [
                 {
                     name: "FULL HEAL! \\100",
                     chargeAmt: 850,
                     finishDelay: 2000,
                     transitionFast: true,
                     isBigMove: true,
                     damage: -1,
                     startFunction: () => {
                         if (this.health > 30 && !this.justShown) {
                             this.justShown = true;
                             globalObjects.textPopupManager.setInfoText(gameConsts.width, gameConsts.halfHeight - 187, getLangText('level4_train_tut_c'), 'right');
                             let runeYPos = globalObjects.textPopupManager.getBoxTopPos();
                             let centerXPos = globalObjects.textPopupManager.getCenterPos();
                             if (this.rune1) {
                                 this.addTween({
                                     targets: [this.rune1, this.rune2],
                                     alpha: 0,
                                     duration: 200,
                                 });
                             }

                             if (!this.rune3) {
                                 this.rune3 = this.addSprite(centerXPos - 60, runeYPos + 83, 'circle', 'bright_rune_enhance.png').setDepth(globalObjects.textPopupManager.getDepth() + 1).setScale(0.71).setAlpha(0);
                                 this.rune4 = this.addSprite(centerXPos - 20, runeYPos + 83, 'circle', 'bright_rune_enhance.png').setDepth(globalObjects.textPopupManager.getDepth() + 1).setScale(0.71).setAlpha(0);
                                 this.rune5 = this.addSprite(centerXPos + 20, runeYPos + 83, 'circle', 'bright_rune_enhance.png').setDepth(globalObjects.textPopupManager.getDepth() + 1).setScale(0.71).setAlpha(0);
                                 this.rune6 = this.addSprite(centerXPos + 60, runeYPos + 83, 'circle', 'bright_rune_enhance.png').setDepth(globalObjects.textPopupManager.getDepth() + 1).setScale(0.71).setAlpha(0);
                             }
                             this.addTween({
                                 targets: [this.rune3, this.rune4, this.rune5, this.rune6],
                                 alpha: 1,
                                 duration: 200,
                             });
                             this.addTween({
                                 targets: [this.rune3, this.rune4, this.rune5, this.rune6],
                                 scaleX: 1,
                                 scaleY: 1,
                                 ease: 'Quart.easeOut',
                                 duration: 600,
                                 onComplete: () => {
                                     this.addTween({
                                         targets: [this.rune3, this.rune4, this.rune5, this.rune6],
                                         scaleX: 0.78,
                                         scaleY: 0.78,
                                         ease: 'Back.easeOut',
                                         duration: 400,
                                     });
                                 }
                             });
                             this.addDelay(() => {
                                 if (this.playerSpellBodyTrack) {
                                     this.playerSpellBodyTrack.unsubscribe();
                                 }
                                 this.playerSpellBodyTrack2 = this.addSubscription('recordSpell', (spellId) => {
                                     if (spellId === 'timeEnhance' || spellId === 'matterEnhance') {
                                         this.playerSpellBodyTrack2.unsubscribe();
                                         this.playerSpellBodyTrack2 = null;
                                         globalObjects.textPopupManager.hideInfoText();
                                         this.addTween({
                                             targets: [this.rune3, this.rune4, this.rune5, this.rune6],
                                             alpha: 0,
                                             duration: 200,
                                         });
                                     }
                                 })
                             }, 2000)
                         } else {
                             this.justShown = false;
                         }
                     },
                     attackStartFunction: () => {
                         this.healAnim(100);
                         this.currentAttackSetIndex = 2;
                         this.nextAttackIndex = 0;
                     }
                 },
             ]
         ];
     }
}
