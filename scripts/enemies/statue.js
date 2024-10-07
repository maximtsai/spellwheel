 class Statue extends Enemy {
    constructor(scene, x, y, level) {
        super(scene, x, y, level);
        this.initSprite('palm.png', 0.96, 0, 0);
        this.sprite.startScale = 0.96;
        this.defaultRotation = -0.045;
        this.sprite.setAlpha(0.2)
        this.initMisc();
        globalObjects.encyclopedia.showButton();
        globalObjects.options.showButton();
        this.addTimeout(() => {
            this.initTutorial();
        }, 10)
    }

     initSpriteAnim(scale) {
         this.sprite.y -= 23;
         this.sprite.setRotation(0).setScale(0.96 * 0.9);
         this.addTween({
             targets: this.sprite,
             alpha: 0.965,
             duration: 300,
             ease: 'Quad.easeOut',
         })
         this.addTween({
             targets: this.sprite,
             y: "+=23",
             scaleX: 0.96,
             scaleY: 0.96,
             duration: 250,
             ease: 'Cubic.easeIn',
             onComplete: () => {
                 let stompSound = playSound('stomp', 0.4);
                 stompSound.detune = -400;
                 this.addTween({
                     targets: this.sprite,
                     rotation: this.defaultRotation,
                     duration: 100,
                     ease: 'Cubic.easeOut',
                 })
             }
         })
     }

     initStatsCustom() {
         this.health = gameVars.isHardMode ? 333 : 300;
         this.isAsleep = true;
         this.attackScale = 1;
         this.pullbackScale = 1;
         this.damageCanEmit = true;
         this.shieldAmts = 0;
         this.shieldTextFont = "void";
         this.shieldTextOffsetY = -95;
     }

     initTutorial() {
         this.bgMusic = playMusic('wind', 0.01, true);
         fadeInSound(this.bgMusic, 0.7, 2000);
    }

    initMisc() {
        this.shieldExtraText = this.scene.add.bitmapText(gameConsts.halfWidth, this.y + this.shieldTextOffsetY + 24, 'void', 'SHIELDED', 52).setOrigin(0.5).setDepth(18).setVisible(false);

        this.handShieldBack = this.addImage(this.x + 4, this.y - 84, 'blurry', 'handshield_back.png').setScale(2).setDepth(-1).setAlpha(0);
        this.handShieldBack.startScale = this.handShieldBack.scaleX;
        this.handShield = this.addSprite(this.x + 4, this.y - 84, 'shields', 'handshield3.png').setScale(3).setDepth(3).setAlpha(0);
        this.handShield.startScale = this.handShield.scaleX;
        this.statueSubscribe = messageBus.subscribe('lift_statue', () => {
            this.statueSubscribe.unsubscribe();
            this.addTween({
                targets: this.sprite,
                rotation: 0,
                y: "-=7",
                ease: 'Back.easeOut',
                duration: 400,
                completeDelay: 400,
                onComplete: () => {
                    this.addTween({
                        targets: this.sprite,
                        alpha: 0,
                        y: "-=200",
                        ease: 'Cubic.easeIn',
                        duration: 1500,
                    })
                }
            })
        });
    }


    showTimeStrike() {
        this.addDelay(() => {
            globalObjects.textPopupManager.setInfoText(gameConsts.width, gameConsts.halfHeight - 70, getLangText("time_strike_info"), 'right');
            let runeYPos = globalObjects.textPopupManager.getBoxBottomPos();
            let centerXPos = globalObjects.textPopupManager.getCenterPos();
            let runeDepth = globalObjects.bannerTextManager.getDepth() + 1;
            this.rune3 = this.addImage(centerXPos - 32, runeYPos + 27, 'circle', 'rune_time_glow.png').setDepth(runeDepth).setScale(0.78, 0.78).setAlpha(0);
            this.rune4 = this.addImage(centerXPos + 34, runeYPos + 27, 'circle', 'rune_strike_glow.png').setDepth(runeDepth).setScale(0.78, 0.78).setAlpha(0);
            this.addTween({
                targets: [this.rune3, this.rune4],
                scaleX: 1,
                scaleY: 1,
                ease: 'Quart.easeOut',
                duration: 500,
                onComplete: () => {
                    this.addTween({
                        targets: [this.rune3, this.rune4],
                        scaleX: 0.8,
                        scaleY: 0.8,
                        ease: 'Back.easeOut',
                        duration: 300,
                    });
                }
            });
            this.addTween({
                targets: [this.rune3, this.rune4],
                alpha: 1,
                duration: 200,
                completeDelay: 1000,
                onComplete: () => {
                    this.playerSpellCastSub = messageBus.subscribe('playerCastedSpell', () => {
                        this.playerSpellCastSub.unsubscribe();
                        this.addTimeout(() => {
                            this.addTween({
                                targets: [this.rune3, this.rune4],
                                alpha: 0,
                                duration: 300,
                                onComplete: () => {
                                    this.rune3.visible = false;
                                    this.rune4.visible = false;
                                }
                            });
                            globalObjects.textPopupManager.hideInfoText();
                        }, 300);
                    });
                }
            });
        }, 700)
    }

     shakeShieldText() {
         if (this.shieldAmts <= 0) {
             this.shieldText.visible = false;
         }
         this.shieldText.setAlpha(1);
         this.shieldText.setText(this.shieldAmts);
         let startLeft = Math.random() < 0.5;
         this.scene.tweens.add({
             targets: this.shieldText,
             scaleX: this.shieldText.startScale + 1,
             scaleY: this.shieldText.startScale + 1,
             y: "-=3",
             x: startLeft ? "-=6" : "+=6",
             duration: gameVars.gameManualSlowSpeedInverse * 60,
             ease: 'Quint.easeOut',
             onComplete: () => {
                 this.scene.tweens.add({
                     targets: this.shieldText,
                     scaleX: this.shieldText.startScale,
                     scaleY: this.shieldText.startScale,
                     y: "+=3",
                     duration: gameVars.gameManualSlowSpeedInverse * 500,
                     ease: 'Quart.easeOut',
                 });
                 this.scene.tweens.add({
                     targets: this.shieldText,
                     x: startLeft ? "+=13" : "-=13",
                     duration: gameVars.gameManualSlowSpeedInverse * 100,
                     ease: 'Quint.easeInOut',
                     onComplete: () => {
                         this.shieldText.setDepth(8);
                         this.scene.tweens.add({
                             targets: this.shieldText,
                             x: this.shieldText.startX,
                             duration: gameVars.gameManualSlowSpeedInverse * 400,
                             ease: 'Bounce.easeOut',
                         });
                         this.scene.tweens.add({
                             delay: 1000,
                             targets: this.shieldText,
                             alpha: 0.75,
                             duration: 1500,
                         });
                     }
                 });
             }
         });
     }

     damageHandShield() {
         this.shieldAmts--;
         this.shakeShieldText();

         if (this.shieldAmts <= 0) {
             messageBus.publish('animateBlockNum', gameConsts.halfWidth, this.sprite.y + 50, '-BROKE-', 1.2, {y: "+=5", ease: 'Quart.easeOut'}, {alpha: 0, scaleX: 1.25, scaleY: 1.25, ease: 'Back.easeOut'});
             this.clearHandShield(true);
         } else {
            if (this.shieldAmts == 4 || (this.canShowEarlyInfo && this.shieldAmts <= 7)) {
                if (!this.shownInfo) {
                    this.shownInfo = true;
                    globalObjects.bannerTextManager.setDialog([getLangText('statue_info_a'), getLangText('statue_info_b')]);
                    globalObjects.bannerTextManager.setPosition(gameConsts.halfWidth, gameConsts.height - 130, 0);
                    globalObjects.bannerTextManager.showBanner(0.5);
                    globalObjects.bannerTextManager.setOnFinishFunc(() => {
                        this.showTimeStrike();
                    });
                }
            }
            let extraHoldLength = this.shieldAmts >= 9 ? 400 : 200;
             messageBus.publish('animateBlockNum', gameConsts.halfWidth + 75 - Math.random() * 150, this.sprite.y - 20 - Math.random() * 90, 'NEGATED', 1.02, {alpha: 0.95, completeDelay: extraHoldLength}, {alpha: 0});
             this.handShield.setAlpha(1);
             this.handShield.play('handShieldFast');
             this.addTween({
                 targets: [this.handShieldBack],
                 alpha: 0.9,
                 duration: 500,
             });
             this.handShield.setScale(this.handShield.startScale);
             this.handShield.once('animationcomplete', () => {
                 if (this.shieldAmts <= 2) {
                     this.handShield.setFrame('handshieldbroke.png');
                     this.handShield.setScale(this.handShield.startScale * 1.6/3);
                 } else {
                     this.handShield.setFrame('handshield10.png');
                     this.handShield.setScale(this.handShield.startScale * 0.333);
                 }
             });
             this.handShieldBack.setAlpha(0.6);
             this.addTween({
                 targets: [this.handShieldBack],
                 alpha: 0.35,
                 duration: 500,
             });
         }
         this.shieldText.setText(this.shieldAmts);
     }

     handleSpecialDamageAbsorption(amt) {
         return 0;
     }


     setHealth(newHealth, isTrue) {
         if (this.shieldAmts > 0 && !isTrue) {
             this.damageHandShield();
             super.setHealth(this.health);
             return;
         } else {
             super.setHealth(newHealth);
         }

         let prevHealthPercent = this.prevHealth / this.healthMax;
         let currHealthPercent = this.health / this.healthMax;
         if (currHealthPercent == 0) {
             // dead, can't do anything
             return;
         } else if (currHealthPercent <= 0.95 && !this.gainedShield) {
             this.gainedShield = true;
             this.flash = this.addSprite(this.x + 3, this.y - 75, 'blurry', 'flash.webp').setOrigin(0.5, 0.5).setScale(0.8).setDepth(-1).setRotation(0.2);
             this.addTween({
                 targets: this.flash,
                 scaleX: this.sprite.startScale * 3.5,
                 scaleY: this.sprite.startScale * 0.05,
                 duration: 300,
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
             this.setAwake();
         }
     }

     animateCreateHandShield() {
        // this.handShield.setScale(this.handShield.startScale * 1.5);
        // this.addTween({
        //     targets: this.handShield,
        //     scaleX: this.handShield.startScale,
        //     scaleY: this.handShield.startScale,
        //     duration: 800,
        //     ease: 'Quad.easeInOut'
        // })
         this.handShieldTemp = this.addSprite(this.x - 3, this.y - 72, 'deathfinal', 'palm_glow.png').setScale(this.sprite.startScale * 1.355).setDepth(3).setAlpha(0).setRotation(this.defaultRotation).setOrigin(0.5, 0.373);
         this.handShieldTemp.startScale = this.handShieldTemp.scaleX;

         this.handShieldTemp.currAnim = this.addTween({
             targets: this.handShieldTemp,
             alpha: 0.9,
             duration: 2000,
         });
         // playFakeBGMusic('but_never_forgotten_metal_prelude');
         this.addDelayIfAlive(() => {
             playSound('ringknell')
             this.secondTempShield = this.addSprite(this.handShieldTemp.x + 5, this.handShieldTemp.y + 99, 'deathfinal', 'palm_glow.png').setScale(this.handShieldTemp.startScale * 1.2, this.handShieldTemp.startScale * 1.15).setDepth(3).setAlpha(0).setRotation(this.defaultRotation).setOrigin(0.5, 0.55);

             this.addTween({
                 targets: this.secondTempShield,
                 alpha: 0.8,
                 duration: 660,
                 ease: 'Cubic.easeOut',
             })
             this.addTween({
                 targets: this.secondTempShield,
                 scaleX: this.handShieldTemp.startScale * 1.8,
                 scaleY: this.handShieldTemp.startScale * 1.7,
                 duration: 400,
                 ease: 'Quart.easeOut',
                 onComplete: () => {
                     this.addTween({
                         targets: this.secondTempShield,
                         scaleX: this.handShieldTemp.scaleX,
                         scaleY: this.handShieldTemp.scaleX,
                         duration: 280,
                         ease: 'Quint.easeIn',
                         onComplete: () => {
                             screenShake(7);
                             playSound('stomp', 0.85);
                             playSound('rock_crumble', 0.35)
                             this.handShieldTemp.currAnim.stop();
                             this.handShieldTemp.alpha = 1;
                             this.createHandShield(10);

                             this.addTween({
                                 delay: 400,
                                 targets: [this.handShieldTemp, this.secondTempShield],
                                 alpha: 0,
                                 duration: 1300,
                                 ease: 'Quart.easeOut',
                                 onComplete: () => {
                                     this.secondTempShield.destroy();
                                 }
                             })
                         }
                     })
                 }
             });
         }, 1300)
     }

     createHandShield(amt) {
         this.shieldExtraText.setVisible(true).setScale(0.4).setAlpha(1);
         this.addTween({
             targets: this.shieldExtraText,
             scaleX: 1,
             scaleY: 1,
             ease: 'Back.easeOut',
             duration: 150,
             completeDelay: 1800,
             onComplete: () => {
                 this.addTween({
                     targets: this.shieldExtraText,
                     scaleX: 0.2,
                     scaleY: 0.25,
                     alpha: 0,
                     ease: 'Quart.easeIn',
                     duration: 400,
                 })
             }
         })
         let darkBG = getBackgroundBlackout();
         darkBG.setDepth(-3).setAlpha(0.45);
         let spaceBG = this.addImage(gameConsts.halfWidth, gameConsts.halfHeight, 'backgrounds', 'star.png').setDepth(-3).setAlpha(0.6);
         this.scene.tweens.add({
             targets: [spaceBG, darkBG],
             alpha: 0,
             ease: 'Cubic.easeOut',
             duration: 2500,
             completeDelay: 750,
             onComplete: () => {
                this.canShowEarlyInfo = true;
             }
         });
         this.addDelayIfAlive(() => {
             this.shieldSettedUp = true;
             this.bgMusic = playMusic('but_never_forgotten', 0.7, true);
         }, 800)

         // let fakeMusic = playFakeBGMusic('but_never_forgotten_epicchoir');
         // this.addTimeout(() => {
         //     console.log('fade away');
         //     fadeAwaySound(fakeMusic, 1000)
         // }, 2000);

         this.shieldText.visible = true;
         this.shieldText.setText(amt);
         this.shieldText.setScale(0.1);
         this.shieldText.startX = this.shieldText.x;
         this.shieldText.startScale = 0.82;
         this.scene.tweens.add({
             targets: this.shieldText,
             scaleX: this.shieldText.startScale,
             scaleY: this.shieldText.startScale,
             ease: 'Back.easeOut',
             duration: gameVars.gameManualSlowSpeedInverse * 250,
         });
         this.handShieldBack.setScale(this.handShieldBack.startScale * 0.85);
         this.handShield.setScale(this.handShield.startScale * 0.85);
         this.handShield.play('handShieldFull');
         this.handShield.once('animationcomplete', () => {
             this.handShield.setFrame('handshield10.png');
             this.handShield.setScale(this.handShield.startScale * 0.333);
         });
         this.scene.tweens.add({
             targets: this.handShieldBack,
             scaleX: this.handShieldBack.startScale,
             scaleY: this.handShieldBack.startScale,
             alpha: 1,
             easeParams: [2.5],
             ease: 'Back.easeOut',
             duration: 200,
             onComplete: () => {
                 this.addTween({
                     targets: [this.handShieldBack],
                     alpha: 0.35,
                     duration: 500,
                 });
             }
         });
         this.scene.tweens.add({
             targets: this.handShield,
             scaleX: this.handShield.startScale,
             scaleY: this.handShield.startScale,
             alpha: 1,
             easeParams: [2.5],
             ease: 'Back.easeOut',
             duration: 200,
         });
         // this.voidShield1b.setScale(this.voidShield1b.startScale * 1.15).setAlpha(0.5);
         // this.addTween({
         //     targets: [this.voidShield1b],
         //     scaleX: this.voidShield1b.startScale,
         //     scaleY: this.voidShield1b.startScale,
         //     duration: 200,
         //     alpha: 1,
         //     ease: 'Cubic.easeIn',
         //     onComplete: () => {
         //         this.voidShield1b.repeatTween = this.addTween({
         //             targets: this.voidShield1b,
         //             alpha: 0.8,
         //             duration: 2000,
         //             scaleX: this.voidShield1b.startScale * 0.99,
         //             scaleY: this.voidShield1b.startScale * 0.99,
         //             yoyo: true,
         //             repeat: -1,
         //             ease: 'Quad.easeInOut'
         //         })
         //     }
         // });

         this.shieldAmts = amt;
     }

     clearHandShield(forceAnimate = false) {
         this.shieldText.setVisible(false);
         if (this.shieldAmts === 0 && !forceAnimate) {
             // already cleared perhaps
             return;
         }
         this.handShield.setFrame('handshieldbroke.png');
         this.handShield.setScale(1.7).setAlpha(1);
         this.addTween({
             targets: this.handShield,
             scaleX: 1.9,
             scaleY: 1.9,
             ease: 'Cubic.easeOut',
             duration: 250,
         })
         this.handShield.currAnim = this.addTween({
             targets: [this.handShield, this.handShieldBack],
             alpha: 0,
             duration: 600,
         });

         this.shieldAmts = 0;
     }

     destroy() {
        super.destroy();
        if (this.statueSubscribe) {
            this.statueSubscribe.unsubscribe();
        }

     }

     die() {
         if (this.dead) {
             return;
         }
         this.handShield.destroy();
         if (this.handShieldTemp) {
             this.handShieldTemp.destroy();
         }
         if (this.secondTempShield) {
             this.secondTempShield.destroy();
         }
        super.die();
        playSound('rock_crumble', 0.4).detune = -300;
        playSound('shield_break', 0.6).detune = -800;
        globalObjects.textPopupManager.hideInfoText();
        this.sprite.setScale(this.sprite.startScale).setRotation(0);
        this.clearHandShield();
         swirlInReaperFog();
         globalObjects.encyclopedia.hideButton();
         globalObjects.options.hideButton();
         globalObjects.magicCircle.disableMovement();

         this.addTween({
             targets: [this.sprite],
             scaleX: 0.9,
             scaleY: 0.9,
             alpha: 0.98,
             rotation: -0.24,
             ease: "Cubic.easeOut",
             duration: 450,
             completeDelay: 2500,
             onComplete: () => {
                 this.customVictory();
             }
         });
     }

    customVictory() {
        playReaperPassiveAnim(this, () => {
            clearDeathFog();
            this.addDelay(() => {

                playSound('victory_2');
                this.addDelay(() => {
                    let banner = this.scene.add.sprite(gameConsts.halfWidth, gameConsts.halfHeight - 35, 'misc', 'victory_banner.png').setScale(100, 1.2).setDepth(9998).setAlpha(0);
                    let victoryText = this.scene.add.sprite(gameConsts.halfWidth, gameConsts.halfHeight - 44, 'misc', 'complete.png').setScale(0.95).setDepth(9998).setAlpha(0);
                    let continueText = this.scene.add.text(gameConsts.width - 15, gameConsts.halfHeight + 2, getLangText('cont_ui'), {fontFamily: 'Verdana', color: '#F0F0F0', fontSize: 20}).setAlpha(0).setOrigin(1, 0.5).setAlign('right').setDepth(9998);

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
                    this.addTimeout(() => {
                        continueText.alpha = 1;
                    }, 1000);

                    PhaserScene.tweens.add({
                        targets: victoryText,
                        scaleX: 1,
                        scaleY: 1,
                        duration: 800,
                        onComplete: () => {
                            this.dieClickBlocker = createGlobalClickBlocker(false);
                            this.dieClickBlocker.setOnMouseUpFunc(() => {
                                hideGlobalClickBlocker();
                                continueText.destroy();
                                PhaserScene.tweens.add({
                                    targets: [victoryText, banner],
                                    alpha: 0,
                                    duration: 800,
                                    completeDelay: 200,
                                    onComplete: () => {
                                        victoryText.destroy();
                                        banner.destroy();
                                        beginPreLevel(this.level + 1);
                                        this.destroy();
                                    }
                                });
                            });
                        }
                    });
                }, 1100)
            }, 1200)

        });
    }


     initAttacks() {
         this.attacks = [
             [
                 // 0
                 {
                     name: "SHIELD? #10",
                     chargeAmt: 888,
                     chargeMult: 20,
                     damage: 0,
                     finaleFunction: () => {
                         fadeAwaySound(this.bgMusic, 1500);
                         this.animateCreateHandShield();
                         this.currentAttackSetIndex = 1;
                         this.nextAttackIndex = 0;

                         // uncomment to try and fix some bugs
                         // this.hideCurrentAttack();
                     }
                 },
             ],
             [
                 {
                     name: "CHARGING...",
                     chargeAmt: gameVars.isHardMode ? 500 : 1000,
                     damage: 0,
                 },
                 {
                     name: "}2x2}",
                     chargeAmt: 450,
                     finishDelay: 2000,
                     damage: -1,
                     startFunction: () => {
                         this.prepAttack();
                     },
                     attackFinishFunction: () => {
                         this.fireVoidAttacks(2, 2);
                     }
                 },
                 {
                     name: "}3x3}",
                     chargeAmt: 500,
                     finishDelay: 2500,
                     damage: -1,
                     startFunction: () => {
                         this.prepAttack();
                     },
                     attackFinishFunction: () => {
                         this.fireVoidAttacks(3, 3);
                     }
                 },
                 {
                     name: "|4x4|",
                     chargeAmt: 600,
                     finishDelay: 3000,
                     damage: -1,
                     startFunction: () => {
                         this.prepAttack();
                     },
                     attackFinishFunction: () => {
                         this.fireVoidAttacks(4, 4);
                     }
                 },
                 {
                     name: "|5x5|",
                     finishDelay: 3500,
                     chargeAmt: 700,
                     damage: -1,
                     startFunction: () => {
                         this.prepAttack();
                     },
                     attackFinishFunction: () => {
                         this.fireVoidAttacks(5, 5);
                     }
                 },
                 {
                     name: ";6x6;",
                     chargeAmt: 800,
                     finishDelay: 4000,
                     damage: -1,
                     startFunction: () => {
                         this.prepAttack();
                     },
                     attackFinishFunction: () => {
                         this.fireVoidAttacks(6, 6);
                     }
                 },
                 {
                     name: ";7x7;",
                     chargeAmt: 900,
                     finishDelay: 4400,
                     damage: -1,
                     startFunction: () => {
                         this.prepAttack();
                     },
                     attackFinishFunction: () => {
                         this.fireVoidAttacks(7, 7);
                     }
                 },
                 {
                     name: ";;8x8;;",
                     chargeAmt: 1000,
                     finishDelay: 4800,
                     isBigMove: true,
                     damage: -1,
                     startFunction: () => {
                         this.prepAttack();
                     },
                     attackFinishFunction: () => {
                         this.fireVoidAttacks(8, 8);
                     }
                 },
                 {
                     name: ";;9x9;;",
                     chargeAmt: 1100,
                     finishDelay: 5200,
                     isBigMove: true,
                     damage: -1,
                     startFunction: () => {
                         this.prepAttack();
                     },
                     attackFinishFunction: () => {
                         this.fireVoidAttacks(9, 9);
                     }
                 },
                 {
                     name: ";;;10x10;;;",
                     chargeAmt: 1200,
                     finishDelay: 5500,
                     isBigMove: true,
                     damage: -1,
                     startFunction: () => {
                         this.prepAttack();
                     },
                     attackFinishFunction: () => {
                         this.fireVoidAttacks(10, 10);
                     }
                 },
                 {
                     name: "DEACTIVATING...",
                     chargeAmt: 888,
                     chargeMult: 20,
                     damage: 0,
                     finaleFunction: () => {
                         this.setAsleep();
                         this.interruptCurrentAttack();
                     }
                 },
             ]
         ];
     }

     fireVoidAttacks(damage = 3, times = 3) {
        playSound('ringknell')
        for (let i = 0; i < times; i++) {
            this.addDelay(() => {
                let pulse = getTempPoolObject('blurry', 'pulser.png', 'pulser', 825);
                pulse.setAlpha(0).setScale(0.75).setPosition(this.x, this.y - 60).setDepth(10);
                this.addTween({
                    delay: 50,
                    targets: pulse,
                    scaleX: 9,
                    scaleY: 9,
                    ease: 'Quint.easeIn',
                    duration: 750,
                })
                this.addTween({
                    targets: pulse,
                    alpha: 1,
                    ease: 'Cubic.easeInOut',
                    duration: 200,
                })
                this.addDelayIfAlive(() => {
                    messageBus.publish("selfTakeDamage", damage);
                    let isLast = i == times - 1;

                    let darkBG = getBackgroundBlackout();
                    darkBG.setDepth(-3).setAlpha(isLast ? (0.33 + times * 0.04) : 0.3);
                    this.addTween({
                        targets: darkBG,
                        alpha: 0,
                        ease: 'Cubic.easeOut',
                        duration: isLast ? 800 : 400
                    })
                    let vol = 0.4;
                    if (i % 2 == 1) {
                        vol = 0.6;
                    }
                    if (isLast) {
                        vol = 0.7
                    }
                    let slamSfx = playSound('body_slam', vol);
                    slamSfx = 200 - Math.floor(Math.random() * 450);
                }, 650)
            }, i * 600 - times * 30)
        }
     }

     prepAttack() {
        if (!this.flashPic) {
            this.darkBlur = this.addImage(this.x, this.y - 55, 'blurry', 'dark_blur.png').setDepth(-1).setScale(7).setAlpha(0);
            this.flashPic = this.addImage(this.x, this.y - 65, 'blurry', 'flash.webp').setDepth(-1);
        }
        this.flashPic.setScale(0.1).setRotation(-0.3);
         this.addTween({
             targets: this.darkBlur,
             alpha: 0.45,
             ease: 'Quad.easeOut',
             duration: 570,
             onComplete: () => {
                 this.addTween({
                     targets: this.darkBlur,
                     alpha: 0,
                     duration: 1000,
                 });
             }
         });


        this.addDelay(() => {
            let sliceSfx = playSound('slice_in', 0.6);
            sliceSfx.detune = -200 + Math.floor(Math.random() * 200)
        }, 200)
        this.addTween({
            targets: this.flashPic,
            rotation: 0,
            scaleX: 3,
            scaleY: 2.2,
            ease: 'Cubic.easeIn',
            duration: 570,
            onComplete: () => {
                this.addTween({
                    targets: this.flashPic,
                    rotation: 0.3,
                    scaleX: 0,
                    scaleY: 0,
                    ease: 'Cubic.easeOut',
                    duration: 570,
                })
            }
        })

     }
}
