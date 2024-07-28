 class Death2Plus extends Enemy {
     constructor(scene, x, y) {
         super(scene, x, y);
         this.initSprite('death2final.png', 0.9, 0, 0, 'deathfinal');
         this.bgMusic = playMusic('but_never_forgotten_metal', 0.9, true);
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
         this.health = 750;
         this.handObjects = [];
         this.glowHands = [];
         this.shieldScale = 1.5;
         this.shieldOffsetY = 40;
         this.shieldTextOffsetY = -65;
         this.shieldTextFont = "void";
         this.pullbackScale = 0.97;
         this.attackScale = 1.01;
     }

     initMisc() {
         this.handShieldBack = this.addImage(this.x, this.y, 'blurry', 'handshield_back.png').setScale(2.4).setDepth(-1).setAlpha(0);
         this.handShieldBack.startScale = this.handShieldBack.scaleX;
         this.handShield = this.addSprite(this.x, this.y, 'shields', 'handshield10.png').setScale(1).setDepth(3).setAlpha(0);
         this.handShield.startScale = this.handShield.scaleX;
         this.currentHandGlow = this.addImage(0, 0, 'deathfinal', 'claw_glow.png').setAlpha(0).setDepth(-1);
         this.currentHandGlowPulse = this.addImage(0, 0, 'deathfinal', 'claw.png').setAlpha(0).setDepth(-1);
    }

     beginBattleAnim() {
         this.spellStartY = this.y + 10;
         this.createGlowHands();
         this.addDelay(() => {
             this.spellCirclePulse = this.addImage(this.x, this.spellStartY, 'blurry', 'spellcircle_pulse.png').setAlpha(0.1).setScale(0.5).setDepth(-3);
             this.spellCircleGlow = this.addImage(this.x, this.spellStartY, 'blurry', 'spellcircle_bgglow.png').setAlpha(0.1).setScale(1).setDepth(-3);
             this.spellCircle = this.addImage(this.x, this.spellStartY, 'deathfinal', 'spellcircle.png').setAlpha(0.1).setScale(0.5);
             this.rotateSpellCircleTo(0, false, () => {
                 // this.fadeOutCurrentHand();
                 this.createHandShield(12);
                 globalObjects.magicCircle.enableMovement();
                 globalObjects.encyclopedia.showButton();
                 globalObjects.options.showButton();
                 this.addDelay(() => {
                     messageBus.publish("showCombatText", getLangText('deathFight2plusa'), -40);
                     this.addTimeout(() => {
                         this.spellsCastCounter = 0;
                         this.playerSpellCastSub = messageBus.subscribe('playerCastedSpell', () => {
                             this.spellsCastCounter++;
                             if (this.spellsCastCounter >= 2) {
                                 this.playerSpellCastSub.unsubscribe();
                                 messageBus.publish("closeCombatText")
                             }
                         });
                         this.addTimeout(() => {
                             messageBus.publish("closeCombatText")
                         }, 7000);
                     }, 2200)
                 }, 1500)

             });

             this.addDelay(() => {
                 this.setAwake();
             }, 4000)
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
            scaleX: 0.5,
            scaleY: 0.5,
            x: this.x,
            y: this.y,
            ease: 'Cubic.easeIn',
            duration: 500
        })
    }

    fadeMainBG(showup) {
         this.addTween({
             targets: this.bgtemp,
             alpha: showup ? 1 : 0.5,
             duration: 1000
         })
    }

     initAttacks() {
         this.attacks = [
             [
                 // 0
                 {
                     name: "OBSERVING...",
                     chargeAmt: 300,
                     finishDelay: 3000,
                     damage: 0,
                     isPassive: true,
                     startFunction: () => {
                     },
                     attackStartFunction: () => {
                         // this.fadeOutCurrentHand();
                     },
                     attackFinishFunction: () => {
                     },
                     finaleFunction: () => {

                     }
                 },
                 {
                     name: "}15x2",
                     chargeAmt: 450,
                     finishDelay: 2000,
                     damage: -1,
                     isBigMove: true,
                     startFunction: () => {
                         this.pulseHand(1);
                     },
                     attackStartFunction: () => {
                         this.fadeOutCurrentHand();
                     },
                     attackFinishFunction: () => {
                         this.fireTwoPokes(15);
                     },
                     finaleFunction: () => {

                     }
                 },
                 {
                     name: "$16",
                     chargeAmt: 600,
                     finishDelay: 2000,
                     damage: -1,
                     startFunction: () => {
                         this.pulseHand(2);
                     },
                     attackStartFunction: () => {
                         this.fadeOutCurrentHand();
                     },
                     attackFinishFunction: () => {
                     },
                     finaleFunction: () => {

                     }
                 },
                 {
                     name: ";8x3",
                     chargeAmt: 700,
                     finishDelay: 4000,
                     chargeMult: 2,
                     damage: -1,
                     startFunction: () => {
                         this.pulseHand(3);
                     },
                     attackStartFunction: () => {
                         this.currentAttackSetIndex = 1;
                         this.nextAttackIndex = 0;
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

     fireTwoPokes(damage) {
         let pokeHand = this.addImage(this.x - 180, this.y - 50, 'deathfinal', 'poke.png').setScale(0.1).setAlpha(0.65);
         let pokeHandGlow = this.addImage(this.x - 180, this.y - 50, 'deathfinal', 'poke_glow.png').setScale(0.2).setAlpha(0);

         let scaleAmt = 0.28;
         for (let i = 0; i < 2; i++) {
             let pebbles = getTempPoolObject('blurry', 'rock_rush.png', 'rockRush', 800);
             pebbles.setPosition(pokeHand.x, pokeHand.y).setAlpha(0).setScale(1);
             this.addTween({
                 delay: i * 350,
                 targets: pebbles,
                 duration: 350,
                 ease: 'Quad.easeIn',
                 scaleX: 0.15,
                 scaleY: 0.15,
                 onStart: () => {
                     playSound('matter_strike_heavy')
                 }
             })
             this.addTween({
                 delay: i * 350,
                 targets: pebbles,
                 duration: 200,
                 ease: 'Quad.easeOut',
                 alpha: 1,
                 onComplete: () => {
                     let scaleGoal = (i + 1) * scaleAmt;
                     this.addTween({
                         targets: [pokeHand],
                         duration: 150,
                         ease: 'Quad.easeIn',
                         scaleX: scaleGoal,
                         scaleY: scaleGoal,
                         onComplete: () => {
                             if (i == 1) {
                                 pokeHandGlow.setAlpha(0.8).setScale(scaleGoal * 2)
                                 this.addTween({
                                     targets: pokeHandGlow,
                                     alpha: 0,
                                     duration: 500,
                                     onComplete: () => {
                                         pokeHand.setDepth(50);
                                         this.addTween({
                                             targets: pokeHand,
                                             duration: 400,
                                             alpha: 1,
                                             ease: 'Cubic.easeOut',
                                         })
                                         this.addTween({
                                             targets: pokeHand,
                                             duration: 500,
                                             x: gameConsts.halfWidth - 15,
                                             y: globalObjects.player.getY() - 215,
                                             scaleX: 1,
                                             scaleY: 1,
                                             ease: 'Quart.easeIn',
                                             onComplete: () => {
                                                 messageBus.publish("selfTakeDamage", damage);
                                                screenShake(4);
                                                 playSound('body_slam')
                                                 let dmgEffect = poolManager.getItemFromPool('brickPattern2')
                                                 if (!dmgEffect) {
                                                     dmgEffect = this.addImage(gameConsts.halfWidth, globalObjects.player.getY() - 120, 'spells', 'brickPattern2.png').setDepth(998).setScale(0.75);
                                                 }
                                                 dmgEffect.setDepth(998).setScale(0.88).setAlpha(0.8).setPosition(gameConsts.halfWidth, globalObjects.player.getY() - 120);
                                                 this.addTween({
                                                     targets: dmgEffect,
                                                     rotation: 1,
                                                     alpha: 0,
                                                     duration: 750,
                                                 });
                                                 this.addTween({
                                                     delay: 300,
                                                     targets: pokeHand,
                                                     duration: 350,
                                                     y: globalObjects.player.getY() - 275,
                                                     ease: "Cubic.easeInOut",
                                                     scaleX: 0.85,
                                                     scaleY: 0.85,
                                                     onComplete: () => {
                                                         this.addTween({
                                                             targets: pokeHand,
                                                             duration: 400,
                                                             y: globalObjects.player.getY() - 215,
                                                             scaleX: 1,
                                                             scaleY: 1,
                                                             ease: 'Quart.easeIn',
                                                             onComplete: () => {
                                                                 messageBus.publish("selfTakeDamage", damage);
                                                                 screenShake(5);
                                                                 playSound('body_slam')
                                                                 dmgEffect.setDepth(998).setScale(1).setAlpha(0.8).setPosition(gameConsts.halfWidth, globalObjects.player.getY() - 120);
                                                                 this.addTween({
                                                                     targets: dmgEffect,
                                                                     rotation: 2.2,
                                                                     alpha: 0,
                                                                     duration: 800,
                                                                     onComplete: () => {
                                                                         poolManager.returnItemToPool(dmgEffect, 'brickPattern2');
                                                                     }
                                                                 });
                                                                 this.addTween({
                                                                     delay: 500,
                                                                     targets: pokeHand,
                                                                     duration: 400,
                                                                     y: globalObjects.player.getY() - 240,
                                                                     scaleX: 0.9,
                                                                     scaleY: 0.9,
                                                                     alpha: 0,
                                                                     ease: 'Quart.easeIn',
                                                                     onComplete: () => {
                                                                         pokeHand.destroy();
                                                                         pokeHandGlow.destroy();
                                                                     }
                                                                 })
                                                             }
                                                         })
                                                     }
                                                 })
                                             }
                                         })
                                     }
                                 })
                             }
                         }
                     })
                     this.addTween({
                         targets: pebbles,
                         duration: 150,
                         ease: 'Quad.easeOut',
                         alpha: 0,
                     })
                 }
             })
         }

     }

     pulseHand(idx) {
         let xPos = 0; let yPos = 0;
         if (idx == 0) {
            xPos = gameConsts.halfWidth - 200;
            yPos = this.y - 20;

         } else if (idx == 1) {
             xPos = gameConsts.halfWidth - 103;
             yPos = this.y - 87;
         } else if (idx == 2) {
             xPos = gameConsts.halfWidth + 103;
             yPos = this.y - 87;
         } else if (idx == 3) {
             xPos = gameConsts.halfWidth + 200;
             yPos = this.y - 20;
         }
         this.currentHandGlow.setFrame('glow_hand.png');
         this.currentHandGlowPulse.setFrame('glow_hand.png');
         this.currentHandGlow.setPosition(xPos, yPos).setAlpha(0.6).setScale(0);
         this.currentHandGlowPulse.setPosition(xPos, yPos).setAlpha(0).setScale(0.65);
         this.addTween({
             targets: this.currentHandGlow,
             scaleX: 0.65,
             scaleY: 0.65,
             duration: 1200,
             ease: 'Cubic.easeIn'
         });
         this.currentHandGlow.currAnim = this.addTween({
             targets: this.currentHandGlow,
             alpha: 0.3,
             duration: 1200,
             yoyo: true,
             repeat: -1,
             onRepeat: () => {
                 this.currentHandGlowPulse.setAlpha(0.65).setScale(0.65);
                 this.addTween({
                     targets: this.currentHandGlowPulse,
                     alpha: 0,
                     scaleX: 1.1,
                     scaleY: 1.1,
                     duration: 1500,
                 });
             }
         })
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
         // playSound('slice_in');

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
             alpha: 0.5,
             ease: "Quad.easeOut",
             duration: 1100
         })
        this.fadeMainBG(false);
         this.spellCirclePulse.setScale(0.5);
        this.spellCircleGlow.setScale(1);
        this.spellCircle.setScale(0.5);
        this.addTween({
            targets: this.spellCircleGlow,
            scaleX: 3,
            scaleY: 3,
            ease: 'Cubic.easeInOut',
            duration: isFast ? 600 : 700,
        });
        this.addTween({
            delay: 100,
            targets: this.spellCirclePulse,
            scaleX: 4.2,
            scaleY: 4.2,
            ease: 'Cubic.easeOut',
            duration: 1400,
        });
        this.addTween({
            targets: this.spellCircle,
            scaleX: 1.5,
            scaleY: 1.5,
            ease: 'Cubic.easeInOut',
            duration: isFast ? 600 : 700,
        });
        setTimeout(() => {
            playSound('ringknell');
        }, 150)
        this.addTween({
            targets: [this.spellCircle, this.spellCircleGlow, this.spellCirclePulse],
            alpha: 1,
            ease: 'Quart.easeOut',
            duration: isFast ? 500 : 550,
            onComplete: () => {
                this.addTween({
                    targets: this.spellCirclePulse,
                    alpha: 0,
                    duration: 1000,
                })
            }
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
            targets: [this.spellCircle, this.spellCircleGlow],
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
                    targets: [this.spellCircle, this.spellCircleGlow],
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
                this.addDelay(() => {
                    this.fadeMainBG(true);
                    if (onCompleteFunc) {
                        onCompleteFunc();
                    }
                }, 500);
                this.currentHandGlow.currAnim = this.addTween({
                    targets: this.currentHandGlow,
                    alpha: 0,
                    ease: 'Quad.easeOut',
                    duration: 900,
                });
            }
        })
    }
}
