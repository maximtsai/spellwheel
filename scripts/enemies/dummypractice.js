 class Dummypractice extends Enemy {
    constructor(scene, x, y, level) {
        super(scene, x, y, level);
        this.shieldOffsetY = -100;
        this.initSprite('dummy_paper.png', 1, 0, 5, 'dummyenemy');
        // this.playerSpellCastSub = messageBus.subscribe('playerCastedSpell', () => {
        //     if (globalObjects.player.getPlayerCastSpellsCount() === 1) {
        //         // this.initTutorial2();
        //     } else if (globalObjects.player.getPlayerCastSpellsCount() > 1 && this.canHideStartTut) {
        //         this.playerSpellCastSub.unsubscribe();
        //         this.initTutorial3();
        //     } else if (globalObjects.player.getPlayerCastSpellsCount() > 3) {
        //         this.playerSpellCastSub.unsubscribe();
        //         this.initTutorial3();
        //     }
        // });
        // let spellHoverListener = messageBus.subscribe('spellNameTextUpdate', (text) => {
        //     if (!globalObjects.magicCircle.innerDragDisabled && text.includes('STRONGER')) {
        //         this.canHideStartTut = true;
        //         spellHoverListener.unsubscribe();
        //     }
        // });
        this.addTimeout(() => {
            this.initTutorial();
        }, 50)
        // this.popupTimeout = this.addTimeout(() => {
        //     this.tutorialButton = createTutorialBtn(this.level);
        //     this.addToDestructibles(this.tutorialButton);
        // }, 3500)
    }

     initStatsCustom() {
         this.health = 100;
         this.isAsleep = true;
        this.attackScale = 1;
        this.pullbackScale = 1;
     }



     initTutorial() {
        this.bgMusic = playMusic('bite_down_simplified', 0.65, true);
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

        globalObjects.textPopupManager.hideInfoText();
        this.globalClickBlocker = createGlobalClickBlocker(false);
        let darkDummy = this.addSprite(this.sprite.startX, this.sprite.y, 'dummyenemy', 'dummy_paper_dark.png').setScale(this.sprite.startScale).setDepth(11).setAlpha(0.1);
         this.addTween({
             targets: darkDummy,
             alpha: 0.7,
             ease: "Cubic.easeIn",
             duration: 1800,
         });
         this.addTween({
             targets: [this.sprite, darkDummy],
             scaleY: 0,
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
                 });
                 this.addTween({
                     targets: [this.sprite, darkDummy],
                     rotation: 0.2,
                     ease: "Quad.easeOut",
                     duration: 1000,
                     onComplete: () => {
                        playSound('clunk').detune = 500;
                        this.showComplete();
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
             ]
         ];
     }

    showComplete() {
        globalObjects.encyclopedia.hideButton();
        globalObjects.options.hideButton();
        globalObjects.magicCircle.disableMovement();
        let banner = this.scene.add.sprite(gameConsts.halfWidth, gameConsts.halfHeight - 40, 'misc', 'victory_banner.png').setScale(100, 1.3).setDepth(9998).setAlpha(0);
        let victoryText = this.scene.add.sprite(gameConsts.halfWidth, gameConsts.halfHeight - 40, 'misc', 'complete.png').setScale(0.95).setDepth(9998).setAlpha(0);
        let continueText = this.scene.add.text(gameConsts.width - 15, gameConsts.halfHeight + 2, 'CONTINUE').setAlpha(0).setOrigin(1, 0.5).setAlign('right').setDepth(9998).setFontSize(22);

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
         setTimeout(() => {
             continueText.alpha = 1;
         }, 1000);

         PhaserScene.tweens.add({
             targets: victoryText,
             scaleX: 1,
             scaleY: 1,
             duration: 800,
             onComplete: () => {
                if (this.dieClickBlocker) {
                     this.dieClickBlocker.setOnMouseUpFunc(() => {
                        this.dieClickBlocker.destroy();
                         PhaserScene.tweens.add({
                             targets: [victoryText, banner],
                             alpha: 0,
                             duration: 400,
                             onComplete: () => {
                                 victoryText.destroy();
                                 banner.destroy();
                                 continueText.destroy();
                                globalObjects.magicCircle.enableMovement();
                                globalObjects.postFightScreen.createWinScreen(-this.level);
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
                 } else {
                     this.globalClickBlocker.setOnMouseUpFunc(() => {
                        hideGlobalClickBlocker();
                         PhaserScene.tweens.add({
                             targets: [victoryText, banner],
                             alpha: 0,
                             duration: 400,
                             onComplete: () => {
                                 victoryText.destroy();
                                 banner.destroy();
                                 continueText.destroy();
                                globalObjects.magicCircle.enableMovement();
                                globalObjects.postFightScreen.createWinScreen(-level);
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
                    });
                 }
             }
         });
     }
}
