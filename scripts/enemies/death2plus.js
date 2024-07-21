 class Death2Plus extends Enemy {
     constructor(scene, x, y) {
         super(scene, x, y);
         this.initSprite('death2final.png', 0.93, 0, 0, 'deathfinal');
         this.bgMusic = playMusic('but_never_forgotten_metal', 0.9, true);
         this.bgtemp2 = this.addImage(gameConsts.halfWidth, gameConsts.halfHeight, 'backgrounds', 'star2.png').setDepth(-5);
         this.bgtemp = this.addImage(gameConsts.halfWidth, gameConsts.halfHeight, 'backgrounds', 'star.png').setDepth(-5)
         this.bgBlur = this.addImage(gameConsts.halfWidth, gameConsts.halfHeight, 'backgrounds', 'star_blur.png').setDepth(-5).setScale(2);
         this.blackBG = this.addImage(gameConsts.halfWidth, gameConsts.halfHeight, 'blackPixel').setScale(500).setAlpha(0).setDepth(-2);
         // this.bgtemp.setScale(1.42);
         this.addTween({
             targets: this.bgBlur,
             alpha: 0,
             duration: 1500,
             onComplete: () => {
                 // this.addTween({
                 //     targets: this.bgtemp,
                 //     alpha: 0.7,
                 //     scaleY: 2.01,
                 //     ease: 'Quad.easeInOut',
                 //     repeat: -1,
                 //     yoyo: true,
                 //     duration: 2000,
                 // })
             }
         })
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
         })
         this.addTween({
             targets: this.whiteoutTemp,
             alpha: 0,
             duration: 540,
             ease: "Quad.easeIn"
         })
         this.addTimeout(() => {
             this.initMisc();
             this.setAsleep();
             this.repeatTweenBreathe()
             this.beginBattleAnim();
         }, 10)
     }

     initStatsCustom() {
         this.health = 110;
         this.handObjects = [];
         this.glowHands = [];
         this.shieldScale = 1.5;
         this.shieldOffsetY = 40;
         this.shieldTextOffsetY = -65;
         this.shieldTextFont = "void";
     }

     initMisc() {
         this.handShieldBack = this.addImage(this.x, this.y, 'blurry', 'handshield_back.png').setScale(2.4).setDepth(-1).setAlpha(0);
         this.handShieldBack.startScale = this.handShieldBack.scaleX;
         this.handShield = this.addSprite(this.x, this.y, 'shields', 'handshield10.png').setScale(1).setDepth(3).setAlpha(0);
         this.handShield.startScale = this.handShield.scaleX;
         this.currentHandGlow = this.addImage(0, 0, 'deathfinal', 'claw_glow.png').setAlpha(0).setDepth(3);
         this.currentHandGlowPulse = this.addImage(0, 0, 'deathfinal', 'claw.png').setAlpha(0).setDepth(3);
    }

     beginBattleAnim() {
         this.spellStartY = this.y + 10;
         this.createGlowHands();

         this.addDelay(() => {
             this.spellCircle = this.addImage(this.x, this.spellStartY, 'deathfinal', 'spellcircle.png').setAlpha(0.1).setScale(0.5);

             this.rotateSpellCircleTo(0, false, () => {
                 // this.fadeOutCurrentHand();
                 this.createHandShield(12);
                 this.addDelay(() => {
                     messageBus.publish("showCombatText", getLangText('deathFight2plusa'), -40);
                     this.addTimeout(() => {
                         this.spellsCastCounter = 0;
                         this.playerSpellCastSub = messageBus.subscribe('playerCastedSpell', () => {
                             this.spellsCastCounter++;
                             if (this.spellsCastCounter > 2) {
                                 this.playerSpellCastSub.unsubscribe();
                                 messageBus.publish("closeCombatText")
                             }
                         });
                         this.addTimeout(() => {
                             messageBus.publish("closeCombatText")
                         }, 5000);
                     }, 3000)
                 }, 1500)

             });

             this.addDelay(() => {
                 this.setAwake();
             }, 3000)
         }, 1000)
     }

     repeatTweenBreathe(duration = 1500, magnitude = 1) {
         if (this.breatheTween) {
             this.breatheTween.stop();
         }
         this.breathTween = this.addTween({
             targets: this.sprite,
             y: "+=10",
             duration: 2000,
             ease: 'Quad.easeInOut',
             repeat: -1,
             yoyo: true
         })
     }

    fadeOutCurrentHand() {
         if (this.currentHandGlow.currAnim) {
             this.currentHandGlow.currAnim.stop();
         }
        this.currentHandGlow.alpha = 1;
        this.addTween({
            targets: this.currentHandGlow,
            alpha: 0,
            duration: 400
        })
        this.currentHandGlow.currAnim = this.addTween({
            targets: this.currentHandGlow,
            scaleX: 0.25,
            scaleY: 0.25,
            x: this.x,
            y: this.y,
            ease: 'Cubic.easeIn',
            duration: 500
        })
    }

    fadeMainBG(showup) {
         this.addTween({
             targets: this.bgtemp,
             alpha: showup ? 1 : 0,
             duration: 1000
         })
    }

     initAttacks() {
         this.attacks = [
             [
                 {
                     name: "...",
                     chargeAmt: 1000,
                     finishDelay: 3000,
                     damage: 30,
                     isPassive: true,
                     startFunction: () => {
                         this.fadeMainBG(true);
                     },
                     attackStartFunction: () => {
                         this.fadeOutCurrentHand();
                     },
                     attackFinishFunction: () => {
                     },
                     finaleFunction: () => {

                     }
                 },
             ],
             [
                 {
                     name: "}44x4",
                     chargeAmt: 1200,
                     chargeMult: 2,
                     finishDelay: 3000,
                     damage: -1,
                     isBigMove: true,
                     attackStartFunction: () => {

                     },
                     finaleFunction: () => {
                     }
                 },

             ]
         ];
     }

     setHealth(newHealth, isTrue) {
        // messageBus.publish('animateBlockNum', gameConsts.halfWidth, this.sprite.y + 50, 'IMMATERIAL', 0.8, {y: "+=5", ease: 'Quart.easeOut'}, {alpha: 0, scaleX: 1.1, scaleY: 1.1});
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
             if (this.health <= 99 && this.prevHealth > 99) {
                 this.emergencyShield();
                 globalObjects.bannerTextManager.setDialog([getLangText('deathFight2plusz'), getLangText('deathFight2plusz2')]);
                 globalObjects.bannerTextManager.setPosition(gameConsts.halfWidth, gameConsts.halfHeight + 10, 0);
                 globalObjects.bannerTextManager.showBanner(0);
                 globalObjects.bannerTextManager.setOnFinishFunc(() => {
                     this.setAwake();
                 })
             }
         }
     }

     clearHandObjects() {
         for (let i = 0; i < this.handObjects.length; i++) {
             let currObj = this.handObjects[i]
         }
     }

     emergencyShield() {
         this.interruptCurrentAttack();
         this.clearHandObjects();
         playSound('slice_in');
         messageBus.publish("enemyAddShield", 999);
         this.currentAttackSetIndex = 1;
         this.nextAttackIndex = 0;
         this.setAsleep();
     }

     createHandShield(amt) {
         this.shieldText.visible = true;
         this.shieldText.setText(amt);
         this.shieldText.setScale(0.1);
         this.shieldText.startX = this.shieldText.x;
         this.shieldText.startScale = 1;
         this.scene.tweens.add({
             targets: this.shieldText,
             scaleX: this.shieldText.startScale,
             scaleY: this.shieldText.startScale,
             ease: 'Back.easeOut',
             duration: 250,
         });
         playSound('swish');
         playSound('slice_in');

         this.handShield.visible = true;
         this.handShield.setScale(this.handShield.startScale * 0.5).setAlpha(0.2);
         this.addTween({
             targets: [this.handShield],
             scaleX: this.handShield.startScale,
             scaleY: this.handShield.startScale,
             duration: 320,
             ease: 'Quart.easeIn',
             onComplete: () => {
                 playSound('stomp');
                 this.handShield.play('handShieldFull');
                 this.handShield.setScale(3);
                 this.handShield.once('animationcomplete', () => {
                     this.handShield.setScale(1);
                     this.handShield.setFrame('handshield10.png');
                 });
                 this.handShieldBack.setScale(1.9);
                 this.handShieldBack.visible = true;
                 this.handShieldBack.setAlpha(1);
                 this.addTween({
                     targets: [this.handShieldBack],
                     duration: 1300,
                     alpha: 0,
                     scaleX: this.handShieldBack.startScale,
                     scaleY: this.handShieldBack.startScale,
                     ease: 'Quad.easeOut',
                     onComplete: () => {
                         this.addTween({
                             targets: [this.handShield],
                             duration: 500,
                             alpha: 0.9,
                         });
                     }
                 });
             }
         });
         this.addTween({
             targets: [this.handShield],
             duration: 300,
             alpha: 1,
         });
         this.shieldAmts = amt;
     }

     clearHandShield() {
        this.shieldText.setVisible(false);
        this.handShield.setFrame('handshieldbroke.png');
        this.handShield.setScale(1.7).setAlpha(1);
         this.addTween({
             targets: this.handShield,
             scaleX: 1.5,
             scaleY: 1.5,
             ease: 'Cubic.easeOut',
             duration: 250,
         })
        this.addTween({
            targets: this.handShield,
            alpha: 0,
            ease: 'Cubic.easeIn',
            duration: 750,
        })
     }

     damageHandShield() {
         this.shieldAmts--;
         if (this.shieldAmts <= 0) {
             messageBus.publish('animateBlockNum', gameConsts.halfWidth, this.sprite.y + 50, '-BROKE-', 1.2, {y: "+=5", ease: 'Quart.easeOut'}, {alpha: 0, scaleX: 1.25, scaleY: 1.25, ease: 'Back.easeOut'});
             this.clearHandShield();
         } else {
             messageBus.publish('animateBlockNum', gameConsts.halfWidth + 75 - Math.random() * 150, this.sprite.y + 50 - Math.random() * 100, 'NEGATED', 0.75);
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
         }
         this.shieldText.setText(this.shieldAmts);
     }



     die() {
         super.die();
         if (this.breathTween) {
             this.breathTween.stop();
         }
         this.clearHandObjects();
         globalObjects.encyclopedia.hideButton();
         globalObjects.options.hideButton();
         globalObjects.magicCircle.disableMovement();
         this.fallAnim();
         fadeAwaySound(this.bgMusic);
     }

     fallAnim() {
         this.bgtemp.setAlpha(0.5);
         this.sprite.setRotation(-0.07);
         let deathFallTemp = this.addImage(this.sprite.x, this.y + 30, "deathfinal", 'death2fall.png').setScale(0.58).setAlpha(0).setDepth(this.sprite.depth);
         this.addTween({
             delay: 1000,
             targets: this.sprite,
             duration: 1000,
             rotation: -0.08,
             scaleX: this.sprite.startScale * 0.9,
             scaleY: this.sprite.startScale * 0.9,
             y: this.y + 25,
             ease: "Cubic.easeIn",
             onStart: () => {
                 this.addTween({
                     delay: 500,
                     targets: this.sprite,
                     ease: 'Quint.easeIn',
                     duration: 500,
                     alpha: 0,
                 })
                 this.addTween({
                     delay: 800,
                     targets: deathFallTemp,
                     duration: 600,
                     alpha: 1,
                 })
             },
             onComplete: () => {
                 this.addTween({
                     targets: deathFallTemp,
                     duration: 2000,
                     scaleX: 0.62,
                     scaleY: 0.62,
                     ease: "Cubic.easeInOut",
                     onStart: () => {
                         playSound("whoosh");
                     }
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
    }
    rotateSpellCircleTo(idx, isFast = true, onCompleteFunc) {
         let startRot = 0;
         let goalRot = 0;
         this.addTween({
             targets: this.bgtemp,
             alpha: 0,
             duration: 2000
         })
        this.fadeMainBG(false);
        this.spellCircle.setScale(0.5);
        this.addTween({
            targets: this.spellCircle,
            scaleX: 1.5,
            scaleY: 1.5,
            ease: 'Cubic.easeInOut',
            duration: isFast ? 600 : 700,
        });
        this.addTween({
            targets: this.spellCircle,
            alpha: 1,
            ease: 'Quart.easeOut',
            duration: isFast ? 500 : 550,
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
            targets: this.spellCircle,
            rotation: goalRot,
            ease: 'Quart.easeInOut',
            duration: isFast ? 2400 : 2700,
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
                    targets: this.glowHands,
                    alpha: 0,
                    ease: 'Quad.easeOut',
                    duration: 600
                });
                this.addTween({
                    targets: this.spellCircle,
                    ease: 'Cubic.easeOut',
                    alpha: 0,
                    duration: 600
                });
                let handToUse = this.glowHands[idx];
                this.currentHandGlow.setFrame(handToUse.frame.name).setAlpha(0).setScale(handToUse.scaleX + 0.1).setPosition(handToUse.x, handToUse.y);
                this.currentHandGlowPulse.setFrame(handToUse.frame.name);
                // let goalX = idx % 2 == 0 ? this.x - 200 : this.x + 200;
                // let goalY = (idx == 1 || idx == 2) ? this.y - 50 : this.y + 30;
                this.addTween({
                    targets: this.currentHandGlow,
                    ease: 'Cubic.easeInOut',
                    x: this.x,
                    y: this.y,
                    scaleX: 0.25,
                    scaleY: 0.25,
                    alpha: 0,
                    duration: 900,
                });
                this.currentHandGlow.alpha = 1;
                this.currentHandGlow.currAnim = this.addTween({
                    targets: this.currentHandGlow,
                    alpha: 0,
                    duration: 900,
                    onComplete: () => {
                        if (onCompleteFunc) {
                            onCompleteFunc();
                        }
                    }
                });
            }
        })
    }
}
