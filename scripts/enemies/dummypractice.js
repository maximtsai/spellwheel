 class Dummypractice extends Enemy {
    constructor(scene, x, y, level) {
        super(scene, x, y, level);
        this.shieldOffsetY = -100;
        this.initSprite('dummy_paper.png', 1, 0, 5, 'dummyenemy');
        globalObjects.encyclopedia.showButton();
        globalObjects.options.showButton();
        // this.playerSpellCastSub = messageBus.subscribe('playerCastedSpell', () => {
        //     if (globalObjects.player.getPlayerCastSpellsCount() === 1) {
        //         // this.initTutorial2();
        //     } else if (globalObjects.player.getPlayerCastSpellsCount() > 1 && this.canHideStartTut) {
        //         this.playerSpellCastSub.unsubscribe();
        //         this.initTutorial3();
        //     } else if (globalObjects.player.getPlayerCastSpellsCount() > 3) {
        //         this.playerSpellCastSub.unsubscribe();
        //         this.initTutorial3();
        //     }
        // });
        // let spellHoverListener = messageBus.subscribe('spellNameTextUpdate', (text) => {
        //     if (!globalObjects.magicCircle.innerDragDisabled && text.includes('STRONGER')) {
        //         this.canHideStartTut = true;
        //         spellHoverListener.unsubscribe();
        //     }
        // });
        this.addTimeout(() => {
            this.initTutorial();
        }, 50)
        // this.popupTimeout = this.addTimeout(() => {
        //     this.tutorialButton = createTutorialBtn(this.level);
        //     this.addToDestructibles(this.tutorialButton);
        // }, 3500)
    }

     initStatsCustom() {
         this.health = 100;
         this.isAsleep = true;
        this.attackScale = 1;
        this.pullbackScale = 1;
        this.damageCanEmit = true;
     }

     showPoster(startImg = 'dummy_paper_hit.png', finalRot = 0) {
         this.poster = this.addSprite(this.sprite.x, this.sprite.y, 'dummyenemy', startImg).setDepth(this.sprite.depth - 1).setScale(this.sprite.startScale*0.1);
         this.poster.setRotation(-0.7);
         this.addExtraSprite(this.poster);
         this.addTween({
             delay: 100,
             targets: this.poster,
             scaleX: this.sprite.startScale,
             scaleY: this.sprite.startScale,
             duration: 500,
             onComplete: () => {
                 // this.addTween({
                 //     targets: this.poster,
                 //     scaleX: this.sprite.startScale,
                 //     scaleY: this.sprite.startScale,
                 //     rotation: finalRot,
                 //     ease: 'Bounce.easeOut',
                 //     duration: 400
                 // })
             }
         })
         this.addTween({
             delay: 100,
             targets: this.poster,
             rotation: 0,
             ease: 'Quint.easeIn',
             duration: 500,
             onComplete: () => {
                 playSound('boing');
                 this.addTween({
                     targets: this.poster,
                     rotation: -0.2,
                     ease: 'Quart.easeOut',
                     duration: 100,
                     onComplete: () => {
                         this.addTween({
                             targets: this.poster,
                             rotation: -0.02,
                             ease: 'Bounce.easeOut',
                             duration: 260,

                         })
                     }
                 })
             }
         })
     }

     hidePosterFast() {
         if (!this.poster) {
             return;
         }

         playSound('balloon', 0.4);
         let currScale = this.poster.scaleX;
         this.addTween({
             targets: this.poster,
             scaleX: currScale * 1.03,
             scaleY: currScale * 1.03,
             rotation: -0.04,
             ease: 'Quint.easeOut',
             duration: 135,
             onComplete: () => {
                 if (this.posterTween) {
                     this.posterTween.stop();
                 }
                 this.addTween({
                     targets: this.poster,
                     scaleX: 0,
                     scaleY: 0,
                     ease: 'Quart.easeIn',
                     duration: 700
                 })
                 this.addTween({
                     targets: this.poster,
                     rotation: -0.7,
                     ease: 'Quad.easeIn',
                     duration: 600
                 })
             }
         })
     }

     hidePoster() {
        if (!this.poster) {
            return;
        }
        if (this.posterTween) {
            this.posterTween.stop();
        }

         this.poster.setScale(this.sprite.startScale * 1.09);
         this.addTween({
             targets: this.poster,
             scaleX: this.sprite.startScale * 0.96,
             scaleY: this.sprite.startScale * 0.96,
             rotation: -0.07,
             ease: 'Bounce.easeOut',
             duration: 230,
             completeDelay: 20,
             onComplete: () => {
                 this.addTween({
                     targets: this.poster,
                     rotation: -0.9,
                     scaleX: 0,
                     scaleY: 0,
                     ease: 'Cubic.easeIn',
                     duration: 750
                 })
             }
         })
     }

     initTutorial() {
        this.bgMusic = playMusic('bite_down_simplified', 0.65, true);
    }


     setHealth(newHealth) {
         super.setHealth(newHealth);
         let prevHealthPercent = this.prevHealth / this.healthMax;
         let currHealthPercent = this.health / this.healthMax;
         if (currHealthPercent == 0) {
             // dead, can't do anything
             return;
         }
     }

    takeDamage(amt, isAttack, yOffset) {
        super.takeDamage(amt, isAttack, yOffset);
        if (this.damageCanEmit) {
            this.damageCanEmit = false;
            this.createDamageParticles();
            this.addTimeout(() => {
                this.damageCanEmit = true;
            }, 400)
        }
    }

    tempShiftSFX() {
        if (this.runSfxLoop) {
            this.runSfxLoop.detune = 750;
            setVolume(this.runSfxLoop, 1, 300)
            this.addTimeout(() => {
                this.runSfxLoop.detune = 0;
                setVolume(this.runSfxLoop, 0, 300)
            }, 600)
        }
    }

    startFight() {
        this.fightStarted = true;
        this.setAwake();
        playSound('inflate', 0.6).detune = 500;
        this.currDummyAnim = this.addTween({
            targets: this.sprite,
            scaleX: this.sprite.startScale * 0.85,
            scaleY: this.sprite.startScale * 0.85,
            rotation: -0.25,
            ease: "Quint.easeOut",
            duration: 700,
            onComplete: () => {
                playSound('tractor_start', 0.4);
                this.currDummyAnim = this.addTween({
                    targets: this.sprite,
                    scaleX: this.sprite.startScale * 1.25,
                    scaleY: this.sprite.startScale * 1.25,
                    rotation: 0.08,
                    ease: "Quart.easeIn",
                    duration: 600,
                    onComplete: () => {
                        this.setDefaultSprite('dummy_paper_face.png');
                        this.showPoster('dummy_paper_rawr.png', 0.02);
                        this.currDummyAnim = this.addTween({
                            targets: this.sprite,
                            scaleX: this.sprite.startScale,
                            scaleY: this.sprite.startScale,
                            rotation: -0.02,
                            easeParams: [2],
                            ease: "Bounce.easeOut",
                            duration: 500,
                            onComplete: () => {
                                this.runSfxLoop = playSound('tractor_loop', 0, true);
                                this.currDummyAnim = this.runTween = this.addTween({
                                    targets: [this.sprite],
                                    rotation: 0.02,
                                    ease: "Quart.easeInOut",
                                    duration: 500,
                                    repeat: -1,
                                    yoyo: true,
                                });
                                this.posterTween = this.addTween({
                                    delay: 1000,
                                    targets: this.poster,
                                    rotation: 0.02,
                                    ease: "Quart.easeInOut",
                                    duration: 500,
                                    repeat: -1,
                                    yoyo: true,
                                    onStart: () => {
                                        this.poster.rotation = -0.02;
                                    }
                                });
                            }
                        });

                         let shinePattern = getTempPoolObject('spells', 'brickPattern2.png', 'brickPattern', 700);
                         shinePattern.setPosition(this.x, this.y - 120).setScale(0.65).setDepth(-1).setAlpha(0.5);
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
                    }
                });
            }
        });
    }

    throwWeapon(name, damage, numTimes = 1) {
        if (this.dead || this.isDestroyed) {
            return;
        }
        this.tempShiftSFX();
        this.currDummyAnim = this.addTween({
            targets: this.sprite,
            scaleX: this.sprite.startScale * 0.85,
            scaleY: this.sprite.startScale * 0.85,
            rotation: (numTimes % 2 === 1) ? -0.25 : 0.25,
            ease: "Quart.easeOut",
            duration: 650,
            onComplete: () => {
                let weapon = this.addImage(this.x, this.y - 105, 'dummyenemy', name).setDepth(0).setScale(0.2);
                this.addTween({
                    targets: weapon,
                    rotation: (Math.random() < 0.5 ? -12.566 : 12.566) + Math.random() * 0.2 - 0.1,
                    duration: 1300,
                });
                let randX = Math.random() * 6 - 3;
                this.addTween({
                    targets: weapon,
                    y: this.y - 310,
                    x: "+=" + randX,
                    scaleX: 0.8,
                    scaleY: 0.8,
                    ease: "Cubic.easeOut",
                    duration: 550,
                    onComplete: () => {
                        weapon.setDepth(20);
                        weapon.setScale(1.14);
                        this.addTween({
                            targets: weapon,
                            scaleX: 1,
                            scaleY: 1,
                            ease: "Cubic.easeOut",
                            duration: 500,
                        });
                        this.addTween({
                            targets: weapon,
                            y: globalObjects.player.getY() - 220,
                            ease: "Cubic.easeIn",
                            duration: 750,
                            onComplete: () => {
                                messageBus.publish("selfTakeDamage", damage);
                                 let hitEffect = this.addSprite(gameConsts.halfWidth, globalObjects.player.getY() - 190, 'spells').play('damageEffect').setRotation((Math.random() - 0.5) * 3).setScale(1.5).setDepth(195);
                                 this.addTween({
                                     targets: hitEffect,
                                     scaleX: 1.25,
                                     scaleY: 1.25,
                                     ease: 'Cubic.easeOut',
                                     duration: 150,
                                     onComplete: () => {
                                         hitEffect.destroy();
                                     }
                                 });
                                 let detuneAmt = (numTimes % 3) * 200 - 300;
                                 playSound('punch').detune = detuneAmt;
                                this.addTween({
                                    delay: 500,
                                    targets: weapon,
                                    alpha: 0,
                                    duration: 500,
                                });
                            }
                        });
                    }
                });
                this.currDummyAnim = this.addTween({
                    targets: this.sprite,
                    scaleX: this.sprite.startScale * 1.1,
                    scaleY: this.sprite.startScale * 1.1,
                    rotation: numTimes % 2 == 1 ? 0.05 : -0.05,
                    ease: numTimes > 1 ? "Cubic.easeIn" : "Quart.easeIn",
                    duration: numTimes > 1 ? 250 : 450,
                    onComplete: () => {
                        if (numTimes <= 1) {
                            this.currDummyAnim = this.addTween({
                                targets: this.sprite,
                                scaleX: this.sprite.startScale,
                                scaleY: this.sprite.startScale,
                                rotation: 0,
                                ease: "Bounce.easeOut",
                                duration: 400,
                            });
                        }
                    }
                });
                if (numTimes > 1) {
                    this.addTimeout(() => {
                        this.throwWeapon(name, damage, numTimes - 1);
                    }, 250)
                }

            }
        });
    }

    throwTriple(name, damage, numTimes = 1, isFast, hasBird = false) {
        if (this.dead || this.isDestroyed || globalObjects.player.isDead()) {
            return;
        }
        this.tempShiftSFX();
        this.currDummyAnim = this.addTween({
            targets: this.sprite,
            scaleX: this.sprite.startScale * 0.85,
            scaleY: this.sprite.startScale * 0.85,
            rotation: (numTimes % 2 === 1) ? -0.25 : 0.25,
            ease: "Quart.easeOut",
            duration: isFast ? 500 : 600,
            onComplete: () => {
                let trueName = name;
                if (numTimes === 1 && hasBird) {
                    trueName = 'bird.png';
                    setTimeout(() => {
                        playSound('chirp1');
                    }, 400)
                }
                if (numTimes % 2 === 1) {
                    this.tweenWeaponToPlayer(name, damage, this.x - 100, this.y - 280, this.x - 10, globalObjects.player.getY() - 220, 0, -120)
                    this.tweenWeaponToPlayer(name, damage, this.x, this.y - 295, this.x, globalObjects.player.getY() - 220, 175, 0)
                    this.tweenWeaponToPlayer(name, damage, this.x + 100, this.y - 280, this.x + 10, globalObjects.player.getY() - 220, 350, 120)
                } else {
                    this.tweenWeaponToPlayer(trueName, damage, this.x + 100, this.y - 280, this.x + 10, globalObjects.player.getY() - 220, 0, -120)
                    this.tweenWeaponToPlayer(name, damage, this.x, this.y - 295, this.x, globalObjects.player.getY() - 220, 175, 0)
                    this.tweenWeaponToPlayer(name, damage, this.x - 100, this.y - 280, this.x - 10, globalObjects.player.getY() - 220, 350, 120)
                }

                this.currDummyAnim = this.addTween({
                    targets: this.sprite,
                    scaleX: this.sprite.startScale * 1.1,
                    scaleY: this.sprite.startScale * 1.1,
                    rotation: numTimes % 2 === 1 ? 0.05 : -0.05,
                    ease: "Quart.easeIn",
                    duration: isFast ? 350 : 400,
                    onComplete: () => {
                        if (numTimes <= 1) {
                            this.currDummyAnim = this.addTween({
                                targets: this.sprite,
                                scaleX: this.sprite.startScale,
                                scaleY: this.sprite.startScale,
                                rotation: 0,
                                ease: "Bounce.easeOut",
                                duration: 400,
                            });
                        }
                    }
                });
                if (numTimes > 1) {
                    this.addTimeout(() => {
                        this.throwTriple(name, damage, numTimes - 1);
                    }, (isFast ? 350 : 400))
                }

            }
        });
    }

    tweenWeaponToPlayer(name, damage, xOut, yOut, xTarg, yTarg, delay, detune = 0) {
        let weapon = this.addImage(this.x, this.y - 90, 'dummyenemy', name).setDepth(0).setScale(0.25);
        this.addTween({
            targets: weapon,
            rotation: -12.566 + Math.random() * 0.1,
            duration: 1200,
        });
        this.addTween({
            delay: delay,
            targets: weapon,
            x: xOut,
            y: yOut,
            scaleX: 0.9,
            scaleY: 0.9,
            ease: "Cubic.easeOut",
            duration: 500,
            onComplete: () => {
                weapon.setDepth(20);
                this.addTween({
                    targets: weapon,
                    x: xTarg,
                    y: yTarg,
                    ease: "Cubic.easeIn",
                    duration: 700,
                    onComplete: () => {
                        messageBus.publish("selfTakeDamage", damage);
                        let hitEffect = this.addSprite(weapon.x, globalObjects.player.getY() - 190, 'spells').play('damageEffect').setRotation((Math.random() - 0.5) * 3).setScale(1.5).setDepth(195);
                        this.addTween({
                            targets: hitEffect,
                            scaleX: 1.25,
                            scaleY: 1.25,
                            ease: 'Cubic.easeOut',
                            duration: 150,
                            onComplete: () => {
                                hitEffect.destroy();
                            }
                        });
                        let detuneAmt = detune;//(numTimes % 3) * 100 - 100;
                        playSound('razor_leaf').detune = detuneAmt;
                        this.addTween({
                            delay: 500,
                            targets: weapon,
                            alpha: 0,
                            duration: 500,
                        });
                    }
                });
            }
        });

    }


    createDamageParticles() {
        let cloud1 = getTempPoolObject('dummyenemy', 'cloud1.png', 'cloud1', 1100);
        let cloud2 = getTempPoolObject('dummyenemy', 'cloud2.png', 'cloud1', 1100);
        cloud1.setPosition(this.x, this.y - 100).setScale(0.6 + Math.random() * 0.2).setRotation(Math.random() - 0.5).setAlpha(1);
        cloud2.setPosition(this.x, this.y - 100).setScale(0.8 + Math.random() * 0.2).setRotation(Math.random() - 0.5).setAlpha(1);
        let randRot1 = Math.random() * 6.28;
        let randX = Math.sin(randRot1) * 220;
        let randY = Math.abs(Math.cos(randRot1)) * -200;
        this.addTween({
            targets: cloud1,
            x: "+=" + randX,
            y: "+=" + randY,
            ease: "Cubic.easeOut",
            duration: 1000,
        });
        let randRot2 = Math.random() * 6.28;
        let rand2X = Math.sin(randRot2) * 220;
        let rand2Y = Math.abs(Math.cos(randRot2)) * -200;
        this.addTween({
            targets: cloud2,
            x: "+=" + rand2X,
            y: "+=" + rand2X,
            ease: "Cubic.easeOut",
            duration: 1000,
        });
        this.addTween({
            targets: [cloud1, cloud2],
            alpha: 0,
            ease: "Cubic.easeIn",
            duration: 1000,
        });
        this.addTween({
            targets: [cloud1, cloud2],
            rotation: (Math.random() - 0.5) * 0.1,
            ease: "Quad.easeOut",
            duration: 1000,
        });
    }

     die() {
         if (this.dead) {
             return;
         }
        super.die();

        globalObjects.textPopupManager.hideInfoText();
        this.dieClickBlocker = createGlobalClickBlocker(false);
        this.sprite.setScale(this.sprite.startScale).setRotation(0);
        let darkDummy = this.addSprite(this.sprite.startX, this.sprite.y, 'dummyenemy', 'dummy_paper_dark.png').setScale(this.sprite.startScale).setDepth(11).setAlpha(0.1);
        if (this.currDummyAnim) {
            this.currDummyAnim.stop();
        }
         this.addTween({
             targets: darkDummy,
             alpha: 0.7,
             ease: "Cubic.easeIn",
             duration: 1800,
         });
         this.addTween({
             targets: [this.sprite, darkDummy],
             scaleY: 0,
             rotation: 0.06,
             ease: "Quad.easeIn",
             duration: 1800,
             onComplete: () => {
                darkDummy.setAlpha(0.25);
                 this.sprite.setFrame('dummy_paper_back.png');
                 this.sprite.setRotation(0);
                 playSound('victory_2');
                 this.addTween({
                     targets: [this.sprite, darkDummy],
                     scaleY: -0.2,
                     ease: "Cubic.easeOut",
                     duration: 900,
                     onComplete: () => {
                        this.showComplete(darkDummy);
                     }
                 });
                 this.addTween({
                     targets: [this.sprite, darkDummy],
                     rotation: 0.22,
                     ease: "Quad.easeOut",
                     duration: 1000,
                     onComplete: () => {

                     }
                 });
             }
         });
     }


     initAttacks() {
         this.attacks = [
             [
                 // 0
                 {
                     name: "}5 ",
                     chargeAmt: 300,
                     damage: 5,
                     isBigMove: true,
                    attackFinishFunction: () => {
                        playSound('body_slam')
                        let dmgEffect = this.addSprite(gameConsts.halfWidth + (Math.random() - 0.5) * 20, globalObjects.player.getY() - 185, 'spells', 'damageEffect1.png').setDepth(998).setScale(1.4);
                        this.addTimeout(() => {
                            dmgEffect.destroy();
                        }, 150)
                    }
                 },
             ]
         ];
     }

    showComplete(darkDummy) {
        globalObjects.encyclopedia.hideButton();
        globalObjects.options.hideButton();
        globalObjects.magicCircle.disableMovement();
        let banner = this.scene.add.sprite(gameConsts.halfWidth, gameConsts.halfHeight - 35, 'misc', 'victory_banner.png').setScale(100, 1.2).setDepth(9998).setAlpha(0);
        let victoryText = this.scene.add.sprite(gameConsts.halfWidth, gameConsts.halfHeight - 44, 'misc', 'complete.png').setScale(0.95).setDepth(9998).setAlpha(0);
        let continueText = this.scene.add.text(gameConsts.width - 15, gameConsts.halfHeight + 2, getLangText('cont_ui'), {fontFamily: 'Verdana', color: '#F0F0F0', fontSize: 20}).setAlpha(0).setOrigin(1, 0.5).setAlign('right').setDepth(9998);

        PhaserScene.tweens.add({
            targets: banner,
            alpha: 0.75,
            duration: 500,
        });

         PhaserScene.tweens.add({
             targets: [victoryText],
             alpha: 1,
             ease: 'Quad.easeOut',
             duration: 500,
         });
        playSound('victory');
        this.addTimeout(() => {
             continueText.alpha = 1;
         }, 1000);

         PhaserScene.tweens.add({
             targets: victoryText,
             scaleX: 1,
             scaleY: 1,
             duration: 800,
             onComplete: () => {
                 if (canvas) {
                     canvas.style.cursor = 'pointer';
                 }
                this.dieClickBlocker.setOnMouseUpFunc(() => {
                    if (canvas) {
                        canvas.style.cursor = 'default';
                    }
                    PhaserScene.tweens.add({
                         targets: [this.sprite, darkDummy],
                         alpha: 0,
                         duration: 800,
                    });

                    hideGlobalClickBlocker();
                    continueText.destroy();
                    PhaserScene.tweens.add({
                         targets: [victoryText, banner],
                         alpha: 0,
                         duration: 800,
                        completeDelay: 200,
                         onComplete: () => {
                            victoryText.destroy();
                            banner.destroy();
                            // globalObjects.magicCircle.enableMovement();
                             // TODO: maybe just skip straight to enemy
                            // globalObjects.postFightScreen.createWinScreenMin();
                             let goalLevel = this.targetLevel ? this.targetLevel : -this.level + 1;
                             beginPreLevel(goalLevel);
                        }
                    });
                });
             }
         });
     }
}
