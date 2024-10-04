 class Dummytime extends Dummypractice {
    constructor(scene, x, y, level) {
        super(scene, x, y, level);
    }

     initStatsCustom() {
        this.health = 160;
        this.isAsleep = true;
        this.attackScale = 1;
        this.pullbackScale = 1;
        this.damageCanEmit = true;
         this.spellsCastCount = 0;
         this.cyclesLooped = 0;
     }

    initTutorial() {
        this.playerSpellCastSub = messageBus.subscribe('playerCastedSpell', () => {
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
         if (this.rune1) {
             this.rune1.destroy();
             this.rune2.destroy();
         }
         if (this.rune3) {
            this.rune3.destroy();
            this.rune4.destroy();
            this.rune5.destroy();
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
                         messageBus.publish('animateHealNum', this.x, this.y - 50, '+' + healAmt, 0.5 + Math.sqrt(this.healthMax) * 0.2);
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
                     name: ";20x4;",
                     chargeAmt: 750,
                     finishDelay: 800,
                     isBigMove: true,
                     transitionFast: true,
                     damage: -1,
                    startFunction: () => {

                    },
                    attackStartFunction: () => {

                    },
                    attackFinishFunction: () => {
                        this.throwWeapon('scythe.png', 20, 4);
                    }
                 },
                 {
                     name: "OUT OF AMMO...",
                     chargeAmt: 300,
                     transitionFast: true,
                     isPassive: true,
                     damage: -1,
                     startFunction: () => {
                         globalObjects.textPopupManager.setInfoText(gameConsts.width, gameConsts.halfHeight - 160, getLangText('level4_train_tut_b'), 'right');
                         let runeYPos = globalObjects.textPopupManager.getBoxBottomPos();
                         let centerXPos = globalObjects.textPopupManager.getCenterPos();

                         this.rune1 = this.addSprite(centerXPos - 30, runeYPos + 30, 'circle', 'rune_reinforce_glow.png').setDepth(10001).setScale(0.75).setAlpha(0);
                         this.rune2 = this.addSprite(centerXPos + 26, runeYPos + 30, 'circle', 'rune_time_glow.png').setDepth(10001).setScale(0.75).setAlpha(0);
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
                         this.playerSpellBodyTrack = messageBus.subscribe('recordSpell', (spellId) => {
                             if (spellId == 'timeReinforce') {
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
                     name: "FIX SELF \\35",
                     chargeAmt: 550,
                     finishDelay: 2000,
                     transitionFast: true,
                     damage: -1,
                     startFunction: () => {
                        this.cyclesLooped++;
                        if (this.cyclesLooped % 2 == 1 && this.health > 30) {
                            globalObjects.textPopupManager.setInfoText(gameConsts.width, gameConsts.halfHeight - 172, getLangText('level4_train_tut_c'), 'right');
                             let runeYPos = globalObjects.textPopupManager.getBoxTopPos();
                             let centerXPos = globalObjects.textPopupManager.getCenterPos();

                            if (!this.rune3) {
                                 this.rune3 = this.addSprite(centerXPos - 48, runeYPos + 96, 'circle', 'rune_enhance_glow.png').setDepth(10001).setScale(0.71).setAlpha(0);
                                 this.rune4 = this.addSprite(centerXPos - 0, runeYPos + 96, 'circle', 'rune_enhance_glow.png').setDepth(10001).setScale(0.71).setAlpha(0);
                                 this.rune5 = this.addSprite(centerXPos + 48, runeYPos + 96, 'circle', 'rune_enhance_glow.png').setDepth(10001).setScale(0.71).setAlpha(0);
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
                                         scaleX: 0.8,
                                         scaleY: 0.8,
                                         ease: 'Back.easeOut',
                                         duration: 400,
                                     });
                                 }
                             });
                             this.addDelay(() => {
                                 this.playerSpellBodyTrack2 = messageBus.subscribe('recordSpell', (spellId) => {
                                     if (spellId == 'timeEnhance' || spellId == 'matterEnhance') {
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
                        }

                     },
                     attackStartFunction: () => {
                         this.healAnim(35);
                     }
                 },
                 {
                     name: "FIX SELF \\45",
                     chargeAmt: 750,
                     finishDelay: 2000,
                     transitionFast: true,
                     damage: -1,
                     attackStartFunction: () => {
                         this.healAnim(45);
                     }
                 },
                 {
                     name: "FIX SELF \\35",
                     chargeAmt: 550,
                     finishDelay: 2000,
                     transitionFast: true,
                     damage: -1,
                     attackStartFunction: () => {
                         this.healAnim(35);
                     }
                 },
                 {
                     name: "FIX SELF \\45",
                     chargeAmt: 750,
                     finishDelay: 2000,
                     transitionFast: true,
                     damage: -1,
                     attackStartFunction: () => {
                         this.healAnim(45);
                     }
                 },
             ]
         ];
     }
}
