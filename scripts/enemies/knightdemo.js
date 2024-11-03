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
                 this.playerSpellCastSub = this.addSubscription('playerCastedSpell', () => {
                     this.playerSpellCastSub.unsubscribe();
                     messageBus.publish("closeCombatText");
                 });
             }, 200)
         }, 750)

     }

     initStatsCustom() {
         this.health = 150;
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

     setHealth(newHealth, isTrue) {
         let prevHealthPercent = this.prevHealth / this.healthMax;
         let currHealthPercent = this.health / this.healthMax;
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
