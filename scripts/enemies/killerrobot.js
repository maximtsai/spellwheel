 class KillerRobot extends Enemy {
     constructor(scene, x, y, level) {
         super(scene, x, y, level);
         this.initSprite('robot0.png', 1);
         this.shieldAdded = false;
         this.sprite.startY = y;
        this.bgMusic = playMusic('metaljpop', 0.9, false);
         globalObjects.encyclopedia.hideButton();
         globalObjects.options.hideButton();

        this.addTimeout(() => {
            this.setAsleep();
        }, 10)
         this.addTimeout(() => {
             globalObjects.magicCircle.disableMovement();
         }, 900);
         this.sprite.alpha = 0;
         this.sprite.setScale(this.sprite.startScale * 0.75);
         this.addTimeout(() => {
             this.initPreBattleLogic();
         }, 1200);
         // ELEMENT_ARRAY = [RUNE_MATTER, RUNE_MIND, RUNE_MIND, null, null, null , RUNE_MATTER];
     }

    playShieldHitAnim() {
        this.shieldSprite.alpha = this.recentlyHit ? 0.86 : 0.95;
        let animToPlay = this.recentlyHit ? "forceFieldHitShort" : "forceFieldHit";
        this.shieldSprite.play(animToPlay)
        this.shieldSprite.rotation = Math.random() * 1 - 0.5;
        this.shieldSprite.setScale(this.shieldSprite.startScale * 1.02);
        this.shieldText.setDepth(199);
        if (this.shieldHitAnim) {
            this.shieldHitAnim.stop();
        }
        this.shieldHitAnim = this.scene.tweens.add({
            targets: this.shieldSprite,
            scaleX: this.shieldSprite.startScale,
            scaleY: this.shieldSprite.startScale,
            duration: 150,
            alpha: 0.8,
            completeDelay: 250,
            onComplete: () => {
                this.recentlyHit = false;
            }
        });
        this.recentlyHit = true;
    }

    clearShield() {
        this.shield = 0;
        this.shieldSprite.alpha = 1.2;
        this.shieldSprite.play('forceBreak');
        this.scene.tweens.add({
            targets: this.shieldSprite,
            scaleX: this.shieldSprite.startScale * 1.1,
            scaleY: this.shieldSprite.startScale * 1.1,
            ease: 'Cubic.easeOut',
            duration: 900,
            alpha: 0,
            onComplete: () => {
                this.shieldSprite.visible = false;
            }
        });

        if (this.shieldText) {
            this.shieldText.setText(0);
            this.scene.tweens.add({
                targets: this.shieldText,
                scaleX: 0,
                scaleY: 0,
                duration: 900,
                onComplete: () => {
                    this.shieldText.visible = false;
                }
            });
        }
    }

     initPreBattleLogic() {
        this.shieldSprite.damageAnim = "forceFieldHit";
        this.shieldSprite.flashAnim = "forceFieldFlash";
         this.shieldSprite.setFrame('forceField12.png').setVisible(false).setOrigin(0.5, 0.45);
         this.shieldSprite.startScale = 1.25;
         this.lastAttackLingerMult = 1.75;
         this.attackSlownessMult = 1.25;
        this.lightShineLeft = this.addSprite(gameConsts.halfWidth - 220, gameConsts.halfHeight - 320, 'blurry', 'star_blur_sharp.png').setDepth(-1).setAlpha(0).setRotation(-0.5);
        this.lightShineLeftTop = this.addSprite(this.lightShineLeft.x, this.lightShineLeft.y, 'blurry', 'star_blur.png').setDepth(12).setAlpha(0).setRotation(this.lightShineLeft.rotation);

        this.lightShineRight = this.addSprite(gameConsts.halfWidth + 220, gameConsts.halfHeight - 320, 'blurry', 'star_blur_sharp.png').setDepth(-1).setAlpha(0).setRotation(0.5);
        this.lightShineRightTop = this.addSprite(this.lightShineRight.x, this.lightShineRight.y, 'blurry', 'star_blur.png').setDepth(12).setAlpha(0).setRotation(this.lightShineRight.rotation);

        this.minusDamage1 = this.addBitmapText(this.lightShineLeft.x, this.lightShineLeft.y + 5, 'block', '-4 DMG', 32, 1);
        this.minusDamage1.setOrigin(0.5, -0.2).setAlpha(0).setDepth(12);

        this.minusDamage2 = this.addBitmapText(this.lightShineRight.x, this.lightShineRight.y + 5, 'block', '-4 DMG', 32, 1);
        this.minusDamage2.setOrigin(0.5, -0.2).setAlpha(0).setDepth(12);

        this.laserCharge = this.addSprite(this.sprite.x, this.sprite.y - 15, 'enemies', 'robot_charge.png').setDepth(11).setAlpha(0);
        this.laserHeart = this.addSprite(this.sprite.x, this.sprite.y - 15, 'enemies', 'robot_blast.png').setDepth(11).setOrigin(0.5, 0.65).setAlpha(0);
         this.eyeShine = this.addSprite(this.sprite.x, this.sprite.y - 57, 'enemies', 'roboteye.png').setAlpha(0).setScale(this.sprite.startScale * 0.8).setDepth(this.sprite.depth);
         this.blush = this.addSprite(this.sprite.x, this.sprite.y + 10, 'enemies', 'robot_blush.png').setAlpha(0).setScale(this.sprite.startScale * 0.8).setDepth(this.sprite.depth + 1);

         this.addTween({
             targets: this.sprite,
             duration: 2500,
             scaleX: this.sprite.startScale * 1.05,
             scaleY: this.sprite.startScale * 1.05,
             ease: 'Quad.easeOut',
         });
         this.addTween({
             targets: this.eyeShine,
             y: this.y - 58,
             duration: 500,
             scaleX: this.sprite.startScale,
             scaleY: this.sprite.startScale,
             alpha: 0.75,
             ease: 'Back.easeOut',
             onStart: () => {
                 playSound('power_surge_plain');
             },
             onComplete: () => {
                 this.addTween({
                     targets: this.eyeShine,
                     duration: 2200,
                     y: this.y - 67,
                     alpha: 1,
                     scaleX: this.sprite.startScale * 1.2,
                     scaleY: this.sprite.startScale * 1.05,
                     ease: 'Quad.easeOut',
                     onComplete: () => {
                         this.showStartupAnim();
                     }
                 });
             }
         });
         this.addTween({
             targets: this.sprite,
             duration: 2500,
             alpha: 1,
             onComplete: () => {
             }
         });
     }

     showStartupAnim() {
         this.tunnelBG = this.addSprite(gameConsts.halfWidth, gameConsts.halfHeight * 0.7, 'backgrounds', 'tunnel2.png').setScale(1).setDepth(-9).setAlpha(0).setOrigin(0.5, 0.35);
         this.addTween({
             targets: this.tunnelBG,
             duration: 1600,
             alpha: 1,
         });
         this.addTween({
             targets: [this.sprite],
             duration: 800,
             scaleX: this.sprite.startScale * 1.25,
             scaleY: this.sprite.startScale * 1.25,
             ease: 'Cubic.easeOut',
             onComplete: () => {
                 this.addTween({
                     targets: [this.sprite],
                     duration: 800,
                     scaleX: this.sprite.startScale * 0.98,
                     scaleY: this.sprite.startScale * 0.98,
                     ease: 'Cubic.easeIn',
                     onComplete: () => {
                         switchBackgroundInstant('tunnel2.webp');

                         globalObjects.magicCircle.enableMovement();
                        this.bgMusic.stop();
                         playSound('voca_hello', 0.8);

                         this.sprite.setScale(this.sprite.startScale);
                         this.addTween({
                             targets: this.eyeShine,
                             duration: 150,
                             alpha: 0,
                             scaleX: this.sprite.startScale * 0.5,
                             scaleY: this.sprite.startScale * 0.5,
                             rotation: 0,
                         });
                         this.tunnelBG.setFrame('tunnel3.png').setScale(1.02).setOrigin(0.5, 0.35);

                        this.lightShineLeft.setAlpha(0.3).setScale(0.5);
                        this.lightShineRight.setAlpha(0.3).setScale(0.5);
                        this.lightShineLeftTop.setAlpha(1).setScale(0.5);
                        this.lightShineRightTop.setAlpha(1).setScale(0.5);
                        messageBus.publish('showCircleShadow');

                        this.addTween({
                            targets: [this.lightShineLeft, this.lightShineLeftTop],
                            duration: 500,
                            rotation: -0.2,
                            easeParams: [3],
                            ease: 'Back.easeOut',
                            scaleX: 1,
                            scaleY: 1,
                        });

                        this.addTween({
                            targets: [this.lightShineRight,  this.lightShineRightTop],
                            duration: 500,
                            rotation: 0.2,
                            easeParams: [1.5],
                            ease: 'Back.easeOut',
                            scaleX: 1,
                            scaleY: 1,
                        });

                        this.addTween({
                            targets: [this.lightShineLeftTop,  this.lightShineRightTop, this.lightShineLeft,  this.lightShineRight],
                            duration: 1500,
                            alpha: 0.4,
                        });

                         this.addTween({
                             targets: this.tunnelBG,
                             duration: 500,
                             alpha: 0.9,
                             ease: 'Quad.easeOut',
                             scaleX: 1,
                             scaleY: 1,
                         });

                         this.addTween({
                             targets: this.tunnelBG,
                             duration: 500,
                             alpha: 0.9,
                             ease: 'Quad.easeOut',
                             scaleX: 1,
                             scaleY: 1,
                         });
                         this.setDefaultSprite('robot_heart.png');
                         this.disco = this.addSprite(gameConsts.halfWidth, gameConsts.halfHeight + 18, 'shields', 'frame0000.png').setScale(1.7).setDepth(5).play('disco');

                         this.sprite.y = this.sprite.startY;
                         this.heartImage = this.addImage(gameConsts.halfWidth, this.sprite.startY + 50, 'enemies', 'robot_flutter.png').setScale(0.85).setDepth(this.sprite.depth - 1).setAlpha(1.05);
                         this.addTween({
                             targets: this.heartImage,
                             scaleX: 1.1,
                             scaleY: 1.1,
                             ease: 'Quint.easeOut',
                             duration: 1300,
                         })
                         this.addTween({
                             targets: this.heartImage,
                             alpha: 0,
                             duration: 1300,
                             ease: 'Quad.easeIn',
                         })
                         let spriteOrigY = this.sprite.y;
                         this.sprite.setOrigin(0.5, 0.95).setPosition(this.sprite.x, this.sprite.y + 150);
                         this.addTween({
                             delay: 800,
                             targets: this.sprite,
                             duration: 800,
                             rotation: -0.06,
                             ease: 'Cubic.easeIn',
                             scaleX: this.sprite.startScale * 0.985,
                             scaleY: this.sprite.startScale * 0.985,
                             onStart: () => {
                                 playSound('robot_sfx_1');
                                 this.setAwake(false);
                             },
                             onComplete: () => {
                                 playFakeBGMusic('jpop_intro', 0.9);
                                 this.addDelay(() => {
                                     this.bgMusic = playMusic('jpop', 0.85, true);
                                     globalObjects.encyclopedia.showButton();
                                     globalObjects.options.showButton();
                                 }, 580)

                                 this.sprite.setOrigin(0.5, 0.5).setPosition(this.sprite.x, spriteOrigY).setRotation(0);
                                 this.setDefaultSprite('robot1.png');
                                 this.sprite.y = this.sprite.startY;

                                 this.loadUpHealthBar();
                                 this.animateBG()
                                 this.addTween({
                                     targets: this.tunnelBG,
                                     duration: 1500,
                                     alpha: 0.88,
                                     ease: 'Quad.easeOut',
                                     scaleX: 1,
                                     scaleY: 1,
                                     onComplete: () => {
                                     }
                                 });
                             }
                         });
                     }
                 });
             }
         });
         this.addTween({
             targets: this.eyeShine,
             duration: 800,
             alpha: 0.95,
             scaleX: this.sprite.startScale * 1.5,
             scaleY: this.sprite.startScale * 1.5,
             rotation: -0.2,
             y: "-=10",
             ease: 'Cubic.easeOut',
             onComplete: () => {
                 this.addTween({
                     targets: this.eyeShine,
                     duration: 800,
                     alpha: 1.3,
                     scaleX: this.sprite.startScale * 2.5,
                     scaleY: this.sprite.startScale * 2.5,
                     rotation: 0,
                     y: "+=10",
                     ease: 'Cubic.easeIn',
                 });
             }
         });
     }

     initPreStats() {
         this.delayLoad = true;
         // this.loadUpHealthBar();
     }

     initStatsCustom() {
         this.health = gameVars.isHardMode ? 350 : 320;
         this.criticalThreshold = 60;
         this.nextShieldHealth = gameVars.isHardMode ? 100 : 80;
         this.shieldsBroken = 0;
         this.missileObjects = [];
         this.attackEase = "Quad.easeOut";
         this.returnEase = "Cubic.easeIn";
         this.pullbackDurMult = 0.5;
         this.baseBGAlpha = 0;
         this.pullbackScale = 0.9;
         this.pullbackScaleDefault = 0.95;
     }

     // update(dt) {}

     reactToDamageTypes(amt, isAttack, type) {
         super.reactToDamageTypes(amt, isAttack, type);
         if (this.emergency || this.dead || this.isRecharging) {
             return;
         }
         if (!this.isUsingAttack) {
             if (type == "mind") {
                 if (this.accumulatedDamageReaction >= 8) {
                     if (!this.cantplayvocashock) {
                         playSound('voca_shock');
                         this.cantplayvocashock = true;
                         this.addTimeout(() => {
                             this.cantplayvocashock = false;
                         }, 800)
                     }
                     this.sprite.play('robotmind');
                     this.sprite.setScale(1.5);
                     this.sprite.once('animationcomplete', () => {
                         if (!this.isUsingAttack) {
                             this.setSpriteIfNotInactive(this.defaultSprite);
                         }
                     });
                 }
             } else if (type == "matter") {
                 if (this.accumulatedDamageReaction >= 8) {
                     if (this.blush) {
                         this.blush.alpha = 0;
                         if (this.blushAnim) {
                             this.blushAnim.stop();
                         }
                     }
                     playSound('clunk', 1);
                     this.setSprite('robot_matter.png')
                     this.sprite.x = this.x + 9;
                     this.addTween({
                         targets: [this.sprite],
                         x: this.x,
                         duration: 400,
                         ease:'Bounce.easeOut',
                     })
                 }
             } else if (type == "time") {
                 if (this.accumulatedDamageReaction >= 8) {
                     if (!this.cantplayvocatime) {
                         playSound('clocktick1', 0.8).detune = this.lastTickLow ? 200 : -200;
                         this.lastTickLow = !this.lastTickLow;
                         this.cantplayvocatime = true;
                         this.addTimeout(() => {
                             this.cantplayvocatime = false;
                         }, 250)
                     }
                     if (this.blush) {
                         this.blush.alpha = 0;
                         if (this.blushAnim) {
                             this.blushAnim.stop();
                         }
                     }
                     this.sprite.play('robottime')
                 }
             }else if (type == "void") {
                 if (this.accumulatedDamageReaction >= 10) {
                     if (!this.cantplayvocascared) {
                         playSound('voca_short_pain', 1);
                         this.cantplayvocascared = true;
                         this.addTimeout(() => {
                             this.cantplayvocascared = false;
                         }, 4000)
                     }
                     if (this.blush) {
                         this.blush.alpha = 0;
                         if (this.blushAnim) {
                             this.blushAnim.stop();
                         }
                     }
                     this.setSprite('robot_void.png')
                     this.sprite.x = this.x + 9;
                     this.addTween({
                         targets: [this.sprite],
                         x: this.x,
                         duration: 400,
                         ease:'Bounce.easeOut',
                     })
                 }
             }
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
         if (this.shieldAdded && !this.shieldIgnoreGone && !this.emergency) {
             if (this.shield == 0) {
                 // shield must have broke
                 playSound('cutesy_down');
                 playSound('glass_break');

                 this.shieldsBroken++;
                 this.shieldAdded = false;

                 if (!this.cannotInterrupt) {
                     this.cleanUpTweens();
                     this.interruptCurrentAttack();
                     if (this.fireEffect) {
                         this.fireEffect.setVisible(false);
                     }
                     this.currentAttackSetIndex = 1;
                     this.nextAttackIndex = 0;
                 }
             }
         }
         if (this.health < 200 && !this.scratched) {
            this.scratched = true;
            this.baseBGAlpha = -0.15;
            this.lightShineLeftTop.alpha = 0.55;
            this.lightShineRightTop.alpha = 0.55;
            this.addTween({
                targets: [this.lightShineLeftTop,  this.lightShineRightTop],
                 ase: 'Quad.easeOut',
                duration: 1500,
                alpha: 0.3,
            });
         }
         if (this.health < this.criticalThreshold && !this.emergency) {
            this.startInjuredSequence();
         }
     }


    startInjuredSequence() {
        if (this.emergency) {
            return;
        }
        if (this.kyaTween) {
            this.kyaTween.stop();
        }
        playSound('glass_break');
        this.emergency = true;
         this.baseBGAlpha = -0.25;
         this.addTween({
             targets: this.tunnelBG,
             duration: 1000,
             alpha: 0.4,
             ease: 'Quad.easeOut',
             onComplete: () => {
                 this.tunnelBG.setAlpha(0.85);
                 this.addTimeout(() => {
                     this.tunnelBG.setAlpha(0.6);
                     this.addTimeout(() => {
                         this.tunnelBG.setAlpha(0.7);
                         this.addTimeout(() => {
                             this.tunnelBG.setAlpha(0.4);
                         }, 200);
                     }, 700);
                 }, 50);
             }
         });
         this.attackEase = "Quad.easeOut";
         this.returnEase = "Cubic.easeIn";
         this.blush.visible = false;
         this.eyeShine.visible = false;
         this.interruptCurrentAttack();
        if (this.fireEffect) {
            this.fireEffect.setVisible(false);
        }
         this.setDefaultSprite('robot_broken.png');
        if (this.shineAnim) {
            this.shineAnim.stop();
        }
        this.addTween({
             targets: [this.minusDamage1, this.minusDamage2, this.lightShineLeft, this.lightShineLeftTop, this.lightShineRight, this.lightShineRightTop],
             duration: 1000,
             alpha: 0,
             ease: 'Cubic.easeOut',
         });
        this.setDefense(0);
        this.bgMusic.detune = -900;
        setVolume(this.bgMusic, 0.25, 1000)
        this.disco.destroy();

        this.addTimeout(() => {
            globalObjects.bannerTextManager.setDialog([getLangText("killer_robot_d")]);
            globalObjects.bannerTextManager.setPosition(gameConsts.halfWidth, gameConsts.halfHeight + 10, 0);
            globalObjects.bannerTextManager.showBanner(false);
        }, 1000)

        this.sprite.y = this.sprite.startY;
        playSound('voca_pain', 0.9);
        playSound('clunk2', 1.2);
        this.currentAttackSetIndex = 8;
        this.nextAttackIndex = 0;
    }

     cleanUpTweens() {
         if (this.backgroundTween) {
             this.backgroundTween.stop();
         }
         if (this.laserTween) {
             this.laserTween.stop();
         }
         if (this.bulletTween) {
             this.bulletTween.stop();
         }
         let backgroundBlack = getBackgroundBlackout();
         backgroundBlack.setAlpha(0);
     }

     animateBG(durationMult = 1, extraAlpha = 0) {
         if (this.dead) {
             return;
         }
         this.tunnelBG.setAlpha(0.94 + extraAlpha + this.baseBGAlpha);
         this.currBGAnim = this.addTween({
             targets: this.tunnelBG,
             duration: 550 * durationMult,
             alpha: 0.85 + this.baseBGAlpha,
             ease: 'Cubic.easeOut',
             onComplete: () => {
                 this.animateBG();
             }
         });
        this.minusDamage2.setRotation(this.minusDamage1.rotation);
        this.minusDamage1.setRotation(this.minusDamage1.rotation * -1);

        if (this.sprite.frame.name == "robot1.png") {
            this.sprite.setFrame('robot2.png')
        } else if (this.sprite.frame.name == "robot2.png") {
            this.sprite.setFrame('robot1.png')
        }
     }

     refreshAnimateBG(durMult, alpha) {
         this.currBGAnim.stop();
         this.animateBG(durMult, alpha);
     }

     fireMusic(damage, scale = 1, duration = 700, isWeak = false) {
         let music_note = getTempPoolObject('enemies', 'music_note.png', 'music_note', duration * 2);
         music_note.setScale(scale * 0.4).setPosition(gameConsts.halfWidth, this.y).setAlpha(0.75).setDepth(31);
         let music_note_blue = getTempPoolObject('enemies', 'music_note_blue.png', 'music_note_blue', 450);
         music_note_blue.setScale(music_note.scaleX * 1.334).setPosition(music_note.x, music_note.y).setDepth(30).setAlpha(isWeak ? 0.1 : 1);
         this.addTween({
             targets: music_note_blue,
             duration: 400,
             alpha: 0,
         })
         this.addTween({
             targets: music_note,
             duration: duration * 0.5,
             alpha: 1,
             ease: 'Cubic.easeOut',
             onComplete: () => {
                 let music_note_blue = getTempPoolObject('enemies', 'music_note_blue.png', 'music_note_blue', 450);
                 music_note_blue.setScale(music_note.scaleX * 1.334).setPosition(music_note.x, music_note.y).setDepth(30).setAlpha(isWeak ? 0.1 : 1);
                 this.addTween({
                     targets: music_note_blue,
                     duration: 400,
                     alpha: 0,
                 })
             }
         })

         this.addTween({
             targets: music_note,
             duration: duration,
             scaleX: scale,
             scaleY: scale,
             y: globalObjects.player.getY() - 190,
             ease: 'Quad.easeOut',
             onComplete: () => {
                 playSound(isWeak ? 'music_blast_weak' : 'music_blast', isWeak ? 0.8 : 1);
                 let metalVol = damage > 15 ? 0.95 : 0.8;
                 if (isWeak) {

                 } else {
                     playSound('metaljpop_short', metalVol).detune = 0;
                 }

                 messageBus.publish('playerAddDelayedDamage', damage);
                 let music_note_blue = getTempPoolObject('enemies', 'music_note_blue.png', 'music_note_blue', 450);
                 music_note_blue.setScale(music_note.scaleX * 1.334).setPosition(music_note.x, music_note.y).setDepth(30).setAlpha(isWeak ? 0.1 : 1);
                 this.addTween({
                     targets: music_note_blue,
                     duration: 400,
                     alpha: 0,
                 })
                 this.addTween({
                     targets: music_note,
                     duration: 300 + duration,
                     ease: 'Quad.easeOut',
                     alpha: 0,
                 });
                 screenShake(1 + damage * 0.15);
                 this.addTween({
                     targets: music_note,
                     duration: 300 + duration,
                     scaleX: scale * 2.5,
                     scaleY: scale * 2.5,
                     ease: "Quart.easeOut",
                 })
             }
         })
     }

     initAttacks() {
         this.attacks = [
             [
                 // 0
                 {
                     name: "SHINE BRIGHT! {" + this.nextShieldHealth + " ",
                     block: this.nextShieldHealth,
                     chargeAmt: 600,
                     chargeMult: 15,
                     isPassive: true,
                     damage: -1,
                     attackStartFunction: () => {
                         this.shieldAdded = true;
                         this.shieldIgnoreGone = true;
                         this.addTimeout(() => {
                             playSound('cutesy_up', 0.8);
                         }, 100);

                        this.lightShineLeftTop.setDepth(999);
                        this.lightShineRightTop.setDepth(999);
                        this.minusDamage1.setDepth(999);
                        this.minusDamage2.setDepth(999);

                        this.addTween({
                            targets: [this.lightShineLeftTop,  this.lightShineRightTop, this.lightShineLeft,  this.lightShineRight],
                            ease: 'Cubic.easeOut',
                            duration: 150,
                            alpha: 1,
                            scaleX: 2,
                            scaleY: 2,
                            onComplete: () => {
                                messageBus.publish('showCircleShadow', 0.6);
                                this.setDefense(4);
                                this.addTimeout(() => {
                                    globalObjects.bannerTextManager.setDialog([getLangText("killer_robot_a"), getLangText("killer_robot_b")]);
                                    this.minusDamage1.setAlpha(0.5).setRotation(-0.12);
                                    this.minusDamage2.setAlpha(0.5).setRotation(0.12);

                                    globalObjects.bannerTextManager.setPosition(gameConsts.halfWidth, gameConsts.halfHeight + 10, 0);
                                    globalObjects.bannerTextManager.showBanner(false);
                                }, 250)
                                this.addTween({
                                    targets: [this.lightShineLeftTop,  this.lightShineRightTop, this.lightShineLeft,  this.lightShineRight],
                                    duration: 1500,
                                    alpha: 0.5,
                                    scaleX: 1,
                                    scaleY: 1,
                                });
                            }
                        });

                     },
                     attackFinishFunction: () => {
                         let scaleAmt = gameVars.isHardMode ? 40 : 25;
                         this.shieldIgnoreGone = false;
                         this.currentAttackSetIndex = 2;
                         this.nextAttackIndex = 0;
                     },
                 },
             ],
             [
                 // 1
                 {
                     name: "ERROR: SHIELD MISSING",
                     chargeAmt: 300,
                     isPassive: true,
                     damage: 0,
                     transitionFast: true,
                     startFunction: () => {
                         this.pullbackDurMult = 1;
                        if (this.health >= this.criticalThreshold) {
                            this.nextShieldHealth += gameVars.isHardMode ? 40 : 30;
                            // this.setDefaultSprite('robot1.png', undefined, true);
                            playSound('robot_sfx_1');
                            this.shieldAdded = false;
                            this.blush.rotation = 0;
                            this.blushAnim = this.addTween({
                                 targets: this.blush,
                                 scaleX: this.sprite.startScale,
                                 scaleY: this.sprite.startScale,
                                 alpha: 0.5,
                                 ease: 'Back.easeOut',
                                 duration: 350,
                                 onComplete: () => {
                                     this.blushAnim = this.addTween({
                                         targets: this.blush,
                                         alpha: 1,
                                         duration: 3000,
                                     })
                                 }
                             });
                            this.attackEase = "Quad.easeOut";
                            this.returnEase = "Cubic.easeIn";
                        } else {
                            this.startInjuredSequence()
                        }
                     },
                     finaleFunction: () => {
                         if (this.blushAnim) {
                             this.blushAnim.stop();
                         }
                     }
                 },
                 {
                     name: "RECHARGING! {" + this.nextShieldHealth,
                     chargeAmt: gameVars.isHardMode ? 900 : 1000,
                     block: this.nextShieldHealth,
                     isPassive: true,
                     transitionFast: true,
                     chargeMult: 7,
                     damage: -1,
                     startFunction: () => {
                         this.isRecharging = true;
                         this.nextAttack.block = this.nextShieldHealth;
                         setTimeout(() => {
                             this.attackName.setText("RECHARGING! {" + this.nextShieldHealth);
                         }, 0)
                        if (this.health < this.criticalThreshold) {
                            this.startInjuredSequence();
                        } else {
                            this.addTween({
                                 targets: [this.minusDamage1, this.minusDamage2, this.lightShineLeft, this.lightShineLeftTop, this.lightShineRight, this.lightShineRightTop],
                                 duration: 1000,
                                 alpha: 0,
                                 ease: 'Quad.easeOut',
                             });
                            this.setDefense(0);
                            setVolume(this.bgMusic, 0.35)
                            this.bgMusic.detune = 500;


                             this.pullbackScale = 0.99;
                             this.attackScale = 1.03;
                             let scaleAmt = gameVars.isHardMode ? 40 : 25;
                             this.setDefaultSprite('robot_hide.png');
                             playSound('voca_kya');
                             this.sprite.rotation = 0.15;
                             this.blush.rotation = 0;
                             this.kyaTween = this.addTween({
                                 targets: [this.sprite, this.blush],
                                 y: 240,
                                 ease: 'Cubic.easeIn',
                                 duration: 550,
                                 onComplete: () => {
                                     playSound('clunk2');
                                     this.addTimeout(() => {
                                         playSound('clunk', 0.6);
                                         this.addTimeout(() => {
                                             playSound('clunk2', 0.3);
                                         }, 200);
                                     }, 500);
                                     this.addTween({
                                         targets: this.sprite,
                                         rotation: 0,
                                         ease: 'Bounce.easeOut',
                                         duration: 700,
                                     })
                                 }
                             })
                        }
                     },
                     attackStartFunction: () => {
                        if (this.health < this.criticalThreshold) {
                            this.startInjuredSequence();
                        } else {
                             this.shieldAdded = true;
                             this.shieldIgnoreGone = true;
                             if (!this.dead && this.shieldAdded) {
                                 playSound('robot_sfx_1');

                                 playSound('cutesy_up');
                                 this.setDefaultSprite('robot_heart.png');
                                 this.sprite.y = this.sprite.startY;
                                 this.blush.y = this.sprite.startY + 10;
                                 this.blush.rotation = 0;
                                 this.heartImage.setAlpha(1).setScale(0.9);
                                 this.addTween({
                                     targets: this.heartImage,
                                     scaleX: 1.15,
                                     scaleY: 1.15,
                                     ease: 'Quint.easeOut',
                                     duration: 800,
                                 })
                                 this.addTween({
                                     targets: this.heartImage,
                                     alpha: 0,
                                     duration: 800,
                                     ease: 'Quad.easeIn',
                                 })

                                 this.blushAnim = this.addTween({
                                     targets: this.blush,
                                     alpha: 0,
                                     duration: 500,
                                 })
                                 let oldScale = this.sprite.scaleX;
                                 this.sprite.setScale(this.sprite.scaleX * 1.01);
                                 this.currAnim = this.addTween({
                                     targets: this.sprite,
                                     scaleX: oldScale,
                                     scaleY: oldScale,
                                     duration: 10,
                                     completeDelay: 600,
                                     onComplete: () => {
                                         if (!this.dead && this.shieldAdded) {
                                             this.setDefaultSprite('robot1.png');
                                             this.sprite.y = this.sprite.startY;
                                         }
                                     }
                                 });

                                this.shineAnim = this.addTween({
                                    targets: [this.lightShineLeftTop,  this.lightShineRightTop, this.lightShineLeft,  this.lightShineRight],
                                    ease: 'Cubic.easeOut',
                                    duration: 200,
                                    alpha: 0.9,
                                    scaleX: 1.9,
                                    scaleY: 1.9,
                                    onComplete: () => {
                                        if (this.emergency) {
                                            return;
                                        }
                                        messageBus.publish('showCircleShadow', 0.7);
                                        if (!this.isShiningBrighter) {
                                            globalObjects.bannerTextManager.setDialog([getLangText('killer_robot_c'), getLangText('killer_robot_b')]);
                                            globalObjects.bannerTextManager.setPosition(gameConsts.halfWidth, gameConsts.halfHeight + 10, 0);
                                            globalObjects.bannerTextManager.showBanner(false);
                                            this.isShiningBrighter = true;
                                        } else {
                                            // dialogToSet = ["The stage lights are\nalready at max brightness."];
                                        }
                                        this.setDefense(4);

                                        this.minusDamage1.setAlpha(0.55).setRotation(0.14);
                                        this.minusDamage2.setAlpha(0.55).setRotation(-0.14);

                                        this.shineAnim = this.addTween({
                                            targets: [this.lightShineLeftTop, this.lightShineRightTop, this.lightShineLeft,  this.lightShineRight],
                                            duration: 1500,
                                            alpha: 0.55,
                                            scaleX: 1,
                                            scaleY: 1,
                                        });
                                    }
                                });
                            }
                        }
                     },
                     attackFinishFunction: () => {
                         this.isRecharging = false;
                        if (this.health < this.criticalThreshold) {
                            this.startInjuredSequence()
                        } else {
                            setVolume(this.bgMusic, 0.85)
                            this.bgMusic.detune = 0;

                             this.shieldIgnoreGone = false;
                             if (this.shieldsBroken === 1) {
                                 this.currentAttackSetIndex = 4;
                             } else if (this.shieldsBroken === 2) {
                                 this.currentAttackSetIndex = 5;
                             } else if (this.shieldsBroken === 3) {
                                 this.currentAttackSetIndex = 6;
                             } else if (this.shieldsBroken >= 3) {
                                 this.currentAttackSetIndex = 7;
                             }
                             this.nextAttackIndex = 0;
                             this.pullbackScale = this.pullbackScaleDefault;
                             this.attackScale = this.attackScaleDefault;
                        }
                     }
                 }
             ],
             [
                 // 2
                 {
                     name: "|8x2",
                     chargeAmt: 400,
                     damage: 8,
                     attackTimes: 2,
                     attackSprites: ['robot_claw_1.png', 'robot_claw_1.png'],
                     startFunction: () => {
                         this.claw1Attacked = false;
                         this.pullbackScale = this.pullbackScaleDefault;
                         this.attackScale = this.attackScaleDefault;
                         this.attackEase = "Cubic.easeIn";
                         this.returnEase = "Cubic.easeOut";
                     },
                     attackStartFunction: () => {
                         this.refreshAnimateBG(2, 0.1);
                     },
                     attackFinishFunction: () => {
                         this.claw1Attacked = !this.claw1Attacked;
                         playSound(this.claw1Attacked ? 'voca_claw_1' : 'voca_claw_2', 0.8);
                         playSound('sword_hit');
                         this.addTimeout(() => {
                             if (!this.dead && this.shieldAdded) {
                                this.sprite.setDepth(10);
                                 this.sprite.setFrame(this.claw1Attacked ? 'robot_claw_2.png' : 'robot_claw_1.png')
                             }
                         }, 80);
                         let powEffect = getTempPoolObject('spells', 'damageEffect3.png', 'damageEffect3', 150);
                         let xOffset = this.claw1Attacked ? -30 : 30;
                         powEffect.setPosition(gameConsts.halfWidth + xOffset, globalObjects.player.getY() - 180).setDepth(998).setScale(1.45);
                         powEffect.play('damageEffectShort')
                     },
                     finaleFunction: () => {
                        this.sprite.setDepth(0);
                         this.attackEase = "Quad.easeOut";
                         this.returnEase = "Cubic.easeIn";
                     }
                 },
                 {
                     name: "|4x6",
                     chargeAmt: 450,
                     damage: -1,
                     startFunction: () => {
                         this.pullbackScale = 0.99;
                         this.attackScale = 1.03;
                     },
                     attackStartFunction: () => {
                         if (!this.dead && this.shieldAdded) {
                             this.addTimeout(() => {
                                 if (!this.dead && this.shieldAdded) {
                                     playSound('voca_gun');
                                 }
                             }, 500);
                             this.setDefaultSprite('robot_shoot.png');
                             this.sprite.y = this.sprite.startY;
                             this.refreshAnimateBG(2, 0.1);
                         }
                     },
                     attackFinishFunction: () => {
                        this.shootBullets(4, 500);
                     }
                 },
                 {
                     name: "|12",
                     chargeAmt: 350,
                     damage: 12,
                     attackTimes: 1,
                     attackSprites: ['robot_claw_1.png'],
                     startFunction: () => {
                         this.claw1Attacked = false;
                         this.pullbackScale = this.pullbackScaleDefault;
                         this.attackScale = this.attackScaleDefault;
                         this.attackEase = "Cubic.easeIn";
                         this.returnEase = "Cubic.easeOut";
                     },
                     attackStartFunction: () => {
                         this.refreshAnimateBG(2, 0.1);
                     },
                     attackFinishFunction: () => {
                         this.claw1Attacked = !this.claw1Attacked;
                         playSound('voca_claw_1', 0.7);
                         playSound('voca_claw_2', 0.7);
                         playSound('sword_hit');
                         this.addTimeout(() => {
                             if (!this.dead && this.shieldAdded) {
                                 this.sprite.setFrame(this.claw1Attacked ? 'robot_claw_2.png' : 'robot_claw_1.png')
                                this.sprite.setDepth(10);
                             }
                         }, 80);
                         let powEffect = getTempPoolObject('spells', 'damageEffect3.png', 'damageEffect3', 150);
                         powEffect.setPosition(gameConsts.halfWidth, globalObjects.player.getY() - 180).setDepth(998).setScale(1.6);
                         powEffect.play('damageEffectShort')
                     },
                     finaleFunction: () => {
                        this.sprite.setDepth(0);
                         this.attackEase = "Quad.easeOut";
                         this.returnEase = "Cubic.easeIn";
                     }
                 },
             ],
             [
                 // 3
                 {
                     name: "|8x2",
                     chargeAmt: 400,
                     damage: 8,
                     attackTimes: 2,
                     attackSprites: ['robot_claw_1.png', 'robot_claw_1.png'],
                     startFunction: () => {
                         this.claw1Attacked = true;
                         this.pullbackScale = this.pullbackScaleDefault;
                         this.attackScale = this.attackScaleDefault;
                         this.attackEase = "Cubic.easeIn";
                         this.returnEase = "Cubic.easeOut";
                     },
                     attackStartFunction: () => {
                         this.refreshAnimateBG(2, 0.1);
                     },
                     attackFinishFunction: () => {
                         this.claw1Attacked = !this.claw1Attacked;
                         playSound(this.claw1Attacked ? 'voca_claw_1' : 'voca_claw_2', 0.8);
                         playSound('sword_hit');
                         this.addTimeout(() => {
                             if (!this.dead && this.shieldAdded) {
                                 this.sprite.setFrame(this.claw1Attacked ? 'robot_claw_2.png' : 'robot_claw_1.png')
                             }
                         }, 80);
                         let powEffect = getTempPoolObject('spells', 'damageEffect3.png', 'damageEffect3', 150)
                         let xOffset = this.claw1Attacked ? -30 : 30;
                         powEffect.setPosition(gameConsts.halfWidth + xOffset, globalObjects.player.getY() - 180).setDepth(998).setScale(1.5);
                         powEffect.play('damageEffectShort')
                     },
                     finaleFunction: () => {
                         this.attackEase = "Quad.easeOut";
                         this.returnEase = "Cubic.easeIn";
                     }
                 },
                 {
                     name: "$12",
                     chargeAmt: 400,
                     damage: -1,
                     attackTimes: 1,
                     prepareSprite: 'robot_heart.png',
                     startFunction: () => {

                     },
                     attackStartFunction: () => {
                         playSound('voca_hello_short', 0.9);
                         this.fireMusic(12, 1.05, 850)
                     },
                     attackFinishFunction: () => {
                         this.refreshAnimateBG(2, 0.1);
                     },
                     finaleFunction: () => {

                     }
                 },
                 {
                     name: "|8x3",
                     chargeAmt: 550,
                     damage: 8,
                     attackTimes: 3,
                     attackSprites: ['robot_claw_1.png', 'robot_claw_1.png'],
                     startFunction: () => {
                         this.claw1Attacked = true;
                         this.pullbackScale = this.pullbackScaleDefault;
                         this.attackScale = this.attackScaleDefault;
                         this.attackEase = "Cubic.easeIn";
                         this.returnEase = "Cubic.easeOut";
                     },
                     attackStartFunction: () => {
                         this.refreshAnimateBG(2, 0.1);
                     },
                     attackFinishFunction: () => {
                         this.claw1Attacked = !this.claw1Attacked;
                         playSound(this.claw1Attacked ? 'voca_claw_1' : 'voca_claw_2', 0.8);
                         playSound('sword_hit');
                         this.addTimeout(() => {
                             if (!this.dead && this.shieldAdded) {
                                 this.sprite.setFrame(this.claw1Attacked ? 'robot_claw_2.png' : 'robot_claw_1.png')
                             }
                         }, 80);
                         let powEffect = getTempPoolObject('spells', 'damageEffect3.png', 'damageEffect3', 150)
                         let xOffset = this.claw1Attacked ? -30 : 30;
                         powEffect.setPosition(gameConsts.halfWidth + xOffset, globalObjects.player.getY() - 180).setDepth(998).setScale(1.5);
                         powEffect.play('damageEffectShort')
                     },
                     finaleFunction: () => {
                         this.attackEase = "Quad.easeOut";
                         this.returnEase = "Cubic.easeIn";
                     }
                 },
             ],
             [
                 // 4 song
                 {
                     name: "$20 ",
                     chargeAmt: 550,
                     damage: -1,
                     finishDelay: 1200,
                     isBigMove: true,
                     startFunction: () => {
                         this.cannotInterrupt = true;
                         this.pullbackScale = 0.99;
                         this.attackScale = 1.03;
                         this.pullbackDurMult = 0.01;
                     },
                     attackStartFunction: () => {

                     },
                     attackFinishFunction: () => {
                         if (!this.dead) {
                             this.heartImage.setAlpha(1).setScale(0.9);
                             this.addTween({
                                 targets: this.heartImage,
                                 scaleX: 1.15,
                                 scaleY: 1.15,
                                 ease: 'Quint.easeOut',
                                 duration: 800,
                             })
                             this.addTween({
                                 targets: this.heartImage,
                                 alpha: 0,
                                 duration: 800,
                                 ease: 'Quad.easeIn',
                             })
                             playSound('voca_hello_short', 0.85);
                             this.setDefaultSprite('robot_heart.png', 1, true);
                             this.sprite.y = this.sprite.startY;
                             this.sprite.scaleX = this.sprite.startScale * 0.92;
                             let startScale = this.sprite.startScale;
                             this.addTween({
                                 targets: this.sprite,
                                 scaleX: startScale,
                                 duration: 200,
                                 ease: 'Quart.easeOut',
                                 completeDelay: 300,
                                 onComplete: () => {
                                     playSound('voca_hello_short', 0.95).detune = 500;
                                     this.addTween({
                                         targets: this.sprite,
                                         scaleX: -startScale,
                                         duration: 200,
                                         ease: 'Quart.easeOut',
                                         completeDelay: 300,
                                         onStart: () => {
                                             this.sprite.scaleX = startScale * -0.9;
                                         },
                                         onComplete: () => {
                                             this.heartImage.setAlpha(1).setScale(0.9);
                                             this.addTween({
                                                 targets: this.heartImage,
                                                 scaleX: 1.15,
                                                 scaleY: 1.15,
                                                 ease: 'Quint.easeOut',
                                                 duration: 800,
                                             })
                                             this.addTween({
                                                 targets: this.heartImage,
                                                 alpha: 0,
                                                 duration: 800,
                                                 ease: 'Quad.easeIn',
                                             })
                                             playSound('voca_hello_short', 0.9).detune;
                                             this.addTween({
                                                 targets: this.sprite,
                                                 scaleX: startScale,
                                                 duration: 200,
                                                 ease: 'Quart.easeOut',
                                                 onStart: () => {
                                                     this.sprite.scaleX = this.sprite.startScale * 0.9;
                                                     this.fireMusic(20, 1.4, 850);
                                                 },
                                                 onComplete: () => {
                                                     this.addDelay(() => {
                                                         this.sprite.y = this.sprite.startY;
                                                         this.setDefaultSprite('robot1.png', undefined, true);
                                                     }, 600)
                                                 }
                                             })
                                         }
                                     })
                                 }
                             })
                             this.refreshAnimateBG(3, 0.4);
                         }
                         this.currentAttackSetIndex = 3;
                         this.nextAttackIndex = 0;
                     },
                     finaleFunction: () => {
                         this.pullbackDurMult = 1;
                         this.cannotInterrupt = false;
                         if (this.shield === 0) {
                             this.currentAttackSetIndex = 1;
                             this.nextAttackIndex = 0;
                         }
                     }
                 },
             ],
             [
                 // 5 laser
                 {
                     name: ";18x2 ",
                     chargeAmt: 600,
                     finishDelay: 2000,
                     damage: -1,
                     isBigMove: true,
                     startFunction: () => {
                         this.pullbackDurMult = 1;
                         this.cannotInterrupt = true;
                         this.pullbackScale = 0.99;
                         this.attackScale = 1.03;
                     },
                     attackStartFunction: () => {
                         if (!this.dead) {
                             this.addTimeout(() => {
                                 playSound('voca_laser');
                             }, 200);
                             this.setDefaultSprite('robot_laser.png');
                             this.sprite.y = this.sprite.startY;
                             this.refreshAnimateBG(3, 0.4);
                         }
                     },
                     attackFinishFunction: () => {
                         this.fireLaser(18);
                         this.currentAttackSetIndex = 3;
                         this.nextAttackIndex = 0;
                     },
                     finaleFunction: () => {
                         this.cannotInterrupt = false;
                         if (this.shield === 0) {
                             this.currentAttackSetIndex = 1;
                             this.nextAttackIndex = 0;
                         }
                     }
                 },
             ],
             [
                 // 6 missiles
                 {
                     name: ";8x6 ",
                     chargeAmt: 700,
                     damage: -1,
                     isBigMove: true,
                     startFunction: () => {
                         this.cannotInterrupt = true;
                         this.pullbackScale = 0.99;
                         this.attackScale = 1.03;
                     },
                     attackStartFunction: () => {
                         if (!this.dead) {
                             playSound('voca_missile');
                             this.createMissileObject(this.x - 75, this.y + 5, -0.5, 300);
                             this.createMissileObject(this.x + 75, this.y + 5, 0.5, 300);
                             this.createMissileObject(this.x - 50, this.y - 10, -0.3, 150);
                             this.createMissileObject(this.x - 50, this.y - 10, 0.3, 150);

                             this.createMissileObject(this.x - 25, this.y - 30, -0.12, 0);
                             this.createMissileObject(this.x + 25, this.y - 30, 0.12, 0);
                             this.refreshAnimateBG(3, 0.25);
                         }
                     },
                     attackFinishFunction: () => {
                         this.fireMissiles(8);
                         this.currentAttackSetIndex = 3;
                         this.nextAttackIndex = 0;
                     },
                     finaleFunction: () => {
                         this.cannotInterrupt = false;
                         if (this.shield === 0) {
                             this.currentAttackSetIndex = 1;
                             this.nextAttackIndex = 0;
                         }
                     }
                 },
             ],
             [
                 // 7
                 {
                     name: "}4x6 ",
                     chargeAmt: 450,
                     damage: -1,
                     startFunction: () => {
                         this.pullbackScale = 0.99;
                         this.attackScale = 1.03;
                     },
                     attackStartFunction: () => {
                         if (!this.dead && this.shieldAdded) {
                             this.addTimeout(() => {
                                 if (!this.dead && this.shieldAdded) {
                                     playSound('voca_gun');
                                 }
                             }, 200);
                             this.setDefaultSprite('robot_shoot.png');
                             this.sprite.y = this.sprite.startY;
                             this.refreshAnimateBG(2, 0.1);
                         }
                     },
                     attackFinishFunction: () => {
                         this.shootBullets(5);
                     }
                 },
                 {
                     name: "}14",
                     chargeAmt: 350,
                     damage: 14,
                     attackTimes: 1,
                     attackSprites: ['robot_claw_1.png'],
                     startFunction: () => {
                         this.claw1Attacked = false;
                         this.pullbackScale = this.pullbackScaleDefault;
                         this.attackScale = this.attackScaleDefault;
                         this.attackEase = "Cubic.easeIn";
                         this.returnEase = "Cubic.easeOut";
                     },
                     attackStartFunction: () => {
                         this.refreshAnimateBG(2, 0.1);
                     },
                     attackFinishFunction: () => {
                         this.claw1Attacked = !this.claw1Attacked;
                         playSound('voca_claw_1', 0.7);
                         playSound('voca_claw_2', 0.7);
                         playSound('sword_hit');
                         this.addDelay(() => {
                             if (!this.dead && this.shieldAdded) {
                                 this.sprite.setFrame(this.claw1Attacked ? 'robot_claw_2.png' : 'robot_claw_1.png')
                             }
                         }, 80);
                         let powEffect = getTempPoolObject('spells', 'damageEffect3.png', 'damageEffect3', 150);
                         powEffect.setPosition(gameConsts.halfWidth, globalObjects.player.getY() - 180).setDepth(998).setScale(1.6);
                         powEffect.play('damageEffectShort')
                     },
                     finaleFunction: () => {
                         this.attackEase = "Quad.easeOut";
                         this.returnEase = "Cubic.easeIn";
                     }
                 },
                 {
                     name: "|8x2",
                     chargeAmt: 400,
                     damage: 8,
                     attackTimes: 2,
                     attackSprites: ['robot_claw_1.png', 'robot_claw_1.png'],
                     startFunction: () => {
                         this.claw1Attacked = true;
                         this.pullbackScale = this.pullbackScaleDefault;
                         this.attackScale = this.attackScaleDefault;
                         this.attackEase = "Cubic.easeIn";
                         this.returnEase = "Cubic.easeOut";
                     },
                     attackStartFunction: () => {
                         this.refreshAnimateBG(2, 0.1);
                     },
                     attackFinishFunction: () => {
                         this.claw1Attacked = !this.claw1Attacked;
                         playSound(this.claw1Attacked ? 'voca_claw_1' : 'voca_claw_2', 0.8);
                         playSound('sword_hit');
                         this.addDelay(() => {
                             if (!this.dead && this.shieldAdded) {
                                 this.sprite.setFrame(this.claw1Attacked ? 'robot_claw_2.png' : 'robot_claw_1.png')
                             }
                         }, 80);
                         let powEffect = getTempPoolObject('spells', 'damageEffect3.png', 'damageEffect3', 150)
                         let xOffset = this.claw1Attacked ? -30 : 30;
                         powEffect.setPosition(gameConsts.halfWidth + xOffset, globalObjects.player.getY() - 180).setDepth(998).setScale(1.5);
                         powEffect.play('damageEffectShort')
                     },
                     finaleFunction: () => {
                         this.attackEase = "Quad.easeOut";
                         this.returnEase = "Cubic.easeIn";
                     }
                 },
             ],
             [
                 // 8
                 {
                     name: "EMERGENCY SHIELD {250",
                     isPassive: true,
                     chargeAmt: 600,
                     block: 250,
                     chargeMult: 12,
                     damage: -1,
                     startFunction: () => {
                         this.pullbackScale = 0.99;
                         this.attackScale = 1.02;

                     },
                     attackStartFunction: () => {
                         playSound('power_surge_plain');
                        this.currentAttackSetIndex = 9;
                        this.nextAttackIndex = 0;
                     },
                     attackFinishFunction: () => {
                     }
                 },
            ],
            [
                 {
                     name: "MIS-AIMED MISSILE }8x0",
                     chargeAmt: 800,
                     damage: -1,
                     startFunction: () => {
                         this.pullbackScale = 0.99;
                         this.attackScale = 1.02;
                         playSound('robot_sfx_1');
                     },
                     attackStartFunction: () => {
                         if (!this.exhausted) {
                             playSound('voca_missile_broken', 0.8);
                         }
                         this.createMissileObject(this.x - 50, this.y - 1, -0.4, 0);
                     },
                     attackFinishFunction: () => {
                         this.fireMissilesDud(0);
                         messageBus.publish('enemyTakeTrueDamage', 4, false);
                     }
                 },
                 {
                     name: "FAILING CIRCUITS $12",
                     chargeAmt: 800,
                     damage: -1,
                     startFunction: () => {
                         this.failingAttack = 12;
                         this.pullbackScale = 0.99;
                         this.attackScale = 1.02;
                         this.startWeakLaser();
                         playSound('robot_sfx_2');
                     },
                     attackStartFunction: () => {
                         this.weakLaserFinished = true;
                         if (!this.exhausted) {
                             playSound('voca_laser_broken', 0.8);
                         }
                         this.fireMusic(this.failingAttack, 0.8, 3000, true);

                         this.laserFake = this.addSprite(this.x - 5, this.y -30, 'enemies', 'robot_blast_small1.png').setScale(0.8).setDepth(9999).setAlpha(0.1);
                         this.addTween({
                             targets: this.laserFake,
                             alpha: 0.8,
                             ease: "Quad.easeOut",
                             duration: 400,
                             onComplete: () => {
                                 this.addTween({
                                     targets: this.laserFake,
                                     alpha: 0.4,
                                     scaleX: 0.6,
                                     scaleY: 0.6,
                                     ease: "Back.easeOut",
                                     duration: 500,
                                     onComplete: () => {
                                         this.addTween({
                                             targets: this.laserFake,
                                             alpha: 0.8,
                                             ease: "Back.easeOut",
                                             duration: 650,
                                             onComplete: () => {
                                                 this.addTween({
                                                     targets: this.laserFake,
                                                     alpha: 0,
                                                     ease: 'Quad.easeIn',
                                                     duration: 500,
                                                     onComplete: () => {
                                                         this.laserFake.destroy();
                                                     }
                                                 });
                                             }
                                         });
                                     }
                                 });
                             }
                         });
                     },
                     attackFinishFunction: () => {
                         messageBus.publish('enemyTakeTrueDamage', 2, false);
                         this.laserHeart.setAlpha(0.6).setScale(0.25).setPosition(gameConsts.halfWidth, globalObjects.player.getY() - 150);
                         this.addTween({
                             targets: this.laserHeart,
                             scaleX: 0.55,
                             scaleY: 0.55,
                             duration: 1000,
                             ease: 'Cubic.easeOut',
                         });
                         this.addTween({
                             targets: this.laserHeart,
                             alpha: 0,
                             ease: 'Quad.easeOut',
                             duration: 1000,
                         });
                     }
                 },
                 {
                     name: "}2",
                     isPassive: true,
                     chargeAmt: 800,
                     damage: 2,
                     startFunction: () => {
                         this.pullbackScale = 0.98;
                         this.attackScale = 1.05;
                     },
                     attackFinishFunction: () => {
                         playSound('clunk2');
                         this.exhausted = true;
                         messageBus.publish('enemyTakeTrueDamage', 2, false);
                     },
                 },
             ]
         ];
     }

     startWeakLaser() {
         if (!this.dead && !this.weakLaserFinished) {
             this.addDelayedCall(2000, () => {
                 this.failingAttack = Math.max(1, this.failingAttack - 1);
                 this.attackName.setText("FAILING CIRCUITS $" + this.failingAttack +" ");
                 this.startWeakLaser();
             });
         }
     }

     die() {
        if (this.dead) {
             return;
        }
         switchBackground('tunnel.webp');

        super.die();
        if (this.blush) {
            this.blush.visible = false;
        }
         this.disco.destroy();
        if (this.currAnim) {
            this.currAnim.stop();
        }
         this.boomListener = this.addSubscription('robotExplosion', () => {
             this.animateBoomEyeshine();
             this.animateSelfDestructText();
         });
        globalObjects.bannerTextManager.closeBanner();
        if (this.currBGAnim) {
            this.currBGAnim.stop();
        }
        if (this.shineAnim) {
            this.shineAnim.stop();
        }
        this.minusDamage1.visible = false;
        this.minusDamage2.visible = false;
        this.lightShineLeft.visible = false;
        this.lightShineLeftTop.visible = false;
        this.lightShineRight.visible = false;
        this.lightShineRightTop.visible = false;
        this.setDefense(0);

         this.addTween({
             targets: this.tunnelBG,
             duration: 700,
             alpha: 0,
             ease: 'Quint.easeOut',
         });
         let deathBoom = this.addSprite(this.sprite.x, this.sprite.y, 'enemies', 'robot_blast.png').setDepth(0).setOrigin(0.5, 0.65).setScale(0.25, -0.25);
         this.addTween({
             targets: deathBoom,
             alpha: 0,
             duration: 900,
             ease: 'Quad.easeIn',
             onComplete: () => {
                 deathBoom.destroy();
             }
         });
         this.addTween({
             targets: deathBoom,
             scaleX: 1,
             scaleY: -1,
             duration: 900,
             ease: 'Cubic.easeOut',
         });
        playSound('voca_kya_damaged', 0.85);
         this.cleanUpTweens();
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


         this.addTween({
             targets: this.sprite,
             rotation: -0.2,
             ease: "Cubic.easeIn",
             duration: 300,
             onComplete: () => {
                 this.setDefaultSprite('robot_dead_left.png', this.sprite.scaleX, true);
                 this.sprite.y = this.sprite.startY;
                 this.sprite.setRotation(0);
                 this.addTween({
                     targets: this.sprite,
                     y: "+=125",
                     ease: "Cubic.easeIn",
                     duration: 950,
                     onComplete: () => {
                         playSound('clunk');
                         this.addTween({
                             targets: this.sprite,
                             y: "-=30",
                             rotation: "+=0.3",
                             ease: "Cubic.easeOut",
                             duration: 600,
                             onComplete: () => {
                                 this.setDefaultSprite('robot_dead_right.png', this.sprite.scaleX, true);
                                 this.sprite.setRotation(-0.3);
                                 this.addTween({
                                     targets: this.sprite,
                                     y: "+=30",
                                     rotation: "+=0.3",
                                     ease: "Cubic.easeIn",
                                     duration: 450,
                                     onComplete: () => {
                                         playSound('clunk2');
                                         this.setDefaultSprite('robot_dead.png', this.sprite.scaleX, true);
                                         this.sprite.setRotation(0.2);
                                         this.addTween({
                                             targets: this.sprite,
                                             y: "-=5",
                                             rotation: "-=0.3",
                                             ease: "Cubic.easeOut",
                                             duration: 200,
                                             onComplete: () => {
                                                 this.addTween({
                                                     targets: this.sprite,
                                                     y: "+=5",
                                                     ease: "Cubic.easeIn",
                                                     duration: 200,
                                                     onComplete: () => {
                                                         this.sprite.setRotation(0);
                                                         playSound('clunk2');

                                                         this.addTimeout(() => {
                                                             let rune = this.addSprite(this.x, this.y, 'tutorial', 'rune_protect_large.png').setScale(0).setVisible(false);
                                                             this.addTween({
                                                                 targets: rune,
                                                                 x: gameConsts.halfWidth,
                                                                 y: gameConsts.halfHeight - 170,
                                                                 scaleX: 1,
                                                                 scaleY: 1,
                                                                 ease: "Cubic.easeOut",
                                                                 duration: 1500,
                                                                 onComplete: () => {
                                                                     this.showVictory(rune);
                                                                 }
                                                             });
                                                         }, 2750)

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

     createMissileObject(x, y, rotation = 0, delay = 0) {
         let newObj = this.addSprite(x, y, 'enemies', 'missile.png').setRotation(rotation).setScale(0).setDepth(0).setOrigin(0.5, 1.1);
         this.missileObjects.push(newObj);
         this.addTween({
             delay: delay,
             targets: newObj,
             scaleX: 1,
             scaleY: 1,
             ease: 'Back.easeOut',
             easeParams: [2],
             duration: 400
         });
     }

     animateSelfDestructText() {
         let selfDestructDesc = this.addBitmapText(this.sprite.x, this.sprite.y - 168, 'damage', "SELF DESTRUCT\nACTIVE IN", 42, 1).setDepth(999).setOrigin(0.5, 0.5);
         let selfDestructText = this.addBitmapText(this.sprite.x, this.sprite.y - 95, 'damage', "4", 54, 1).setDepth(999).setOrigin(0.5, 0.5).setScale(1.6);
        this.addTween({
            targets: selfDestructText,
            scaleX: 1,
            scaleY: 1,
            duration: 500,
            ease: 'Cubic.easeOut'
        });
        this.addTimeout(() => {
            selfDestructText.setText("3").setScale(1.4);
            playSound('voca_hello_short');
            this.addTween({
                targets: selfDestructText,
                scaleX: 1,
                scaleY: 1,
                duration: 500,
                ease: 'Cubic.easeOut'
            });
        this.addTimeout(() => {
            selfDestructText.setText("2").setScale(1.4);
            playSound('voca_hello_short').detune = -60;
            this.addTween({
                targets: selfDestructText,
                scaleX: 1,
                scaleY: 1,
                duration: 500,
                ease: 'Cubic.easeOut'
            });
            this.addTimeout(() => {
                selfDestructText.setText("1").setScale(1.4);
                playSound('voca_hello_short').detune = -120;
                this.addTween({
                    targets: selfDestructText,
                    scaleX: 1,
                    scaleY: 1,
                    duration: 500,
                    ease: 'Cubic.easeOut'
                });
                 this.addTimeout(() => {
                    let soundToKill = playSound('voca_hello');


                    selfDestructText.setText("GOODBYE!\n(die X3)\n ").setScale(1.4);
                    this.addTween({
                        targets: selfDestructText,
                        scaleX: 1.1,
                        scaleY: 1.1,
                        duration: 500,
                        ease: 'Cubic.easeOut'
                    });
                    selfDestructDesc.destroy();
                    let explosion = PhaserScene.add.sprite(this.x, this.y, 'spells', 'brickPattern2.png').setScale(0).setDepth(100010).setPosition(this.x, gameConsts.halfHeight - 50).setOrigin(0.5, 0.45);

                    this.addTween({
                        delay: 400,
                        targets: PhaserScene.cameras.main,
                        x: 10,
                        y: 3,
                        duration: 50,
                        onComplete: () => {
                            playSound('explosion');
                            soundToKill.volume = 0.1;
                            this.addTween({
                                targets: PhaserScene.cameras.main,
                                x: -10,
                                y: -3,
                                duration: 50,
                                onComplete: () => {
                                    this.addTween({
                                        targets: PhaserScene.cameras.main,
                                        x: 7,
                                        y: 6,
                                        duration: 50,
                                        onComplete: () => {
                                            soundToKill.stop();
                                            this.addTween({
                                                targets: PhaserScene.cameras.main,
                                                x: -2,
                                                y: -1,
                                                duration: 50,
                                                onComplete: () => {
                                                    this.addTween({
                                                        targets: PhaserScene.cameras.main,
                                                        x: 0,
                                                        y: 0,
                                                        duration: 50,
                                                        onComplete: () => {
                                                            this.goToDeathLevel(explosion)
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
                    this.addTimeout(() => {
                        explosion.setScale(1)
                        this.addTween({
                            targets: explosion,
                            duration: 300,
                            y: "-=10",
                            scaleX: 4.15,
                            scaleY: 4.15,
                            rotation: "+=100",
                            alpha: 4,
                            ease: 'Quad.easeIn',
                            onComplete: () => {
                                explosion.setRotation(0);
                                 selfDestructText.destroy();
                            }
                        });
                    }, 500);
                 }, 1000)
             }, 1000)
         }, 1000)
        }, 750);
     }

     animateBoomEyeshine() {
         this.eyeShine.visible = true;
         this.eyeShine.setAlpha(0.7).setScale(0.8).setPosition(this.sprite.x, this.sprite.y).setDepth(9999);
         this.addTween({
             targets: this.eyeShine,
             duration: 2500,
             scaleX: 1.9,
             scaleY: 1.75,
             alpha: 1.05,
             ease: 'Quad.easeOut',
         });
         this.addTween({
             targets: this.eyeShine,
             duration: 2500,
             rotation: "-=0.3",
             ease: 'Quad.easeOut',
             onComplete: () => {
                 this.addTween({
                     targets: this.eyeShine,
                     duration: 150,
                     scaleX: 2,
                     rotation: "+=0.05",
                     ease: 'Quart.easeOut',
                     onComplete: () => {
                         this.addTween({
                             targets: this.eyeShine,
                             duration: 150,
                             scaleX: 2.2,
                             rotation: "-=0.1",
                             ease: 'Quart.easeOut',
                             onComplete: () => {
                                 this.addTween({
                                     targets: this.eyeShine,
                                     duration: 150,
                                     scaleX: 2.5,
                                     rotation: "+=0.15",
                                     ease: 'Quart.easeOut',
                                     onComplete: () => {
                                         this.addTween({
                                             targets: this.eyeShine,
                                             duration: 150,
                                             scaleX: 3,
                                             scaleY: 2.3,
                                             rotation: "-=0.2",
                                             ease: 'Quart.easeOut',
                                             onComplete: () => {
                                                 this.addTween({
                                                     targets: this.eyeShine,
                                                     duration: 150,
                                                     scaleY: 2.5,
                                                     scaleX: 3.3,
                                                     rotation: "+=0.25",
                                                     ease: 'Quart.easeOut',
                                                     onComplete: () => {
                                                         this.addTween({
                                                             targets: this.eyeShine,
                                                             duration: 250,
                                                             scaleX: 1.75,
                                                             scaleY: 1.5,
                                                             rotation: 0.1,
                                                             ease: 'Cubic.easeIn',
                                                             onComplete: () => {
                                                                 this.addTween({
                                                                     targets: this.eyeShine,
                                                                     duration: 250,
                                                                     scaleX: 0,
                                                                     scaleY: 0,
                                                                     rotation: 0,
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
     }

     fireMissilesDud() {
         while (this.missileObjects.length > 0) {
             let currObj = this.missileObjects.pop();
             let delayAmt = 150;
             this.addTween({
                 delay: delayAmt,
                 targets: currObj,
                 x: "-=150",
                 rotation: "-=0.2",
                 duration: 1500
             });
             this.addTween({
                 delay: delayAmt,
                 targets: currObj,
                 y: "+=150",
                 ease: 'Back.easeIn',
                 duration: 1500,
                 onComplete: () => {
                     currObj.rotation = Math.PI * -0.5;
                     this.addTween({
                         delay: 2000,
                         targets: currObj,
                         alpha: 0,
                         duration: 1000,
                         onComplete: () => {
                             currObj.destroy();
                         }
                     });
                 }
             });

         }
     }

     fireMissiles(damage = 6) {
         let totalObjects = this.missileObjects.length;
         let isFirstMissile = true;
         while (this.missileObjects.length > 0) {
             let currObj = this.missileObjects.pop();
             let missileIndex = this.missileObjects.length;
             let delayAmt = this.missileObjects.length * 140;
             let xGoal = Math.sin(currObj.rotation) * 250;
             let yGoal = -Math.cos(currObj.rotation) * 250;
             this.addTween({
                 delay: delayAmt,
                 targets: currObj,
                 x: "+=" + xGoal,
                 y: "+=" + yGoal,
                 duration: 140,
                 onStart: () => {
                     if (isFirstMissile) {
                         playSound('missile_launch_1', 0.8);
                         isFirstMissile = false;
                     } else if (missileIndex === 0) {
                         playSound('missile_launch_1', 0.7);
                     } else if (missileIndex % 2 == 0) {
                         playSound('missile_launch_2', 0.7);
                     }
                 },
                 onComplete: () => {
                     let startX = gameConsts.halfWidth * 0.6 + currObj.x * 0.4;
                     let xOffset = gameConsts.halfWidth - startX;
                     this.addTween({
                         targets: currObj,
                         delay: 300,
                         y: globalObjects.player.getY() - 195 + Math.abs(xOffset * 0.3),
                         x: gameConsts.halfWidth * 0.65 + startX * 0.35,
                         ease: 'Quad.easeIn',
                         duration: 300,
                         onStart: () => {
                             currObj.setPosition(startX, -100);
                             currObj.setRotation(Math.PI - xOffset * 0.0007);
                             currObj.setDepth(90);
                         },
                         onComplete: () => {
                             let powEffect = getTempPoolObject('spells', 'damageEffect3.png', 'damageEffect3', 200);
                             powEffect.setPosition(currObj.x, currObj.y).setDepth(999).setScale(1.5).setAlpha(1.2).setRotation(Math.random() - 0.5);
                             this.addTween({
                                 targets: powEffect,
                                 scaleX: 2.4,
                                 scaleY: 2.4,
                                 ease: 'Cubic.easeOut',
                                 duration: 200,
                             })
                             this.addTween({
                                 targets: powEffect,
                                 alpha: 0,
                                 ease: 'Quad.easeIn',
                                 duration: 200,
                             })
                             currObj.destroy();
                             screenShake(1);

                             playSound('razor_leaf', 0.75);
                             messageBus.publish("selfTakeDamage", damage);
                         }
                     });
                 }
             });
         }
     }

     flashBullet(bullet, sfx, damage) {
         bullet.setScale(1.05);
         if (this.bulletTween) {
             this.bulletTween.stop();
         }
         this.bulletTween = this.addTween({
             targets: bullet,
             scaleX: 1,
             scaleY: 1,
             ease: 'Cubic.easeOut',
             duration: 100,
         })
         playSound(sfx);
         messageBus.publish("selfTakeDamage", damage);
         let powEffect = getTempPoolObject('circle', 'blastEffect0.png', 'blastEffect', 300);
         let randX = 100 * (Math.random() - 0.5)
         powEffect.setPosition(gameConsts.halfWidth + randX, globalObjects.player.getY() - 210 + Math.abs(randX) * 0.3).setDepth(998).play('blastEffect').setScale(1.5).setRotation(Math.random() * 6);

     }

     shootBullets(damage = 4, initDelay = 150) {
        this.addDelay(() => {
             if (!this.dead && this.shieldAdded) {
                 if (!this.fireEffect) {
                     this.fireEffect = this.addSprite(this.sprite.x, this.sprite.y - 15, 'enemies', 'robot_fire_1.png').setDepth(11);
                 }
                 let fireDelay = 120;
                 this.fireEffect.setVisible(true);
                 this.flashBullet(this.fireEffect, 'big_gun_pow_1', damage)
                 this.addDelayedCall(fireDelay, () => {
                     if (!this.dead && this.shieldAdded) {
                         this.fireEffect.setFrame('robot_fire_2.png');
                         this.flashBullet(this.fireEffect, 'big_gun_pow_2', damage);
                         this.addDelayedCall(fireDelay, () => {
                             if (!this.dead && this.shieldAdded) {
                                 this.fireEffect.setFrame('robot_fire_1.png')
                                 this.flashBullet(this.fireEffect, 'big_gun_pow_1', damage)
                                 this.addDelayedCall(fireDelay, () => {
                                     if (!this.dead && this.shieldAdded) {
                                         this.fireEffect.setFrame('robot_fire_2.png');
                                         this.flashBullet(this.fireEffect, 'big_gun_pow_2', damage)
                                         this.addDelayedCall(fireDelay, () => {
                                             if (!this.dead && this.shieldAdded) {
                                                 this.fireEffect.setFrame('robot_fire_1.png');
                                                 this.flashBullet(this.fireEffect, 'big_gun_pow_1', damage)
                                                 this.addDelayedCall(fireDelay, () => {
                                                     if (!this.dead && this.shieldAdded) {
                                                         this.fireEffect.setFrame('robot_fire_2.png');
                                                         this.flashBullet(this.fireEffect, 'big_gun_pow_2', damage)
                                                         this.addDelayedCall(fireDelay, () => {
                                                           this.fireEffect.setVisible(false);
                                                            this.addDelay(() => {
                                                                 if (!this.dead && this.shieldAdded) {
                                                                     this.setDefaultSprite('robot1.png');
                                                                     this.sprite.y = this.sprite.startY;
                                                                     this.setSprite('robot1.png');
                                                                 }
                                                            }, 800);
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
        }, initDelay);
     }

     fireLaser(damage = 16) {
         if (!this.dead) {
             if (!this.laserBeam) {
                 this.laserBeam = this.addSprite(this.sprite.x, this.sprite.y - 5, 'enemies', 'robot_laser_fire.png').setDepth(11).setOrigin(0.5, 0.1);
             }
             let backgroundBlack = getBackgroundBlackout();
             backgroundBlack.setDepth(-3).setAlpha(0);
             this.backgroundTween = this.addTween({
                 targets: backgroundBlack,
                 alpha: 0.4,
                 duration: 1000,
             });

             this.laserCharge.setScale(0.2).setAlpha(0.5);
             this.laserHeart.setScale(0.25).setAlpha(0);
             this.laserBeam.setScale(1).setVisible(false);
             this.laserTween = this.addTween({
                 targets: this.laserCharge,
                 scaleX: 0.3,
                 scaleY: 0.3,
                 alpha: 0.75,
                 easeParams: [4],
                 ease: 'Back.easeOut',
                 duration: 400,
                 onComplete: () => {
                     this.laserCharge.setAlpha(0.5);
                     this.laserCharge.setRotation(this.laserCharge.rotation + 0.4 + Math.random() * 0.4);
                     this.laserTween = this.addTween({
                         targets: this.laserCharge,
                         scaleX: 0.5,
                         scaleY: 0.5,
                         alpha: 0.75,
                         easeParams: [4],
                         ease: 'Back.easeOut',
                         duration: 400,
                         onComplete: () => {
                             this.laserCharge.setAlpha(0.5);
                             this.laserCharge.setRotation(this.laserCharge.rotation + 0.4 + Math.random() * 0.4);
                             this.laserTween = this.addTween({
                                 targets: this.laserCharge,
                                 scaleX: 0.75,
                                 scaleY: 0.75,
                                 alpha: 0.85,
                                 easeParams: [4],
                                 ease: 'Back.easeOut',
                                 duration: 600,
                                 onComplete: () => {
                                     this.laserCharge.setRotation(this.laserCharge.rotation + 0.4 + Math.random() * 0.4).setScale(0.65);
                                     this.laserHeart.setAlpha(1.1);
                                     this.addTween({
                                         targets: this.laserHeart,
                                         scaleX: 0.75,
                                         scaleY: 0.75,
                                         ease: 'Quint.easeOut',
                                         duration: 750,
                                     })

                                     this.addTween({
                                         targets: this.laserHeart,
                                         alpha: 0,
                                         ease: 'Quad.easeIn',
                                         duration: 750,
                                     });
                                     this.animateLaserBeam(damage, true);
                                 }
                             })
                         }
                     })
                 }
             })
         }
     }

     animateLaserBeam(damage, repeat) {
         if (this.backgroundTween) {
             this.backgroundTween.stop();
         }
         let backgroundBlack = getBackgroundBlackout();
         playSound('robot_laser').detune = repeat ? 0 : 150;
         this.laserBeam.setVisible(true);

         this.laserHeart.setAlpha(1).setScale(0.25).setPosition(gameConsts.halfWidth, globalObjects.player.getY() - 150);
         this.addTween({
             targets: this.laserHeart,
             scaleX: 0.8,
             scaleY: 0.8,
             duration: 450,
             ease: 'Cubic.easeOut',
         });
         this.addTween({
             targets: this.laserHeart,
             alpha: 0,
             ease: 'Quad.easeIn',
             duration: 450,
         });

         let delayInterval = 40;
         this.laserTween = this.addTween({
             delay: delayInterval,
             targets: this.laserBeam,
             scaleX: 1.08,
             scaleY: 1.08,
             duration: 15,
             ease: 'Quint.easeOut',
             onComplete: () => {
                 backgroundBlack.setAlpha(repeat ? 0.7 : 0.9);
                 console.log("damage: ", damage);
                 messageBus.publish("selfTakeDamage", damage);
                 screenShake(3);
                 this.laserCharge.setRotation(this.laserCharge.rotation + 0.4 + Math.random() * 0.4).setScale(0.65);
                 this.laserTween = this.addTween({
                     delay: delayInterval,
                     targets: this.laserBeam,
                     scaleX: 1,
                     scaleY: 1.02,
                     duration: 15,
                     ease: 'Quint.easeOut',
                     onComplete: () => {
                         this.laserCharge.setRotation(this.laserCharge.rotation + 0.4 + Math.random() * 0.4).setScale(0.65);
                         this.laserTween = this.addTween({
                             delay: delayInterval,
                             targets: this.laserBeam,
                             scaleX: 1.1,
                             scaleY: 1.1,
                             duration: 15,
                             ease: 'Quint.easeOut',
                             onComplete: () => {
                                 zoomTemp(1.01);
                                 this.laserCharge.setRotation(this.laserCharge.rotation + 0.4 + Math.random() * 0.4).setScale(0.65);
                                 this.laserTween = this.addTween({
                                     delay: delayInterval,
                                     targets: this.laserBeam,
                                     scaleX: 1.01,
                                     scaleY: 0.99,
                                     duration: 15,
                                     ease: 'Quint.easeOut',
                                     onComplete: () => {
                                         zoomTemp(1.01);
                                         this.laserCharge.setRotation(this.laserCharge.rotation + 0.4 + Math.random() * 0.4).setScale(0.65);
                                         this.laserTween = this.addTween({
                                             delay: delayInterval,
                                             targets: this.laserBeam,
                                             scaleX: 1.15,
                                             scaleY: 1.1,
                                             duration: 15,
                                             ease: 'Quint.easeOut',
                                             onComplete: () => {
                                                 this.laserCharge.setRotation(this.laserCharge.rotation + 0.4 + Math.random() * 0.4).setScale(0.65);
                                                 this.laserTween = this.addTween({
                                                     delay: delayInterval,
                                                     targets: this.laserBeam,
                                                     scaleX: 1.1,
                                                     scaleY: 1.05,
                                                     duration: 15,
                                                     ease: 'Quint.easeOut',
                                                     onComplete: () => {
                                                         zoomTemp(1.02);
                                                         this.laserCharge.setRotation(this.laserCharge.rotation + 0.4 + Math.random() * 0.4).setScale(0.65);
                                                         this.laserTween = this.addTween({
                                                             delay: delayInterval,
                                                             targets: this.laserBeam,
                                                             scaleX: 1.25,
                                                             scaleY: 1.1,
                                                             duration: 15,
                                                             ease: 'Quint.easeOut',
                                                             onComplete: () => {
                                                                 this.laserCharge.setRotation(this.laserCharge.rotation + 0.4 + Math.random() * 0.4).setScale(0.65);
                                                                 this.laserTween = this.addTween({
                                                                     delay: delayInterval * 0.75,
                                                                     targets: this.laserBeam,
                                                                     scaleX: 1.1,
                                                                     scaleY: 1.05,
                                                                     duration: 15,
                                                                     ease: 'Quint.easeOut',
                                                                     onComplete: () => {
                                                                         zoomTemp(1.02);
                                                                         this.laserCharge.setRotation(this.laserCharge.rotation + 0.4 + Math.random() * 0.4).setScale(0.65);
                                                                         this.laserTween = this.addTween({
                                                                             delay: delayInterval * 0.75,
                                                                             targets: this.laserBeam,
                                                                             scaleX: 1.25,
                                                                             scaleY: 1.1,
                                                                             duration: 15,
                                                                             ease: 'Quint.easeOut',
                                                                             onComplete: () => {
                                                                                 this.addTween({
                                                                                     targets: this.laserCharge,
                                                                                     alpha: 0,
                                                                                     scaleX: 0.5,
                                                                                     scaleY: 0.5,
                                                                                     duration: 150,
                                                                                     ease: 'Cubic.easeIn',
                                                                                 });
                                                                                 this.laserTween = this.addTween({
                                                                                     delay: delayInterval,
                                                                                     targets: this.laserBeam,
                                                                                     scaleX: 1,
                                                                                     scaleY: 1,
                                                                                     duration: 500,
                                                                                     ease: 'Quint.easeOut',
                                                                                     onStart: () => {
                                                                                         this.laserBeam.setVisible(false);
                                                                                         if (repeat) {
                                                                                             this.fireSecondLaser(damage);
                                                                                         } else {
                                                                                             this.addTween({
                                                                                                 targets: backgroundBlack,
                                                                                                 alpha: 0,
                                                                                                 duration: 450
                                                                                             });
                                                                                             this.laserCharge.setRotation(this.laserCharge.rotation + 0.4 + Math.random() * 0.4).setScale(0.65);
                                                                                             this.laserHeart.setAlpha(1).setScale(0.25).setPosition(gameConsts.halfWidth, globalObjects.player.getY() - 150);
                                                                                             this.addTween({
                                                                                                 targets: this.laserHeart,
                                                                                                 scaleX: 0.8,
                                                                                                 scaleY: 0.8,
                                                                                                 duration: 900,
                                                                                                 ease: 'Cubic.easeOut',
                                                                                             });
                                                                                             this.addTween({
                                                                                                 targets: this.laserHeart,
                                                                                                 alpha: 0,
                                                                                                 ease: 'Quad.easeIn',
                                                                                                 duration: 900,
                                                                                             });

                                                                                         }
                                                                                     },
                                                                                     onComplete: () => {
                                                                                         if (!repeat) {
                                                                                             playSound('robot_sfx_2');
                                                                                             this.setDefaultSprite('robot1.png');
                                                                                             this.sprite.y = this.sprite.startY;
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

     fireSecondLaser(damage) {
         this.laserCharge.setScale(0.2).setAlpha(0.5);
         this.laserHeart.setScale(0.25).setAlpha(0);
         this.laserBeam.setScale(1).setVisible(false);
         this.addTween({
             targets: this.sprite,
             scaleX: this.sprite.scaleX - 0.12,
             scaleY: this.sprite.scaleX - 0.12,
             duration: 500,
             ease: 'Cubic.easeOut',
         })
         this.laserCharge.setAlpha(0.5);
         this.laserCharge.setRotation(this.laserCharge.rotation + 0.4 + Math.random() * 0.4);
         this.laserTween = this.addTween({
             targets: this.laserCharge,
             scaleX: 0.5,
             scaleY: 0.5,
             alpha: 0.75,
             easeParams: [4],
             ease: 'Back.easeOut',
             duration: 150,
             onComplete: () => {
                 this.laserCharge.setAlpha(0.5);
                 this.laserCharge.setRotation(this.laserCharge.rotation + 0.4 + Math.random() * 0.4);
                 this.laserTween = this.addTween({
                     targets: this.laserCharge,
                     scaleX: 0.75,
                     scaleY: 0.75,
                     alpha: 0.85,
                     easeParams: [4],
                     ease: 'Back.easeOut',
                     duration: 200,
                     onComplete: () => {
                         this.laserCharge.setRotation(this.laserCharge.rotation + 0.4 + Math.random() * 0.4).setScale(0.65);
                         this.laserHeart.setAlpha(1.1);
                         this.addTween({
                             targets: this.laserHeart,
                             scaleX: 0.8,
                             scaleY: 0.8,
                             ease: 'Quint.easeOut',
                             duration: 500,
                         })

                         this.addTween({
                             targets: this.laserHeart,
                             alpha: 0,
                             ease: 'Quad.easeIn',
                             duration: 600,
                         });
                         this.animateLaserBeam(damage, false);
                         this.addTween({
                             delay: 10,
                             targets: this.sprite,
                             scaleX: this.sprite.scaleX + 0.2,
                             scaleY: this.sprite.scaleX + 0.2,
                             duration: 50,
                             onComplete: () => {
                                 this.addTween({
                                     targets: this.sprite,
                                     scaleX: this.sprite.scaleX - 0.08,
                                     scaleY: this.sprite.scaleX - 0.08,
                                     duration: 500,
                                     onComplete: () => {

                                     }
                                 })
                             }
                         })
                     }
                 })
             }
         })
     }

     showVictory(rune) {
         globalObjects.magicCircle.disableMovement();
         let banner = this.addSprite(gameConsts.halfWidth, gameConsts.halfHeight - 35, 'misc', 'victory_banner.png').setScale(100, 1.2).setDepth(9998).setAlpha(0);
         let victoryText = this.addSprite(gameConsts.halfWidth, gameConsts.halfHeight - 44, 'misc', 'victory_text.png').setScale(0.95).setDepth(9998).setAlpha(0);
         let continueText = this.addText(gameConsts.halfWidth, gameConsts.halfHeight + 2, getLangText('cont_ui'), {fontFamily: 'garamondmax', color: '#F0F0F0', fontSize: 18}).setAlpha(0).setOrigin(0.5, 0.5).setAlign('center').setDepth(9998);

         this.addTween({
             targets: banner,
             alpha: 0.75,
             duration: 500,
         });

         this.addTween({
             targets: [victoryText],
             alpha: 1,
             ease: 'Quad.easeOut',
             duration: 500,
         });
         playSound('victory_false');
         this.addTimeout(() => {
             continueText.alpha = 1;
         }, 1000);

         this.addTween({
             targets: victoryText,
             scaleX: 1,
             scaleY: 1,
             duration: 800,
         });
         this.addTween({
             targets: rune,
             y: gameConsts.halfHeight - 110,
             ease: 'Cubic.easeOut',
             duration: 400,
             onComplete: () => {
                 if (canvas) {
                     canvas.style.cursor = 'pointer';
                 }
                 this.dieClickBlocker.setOnMouseUpFunc(() => {
                     if (canvas) {
                         canvas.style.cursor = 'default';
                     }
                     this.dieClickBlocker.destroy();
                     continueText.destroy();
                     this.addTween({
                         targets: [victoryText, banner],
                         alpha: 0,
                         duration: 400,
                         onComplete: () => {
                             victoryText.destroy();
                             banner.destroy();
                             globalObjects.postFightScreen.createWinScreenBoom(this.level);
                         }
                     });
                     rune.destroy();
                 })
             }
         });
     }

     goToDeathLevel(explosion) {
        this.destroy();
        gameVars.showFinaleDeathSpeech = true;
         fadeInBackgroundAtlas('backgrounds', 'background4.png', 2000, 1, 1, 1, 'Cubic.easeInOut', 0, false);
        swirlInReaperFog(1.25);
        PhaserScene.tweens.add({
            delay: 200,
            targets: explosion,
            alpha: 0,
            duration: 800,
            onStart: () => {
                beginLevel(this.level + 1)
            }
        })
     }
}
