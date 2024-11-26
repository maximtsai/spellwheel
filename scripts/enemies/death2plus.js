 class Death2Plus extends Enemy {
     constructor(scene, x, y, level) {
         super(scene, x, y, level);
         this.initSprite('death2final.png', 0.92, 0, -15, 'deathfinal');
         this.bgMusic = playMusic('but_never_forgotten_metal', 1, true);
         switchBackgroundInstant('star_bg.webp');

         this.bgMain = this.addSprite(gameConsts.halfWidth, gameConsts.halfHeight, 'backgrounds', 'star.png').setDepth(-5).setScale(1.04, 1.05)
         this.bgBlur = this.addImage(gameConsts.halfWidth, gameConsts.halfHeight, 'backgrounds', 'star_blur.png').setDepth(-5).setScale(2.63).setAlpha(1.5);
         globalObjects.player.reInitStats();
         globalObjects.player.refreshHealthBar();
         messageBus.publish('showCircleShadow', 0.7, -50);
         this.sprite.setOrigin(0.5, 0.4);
         this.sprite.startY = y;
         this.bgBlur.currAnim = this.addTween({
             targets: this.bgBlur,
             alpha: 0,
             duration: 1000,
             onComplete: () => {
                 setTimeout(() => {
                     fadeInSound(this.bgMusic, 0.83, 3000)
                 }, 4800)
                 this.bgBlur.currAnim = this.addTween({
                     targets: this.bgBlur,
                     alpha: 0.38,
                     scaleX: 2.64,
                     scaleY: 2.64,
                     ease: 'Quad.easeInOut',
                     repeat: -1,
                     yoyo: true,
                     duration: 2000,
                 })
             }
         })
         let tempPulse = getTempPoolObject('blurry', 'black_pulse.png', 'blackpulse', 600);
         zoomTempSlow(1.01);
         playSound('heartbeatfast');

         tempPulse.setDepth(-2).setPosition(x, y + 15).setScale(0).setAlpha(1).setRotation(0);
         this.addTween({
             targets: tempPulse,
             scaleX: 8,
             scaleY: 8,
             rotation: "+=10",
             duration: 510,
         })
         this.addTween({
             targets: tempPulse,
             ease: 'Cubic.easeIn',
             duration: 510,
             alpha: 0,
         });


         this.whiteoutTemp = this.addImage(x, y + 15, 'spells', 'whiteout_circle.png').setScale(2.55)
         this.addTween({
             targets: this.whiteoutTemp,
             scaleX: 21,
             scaleY: 21,
             duration: 540,
             ease: "Cubic.easeInOut",
             onComplete: () => {
                 this.whiteoutTemp.destroy();
             }
         });

         this.addTween({
             delay: 50,
             targets: this.whiteoutTemp,
             alpha: 0,
             duration: 490,
             ease: "Cubic.easeIn"
         })
         this.addTimeout(() => {
             this.initMisc();
             this.setAsleep();
             this.repeatTweenBreathe()
             this.beginBattleAnim();
         }, 10)
     }

     initStatsCustom() {
         this.health = 777;
         this.customAngry = "angrybone";
         this.handObjects = [];
         this.glowHands = [];
         this.shieldScale = 1.5;
         this.shieldOffsetY = 40;
        this.lastAttackLingerMult = 2.5;
         this.shieldTextOffsetY = -42;
         this.shieldTextFont = "void";
         this.shieldTextSize = 56;
         this.pullbackScale = 0.97;
         this.attackScale = 1.01;
         this.shieldAmts = 0;
         this.storedHeal = 0;
         this.extraAttackDamage = 0;

     }

     initMisc() {
        this.deathhalo1 = this.addImage(this.x, this.y + 3, 'blurry', 'deathhalo.png').setScale(0.1).setDepth(-1).setAlpha(0).setBlendMode(Phaser.BlendModes.NORMAL);
        this.deathhalo2 = this.addImage(this.x, this.y + 3, 'blurry', 'deathhalo.png').setScale(0.1).setDepth(-1).setAlpha(0).setRotation(1).setBlendMode(Phaser.BlendModes.NORMAL);
        this.circleHalo = this.addImage(this.x, this.y - 4, 'blurry', 'spellcircle_pulse.png').setAlpha(0).setScale(0.5).setDepth(-1);
         this.shieldExtraText = this.addBitmapText(this.x, this.y + this.shieldTextOffsetY + 80, 'void', 'SHIELDED', 60).setOrigin(0.5).setDepth(this.shieldText.depth).setVisible(false);

         this.handShieldBack = this.addImage(this.x, this.y + 2, 'blurry', 'handshield_back.png').setScale(2.4).setDepth(-5).setAlpha(0);
         this.handShieldBack.startScale = this.handShieldBack.scaleX;
         this.handShield = this.addSprite(this.x, this.y + 2, 'shields', 'handshield10.png').setScale(1).setDepth(3).setAlpha(0);
         this.handShield.startScale = this.handShield.scaleX;
         this.handShieldPulse = this.addSprite(this.x, this.y + 2, 'shields', 'handshield10.png').setScale(1).setDepth(3).setVisible(false);
        this.repeatPulseHandShield();

         this.currentHandGlow = this.addImage(0, 0, 'deathfinal', 'claw_glow.png').setAlpha(0).setDepth(-1);
         this.currentHandGlowPulse = this.addImage(0, 0, 'deathfinal', 'claw.png').setAlpha(0).setDepth(-1);
         this.redClockTemp = this.addImage(gameConsts.halfWidth, globalObjects.player.getY(), 'enemies', 'red_clock_back_large_red.png').setAlpha(0);

    }

    repeatPulseHandShield() {
        this.handShieldPulse.alpha = 0;
        this.handShieldPulse.setScale(1);
        if (this.dead || this.isDestroyed) {
            return;
        }
        this.addTween({
            targets: this.handShieldPulse,
            alpha: 0.8,
            ease: 'Cubic.easeIn',
            duration: 250,
            onComplete: () => {
                this.addTween({
                    targets: this.handShieldPulse,
                    scaleX: 1.3,
                    scaleY: 1.3,
                    alpha: 0,
                    ease: 'Cubic.easeOut',
                    duration: 2100,
                    onComplete: () => {
                        this.repeatPulseHandShield();
                    }
                })
            }
        })

    }

     beginBattleAnim() {
         this.spellStartY = this.y - 40;
         this.createGlowHands();
         this.addDelayIfAlive(() => {
             this.spellCirclePulse = this.addImage(this.x, this.y, 'blurry', 'spellcircle_pulse.png').setAlpha(0.1).setScale(0.5).setDepth(-1);
             this.spellCircleGlow = this.addImage(this.x, this.spellStartY, 'blurry', 'spellcircle_bgglow.png').setAlpha(0.1).setScale(1).setDepth(-3);
             this.spellCircle = this.addImage(this.x, this.spellStartY, 'deathfinal', 'spellcircle.png').setAlpha(0.1).setScale(0.5);
             this.rotateSpellCircleTo(0, false, () => {
                 // this.fadeOutCurrentHand();
                 this.createHandShield(gameVars.isHardMode ? 10 : 9);
                 globalObjects.magicCircle.enableMovement();
                 globalObjects.encyclopedia.showButton();
                 globalObjects.options.showButton();
                 this.addDelayIfAlive(() => {
                    this.nowgivemeyourall()
                 }, 800)
             });

             this.addDelayIfAlive(() => {
                 this.setAwake(false);
             }, 4000)


            this.addTween({
                targets: [this.deathhalo1],
                alpha: 0.5,
                scaleX: 3,
                scaleY: 3,
                duration: 1000,
                onComplete: () => {
                    this.addTween({
                        targets: [this.deathhalo2],
                        alpha: 0.5,
                        scaleX: 3,
                        scaleY: 3,
                        duration: 1000,
                        onComplete: () => {
                            this.addTween({
                                targets: [this.deathhalo2],
                                alpha: 0,
                                scaleX: 5,
                                scaleY: 5,
                                duration: 1000,
                            })
                        }
                    });

                    this.addTween({
                        targets: [this.deathhalo1],
                        alpha: 0,
                        scaleX: 5,
                        scaleY: 5,
                        duration: 1000,
                        onComplete: () => {
                            this.deathhalo1.setScale(0.1).setAlpha(0)
                            this.addTween({
                                targets: [this.deathhalo1],
                                alpha: 0.5,
                                scaleX: 3,
                                scaleY: 3,
                                duration: 1000,
                                onComplete: () => {
                                    this.addTween({
                                        targets: [this.deathhalo1],
                                        alpha: 0,
                                        scaleX: 5,
                                        scaleY: 5,
                                        duration: 1000,
                                    });
                                }
                            });
                        }
                    })
                }
            })

         }, 900)
     }


     quickZoom(img, scale = 1) {
        this.addTween({
            targets: img,
            scaleX: scale,
            scaleY: scale,
            duration: 100,
            ease: 'Quint.easeIn'
        })
     }

    nowgivemeyourall() {
        let darkBG = this.addImage(0, 0, 'blackPixel').setScale(1000);
        darkBG.setDepth(-4).setAlpha(0.3);
        this.addTween({
            targets: darkBG,
            ease: 'Quad.easeOut',
            alpha: 0.15,
            duration: 300,
        });
        let img_now = this.addImage(gameConsts.halfWidth - 145, 150, 'deathfinal', 'x_now.png').setDepth(9999).setScale(1.16);
        this.quickZoom(img_now, 1.1)
        screenShake(3);
        zoomTemp(1.02);
        playSound('stomp', 0.6);
        this.addDelay(() => {
            darkBG.setAlpha(0.3);
            this.addTween({
                targets: darkBG,
                ease: 'Quad.easeOut',
                alpha: 0.15,
                duration: 300,
            });
            let img_give = this.addImage(gameConsts.halfWidth + 145, 150, 'deathfinal', 'x_give.png').setDepth(9999).setScale(1.16);
            this.quickZoom(img_give, 1.1)
            screenShake(4);
            zoomTemp(1.02);
            playSound('stomp', 0.7);
            this.addDelay(() => {
                darkBG.setAlpha(0.3);
                this.addTween({
                    targets: darkBG,
                    ease: 'Quad.easeOut',
                    alpha: 0.15,
                    duration: 300,
                });
                let img_me = this.addImage(gameConsts.halfWidth - 145, isMobile ? 360 : 348, 'deathfinal', 'x_me.png').setDepth(9999).setScale(1.16);
                this.quickZoom(img_me, 1.1)
                screenShake(5);
                zoomTemp(1.02);
                playSound('stomp', 0.8);
                this.addDelay(() => {
                    darkBG.setAlpha(0.3);
                    this.addTween({
                        targets: darkBG,
                        ease: 'Quad.easeOut',
                        alpha: 0.15,
                        duration: 300,
                    });
                    let img_your = this.addImage(gameConsts.halfWidth + 145, isMobile ? 360 : 348, 'deathfinal', 'x_your.png').setDepth(9999).setScale(1.16);
                    this.quickZoom(img_your, 1.1)
                    screenShake(6);
                    zoomTemp(1.02);
                    playSound('stomp', 0.85);
                    this.addDelay(() => {
                        darkBG.setAlpha(0.45);
                        this.addTween({
                            targets: darkBG,
                            alpha: 0,
                            duration: 450,
                        });
                        let img_all = this.addSprite(gameConsts.halfWidth, isMobile ? 625 : 600, 'deathfinal', 'x_all2.png').setDepth(9999).setScale(1.22);
                        this.quickZoom(img_all, 1.1)
                        zoomTemp(1.1);
                        screenShakeManual(20, 0.8);
                        playSound('stomp', 0.95);
                        playSound('rock_crumble', 0.8);
                        if (this.bgBlur.currAnim) {
                            this.bgBlur.currAnim.stop();
                        }
                        this.bgBlur.alpha = 1;
                         this.bgBlur.currAnim = this.addTween({
                             targets: this.bgBlur,
                             alpha: 0,
                             ease: 'Cubic.easeIn',
                             duration: 1700,
                             onComplete: () => {
                                 this.bgBlur.currAnim = this.addTween({
                                     targets: this.bgBlur,
                                     alpha: 0.3,
                                     scaleX: 2.64,
                                     scaleY: 2.64,
                                     ease: 'Quad.easeInOut',
                                     repeat: -1,
                                     yoyo: true,
                                     duration: 2000,
                                 })
                             }
                         });
                         this.addDelay(() => {
                            this.addTween({
                                targets: [img_now, img_give, img_me, img_your, img_all],
                                alpha: 0,
                                scaleX: 1.05,
                                scaleY: 1.05,
                                duration: 300,
                                ease: 'Cubic.easeIn',
                                onComplete: () => {
                                    img_now.destroy();
                                    img_give.destroy();
                                    img_me.destroy();
                                    img_your.destroy();
                                    img_all.destroy();
                                }
                            })
                         }, 1800)
                    }, 380)
                }, 380)
            }, 380)
        }, 380)
    }


    ringBells() {
        let leftBell = this.addImage(30, 40, 'deathfinal', 'bell.png').setScale(0.75).setAlpha(0).setOrigin(0.5, 0.1).setRotation(0.6);
        let rightBell = this.addImage(gameConsts.width - 30, 40, 'deathfinal', 'bell.png').setScale(0.75).setAlpha(0).setOrigin(0.5, 0.1).setRotation(-0.6);
        this.addDelay(() => {
            playSound('death_cast', 0.95)
            this.addDelay(() => {
                playSound('death_cast', 0.5)
            }, 4500)
        },800)
        this.addTween({
            delay: 200,
            targets: [leftBell, rightBell],
            duration: 1300,
            ease: 'Quad.easeIn',
            alpha: 1.2,
            scaleX: 0.8,
            scaleY: 0.8,
            onComplete: () => {
                this.addTween({
                    targets: [leftBell, rightBell],
                    duration: 6000,
                    ease: 'Quad.easeOut',
                    alpha: 0,
                    onComplete: () => {
                        leftBell.destroy();
                        rightBell.destroy();
                    }
                })
            }
        });
        this.addTween({
            targets: leftBell,
            duration: 1500,
            ease: 'Cubic.easeInOut',
            rotation: -0.6,
            yoyo: true,
            repeat: 3
        })
        this.addDelayIfAlive(() => {
            this.addTween({
                targets: rightBell,
                duration: 1500,
                ease: 'Cubic.easeInOut',
                rotation: 0.6,
                yoyo: true,
                repeat: 3
            })
        }, 200)
    }

    repeatTweenHalo() {
        if (this.dead || this.stopHalo) {
            return;
        }
        this.deathhalo1.setScale(0.1).setAlpha(0).setRotation(Math.random() * 6);
        this.addTween({
            targets: [this.deathhalo2],
            alpha: 0,
            scaleX: 4.5,
            scaleY: 4.5,
            duration: 2000,
        });
        this.addTween({
            targets: [this.deathhalo1],
            alpha: 0.6,
            scaleX: 2.5,
            scaleY: 2.5,
            duration: 2000,
            onComplete: () => {
                this.deathhalo2.setScale(0.1).setAlpha(0).setRotation(Math.random() * 6);
                this.addTween({
                    targets: [this.deathhalo2],
                    alpha: 0.6,
                    scaleX: 2.5,
                    scaleY: 2.5,
                    duration: 2000,
                });
                this.addTween({
                    targets: [this.deathhalo1],
                    alpha: 0,
                    scaleX: 4.5,
                    scaleY: 4.5,
                    duration: 2000,
                    onComplete: () => {
                        this.repeatTweenHalo()
                    }
                })
            }
        })
    }

     repeatTweenBreathe(duration = 1500, magnitude = 1) {
         if (this.breatheTween) {
             this.breatheTween.stop();
         }
         this.breathTween = this.addTween({
             targets: [this.sprite],
             y: "+=9",
             duration: 2000,
             ease: 'Quad.easeInOut',
             repeat: -1,
             yoyo: true
         });
         this.haloBreathTween = this.addTween({
             targets: [this.deathhalo1, this.deathhalo2, this.circleHalo],
             y: "+=9",
             duration: 2000,
             ease: 'Quad.easeInOut',
             repeat: -1,
             yoyo: true,
             onRepeat: () => {
                 if (this.pulseFinalEnabled) {
                     zoomTempSlow(1.005);
                     let tempPulse = getTempPoolObject('blurry', 'black_pulse.png', 'blackpulse', 1550);
                     setTimeout(() => {
                         playSound('heartbeatfast', 0.85).setSeek(0.28).detune = -650;
                     }, 10)
                     tempPulse.setDepth(-2).setPosition(this.x, this.circleHalo.y).setScale(0).setAlpha(0.53).setRotation(0);
                     this.addTween({
                         targets: tempPulse,
                         scaleX: 8,
                         scaleY: 8,
                         duration: 1500,
                     })
                     this.addTween({
                         targets: tempPulse,
                         ease: 'Cubic.easeIn',
                         duration: 1510,
                         alpha: 0,
                     });
                     this.addTween({
                         targets: tempPulse,
                         rotation: "+=20",
                         duration: 1510,
                     })
                 }

             }
         });
     }

    fadeOutCurrentHand() {
         if (this.currentHandGlow.currAnim) {
             this.currentHandGlow.currAnim.stop();
         }
        this.currentHandGlow.alpha = 1.1;
        this.addTween({
            targets: this.currentHandGlow,
            alpha: 0,
            duration: 500
        })
        this.currentHandGlow.currAnim = this.addTween({
            targets: this.currentHandGlow,
            scaleX: 0.5,
            scaleY: 0.5,
            ease: 'Cubic.easeIn',
            duration: 500
        })
    }

    fadeMainBG(showup) {
         this.addTween({
             targets: this.bgMain,
             alpha: showup ? 1 : 0.5,
             duration: 1000
         })
    }

    showHurtFinale() {
        fadeAwaySound(this.bgMusic, 2000);
        if (this.bgMusic2) {
            fadeAwaySound(this.bgMusic2, 2000);
        }
        this.showFinalPrelude();
        this.emergencyShield();
        globalObjects.bannerTextManager.setDialog([getLangText('deathFight2plusz'), getLangText('deathFight2plusz2')]);
        globalObjects.bannerTextManager.setPosition(gameConsts.halfWidth, gameConsts.halfHeight - 10, 0);
        globalObjects.bannerTextManager.showBanner(0);
        globalObjects.bannerTextManager.setOnFinishFunc(() => {
            messageBus.publish("closeCombatText");
            this.showActualFinale();
        })
    }

    showImpatienceFinale() {
        this.shownFinale = true;
        this.currentAttackSetIndex = 5;
        this.nextAttackIndex = 0;
        this.showFinalPrelude();
        this.addDelayIfAlive(() => {
            fadeAwaySound(this.bgMusic, 2000);
            if (this.bgMusic2) {
                fadeAwaySound(this.bgMusic2, 2000);
            }
            if (globalObjects.player.isDead()) {
                return;
            }
            globalObjects.bannerTextManager.setDialog([getLangText('deathFight2plusy'), getLangText('deathFight2plusz2')]);
            globalObjects.bannerTextManager.setPosition(gameConsts.halfWidth, gameConsts.halfHeight - 10, 0);
            globalObjects.bannerTextManager.showBanner(0);
            globalObjects.bannerTextManager.setOnFinishFunc(() => {
                this.showActualFinale();
            })
        }, 4700)
    }

    showFinalPrelude() {
        this.interruptCurrentAttack();
        this.setAsleep();
        messageBus.publish("closeCombatText");
        this.clearExtraAttackDamage();
        this.clearPower();
        this.fadeOutCurrentHand();
        this.currentAttackSetIndex = 5;
        this.nextAttackIndex = 0;
    }

    showActualFinale() {
         if (this.dead) {
             return;
         }
        playFakeBGMusic('but_never_forgotten_metal_prelude');
        this.addTween({
            delay: 200,
            targets: this.sprite,
             duration: 900,
             scaleX: this.sprite.startScale * 1.12,
             scaleY: this.sprite.startScale * 1.12,
             ease: "Cubic.easeInOut",
             onComplete: () => {
                 if (this.dead) {
                     return;
                 }
                 this.clearHandShield();
                this.addDelay(() => {
                    if (this.dead) {
                        return;
                    }
                    let deathHead = this.addImage(this.x, this.y + 10, 'deathfinal', 'death_2_laugh.png').setScale(0.8, 0.5).setOrigin(0.5, 0.45).setAlpha(0).setDepth(-1)
                    screenShakeLong(12);
                    this.addTween({
                         targets: deathHead,
                         alpha: 0.6,
                         ease: 'Quint.easeIn',
                         duration: 500,
                         scaleX: 0.85,
                         scaleY: 0.85,
                         onComplete: () => {
                            deathHead.setAlpha(0.9).setScale(0.95, 1)
                            this.setAwake();
                            this.addTween({
                                 targets: deathHead,
                                 alpha: 0,
                                 duration: 1800,
                                 onComplete: () => {
                                    deathHead.destroy();
                                 }
                             })
                            this.addTween({
                                 targets: deathHead,
                                 ease: 'Quart.easeOut',
                                 duration: 80,
                                 scaleX: "-=0.015",
                                 scaleY: "-=0.025",
                                 onComplete: () => {
                                    screenShakeLong(10);
                                    this.addTween({
                                         targets: deathHead,
                                         duration: 20,
                                         scaleX: "+=0.03",
                                         scaleY: "+=0.06",
                                         onComplete: () => {
                                            this.addTween({
                                                 targets: deathHead,
                                                 ease: 'Quart.easeOut',
                                                 duration: 80,
                                                 scaleX: "-=0.015",
                                                 scaleY: "-=0.025",
                                                 onComplete: () => {
                                                    this.addTween({
                                                         targets: deathHead,
                                                         duration: 20,
                                                        scaleX: "+=0.03",
                                                        scaleY: "+=0.06",
                                                         onComplete: () => {
                                                            this.addTween({
                                                                 targets: deathHead,
                                                                 ease: 'Quart.easeOut',
                                                                 duration: 80,
                                                                 scaleX: "-=0.015",
                                                                 scaleY: "-=0.025",
                                                                 onComplete: () => {
                                                                    this.addTween({
                                                                         targets: deathHead,
                                                                         duration: 20,
                                                                         scaleX: "+=0.03",
                                                                         scaleY: "+=0.06",
                                                                         onComplete: () => {
                                                                             this.pulseFinalEnabled = true;
                                                                            screenShakeLong(10);

                                                                            let redFlash = this.addImage(gameConsts.halfWidth, gameConsts.halfHeight, 'pixels', 'red_pixel.png').setScale(500).setAlpha(0.8).setDepth(-1)
                                                                            this.addTween({
                                                                                 targets: redFlash,
                                                                                 alpha: 0,
                                                                                 ease: 'Cubic.easeOut',
                                                                                 duration: 500,
                                                                                 onComplete: () => {
                                                                                    redFlash.destroy();
                                                                                 }
                                                                             })

                                                          this.addTween({
                                                                 targets: deathHead,
                                                                 ease: 'Quart.easeOut',
                                                                 duration: 100,
                                                                 scaleX: "-=0.015",
                                                                 scaleY: "-=0.03",
                                                                 onComplete: () => {
                                                                    deathHead.setScale(deathHead.scaleX + 0.05, deathHead.scaleY + 0.07);
                                                                    this.addTween({
                                                                         targets: deathHead,
                                                                         ease: 'Cubic.easeIn',
                                                                         duration: 1400,
                                                                         scaleX: "-=0.15",
                                                                         scaleY: "-=0.08",
                                                                     })
                                                                 }
                                                             })
                                                                         }
                                                                     })
                                                                 }
                                                             })
                                                         }
                                                     })
                                                 }
                                             })
                                         }
                                     })
                                 }
                             })
                         }
                     })
                }, 750)
                 this.addTween({
                     targets: this.sprite,
                     duration: 900,
                     scaleX: this.sprite.startScale * 0.7,
                     scaleY: this.sprite.startScale * 0.7,
                     ease: "Quint.easeIn",
                     onComplete: () => {
                         if (this.dead) {
                             return;
                         }
                         this.addTween({
                             targets: this.circleHalo,
                             alpha: 1,
                             scaleX: 0.4,
                             scaleY: 0.4,
                             duration: 400
                         })
                        this.addTween({
                            targets: [this.deathhalo1],
                            alpha: 0.5,
                            scaleX: 3,
                            scaleY: 3,
                            duration: 1000,
                            onComplete: () => {
                                this.addTween({
                                    targets: [this.deathhalo2],
                                    alpha: 0.5,
                                    scaleX: 3,
                                    scaleY: 3,
                                    duration: 1000,
                                });

                                this.addTween({
                                    targets: [this.deathhalo1],
                                    alpha: 0,
                                    scaleX: 5,
                                    scaleY: 5,
                                    duration: 1000,
                                    onComplete: () => {
                                        this.repeatTweenHalo()
                                    }
                                })
                            }
                        })

                        screenShake(3);
                        zoomTemp(1.02)
                        this.bgMusic3 = playMusic('but_never_forgotten_epicchoir', 1, true);
                        this.bgMain.setFrame('star_red.png').setScale(1.32);
                        playSound('sound_of_death', 1.2).setSeek(0.2);

                         messageBus.publish('showCircleShadow', 0.7, -50);
                         this.whiteoutTemp = this.addImage(this.x, this.y + 15, 'spells', 'whiteout_circle.png').setScale(2.75)
                         this.addTween({
                             targets: this.whiteoutTemp,
                             scaleX: 21,
                             scaleY: 21,
                             duration: 400,
                             ease: "Cubic.easeInOut",
                             onComplete: () => {
                                 this.whiteoutTemp.destroy();
                             }
                         })
                         this.addTween({
                             targets: this.whiteoutTemp,
                             alpha: 0,
                             duration: 400,
                             ease: "Quad.easeIn"
                         })
                     }
                 });
             }
        })
    }

     initAttacks() {
         this.attacks = [
             [
                 // 0
                 {
                     name: "OBSERVING...",
                     chargeAmt: gameVars.isHardMode ? 450 : 600,
                     finishDelay: 3000,
                     damage: 0,
                     isPassive: true,
                     startFunction: () => {
                     },
                     attackStartFunction: () => {
                         // this.fadeOutCurrentHand();
                     },
                     attackFinishFunction: () => {
                     },
                     finaleFunction: () => {

                     }
                 },
                 {
                     name: "|14x2",
                     chargeAmt: 600,
                     finishDelay: 2000,
                     damage: -1,
                     isBigMove: true,
                     startFunction: () => {
                         this.pulseHand(1);
                     },
                     attackStartFunction: () => {
                         this.fadeOutCurrentHand();
                     },
                     attackFinishFunction: () => {
                         let pokeHand = this.addImage(this.x - 180, this.y - 50, 'deathfinal', 'poke.png').setScale(0.1).setAlpha(0.65);
                         let pokeHandGlow = this.addImage(this.x - 180, this.y - 50, 'deathfinal', 'poke_glow.png').setScale(0.2).setAlpha(0);
                         this.summonHand(pokeHand, pokeHandGlow, 0.26, 0.6, () => {
                             this.fireTwoPokes(14, pokeHand);
                         })
                     },
                 },
                 {
                     name: "}3+$21",
                     chargeAmt: 650,
                     finishDelay: 3500,
                     damage: -1,
                     startFunction: () => {
                         this.pulseHand(2);
                     },
                     attackStartFunction: () => {
                         this.fadeOutCurrentHand();
                     },
                     attackFinishFunction: () => {
                         let okayHand = this.addImage(this.x + 190, this.y + 20, 'deathfinal', 'okay.png').setScale(0.1).setAlpha(0.65).setRotation(0);
                         let okayHandGlow = this.addImage(okayHand.x, okayHand.y, 'deathfinal', 'okay_glow.png').setScale(0.2).setAlpha(0).setRotation(0);
                         okayHand.setDepth(50);
                         okayHandGlow.setDepth(50);
                         let timeDamage = 21;
                         let damage = 3;

                         this.summonHand(okayHand, okayHandGlow, 0.28, 1, () => {
                             this.fireTimeAttack(damage, okayHand, () => {
                                 this.redClockTemp.setScale(1.25).setDepth(50).setRotation(-1).setPosition(gameConsts.halfWidth, globalObjects.player.getY());
                                 this.redClockTemp.currAnim = this.addTween({
                                     targets: this.redClockTemp,
                                     rotation: 0,
                                     alpha: "+=0.5",
                                     scaleX: 1.2,
                                     scaleY: 1.2,
                                     ease: 'Cubic.easeIn',
                                     duration: 200,
                                     onComplete: () => {
                                         this.addTween({
                                             targets: this.redClockTemp,
                                             alpha: 0,
                                             duration: 800,
                                         })
                                     }
                                 })
                                 messageBus.publish("selfTakeDamage", damage);
                                 messageBus.publish('playerAddDelayedDamage', timeDamage);
                             });
                         })
                     },
                     finaleFunction: () => {

                     }
                 },
                 {
                     name: "}4x4",
                     chargeAmt: 850,
                     finishDelay: 1000,
                     chargeMult: 1.6,
                     damage: -1,
                     startFunction: () => {
                         this.pulseHand(3);
                     },
                     attackStartFunction: () => {
                         this.fadeOutCurrentHand();
                     },
                     attackFinishFunction: () => {
                         let pokeHand = this.addImage(this.x + 180, this.y + 150, 'deathfinal', 'claw.png').setScale(0.1).setAlpha(0.65).setRotation(0.4);
                         let pokeHandGlow = this.addImage(this.x + 180, this.y + 150, 'deathfinal', 'claw_glow.png').setScale(0.2).setAlpha(0).setRotation(0.4);
                         this.summonHand(pokeHand, pokeHandGlow, 0.4, 0.7, () => {
                             this.fireTwoClaws(4, 4, pokeHand);
                         })
                     },
                     finaleFunction: () => {
                         this.currentAttackSetIndex = 1;
                         this.nextAttackIndex = 0;
                         this.interruptCurrentAttack();
                         this.setAsleep();
                         this.addDelayIfAlive(() => {
                             if (this.currentAttackSetIndex === 5) {
                                 return;
                             }
                             this.rotateSpellCircleTo(1, true, () => {
                                 if (this.currentAttackSetIndex === 5) {
                                     return;
                                 }
                                 // this.fadeOutCurrentHand();
                                 this.createPokePower();
                                 this.addDelayIfAlive(() => {
                                     if (this.currentAttackSetIndex === 5) {
                                         return;
                                     }
                                     messageBus.publish("showCombatText", getLangText('deathFight2plusb'), -20);
                                     this.addTimeout(() => {
                                         if (this.currentAttackSetIndex === 5) {
                                             return;
                                         }
                                         this.setAwake();
                                         this.spellAbsorber = messageBus.subscribe('playerCastedSpell', () => {
                                             this.addExtraDamage();
                                         });
                                         this.spellsCastCounter = 0;
                                         if (this.playerSpellCastSub) {
                                             this.playerSpellCastSub.unsubscribe();
                                         }
                                         this.playerSpellCastSub = messageBus.subscribe('playerCastedSpell', () => {
                                             this.spellsCastCounter++;
                                             if (this.spellsCastCounter >= 2) {
                                                 this.playerSpellCastSub.unsubscribe();
                                                 this.playerSpellCastSub = null;
                                                 messageBus.publish("closeCombatText")
                                             }
                                         });
                                     }, 100)
                                 }, 600)
                             });
                         }, 3000)
                     }
                 },
             ],
             [
                 // 1
                 {
                     name: ";40+#1",
                     chargeAmt: 750,
                     finishDelay: 2000,
                     damage: -1,
                     isBigMove: true,
                     startFunction: () => {
                         this.attackToStrengthen = 0;
                         this.attackToStrengthenStartDmg = 40;
                         this.pulseHand(0);
                     },
                     attackStartFunction: () => {
                         this.fadeOutCurrentHand();
                     },
                     attackFinishFunction: () => {
                         this.attackToStrengthen = undefined;
                         let palmHand = this.addImage(this.x - 180, this.y - 50, 'deathfinal', 'palm.png').setScale(0.1).setAlpha(0.65);
                         let palmHandGlow = this.addImage(this.x - 180, this.y - 50, 'deathfinal', 'palm_glow.png').setScale(0.2).setAlpha(0);
                         let finalDamage = 40 + this.extraAttackDamage;
                         this.summonHand(palmHand, palmHandGlow, 0.2, 0.7, () => {
                             this.firePalm(finalDamage, palmHand);
                         }, 3)
                         this.clearExtraAttackDamage();

                     },
                 },
                 {
                     name: "}3+$24",
                     chargeAmt: 700,
                     finishDelay: 3500,
                     damage: -1,
                     startFunction: () => {
                         this.attackToStrengthen = 2;
                         this.attackToStrengthenStartDmg = 24;
                         this.pulseHand(2);
                     },
                     attackStartFunction: () => {
                         this.fadeOutCurrentHand();
                     },
                     attackFinishFunction: () => {
                         let okayHand = this.addImage(this.x + 200, this.y + 20, 'deathfinal', 'okay.png').setScale(0.1).setAlpha(0.65).setRotation(0);
                         let okayHandGlow = this.addImage(this.x + 200, this.y + 20, 'deathfinal', 'okay_glow.png').setScale(0.2).setAlpha(0).setRotation(0);
                         okayHand.setDepth(50);
                         okayHandGlow.setDepth(50);
                         let timeDamage = 24 + this.extraAttackDamage
                         let damage = 3 + this.extraAttackDamage;
                         this.attackToStrengthen = undefined;

                         this.summonHand(okayHand, okayHandGlow, 0.28, 1, () => {
                             this.fireTimeAttack(damage, okayHand, () => {
                                 this.redClockTemp.setAlpha(1).setScale(1.27).setDepth(50).setPosition(gameConsts.halfWidth, globalObjects.player.getY());
                                 this.addTween({
                                     targets: this.redClockTemp,
                                     alpha: 0,
                                     scaleX: 1.16,
                                     scaleY: 1.16,
                                     duration: 1000,
                                 })
                                 messageBus.publish("selfTakeDamage", damage);
                                 messageBus.publish('playerAddDelayedDamage', timeDamage);
                             });
                         });
                         this.clearExtraAttackDamage();

                     },
                     finaleFunction: () => {

                     }
                 },
                 {
                     name: "}4x4",
                     chargeAmt: 850,
                     finishDelay: 1000,
                     chargeMult: 2,
                     damage: -1,
                     isBigMove: true,
                     startFunction: () => {
                         this.pulseHand(3);
                         this.attackToStrengthen = 3;
                         this.attackToStrengthenStartDmg = 4;
                     },
                     attackStartFunction: () => {
                         this.fadeOutCurrentHand();
                     },
                     attackFinishFunction: () => {
                         this.attackToStrengthen = undefined;
                         let pokeHand = this.addImage(this.x + 180, this.y + 150, 'deathfinal', 'claw.png').setScale(0.1).setAlpha(0.65).setRotation(0.4);
                         let pokeHandGlow = this.addImage(this.x + 180, this.y + 150, 'deathfinal', 'claw_glow.png').setScale(0.2).setAlpha(0).setRotation(0.4);
                         this.summonHand(pokeHand, pokeHandGlow, 0.4, 0.7, () => {
                             this.fireTwoClaws(4 + this.extraAttackDamage, 4, pokeHand);
                         })
                     },
                     finaleFunction: () => {
                         this.currentAttackSetIndex = 2;
                         this.nextAttackIndex = 0;
                         this.interruptCurrentAttack();
                         this.setAsleep();
                         this.clearPower();
                         this.currentPowerText.visible = false;

                         this.addDelayIfAlive(() => {
                             if (this.currentAttackSetIndex === 5) {
                                 return;
                             }
                             this.rotateSpellCircleTo(2, true, () => {
                                 if (this.currentAttackSetIndex === 5) {
                                     return;
                                 }
                                 this.createOkayPower();
                                 this.addDelayIfAlive(() => {
                                     if (this.currentAttackSetIndex === 5) {
                                         return;
                                     }
                                     messageBus.publish("showCombatText", getLangText('deathFight2plusc'), -30);
                                     this.healFromAttacks = true;
                                     this.addTimeout(() => {
                                         if (this.currentAttackSetIndex === 5) {
                                             return;
                                         }
                                         this.setAwake();
                                         if (this.spellAbsorber) {
                                             this.spellAbsorber.unsubscribe();
                                             this.spellAbsorber = null;
                                         }
                                         this.spellsCastCounter = 0;
                                         if (this.playerSpellCastSub) {
                                             this.playerSpellCastSub.unsubscribe();
                                         }
                                         this.playerSpellCastSub = messageBus.subscribe('playerCastedSpell', () => {
                                             this.playerSpellCastSub.unsubscribe();
                                             this.playerSpellCastSub = null;
                                             messageBus.publish("closeCombatText")
                                         });

                                     }, 2000)
                                 }, 600)
                             });
                         }, 3000)
                     }
                 },
             ],
             [
                 //2
                 {
                     name: "OBSERVING...",
                     chargeAmt: gameVars.isHardMode ? 450 : 600,
                     finishDelay: 3000,
                     damage: 0,
                     isPassive: true,
                     startFunction: () => {
                     },
                     attackStartFunction: () => {
                         // this.fadeOutCurrentHand();
                     },
                     attackFinishFunction: () => {
                     },
                     finaleFunction: () => {

                     }
                 },
                 {
                     name: ";40+#2",
                     chargeAmt: 800,
                     finishDelay: 2000,
                     damage: -1,
                     startFunction: () => {
                         this.pulseHand(0);
                     },
                     attackStartFunction: () => {
                         this.fadeOutCurrentHand();
                     },
                     attackFinishFunction: () => {
                         let palmHand = this.addImage(this.x - 180, this.y - 50, 'deathfinal', 'palm.png').setScale(0.1).setAlpha(0.65);
                         let palmHandGlow = this.addImage(this.x - 180, this.y - 50, 'deathfinal', 'palm_glow.png').setScale(0.2).setAlpha(0);
                         let finalDamage = 40 + this.extraAttackDamage;
                         this.summonHand(palmHand, palmHandGlow, 0.2, 0.7, () => {
                             this.firePalm(finalDamage, palmHand, 2);
                         }, 3)
                     },
                 },
                 {
                     name: "}16x2",
                     chargeAmt: 650,
                     finishDelay: 2500,
                     damage: -1,
                     startFunction: () => {
                         this.pulseHand(1);
                     },
                     attackStartFunction: () => {
                         this.fadeOutCurrentHand();
                     },
                     attackFinishFunction: () => {
                         let pokeHand = this.addImage(this.x - 180, this.y - 50, 'deathfinal', 'poke.png').setScale(0.1).setAlpha(0.65);
                         let pokeHandGlow = this.addImage(this.x - 180, this.y - 50, 'deathfinal', 'poke_glow.png').setScale(0.2).setAlpha(0);
                         this.summonHand(pokeHand, pokeHandGlow, 0.26, 0.6, () => {
                             this.fireTwoPokes(16, pokeHand);
                         })
                     },
                 },
                 {
                     name: "|4x6",
                     chargeAmt: 850,
                     finishDelay: 1000,
                     chargeMult: 1.6,
                     damage: -1,
                     startFunction: () => {
                         this.pulseHand(3);
                     },
                     attackStartFunction: () => {
                         this.fadeOutCurrentHand();
                     },
                     attackFinishFunction: () => {
                         let pokeHand = this.addImage(this.x + 180, this.y + 150, 'deathfinal', 'claw.png').setScale(0.1).setAlpha(0.65).setRotation(0.4);
                         let pokeHandGlow = this.addImage(this.x + 180, this.y + 150, 'deathfinal', 'claw_glow.png').setScale(0.2).setAlpha(0).setRotation(0.4);
                         this.summonHand(pokeHand, pokeHandGlow, 0.4, 0.7, () => {
                             this.fireTwoClaws(4, 6, pokeHand);
                         })
                     },
                     finaleFunction: () => {
                         if (this.currentAttackSetIndex === 5) {
                             return;
                         }
                         this.currentAttackSetIndex = 3;
                         this.nextAttackIndex = 0;
                         this.interruptCurrentAttack();
                         this.setAsleep();
                         this.addDelayIfAlive(() => {
                             this.healFromAttacks = false;
                             this.clearPower();
                             if (this.currentAttackSetIndex === 5) {
                                 return;
                             }
                             this.rotateSpellCircleTo(3, true, () => {
                                 // this.fadeOutCurrentHand();
                                 if (this.currentAttackSetIndex === 5) {
                                     return;
                                 }
                                 this.createClawPower();
                                 this.addDelayIfAlive(() => {
                                     if (this.currentAttackSetIndex === 5) {
                                         this.clearPower();
                                         return;
                                     }
                                     messageBus.publish("showCombatText", getLangText('deathFight2plusd'), -30);
                                     this.addTimeout(() => {
                                         this.setAwake();
                                         if (this.spellAbsorber) {
                                             this.spellAbsorber.unsubscribe();
                                             this.spellAbsorber = null;
                                         }
                                         this.spellsCastCounter = 0;
                                         if (this.playerSpellCastSub) {
                                             this.playerSpellCastSub.unsubscribe();
                                         }
                                         this.playerSpellCastSub = messageBus.subscribe('playerCastedSpell', () => {
                                             this.playerSpellCastSub.unsubscribe();
                                             this.playerSpellCastSub = null;
                                             messageBus.publish("closeCombatText")
                                         });
                                     }, 1800)
                                 }, 600)
                             });
                         }, 3000)
                     }
                 },
             ],
             [
                 //3
                 {
                     name: ";40+#3",
                     chargeAmt: 850,
                     chargeMult: 2,
                     finishDelay: 2000,
                     damage: -1,
                     isBigMove: true,
                     startFunction: () => {
                         this.pulseHand(0);
                         this.healFromAttacks = false;
                     },
                     attackStartFunction: () => {
                         this.fadeOutCurrentHand();
                     },
                     attackFinishFunction: () => {
                         this.attackToStrengthen = undefined;
                         let palmHand = this.addImage(this.x - 180, this.y - 50, 'deathfinal', 'palm.png').setScale(0.1).setAlpha(0.65);
                         let palmHandGlow = this.addImage(this.x - 180, this.y - 50, 'deathfinal', 'palm_glow.png').setScale(0.2).setAlpha(0);
                         let finalDamage = 40 + this.extraAttackDamage;
                         this.summonHand(palmHand, palmHandGlow, 0.2, 0.7, () => {
                             this.firePalm(finalDamage, palmHand, 3);
                         }, 3)
                     },
                 },
                 {
                     name: "}18x2",
                     chargeAmt: 700,
                     chargeMult: 2,
                     finishDelay: 2000,
                     damage: -1,
                     isBigMove: true,
                     startFunction: () => {
                         this.pulseHand(1);
                     },
                     attackStartFunction: () => {
                         this.fadeOutCurrentHand();
                     },
                     attackFinishFunction: () => {
                         let pokeHand = this.addImage(this.x - 180, this.y - 50, 'deathfinal', 'poke.png').setScale(0.1).setAlpha(0.65);
                         let pokeHandGlow = this.addImage(this.x - 180, this.y - 50, 'deathfinal', 'poke_glow.png').setScale(0.2).setAlpha(0);
                         this.summonHand(pokeHand, pokeHandGlow, 0.26, 0.6, () => {
                             this.fireTwoPokes(18, pokeHand);
                         })
                     },
                 },
                 {
                     name: "}3+$27",
                     chargeAmt: 750,
                     chargeMult: 2,
                     finishDelay: 3000,
                     damage: -1,
                     isBigMove: true,
                     startFunction: () => {
                         this.pulseHand(2);
                     },
                     attackStartFunction: () => {
                         this.fadeOutCurrentHand();
                     },
                     attackFinishFunction: () => {
                         let okayHand = this.addImage(this.x + 190, this.y + 20, 'deathfinal', 'okay.png').setScale(0.1).setAlpha(0.65).setRotation(0);
                         let okayHandGlow = this.addImage(okayHand.x, okayHand.y, 'deathfinal', 'okay_glow.png').setScale(0.2).setAlpha(0).setRotation(0);
                         okayHand.setDepth(50);
                         okayHandGlow.setDepth(50);
                         let timeDamage = 27;
                         let damage = 3;

                         this.summonHand(okayHand, okayHandGlow, 0.28, 1, () => {
                             this.fireTimeAttack(damage, okayHand, () => {
                                 this.redClockTemp.setScale(1.25).setDepth(50).setRotation(-1).setPosition(gameConsts.halfWidth, globalObjects.player.getY());
                                 this.redClockTemp.currAnim = this.addTween({
                                     targets: this.redClockTemp,
                                     rotation: 0,
                                     alpha: "+=0.5",
                                     scaleX: 1.2,
                                     scaleY: 1.2,
                                     ease: 'Cubic.easeIn',
                                     duration: 200,
                                     onComplete: () => {
                                         this.addTween({
                                             targets: this.redClockTemp,
                                             alpha: 0,
                                             duration: 800,
                                         })
                                     }
                                 })
                                 messageBus.publish("selfTakeDamage", damage);
                                 messageBus.publish('playerAddDelayedDamage', timeDamage);
                             });
                         })
                     },
                     finaleFunction: () => {
                         this.currentAttackSetIndex = 4;
                         this.nextAttackIndex = 0;
                         this.interruptCurrentAttack();
                         this.setAsleep();
                         this.addDelayIfAlive(() => {
                             this.clearPower();
                             this.addDelayIfAlive(() => {
                                 fadeAwaySound(this.bgMusic, 1500);
                                 messageBus.publish("showCombatText", getLangText('deathFight2pluse'), -30);
                                 this.addTimeout(() => {
                                     this.setAwake();
                                     this.spellsCastCounter = 0;
                                     if (this.playerSpellCastSub) {
                                         this.playerSpellCastSub.unsubscribe();
                                     }
                                     this.playerSpellCastSub = messageBus.subscribe('playerCastedSpell', () => {
                                         this.playerSpellCastSub.unsubscribe();
                                         this.playerSpellCastSub = null;
                                         messageBus.publish("closeCombatText");
                                     });
                                 }, 1500)
                             }, 600)
                         }, 3000)
                     }
                 },
             ],
             [
                 //4
                 {
                     name: ";100",
                     chargeAmt: 800,
                     finishDelay: 2500,
                     damage: -1,
                     isBigMove: true,
                     startFunction: () => {
                         this.currentPowerText.visible = false;
                         this.bgMusic.stop();
                         this.bgMusic = playMusic('but_never_forgotten_afterthought', 1, false);
                         this.bgMusic.once('complete', () => {
                             this.bgMusic = playMusic('but_never_forgotten', 1, true);
                         });

                         this.pulseSpellCircle(true)
                         this.pulseHand(0);
                     },
                     attackStartFunction: () => {
                         this.fadeOutCurrentHand();
                     },
                     attackFinishFunction: () => {
                         let palmHand = this.addImage(this.x - 180, this.y - 50, 'deathfinal', 'palm.png').setScale(0.1).setAlpha(0.65);
                         let palmHandGlow = this.addImage(this.x - 180, this.y - 50, 'deathfinal', 'palm_glow.png').setScale(0.2).setAlpha(0);
                         let finalDamage = 100;
                         this.summonHand(palmHand, palmHandGlow, 0.18, 0.7, () => {
                             this.firePalm(finalDamage, palmHand, 0);
                         }, 4)
                     },
                 },
                 {
                     name: "}20x3",
                     chargeAmt: 750,
                     finishDelay: 5000,
                     damage: -1,
                     isBigMove: true,
                     startFunction: () => {
                         this.pulseSpellCircle(true)
                         this.pulseHand(1);
                     },
                     attackStartFunction: () => {
                         this.fadeOutCurrentHand();
                     },
                     attackFinishFunction: () => {
                         let pokeHand = this.addImage(this.x - 180, this.y - 50, 'deathfinal', 'poke.png').setScale(0.1).setAlpha(0.65);
                         let pokeHandGlow = this.addImage(this.x - 180, this.y - 50, 'deathfinal', 'poke_glow.png').setScale(0.2).setAlpha(0);
                         this.summonHand(pokeHand, pokeHandGlow, 0.26, 0.6, () => {
                             this.fireTwoPokes(20, pokeHand, true);
                         })
                     },
                 },
                 {
                     name: "}3+$999",
                     chargeAmt: 750,
                     finishDelay: 8000,
                     damage: -1,
                     startFunction: () => {
                         this.pulseSpellCircle(true)
                         this.pulseHand(2);
                     },
                     attackStartFunction: () => {
                         this.fadeOutCurrentHand();
                     },
                     attackFinishFunction: () => {
                         let okayHand = this.addImage(this.x + 200, this.y + 20, 'deathfinal', 'okay.png').setScale(0.1).setAlpha(0.65).setRotation(0.03);
                         let okayHandGlow = this.addImage(this.x + 200, this.y + 20, 'deathfinal', 'okay_glow.png').setScale(0.2).setAlpha(0).setRotation(0.03);
                         okayHand.setDepth(50);
                         okayHandGlow.setDepth(50);
                         let damage = 999;

                         this.summonHand(okayHand, okayHandGlow, 0.28, 1, () => {
                             this.fireTimeAttack(damage, okayHand, () => {
                                 messageBus.publish("selfTakeDamage", 3);
                                 this.countdown(50, 999);
                             });
                         });
                     },
                     finaleFunction: () => {

                     }
                 },
                 {
                     name: "|4x12",
                     chargeAmt: 1000,
                     finishDelay: 6000,
                     chargeMult: 1.5,
                     damage: -1,
                     startFunction: () => {
                         this.pulseSpellCircle(true)
                         this.pulseHand(3);
                     },
                     attackStartFunction: () => {
                         this.fadeOutCurrentHand();
                         this.currentAttackSetIndex = 5;
                         this.nextAttackIndex = 0;
                     },
                     attackFinishFunction: () => {
                         let pokeHand = this.addImage(this.x + 180, this.y + 150, 'deathfinal', 'claw.png').setScale(0.1).setAlpha(0.65).setRotation(0.4);
                         let pokeHandGlow = this.addImage(this.x + 180, this.y + 150, 'deathfinal', 'claw_glow.png').setScale(0.2).setAlpha(0).setRotation(0.4);
                         this.summonHand(pokeHand, pokeHandGlow, 0.4, 0.7, () => {
                             this.fireTwoClaws(4, 12, pokeHand, true);
                         })
                     },
                     finaleFunction: () => {
                         this.showImpatienceFinale();
                     }
                 },
             ],
             [
                 //5
                 {
                     name: ";;;99x9;;;",
                     chargeAmt: 1380,
                     chargeMult: 1.03,
                     finishDelay: 10000,
                     damage: -1,
                     isBigMove: true,
                     startFunction: () => {
                         this.oldStartScale = this.sprite.startScale;
                         this.sprite.startScale = this.sprite.startScale * 0.7;
                        this.lastAttackLingerMult = 0;

                         this.finalArms = [];
                         playSound('death_cast', 0.6).detune = -500;
                         playSound('ringknell', 0.4);
                         for (let i = 0; i < 4; i++) {
                            let startRot = 0.5;
                            let goalRot = 1 + 0.45 * i;
                            let longArm = this.addImage(this.x, this.y + 40, 'deathfinal', 'long_arm.png').setRotation(startRot).setOrigin(0.5, 0.95).setAlpha(0.2).setDepth(-1);
                            this.finalArms.push(longArm);
                             longArm.goalRot = goalRot;
                            this.addTween({
                                targets: longArm,
                                duration: 250,
                                ease: 'Cubic.easeOut',
                                scaleX: 0.85,
                                scaleY: 0.85,
                                alpha: 1
                            })
                            this.addTween({
                                delay: 150 - i * 50,
                                targets: longArm,
                                duration: 1000 + i * 300,
                                rotation: goalRot,
                                ease: 'Cubic.easeInOut'
                            })
                         }

                         for (let i = 0; i < 4; i++) {
                            let startRot = -0.5;
                            let goalRot = -1 - 0.45 * i;
                            let longArm = this.addImage(this.x, this.y + 40, 'deathfinal', 'long_arm.png').setRotation(startRot).setOrigin(0.5, 0.95).setScale(-0.3, 0.3).setAlpha(0.2).setDepth(-1);
                            this.finalArms.push(longArm);
                             longArm.goalRot = goalRot;
                            this.addTween({
                                targets: longArm,
                                duration: 250,
                                ease: 'Cubic.easeOut',
                                scaleX: -0.85,
                                scaleY: 0.85,
                                alpha: 1
                            })
                            this.addTween({
                                delay: 150 - i * 50,
                                targets: longArm,
                                duration: 1000 + i * 300,
                                rotation: goalRot,
                                ease: 'Cubic.easeInOut'
                            })
                         }
                         this.addDelay(() => {
                             this.pulses = [];
                             for (let i in this.finalArms) {
                                 let arm = this.finalArms[i];
                                 let pulsePosX = arm.x + Math.sin(arm.goalRot) * 217;
                                 let pulsePosY = arm.y - Math.cos(arm.goalRot) * 217;
                                 let pulseCircle = this.addImage(pulsePosX, pulsePosY, 'blurry', 'pulser.png').setAlpha(0.1).setScale(2).setDepth(-1);
                                 this.pulses.push(pulseCircle);
                             }
                             playSound('heartbeatfast');
                             this.runPulses(this.pulses, 2)
                         }, 1800)
                         this.lastAttackLingerMult = 24;
                     },
                     attackStartFunction: () => {
                         this.interruptCurrentAttack();
                         this.setAsleep();
                        this.launchSuperHands();
                     },
                     finaleFunction: () => {

                     }
                 },
                 {
                     name: "...",
                     chargeAmt: 1200,
                     finishDelay: 5000,
                     damage: -1,

                 },
             ]
         ];
     }

     launchSuperHands() {
         if (!this.finalHands) {
             return;
         }
         let extraDelay = 0;
         this.reapHand = this.addSprite(0, 0, 'deathfinal', 'claw_glow.png').setAlpha(0).setDepth(1000);
         for (let i = 0; i < this.finalHands.length; i++) {
             if ( i >= 5) {
                 extraDelay += 125;
             }
             let rotateDelay = 800 - (i % 4) * 200;
             this.addTween({
                 targets: this.finalHands[i],
                 delay: rotateDelay,
                 rotation: 0,
                 duration: 400,
                 alpha: 1,
                 ease: 'Cubic.easeIn',
                 onComplete: () => {
                     playSound('matter_enhance', 0.7).detune = -800 + Math.floor(rotateDelay * 0.3);
                 },
             })

             this.addDelayIfAlive(() => {
                 this.fireNextSuperHand(i >= 4)
             }, 1000 + i * 925 + extraDelay)
         }
         this.addDelayIfAlive(() => {
             if (globalObjects.player.isDead()) {
                 return;
             }
             this.sprite.visible = false;
             this.fakeDeath = this.addImage(this.sprite.x, this.sprite.y, 'deathfinal', 'death2final.png').setScale(this.sprite.scaleX);
             this.fakeDeath.setOrigin(0.5, 0.41);

             this.haloBreathTween.stop();

             this.stopHalo = true;
             this.addTween({
                 targets: [this.deathhalo1, this.deathhalo2, this.circleHalo],
                 alpha: 0,
                 duration: 900,
                 ease: 'Cubic.easeOut',
                 onComplete: () => {
                     this.deathhalo1.visible = false;
                     this.deathhalo2.visible = false;
                     this.circleHalo.visible = false;
                 }
             })
             this.addTween({
                 targets: this.fakeDeath,
                 rotation: 0.5,
                 scaleX: this.sprite.scaleX * 0.9,
                 scaleY: this.sprite.scaleY * 0.9,
                 duration: 700,
                 ease: 'Cubic.easeInOut',
                 onComplete: () => {
                     playSound('swish', 0.5);
                     playSound('deep_swish');

                     this.addTween({
                         targets: this.fakeDeath,
                         rotation: "-=19.6",
                         y: globalObjects.player.getY() - 330,
                         scaleX: 1.8,
                         scaleY: 1.8,
                         duration: 1400,
                         ease: 'Cubic.easeIn',
                         onComplete: () => {
                             messageBus.publish("selfTakeDamage", 99);
                             playSound('death_attack', 1);
                             playSound('punch', 1);
                             this.createScytheAttackSfx();
                             this.addTween({
                                 targets: this.fakeDeath,
                                 delay: 750,
                                 rotation: 0,
                                 scaleX: this.sprite.scaleX,
                                 scaleY: this.sprite.scaleY,
                                 y: this.sprite.startY,
                                 ease: 'Cubic.easeInOut',
                                 duration: 1800,
                                 completeDelay: 700,
                                 onComplete: () => {
                                     if (!globalObjects.player.isDead()) {
                                         this.secondDie();
                                     }
                                 }
                             })
                         }
                     })
                 }
             })
         }, 1000 + 8 * 1000);
     }

     createScytheAttackSfx(flipped) {
         let darkScreen = PhaserScene.add.image(gameConsts.halfWidth, gameConsts.halfHeight, 'blackPixel').setScale(500).setDepth(980).setAlpha(1.1)
         if (!this.scytheBlur) {
             this.scytheBlur = PhaserScene.add.image(gameConsts.halfWidth, this.y + 125, 'blurry', 'scytheblur.png').setDepth(1002).setBlendMode(Phaser.BlendModes.LIGHTEN)
         }

         let flipScale = flipped ? -1 : 1;
         this.scytheBlur.setAlpha(1.1).setScale(flipScale, 1).setRotation(-0.15);
         PhaserScene.tweens.add({
             targets: [darkScreen],
             alpha: 0,
             duration: 1200,
             ease: 'Quad.easeOut',
             onComplete: () => {
                 darkScreen.destroy();
             }
         });
         PhaserScene.tweens.add({
             targets: [this.scytheBlur],
             alpha: 0,
             scaleX: 1.02*flipScale,
             scaleY: 1.01,
             ease: 'Cubic.easeOut',
             duration: 700,
         });
     }

     fireNextSuperHand(isHeavy) {
         if (!this.finalHands || this.finalHands.length === 0 || this.isDefeated) {
             return;
         }
        let nextHand = this.finalHands.pop();
         nextHand.setDepth(100);
        let isFlipped = nextHand.scaleX < 0;
        let isFlippedMult = isFlipped ? -1 : 1;

        let scaleMult = nextHand.frame.name == 'claw.png' ? 1.4 : 1;

         this.addTween({
             targets: nextHand,
             duration: 250,
             alpha: 0.7,
             ease: 'Cubic.easeOut',
             onComplete: () => {
                 this.addTween({
                     targets: nextHand,
                     duration: 300,
                     alpha: 1,
                     ease: 'Cubic.easeIn',
                 })
             }
         })
         this.addTween({
             targets: nextHand,
             duration: 300,
             scaleX: 0.45 * isFlippedMult * scaleMult,
             scaleY: 0.45 * scaleMult,
             ease: 'Quart.easeInOut',
             onComplete: () => {
                 this.addTween({
                     targets: nextHand,
                     duration: isHeavy ? 350 : 300,
                     x: gameConsts.halfWidth - 15,
                     y: globalObjects.player.getY() - 215,
                     scaleX: 1.03 * isFlippedMult * scaleMult,
                     scaleY: 1.03 * scaleMult,
                     ease: 'Quart.easeIn',
                     onComplete: () => {
                         messageBus.publish("selfTakeDamage", 99);
                         if (isHeavy) {
                             let glowName = nextHand.frame.name.substring(0, nextHand.frame.name.length - 4) + "_glow" + ".png";
                             let glowScale = nextHand.scaleX * 2;
                             // if (glowName == 'claw_glow.png') {
                             //     glowScale *= 1.4;
                             // }
                             this.reapHand.setAlpha(1).setPosition(nextHand.x, nextHand.y).setScale(glowScale, Math.abs(glowScale)).setFrame(glowName);
                             this.createScytheAttackSfx(this.finalHands.length % 2 == 0);
                             this.addTween({
                                 targets: this.reapHand,
                                 alpha: 0,
                                 ease: "Quad.easeIn",
                                 duration: 450
                             });
                         } else {
                             nextHand.setScale(1.1 * isFlippedMult * scaleMult, 1.1 * scaleMult);
                             this.addTween({
                                 targets: nextHand,
                                 duration: 50,
                                 scaleX: 1.04 * isFlippedMult * scaleMult,
                                 scaleY: 1.04 * scaleMult,
                                 ease: 'Quart.easeOut',
                             })
                         }




                         this.bgMain.setAlpha(isHeavy ? 0 : 0.75);
                         this.addTween({
                             targets: this.bgMain,
                             alpha: 1,
                             ease: "Quad.easeOut",
                             duration: 700
                         });
                         screenShake(7);
                         playSound('body_slam', isHeavy ? 0.5 : 0.6);
                         if (isHeavy) {
                             playSound('death_attack', 1);
                         } else {
                             playSound('rock_crumble', 0.7);
                             playSound('shield_block', 0.7).detune = -800;
                         }

                         let dmgEffect = poolManager.getItemFromPool('brickPattern2')
                         if (!dmgEffect) {
                             dmgEffect = this.addImage(gameConsts.halfWidth, globalObjects.player.getY() - 120, 'spells', 'brickPattern2.png').setDepth(998).setScale(0.9);
                         }
                         dmgEffect.setDepth(998).setScale(0.95).setAlpha(0.9).setPosition(gameConsts.halfWidth, globalObjects.player.getY() - 120);
                         this.addTween({
                             targets: dmgEffect,
                             rotation: 1,
                             alpha: 0,
                             duration: 800,
                         });
                         this.addTween({
                             targets: nextHand,
                             duration: 100,
                             y: "-=30",
                             scaleX: nextHand.scaleX * 0.9,
                             scaleY: nextHand.scaleY * 0.9,
                             ease: "Back.easeOut",
                             completeDelay: 400,
                             onComplete: () => {
                                 this.addTween({
                                     delay: 100,
                                     targets: nextHand,
                                     duration: 300,
                                     y: this.y + 150,
                                     alpha: 0.4,
                                     ease: "Cubic.easeIn",
                                     scaleX: 0.75 * isFlippedMult,
                                     scaleY: 0.75,
                                     onComplete: () => {
                                         this.addTween({
                                             targets: nextHand,
                                             duration: 150,
                                             alpha: 0,
                                             scaleX: 1 * isFlippedMult,
                                             scaleY: 1,
                                             ease: 'Quint.easeOut',
                                             onComplete: () => {
                                                 nextHand.destroy();
                                             }
                                         })
                                     }
                                 })
                             }
                         })
                     }
                 })
             }
         })

     }


     createEightHands(arr) {
         if (this.isDefeated) {
             return;
         }
         this.finalHands = [];

         let handToUse = ['palm.png', 'poke.png', 'okay.png', 'claw.png'];
         let glowToUse = ['palm_glow.png', 'poke_glow.png', 'okay_glow.png', 'claw_glow.png'];

         for (let i in arr) {
             let img = arr[i];
             let scale = handToUse[i % 4] == 'claw.png' ? 1.42 : 1;
             let flip = (handToUse[i % 4] == 'claw.png' || handToUse[i % 4] == 'okay.png') ? 1 : -1;
             if (i >= 4) {
                 flip *= -1;
             }
             let xPos = img.x * 0.95 + this.sprite.x * 0.05;
             let yPos = img.y * 0.92 + this.sprite.y * 0.08;
             let newHand = this.addImage(xPos, yPos, 'deathfinal', handToUse[i % 4]).setScale(flip * scale, scale).setAlpha(0);
             this.finalHands.push(newHand);
             newHand.rotation = this.finalArms[this.finalHands.length - 1].rotation;

             this.addTween({
                 targets: newHand,
                 scaleX: 0.3 * flip * scale,
                 scaleY: 0.3 * scale,
                 duration: 500,
                 ease: 'Cubic.easeIn',
                 onComplete: () => {
                     playSound('stomp', 0.95);
                     playSound('rock_crumble', 0.7);
                     let newGlow = this.addImage(newHand.x, newHand.y, 'deathfinal', glowToUse[i % 4]).setScale(0.605 * flip * scale, 0.605 * scale).setAlpha(0.9);
                     this.addTween({
                         targets: newGlow,
                         alpha: 0,
                         ease: 'Quad.easeOut',
                         duration: 750,
                         onComplete: () => {
                             newGlow.destroy();
                         }
                     })
                 }
             })
         }

         this.addTween({
             targets: this.finalHands,
             alpha: 0.9,
             duration: 500,
             ease: 'Cubic.easeIn',
             onComplete: () => {
                 this.addTween({
                     targets: this.finalHands,
                     alpha: 0.8,
                     duration: 400,
                 });
                 zoomTemp(1.02);
                 screenShakeLong(8);
                 this.addTween({
                     targets: this.finalArms,
                     alpha: 0,
                     duration: 600,
                     onComplete: () => {
                         for (let i in this.finalArms) {
                             this.finalArms[i].destroy();
                         }
                     }
                 })
             }
         })
     }

     runPulses(arr, num) {
         if (num <= 0) {
             this.createEightHands(arr);
             for (let i in arr) {
                 arr[i].destroy();
             }
             return;
         }
         playSound('deep_swish');
         this.addTween({
             targets: arr,
             scaleX: 1.1,
             scaleY: 1.1,
             ease: 'Quad.easeIn',
             alpha: 1,
             duration: 350,
             onComplete: () => {
                 this.addTween({
                     targets: arr,
                     scaleX: 0.2,
                     scaleY: 0.2,
                     ease: 'Quad.easeOut',
                     alpha: 0.2,
                     duration: 325,
                     onComplete: () => {
                         for (let i in arr) {
                             arr[i].setScale(2)
                         }
                         this.runPulses(arr, num-1)
                     }
                 })
             }
         })
     }

     /*
                      {
                     name: "$28",
                     chargeAmt: 550,
                     finishDelay: 2000,
                     damage: -1,
                     startFunction: () => {
                         this.attackToStrengthen = 2;
                         this.attackToStrengthenStartDmg = 24;
                         this.pulseHand(2);
                     },
                     attackStartFunction: () => {
                         this.fadeOutCurrentHand();
                     },
                     attackFinishFunction: () => {
                         let okayHand = this.addImage(this.x + 200, this.y + 20, 'deathfinal', 'okay.png').setScale(0.1).setAlpha(0.65).setRotation(0);
                         let okayHandGlow = this.addImage(this.x + 200, this.y + 20, 'deathfinal', 'okay_glow.png').setScale(0.2).setAlpha(0).setRotation(0);
                         okayHand.setDepth(50);
                         okayHandGlow.setDepth(50);
                         let damage = 28 + this.extraAttackDamage;
                         this.attackToStrengthen = undefined;

                         this.summonHand(okayHand, okayHandGlow, 0.28, 1, () => {
                             this.fireTimeAttack(damage, okayHand, () => {
                                 this.redClockTemp = this.addImage(gameConsts.halfWidth, globalObjects.player.getY(), 'enemies', 'red_clock_back_large_red.png');
                                 this.redClockTemp.setAlpha(1).setScale(1.27).setDepth(50);
                                 this.addTween({
                                     targets: this.redClockTemp,
                                     alpha: 0,
                                     scaleX: 1.16,
                                     scaleY: 1.16,
                                     duration: 1000,
                                 })
                                 messageBus.publish('playerAddDelayedDamage', damage);
                             });
                         });
                         this.clearExtraAttackDamage();

                     },
                     finaleFunction: () => {

                     }
                 },
      */

     setHealth(newHealth, isTrue) {
         if (this.shieldAmts > 0 && !isTrue) {
             this.damageHandShield();
             super.setHealth(this.health);
             return;
         } else {
             super.setHealth(newHealth);
         }

         let currHealthPercent = this.health / this.healthMax;
         if (currHealthPercent == 0) {
             // dead, can't do anything
             return;
         } else {
             let prevHealthPercent = this.prevHealth / this.healthMax;
             if (this.health <= 111 && this.prevHealth > 111 && !this.shownFinale) {
                 this.shownFinale = true;
                 this.showHurtFinale();
             }
         }
     }

     reactToDamageTypes(amt, isAttack, type) {
         if (this.healFromAttacks && isAttack && amt >= 1) {
             this.addExtraHeal();
         }
         return super.reactToDamageTypes(amt, isAttack, type);
     }

     clearHandObjects() {
         for (let i = 0; i < this.handObjects.length; i++) {
             let currObj = this.handObjects[i];
             currObj.visible = false;
         }
     }

     emergencyShield() {
         if (this.currentPowerText) {
             this.currentPowerText.visible = false;
         }
         if (this.playerSpellCastSub) {
             this.playerSpellCastSub.unsubscribe();
             this.playerSpellCastSub = null;
             messageBus.publish("closeCombatText")
         }
         if (this.spellAbsorber) {
             this.spellAbsorber.unsubscribe();
             this.spellAbsorber = null;
         }
        if (this.currentPowerHand) {
            this.currentPowerHand.visible = false;
        }

         this.healFromAttacks = false;
         this.interruptCurrentAttack();
         this.clearHandObjects();
         playSound('slice_in');
         this.createHandShield(10, true);
         this.currentAttackSetIndex = 5;
         this.nextAttackIndex = 0;
         this.setAsleep();
     }

     summonHand(hand, glow, scaleAmt = 0.26, goalAlpha = 0.6, onComplete, enlargeTimes = 2) {
        this.currentRockHand = hand;
         let startAlpha = hand.alpha;
         for (let i = 0; i < enlargeTimes; i++) {
             let pebbles = getTempPoolObject('blurry', 'rock_rush.png', 'rockRush', 800);
             pebbles.setPosition(hand.x, hand.y).setAlpha(0).setScale(1);
             this.addTween({
                 delay: i * 350,
                 targets: pebbles,
                 duration: 350,
                 ease: 'Quad.easeIn',
                 scaleX: 0.15,
                 scaleY: 0.15,
                 onStart: () => {
                     playSound('matter_strike_heavy',0.9 - 0.05 * i).detune = -100 * i * i;
                 }
             })
             this.addTween({
                 delay: i * 350,
                 targets: pebbles,
                 duration: 200,
                 ease: 'Quad.easeOut',
                 alpha: 1,
                 onComplete: () => {
                     let scaleGoal = (i + 1) * scaleAmt;
                     this.addTween({
                         targets: [hand],
                         alpha: startAlpha * 0.5 - (i * 0.25) + goalAlpha * 0.5 + (i * 0.25),
                         duration: 150,
                         ease: 'Quad.easeIn',
                         scaleX: scaleGoal,
                         scaleY: scaleGoal,
                         onComplete: () => {
                             if (i == enlargeTimes - 1) {
                                 glow.setAlpha(0.8).setScale(scaleGoal * 2)
                                 this.addTween({
                                     targets: glow,
                                     alpha: 0,
                                     duration: 500,
                                     onComplete: () => {
                                         glow.destroy();
                                        onComplete();
                                     }
                                 })
                             }
                         }
                     })
                     this.addTween({
                         targets: pebbles,
                         duration: 150,
                         ease: 'Quad.easeOut',
                         alpha: 0,
                     })
                 }
             })
         }
     }

     firePalm(damage, palmHand, shields = 1) {
         let isExtraLarge = damage > 80;
         palmHand.setDepth(40);
         this.addTween({
             targets: palmHand,
             duration: 400,
             alpha: 1,
             ease: 'Cubic.easeOut',
         })
         this.addTween({
             targets: palmHand,
             duration: isExtraLarge ? 550 : 500,
             x: gameConsts.halfWidth - 15,
             y: globalObjects.player.getY() - 215,
             scaleX: isExtraLarge ? 1.15 : 1,
             scaleY: isExtraLarge ? 1.15 : 1,
             ease: 'Quart.easeIn',
             onComplete: () => {
                 messageBus.publish("selfTakeDamage", damage);
                 this.bgMain.setAlpha(0.75);
                 this.addTween({
                     targets: this.bgMain,
                     alpha: 1,
                     ease: "Quad.easeOut",
                     duration: 800
                 })
                 screenShake(7);
                 playSound('body_slam', 0.6);
                 playSound('rock_crumble', 0.7);
                 playSound('shield_block', 0.8).detune = -800;
                 let dmgEffect = poolManager.getItemFromPool('brickPattern2')
                 if (!dmgEffect) {
                     dmgEffect = this.addImage(gameConsts.halfWidth, globalObjects.player.getY() - 120, 'spells', 'brickPattern2.png').setDepth(998).setScale(0.9);
                 }
                 dmgEffect.setDepth(998).setScale(0.95).setAlpha(0.9).setPosition(gameConsts.halfWidth, globalObjects.player.getY() - 120);
                 this.addTween({
                     targets: dmgEffect,
                     rotation: 1,
                     alpha: 0,
                     duration: 800,
                 });
                 this.addTween({
                     targets: palmHand,
                     duration: isExtraLarge ? 200 : 150,
                     y: "-=30",
                     scaleX: "-=0.14",
                     scaleY: "-=0.14",
                     ease: "Back.easeOut",
                     completeDelay: 400,
                     onComplete: () => {
                         this.addTween({
                             delay: isExtraLarge ? 350 : 300,
                             targets: palmHand,
                             duration: 500,
                             y: this.y + 150,
                             alpha: 0.4,
                             ease: "Cubic.easeIn",
                             scaleX: isExtraLarge ? 0.75 : 0.65,
                             scaleY: isExtraLarge ? 0.75 : 0.65,
                             onStart: () => {
                                 playSound('whoosh', 0.8).setSeek(0.1);
                                 if (shields >= 1) {
                                     this.addDelayIfAlive(() => {
                                         this.createHandShield(shields);
                                     }, 200);
                                 }
                             },
                             onComplete: () => {

                                 this.addTween({
                                     targets: palmHand,
                                     duration: 150,
                                     alpha: 0,
                                     scaleX: 1,
                                     scaleY: 1,
                                     ease: 'Quint.easeOut',
                                 })
                             }
                         })
                     }
                 })
             }
         })
     }


     fireTwoPokes(damage, pokeHand, hasExtraPoke = false) {
         pokeHand.setDepth(40);
         this.addTween({
             targets: pokeHand,
             duration: 400,
             alpha: 1,
             ease: 'Cubic.easeOut',
         })
         this.addTween({
             targets: pokeHand,
             duration: 500,
             x: gameConsts.halfWidth - 15,
             y: globalObjects.player.getY() - 215,
             scaleX: 1,
             scaleY: 1,
             ease: 'Quart.easeIn',
             onComplete: () => {
                 messageBus.publish("selfTakeDamage", damage);
                 this.bgMain.setAlpha(0.75);
                 this.addTween({
                     targets: this.bgMain,
                     alpha: 1,
                     ease: "Quad.easeOut",
                     duration: 800
                 })
                 screenShake(6);
                 playSound('body_slam')
                 let dmgEffect = poolManager.getItemFromPool('brickPattern2')
                 if (!dmgEffect) {
                     dmgEffect = this.addImage(gameConsts.halfWidth, globalObjects.player.getY() - 120, 'spells', 'brickPattern2.png').setDepth(998).setScale(0.75);
                 }
                 dmgEffect.setDepth(998).setScale(0.88).setAlpha(0.8).setPosition(gameConsts.halfWidth, globalObjects.player.getY() - 120);
                 this.addTween({
                     targets: dmgEffect,
                     rotation: 1,
                     alpha: 0,
                     duration: 750,
                 });
                 this.addTween({
                     delay: 250,
                     targets: pokeHand,
                     duration: 500,
                     y: globalObjects.player.getY() - 305,
                     ease: "Cubic.easeInOut",
                     scaleX: 0.7,
                     scaleY: 0.7,
                     onComplete: () => {
                         this.addTween({
                             targets: pokeHand,
                             duration: 400,
                             y: globalObjects.player.getY() - 215,
                             scaleX: 1,
                             scaleY: 1,
                             ease: 'Quint.easeIn',
                             onComplete: () => {
                                 let hitEffect = getTempPoolObject('blurry', 'pulser.png', 'pulser', 1100);
                                 hitEffect.setPosition(gameConsts.halfWidth, globalObjects.player.getY() - 220).setDepth(pokeHand.depth + 1).setScale(0.3, 0.15).setVisible(true);
                                 this.addTween({
                                     targets: hitEffect,
                                     scaleX: 3.5,
                                     scaleY: 1.75,
                                     ease: 'Quint.easeOut',
                                     duration: 900,
                                 });
                                 this.addTween({
                                     targets: hitEffect,
                                     alpha: 0,
                                     duration: 900,
                                     ease: 'Quad.easeOut'
                                 });

                                 messageBus.publish("selfTakeDamage", damage);
                                 screenShake(7);
                                 playSound('body_slam');
                                 this.bgMain.setAlpha(0.75);
                                 this.addTween({
                                     targets: this.bgMain,
                                     alpha: 1,
                                     ease: "Quad.easeOut",
                                     duration: 800
                                 })
                                 dmgEffect.setDepth(998).setScale(1).setAlpha(0.8).setPosition(gameConsts.halfWidth, globalObjects.player.getY() - 120);
                                 this.addTween({
                                     targets: dmgEffect,
                                     rotation: 2.2,
                                     alpha: 0,
                                     duration: 800,
                                     onComplete: () => {
                                         poolManager.returnItemToPool(dmgEffect, 'brickPattern2');
                                     }
                                 });
                                 if (hasExtraPoke) {
                                     this.addTween({
                                         delay: 100,
                                         targets: pokeHand,
                                         duration: 700,
                                         y: globalObjects.player.getY() - 335,
                                         rotation: "+=6.2832",
                                         ease: "Cubic.easeInOut",
                                         scaleX: 0.7,
                                         scaleY: 0.7,
                                         onComplete: () => {
                                             this.addTween({
                                                 delay: 50,
                                                 targets: pokeHand,
                                                 duration: 275,
                                                 y: globalObjects.player.getY() - 215,
                                                 scaleX: 1,
                                                 scaleY: 1,
                                                 ease: 'Quint.easeIn',
                                                 onComplete: () => {
                                                     let hitEffect = getTempPoolObject('blurry', 'pulser.png', 'pulser', 1100);
                                                     hitEffect.setPosition(gameConsts.halfWidth, globalObjects.player.getY() - 220).setDepth(pokeHand.depth + 1).setScale(0.3, 0.15).setVisible(true);
                                                     this.addTween({
                                                         targets: hitEffect,
                                                         scaleX: 3.5,
                                                         scaleY: 1.75,
                                                         ease: 'Quint.easeOut',
                                                         duration: 900,
                                                     });
                                                     this.addTween({
                                                         targets: hitEffect,
                                                         alpha: 0,
                                                         duration: 900,
                                                         ease: 'Quad.easeOut'
                                                     });

                                                     messageBus.publish("selfTakeDamage", damage);
                                                     screenShake(7);
                                                     playSound('body_slam');
                                                     this.bgMain.setAlpha(0.75);
                                                     this.addTween({
                                                         targets: this.bgMain,
                                                         alpha: 1,
                                                         ease: "Quad.easeOut",
                                                         duration: 800
                                                     })
                                                     dmgEffect.setDepth(998).setScale(1).setAlpha(0.8).setPosition(gameConsts.halfWidth, globalObjects.player.getY() - 120);
                                                     this.addTween({
                                                         targets: dmgEffect,
                                                         rotation: 2.2,
                                                         alpha: 0,
                                                         duration: 800,
                                                         onComplete: () => {
                                                             poolManager.returnItemToPool(dmgEffect, 'brickPattern2');
                                                         }
                                                     });
                                                     this.addTween({
                                                         delay: 600,
                                                         targets: pokeHand,
                                                         duration: 400,
                                                         y: globalObjects.player.getY() - 240,
                                                         scaleX: 0.9,
                                                         scaleY: 0.9,
                                                         alpha: 0,
                                                         ease: 'Quart.easeIn',
                                                         onComplete: () => {
                                                             pokeHand.destroy();
                                                         }
                                                     })
                                                 }
                                             });
                                         }
                                     });
                                 } else {
                                     this.addTween({
                                         delay: 600,
                                         targets: pokeHand,
                                         duration: 400,
                                         y: globalObjects.player.getY() - 240,
                                         scaleX: 0.9,
                                         scaleY: 0.9,
                                         alpha: 0,
                                         ease: 'Quart.easeIn',
                                         onComplete: () => {
                                             pokeHand.destroy();
                                         }
                                     })
                                 }

                             }
                         })
                     }
                 })
             }
         })
     }

     fireTimeAttack(damage, okayHand, attackFunc) {
         this.addTween({
             targets: okayHand,
             rotation: 0,
             duration: 500,
             ease: 'Cubic.easeInOut'
         })
         let blackBG = getBackgroundBlackout();
         blackBG.setDepth(okayHand.depth - 1).setAlpha(0);
         let flash = this.addImage(okayHand.x - 40, okayHand.y - 2, 'blurry', 'flash.webp');
         flash.setPosition(okayHand.x - 45, okayHand.y - 2).setScale(0.1).setDepth(okayHand.depth + 1).setAlpha(1).setRotation(-0.8);
         let starBlack = this.addImage(okayHand.x - 40, okayHand.y - 2, 'lowq', 'star_black.png').setAlpha(0.1).setScale(0.75).setDepth(-1);
         this.addTween({
             targets: starBlack,
             alpha: 0.5,
             scaleX: 1.5,
             scaleY: 1.5,
             duration: 700,
             ease: 'Quad.easeOut',
             onComplete: () => {
                 this.addTween({
                     targets: starBlack,
                     alpha: 0,
                     scaleX: 1.3,
                     scaleY: 1.3,
                     duration: 900,
                     ease: 'Quad.easeIn',
                     onComplete: () => {
                         starBlack.destroy();
                     }
                 });
             }
         });
         this.addTween({
             targets: okayHand,
             alpha: 1,
             duration: 300,
         });
         this.addTween({
             targets: flash,
             rotation: 3,
             duration: 1500,
             ease: 'Quad.easeInOut'
         });
         this.addTween({
             targets: blackBG,
             alpha: 0.4,
             duration: 1800,
             ease: 'Quad.easeOut',
         });
         this.addTween({
             targets: flash,
             scaleX: 2.5,
             scaleY: 2.5,
             duration: 700,
             ease: 'Quad.easeIn',
             onComplete: () => {
                 this.addTween({
                     targets: flash,
                     scaleX: 0,
                     scaleY: 0,
                     duration: 700,
                     ease: 'Quad.easeOut',
                     onComplete: () => {
                         let pulser = getTempPoolObject('circle', 'blastEffect1.png', 'blastEffect', 1300);
                         //let pulser2 = getTempPoolObject('blurry', 'pulser.png', 'pulser', 600);
                         //pulser2.setPosition(flash.x, flash.y).setDepth(okayHand.depth + 1).setScale(0.5, 0.5).setVisible(true).setAlpha(0.6);
                         pulser.setPosition(flash.x, flash.y).setDepth(okayHand.depth + 1).setScale(0.6).setVisible(true).setAlpha(0);
                         this.addTween({
                             targets: pulser,
                             alpha: 1.3,
                             scaleX: 0.35,
                             scaleY: 0.35,
                             ease: 'Quint.easeIn',
                             duration: 200,
                             onComplete: () => {
                                 playSound('ringknell', 1).detune = (700);
                                 playSound('water_drop', 0.7);
                                 this.addTween({
                                     targets: pulser,
                                     scaleX: 14,
                                     scaleY: 14,
                                     duration: 750,
                                     ease: 'Quart.easeIn',
                                 });
                                 this.addTween({
                                     targets: pulser,
                                     alpha: 0,
                                     duration: 750,
                                     ease: 'Quint.easeIn',
                                 });

                                 this.addDelayIfAlive(() => {
                                     blackBG.setAlpha(0.75);
                                     if (blackBG.currAnim) {
                                         blackBG.currAnim.stop();
                                     }
                                     blackBG.currAnim = this.addTween({
                                         targets: blackBG,
                                         alpha: 0,
                                         duration: 2000,
                                         ease: 'Quad.easeOut'
                                     });
                                     playSound('time_strike_alt');
                                     playSound('slice_in');
                                     playSound('heartbeatfast');
                                     attackFunc();
                                 }, 550)
                             }
                         });
                         this.addTween({
                             delay: 2000,
                             targets: okayHand,
                             alpha: 0,
                             ease: 'Quad.easeIn',
                             duration: 500,
                             scaleX: 0.5,
                             scaleY: 0.5
                         });
                     }
                 });
             }
         });
     }

     fireTwoClaws(damage, times, handObj, isFast = false) {
         let handStartX = handObj.x;
         let handStartY = handObj.y;

         let handMoveX = gameConsts.halfWidth - 90 - handStartX;
         let handMoveY = globalObjects.player.getY() - 68 - handStartY;
         let rotAmt = 0.8;
         handObj.setDepth(50);
        this.addTween({
            targets: handObj,
            rotation: rotAmt,
            scaleX: handObj.scaleX * 0.65,
            scaleY: handObj.scaleX * 0.65,
            duration: 400,
            ease: 'Quart.easeInOut',
            onComplete: () => {
                playSound('roar').setSeek(0.1);

                this.repeatScratch(damage, times, handObj, handMoveX, handMoveY, isFast, () => {
                    this.addTween({
                        delay: isFast ? 350 : 500,
                        targets: handObj,
                        alpha: 0,
                        scaleX: 0.8,
                        scaleY: 0.8,
                        duration: isFast ? 400 : 500,
                        ease: 'Quad.easeIn',
                        onComplete: () => {
                            handObj.destroy();
                        }
                    })
                });
            }
        })
     }

     playScratchTween(image) {
         this.addTween({
             targets: image,
             scaleX: 1.25,
             scaleY: 2,
             ease: 'Cubic.easeIn',
             duration: 100,
             onComplete: () => {
                 this.addTween({
                     targets: image,
                     scaleX: 1,
                     scaleY: 1,
                     ease: 'Quint.easeOut',
                     duration: 300,
                     onComplete: () => {
                         this.addTween({
                             targets: image,
                             scaleX: 0.2,
                             ease: 'Cubic.easeIn',
                             duration: 500,
                             alpha: 0,
                         })
                     }
                 })
             }
         })
     }

     repeatScratch(damage, times, handObj, handMoveX, handMoveY, isFast, onComplete) {
        let maxScratchAmt = isFast ? 3 : 2;
         this.addDelay(() => {
             let max2Scratch = times >= maxScratchAmt ? maxScratchAmt : times;
             times -= max2Scratch;
             for (let i = 0; i < max2Scratch; i++) {
                 this.addDelayIfAlive(() => {
                     let scratch = getTempPoolObject('deathfinal', 'scratch.png', 'scratch', 1500);
                     scratch.rotation = 0.8;
                     let scratchX = gameConsts.halfWidth + (isFast ? (-70 + 55 * i) : (-40 + 65 * i))
                     let scratchY = globalObjects.player.getY() + (isFast ? (-215 + i * 35) : (-206 + i * 40));
                     scratch.setPosition(scratchX, scratchY);
                     scratch.setScale(0.1, 0.5).setDepth(999);
                     this.playScratchTween(scratch);

                     messageBus.publish("selfTakeDamage", damage);
                     playSound('slice_in')
                 }, i * 45);
             }
             zoomTemp(1.02);
             messageBus.publish('tempPause', 60, 0.5);
         }, 250)
         this.addTween({
             targets: handObj,
             alpha: 1,
             duration: 250,
             ease: 'Quad.easeOut',
         })

         this.addTween({
             targets: handObj,
             scaleX: 1.15,
             scaleY: 1.15,
             alpha: 1,
             duration: 280,
             ease: 'Quad.easeIn',
         })
         this.addTween({
             targets: handObj,
             x: "+=" + handMoveX,
             y: "+=" + handMoveY,
             duration: 280,
             ease: 'Quint.easeIn',
             onComplete: () => {
                 let overshootX = handMoveX * 0.2;
                 let overshootY = handMoveY * 0.2;
                 this.addTween({
                     targets: handObj,
                     duration: 300,
                     alpha: 0,
                 })
                 this.addTween({
                     targets: handObj,
                     x: "+=" + overshootX,
                     y: "+=" + overshootY,
                     duration: isFast ? 280 : 330,
                     ease: 'Quint.easeOut',
                     onComplete: () => {
                         if (times <= 0) {
                             onComplete()
                         } else {
                             handObj.scaleX = -handObj.scaleX;
                             // preparing left swipe
                             this.addTween({
                                 targets: handObj,
                                 x: gameConsts.halfWidth - 170,
                                 y: this.y + 150,
                                 scaleX: -0.65,
                                 scaleY: 0.65,
                                 alpha: 0.75,
                                 duration: isFast ? 250 : 350,
                                 rotation: -handObj.rotation,
                                 ease: 'Quart.easeInOut',
                                 onComplete: () => {
                                     // next swipe
                                     this.addDelay(() => {
                                         let max2Scratch = times >= maxScratchAmt ? maxScratchAmt : times;
                                         times -= max2Scratch;
                                         for (let i = 0; i < max2Scratch; i++) {
                                            this.addDelayIfAlive(() => {
                                                 let scratch = getTempPoolObject('deathfinal', 'scratch.png', 'scratch', 1500);
                                                 scratch.rotation = -0.8;
                                                 let scratchX = gameConsts.halfWidth - (isFast ? (-70 + 55 * i) : (-40 + 65 * i))
                                                 let scratchY = globalObjects.player.getY() + (isFast ? (-215 + i * 35) : (-206 + i * 40));
                                                 scratch.setPosition(scratchX, scratchY);
                                                 scratch.setScale(0.1, 0.5).setDepth(999);
                                                 this.playScratchTween(scratch);

                                                 messageBus.publish("selfTakeDamage", damage);
                                                 playSound('slice_in')
                                            }, i * 60);
                                         }
                                         zoomTemp(1.02);
                                         messageBus.publish('tempPause', 60, 0.5);
                                         this.addTween({
                                             targets: handObj,
                                             duration: isFast ? 280 : 330,
                                             alpha: 0,
                                         })
                                         this.addTween({
                                             targets: handObj,
                                             x: "-=" + overshootX,
                                             y: "+=" + overshootY,
                                             duration: isFast ? 280 : 330,
                                             ease: 'Quint.easeOut',
                                             onComplete: () => {
                                                 if (times <= 0) {
                                                     onComplete()
                                                 } else {
                                                     let handStartX = gameConsts.halfWidth + 170;
                                                     let handStartY = this.y + 150;
                                                     let handMoveX = gameConsts.halfWidth - 90 - handStartX;
                                                     let handMoveY = globalObjects.player.getY() - 68 - handStartY;
                                                     let rotAmt = 0.8;
                                                     handObj.scaleX = Math.abs(handObj.scaleX);
                                                     this.addTween({
                                                         targets: handObj,
                                                         rotation: rotAmt,
                                                         x: handStartX,
                                                         y: handStartY,
                                                         alpha: 0.75,
                                                         scaleX: 0.65,
                                                         scaleY: 0.65,
                                                         duration: isFast ? 260 : 300,
                                                         ease: 'Quart.easeInOut',
                                                         completeDelay: 10,
                                                         onComplete: () => {
                                                             this.repeatScratch(damage, times, handObj, handMoveX, handMoveY, isFast, onComplete);
                                                         }
                                                     })
                                                 }
                                             }
                                         })

                                     }, isFast ? 180 : 250);
                                     this.addTween({
                                         targets: handObj,
                                         scaleX: -1.15,
                                         scaleY: 1.15,
                                         duration: isFast ? 180 : 250,
                                         ease: 'Quad.easeIn'
                                     })
                                     this.addTween({
                                         targets: handObj,
                                         alpha: 1,
                                         duration: isFast ? 180 : 250,
                                         ease: 'Cubic.easeOut'
                                     })
                                     this.addTween({
                                         targets: handObj,
                                         x: "-=" + handMoveX,
                                         y: "+=" + handMoveY,
                                         duration: isFast ? 180 : 250,
                                         ease: 'Quint.easeIn',
                                     });
                                 }
                             })
                         }
                     }
                 })
             }
         });
     }

     countdown(depth, damage) {
         if (this.dead) {
             return;
         }
         this.redClockTemp.setAlpha(0).setScale(1.5).setRotation(-2).setDepth(depth + 1);
         this.addTween({
             targets: this.redClockTemp,
             scaleX: 1.2,
             scaleY: 1.2,
             duration: 500,
             ease: 'Cubic.easeIn',
         })
         this.addTween({
             targets: this.redClockTemp,
             rotation: 0,
             alpha: 0.8,
             duration: 500,
             onComplete: () => {
                 this.redClockTemp.setAlpha(1);
                 this.addTween({
                     targets: this.redClockTemp,
                     alpha: 0.9,
                     duration: 500,
                     ease: 'Cubic.easeOut',
                 });
                 let redClockArmBack = this.addImage(gameConsts.halfWidth, globalObjects.player.getY(), 'enemies', 'red_clock_arm_large.png');
                 let redClockArmFront = this.addImage(gameConsts.halfWidth, globalObjects.player.getY(), 'enemies', 'red_clock_arm_large.png');
                 redClockArmBack.setDepth(1).setAlpha(1).setRotation(Math.PI * 0.5).setScale(1.15).setOrigin(0.5, 1.1);
                 redClockArmFront.setDepth(10001).setAlpha(0.95).setRotation(Math.PI * 0.5).setBlendMode(Phaser.BlendModes.LIGHTEN).setScale(1.15).setOrigin(0.5, 1.1);
                 this.addTween({
                     targets: [redClockArmBack],
                     duration: 500,
                     alpha: 0.8,
                     scaleX: 1.2,
                     scaleY: 1.2
                 });
                 this.addTween({
                     targets: [redClockArmFront],
                     duration: 500,
                     alpha: 0.4,
                     scaleX: 1.2,
                     scaleY: 1.2,
                     onComplete: () => {
                         for (let i = 5; i >= 0; i--) {
                             this.addDelay(() => {
                                 redClockArmBack.setAlpha(1).setRotation(Math.PI * 0.25 * 0.33 * i - 0.04).setScale(1.05);
                                 redClockArmFront.setAlpha(0.75).setRotation(Math.PI * 0.25 * 0.33 * i - 0.04).setScale(1.05);
                                 if (i == 0) {
                                     playSound('death_attack')
                                     messageBus.publish('playerAddDelayedDamage', damage);
                                     screenShake(5);
                                     this.addTween({
                                         targets: [this.redClockTemp, redClockArmBack, redClockArmFront],
                                         alpha: 0,
                                         duration: 1000,
                                     })
                                     this.addTween({
                                         targets: this.redClockTemp,
                                         scaleX: 1.4,
                                         scaleY: 1.4,
                                         ease: 'Quad.easeOut',
                                         duration: 1000,
                                         onComplete: () => {
                                             this.redClockTemp.alpha = 0;
                                             redClockArmBack.destroy();
                                             redClockArmFront.destroy();
                                         }
                                     });
                                     this.bgMain.setAlpha(0.75);
                                     this.addTween({
                                         targets: this.bgMain,
                                         alpha: 1,
                                         duration: 1000,
                                     })
                                 }
                                 this.addTween({
                                     targets: [redClockArmBack, redClockArmFront],
                                     duration: 150,
                                     scaleX: 1.2,
                                     scaleY: 1.2,
                                     rotation: Math.PI * 0.25 * 0.33 * i,
                                     ease: 'Back.easeOut'
                                 });
                                 this.addTween({
                                     targets: [redClockArmBack],
                                     duration: 500,
                                     alpha: 0.8,
                                 });
                                 this.addTween({
                                     targets: [redClockArmFront],
                                     duration: 500,
                                     alpha: 0.4,
                                 });
                                 playSound('clocktick1', 1).detune = 100 - i * 50;

                             }, (5 - i) * 1000)
                         }
                     }
                 })
             }
         })
     }

     pulseHand(idx) {
         if (this.dead) {
             return;
         }
         let xPos = 0; let yPos = 0;
         if (idx == 0) {
            xPos = gameConsts.halfWidth - 185;
            yPos = this.y + 5;

         } else if (idx == 1) {
             xPos = gameConsts.halfWidth - 102;
             yPos = this.y - 77;
         } else if (idx == 2) {
             xPos = gameConsts.halfWidth + 90;
             yPos = this.y - 80;
         } else if (idx == 3) {
             xPos = gameConsts.halfWidth + 198;
             yPos = this.y + 5;
         }
         this.currentHandGlow.setFrame('glow_hand.png');
         this.currentHandGlowPulse.setFrame('glow_hand.png');
         this.currentHandGlow.setPosition(xPos, yPos).setAlpha(0.6).setScale(0);
         this.currentHandGlowPulse.setPosition(xPos, yPos).setAlpha(0).setScale(0.65);
         this.addTween({
             targets: this.currentHandGlow,
             scaleX: 0.65,
             scaleY: 0.65,
             duration: 1200,
             ease: 'Cubic.easeIn'
         });
         this.currentHandGlow.currAnim = this.addTween({
             targets: this.currentHandGlow,
             alpha: 0.3,
             duration: 1200,
             yoyo: true,
             repeat: -1,
             onRepeat: () => {
                 this.currentHandGlowPulse.setAlpha(0.65).setScale(0.65);
                 this.addTween({
                     targets: this.currentHandGlowPulse,
                     alpha: 0,
                     scaleX: 1.1,
                     scaleY: 1.1,
                     duration: 1500,
                     ease: 'Quad.easeOut'
                 });
             }
         })
     }

     createHandShield(amt, instant) {
         if (this.dead) {
             return;
         }
         let durMut = instant ? 0.25 : 1;
         let oldShieldAmts = this.shieldAmts;
         this.shieldAmts += amt;
         this.shieldText.visible = true;
         this.shieldText.setText(this.shieldAmts);
         if (oldShieldAmts > 0) {
             this.shieldText.setScale(1.3);
             this.addTween({
                 targets: this.shieldText,
                 scaleX: this.shieldText.startScale,
                 scaleY: this.shieldText.startScale,
                 ease: 'Back.easeOut',
                 duration: durMut * 250,
             });
             this.addTween({
                 delay: 1000,
                 targets: this.shieldText,
                 alpha: 0.75,
                 duration: 1500,
             });
             this.handShieldBack.setScale(1.9).setAlpha(1);
             this.shieldExtraText.setVisible(true).setScale(1.15).setAlpha(1);
             this.addTween({
                 targets: this.shieldExtraText,
                 scaleX: 1,
                 scaleY: 1,
                 ease: 'Back.easeIn',
                 duration: 150,
                 completeDelay: 1700,
                 onComplete: () => {
                     this.addTween({
                         targets: this.shieldExtraText,
                         scaleX: 0.2,
                         scaleY: 0.25,
                         alpha: 0,
                         ease: 'Cubic.easeIn',
                         duration: 400,

                     })
                 }
             })
             this.handShieldBack.visible = true;
             this.addTween({
                 targets: [this.handShieldBack],
                 duration: durMut * 1000,
                 alpha: 0,
                 scaleX: this.handShieldBack.startScale,
                 scaleY: this.handShieldBack.startScale,
                 ease: 'Quad.easeOut',
                 onComplete: () => {
                     this.handShieldBack.setScale(2);
                     this.addTween({
                         targets: [this.handShieldBack],
                         duration: durMut * 400,
                         alpha: 0.35,
                         onComplete: () => {
                             if (this.shieldAmts == 0) {
                                 this.clearHandShield(true);
                             }
                         }
                     });
                 }
             });

             return;
         }

         this.shieldText.setScale(0.1);
         this.shieldText.startX = this.shieldText.x;
         this.shieldText.startScale = 1;
         this.addTween({
             targets: this.shieldText,
             scaleX: this.shieldText.startScale,
             scaleY: this.shieldText.startScale,
             ease: 'Back.easeOut',
             duration: durMut * 250,
         });
         playSound('swish', 0.3).detune = -800;
         // playSound('slice_in');

         this.handShield.visible = true;
         this.handShield.setScale(this.handShield.startScale * 0.5).setAlpha(0.2);
         this.addTween({
             targets: [this.handShield],
             scaleX: this.handShield.startScale,
             scaleY: this.handShield.startScale,
             duration: durMut * 320,
             ease: 'Quart.easeIn',
             onComplete: () => {
                 playSound('stomp');
                 this.handShieldPulse.visible = true;
                 this.handShield.play('handShieldFull');
                 this.handShield.setScale(3);
                 this.handShield.once('animationcomplete', () => {
                     this.handShield.setScale(1);
                     this.handShield.setFrame('handshield10.png');
                 });
                 this.handShieldBack.setScale(1.9);
                 this.handShieldBack.visible = true;
                 this.handShieldBack.setAlpha(1);
                 this.shieldExtraText.setVisible(true).setScale(1.25).setAlpha(1);
                 this.addTween({
                     targets: this.shieldExtraText,
                     scaleX: 1,
                     scaleY: 1,
                     ease: 'Cubic.easeIn',
                     duration: 150,
                     completeDelay: 3500,
                     onComplete: () => {
                         this.addTween({
                             targets: this.shieldExtraText,
                             scaleX: 0.2,
                             scaleY: 0.25,
                             alpha: 0,
                             ease: 'Cubic.easeIn',
                             duration: 400,
                         })
                     }
                 })

                 this.addTween({
                     targets: [this.handShieldBack],
                     duration: durMut * 1300,
                     alpha: 0,
                     scaleX: this.handShieldBack.startScale,
                     scaleY: this.handShieldBack.startScale,
                     ease: 'Quad.easeOut',
                     onComplete: () => {
                         this.handShieldBack.setScale(2);
                         this.addTween({
                             targets: [this.handShieldBack],
                             duration: durMut * 400,
                             alpha: 0.35,
                         });
                         this.addTween({
                             targets: [this.handShield],
                             duration: durMut * 500,
                             alpha: 0.95,
                             onComplete: () => {
                                 if (this.shieldAmts == 0) {
                                     this.clearHandShield(true);
                                 }
                             }
                         });

                     }
                 });
             }
         });
         this.addTween({
             targets: [this.handShield],
             duration: durMut * 300,
             alpha: 1,
         });
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
         this.handShieldPulse.visible = false;

         this.shieldAmts = 0;
     }

     shakeShieldText() {
         if (this.shieldAmts <= 0) {
             this.shieldText.visible = false;
         }
         this.shieldText.setText(this.shieldAmts).setAlpha(1);
         let startLeft = Math.random() < 0.5;
         this.addTween({
             targets: this.shieldText,
             scaleX: this.shieldText.startScale + 1,
             scaleY: this.shieldText.startScale + 1,
             y: "-=3",
             x: startLeft ? "-=6" : "+=6",
             duration: gameVars.gameManualSlowSpeedInverse * 60,
             ease: 'Quint.easeOut',
             onComplete: () => {
                 this.addTween({
                     targets: this.shieldText,
                     scaleX: this.shieldText.startScale,
                     scaleY: this.shieldText.startScale,
                     y: "+=3",
                     duration: gameVars.gameManualSlowSpeedInverse * 500,
                     ease: 'Quart.easeOut',
                 });
                 this.addTween({
                     targets: this.shieldText,
                     x: startLeft ? "+=13" : "-=13",
                     duration: gameVars.gameManualSlowSpeedInverse * 100,
                     ease: 'Quint.easeInOut',
                     onComplete: () => {
                         this.shieldText.setDepth(8);
                         this.addTween({
                             targets: this.shieldText,
                             x: this.shieldText.startX,
                             duration: gameVars.gameManualSlowSpeedInverse * 400,
                             ease: 'Bounce.easeOut',
                         });
                         this.addTween({
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
             messageBus.publish('animateBlockNum', gameConsts.halfWidth + 75 - Math.random() * 150, this.sprite.y + 50 - Math.random() * 100, 'NEGATED', 0.90, {alpha: 0.85}, {alpha: 0});
            this.handShield.play('handShieldFast');
             this.handShield.setScale(3);
             this.handShield.once('animationcomplete', () => {
                 if (this.shieldAmts <= 2) {
                     this.handShield.setScale(1.6);
                     this.handShield.setFrame('handshieldbroke.png');
                 } else {
                     this.handShield.setScale(1);
                     this.handShield.setFrame('handshield10.png');
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

     destroy() {
         if (this.playerSpellCastSub) {
             this.playerSpellCastSub.unsubscribe();
         }
         if (this.spellAbsorber) {
             this.spellAbsorber.unsubscribe();
             this.spellAbsorber = null;
         }
         super.destroy();
     }

     sharedDie() {
         globalObjects.magicCircle.removeDelayedDamage();
         switchBackgroundInstant('star_shatter.webp');

         setTimeout(() => {
             switchBackground('black_pixel.png');
         }, 70)
         this.isDefeated = true;
         gameVars.latestLevel = this.level;
         gameVars.currLevel = this.level;
         localStorage.setItem("latestLevel", (gameVars.latestLevel).toString());
         gameVars.maxLevel = Math.max(gameVars.maxLevel, this.level);
         localStorage.setItem("maxLevel", gameVars.maxLevel.toString());

        if (this.oldStartScale) {
            this.sprite.startScale = this.oldStartScale
        }
         this.sprite.visible = true;
        if (this.fakeDeath) {
            this.fakeDeath.destroy();
        }

        this.stopHalo = true;
        fadeAwaySound(this.bgMusic);
         if (this.bgMusic2) {
            fadeAwaySound(this.bgMusic2);
         }
         if (this.bgMusic3) {
            fadeAwaySound(this.bgMusic3);
         }
         if (this.breathTween) {
             this.breathTween.stop();
             this.haloBreathTween.stop();
         }
         if (this.finalHands) {
             for (let i in this.finalHands) {
                 this.finalHands[i].destroy();
             }
         }
         if (this.spellCirclePulse) {
             this.spellCirclePulse.visible = false;
         }
         if (this.circleHalo) {
             this.circleHalo.visible = false;
         }
         if (this.deathhalo1) {
             this.deathhalo1.visible = false;
             this.deathhalo2.visible = false;
         }
         if (this.currentRockHand) {
            this.addTween({
                targets: this.currentRockHand,
                alpha: 0,
                duration: 500,
                onComplete: () => {
                    this.currentRockHand.visible = false;
                }
            })
         }

         if (this.currentPowerHand) {
             this.currentPowerHand.destroy();
         }
         this.storedHeal = 0;
         this.extraAttackDamage = 0;
         this.healFromAttacks = false;
         if (this.spellAbsorber) {
             this.spellAbsorber.unsubscribe();
             this.spellAbsorber = null;
         }
         let blackBG = getBackgroundBlackout();
         blackBG.setDepth(-2).setAlpha(1);

         this.bgBlur.destroy();
         this.clearHandObjects();
         this.fadeOutCurrentHand();
         this.clearHandShield(true);
         globalObjects.encyclopedia.hideButton();
         globalObjects.options.hideButton();
         globalObjects.magicCircle.disableMovement();
     }

     secondDie() {
        this.specialDamageAbsorptionActive = true;
        this.sharedDie();

        globalObjects.bannerTextManager.setDialog([
            getLangText('deathFight2plusending'),
            isUsingCheats() ? getLangText('deathFight2plusending3') : getLangText('deathFight2plusending2'),
            getLangText('deathFight2plusending4'),
            getLangText('deathFight2plusending5'),
        ]);
        globalObjects.bannerTextManager.setPosition(gameConsts.halfWidth, gameConsts.halfHeight - 20, 0);
        globalObjects.bannerTextManager.showBanner(0);

        globalObjects.bannerTextManager.setDialogFunc([
            null,
            () => {
                 this.addTween({
                     targets: [this.bgMain],
                     alpha: 0,
                     duration: 1000,
                     onComplete: () => {
                         this.bgMain.destroy();
                     }
                 })
            }, () => {
                globalObjects.bannerTextManager.setForcePause(true);
                super.die();
                playSound("whoosh");
                this.deathFallTemp = this.addImage(this.sprite.x, this.y + 40, "deathfinal", 'death2fall.png').setScale(1.05).setAlpha(0).setDepth(this.sprite.depth);
                this.addTween({
                    targets: this.sprite,
                    alpha: 0,
                    y: "+=10",
                    ease: 'Cubic.easeOut',
                    duration: 1200,
                    onComplete: () => {
                         this.deathFallTemp.currAnim2 = this.addTween({
                             targets: this.deathFallTemp,
                             duration: 2000,
                             scaleX: 1,
                             scaleY: 1,
                             ease: "Cubic.easeInOut",
                         })
                        globalObjects.bannerTextManager.setForcePause(false);
                    }
                })
                this.deathFallTemp.currAnim = this.addTween({
                     delay: 800,
                     targets: this.deathFallTemp,
                     duration: 600,
                     alpha: 1,
                 })
            }, () => {
                globalObjects.bannerTextManager.setForcePause(true);
                this.deathFallTemp.currAnim.stop();
                if (this.deathFallTemp.currAnim2) {
                    this.deathFallTemp.currAnim2.stop();
                }
                this.deathFallTempWhite = this.addImage(this.deathFallTemp.x, this.deathFallTemp.y, "deathfinal", 'death2fall_white.png').setScale(this.deathFallTemp.scaleX).setAlpha(0).setDepth(this.deathFallTemp.depth);
                this.flashCover = this.addImage(this.deathFallTemp.x, this.deathFallTemp.y - 60, 'blurry', 'flash.webp').setScale(0.075, 0.15).setRotation(-1.5).setDepth(this.deathFallTemp.depth).setAlpha(0.25);

                this.addTween({
                    targets: this.deathFallTempWhite,
                    y: "-=45",
                    scaleX: 0.85,
                    scaleY: 0.9,
                    duration: 2000,
                    ease: 'Quad.easeIn',
                    alpha: 1.5,
                })
                this.addTween({
                    targets: this.deathFallTemp,
                    y: "-=45",
                    scaleX: 0.85,
                    scaleY: 0.9,
                    duration: 2000,
                    ease: 'Quad.easeIn',
                    alpha: 0,
                });

                this.addDelay(() => {
                    let flashStar = this.addImage(this.deathFallTemp.x, this.deathFallTemp.y - 50, 'blurry', 'star_blur.png').setScale(2.5).setDepth(this.deathFallTemp.depth).setAlpha(0.1);
                    this.addTween({
                        targets: flashStar,
                        scaleX: 3.25,
                        scaleY: 3.25,
                        alpha: 1,
                        ease: 'Quad.easeIn',
                        duration: 300,
                    })
                }, 1700)

                this.addTween({
                    targets: [this.flashCover],
                    scaleX: 2.5,
                    scaleY: 3.4,
                    alpha: 1,
                    rotation: Math.PI * 0.5,
                    ease: 'Cubic.easeInOut',
                    duration: 2000,
                    onComplete: () => {
                        globalObjects.bannerTextManager.setForcePause(false);
                        gameVars.flashCoverY = this.flashCover.y;
                        this.beginDeathLast();
                    }
                })
            }
            ]);

     }

     die() {
         super.die();
        this.sharedDie()

        playSound('shield_break', 0.5).detune = -150;
        playSound('glass_break').detune = -500;
         setTimeout(() => {
             globalObjects.bannerTextManager.closeBanner();
         }, 0);
         this.bgMain.setFrame('star_shatter.png').setAlpha(1);

         this.glassBG = this.addImage(gameConsts.halfWidth, gameConsts.halfHeight, 'backgrounds', 'glass_break.png').setOrigin(0.5, 0.5).setAlpha(1).setDepth(1000).setBlendMode(Phaser.BlendModes.ADD).setScale(1.333);
         this.glassBG2 = this.addImage(gameConsts.halfWidth, gameConsts.halfHeight, 'backgrounds', 'glass_break.png').setOrigin(0.5, 0.5).setAlpha(1).setDepth(0).setBlendMode(Phaser.BlendModes.MULTIPLY).setScale(1.333);
         this.addTween({
             targets: this.bgMain,
             scaleX: 1.09,
             scaleY: 1.09,
             duration: 50,
             ease: 'Quart.easeOut',
             onComplete: () => {
                 this.addTween({
                     targets: this.bgMain,
                     scaleX: 1.06,
                     scaleY: 1.06,
                     duration: 250,
                     ease: 'Quart.easeOut'
                 })
             }
         });


         this.addTween({
             targets: [this.glassBG, this.glassBG2],
             scaleX: 1.37,
             scaleY: 1.37,
             duration: 50,
             ease: 'Quart.easeOut',
             onComplete: () => {
                 this.addTween({
                     targets: [this.glassBG, this.glassBG2],
                     scaleX: 1.333,
                     scaleY: 1.333,
                     duration: 250,
                     ease: 'Quart.easeOut',
                     onComplete: () => {
                        messageBus.publish("showCombatText", getLangText('deathFight2plusbeaten1'), 10);
                         this.addTimeout(() => {
                            messageBus.publish("closeCombatText")
                         }, 3000)
                     }
                 })
             }
         })
         this.addTween({
             targets: [this.bgMain],
             alpha: 0.9,
             duration: 750,
             ease: 'Cubic.easeOut'
         })
         this.addTween({
             targets: [this.glassBG],
             alpha: 0.15,
             duration: 500,
             ease: 'Quart.easeOut'
         })
         this.addTween({
             targets: [this.glassBG2],
             alpha: 0.4,
             duration: 750,
             ease: 'Cubic.easeOut'
         })

         this.fallAnim();
     }

     fallAnim() {
         this.sprite.setRotation(-0.07);
         let deathFallTemp = this.addImage(this.sprite.x, this.y + 30, "deathfinal", 'death2fall.png').setScale(0.92).setAlpha(0).setDepth(this.sprite.depth);
         this.addTween({
             delay: 1500,
             targets: this.sprite,
             duration: 2400,
             rotation: -0.08,
             scaleX: this.sprite.startScale * 0.9,
             scaleY: this.sprite.startScale * 0.9,
             y: this.y + 25,
             ease: "Cubic.easeIn",
             onStart: () => {
                 this.addTween({
                     delay: 1700,
                     targets: this.sprite,
                     ease: 'Quint.easeIn',
                     duration: 500,
                     alpha: 0,
                 })
                 this.addTween({
                     delay: 2000,
                     targets: deathFallTemp,
                     duration: 600,
                     alpha: 1,
                 })
             },
             onComplete: () => {
                deathFallTemp.currAnim = this.addTween({
                     targets: deathFallTemp,
                     duration: 2000,
                     scaleX: 0.97,
                     scaleY: 0.97,
                     ease: "Cubic.easeInOut",
                     onStart: () => {
                         this.addTween({
                             targets: [this.bgMain, this.glassBG, this.glassBG2],
                             alpha: 0,
                             duration: 1000,
                             onComplete: () => {
                                 this.bgMain.destroy();
                                 this.glassBG.destroy();
                                 this.glassBG2.destroy();
                             }
                         })

                        globalObjects.bannerTextManager.setDialog([
                            "...",
                            getLangText('deathFight2plusbeaten2'),
                            getLangText('deathFight2plusbeaten3'),
                            getLangText('deathFight2plusbeaten4'),
                            getLangText('deathFight2plusending5'),
                        ]);
                        globalObjects.bannerTextManager.setPosition(gameConsts.halfWidth, gameConsts.halfHeight - 20, 0);
                        globalObjects.bannerTextManager.showBanner(0);
                        globalObjects.bannerTextManager.setDialogFunc([
                            () => {},
                            () => {playSound('whoosh', 0.65).detune = -100},
                            () => {playSound('whoosh', 0.6).detune = -250},
                            () => {
                                playSound('whoosh', 0.5).detune = -350
                            },
                            () => {
                                 playSound("whoosh");
                                globalObjects.bannerTextManager.setForcePause(true);
                                deathFallTemp.currAnim.stop();
                                this.deathFallTempWhite = this.addImage(deathFallTemp.x, deathFallTemp.y, "deathfinal", 'death2fall_white.png').setScale(deathFallTemp.scaleX).setAlpha(0).setDepth(deathFallTemp.depth);
                                this.flashCover = this.addImage(deathFallTemp.x, deathFallTemp.y - 60, 'blurry', 'flash_bg.webp').setScale(0.075, 0.15).setRotation(-1.5).setDepth(deathFallTemp.depth).setAlpha(0.5);

                                this.addTween({
                                    targets: this.deathFallTempWhite,
                                    y: "-=45",
                                    duration: 2200,
                                    ease: 'Quad.easeIn',
                                })
                                this.addTween({
                                    targets: deathFallTemp,
                                    y: "-=45",
                                    duration: 2200,
                                    ease: 'Quad.easeIn',
                                })
                                this.addTween({
                                    targets: this.deathFallTempWhite,
                                    scaleX: 0.85,
                                    scaleY: 0.9,
                                    duration: 2000,
                                    alpha: 1.5,
                                });
                                this.addTween({
                                    targets: deathFallTemp,
                                    scaleX: 0.85,
                                    scaleY: 0.9,
                                    duration: 2000,
                                    alpha: 0
                                });

                                this.addDelay(() => {
                                    let flashStar = this.addImage(deathFallTemp.x, deathFallTemp.y - 50, 'blurry', 'star_blur.png').setScale(2.5).setDepth(deathFallTemp.depth).setAlpha(0.1);
                                    this.addTween({
                                        targets: flashStar,
                                        scaleX: 3.25,
                                        scaleY: 3.25,
                                        alpha: 1,
                                        ease: 'Quad.easeIn',
                                        duration: 300,
                                    })
                                }, 1700)
                                this.addTween({
                                    targets: [this.flashCover],
                                    scaleX: 2.5,
                                    scaleY: 3.4,
                                    alpha: 1,
                                    rotation: Math.PI * 0.5,
                                    ease: 'Cubic.easeInOut',
                                    duration: 2000,
                                    onComplete: () => {
                                        globalObjects.bannerTextManager.setForcePause(false);
                                        gameVars.flashCoverY = this.flashCover.y;
                                        this.beginDeathLast();
                                    }
                                })
                            }
                        ]);

                    }
                })
            }
        })
     }

     createPokePower() {
         this.addDelayIfAlive(() => {
             playSound('deep_swish', 0.4)
             playSound('void_strike_hit', 0.4)
         }, 150)
         this.currentPowerHand = this.addImage(gameConsts.halfWidth - 10, this.y - 44, 'deathfinal', 'poke_glow.png').setAlpha(0).setScale(0.7);
         this.currentPowerText = this.addBitmapText(gameConsts.halfWidth, this.currentPowerHand.y - 30, 'damage', "DMG\n+0", 34, 1).setAlpha(0).setDepth(50).setOrigin(0.5, 0.5);
         this.addTween({
             targets: this.currentPowerText,
             alpha: 1,
             scaleX: 1.25,
             scaleY: 1.25,
             duration: 500,
             ease: 'Quart.easeIn',
             onComplete: () => {
                 this.addTween({
                     targets: [this.currentPowerText],
                     alpha: 0.75,
                     scaleX: 0.95,
                     scaleY: 0.95,
                     duration: 450,
                     ease: 'Quad.easeOut',
                 })
             }
         });
         this.addTween({
             targets: [this.currentPowerHand],
             alpha: 1,
             scaleX: 2,
             scaleY: 2,
             duration: 500,
             ease: 'Cubic.easeIn',
             onComplete: () => {
                 this.addTween({
                     targets: [this.currentPowerHand],
                     alpha: 0.35,
                     duration: 300,
                     ease: 'Cubic.easeOut',
                 })
             }
         })
     }

     addExtraDamage() {
         if (this.isDestroyed || this.isDefeated || this.dead) {
             return;
         }
         if (this.attackToStrengthen !== undefined) {
             this.extraAttackDamage++;

             let hitEffect = getTempPoolObject('blurry', 'pulser.png', 'pulser', 800);
             hitEffect.setPosition(this.currentPowerText.x, this.currentPowerText.y).setDepth(50).setScale(2.5).setVisible(true).setAlpha(0.01);
             this.addTween({
                 targets: hitEffect,
                 scaleX: 0,
                 scaleY: 0,
                 ease: 'Cubic.easeIn',
                 duration: 750,
             });
             this.addTween({
                 targets: hitEffect,
                 alpha: 1,
                 duration: 475,
                 ease: "Quad.easeIn",
                 onComplete: () => {
                     this.addTween({
                         delay: 100,
                         targets: hitEffect,
                         alpha: 0,
                         duration: 175,
                     });
                 }
             });
             this.currentPowerText.visible = true;
             this.currentPowerText.setAlpha(1.05).setScale(1.1 + this.extraAttackDamage * 0.024);
             this.currentPowerText.setText("DMG\n+" + this.extraAttackDamage);
             playSound('time_strike').detune = this.extraAttackDamage * 50;
             this.addTween({
                 targets: [this.currentPowerText],
                 alpha: 0.8,
                 scaleX: 0.9 + this.extraAttackDamage * 0.02,
                 scaleY: 0.9 + this.extraAttackDamage * 0.02,
                 duration: 300,
                 ease: 'Back.easeOut',
             })
             let damageAmt = this.attackToStrengthenStartDmg + this.extraAttackDamage;
             if (this.attackToStrengthen === 0) {
                 this.attackName.setText(";"+damageAmt+"+#1");
             } else if (this.attackToStrengthen === 2) {
                 let hurtAmt = 4 + this.extraAttackDamage;
                 this.attackName.setText("}"+hurtAmt+"+$"+damageAmt);
             } else if (this.attackToStrengthen === 3) {
                 if (damageAmt > 6) {
                     this.addTween({
                         targets: this.attackName,
                         duration: 400,
                         alpha: 1,
                         scaleX: 1,
                         scaleY: 1,
                         ease: "Cubic.easeOut"
                     })
                     if (damageAmt === 7) {
                         playSound('enemy_attack_major');
                     }
                     this.attackName.setText(";"+damageAmt+"x4");
                 } else {
                     this.addTween({
                         targets: this.attackName,
                         duration: 300,
                         scaleX: 1,
                         scaleY: 1,
                         ease: "Cubic.easeOut"
                     })
                     if (damageAmt == 5) {
                         playSound('enemy_attack');
                     }
                     this.attackName.setText("|"+damageAmt+"x4");
                 }
             }
         }

     }

     clearExtraAttackDamage() {
         this.extraAttackDamage = 0;
         if (this.currentPowerText) {
             this.addTween({
                 targets: [this.currentPowerText],
                 alpha: 0,
                 scaleX: 0.9,
                 scaleY: 0.9,
                 duration: 350,
             })
         }
     }


     clearPower() {
         let currentPowerText = this.currentPowerText;
         let currentPowerHand = this.currentPowerHand;
         if (currentPowerText && currentPowerText.currAnim) {
             currentPowerText.currAnim.stop()
         }
         if (this.currentPowerExtra) {
             let currentPowerExtra = this.currentPowerExtra;
             if (this.currentPowerExtra.currAnim) {
                 this.currentPowerExtra.currAnim.stop();
             }
             this.addTween({
                 targets: this.currentPowerExtra,
                 alpha: 0,
                 scaleX: 0.5,
                 scaleY: 0.5,
                 duration: 500,
                 onComplete: () => {
                     currentPowerExtra.destroy();
                 }
             });
         }
         if (currentPowerText) {
             this.addTween({
                 targets: [currentPowerText],
                 alpha: 0,
                 scaleX: 0.5,
                 scaleY: 0.5,
                 duration: 500,
                 ease: 'Cubic.easeIn',
                 onComplete: () => {
                     if (currentPowerText) {
                         currentPowerText.visible = false;
                     }
                 }
             });
         }

         if (currentPowerHand) {
             this.addTween({
                 targets: [currentPowerHand],
                 alpha: 0,
                 scaleX: 0.5,
                 scaleY: 0.5,
                 duration: 500,
                 ease: 'Cubic.easeIn',
                 onComplete: () => {
                     currentPowerHand.visible = false;
                 }
             });
         }
     }

     createOkayPower() {
         this.addDelayIfAlive(() => {
             playSound('time_body', 0.4).setSeek(0.2);
             playSound('void_strike_hit', 0.4)
         }, 150)
         this.currentPowerHand = this.addImage(gameConsts.halfWidth + 35, this.y - 52, 'deathfinal', 'okay_glow.png').setAlpha(0).setScale(0.7);
         if (this.currentPowerText) {
             this.currentPowerText.destroy();
         }
         this.currentPowerText = this.addBitmapText(gameConsts.halfWidth, this.currentPowerHand.y - 31, 'heal', "", 40, 1).setAlpha(0).setDepth(50).setOrigin(0.5, 0.5);
         this.currentPowerText.startY = this.currentPowerText.y;
         this.currentPowerExtra = this.addImage(gameConsts.halfWidth, this.y + 10, 'blurry', 'green_star.webp').setAlpha(0).setRotation(Math.PI * 0.25);
         this.addTween({
             targets: this.currentPowerText,
             alpha: 1,
             scaleX: 1.25,
             scaleY: 1.25,
             duration: 500,
             ease: 'Quart.easeIn',
             onComplete: () => {
                 this.addTween({
                     targets: [this.currentPowerText],
                     alpha: 0.75,
                     scaleX: 0.95,
                     scaleY: 0.95,
                     duration: 500,
                     ease: 'Quad.easeOut',
                 })
             }
         });
         this.addTween({
             targets: [this.currentPowerExtra],
             alpha: 0.5,
             scaleX: 3.5,
             scaleY: 3.5,
             duration: 500,
             ease: 'Cubic.easeIn',
             onComplete: () => {
                 this.addTween({
                     targets: [this.currentPowerExtra],
                     alpha: 0.05,
                     scaleX: 1.85,
                     scaleY: 1.85,
                     duration: 1500,
                     onComplete: () => {
                         this.currentPowerExtra.currAnim = this.addTween({
                             targets: [this.currentPowerExtra],
                             alpha: 0.35,
                             duration: 1000,
                             ease: 'Cubic.easeInOut',
                             yoyo: true,
                             repeat: -1
                         })
                     }
                 })
             }
         })
         this.addTween({
             targets: [this.currentPowerHand],
             alpha: 1,
             scaleX: 1.3,
             scaleY: 1.3,
             duration: 500,
             ease: 'Cubic.easeIn',
             onComplete: () => {
                 this.addTween({
                     targets: [this.currentPowerHand],
                     alpha: 0.45,
                     duration: 300,
                     ease: 'Cubic.easeOut',
                 })
             }
         })
     }

     addExtraHeal() {
         this.storedHeal += 10;
         this.currentPowerText.setText("+" + this.storedHeal).setScale(1.25).setAlpha(1);
         this.currentPowerText.y = this.currentPowerText.startY;

         if (this.currentPowerText.currAnim) {
             this.currentPowerText.currAnim.stop();
         }
         this.currentPowerText.currAnim = this.addTween({
             targets: [this.currentPowerText],
             alpha: 0.75,
             scaleX: 0.9,
             scaleY: 0.9,
             duration: 1200,
             ease: 'Quint.easeOut',
             onComplete: () => {
                 this.currentPowerText.currAnim = this.addTween({
                     targets: [this.currentPowerText],
                     alpha: 0.5,
                     scaleX: 1.1,
                     scaleY: 1.1,
                     y: "+=30",
                     duration: 500,
                     ease: 'Quint.easeIn',
                     onComplete: () => {
                         if (this.currentPowerText.active) {
                             this.currentPowerText.setText("");
                         }
                         this.heal(this.storedHeal, 0.45 + Math.sqrt(this.storedHeal) * 0.12);
                         playSound('magic', 0.75);
                         messageBus.publish('animateHealNum', this.x, this.y + 48, '+' + this.storedHeal, 0.5 + Math.sqrt(this.storedHeal) * 0.15);
                         if (!this.healSprite) {
                             this.healSprite = this.addImage(gameConsts.halfWidth, this.y - 20, 'misc', 'heal.png').setScale(1).setDepth(999).setAlpha(1);
                         }
                         this.healSprite.setAlpha(1).setPosition(gameConsts.halfWidth, this.y - 20).setScale(Math.random() < 0.5 ? -1 : 1, 1);
                         this.addTween({
                             targets: this.healSprite,
                             y: "-=30",
                             duration: 1000,
                         });
                         this.addTween({
                             targets: this.healSprite,
                             alpha: 0,
                             duration: 1000,
                             ease: 'Cubic.easeIn',
                         });
                         this.storedHeal = 0;
                     }
                 });
             }
         })
         let healCircle = getTempPoolObject('blurry', 'pulser_green.png', 'pulsergreen', 800);
         healCircle.setPosition(this.currentPowerText.x, this.currentPowerText.y).setDepth(50).setScale(0.6).setVisible(true).setAlpha(0.05);
         this.addTween({
             targets: healCircle,
             alpha: 1,
             ease: 'Cubic.easeOut',
             duration: 100,
             onComplete: () => {
                 this.addTween({
                     targets: healCircle,
                     alpha: 0,
                     duration: 700,
                 });
             }
         });
         this.addTween({
             targets: healCircle,
             scaleX: 3,
             scaleY: 3,
             ease: 'Cubic.easeOut',
             duration: 800,
         });

     }

     createClawPower() {
         this.addDelayIfAlive(() => {
             playSound('slice_in', 0.4)
             playSound('void_strike_hit', 0.4)
         }, 200)
         this.currentPowerHand = this.addImage(gameConsts.halfWidth, this.y - 50, 'deathfinal', 'claw_glow.png').setAlpha(0).setScale(0.7);
         this.addTween({
             targets: [this.currentPowerHand],
             alpha: 1,
             scaleX: 2,
             scaleY: 2,
             duration: 500,
             ease: 'Quart.easeIn',
             onComplete: () => {
                 this.addTween({
                     targets: [this.currentPowerHand],
                     alpha: 0.35,
                     duration: 400,
                 })
             }
         })
     }

     createGlowHands() {
        let hand1 = this.addImage(this.x, this.spellStartY, 'deathfinal', 'palm_glow.png');
        let hand2 = this.addImage(this.x, this.spellStartY, 'deathfinal', 'poke_glow.png');
        let hand3 = this.addImage(this.x, this.spellStartY, 'deathfinal', 'okay_glow.png');
        let hand4 = this.addImage(this.x, this.spellStartY, 'deathfinal', 'claw_glow.png');
        hand1.outerRot = 0;
        hand2.outerRot = Math.PI * -0.5;
        hand3.outerRot = -Math.PI;
        hand4.outerRot = Math.PI * -1.5;
        this.glowHands.push(hand1); this.glowHands.push(hand2); this.glowHands.push(hand3); this.glowHands.push(hand4);
        for (let i in this.glowHands) {
            this.glowHands[i].setAlpha(0).setDepth(3).setScale(0.7);
        }
        this.glowHands[3].setScale(1);
    }
    pulseSpellCircle(isFast) {
        this.spellCirclePulse.setScale(0.5);
        this.addTween({
            delay: 100,
            targets: this.spellCirclePulse,
            scaleX: 4.2,
            scaleY: 4.2,
            ease: 'Cubic.easeOut',
            duration: 1400,
        });
        this.addTween({
            targets: [this.spellCirclePulse],
            alpha: 1,
            ease: 'Quart.easeOut',
            duration: isFast ? 500 : 550,
            onComplete: () => {
                this.addTween({
                    targets: this.spellCirclePulse,
                    alpha: 0,
                    duration: 1000,
                })
            }
        })
    }
    rotateSpellCircleTo(idx, isFast = true, onCompleteFunc) {
         let startRot = 0;
         let goalRot = 0;
         this.addTween({
             targets: this.bgMain,
             alpha: 0.5,
             ease: "Quad.easeOut",
             duration: 1100
         })
        this.fadeMainBG(false);
        this.spellCircleGlow.setScale(1);
        this.spellCircle.setScale(0.5);
        this.pulseSpellCircle(isFast);
        this.addTween({
            targets: this.spellCircleGlow,
            scaleX: 3,
            scaleY: 3,
            ease: 'Cubic.easeInOut',
            duration: isFast ? 600 : 700,
        });
        this.circleHalo.setScale(0.3);
        this.addTween({
            targets: this.circleHalo,
             alpha: 1,
            scaleX: 0.5,
            scaleY: 0.5,
            duration: 500,
            ease: 'Cubic.easeOut',
        })
        let darkBG = this.addImage(0, 0, 'blackPixel').setScale(1000).setDepth(-5);
        darkBG.setAlpha(0);
        this.addTween({
            targets: darkBG,
            alpha: 0.43,
            duration: 550,
        });

        this.addTween({
            targets: this.spellCircle,
            scaleX: 1.5,
            scaleY: 1.5,
            ease: 'Cubic.easeInOut',
            duration: isFast ? 600 : 700,
        });
        setTimeout(() => {
            playSound('ringknell');
        }, 100)
        this.addTween({
            targets: [this.spellCircle, this.spellCircleGlow],
            alpha: 1,
            ease: 'Quart.easeOut',
            duration: isFast ? 500 : 550,
            onComplete: () => {
                this.addTween({
                    targets: [this.spellCircle, this.spellCircleGlow],
                    alpha: 0.85,
                    duration: 1500,
                    onComplete: () => {
                        this.addTween({
                            targets: darkBG,
                            alpha: 0,
                            duration: 500,
                        });
                    }
                })
            }
        })
        this.addTween({
            targets: this.glowHands,
            alpha: 0.8,
            ease: 'Cubic.easeInOut',
            duration: isFast ? 400 : 500,
        })
         switch(idx) {
             case 0:
                 startRot = 0;
                 goalRot = Math.PI;
                 // palm
                 break;
             case 1:
                 // poke
                 startRot = Math.PI * 0.5;
                 goalRot = Math.PI * 1.5;
                 break;
             case 2:
                 // ok
                 startRot = Math.PI;
                 goalRot = Math.PI * 2;
                 break;
             case 3:
                 // claw
                 startRot = Math.PI * -0.5;
                 goalRot = Math.PI * 0.5;
                 break;
         }
        this.spellCircle.rotation = startRot;

        this.addTween({
            targets: [this.spellCircle, this.spellCircleGlow],
            rotation: "+=3.14159",
            ease: 'Quart.easeInOut',
            duration: isFast ? 2400 : 2650,
            onUpdate: () => {
                let handDist = this.spellCircle.scaleX * 166
                for (let i = 0; i < this.glowHands.length; i++) {
                    let hand = this.glowHands[i];
                    let goalRot = hand.outerRot + this.spellCircle.rotation;
                    hand.x = this.spellCircle.x + Math.sin(goalRot) * handDist;
                    hand.y = this.spellCircle.y - Math.cos(goalRot) * handDist;
                }
            },
            onComplete: () => {
                this.addTween({
                    targets: this.circleHalo,
                    alpha: 0,
                    duration: 400,
                })
                this.addTween({
                    targets: this.glowHands,
                    alpha: 0,
                    ease: 'Quad.easeOut',
                    duration: 450
                });
                this.addTween({
                    targets: [this.spellCircle, this.spellCircleGlow],
                    ease: 'Cubic.easeOut',
                    alpha: 0,
                    duration: 500
                });
                let handToUse = this.glowHands[idx];
                this.currentHandGlow.setFrame(handToUse.frame.name).setAlpha(0).setScale(handToUse.scaleX + 0.02).setPosition(handToUse.x, handToUse.y - 2).setDepth(handToUse.depth);
                this.currentHandGlow.setAlpha(1.2);
                this.currentHandGlowPulse.setFrame(handToUse.frame.name).setScale(handToUse.scaleX + 0.02).setPosition(handToUse.x, handToUse.y -2).setAlpha(0.7);
                // let goalX = idx % 2 == 0 ? this.x - 200 : this.x + 200;
                // let goalY = (idx == 1 || idx == 2) ? this.y - 50 : this.y + 30;
                this.addTween({
                    targets: this.currentHandGlowPulse,
                    ease: 'Cubic.easeOut',
                    scaleX: handToUse.scaleX + 0.2,
                    scaleY: handToUse.scaleX + 0.2,
                    alpha: 0,
                    duration: 300,
                });
                this.addTween({
                    targets: this.currentHandGlow,
                    ease: 'Quart.easeIn',
                    x: this.x,
                    y: this.y,
                    scaleX: 0.2,
                    scaleY: 0.2,
                    duration: 700,
                });
                this.addDelayIfAlive(() => {
                    this.fadeMainBG(true);
                    if (onCompleteFunc) {
                        onCompleteFunc();
                    }
                }, 350);
                this.currentHandGlow.currAnim = this.addTween({
                    targets: this.currentHandGlow,
                    alpha: 0,
                    ease: 'Quad.easeOut',
                    duration: 750,
                });
            }
        })
    }


     beginDeathLast() {
         gameVars.fromDeath2Plus = true;
         this.destroy();
         createEnemy(this.level + 1)
     }

}
