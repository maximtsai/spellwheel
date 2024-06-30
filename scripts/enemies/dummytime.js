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
         if (this.playerSpellCastSub) {
             this.playerSpellCastSub.unsubscribe();
         }
         if (this.rune1) {
             this.rune1.destroy();
             this.rune2.destroy();
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


     initAttacks() {
         this.attacks = [
             [
                 // 0
                 {
                     name: "|12x2",
                     chargeAmt: 500,
                     finishDelay: 800,
                     isBigMove: true,
                     transitionFast: true,
                     damage: -1,
                    startFunction: () => {

                    },
                    attackStartFunction: () => {

                    },
                    attackFinishFunction: () => {
                        this.throwWeapon('sword.png', 12, 2);
                    }
                 },
                 {
                     name: "WAITING...",
                     chargeAmt: 700,
                     transitionFast: true,
                     isPassive: true,
                     damage: -1,
                     startFunction: () => {
                         globalObjects.textPopupManager.setInfoText(gameConsts.width, gameConsts.halfHeight - 160, getLangText('level4_train_tut_b'), 'right');
                         this.rune1 = this.addSprite(gameConsts.width - globalObjects.textPopupManager.getWidth() * 0.5 - 30, gameConsts.halfHeight - 80, 'circle', 'rune_reinforce_glow.png').setDepth(9999).setScale(0.75).setAlpha(0);
                         this.rune2 = this.addSprite(gameConsts.width - globalObjects.textPopupManager.getWidth() * 0.5 + 26, gameConsts.halfHeight - 81, 'circle', 'rune_time_glow.png').setDepth(9999).setScale(0.75).setAlpha(0);
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

                     }
                 },
                 {
                     name: "PREPARING ATTACKS!",
                     chargeAmt: 450,
                     transitionFast: true,
                     isBigMove: true,
                     damage: -1,
                     startFunction: () => {
                         globalObjects.textPopupManager.hideInfoText();
                         if (this.rune1) {
                             this.addTween({
                                 targets: [this.rune1, this.rune2],
                                 alpha: 0,
                                 duration: 200,
                             });
                         }
                     },
                     attackStartFunction: () => {
                         this.currentAttackSetIndex = 1;
                         this.nextAttackIndex = 0;
                     }
                 },
             ],
             [
                 {
                     name: "|10",
                     chargeAmt: 375,
                     chargeMult: 2,
                     finishDelay: 500,
                     transitionFast: true,
                     damage: -1,
                     startFunction: () => {

                     },
                     attackStartFunction: () => {

                     },
                     attackFinishFunction: () => {
                         this.throwWeapon('sword.png', 10, 1);
                     }
                 },
                 {
                     name: "|6x3",
                     chargeAmt: 500,
                     chargeMult: 2,
                     finishDelay: 500,
                     transitionFast: true,
                     damage: -1,
                     startFunction: () => {

                     },
                     attackStartFunction: () => {

                     },
                     attackFinishFunction: () => {
                         this.throwTriple('dagger.png', 6, 1);
                     }
                 },
                 {
                     name: "WAITING...",
                     chargeAmt: 350,
                     transitionFast: true,
                 },
                 {
                     name: "|10",
                     chargeAmt: 375,
                     chargeMult: 2,
                     finishDelay: 300,
                     transitionFast: true,
                     damage: -1,
                     startFunction: () => {

                     },
                     attackStartFunction: () => {

                     },
                     attackFinishFunction: () => {
                         this.throwWeapon('sword.png', 10, 1);
                     }
                 },
                 {
                     name: "|6x3",
                     chargeAmt: 500,
                     chargeMult: 2,
                     finishDelay: 300,
                     transitionFast: true,
                     damage: -1,
                     startFunction: () => {

                     },
                     attackStartFunction: () => {

                     },
                     attackFinishFunction: () => {
                         this.throwTriple('dagger.png', 6, 1);
                     }
                 },
                 {
                     name: "WAITING...",
                     chargeAmt: 350,
                     transitionFast: true,
                 },
             ]
         ];
     }
}
