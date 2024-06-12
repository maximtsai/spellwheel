 class Dummypractice extends Enemy {
    constructor(scene, x, y, level) {
        super(scene, x, y, level);
        this.shieldOffsetY = -100;
        this.initSprite('dummy_paper.png', 1, 0, 5, 'dummyenemy');
        globalObjects.encyclopedia.showButton();
        globalObjects.options.showButton();
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
        this.damageCanEmit = true;
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

    takeDamage(amt, isAttack, yOffset) {
        super.takeDamage(amt, isAttack, yOffset);
        if (this.damageCanEmit) {
            this.damageCanEmit = false;
            this.createDamageParticles();
            this.addTimeout(() => {
                this.damageCanEmit = true;
            }, 400)
        }
    }

    tempShiftSFX() {
        if (this.runSfxLoop) {
            this.runSfxLoop.detune = 750;
            setVolume(this.runSfxLoop, 1, 300)
            setTimeout(() => {
                this.runSfxLoop.detune = 0;
                setVolume(this.runSfxLoop, 0, 300)
            }, 600)
        }
    }

    throwWeapon(name, damage, numTimes = 1) {
        this.addTween({
            targets: this.sprite,
            scaleX: this.sprite.startScale * 0.85,
            scaleY: this.sprite.startScale * 0.85,
            rotation: (numTimes % 2 == 1) ? -0.25 : 0.25,
            ease: "Quart.easeOut",
            duration: 700,
            onComplete: () => {
                let weapon = this.addImage(this.x, this.y - 105, 'dummyenemy', name).setDepth(0).setScale(0.2);
                this.addTween({
                    targets: weapon,
                    rotation: Math.random() < 0.5 ? -12.566 : 12.566,
                    duration: 1300,
                });
                this.addTween({
                    targets: weapon,
                    y: this.y - 310,
                    scaleX: 0.8,
                    scaleY: 0.8,
                    ease: "Cubic.easeOut",
                    duration: 550,
                    onComplete: () => {
                        weapon.setDepth(20);
                        playSound('matter_body');
                        weapon.setScale(1.2);
                        this.addTween({
                            targets: weapon,
                            scaleX: 1,
                            scaleY: 1,
                            ease: "Cubic.easeOut",
                            duration: 500,
                        });
                        this.addTween({
                            targets: weapon,
                            y: globalObjects.player.getY() - 220,
                            ease: "Cubic.easeIn",
                            duration: 750,
                            onComplete: () => {
                                messageBus.publish("selfTakeDamage", damage);
                                 let hitEffect = this.addSprite(gameConsts.halfWidth, globalObjects.player.getY() - 190, 'spells').play('damageEffect').setRotation((Math.random() - 0.5) * 3).setScale(1.5).setDepth(195);
                                 this.addTween({
                                     targets: hitEffect,
                                     scaleX: 1.25,
                                     scaleY: 1.25,
                                     ease: 'Cubic.easeOut',
                                     duration: 150,
                                     onComplete: () => {
                                         hitEffect.destroy();
                                     }
                                 });
                                 let detuneAmt = (numTimes % 3) * 200 - 300;
                                 playSound('punch').detune = detuneAmt;
                                this.addTween({
                                    delay: 500,
                                    targets: weapon,
                                    alpha: 0,
                                    duration: 500,
                                });
                            }
                        });
                    }
                });
                this.addTween({
                    targets: this.sprite,
                    scaleX: this.sprite.startScale * 1.1,
                    scaleY: this.sprite.startScale * 1.1,
                    rotation: numTimes % 2 == 1 ? 0.05 : -0.05,
                    ease: "Quart.easeIn",
                    duration: 500,
                    onComplete: () => {
                        if (numTimes <= 1) {
                            this.addTween({
                                targets: this.sprite,
                                scaleX: this.sprite.startScale,
                                scaleY: this.sprite.startScale,
                                rotation: 0,
                                ease: "Bounce.easeOut",
                                duration: 400,
                            });
                        }
                    }
                });
                if (numTimes > 1) {
                    this.addTimeout(() => {
                        this.throwWeapon(name, damage, numTimes - 1);
                    }, 500)
                }

            }
        });
    }

    createDamageParticles() {
        let cloud1 = getTempPoolObject('dummyenemy', 'cloud1.png', 'cloud1', 1100);
        let cloud2 = getTempPoolObject('dummyenemy', 'cloud2.png', 'cloud1', 1100);
        cloud1.setPosition(this.x, this.y - 100).setScale(0.6 + Math.random() * 0.2).setRotation(Math.random() - 0.5).setAlpha(1);
        cloud2.setPosition(this.x, this.y - 100).setScale(0.8 + Math.random() * 0.2).setRotation(Math.random() - 0.5).setAlpha(1);
        let randRot1 = Math.random() * 6.28;
        let randX = Math.sin(randRot1) * 220;
        let randY = Math.abs(Math.cos(randRot1)) * -200;
        this.addTween({
            targets: cloud1,
            x: "+=" + randX,
            y: "+=" + randY,
            ease: "Cubic.easeOut",
            duration: 1000,
        });
        let randRot2 = Math.random() * 6.28;
        let rand2X = Math.sin(randRot2) * 220;
        let rand2Y = Math.abs(Math.cos(randRot2)) * -200;
        this.addTween({
            targets: cloud2,
            x: "+=" + rand2X,
            y: "+=" + rand2X,
            ease: "Cubic.easeOut",
            duration: 1000,
        });
        this.addTween({
            targets: [cloud1, cloud2],
            alpha: 0,
            ease: "Cubic.easeIn",
            duration: 1000,
        });
        this.addTween({
            targets: [cloud1, cloud2],
            rotation: (Math.random() - 0.5) * 0.1,
            ease: "Quad.easeOut",
            duration: 1000,
        });
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
                        let dmgEffect = this.addSprite(gameConsts.halfWidth + (Math.random() - 0.5) * 20, globalObjects.player.getY() - 185, 'spells', 'damageEffect1.png').setDepth(998).setScale(1.5);
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
                this.globalClickBlocker.setOnMouseUpFunc(() => {
                    PhaserScene.tweens.add({
                         targets: [this.sprite, darkDummy],
                         alpha: 0,
                         duration: 800,
                    });

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
                            globalObjects.postFightScreen.createWinScreenMin(-this.level);
                        }
                    });
                });
             }
         });
     }
}
