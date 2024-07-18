 class Goblin extends Enemy {
     constructor(scene, x, y, level) {
         super(scene, x, y, level);
         this.initSprite('gobbo0.png', 0.92);
         this.bgMusic = playMusic('bite_down', 0.7, true);
         this.shieldAdded = false;

         // ELEMENT_ARRAY = [RUNE_MATTER, RUNE_MIND, RUNE_MIND, null, null, null , RUNE_MATTER];

         this.popupTimeout = this.addTimeout(() => {
             this.tutorialButton = createTutorialBtn(this.level);
             this.addToDestructibles(this.tutorialButton);
         }, 3500)
         messageBus.subscribe("clearMindBurn", this.clearMindBurn.bind(this))

     }

     initStatsCustom() {
         this.health = gameVars.isHardMode ? 180 : 110;
         this.slashEffect = this.addImage(globalObjects.player.getX(), globalObjects.player.getY() - 25, 'misc', 'slash1.png').setScale(0.9).setDepth(130).setAlpha(0);
        this.pullbackScale = 0.88;
        this.attackScale = 1.22;
        this.isAnimating = false;
         this.attackEase = "Quart.easeIn";
     }

     // update(dt) {}
     clearMindBurn() {
         if (this.burnAnim) {
             this.burnAnim.stop();
         }
         this.isBurning = false;
         if (this.dead) {
             return;
         } else {
             if (!this.isAnimating) {
                 let oldSprite = this.sprite.frame.name;
                 if (this.goblinBeingShocked) {
                     oldSprite = this.defaultSprite;
                 } else if (this.isUsingAttack) {
                     oldSprite = this.defaultSprite;
                 }
                 this.setSprite('gobbo_extinguish1.png');
                 this.sprite.play('gobboextinguish');
                 this.isAnimating = true;

                 this.sprite.once('animationcomplete', () => {
                     this.isAnimating = false;
                     this.setSpriteIfNotInactive(oldSprite);
                 });
                 playSound('goblin_grunt', 0.4).detune = 500;
             }

             this.sprite.x = gameConsts.halfWidth + (Math.random() < 0.5 ? 15 : -15);
             this.addTween({
                 targets: this.sprite,
                 x: gameConsts.halfWidth,
                 ease: 'Bounce.easeOut',
                 duration: 800
             })
         }
     }

     takeEffect(newEffect) {
         if (this.sprite) {
            if (newEffect.name == 'mindStrike' && this.shield <= 0) {
                this.sprite.stop();
                 let oldSprite = this.sprite.frame.name;
                 if (oldSprite === 'gobbo_elec.png') {
                     oldSprite = this.defaultSprite;
                 } else if (this.isUsingAttack) {
                     oldSprite = this.defaultSprite;
                 }
                 this.setSprite('gobbo_elec1.png');
                 this.sprite.x = gameConsts.halfWidth + (Math.random() < 0.5 ? -13 : 13);
                this.goblinBeingShocked = true;
                 this.sprite.play('gobboshock')
                 this.addTween({
                     targets: this.sprite,
                     x: gameConsts.halfWidth,
                     ease: 'Bounce.easeOut',
                     easeParams: [1, 2.5],
                     duration: 260,
                 });
                 this.sprite.once('animationcomplete', () => {
                     this.setSpriteIfNotInactive(oldSprite);
                     this.goblinBeingShocked = false;
                 })
            } else if (this.shield >= 1 && newEffect.name == 'mindBurn') {
                this.sprite.stop();
                this.burnAnim = this.sprite.play('gobboshieldfire');
                this.isBurning = true;
            }
         }
         super.takeEffect(newEffect)
         this.statuses[newEffect.name] = newEffect;
     }

     setHealth(newHealth) {
         super.setHealth(newHealth);
         let prevHealthPercent = this.prevHealth / this.healthMax;
         let currHealthPercent = this.health / this.healthMax;
         if (currHealthPercent == 0) {
             // dead, can't do anything
             return;
         }
         if (prevHealthPercent >= 0.99) {
             if (currHealthPercent < 0.99) {
                 this.currentAttackSetIndex = 1;
                 this.nextAttackIndex = 0;
                 // Going to shield
             }
         }
         if (this.shieldAdded && this.currentAttackSetIndex == 2) {
             if (this.shield == 0) {
                 // shield must have broke
                 if (this.breatheTween) {
                     this.breatheTween.stop();
                 }
                 this.setDefaultSprite('gobbo2.png', 0.92);
                 this.interruptCurrentAttack();
                 this.currentAttackSetIndex = 3;
                 this.nextAttackIndex = 0;
                 playSound('goblin_grunt').detune = 0;
                 playSound('clunk');
             }
         }
     }

     initAttacks() {
         this.attacks = [
             [
                 // 0
                 {
                     name: gameVars.isHardMode ? "}8 " : "}4 ",
                     desc: "The goblin waves his\nlittle knife in front\nof your face",
                     chargeAmt: 455,
                     damage: gameVars.isHardMode ? 8 : 4,
                     attackSprites: ['gobbo0_atk.png'],
                     attackFinishFunction: () => {
                         this.makeSlashEffect();
                         playSound('sword_hit', 0.75);
                     }
                 }
             ],
             [
                 // 1
                 {
                     name: gameVars.isHardMode ? "FANCY SHIELD {50 " : "FANCY SHIELD {40 ",
                     block: gameVars.isHardMode ? 50 : 40,
                     isPassive: true,
                     customCall: " ",
                     chargeAmt: 300,
                    transitionFast: true,
                     startFunction: () => {
                        this.attackScale = 1;
                     },
                     attackStartFunction: () => {
                         playSound('clunk');
                         let shinePattern = getTempPoolObject('spells', 'brickPattern2.png', 'brickPattern', 700);
                         shinePattern.setPosition(this.x, this.y).setScale(0.8).setDepth(-1).setAlpha(0.5);
                         this.addTween({
                             targets: shinePattern,
                             scaleX: 0.85,
                             scaleY: 0.85,
                             duration: 700,
                             ease: 'Cubic.easeOut'
                         });
                         this.addTween({
                             targets: shinePattern,
                             alpha: 0,
                             ease: 'Cubic.easeIn',
                             duration: 700,
                         });

                         this.setDefaultSprite('gobboshield1.png', 0.92).play('gobboshield');
                         this.shieldAdded = true;
                     },
                     attackFinishFunction: () => {
                         this.currentAttackSetIndex = 2;
                         this.nextAttackIndex = 0;
                         let runeDepth = globalObjects.bannerTextManager.getDepth() + 1;
                         this.addTimeout(() => {
                             globalObjects.textPopupManager.setInfoText(gameConsts.width, gameConsts.halfHeight - 80, getLangText("energy_tut_goblin"), 'right');
                             let runeYPos = globalObjects.textPopupManager.getBoxBottomPos();
                             let centerXPos = globalObjects.textPopupManager.getCenterPos();
                             this.rune3 = this.addImage(centerXPos - 32, runeYPos + 28, 'circle', 'rune_mind_glow.png').setDepth(runeDepth).setScale(0.78, 0.78).setAlpha(0);
                             this.rune4 = this.addImage(centerXPos + 38, runeYPos + 28, 'circle', 'rune_enhance_glow.png').setDepth(runeDepth).setScale(0.78, 0.78).setAlpha(0);
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
                                    this.playerSpellCastSub = messageBus.subscribe('playerCastedSpell', () => {
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
                 }
             ],
             [
                 // 2 - attacks from behind shield
                 {
                     name: gameVars.isHardMode ? "}12 " : "}6 ",
                     desc: "Goblin rams you with\nhis shield",
                     chargeAmt: 600,
                     damage: gameVars.isHardMode ? 12 : 6,
                     startFunction: () => {
                        this.pullbackScale = 0.85;
                        this.attackScale = 1.3;
                     },
                     attackFinishFunction: () => {
                         playSound('body_slam')
                         let dmgEffect = getTempPoolObject('spells', 'damageEffect1.png', 'damageEffect1', 450);
                         dmgEffect.setPosition(gameConsts.halfWidth + (Math.random() - 0.5) * 20, globalObjects.player.getY() - 185).setDepth(998).setScale(1.35)
                     }
                 },
             ],
             [
                 // 3
                 {
                     name: "MY SHIELD!",
                     isPassive: true,
                     chargeAmt: 350,
                     chargeMult: 5,
                     customCall: " ",
                     damage: 0
                 },
                 {
                     name: "GETTING KNIVES!",
                     isPassive: true,
                     chargeAmt: 300,
                     chargeMult: 5,
                     isBigMove: true,
                     startFunction: () => {
                        this.pullbackScale = 0.88;
                        this.attackScale = 1.18;
                         this.setDefaultSprite('gobbo3.png', 0.92);
                     },
                     attackFinishFunction: () => {
                         playSound('goblin_aha');
                         this.currentAttackSetIndex = 4;
                         this.nextAttackIndex = 0;
                         this.setDefaultSprite('gobbo4.png', 0.92);
                         let oldScale = this.sprite.scaleX;
                         this.sprite.setScale(this.sprite.scaleX * 1.01);
                         this.currAnim = this.addTween({
                             targets: this.sprite,
                             scaleX: oldScale,
                             scaleY: oldScale,
                             duration: 600,
                             completeDelay: 100,
                             onComplete: () => {
                                 this.setDefaultSprite('gobbo5.png', 0.92);
                                 this.repeatTweenBreathe(800, 0.5)
                             }
                         });
                     }
                 }
             ],
             [
                 // 4 - dual wield attacks
                 {
                     name: "}4x2 ",
                     chargeAmt: gameVars.isHardMode ? 150 : 200,
                     damage: 4,
                     attackTimes: 2,
                     prepareSprite: "",
                     attackSprites: ['gobboAttack1.png', 'gobboAttack2.png'],
                     attackFinishFunction: () => {
                         this.makeSlashEffect();
                     }
                 },
                 {
                     name: "}4x3 ",
                     chargeAmt: gameVars.isHardMode ? 170 : 220,
                     damage: 4,
                     attackTimes: 3,
                     attackSprites: ['gobboAttack1.png', 'gobboAttack2.png'],
                     attackFinishFunction: () => {
                         this.makeSlashEffect();
                     }
                 },
                 {
                     name: "}4x4 ",
                     chargeAmt: gameVars.isHardMode ? 190 : 240,
                     damage: 4,
                     attackTimes: 4,
                     attackSprites: ['gobboAttack1.png', 'gobboAttack2.png'],
                     attackFinishFunction: () => {
                         this.makeSlashEffect();
                     }
                 },
                 {
                     name: "}4x5 ",
                     chargeAmt: gameVars.isHardMode ? 210 : 260,
                     damage: 4,
                     attackTimes: 5,
                     attackSprites: ['gobboAttack1.png', 'gobboAttack2.png'],
                     attackFinishFunction: () => {
                         this.makeSlashEffect();
                     }
                 },
                 {
                     name: "LAUGH IN YOUR FACE",
                     isPassive: true,
                     chargeAmt: 600,
                     chargeMult: 5,
                     damage: -1,
                     tease: true,
                     attackSprites: ['gobbo4.png'],
                     attackFinishFunction: () => {
                         playSound('goblin_aha');
                     }
                 }
             ],
         ];
     }

     makeSlashEffect() {
         playSound('sword_slice', 0.7);
         if (this.slashEffectAnim) {
             this.slashEffectAnim.stop();
         }
         let isFlipped = this.slashEffect.scaleX > 0;
         this.slashEffect.setAlpha(1).setScale(isFlipped ? -0.5 : 0.5, 0.4);
         this.slashEffectAnim = this.addTween({
             targets: this.slashEffect,
             scaleX: isFlipped ? -1 : 1,
             scaleY: 0.6,
             duration: 250,
             ease: 'Cubic.easeOut',
             alpha: 0,
         });
     }

     initSpriteAnim(scale) {
         super.initSpriteAnim(scale);
         this.sprite.startX = this.sprite.x;
         this.sprite.x = gameConsts.halfWidth + 150;
         this.sprite.setRotation(0.05);
         this.addTween({
             targets: this.sprite,
             rotation: -0.05,
             duration: 150,
             yoyo: true,
             completeDelay: 20,
             onComplete: () => {
                 this.addTween({
                     targets: this.sprite,
                     rotation: -0.05,
                     duration: 180,
                     yoyo: true,
                     completeDelay: 20,
                     onComplete: () => {
                         this.addTween({
                             targets: this.sprite,
                             rotation: -0.05,
                             duration: 210,
                             completeDelay: 20,
                             onComplete: () => {
                                 this.addTween({
                                     targets: this.sprite,
                                     rotation: 0,
                                     ease: 'Quad.easeOut',
                                     duration: 250,
                                     onComplete: () => {
                                         this.repeatTweenBreathe();
                                     }
                                 });
                             }
                         });
                     }
                 });
             }
         });
         this.addTween({
             targets: this.sprite,
             x: this.sprite.startX,
             duration: 1350,
             ease: 'Cubic.easeOut',
         });
     }

     repeatTweenBreathe(duration = 1500, magnitude = 1) {
        if (this.dead || this.isDestroyed) {
            return;
        }
         if (this.breatheTween) {
             this.breatheTween.stop();
         }
         let horizMove = Math.ceil(3.5 * magnitude);
         let burningMult = this.isBurning ? 0.18 : 1;
         this.breatheTween = this.addTween({
             targets: this.sprite,
             duration: duration * (Math.random() * 0.5 + 1) * burningMult,
             rotation: -0.02 * magnitude,
             x: this.sprite.startX - horizMove,
             ease: 'Cubic.easeInOut',
             completeDelay: 150,
             onComplete: () => {
                 let burningMult2 = this.isBurning ? 0.2 : 1;
                 this.breatheTween = this.addTween({
                     targets: this.sprite,
                     duration: duration * (Math.random() * 0.5 + 1) * burningMult2,
                     rotation: 0.02 * magnitude,
                     x: this.sprite.startX + horizMove,
                     ease: 'Cubic.easeInOut',
                     completeDelay: 150,
                     onComplete: () => {
                         this.repeatTweenBreathe(duration, magnitude);
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
        if (this.burnAnim) {
            this.burnAnim.stop();
        }
        if (this.currAnim) {
            this.currAnim.stop();
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

         this.addTween({
             targets: this.sprite,
             rotation: -0.2,
             ease: "Cubic.easeIn",
             duration: 25,
             onComplete: () => {
                 playSound('goblin_grunt').detune = 0;
                 this.setDefaultSprite('gobboDead.png');
                 this.sprite.setRotation(0);
                 this.x -= 5;
                 this.y += 48;
                 this.addTimeout(() => {
                     this.showFlash(this.x, this.y);
                    this.addTimeout(() => {
                        let rune = this.addImage(this.x, this.y, 'tutorial', 'rune_protect_large.png').setScale(0.5).setDepth(9999);
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
         });

     }

}
