 class SuperDummy extends Enemy {
    constructor(scene, x, y, level, fromTutorial) {
        super(scene, x, y, level);
        this.initSprite('dummy.png', 0.95, undefined, undefined, 'dummyenemy');
        this.bgMusic = playMusic('bite_down', 0.65, true);
        this.startY = this.sprite.y;
        // this.temp = this.addSprite(x - 50, 170, 'deathfin', 'frame_00.png').setDepth(6).play({key: 'ladydeath', repeat: -1});
        this.showTut1 = gameVars.hasFoughtSuper;
        this.popupTimeout = this.addTimeoutIfAlive(() => {
            gameVars.hasFoughtSuper = true;
            this.tutorialButton = createTutorialBtn(this.level);
            this.addToDestructibles(this.tutorialButton);
            globalObjects.bannerTextManager.setDialog([getLangText('superdummy_start')]);
            globalObjects.bannerTextManager.setPosition(gameConsts.halfWidth, gameConsts.halfHeight, 0);
            globalObjects.bannerTextManager.showBanner(0.5);
        }, 1000)
        this.initMisc();
    }

    createAngrySymbol() {
        let angrySymbol = getTempPoolObject('misc', 'angry1.png', 'angrysymb', 2000);
        angrySymbol.play('angrybig').setScale(0.8).setDepth(25).setPosition(this.x + 65 - Math.random() * 130, this.y - 45 - Math.random() * 55);
        this.latestAngrySymbol2 = this.latestAngrySymbol;
        this.latestAngrySymbol = angrySymbol;
        this.sprite.rotation = Math.random() < 0.5 ? -0.08 : 0.08;
        this.injuries.rotation = this.sprite.rotation;

        this.injuryTween = this.addTween({
            targets: [this.sprite, this.injuries],
            rotation: 0,
            ease: 'Bounce.easeOut',
            duration: 500
        })

        this.addTween({
            targets: angrySymbol,
            scaleX: 1.4,
            scaleY: 1.4,
            ease: 'Quart.easeOut',
            duration: 200,
            onComplete: () => {
                this.addTween({
                    targets: angrySymbol,
                    scaleX: 1,
                    scaleY: 1,
                    ease: 'Back.easeOut',
                    duration: 250,
                    completeDelay: 1200,
                    onComplete: () => {
                        this.addTween({
                            targets: angrySymbol,
                            scaleX: 0,
                            scaleY: 0,
                            ease: 'Back.easeIn',
                            duration: 250,
                        })
                    }
                })
            }
        })

    }

    initSpriteAnim(scale) {
        this.sprite.setScale(scale * 0.98, scale * 0.9).setRotation(-0.25).setPosition(gameConsts.halfWidth - 30, this.sprite.y);
        this.scene.tweens.add({
            delay: 500,
            rotation: 0.05,
            x: gameConsts.halfWidth + 6,
            targets: this.sprite,
            duration: gameVars.gameManualSlowSpeedInverse * 650,
            ease: 'Cubic.easeIn',
            scaleX: scale,
            scaleY: scale,
            alpha: 1,
            onComplete: () => {
                this.scene.tweens.add({
                    rotation: 0,
                    x: gameConsts.halfWidth,
                    targets: this.sprite,
                    duration: gameVars.gameManualSlowSpeedInverse * 350,
                    ease: 'Back.easeOut',
                });
            }
        });
    }

     initStatsCustom() {
         this.health = 24;
        this.secondHealth = 450;
         this.isAsleep = true;
         this.isFirstMode = true;
        this.attackScale = 1.23;
        this.lastAttackLingerMult = 0.55;
        this.extraRepeatDelay = 200;
        this.pullbackHoldRatio = 0.6;
        this.attackSlownessMult = 1;
        this.angryCount = 0;
        this.accumulatedDamageReaction
     }

     initMisc() {
        if (!this.snort) {
            this.snort = this.addSprite(this.x - 5, this.y - 96, 'dummyenemy', 'dummysnort.png').setOrigin(0.5, -0.05).setScale(this.sprite.startScale * 0.8).setDepth(11).setAlpha(0);
        }
        this.stars = this.addSprite(this.x - 5, this.y - 96, 'dummyenemy', 'super_dummy_stars.png').setOrigin(0.5, 0.5).setScale(this.sprite.startScale * 0.7).setDepth(150).setAlpha(0);

        this.injuries = this.addSprite(this.x, this.y, 'dummyenemy', 'super_dummy_matter0.png').setScale(this.sprite.startScale).setDepth(this.sprite.depth - 1);
     }

     launchAttack(attackTimes, prepareSprite, preAttackSprite, attackSprites, isRepeatedAttack, finishDelay, transitionFast) {
        super.launchAttack(attackTimes, prepareSprite, preAttackSprite, attackSprites, isRepeatedAttack, finishDelay, transitionFast);
         this.addTween({
             targets: this.injuries,
             ease: 'Cubic.easeIn',
             scaleX: this.sprite.startScale * 0.6,
             scaleY: this.sprite.startScale * 0.6,
             duration: 150,
             onComplete: () => {
                 this.injuries.setScale(this.sprite.startScale);
                 this.injuries.setFrame('super_dummy_matter0.png');
             }
         })

     }

     reactToDamageTypes(amt, isAttack, type) {
         if (!type || this.isFirstMode || this.isUsingAttack) {
             return;
         }
         this.accumulatedDamageReaction += amt;
         if (this.reactTimeout) {
             clearTimeout(this.reactTimeout);
         }
         this.reactTimeout = setTimeout(() => {

             this.addTween({
                 targets: this.injuries,
                 ease: 'Cubic.easeIn',
                 scaleX: this.sprite.startScale * 0.65,
                 scaleY: this.sprite.startScale * 0.65,
                 duration: 150,
                 onComplete: () => {
                     this.injuries.setScale(this.sprite.startScale);
                     this.injuries.setFrame('super_dummy_matter0.png');
                     this.accumulatedDamageReaction = 0;
                     this.reactTimeout = null;
                     this.justPlayedInjury1 = false;
                     this.justPlayedInjury2 = false;
                     this.justPlayedInjury3 = false;
                 }
             })
         }, 1600)

         if (!this.isFirstMode && this.angryCount <= 1 && !this.isUsingAttack && isAttack) {
             this.angryCount++;
             this.addDelay(() => {
                 this.angryCount = 0;
             }, 2400)
             this.createAngrySymbol();
         }

         if (type !== 'mind' && !this.isBuffing) {
             if (this.accumulatedDamageReaction >= 70 && !this.justPlayedInjury3) {
                 this.justPlayedInjury3 = true;
                 if (!this.justPlayedInjury2) {
                     this.justPlayedInjury2 = true;
                     this.justPlayedInjury1 = true;
                     this.injuries.setFrame('super_dummy_matter2.png');
                     playSound('derp', 0.5).detune = 300;
                     this.addDelay(() => {
                         this.injuries.setFrame('super_dummy_matter3.png');
                         playSound('derp', 0.5).detune = 600;
                     }, 120)
                 } else {
                     playSound('derp', 0.5).detune = 600;
                     this.injuries.setFrame('super_dummy_matter3.png');
                 }
             } else if (this.accumulatedDamageReaction >= 50 && !this.justPlayedInjury2) {
                 this.justPlayedInjury2 = true;
                 if (!this.justPlayedInjury1) {
                     this.justPlayedInjury1 = true;
                     playSound('derp', 0.4);
                     this.injuries.setFrame('super_dummy_matter1.png');
                     this.addDelay(() => {
                         this.injuries.setFrame('super_dummy_matter2.png');
                         playSound('derp', 0.5).detune = 300;
                     }, 120)
                 } else {
                     playSound('derp', 0.5).detune = 300;
                     this.injuries.setFrame('super_dummy_matter2.png');
                 }

             } else if (this.accumulatedDamageReaction >= 20 && !this.justPlayedInjury1) {
                 this.justPlayedInjury1 = true;
                 playSound('derp', 0.4);
                 this.injuries.setFrame('super_dummy_matter1.png');
             }
         }
     }

     setHealth(newHealth) {
         super.setHealth(newHealth);
         let prevHealthPercent = this.prevHealth / this.healthMax;
         let currHealthPercent = this.health / this.healthMax;
         if (currHealthPercent === 0) {
             // dead, can't do anything
             return;
         }
     }


    animateDeathOne() {
         this.addTween({
             targets: this.sprite,
             rotation: -1.31,
             ease: "Cubic.easeIn",
             duration: 1000,
             onComplete: () => {
                 this.isFirstMode = false;
                 playSound('victory_2');
                 this.addTimeout(() => {
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

        if (this.glowEyes) {
            this.glowEyes.visible = false;
        }
        globalObjects.textPopupManager.hideInfoText();


         if (this.currAnim) {
             this.currAnim.stop();
         }
         if (this.injuryTween) {
             this.injuryTween.stop();
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

        if (this.playerSpellBodyTrack) {
            this.playerSpellBodyTrack.unsubscribe();
            this.playerSpellBodyTrack = null;
        }
        globalObjects.textPopupManager.hideInfoText();
        if (this.rune1) {
            this.rune1.destroy();
        }
         if (this.rune2) {
             this.rune2.destroy();
         }
         this.injuries.visible = false;

         if (this.isFirstMode) {
            this.isLoading = true;
             this.y += this.sprite.height * this.sprite.scaleY * 0.49;
             this.sprite.y = this.y;
             this.sprite.setOrigin(0.51, 0.98);
            this.setAsleep();
             this.animateDeathOne();
         } else {
            super.die();
            this.isBuffing = false;
            if (this.buffTween) {
                this.buffTween.stop();
            }
            if (globalObjects.tempBG.currAnim) {
                globalObjects.tempBG.currAnim.stop();
                globalObjects.tempBG.alpha = 0;
            }

            this.dummyLeftArm.visible = false;
            this.dummyRightArm.visible = false;
            this.setSprite('super_dummy_angry.png', this.sprite.startScale);
            this.x += 8;
             this.y += this.sprite.height * this.sprite.scaleY * 0.45;
             this.sprite.y = this.y;
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
                 duration: 1500,
                 onComplete: () => {
                     this.setSprite('super_dummy_broken.png', this.sprite.scaleX);
                     this.sprite.y += 25;
                     this.x -= 70;
                     this.y += 60;
                     this.sprite.setRotation(0);
                     this.sprite.setOrigin(0.85, 0.78);

                     let rune = this.addSprite(this.x, this.y - 85, 'circle', 'bright_rune_mind.png').setOrigin(0.5, 0.15).setScale(0).setDepth(9999).setVisible(false);
                     this.addTween({
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
        let banner = this.addSprite(gameConsts.halfWidth, gameConsts.halfHeight - 40, 'misc', 'victory_banner.png').setScale(100, 1.2).setDepth(9998).setAlpha(0);
        let victoryText = this.addSprite(gameConsts.halfWidth, gameConsts.halfHeight - 40, 'misc', 'victory_text.png').setScale(0.95).setDepth(9998).setAlpha(0);
        let continueText = this.addText(gameConsts.halfWidth, gameConsts.halfHeight + 2, getLangText('cont_ui'), {fontFamily: 'Verdana', color: '#F0F0F0', fontSize: 18}).setAlpha(0).setOrigin(0.5, 0.5).setAlign('center').setDepth(9998);

        this.addTween({
            targets: banner,
            alpha: 0.75,
            duration: 500,
            onComplete: () => {
                let dummyArm = this.addSprite(this.x - 95, this.y - 70, 'dummyenemy', 'super_dummy_rightarm_stretch.png').setScale(0, 0.15).setDepth(0);
                this.addTimeout(() => {
                    playSound('inflate');
                }, 100);
                this.addTween({
                     targets: dummyArm,
                     scaleX: 1,
                     scaleY: 1,
                     ease: 'Back.easeOut',
                     duration: 1000,
                     onComplete: () => {
                        this.addTween({
                             targets: dummyArm,
                             rotation: -1,
                             ease: 'Cubic.easeInOut',
                             duration: 400,
                             onComplete: () => {
                                dummyArm.setFrame('super_dummy_leftarm_fist.png').setRotation(-0.1).setScale(1.08).setDepth(0);
                                this.addTween({
                                     targets: dummyArm,
                                     scaleX: 1,
                                     scaleY: 1,
                                     ease: 'Cubic.easeOut',
                                     duration: 300,
                                     onComplete: () => {
                                        this.addTween({
                                             targets: dummyArm,
                                             rotation: 1.55,
                                             ease: 'Quart.easeIn',
                                             duration: 500,
                                             onComplete: () => {
                                                dummyArm.setFrame('super_dummy_leftarm_fist_large.png').setRotation(1.9).setScale(1.05).setDepth(0);
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
                                                 this.addTween({
                                                     targets: shinePattern,
                                                     scaleX: 0.55,
                                                     scaleY: 0.55,
                                                     duration: 750,
                                                     rotation: 1
                                                 });
                                                 this.addTween({
                                                     targets: shinePattern,
                                                     alpha: 0,
                                                     ease: 'Cubic.easeIn',
                                                     duration: 750,
                                                 });


                                                this.addTween({
                                                    delay: 10,
                                                     targets: dummyArm,
                                                     rotation: 1.1,
                                                     scaleX: 1,
                                                     scaleY: 1,
                                                     ease: 'Quart.easeOut',
                                                     duration: 500,
                                                     completeDelay: 400,
                                                     onComplete: () => {
                                                        this.addTween({
                                                             targets: dummyArm,
                                                             scaleX: 0.4,
                                                             scaleY: 0,
                                                             duration: 400,
                                                             ease: 'Cubic.easeIn',
                                                             onComplete: () => {
                                                                dummyArm.destroy();
                                                                this.addTween({
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

                                                                this.currAnim = this.addTween({
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

         this.addTween({
             targets: [victoryText, continueText],
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
         this.breatheTween = this.addTween({
             targets: this.dummyLeftArm,
             duration: duration,
             rotation: 0.05,
             ease: 'Cubic.easeOut',
             onComplete: () => {
                 this.breatheTween = this.addTween({
                     targets: this.dummyLeftArm,
                     duration: duration,
                     rotation: -0.1 * magnitude,
                     ease: 'Cubic.easeInOut',
                     yoyo: true,
                     repeat: -1
                 });
             }
         });

         this.breatheTween = this.addTween({
             targets: this.dummyRightArm,
             duration: duration,
             rotation: -0.05,
             ease: 'Cubic.easeOut',
             onComplete: () => {
                 this.breatheTween2 = this.addTween({
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

    revive() {
        if (this.isDestroyed) {
            return;
        }
        this.y = this.startY;
        this.sprite.y = this.y;
        this.sprite.setOrigin(0.51, 0.5);

         this.currAnim = this.addTween({
             delay: 100,
             targets: this.sprite,
             scaleX: this.sprite.startScale + 0.2,
             scaleY: this.sprite.startScale + 0.2,
             duration: 600,
             completeDelay: 50,
             ease: 'Quart.easeOut',
             onComplete: () => {
                if (this.isDestroyed) {
                    return;
                }
                 this.currAnim = this.addTween({
                     targets: this.sprite,
                     scaleX: this.sprite.startScale,
                     scaleY: this.sprite.startScale,
                     duration: 400,
                     ease: 'Quart.easeIn',
                     onComplete: () => {
                        if (this.isDestroyed) {
                            return;
                        }
                        this.isLoading = false;
                        this.setMaxHealth(this.secondHealth);
                        this.heal(this.healthMax);
                        this.currentAttackSetIndex = 0;
                        this.nextAttackIndex = 0;
                        this.setAwake();
                        this.loadUpHealthBarSecond();

                        this.bgMusic = playMusic('bite_down_complex', 0.8, true);
                        this.setDefaultSprite('dummy_angry.png', 0.95);
                        this.dummyRightArm = this.addSprite(this.x + 51, this.startY + 30, 'dummyenemy', 'super_dummy_rightarm.png').setScale(this.sprite.startScale * 0.4).setDepth(0).setRotation(0.5);
                        this.dummyLeftArm = this.addSprite(this.x - 51, this.startY + 30, 'dummyenemy', 'super_dummy_leftarm.png').setScale(this.sprite.startScale * 0.4).setDepth(0).setRotation(-0.5);

                         this.injuries.visible = true;
                         this.injuries.y = this.sprite.y;
                         this.injuries.setOrigin(this.sprite.originX, this.sprite.originY);
                         this.injuries.setScale(this.sprite.scaleX);

                         this.addTween({
                             targets: [this.dummyRightArm, this.dummyLeftArm],
                             scaleX: this.sprite.startScale * 0.9,
                             scaleY: this.sprite.startScale * 0.9,
                             ease: 'Back.easeOut',
                             rotation: 0,
                             duration: 700,
                             onComplete: () => {
                                if (this.isDestroyed) {
                                    return;
                                }
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
                         this.addTween({
                             targets: shinePattern,
                             scaleX: this.sprite.startScale + 0.4,
                             scaleY: this.sprite.startScale + 0.4,
                             rotation: "+=0.5",
                             duration: 1000,
                         });
                         this.addTween({
                             targets: shinePattern,
                             alpha: 0,
                             ease: 'Cubic.easeIn',
                             duration: 1000,
                             onComplete: () => {
                                if (this.isDestroyed) {
                                    return;
                                }
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

     createTutSolo(text, rune1Text) {
         globalObjects.textPopupManager.setInfoText(gameConsts.width, gameConsts.halfHeight - 133, text, 'right');
         let runeYPos = globalObjects.textPopupManager.getBoxBottomPos();
         let centerXPos = globalObjects.textPopupManager.getCenterPos();

         if (this.rune1) {
             this.rune1.setFrame(rune1Text).setDepth(globalObjects.textPopupManager.getDepth() + 1).setScale(0.75).setAlpha(0).setPosition(centerXPos, runeYPos + 27);
         } else {
             this.rune1 = this.addSprite(centerXPos, runeYPos + 27, 'circle', rune1Text).setDepth(globalObjects.textPopupManager.getDepth() + 1).setScale(0.8).setAlpha(0);
         }
         this.rune1.visible = true;
         this.addTween({
             targets: [this.rune1],
             alpha: 1,
             duration: 200,
         });
         this.addTween({
             targets: [this.rune1],
             scaleX: 1.1,
             scaleY: 1.1,
             ease: 'Quart.easeOut',
             duration: 600,
             onComplete: () => {
                 this.addTween({
                     targets: [this.rune1],
                     scaleX: 0.85,
                     scaleY: 0.85,
                     ease: 'Back.easeOut',
                     duration: 400,
                 });
             }
         });
         this.playerSpellBodyTrack = messageBus.subscribe('messageAllSpell', (spellId) => {
             if (spellId == 'timeUnload' || spellId == 'mindUnload' || spellId == 'matterUnload' || spellId == 'voidUnload') {
                 this.clearPlayerSpellTrack();
             }
         });
     }

    createTutIcon(text, rune1Text, rune2Text) {
        globalObjects.textPopupManager.setInfoText(gameConsts.width, gameConsts.halfHeight - 133, text, 'right');
        let runeYPos = globalObjects.textPopupManager.getBoxBottomPos();
        let centerXPos = globalObjects.textPopupManager.getCenterPos();

        if (this.rune1) {
            this.rune1.setFrame(rune1Text);
        } else {
            this.rune1 = this.addSprite(centerXPos - 34, runeYPos + 17, 'circle', rune1Text);
        }
        if (this.rune2) {
            this.rune2.setFrame(rune2Text);
        } else {
            this.rune2 = this.addSprite(centerXPos + 34, runeYPos + 17, 'circle', rune2Text);
        }
        this.rune1.setPosition(centerXPos - 34, runeYPos + 17).setAlpha(0).setScale(0.75).setDepth(globalObjects.textPopupManager.getDepth() + 1);
        this.rune2.setPosition(centerXPos + 34, runeYPos + 17).setAlpha(0).setScale(0.75).setDepth(globalObjects.textPopupManager.getDepth() + 1);

        this.rune1.visible = true;
        this.rune2.visible = true;
        this.addTween({
            targets: [this.rune1, this.rune2],
            alpha: 1,
            duration: 200,
        });
        this.addTween({
             targets: [this.rune1, this.rune2],
             scaleX: 1.1,
             scaleY: 1.1,
             ease: 'Quart.easeOut',
             duration: 600,
             onComplete: () => {
                 this.addTween({
                     targets: [this.rune1, this.rune2],
                     scaleX: 0.85,
                     scaleY: 0.85,
                     ease: 'Back.easeOut',
                     duration: 400,
                 });
             }
        });
        this.playerSpellBodyTrack = messageBus.subscribe('messageAllSpell', (spellId) => {
            if (spellId === 'timeUnload' || spellId === 'mindUnload' || spellId === 'matterUnload' || spellId === 'voidUnload') {
                this.clearPlayerSpellTrack();
            }
        });
    }

    clearPlayerSpellTrack() {
        if (this.playerSpellBodyTrack) {
             this.playerSpellBodyTrack.unsubscribe();
             this.playerSpellBodyTrack = null;
             globalObjects.textPopupManager.hideInfoText();
             this.addTween({
                 targets: [this.rune1, this.rune2],
                 alpha: 0,
                 duration: 200,
             });
        }
    }

     initAttacks() {
         this.attacks = [
             [
                 {
                     name: "|6x2",
                     chargeAmt: 425,
                     damage: 6,
                     attackTimes: 2,
                     prepareSprite: 'super_dummy_swinging.png',
                     attackSprites: ['super_dummy_swinging_right.png', 'super_dummy_swinging_left.png'],
                     startFunction: () => {
                         this.pullbackScale = 0.9;
                        this.attackScale = 1.2;
                        this.createTutSolo(getLangText('superdummy_ult'), 'rune_unload_glow.png');
                         if (!this.showTut1) {
                             this.createTutIcon(getLangText('superdummy_void'), 'bright_rune_unload.png', 'bright_rune_void.png')
                         }
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
                     name: "}18",
                     chargeAmt: 500,
                     damage: 18,
                     prepareSprite: 'super_dummy_wide.png',
                     startFunction: () => {
                        this.pullbackScale = 0.8;
                        this.attackScale = 1.3;
                        this.lastAttackLingerMult = 1.25;
                     },
                     attackStartFunction: () => {
                        this.clearPlayerSpellTrack();
                        this.setSprite('super_dummy_wide.png');
                     },
                     attackFinishFunction: () => {
                        this.lastAttackLingerMult = 0.55;
                        this.pullbackScale = 0.9;
                        this.setSprite('dummy_angry.png');
                        this.reEnableArms();
                         let dmgEffect = this.addSprite(gameConsts.halfWidth - 15, globalObjects.player.getY() - 185, 'spells', 'damageEffect3.png').setDepth(998).setScale(1.55);
                         dmgEffect.play('damageEffectShort')
                         this.addTimeout(() => {
                             dmgEffect.x += 30;
                             dmgEffect.y += 10;
                             this.addTimeout(() => {
                                 dmgEffect.destroy();
                             }, 150)
                         }, 75);
                         this.createDoublePunchEffect();

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
                     name: "BUFF UP",
                     chargeAmt: 600,
                     isPassive: true,
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
                     name: "|8x2",
                     chargeAmt: 400,
                     damage: 8,
                     attackTimes: 2,
                     prepareSprite: 'super_dummy_swinging.png',
                     attackSprites: ['super_dummy_swinging_right.png', 'super_dummy_swinging_left.png'],
                     startFunction: () => {
                        this.pullbackScale = 0.9;
                        this.attackScale = 1.2;
                         if (this.showTut1) {
                             this.createTutIcon(getLangText('superdummy_mind'), 'bright_rune_unload.png', 'bright_rune_mind.png')
                         }
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
                     name: "|20",
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
                        this.clearPlayerSpellTrack();
                        this.reEnableArms();
                        this.setSprite('dummy_angry.png');
                        this.disableAnimateShake = true;
                         this.currAnim = this.addTween({
                             targets: [this.sprite],
                             duration: 700,
                             x: gameConsts.halfWidth - 58,
                             ease: 'Cubic.easeOut'
                         });

                         if (this.breatheTween) {
                             this.breatheTween.stop();
                         }
                         if (this.breatheTween2) {
                             this.breatheTween2.stop();
                         }

                        this.dummyRightArm.setScale(1, -1);
                        this.sprite.setDepth(12);
                        this.addTween({
                            targets: this.dummyRightArm,
                            duration: 1100,
                            x: this.x - 5,
                            rotation: -1.2,
                            ease: 'Cubic.easeOut',
                            onComplete: () => {
                                this.tempArmAnim = this.addTween({
                                    targets: this.dummyRightArm,
                                    duration: 50,
                                    rotation: -1.1,
                                    ease: 'Quart.easeOut',
                                    yoyo: true,
                                    repeat: 4
                                });
                            }
                        });
                        this.addTween({
                            targets: this.dummyRightArm,
                            duration: 1400,
                            scaleX: 1.65,
                            scaleY: -1.65,
                            ease: 'Quart.easeOut',
                            onComplete: () => {
                                if (this.tempArmAnim) {
                                    this.tempArmAnim.stop();
                                }
                                this.addTween({
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
                                        this.dummyRightArm.setRotation(3).setScale(-1.33, 1.38).setDepth(200);

                                        messageBus.publish("selfTakeDamage", 20);
                                         let shinePattern = getTempPoolObject('spells', 'brickPattern2.png', 'brickPattern', 800);
                                         shinePattern.setPosition(gameConsts.halfWidth, globalObjects.player.getY() - 220).setScale(0.7).setDepth(9999).setAlpha(1);
                                         this.addTween({
                                             targets: shinePattern,
                                             scaleX: 0.55,
                                             scaleY: 0.55,
                                             duration: 750,
                                             rotation: 1
                                         });
                                         this.addTween({
                                             targets: shinePattern,
                                             alpha: 0,
                                             ease: 'Cubic.easeIn',
                                             duration: 750,
                                         });

                                        this.dummyRightArm.x += 9;
                                        this.addTween({
                                            targets: this.dummyRightArm,
                                            duration: 450,
                                            x: "-=7",
                                            ease: 'Bounce.easeOut',
                                        });

                                        this.addTween({
                                            targets: this.dummyRightArm,
                                            duration: 550,
                                            scaleX: -1.05,
                                            scaleY: 1.05,
                                            ease: 'Quint.easeOut',
                                            onComplete: () => {
                                                this.addTween({
                                                    delay: 400,
                                                    targets: this.dummyRightArm,
                                                    duration: 600,
                                                    scaleX: -0.8,
                                                    scaleY: 0.8,
                                                    rotation: 1.7,
                                                    ease: 'Quart.easeIn',
                                                    onComplete: () => {
                                                        let sfx = playSound('balloon', 0.4);
                                                        sfx.detune = -250
                                                        this.dummyRightArm.setDepth(0);
                                                        this.dummyRightArm.setFrame('super_dummy_rightarm.png');
                                                        this.dummyRightArm.setRotation(0.3);
                                                        this.dummyRightArm.setDepth(0).setScale(1);
                                                         this.currAnim = this.addTween({
                                                             targets: [this.sprite],
                                                             duration: 300,
                                                             x: gameConsts.halfWidth,
                                                             ease: 'Cubic.easeOut',
                                                         });
                                                         this.addTween({
                                                             targets: this.dummyRightArm,
                                                             duration: 300,
                                                             x: gameConsts.halfWidth + 51,
                                                             y: this.startY + 30,
                                                             rotation: 0,
                                                             ease: 'Cubic.easeOut',
                                                             onComplete: () => {
                                                                this.disableAnimateShake = false;
                                                                this.repeatTweenBreathe();
                                                             }
                                                         });
                                                         this.addTween({
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

                         this.addTween({
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
                     isPassive: true,
                     chargeAmt: 600,
                     damage: -1,
                     chargeMult: 2,
                     startFunction: () => {
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
                     name: "|10x2",
                     chargeAmt: 425,
                     damage: 10,
                     attackTimes: 2,
                     prepareSprite: 'super_dummy_swinging.png',
                     attackSprites: ['super_dummy_swinging_right.png', 'super_dummy_swinging_left.png'],
                     startFunction: () => {
                         if (!this.showTut1) {
                             this.createTutIcon(getLangText('superdummy_matter'), 'bright_rune_unload.png', 'bright_rune_matter.png')
                         }
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
                     name: ";8x4",
                     chargeAmt: 500,
                     damage: -1,
                    finishDelay: 3300,
                     isBigMove: true,
                     startFunction: () => {
                        this.pullbackScale = 0.99;
                        this.pullbackDurMult = 0;
                        this.attackScale = 1.01;
                        this.lastAttackLingerMult = 1.25;
                     },
                     attackStartFunction: () => {
                        playSound('balloon');
                        this.reEnableArms();
                        this.setSprite('dummy_angry.png');
                        this.disableAnimateShake = true;

                         if (this.breatheTween) {
                             this.breatheTween.stop();
                         }
                         if (this.breatheTween2) {
                             this.breatheTween2.stop();
                         }

                        this.dummyLeftArm.setScale(1, -1).setDepth(11);
                        this.dummyRightArm.setScale(1, -1).setDepth(11);
                        this.sprite.setDepth(12);
                        this.addTween({
                            targets: this.dummyRightArm,
                            duration: 1100,

                             scaleX: 1.3,
                             scaleY: -1.3,
                            rotation: -1,
                            ease: 'Cubic.easeOut',
                        });
                        this.addTween({
                            targets: this.dummyLeftArm,
                            duration: 1100,

                             scaleX: 1.3,
                             scaleY: -1.3,
                            rotation: 1,
                            ease: 'Cubic.easeOut',
                            onComplete: () => {
                                this.rightPummel(8, 4);
                            }
                        });
                     },
                     finaleFunction: () => {
                        this.pullbackDurMult = 1;
                        this.pullbackScale = 0.8;
                        this.attackScale = 1.2;
                        this.lastAttackLingerMult = 0.55;
                     }
                 },
                 {
                     name: "T-POSE",
                     chargeAmt: 425,
                     damage: -1,
                     chargeMult: 2,
                     startFunction: () => {
                        this.pullbackDurMult = 0;
                        this.pullbackScale = 0.9;
                        this.attackScale = 1;
                     },
                     attackStartFunction: () => {
                        this.setSprite('super_dummy_angry.png');
                     },
                     attackFinishFunction: () => {
                        this.setSprite('dummy_angry.png');
                        this.reEnableArms();

                        if (this.breatheTween) {
                             this.breatheTween.stop();
                         }
                         if (this.breatheTween2) {
                             this.breatheTween2.stop();
                         }
                        this.pullbackScale = 1;
                        this.attackScale = 1.01;
                        playSound('inflate');
                        this.addTween({
                             targets: this.dummyLeftArm,
                             rotation: 0.7,
                             duration: 600,
                             ease: 'Quart.easeOut',
                        });
                        this.addTween({
                             targets: this.dummyRightArm,
                             rotation: -0.7,
                             duration: 600,
                             ease: 'Quart.easeOut',
                             onComplete: () => {
                                this.addTween({
                                     targets: this.dummyLeftArm,
                                     rotation: -0.15,
                                     duration: 500,
                                     ease: 'Quart.easeIn',
                                });
                                this.addTween({
                                     targets: this.dummyRightArm,
                                     rotation: 0.15,
                                     duration: 500,
                                     ease: 'Quart.easeIn',
                                     onComplete: () => {
                                        this.dummyLeftArm.setFrame('super_dummy_leftarm_stretch_straight.png').setScale(1.3, 1.2).setRotation(0);
                                        this.dummyRightArm.setFrame('super_dummy_rightarm_stretch_straight.png').setScale(1.3, 1.2).setRotation(0);
                                        playSound('balloon', 0.15).detune = -500;
                                        this.addTimeout(() => {
                                            playSound('balloon', 0.9);
                                        }, 110)

                                        this.addTween({
                                             targets: [this.dummyLeftArm, this.dummyRightArm],
                                             scaleX: 1,
                                             scaleY: 1,
                                             easeParams: [5],
                                             duration: 200,
                                             ease: 'Back.easeIn',
                                             onComplete: () => {
                                                this.dummyLeftArm.visible = false;
                                                this.dummyRightArm.visible = false;
                                                this.setDefaultSprite('super_dummy_tpose.png', 0.75, false);
                                                this.sprite.setOrigin(0.503, 0.5);
                                             }
                                        });
                                     }
                                });
                             }
                        });
                    },
                 },
                 {
                     name: ";7x8;",
                     chargeAmt: 700,
                    finishDelay: 6000,
                     damage: -1,
                     isBigMove: true,
                     chargeMult: 2,
                     startFunction: () => {
                         if (this.showTut1) {
                             this.createTutIcon(getLangText('superdummy_time'), 'bright_rune_unload.png', 'bright_rune_time.png')
                         }
                        this.pullbackDurMult = 0;
                        this.disableAnimateShake = true;
                        globalObjects.tempBG.setDepth(0).setVisible(true);
                        fadeAwaySound(this.bgMusic, 6000);
                        globalObjects.tempBG.currAnim = this.addTween({
                             targets: globalObjects.tempBG,
                             alpha: 0.4,
                             duration: 10000,
                        });
                     },
                     attackStartFunction: () => {
                        this.clearPlayerSpellTrack();
                        PhaserScene.sound.pauseOnBlur = false;
                        if (globalObjects.tempBG.currAnim) {
                            globalObjects.tempBG.currAnim.stop();
                        }
                        this.bgMusic.stop();
                        globalObjects.tempBG.currAnim = this.addTween({
                             targets: globalObjects.tempBG,
                             alpha: 0.3,
                             ease: 'Quad.easeOut',
                             duration: 200,
                             onComplete: () => {
                                globalObjects.tempBG.currAnim = this.addTween({
                                     targets: globalObjects.tempBG,
                                     alpha: 0.85,
                                     duration: 5000,
                                });
                             }
                        });
                        globalObjects.tempBG.setDepth(90)
                        this.sprite.setDepth(200);
                        let zoomSound = playSound('zoomin');

                        this.glowEyes = this.addSprite(0, 0, 'dummyenemy', 'scary_eyes.png');
                        this.glowEyes.setOrigin(this.sprite.originX, this.sprite.originY).setPosition(this.sprite.x, this.sprite.y + 2).setAlpha(-0.1).setDepth(200).setScale(0.8);
                        this.currAnim = this.addTween({
                             targets: [this.glowEyes, this.sprite],
                             scaleX: 1.35,
                             scaleY: 1.35,
                             duration: 5200,
                             depth: 200,
                             alpha: 2.5,
                             ease: 'Quad.easeIn',
                             onComplete: () => {
                                this.currAnim = this.addTween({
                                     targets: [this.glowEyes, this.sprite],
                                     rotation: "+=100",
                                     duration: 1000,
                                     ease: 'Cubic.easeIn',
                                     onComplete: () => {
                                        zoomSound.stop();
                                        this.glowEyes.visible = false;
                                        this.setDefaultSprite('dummy_tired.png', 0.95, false);
                                        this.sprite.setRotation(0);
                                        this.reEnableArms();
                                        this.dummyLeftArm.setFrame('super_dummy_leftarm.png')
                                        this.dummyRightArm.setFrame('super_dummy_rightarm.png')
                                        globalObjects.tempBG.alpha = 0;
                                        PhaserScene.sound.pauseOnBlur = true;
                                        this.disableAnimateShake = false;
                                        this.repeatTweenBreathe();
                                     }
                                });
                                this.addTimeoutIfAlive(() => {
                                    for (let i = 0; i < 8; i++) {
                                        let delay = i * 90;
                                        this.addTimeoutIfAlive(() => {
                                            playSound('punch');
                                             let powEffect = getTempPoolObject('spells', 'damageEffect3.png', 'damageEffect3', 200);
                                            powEffect.play('damageEffectShort')
                                             let xPosOffset = Math.random() * 80;
                                             let yPosOffset = Math.abs(xPosOffset * 0.2) + Math.random() * 30;
                                             powEffect.setPosition(gameConsts.halfWidth - xPosOffset, globalObjects.player.getY() - 205 + yPosOffset).setDepth(999).setScale(1).setAlpha(1).setRotation(Math.random() - 0.5);

                                            this.addTimeoutIfAlive(() => {
                                                playSound('punch2');
                                                 let powEffect2 = getTempPoolObject('spells', 'damageEffect3.png', 'damageEffect3', 200);
                                                powEffect2.play('damageEffectShort')

                                                 let xPosOffset2 = Math.random() * 80;
                                                 let yPosOffset2 = Math.abs(xPosOffset * 0.2) + Math.random() * 30;
                                                 powEffect.setPosition(gameConsts.halfWidth + xPosOffset2, globalObjects.player.getY() - 200 + yPosOffset2).setDepth(999).setScale(1).setAlpha(1).setRotation(Math.random() - 0.5);

                                            }, 45)
                                            messageBus.publish("selfTakeDamage", 7);
                                        }, delay)
                                    }

                                }, 250)
                             }
                        });
                     },
                     finaleFunction: () => {
                        this.pullbackDurMult = 1;
                         this.currentAttackSetIndex = 1;
                         this.nextAttackIndex = 0;
                        this.pullbackScale = 0.9;
                        this.attackScale = 1.1;
                     }
                 },

             ],
            [
                 {
                     name: "}10x1",
                     chargeAmt: 400,
                     damage: 10,
                     attackTimes: 1,
                     prepareSprite: 'super_dummy_swinging.png',
                     attackSprites: ['super_dummy_swinging_right.png', 'super_dummy_swinging_left.png'],
                    attackFinishFunction: () => {
                        this.createPunchEffect();
                    },
                    finaleFunction: () => {
                        this.setSprite('dummy_tired.png');
                        this.reEnableArms();
                    }
                 },
                 {
                     name: "|8x2",
                     chargeAmt: 500,
                     damage: -1,
                    finishDelay: 2300,
                     startFunction: () => {
                        this.pullbackScale = 0.99;
                        this.pullbackDurMult = 0;
                        this.attackScale = 1.01;
                        this.lastAttackLingerMult = 1.25;
                     },
                     attackStartFunction: () => {
                        playSound('balloon');
                        this.reEnableArms();
                        this.setSprite('dummy_angry.png');
                        this.disableAnimateShake = true;

                         if (this.breatheTween) {
                             this.breatheTween.stop();
                         }
                         if (this.breatheTween2) {
                             this.breatheTween2.stop();
                         }

                        this.dummyLeftArm.setScale(1, -1).setDepth(11);
                        this.dummyRightArm.setScale(1, -1).setDepth(11);
                        this.sprite.setDepth(12);
                        this.addTween({
                            targets: this.dummyRightArm,
                            duration: 1100,

                             scaleX: 1.3,
                             scaleY: -1.3,
                            rotation: -1,
                            ease: 'Cubic.easeOut',
                        });
                        this.addTween({
                            targets: this.dummyLeftArm,
                            duration: 1100,

                             scaleX: 1.3,
                             scaleY: -1.3,
                            rotation: 1,
                            ease: 'Cubic.easeOut',
                            onComplete: () => {
                                this.rightPummel(8, 2);
                            }
                        });
                     },
                     finaleFunction: () => {
                        this.setSprite('dummy_tired.png');
                        this.pullbackDurMult = 1;
                        this.pullbackScale = 0.8;
                        this.attackScale = 1.2;
                        this.lastAttackLingerMult = 0.55;
                     }
                 },

                ]
         ];
     }

    buffUp() {
        if (this.isBuffing) {
            this.injuries.setFrame('super_dummy_matter0.png');

            if (this.latestAngrySymbol2) {
                this.latestAngrySymbol2.visible = false;
            }
            if (this.latestAngrySymbol) {
                this.latestAngrySymbol.visible = false;
            }

            let buffDur = this.isAngry ? 250 : 500;
            if (this.buffFast) {
                buffDur = buffDur * 0.25 + 140;
            }
            let buffMult = this.buffFast ? 0.4 : 1;
            this.buffTween = this.addTween({
                 targets: this.sprite,
                 scaleY: 0.9,
                 duration: buffDur,
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
                completeDelay: buffDur,
                 onComplete: () => {
                    this.buffUp();
                 }
             });
        }
    }

     createPunchEffect() {
        let isSwingingLeft = this.sprite.attackNum % 2 == 0;
        playSound(isSwingingLeft ? 'punch' : 'punch2');
         let powEffect = getTempPoolObject('spells', 'damageEffect3.png', 'damageEffect3', 175);
         powEffect.play('damageEffectShort')
         let xOffset = isSwingingLeft ? -30 : 30;
         powEffect.setPosition(gameConsts.halfWidth + xOffset, globalObjects.player.getY() - 180).setDepth(998).setScale(1.5);

         let fistEffect = getTempPoolObject('dummyenemy', 'super_dummy_fist.png', 'dummyfist', 250);
         let xOffset2 = isSwingingLeft ? -80 : 80;
         let leftMult = isSwingingLeft ? 1 : -1;
         fistEffect.setPosition(this.sprite.x + xOffset2, this.y - 8).setDepth(11).setScale(1.6 * leftMult, 1.6);
         this.addTween({
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
         this.addTween({
            targets: starEffect,
            duration: 250,
            scaleX: 1.35 * leftMult,
            scaleY: 1.35,
            ease: 'Cubic.easeOut'
         })
         this.addTween({
            targets: starEffect,
            duration: 250,
            alpha: 0,
         })
     }

    rightPummel(damage, times = 1) {
        if (times <= 0) {
            return;
        }

        this.addTween({
            targets: this.dummyRightArm,
            duration: 200,
            scaleX: 1.65,
            scaleY: -1.65,
            rotation: 0.6,
            ease: 'Quart.easeIn',
            onComplete: () => {
                this.dummyRightArm.setFrame('super_dummy_leftarm_fist_large.png');
                this.dummyRightArm.setRotation(3.2).setScale(-1.1, 1.2).setDepth(200);
                playSound('punch');
                zoomTemp(1.02);
                messageBus.publish("selfTakeDamage", damage);
                let shinePattern = getTempPoolObject('spells', 'brickPattern2.png', 'brickPattern', 800);
                shinePattern.setPosition(gameConsts.halfWidth + 25, globalObjects.player.getY() - 220).setScale(0.55).setDepth(9999).setAlpha(1);
                this.addTween({
                    targets: shinePattern,
                    scaleX: 0.45,
                    scaleY: 0.45,
                    duration: 500,
                });
                this.addTween({
                    targets: shinePattern,
                    alpha: 0,
                    ease: 'Cubic.easeIn',
                    duration: 500,
                });


                this.addTween({
                    targets: this.dummyRightArm,
                    duration: 200,
                    scaleX: -1,
                    scaleY: 1.05,
                    ease: 'Quart.easeOut',
                    onComplete: () => {
                        this.leftPummel(damage, times - 1);
                        this.addTween({
                            targets: this.dummyRightArm,
                            duration: 150,
                            scaleX: -0.95,
                            scaleY: 0.9,
                            ease: 'Quart.easeIn',
                            onComplete: () => {
                                this.dummyRightArm.setFrame('super_dummy_rightarm.png');
                                this.dummyRightArm.setRotation(0.6).setScale(1.4, -1.4).setDepth(200);
                                this.addTween({
                                    targets: this.dummyRightArm,
                                    duration: 400,
                                    rotation: -0.75,
                                    scaleX: 1.2,
                                    scaleY: -1.2,
                                    ease: 'Quint.easeOut',
                                    onComplete: () => {
                                        this.rightPummel(damage, times - 2);
                                    }
                                });
                            }
                        });


                    }
                });
            }
        });
    }

    leftPummel(damage, times = 1) {
        if (times <= 0) {
            return;
        }

        this.addTween({
            targets: this.dummyLeftArm,
            duration: 200,
            scaleX: 1.65,
            scaleY: -1.65,
            rotation: -0.6,
            ease: 'Quart.easeIn',
            onComplete: () => {
                this.dummyLeftArm.setFrame('super_dummy_leftarm_fist_large.png');
                this.dummyLeftArm.setRotation(-3.2).setScale(1.1, 1.2).setDepth(200);
                playSound('punch');
                zoomTemp(1.02);
                messageBus.publish("selfTakeDamage", damage);
                let shinePattern = getTempPoolObject('spells', 'brickPattern2.png', 'brickPattern', 800);
                shinePattern.setPosition(gameConsts.halfWidth - 25, globalObjects.player.getY() - 220).setScale(0.55).setDepth(9999).setAlpha(1);
                this.addTween({
                    targets: shinePattern,
                    scaleX: 0.45,
                    scaleY: 0.45,
                    duration: 500,
                });
                this.addTween({
                    targets: shinePattern,
                    alpha: 0,
                    ease: 'Cubic.easeIn',
                    duration: 500,
                });


                this.addTween({
                    targets: this.dummyLeftArm,
                    duration: 200,
                    scaleX: 1,
                    scaleY: 1.05,
                    ease: 'Quart.easeOut',
                    onComplete: () => {
                        this.addTween({
                            targets: this.dummyLeftArm,
                            duration: 150,
                            scaleX: 0.95,
                            scaleY: 0.9,
                            ease: 'Quart.easeIn',
                            onComplete: () => {
                                this.dummyLeftArm.setFrame('super_dummy_leftarm.png');
                                this.dummyLeftArm.setRotation(-0.6).setScale(1.4, -1.4).setDepth(200);
                                this.addTween({
                                    targets: this.dummyLeftArm,
                                    duration: 400,
                                    rotation: 0.75,
                                    scaleX: 1.2,
                                    scaleY: -1.2,
                                    ease: 'Quint.easeOut',
                                    onComplete: () => {
                                        if (times == 1) {
                                            this.dummyRightArm.setDepth(0).setScale(1.1);
                                            this.dummyLeftArm.setDepth(0).setScale(1.1);
                                            this.repeatTweenBreathe()
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
        this.addTween({
            targets: arm,
            duration: 600,
            ease: 'Quart.easeOut',
            scaleX: oldScale,
            scaleY: oldScale,
            rotation: -0.5 * rotMult,
            onComplete: () => {
                this.addTween({
                    targets: arm,
                    duration: 50,
                    ease: 'Quint.easeOut',
                    rotation: -0.54 * rotMult,
                    yoyo: true,
                    repeat: 2,
                    onComplete: () => {
                        this.addTween({
                            targets: arm,
                            duration: 500,
                            ease: 'Quart.easeIn',
                            rotation: 0.1 * rotMult,
                            scaleX: oldScale - 0.25,
                            scaleY: oldScale - 0.25,
                            onComplete: () => {
                                arm.setFrame(rotMult == 1 ? 'super_dummy_leftarm.png' : 'super_dummy_rightarm.png');
                                arm.setRotation(-0.05 * rotMult).setScale(oldScale);
                                this.addTween({
                                    targets: arm,
                                    duration: 300,
                                    ease: 'Quint.easeOut',
                                    scaleX: oldScale + 0.4,
                                    scaleY: oldScale + 0.4,
                                    rotation: 0.1 * rotMult,
                                    onComplete: () => {
                                        this.addTween({
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
                                 this.addTween({
                                     targets: shinePattern,
                                     scaleX: 1.4,
                                     scaleY: 1.4,
                                     duration: 750,
                                     rotation: 1
                                 });
                                 this.addTween({
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
        // this.addTween({
        //     targets: arm,
        //     duration: 400,
        //     ease: 'Quint.easeOut',
        //     scaleX: oldScale - 0.05,
        //     scaleY: oldScale - 0.05,
        //     rotation: 0.3 * rotMult,
        //     onComplete: () => {
        //         this.addTween({
        //             targets: arm,
        //             duration: 600,
        //             ease: 'Quint.easeIn',
        //             scaleX: oldScale + 0.3,
        //             scaleY: oldScale + 0.3,
        //             rotation: -0.5 * rotMult,
        //             onComplete: () => {
        //                 arm.setScale(oldScale + 0.65);
        //                 this.addTween({
        //                     targets: arm,
        //                     duration: 300,
        //                     ease: 'Back.easeIn',
        //                     scaleX: oldScale + 0.1,
        //                     scaleY: oldScale + 0.1,
        //                     rotation: -0.4 * rotMult,
        //                     onComplete: () => {
        //                         this.addTween({
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

    destroy() {
        super.destroy();
        if (this.playerSpellBodyTrack) {
            this.playerSpellBodyTrack.unsubscribe();
            this.playerSpellBodyTrack = null;
        }
    }

     createDoublePunchEffect() {
        playSound('punch');
        this.addTimeout(() => {
            playSound('punch2');
        }, 70)
         let powEffect = getTempPoolObject('spells', 'damageEffect3.png', 'damageEffect3', 175);
        powEffect.play('damageEffectShort');
         powEffect.setPosition(gameConsts.halfWidth, globalObjects.player.getY() - 180).setDepth(998).setScale(1.75);

         let fistEffect = getTempPoolObject('dummyenemy', 'super_dummy_fist.png', 'dummyfist', 250);
         let fistEffect2 = getTempPoolObject('dummyenemy', 'super_dummy_fist.png', 'dummyfist', 250);
         fistEffect.setPosition(this.sprite.x - 110, this.y - 8).setDepth(11).setScale(1.45, 1.45);
         fistEffect2.setPosition(this.sprite.x + 110, this.y - 8).setDepth(11).setScale(-1.45, 1.45);
         this.addTween({
            targets: fistEffect,
            duration: 250,
            y: '-=5',
            scaleX: 1.25,
            scaleY: 1.25,
            ease: 'Back.easeIn'
         })
         this.addTween({
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
         // this.addTween({
         //    targets: starEffect,
         //    duration: 250,
         //    scaleX: 1.35 * leftMult,
         //    scaleY: 1.35,
         //    ease: 'Cubic.easeOut'
         // })
         // this.addTween({
         //    targets: starEffect,
         //    duration: 250,
         //    alpha: 0,
         // })
     }
}
