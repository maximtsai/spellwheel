 class LesserDummy extends Enemy {
    constructor(scene, x, y, level) {
        super(scene, x, y, level);
        this.initSprite('lesser_dummy.png', 0.8, 0, 5);
        this.sprite.setOrigin(0.5, 0.95);
        this.playerSpellCastSub = messageBus.subscribe('playerCastedSpell', () => {
            if (globalObjects.player.getPlayerCastSpellsCount() === 1) {
                this.initTutorial2();
            } else if (globalObjects.player.getPlayerCastSpellsCount() === 2) {
                this.initTutorial3();
                this.playerSpellCastSub.unsubscribe()
            }
        });
    }

     initStatsCustom() {
         this.health = 30;
         this.isAsleep = true;

         this.initTutorial();
     }

     initTutorial() {
         this.shadow = this.scene.add.sprite(globalObjects.player.getX(), globalObjects.player.getY() - 1, 'misc', 'shadow_circle.png').setScale(6).setDepth(9999).setAlpha(0);
        setTimeout(() => {
            if (globalObjects.player.getPlayerCastSpellsCount() === 0) {
                console.log("Player cast count: ", globalObjects.player.getPlayerCastSpellsCount());
                // globalObjects.textPopupManager.setInfoText(gameConsts.halfWidth + 1, gameConsts.height - 38, "Click to cast\na spell");
                let spellListener = messageBus.subscribe('spellClicked', () => {
                    this.firstPopupClosed = true;
                    // globalObjects.textPopupManager.hideInfoText();
                    spellListener.unsubscribe();
                    PhaserScene.tweens.add({
                        targets: this.shadow,
                        alpha: 0,
                        ease: "Cubic.easeOut",
                        scaleX: 8,
                        scaleY: 8,
                        duration: 500,
                    });
                });
                PhaserScene.tweens.add({
                    targets: this.shadow,
                    alpha: 0.75,
                    ease: "Cubic.easeOut",
                    scaleX: 5.6,
                    scaleY: 5.6,
                    duration: 500,
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
        }, 1500)
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
                globalObjects.textPopupManager.setInfoText(gameConsts.halfWidth + 1, gameConsts.height - 38, "Switch spells by spinning\n<== the two wheels ==>");
                this.arrowRotate1 = this.scene.add.sprite(globalObjects.player.getX(), globalObjects.player.getY(), 'circle', 'arrow_rotate.png').setOrigin(0.5, 0.5).setDepth(777).setRotation(0.15).setAlpha(0);
                this.arrowRotate2 = this.scene.add.sprite(globalObjects.player.getX(), globalObjects.player.getY(), 'circle', 'arrow_rotate_small.png').setOrigin(0.5, 0.5).setDepth(777).setScale(0.96).setRotation(-0.15).setAlpha(0);
                this.destructibles.push(this.arrowRotate1);
                this.destructibles.push(this.arrowRotate2);
                this.showArrowRotate();

                let spellListener = messageBus.subscribe('spellClicked', () => {
                    globalObjects.textPopupManager.hideInfoText();
                    spellListener.unsubscribe();
                    PhaserScene.tweens.add({
                        targets: this.shadow,
                        alpha: 0,
                        ease: "Cubic.easeOut",
                        scaleX: 18,
                        scaleY: 18,
                        duration: 500,
                    });
                });

                PhaserScene.tweens.add({
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
                            });
                        }
                    }
                });
            }
        }, 3400);
    }


     setHealth(newHealth) {
         super.setHealth(newHealth);
         if (newHealth > 0) {
             PhaserScene.tweens.add({
                 targets: this.sprite,
                 rotation: -0.04,
                 ease: "Quart.easeOut",
                 duration: 100,
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

        this.x += 3;
         this.y += this.sprite.height * this.sprite.scaleY * 0.45; this.sprite.y = this.y;
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
                 this.flash = this.scene.add.sprite(this.x, this.y - 75, 'lowq', 'flash.webp').setOrigin(0.5, 0.5).setScale(this.sprite.startScale * 0.5).setDepth(999);

                 PhaserScene.tweens.add({
                     targets: this.flash,
                     rotation: 2,
                     scaleX: this.sprite.startScale,
                     scaleY: this.sprite.startScale,
                     ease: 'Quad.easeIn',
                     duration: 500,
                     onComplete: () => {
                         PhaserScene.tweens.add({
                             targets: this.flash,
                             rotation: 4,
                             scaleX: 0,
                             scaleY: 0,
                             duration: 500,
                             ease: 'Quad.easeOut',
                             onComplete: () => {
                                 this.flash.destroy();
                             }
                         });
                     }
                 });

                 let rune = this.scene.add.sprite(this.x, this.y - 75, 'circle', 'rune_reinforce_glow.png').setOrigin(0.5, 0.15).setScale(0.8).setDepth(999);
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

     showVictory(rune) {
         let banner = this.scene.add.sprite(gameConsts.halfWidth, gameConsts.halfHeight - 40, 'misc', 'victory_banner.png').setScale(100, 1.3).setDepth(9998).setAlpha(0);
         let victoryText = this.scene.add.sprite(gameConsts.halfWidth, gameConsts.halfHeight - 40, 'misc', 'victory_text.png').setScale(0.95).setDepth(9998).setAlpha(0);
         let runeAcquired = this.scene.add.text(gameConsts.halfWidth, gameConsts.halfHeight + 2, 'NEW RUNE ACQUIRED').setAlpha(0).setVisible(false).setOrigin(0.5, 0.5).setAlign('center').setDepth(9998).setFontSize(22);
         let continueText = this.scene.add.text(gameConsts.width - 15, gameConsts.halfHeight + 2, 'CONTINUE').setAlpha(0).setOrigin(1, 0.5).setAlign('right').setDepth(9998).setFontSize(22);
         swirlInReaperFog();

         PhaserScene.tweens.add({
             targets: banner,
             alpha: 0.8,
             duration: 500,
         });

         PhaserScene.tweens.add({
             targets: [victoryText, runeAcquired],
             alpha: 1,
             ease: 'Quad.easeOut',
             duration: 500,
         });
         setTimeout(() => {
             continueText.alpha = 1;
         }, 1000);

         PhaserScene.tweens.add({
             targets: victoryText,
             scaleX: 1,
             scaleY: 1,
             duration: 800,
         });
         PhaserScene.tweens.add({
             targets: rune,
             y: "+=23",
             ease: 'Cubic.easeOut',
             duration: 400,
             onComplete: () => {
                 this.dieClickBlocker.setOnMouseUpFunc(() => {
                    this.dieClickBlocker.destroy();
                     PhaserScene.tweens.add({
                         targets: [victoryText, runeAcquired, banner],
                         alpha: 0,
                         duration: 400,
                         onComplete: () => {
                             victoryText.destroy();
                             runeAcquired.destroy();
                             banner.destroy();
                             continueText.destroy();
                             playReaperAnim(this);
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
             }
         });
     }

     initAttacks() {
         this.attacks = [
             [
                 // 0
                 {
                     name: "}5 ",
                     chargeAmt: 400,
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
                         let dmgEffect = this.scene.add.sprite(gameConsts.halfWidth, globalObjects.player.getY() - 120, 'spells', 'brickPattern2.png').setDepth(998).setScale(0.8);
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
                         this.setDefaultSprite('dummy_w_eyes.png', 0.8);
                     },
                     attackFinishFunction: () => {
                         this.setDefaultSprite('dummy_angry.png', 0.8);
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
                         let dmgEffect = this.scene.add.sprite(gameConsts.halfWidth, globalObjects.player.getY() - 110, 'spells', 'brickPattern2.png').setDepth(998).setScale(0.8);
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
                         this.setSprite('dummy.png', 0.8);
                         this.setAsleep();
                     }
                 },
             ]
         ];
     }
}
