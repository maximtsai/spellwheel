 class Death extends Enemy {
     constructor(scene, x, y) {
         super(scene, x, y);
         this.initSprite('blurryball.png', 0.7);
        this.sprite.setOrigin(0.5, 0.4);
         this.bgMusic = playMusic('heartbeat', 0.75, true);
        swirlInReaperFog(1.25);
        this.setupCustomDeathSprite();
        setTimeout(() => {
             this.setAsleep();
            globalObjects.magicCircle.disableMovement();
            this.mainScythe = this.addSprite(this.x, this.y + 75, 'misc', 'scythe1.png').setDepth(200).setAlpha(0).setRotation(-0.6).setOrigin(0.5, 0.9);
         }, 10)
     }

     initStatsCustom() {
         this.health = 4;
         this.scytheObjects = [];
     }

     swingScytheFast(damage = 4444, fadeOutScythe = true, flipped = false, onComplete) {
         let flipMult = flipped ? 1 : 1;
         // this.mainScythe.setPosition(this.mainScythe.x, 160).setDepth(999).setAlpha(0).setScale(0.65*flipMult, 0.65).setRotation(-1.5);
         let scythe = this.mainScythe;
         PhaserScene.tweens.add({
             targets: scythe,
             alpha: 1,
             duration: 450
         })

         PhaserScene.tweens.add({
             targets: scythe,
             x: gameConsts.halfWidth + 5*flipMult,
             y: 100,
             scaleX: flipMult*0.75,
             scaleY: 0.75,
             rotation: -1.35,
             ease: 'Quart.easeIn',
             duration: 400,
             onComplete: () => {
                 PhaserScene.time.delayedCall(820, () => {
                     tweenObjectRotationTo(globalObjects.deathLeftHand, -0.2, 500, "Cubic.easeOut");
                     tweenObjectRotationTo(globalObjects.deathRightHand, 0.1, 500, "Cubic.easeOut");
                 })
                 PhaserScene.tweens.add({
                     targets: scythe,
                     scaleX: flipMult*0.85,
                     scaleY: 0.85,
                     y: 90,
                     ease: 'Cubic.easeInOut',
                     duration: 900,
                 });
                 PhaserScene.tweens.add({
                     targets: scythe,
                     rotation: -0.5,
                     ease: 'Quart.easeOut',
                     duration: 900,
                     completeDelay: 200,
                     onComplete: () => {
                         scythe.play('scytheReap');
                         PhaserScene.tweens.add({
                             targets: scythe,
                             rotation: "-=1.5",
                             ease: 'Quint.easeIn',
                             duration: 50,
                             onComplete: () => {
                                 let fogSlice = getFogSlice();
                                 fogSlice.setPosition(gameConsts.halfWidth + 8, 25);
                                 let fogSliceDarken = getFogSliceDarken();
                                 fogSliceDarken.setPosition(gameConsts.halfWidth, gameConsts.halfHeight + 50);
                                 PhaserScene.tweens.add({
                                     targets: fogSliceDarken,
                                     alpha: 0.75,
                                     ease: 'Cubic.easeOut',
                                     duration: 500,
                                 });
                                 let oldSwirlAlpha = globalObjects.fogSwirl ? globalObjects.fogSwirl.alpha : 1;

                                 PhaserScene.tweens.add({
                                     targets: globalObjects.fogSwirl,
                                     alpha: 0.25,
                                     ease: 'Cubic.easeIn',
                                     duration: 300,
                                     onComplete: () => {
                                         PhaserScene.tweens.add({
                                             delay: 100,
                                             targets: globalObjects.fogSwirl,
                                             ease: 'Cubic.easeInOut',
                                             alpha: oldSwirlAlpha,
                                             duration: 1000,
                                         });
                                     }
                                 });
                                 PhaserScene.tweens.add({
                                     delay: 50,
                                     targets: [fogSlice],
                                     alpha: 1,
                                     ease: 'Quad.easeOut',
                                     duration: 200,
                                     onComplete: () => {
                                         PhaserScene.tweens.add({
                                             delay: 200,
                                             targets: [fogSlice, fogSliceDarken],
                                             ease: 'Quart.easeIn',
                                             alpha: 0,
                                             duration: 1400,
                                         });
                                     }
                                 });
                                 PhaserScene.tweens.add({
                                     delay: 50,
                                     targets: [fogSlice],
                                     scaleX: 1.08,
                                     scaleY: 1.08,
                                     ease: 'Quint.easeOut',
                                     duration: 300,
                                     onComplete: () => {
                                         PhaserScene.tweens.add({
                                             targets: [fogSlice],
                                             scaleX: 1.09,
                                             scaleY: 1.09,
                                             duration: 1500,
                                         });
                                     }
                                 });
                                 PhaserScene.tweens.add({
                                     delay: 50,
                                     targets: fogSlice,
                                     scaleX: 1.2,
                                     scaleY: 1.2,
                                     rotation: -0.85,
                                     ease: 'Quad.easeOut',
                                     duration: 1500,
                                 });
                                 setTimeout(() => {
                                     playSound('death_attack');
                                     messageBus.publish("selfTakeDamage", damage);
                                     messageBus.publish('showCircleShadow', 0.9);
                                     messageBus.publish('tempPause', 300, 0.01);
                                 }, 100);
                                 this.createScytheAttackSfx();


                                 PhaserScene.tweens.add({
                                     targets: scythe,
                                     scaleX: flipMult*1.35,
                                     scaleY: 1.35,
                                     ease: 'Quart.easeOut',
                                     duration: 200,
                                     onComplete: () => {
                                         PhaserScene.tweens.add({
                                             targets: scythe,
                                             scaleX: 1.05,
                                             scaleY: 1.05,
                                             ease: 'Quart.easeIn',
                                             duration: 500,
                                         })
                                     }
                                 })
                                 PhaserScene.tweens.add({
                                     targets: scythe,
                                     rotation: -3.5,
                                     x: flipped ? "+=10" : "-=10",
                                     ease: 'Quint.easeOut',
                                     duration: 500,
                                     onComplete: () => {
                                         repeatDeathHandsRotate();
                                         if (!fadeOutScythe) {
                                             if (onComplete) {
                                                 onComplete();
                                             }
                                         } else {
                                             PhaserScene.tweens.add({
                                                 delay: 200,
                                                 targets: scythe,
                                                 rotation: "+=0.1",
                                                 x: flipped ? "+=12" : "-=12",
                                                 ease: 'Quart.easeInOut',
                                                 duration: 2000,
                                             })
                                             PhaserScene.tweens.add({
                                                 targets: scythe,
                                                 alpha: 0,
                                                 delay: 1000,
                                                 scaleX: flipMult * 0.6,
                                                 scaleY: 0.6,
                                                 ease: 'Cubic.easeIn',
                                                 duration: 600,
                                                 completeDelay: 1000,
                                                 onComplete: onComplete
                                             });
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

     swingScythe(damage = 4444, fadeOutScythe = true, flipped = false, onComplete) {

         let flipMult = flipped ? -1 : 1;
         this.mainScythe.setPosition(this.mainScythe.x, 160).setDepth(999).setAlpha(0).setScale(0.65*flipMult, 0.65).setRotation(-1.5);
         let scythe = this.mainScythe;
         scythe.play('scytheFlash');
         PhaserScene.tweens.add({
             targets: scythe,
             alpha: 1,
             duration: 450
         })

         PhaserScene.tweens.add({
             targets: scythe,
             x: gameConsts.halfWidth + 5*flipMult,
             y: 100,
             scaleX: flipMult*0.75,
             scaleY: 0.75,
             rotation: -1.35,
             ease: 'Quart.easeIn',
             duration: 400,
             onComplete: () => {
                 PhaserScene.time.delayedCall(820, () => {
                     tweenObjectRotationTo(globalObjects.deathLeftHand, -0.2, 500, "Cubic.easeOut");
                     tweenObjectRotationTo(globalObjects.deathRightHand, 0.1, 500, "Cubic.easeOut");
                 })
                 PhaserScene.tweens.add({
                     targets: scythe,
                     scaleX: flipMult*0.85,
                     scaleY: 0.85,
                     y: 90,
                     ease: 'Cubic.easeInOut',
                     duration: 900,
                 });
                 PhaserScene.tweens.add({
                     targets: scythe,
                     rotation: -0.5,
                     ease: 'Quart.easeOut',
                     duration: 900,
                     completeDelay: 200,
                     onComplete: () => {
                         scythe.play('scytheReap');
                         PhaserScene.tweens.add({
                             targets: scythe,
                             rotation: "-=1.5",
                             ease: 'Quint.easeIn',
                             duration: 50,
                             onComplete: () => {
                                 let fogSlice = getFogSlice();
                                 fogSlice.setPosition(gameConsts.halfWidth + 8, 25);
                                 let fogSliceDarken = getFogSliceDarken();
                                 fogSliceDarken.setPosition(gameConsts.halfWidth, gameConsts.halfHeight + 50);
                                 PhaserScene.tweens.add({
                                     targets: fogSliceDarken,
                                     alpha: 0.75,
                                     ease: 'Cubic.easeOut',
                                     duration: 500,
                                 });
                                 let oldSwirlAlpha = globalObjects.fogSwirl ? globalObjects.fogSwirl.alpha : 1;

                                 PhaserScene.tweens.add({
                                     targets: globalObjects.fogSwirl,
                                     alpha: 0.25,
                                     ease: 'Cubic.easeIn',
                                     duration: 300,
                                     onComplete: () => {
                                         PhaserScene.tweens.add({
                                             delay: 100,
                                             targets: globalObjects.fogSwirl,
                                             ease: 'Cubic.easeInOut',
                                             alpha: oldSwirlAlpha,
                                             duration: 1000,
                                         });
                                     }
                                 });
                                 PhaserScene.tweens.add({
                                     delay: 50,
                                     targets: [fogSlice],
                                     alpha: 1,
                                     ease: 'Quad.easeOut',
                                     duration: 200,
                                     onComplete: () => {
                                         PhaserScene.tweens.add({
                                             delay: 200,
                                             targets: [fogSlice, fogSliceDarken],
                                             ease: 'Quart.easeIn',
                                             alpha: 0,
                                             duration: 1400,
                                         });
                                     }
                                 });
                                 PhaserScene.tweens.add({
                                     delay: 50,
                                     targets: [fogSlice],
                                     scaleX: 1.08,
                                     scaleY: 1.08,
                                     ease: 'Quint.easeOut',
                                     duration: 300,
                                     onComplete: () => {
                                         PhaserScene.tweens.add({
                                             targets: [fogSlice],
                                             scaleX: 1.09,
                                             scaleY: 1.09,
                                             duration: 1500,
                                         });
                                     }
                                 });
                                 PhaserScene.tweens.add({
                                     delay: 50,
                                     targets: fogSlice,
                                     scaleX: 1.2,
                                     scaleY: 1.2,
                                     rotation: -0.85,
                                     ease: 'Quad.easeOut',
                                     duration: 1500,
                                 });
                                 setTimeout(() => {
                                     playSound('death_attack');
                                     messageBus.publish("selfTakeDamage", damage);
                                    messageBus.publish('showCircleShadow', 0.9);
                                     messageBus.publish('tempPause', 300, 0.01);
                                 }, 100);
                                 this.createScytheAttackSfx();
                                 PhaserScene.tweens.add({
                                     targets: scythe,
                                     scaleX: flipMult*1.35,
                                     scaleY: 1.35,
                                     ease: 'Quart.easeOut',
                                     duration: 200,
                                     onComplete: () => {
                                         PhaserScene.tweens.add({
                                             targets: scythe,
                                             scaleX: 1.05,
                                             scaleY: 1.05,
                                             ease: 'Quart.easeIn',
                                             duration: 500,
                                         })
                                     }
                                 })
                                 PhaserScene.tweens.add({
                                     targets: scythe,
                                     rotation: -3.5,
                                     x: flipped ? "+=10" : "-=10",
                                     ease: 'Quint.easeOut',
                                     duration: 500,
                                     onComplete: () => {
                                         repeatDeathHandsRotate();
                                         if (!fadeOutScythe) {
                                             if (onComplete) {
                                                 onComplete();
                                             }
                                         } else {
                                             PhaserScene.tweens.add({
                                                 delay: 200,
                                                 targets: scythe,
                                                 rotation: "+=0.1",
                                                 x: flipped ? "+=12" : "-=12",
                                                 ease: 'Quart.easeInOut',
                                                 duration: 2000,
                                             })
                                             PhaserScene.tweens.add({
                                                 targets: scythe,
                                                 alpha: 0,
                                                 delay: 1000,
                                                 scaleX: flipMult * 0.6,
                                                 scaleY: 0.6,
                                                 ease: 'Cubic.easeIn',
                                                 duration: 600,
                                                 completeDelay: 1000,
                                                 onComplete: onComplete
                                             });
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

     // update(dt) {}

     // reset(x, y) {
     //     this.x = x;
     //     this.y = y;
     // }

     repeatTweenBreathe(duration = 1500, magnitude = 1) {
         if (this.breatheTween) {
             this.breatheTween.stop();
         }
     }

     setupCustomDeathSprite() {
        this.floatingDeath = getFloatingDeath();
        // this.floatingDeath1 = PhaserScene.add.sprite(gameConsts.halfWidth, gameConsts.halfHeight - 300, 'enemies', 'max_death_1a.png').setDepth(1).setScale(0.3).setAlpha(0);
        // this.floatingDeath2 = PhaserScene.add.sprite(gameConsts.halfWidth, gameConsts.halfHeight - 300, 'enemies', 'max_death_1b.png').setDepth(1).setScale(0.3).setAlpha(0);
        // this.floatingDeath1.fakeAlpha = 0;
        // this.floatingDeath2.fakeAlpha = 0;
        // this.deathBreathe();
        repeatDeathHandsRotate();
        startDeathFlutterAnim();
        tweenFloatingDeath(0.667, 1, 1800, "Cubic.easeOut", () => {
            globalObjects.bannerTextManager.setDialog([getLangText('deathFight1a'), getLangText('deathFight1b'), getLangText('deathFight1c')]);
            globalObjects.bannerTextManager.setPosition(gameConsts.halfWidth, gameConsts.halfHeight + 10, 0);
            globalObjects.bannerTextManager.showBanner(true);
            globalObjects.bannerTextManager.setOnFinishFunc(() => {
                globalObjects.magicCircle.enableMovement();
                this.setAwake();
                globalObjects.encyclopedia.showButton();
                globalObjects.options.showButton();
            })
        });
     }

/*
     deathBreathe() {
        if (this.flutterAnim) {
            this.flutterAnim.stop();
        }

        this.flutterAnim = PhaserScene.tweens.add({
            targets: this.floatingDeath2,
            alpha: this.floatingDeath2.fakeAlpha,
            duration: 500,
            ease: 'Cubic.easeIn',
            onComplete: () => {
                this.flutterAnim = PhaserScene.tweens.add({
                    targets: this.floatingDeath1,
                    alpha: 0,
                    duration: 500,
                    ease: 'Cubic.easeOut',
                    completeDelay: 700,
                    onComplete: () => {
                        this.floatingDeath2.setDepth(this.floatingDeath1.depth - 1);
                        this.flutterAnim = PhaserScene.tweens.add({
                            targets: this.floatingDeath1,
                            alpha: this.floatingDeath1.fakeAlpha,
                            duration: 500,
                            ease: 'Cubic.easeIn',
                            onComplete: () => {
                                this.flutterAnim = PhaserScene.tweens.add({
                                    targets: this.floatingDeath2,
                                    alpha: 0,
                                    duration: 500,
                                    ease: 'Cubic.easeOut',
                                    completeDelay: 700,
                                    onComplete: () => {
                                        this.floatingDeath2.setDepth(this.floatingDeath1.depth + 1);
                                        this.deathBreathe();
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });

     }
*/


     createScytheAttackSfx(flipped) {
         let darkScreen = PhaserScene.add.image(gameConsts.halfWidth, gameConsts.halfHeight, 'blackPixel').setScale(500).setDepth(980).setAlpha(1.1)
         if (!this.scytheBlur) {
             this.scytheBlur = PhaserScene.add.image(gameConsts.halfWidth, this.y + 25, 'blurry', 'scytheblur.png').setDepth(1002).setBlendMode(Phaser.BlendModes.LIGHTEN)
         }

         let flipScale = flipped ? -1 : 1;
         this.scytheBlur.setAlpha(1.1).setScale(flipScale, 1).setRotation(-0.15);
         PhaserScene.tweens.add({
             targets: [darkScreen],
             alpha: 0,
             duration: 1800,
             ease: 'Quad.easeOut',
             onComplete: () => {
                 darkScreen.destroy();
             }
         });
         PhaserScene.tweens.add({
             targets: [this.scytheBlur],
             alpha: 0,
             scaleX: 1.02*flipScale,
             scaleY: 1.01*flipScale,
             ease: 'Cubic.easeOut',
             duration: 900,
         });
     }


     setHealth(newHealth) {
        messageBus.publish('animateBlockNum', gameConsts.halfWidth, this.sprite.y + 50, 'IMMATERIAL', 0.8, {y: "+=5", ease: 'Quart.easeOut'}, {alpha: 0, scaleX: 1.1, scaleY: 1.1});

         // super.setHealth(newHealth);
         // let prevHealthPercent = this.prevHealth / this.healthMax;
         // let currHealthPercent = this.health / this.healthMax;
         // if (currHealthPercent == 0) {
         //     // dead, can't do anything
         //     return;
         // }
     }



     initAttacks() {
         this.attacks = [
             [
                 {
                     name: ";4444",
                     chargeAmt: 600,
                     chargeMult: 3,
                     finishDelay: 3000,
                     damage: -1,
                     isBigMove: true,
                     attackStartFunction: () => {
                         this.swingScythe(4444, true, false, () => {
                             if (!globalObjects.player.dead) {
                                 globalObjects.bannerTextManager.setDialog([getLangText('deathFight1d'), getLangText('deathFight1e')]);
                                 globalObjects.bannerTextManager.setPosition(gameConsts.halfWidth, gameConsts.halfHeight + 10, 0);
                                 globalObjects.bannerTextManager.showBanner(true);
                                 globalObjects.bannerTextManager.setOnFinishFunc(() => {
                                     this.interruptCurrentAttack();
                                     this.setAwake();
                                     fadeInSound(this.bgMusic, 0.85);
                                 });
                             }
                         })
                     },
                     finaleFunction: () => {
                         super.setHealth(3);
                         this.setAsleep();
                     }
                 },
                 {
                     name: "}6x12}",
                     chargeAmt: 1000,
                     chargeMult: 3,
                     finishDelay: 5000,
                     damage: -1,
                     isBigMove: true,
                     startFunction: () => {
                         this.finishedChargingMulti = false;
                         this.startChargingMulti();
                     },
                     attackStartFunction: () => {
                         this.finishedChargingMulti = true;
                     },
                     attackFinishFunction: () => {
                         this.fireScytheObjects(6, undefined, () => {
                             if (!globalObjects.player.dead) {
                                 globalObjects.bannerTextManager.setDialog([getLangText('deathFight1f'), getLangText('deathFight1g')]);
                                 globalObjects.bannerTextManager.setPosition(gameConsts.halfWidth, gameConsts.halfHeight + 10, 0);
                                 globalObjects.bannerTextManager.showBanner(true);
                                 globalObjects.bannerTextManager.setOnFinishFunc(() => {
                                     this.interruptCurrentAttack();
                                     this.setAwake();
                                 });
                             }
                         });
                     },
                     finaleFunction: () => {
                         super.setHealth(2);
                         this.setAsleep();

                     }
                 },
                 {
                     name: ";17x7",
                     chargeAmt: 1000,
                     chargeMult: 2,
                     finishDelay: 7500,
                     damage: -1,
                     isBigMove: true,
                     attackStartFunction: () => {
                         this.swingScythe(17, false, false,() => {
                             this.swingScytheFast(17, false, true,() => {
                                 this.swingScytheFast(17, false, false,() => {
                                     this.swingScytheFast(17, false, true,() => {
                                         this.swingScytheFast(17, false, false,() => {
                                             this.swingScytheFast(17, false, true,() => {
                                                 this.swingScytheFast(17, false, false,() => {

                                                 })
                                             })
                                         })
                                     })
                                 })
                             })
                         })
                     },
                     finaleFunction: () => {
                         super.setHealth(3);
                         this.setAsleep();
                     }
                 },
                 {
                     name: ";80",
                     chargeAmt: 600,
                     chargeMult: 4,
                     finishDelay: 3000,
                     damage: -1,
                     isBigMove: true,
                     attackStartFunction: () => {
                         this.swingScythe(80, true, false,() => {
                             if (!globalObjects.player.dead) {
                                 globalObjects.bannerTextManager.setDialog([getLangText('deathFight1d'), getLangText('deathFight1e')]);
                                 globalObjects.bannerTextManager.setPosition(gameConsts.halfWidth, gameConsts.halfHeight + 10, 0);
                                 globalObjects.bannerTextManager.showBanner(true);
                                 globalObjects.bannerTextManager.setOnFinishFunc(() => {

                                 });
                             }
                         })
                     },
                     finaleFunction: () => {
                         super.setHealth(0);
                         this.setAsleep();
                     }
                 },
             ]
         ];

         // this.attacks = [
         //     [
         //         {
         //             name: "REAP }44x4",
         //             chargeAmt: 300,
         //             damage: 44,
         //             attackTimes: 4
         //         },
         //         {
         //             name: "EXECUTE }66",
         //             chargeAmt: 300,
         //             chargeMult: 5,
         //             damage: 66,
         //         }
         //     ]
         // ];
     }

     fireScytheObjects(damage = 6, interval = 120, onComplete) {
         let totalScytheObjects = this.scytheObjects.length;
         let projDur = 600 - Math.floor(Math.sqrt(totalScytheObjects) * 50);
         let scytheObjectsFired = 0;
         while (this.scytheObjects.length > 0) {
             let currObj = this.scytheObjects.pop();
             currObj.rotTween.stop();
             let currObj2 = this.scytheObjects.pop();
             currObj2.rotTween.stop();
             let isLastObj = this.scytheObjects.length === 0;

             let delayAmt = scytheObjectsFired * interval;
             scytheObjectsFired++;
             if (isLastObj) {
                 this.tweenFireScythe(currObj, projDur, delayAmt, totalScytheObjects, true, onComplete)
             } else {
                 this.tweenFireScythe(currObj, projDur, delayAmt, totalScytheObjects, true)
                 this.tweenFireScythe(currObj2, projDur, delayAmt, totalScytheObjects, false)
             }
         }
     }

     tweenFireScythe(currObj, projDur, delayAmt, totalScytheObjects, hasSfx, onComplete) {
         this.addTween({
             targets: currObj,
             delay: delayAmt,
             y: globalObjects.player.getY() - 175 + Math.random() * 10,
             ease: 'Quad.easeIn',
             duration: projDur,
             rotation: (Math.random() - 0.5) * 3,
             onStart: () => {
                 currObj.setDepth(150);
             },
             onComplete: () => {
                 if (onComplete) {
                     setTimeout(() => {
                         onComplete();
                     }, 1500)
                 }
                 let hitEffect = getTempPoolObject('lowq', 'sharpflashred.webp', 'sharpflashred', 400);
                 hitEffect.setPosition(currObj.x + 10 - Math.random() * 20, currObj.y - 10 - Math.random() * 15).setDepth(195).setScale(0.25, 0.1).setVisible(true);
                 let extraScale = Math.random() * 0.35;
                 this.addTween({
                     targets: hitEffect,
                     scaleX: 0.25 + extraScale,
                     scaleY: 0.3 + extraScale * 1.2,
                     ease: 'Quart.easeIn',
                     duration: 150,
                     onComplete: () => {
                         this.addTween({
                             targets: hitEffect,
                             scaleX: 0,
                             scaleY: 0.05,
                             ease: 'Quad.easeOut',
                             duration: 200,
                             onComplete: () => {
                                 hitEffect.setVisible(false);
                             }
                         });
                     }
                 });
                 if (hasSfx) {
                     playSound('sword_slice').detune = 400 - Math.floor(Math.random() * 800)
                 }
                 messageBus.publish("selfTakeDamage", 6);
                 currObj.destroy();

             }
         });
         this.addTween({
             targets: currObj,
             delay: delayAmt,
             x: gameConsts.halfWidth * 0.92 + currObj.x * 0.15,
             rotation: "-=4",
             easeParams: [3],
             duration: projDur
         });
     }

     startChargingMulti() {
         for (let i = 0; i < 36; i++) {
             let startX = this.x;
             let startY = this.y;
             let multAmt = 120;
             let angleIdx = i;
             if (i < 12) {
                 multAmt = 120;
             } else if (i < 24) {
                 angleIdx -=12;
                 multAmt = 180;
             } else if (i < 36) {
                 angleIdx -=24;
                 multAmt = 240;
             }
             let dirAngle = -Math.PI / 4 + angleIdx * Math.PI / 24 + Math.PI * 0.5;
             let offsetX = Math.sin(dirAngle) * multAmt;
             let offsetY = -Math.cos(dirAngle) * multAmt;
             if (i % 2 == 0) {
                 // right

             } else {
                 offsetX = -offsetX;
                 // left
             }

             let xPos = startX + offsetX; let yPos = startY + offsetY;
             let scytheObj = this.addImage(xPos, yPos, 'misc', "miniscythe.png").setScale(0).setDepth(-2);
             scytheObj.setScale(0).setRotation((Math.PI / 18) * i);
             this.scytheObjects.push(scytheObj);
            scytheObj.rotTween = this.addTween({
                targets: scytheObj,
                rotation: "-=6.281",
                duration: 10000,
                repeat: -1
            })
         }
         let firstThird = [];
         let secondThird = [];
         let thirdThird = [];
         for (let j = 0; j < 12; j++) {
             let currScythe = this.scytheObjects[j];
            firstThird.push(currScythe);
         }
         for (let j = 12; j < 24; j++) {
             let currScythe = this.scytheObjects[j];
             secondThird.push(currScythe);
         }
         for (let j = 24; j < 36; j++) {
             let currScythe = this.scytheObjects[j];
             thirdThird.push(currScythe);
         }
         this.addTween({
             delay: 100,
             duration: 450,
             targets: firstThird,
             scaleX: 0.9,
             scaleY: 0.9,
             ease: 'Quart.easeOut',
             onStart: () => {
                 if (!this.finishedChargingMulti) {
                     playSound('enemy_attack');
                     // this.sprite.setScale(this.sprite.startScale * 1.05);
                     // this.sprite.setRotation(0.1);
                     this.attackName.setText("}}}6x12}}}");
                     this.repositionAngrySymbol();
                 }
             },
             onComplete: () => {
                 this.addTween({
                     duration: 300,
                     targets: firstThird,
                     scaleX: 0.6,
                     scaleY: 0.6,
                     ease: 'Back.easeOut',
                     onComplete: () => {

                     }
                 })
             }
         })

         this.addTween({
             delay: 1400,
             duration: 450,
             targets: secondThird,
             scaleX: 0.95,
             scaleY: 0.95,
             ease: 'Quart.easeOut',
             onStart: () => {
                 if (!this.finishedChargingMulti) {
                     playSound('enemy_attack_2');
                     // this.sprite.setScale(this.sprite.startScale * 1.05);
                     // this.sprite.setRotation(0.1);
                     this.attackName.setText("|||6x24|||");
                     this.repositionAngrySymbol();
                 }
             },
             onComplete: () => {
                 this.addTween({
                     duration: 300,
                     targets: secondThird,
                     scaleX: 0.64,
                     scaleY: 0.64,
                     ease: 'Back.easeOut',
                 })
             }
         })
         this.addTween({
             delay: 2800,
             duration: 450,
             targets: thirdThird,
             scaleX: 1,
             scaleY: 1,
             ease: 'Quart.easeOut',
             onStart: () => {
                 if (!this.finishedChargingMulti) {
                     playSound('enemy_attack_major');
                     // this.sprite.setScale(this.sprite.startScale * 1.05);
                     // this.sprite.setRotation(0.1);
                     this.attackName.setText(";;;6x36;;;");
                     this.repositionAngrySymbol();
                 }
             },
             onComplete: () => {
                 this.addTween({
                     duration: 300,
                     targets: thirdThird,
                     scaleX: 0.68,
                     scaleY: 0.68,
                     ease: 'Back.easeOut',
                 })
             }
         })
     }
}
