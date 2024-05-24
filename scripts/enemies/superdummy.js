 class SuperDummy extends Enemy {
    constructor(scene, x, y, level) {
        super(scene, x, y, level);
        this.initSprite('dummy.png', 0.95);
        this.bgMusic = playSound('bite_down', 0.65, true);
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
        this.lastAttackLingerMult = 0.55;
        this.extraRepeatDelay = 200;
        this.pullbackHoldRatio = 0.6;
        this.attackSlownessMult = 1;
     }

     initMisc() {
        if (!this.snort) {
            this.snort = this.scene.add.sprite(this.x - 5, this.y - 96, 'dummyenemy', 'dummysnort.png').setOrigin(0.5, -0.05).setScale(this.sprite.startScale * 0.8).setDepth(11).setAlpha(0);
            this.destructibles.push(this.snort);
        }
        this.stars = this.scene.add.sprite(this.x - 5, this.y - 96, 'dummyenemy', 'super_dummy_stars.png').setOrigin(0.5, 0.5).setScale(this.sprite.startScale * 0.7).setDepth(150).setAlpha(0);
        this.destructibles.push(this.stars);

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
         if (this.breatheTween) {
            this.breatheTween.stop()
         }
         if (this.breatheTween2) {
            this.breatheTween2.stop()
         }
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
            this.dummyLeftArm.visible = false;
            this.dummyRightArm.visible = false;
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
                let dummyArm = this.scene.add.sprite(this.x - 95, this.y - 70, 'dummyenemy', 'super_dummy_rightarm_stretch.png').setScale(0, 0.15).setDepth(-1);
                setTimeout(() => {
                    playSound('inflate');
                }, 250);
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
                                dummyArm.setFrame('super_dummy_leftarm_fist.png').setRotation(-0.1).setScale(1.08);
                                PhaserScene.tweens.add({
                                     targets: dummyArm,
                                     scaleX: 1,
                                     scaleY: 1,
                                     ease: 'Cubic.easeOut',
                                     duration: 300,
                                     onComplete: () => {
                                        PhaserScene.tweens.add({
                                             targets: dummyArm,
                                             rotation: 1.55,
                                             ease: 'Quart.easeIn',
                                             duration: 500,
                                             onComplete: () => {
                                                dummyArm.setFrame('super_dummy_leftarm_fist_large.png').setRotation(1.9).setScale(1.05);
                                                playSound('body_slam')
                                                zoomTemp(1.02);
                                                continueText.destroy();
                                                banner.rotation = 0.15;
                                                banner.y += 15;
                                                victoryText.rotation = 0.18;
                                                victoryText.y += 18;
                                                this.setDefaultSprite('dummy_angry.png', 0.95);
                                                // Pow effect
                                                let shinePattern = getTempPoolObject('spells', 'brickPattern2.png', 'brickPattern', 1000);
                                                 shinePattern.setPosition(this.x + 125, this.y + 30).setScale(0.7).setDepth(9999).setAlpha(1);
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
                                                             scaleX: 0.4,
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

     repeatTweenBreathe(duration = 1500, magnitude = 1) {
        if (this.dead) {
            return;
        }
         if (this.breatheTween) {
             this.breatheTween.stop();
         }
         if (this.breatheTween2) {
             this.breatheTween2.stop();
         }
         this.breatheTween = this.scene.tweens.add({
             targets: this.dummyLeftArm,
             duration: duration,
             rotation: 0.05,
             ease: 'Cubic.easeOut',
             onComplete: () => {
                 this.breatheTween = this.scene.tweens.add({
                     targets: this.dummyLeftArm,
                     duration: duration,
                     rotation: -0.1 * magnitude,
                     ease: 'Cubic.easeInOut',
                     yoyo: true,
                     repeat: -1
                 });
             }
         });

         this.breatheTween = this.scene.tweens.add({
             targets: this.dummyRightArm,
             duration: duration,
             rotation: -0.05,
             ease: 'Cubic.easeOut',
             onComplete: () => {
                 this.breatheTween2 = this.scene.tweens.add({
                     targets: this.dummyRightArm,
                     duration: duration,
                     rotation: 0.1 * magnitude,
                     ease: 'Cubic.easeInOut',
                     yoyo: true,
                     repeat: -1
                 });
             }
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

                        this.bgMusic = playSound('bite_down_complex', 0.8, true);
                        this.setDefaultSprite('dummy_angry.png');
                        this.dummyRightArm = this.scene.add.sprite(this.x + 51, this.startY + 30, 'dummyenemy', 'super_dummy_rightarm.png').setScale(this.sprite.startScale * 0.4).setDepth(-1).setRotation(0.5);
                        this.dummyLeftArm = this.scene.add.sprite(this.x - 51, this.startY + 30, 'dummyenemy', 'super_dummy_leftarm.png').setScale(this.sprite.startScale * 0.4).setDepth(-1).setRotation(-0.5);
                        


                         PhaserScene.tweens.add({
                             targets: [this.dummyRightArm, this.dummyLeftArm],
                             scaleX: this.sprite.startScale * 0.9,
                             scaleY: this.sprite.startScale * 0.9,
                             ease: 'Back.easeOut',
                             rotation: 0,
                             duration: 700,
                             onComplete: () => {
                                this.repeatTweenBreathe();
                             }
                         });

                         this.addExtraSprite(this.dummyRightArm, 50, -10)
                         this.addExtraSprite(this.dummyLeftArm, -50, -10)

                        this.animateSnort();
                        playSound('punch2');
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
                 {
                     name: "}6x2 ",
                     chargeAmt: 350,
                     damage: 6,
                     attackTimes: 2,
                     prepareSprite: 'super_dummy_swinging.png',
                     attackSprites: ['super_dummy_swinging_right.png', 'super_dummy_swinging_left.png'],
                    attackFinishFunction: () => {
                        this.createPunchEffect();
                    },
                    finaleFunction: () => {
                        this.setSprite('dummy_angry.png');
                        this.reEnableArms();
                    }
                 },
                 {
                     name: "}18 ",
                     chargeAmt: 500,
                     damage: 18,
                     prepareSprite: 'super_dummy_wide.png',
                     startFunction: () => {
                        this.pullbackScale = 0.8;
                        this.attackScale = 1.3;
                        this.lastAttackLingerMult = 1.25;
                     },
                     attackStartFunction: () => {
                        this.setSprite('super_dummy_wide.png');
                     },
                     attackFinishFunction: () => {
                        this.lastAttackLingerMult = 0.55;
                        this.pullbackScale = 0.9;
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
                         this.createDoublePunchEffect();

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
                     name: "BUFF UP",
                     chargeAmt: 800,
                     damage: -1,
                     chargeMult: 2,
                     startFunction: () => {
                        this.pullbackScale = 0.99;
                        this.attackScale = 1.01;
                        this.dummyLeftArm.visible = false;
                        this.dummyRightArm.visible = false;
                        this.isBuffing = true;
                        this.buffUp();
                     },
                     attackFinishFunction: () => {
                        this.isBuffing = false;
                        this.buffTween.stop();

                        this.setSprite('dummy_angry.png');
                        this.sprite.setOrigin(0.5, 0.5).setPosition(this.x, this.startY);
                        this.sprite.setScale(this.sprite.startScale);

                        this.reEnableArms();
                        this.buffArms();
                     },
                 },
                 {
                     name: "|8x2 ",
                     chargeAmt: 350,
                     damage: 8,
                     attackTimes: 2,
                     prepareSprite: 'super_dummy_swinging.png',
                     attackSprites: ['super_dummy_swinging_right.png', 'super_dummy_swinging_left.png'],
                     startFunction: () => {
                         this.pullbackScale = 0.9;
                        this.attackScale = 1.2;
                     },
                    attackFinishFunction: () => {
                        this.createPunchEffect();
                    },
                    finaleFunction: () => {
                        this.setSprite('dummy_angry.png');
                        this.reEnableArms();
                    }
                 },
                 {
                     name: "|20 ",
                     damage: -1,
                    finishDelay: 2200,
                     chargeAmt: 500,
                     startFunction: () => {
                        this.pullbackScale = 0.99;
                        this.attackScale = 1.01;
                        this.lastAttackLingerMult = 1.25;
                     },
                     attackStartFunction: () => {
                        playSound('inflate');
                        this.reEnableArms();
                        this.setSprite('dummy_angry.png');
                        this.disableAnimateShake = true;
                         PhaserScene.tweens.add({
                             targets: [this.sprite],
                             duration: 700,
                             x: gameConsts.halfWidth - 65,
                             ease: 'Cubic.easeOut'
                         });

                         this.breatheTween2.stop();
                         this.breatheTween.stop();

                        this.dummyRightArm.setScale(1, -1);
                        this.sprite.setDepth(12);
                        PhaserScene.tweens.add({
                            targets: this.dummyRightArm,
                            duration: 1100,
                            x: this.x - 5,
                            rotation: -1.2,
                            ease: 'Cubic.easeOut',
                            onComplete: () => {
                                this.tempArmAnim = PhaserScene.tweens.add({
                                    targets: this.dummyRightArm,
                                    duration: 50,
                                    rotation: -1.1,
                                    ease: 'Quart.easeOut',
                                    yoyo: true,
                                    repeat: 4
                                });
                            }
                        });
                        PhaserScene.tweens.add({
                            targets: this.dummyRightArm,
                            duration: 1400,
                            scaleX: 1.65,
                            scaleY: -1.65,
                            ease: 'Quart.easeOut',
                            onComplete: () => {
                                if (this.tempArmAnim) {
                                    this.tempArmAnim.stop();
                                }
                                PhaserScene.tweens.add({
                                    targets: this.dummyRightArm,
                                    duration: 275,
                                    rotation: 0.5,
                                    scaleX: 1.6,
                                    scaleY: -1.6,
                                    ease: 'Quint.easeIn',
                                    onComplete: () => {
                                        playSound('punch');
                                        zoomTemp(1.02);
                                        this.dummyRightArm.setFrame('super_dummy_leftarm_fist_large.png');
                                        this.dummyRightArm.setRotation(3).setScale(-1.35, 1.45).setDepth(200);

                                        messageBus.publish("selfTakeDamage", 20);
                                         let shinePattern = getTempPoolObject('spells', 'brickPattern2.png', 'brickPattern', 800);
                                         shinePattern.setPosition(gameConsts.halfWidth, globalObjects.player.getY() - 220).setScale(0.7).setDepth(9999).setAlpha(1);
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

                                        this.dummyRightArm.x += 9;
                                        PhaserScene.tweens.add({
                                            targets: this.dummyRightArm,
                                            duration: 450,
                                            x: "-=7",
                                            ease: 'Bounce.easeOut',
                                        });

                                        PhaserScene.tweens.add({
                                            targets: this.dummyRightArm,
                                            duration: 550,
                                            scaleX: -1.1,
                                            scaleY: 1.1,
                                            ease: 'Quint.easeOut',
                                            onComplete: () => {
                                                PhaserScene.tweens.add({
                                                    delay: 350,
                                                    targets: this.dummyRightArm,
                                                    duration: 600,
                                                    scaleX: -0.8,
                                                    scaleY: 0.8,
                                                    rotation: 1.7,
                                                    ease: 'Quart.easeIn',
                                                    onComplete: () => {
                                                        let sfx = playSound('balloon', 0.4).detune = -250;
                                                        this.dummyRightArm.setDepth(0);
                                                        this.dummyRightArm.setFrame('super_dummy_rightarm.png');
                                                        this.dummyRightArm.setRotation(0.3);
                                                        this.dummyRightArm.setDepth(0).setScale(1);
                                                         PhaserScene.tweens.add({
                                                             targets: [this.sprite],
                                                             duration: 300,
                                                             x: gameConsts.halfWidth,
                                                             ease: 'Cubic.easeOut',
                                                             onComplete: () => {
                                                                this.disableAnimateShake = false;
                                                             }
                                                         });
                                                         PhaserScene.tweens.add({
                                                             targets: this.dummyRightArm,
                                                             duration: 300,
                                                             x: gameConsts.halfWidth + 51, 
                                                             y: this.startY + 30,
                                                             rotation: 0,
                                                             ease: 'Cubic.easeOut',
                                                             onComplete: () => {
                                                                this.repeatTweenBreathe();
                                                             }
                                                         });
                                                         PhaserScene.tweens.add({
                                                             targets: this.dummyLeftArm,
                                                             duration: 300,
                                                             scaleX: 1,
                                                             scaleY: 1,
                                                             ease: 'Cubic.easeOut'
                                                         });
                                                        this.sprite.setDepth(1);
                                                    }
                                                });
                                            }
                                        });

                                    }
                                });
                            }
                        });

                         PhaserScene.tweens.add({
                             targets: this.dummyLeftArm,
                             duration: 900,
                             scaleX: 0,
                             scaleY: 0,
                             ease: 'Cubic.easeOut'
                         });
                     },
                     finaleFunction: () => {
                        this.pullbackScale = 0.8;
                        this.attackScale = 1.2;
                        this.lastAttackLingerMult = 0.55;
                     }
                 },
                 {
                     name: "BUFF UP",
                     chargeAmt: 800,
                     damage: -1,
                     chargeMult: 2,
                     startFunction: () => {
                        // this.setDefaultSprite('mantis_a.png');
                        this.dummyLeftArm.visible = false;
                        this.dummyRightArm.visible = false;
                        this.isBuffing = true;
                        this.buffUp();
                     },
                     attackFinishFunction: () => {
                        this.isBuffing = false;
                        this.buffTween.stop();

                        this.setSprite('dummy_angry.png');
                        this.sprite.setOrigin(0.5, 0.5).setPosition(this.x, this.startY);
                        this.sprite.setScale(this.sprite.startScale);

                        this.reEnableArms();
                        this.buffArms();
                     },
                 },
                 {
                     name: "}10x2 ",
                     chargeAmt: 350,
                     damage: 10,
                     attackTimes: 2,
                     prepareSprite: 'super_dummy_swinging.png',
                     attackSprites: ['super_dummy_swinging_right.png', 'super_dummy_swinging_left.png'],
                    attackFinishFunction: () => {
                        this.createPunchEffect();
                    },
                    finaleFunction: () => {
                        this.setSprite('dummy_angry.png');
                        this.reEnableArms();
                    }
                 },
                 {
                     name: "}10x3 ",
                     chargeAmt: 350,
                     damage: 10,
                     attackTimes: 3,
                     prepareSprite: 'super_dummy_swinging.png',
                     attackSprites: ['super_dummy_swinging_right.png', 'super_dummy_swinging_left.png'],
                    attackFinishFunction: () => {
                        this.createPunchEffect();
                    },
                    finaleFunction: () => {
                        this.setSprite('dummy_angry.png');
                        this.reEnableArms();
                    }
                 },
             ]
         ];
     }

    buffUp() {
        if (this.isBuffing) {
            this.buffTween = PhaserScene.tweens.add({
                 targets: this.sprite,
                 scaleY: 0.9,
                 duration: this.isAngry ? 250 : 500,
                 ease: 'Quart.easeOut',
                 onStart: () => {
                    this.isPushingUp = !this.isPushingUp;
                    playSound('balloon', 0.6).detune = (this.isPushingUp ? 0 : -500) + (this.isAngry ? 125 : 0);
                    if (this.isPushingUp && Math.random() < 0.3) {
                        this.isFlipped = !this.isFlipped;
                    } 
                    let newFrameName = this.isPushingUp ? 'super_dummy_pushup1' : 'super_dummy_pushup2';
                    if (!this.isFlipped) {
                        newFrameName += '_flip';
                    }
                    newFrameName += '.png';
                    this.sprite.setFrame(newFrameName);
                    this.sprite.setOrigin(0.5, 0.75).setPosition(this.x, this.startY + 160);
                    this.sprite.scaleY = this.isPushingUp ? 1 : 0.8;
                },
                completeDelay: this.isAngry ? 250 : 500,
                 onComplete: () => {
                    this.buffUp();
                 }
             });
        }
    }

     createPunchEffect() {
        let isSwingingLeft = this.sprite.attackNum % 2 == 0;
        playSound(isSwingingLeft ? 'punch' : 'punch2');
         let powEffect = getTempPoolObject('spells', 'damageEffect1.png', 'damageEffect1', 175);
         let xOffset = isSwingingLeft ? -30 : 30;
         powEffect.setPosition(gameConsts.halfWidth + xOffset, globalObjects.player.getY() - 170).setDepth(998).setScale(1.5);

         let fistEffect = getTempPoolObject('dummyenemy', 'super_dummy_fist.png', 'fist', 250);
         let xOffset2 = isSwingingLeft ? -80 : 80;
         let leftMult = isSwingingLeft ? 1 : -1;
         fistEffect.setPosition(this.sprite.x + xOffset2, this.y - 8).setDepth(11).setScale(1.6 * leftMult, 1.6);
         PhaserScene.tweens.add({
            targets: fistEffect,
            duration: 250,
            y: '-=5',
            scaleX: 1.25 * leftMult,
            scaleY: 1.25,
            ease: 'Back.easeIn'
         })


         let starEffect = getTempPoolObject('dummyenemy', 'super_dummy_stars.png', 'stars', 250);
         let xOffset3 = isSwingingLeft ? -85 : 85;
         starEffect.setPosition(this.sprite.x + xOffset3, this.y).setDepth(11).setScale(1.1 * leftMult, 1.1).setOrigin(0.5, 0.4);
         PhaserScene.tweens.add({
            targets: starEffect,
            duration: 250,
            scaleX: 1.35 * leftMult,
            scaleY: 1.35,
            ease: 'Cubic.easeOut'
         })
         PhaserScene.tweens.add({
            targets: starEffect,
            duration: 250,
            alpha: 0,
         })
     }

     buffArms() {
        this.dummyLeftArm.visible = true;
        this.dummyRightArm.visible = true;
        this.dummyLeftArm.setRotation(0.1);
        this.dummyRightArm.setRotation(-0.1);
        this.buffOneArm(this.dummyLeftArm);
        this.buffOneArm(this.dummyRightArm, -1);
    }

    buffOneArm(arm, rotMult = 1) {
        let oldScale = arm.scaleX;
        arm.setFrame(rotMult == 1 ? 'super_dummy_leftarm_stretch_straight.png' : 'super_dummy_rightarm_stretch_straight.png');
        arm.setRotation(-0.3*rotMult).setScale(oldScale - 0.2);
        PhaserScene.tweens.add({
            targets: arm,
            duration: 600,
            ease: 'Quart.easeOut',
            scaleX: oldScale,
            scaleY: oldScale,
            rotation: -0.5 * rotMult,
            onComplete: () => {
                PhaserScene.tweens.add({
                    targets: arm,
                    duration: 50,
                    ease: 'Quint.easeOut',
                    rotation: -0.54 * rotMult,
                    yoyo: true,
                    repeat: 2,
                    onComplete: () => {
                        PhaserScene.tweens.add({
                            targets: arm,
                            duration: 500,
                            ease: 'Quart.easeIn',
                            rotation: 0.1 * rotMult,
                            scaleX: oldScale - 0.25,
                            scaleY: oldScale - 0.25,
                            onComplete: () => {
                                arm.setFrame(rotMult == 1 ? 'super_dummy_leftarm.png' : 'super_dummy_rightarm.png');
                                arm.setRotation(-0.05 * rotMult).setScale(oldScale);
                                PhaserScene.tweens.add({
                                    targets: arm,
                                    duration: 300,
                                    ease: 'Quint.easeOut',
                                    scaleX: oldScale + 0.4,
                                    scaleY: oldScale + 0.4,
                                    rotation: 0.1 * rotMult,
                                    onComplete: () => {
                                        PhaserScene.tweens.add({
                                            targets: arm,
                                            duration: 700,
                                            ease: 'Cubic.easeIn',
                                            scaleX: oldScale + 0.1,
                                            scaleY: oldScale + 0.1,
                                            rotation: 0,
                                            onComplete: () => {
                                                
                                            }
                                        });
                                    }
                                });
                                 let shinePattern = getTempPoolObject('spells', 'brickPattern2.png', 'brickPattern', 1000);
                                 shinePattern.setPosition(this.x, this.y).setScale(1.5).setDepth(-2).setRotation(0);
                                 playSound('body_slam');
                                 PhaserScene.tweens.add({
                                     targets: shinePattern,
                                     scaleX: 1.4,
                                     scaleY: 1.4,
                                     duration: 750,
                                     rotation: 1
                                 });
                                 PhaserScene.tweens.add({
                                     targets: shinePattern,
                                     alpha: 0,
                                     ease: 'Cubic.easeIn',
                                     duration: 750,
                                 });
                            }
                        })
                    }
                })
            }
        });
        // PhaserScene.tweens.add({
        //     targets: arm,
        //     duration: 400,
        //     ease: 'Quint.easeOut',
        //     scaleX: oldScale - 0.05,
        //     scaleY: oldScale - 0.05,
        //     rotation: 0.3 * rotMult,
        //     onComplete: () => {
        //         PhaserScene.tweens.add({
        //             targets: arm,
        //             duration: 600,
        //             ease: 'Quint.easeIn',
        //             scaleX: oldScale + 0.3,
        //             scaleY: oldScale + 0.3,
        //             rotation: -0.5 * rotMult,
        //             onComplete: () => {
        //                 arm.setScale(oldScale + 0.65);
        //                 PhaserScene.tweens.add({
        //                     targets: arm,
        //                     duration: 300,
        //                     ease: 'Back.easeIn',
        //                     scaleX: oldScale + 0.1,
        //                     scaleY: oldScale + 0.1,
        //                     rotation: -0.4 * rotMult,
        //                     onComplete: () => {
        //                         PhaserScene.tweens.add({
        //                             targets: arm,
        //                             duration: 600,
        //                             ease: 'Cubic.easeInOut',
        //                             rotation: 0
        //                         });
        //                     }
        //                 });
        //             }
        //         });

        //     }
        // });

    } 

     createDoublePunchEffect() {
        playSound('punch');
        setTimeout(() => {
            playSound('punch2');
        }, 70)
         let powEffect = getTempPoolObject('spells', 'damageEffect1.png', 'damageEffect1', 175);
         powEffect.setPosition(gameConsts.halfWidth, globalObjects.player.getY() - 170).setDepth(998).setScale(2.1);

         let fistEffect = getTempPoolObject('dummyenemy', 'super_dummy_fist.png', 'fist', 250);
         let fistEffect2 = getTempPoolObject('dummyenemy', 'super_dummy_fist.png', 'fist', 250);
         fistEffect.setPosition(this.sprite.x - 110, this.y - 8).setDepth(11).setScale(1.45, 1.45);
         fistEffect2.setPosition(this.sprite.x + 110, this.y - 8).setDepth(11).setScale(-1.45, 1.45);
         PhaserScene.tweens.add({
            targets: fistEffect,
            duration: 250,
            y: '-=5',
            scaleX: 1.25,
            scaleY: 1.25,
            ease: 'Back.easeIn'
         })
         PhaserScene.tweens.add({
            targets: fistEffect2,
            duration: 250,
            y: '-=5',
            scaleX: -1.25,
            scaleY: 1.25,
            ease: 'Back.easeIn'
         })

         // let starEffect = getTempPoolObject('dummyenemy', 'super_dummy_stars.png', 'stars', 250);
         // let xOffset3 = isSwingingLeft ? -85 : 85;
         // starEffect.setPosition(this.sprite.x + xOffset3, this.y).setDepth(11).setScale(1.1 * leftMult, 1.1).setOrigin(0.5, 0.4);
         // PhaserScene.tweens.add({
         //    targets: starEffect,
         //    duration: 250,
         //    scaleX: 1.35 * leftMult,
         //    scaleY: 1.35,
         //    ease: 'Cubic.easeOut'
         // })
         // PhaserScene.tweens.add({
         //    targets: starEffect,
         //    duration: 250,
         //    alpha: 0,
         // })
     }
}
