 class Dummy extends Enemy {
    constructor(scene, x, y, level) {
        super(scene, x, y, level);
        this.initSprite('dummy.png', 0.75,0, 5);
        this.playerSpellCastSub = messageBus.subscribe('playerCastedSpell', () => {
            if (globalObjects.player.getPlayerCastSpellsCount() === 1) {
                // this.initTutorial2();
            } else if (globalObjects.player.getPlayerCastSpellsCount() > 1) {
                this.playerSpellCastSub.unsubscribe();
            }
            if (this.canHideStartTut) {
                    this.initTutorial3();
            }
        });
        let spellHoverListener = messageBus.subscribe('spellNameTextUpdate', (text) => {
            if (text === "ADD STRONGER ATTACK" && !globalObjects.magicCircle.innerDragDisabled) {
                this.canHideStartTut = true;
                spellHoverListener.unsubscribe();
            }
        });
        this.initTutorial();
    }

     initStatsCustom() {
         this.health = gameVars.isHardMode ? 100 : 75;
         this.isAsleep = true;
     }



     initTutorial() {
         this.rune1 = this.scene.add.sprite(isMobile ? 27 : 27, gameConsts.height - 272, 'circle', 'rune_enhance_glow.png').setDepth(100002).setScale(0.8, 0.8).setAlpha(0);
         this.rune2 = this.scene.add.sprite(isMobile ? 87 : 87, gameConsts.height - 273, 'circle', 'rune_matter_glow.png').setDepth(100002).setScale(0.8, 0.8).setAlpha(0);

         setTimeout(() => {
             globalObjects.textPopupManager.setInfoText(114, gameConsts.height - 363, "Combine different\nrunes for different\neffects.\n       +      =  +DMG", 'left');
             PhaserScene.tweens.add({
                 targets: [this.rune1, this.rune2],
                 alpha: 1,
                 duration: 200,
             });
         }, 750)
    }

    initTutorial2() {
        // setTimeout(() => {
        //     if (globalObjects.player.getPlayerCastSpellsCount() === 1 && !this.dead) {
        //         // player only casted 1 spell so far
        //         globalObjects.textPopupManager.setInfoText(gameConsts.halfWidth + 1, gameConsts.height - 38, "Switch spells by spinning\n<== the two wheels ==>");
        //         this.arrowRotate1 = this.scene.add.sprite(globalObjects.player.getX(), globalObjects.player.getY(), 'circle', 'arrow_rotate.png').setOrigin(0.5, 0.5).setDepth(777).setRotation(0.15).setAlpha(0);
        //         this.arrowRotate2 = this.scene.add.sprite(globalObjects.player.getX(), globalObjects.player.getY(), 'circle', 'arrow_rotate_small.png').setOrigin(0.5, 0.5).setDepth(777).setScale(0.96).setRotation(-0.15).setAlpha(0);
        //         this.destructibles.push(this.arrowRotate1);
        //         this.destructibles.push(this.arrowRotate2);
        //         this.showArrowRotate();
        //
        //         let spellListener = messageBus.subscribe('spellClicked', () => {
        //             globalObjects.textPopupManager.hideInfoText();
        //             spellListener.unsubscribe();
        //         });
        //     }
        // }, 3000);
    }

    initTutorial3() {
        setTimeout(() => {
            if (!this.dead) {
                if (this.rune1) {
                    this.rune1.destroy();
                    this.rune2.destroy();
                }
                globalObjects.textPopupManager.hideInfoText();
                // globalObjects.textPopupManager.setInfoText(gameConsts.halfWidth - 225, gameConsts.halfHeight - 37, "Hover over\nspell names\nfor more\n    info  =>");
                // let hoverColor = this.scene.add.sprite(gameConsts.halfWidth, globalObjects.player.getY() - 241, 'lowq', 'glow_flat.webp').setDepth(-1).setScale(1.75, 1).setAlpha(0);
                // PhaserScene.tweens.add({
                //     targets: hoverColor,
                //     alpha: 0.5,
                //     ease: 'Cubic.easeInOut',
                //     duration: 1500,
                // });

            }
        }, 200);
    }

    tryInitTutorial4() {
        if (!this.dead && !this.isAsleep && !this.shownTut4) {
            this.shownTut4 = true;
            globalObjects.textPopupManager.setInfoText(gameConsts.halfWidth + 173, gameConsts.halfHeight - 97, "Enemies become\nangry when\nattacked!", 'left');
            gameVars.timeSlowRatio = 0.1;
            let glowBar = this.scene.add.sprite(gameConsts.halfWidth, 325, 'misc', 'shadow_bar.png').setDepth(9999).setAlpha(0).setScale(7);
            PhaserScene.tweens.add({
                targets: glowBar,
                alpha: 0.4,
                scaleY: 4,
                scaleX: 5,
                ease: 'Cubic.easeInOut',
                duration: 800,
                onComplete: () => {
                    this.glowBarAnim = PhaserScene.tweens.add({
                        delay: 3500,
                        targets: glowBar,
                        alpha: 0,
                        scaleY: 5,
                        scaleX: 6,
                        ease: 'Cubic.easeInOut',
                        duration: 1200
                    });
                }
            });
            setTimeout(() => {
                let spellListener = messageBus.subscribe('spellClicked', () => {
                    if (!this.hasShownAttackWarning) {
                        this.hasShownAttackWarning = true;
                        gameVars.timeSlowRatio = 1;
                        if (this.glowBarAnim) {
                            this.glowBarAnim.stop();
                        }
                        PhaserScene.tweens.add({
                            targets: glowBar,
                            alpha: 0,
                            scaleY: 5,
                            scaleX: 6,
                            ease: 'Quad.easeInOut',
                            duration: 1000,
                            onComplete: () => {
                                glowBar.destroy();
                            }
                        });
                    }
                    spellListener.unsubscribe();
                    setTimeout(() => {
                        globalObjects.textPopupManager.hideInfoText();
                    }, 1000);
                });
                setTimeout(() => {
                    if (!this.hasShownAttackWarning) {
                        this.hasShownAttackWarning = true;
                        gameVars.timeSlowRatio = 1;
                        if (this.glowBarAnim) {
                            this.glowBarAnim.stop();
                        }
                        PhaserScene.tweens.add({
                            targets: glowBar,
                            alpha: 0,
                            scaleY: 5,
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

         if (this.canAngryEyes && !this.angryEyes && currHealthPercent < 0.8) {
             this.angryEyes = true;
             this.flash = this.scene.add.sprite(this.x, this.y - 90, 'lowq', 'flash.webp').setOrigin(0.5, 0.5).setScale(this.sprite.startScale * 0.9).setDepth(-1).setRotation(0.2);

             PhaserScene.tweens.add({
                 targets: this.flash,
                 scaleX: this.sprite.startScale * 3.5,
                 scaleY: this.sprite.startScale * 0.05,
                 duration: 300,
             });
             PhaserScene.tweens.add({
                 targets: this.flash,
                 duration: 300,
                 ease: 'Quad.easeIn',
                 alpha: 0,
                 onComplete: () => {
                     this.flash.destroy();
                 }
             });
             this.currAnim = PhaserScene.tweens.add({
                 delay: 400,
                 targets: this.sprite,
                 scaleX: this.sprite.startScale + 0.2,
                 scaleY: this.sprite.startScale + 0.2,
                 duration: 500,
                 ease: 'Quart.easeOut',
                 onComplete: () => {
                     this.currAnim = PhaserScene.tweens.add({
                         targets: this.sprite,
                         scaleX: this.sprite.startScale,
                         scaleY: this.sprite.startScale,
                         duration: 375,
                         ease: 'Quart.easeIn',
                         onComplete: () => {
                             zoomTemp(1.03);
                             this.isAsleep = false;
                             this.currentAttackSetIndex = 0;
                             this.nextAttackIndex = 0;
                             this.brows = this.scene.add.sprite(this.x - 3, this.y - 70, 'enemies', 'dummybrows.png').setOrigin(0.5, 1.15).setScale(this.sprite.startScale * 1.5).setDepth(999);
                             PhaserScene.tweens.add({
                                 targets: this.brows,
                                 scaleX: this.sprite.startScale * 2.2,
                                 scaleY: this.sprite.startScale * 2.2,
                                 ease: 'Quart.easeOut',
                                 duration: 200,
                                 onComplete: () => {
                                     PhaserScene.tweens.add({
                                         targets: this.brows,
                                         scaleX: this.sprite.startScale,
                                         scaleY: this.sprite.startScale,
                                         ease: 'Quart.easeIn',
                                         duration: 700,
                                         onComplete: () => {
                                             setTimeout(() => {
                                                 this.tryInitTutorial4();
                                             }, 800);

                                             this.setDefaultSprite('dummy_angry.png', 0.75);
                                             this.brows.destroy();
                                             this.brows = null;
                                         }
                                     });
                                 }
                             });

                             this.snort = this.scene.add.sprite(this.x - 3, this.y - 101, 'enemies', 'dummysnort.png').setOrigin(0.5, -0.05).setScale(this.sprite.startScale * 0.8).setDepth(999);
                             this.destructibles.push(this.snort);

                             PhaserScene.tweens.add({
                                 targets: this.snort,
                                 scaleX: this.sprite.startScale * 1.1,
                                 scaleY: this.sprite.startScale * 1.1,
                                 duration: 400,
                                 ease: 'Cubic.easeOut'
                             });
                             PhaserScene.tweens.add({
                                 targets: this.snort,
                                 duration: 400,
                                 alpha: 0,
                                 ease: 'Quad.easeIn',
                             });

                             let shinePattern = this.scene.add.sprite(this.x, this.y, 'spells', 'brickPattern2.png').setScale(this.sprite.startScale + 0.25).setDepth(-1);
                             PhaserScene.tweens.add({
                                 targets: shinePattern,
                                 scaleX: this.sprite.startScale * 0.5,
                                 scaleY: this.sprite.startScale * 0.5,
                                 duration: 1000,
                                 ease: 'Cubic.easeIn'
                             });
                             PhaserScene.tweens.add({
                                 targets: shinePattern,
                                 alpha: 0,
                                 ease: 'Cubic.easeIn',
                                 duration: 1000,
                                 onComplete: () => {
                                     shinePattern.destroy();
                                 }
                             });
                         }
                     });
                 }
             });
         }

         if (prevHealthPercent >= 0.8) {
             if (currHealthPercent < 0.8) {
                 this.canAngryEyes = true;
                 this.eyes = this.scene.add.sprite(this.x - 3, this.y - 80, 'enemies', 'dummyeyes.png').setOrigin(0.5, 0.75).setScale(this.sprite.startScale, 0);
                 this.addExtraSprite(this.eyes, -3, -79)
                 PhaserScene.tweens.add({
                     targets: this.eyes,
                     scaleY: this.sprite.startScale,
                     ease: "Back.easeOut",
                     duration: 350,
                     onComplete: () => {
                         this.setDefaultSprite('dummy_w_eyes.png', 0.75);
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
         PhaserScene.tweens.add({
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

                 this.showFlash(this.x, this.y - 75);

                 let rune = this.scene.add.sprite(this.x, this.y - 75, 'circle', 'rune_mind_glow.png').setOrigin(0.5, 0.15).setScale(0.8).setDepth(9999);
                 PhaserScene.tweens.add({
                     targets: rune,
                     x: gameConsts.halfWidth,
                     scaleX: 2,
                     scaleY: 2,
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
                     name: "}5 ",
                     chargeAmt: 500,
                     damage: 5,
                    attackFinishFunction: () => {
                        let dmgEffect = this.scene.add.sprite(gameConsts.halfWidth + (Math.random() - 0.5) * 20, globalObjects.player.getY() - 185, 'spells', 'damageEffect1.png').setDepth(998).setScale(1.5);
                        setTimeout(() => {
                            dmgEffect.destroy();
                        }, 150)
                    }
                 },
                 {
                     name: "}10 ",
                     chargeAmt: 500,
                     damage: 10,
                     attackFinishFunction: () => {
                         let dmgEffect = this.scene.add.sprite(gameConsts.halfWidth - 15, globalObjects.player.getY() - 185, 'spells', 'damageEffect1.png').setDepth(998).setScale(1.6);
                         setTimeout(() => {
                             dmgEffect.x += 30;
                             dmgEffect.y += 10;
                             setTimeout(() => {
                                 dmgEffect.destroy();
                             }, 150)
                         }, 75);

                         this.snort.setScale(this.sprite.startScale * 0.8).setAlpha(1);
                         PhaserScene.tweens.add({
                             targets: this.snort,
                             scaleX: this.sprite.startScale * 1.1,
                             scaleY: this.sprite.startScale * 1.1,
                             duration: 400,
                             ease: 'Cubic.easeOut'
                         });
                         PhaserScene.tweens.add({
                             targets: this.snort,
                             duration: 400,
                             alpha: 0,
                             ease: 'Quad.easeIn',
                         });
                     }
                 },
                 {
                     name: "}25",
                     chargeAmt: 750,
                     damage: 25,
                     attackFinishFunction: () => {
                         let dmgEffect = this.scene.add.sprite(gameConsts.halfWidth, globalObjects.player.getY() - 120, 'spells', 'brickPattern2.png').setDepth(998).setScale(0.75);
                         PhaserScene.tweens.add({
                             targets: dmgEffect,
                             rotation: 1,
                             alpha: 0,
                             duration: 800,
                             onComplete: () => {
                                 dmgEffect.destroy();
                             }
                         });
                         this.snort.setScale(this.sprite.startScale * 0.8).setAlpha(1);
                         PhaserScene.tweens.add({
                             targets: this.snort,
                             scaleX: this.sprite.startScale * 1.1,
                             scaleY: this.sprite.startScale * 1.1,
                             duration: 400,
                             ease: 'Cubic.easeOut'
                         });
                         PhaserScene.tweens.add({
                             targets: this.snort,
                             duration: 400,
                             alpha: 0,
                             ease: 'Quad.easeIn',
                         });
                     }
                 },
                 {
                     name: " TAKING A BREAK...",
                     chargeAmt: 350,
                     damage: 0,
                     startFunction: () => {
                         this.setDefaultSprite('dummy_w_eyes.png', 0.75);
                     },
                     attackFinishFunction: () => {
                         this.setDefaultSprite('dummy_angry.png', 0.75);
                     }
                 },
                 {
                     name: "}10 ",
                     chargeAmt: 400,
                     damage: 10,
                     attackFinishFunction: () => {
                         let dmgEffect = this.scene.add.sprite(gameConsts.halfWidth + (Math.random() - 0.5) * 20, globalObjects.player.getY() - 185, 'spells', 'damageEffect1.png').setDepth(998).setScale(1.5);
                         setTimeout(() => {
                             dmgEffect.destroy();
                         }, 150)
                         this.snort.setScale(this.sprite.startScale * 0.8).setAlpha(1);
                         PhaserScene.tweens.add({
                             targets: this.snort,
                             scaleX: this.sprite.startScale * 1.1,
                             scaleY: this.sprite.startScale * 1.1,
                             duration: 400,
                             ease: 'Cubic.easeOut'
                         });
                         PhaserScene.tweens.add({
                             targets: this.snort,
                             duration: 400,
                             alpha: 0,
                             ease: 'Quad.easeIn',
                         });
                     }
                 },
                 {
                     name: "}15",
                     chargeAmt: 450,
                     damage: 15,
                     attackFinishFunction: () => {
                         let dmgEffect = this.scene.add.sprite(gameConsts.halfWidth - 15, globalObjects.player.getY() - 185, 'spells', 'damageEffect1.png').setDepth(998).setScale(1.6);
                         setTimeout(() => {
                             dmgEffect.x += 30;
                             dmgEffect.y += 10;
                             setTimeout(() => {
                                 dmgEffect.destroy();
                             }, 150)
                         }, 75)
                         this.snort.setScale(this.sprite.startScale * 0.8).setAlpha(1);
                         PhaserScene.tweens.add({
                             targets: this.snort,
                             scaleX: this.sprite.startScale * 1.1,
                             scaleY: this.sprite.startScale * 1.1,
                             duration: 400,
                             ease: 'Cubic.easeOut'
                         });
                         PhaserScene.tweens.add({
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
                         let dmgEffect = this.scene.add.sprite(gameConsts.halfWidth, globalObjects.player.getY() - 110, 'spells', 'brickPattern2.png').setDepth(998).setScale(0.75);
                         PhaserScene.tweens.add({
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
                         this.setSprite('dummy.png', 0.75);
                         this.setAsleep();
                     }
                 },
             ]
         ];
     }
}
