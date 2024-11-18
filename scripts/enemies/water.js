 class Water extends Enemy {
     constructor(scene, x, y, level) {
         super(scene, x, y, level);
         this.initSprite('water_emerge1.png', 1, undefined, undefined, 'water');
         this.bgMusic = playMusic('echos_of_time', 0.8, true);

         // ELEMENT_ARRAY = [RUNE_MATTER, RUNE_MIND, RUNE_MIND, null, null, null , RUNE_MATTER];

         this.popupTimeout = this.addTimeout(() => {
             this.tutorialButton = createTutorialBtn(this.level);
             this.addToDestructibles(this.tutorialButton);
         }, 3000)


         this.addSubscription("enemyOnFire", this.setOnFire.bind(this))

     }

     initStatsCustom() {
         this.health = gameVars.isHardMode ? 75 : 60;
         this.isAsleep = true;
         this.extraRepeatDelay = 230;
         this.pullbackHoldRatio = 0.9;
         this.pullbackScale = 0.86;
        // this.attackScale = 1;
         this.attackEase = "Quart.easeIn";
         this.defaultAnim = 'wateranim';
         this.accumulatedAnimDamage = 0;
         this.setDefense(999);
     }

     idleAnim(){
         if (!this.isUsingAttack && !this.dead && !this.matterHitAnim) {
             if (this.currAnim) {
                 this.currAnim.stop();
             }
             this.sprite.play(this.defaultAnim);
             this.currAnim = this.addTween({
                 targets: this.sprite,
                 ease: 'Cubic.easeOut',
                 scaleX: 1,
                 scaleY: 1,
                 duration: 300,
             });
         }
     }

     adjustDamageTaken(amt, isAttack, isTrue) {
         if (isAttack && !isTrue && !this.isUsingAttack) {
             this.matterHitAnim = true;
             this.sprite.play('waterhole');
             this.sprite.setScale(0.85);
             playSound('water2');
             this.currAnim = this.addTween({
                 targets: this.sprite,
                 scaleX: 1,
                 scaleY: 0.98,
                 ease: 'Quart.easeOut',
                 duration: 125,
                 onComplete: () => {
                     this.currAnim = this.addTween({
                         targets: this.sprite,
                         scaleX: 0.95,
                         scaleY: 0.95,
                         ease: 'Back.easeOut',
                         duration: 440,
                     })
                 }
             })

             this.addDelay(() => {
                 if (!this.isUsingAttack) {
                     if (this.currAnim) {
                         this.currAnim.stop();
                     }
                     this.currAnim = this.addTween({
                         targets: this.sprite,
                         scaleX: 0.92,
                         scaleY: 0.92,
                         ease: 'Back.easeOut',
                         duration: 200,
                     })
                     this.sprite.play('waterhole2');
                     this.addDelay(() => {
                         this.matterHitAnim = false;
                         this.idleAnim();
                     }, 150)
                 }
             }, 675)
         }
         if (amt > 10 && isAttack && !isTrue && !this.warnDamage) {
             this.warnDamage = true;
             this.addDelay(() => {
                 globalObjects.magicCircle.disableMovement();
                 globalObjects.bannerTextManager.setDialog([getLangText('level_water_nodamage'), getLangText('level_water_nodamage2')]);
                 globalObjects.bannerTextManager.setPosition(gameConsts.halfWidth, gameConsts.halfHeight + 25, 0);
                 globalObjects.bannerTextManager.showBanner(false, language === 'fr');
                 globalObjects.bannerTextManager.setOnFinishFunc(() => {
                     globalObjects.magicCircle.enableMovement();
                     // this.showEnergyTut();

                     globalObjects.bannerTextManager.setOnFinishFunc(() => {});
                     globalObjects.bannerTextManager.closeBanner();
                     this.glowCirc2 = this.addSprite(gameConsts.halfWidth, globalObjects.player.getY(), 'shields', 'ring_flash0.png').setAlpha(0.3).setDepth(999).setScale(1.12);
                     this.addDelay(() => {
                         this.glowCirc2.playReverse('ring_flash');
                         this.glowCirc2.currAnim = this.addTween({
                             targets: this.glowCirc2,
                             alpha: 1,
                             ease: 'Cubic.easeOut',
                             duration: 150,
                             scaleX: 1.35,
                             scaleY: 1.35,
                             completeDelay: 1000,
                             onComplete: () => {
                                 this.playerSpellCastSub = messageBus.subscribe('recordSpellAttack', (id, spellName) => {
                                     this.playerSpellCastSub.unsubscribe();
                                     globalObjects.textPopupManager.hideInfoText();
                                 });
                                 this.subscriptions.push(this.playerSpellCastSub);

                                 this.glowCirc2.currAnim = this.addTween({
                                     targets: this.glowCirc2,
                                     alpha: 0.3,
                                     ease: 'Cubic.easeIn',
                                     duration: 150,
                                     onComplete: () => {
                                         this.glowCirc2.setAlpha(0.6)
                                         this.glowCirc2.currAnim = this.addTween({
                                             targets: this.glowCirc2,
                                             alpha: 1,
                                             ease: 'Cubic.easeIn',
                                             scaleX: 1.12,
                                             scaleY: 1.12,
                                             duration: 200,
                                         })
                                         this.glowCirc2.play('ring_flash')
                                     }
                                 })
                             }
                         })
                     }, 400)
                     globalObjects.textPopupManager.setInfoText(gameConsts.halfWidth, gameConsts.height - 37, getLangText('level1_train_popup'), 'center');

                 });
             }, 750)

         }
         return super.adjustDamageTaken(amt, isAttack, isTrue)
     }

     splashWater(damage) {
         messageBus.publish("selfTakeDamage", damage);

         if (!this.waterSplash) {
             this.waterSplash = this.addImage(gameConsts.halfWidth, globalObjects.player.getY() - 200, 'enemies', 'water_splash.png');
         }
         this.waterSplash.setAlpha(0).setScale(0.35);
         let goalScale = 0.9 + 0.035 * damage;
         this.addTween({
             targets: this.waterSplash,
             scaleX: goalScale,
             scaleY: goalScale,
             ease: 'Cubic.easeOut',
             duration: 250,
         });
         this.addTween({
             targets: this.waterSplash,
             alpha: 0,
             duration: 250,
         });
         playSound('water2');
     }

     takeEffect(newEffect) {
         if (this.sprite) {
            if (newEffect.name === 'mindStrike' && !this.dead) {
                this.sprite.stop();
                if (this.currAnim) {
                    this.currAnim.stop();
                }
                this.isAnimating = false;
                 // let oldSprite = this.sprite.frame.name;
                 // if (oldSprite === 'gobbo_elec.png') {
                 //     oldSprite = this.defaultSprite;
                 // } else if (this.isUsingAttack) {
                 //     oldSprite = this.defaultSprite;
                 // }
                 this.setSprite('water_elec1.png');

                 this.sprite.x = gameConsts.halfWidth + (Math.random() < 0.5 ? -13 : 13);
                 this.sprite.play('waterelec');

                 this.addTween({
                     targets: this.sprite,
                     x: gameConsts.halfWidth,
                     ease: 'Bounce.easeOut',
                     easeParams: [1, 2.5],
                     duration: 300,
                     completeDelay: 200,
                     onComplete: () => {
                         this.idleAnim();
                     }
                 });
                this.sprite.setScale(1.13);
                this.currAnim = this.addTween({
                    targets: this.sprite,
                    ease: 'Cubic.easeOut',
                    scaleX: 0.85,
                    scaleY: 0.85,
                    duration: 310,
                });
            }
         }
         super.takeEffect(newEffect)
     }

     setHealth(newHealth) {
         super.setHealth(newHealth);
         let prevHealthPercent = this.prevHealth / this.healthMax;
         let currHealthPercent = this.health / this.healthMax;
         let lastHealthLost = this.prevHealth - this.health;
         if (currHealthPercent === 0) {
             // dead, can't do anything
             return;
         }
         if (this.isAsleep && currHealthPercent < 1) {
             playSound('water1');
             this.setAwake();
         }
     }

     setOnFire(duration) {
         this.defaultAnim = 'wateranimfast';

         if (!this.matterHitAnim && !this.isUsingAttack) {
             this.sprite.stop();

             this.burnAnim = this.sprite.play(this.defaultAnim);
             this.isBurning = true;

             // if (this.currDelay) {
             //     this.currDelay.stop();
             // }
             this.currDelay = this.addTween({
                 targets: this.sprite,
                 rotation: 0,
                 duration: duration * 1000 - 1000,
                 onComplete: () => {
                     this.clearMindBurn();
                 }
             });
         }

     }

     clearMindBurn() {
         if (this.burnAnim) {
             this.sprite.stop();
             this.burnAnim = null;
         }
         this.defaultAnim = 'wateranim';
         this.isBurning = false;
         if (this.dead) {
             return;
         } else {
            playSound('water1');
            this.idleAnim()
         }
     }

     initAttacks() {
         this.attacks = [
             [
                 {
                     name: "}10 ",
                     chargeAmt: gameVars.isHardMode ? 450 : 400,
                     damage: -1,
                     prepareSprite: "water_emerge1.png",
                     attackSprites: ['water_attack.png'],
                     attackFinishFunction: () => {
                         this.splashWater(10);

                     },
                     finaleFunction: () => {
                         this.idleAnim();
                     }
                 },
                 {
                     name: "}7x2 ",
                     chargeAmt: gameVars.isHardMode ? 500 : 550,
                     damage: -1,
                     attackTimes: 2,
                     isBigMove: true,
                     prepareSprite: "water_emerge1.png",
                     attackSprites: ['water_attack.png', 'water_attack2.png'],
                     attackFinishFunction: () => {
                         this.splashWater(7)
                     },
                     finaleFunction: () => {
                         this.idleAnim();
                     }
                 },
                 {
                     name: "STARE",
                     chargeAmt: 250,
                     isPassive: true,
                     startFunction: () => {
                         this.pullbackScale = 1;
                         this.attackScale = 1;
                     },
                     finaleFunction: () => {
                         this.idleAnim();
                         this.pullbackScale = 0.86;
                         this.attackScale = 1.1;
                     }
                 },
             ],
         ];
     }

     showEnergyTut() {
         this.addDelay(() => {
             this.shownTut = true;
             globalObjects.textPopupManager.setInfoText(gameConsts.width, gameConsts.halfHeight - 150, getLangText("energy_tut_goblin"), 'right');
             let runeYPos = globalObjects.textPopupManager.getBoxBottomPos();
             let centerXPos = globalObjects.textPopupManager.getCenterPos();
             let runeDepth = globalObjects.bannerTextManager.getDepth() + 1;
             this.rune3 = this.addImage(centerXPos - 32, runeYPos + 17, 'circle', 'bright_rune_mind.png').setDepth(runeDepth).setScale(0.78, 0.78).setAlpha(0);
             this.rune4 = this.addImage(centerXPos + 38, runeYPos + 17, 'circle', 'bright_rune_enhance.png').setDepth(runeDepth).setScale(0.78, 0.78).setAlpha(0);
             messageBus.publish("closeCombatText")
             this.addTween({
                 targets: [this.rune3, this.rune4],
                 scaleX: 1,
                 scaleY: 1,
                 ease: 'Quart.easeOut',
                 duration: 500,
                 onComplete: () => {
                     this.addTween({
                         targets: [this.rune3, this.rune4],
                         scaleX: 0.8,
                         scaleY: 0.8,
                         ease: 'Back.easeOut',
                         duration: 300,
                     });
                 }
             });
             this.addTween({
                 targets: [this.rune3, this.rune4],
                 alpha: 1,
                 duration: 200,
                 completeDelay: 1000,
                 onComplete: () => {
                     this.playerSpellCastSub = this.addSubscription('playerCastedSpell', () => {
                         this.playerSpellCastSub.unsubscribe();
                         this.addTimeout(() => {
                             this.addTween({
                                 targets: [this.rune3, this.rune4],
                                 alpha: 0,
                                 duration: 300,
                                 onComplete: () => {
                                     this.rune3.visible = false;
                                     this.rune4.visible = false;
                                 }
                             });
                             globalObjects.textPopupManager.hideInfoText();
                         }, 300);
                     });
                 }
             });
         }, 500)
     }

     initSpriteAnim(scale) {
         this.sprite.startX = this.sprite.x;
         this.sprite.scaleX = 1.5;
         this.sprite.scaleY = 0;
         this.sprite.alpha = 0.3;
         playSound('water1');
         this.addDelay(() => {
             this.sprite.play('wateremerge');

         }, 300)

         this.addTween({
             targets: this.sprite,
             duration: 500,
             scaleY: 1.25,
             alpha: 1.1,
             ease: 'Cubic.easeOut',
             onComplete: () => {
                 this.addTween({
                     targets: this.sprite,
                     duration: 500,
                     scaleX: 0.9,
                     scaleY: 0.9,
                     alpha: 1,
                     ease: 'Back.easeOut',
                     onComplete: () => {
                         this.repeatTweenBreathe();
                         this.idleAnim();

                     }
                 });
             }
         });
         this.addTween({
             targets: this.sprite,
             duration: 500,
             scaleX: 0.8,
             ease: 'Cubic.easeOut',
             onComplete: () => {
                 playSound('water2');

             }
         });
     }

     repeatTweenBreathe(duration = 1500, magnitude = 1, isRepeat = false) {
        if (this.dead || this.isDestroyed) {
            return;
        }
         if (this.breatheTween) {
             this.breatheTween.stop();
             this.breatheTween = null;
         }
         let horizMove = Math.ceil(3.5 * magnitude);
         let burningMult = this.isBurning ? 0.18 : 1;
         this.breatheTween = this.addTween({
             targets: this.sprite,
             duration: duration * (Math.random() * 0.5 + 1) * burningMult,
             rotation: this.isKnocked ? 0 : -0.005 * magnitude,
             x: this.sprite.startX - horizMove,
             ease: 'Cubic.easeInOut',
             completeDelay: 150,
             onComplete: () => {
                 let burningMult2 = this.isBurning ? 0.2 : 1;
                 this.breatheTween = this.addTween({
                     targets: this.sprite,
                     duration: duration * (Math.random() * 0.5 + 1) * burningMult2,
                     rotation: this.isKnocked ? 0 : 0.005 * magnitude,
                     x: this.sprite.startX + horizMove,
                     ease: 'Cubic.easeInOut',
                     completeDelay: 150,
                     onComplete: () => {
                         this.repeatTweenBreathe(duration, magnitude, true);
                     }
                 });
             }
         });
     }

     die() {
        if (this.dead) {
             return;
        }
        super.die();
        messageBus.publish("closeCombatText")
        if (this.burnAnim) {
            this.burnAnim.stop();
        }
        this.sprite.stop();
         this.isAnimating = false;
        if (this.currAnim) {
            this.currAnim.stop();
        }
        this.sprite.rotation = 0;
        if (this.accumTween) {
            this.accumTween.stop();
        }
        globalObjects.textPopupManager.hideInfoText();

        if (this.rune3) {
            this.rune3.visible = false;
            this.rune4.visible = false;
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
         globalObjects.encyclopedia.hideButton();
         globalObjects.options.hideButton();
         globalObjects.magicCircle.disableMovement();

         this.sprite.setFrame('water_emerge1.png');
         this.sprite.setRotation(0);
         this.sprite.scaleY = 1.2;
         this.addTween({
             targets: this.sprite,
             scaleY: 1,
             ease: "Back.easeOut",
             duration: 300,
             completeDelay: 50,
             onComplete: () => {
                 this.addTween({
                     targets: this.sprite,
                     scaleY: 0,
                     ease: "Quart.easeIn",
                     duration: 800,
                     onComplete: () => {
                         this.addTimeout(() => {
                             globalObjects.bannerTextManager.setDialog([getLangText('level_water_victory')]);
                             globalObjects.bannerTextManager.setPosition(gameConsts.halfWidth, gameConsts.halfHeight, 0);
                             globalObjects.bannerTextManager.showBanner(false);
                             globalObjects.bannerTextManager.setOnFinishFunc(() => {
                                 globalObjects.bannerTextManager.setOnFinishFunc(() => {});
                                 globalObjects.bannerTextManager.closeBanner();

                                 let rune = this.addImage(this.x, this.y, 'tutorial', 'rune_protect_large.png').setScale(0.5).setDepth(9999).setVisible(false);
                                 playSound('victory_2');
                                 this.addTween({
                                     targets: rune,
                                     x: gameConsts.halfWidth,
                                     y: gameConsts.halfHeight - 170,
                                     scaleX: 1,
                                     scaleY: 1,
                                     ease: "Cubic.easeOut",
                                     duration: 650,
                                     onComplete: () => {
                                         this.showVictory(rune);
                                     }
                                 });

                             });

                         }, 1200);
                     }
                 });
             }
         });
    }

     showVictory(rune) {

         let banner = this.scene.add.sprite(gameConsts.halfWidth, gameConsts.halfHeight - 35, 'misc', 'victory_banner.png').setScale(100, 1.2).setDepth(9998).setAlpha(0);
         let victoryText = this.scene.add.sprite(gameConsts.halfWidth, gameConsts.halfHeight - 44, 'misc', 'victory_text.png').setScale(0.95).setDepth(9998).setAlpha(0);
         let continueText = this.scene.add.text(gameConsts.halfWidth, gameConsts.halfHeight + 2, getLangText('cont_ui'), {fontFamily: 'garamondmax', color: '#F0F0F0', fontSize: 18}).setAlpha(0).setOrigin(0.5, 0.5).setAlign('center').setDepth(9998);

         PhaserScene.tweens.add({
             targets: banner,
             alpha: 0.75,
             duration: gameVars.gameManualSlowSpeedInverse * 500,
         });

         PhaserScene.tweens.add({
             targets: [victoryText],
             alpha: 1,
             ease: 'Quad.easeOut',
             duration: gameVars.gameManualSlowSpeedInverse * 500,
         });
         setTimeout(() => {
             continueText.alpha = 1;
         }, 1000);

         PhaserScene.tweens.add({
             targets: victoryText,
             scaleX: 1,
             scaleY: 1,
             duration: gameVars.gameManualSlowSpeedInverse * 800,
         });
         PhaserScene.tweens.add({
             targets: rune,
             y: gameConsts.halfHeight - 110,
             ease: 'Cubic.easeOut',
             duration: gameVars.gameManualSlowSpeedInverse * 400,
             completeDelay: 300,
             onComplete: () => {
                 playSound('victory');

                 if (this.dieClickBlocker) {
                     if (canvas) {
                         canvas.style.cursor = 'pointer';
                     }
                     this.dieClickBlocker.setOnMouseUpFunc(() => {
                         if (canvas) {
                             canvas.style.cursor = 'default';
                         }
                         this.dieClickBlocker.destroy();
                         PhaserScene.tweens.add({
                             targets: [victoryText, banner],
                             alpha: 0,
                             duration: gameVars.gameManualSlowSpeedInverse * 400,
                             onComplete: () => {
                                 victoryText.destroy();
                                 banner.destroy();
                                this.showPostFightMessage();
                             }
                         });
                         continueText.destroy();
                         rune.destroy();

                     })
                 } else {
                     let clickBlocker = createGlobalClickBlocker(true);
                     clickBlocker.setOnMouseUpFunc(() => {
                         hideGlobalClickBlocker();
                         PhaserScene.tweens.add({
                             targets: [victoryText, banner],
                             alpha: 0,
                             duration: gameVars.gameManualSlowSpeedInverse * 400,
                             onComplete: () => {
                                 victoryText.destroy();
                                 banner.destroy();
                                 this.showPostFightMessage();

                             }
                         });
                         continueText.destroy();
                         rune.destroy();

                     });
                 }
             }
         });
     }

     showPostFightMessage() {
        beginPreLevel(this.level + 1)
     }

}
