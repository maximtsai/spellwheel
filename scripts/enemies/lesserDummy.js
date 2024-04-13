 class LesserDummy extends Enemy {
    constructor(scene, x, y, level) {
        super(scene, x, y, level);
        this.initSprite('lesser_dummy.png', 0.8, 0, 5);
        playSound('fightbg1', 0.5, true);
        this.sprite.setOrigin(0.5, 0.99);
        this.playerSpellCastSub = messageBus.subscribe('playerCastedSpell', () => {
            if (globalObjects.player.getPlayerCastSpellsCount() === 1) {
                this.initTutorial2();
            } else if (globalObjects.player.getPlayerCastSpellsCount() === 2) {
                setTimeout(() => {
                    this.attemptTutThree();
                }, 3000);
                this.playerSpellCastSub.unsubscribe()
            }
        });
    }

     initStatsCustom() {
         this.health = 40;
         this.isAsleep = true;

         this.initTutorial();
     }

     initTutorial() {
         this.shadow = this.scene.add.sprite(globalObjects.player.getX(), globalObjects.player.getY() - 1, 'misc', 'shadow_circle.png').setScale(6).setDepth(9999).setAlpha(0);
        setTimeout(() => {
            if (globalObjects.player.getPlayerCastSpellsCount() === 0) {
                // globalObjects.textPopupManager.setInfoText(gameConsts.halfWidth + 1, gameConsts.height - 38, "Click to cast\na spell");
                let spellListener = messageBus.subscribe('spellClicked', () => {
                    this.firstPopupClosed = true;
                    // globalObjects.textPopupManager.hideInfoText();
                    spellListener.unsubscribe();
                    if (this.currShadowTween) {
                        this.currShadowTween.stop();
                    }
                    PhaserScene.tweens.add({
                        targets: this.shadow,
                        alpha: 0,
                        ease: "Cubic.easeOut",
                        scaleX: 8,
                        scaleY: 8,
                        duration: 500,
                    });
                });
                this.currShadowTween = PhaserScene.tweens.add({
                    targets: this.shadow,
                    alpha: 0.65,
                    ease: "Cubic.easeOut",
                    scaleX: 5.6,
                    scaleY: 5.6,
                    duration: 700,
                    onComplete: () => {
                        if (globalObjects.player.getPlayerCastSpellsCount() !== 0 && !this.firstPopupClosed) {
                            globalObjects.textPopupManager.hideInfoText();
                            spellListener.unsubscribe();
                            PhaserScene.tweens.add({
                                targets: this.shadow,
                                alpha: 0,
                                ease: "Cubic.easeOut",
                                scaleX: 8,
                                scaleY: 8,
                                duration: 350,
                            });
                        }
                    }
                });
                setTimeout(() => {
                    globalObjects.magicCircle.showReadySprite();
                }, 1000);
                setTimeout(() => {
                    if (globalObjects.player.getPlayerCastSpellsCount() === 0) {
                        globalObjects.magicCircle.showReadySprite();
                        setTimeout(() => {
                            if (globalObjects.player.getPlayerCastSpellsCount() === 0) {
                                globalObjects.magicCircle.showReadySprite();
                            }
                        }, 6000)
                    }
                }, 4000)
            }
        }, 2500)
    }

     showArrowRotate() {
         PhaserScene.tweens.add({
             targets: [this.arrowRotate1, this.arrowRotate2],
             alpha: 0.8,
             duration: 400,
         });

         PhaserScene.tweens.add({
             targets: [this.arrowRotate1],
             rotation: this.arrowRotate1.rotation * -1,
             ease: 'Cubic.easeInOut',
             duration: 1300,
             completeDelay: 100,
             onComplete: () => {
                 PhaserScene.tweens.add({
                     delay: 900,
                     targets: [this.arrowRotate1, this.arrowRotate2],
                     alpha: 0,
                     duration: 400,
                 });
                 PhaserScene.tweens.add({
                     targets: [this.arrowRotate1],
                     rotation: this.arrowRotate1.rotation * -1,
                     ease: 'Cubic.easeInOut',
                     duration: 1300,
                 });
             }
         });
         PhaserScene.tweens.add({
             targets: [this.arrowRotate2],
             rotation: this.arrowRotate2.rotation * -1,
             ease: 'Cubic.easeInOut',
             duration: 1300,
             completeDelay: 100,
             onComplete: () => {
                 PhaserScene.tweens.add({
                     targets: [this.arrowRotate2],
                     rotation: this.arrowRotate2.rotation * -1,
                     ease: 'Cubic.easeInOut',
                     duration: 1300,
                     completeDelay: 3000,
                     onComplete: () => {
                         if (!this.dead && globalObjects.player.getPlayerCastSpellsCount() === 1) {
                             this.showArrowRotate();
                         }
                     }
                 });
             }
         });
     }

    initTutorial2() {
        setTimeout(() => {
            if (globalObjects.player.getPlayerCastSpellsCount() === 1 && !this.dead) {
                // player only casted 1 spell so far
                globalObjects.textPopupManager.setInfoText(gameConsts.halfWidth + 1, gameConsts.height - 38, "Switch spells by spinning\n<=  the two wheels  =>");
                this.arrowRotate1 = this.scene.add.sprite(globalObjects.player.getX(), globalObjects.player.getY(), 'circle', 'arrow_rotate.png').setOrigin(0.5, 0.5).setDepth(777).setRotation(0.15).setAlpha(0);
                this.arrowRotate2 = this.scene.add.sprite(globalObjects.player.getX(), globalObjects.player.getY(), 'circle', 'arrow_rotate_small.png').setOrigin(0.5, 0.5).setDepth(777).setScale(0.96).setRotation(-0.15).setAlpha(0);
                this.destructibles.push(this.arrowRotate1);
                this.destructibles.push(this.arrowRotate2);
                this.showArrowRotate();

                let spellListener = messageBus.subscribe('spellClicked', () => {
                    globalObjects.textPopupManager.hideInfoText();
                    spellListener.unsubscribe();
                    this.currShadowTween.stop();
                    PhaserScene.tweens.add({
                        targets: this.shadow,
                        alpha: 0,
                        ease: "Cubic.easeOut",
                        scaleX: 14,
                        scaleY: 14,
                        duration: 500,
                        completeDelay: 1000,
                        onComplete: () => {
                            this.attemptTutThree();
                        }
                    });
                });

                this.currShadowTween = PhaserScene.tweens.add({
                    targets: this.shadow,
                    alpha: 0.55,
                    ease: "Cubic.easeOut",
                    scaleX: 13,
                    scaleY: 13,
                    duration: 500,
                    onComplete: () => {
                        if (globalObjects.player.getPlayerCastSpellsCount() > 1 && this.shadow.alpha > 0.54) {
                            globalObjects.textPopupManager.hideInfoText();
                            spellListener.unsubscribe();
                            PhaserScene.tweens.add({
                                targets: this.shadow,
                                alpha: 0,
                                ease: "Cubic.easeOut",
                                scaleX: 18,
                                scaleY: 18,
                                duration: 500,
                                completeDelay: 1000,
                                onComplete: () => {
                                    this.attemptTutThree();
                                }
                            });
                        }
                    }
                });
            }
        }, 3400);
    }

    attemptTutThree() {
        if (!this.dead && !this.attemptedTutThree) {
            this.attemptedTutThree = true;
            setTimeout(() => {
            this.shadow.setFrame('shadow_bar.png').setPosition(gameConsts.halfWidth, 30).setScale(8);
            // = this.scene.add.sprite(gameConsts.halfWidth, 30, 'misc', 'shadow_bar.png').setScale(6).setDepth(9999).setAlpha(0);
            PhaserScene.tweens.add({
                targets: this.shadow,
                scaleX: 3.4,
                scaleY: 3.4,
                y: 20,
                ease: 'Cubic.easeOut',
                alpha: 0.7,
                duration: 1000,
                onComplete: () => {
                    PhaserScene.tweens.add({
                        delay: 50,
                        scaleX: 3.1,
                        scaleY: 3.1,
                        targets: this.shadow,
                        alpha: 0.2,
                        duration: 1500,
                        onComplete: () => {
                            PhaserScene.tweens.add({
                                delay: 1000,
                                targets: this.shadow,
                                alpha: 0,
                                duration: 1500,
                                onComplete: () => {
                                    this.shadow.destroy();
                                }
                            });
                        }
                    });
                }
            });
            globalObjects.textPopupManager.setInfoText(gameConsts.halfWidth + 175, 30, "<= Defeat the\nenemy to win");
            this.glowHealth = this.scene.add.sprite(gameConsts.halfWidth, 21, 'lowq', 'glow_flat_green.webp').setDepth(0).setAlpha(0).setScale(0.25, 1.5);
            PhaserScene.tweens.add({
                targets: this.glowHealth,
                alpha: 0.75,
                scaleX: 1,
                ease: 'Cubic.easeInOut',
                duration: 1500,
                onComplete: () => {
                    PhaserScene.tweens.add({
                        targets: this.glowHealth,
                        alpha: 0,
                        scaleX: 0.7,
                        ease: 'Cubic.easeIn',
                        duration: 1500,
                        onComplete: () => {
                            PhaserScene.tweens.add({
                                targets: this.glowHealth,
                                alpha: 0.55,
                                scaleX: 0.9,
                                ease: 'Cubic.easeInOut',
                                duration: 1500,
                                onComplete: () => {
                                    PhaserScene.tweens.add({
                                        targets: this.glowHealth,
                                        alpha: 0,
                                        duration: 1000,
                                    });
                                }
                            });
                        }
                    });
                }
            });
            }, 1200);
        }
    }

     setHealth(newHealth) {
         super.setHealth(newHealth);
         if (newHealth > 0) {
             PhaserScene.tweens.add({
                 targets: this.sprite,
                 rotation: -0.1,
                 ease: "Quart.easeOut",
                 duration: 50,
                 onComplete: () => {
                     PhaserScene.tweens.add({
                         targets: this.sprite,
                         rotation: 0,
                         ease: "Back.easeOut",
                         duration: 400,
                     });
                 }
             });
         }
     }

     die() {
         if (this.dead) {
             return;
         }
        super.die();
        globalObjects.textPopupManager.hideInfoText();

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
         PhaserScene.tweens.add({
             targets: this.sprite,
             rotation: -0.5,
             ease: "Cubic.easeIn",
             duration: 750,
             onComplete: () => {
                 this.setSprite('lesser_dummy_dead.png', this.sprite.scaleX);
                 this.sprite.rotation = 0;
                 this.sprite.y += 35;
                 this.sprite.x -= 40;
                 this.showVictory();


             }
         });
     }

     showVictory() {
         let banner = this.scene.add.sprite(gameConsts.halfWidth, gameConsts.halfHeight - 40, 'misc', 'victory_banner.png').setScale(100, 1.3).setDepth(9998).setAlpha(0);
         let victoryText = this.scene.add.sprite(gameConsts.halfWidth, gameConsts.halfHeight - 40, 'misc', 'victory_text.png').setScale(0.95).setDepth(9998).setAlpha(0);
         let continueText = this.scene.add.text(gameConsts.width - 15, gameConsts.halfHeight + 2, 'CONTINUE').setAlpha(0).setOrigin(1, 0.5).setAlign('right').setDepth(9998).setFontSize(22);

         PhaserScene.tweens.add({
             targets: banner,
             alpha: 0.8,
             duration: 500,
         });

         PhaserScene.tweens.add({
             targets: [victoryText],
             alpha: 1,
             ease: 'Quad.easeOut',
             duration: 500,
         });

         PhaserScene.tweens.add({
             targets: victoryText,
             scaleX: 1,
             scaleY: 1,
             duration: 800,
         });
         setTimeout(() => {
             continueText.alpha = 1;
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
                         beginLevel(1);
                         PhaserScene.tweens.add({
                             targets: this.sprite,
                             alpha: 0,
                             duration: 600,
                             onComplete: () => {
                                 this.destroy();
                             }
                         });
                     }
                 });
             })
         }, 1000);
     }

     initAttacks() {
         this.attacks = [
             [
                 // 0
                 {
                     name: "}999 ",
                     chargeAmt: 999,
                     damage: 999,
                    attackFinishFunction: () => {
                        let dmgEffect = this.scene.add.sprite(gameConsts.halfWidth + (Math.random() - 0.5) * 20, globalObjects.player.getY() - 185, 'spells', 'damageEffect1.png').setDepth(998).setScale(1.5);
                        setTimeout(() => {
                            dmgEffect.destroy();
                        }, 150)
                    }
                 }
             ]
         ];
     }
}
