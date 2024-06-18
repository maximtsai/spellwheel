 class LesserDummy extends Enemy {
    constructor(scene, x, y, level) {
        super(scene, x, y, level);
        this.initSprite('lesser_dummy.png', 0.9, 0, undefined, undefined, 0);
        this.sprite.setOrigin(0.5, 0.98);
        this.playerSpellCastSub = messageBus.subscribe('playerCastedSpell', () => {
            if (globalObjects.player.getPlayerCastSpellsCount() === 1) {
                if (!this.bgMusic) {
                    this.bgMusic = playMusic('bite_down_simplified', 0.6, true);
                }
                this.initTutorial2();
            } else if (globalObjects.player.getPlayerCastSpellsCount() === 2) {
                this.addTimeout(() => {
                    this.attemptTutThree();
                }, 3000);
                this.playerSpellCastSub.unsubscribe()
            }
        });
         this.initTutorial(x, y);
    }

    initSpriteAnim(scale) {
        let origY = this.sprite.y;
        this.sprite.setScale(scale * 0.85, scale * 0.85).setAlpha(1);
        this.sprite.y += 92;
        this.addTween({
            targets: this.sprite,
            duration: 1500,
            ease: 'Quint.easeInOut',
            scaleX: scale,
            scaleY: scale,
            y: origY,
        });
    }

     initStatsCustom() {
         this.health = 36;
         this.isAsleep = true;
     }

     initTutorial(x, y) {
        let dummyShadow = this.addSprite(x - 6, y - 50, 'misc', 'shadow_circle.png').setScale(13).setDepth(9999).setAlpha(0);
        this.addTween({
            targets: dummyShadow,
            alpha: 0.4,
            ease: "Cubic.easeInOut",
            y: y - 114,
            scaleX: 8,
            scaleY: 8,
            duration: 1500,
        });

         this.shadow = this.addSprite(globalObjects.player.getX(), globalObjects.player.getY() - 1, 'misc', 'shadow_circle.png').setScale(6).setDepth(9999).setAlpha(0);
        this.addTimeout(() => {
            if (globalObjects.player.getPlayerCastSpellsCount() === 0) {
                globalObjects.magicCircle.disableMovement();
                // TODO Add for main dummy too
                globalObjects.bannerTextManager.setDialog(["This thing is in the way.", "I should knock it over."]);
                globalObjects.bannerTextManager.setPosition(gameConsts.halfWidth, gameConsts.height - 130, 0);
                globalObjects.bannerTextManager.showBanner(false);
                globalObjects.bannerTextManager.setOnFinishFunc(() => {
                    globalObjects.magicCircle.enableMovement();
                    messageBus.publish("highlightRunes");
                    this.addTween({
                        targets: dummyShadow,
                        alpha: 0,
                        ease: "Cubic.easeOut",
                        scaleX: 10,
                        scaleY: 10,
                        duration: 400,
                        onComplete: () => {
                            dummyShadow.destroy();
                        }
                    });
                    globalObjects.bannerTextManager.setOnFinishFunc(() => {});
                    globalObjects.bannerTextManager.closeBanner();
                    if (!this.bgMusic) {
                        this.bgMusic = playMusic('bite_down_simplified', 0.6, true);
                        // this.shadow.setPosition(globalObjects.player.getX(), globalObjects.player.getY() - 1);
                        // globalObjects.textPopupManager.setInfoText(gameConsts.halfWidth + 1, gameConsts.height - 38, "Click to cast\na spell");
                        let spellListener = messageBus.subscribe('spellClicked', () => {
                            this.firstPopupClosed = true;
                            // globalObjects.textPopupManager.hideInfoText();
                            messageBus.publish("unhighlightRunes");
                            spellListener.unsubscribe();
                            if (this.currShadowTween) {
                                this.currShadowTween.stop();
                            }
                            this.addTween({
                                targets: this.shadow,
                                alpha: 0,
                                ease: "Cubic.easeOut",
                                scaleX: 8,
                                scaleY: 8,
                                duration: 500,
                            });
                        });
                        this.currShadowTween = this.addTween({
                            delay: 200,
                            targets: this.shadow,
                            alpha: 0.65,
                            ease: "Cubic.easeOut",
                            scaleX: 5.6,
                            scaleY: 5.6,
                            duration: 700,
                            onComplete: () => {
                                if (globalObjects.player.getPlayerCastSpellsCount() !== 0 && !this.firstPopupClosed) {
                                    messageBus.publish("unhighlightRunes");
                                    globalObjects.textPopupManager.hideInfoText();
                                    spellListener.unsubscribe();
                                    this.addTween({
                                        targets: this.shadow,
                                        alpha: 0,
                                        ease: "Cubic.easeOut",
                                        scaleX: 8,
                                        scaleY: 8,
                                        duration: 750,
                                    });
                                }
                            }
                        });
                        this.addTimeout(() => {
                            globalObjects.magicCircle.showReadySprite();
                        }, 1000);
                        this.addTimeout(() => {
                            if (globalObjects.player.getPlayerCastSpellsCount() === 0) {
                                globalObjects.magicCircle.showReadySprite();
                                this.addTimeout(() => {
                                    if (globalObjects.player.getPlayerCastSpellsCount() === 0) {
                                        globalObjects.magicCircle.showReadySprite();
                                    }
                                }, 6000)
                            }
                        }, 4000)
                    }
                });
            }
        }, 1100)
    }

     showArrowRotate() {
         this.addTween({
             targets: [this.arrowRotate1, this.arrowRotate2],
             alpha: 0.8,
             duration: 400,
         });

         this.addTween({
             targets: [this.arrowRotate1],
             rotation: this.arrowRotate1.rotation * -1,
             ease: 'Cubic.easeInOut',
             duration: 1100,
             completeDelay: 100,
             onComplete: () => {
                 this.addTween({
                     delay: 900,
                     targets: [this.arrowRotate1, this.arrowRotate2],
                     alpha: 0,
                     duration: 400,
                 });
                 this.addTween({
                     targets: [this.arrowRotate1],
                     rotation: this.arrowRotate1.rotation * -1,
                     ease: 'Cubic.easeInOut',
                     duration: 1100,
                 });
             }
         });
         this.addTween({
             targets: [this.arrowRotate2],
             rotation: this.arrowRotate2.rotation * -1,
             ease: 'Cubic.easeInOut',
             duration: 1100,
             completeDelay: 100,
             onComplete: () => {
                 this.addTween({
                     targets: [this.arrowRotate2],
                     rotation: this.arrowRotate2.rotation * -1,
                     ease: 'Cubic.easeInOut',
                     duration: 1100,
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
        this.addTimeout(() => {
            if (globalObjects.player.getPlayerCastSpellsCount() === 1 && !this.dead) {
                // player only casted 1 spell so far
                globalObjects.textPopupManager.setInfoText(gameConsts.halfWidth + 1, gameConsts.height - 38, "Spin the wheels to\n swap in fresh runes ");
                this.arrowRotate1 = this.addSprite(globalObjects.player.getX(), globalObjects.player.getY(), 'circle', 'arrow_rotate.png').setOrigin(0.5, 0.5).setDepth(777).setRotation(0.15).setAlpha(0);
                this.arrowRotate2 = this.addSprite(globalObjects.player.getX(), globalObjects.player.getY(), 'circle', 'arrow_rotate_small.png').setOrigin(0.5, 0.5).setDepth(777).setScale(0.96).setRotation(-0.15).setAlpha(0);
                this.destructibles.push(this.arrowRotate1);
                this.destructibles.push(this.arrowRotate2);
                this.showArrowRotate();

                let spellListener = messageBus.subscribe('spellClicked', () => {
                    globalObjects.textPopupManager.hideInfoText();
                    spellListener.unsubscribe();
                    this.currShadowTween.stop();
                    this.addTween({
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

                this.currShadowTween = this.addTween({
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
                            this.addTween({
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
            this.addTimeout(() => {
            this.shadow.destroy();
            if (this.dead) {
                return;
            }
            // setFrame('shadow_bar.png').setPosition(gameConsts.halfWidth, 25).setScale(3.5).setAlpha(0.2);
            // // = this.addSprite(gameConsts.halfWidth, 30, 'misc', 'shadow_bar.png').setScale(6).setDepth(9999).setAlpha(0);
            // this.addTween({
            //     targets: this.shadow,
            //     scaleX: 3.4,
            //     scaleY: 3.4,
            //     y: 20,
            //     ease: 'Cubic.easeOut',
            //     alpha: 0.5,
            //     duration: 250,
            //     onComplete: () => {
            //         this.addTween({
            //             scaleX: 5,
            //             scaleY: 5,
            //             targets: this.shadow,
            //             alpha: 0,
            //             duration: 1000,
            //             onComplete: () => {
            //                         this.shadow.destroy();
            //             }
            //         });
            //     }
            // });
            this.addTimeout(() => {
                if (!this.dead) {
                    globalObjects.textPopupManager.setInfoText(gameConsts.halfWidth - 180, 30, "Defeat the =>\nenemy to win");
                }

            }, 800);
            this.glowHealth = this.addSprite(gameConsts.halfWidth, 21, 'blurry', 'glow_flat_green.webp').setDepth(0).setAlpha(0).setScale(0.25, 1.5);
            this.glowHealth2 = this.addSprite(gameConsts.halfWidth, 21, 'blurry', 'glow_flat_red.webp').setDepth(0).setAlpha(1.1).setScale(0.5, 2);
            this.addTween({
                targets: this.glowHealth2,
                scaleX: 3,
                ease: 'Quad.easeOut',
                duration: 800,
                onComplete: () => {
                    this.glowHealth2.destroy();
                }
            });
            this.addTween({
                targets: this.glowHealth2,
                scaleY: 0,
                alpha: 0,
                ease: 'Quad.easeIn',
                duration: 800,
            });

            this.addTween({
                targets: this.glowHealth,
                alpha: 0.75,
                scaleX: 1,
                ease: 'Cubic.easeInOut',
                duration: 1500,
                onComplete: () => {
                    this.addTween({
                        targets: this.glowHealth,
                        alpha: 0,
                        scaleX: 0.7,
                        ease: 'Cubic.easeIn',
                        duration: 1500,
                        onComplete: () => {
                            this.addTween({
                                targets: this.glowHealth,
                                alpha: 0.55,
                                scaleX: 0.9,
                                ease: 'Cubic.easeInOut',
                                duration: 1500,
                                onComplete: () => {
                                    this.addTween({
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
             this.addTween({
                 targets: this.sprite,
                 rotation: -0.1,
                 ease: "Quart.easeOut",
                 duration: 50,
                 onComplete: () => {
                     this.addTween({
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
        this.setDefaultSprite('lesser_dummy_noshadow.png', this.sprite.scaleX);
        this.sprite.setOrigin(0.5, 0.99);

         this.addTween({
             targets: this.sprite,
             rotation: -1.25,
             ease: "Cubic.easeIn",
             duration: 900,
             onComplete: () => {
                 this.setSprite('lesser_dummy_dead.png', this.sprite.scaleX);
                 this.sprite.rotation = 0;
                 this.sprite.y += 54;
                 this.sprite.x -= 81;
                 this.showVictory();

             }
         });

         this.addTween({
             targets: this.sprite,
             x: "+=35",
             ease: "Cubic.easeOut",
             duration: 400,
         });
     }

     showVictory() {
         globalObjects.magicCircle.disableMovement();
         let banner = this.addSprite(gameConsts.halfWidth, gameConsts.halfHeight - 40, 'misc', 'victory_banner.png').setScale(100, 1.3).setDepth(9998).setAlpha(0);
         let victoryText = this.addSprite(gameConsts.halfWidth, gameConsts.halfHeight - 40, 'misc', 'victory_text.png').setScale(0.95).setDepth(9998).setAlpha(0);
         let continueText = this.addText(gameConsts.width - 15, gameConsts.halfHeight + 2, 'CONTINUE').setAlpha(0).setOrigin(1, 0.5).setAlign('right').setDepth(9998).setFontSize(22);

         this.addTween({
             targets: banner,
             alpha: 0.8,
             duration: 500,
         });

         this.addTween({
             targets: [victoryText],
             alpha: 1,
             ease: 'Quad.easeOut',
             duration: 500,
         });

         this.addTween({
             targets: victoryText,
             scaleX: 1,
             scaleY: 1,
             duration: 800,
         });
         this.addTimeout(() => {
             continueText.alpha = 1;
             this.dieClickBlocker.setOnMouseUpFunc(() => {
                 this.dieClickBlocker.destroy();

                 this.addTween({
                     targets: this.sprite,
                     alpha: 0,
                     scaleX: this.sprite.startScale * 1.2,
                     scaleY: this.sprite.startScale * 1.2,
                     y: "+=30",
                     duration: 700,
                     onComplete: () => {
                         this.destroy();
                     }
                 });
                 this.addTween({
                     targets: [victoryText, banner],
                     alpha: 0,
                     duration: 400,
                     completeDelay: 200,
                     onComplete: () => {
                         globalObjects.magicCircle.enableMovement();
                         victoryText.destroy();
                         banner.destroy();
                         continueText.destroy();
                         beginLevel(1);
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
                        let dmgEffect = this.addSprite(gameConsts.halfWidth + (Math.random() - 0.5) * 20, globalObjects.player.getY() - 185, 'spells', 'damageEffect1.png').setDepth(998).setScale(1.5);
                        this.addTimeout(() => {
                            dmgEffect.destroy();
                        }, 150)
                    }
                 }
             ]
         ];
     }
}
