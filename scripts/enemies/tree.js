 class Tree extends Enemy {
     constructor(scene, x, y, level) {
         super(scene, x, y, level);
         this.initSprite('tree.png', 0.875);// 0.7
         this.sprite.setOrigin(0.52, 0.88); // 0.9
         this.shieldAdded = false;
         this.bgMusic = playMusic('echos_of_time', 0.9, true);
        playSound('tree_rustle', 0.35);


         this.popupTimeout = this.addTimeout(() => {
             this.tutorialButton = createTutorialBtn(this.level);
             this.addToDestructibles(this.tutorialButton);
         }, 3000)
     }

     initStatsCustom() {
         this.health = gameVars.isHardMode ? 250 : 230;
         this.isAsleep = true;
         this.leafObjects = [];
         this.pullbackScale = 0.99;
         this.attackScale = 1.03;
     }

     takeEffect(newEffect) {
         if (this.sprite) {
             if (newEffect.name == 'mindStrike' && !this.dead && !this.hasTimbered) {
                 if (this.breatheTween) {
                     this.breatheTween.stop();
                 }
                 this.sprite.setVisible(false);

                 if (!this.tempOverlaySprite) {
                     this.tempOverlaySprite = this.addSprite(this.x, this.y, 'enemies', 'tree_shock1.png').setScale(2.1).setDepth(7);
                 }
                 this.tempOverlaySprite.setFrame('tree_shock1.png').setVisible(true);
                 this.tempOverlaySprite.x = this.x + 10;
                 this.addTween({
                     targets: this.tempOverlaySprite,
                     x: this.x,
                     duration: 250,
                     ease: 'Bounce.easeOut'
                 })

                 if (this.preparingTimber) {
                     this.tempOverlaySprite.setOrigin(0.52, 0.7);
                 } else {
                     this.tempOverlaySprite.setOrigin(0.52, 0.88);
                 }
                 this.addDelay(() => {
                     this.tempOverlaySprite.setFrame('tree_shock2.png');
                     this.tempOverlaySprite.setScale(2.1)
                     if (this.preparingTimber) {
                         this.tempOverlaySprite.setOrigin(0.52, 0.7);
                     } else {
                         this.tempOverlaySprite.setOrigin(0.52, 0.88);
                     }
                     this.addDelay(() => {
                         this.setSpriteIfNotInactive(this.defaultSprite);
                         this.repeatTweenBreathe()
                         this.tempOverlaySprite.setVisible(false);
                         this.sprite.setVisible(true);
                     }, 110)
                 }, 110)
             }
         }
         super.takeEffect(newEffect)
     }

     setHealth(newHealth) {
         super.setHealth(newHealth);
         let prevHealthPercent = this.prevHealth / this.healthMax;
         let currHealthPercent = this.health / this.healthMax;
         let lastHealthLost = this.prevHealth - this.health;
         if (currHealthPercent == 0) {
             // dead, can't do anything
             return;
         }
         if (lastHealthLost >= 30) {
             this.dropLeavesMany();
         } else if (lastHealthLost >= 20) {
             this.dropLeaves();
         }
         if (this.isAsleep) {
             if (this.breatheTween) {
                 this.breatheTween.stop();
                 this.sprite.setScale(this.sprite.startScale);
             }
            setTimeout(() => {
                playSound('chirpmany', 0.3).detune = -50;
            }, 500)
             this.setAwake();
             let eyePosX = this.x + 130 * this.sprite.startScale;
             let eyePosY = this.y - 68.5 * this.sprite.startScale;

             let tree = this.addImage(this.x, this.y, 'enemies', 'tree_open.png').setDepth(1).setOrigin(this.sprite.originX, this.sprite.originY).setScale(this.sprite.startScale).setAlpha(0);
             this.addExtraSprite(tree);

             let eye = this.addImage(eyePosX, eyePosY, 'enemies', 'tree_eye.png').setDepth(10).setOrigin(0.5, 0.5).setRotation(-0.13).setScale(0, this.sprite.startScale);
             // this.thorns1 = this.addImage(this.x, this.y - 70, 'enemies', 'thorns.png').setDepth(999).setOrigin(0.5, -0.25);

             this.thorns1 = this.addImage(this.x - 4, this.y - 95, 'enemies', 'thorns.png').setDepth(8).setRotation(1.57 + 3.1415).setOrigin(0.5, -0.6).setScale(0.7, 0.5);
             this.thorns2 = this.addImage(this.x - 4, this.y - 95, 'enemies', 'thorns.png').setDepth(8).setRotation(1.57).setOrigin(0.5, -0.6).setScale(0.7, 0.5);
             this.thorns1.alpha = 0;
             this.thorns2.alpha = 0;

             this.greenGlow = this.addImage(this.x - 4, this.y - 265, 'blurry', 'green_star.webp').setDepth(-1).setOrigin(0.5, 0.48).setAlpha(0);

             this.addExtraSprite(eye, 3.5, -84);
             this.addTween({
                 targets: tree,
                 alpha: 0.95,
                 duration: 1200,
             });

             this.addTween({
                 targets: eye,
                 scaleX: this.sprite.startScale * 0.6,
                 ease: "Back.easeOut",
                 easeParams: [1.5],
                 rotation: -0.08,
                 duration: 450,
                 onComplete: () => {
                     this.addTween({
                         delay: 500,
                         targets: eye,
                         rotation: 0,
                         scaleX: this.sprite.startScale * 1.2,
                         ease: "Cubic.easeIn",
                         duration: 350,
                         onStart: () => {
                            playSound('meat_click_left', 0.36);
                             playSound('meat_click_right', 0.36);
                         },
                         onComplete: () => {
                             this.addTween({
                                 targets: eye,
                                 scaleX: this.sprite.startScale,
                                 ease: "Cubic.easeOut",
                                 duration: 300,
                                 onComplete: () => {
                                     tree.destroy();
                                     this.setDefaultSprite('tree_open.png', this.sprite.startScale);
                                     this.removeExtraSprite(eye);
                                     eye.destroy();
                                 }
                             });
                         }
                     });
                 }
             });
         }
         if (currHealthPercent < 0.667 && !this.hasCrushed) {
             // CRUSH
             if (!this.crushBirdFall) {
                 this.dropBird();
                 setTimeout(() => {
                     playSound('chirp1').pan = -0.2;
                 }, 900)
                 this.crushBirdFall = true;
             }
             this.setNextAttack(3, 0);
             // Going to shield
         } else if (this.health <= 70 && !this.hasTimbered) {
             this.setNextAttack(5, 0);
             if (!this.hasPreparedFinal) {
                 this.dropBird();
                 setTimeout(() => {
                     playSound('chirp1').detune = -40;
                 }, 900)
                 this.addTimeout(() => {
                     this.dropBird();
                     setTimeout(() => {
                         playSound('chirp1').detune = 60;
                     }, 1100)
                 }, 150)
                 this.hasPreparedFinal = true;
             }
         }
     }

     initSpriteAnim(scale) {
         this.sprite.setScale(scale * 0.99, scale * 1.02);
         this.addTween({
             targets: this.sprite,
             duration: 1500,
             scaleX: scale,
             scaleY: scale,
             ease: 'Cubic.easeOut',
             alpha: 1,
             onComplete: () => {
                 this.repeatTweenBreathe()
             }
         });
         this.addTween({
             targets: this.sprite,
             duration: 1000,
             alpha: 1
         });
     }

     repeatTweenBreathe(duration = 2500) {
         if (this.breatheTween) {
             this.breatheTween.stop();
         }
         this.breatheTween = this.addTween({
             targets: this.sprite,
             duration: duration,
             scaleY: "+=0.01",
             ease: 'Quart.easeOut',
             onComplete: () => {
                 this.addTween({
                     targets: this.sprite,
                     duration: duration * 0.8,
                     scaleY: "-=0.01",
                     ease: 'Cubic.easeInOut',
                     onComplete: () => {
                         this.repeatTweenBreathe()
                     }
                 });
             }
         });
     }

     dropLeaves() {
         let leafObject = getTempPoolObject('enemies', 'falling_leaves.png', 'fallingLeaves', 1500);
         let isFlipped = Math.random() < 0.5;
         leafObject.setFrame('falling_leaves.png').setScale(isFlipped ? 1 : -1, 1).setDepth(10);
         leafObject.setPosition(this.x + 300 * (Math.random() - 0.5), this.y - 250 + Math.random() * 25).setAlpha(0.5);
         this.addTween({
             targets: leafObject,
             duration: 1400,
             y: "+=90",
         })
         this.addTween({
             targets: leafObject,
             duration: 300,
             alpha: 1,
             ease: 'Cubic.easeOut',
             scaleX: isFlipped ? 1.25 : -1.25,
             scaleY: 1.33,
             onComplete: () => {
                 this.addTween({
                     targets: leafObject,
                     duration: 1000,
                     alpha: 0,
                 })
             }
         })
     }

     dropLeavesMany() {
         let isFlipped = Math.random() < 0.5;
         let leafObject = getTempPoolObject('enemies', 'falling_leaves_2.png', 'fallingLeaves', 2000);
         leafObject.setFrame('falling_leaves_2.png').setScale(isFlipped ? 1 : -1, 1).setDepth(10);
         leafObject.setPosition(this.x + 300 * (Math.random() - 0.5), this.y - 255 + Math.random() * 25).setAlpha(1);

         let leafObject2 = getTempPoolObject('enemies', 'falling_leaves_3.png', 'fallingLeaves', 2000);
         leafObject2.setFrame('falling_leaves_3.png').setScale(isFlipped ? 1 : -1, 1).setDepth(10);
         leafObject2.setPosition(this.x + 250 * (Math.random() - 0.5), this.y - 240 + Math.random() * 25).setAlpha(1).setRotation(Math.random() * 6);

         this.addTween({
             targets: [leafObject, leafObject2],
             duration: 1500,
             y: "+=100",
         });
         let randRot = Math.random() > 0.5 ? 1 : -1;
         this.addTween({
             targets: [leafObject2],
             duration: 1500,
             rotation: "+="+randRot,
         })
         this.addTween({
             targets: [leafObject, leafObject2],
             duration: 300,
             alpha: 1,
             ease: 'Cubic.easeOut',
             scaleX: isFlipped ? 1.25 : -1.25,
             scaleY: 1.33,
             onComplete: () => {
                 this.addTween({
                     targets: [leafObject, leafObject2],
                     duration: 1100,
                     alpha: 0,
                 })
             }
         })
     }

     glowGreen() {
         this.addTween({
             targets: this.greenGlow,
             duration: 500,
             alpha: 0.6,
             scaleX: 2.5,
             scaleY: 2.5,
             ease: 'Quad.easeIn',
             onComplete: () => {
                 this.addTween({
                     targets: this.greenGlow,
                     duration: 1500,
                     alpha: 0,
                     scaleX: 1.5,
                     scaleY: 1.5,
                     ease: 'Cubic.easeIn',
                 });
             }
         });
    }

     startHealing(amt = 10) {
         if (!this.statuses[0]) {
             let healSprite = this.addImage(gameConsts.halfWidth, this.y - 70, 'misc', 'heal.png').setDepth(999).setAlpha(0);
             let statusObj = {};
             statusObj = {
                 animObj: healSprite,
                 amt: amt,
                 duration: 1001,
                 onUpdate: () => {
                     let canHeal = statusObj.duration % 6 == 0;
                     if (canHeal) {
                         if (statusObj.amt <= 0) {
                             statusObj.cleanUp();
                             return;
                         }
                         this.heal(statusObj.amt);
                         this.healText.setText("+" + statusObj.amt)
                         statusObj.amt -= 1;
                         this.healText.alpha = 1;
                         this.healText.y = this.healText.startY;
                         this.addTween({
                             targets: this.healText,
                             scaleX: 1,
                             scaleY: 1,
                             y: "-=13",
                             ease: 'Quart.easeOut',
                             duration: 3000,
                         });
                         this.addTween({
                             delay: 2500,
                             targets: this.healText,
                             alpha: 0,
                             ease: 'Quad.easeIn',
                             duration: 1000,
                         });

                         healSprite.alpha = 1;
                         healSprite.y = this.y - 85;
                         healSprite.scaleX = healSprite.scaleX * -1

                         this.addTween({
                             targets: healSprite,
                             y: "-=50",
                             duration: 1200,
                         });
                         this.addTween({
                             delay: 200,
                             targets: healSprite,
                             alpha: 0,
                             ease: 'Quad.easeIn',
                             duration: 1000,
                         });

                     }
                 },
                 cleanUp: () => {
                     healSprite.destroy();
                     this.statuses[0] = null;
                 }
             }
             this.statuses[0] = statusObj;
         }
     }

     stopHealing() {
         if (this.statuses[0]) {
             this.statuses[0].cleanUp();
             this.statuses[0] = null;
         }
     }

     createLeafObject(name, x, y, delay = 0) {
         let newObj = this.addImage(x, y, 'enemies', name).setRotation((Math.random() - 0.5) * 3).setScale(0).setDepth(110);
         this.leafObjects.push(newObj);
         let xDist = gameConsts.halfWidth - x;
         let yDist = globalObjects.player.getY() - 175 - y;
         let angleToPlayer = Math.atan2(yDist, xDist) - 1.57;
         this.addTween({
             delay: delay,
             targets: newObj,
             scaleX: 1,
             scaleY: 1,
             ease: 'Back.easeOut',
             easeParams: [2],
             duration: 300
         });
         this.addTween({
             delay: delay,
             targets: newObj,
             ease: 'Cubic.easeOut',
             rotation: angleToPlayer,
             duration: 500
         });
     }

     fireObjects(damage = 10) {
         let totalObjects = this.leafObjects.length;
         let projDur = 550 - Math.floor(Math.sqrt(totalObjects) * 50);
         let leafObjectsFired = 0;
         while (this.leafObjects.length > 0) {
             let currObj = this.leafObjects.shift();
             let delayAmt = leafObjectsFired * 100;
             this.addTween({
                 delay: delayAmt,
                 targets: currObj,
                 scaleX: 0.85,
                 scaleY: 1.2,
                 ease: 'Cubic.easeIn',
                 duration: projDur,
             });
             leafObjectsFired++;
             this.addTween({
                 targets: currObj,
                 delay: delayAmt,
                 y: globalObjects.player.getY() - 190,
                 x: gameConsts.halfWidth * 0.9 + currObj.x * 0.1,
                 ease: 'Quad.easeIn',
                 duration: projDur,
                 onStart: () => {
                     currObj.setScale(1);
                 },
                 onComplete: () => {
                     let dur = 280 - Math.sqrt(totalObjects) * 40;
                     let hitEffect = this.addImage(currObj.x - 10 + Math.random() * 20, currObj.y + Math.random() * 8, 'spells', 'damageEffect3.png').setScale(0.95).setRotation(Math.random()).setDepth(195);
                     this.addTween({
                         targets: hitEffect,
                         scaleX: 1,
                         scaleY: 1,
                         ease: 'Cubic.easeOut',
                         duration: dur,
                         onComplete: () => {
                             hitEffect.destroy();
                         }
                     });
                     this.addTween({
                         targets: hitEffect,
                         alpha: 0,
                         duration: dur
                     });
                     playSound('razor_leaf', 0.75);
                     messageBus.publish("selfTakeDamage", damage, undefined, currObj.x);
                     currObj.destroy();
                 }
             });
         }
     }

     attackWithBranch(damage = 12) {
         let currObj;
         if (!this.treeBranch) {
             this.treeBranch = this.addImage(gameConsts.halfWidth - 35 + Math.random() * 100, -50, 'enemies', 'tree_branch.webp').setRotation(-0.7 + Math.random()).setDepth(110).setOrigin(0.6, 0.6);
         } else {
             this.treeBranch.setPosition(gameConsts.halfWidth - 75 + Math.random() * 150, -50).setRotation(-0.7 + Math.random()).setAlpha(1);
         }
         currObj = this.treeBranch;
        this.glowGreen()
         this.addTween({
             targets: currObj,
             rotation: -0.2,
             duration: 700
         });

         this.addTween({
            delay: 75,
             targets: currObj,
             x: gameConsts.halfWidth * 0.2 + currObj.x * 0.8,
             y: gameConsts.height - 320,
             ease: 'Quart.easeIn',
             duration: 1000,
             onComplete: () => {
                 playSound('tree_hit');
                 messageBus.publish("selfTakeDamage", damage);
                 let xPos = gameConsts.halfWidth * 0.5 + currObj.x * 0.5;
                 let hitEffect = this.addSprite(xPos, currObj.y + Math.random() * 8, 'spells').play('damageEffectShort').setRotation((Math.random() - 0.5) * 3).setScale(1.5).setDepth(195);
                 this.addTween({
                     targets: hitEffect,
                     scaleX: 1.25,
                     scaleY: 1.25,
                     ease: 'Cubic.easeOut',
                     duration: 170,
                     onComplete: () => {
                         hitEffect.destroy();
                     }
                 });
                 this.addTween({
                     targets: hitEffect,
                     alpha: 0,
                     ease: 'Quad.easeIn',
                     duration: 170
                 });
                 let horizShift = currObj.x - gameConsts.halfWidth;
                 this.addTween({
                     targets: currObj,
                     alpha: 0,
                     x: "+=" + horizShift * 4,
                     rotation: horizShift * 0.05,
                     duration: 600,
                 });
                 this.addTween({
                     targets: currObj,
                     y: "-=120",
                     duration: 600,
                     ease: 'Cubic.easeOut',
                 });
             }
         });
     }

     clearThorns() {
        if (this.thornsTween) {
            this.thornsTween.stop();
        }
        this.hasThorns = false;
        this.addTween({
             targets: [this.thorns1, this.thorns2],
             scaleX: 0.8,
             scaleY: 0.8,
             alpha: 0,
             ease: 'Cubic.easeOut',
             duration: 300,
         });
     }

     playThornsAnim() {
        this.thorns1.setScale(0.5, 0.7);
        this.thorns2.setScale(0.5, 0.7);
         this.addTween({
             targets: [this.thorns1, this.thorns2],
             scaleX: 1.1,
             scaleY: 1.1,
             alpha: 1,
             ease: 'Quart.easeOut',
             duration: 500,
             onComplete: () => {
                 this.addTween({
                     targets: [this.thorns1, this.thorns2],
                     scaleX: 1,
                     scaleY: 1,
                     ease: 'Cubic.easeOut',
                     alpha: 0.85,
                     duration: 700,
                 });
             }
         });
        let spikeTemp = this.addImage(gameConsts.halfWidth, this.y - 150, 'spells', 'brickPattern1.png').setScale(0.75).setDepth(0).setAlpha(0).setRotation(-3);

         this.addTween({
            delay: 300,
             targets: [spikeTemp],
             rotation: 0,
             scaleX: 1.05,
             scaleY: 1.05,
             ease: 'Quad.easeOut',
             alpha: 0.9,
             duration: 200,
             onComplete: () => {
                playSound('matter_body');
                let goalScale = 1;
                let param = {
                    duration: 400,
                    ease: 'Quad.easeOut',
                    y: "-=1",
                    scaleX: goalScale,
                    scaleY: goalScale,
                }
                let param2 = {
                    alpha: 0,
                    duration: 1600,
                    scaleX: goalScale * 0.95,
                    scaleY: goalScale * 0.95
                }

                messageBus.publish('animateArmorNum', gameConsts.halfWidth, this.y - 60, "+2 THORNS", goalScale, param, param2);
                 this.addTween({
                     targets: [spikeTemp],
                     scaleX: 1,
                     scaleY: 1,
                     ease: 'Cubic.easeIn',
                    alpha: 0.7,
                     duration: 400,
                     onComplete: () => {
                        globalObjects.bannerTextManager.setDialog([getLangText('tree_a'), getLangText('tree_b')]);
                        globalObjects.bannerTextManager.setPosition(gameConsts.halfWidth, gameConsts.halfHeight + 10, 0);
                        globalObjects.bannerTextManager.showBanner(0.5);
                        this.setDefense(2);
                        this.hasThorns = true;
                         this.addTween({
                             targets: [spikeTemp],
                             ease: 'Cubic.easeIn',
                             alpha: 0,
                             duration: 1000,
                             onComplete: () => {
                                spikeTemp.destroy();
                             }
                         });
                     }
                 });
             }
         });
     }

     playRegrowthAnim(regrowthAmt) {
         // let healAmt = regrowthAmt - 1;
         // // this.startHealing(healAmt);
         // playSound('magic', 0.6);
         // this.healText = this.addText(gameConsts.halfWidth, 65, '+' + regrowthAmt, {fontFamily: 'Arial', fontSize: 48, color: '#00F254', align: 'left'})
         // this.healText.setFontStyle('bold').setOrigin(0.5, 0.5).setDepth(9);
         // this.healText.startY = this.healText.y;
         // let healSprite = this.addImage(gameConsts.halfWidth, this.y - 90, 'misc', 'heal.png').setScale(1.1).setDepth(999).setAlpha(0);
         // this.heal(regrowthAmt);
         // healSprite.alpha = 1;

         // if (this.eyeMagicAnim) {
         //     this.eyeMagicAnim.stop();
         // }

         // this.eyeMagic1.setScale(1);
         // this.eyeMagic2.setScale(1);
         // this.addTween({
         //     targets: [this.eyeMagic1, this.eyeMagic2],
         //     scaleX: 0.95,
         //     scaleY: 0.95,
         //     alpha: 1,
         //     ease: 'Cubic.easeOut',
         //     duration: 500,
         //     completeDelay: 600,
         //     onComplete: () => {
         //         this.addTween({
         //             targets: [this.eyeMagic1, this.eyeMagic2],
         //             scaleX: 0.8,
         //             scaleY: 0.3,
         //             ease: 'Quart.easeIn',
         //             alpha: 0,
         //             duration: 400,
         //         });
         //     }
         // });

         // this.addTween({
         //     targets: this.healText,
         //     scaleX: 1,
         //     scaleY: 1,
         //     y: "-=13",
         //     ease: 'Cubic.easeOut',
         //     duration: 3000,
         // });
         // this.addTween({
         //     delay: 2500,
         //     targets: this.healText,
         //     alpha: 0,
         //     ease: 'Quad.easeIn',
         //     duration: 1000,
         // });

         // this.addTween({
         //     targets: healSprite,
         //     scaleX: 1,
         //     scaleY: 1,
         //     y: "-=60",
         //     duration: 1300,
         //     onComplete: () => {
         //         healSprite.destroy()
         //     }
         // });
         // this.addTween({
         //     delay: 600,
         //     targets: healSprite,
         //     alpha: 0,
         //     ease: 'Quad.easeIn',
         //     duration: 700,
         // });
     }


     initAttacks() {
         let regrowthAmt1 = gameVars.isHardMode ? 16 : 8;
         let regrowthAmt2 = gameVars.isHardMode ? 24 : 10;
         this.attacks = [
             [
                 // 0
                 {
                     name: "}8 ",
                     announceName: "BRANCH ATTACK",
                     desc: "The tree swipes a branch at you",
                     chargeAmt: 410,
                     damage: -1,
                     startFunction: () => {

                     },
                     attackStartFunction: () => {
                         this.attackWithBranch(8);
                     },
                     attackFinishFunction: () => {
                         let currHealthPercent = this.health / this.healthMax;
                         if (currHealthPercent <= 0.6 && !this.hasCrushed) {
                             this.setNextAttack(3, 0);
                         } else {
                             this.setNextAttack(1, 0);
                         }
                     }
                 }
             ],
             [
                 // 1
                 {
                     name: "THORNS {2",
                     announceName: "THORNS",
                     desc: "The tree creates protective thorns!",
                     chargeAmt: 400,
                     chargeMult: gameVars.isHardMode ? 2 : 1,
                     isPassive: true,
                     damage: -1,
                     attackStartFunction: () => {
                         // this.eyeMagic1.setAlpha(0.2).setScale(0.8, 0.4);
                         // this.eyeMagic2.setAlpha(0.2).setScale(0.8, 0.4);
                         // this.eyeMagicAnim = this.addTween({
                         //     targets: [this.eyeMagic1, this.eyeMagic2],
                         //     scaleX: 0.95,
                         //     scaleY: 0.92,
                         //     alpha: 1,
                         //     ease: 'Cubic.easeOut',
                         //     duration: 600,
                         // });
                     },
                     attackFinishFunction: () => {
                         this.playThornsAnim();
                         let currHealthPercent = this.health / this.healthMax;
                         if (currHealthPercent <= 0.6 && !this.hasCrushed) {
                             this.setNextAttack(3, 0);
                         } else {
                             this.setNextAttack(2, 0);
                         }
                     }
                 }
             ],
             [
                 // 2
                 {
                     name: " STARE...",
                     chargeAmt: 350,
                     isPassive: true,
                     attackStartFunction: () => {

                     },
                     finaleFunction: () => {
                         let currHealthPercent = this.health / this.healthMax;
                         if (currHealthPercent <= 0.6 && !this.hasCrushed) {
                             this.currentAttackSetIndex = 3;
                             this.nextAttackIndex = 0;
                         }
                     }
                 },
                 {
                     name: "|10 ",
                     announceName: "BRANCH ATTACK",
                     desc: "The tree swipes a branch at you",
                     chargeAmt: 600,
                     damage: -1,
                     attackStartFunction: () => {
                         this.attackWithBranch(10);
                     },
                     attackFinishFunction: () => {
                         let currHealthPercent = this.health / this.healthMax;
                         if (currHealthPercent <= 0.6 && !this.hasCrushed) {
                             this.currentAttackSetIndex = 3;
                             this.nextAttackIndex = 0;
                         }
                     }
                 },
                 {
                     name: " STARE...",
                     chargeAmt: 350,
                     damage: -1,
                     isPassive: true,
                     attackStartFunction: () => {

                     },
                     attackFinishFunction: () => {
                         let currHealthPercent = this.health / this.healthMax;
                         if (currHealthPercent <= 0.6 && !this.hasCrushed) {
                             this.currentAttackSetIndex = 3;
                             this.nextAttackIndex = 0;
                         }
                     }
                 },
                 {
                     name: "|2x5 ",
                     announceName: "LEAF SHOWER",
                     desc: "The tree showers you with sharp leaves",
                     chargeAmt: 550,
                     damage: 0,
                     attackStartFunction: () => {
                         playSound('tree_sfx');
                     },
                     attackFinishFunction: () => {
                        this.glowGreen()

                         for (let i = 0; i < 5; i++) {
                             let xPos = gameConsts.halfWidth + -200 + i * 100;
                             let yPos = 75 + Math.random() * 40;
                             this.createLeafObject('tree_leaf.webp', xPos, yPos, i * 25);
                         }
                         this.addTimeout(() => {
                             this.fireObjects(2);
                         }, 250);
                     }
                 },
             ],
             [
                 // 3
                 {
                     name: gameVars.isHardMode ? ";32" : ";30",
                     announceName: "CRUSH",
                     desc: "The tree tries to crush you",
                     chargeAmt: gameVars.isHardMode ? 1000 : 1100,
                    finishDelay: 3000,
                     chargeMult: 1.5,
                     damage: -1,
                     isBigMove: true,
                     startFunction: () => {
                         this.addTimeout(() => {
                             if (!this.dead) {
                                 globalObjects.textPopupManager.setInfoText(gameConsts.width, gameConsts.halfHeight - 130, getLangText('level2_tut_a'), 'right', true);
                                 setTimeout(() => {
                                     globalObjects.textPopupManager.hideInfoText();
                                 }, 9800);
                             }
                         }, 1900)
                     },
                     attackStartFunction: () => {
                        this.glowGreen();
                         playSound('tree_sfx');
                         playSound('magic');
                        globalObjects.textPopupManager.hideInfoText();
                         this.hasCrushed = true;
                         this.createCrushAttack(gameVars.isHardMode ? 32 : 30);
                     },
                     attackFinishFunction: () => {
                         this.pullbackScale = 0.99;
                         this.attackScale = 1.03;
                         let currHealthPercent = this.health / this.healthMax;
                         if (this.health > 70) {
                             this.currentAttackSetIndex = 4;
                             this.nextAttackIndex = 0;
                         } else if (!this.hasTimbered) {
                             this.currentAttackSetIndex = 5;
                             this.nextAttackIndex = 0;
                         }
                     }
                 },
             ],
             [
                 // 4
                 {
                     name: " STARE...",
                     chargeAmt: gameVars.isHardMode ? 300 : 350,
                     damage: -1,
                     isPassive: true,
                     attackStartFunction: () => {

                     },
                     attackFinishFunction: () => {
                         let currHealthPercent = this.health / this.healthMax;
                         if (currHealthPercent <= 0.6 && !this.hasCrushed) {
                             this.currentAttackSetIndex = 3;
                             this.nextAttackIndex = 0;
                         }
                     }
                 },
                 {
                     name: "|2x5 ",
                     announceName: "LEAF STORM",
                     desc: "The tree showers you with sharp leaves",
                     chargeAmt: gameVars.isHardMode ? 500 : 550,
                     damage: 0,
                     attackStartFunction: () => {
                         playSound('tree_sfx');
                     },
                     attackFinishFunction: () => {
                        this.glowGreen()
                         for (let i = 0; i < 5; i++) {
                             let xPos = gameConsts.halfWidth + -200 + i * 100;
                             let yPos = 75 + Math.random() * 40;
                             this.createLeafObject('tree_leaf.webp', xPos, yPos, i * 25);
                         }
                         this.addTimeout(() => {
                             this.fireObjects(2);
                         }, 300);
                     }
                 },
                 {
                     name: "|10 ",
                     announceName: "BRANCH ATTACK",
                     desc: "The tree swipes a branch at you",
                     chargeAmt: 600,
                     damage: -1,
                     attackStartFunction: () => {

                         this.attackWithBranch(10);
                     }
                 }
             ],
             [
                 // 5
                 {
                     name: gameVars.isHardMode ? "TIMBER!;44" : "TIMBER!;40",
                     announceName: "TIMBER!!!",
                     desc: "The tree tries to crush you",
                     chargeAmt: 1250,
                     chargeMult: 2.5,
                     damage: gameVars.isHardMode ? 44 : 40,
                     isBigMove: true,
                     startFunction: () => {
                         this.attackSlownessMult = 1.8;

                         if (!this.glowBG) {
                             this.glowBG = this.addImage(this.sprite.x, this.sprite.y, 'blurry', 'explod.webp').setDepth(-1).setAlpha(0.01).setScale(9).setBlendMode(Phaser.BlendModes.MULTIPLY);
                         }

                         this.finalGlowTween = this.addTween({
                             targets: this.glowBG,
                             scaleX: 15,
                             scaleY: 15,
                             alpha: 0.5,
                             ease: 'Quad.easeOut',
                             duration: 15000
                         })

                        this.sprite.setOrigin(0.52, 0.7); // from 0.9 -> 0.75
                        this.sprite.y -= this.sprite.height * 0.125;
                        this.preparingTimber = true;
                        fadeAwaySound(this.bgMusic, 3000);
                        this.addTimeout(() => {
                             if (!this.dead) {
                                 this.bgMusic = playMusic('echos_of_time_finale');
                             }
                         }, 3200)
                        let greenSpike = this.addImage(this.sprite.x, this.sprite.y, 'lowq', 'green_spike.png').setDepth(20).setScale(5).setRotation(-3).setAlpha(0);
                         this.addTween({
                             targets: greenSpike,
                             ease: 'Cubic.easeIn',
                             rotation: 0,
                             scaleX: 0.8,
                             scaleY: 0.8,
                             alpha: 1.2,
                             duration: 800,
                             onComplete: () => {
                                greenSpike.setScale(1);
                                 this.addTween({
                                     targets: greenSpike,
                                     ease: 'Cubic.easeOut',
                                     alpha: 0,
                                     scaleX: 0.4,
                                     scaleY: 0.4,
                                     duration: 800,
                                     onComplete: () => {
                                        greenSpike.destroy();
                                     }
                                 });
                             }
                         });
                     },
                     attackStartFunction: () => {
                         if (this.finalGlowTween) {
                             this.finalGlowTween.stop();
                         }
                         playSound('tree_timber');
                         this.pullbackScale = 0.97;
                         this.attackScale = 1.75;
                         this.hasTimbered = true;
                         this.addTween({
                             targets: this.glowBG,
                             scaleX: 13,
                             scaleY: 13,
                             alpha: 1,
                             ease: 'Quad.easeIn',
                             duration: 1000
                         })

                        let greenSpike = this.addImage(this.sprite.x, this.sprite.y, 'lowq', 'green_spike.png').setDepth(20).setScale(0.1).setRotation(Math.PI * 0.25);
                         this.addTween({
                             targets: greenSpike,
                             ease: 'Quad.easeOut',
                             scaleX: 3,
                             scaleY: 3,
                             alpha: 0,
                             duration: 800,
                             onComplete: () => {
                                greenSpike.destroy();
                             }
                         });
                     },
                     attackFinishFunction: () => {
                         this.addTween({
                             targets: this.glowBG,
                             scaleX: 15,
                             scaleY: 15,
                             alpha: 0,
                             ease: 'Cubic.easeOut',
                             duration: 1000,
                             onComplete: () => {
                                 this.glowBG.destroy();
                             }
                         })
                         this.pullbackScale = 0.99;
                         this.attackScale = 1.01;
                         this.currentAttackSetIndex = 6;
                         this.nextAttackIndex = 0;
                         this.triggerFallen();
                         playSound('body_slam')
                         let dmgEffect = poolManager.getItemFromPool('brickPattern2')
                         if (!dmgEffect) {
                             dmgEffect = this.addImage(gameConsts.halfWidth, globalObjects.player.getY() - 120, 'spells', 'brickPattern2.png').setDepth(998).setScale(0.75);
                         }
                         dmgEffect.setDepth(998).setScale(0.85).setAlpha(1);
                         this.addTween({
                             targets: dmgEffect,
                             rotation: 1,
                             alpha: 0,
                             duration: 800,
                             onComplete: () => {
                                 poolManager.returnItemToPool(dmgEffect, 'brickPattern2');
                             }
                         });
                     }
                 },
             ],
             [
                 // 6
                 {
                     name: "STUMPED...",
                     desc: "The tree is stumped",
                     chargeAmt: 600,
                     damage: 0,
                     startFunction: () => {
                         this.addTween({
                             targets: this.sprite,
                             scaleX: this.sprite.startScale,
                             scaleY: this.sprite.startScale,
                             duration: 2000,
                             ease: 'Cubic.easeInOut'
                         })
                     }
                 },
             ],
         ];
     }
     die() {
         if (this.dead) {
             return;
         }
         super.die();
         this.triggerFallen();
         if (this.currAnim) {
             this.currAnim.stop();
         }
         if (this.finalGlowTween) {
             this.finalGlowTween.stop();
             this.addTween({
                 targets: this.glowBG,
                 alpha: 0,
                 duration: 2000
             })
         }
         this.clearThorns()
         globalObjects.bannerTextManager.closeBanner();
        globalObjects.textPopupManager.hideInfoText();
         this.addTween({
             targets: [this.rune1],
             alpha: 0,
             duration: 200,
         });

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

         this.addTimeout(() => {
             this.showFlash(this.x, this.y - 25);
             let rune = this.addImage(this.x, this.y - 10, 'tutorial', 'rune_reinforce_large.png').setScale(0.5).setDepth(9999);
             playSound('victory_2');
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
         }, 2800);

     }

     triggerFallen() {
         if (this.fallen) {
             return;
         }
         if (this.attackAnim) {
             this.attackAnim.stop();

         }
         this.fallen = true;
         let oldScale = this.sprite.scaleX;
         let treeTop = this.addImage(this.sprite.x + 10, this.sprite.y, 'enemies', 'tree_top.png');
        this.clearThorns()
         treeTop.setScale(this.sprite.scaleX, this.sprite.scaleY).setOrigin(this.sprite.originX, this.sprite.originY).setDepth(this.sprite.depth - 1);
         this.setDefaultSprite('tree_stumped.png', this.sprite.startScale, true);
         this.sprite.setScale(oldScale);

         this.addTween({
             targets: this.sprite,
             scaleX: this.sprite.startScale,
             scaleY: this.sprite.startScale,
             duration: 2000,
             ease: 'Quad.easeOut',
         });
         this.addTween({
             targets: treeTop,
             alpha: 0,
             rotation: -0.1,
             scaleX: this.sprite.scaleX + 0.1,
             scaleY: this.sprite.scaleX + 0.1,
             duration: 2000,
             onComplete: () => {
                 treeTop.destroy();
             }
         });
     }

    createCrushAttack(damage = 30) {
        let greenSpike = this.addImage(this.sprite.x, this.sprite.y - 200, 'lowq', 'green_spike.png').setDepth(20).setScale(0);
        let spikeGlow1 = this.addImage(this.sprite.x, this.sprite.y - 200, 'blurry', 'spike_glow_yellow.png').setDepth(20).setRotation(10).setScale(0.2);
        let spikeGlow2 = this.addImage(this.sprite.x, this.sprite.y - 200, 'blurry', 'spike_glow_yellow.png').setDepth(20).setAlpha(0);
        let spike1 = this.addImage(this.sprite.x, this.sprite.y - 200, 'lowq', 'star_black.png').setDepth(20).setRotation(10).setScale(0.2);
        let spike2 = this.addImage(this.sprite.x, this.sprite.y - 200, 'lowq', 'star_black.png').setDepth(20).setAlpha(0);

        this.addTween({
            targets: [spikeGlow1, spike1],
            scaleX: 1.4,
            scaleY: 1.4,
            ease: 'Quart.easeIn',
            duration: 1400,
            onComplete: () => {
                this.addTween({
                    targets: [spikeGlow1, spike1],
                    scaleX: 0.9,
                    scaleY: 0.9,
                    ease: 'Cubic.easeOut',
                    duration: 600,
                });
            }
        });
        this.glowBG = this.addImage(spikeGlow1.x, spikeGlow1.y, 'blurry', 'explod.webp').setDepth(-1).setAlpha(0.01).setScale(9).setBlendMode(Phaser.BlendModes.MULTIPLY);
        this.addTween({
            targets: [this.glowBG],
            scaleX: 16,
            scaleY: 16,
            alpha: 0.25,
            ease: 'Quad.easeInOut',
            duration: 2000,
        })
        this.addTween({
            targets: [spikeGlow1, spike1, this.glowBG],
            rotation: Math.PI * 0.25,
            ease: 'Quad.easeInOut',
            y: this.y - 70,
            duration: 2000,
            onComplete: () => {
                this.addTween({
                    targets: [this.glowBG],
                    scaleX: 12,
                    scaleY: 12,
                    alpha: 0.75,
                    duration: 990,
                })
                let fallSound = playSound('robot_laser');
                fallSound.detune = -500;
                greenSpike.setPosition(spikeGlow1.x, spikeGlow1.y);
                greenSpike.setRotation(Math.PI * 0.25);
                spikeGlow2.y = spikeGlow1.y;
                spike2.y = spike1.y;
                spikeGlow2.rotation = 0;
                spikeGlow2.alpha = 1;
                spike2.alpha = 1;
                spike2.rotation = 0;
                this.addTween({
                    targets: [spike2, spikeGlow2],
                    scaleX: 1.4,
                    scaleY: 1.4,
                    easeParams: [4],
                    ease: 'Back.easeOut',
                    duration: 500,
                    onComplete: () => {
                        this.addTween({
                            targets: [spike2, spikeGlow2],
                            scaleX: 1.6,
                            scaleY: 1.6,
                            duration: 500,
                        });
                    }
                });
                this.addTween({
                    targets: [spike1, spikeGlow1],
                    scaleX: 1.55,
                    scaleY: 1.55,
                    duration: 1000,
                });
                this.addTween({
                    targets: [greenSpike],
                    scaleX: 6,
                    scaleY: 6,
                    alpha: 0,
                    duration: 450,
                });
                this.addTween({
                    targets: [spikeGlow1, spikeGlow2, spike1, spike2, greenSpike, this.glowBG],
                    rotation: "+=6",
                    ease: 'Quad.easeIn',
                    y: globalObjects.player.getY() - 200,
                    duration: 1000,
                    onComplete: () => {
                        playSound('body_slam', 0.7);
                        playSound('fizzle');
                        messageBus.publish("selfTakeDamage", damage);
                        greenSpike.destroy();
                        this.addTween({
                            targets: [spikeGlow1, spikeGlow2, spike1, spike2],
                            scaleX: 1.75,
                            scaleY: 1.75,
                            duration: 10,
                            onComplete: () => {
                                this.glowBG.alpha = 1;
                                this.addTween({
                                    targets: [spikeGlow1, spikeGlow2, spike1, spike2, this.glowBG],
                                    duration: 500,
                                    alpha: 0,
                                    onComplete: () => {
                                        spikeGlow1.destroy();
                                        spikeGlow2.destroy();
                                        spike1.destroy();
                                        spike2.destroy();
                                        fallSound.detune = 0;
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });
    }

     dropBird() {
         let isFlipped = !!this.birdFlipped;
         let flipMult = this.birdFlipped ? -1 : 1;
         let birdImg = this.addSprite(gameConsts.halfWidth - 130 * flipMult, this.y - (isFlipped ? 220 : 200), 'enemies', 'bird_1.png').setDepth(999);
         this.addTween({
             targets: birdImg,
             x: isFlipped ? "-=50" : "+=50",
             rotation: isFlipped ? "-=4.5" : "+=4.5",
             duration: 1500
         })
         this.addTween({
             targets: birdImg,
             y: "+=145",
             ease: 'Back.easeIn',
             duration: 1500,
             onComplete: () => {
                 birdImg.setFrame('bird_2.png');
                 if (isFlipped) {
                     birdImg.scaleX = -1;
                 }
                 birdImg.setRotation(0.2 * flipMult);
                 this.addTween({
                     targets: birdImg,
                     x: isFlipped ? "-=400" : "+=400",
                     rotation: -0.1 * flipMult,
                     ease: 'Quad.easeIn',
                     duration: 1500
                 })
                 this.addTween({
                     targets: birdImg,
                     y: "-=300",
                     ease: 'Back.easeIn',
                     duration: 1500,
                     onComplete: () => {
                         birdImg.destroy();
                     }
                 })
             }
         })

         this.birdFlipped = !this.birdFlipped;
     }

    adjustDamageTaken(amt, isAttack, isTrue ) {
        if (isAttack && this.hasThorns && !this.dead) {

            let glowSpike = getTempPoolObject('enemies', 'glowSpike.png', 'glowSpike', 1800);
            let isLeft = Math.random() < 0.5;
            glowSpike.setScale(0.5).setAlpha(1).setPosition(gameConsts.halfWidth + (isLeft ? -50 : 50), this.y - 150).setDepth(999).setRotation(isLeft ? -8 : 8);

            this.addTween({
                targets: glowSpike,
                x: gameConsts.halfWidth + (isLeft ? -80 : 80),
                ease: 'Cubic.easeOut',
                duration: 300,
                rotation: 0,
                onComplete: () => {
                    this.addTween({
                        rotation: isLeft ? 10 : -10,
                        targets: glowSpike,
                        ease: 'Cubic.easeIn',
                        x: gameConsts.halfWidth,
                        duration: 1100,
                    });
                }
            });
            this.addTween({
                targets: glowSpike,
                ease: 'Quart.easeIn',
                scaleX: 2.6,
                scaleY: 2.6,
                duration: 300,
                onComplete: () => {
                    playSound('matter_body');
                    this.addTween({
                        targets: glowSpike,
                        ease: 'Cubic.easeOut',
                        scaleX: 1.05,
                        scaleY: 1.05,
                        duration: 1100,
                        onComplete: () => {
                            glowSpike.setScale(1.15);
                        }
                    });
                }
            });

            this.addTween({
                targets: glowSpike,
                y: globalObjects.player.getY() - 270,
                alpha: 1.2,
                duration: 1300,
                easeParams: [2.5],
                ease: 'Back.easeIn',
                onComplete: () => {
                    glowSpike.setDepth(20);
                    this.addTween({
                        targets: glowSpike,
                        y: globalObjects.player.getY() - 205,
                        duration: 100,
                        onComplete: () => {
                            messageBus.publish("selfTakeDamage", 2, false, glowSpike.x);
                            playSound('razor_leaf', 0.75)
                                this.addTween({
                                targets: glowSpike,
                                alpha: 0,
                                ease: 'Cubic.easeIn',
                                duration: 300,
                            });
                        }
                    });
                }
            });

            this.thorns1.setScale(1.24).setAlpha(1);
            this.thorns2.setScale(1.24).setAlpha(1);
            this.thornsTween = this.addTween({
                 targets: [this.thorns1, this.thorns2],
                 scaleX: 1,
                 scaleY: 1,
                 alpha: 0.85,
                 ease: 'Cubic.easeOut',
                 duration: 400,
             });
        }
        return super.adjustDamageTaken(amt, isAttack, isTrue);
    }
}
