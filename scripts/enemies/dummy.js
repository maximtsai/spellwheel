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
         this.health = gameVars.isHardMode ? 90 : 70;
         this.isAsleep = true;
         this.pullbackScale = 0.78;
        this.attackScale = 1.25;
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
        this.bgMusic = playMusic('bite_down_simplified', 0.65, true);
        globalObjects.magicCircle.disableMovement();
        globalObjects.bannerTextManager.setDialog([getLangText('level1_diag_a'), getLangText('level1_diag_b')]);
        globalObjects.bannerTextManager.setPosition(gameConsts.halfWidth, gameConsts.height - 130, 0);
        globalObjects.bannerTextManager.showBanner(false);


        globalObjects.bannerTextManager.setOnFinishFunc(() => {
            globalObjects.bannerTextManager.setOnFinishFunc(() => {});
            globalObjects.bannerTextManager.closeBanner();
                 globalObjects.magicCircle.enableMovement();
                 this.shadow = this.addSprite(globalObjects.player.getX(), globalObjects.player.getY() - 1, 'misc', 'shadow_circle.png').setScale(14).setDepth(9999).setAlpha(0);
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

                 globalObjects.textPopupManager.setInfoText(gameConsts.halfWidth, gameConsts.height - 38, getLangText('level1_tut_z'), 'center');

                 this.addTimeout(() => {
                     this.playerSpellCastSub = messageBus.subscribe('recordSpell', (id, spellName) => {
                         if (id === 'matterEnhance') {
                             this.playerSpellCastSub.unsubscribe();
                             this.playerSpellCastSub2.unsubscribe();
                             this.createEnhancePopup();
                         }
                     });
                     this.playerSpellCastSub2 = messageBus.subscribe('recordSpellAttack', (id, spellName) => {
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

        this.rune2 = this.addSprite(globalObjects.textPopupManager.getCenterPos(), globalObjects.textPopupManager.getBoxBottomPos() + 28, 'circle', 'rune_enhance_glow.png').setDepth(10001).setScale(0.75).setAlpha(0);

        this.enhancePopupListener = messageBus.subscribe('recordSpell', (id, spellName) => {
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
        this.enhancePopupListener2 = messageBus.subscribe('recordSpellAttack', (id, spellName) => {
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
        globalObjects.textPopupManager.hideInfoText();
    }

    tryInitTutorial4() {
        if (!this.dead && !this.isAsleep && !this.shownTut4) {
            this.shownTut4 = true;
            this.timeSinceLastAttacked = -50;
            this.clearEnhancePopup();
            this.clearStartShadow();

            globalObjects.textPopupManager.setInfoText(gameConsts.width, 272, getLangText('level1_tut_b'), 'right');

            messageBus.publish('setSlowMult', 0.25, 50);
            let glowBar = this.addSprite(gameConsts.halfWidth, 320, 'misc', 'shadow_bar.png').setDepth(9999).setAlpha(0).setScale(7);
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
                let spellListener = messageBus.subscribe('spellClicked', () => {
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
             this.flash = this.addSprite(this.x + 3, this.y - 65, 'blurry', 'flash.webp').setOrigin(0.5, 0.5).setScale(this.sprite.startScale * 0.9).setDepth(-1).setRotation(0.2);
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
                 delay: 400,
                 targets: this.sprite,
                 scaleX: this.sprite.startScale + 0.2,
                 scaleY: this.sprite.startScale + 0.2,
                 duration: 600,
                 completeDelay: 50,
                 ease: 'Quart.easeOut',
                 onComplete: () => {
                     this.currAnim = this.addTween({
                         targets: this.sprite,
                         scaleX: this.sprite.startScale,
                         scaleY: this.sprite.startScale,
                         duration: 400,
                         ease: 'Quart.easeIn',
                         onComplete: () => {
                             zoomTemp(1.03);
                             playSound('punch');
                            this.bgMusic = playSound('bite_down', 0.75, true, true);

                             this.setAwake();
                             this.currentAttackSetIndex = 0;
                             this.nextAttackIndex = 0;
                             this.brows = this.addSprite(this.x , this.y - 32, 'dummyenemy', 'dummybrows.png').setOrigin(0.5, 1.15).setScale(this.sprite.startScale * 1.5).setDepth(999);
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

                             this.snort = this.addSprite(this.x - 3, this.y - 101, 'dummyenemy', 'dummysnort.png').setOrigin(0.5, -0.05).setScale(this.sprite.startScale * 0.8).setDepth(999);
                             this.destructibles.push(this.snort);

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

                             let shinePattern = getTempPoolObject('spells', 'brickPattern2.png', 'brickPattern', 1000);
                             shinePattern.setPosition(this.x, this.y).setScale(this.sprite.startScale + 0.25).setDepth(-1);
                             this.addTween({
                                 targets: shinePattern,
                                 scaleX: this.sprite.startScale * 0.5,
                                 scaleY: this.sprite.startScale * 0.5,
                                 duration: 1000,
                                 ease: 'Cubic.easeIn'
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
                 this.eyes = this.addSprite(this.x + 1 , this.y - 41, 'dummyenemy', 'dummyeyes.png').setOrigin(0.5, 0.75).setScale(this.sprite.startScale, 0);
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
         if (this.rune2) {
             this.rune2.destroy();
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
                 this.y += 39;
                 this.setSprite('dummy_broken.png', this.sprite.scaleX);
                 this.sprite.setRotation(0);
                 this.sprite.setOrigin(0.85, 0.78);
                 playSound('victory_2');

                 this.showFlash(this.x, this.y - 75);

                 let rune = this.addSprite(this.x, this.y - 75, 'tutorial', 'rune_mind_large.png').setScale(0.5).setDepth(10001);
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


     initAttacks() {
         this.attacks = [
             [
                 // 0
                 {
                     name: "}8 ",
                     chargeAmt: 500,
                     damage: 8,
                     isBigMove: true,
                    attackFinishFunction: () => {
                         screenShake(3);
                        playSound('body_slam')
                        let dmgEffect = this.addSprite(gameConsts.halfWidth - 15, globalObjects.player.getY() - 185, 'spells', 'damageEffect1.png').setDepth(998).setScale(1.4);
                        this.addTimeout(() => {
                            dmgEffect.x += 30;
                            dmgEffect.y += 10;
                            this.addTimeout(() => {
                                dmgEffect.destroy();
                            }, 150)
                        }, 75);
                    }
                 },
                 {
                     name: "|10 ",
                     chargeAmt: 550,
                     damage: 10,
                     attackFinishFunction: () => {
                         screenShake(4);
                         zoomTemp(1.01)
                         let dmgEffect = this.addSprite(gameConsts.halfWidth - 15, globalObjects.player.getY() - 185, 'spells', 'damageEffect1.png').setDepth(998).setScale(1.4);
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
                         this.addTimeout(() => {
                             globalObjects.textPopupManager.setInfoText(gameConsts.halfWidth, gameConsts.height - 23, "Watch your health", 'center');
                             this.addTimeout(() => {
                                 this.playerSpellCastAny = messageBus.subscribe('playerCastedSpell', () => {
                                     this.addTimeout(() => {
                                         globalObjects.textPopupManager.hideInfoText();
                                     }, 1200);
                                     this.playerSpellCastAny.unsubscribe();
                                 });
                             }, 1200)
                         }, 1000)
                     }
                 },
                 {
                     name: ";15",
                     chargeAmt: 850,
                     damage: 15,
                     isBigMove: true,
                     attackFinishFunction: () => {
                         playSound('body_slam')
                         let dmgEffect = poolManager.getItemFromPool('brickPattern2')
                         if (!dmgEffect) {
                             dmgEffect = this.addSprite(gameConsts.halfWidth, globalObjects.player.getY() - 120, 'spells', 'brickPattern2.png').setDepth(998).setScale(0.75);
                         }
                         dmgEffect.setDepth(998).setScale(0.75);
                         this.addTween({
                             targets: dmgEffect,
                             rotation: 1,
                             alpha: 0,
                             duration: 800,
                             onComplete: () => {
                                 poolManager.returnItemToPool(dmgEffect, 'brickPattern2');
                             }
                         });


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
                     name: " TAKING A BREAK...",
                     chargeAmt: 400,
                     damage: 0,
                     startFunction: () => {
                         this.setDefaultSprite('dummy_w_eyes.png', 0.95);
                     },
                     attackFinishFunction: () => {
                         this.setDefaultSprite('dummy_angry.png', 0.95);
                     }
                 },
                 {
                     name: "}10 ",
                     chargeAmt: 500,
                     damage: 10,
                     attackFinishFunction: () => {
                         let dmgEffect = this.addSprite(gameConsts.halfWidth + (Math.random() - 0.5) * 20, globalObjects.player.getY() - 185, 'spells', 'damageEffect1.png').setDepth(998).setScale(1.4);
                         this.addTimeout(() => {
                             dmgEffect.destroy();
                         }, 150)
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
                     name: "}15",
                     chargeAmt: 500,
                     damage: 15,
                     attackFinishFunction: () => {
                         let dmgEffect = this.addSprite(gameConsts.halfWidth - 15, globalObjects.player.getY() - 185, 'spells', 'damageEffect1.png').setDepth(998).setScale(1.4);
                         this.addTimeout(() => {
                             dmgEffect.x += 30;
                             dmgEffect.y += 10;
                             this.addTimeout(() => {
                                 dmgEffect.destroy();
                             }, 150)
                         }, 75)
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
                     name: "ULTIMATE ATTACK }50",
                     chargeAmt: 800,
                     damage: 50,
                     attackFinishFunction: () => {
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
                     name: "GOING BACK TO SLEEP...",
                     chargeAmt: 250,
                     damage: 0,
                     attackFinishFunction: () => {
                         this.setSprite('dummy.png', 0.95);
                         this.setAsleep();
                     }
                 },
             ]
         ];
     }
}
