 class Wall extends Enemy {
     constructor(scene, x, y, level) {
         super(scene, x, y, level);
         this.initSprite('wall_1.png', 1);
         this.shieldAdded = false;
         this.trueStartScale = 1;
        this.bgMusic = playMusic('bite_down', 0.7, true);
         this.initBird();
         this.popupTimeout = this.addTimeout(() => {
             this.tutorialButton = createTutorialBtn(this.level);
             this.addToDestructibles(this.tutorialButton);
         }, 3500)
     }

     initStatsCustom() {
         this.health = 800;
         this.pullbackScale = 0.9999;
         this.attackScale = 1;
         this.isAsleep = true;
         this.nextBirdIndex = 0;
         this.eyeArray = [];
         this.eyeHealth = 50;
     }

     initSpriteAnim(scale) {
         this.sprite.setScale(scale * 0.94, scale);
         playSound('matter_enhance_2', 0.35).detune = -1000;
         this.addTween({
             targets: this.sprite,
             scaleX: scale,
             duration: 800,
             alpha: 1,
             ease: 'Quart.easeOut',
         });
     }

     initBird() {
         this.bird = this.addImage(this.x - 335 * this.trueStartScale, this.y - 223 * this.trueStartScale, 'enemies', 'bird_1.png').setAlpha(0).setDepth(10).setScale(this.trueStartScale);
         this.addTween({
             delay: 150,
             targets: [this.bird],
             alpha: 1,
             ease: 'Quad.easeIn',
             duration: 800,
         });
     }

     // update(dt) {}

     // reset(x, y) {
     //     this.x = x;
     //     this.y = y;
     // }

     setHealth(newHealth) {
         super.setHealth(newHealth);
         let prevHealthPercent = this.prevHealth / this.healthMax;
         let currHealthPercent = this.health / this.healthMax;
         if (currHealthPercent == 0) {
             // dead, can't do anything
             return;
         }
         if (this.isStarting) {
             this.eyeHealth -= (this.prevHealth - newHealth);
             if (this.eyeHealth <= 0 ) {
                 this.squintEyes();
                 this.eyeHealth = 50;
             }
         }
         if (currHealthPercent < 0.9999 && this.isAsleep && !this.isStarting) {
             this.isStarting = true;
             this.setDefaultSprite('wall_2.png');
             this.initEye1();
             this.birdFalls();
         } else if (currHealthPercent < 0.8 && !this.firstCanCrumble) {
             this.firstCanCrumble = true;
             this.setDefaultSprite('wall_3.png');
             this.closeEyes(0, () => {
                 this.eyes1.setFrame('wall_eyes_3_a.png');
                 this.eyes1.setPosition(this.x - 91 * this.trueStartScale, this.y + 41 * this.trueStartScale);
                 this.eyes1.startOffsetX = -91 * this.trueStartScale;
                 this.eyes1.startOffsetY = 41 * this.trueStartScale;
                 let xDiff = 125 * this.trueStartScale;
                 let yDiff = -3 * this.trueStartScale;
                 this.eyes2 = this.addImage(this.x + xDiff, this.y + yDiff, 'enemies', 'wall_eyes_3_b.png').setDepth(8).setScale(this.trueStartScale, this.trueStartScale * 0.1);
                 this.addExtraSprite(this.eyes2, xDiff, yDiff);
                 this.eyeArray.push(this.eyes2);
                 this.reOpenEyes()
             });
         } else if (currHealthPercent < 0.6 && !this.secondCanCrumble) {
             this.secondCanCrumble = true;
             this.setDefaultSprite('wall_4.png');
             this.closeEyes(0, () => {
                 this.eyes1.setPosition(this.x - 91 * this.trueStartScale, this.y + 41 * this.trueStartScale);
                 this.eyes1.startOffsetX = -91 * this.trueStartScale;
                 this.eyes1.startOffsetY = 41 * this.trueStartScale;
                 if (!this.eyes2) {
                     let xDiff = 100 * this.trueStartScale;
                     let yDiff = -5 * this.trueStartScale;
                     this.eyes2 = this.addImage(this.x + xDiff, this.y + yDiff, 'enemies', 'wall_eyes_3_b.png').setDepth(8).setScale(this.trueStartScale, this.trueStartScale * 0.1);
                     this.eyeArray.push(this.eyes2);
                     this.addExtraSprite(this.eyes2, xDiff, yDiff);
                 }

                 this.reOpenEyes()
             })
         } else if (currHealthPercent < 0.4 && !this.thirdCanCrumble) {
             this.setDefaultSprite('wall_5.png');
             this.thirdCanCrumble = true;
             this.eyes1.setVisible(false);
             this.closeEyes(0, () => {
                 let eye2OffsetX = 150 * this.trueStartScale;
                 let eye2OffsetY = 34 * this.trueStartScale;
                 if (!this.eyes2) {
                     this.eyes2 = this.addImage(this.x + 100 * this.trueStartScale, this.y - 5 * this.trueStartScale, 'enemies', 'wall_eyes_3_b.png').setDepth(8).setScale(this.trueStartScale, this.trueStartScale * 0.1);
                     this.eyeArray.push(this.eyes2);
                     this.addExtraSprite(this.eyes2, eye2OffsetX, eye2OffsetY);
                 }
                 this.eyes2.setFrame('wall_eyes_4.png').setPosition(this.x + eye2OffsetX, this.y + eye2OffsetY);
                 this.eyes2.startOffsetX = eye2OffsetX;
                 this.eyes2.startOffsetY = eye2OffsetY;
                 this.reOpenEyes()
             })
         }
     }

     initEye1() {
         this.eyes1 = this.addImage(this.x + 5 * this.trueStartScale, this.y - 10 * this.trueStartScale, 'enemies', 'wall_eyes_2.png').setDepth(8).setScale(this.trueStartScale, this.trueStartScale * 0.1).setVisible(false);
         this.addExtraSprite(this.eyes1, 5 * this.trueStartScale, -10 * this.trueStartScale);
         this.eyeArray.push(this.eyes1);

         this.addTween({
             delay: 250,
             targets: [this.eyes1],
             scaleY: this.trueStartScale * 0.25,
             duration: 55,
             ease: 'Back.easeOut',
             completeDelay: 700,
             onStart: () => {
                 this.eyes1.setVisible(true);
             },
             onComplete: () => {
                this.addTimeout(() => {
                    playSound('matter_enhance_2');
                }, 500)
                 this.addTween({
                     targets: [this.eyes1],
                     scaleY: this.trueStartScale * 1.1,
                     duration: 900,
                     ease: 'Back.easeIn',
                     completeDelay: 200,
                     onComplete: () => {
                         this.addTween({
                             targets: [this.eyes1],
                             scaleY: this.trueStartScale,
                             duration: 300,
                             ease: 'Cubic.easeInOut',
                             onComplete: () => {
                                 this.setAwake();
                             }
                         });
                     }
                 });
             }
         });
     }

     squintEyes(fullSquint = false) {
         if (this.eyeAnim) {
             this.eyeAnim.stop();
         }
         if (!fullSquint) {
             for (let i = 0; i < this.eyeArray.length; i++) {
                 this.eyeArray[i].scaleY = this.trueStartScale * 0.5;
             }
             this.eyeAnim = this.addTween({
                 targets: this.eyeArray,
                 scaleY: this.trueStartScale,
                 ease: 'Cubic.easeIn',
                 duration: 450,
             });
         } else {
             this.eyeAnim = this.addTween({
                 targets: this.eyeArray,
                 scaleY: 0,
                 ease: 'Cubic.easeIn',
                 duration: 350,
                 onComplete: () => {
                     this.eyeAnim = this.addTween({
                         targets: this.eyeArray,
                         scaleY: this.trueStartScale,
                         ease: 'Cubic.easeOut',
                         duration: 300,
                     });
                 }
             });
         }
     }

     closeEyes(duration = 1, onComplete) {
         if (this.eyeAnim) {
             this.eyeAnim.stop();
         }
         this.addTween({
             targets: this.eyeArray,
             scaleY: 0,
             ease: 'Quad.easeIn',
             duration: duration,
             onComplete: onComplete
         });
     }

     reOpenEyes(duration = 500) {
         this.addTween({
             targets: this.eyeArray,
             scaleY: this.trueStartScale,
             ease: 'Back.easeOut',
             duration: duration,
         });
     }

     birdFalls() {
         this.addTween({
             targets: [this.bird],
             x: "+=90",
             rotation: "+=5.9",
             duration: 1150,
         });
         this.addTween({
             targets: [this.bird],
             y: "+=140",
             duration: 1150,
             ease: 'Back.easeIn',
             onComplete: () => {
                 this.bird.setFrame('bird_2.png')
                 this.bird.setRotation(0.4);
                 this.addTween({
                     targets: [this.bird],
                     y: -40,
                     duration: 1000,
                     easeParams: [1.4],
                     ease: 'Back.easeIn',
                 });
                 this.addTween({
                     targets: [this.bird],
                     x: "+=400",
                     rotation: 0,
                     duration: 1000,
                     ease: 'Quad.easeIn',
                     onComplete: () => {
                         this.bird.visible = false;
                     }
                 });
             }
         });
     }

     throwWallChunk(spriteName, damage = 40, endScale = 1) {
         this.closeEyes(400);

         let wallChunk = this.addImage(this.x, this.y - 115, 'enemies', spriteName).setDepth(0).setScale(this.trueStartScale * 0.9);
         wallChunk.y += wallChunk.height * 0.5;

         this.addTween({
             delay: 550,
             targets: wallChunk,
             y: -250,
             ease: 'Quad.easeOut',
             duration: 500,
             onStart: () => {
                 this.addTimeout(() => {
                     playSound('matter_enhance', 0.75);
                 }, 80);
             },
             onComplete: () => {
                 wallChunk.setScale(endScale).setRotation(-4).setDepth(20);
                 this.addTween({
                     targets: wallChunk,
                     rotation: 0,
                     duration: 800,
                     onComplete: () => {
                         this.addTween({
                             delay: 1000 + damage * 5,
                             targets: wallChunk,
                             alpha: 0,
                             duration: 400,
                             onComplete: () => {
                                 this.reOpenEyes();
                                 wallChunk.destroy();
                             }
                         });
                     }
                 });
                 this.addTween({
                     targets: wallChunk,
                     y: globalObjects.player.getY() - 210,
                     ease: 'Cubic.easeIn',
                     duration: 800,
                     onComplete: () => {
                         let hitEffect2 = this.addImage(wallChunk.x, wallChunk.y, 'spells', 'rockCircle.png').setScale(0.2).setRotation(Math.random() * 6).setDepth(195);

                         let hitEffect = this.addImage(wallChunk.x, wallChunk.y, 'spells', damage > 50 ? 'brickPattern2.png' : 'damageEffect4.png').setScale(0.95).setRotation(Math.random()).setDepth(195);

                         this.scene.tweens.add({
                             targets: hitEffect,
                             scaleX: 1,
                             scaleY: 1,
                             ease: 'Cubic.easeOut',
                             duration: 300,
                             onComplete: () => {
                                 hitEffect.destroy();
                             }
                         });
                         this.scene.tweens.add({
                             targets: hitEffect,
                             alpha: 0,
                             duration: 300
                         });
                         this.scene.tweens.add({
                             targets: hitEffect2,
                             alpha: 0,
                             scaleX: 0.75,
                             scaleY: 0.75,
                             duration: 500,
                             onComplete: () => {
                                 hitEffect2.destroy();
                             }
                         });
                         playSound('rock_crumble', 0.5);
                         messageBus.publish("selfTakeDamage", damage);

                     }
                 });
             }
         });
     }

    birdPoops(numBirds, hasRock = false, hasBigRock = false, hasBigPoop = false) {
        for (let i = 0; i < numBirds; i++) {
            let delay = i * (hasRock ? 350 : 200);
            let bird;
            let isBigPoop = false;
            if (hasBigPoop && i == numBirds - 1) {
                delay += 500;
                isBigPoop = true;
                bird = this.addImage(-999, 0, 'enemies', 'bird_2_fat.png').setDepth(12).setScale(this.trueStartScale * 0.25 + 0.55);
            } else {
                bird = poolManager.getItemFromPool('bird');
                if (!bird) {
                    bird = this.addImage(-999, 0, 'enemies', 'bird_2.png').setDepth(12).setScale(this.trueStartScale * 0.25 + 0.55);
                }
            }

            bird.y = 10 + Math.random() * 120;
            let isLeft = i % 2 == 0;
            if (!isLeft) {
                bird.rotation = -0.8;
                bird.scaleX *= -1;
            } else {
                bird.rotation = 0.8;
            }
            bird.x = isLeft ? -50 : gameConsts.width + 50;
            let rock;
            let rockYOffset = 40;
            if (hasRock && !isBigPoop) {
                rock = this.addImage(bird.x, bird.y + rockYOffset, 'enemies', hasBigRock ? 'wall_chunk.png' : 'brick.png').setDepth(12).setScale(this.trueStartScale * 0.25 + 0.55);
                if (!isLeft) {
                    rock.scaleX *= -1;
                }
            }
            let duration = hasRock ? 900 : 700;
            if (hasBigRock) {
                duration *= 2;
            }
            if (isBigPoop) {
                duration *= 2;
            }
            let goalX = isLeft ? gameConsts.halfWidth + 15 - Math.random() * 45 : gameConsts.halfWidth + Math.random() * 45 - 15;
            this.addTween({
                delay: delay,
                targets: bird,
                rotation: bird.rotation * 0.8,
                x: goalX,
                duration: duration,
                onStart: () => {
                    let goalY = globalObjects.player.getY() - 400 - Math.random() * 110
                    this.addTween({
                        targets: bird,
                        scaleX: isLeft ? this.trueStartScale * 0.25 + 0.8 : -this.trueStartScale * 0.25 - 0.8,
                        scaleY: this.trueStartScale * 0.25 + 0.8,
                        y: goalY,
                        ease: 'Cubic.easeOut',
                        duration: duration,
                    });
                    if (hasRock && !isBigPoop) {
                        this.addTween({
                            targets: rock,
                            scaleX: isLeft ? this.trueStartScale * 0.25 + 0.8 : -this.trueStartScale * 0.25 - 0.8 ,
                            scaleY: this.trueStartScale * 0.25 + 0.8,
                            y: goalY + rockYOffset,
                            ease: 'Cubic.easeOut',
                            duration: duration,
                        });
                        this.addTween({
                            targets: rock,
                            x: goalX,
                            duration: duration,
                            onComplete: () => {
                                let distToPlayer = Math.abs(globalObjects.player.getY() - 180 - rock.y);
                                this.addTween({
                                    targets: rock,
                                    y: globalObjects.player.getY() - 180 - Math.random() * 15,
                                    ease: 'Quad.easeIn',
                                    duration: 500 + Math.floor(distToPlayer * 1.5),
                                    onComplete: () => {
                                        messageBus.publish("selfTakeDamage", hasBigRock ? 20 : 5);
                                        if (hasBigRock) {
                                            let hitEffect2 = this.addImage(rock.x, rock.y, 'spells', 'rockCircle.png').setScale(0.2).setRotation(Math.random() * 6).setDepth(195);
                                            this.scene.tweens.add({
                                                targets: hitEffect2,
                                                alpha: 0,
                                                scaleX: 0.75,
                                                scaleY: 0.75,
                                                duration: 500,
                                                onComplete: () => {
                                                    hitEffect2.destroy();
                                                }
                                            });
                                            playSound('rock_crumble', 0.6);
                                        } else {
                                            playSound('punch', 0.5);
                                        }

                                        rock.destroy();

                                        let powEffect = getTempPoolObject('spells', 'damageEffect1.png', 'damageEffect1', 150)
                                        powEffect.setPosition(rock.x, rock.y).setDepth(9999).setScale(hasBigRock ? 2 : 1.25);
                                    }
                                });
                            }
                        });
                    }
                },
                completeDelay: hasBigRock ? 250 : 0,
                onComplete: () => {
                    let poopDelay = 0;
                    if (isBigPoop) {
                        poopDelay = 200;
                        bird.setFrame('bird_2.png');
                    }
                    this.addTween({
                        targets: bird,
                        delay: poopDelay,
                        rotation: 0,
                        x: isLeft ? gameConsts.width + 50 : -50,
                        duration: 650,
                        onComplete: () => {
                            poolManager.returnItemToPool(bird, 'bird');
                        }
                    });
                    this.addTween({
                        targets: bird,
                        delay: poopDelay,
                        scaleX: isLeft ? this.trueStartScale * 0.25 + 0.55 : -this.trueStartScale * 0.25 - 0.55,
                        scaleY: this.trueStartScale * 0.25 + 0.55,
                        y: 100 + Math.random() * 100,
                        ease: 'Cubic.easeIn',
                        duration: 650,
                    });
                    if (!hasRock || isBigPoop) {
                        let poop = this.addImage(bird.x, bird.y + 10, 'enemies', isBigPoop ? 'poopbig.png' : 'poop.png').setDepth(999);
                        let targetY = globalObjects.player.getY() - 215;
                        if (!isBigPoop) {
                            targetY += Math.random() * 15;
                        }
                        this.addTween({
                            targets: poop,
                            y: targetY,
                            ease: 'Quad.easeIn',
                            duration: isBigPoop ? 1000 : 600,
                            onComplete: () => {
                                if (isBigPoop) {
                                    messageBus.publish("selfTakeDamage", 3);
                                    messageBus.publish('playerAddDelayedDamage', 2);

                                    playSound('punch', 0.5);
                                    playSound('squish');
                                    let powEffect = getTempPoolObject('spells', 'damageEffect1.png', 'damageEffect1', 150)
                                    powEffect.setPosition(poop.x, poop.y).setDepth(9999).setScale(1.4);
                                    let startScale = poop.scaleX;
                                    poop.setScale(startScale * 1.25);
                                    this.addTween({
                                        delay: 3000,
                                        targets: poop,
                                        alpha: 0,
                                        ease: 'Cubic.easeIn',
                                        duration: 500,
                                    })

                                } else {
                                    poop.destroy();
                                    messageBus.publish("selfTakeDamage", 2);
                                    let powEffect = getTempPoolObject('spells', 'damageEffect1.png', 'damageEffect1', 150)
                                    powEffect.setPosition(poop.x, poop.y).setDepth(9999);
                                    playSound('squish');
                                }
                            }
                        });
                        let targetX = gameConsts.halfWidth;
                        if (!isBigPoop) {
                            targetX += Math.random() * 50 - 25;
                        }
                        this.addTween({
                            targets: poop,
                            x: targetX,
                            duration: isBigPoop ? 1000 : 600,
                        });
                    }
                }
            });
        }
    }

    checkCrumble(gotoStare) {
        if (this.thirdCanCrumble && !this.thirdCrumbled) {
            this.thirdCrumbled = true;
            this.secondCrumbled = true;
            this.firstCrumbled = true;
            this.currentAttackSetIndex = 3;
        } else if (this.secondCanCrumble && !this.secondCrumbled) {
            this.secondCrumbled = true;
            this.firstCrumbled = true;
            this.currentAttackSetIndex = 2;
        } else if (this.firstCanCrumble && !this.firstCrumbled) {
            this.firstCrumbled = true;
            this.currentAttackSetIndex = 1;
        } else if (gotoStare) {
            this.currentAttackSetIndex = 0;
            this.nextAttackIndex = 0;
        } else {
            this.currentAttackSetIndex = 4;
            this.nextAttackIndex = this.nextBirdIndex;
        }
    }

     initAttacks() {
         this.attacks = [
             [
                 // 0
                 {
                     name: " STARE... ",
                     isPassive: true,
                     desc: "A pair of eyes watch you",
                     chargeAmt: 300,
                     damage: -1,
                     attackFinishFunction: () => {
                         this.squintEyes(true);
                         this.nextAttackIndex = 0;
                        this.checkCrumble();
                     }
                 },
             ],
             [
                 // 1
                 {
                     name: ";40",
                     chargeAmt: 1100,
                     damage: -1,
                     chargeMult: 1.5,
                     isBigMove: true,
                     attackStartFunction: () => {
                         this.pullbackScale = 0.99;
                         this.attackScale = 1.04;
                         this.addTimeout(() => {
                             this.throwWallChunk('wall_chunk.png', 40);
                         }, 400)
                     },
                     attackFinishFunction: () => {
                         this.pullbackScale = 0.99;
                         this.attackScale = 1;
                         this.currentAttackSetIndex = 0;
                         this.nextAttackIndex = 0;
                     }
                 },
             ],
             [
                 // 2
                 {
                     name: ";60",
                     chargeAmt: 1150,
                     damage: -1,
                     chargeMult: 1.5,
                     isBigMove: true,
                     attackStartFunction: () => {
                         this.pullbackScale = 0.99;
                         this.attackScale = 1.04;
                        this.addTimeout(() => {
                            this.throwWallChunk('wall_chunk_2.png', 60);
                        }, 300);
                     },
                     attackFinishFunction: () => {
                         this.pullbackScale = 0.99;
                         this.attackScale = 1;
                         this.currentAttackSetIndex = 0;
                         this.nextAttackIndex = 0;
                     }
                 },
             ],
             [
                 // 3
                 {
                     name: ";100",
                     chargeAmt: 1200,
                     damage: -1,
                     chargeMult: 1.5,
                     isBigMove: true,
                     attackStartFunction: () => {
                         this.pullbackScale = 0.99;
                         this.attackScale = 1.04;
                         this.addTimeout(() => {
                             this.throwWallChunk('wall_chunk_2.png', 100, 1.25);
                         }, 300);
                     },
                     attackFinishFunction: () => {
                         this.pullbackScale = 0.99;
                         this.attackScale = 1;
                         this.currentAttackSetIndex = 0;
                         this.nextAttackIndex = 0;
                     }
                 },
             ],
             [
                 // 4
                 {
                     name: "}2",
                     chargeAmt: 300,
                     damage: -1,
                     attackFinishFunction: () => {
                        this.birdPoops(1);
                         this.nextBirdIndex = 1;
                        this.checkCrumble();
                     }
                 },
                 {
                     name: "}5",
                     chargeAmt: 400,
                     damage: -1,
                     attackFinishFunction: () => {
                         this.birdPoops(1, true);
                         this.nextBirdIndex = 2;
                         this.checkCrumble(true);
                     }
                 },
                 {
                     name: "}2x4",
                     chargeAmt: 400,
                     damage: -1,
                     attackFinishFunction: () => {
                         this.birdPoops(4);
                         this.nextBirdIndex = 3;
                         this.checkCrumble();
                     }
                 },
                 {
                     name: "}5x3",
                     chargeAmt: 450,
                     damage: -1,
                     attackFinishFunction: () => {
                         this.birdPoops(3, true);
                         this.nextBirdIndex = 4;
                         this.checkCrumble(true);
                     }
                 },
                 {
                     name: "}2x7",
                     chargeAmt: 450,
                     damage: -1,
                     attackFinishFunction: () => {
                         this.birdPoops(7);
                         this.nextBirdIndex = 5;
                         this.checkCrumble();
                     }
                 },
                 {
                     name: "}5x4 (with extra)",
                     chargeAmt: 450,
                     damage: -1,
                     attackFinishFunction: () => {
                         this.birdPoops(4, true, false, true);
                         this.nextBirdIndex = 6;
                         this.checkCrumble(true);
                     }
                 },
                 {
                     name: "}20",
                     chargeAmt: 450,
                     damage: -1,
                     attackFinishFunction: () => {
                         this.birdPoops(1, true, true);
                         this.nextBirdIndex = 7;
                         this.checkCrumble();
                     }
                 },
                 {
                     name: "}2x12",
                     chargeAmt: 500,
                     damage: -1,
                     attackFinishFunction: () => {
                         this.birdPoops(12);
                         this.nextBirdIndex = 8;
                         this.checkCrumble(true);
                     }
                 },
                 {
                     name: "}5x6",
                     chargeAmt: 500,
                     damage: -1,
                     attackFinishFunction: () => {
                         this.birdPoops(6, true);
                         this.nextBirdIndex = 9;
                         this.checkCrumble(true);
                     }
                 },
                 {
                     name: "}20x2",
                     chargeAmt: 550,
                     damage: -1,
                     attackFinishFunction: () => {
                         this.birdPoops(2, true, true);
                         this.nextBirdIndex = 5;
                         this.checkCrumble();
                     }
                 },
             ]
         ];
     }

     die() {
         if (this.dead) {
             return;
         }
         super.die();
         for (let i = 0; i < this.eyeArray.length; i++) {
             this.eyeArray[i].destroy();
         }

         if (this.currAnim) {
             this.currAnim.stop();
         }
        playSound('rock_crumble', 0.6);
         this.setDefaultSprite('wall_dead.png')
         if (this.bgMusic) {
             this.bgMusic.stop();
         }
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

         if (this.bird && this.bird.visible) {
             this.addTween({
                 targets: [this.bird],
                 y: "+=330",
                 duration: 1400,
                 ease: 'Quad.easeIn',
             });

             this.addTween({
                 targets: [this.bird],
                 rotation: "+=7",
                 x: "+=10",
                 duration: 1400,
                 onComplete: () => {
                     this.addTween({
                         delay: 500,
                         targets: [this.bird],
                         duration: 500,
                         alpha: 0,
                     });
                 }
             });
         }

         this.addTimeout(() => {
             this.showFlash(this.x, this.y + 100);
             this.addTimeout(() => {
                 let rune = this.addImage(this.x, this.y + 100, 'tutorial', 'rune_unload_large.png').setScale(0.5).setDepth(9999);
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
             }, 250)
         }, 1400);
     }

}
