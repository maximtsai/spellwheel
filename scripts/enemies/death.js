 class Death extends Enemy {
     constructor(scene, x, y) {
         super(scene, x, y);
         this.initSprite('blurryball.png', 0.7);
        this.sprite.setOrigin(0.5, 0.4);
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

     swingScythe(damage = 4444, onComplete) {

         this.mainScythe.setPosition(gameConsts.halfWidth + 5, 160).setDepth(999).setAlpha(0).setScale(0.65).setRotation(-1.5);
         let scythe = this.mainScythe;
         scythe.play('scytheFlash');
         PhaserScene.tweens.add({
             targets: scythe,
             alpha: 1,
             duration: 450
         })

         PhaserScene.tweens.add({
             targets: scythe,
             y: 100,
             scaleX: 0.75,
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
                     scaleX: 0.85,
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
                                 }, 100);
                                 PhaserScene.tweens.add({
                                     targets: scythe,
                                     scaleX: 1.35,
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
                                     x: "-=10",
                                     ease: 'Quint.easeOut',
                                     duration: 500,
                                     onComplete: () => {
                                         repeatDeathHandsRotate();
                                         PhaserScene.tweens.add({
                                             delay: 200,
                                             targets: scythe,
                                             rotation: "+=0.1",
                                             x: "-=12",
                                             ease: 'Quart.easeInOut',
                                             duration: 2000,
                                         })
                                         PhaserScene.tweens.add({
                                             targets: scythe,
                                             alpha: 0,
                                             delay: 1000,
                                             scaleX: 0.6,
                                             scaleY: 0.6,
                                             ease: 'Cubic.easeIn',
                                             duration: 600,
                                             completeDelay: 700,
                                             onComplete: onComplete
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
                     chargeMult: 2,
                     finishDelay: 3000,
                     damage: -1,
                     isBigMove: true,
                     attackStartFunction: () => {
                         this.swingScythe(4444, () => {
                             if (!globalObjects.player.dead) {
                                 globalObjects.bannerTextManager.setDialog([getLangText('deathFight1d'), getLangText('deathFight1e')]);
                                 globalObjects.bannerTextManager.setPosition(gameConsts.halfWidth, gameConsts.halfHeight + 10, 0);
                                 globalObjects.bannerTextManager.showBanner(true);
                                 globalObjects.bannerTextManager.setOnFinishFunc(() => {
                                     this.interruptCurrentAttack();
                                     this.setAwake();
                                 });
                             }
                         })
                     },
                     finaleFunction: () => {
                         this.setAsleep();
                     }
                 },
                 {
                     name: ";6x1",
                     chargeAmt: 1200,
                     chargeMult: 2,
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
                         this.fireScytheObjects(6);
                     },
                     finaleFunction: () => {
                         this.setAsleep();
                         globalObjects.bannerTextManager.setDialog([getLangText('deathFight1f'), getLangText('deathFight1g')]);
                         globalObjects.bannerTextManager.setPosition(gameConsts.halfWidth, gameConsts.halfHeight + 10, 0);
                         globalObjects.bannerTextManager.showBanner(true);
                         globalObjects.bannerTextManager.setOnFinishFunc(() => {
                             this.setAwake();
                         });
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

     fireScytheObjects(damage = 6, interval = 100) {
         let totalScytheObjects = this.scytheObjects.length;
         let projDur = 600 - Math.floor(Math.sqrt(totalScytheObjects) * 50);
         let scytheObjectsFired = 0;
         while (this.scytheObjects.length > 0) {
             let currObj = this.scytheObjects.pop();
             currObj.rotTween.stop();
             let delayAmt = scytheObjectsFired * interval;
             scytheObjectsFired++;
             this.addTween({
                 targets: currObj,
                 delay: delayAmt,
                 y: globalObjects.player.getY() - 175 + Math.random() * 10,
                 ease: 'Quad.easeIn',
                 duration: projDur,
                 rotation: (Math.random() - 0.5) * 3,
                 onComplete: () => {
                     let dur = 280 - Math.sqrt(totalScytheObjects) * 40;
                     let rot = dur * 0.004;
                     let scaleMult = 1;
                     let hitEffect = this.addSprite(currObj.x, currObj.y, 'spells', 'timeRed1.png').setRotation((Math.random() - 0.5) * 3).setScale(0.35 * scaleMult).setDepth(195);
                     this.addTween({
                         targets: hitEffect,
                         scaleX: 0.7 * scaleMult,
                         scaleY: 0.7 * scaleMult,
                         ease: 'Cubic.easeOut',
                         duration: dur,
                         onComplete: () => {
                             hitEffect.destroy();
                         }
                     });
                     this.addTween({
                         targets: hitEffect,
                         rotation: "-="+rot,
                         alpha: 0,
                         duration: dur
                     });
                     if (currObj.scaleX > 1.1) {
                         playSound('body_slam', 0.5);
                     }
                     if (Math.random() < 0.6) {
                         playSound('time_strike_hit');
                     } else {
                         playSound('time_strike_hit_2');
                     }
                     messageBus.publish("selfTakeDamage", damage);
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
     }

     startChargingMulti() {
         for (let i = 0; i < 36; i++) {
             let startX = this.x;
             let startY = this.y;
             let dirAngle = +Math.PI*0.75 + i * Math.PI / 9;
             let multAmt = i < 18 ? 90 : 135;
             let offsetX = Math.sin(dirAngle) * multAmt;
             let offsetY = -Math.cos(dirAngle) * multAmt;

             let xPos = startX + offsetX; let yPos = startY + offsetY;
             let scytheObj = this.addImage(xPos, yPos, 'misc', "miniscythe.png").setScale(0).setDepth(3);
             scytheObj.setScale(0).setRotation((Math.PI / 18) * i);
             this.scytheObjects.push(scytheObj);
            scytheObj.rotTween = this.addTween({
                targets: scytheObj,
                rotation: "-=6.281",
                duration: 10000,
                repeat: -1
            })
         }
         for (let j = 0; j < 18; j++) {
             let currScythe = this.scytheObjects[j];
             this.addTween({
                 delay: Math.abs((9 - j) * 250),
                 duration: 250,
                 targets: currScythe,
                 scaleX: 0.5,
                 scaleY: 0.5,
                 ease: 'Back.easeOut',
                 onStart: () => {
                     if (!this.finishedChargingMulti) {
                         // this.sprite.setScale(this.sprite.startScale * 1.05);
                         // this.sprite.setRotation(0.1);
                         let numAttacks = Math.abs((9 - j)) + 1;
                         if (j == 5) {
                             this.attackName.setText("}6x" + numAttacks + "}");
                         } else if (j == 11) {
                             this.attackName.setText("}}6x" + numAttacks + "}}");
                             this.repositionAngrySymbol();
                         } else if (j == 17) {
                             this.attackName.setText("}}}6x" + numAttacks + "}}}");
                             this.repositionAngrySymbol();
                         } else if (j == 23) {
                             this.attackName.setText("}}}}6x" + numAttacks + "}}}}");
                             this.repositionAngrySymbol();
                         } else if (j == 30) {
                             this.attackName.setText("}}}}}6x" + numAttacks + "}}}}}");
                             this.repositionAngrySymbol();
                         } else if (j == 35) {
                             this.attackName.setText("}}}}}}6x" + numAttacks + "}}}}}}");
                             this.repositionAngrySymbol();
                         }
                     }
                 },
             })
         }

        PhaserScene.time.delayedCall(4000, () => {
            if (this.finishedChargingMulti) {
                return;
            }
            this.attackName.setText(";;;6x36;;;");
            this.repositionAngrySymbol();
            this.nextAttack.chargeMult = 9;
            this.addTween({
                targets: this.scytheObjects,
                duration: 350,
                scaleX: 0.7,
                scaleY: 0.7,
                ease: 'Quart.easeOut',
                onComplete: () => {
                    this.addTween({
                        targets: this.scytheObjects,
                        duration: 450,
                        scaleX: 1,
                        scaleY: 1,
                        ease: 'Back.easeOut',
                        onComplete: () => {

                        }
                    })
                }
            })

        })
     }
}
