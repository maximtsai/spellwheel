 class Dummy extends Enemy {
    constructor(scene, x, y, level) {
        super(scene, x, y, level);
        this.initSprite('dummy.png', 0.95,0, 5, 'dummyenemy');
        // this.playerSpellCastSub = messageBus.subscribe('playerCastedSpell', () => {
        //     if (globalObjects.player.getPlayerCastSpellsCount() === 1) {
        //         // this.initTutorial2();
        //     } else if (globalObjects.player.getPlayerCastSpellsCount() > 1 && this.canHideStartTut) {
        //         this.playerSpellCastSub.unsubscribe();
        //         this.clearEnhancePopup();
        //     } else if (globalObjects.player.getPlayerCastSpellsCount() >= 3) {
        //         this.playerSpellCastSub.unsubscribe();
        //         this.clearEnhancePopup();
        //     }
        // });
        // let spellHoverListener = messageBus.subscribe('spellNameTextUpdate', (text) => {
        //     if (!globalObjects.magicCircle.innerDragDisabled && text.includes('ENHANCE')) {
        //         this.canHideStartTut = true;
        //         spellHoverListener.unsubscribe();
        //     }
        // });
        globalObjects.encyclopedia.showButton();
        globalObjects.options.showButton();
        this.initTutorial();
        // this.popupTimeout = this.addTimeout(() => {
        //     this.tutorialButton = createTutorialBtn(this.level);
        //     this.addToDestructibles(this.tutorialButton);
        // }, 3500)
    }

     initStatsCustom() {
         this.health = gameVars.isHardMode ? 80 : 70;
         this.isAsleep = true;
         this.pullbackScale = 0.78;
         this.attackScale = 1.25;
         this.extrasOnDie = [];
         this.finalArms = [];
     }

     initSpriteAnim(scale) {
        let startY = this.sprite.y;
         let yOffset = this.sprite.height * 0.425;
         this.sprite.setScale(scale * 0.9, scale * 0.9);

         this.sprite.setOrigin(0.5, 0.95);
         if (!this.delayLoad) {
             this.addTween({
                 targets: this.sprite,
                 duration: 240,
                 y: startY + yOffset,
                 ease: 'Cubic.easeIn',
                 scaleX: scale*0.85,
                 scaleY: scale*1.01,
                 alpha: 1,
                 onComplete: () => {
                     playSound('balloon', 0.3).detune = -800;
                     this.addTween({
                         targets: this.sprite,
                         duration: 200,
                         ease: 'Cubic.easeOut',
                         scaleX: scale*1.1,
                         scaleY: scale*0.85,
                         onComplete: () => {
                             this.addTween({
                                 targets: this.sprite,
                                 duration: 250,
                                 ease: 'Back.easeOut',
                                 scaleX: scale,
                                 scaleY: scale,
                                 onComplete: () => {
                                     this.sprite.setOrigin(0.5, 0.5).setPosition(this.sprite.x, startY);

                                 }
                             });
                         }
                     });
                 }
             });
         }
     }

     initTutorial() {
         gameVars.latestLevel = this.level - 1;
         sdkSetItem("latestLevel", gameVars.latestLevel.toString());
         gameVars.maxLevel = Math.max(gameVars.maxLevel, this.level);
         sdkSetItem("maxLevel", gameVars.maxLevel.toString());

        this.bgMusic = playMusic('bite_down_simplified', 0.65, true);
        globalObjects.magicCircle.disableMovement();
        globalObjects.bannerTextManager.setDialog([getLangText('level1_diag_b')]);
        globalObjects.bannerTextManager.setPosition(gameConsts.halfWidth, gameConsts.height - 130, 0);
        globalObjects.bannerTextManager.showBanner(false);

        globalObjects.bannerTextManager.setOnFinishFunc(() => {
            globalObjects.bannerTextManager.setOnFinishFunc(() => {});
            globalObjects.bannerTextManager.closeBanner();
                 globalObjects.magicCircle.enableMovement();
                 this.shadow = this.addImage(globalObjects.player.getX(), globalObjects.player.getY() - 1, 'misc', 'shadow_circle.png').setScale(14).setDepth(9999).setAlpha(0);
                 this.shadowSmall = this.addImage(gameConsts.halfWidth, globalObjects.player.getY(), 'circle', 'greyed.png').setAlpha(0.05).setDepth(104).setScale(0.71);

                 this.shadow.currAnim = this.addTween({
                     targets: [this.shadow],
                     alpha: 0.55,
                     duration: 500,
                     scaleX: 13.7,
                     scaleY: 13.7,
                     onComplete: () => {
                         this.shadow.currAnim = this.addTween({
                             targets: [this.shadow],
                             alpha: 0.25,
                             y: globalObjects.player.getY() - 50,
                             ease: "Quart.easeInOut",
                             duration: 2800,
                             scaleX: 15.7,
                             scaleY: 15.7,
                         });
                     }
                 });
                 this.shadowSmall.currAnim = this.addTween({
                     targets: [this.shadowSmall],
                     alpha: 0.5,
                     ease: "Back.easeOut",
                     duration: 750,
                     easeParams: [2]
                 });

                 this.glowCirc2 = this.addSprite(gameConsts.halfWidth, globalObjects.player.getY(), 'shields', 'ring_flash0.png').setAlpha(0.3).setDepth(999).setScale(2);
                this.addDelay(() => {
                    this.glowCirc2.playReverse('ring_flash');
                    this.glowCirc2.currAnim = this.addTween({
                        targets: this.glowCirc2,
                        alpha: 1,
                        ease: 'Cubic.easeOut',
                        duration: 150,
                        completeDelay: 1000,
                        onComplete: () => {
                            this.glowCirc2.currAnim = this.addTween({
                                targets: this.glowCirc2,
                                alpha: 0.3,
                                ease: 'Cubic.easeIn',
                                duration: 150,
                                onComplete: () => {
                                    this.glowCirc2.currAnim = this.addTween({
                                        targets: this.glowCirc2,
                                        alpha: 1,
                                        ease: 'Cubic.easeOut',
                                        duration: 150,
                                    })
                                    this.glowCirc2.play('ring_flash')
                                }
                            })
                        }
                    })
                }, 400)

                 globalObjects.textPopupManager.setInfoText(gameConsts.halfWidth, gameConsts.height - 37, getLangText('level1_tut_z'), 'center');

                 this.addTimeout(() => {
                     this.playerSpellCastSub = this.addSubscription('recordSpell', (id, spellName) => {
                         if (id === 'matterEnhance') {
                             this.playerSpellCastSub.unsubscribe();
                             this.playerSpellCastSub2.unsubscribe();
                             this.createEnhancePopup();
                         }
                     });
                     this.playerSpellCastSub2 = this.addSubscription('recordSpellAttack', (id, spellName) => {
                        if (globalObjects.player.getPlayerCastSpellsCount() >= 2) {
                             this.playerSpellCastSub.unsubscribe();
                             this.playerSpellCastSub2.unsubscribe();
                             this.clearStartShadow();
                         }
                     });
                 }, 400)

                 // this.playerSpellCastSub = messageBus.subscribe('playerCastedSpell', () => {
                 //     if (globalObjects.player.getPlayerCastSpellsCount() === 1) {
                 //         // this.initTutorial2();
                 //     } else if (globalObjects.player.getPlayerCastSpellsCount() > 1 && this.canHideStartTut) {
                 //         this.playerSpellCastSub.unsubscribe();
                 //         this.clearEnhancePopup();
                 //     } else if (globalObjects.player.getPlayerCastSpellsCount() >= 3) {
                 //         this.playerSpellCastSub.unsubscribe();
                 //         this.clearEnhancePopup();
                 //     }
                 // });

        });
    }

    createEnhancePopup() {
        this.clearStartShadow();
        globalObjects.textPopupManager.setInfoText(gameConsts.width, gameConsts.halfHeight - 135, getLangText('level1_tut_a'), 'right');
        this.rune2 = this.addSprite(globalObjects.textPopupManager.getCenterPos(), globalObjects.textPopupManager.getBoxBottomPos() + 18, 'circle', 'bright_rune_enhance.png').setDepth(globalObjects.textPopupManager.getDepth() + 1).setScale(0.75).setAlpha(0);

        this.enhancePopupListener = this.addSubscription('recordSpell', (id, spellName) => {
            if (this.firstEnhanceCast) {
                this.enhancePopupListener.unsubscribe();
                this.enhancePopupListener2.unsubscribe();
                this.clearEnhancePopup();
                this.enhancePopupListener = null;
                this.enhancePopupListener2 = null;
            }
            if (id === 'matterEnhance') {
                this.firstEnhanceCast = true;
            }
        });
        this.enhancePopupListener2 = this.addSubscription('recordSpellAttack', (id, spellName) => {
            if (this.firstEnhanceCast) {
                this.enhancePopupListener.unsubscribe();
                this.enhancePopupListener2.unsubscribe();
                this.clearEnhancePopup();
                this.enhancePopupListener = null;
                this.enhancePopupListener2 = null;
            }
        });


        this.addTween({
            targets: [this.rune2],
            alpha: 1,
            duration: 200,
            completeDelay: 200,
            onComplete: () => {
                this.addTween({
                    targets: [this.rune2],
                    scaleX: 1,
                    scaleY: 1,
                    ease: 'Quart.easeOut',
                    duration: 500,
                    onComplete: () => {
                        this.addTween({
                            targets: [this.rune2],
                            scaleX: 0.82,
                            scaleY: 0.82,
                            ease: 'Back.easeOut',
                            duration: 300,
                        });
                    }
                });
            }
        });
    }

    clearStartShadow() {
        globalObjects.textPopupManager.hideInfoText();
        if (this.shadow.currAnim) {
            this.shadow.currAnim.stop();
        }
        if (this.shadowSmall.currAnim) {
            this.shadowSmall.currAnim.stop();
        }
        if (this.glowCirc2.currAnim) {
            this.glowCirc2.currAnim.stop();
        }
        this.addTween({
            targets: [this.shadow, this.shadowSmall, this.glowCirc2],
            alpha: 0,
            ease: "Cubic.easeOut",
            duration: 500,
            onComplete: () => {
                this.glowCirc2.visible = false;
                this.shadow.visible = false;
                this.shadowSmall.visible = false;
            }
        });
    }

    clearEnhancePopup() {
        if (this.rune2) {
             this.addTween({
                 targets: [this.rune2],
                 alpha: 0,
                 duration: 300,
                 onComplete: () => {
                    this.rune2.visible = false;
                 }
             });
        }
        if (this.rune3) {
            this.addTween({
                targets: [this.rune3, this.rune4],
                alpha: 0,
                ease: 'Cubic.easeIn',
                duration: 1300,
            });
        }
        globalObjects.textPopupManager.hideInfoText();
    }

    tryInitTutorial4() {
        if (!this.dead && !this.isAsleep && !this.shownTut4) {
            this.shownTut4 = true;
            this.timeSinceLastAttacked = -15;
            this.clearEnhancePopup();

            globalObjects.textPopupManager.setInfoText(gameConsts.width, 255, getLangText('level1_tut_b'), 'right');
            messageBus.publish('setSlowMult', 0.25, 15);
            let glowBar = this.addSprite(gameConsts.halfWidth, 320, 'misc', 'shadow_bar.png').setDepth(9980).setAlpha(0).setScale(7);
            this.addTween({
                targets: glowBar,
                alpha: 0.4,
                scaleY: 4.2,
                scaleX: 5,
                ease: 'Cubic.easeInOut',
                duration: 800,
                onComplete: () => {
                    this.glowBarAnim = this.addTween({
                        delay: 2750,
                        targets: glowBar,
                        alpha: 0,
                        scaleY: 5.2,
                        scaleX: 6,
                        ease: 'Cubic.easeInOut',
                        duration: 1200
                    });
                }
            });
            this.addTimeout(() => {
                let spellListener = this.addSubscription('spellClicked', () => {
                    if (!this.hasShownAttackWarning) {
                        this.hasShownAttackWarning = true;
                        messageBus.publish('setSlowMult', 0.99, 1);

                        if (this.glowBarAnim) {
                            this.glowBarAnim.stop();
                        }
                        this.addTween({
                            targets: glowBar,
                            alpha: 0,
                            scaleY: 5.2,
                            scaleX: 6,
                            ease: 'Quad.easeInOut',
                            duration: 1000,
                            onComplete: () => {
                                glowBar.destroy();
                            }
                        });
                    }
                    spellListener.unsubscribe();
                    this.addTimeout(() => {
                        globalObjects.textPopupManager.hideInfoText();
                        if (this.rune3) {
                            this.addTween({
                                targets: [this.rune3, this.rune4],
                                alpha: 0,
                                ease: 'Cubic.easeIn',
                                duration: 1300,
                            });
                        }
                    }, 1200);
                });
                this.addTimeout(() => {
                    if (!this.hasShownAttackWarning) {
                        this.hasShownAttackWarning = true;
                        messageBus.publish('setSlowMult', 0.99, 1);
                        if (this.glowBarAnim) {
                            this.glowBarAnim.stop();
                        }
                        this.addTween({
                            targets: glowBar,
                            alpha: 0,
                            scaleY: 5.2,
                            scaleX: 6,
                            ease: 'Quad.easeInOut',
                            duration: 1000,
                            onComplete: () => {
                                glowBar.destroy();
                            }
                        });
                    }
                }, 4500);
            }, 1500);
        }
    }


    tryInitTutorial5() {
        if (!this.dead && !this.isAsleep && !this.shownTut5) {
            this.shownTut5 = true;
            globalObjects.textPopupManager.setInfoText(gameConsts.width, 262, getLangText('level1_tut_c'), 'right');
            this.rune3 = this.addSprite(globalObjects.textPopupManager.getCenterPos() - 24, globalObjects.textPopupManager.getBoxCenterPos() + 26, 'circle', 'bright_rune_enhance.png').setDepth(globalObjects.textPopupManager.getDepth() + 1).setScale(0.75).setAlpha(0);
            this.rune4 = this.addSprite(globalObjects.textPopupManager.getCenterPos() + 24, globalObjects.textPopupManager.getBoxCenterPos() + 26, 'circle', 'bright_rune_enhance.png').setDepth(globalObjects.textPopupManager.getDepth() + 1).setScale(0.75).setAlpha(0);
            this.addTween({
                targets: [this.rune3, this.rune4],
                alpha: 1,
                duration: 200,
                completeDelay: 200,
                onComplete: () => {
                    this.addTween({
                        targets: [this.rune3, this.rune4],
                        scaleX: 1,
                        scaleY: 1,
                        ease: 'Quart.easeOut',
                        duration: 500,
                        onComplete: () => {
                            this.addTween({
                                targets: [this.rune3, this.rune4],
                                scaleX: 0.82,
                                scaleY: 0.82,
                                ease: 'Back.easeOut',
                                duration: 300,
                            });
                        }
                    });
                }
            });

            this.addTimeout(() => {
                let spellListener = this.addSubscription('spellClicked', () => {
                    spellListener.unsubscribe();
                    this.addTween({
                        targets: [this.rune3, this.rune4],
                        alpha: 0,
                        ease: 'Cubic.easeIn',
                        duration: 1300,
                    });
                    this.addTimeout(() => {
                        globalObjects.textPopupManager.hideInfoText();
                    }, 1200);
                });
            }, 1500);
        }
    }

     setHealth(newHealth) {
         super.setHealth(newHealth);
         let prevHealthPercent = this.prevHealth / this.healthMax;
         let currHealthPercent = this.health / this.healthMax;
         if (currHealthPercent == 0) {
             // dead, can't do anything
             return;
         }

         if (this.canAngryEyes && !this.angryEyes && currHealthPercent < 0.999) {
             this.angryEyes = true;
             this.flash = this.addImage(this.x + 3, this.y - 50, 'blurry', 'flash.webp').setOrigin(0.5, 0.5).setScale(this.sprite.startScale * 0.9).setDepth(-1).setRotation(0.2);
            fadeAwaySound(this.bgMusic, 200);
             this.addTween({
                 targets: this.flash,
                 scaleX: this.sprite.startScale * 3.5,
                 scaleY: this.sprite.startScale * 0.05,
                 duration: 300,
                 onStart: () => {
                 }
             });
             this.addTween({
                 targets: this.flash,
                 duration: 300,
                 ease: 'Quad.easeIn',
                 alpha: 0,
                 onComplete: () => {
                     this.flash.destroy();
                 }
             });
             this.currAnim = this.addTween({
                 delay: 350,
                 targets: this.sprite,
                 scaleX: this.sprite.startScale + 0.24,
                 scaleY: this.sprite.startScale + 0.24,
                 duration: 580,
                 completeDelay: 20,
                 ease: 'Quart.easeOut',
                 onComplete: () => {
                     this.currAnim = this.addTween({
                         targets: this.sprite,
                         scaleX: this.sprite.startScale,
                         scaleY: this.sprite.startScale,
                         duration: 350,
                         ease: 'Quart.easeIn',
                         onComplete: () => {
                             zoomTemp(1.03);
                             playSound('punch');
                            this.bgMusic = playSound('bite_down', 0.75, true, true);

                             this.setAwake();
                             this.currentAttackSetIndex = 0;
                             this.nextAttackIndex = 0;
                             this.brows = this.addImage(this.x , this.y - 32, 'dummyenemy', 'dummybrows.png').setOrigin(0.5, 1.15).setScale(this.sprite.startScale * 1.5).setDepth(99);
                             this.addTween({
                                 targets: this.brows,
                                 scaleX: this.sprite.startScale * 2.2,
                                 scaleY: this.sprite.startScale * 2.2,
                                 ease: 'Quart.easeOut',
                                 duration: 200,
                                 onComplete: () => {
                                     this.addTween({
                                         targets: this.brows,
                                         scaleX: this.sprite.startScale,
                                         scaleY: this.sprite.startScale,
                                         ease: 'Quart.easeIn',
                                         duration: 700,
                                         onComplete: () => {
                                             this.addTimeout(() => {
                                                 this.tryInitTutorial4();
                                             }, 800);

                                             this.setDefaultSprite('dummy_angry.png', 0.95);
                                             this.brows.destroy();
                                             this.brows = null;
                                         }
                                     });
                                 }
                             });

                             this.snort = this.addImage(this.x - 3, this.y - 71, 'dummyenemy', 'dummysnort.png').setOrigin(0.5, -0.05).setScale(this.sprite.startScale * 0.8).setDepth(99);
                             this.destructibles.push(this.snort);

                             this.addTween({
                                 targets: this.snort,
                                 scaleX: this.sprite.startScale * 1.1,
                                 scaleY: this.sprite.startScale * 1.1,
                                 duration: 500,
                                 ease: 'Cubic.easeOut'
                             });
                             this.addTween({
                                 targets: this.snort,
                                 duration: 500,
                                 alpha: 0,
                                 ease: 'Quad.easeIn',
                             });

                             let shinePattern = getTempPoolObject('spells', 'brickPattern2.png', 'brickPattern', 1000);
                             shinePattern.setPosition(this.x, this.y).setScale(this.sprite.startScale + 0.25).setDepth(-1);
                             this.addTween({
                                 targets: shinePattern,
                                 scaleX: this.sprite.startScale * 0.7,
                                 scaleY: this.sprite.startScale * 0.7,
                                 duration: 1000,
                                 easeParams: [0.5],
                                 ease: 'Back.easeIn'
                             });
                             this.addTween({
                                 targets: shinePattern,
                                 alpha: 0,
                                 ease: 'Cubic.easeIn',
                                 duration: 1000,
                             });
                         }
                     });
                 }
             });
         }

         if (prevHealthPercent >= 0.95) {
             if (currHealthPercent < 0.95) {
                 this.canAngryEyes = true;
                 let angrySymbol = this.scene.add.sprite(this.x + 35, this.y - 52, 'misc', 'angry1.png').play('angry').setScale(0.3).setDepth(9999);
                 this.addTween({
                     targets: angrySymbol,
                     scaleX: 0.9,
                     scaleY: 0.9,
                     duration: 300,
                     easeParams: [3],
                     ease: 'Back.easeOut',
                     onComplete: () => {
                         this.addTween({
                             delay: 1000,
                             targets: angrySymbol,
                             scaleX: 0,
                             scaleY: 0,
                             duration: 300,
                             ease: 'Back.easeIn',
                             onComplete: () => {
                                 angrySymbol.destroy();
                             }
                         });
                     }
                 });
                 this.eyes = this.addImage(this.x + 1 , this.y - 41, 'dummyenemy', 'dummyeyes.png').setOrigin(0.5, 0.75).setScale(this.sprite.startScale, 0);
                 this.addExtraSprite(this.eyes, 1, -40)
                 this.addTween({
                     targets: this.eyes,
                     scaleY: this.sprite.startScale,
                     ease: "Back.easeOut",
                     duration: 350,
                     onComplete: () => {
                         this.setDefaultSprite('dummy_w_eyes.png', 0.95);
                         if (this.eyes) {
                             this.removeExtraSprite(this.eyes);
                             this.eyes.destroy();
                             this.eyes = null;
                         }
                     }
                 });
             }
         }
     }

     die() {
         if (this.dead) {
             return;
         }
        super.die();
         globalObjects.encyclopedia.hideButton();
         globalObjects.options.hideButton();
         if (this.rune2) {
             this.rune2.destroy();
         }
         if (this.rune3) {
             this.rune3.destroy();
             this.rune4.destroy();
         }
         if (this.extrasOnDie) {
            for (let i = 0; i < this.extrasOnDie.length; i++) {
                this.extrasOnDie[i].destroy();
            }
         }
         if (this.finalArms) {
             for (let i = 0; i < this.finalArms.length; i++) {
                 this.finalArms[i].destroy();
             }
         }
         if (this.spaceTween) {
             this.spaceTween.stop();
             this.spaceTween.destroy();
         }
         if (this.eyesTween) {
             this.eyesTween.stop();
             this.eyesTween.destroy();
         }

         if (this.playerSpellCastSub) {
             this.playerSpellCastSub.unsubscribe();
             this.playerSpellCastSub2.unsubscribe()
         }
         if (this.playerSpellCastAny) {
             this.playerSpellCastAny.unsubscribe();
         }
         if (this.enhancePopupListener) {
             this.enhancePopupListener.unsubscribe();
             this.enhancePopupListener2.unsubscribe();
         }
         if (this.eyes) {
             this.removeExtraSprite(this.eyes);
             this.eyes.destroy();
             this.eyes = null;
         }
        if (this.flash) {
            this.flash.destroy();
        }
        if (this.brows) {
            this.brows.destroy();
        }
        if (this.currAnim) {
            this.currAnim.stop();
        }
        if (this.glowHealth) {
            this.glowHealth.destroy();
        }
        if (this.currDummyAnim) {
            this.currDummyAnim.stop();
        }
        globalObjects.textPopupManager.hideInfoText();

        this.x += 10;
         this.y += this.sprite.height * this.sprite.scaleY * 0.45; this.sprite.y = this.y;
         this.sprite.setOrigin(0.51, 0.96);
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
         this.addTween({
             targets: this.sprite,
             rotation: -1.31,
             ease: "Cubic.easeIn",
             duration: 1000,
             onComplete: () => {
                 this.x -= 80;
                 this.y = 262;
                 this.sprite.y = this.y;
                 this.addTween({
                     targets: this.sprite,
                     y: 262,
                     ease: 'Cubic.easeOut',
                     duration: 100,
                 });
                 this.setSprite('dummy_broken.png', this.sprite.scaleX);
                 this.sprite.setRotation(0);
                 this.sprite.setOrigin(0.85, 0.78);
                 playSound('victory_2');

                 this.showFlash(this.x, this.y - 75);

                 let rune = this.addImage(this.x, this.y - 75, 'tutorial', 'rune_energy_large.png').setScale(0.5).setDepth(10001);
                 this.addTween({
                     targets: rune,
                     x: gameConsts.halfWidth,
                     scaleX: 1,
                     scaleY: 1,
                     ease: "Cubic.easeOut",
                     duration: 1500,
                     onComplete: () => {
                        this.showVictory(rune);
                     }
                 });

             }
         });
     }

     healAnim(amt = 25) {
         this.currDummyAnim = this.addTween({
             targets: this.sprite,
             scaleX: this.sprite.startScale * 0.82,
             scaleY: this.sprite.startScale * 0.82,
             rotation: -0.2,
             x: gameConsts.halfWidth - 19,
             y: this.sprite.startY + 19,
             ease: "Quint.easeOut",
             duration: 600,
             onComplete: () => {
                 this.currDummyAnim = this.addTween({
                     targets: this.sprite,
                     scaleX: this.sprite.startScale * 1.2,
                     scaleY: this.sprite.startScale * 1.2,
                     rotation: 0.07,
                     x: gameConsts.halfWidth + 8,
                     y: this.sprite.startY - 15,
                     ease: "Quart.easeIn",
                     duration: 550,
                     onComplete: () => {
                         playSound('magic', 0.6);
                         this.heal(amt);
                         messageBus.publish('animateHealNum', this.x, this.y, '+' + amt, 0.5 + Math.sqrt(this.healthMax) * 0.2);
                         if (!this.healSprite) {
                             this.healSprite = this.addImage(gameConsts.halfWidth, this.y - 90, 'misc', 'heal.png').setScale(0.9).setDepth(99).setAlpha(1);
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
                             x: gameConsts.halfWidth,
                             y: this.sprite.startY,
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
                     name: gameVars.isHardMode ? "}10 " : "}8 ",
                     chargeAmt: 410,
                     damage: gameVars.isHardMode ? 10 : 8,
                     attackFinishFunction: () => {
                         screenShake(5);
                         zoomTemp(1.015)
                         let dmgEffect = this.addSprite(gameConsts.halfWidth - 15, globalObjects.player.getY() - 185, 'spells', 'damageEffect3.png').setDepth(998).setScale(1.4);
                         this.addTimeout(() => {
                             dmgEffect.x += 30;
                             dmgEffect.y += 10;
                             this.addTimeout(() => {
                                 dmgEffect.destroy();
                             }, 150)
                         }, 75);
                         playSound('body_slam')

                         this.snort.setScale(this.sprite.startScale * 0.8).setAlpha(1);
                         this.addTween({
                             targets: this.snort,
                             scaleX: this.sprite.startScale * 1.1,
                             scaleY: this.sprite.startScale * 1.1,
                             duration: 400,
                             ease: 'Cubic.easeOut'
                         });
                         this.addTween({
                             targets: this.snort,
                             duration: 400,
                             alpha: 0,
                             ease: 'Quad.easeIn',
                         });
                     }
                 },
                 {
                     name: "HEAL\\30",
                     chargeAmt: 315,
                     damage: 0,
                     startFunction: () => {
                         this.addTimeout(() => {
                             this.tryInitTutorial5();
                         }, 800);
                     },
                     finaleFunction: () => {
                        this.healAnim(30);
                     }
                 },
                 {
                     name: gameVars.isHardMode ? ";25" : ";20",
                     chargeAmt: 415,
                     damage: gameVars.isHardMode ? 25 : 20,
                     isBigMove: true,
                     attackFinishFunction: () => {
                         playSound('punch');
                         playSound('body_slam')
                         let dmgEffect = this.addSprite(gameConsts.halfWidth, globalObjects.player.getY() - 120, 'spells', 'brickPattern2.png').setDepth(998).setScale(0.75);
                         this.addTween({
                             targets: dmgEffect,
                             rotation: 1,
                             alpha: 0,
                             duration: 800,
                             onComplete: () => {
                                 dmgEffect.destroy();
                             }
                         });
                     }
                 },
                 {
                     name: "HEAL\\25",
                     chargeAmt: 245,
                     damage: 0,
                     finaleFunction: () => {
                         this.healAnim(25);
                     }
                 },
                 {
                     name: "ASCENSION",
                     chargeAmt: 600,
                     damage: 0,
                     chargeMult: 3.25,
                     isBigMove: true,
                     startFunction: () => {
                         this.currentAttackSetIndex = 1;
                         this.nextAttackIndex = 0;
                     },
                     finaleFunction: () => {
                         globalObjects.encyclopedia.hideButton();
                         globalObjects.options.hideButton();
                        this.setAsleep();
                        this.interruptCurrentAttack();
                        fadeAwaySound(this.bgMusic, 3500);
                        let blackBG = this.addImage(gameConsts.halfWidth, gameConsts.halfHeight, 'blackPixel').setScale(500).setDepth(-5).setAlpha(0);
                        let spaceBG = this.addImage(gameConsts.halfWidth, this.sprite.y, 'backgrounds', 'star.png').setDepth(5).setAlpha(0).setScale(2.2).setOrigin(0.5, 0.53);
                        let ascendedDummy = this.addImage(this.sprite.x, this.sprite.y, 'dummyenemy', 'dummy_ascended.png').setDepth(8).setAlpha(0).setScale(this.sprite.scaleX);
                         let ascendedDummyEyes = this.addImage(this.sprite.x, this.sprite.y - 27, 'dummyenemy', 'scary_eyes2.png').setDepth(8).setAlpha(0).setScale(this.sprite.scaleX * 0.5).setOrigin(0.5, 0.48);
                         this.spaceTween = this.addTween({
                             targets: spaceBG,
                             rotation: "+=6.281",
                             duration: 20000,
                             repeat: 1000
                         });

                        this.extrasOnDie.push(blackBG);
                        this.extrasOnDie.push(spaceBG);
                        this.extrasOnDie.push(ascendedDummy);
                         this.extrasOnDie.push(ascendedDummyEyes);
                         this.addTween({
                             targets: [blackBG, ascendedDummy],
                             alpha: 1,
                             ease: 'Quad.easeIn',
                             duration: 4000,
                         });
                        this.addTween({
                            targets: [blackBG],
                            alpha: 1,
                            duration: 4000,
                            onComplete: () => {
                                blackBG.setDepth(5);
                                playFakeBGMusic('but_never_forgotten_metal_prelude');
                                this.addTween({
                                    delay: 120,
                                    targets: [ascendedDummy],
                                    duration: 600,
                                    scaleX: 1.2,
                                    scaleY: 1.2,
                                    ease: 'Quint.easeOut',
                                    completeDelay: 50,
                                    onComplete: () => {
                                        this.addTween({
                                            targets: [ascendedDummy],
                                            duration: 1250,
                                            scaleX: 0.62,
                                            scaleY: 0.62,
                                            ease: 'Quint.easeIn',
                                            onComplete: () => {
                                                if (this.dead) {
                                                    return;
                                                }
                                                this.addTween({
                                                    targets: [ascendedDummyEyes],
                                                    alpha: 1,
                                                    ease: 'Cubic.easeOut',
                                                    duration: 150,
                                                });
                                                this.addTween({
                                                    targets: [ascendedDummyEyes],
                                                    scaleX: this.sprite.scaleX * 2,
                                                    scaleY: this.sprite.scaleX * 2,
                                                    ease: 'Quart.easeIn',
                                                    duration: 150,
                                                    onComplete: () => {
                                                        this.addTween({
                                                            targets: [ascendedDummyEyes],
                                                            scaleX: this.sprite.scaleX * 0.75,
                                                            scaleY: this.sprite.scaleX * 0.75,
                                                            ease: 'Quint.easeOut',
                                                            duration: 400,
                                                            onComplete: () => {
                                                                this.eyesTween = this.addTween({
                                                                    targets: [ascendedDummyEyes],
                                                                    scaleX: this.sprite.scaleX * 0.77,
                                                                    scaleY: this.sprite.scaleX * 0.77,
                                                                    ease: 'Cubic.easeIn',
                                                                    duration: 1500,
                                                                    repeat: 10000,
                                                                    yoyo: true
                                                                });
                                                            }
                                                        });
                                                    }
                                                });
                                                this.addTween({
                                                    targets: [ascendedDummy],
                                                    duration: 500,
                                                    scaleX: 0.73,
                                                    scaleY: 0.73,
                                                    ease: 'Quart.easeOut',
                                                });
                                                blackBG.setVisible(true);
                                                spaceBG.setAlpha(1);
                                                this.bgMusic = playMusic('but_never_forgotten_metal', 0.85, true);
                                                let blackpulse1 = this.addImage(this.sprite.x, this.sprite.y, 'blurry', 'black_pulse.png').setDepth(5).setAlpha(1).setScale(0);
                                                 this.addTween({
                                                     targets: blackpulse1,
                                                     scaleX: 8,
                                                     scaleY: 8,
                                                     rotation: "+=10",
                                                     ease: 'Quad.easeOut',
                                                     duration: 550,
                                                 })

                                                let dummyShadow = this.addImage(this.sprite.x, this.sprite.y, 'misc', 'shadow_circle.png').setScale(3.5).setDepth(7);
                                                 this.addTween({
                                                     targets: dummyShadow,
                                                     duration: 550,
                                                    scaleX: 50,
                                                    scaleY: 50,
                                                     ease: 'Quad.easeOut',
                                                 });
                                                this.setAwake();
                                                 this.addTween({
                                                     targets: [blackpulse1, dummyShadow],
                                                     duration: 550,
                                                     alpha: 0,
                                                     completeDelay: 500,
                                                     onComplete: () => {
                                                         playSound('ringknell', 0.9)
                                                         for (let i = 0; i < 4; i++) {
                                                             let startRot = 0.5;
                                                             let goalRot = 1.0 + 0.43 * i;
                                                             let longArm = this.addImage(this.x, this.y + 24, 'deathfinal', 'long_arm.png').setRotation(startRot).setOrigin(0.5, 0.92).setAlpha(0.2).setDepth(ascendedDummy.depth - 1);
                                                             this.finalArms.push(longArm);
                                                             longArm.goalRot = goalRot;
                                                             this.addTween({
                                                                 targets: longArm,
                                                                 duration: 250,
                                                                 ease: 'Cubic.easeOut',
                                                                 scaleX: 0.78,
                                                                 scaleY: 0.78,
                                                                 alpha: 1
                                                             })
                                                             this.addTween({
                                                                 delay: 150 - i * 50,
                                                                 targets: longArm,
                                                                 duration: 900 + i * 280,
                                                                 rotation: goalRot,
                                                                 ease: 'Cubic.easeInOut'
                                                             })
                                                         }

                                                         for (let i = 0; i < 4; i++) {
                                                             let startRot = -0.5;
                                                             let goalRot = -1.0 - 0.43 * i;
                                                             let longArm = this.addImage(this.x, this.y + 24, 'deathfinal', 'long_arm.png').setRotation(startRot).setOrigin(0.5, 0.92).setScale(-0.3, 0.3).setAlpha(0.2).setDepth(ascendedDummy.depth - 1);
                                                             this.finalArms.push(longArm);
                                                             longArm.goalRot = goalRot;
                                                             this.addTween({
                                                                 targets: longArm,
                                                                 duration: 250,
                                                                 ease: 'Cubic.easeOut',
                                                                 scaleX: -0.78,
                                                                 scaleY: 0.78,
                                                                 alpha: 1
                                                             })
                                                             this.addTween({
                                                                 delay: 150 - i * 50,
                                                                 targets: longArm,
                                                                 duration: 900 + i * 280,
                                                                 rotation: goalRot,
                                                                 ease: 'Cubic.easeInOut'
                                                             })
                                                         }
                                                     }
                                                 });
                                            }
                                        });
                                    }
                                });


                            }
                        });
                     }
                 },
                 {
                     name: gameVars.isHardMode ? "|15" : "|12 ",
                     chargeAmt: 335,
                     damage: gameVars.isHardMode ? 15 : 12,
                     isBigMove: true,
                     attackFinishFunction: () => {
                         screenShake(5);
                         zoomTemp(1.015)
                         playSound('body_slam')
                         let dmgEffect = poolManager.getItemFromPool('brickPattern2')
                         if (!dmgEffect) {
                             dmgEffect = this.addSprite(gameConsts.halfWidth, globalObjects.player.getY() - 120, 'spells', 'brickPattern2.png').setDepth(998).setScale(0.75);
                         }
                         dmgEffect.setDepth(998).setScale(0.75).setAlpha(1).setVisible(true);
                         this.addTween({
                             targets: dmgEffect,
                             rotation: 1,
                             alpha: 0,
                             duration: 800,
                             onComplete: () => {
                                 poolManager.returnItemToPool(dmgEffect, 'brickPattern2');
                             }
                         });
                         this.addTimeout(() => {
                             globalObjects.textPopupManager.setInfoText(gameConsts.halfWidth, gameConsts.height - 23, getLangText('watch_health'), 'center');
                             this.addTimeout(() => {
                                 this.playerSpellCastAny = this.addSubscription('playerCastedSpell', () => {
                                     this.addTimeout(() => {
                                         globalObjects.textPopupManager.hideInfoText();
                                     }, 1200);
                                     this.playerSpellCastAny.unsubscribe();
                                 });
                             }, 1200)
                         }, 1000)
                     }
                 },

             ], [
                 {
                     name: ";999",
                     chargeAmt: 950,
                     damage: 999,
                     isBigMove: true,
                     attackFinishFunction: () => {
                         screenShake(9);
                         zoomTemp(1.04)
                         playSound('body_slam')
                         let dmgEffect = poolManager.getItemFromPool('brickPattern2')
                         if (!dmgEffect) {
                             dmgEffect = this.addSprite(gameConsts.halfWidth, globalObjects.player.getY() - 120, 'spells', 'brickPattern2.png').setDepth(998).setScale(0.75);
                         }
                         dmgEffect.setDepth(998).setScale(0.75).setAlpha(1).setVisible(true);
                         this.addTween({
                             targets: dmgEffect,
                             rotation: 1,
                             alpha: 0,
                             duration: 800,
                             onComplete: () => {
                                 poolManager.returnItemToPool(dmgEffect, 'brickPattern2');
                             }
                         });
                     }
                 },

             ]
         ];
     }
}
