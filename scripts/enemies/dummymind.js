class Dummymind extends Dummypractice {
    constructor(scene, x, y, level) {
        super(scene, x, y, level);

        this.addTimeout(() => {
            this.resetCast = messageBus.subscribe('resetCircle', () => {
                this.canAccelerate = true;
            });
            this.subscriptions.push(this.resetCast);
        }, 100)
        switchBackground('forest_bg.webp');
        fadeInBackgroundAtlas('backgrounds', 'background6.webp', 1500, 1.05, 1.05, 1.05,'Quart.easeOut', 0, false, -12);
    }

    initStatsCustom() {
        this.health = 30;
        this.chargeBarOffsetY = 7;
        this.chargeBarHeightOffset = -1;
        this.isAsleep = true;
        this.attackScale = 1;
        this.pullbackScale = 1;
        this.numTimesHealed = 0;
    }


    showHPGauge() {
        this.hpBG = this.addImage(gameConsts.halfWidth - 160 - getLangText('HP').length * 10, gameConsts.halfHeight - 165, 'blackPixel').setScale(getLangText('HP').length * 23 - 10, 30).setAlpha(0).setDepth(-1);
        let textYOffset = 0;
        if (language === 'zh_tw' || language === 'zh_cn') {
            this.hpBG.scaleX += 16;
            this.hpBG.scaleY += 4;
            textYOffset = 2;
        }
        this.hpText = this.addText(this.hpBG.x - this.hpBG.scaleX + 10, this.hpBG.y + textYOffset, getLangText('HP') + "50", {fontFamily: 'germania', color: '#F0F0F0', fontSize: 50}).setAlpha(0).setOrigin(0, 0.5).setAlign('left');
        this.hpText.startX = this.hpText.x;
        this.addTween({
            targets: [this.hpText],
            alpha: 1,
            ease: 'Quad.easeOut',
            duration: 800
        })
        this.addTween({
            targets: [this.hpBG],
            alpha: 0.5,
            ease: 'Quad.easeOut',
            duration: 800
        })
    }

    initTutorial() {
        this.bgMusic = playMusic('bite_down_simplified', 0.65, true);
        globalObjects.magicCircle.disableMovement();
        globalObjects.bannerTextManager.setDialog([getLangText('level1_train_diag_a')]);
        globalObjects.bannerTextManager.setPosition(gameConsts.halfWidth, gameConsts.halfHeight, 0);
        globalObjects.bannerTextManager.showBanner(false, language === 'fr');
        let runeDepth = globalObjects.bannerTextManager.getDepth() + 1;
        this.rune1 = this.addImage(gameConsts.halfWidth - 260, gameConsts.halfHeight, 'tutorial', 'rune_energy_large.png').setDepth(runeDepth).setScale(0.8, 0.8).setAlpha(0);
        this.rune2 = this.addImage(gameConsts.halfWidth + 260, gameConsts.halfHeight, 'tutorial', 'rune_energy_large.png').setDepth(runeDepth).setScale(0.8, 0.8).setAlpha(0);
        this.addTween({
            targets: [this.rune1, this.rune2],
            alpha: 1,
            scaleX: 1,
            scaleY: 1,
            duration: 400,
            onComplete: () => {
                this.showPoster();
            }
        });
        globalObjects.bannerTextManager.setOnFinishFunc(() => {
            globalObjects.magicCircle.enableMovement();
            globalObjects.bannerTextManager.setOnFinishFunc(() => {});
            globalObjects.bannerTextManager.closeBanner();
            this.addTween({
                targets: [this.rune1, this.rune2],
                alpha: 0,
                duration: 200,
            });
            this.canShowShieldTip = true;
            // this.showGoal();
            this.addDelay(() => {
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

            }, 400);

            // messageBus.publish('enemyAddShield', 500)
        });
    }

    showGoal() {
        this.backingBox = this.addImage(0, 0, 'blackPixel').setAlpha(0);
        this.text = PhaserScene.add.text(10, 10, getLangText('level1_train_tut_a'), {fontFamily: 'garamondmax', fontSize: 24, color: '#FFFFFF', align: 'left'}).setAlpha(0).setOrigin(0, 0).setDepth(100);
        this.backingBox.setScale(this.text.width * 0.5 + 10, this.text.height * 0.5 + 10).setOrigin(0, 0);
        this.addToDestructibles(this.text);
        this.highlightGoal();
    }

    highlightGoal() {
        this.text.setScale(0.98);
        this.addTween({
            targets: [this.text],
            alpha: 1,
            scaleX: 1,
            scaleY: 1,
            ease: 'Back.easeOut',
            duration: 600,
        });
        this.addTween({
            targets: [this.backingBox],
            alpha: 0.8,
            duration: 600,
        });
        this.addTimeout(() => {
            this.fadeGoal();
        }, 4000)
    }

    fadeGoal() {
        this.addTween({
            targets: [this.text],
            alpha: 0.8,
            duration: 600,
        });
        this.addTween({
            targets: [this.backingBox],
            alpha: 0.6,
            duration: 600,
        });
    }

    healAnim() {
        if (this.dead) {
            return;
        }
        this.currDummyAnim = this.addTween({
            targets: [this.sprite, this.poster],
            scaleX: this.sprite.startScale * 0.82,
            scaleY: this.sprite.startScale * 0.82,
            rotation: -0.25,
            ease: "Quint.easeOut",
            duration: 500,
            onComplete: () => {
                this.currDummyAnim = this.addTween({
                    targets: [this.sprite, this.poster],
                    scaleX: this.sprite.startScale * 1.2,
                    scaleY: this.sprite.startScale * 1.2,
                    rotation: 0.07,
                    ease: "Quart.easeIn",
                    duration: 480,
                    onComplete: () => {
                        playSound('magic', 0.6);
                        this.isFacingFront = !this.isFacingFront;
                        if (this.isFacingFront) {
                            this.poster.setFrame('dummy_paper_haha.png');
                            this.setDefaultSprite('dummy_paper_face.png', undefined, false);
                        } else {
                            this.poster.setFrame('dummy_paper_hit.png');
                            this.setDefaultSprite('dummy_paper_back.png', undefined, false);
                            playSound('balloon', 0.6);
                        }
                        this.heal(this.healthMax);
                        this.timeSinceLastAttacked = 999;

                        if (!this.hpBG) {
                            this.showHPGauge();
                        } else {
                            this.highlightGoal();

                        }
                        if (this.hpText) {
                            this.hpText.setText(getLangText('HP') + this.health);
                            this.addTween({
                                targets: this.hpText,
                                scaleX: 1.05,
                                scaleY: 1.05,
                                ease: 'Quart.easeOut',
                                duration: 750,
                                onComplete: () => {
                                    this.addTween({
                                        targets: this.hpText,
                                        scaleX: 1,
                                        scaleY: 1,
                                        ease: 'Back.easeOut',
                                        duration: 350,
                                    })
                                }
                            })
                        }
                        this.clearEffects();
                        this.numTimesHealed++
                        messageBus.publish('animateHealNum', this.x, this.y - 50, '+' + this.healthMax, 0.5 + Math.sqrt(this.healthMax) * 0.2);
                        if (!this.healSprite) {
                            this.healSprite = this.addImage(gameConsts.halfWidth, this.y - 90, 'misc', 'heal.png').setScale(0.9).setDepth(999).setAlpha(1);
                        }
                        this.healSprite.setAlpha(1).setPosition(gameConsts.halfWidth, this.y - 90);
                        this.scene.tweens.add({
                            targets: this.healSprite,
                            y: "-=30",
                            duration: 1000,
                        });
                        this.scene.tweens.add({
                            targets: this.healSprite,
                            alpha: 0,
                            duration: 1000,
                            ease: 'Cubic.easeIn',
                            onComplete: () => {
                                if (this.numTimesHealed === 2) {
                                    globalObjects.bannerTextManager.setDialog([getLangText('level1_train_diag_b')]);
                                    globalObjects.bannerTextManager.setPosition(gameConsts.halfWidth, gameConsts.height - 130, 0);
                                    globalObjects.bannerTextManager.showBanner(0.5);
                                } else if (this.numTimesHealed === 4) {
                                    globalObjects.bannerTextManager.setDialog([getLangText('level1_train_diag_c')]);
                                    globalObjects.bannerTextManager.setPosition(gameConsts.halfWidth, gameConsts.height - 130, 0);
                                    globalObjects.bannerTextManager.showBanner(0.5);
                                }
                            }
                        });

                        this.currDummyAnim = this.addTween({
                            targets: [this.sprite, this.poster],
                            scaleX: this.sprite.startScale,
                            scaleY: this.sprite.startScale,
                            rotation: 0,
                            easeParams: [2],
                            ease: "Bounce.easeOut",
                            duration: 600,
                        })
                    }
                })
            }
        });
    }


    setHealth(newHealth) {
        super.setHealth(newHealth);
        let prevHealthPercent = this.prevHealth / this.healthMax;
        let currHealthPercent = this.health / this.healthMax;
        let healthLost = this.prevHealth - this.health;
        /*
        if (this.canAccelerate) {
            console.log("acceleration")
            // ensures this gets across the finish line
            this.canAccelerate = false;
            this.timeSinceLastAttacked = -8;
            this.addCastAggravate(16);
        }
        if (this.hpText) {
            this.hpText.setText(getLangText('HP') + this.health);
            if (healthLost > 13) {
                this.hpText.x = this.hpText.startX - 7;
                this.hpText.setScale(1.06);
                this.hpText.setColor('#FF7777')
                this.addTween({
                    targets: this.hpText,
                    x: this.hpText.startX + 5,
                    scaleX: 1.09,
                    scaleY: 1.12,
                    duration: 40,
                    onComplete: () => {
                        this.addTween({
                            targets: this.hpText,
                            x: this.hpText.startX,
                            scaleX: 1,
                            scaleY: 1,
                            ease: 'Bounce.easeOut',
                            easeParams: [2.5],
                            duration: 350,
                            onComplete: () => {
                                this.hpText.setColor('#FFFFFF')
                            }
                        })
                    }
                })
            } else {
                this.hpText.setScale(1.01);
                this.hpText.x = this.hpText.startX + 2;
                this.addTween({
                    targets: this.hpText,
                    x: this.hpText.startX,
                    scaleX: 1,
                    scaleY: 1,
                    ease: 'Bounce.easeOut',
                    duration: 350
                })
            }

        }
*/
        if (currHealthPercent === 0) {
            // dead, can't do anything
            return;
        }
        // if (this.canShowShieldTip) {
        //     this.canShowShieldTip = false;
        //     this.addTimeout(() => {
        //         let runeDepth = globalObjects.bannerTextManager.getDepth() + 1;
        //
        //         globalObjects.textPopupManager.setInfoText(gameConsts.width, gameConsts.halfHeight - 180, getLangText('dummy_mind_tut'), 'right');
        //         let runeYPos = globalObjects.textPopupManager.getBoxBottomPos();
        //         let centerXPos = globalObjects.textPopupManager.getCenterPos();
        //         this.rune3 = this.addImage(centerXPos - 32, runeYPos + 16, 'circle', 'bright_rune_mind.png').setDepth(runeDepth).setScale(0.8, 0.8).setAlpha(0);
        //         this.rune4 = this.addImage(centerXPos + 37, runeYPos + 16, 'circle', 'bright_rune_strike.png').setDepth(runeDepth).setScale(0.8, 0.8).setAlpha(0);
        //
        //         this.addTween({
        //             targets: [this.rune3, this.rune4],
        //             alpha: 1,
        //             duration: 200,
        //             completeDelay: 1000,
        //             onComplete: () => {
        //                 this.playerSpellCastSub2 = messageBus.subscribe('playerCastedSpell', () => {
        //                     this.playerSpellCastSub2.unsubscribe();
        //                     this.addTimeout(() => {
        //                         this.addTween({
        //                             targets: [this.rune3, this.rune4],
        //                             alpha: 0,
        //                             duration: 300,
        //                             onComplete: () => {
        //                                 this.rune3.visible = false;
        //                                 this.rune4.visible = false;
        //                             }
        //                         });
        //                         globalObjects.textPopupManager.hideInfoText();
        //                     }, 1000);
        //                 });
        //                 this.subscriptions.push(this.playerSpellCastSub2);
        //             }
        //         });
        //     }, 900)
        // }
    }

    die() {
        if (this.dead) {
            return;
        }
        globalObjects.textPopupManager.hideInfoText();
        if (this.rune1) {
            this.rune1.visible = false;
            this.rune2.visible = false;
        }
        if (this.currDummyAnim) {
            this.currDummyAnim.stop()
        }
        if (this.playerSpellCastSub) {
            this.playerSpellCastSub.unsubscribe();
        }
        if (this.playerSpellCastSub2) {
            this.playerSpellCastSub.unsubscribe();
        }
        if (this.poster) {
            this.poster.setFrame('dummy_paper_ouch.png')
            this.hidePoster();
        }
        if (this.hpText) {
            this.hpText.setText(getLangText('HP') + "0");
            this.addTween({
                delay: 400,
                targets: [this.hpText, this.hpBG],
                alpha: 0,
                duration: 1500
            })
        }

        if (this.backingBox) {
            this.addTween({
                targets: [this.text, this.backingBox],
                alpha: 0,
                duration: 300,
            });
        }
        if (this.rune3) {
            this.rune3.visible = false;
        }
        if (this.rune4) {
            this.rune4.visible = false;
        }
        super.die();

    }


    initAttacks() {
        this.attacks = [
            [
                // 0
                {
                    name: "FULL HEAL \\50",
                    chargeAmt: 895,
                    finishDelay: 10,
                    transitionFast: true,
                    isPassive: true,
                    damage: -1,
                    attackStartFunction: () => {
                        this.healAnim(50);
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
        // let continueText = this.scene.add.text(gameConsts.halfWidth, gameConsts.halfHeight + 2, getLangText('cont_ui'), {fontFamily: 'garamondmax', color: '#F0F0F0', fontSize: 18}).setAlpha(0).setOrigin(0.5, 0.5).setAlign('center').setDepth(9998);

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
        // this.addTimeout(() => {
        //     continueText.alpha = 1;
        // }, 1000);

        PhaserScene.tweens.add({
            targets: victoryText,
            scaleX: 1,
            scaleY: 1,
            duration: 800,
            onComplete: () => {
                PhaserScene.tweens.add({
                    delay: 500,
                    targets: [victoryText, banner],
                    alpha: 0,
                    duration: 500,
                })
                playSound('water1');
                let waterEnemy = this.addSprite(gameConsts.halfWidth, 335, 'water', 'water_emerge2.png').setScale(1, 0).setAlpha(0.5).setDepth(10);


                PhaserScene.tweens.add({
                    targets: waterEnemy,
                    rotation: 0,
                    duration: 1200,
                    oncomplete: () => {
                        waterEnemy.setFrame('water_emerge1.png');
                    }
                });
                PhaserScene.tweens.add({
                    targets: waterEnemy,
                    scaleY: 1.7,
                    scaleX: 1.5,
                    ease: 'Quart.easeOut',
                    duration: 1600,
                    onComplete: () => {
                        PhaserScene.tweens.add({
                            targets: waterEnemy,
                            scaleY: 1.4,
                            scaleX: 1.4,
                            ease: 'Back.easeOut',
                            duration: 400,
                            onComplete: () => {
                                PhaserScene.tweens.add({
                                    targets: [this.sprite],
                                    y: "-=20",
                                    ease: 'Cubic.easeInOut',
                                    duration: 400,
                                });
                                setTimeout(() => {
                                    waterEnemy.setFrame('water_emerge2.png');
                                }, 100)

                                PhaserScene.tweens.add({
                                    targets: waterEnemy,
                                    scaleY: 1.65,
                                    scaleX: 1.5,
                                    ease: 'Cubic.easeInOut',
                                    duration: 300,
                                    onComplete: () => {
                                        PhaserScene.tweens.add({
                                            targets: [this.sprite],
                                            scaleY: 0,
                                            y: "+=70",
                                            ease: 'Cubic.easeIn',
                                            duration: 600,
                                        });
                                        switchLevelBackground(2);
                                        PhaserScene.tweens.add({
                                            targets: waterEnemy,
                                            scaleY: 0.1,
                                            scaleX: 1.2,
                                            ease: 'Cubic.easeIn',
                                            duration: 650,
                                            onComplete: () => {
                                                playSound('watersplashbig');
                                                let whitebg = PhaserScene.add.image(gameConsts.halfWidth, gameConsts.halfHeight, 'whitePixel').setAlpha(0.15);
                                                PhaserScene.tweens.add({
                                                    targets: whitebg,
                                                    alpha: 0,
                                                    duration: 1500,
                                                })
                                                let splash = PhaserScene.add.image(gameConsts.halfWidth, gameConsts.halfHeight, 'water', 'water_gloop.png').setAlpha(0.5).setDepth(200);
                                                PhaserScene.tweens.add({
                                                    targets: splash,
                                                    scaleY: 2,
                                                    scaleX: 2,
                                                    alpha: 1,
                                                    ease: 'Quart.easeOut',
                                                    duration: 400,
                                                    onComplete: () => {
                                                        PhaserScene.tweens.add({
                                                            targets: splash,
                                                            alpha: 0,
                                                            y: "+=15",
                                                            duration: 1000,
                                                        })
                                                    }
                                                })
                                                globalObjects.magicCircle.enableMovement();
                                                beginLevel(2, true);
                                            }
                                        })
                                    }
                                })
                            }
                        })
                    }
                })
                PhaserScene.tweens.add({
                    targets: [darkDummy],
                    alpha: 0,
                    duration: 400,

                });
                PhaserScene.tweens.add({
                    targets: [this.sprite],
                    alpha: 0.75,
                    ease: 'Quart.easeOut',
                    duration: 1000,
                });
                this.sprite.setOrigin(0.5, 0.2);
                darkDummy.setOrigin(0.5, 0.2);
                PhaserScene.tweens.add({
                    targets: [this.sprite, darkDummy],
                    scaleY: 0.75,
                    scaleX: 0.8,
                    y: "-=110",
                    ease: 'Quart.easeOut',
                    duration: 1650,
                });
                PhaserScene.tweens.add({
                    targets: [this.sprite, darkDummy],
                    rotation: "+=4",
                    x: "-=10",
                    ease: 'Quart.easeOut',
                    duration: 6000,
                });

                PhaserScene.tweens.add({
                    delay: 1000,
                    targets: [victoryText, banner],
                    alpha: 0,
                    duration: 800,
                    onComplete: () => {
                        victoryText.destroy();
                        banner.destroy();

                        // TODO: maybe just skip straight to enemy
                        // globalObjects.postFightScreen.createWinScreenMin();

                    }
                });
                // if (canvas) {
                //     canvas.style.cursor = 'pointer';
                // }
                // this.dieClickBlocker.setOnMouseUpFunc(() => {
                //     if (canvas) {
                //         canvas.style.cursor = 'default';
                //     }
                //     PhaserScene.tweens.add({
                //         targets: [this.sprite, darkDummy],
                //         alpha: 0,
                //         duration: 800,
                //     });
                //
                //     hideGlobalClickBlocker();
                //     continueText.destroy();
                //
                // });
            }
        });
    }

}
