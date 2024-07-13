 class Dummybody extends Dummypractice {
    constructor(scene, x, y, level) {
        super(scene, x, y, level);
        this.numBodySpellsCast = 0;
        this.numNonBodySpellsCast = 0;
        this.spellHoverListener = messageBus.subscribe('recordSpell', (id, spellName) => {
            if (id === 'matterReinforce' || id == 'mindReinforce') {
                this.numBodySpellsCast++;
                if (this.numBodySpellsCast >= 2) {
                    this.showBodyTutorial();
                    this.spellHoverListener.unsubscribe();
                    this.attackHoverListener.unsubscribe();
                }
            }
        });

        this.attackHoverListener = messageBus.subscribe('recordSpellAttack', (id, spellName) => {
            this.numNonBodySpellsCast++;
            if (this.numNonBodySpellsCast >= 4) {
                this.showThornsTutorial();
                this.spellHoverListener.unsubscribe();
                this.attackHoverListener.unsubscribe();
            }
        });
    }

     initStatsCustom() {
        this.health = 175;
        this.isAsleep = true;
        this.attackScale = 1;
        this.pullbackScale = 1;
        this.damageCanEmit = true;
     }

    initTutorial() {

    }

    showBodyTutorial() {
        this.addTimeout(() => {
            this.spellHoverListener = messageBus.subscribe('playerCastedSpell', (id, spellName) => {
                globalObjects.textPopupManager.hideInfoText();
            });
        }, 2000)
        globalObjects.textPopupManager.setInfoText(gameConsts.width, gameConsts.halfHeight - 160, "Only one Body\nspell effect can\nbe active at\na time.", 'right');
    }

    showThornsTutorial() {
         this.addTimeout(() => {
            globalObjects.textPopupManager.setInfoText(gameConsts.width, gameConsts.halfHeight - 160, getLangText('dummy_body_a'), 'right');
             let runeYPos = globalObjects.textPopupManager.getBoxBottomPos();
             let centerXPos = globalObjects.textPopupManager.getCenterPos();
             this.rune3 = this.addImage(centerXPos - 35, runeYPos + 28, 'circle', 'rune_matter_glow.png').setDepth(10001).setScale(0.8, 0.8).setAlpha(0);
             this.rune4 = this.addImage(centerXPos + 35, runeYPos + 28, 'circle', 'rune_reinforce_glow.png').setDepth(10001).setScale(0.8, 0.8).setAlpha(0);

             this.addTween({
                 targets: [this.rune3, this.rune4],
                 scaleX: 1,
                 scaleY: 1,
                 ease: 'Quart.easeOut',
                 duration: 500,
                 onComplete: () => {
                     this.addTween({
                         targets: [this.rune3, this.rune4],
                         scaleX: 0.8,
                         scaleY: 0.8,
                         ease: 'Back.easeOut',
                         duration: 300,
                     });
                 }
             });

             this.addTween({
                 targets: [this.rune3, this.rune4],
                 alpha: 1,
                 duration: 200,
                 completeDelay: 1000,
                 onComplete: () => {
                    this.addTimeout(() => {
                        this.spellHoverListener = messageBus.subscribe('playerCastedSpell', (id, spellName) => {
                            this.spellHoverListener.unsubscribe();
                            this.addTimeout(() => {
                                globalObjects.textPopupManager.hideInfoText();
                                 this.addTween({
                                     targets: [this.rune3, this.rune4],
                                     alpha: 0,
                                     duration: 300,
                                     onComplete: () => {
                                        this.rune3.visible = false;
                                        this.rune4.visible = false;
                                     }
                                 });
                            }, 1000);
                        });
                    }, 1000)
                 }
             });
         }, 500)

    }

     setHealth(newHealth) {
         super.setHealth(newHealth);
         let prevHealthPercent = this.prevHealth / this.healthMax;
         let currHealthPercent = this.health / this.healthMax;
         if (prevHealthPercent >= 1 && this.isAsleep) {
            this.startFight();
            this.bgMusic = playMusic('bite_down_simplified', 0.65, true);
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
        this.spellHoverListener.unsubscribe();
        this.attackHoverListener.unsubscribe();
         if (this.malfunctionTween) {
            this.malfunctionTween.stop();
         }
         if (this.rune3) {
            this.addTween({
                 targets: [this.rune3, this.rune4],
                 alpha: 0,
                 duration: 300,
             });
         }
        globalObjects.textPopupManager.hideInfoText();
        playSound('clunk2');
         if (this.runTween) {
            this.runTween.stop();
         }
         if (this.runSfxLoop) {
            fadeAwaySound(this.runSfxLoop, 300)
         }
        super.die();
     }


     initAttacks() {
         this.attacks = [
             [
                 // 0
                 {
                     name: "}2x3",
                     chargeAmt: 500,
                     finishDelay: 500,
                     transitionFast: true,
                     isBigMove: true,
                     damage: -1,
                     startFunction: () => {

                     },
                     attackStartFunction: () => {

                     },
                     attackFinishFunction: () => {
                         this.throwTriple('star.png', 2, 1);
                     }
                 },
                 {
                     name: "WAITING...",
                     chargeAmt: 400,
                     transitionFast: true,
                     damage: -1,
                 },
                 {
                     name: "}2x12",
                     chargeAmt: 800,
                     finishDelay: 3500,
                     transitionFast: true,
                     isBigMove: true,
                     damage: -1,
                    startFunction: () => {

                    },
                    attackStartFunction: () => {

                    },
                    attackFinishFunction: () => {
                        this.throwTriple('star.png', 2, 4);
                    }
                 },
                 {
                     name: "WAITING...",
                     chargeAmt: 400,
                     transitionFast: true,
                     damage: -1,
                 },
                 // 0
                 {
                     name: "}2x15",
                     chargeAmt: 900,
                     finishDelay: 4500,
                     transitionFast: true,
                     isBigMove: true,
                     damage: -1,
                     startFunction: () => {

                     },
                     attackStartFunction: () => {

                     },
                     attackFinishFunction: () => {
                         this.throwTriple('star.png', 2, 5);
                     }
                 },
                 // 0
                 {
                     name: "WAITING...",
                     chargeAmt: 400,
                     transitionFast: true,
                     damage: -1,
                 },
                 {
                     name: "}2x18",
                     chargeAmt: 1000,
                     finishDelay: 5500,
                     transitionFast: true,
                     isBigMove: true,
                     damage: -1,
                     startFunction: () => {

                     },
                     attackStartFunction: () => {

                     },
                     attackFinishFunction: () => {
                         this.throwTriple('star.png', 2, 6);
                     }
                 },
                 {
                     name: "WAITING...",
                     chargeAmt: 400,
                     transitionFast: true,
                     damage: -1,
                 },
                 {
                     name: "}15",
                     chargeAmt: 600,
                     finishDelay: 700,
                     transitionFast: true,
                     isBigMove: true,
                     damage: -1,
                     startFunction: () => {

                     },
                     attackStartFunction: () => {

                     },
                     attackFinishFunction: () => {
                         this.throwWeapon('sword.png', 5, 1);
                     }
                 },
                 {
                     name: "Malfunctioning...",
                     chargeAmt: 300,
                     chargeMult: 10,
                     damage: -1,
                     isPassive: true,
                     startFunction: () => {
                         this.runSfxLoop.detune = 900;
                         setVolume(this.runSfxLoop, 1, 300)
                         this.sprite.setRotation(-0.09);
                         this.malfunctionTween = this.addTween({
                             targets: this.sprite,
                             rotation: 0.09,
                             ease: "Cubic.easeOut",
                             duration: 400,
                             repeat: -1
                         });
                     },
                     attackStartFunction: () => {
                         this.addTimeout(() => {
                             this.takeDamage(50, false);
                         }, 10);
                         playSound('clunk');
                         this.runSfxLoop.detune = 0;
                         setVolume(this.runSfxLoop, 0, 400)
                         this.malfunctionTween.stop();
                         this.sprite.setRotation(0.2);
                         this.addTween({
                             delay: 1000,
                             targets: this.sprite,
                             rotation: 0,
                             ease: "Quart.easeIn",
                             duration: 400,
                         });
                     },
                 },
             ]
         ];
     }
}
