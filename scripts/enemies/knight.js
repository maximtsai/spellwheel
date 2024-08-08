 class Knight extends Enemy {
     constructor(scene, x, y, level) {
         super(scene, x, y, level);
         this.initSprite('void_knight.png', 1);// 0.7
         this.sprite.setOrigin(0.5, 0.5); // 0.9
         this.bgMusic = playMusic('into_the_void', 0.8, true);
         this.shieldAdded = false;
         this.initMisc();
         this.popupTimeout = this.addTimeout(() => {
             this.tutorialButton = createTutorialBtn(this.level);
             this.addToDestructibles(this.tutorialButton);
         }, 3500);
         this.addTimeout(() => {
            this.initFog();
            this.setAsleep();
         }, 0);
         this.voidTentaEye = this.addImage(this.x + 50, this.y - 30, 'enemies', 'void_tentacle_eye.png').setDepth(-1).setRotation(-1.2).setScale(1.3).setVisible(false);
         this.addDelay(() => {
             this.voidTentaEye.visible = true;
             this.addTween({
                 targets: this.voidTentaEye,
                 rotation: 0,
                 ease: 'Back.easeOut',
                 scaleX: 1.2,
                 x: "+=25",
                 y: "-=20",
                 scaleY: 1.2,
                 duration: 750,
                 onComplete: () => {
                     this.addTween({
                         targets: this.voidTentaEye,
                         rotation: -0.05,
                         ease: 'Back.easeOut',
                         scaleX: 1.15,
                         scaleY: 1.15,
                         duration: 1200,
                         onComplete: () => {
                             playSound('meat_click_right', 0.2);
                             playSound('void_body', 0.35);
                             this.addTween({
                                 targets: this.voidTentaEye,
                                 rotation: -1.1,
                                 x: "-=38",
                                 ease: 'Back.easeIn',
                                 scaleX: 1,
                                 scaleY: 1,
                                 duration: 400,
                                 onComplete: () => {
                                     this.voidTentaEye.x += 12;
                                     this.voidTentaEye.visible = false;
                                 }
                             });
                         }
                     })

                 }
             });
             messageBus.publish("showCombatText", "...", -2, () => {
                 this.setAwake();
             }, 0.6);
             this.addTimeout(() => {
                 this.playerSpellCastSub = messageBus.subscribe('playerCastedSpell', () => {
                     this.playerSpellCastSub.unsubscribe();
                     messageBus.publish("closeCombatText");
                 });
             }, 200)
         }, 750)

     }

     initStatsCustom() {
         this.health = gameVars.isHardMode ? 160 : 130;
         this.eyeObjects = [];
         this.pullbackScale = 0.92;
         this.attackScale = 1.11;
         this.isFirstMode = true;
         this.shieldAmts = 0;
         this.shieldTextFont = "void";
         this.shieldsActive = 0;
         this.eyeShieldObjects = [];
         this.eyeUpdateTick = 30;
         this.lastAttackLingerMult = 1.2;
         this.slashEffect = this.addImage(globalObjects.player.getX(), globalObjects.player.getY() - 55, 'misc', 'slash1.png').setScale(0.9).setDepth(130).setAlpha(0);
         this.voidSlashEffect = this.addImage(globalObjects.player.getX(), globalObjects.player.getY() - 260, 'spells', 'darkSlice.png').setScale(0.8).setDepth(130).setAlpha(0).setOrigin(0.15, 0.5);
         this.voidSlashEffect2 = this.addImage(globalObjects.player.getX(), globalObjects.player.getY() - 260, 'spells', 'darkSlice.png').setScale(0.8).setDepth(130).setAlpha(0).setOrigin(0.15, 0.5);
        this.isFirstVoidSlash = true;
         this.shieldTextOffsetY = -20;
     }

     initMisc() {
         this.voidShield1b = this.addImage(this.sprite.x, this.sprite.y, 'enemies', 'void_knight_shield_2.png').setScale(1).setDepth(3).setAlpha(0);
         this.voidShield1b.startScale = this.voidShield1b.scaleX;

         this.voidShield2b = this.addImage(this.sprite.x, this.sprite.y, 'enemies', 'void_knight_shield_2.png').setScale(1.28).setDepth(3).setAlpha(0);
         this.voidShield2b.startScale = this.voidShield2b.scaleX;

         this.sigilEffect = this.addImage(this.x, this.y, 'enemies', 'void_knight_sigil.png').setScale(this.sprite.startScale).setDepth(5).setAlpha(0);
     }

     initFog() {
        this.fogThick = this.addImage(gameConsts.halfWidth, gameConsts.halfHeight - 200, 'blurry', 'fogthick.png').setDepth(9).setAlpha(0).setOrigin(0.5, 0.25).setScale(2);
        this.graves = this.addImage(gameConsts.halfWidth, gameConsts.height + 8, 'backgrounds', 'graves.png').setDepth(9).setScale(1.25, 1).setAlpha(0).setOrigin(0.5, 1);

        this.addTween({
             targets: [this.fogThick],
             duration: 1000,
             alpha: 1,
             scaleX: 2,
             ease: 'Cubic.easeInOut',
         });
        this.addTween({
             targets: [this.graves],
             alpha: 1,
             duration: 1200,
             scaleX: 0.98,
             ease: 'Cubic.easeInOut',

         });
     }

     takeEffect(newEffect) {
         if (this.sprite) {
             if (newEffect.name == 'mindStrike' && this.shield <= 0 && !this.dead) {
                 if (!this.shockEffect) {
                     this.shockEffect = this.addImage(this.x, this.y, 'enemies', 'void_shock.png').setDepth(21)
                 }
                 this.shockEffect.x += 10;
                 this.shockEffect.visible = true;
                 this.addTween({
                     targets: this.shockEffect,
                     x: gameConsts.halfWidth,
                     ease: 'Bounce.easeOut',
                     easeParams: [1, 2.5],
                     duration: 400,
                     onComplete: () => {
                         this.shockEffect.visible = 0;
                     }
                 });
             }
         }
         super.takeEffect(newEffect)
     }

     reactToDamageTypes(amt, isAttack, type) {
         super.reactToDamageTypes(amt, isAttack, type);
         if (this.emergency || this.dead || !this.isFirstMode) {
             return;
         }
         if (!this.isUsingAttack) {
             if (type == "mind") {
             } else if (type == "time") {
                 if (this.accumulatedDamageReaction >= 9) {
                     this.setSprite('void_knight_dazed.png');
                     if (this.reactTween) {
                         this.reactTween.stop();
                     }
                     this.reactTween = this.addTween({
                         targets: this.sprite,
                         rotation: 0,
                         duration: 1100,
                         onComplete: () => {
                             if (!this.isUsingAttack && !this.dead && this.isFirstMode) {
                                 this.setSprite(this.defaultSprite);
                             }
                         }
                     })
                 }
             }
         }

     }

     launchAttack(attackTimes = 1, prepareSprite, preAttackSprite, attackSprites, isRepeatedAttack, finishDelay, transitionFast = false) {
         this.sigilEffect.visible = false;
         if (this.voidTentacleFront) {
             console.log("Hide void tentacle")
             this.voidTentacleFront.visible = false;
             this.voidTentacleBack.visible = false;
             // this.setSprite('void_knight_3.png');
         }
         super.launchAttack(attackTimes, prepareSprite, preAttackSprite, attackSprites, isRepeatedAttack, finishDelay, transitionFast);
     }

     initSpriteAnim(scale) {
         super.initSpriteAnim(scale);
         this.repeatTweenBreathe();
     }

     repeatTweenBreathe(fogExpand = true) {
         if (this.dead) {
             return;
         }
         this.breatheTween = this.addTween({
             targets: this.sigilEffect,
             duration: 2000,
             alpha: 1,
             ease: 'Cubic.easeInOut',
             onComplete: () => {
                 this.breatheTween = this.addTween({
                     targets: this.sigilEffect,
                     duration: 2000,
                     alpha: 0,
                     ease: 'Cubic.easeInOut',
                     onComplete: () => {
                         this.repeatTweenBreathe(!fogExpand);
                     }
                 });
             }
         });


        let goalY = gameConsts.halfHeight - 200 + (fogExpand ? 3 : -2);
        let goalX = gameConsts.halfWidth + (fogExpand ? 40 : -40);
        let goalScaleX = 2 + (fogExpand ? 0.06 : 0);

        this.fogTween = this.addTween({
            targets: this.fogThick,
            duration: 4000,
            x: goalX,
            ease: 'Cubic.easeInOut',
        })

         this.fogTween = this.addTween({
             targets: this.fogThick,
             duration: 2000,
             y: goalY,
             alpha: 1,
             scaleX: goalScaleX,
             ease: 'Cubic.easeInOut',
             completeDelay: 200,
             onComplete: () => {
                 this.fogTween = this.addTween({
                     targets: this.fogThick,
                     duration: 1800,
                     y: goalY,
                     alpha: 0.6,
                     scaleX: goalScaleX,
                     ease: 'Cubic.easeInOut',
                     onComplete: () => {

                     }
                 })
             }
         })
     }

     repeatVoidTweenBreathe() {
         if (this.dead) {
             return;
         }
         let randRot = (Math.random() - 0.5) * 0.075;
         let randScale = this.sprite.startScale - 0.02 + Math.random() * 0.04;
         let randScale2 = this.sprite.startScale - 0.02 + Math.random() * 0.04;
         let randDur = 1000 + Math.floor(Math.random() * 500)

         this.breatheTween = this.addTween({
             targets: this.voidTentacleFront,
             duration: randDur,
             rotation: randRot,
             scaleX: randScale,
             scaleY: randScale,
             ease: 'Cubic.easeInOut',
             onComplete: () => {
                 this.repeatVoidTweenBreathe();
             }
         });

         this.breatheTween2 = this.addTween({
             delay: 200,
             targets: this.voidTentacleBack,
             duration: randDur - 200,
             scaleX: randScale2,
             scaleY: randScale2,
             ease: 'Cubic.easeInOut',
         });
     }

     setHealth(newHealth, isTrue) {
         if (this.shieldAmts > 0 && !isTrue) {
             this.damageVoidShield();
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
         }
     }

     createEyeObject(name, x, y, delay = 0) {
         let newObj = this.addImage(x, y, 'enemies', name).setRotation((Math.random() - 0.5) * 3).setScale(0).setDepth(110);
         this.eyeObjects.push(newObj);
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

    update(dt) {
         super.update(dt);
        this.eyeUpdateTick -= dt;
        if (this.eyeUpdateTick < 0) {
            this.eyeUpdateTick = 25;
            for (let i = 0; i < this.eyeShieldObjects.length; i++) {
                if (Math.random() < 0.4) {
                    let obj = this.eyeShieldObjects[i];
                    if (Math.random() < 0.1) {
                        // blink
                        this.addTween({
                            delay: Math.floor(Math.random() * 125),
                            targets: [obj.front],
                            scaleY: 0,
                            duration: 150,
                            ease: 'Cubic.easeIn',
                            onComplete: () => {
                                this.addTween({
                                    targets: [obj.front],
                                    scaleX: obj.front.startScale,
                                    scaleY: obj.front.startScale,
                                    duration: 150,
                                    ease: 'Cubic.easeOut',
                                });
                            }
                        });
                    } else {
                        let randDist = Math.random() * obj.front.startScale * 8;
                        let randRot = Math.random() * 2 * Math.PI;
                        let xPos = Math.sin(randRot) * randDist;
                        let yPos = Math.cos(randRot) * randDist;
                        let randScale = Math.random() * 0.15;
                        randScale *= randScale;
                        let newScale = obj.front.startScale - 0.04 + randScale;
                        this.addTween({
                            delay: Math.floor(Math.random() * 125),
                            targets: [obj.front],
                            x: obj.back.x + xPos,
                            y: obj.back.y + yPos,
                            scaleX: newScale,
                            scaleY: newScale,
                            duration: 400 + Math.random() * 350,
                            ease: 'Quart.easeOut',
                        });
                    }
                }
            }
        }
    }

     damageVoidShield() {
         this.shieldAmts--;
         this.shakeShieldText();
         playSound('meat_click_left', 0.4);
         playSound('meat_click_right', 0.4);
         if (this.shieldAmts <= 0) {
             messageBus.publish('animateBlockNum', gameConsts.halfWidth, this.sprite.y + 50, '-BROKE-', 1.05, {y: "+=5", ease: 'Quart.easeOut'}, {alpha: 0, scaleX: 1, scaleY: 1});
             this.clearVoidShield();
         } else {
             messageBus.publish('animateBlockNum', gameConsts.halfWidth + 75 - Math.random()*150, this.sprite.y + 50 - Math.random() * 100, 'NEGATED', 0.75, {alpha: 0.8}, {alpha: 0});

             if (this.shieldsActive == 1) {
                 this.voidShield1b.setScale(this.voidShield1b.startScale * 1.12);
                 this.addTween({
                     targets: [this.voidShield1b],
                     scaleX: this.voidShield1b.startScale,
                     scaleY: this.voidShield1b.startScale,
                     duration: 250,
                     ease: 'Cubic.easeOut',
                 });
             } else {
                 if (this.shieldAmts <= 3) {
                     if (this.voidShield2b.repeatTween) {
                         this.voidShield2b.repeatTween.stop();
                     }
                     this.addTween({
                         targets: [this.voidShield2b],
                         scaleX: this.voidShield2b.startScale * 1.2,
                         scaleY: this.voidShield2b.startScale * 1.2,
                         alpha: 0,
                         duration: 250,
                         ease: 'Cubic.easeOut',
                     });
                     this.voidShield1b.setScale(this.voidShield1b.startScale * 1.25);
                     this.addTween({
                         targets: [this.voidShield1b],
                         scaleX: this.voidShield1b.startScale,
                         scaleY: this.voidShield1b.startScale,
                         duration: 350,
                         ease: 'Cubic.easeOut',
                     });
                 } else {
                     this.voidShield2b.setScale(this.voidShield2b.startScale * 1.1);
                     this.addTween({
                         targets: [this.voidShield2b],
                         scaleX: this.voidShield2b.startScale,
                         scaleY: this.voidShield2b.startScale,
                         duration: 250,
                         ease: 'Cubic.easeOut',
                     });
                 }
             }
         }
         if (this.eyeShieldObjects.length > 0) {
             this.killEye(this.eyeShieldObjects.pop());
         }

     }

     shakeShieldText() {
         if (this.shieldAmts <= 0) {
             this.shieldText.visible = false;
         }
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
                     }
                 });
             }
         });
     }

     createVoidShield(amt, doubleShield) {
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
         playSound('void_shield');
         let distMult = 1;
         if (doubleShield) {
             distMult = 1;
             this.voidShield1b.startScale = this.voidShield1b.startScale * distMult;
         }
         this.voidShield1b.setScale(this.voidShield1b.startScale * 1.15).setAlpha(0.5);
         this.addTween({
             targets: [this.voidShield1b],
             scaleX: this.voidShield1b.startScale,
             scaleY: this.voidShield1b.startScale,
             duration: 200,
             alpha: 1,
             ease: 'Cubic.easeIn',
             onComplete: () => {
                 this.voidShield1b.repeatTween = this.addTween({
                     targets: this.voidShield1b,
                     alpha: 0.8,
                     duration: 2000,
                     scaleX: this.voidShield1b.startScale * 0.99,
                     scaleY: this.voidShield1b.startScale * 0.99,
                     yoyo: true,
                     repeat: -1,
                     ease: 'Quad.easeInOut'
                 })
             }
         });
         this.createShieldEye(this.x, this.y + 103 * distMult, 0.5);
         this.createShieldEye(this.x + 47 * distMult, this.y + 95 * distMult, 0.44);
         this.createShieldEye(this.x - 47 * distMult, this.y + 95 * distMult, 0.44);
         if (doubleShield) {
             this.voidShield2b.setScale(this.voidShield2b.startScale * 1.15).setAlpha(0.5);
             this.addTween({
                 delay: 400,
                 targets: [this.voidShield2b],
                 scaleX: this.voidShield2b.startScale * 1.01,
                 scaleY: this.voidShield2b.startScale * 1.01,
                 duration: 200,
                 alpha: 1,
                 ease: 'Cubic.easeIn',
                 onStart: () => {
                     playSound('void_shield');
                     this.voidShield2b.visible = true;
                 },
                 onComplete: () => {
                     this.voidShield2b.repeatTween = this.addTween({
                         targets: this.voidShield2b,
                         alpha: 0.8,
                         duration: 2000,
                         scaleX: this.voidShield2b.startScale * 0.99,
                         scaleY: this.voidShield2b.startScale * 0.99,
                         yoyo: true,
                         repeat: -1,
                         ease: 'Quad.easeInOut'
                     })
                 }
             });
             this.shieldsActive = 2;
             this.createShieldEye(this.x - 86, this.y + 111, 0.38);
             this.createShieldEye(this.x + 86, this.y + 111, 0.38);
             this.createShieldEye(this.x - 120, this.y + 75, 0.38);
             this.createShieldEye(this.x + 120, this.y + 75, 0.38);
         } else {
             this.shieldsActive = 1;
         }
         this.shieldAmts = amt;
     }

     killEye(obj) {
         let eyeFront = obj.front;
         let eyeBack = obj.back;
         this.addTween({
             targets: [eyeBack, eyeFront],
             scaleX: eyeBack.scaleX + 0.3,
             scaleY: eyeBack.scaleX + 0.3,
             duration: 400,
             alpha: 0,
             ease: 'Cubic.easeOut',
             onComplete: () => {
                 eyeBack.destroy();
                 eyeFront.destroy();
             }
         });
     }

     createShieldEye(x, y, scale) {
         let eyeBack = this.addImage(x, y, 'enemies', 'void_knight_shield_eye.png').setScale(scale * 0.85, scale * 0.85).setDepth(3);
         let eyeFront = this.addImage(x, y, 'enemies', 'void_knight_shield_eye_2.png').setScale(scale * 0.85, 0).setDepth(3);
         eyeBack.startScale = scale;
         eyeFront.startScale = scale;
         let eyeObj = {
             front: eyeFront,
             back: eyeBack
         }
         this.eyeShieldObjects.push(eyeObj);
         this.addTween({
             delay: 0,
             targets: [eyeBack],
             scaleX: scale,
             scaleY: scale,
             duration: 300,
             ease: 'Back.easeOut',
         });
         this.addTween({
             delay: 250,
             targets: [eyeFront],
             scaleX: scale * 0.85,
             scaleY: 0.1,
             duration: 500,
             ease: 'Back.easeOut',
             onComplete: () => {
                 this.addTween({
                     targets: [eyeFront],
                     scaleX: scale,
                     scaleY: scale,
                     duration: 500,
                     ease: 'Cubic.easeOut',
                 });
             }
         });

     }

     clearVoidShield(clearSecondShield) {
         while (this.eyeShieldObjects.length > 0) {
             this.killEye(this.eyeShieldObjects.pop());
         }
         this.shieldText.visible = false;

        if (clearSecondShield) {
            this.shieldsActive--;
            this.addTween({
                targets: [this.voidShield2b],
                scaleX: this.voidShield2b.scaleX + 0.1,
                scaleY: this.voidShield2b.scaleX + 0.1,
                duration: 300,
                ease: 'Cubic.easeOut',
                alpha: 0,
                onComplete: () => {
                    this.voidShield2b.visible = false;
                }
            });
            if (this.voidShield2b.repeatTween) {
                this.voidShield2b.repeatTween.stop();
            }
        } else {
            if (this.shieldsActive > 0) {
                this.shieldsActive = 0;
                this.addTween({
                    targets: [this.voidShield1b],
                    scaleX: this.voidShield1b.scaleX + 0.1,
                    scaleY: this.voidShield1b.scaleX + 0.1,
                    duration: 250,
                    ease: 'Cubic.easeOut',
                    alpha: 0,
                    onComplete: () => {
                        this.voidShield2b.visible = false;
                    }
                });
                if (this.voidShield1b.repeatTween) {
                    this.voidShield1b.repeatTween.stop();
                }
            }
        }
     }

     makeSlashEffect() {
         if (this.slashEffectAnim) {
             this.slashEffectAnim.stop();
         }
         let isFlipped = this.slashEffect.scaleX > 0;
         this.slashEffect.setAlpha(1.2).setScale(isFlipped ? 0.6 : -0.6, 0.54).setRotation(isFlipped ? -1.5 : 1.5);
         this.slashEffectAnim = this.addTween({
             targets: this.slashEffect,
             scaleX: isFlipped ? 1 : -1,
             scaleY: 0.9,
             duration: 250,
             ease: 'Cubic.easeOut',
             alpha: 0,
         });
     }

     pulseCircleInward(x, y) {
         this.isPulsing = true;
         if (!this.pulseCircle) {
             this.pulseCircle = this.addImage(x, y, 'misc', 'black_circle_2.png');
         }
         this.pulseCircle.setScale(1.6).setDepth(10).setAlpha(0).setPosition(x, y).setRotation(Math.random() * 6);
         this.addTween({
             delay: 500,
             targets: [this.pulseCircle],
             scaleX: 0.8,
             scaleY: 0.8,
             duration: 450,
             ease: 'Cubic.easeIn',
             alpha: 1.2,
             onComplete: () => {
                 if (this.isPulsing && !this.dead) {
                     this.nextAttack.damage += 1;
                     this.attackName.setText("|" + this.nextAttack.damage +" ");
                 }
                 this.addTween({
                     targets: [this.pulseCircle],
                     scaleX: 0,
                     scaleY: 0,
                     duration: 450,
                     alpha: 0,
                     ease: 'Cubic.easeOut',
                     completeDelay: 900,
                     onComplete: () => {
                         if (this.isPulsing && !this.dead) {
                             this.pulseCircleInward(x, y);
                         }
                     }
                 });
             }
         });
     }

     makeVoidSlashEffect(isBig) {
         let randRotMult = isBig ? 0 : 0.5;
         let randRot = (Math.random() - 0.5) * randRotMult;
         let currVoidSlashEffect = this.isFirstVoidSlash ? this.voidSlashEffect : this.voidSlashEffect2;
         this.isFirstVoidSlash = !this.isFirstVoidSlash;

         currVoidSlashEffect.x = globalObjects.player.getX() + randRot * 240;
         currVoidSlashEffect.setAlpha(1).setRotation(Math.PI * 0.5 + randRot).setScale(0.8, 0.7);
         this.slashEffectAnim = this.addTween({
             targets: currVoidSlashEffect,
             scaleX: isBig ? 2.4 : 1.7,
             scaleY: isBig ? 0.9 : 0.7,
             duration: 75,
             ease: 'Back.easeOut',
             completeDelay: isBig ? 150 : 75,
             onComplete: () => {
                 this.slashEffectAnim = this.addTween({
                     targets: currVoidSlashEffect,
                     scaleX: isBig ? 2.2 : 1.6,
                     scaleY: isBig ? 0.8 : 0.65,
                     alpha: 0,
                     duration: 200,
                     ease: 'Quart.easeIn',
                 });
             }
         });
     }

     initAttacks() {
         this.attacks = [
             [
                 // 0
                 {
                     name: "|8 ",
                     announceName: "INITIAL STRIKE",
                     desc: "The mysterious knight charges at you!",
                     chargeAmt: 400,
                     damage: 8,
                     prepareSprite: 'void_knight_pullback.png',
                     attackSprites: ['void_knight_attack.png'],
                     attackFinishFunction: () => {
                         this.currentAttackSetIndex = 1;
                         this.nextAttackIndex = 0;
                         this.makeSlashEffect();
                         playSound('sword_hit', 0.75);
                         this.sigilEffect.visible = true;
                     }
                 }
             ],
             [
                 // 1
                 {
                     name: "VOID SHIELD #3",
                     announceName: "VOID SHIELD (3)",
                     desc: "A strange protective shield surrounds the knight",
                     isPassive: true,
                     chargeAmt: 400,
                     damage: -1,
                     attackFinishFunction: () => {
                         this.createVoidShield(3);
                         this.currentAttackSetIndex = 2;
                         this.nextAttackIndex = 0;
                         this.sigilEffect.visible = true;

                         globalObjects.textPopupManager.setInfoText(gameConsts.width, gameConsts.halfHeight - 143, getLangText("shield_tut_knight"), 'right', true);
                          this.addDelay(() => {
                             this.playerSpellCastSub = messageBus.subscribe('playerCastedSpell', () => {
                                 this.playerSpellCastSub.unsubscribe();
                                 this.addTimeout(() => {
                                     globalObjects.textPopupManager.hideInfoText();
                                 }, 400);
                             });
                         }, 2000)
                     }
                 }
             ],
             [
                 // 2
                 {
                     name: "}4 ",
                     announceName: "FEINT ATTACK",
                     chargeAmt: 250,
                     damage: 4,
                     attackSprites: ['void_knight_attack.png'],
                     attackFinishFunction: () => {
                         this.makeSlashEffect();
                         playSound('void_strike_hit', 0.5);
                         playSound('sword_slice', 0.5);
                     },
                     finaleFunction: () => {
                         this.sigilEffect.visible = true;
                     }
                 },
                 {
                     name: "|6x3 ",
                     announceName: "ASSAULT",
                     chargeAmt: 500,
                     damage: 6,
                     attackTimes: 3,
                     prepareSprite: 'void_knight_pullback.png',
                     attackSprites: ['void_knight_attack.png'],
                     isBigMove: true,
                     attackFinishFunction: () => {
                         this.makeSlashEffect();
                         playSound('sword_hit', 0.7);
                     },
                     finaleFunction: () => {
                         this.sigilEffect.visible = true;
                     }
                 },
                 {
                     name: "|5 ",
                     announceName: "void strike",
                     chargeAmt: 700,
                     damage: 5,
                     chargeMult: 1.75,
                     attackSprites: ['void_knight_attack.png'],
                     startFunction: () => {
                         playSound('void_enhance', 0.5);
                         this.pulseCircleInward(this.x - 14, this.y - 39);
                         this.setDefaultSprite('void_knight_pullback.png');
                         playSound('void_body', 0.9).detune = 0;
                     },
                     attackStartFunction: () => {
                         this.isPulsing = false;
                     },
                     attackFinishFunction: () => {
                         this.makeVoidSlashEffect(true);
                         playSound('void_strike_hit', 0.9);
                         playSound('sword_hit', 0.2);
                     },
                     finaleFunction: () => {
                        this.nextAttack.damage = 5;
                         this.setDefaultSprite('void_knight.png');
                         this.sigilEffect.visible = true;
                     }
                 },
             ],
             [
                 // 3 PLACEHOLDER
                 {
                     name: "}8x3 ",
                     announceName: "ASSAULT",
                     chargeAmt: 400,
                     damage: 8,
                     attackTimes: 3,
                     prepareSprite: 'void_knight_pullback.png',
                     attackSprites: ['void_knight_attack.png'],
                     attackFinishFunction: () => {
                         this.makeSlashEffect();
                         playSound('sword_hit', 0.7);
                     }
                 },
             ],
             [
                 // 4 PLACEHOLDER
                 {
                     name: "|8x3 ",
                     announceName: "ASSAULT",
                     chargeAmt: 400,
                     damage: 8,
                     attackTimes: 3,
                     prepareSprite: 'void_knight_pullback.png',
                     attackSprites: ['void_knight_attack.png'],
                     attackFinishFunction: () => {
                         this.makeSlashEffect();
                         playSound('sword_hit', 0.7);
                     }
                 },
             ],
             [
                 // 5
                {
                     name: "VOID SHIELD #7 ",
                     announceName: "VOID SHIELD",
                     chargeAmt: 800,
                     isPassive: true,
                     chargeMult: 13,
                     prepareSprite: 'void_knight_3.png',
                     damage: -1,
                     attackFinishFunction: () => {
                         this.createVoidShield(7, true);
                     },
                     finaleFunction: () => {
                         this.voidTentacleFront.visible = true;
                         this.voidTentacleBack.visible = true;
                         this.sigilEffect.visible = true;
                         this.pullbackScale = 0.97;
                         this.attackScale = 1.08;
                     }
                 },
                {
                     name: "PREPARING... ",
                    isPassive: true,
                     chargeAmt: 400,
                     damage: -1,
                     attackStartFunction: () => {
                         this.voidTentacleFront.visible = true;
                         this.voidTentacleBack.visible = true;
                     },
                     attackFinishFunction: () => {
                         this.currentAttackSetIndex = 6;
                         this.nextAttackIndex = 0;
                         this.voidTentacleFront.visible = true;
                         this.voidTentacleBack.visible = true;
                     },
                 },

             ],
             [
                 {
                     name: "|5x2 ",
                     announceName: "ASSAIL",
                     chargeAmt: 550,
                     chargeMult: 2,
                     damage: 5,
                     attackTimes: 2,
                     prepareSprite: 'void_knight_3.png',
                     attackSprites: ['void_knight_2.png'],
                     isBigMove: true,
                     attackFinishFunction: () => {
                         this.makeVoidSlashEffect();
                         playSound('void_strike_hit');
                         playSound('void_strike', 0.15);
                     },
                     finaleFunction: () => {
                         this.voidTentacleFront.visible = true;
                         this.voidTentacleBack.visible = true;
                         this.sigilEffect.visible = true;
                     }
                 },
                 {
                     name: "|12 ",
                     announceName: "ASSAIL",
                     chargeAmt: 450,
                     chargeMult: 2,
                     damage: 12,
                     prepareSprite: 'void_knight_3.png',
                     attackSprites: ['void_knight_2.png'],
                     attackFinishFunction: () => {
                         this.makeVoidSlashEffect(true);
                         playSound('void_strike_hit');
                         playSound('void_strike', 0.4);
                     },
                     finaleFunction: () => {
                         this.voidTentacleFront.visible = true;
                         this.voidTentacleBack.visible = true;
                         this.sigilEffect.visible = true;
                     }
                 },
                 {
                     name: "|5x3 ",
                     announceName: "ASSAIL",
                     chargeAmt: 600,
                     chargeMult: 2,
                     damage: 5,
                     attackTimes: 3,
                     prepareSprite: 'void_knight_3.png',
                     attackSprites: ['void_knight_2.png'],
                     attackFinishFunction: () => {
                         this.makeVoidSlashEffect();
                         playSound('void_strike_hit');
                         playSound('void_strike', 0.15);
                     },
                     finaleFunction: () => {
                         this.voidTentacleFront.visible = true;
                         this.voidTentacleBack.visible = true;
                         this.sigilEffect.visible = true;
                     }
                 },
                 {
                     name: "|14 ",
                     announceName: "ASSAIL",
                     chargeAmt: 500,
                     chargeMult: 2,
                     damage: 14,
                     prepareSprite: 'void_knight_3.png',
                     attackSprites: ['void_knight_2.png'],
                     attackFinishFunction: () => {
                         this.makeVoidSlashEffect(true);
                         playSound('void_strike_hit');
                         playSound('void_strike', 0.4);
                     },
                     finaleFunction: () => {
                         this.voidTentacleFront.visible = true;
                         this.voidTentacleBack.visible = true;
                         this.sigilEffect.visible = true;
                     }
                 },
                 {
                     name: "|5x4 ",
                     announceName: "ASSAIL",
                     chargeAmt: 650,
                     chargeMult: 2,
                     damage: 5,
                     attackTimes: 4,
                     prepareSprite: 'void_knight_3.png',
                     attackSprites: ['void_knight_2.png'],
                     attackFinishFunction: () => {
                         this.makeVoidSlashEffect();
                         playSound('void_strike_hit');
                         playSound('void_strike', 0.15);
                     },
                     finaleFunction: () => {
                         this.voidTentacleFront.visible = true;
                         this.voidTentacleBack.visible = true;
                         this.sigilEffect.visible = true;
                     }
                 },
                 {
                     name: "|16 ",
                     announceName: "ASSAIL",
                     chargeAmt: 550,
                     chargeMult: 2,
                     damage: 16,
                     prepareSprite: 'void_knight_3.png',
                     attackSprites: ['void_knight_2.png'],
                     attackFinishFunction: () => {
                         this.makeVoidSlashEffect(true);
                         playSound('void_strike_hit');
                         playSound('void_strike', 0.4);
                     },
                     finaleFunction: () => {
                         this.voidTentacleFront.visible = true;
                         this.voidTentacleBack.visible = true;
                         this.sigilEffect.visible = true;
                     }
                 },
                 {
                     name: "ENRAGED",
                     chargeAmt: 400,
                     chargeMult: 12,
                     damage: -1,

                     transitionFast: true,
                     prepareSprite: 'void_knight_3.png',
                     startFunction: () => {
                         this.createShout();
                     },
                     finaleFunction: () => {
                         this.voidTentacleFront.visible = true;
                         this.voidTentacleBack.visible = true;
                         this.sigilEffect.visible = true;
                     }
                 },
                 {
                     name: ";5x6 ",
                     announceName: "ASSAIL",
                     chargeAmt: 950,
                     chargeMult: 2,
                     damage: 5,
                     attackTimes: 6,
                     isBigMove: true,
                     prepareSprite: 'void_knight_3.png',
                     attackSprites: ['void_knight_2.png'],
                     attackFinishFunction: () => {
                         this.makeVoidSlashEffect();
                         playSound('void_strike_hit');
                         playSound('void_strike', 0.15);
                     },
                     finaleFunction: () => {
                         this.voidTentacleFront.visible = true;
                         this.voidTentacleBack.visible = true;
                         this.sigilEffect.visible = true;
                     }
                 },
                 {
                     name: ";20 ",
                     announceName: "ASSAIL",
                     chargeAmt: 800,
                     chargeMult: 2,
                     damage: 20,
                     isBigMove: true,
                     prepareSprite: 'void_knight_3.png',
                     attackSprites: ['void_knight_2.png'],
                     attackFinishFunction: () => {
                         this.makeVoidSlashEffect(true);
                         playSound('void_strike_hit');
                         playSound('void_strike', 0.4);
                     },
                     finaleFunction: () => {
                         this.voidTentacleFront.visible = true;
                         this.voidTentacleBack.visible = true;
                         this.sigilEffect.visible = true;
                     }
                 },
             ],
         ];
     }

     startPhase2() {
         this.forceOverrideSprite = null;
         this.setDefaultSprite('void_knight_3_empty.png');
         this.sprite.setDepth(2);
         playSound('meat_click_right');
         this.setMaxHealth(gameVars.isHardMode ? 125 : 100);
         this.heal(this.healthMax);
         this.setAwake();
         this.sigilEffect.setFrame('void_knight_sigil2.png').setScale(this.sprite.startScale);
         this.repeatTweenBreathe();
         this.bgMusic = playMusic('and_into_the_void', 1, true);
         this.currentAttackSetIndex = 5;
         this.nextAttackIndex = 0;
         this.isLoading = false;

         this.shoutSprite = this.addImage(this.x, this.y + 5, 'misc', 'black_circle.png').setDepth(11).setScale(0.15);
         this.createShout();

         this.voidTentacleFront = this.addImage(this.x + 9, this.y - 56, 'enemies', 'void_knight_tent_1_front_spike.png').setDepth(3).setOrigin(0.50, 0.34).setScale(this.sprite.startScale * 0);
         let blurryBall = this.addImage(this.x, this.y - 2, 'enemies', 'blurryball.png').setDepth(0).setScale(4).setAlpha(0.6);
         this.addTween({
             targets: [blurryBall],
             scaleX: 8,
             scaleY: 8,
             duration: 1300,
             ease: 'Quart.easeOut',
         });
         this.addTween({
             targets: [blurryBall],
             alpha: 0,
             duration: 1300,
             ease: 'Cubic.easeIn',
         });

         this.addTween({
             targets: [this.voidTentacleFront],
             scaleX: this.sprite.startScale * 1.32,
             scaleY: this.sprite.startScale * 1.32,
             duration: 250,
             ease: 'Quad.easeIn',
             onComplete: () => {
                 this.addTween({
                     targets: [this.voidTentacleFront],
                     scaleX: this.sprite.startScale * 1.2,
                     scaleY: this.sprite.startScale * 1.2,
                     duration: 60,
                     ease: 'Quad.easeOut',
                     onComplete: () => {
                         this.voidTentacleFront.setFrame('void_knight_tent_1_front.png').setOrigin(0.48, 0.34).setPosition(this.x - 8, this.y - 50);
                         this.voidTentacleBack = this.addImage(this.x + 48, this.y - 15, 'enemies', 'void_knight_tent_1_back.png').setDepth(1).setScale(this.sprite.startScale * 0.2).setOrigin(0.65, 0.454);

                         this.addTween({
                             targets: [this.voidTentacleBack, this.voidTentacleFront],
                             scaleX: this.sprite.startScale,
                             scaleY: this.sprite.startScale,
                             duration: 600,
                             ease: 'Back.easeOut',
                             onComplete: () => {
                                 this.repeatVoidTweenBreathe();
                             }
                         });
                     }
                 });
             }
         });
     }

     createShout() {
         playSound('void_enhance', 0.9);
         zoomTemp(1.02);
         this.shoutSprite.setScale(0.15).setAlpha(1);
         this.addTween({
             targets: [this.shoutSprite],
             scaleX: 9,
             scaleY: 9,
             duration: 900,
             ease: 'Quad.easeOut',
         });

         if (this.fogTween) {
            this.fogTween.stop();
         }
         if (this.fogSpookTween) {
            this.fogSpookTween.stop();
         }

         this.addTween({
             targets: [this.fogThick, this.fogSpook],
             duration: 100,
             alpha: 1.1,
             ease: 'Cubic.easeOut',
             onComplete: () => {
                messageBus.publish('showCircleShadow');
                 this.addTween({
                     targets: [this.fogThick, this.fogSpook],
                     duration: 1400,
                     alpha: 0,
                     ease: 'Quad.easeOut',
                     onComplete: () => {
                        this.fogThick.visible = false;
                        this.fogSpook.visible = false;

                     }
                 })
             }
         })
         this.addTween({
             targets: [this.fogThick, this.fogSpook],
             duration: 1000,
             scaleX: 10,
             scaleY: 10,
             ease: 'Cubic.easeOut',
         })
         this.addTween({
             targets: [this.fogThick, this.fogSpook],
             duration: 1000,
             scaleX: -9,
             scaleY: 9,
             ease: 'Cubic.easeOut',
         })
         this.addTween({
             targets: [this.shoutSprite],
             alpha: 0,
             duration: 1000,
         });
     }

     animateDeathOne() {
         this.isFirstMode = false;
         this.isLoading = true;
         playSound('clunk');
         this.forceOverrideSprite = 'void_knight_3_empty.png';
         this.setSprite('void_knight_3_empty.png');

         let helmet = this.addImage(this.x + 34, this.y - 59, 'enemies', 'void_knight_helmet.png').setDepth(4);
         let arm = this.addImage(this.x + 64, this.y + 19, 'enemies', 'void_knight_arm.png').setDepth(0);
         this.addExtraSprite(helmet);
         this.addExtraSprite(arm);

         this.addTimeout(() => {
            this.fogSpook = this.addImage(gameConsts.halfWidth, gameConsts.halfHeight - 200, 'blurry', 'fogspook.png').setDepth(9).setAlpha(0).setBlendMode(Phaser.BlendModes.ADD).setOrigin(0.5, 0.25).setScale(-2, 2);
            this.fogSpookTween = this.addTween({
                targets: this.fogSpook,
                alpha: 1,
                duration: 3000,
            });
            this.addTween({
                 delay: 350,
                 targets: helmet,
                 rotation: "+=0.1",
                 x: "+=2",
                 y: "+=1",
                 duration: 50,
             });
             this.addTween({
                 delay: 950,
                 targets: helmet,
                 y: "+=190",
                 duration: 350,
                 ease: 'Cubic.easeIn',
                 onStart: () => {
                     this.voidTentaEye.visible = true;
                     this.addTween({
                         delay: 300,
                         targets: this.voidTentaEye,
                         rotation: -1,
                         ease: 'Quint.easeOut',
                         scaleX: 1.1,
                         scaleY: 1.1,
                         duration: 500,
                         onComplete: () => {
                             this.addTween({
                                 targets: this.voidTentaEye,
                                 rotation: -1.2,
                                 ease: 'Cubic.easeIn',
                                 scaleX: 0.78,
                                 scaleY: 0.78,
                                 x: "-=10",
                                 y: "+=20",
                                 duration: 400,
                                 onComplete: () => {
                                     this.voidTentaEye.y += 32;
                                     this.voidTentaEye.visible = false;
                                 }
                             })
                         }
                     })
                     this.addTween({
                         targets: helmet,
                         rotation: 0.96,
                         duration: 350,
                     });
                 },
                 onComplete: () => {
                     playSound('clunk2');
                     this.addTween({
                         delay: 500,
                         targets: [helmet, arm],
                         alpha: 0,
                         duration: 750,
                         onComplete: () => {
                             this.removeExtraSprite(helmet);
                             this.removeExtraSprite(arm);
                             helmet.destroy();
                             arm.destroy();
                             this.addTimeout(() => {
                                if (this.fogTween) {
                                this.fogTween.stop();
                                }
                                this.fogTween = this.addTween({
                                 targets: this.fogThick,
                                 duration: 1000,
                                 alpha: 1,
                                 ease: 'Cubic.easeOut',
                                })
                                 playSound('void_body').detune = 0;
                                 this.addTimeout(() => {
                                     playSound('meat_click_left');
                                     this.startPhase2();
                                 }, 400);
                             }, 1350)
                         }
                     });
                 }
             });

             this.addTween({
                 targets: arm,
                 y: "+=72",
                 duration: 300,
                 ease: 'Cubic.easeIn',
             });
             this.addTween({
                 targets: arm,
                 rotation: "+=1",
                 x: "-=7",
                 scaleX: "-=0.05",
                 scaleY: "-=0.05",
                 duration: 300,
                 onComplete: () => {
                     arm.rotation = Math.PI * 0.5
                     playSound('clunk');
                 }
             });
         }, 1500)
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
         this.isPulsing = false;
         this.interruptCurrentAttack();
         this.setAsleep();
         if (this.bgMusic) {
            this.bgMusic.stop();
         }
         this.sigilEffect.alpha = 0;
         this.breatheTween.stop();
         if (this.breatheTween2) {
             this.breatheTween2.stop();
         }
         this.clearVoidShield();

         if (this.isFirstMode) {
             this.animateDeathOne();
             this.createDeathEffect(7, 0.75, 90);

         } else {
             super.die();
             this.addTween({
                 targets: [this.voidTentacleFront, this.voidTentacleBack],
                 scaleX: 0,
                 scaleY: 0,
                 duration: 400,
                 ease: 'Cubic.easeOut',
                 onComplete: () => {
                     this.voidTentacleFront.destroy();
                     this.voidTentacleBack.destroy();
                 }
             });

             let torso = this.addImage(this.x, this.y + 21, 'enemies', 'void_knight_3_torso.png').setDepth(4).setScale(this.sprite.startScale).setOrigin(0.5, 0.5646);
             this.addTween({
                 delay: 2000,
                 targets: torso,
                 rotation: "+=1.1",
                 duration: 950,
                 ease: 'Cubic.easeIn',
             });
             this.addTween({
                 delay: 2500,
                 targets: torso,
                 y: "+=145",
                 duration: 450,
                 ease: 'Cubic.easeIn',
                 onStart: () => {
                     this.voidTentaEye.visible = true;
                     this.addTween({
                         delay: 500,
                         targets: this.voidTentaEye,
                         rotation: -1.5,
                         ease: 'Back.easeIn',
                         scaleX: 0.7,
                         scaleY: 0.7,
                         alpha: 0,
                         x: "-=10",
                         y: "+=15",
                         duration: 600,
                         onComplete: () => {
                             this.voidTentaEye.destroy();
                         }
                     })
                 },
                 onComplete: () => {
                     torso.destroy();
                     this.setDefaultSprite('void_knight_died.png', undefined, true);
                     playSound('clunk2');
                    this.addTimeout(() => {
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
                        this.graves.setDepth(1);

                        let rune = this.addImage(this.x + 22, this.y + 90, 'tutorial', 'rune_void_large.png').setScale(0.5).setDepth(9999);
                        this.flash = this.addImage(rune.x, rune.y, 'blurry', 'flash.webp').setOrigin(0.5, 0.5).setScale(this.sprite.startScale * 0.9).setDepth(-1).setRotation(0.2);

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
                        playSound('victory_2');
                        this.addTween({
                            delay: 10,
                            targets: rune,
                            x: gameConsts.halfWidth,
                            y: gameConsts.halfHeight - 180,
                            scaleX: 1,
                            scaleY: 1,
                            ease: "Cubic.easeOut",
                            duration: 1500,
                            onComplete: () => {
                                this.showVictory(rune);
                            }
                        });
                    }, 2850);
                 }
             });
             this.setDefaultSprite('void_knight_3_legs.png');
             this.createDeathEffect();
         }
     }

     createDeathEffect(amt = 12, scale = 1, vel = 100) {
         for (let i = 0; i < amt; i++) {
             let particle = this.addImage(this.x, this.y, 'enemies', 'void_knight_shield_eye.png').setDepth(0).setScale(scale * (1 + Math.random()) );
             let randDir = Math.random() * 2 * Math.PI;
             let randDist = vel + Math.random() * vel;
             let xShift = Math.sin(randDir) * randDist;
             let yShift = Math.cos(randDir) * randDist;
             let randDur = 700 + Math.random() * 700;

             this.addTween({
                 targets: particle,
                 x: "+=" + xShift,
                 y: "+=" + yShift,
                 duration: randDur,
                 ease: 'Cubic.easeOut',
             });
             this.addTween({
                 targets: particle,
                 scaleX: 0,
                 scaleY: 0,
                 duration: randDur,
                 ease: 'Quad.easeIn',
                 onComplete: () => {
                     particle.destroy();
                 }
             });
         }
     }
}
