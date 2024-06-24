 class Death extends Enemy {
     constructor(scene, x, y) {
         super(scene, x, y);
         this.initSprite('blurryball.png', 0.7);
        this.sprite.setOrigin(0.5, 0.4);
        swirlInReaperFog(1.25);
        this.setupCustomDeathSprite();
        setTimeout(() => {
             this.setAsleep();
         }, 10)
     }

     initStatsCustom() {
         this.health = 4;
         this.scytheObjects = [];
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
            globalObjects.bannerTextManager.setDialog(["THUS COMES THE END.", "UNFORTUNATE, BUT YOUR JOURNEY\nWAS NEVER MEANT TO BE.", "FAREWELL."]);
            globalObjects.bannerTextManager.setPosition(gameConsts.halfWidth, gameConsts.halfHeight + 10, 0);
            globalObjects.bannerTextManager.showBanner(true);
            globalObjects.bannerTextManager.setOnFinishFunc(() => {
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
        messageBus.publish('animateBlockNum', gameConsts.halfWidth, this.sprite.y + 50, 'IMMATERIAL', 0.8, {y: "+=5", ease: 'Quart.easeOut'}, {alpha: 0, scaleX: 1.4, scaleY: 1.4});

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
                     damage: -1,
                     isBigMove: true,
                     attackStartFunction: () => {

                     },
                     finaleFunction: () => {
                         this.setAsleep();
                         globalObjects.bannerTextManager.setDialog(["SEEMS YOU'VE LEARNED\nA TRICK OR TWO", "BUT CAN YOU SURVIVE DEATH\nBY A THOUSAND CUTS?"]);
                         globalObjects.bannerTextManager.setPosition(gameConsts.halfWidth, gameConsts.halfHeight + 10, 0);
                         globalObjects.bannerTextManager.showBanner(true);
                         globalObjects.bannerTextManager.setOnFinishFunc(() => {
                             this.setAwake();
                         });
                     }
                 },
                 {
                     name: ";6x1",
                     chargeAmt: 1000,
                     chargeMult: 2,
                     damage: -1,
                     isBigMove: true,
                     startFunction: () => {
                         this.setSprite('time_magi_cast_big.png');
                         this.finishedChargingMulti = false;
                         this.startChargingUltimate();
                     },
                     attackStartFunction: () => {
                         this.finishedChargingMulti = true;
                     },
                     attackFinishFunction: () => {
                         this.fireScytheObjects(4);
                     },
                     finaleFunction: () => {
                         this.setAsleep();
                         globalObjects.bannerTextManager.setDialog(["SEEMS YOU'VE LEARNED\nA TRICK OR TWO", "BUT CAN YOU SURVIVE DEATH\nBY A THOUSAND CUTS?"]);
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
             let currObj = this.scytheObjects.shift();
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
                 ease: 'Back.easeIn',
                 easeParams: [3],
                 duration: projDur
             });
         }
     }

     startChargingMulti() {
         for (let i = 0; i < 36; i++) {
             this.addTween({
                 delay: i * 100,
                 duration: 150,
                 targets: this.sprite,
                 scaleX: this.sprite.startScale,
                 scaleY: this.sprite.startScale,
                 rotation: 0,
                 ease: 'Cubic.easeOut',
                 onStart: () => {
                     if (!this.finishedChargingMulti) {
                         // this.sprite.setScale(this.sprite.startScale * 1.05);
                         // this.sprite.setRotation(0.1);
                         let startX = this.x;
                         let startY = this.y;
                         let dirAngle = i * Math.PI / 12;
                         let offsetX = Math.sin(dirAngle) * 90;
                         let offsetY = -Math.cos(dirAngle) * 80;

                         let xPos = startX + offsetX; let yPos = startY + offsetY;
                         let scytheObj = this.createScytheObject(xPos, yPos, 0, 2, -300 + i * 30);
                         scytheObj.setDepth(3);
                         this.addTween({
                             duration: 400,
                             targets: scytheObj,
                             x: startX + offsetX * (i % 6 == 0 ? 1.55 : 1.6),
                             y: startY + offsetY * (i % 6 == 0 ? 1.55 : 1.6),
                             ease: 'Quart.easeOut'
                         });
                         let numAttacks = i + 1;
                         if (i == 5) {
                             this.attackName.setText("}6x" + numAttacks + "}");
                         } else if (i == 11) {
                             this.attackName.setText("}}6x" + numAttacks + "}}");
                             this.repositionAngrySymbol();
                         } else if (i == 17) {
                             this.attackName.setText("}}}6x" + numAttacks + "}}}");
                             this.repositionAngrySymbol();
                         } else if (i == 23) {
                             this.attackName.setText("}}}}6x" + numAttacks + "}}}}");
                             this.repositionAngrySymbol();
                         } else if (i == 30) {
                             this.attackName.setText("}}}}}6x" + numAttacks + "}}}}}");
                             this.repositionAngrySymbol();
                         }  else if (i == 35) {
                             this.attackName.setText("}}}}}}6x" + numAttacks + "}}}}}}");
                             this.repositionAngrySymbol();
                             this.nextAttack.chargeMult = 12;
                             // this.setDefaultSprite('time_magi.png');
                         }
                     }
                 },
             })
         }
     }

     createScytheObject(x, y, delay = 0, durMult = 1) {
         let newObj = this.addSprite(x, y, 'misc', "miniscythe.png").setRotation((Math.random() - 0.5) * 3).setScale(0).setDepth(110);
         newObj.durMult = durMult;
         this.scytheObjects.push(newObj);
         this.addTween({
             delay: delay,
             targets: newObj,
             scaleX: 1,
             scaleY: 1,
             ease: 'Back.easeOut',
             easeParams: [3],
             duration: 300,
             onStart: () => {
                 // let sound = playSound('time_strike');
                 // sound.detune = detune;
             }
         });
         this.addTween({
             targets: newObj,
             rotation: "-=6.283",
             duration: 5000,
         });
         return newObj;
     }
}
