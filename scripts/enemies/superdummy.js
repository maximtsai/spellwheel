 class SuperDummy extends Enemy {
    constructor(scene, x, y, level) {
        super(scene, x, y, level);
        this.initSprite('dummy.png', 0.95);
        this.startY = this.sprite.y;

        setTimeout(() => {
            this.tutorialButton = createTutorialBtn(this.level);
            this.addToDestructibles(this.tutorialButton);
        }, 1500)
        this.initMisc();
    }

     initStatsCustom() {
         this.health = 10;
         this.isAsleep = true;
         this.isFirstMode = true;
        this.attackScale = 1.23;
        this.lastAttackLingerMult = 0.4;
        this.extraRepeatDelay = 200;
        this.pullbackHoldRatio = 0.6;
        this.attackSlownessMult = 1;
     }

     initMisc() {
        if (!this.snort) {
            this.snort = this.scene.add.sprite(this.x - 5, this.y - 96, 'enemies', 'dummysnort.png').setOrigin(0.5, -0.05).setScale(this.sprite.startScale * 0.8).setDepth(11).setAlpha(0);
            this.destructibles.push(this.snort);
        }
     }

    tryInitTutorial4() {
        if (!this.dead && !this.isAsleep && !this.shownTut4) {
            this.shownTut4 = true;
            globalObjects.textPopupManager.setInfoText(gameConsts.width - 80, 275, "Enemies get\nangry when\nattacked!", 'left');
            messageBus.publish('setSlowMult', 0.25, 50);
            let glowBar = this.scene.add.sprite(gameConsts.halfWidth, 325, 'misc', 'shadow_bar.png').setDepth(9999).setAlpha(0).setScale(7);
            PhaserScene.tweens.add({
                targets: glowBar,
                alpha: 0.25,
                scaleY: 4,
                scaleX: 5,
                ease: 'Cubic.easeInOut',
                duration: 600,
                onComplete: () => {
                    this.glowBarAnim = PhaserScene.tweens.add({
                        delay: 1500,
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
                        messageBus.publish('setSlowMult', 0.99, 1);
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
            }, 800);
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
     }


    animateDeathOne() {
         PhaserScene.tweens.add({
             targets: this.sprite,
             rotation: -1.31,
             ease: "Cubic.easeIn",
             duration: 1000,
             onComplete: () => {
                 playSound('victory_2');
                 setTimeout(() => {
                    this.showFalseVictory();
                 }, 500)
             }
         });
    }


     die() {
         if (this.dead) {
             return;
         }
        if (this.isLoading) {
            return;
        }


         if (this.currAnim) {
             this.currAnim.stop();
         }
         if (this.bgMusic) {
            this.bgMusic.stop();
         }
         // this.breatheTween.stop();
         // if (this.breatheTween2) {
         //     this.breatheTween2.stop();
         // }

         if (this.isFirstMode) {
            this.isLoading = true;
            this.isFirstMode = false;
             this.y += this.sprite.height * this.sprite.scaleY * 0.49;
             this.sprite.y = this.y;
             this.sprite.setOrigin(0.51, 0.98);
            this.setAsleep();
             this.animateDeathOne();
         } else {
            super.die();
            this.setSprite('super_dummy_angry.png', 0.95);
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
                 duration: 1500,
                 onComplete: () => {
                     this.x -= 80;
                     this.y += 39;
                     this.setSprite('super_dummy_broken.png', this.sprite.scaleX);
                     this.sprite.setRotation(0);
                     this.sprite.setOrigin(0.85, 0.78);

                     let rune = this.scene.add.sprite(this.x, this.y - 75, 'circle', 'rune_mind_glow.png').setOrigin(0.5, 0.15).setScale(0).setDepth(9999).setVisible(false);
                     PhaserScene.tweens.add({
                         targets: rune,
                         x: gameConsts.halfWidth,
                         duration: 1500,
                         onComplete: () => {
                            this.showVictory(rune);
                         }
                     });

                 }
             });

        }

    }

    showFalseVictory() {
        let banner = this.scene.add.sprite(gameConsts.halfWidth, gameConsts.halfHeight - 40, 'misc', 'victory_banner.png').setScale(100, 1.3).setDepth(9998).setAlpha(0);
        let victoryText = this.scene.add.sprite(gameConsts.halfWidth, gameConsts.halfHeight - 40, 'misc', 'victory_text.png').setScale(0.95).setDepth(9998).setAlpha(0);
        let continueText = this.scene.add.text(gameConsts.width - 15, gameConsts.halfHeight + 2, 'CONTINUE').setAlpha(0).setOrigin(1, 0.5).setAlign('right').setDepth(9998).setFontSize(22);

        PhaserScene.tweens.add({
            targets: banner,
            alpha: 0.75,
            duration: 500,
            onComplete: () => {
                let dummyArm = this.scene.add.sprite(this.x - 95, this.y - 70, 'enemies', 'super_dummy_leftarm_stretch.png').setScale(0, 0.15).setDepth(-1);
                PhaserScene.tweens.add({
                     targets: dummyArm,
                     scaleX: 1,
                     scaleY: 1,
                     ease: 'Back.easeOut',
                     duration: 750,
                     onComplete: () => {
                        PhaserScene.tweens.add({
                             targets: dummyArm,
                             rotation: -1,
                             ease: 'Cubic.easeInOut',
                             duration: 650,
                             onComplete: () => {
                                dummyArm.setFrame('super_dummy_leftarm_fist.png').setRotation(-0.1).setScale(1.05);
                                PhaserScene.tweens.add({
                                     targets: dummyArm,
                                     scaleX: 1,
                                     scaleY: 1,
                                     ease: 'Cubic.easeOut',
                                     duration: 500,
                                     onComplete: () => {
                                        PhaserScene.tweens.add({
                                             targets: dummyArm,
                                             rotation: 1.55,
                                             ease: 'Quart.easeIn',
                                             duration: 500,
                                             onComplete: () => {
                                                dummyArm.setFrame('super_dummy_leftarm_fist_large.png').setRotation(1.9).setScale(1.05);
                                                playSound('punch');
                                                zoomTemp(1.02);
                                                continueText.destroy();
                                                banner.rotation = 0.15;
                                                banner.y += 15;
                                                victoryText.rotation = 0.18;
                                                victoryText.y += 18;
                                                this.setDefaultSprite('dummy_angry.png', 0.95);
                                                // Pow effect
                                                 let shinePattern = getTempPoolObject('spells', 'brickPattern2.png', 'brickPattern', 1000);
                                                 shinePattern.setPosition(this.x + 125, this.y + 30).setScale(0.7).setDepth(9999);
                                                 PhaserScene.tweens.add({
                                                     targets: shinePattern,
                                                     scaleX: 0.55,
                                                     scaleY: 0.55,
                                                     duration: 750,
                                                     rotation: 1
                                                 });
                                                 PhaserScene.tweens.add({
                                                     targets: shinePattern,
                                                     alpha: 0,
                                                     ease: 'Cubic.easeIn',
                                                     duration: 750,
                                                 });


                                                PhaserScene.tweens.add({
                                                    delay: 10,
                                                     targets: dummyArm,
                                                     rotation: 1.1,
                                                     scaleX: 1,
                                                     scaleY: 1,
                                                     ease: 'Quart.easeOut',
                                                     duration: 500,
                                                     completeDelay: 400,
                                                     onComplete: () => {
                                                        PhaserScene.tweens.add({
                                                             targets: dummyArm,
                                                             scaleX: 0,
                                                             scaleY: 0,
                                                             duration: 400,
                                                             ease: 'Cubic.easeIn',
                                                             onComplete: () => {
                                                                dummyArm.destroy();
                                                                PhaserScene.tweens.add({
                                                                    delay: 100,
                                                                     targets: [banner, victoryText],
                                                                     alpha: 0,
                                                                     y: "+=80",
                                                                     ease: 'Cubic.easeIn',
                                                                     duration: 750,
                                                                     onComplete: () => {
                                                                        victoryText.destroy();
                                                                        banner.destroy();
                                                                     }
                                                                });

                                                                PhaserScene.tweens.add({
                                                                     targets: this.sprite,
                                                                     rotation: 0,
                                                                     duration: 1000,
                                                                     ease: 'Quad.easeInOut',
                                                                     onComplete: () => {
                                                                        this.revive();
                                                                     }
                                                                });

                                                             }
                                                         });
                                                     }
                                                 });
                                             }
                                         });
                                     }
                                 });
                             }
                         });
                     }
                 });
            }
        });

         PhaserScene.tweens.add({
             targets: [victoryText, continueText],
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

    }

    animateSnort() {
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

    revive() {
        this.y = this.startY;
        this.sprite.y = this.y;
        this.sprite.setOrigin(0.51, 0.5);

         this.currAnim = PhaserScene.tweens.add({
             delay: 100,
             targets: this.sprite,
             scaleX: this.sprite.startScale + 0.2,
             scaleY: this.sprite.startScale + 0.2,
             duration: 600,
             completeDelay: 50,
             ease: 'Quart.easeOut',
             onComplete: () => {
                 this.currAnim = PhaserScene.tweens.add({
                     targets: this.sprite,
                     scaleX: this.sprite.startScale,
                     scaleY: this.sprite.startScale,
                     duration: 400,
                     ease: 'Quart.easeIn',
                     onComplete: () => {
                        this.isLoading = false;
                        this.setMaxHealth(gameVars.isHardMode ? 800 : 700);
                        this.heal(this.healthMax);
                        this.currentAttackSetIndex = 0;
                        this.nextAttackIndex = 0;
                        this.setAwake();
                        this.loadUpHealthBarSecond();

                        this.bgMusic = playSound('and_into_the_void', 1, true);
                        this.setDefaultSprite('dummy_angry.png');
                        this.dummyRightArm = this.scene.add.sprite(this.x + 51, this.y + 30, 'enemies', 'super_dummy_rightarm.png').setScale(this.sprite.startScale * 0.5).setDepth(-1).setRotation(0.5);
                        this.dummyLeftArm = this.scene.add.sprite(this.x - 51, this.y + 30, 'enemies', 'super_dummy_leftarm.png').setScale(this.sprite.startScale * 0.5).setDepth(-1).setRotation(-0.5);
                        
                         PhaserScene.tweens.add({
                             targets: [this.dummyRightArm, this.dummyLeftArm],
                             scaleX: this.sprite.startScale,
                             scaleY: this.sprite.startScale,
                             ease: 'Back.easeOut',
                             rotation: 0,
                             duration: 1000,
                         });

                         this.addExtraSprite(this.dummyRightArm, 50, -10)
                         this.addExtraSprite(this.dummyLeftArm, -50, -10)

                        this.animateSnort();
                        playSound('punch');
                        zoomTemp(1.02);
                         let shinePattern = getTempPoolObject('spells', 'brickPattern2.png', 'brickPattern', 1000);
                         shinePattern.setPosition(this.x, this.y).setScale(this.sprite.startScale + 0.75).setDepth(-1);
                         PhaserScene.tweens.add({
                             targets: shinePattern,
                             scaleX: this.sprite.startScale + 0.4,
                             scaleY: this.sprite.startScale + 0.4,
                             rotation: "+=0.5",
                             duration: 1000,
                         });
                         this.timeSinceLastAttacked = -30;
                         PhaserScene.tweens.add({
                             targets: shinePattern,
                             alpha: 0,
                             ease: 'Cubic.easeIn',
                             duration: 1000,
                             onComplete: () => {
                                this.tryInitTutorial4()
                             }
                         });

                     }
                 });
             }
         });
    }

    useMove() {
        if (this.nextAttack.damage !== 0) {
            this.dummyLeftArm.visible = false;
            this.dummyRightArm.visible = false;
        }
        super.useMove();
    }
    reEnableArms() {
        this.dummyLeftArm.visible = true;
        this.dummyRightArm.visible = true;
    }

     initAttacks() {
         this.attacks = [
             [
                 // 0
                 {
                     name: "}8x2 ",
                     chargeAmt: 500,
                     damage: 8,
                     attackTimes: 2,
                     prepareSprite: 'super_dummy_swinging.png',
                     attackSprites: ['super_dummy_swinging_right.png', 'super_dummy_swinging_left.png'],
                    attackFinishFunction: () => {
                        let isSwingingLeft = this.sprite.attackNum % 2 == 0;

                         let powEffect = getTempPoolObject('spells', 'damageEffect1.png', 'damageEffect1', 175);
                         let xOffset = isSwingingLeft ? -30 : 30;
                         powEffect.setPosition(gameConsts.halfWidth + xOffset, globalObjects.player.getY() - 170).setDepth(998).setScale(1.5);
                    },
                    finaleFunction: () => {
                        this.setSprite('dummy_angry.png');
                        this.reEnableArms();
                    }
                 },
                 {
                     name: "}20 ",
                     chargeAmt: 500,
                     damage: 20,
                     attackStartFunction: () => {
                        this.setSprite('super_dummy_angry.png')
                     },
                     attackFinishFunction: () => {
                        this.setSprite('dummy_angry.png');
                        this.reEnableArms();
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
