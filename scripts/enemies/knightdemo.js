 class KnightDemo extends Enemy {
     constructor(scene, x, y, level) {
         super(scene, x, y, level);
         this.initSprite('void_knight.png', 1);// 0.7
         this.sprite.setOrigin(0.5, 0.5); // 0.9
         // this.bgMusic = playMusic('into_the_void', 0.8, true);
         this.invincible = true;
         this.initMisc();
         this.addTimeout(() => {
            this.initFog();
            this.setAsleep();
             this.bgMusic = playMusic('wind', 0.01, true);
             fadeInSound(this.bgMusic, 0.7, 1700);
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
         }, 750)

     }

     initStatsCustom() {
         this.health = 160;
         this.eyeObjects = [];
         this.isFirstMode = true;
         this.shieldAmts = 0;
         this.shieldTextFont = "void";
         this.shieldsActive = 0;
         this.eyeShieldObjects = [];
         this.eyeUpdateTick = 30;
         this.lastAttackLingerMult = 1.2;
         this.slashEffect = this.addImage(globalObjects.player.getX(), globalObjects.player.getY() - 55, 'misc', 'slash1.png').setScale(0.9).setDepth(995).setAlpha(0);
         this.voidSlashEffect = this.addImage(globalObjects.player.getX(), globalObjects.player.getY() - 260, 'spells', 'darkSlice.png').setScale(0.8).setDepth(995).setAlpha(0).setOrigin(0.15, 0.5);
        this.isFirstVoidSlash = true;
         this.shieldTextOffsetY = -20;
         this.shieldTextSize = 52;


     }

     initMisc() {
         this.sigilEffect = this.addImage(this.x, this.y, 'enemies', 'void_knight_sigil.png').setScale(this.sprite.startScale).setDepth(5).setAlpha(0);
         this.shieldExtraText = this.addBitmapText(gameConsts.halfWidth, this.y + this.shieldTextOffsetY + 24, 'void', 'SHIELDED', 52).setOrigin(0.5).setDepth(18).setVisible(false);

     }

     initFog() {
        this.fogThick = this.addImage(gameConsts.halfWidth, gameConsts.halfHeight - 185, 'blurry', 'fogthick.png').setDepth(9).setAlpha(0).setOrigin(0.5, 0.25).setScale(2);

        this.addTween({
             targets: [this.fogThick],
             duration: 500,
             alpha: 1,
             scaleX: 2,
             ease: 'Cubic.easeInOut',
         });
     }

     initSpriteAnim(scale) {
         super.initSpriteAnim(scale);
         this.repeatTweenBreathe();
         this.healthBarText.setText("???");
         this.healthBarCurr.setFrame('purple_pixel.png');
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


        let goalY = gameConsts.halfHeight - 185 + (fogExpand ? 3 : -2);
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

     setHealth(newHealth, isTrue) {
         let prevHealthPercent = this.prevHealth / this.healthMax;
         let currHealthPercent = this.health / this.healthMax;
         if (currHealthPercent < 0.999) {

         } else {
             super.setHealth(newHealth, isTrue);
             this.healthBarText.setText("???");
             fadeAwaySound(this.bgMusic, 1900);
             this.moveTowardsPlayer();
         }
     }

     moveTowardsPlayer() {

         playSound('void_shield');
         this.breatheTween.stop();
         this.addTween({
             targets: this.sigilEffect,
             duration: 1000,
             alpha: 0,
             ease: 'Cubic.easeInOut',
             onComplete: () => {
                 this.bgMusic2 = playMusic('deepdemon', 0.01, true);
                 fadeInSound(this.bgMusic2, 0.85, 2500);
                 playSound('void_body', 0.2);
                 this.createShieldEye(this.x + 12, this.y - 84, 0.4, 'meat_click_right');
                 this.addDelay(() => {
                     this.createShieldEye(this.x - 47, this.y - 45, 0.7, 'meat_click_left', true);
                 }, 1500);
                 this.addDelay(() => {
                     this.createShieldEye(this.x + 29, this.y - 34, 0.9, 'meat_click_right', true);
                 }, 1900);
                 this.addDelay(() => {
                     this.createShieldEye(this.x - 74, this.y + 2, 0.31, 'meat_click_left', true);
                 }, 2200);
                 this.addDelay(() => {
                     this.createShieldEye(this.x - 20, this.y - 8, 0.4, undefined, true);
                 }, 2500);
                 this.addDelay(() => {
                     let eyeBack = this.addImage(gameConsts.halfWidth, this.y - 40, 'enemies', 'void_knight_shield_eye.png').setScale(5, 0).setAlpha(0).setDepth(-1);
                     let eyeFront = this.addImage(gameConsts.halfWidth, this.y - 40, 'enemies', 'void_knight_shield_eye_2.png').setScale(5, 0).setAlpha(0).setDepth(-1);
                     this.addTween({
                         targets: [eyeBack],
                         scaleX: 5,
                         scaleY: 1,
                         alpha: 0.4,
                         duration: 300,
                         ease: 'Back.easeOut',
                         onComplete: () => {
                             this.addTween({
                                 targets: [eyeBack],
                                 scaleX: 6,
                                 scaleY: 5.5,
                                 alpha: 0.8,
                                 duration: 550,
                                 ease: 'Cubic.easeIn',
                             });
                         }
                     });
                     this.addTween({
                         targets: [eyeFront],
                         scaleX: 5,
                         scaleY: 1,
                         alpha: 0.4,
                         duration: 310,
                         ease: 'Back.easeOut',
                         onComplete: () => {
                             setTimeout(() => {
                                 playSound('void_enhance', 0.7).detune = -1200;
                             }, 400);
                             this.addTween({
                                 targets: [eyeFront],
                                 scaleX: 6,
                                 scaleY: 5.5,
                                 alpha: 0.8,
                                 duration: 600,
                                 ease: 'Quart.easeIn',
                                 onComplete: () => {
                                     globalObjects.magicCircle.disableMovement();
                                     globalObjects.encyclopedia.hideButton();
                                     globalObjects.options.hideButton();
                                     this.addTween({
                                         targets: [eyeFront],
                                         alpha: 0,
                                         scaleX: 20,
                                         scaleY: 20,
                                         duration: 600,
                                         ease: 'Cubic.easeOut',
                                     });
                                     eyeBack.setScale(20);
                                     this.addTween({
                                         targets: [eyeBack],
                                         alpha: 0.5,
                                         scaleX: 15,
                                         scaleY: 15,
                                         duration: 600,
                                         ease: 'Cubic.easeOut',
                                         onComplete: () => {
                                            this.advanceTowardsPlayer(eyeBack);
                                         }
                                     });
                                 }
                             });
                         }
                     });
                 }, 3000);
             }
         });
     }

     advanceTowardsPlayer(backImage) {
         if (this.fogTween) {
             this.fogTween.stop();
         }
         this.addTween({
             targets: this.fogThick,
             alpha: 0,
             ease: 'Cubic.easeIn',
             scaleX: 3.5,
             scaleY: 3.5,
             duration: 3500,
         });
         setTimeout(() => {
             playFakeBGMusic('zoomin');
         }, 500)
         this.addTween({
             targets: backImage,
             alpha: 1,
             duration: 8500,
         });
         this.addTween({
             targets: backImage,
             scaleX: 25,
             scaleY: 25,
             ease: 'Quad.easeIn',
             duration: 8500,
         });
         let startScale = this.sprite.scaleX;
         this.addTween({
             targets: this.sprite,
             scaleX: startScale * 2,
             scaleY: startScale * 2,
             duration: 8000,
             y: "+=80",
             ease: 'Quad.easeIn'
         })
         for (let i in this.eyeShieldObjects) {
            let obj1 = this.eyeShieldObjects[i].front;
            let obj2 = this.eyeShieldObjects[i].back;
            let xOffset = obj1.x - this.x;
             let yOffset = obj1.y - this.y + 80;
             let startScale = obj1.scaleX;
             this.addTween({
                 targets: [obj1, obj2],
                 duration: 8000,
                 scaleX: startScale * 2,
                 scaleY: startScale * 2,
                 x: "+=" + xOffset,
                 y: "+=" + yOffset,
                 ease: 'Quad.easeIn'
             });
         }
     }

     createShieldEye(x, y, scale = 1, sfx = 'meat_click_left', isFast = false) {
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
             targets: [eyeBack],
             scaleX: scale,
             scaleY: scale,
             duration: 300,
             ease: 'Back.easeOut',
         });
         if (isFast) {
             this.addTween({
                 targets: [eyeFront],
                 scaleX: scale,
                 scaleY: scale,
                 duration: 500,
                 ease: 'Cubic.easeOut',
             });
             setTimeout(() => {
                 playSound(sfx, scale * 0.5 + 0.25).detune = 600 - 1000 * scale;
             }, 100)
         } else {
             this.addTween({
                 delay: 250,
                 targets: [eyeFront],
                 scaleX: scale * 0.85,
                 scaleY: 0.1,
                 duration: 500,
                 ease: 'Back.easeOut',
                 onStart: () => {
                     playSound(sfx, scale * 0.5 + 0.25).detune = 600 - 1000 * scale;
                 },
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


     initAttacks() {
         this.attacks = [
             [
                 {
                     name: gameVars.isHardMode ? "|10" : "|8",
                     announceName: "INITIAL STRIKE",
                     desc: "The mysterious knight charges at you!",
                     chargeAmt: 400,
                     damage: gameVars.isHardMode ? 10 : 8,
                     attackStartFunction: () => {
                         playSound('slice_in', 0.6);
                     },
                     attackFinishFunction: () => {
                         this.currentAttackSetIndex = 1;
                         this.nextAttackIndex = 0;
                         playSound('sword_hit', 0.75);
                         this.sigilEffect.visible = true;
                     }
                 }
             ],
         ];
     }

     die() {
        if (this.dead) {
            return;
        }

     }

}
