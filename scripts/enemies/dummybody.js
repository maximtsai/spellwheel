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
        this.health = 130;
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
             this.rune3 = this.addImage(gameConsts.width - 160, gameConsts.halfHeight - 60, 'circle', 'rune_matter_glow.png').setDepth(9999).setScale(0.8, 0.8).setAlpha(0);
             this.rune4 = this.addImage(gameConsts.width - 82, gameConsts.halfHeight - 60, 'circle', 'rune_reinforce_glow.png').setDepth(9999).setScale(0.8, 0.8).setAlpha(0);
             globalObjects.textPopupManager.setInfoText(gameConsts.width, gameConsts.halfHeight - 165, "Thorns reduce\nincoming damage\nand can inflict\ndamage back.\n             +", 'right');
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
                     name: "}2x15",
                     chargeAmt: 700,
                     finishDelay: 4000,
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
                     name: "}2x18",
                     chargeAmt: 700,
                     finishDelay: 5000,
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
                 // 0
                 {
                     name: "}2x24",
                     chargeAmt: 700,
                     finishDelay: 15000,
                     transitionFast: true,
                     isBigMove: true,
                     damage: -1,
                     startFunction: () => {

                     },
                     attackStartFunction: () => {

                     },
                     attackFinishFunction: () => {
                         this.throwTriple('star.png', 2, 8);
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
                         setTimeout(() => {
                             this.takeDamage(20, false);
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
