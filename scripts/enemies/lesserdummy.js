class LesserDummy extends Enemy {
    constructor(scene, x, y, level) {
        super(scene, x, y, level);
        this.initSprite('lesser_dummy_blank.png', 0.9, 0, undefined, undefined, 0);
        this.sprite.setOrigin(0.5, 0.98);
        globalObjects.encyclopedia.hideButton();
        this.bgMusic2 = playMusic('wind', 0.01, true);
        fadeInSound(this.bgMusic2, 0.5, 1200);
        globalObjects.options.hideButton();
        this.playerSpellCastSub = messageBus.subscribe('playerCastedSpell', () => {
            if (globalObjects.player.getPlayerCastSpellsCount() === 1) {
                // if (!this.bgMusic) {
                //     this.bgMusic = playMusic('bite_down_simplified', 0.6, true);
                // }
                this.initTutorial2();
            } else if (globalObjects.player.getPlayerCastSpellsCount() === 2) {
                this.addTimeout(() => {
                    this.attemptTutThree();
                }, 3000);
                this.playerSpellCastSub.unsubscribe()
            }
        });
        this.initTutorial(x, y);
    }

    initSpriteAnim(scale) {
        let origY = this.sprite.y;
        this.sprite.setScale(scale * 0.78, scale * 0.78).setAlpha(0.01);
        this.sprite.y += 96;
        let helmHeight = 211;
        let helmXOffset = 21;
        this.helmet = this.addSprite(this.sprite.x - helmXOffset * 0.78, this.sprite.y - helmHeight * 0.78, 'enemies', 'hat.png').setScale(this.sprite.scaleX * 0.95, this.sprite.scaleY * 0.95).setAlpha(0.01).setDepth(this.sprite.depth + 1).setRotation(0.35);
        this.addTween({
            targets: [this.sprite, this.helmet],
            alpha: 1,
            ease: 'Quart.easeOut',
            duration: 1250
        })
        this.addTween({
            targets: this.helmet,
            duration: 1500,
            ease: 'Quint.easeInOut',
            scaleX: scale * 0.95,
            scaleY: scale * 0.95,
            x: this.sprite.x - helmXOffset,
            y: origY - helmHeight,
        });

        this.addTween({
            targets: this.sprite,
            duration: 1500,
            ease: 'Quint.easeInOut',
            scaleX: scale,
            scaleY: scale,
            y: origY,
            onComplete: () => {
                this.mouthSprite = this.addSprite(this.x, this.sprite.y - 107, 'enemies', 'lesser_dummy_mouth1.png').setScale(scale).setDepth(5);
                this.addExtraSprite(this.mouthSprite, 0, 0);
                this.mouthSprite.play('dummysmile');
                this.addTimeout(() => {
                    this.setDefaultSprite('lesser_dummy_smile.png', undefined, true);
                    this.mouthSprite.destroy();
                    this.eyeSprite = this.addSprite(this.x, this.sprite.y - 107, 'enemies', 'lesser_dummy_eyes4.png').setScale(scale).setDepth(5);
                    this.eyeSprite.play('dummylook');
                }, 1000)

            }
        });
    }

    initStatsCustom() {
        this.health = 30;
        this.isAsleep = true;
    }

    initTutorial(x, y) {
        let dummyShadow = this.addImage(x - 6, y - 58, 'misc', 'shadow_circle.png').setScale(13).setDepth(9999).setAlpha(0);
        this.addTween({
            targets: dummyShadow,
            alpha: 0.4,
            ease: "Cubic.easeInOut",
            y: y - 124,
            scaleX: 8,
            scaleY: 8,
            duration: 1500,
        });

        this.shadow = this.addSprite(globalObjects.player.getX(), globalObjects.player.getY() - 1, 'misc', 'shadow_circle.png').setScale(6).setDepth(9975).setAlpha(0);
        this.addTimeout(() => {
            if (globalObjects.player.getPlayerCastSpellsCount() === 0) {
                globalObjects.magicCircle.disableMovement();

                // TODO Add for main dummy too
                globalObjects.bannerTextManager.setDialog([getLangText('level0_diag_a'), getLangText('level0_diag_b')]);
                globalObjects.bannerTextManager.setPosition(gameConsts.halfWidth, gameConsts.height - 135, 0);
                globalObjects.bannerTextManager.showBanner(false);
                globalObjects.bannerTextManager.setOnFinishFunc(() => {
                    fadeAwaySound(this.bgMusic2,  1200);

                    this.bgMusic = playMusic('bite_down_simplified', 0.9, true);
                    fadeInSound(this.bgMusic, 0.6);

                    this.glowCirc = this.addImage(gameConsts.halfWidth, globalObjects.player.getY(), 'circle', 'circle_highlight_outer.png').setAlpha(0).setDepth(9980);
                    this.glowCirc.currAnim = this.addTween({
                        delay: 200,
                        targets: [this.glowCirc],
                        alpha: 1,
                        ease: "Cubic.easeIn",
                        duration: 900,
                        onComplete: () => {
                            this.glowCirc.currAnim = this.addTween({
                                targets: [this.glowCirc],
                                alpha: 0.7,
                                ease: "Quint.easeOut",
                                duration: 3000,
                                onComplete: () => {
                                    this.hintArrow = this.addImage(gameConsts.halfWidth, globalObjects.player.getY(), 'circle', 'hint_arrows.png').setAlpha(0).setDepth(9981).setScale(1.5);
                                    this.hintArrow.currAnim = this.addTween({
                                        targets: [this.hintArrow],
                                        alpha: 1,
                                        ease: "Cubic.easeInOut",
                                        scaleX: 0.93,
                                        scaleY: 0.93,
                                        duration: 1200,
                                        completeDelay: 800,
                                        onComplete: () => {
                                            this.hintArrow.currAnim = this.addTween({
                                                targets: [this.hintArrow],
                                                alpha: 0,
                                                ease: "Cubic.easeIn",
                                                duration: 1100,
                                            });
                                        }
                                    });

                                }
                            });
                        }
                    });
                    globalObjects.encyclopedia.showButton();
                    globalObjects.options.showButton();
                    globalObjects.magicCircle.enableMovement();
                    messageBus.publish("highlightRunes");
                    this.addTween({
                        targets: dummyShadow,
                        alpha: 0,
                        ease: "Cubic.easeOut",
                        scaleX: 10,
                        scaleY: 10,
                        duration: 400,
                        onComplete: () => {
                            dummyShadow.destroy();
                        }
                    });
                    globalObjects.bannerTextManager.setOnFinishFunc(() => {});
                    globalObjects.bannerTextManager.closeBanner();
                    // this.shadow.setPosition(globalObjects.player.getX(), globalObjects.player.getY() - 1);
                    let spellListener = messageBus.subscribe('spellClicked', () => {
                        this.firstPopupClosed = true;
                        // globalObjects.textPopupManager.hideInfoText();
                        messageBus.publish("unhighlightRunes");
                        if (this.glowCirc.currAnim) {
                            this.glowCirc.currAnim.stop();
                        }
                        if (this.hintArrow && this.hintArrow.currAnim) {
                            this.hintArrow.currAnim.stop();
                            this.addTween({
                                targets: [this.hintArrow],
                                alpha: 0,
                                ease: "Cubic.easeOut",
                                duration: 500,
                            });
                        }
                        this.glowCirc.currAnim = this.addTween({
                            targets: [this.glowCirc],
                            alpha: 0,
                            ease: "Cubic.easeOut",
                            duration: 500,
                        });
                        spellListener.unsubscribe();
                        if (this.currShadowTween) {
                            this.currShadowTween.stop();
                        }
                        this.addTween({
                            targets: this.shadow,
                            alpha: 0,
                            ease: "Cubic.easeOut",
                            scaleX: 8,
                            scaleY: 8,
                            duration: 500,
                        });
                    });
                    this.currShadowTween = this.addTween({
                        targets: this.shadow,
                        alpha: 0.65,
                        ease: "Cubic.easeOut",
                        scaleX: 5.6,
                        scaleY: 5.6,
                        duration: 1000,
                        onComplete: () => {
                            if (globalObjects.player.getPlayerCastSpellsCount() !== 0 && !this.firstPopupClosed) {
                                messageBus.publish("unhighlightRunes");
                                if (this.glowCirc.currAnim) {
                                    this.glowCirc.currAnim.stop();
                                }
                                this.glowCirc.currAnim = this.addTween({
                                    targets: [this.glowCirc],
                                    alpha: 0,
                                    ease: "Cubic.easeOut",
                                    duration: 500,
                                });
                                globalObjects.textPopupManager.hideInfoText();
                                spellListener.unsubscribe();
                                this.addTween({
                                    targets: this.shadow,
                                    alpha: 0,
                                    ease: "Cubic.easeOut",
                                    scaleX: 8,
                                    scaleY: 8,
                                    duration: 750,
                                    onComplete: () => {
                                        this.eyeSprite.play('dummyblink');
                                    }
                                });
                            }
                        }
                    });
                    // this.addTimeout(() => {
                    //     globalObjects.magicCircle.showReadySprite();
                    // }, 1000);
                    this.addTimeout(() => {
                        if (globalObjects.player.getPlayerCastSpellsCount() === 0) {
                            globalObjects.magicCircle.showReadySprite();
                            this.addTimeout(() => {
                                if (globalObjects.player.getPlayerCastSpellsCount() === 0) {
                                    globalObjects.magicCircle.showReadySprite();
                                }
                            }, 6000)
                        }
                    }, 4000)
                });
            }
        }, 1100)
    }

    showArrowRotate() {
        this.addTween({
            targets: [this.arrowRotate1, this.arrowRotate2],
            alpha: 0.8,
            duration: 400,
        });

        this.addTween({
            targets: [this.arrowRotate1],
            rotation: this.arrowRotate1.rotation * -1,
            ease: 'Cubic.easeInOut',
            duration: 1100,
            completeDelay: 100,
            onComplete: () => {
                this.addTween({
                    delay: 900,
                    targets: [this.arrowRotate1, this.arrowRotate2],
                    alpha: 0,
                    duration: 400,
                });
                this.addTween({
                    targets: [this.arrowRotate1],
                    rotation: this.arrowRotate1.rotation * -1,
                    ease: 'Cubic.easeInOut',
                    duration: 1100,
                });
            }
        });
        this.addTween({
            targets: [this.arrowRotate2],
            rotation: this.arrowRotate2.rotation * -1,
            ease: 'Cubic.easeInOut',
            duration: 1100,
            completeDelay: 100,
            onComplete: () => {
                this.addTween({
                    targets: [this.arrowRotate2],
                    rotation: this.arrowRotate2.rotation * -1,
                    ease: 'Cubic.easeInOut',
                    duration: 1100,
                    completeDelay: 3000,
                    onComplete: () => {
                        if (!this.dead && globalObjects.player.getPlayerCastSpellsCount() === 1) {
                            this.showArrowRotate();
                        }
                    }
                });
            }
        });
    }

    initTutorial2() {
        this.addTimeout(() => {
            if (globalObjects.player.getPlayerCastSpellsCount() === 1 && !this.dead) {
                // player only casted 1 spell so far
                globalObjects.textPopupManager.setInfoText(gameConsts.halfWidth, gameConsts.height - 35, getLangText('level0_tut_a'));
                this.arrowRotate1 = this.addSprite(globalObjects.player.getX(), globalObjects.player.getY(), 'circle', 'arrow_rotate.png').setOrigin(0.5, 0.5).setDepth(777).setRotation(0.15).setAlpha(0);
                this.arrowRotate2 = this.addSprite(globalObjects.player.getX(), globalObjects.player.getY(), 'circle', 'arrow_rotate_small.png').setOrigin(0.5, 0.5).setDepth(777).setScale(0.96).setRotation(-0.15).setAlpha(0);
                this.destructibles.push(this.arrowRotate1);
                this.destructibles.push(this.arrowRotate2);
                this.showArrowRotate();

                if (this.glowCirc) {
                    this.glowCirc.currAnim.stop();
                    this.glowCirc.currAnim = this.addTween({
                        targets: [this.glowCirc],
                        alpha: 0.95,
                        ease: "Cubic.easeOut",
                        duration: 1200,
                        onComplete: () => {
                            this.glowCirc.currAnim = this.addTween({
                                targets: [this.glowCirc],
                                alpha: 0.85,
                                ease: "Cubic.easeInOut",
                                duration: 1200,
                            });
                        }
                    });
                }


                let spellListener = messageBus.subscribe('spellClicked', () => {
                    globalObjects.textPopupManager.hideInfoText();
                    spellListener.unsubscribe();
                    this.currShadowTween.stop();
                    this.glowCirc.currAnim.stop();
                    this.glowCirc.currAnim = this.addTween({
                        targets: [this.glowCirc],
                        alpha: 0,
                        ease: "Cubic.easeOut",
                        duration: 500,
                    });
                    this.addTween({
                        targets: this.shadow,
                        alpha: 0,
                        ease: "Cubic.easeOut",
                        scaleX: 14,
                        scaleY: 14,
                        duration: 500,
                        completeDelay: 1000,
                        onComplete: () => {
                            this.attemptTutThree();
                        }
                    });
                });

                this.shadow.setDepth(this.sprite.depth + 1);
                this.currShadowTween = this.addTween({
                    targets: this.shadow,
                    alpha: 0.2,
                    ease: "Cubic.easeOut",
                    scaleX: 13,
                    scaleY: 13,
                    duration: 650,
                    onComplete: () => {
                        if (globalObjects.player.getPlayerCastSpellsCount() > 1 && this.shadow.alpha > 0.54) {
                            globalObjects.textPopupManager.hideInfoText();
                            spellListener.unsubscribe();
                            this.glowCirc.currAnim.stop();
                            this.glowCirc.currAnim = this.addTween({
                                targets: [this.glowCirc],
                                alpha: 0,
                                ease: "Cubic.easeOut",
                                duration: 500,
                            });
                            this.addTween({
                                targets: this.shadow,
                                alpha: 0,
                                ease: "Cubic.easeOut",
                                scaleX: 18,
                                scaleY: 18,
                                duration: 500,
                                completeDelay: 1000,
                                onComplete: () => {
                                    this.attemptTutThree();
                                }
                            });
                        }
                    }
                });
            }
        }, 3200);
    }

    attemptTutThree() {
        if (!this.dead && !this.attemptedTutThree) {
            this.attemptedTutThree = true;
            this.addTimeout(() => {
                this.shadow.destroy();
                if (this.dead) {
                    return;
                }
                if (!this.dead) {
                    this.healthShowText = this.addText(gameConsts.halfWidth, 40, getLangText('level0_tut_b'), {fontFamily: 'garamondbold', color: '#FFFAFA', fontSize: 20}).setOrigin(0.5, 0.5).setAlpha(0).setDepth(1001);
                    this.healthBack = this.addImage(gameConsts.halfWidth, 39, 'blurry', 'battletext_bg.png').setScale(this.healthShowText.width * 0.013, this.healthShowText.height * 0.11).setDepth(1000);
                    this.underline = this.addImage(gameConsts.halfWidth, this.healthBack.y - 11, 'blurry', 'box_length.png').setScale(0, -0.5).setDepth(-1002);
                    this.underline2 = this.addImage(gameConsts.halfWidth, this.healthBack.y + 11, 'blurry', 'box_length.png').setScale(0, 0.5).setDepth(-1002);
                    this.addTween({
                        targets: [this.healthShowText, this.healthBack],
                        alpha: 1,
                        ease: 'Cubic.easeOut',
                        duration: 1000,
                    })
                    this.addTween({
                        targets: [this.underline, this.underline2],
                        scaleX: this.healthShowText.width * 0.016,
                        ease: 'Cubic.easeIn',
                        duration: 800,
                        onComplete: () => {
                            this.addTween({
                                targets: [this.underline, this.underline2],
                                scaleX: this.healthShowText.width * 0.013,
                                ease: 'Cubic.easeOut',
                                duration: 700,
                            })
                        }
                    })
                    // globalObjects.textPopupManager.setInfoText(gameConsts.halfWidth, 30, getLangText('level0_tut_b'), 'left');
                }
                this.addTimeout(() => {
                    if (!this.dead) {
                        this.eyeSprite.play('dummyblink');
                    }

                }, 800);
                this.glowHealth = this.addSprite(gameConsts.halfWidth, 12, 'blurry', 'glow_flat_green.webp').setDepth(0).setAlpha(0).setScale(0.28, 1.5);
                this.glowHealth2 = this.addSprite(gameConsts.halfWidth, 20, 'blurry', 'glow_flat_red.webp').setDepth(0).setAlpha(1.1).setScale(0.5, 2);
                this.addTween({
                    targets: this.glowHealth2,
                    scaleX: 3,
                    ease: 'Quad.easeOut',
                    duration: 800,
                    onComplete: () => {
                        this.glowHealth2.destroy();
                    }
                });
                this.addTween({
                    targets: this.glowHealth2,
                    scaleY: 0,
                    alpha: 0,
                    ease: 'Quad.easeIn',
                    duration: 800,
                });

                this.addTween({
                    targets: this.glowHealth,
                    alpha: 0.75,
                    scaleX: 1.3,
                    ease: 'Cubic.easeInOut',
                    duration: 1500,
                    onComplete: () => {
                        this.addTween({
                            targets: this.glowHealth,
                            alpha: 0,
                            scaleX: 1.2,
                            ease: 'Cubic.easeIn',
                            duration: 1500,
                            onComplete: () => {
                                this.addTween({
                                    targets: this.glowHealth,
                                    alpha: 0.55,
                                    scaleX: 1.35,
                                    ease: 'Cubic.easeInOut',
                                    duration: 1500,
                                    onComplete: () => {
                                        this.addTween({
                                            targets: this.glowHealth,
                                            alpha: 0,
                                            duration: 1000,
                                        });
                                    }
                                });
                            }
                        });
                    }
                });
            }, 1000);
        }
    }

    setHealth(newHealth) {
        super.setHealth(newHealth);
        if (!this.lostHat) {
            this.lostHat = true;
            this.helmet.y -= 2;
            this.helmet.x -= 2;
            playSound('clunk');
            this.addTween({
                targets: this.helmet,
                rotation: "-=6.5",
                duration: 900,
                onComplete: () => {
                    this.addTween({
                        delay: 500,
                        targets: this.helmet,
                        alpha: 0,
                        ease: 'Quad.easeIn',
                        duration: 1000,
                    })
                }
            })
            this.addTween({
                targets: this.helmet,
                x: '-=118',
                duration: 940,
            })
            this.addTween({
                targets: this.helmet,
                y: '+=200',
                ease: 'Back.easeIn',
                easeParams: [3],
                duration: 900,
                onComplete: () => {
                    this.helmet.y -= 7;
                    playSound('clunk2', 0.7).detune = -100;
                    this.addTween({
                        targets: this.helmet,
                        y: '+=7',
                        ease: 'Bounce.easeOut',
                        rotation: 0.5,
                        easeParams: [2.5],
                        duration: 700,
                    })
                }
            })
        }
        if (newHealth > 0) {
            if (newHealth > 14) {
                this.eyeSprite.play('dummyblink');
            } else {
                let oldOriginX = this.sprite.originX;
                let oldOriginY = this.sprite.originY;
                this.setDefaultSprite('lesser_dummy_hurt.png').setOrigin(oldOriginX, oldOriginY);
                // this.eyeSprite.destroy();
                let ouch1 = this.addImage(this.sprite.x + 8, this.sprite.y - 151, 'enemies', 'dizzystar.png').setRotation(Math.random() * 3).setScale(0.6);
                let ouch2 = this.addImage(this.sprite.x + 8, this.sprite.y - 144, 'enemies', 'dizzystar.png').setRotation(Math.random() * 3).setScale(1);
                this.addTween({
                    targets: ouch1,
                    x: "+=55",
                    y: "-=60",
                    ease: 'Quart.easeOut',
                    duration: 660
                })
                this.addTween({
                    targets: ouch1,
                    scaleX: 0,
                    scaleY: 0,
                    ease: 'Quad.easeIn',
                    duration: 660
                })
                this.addTween({
                    targets: ouch1,
                    rotation: "-=5",
                    duration: 660
                })
                this.addTween({
                    targets: ouch2,
                    x: "+=90",
                    y: "+=50",
                    ease: 'Quart.easeOut',
                    duration: 800
                })
                this.addTween({
                    targets: ouch2,
                    scaleX: 0,
                    scaleY: 0,
                    ease: 'Quad.easeIn',
                    duration: 800
                })
                this.addTween({
                    targets: ouch2,
                    rotation: "+=5.5",
                    duration: 800
                })
            }

            this.addTween({
                targets: [this.sprite, this.eyeSprite],
                rotation: -0.1,
                ease: "Quart.easeOut",
                duration: 50,
                onComplete: () => {
                    this.addTween({
                        targets: [this.sprite, this.eyeSprite],
                        rotation: 0,
                        ease: "Back.easeOut",
                        duration: 400,
                    });
                }
            });
            this.addTween({
                targets: [this.eyeSprite],
                x: "-=3",
                ease: "Quart.easeOut",
                duration: 50,
                onComplete: () => {
                    this.addTween({
                        targets: [this.eyeSprite],
                        x: this.x,
                        ease: "Back.easeOut",
                        duration: 400,
                    });
                }
            });
        }
    }

    die() {
        if (this.dead) {
            return;
        }
        super.die();

        if (this.healthShowText) {
            this.addTween({
                targets: [this.healthShowText, this.healthBack, this.underline, this.underline2],
                alpha: 0,
                ease: 'Cubic.easeOut',
                duration: 1000
            })
            this.addTween({
                targets: [this.underline, this.underline2],
                scaleX: 0,
                ease: 'Cubic.easeOut',
                duration: 1000
            })
        }
        globalObjects.textPopupManager.hideInfoText();
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
        if (this.eyeSprite) {
            this.eyeSprite.destroy();
        }
        if (this.glowCirc) {
            this.glowCirc.destroy();
        }

        this.setDefaultSprite('lesser_dummy_hurt.png', this.sprite.scaleX);
        this.sprite.setOrigin(0.5, 0.99);

        this.addTween({
            targets: this.sprite,
            rotation: -1.25,
            ease: "Cubic.easeIn",
            duration: 900,
            onComplete: () => {
                this.setSprite('lesser_dummy_dead.png', this.sprite.scaleX);
                this.sprite.rotation = 0;
                this.sprite.y += 54;
                this.sprite.x -= 81;
                this.showVictory();
                playSound('lesserfall', 0.75);
            }
        });

        this.addTween({
            targets: this.sprite,
            x: "+=35",
            ease: "Cubic.easeOut",
            duration: 400,
        });
    }

    showVictory() {
        globalObjects.encyclopedia.hideButton();
        globalObjects.options.hideButton();
        globalObjects.magicCircle.disableMovement();
        let banner = this.addSprite(gameConsts.halfWidth, gameConsts.halfHeight - 35, 'misc', 'victory_banner.png').setScale(100, 1.2).setDepth(9998).setAlpha(0);
        let victoryText = this.addSprite(gameConsts.halfWidth, gameConsts.halfHeight - 44, 'misc', 'victory_text.png').setScale(0.95).setDepth(9998).setAlpha(0);
        let continueText = this.addText(gameConsts.halfWidth, gameConsts.halfHeight + 2, getLangText('cont_ui'), {fontFamily: 'garamondmax', color: '#F0F0F0', fontSize: 18}).setAlpha(0).setOrigin(0.5, 0.5).setAlign('center').setDepth(9998);

        this.addTween({
            targets: banner,
            alpha: 0.8,
            duration: 500,
        });

        this.addTween({
            targets: [victoryText],
            alpha: 1,
            ease: 'Quad.easeOut',
            duration: 500,
        });

        this.addTween({
            targets: victoryText,
            scaleX: 1,
            scaleY: 1,
            duration: 800,
        });
        this.addTimeout(() => {
            continueText.alpha = 1;
            if (canvas) {
                canvas.style.cursor = 'pointer';
            }
            this.dieClickBlocker.setOnMouseUpFunc(() => {
                if (canvas) {
                    canvas.style.cursor = 'default';
                }
                this.dieClickBlocker.destroy();

                this.addTween({
                    targets: this.sprite,
                    alpha: 0,
                    duration: 800,
                });
                this.addTween({
                    targets: this.sprite,
                    alpha: 0,
                    scaleX: this.sprite.startScale * 1.03,
                    scaleY: this.sprite.startScale * 1.03,
                    y: "+=5",
                    ease: 'Quad.easeIn',
                    duration: 800,
                    onComplete: () => {
                        this.destroy();
                    }
                });
                continueText.destroy();
                this.addTween({
                    targets: [victoryText, banner],
                    alpha: 0,
                    duration: 400,
                    completeDelay: 200,
                    onComplete: () => {
                        globalObjects.magicCircle.enableMovement();
                        victoryText.destroy();
                        banner.destroy();
                        beginLevel(1);
                    }
                });
            })
        }, 1000);
    }

    initAttacks() {
        this.attacks = [
            [
                // 0
                {
                    name: "}999 ",
                    chargeAmt: 999,
                    damage: 999,
                    attackFinishFunction: () => {
                        let dmgEffect = this.addSprite(gameConsts.halfWidth + (Math.random() - 0.5) * 20, globalObjects.player.getY() - 185, 'spells', 'damageEffect3.png').setDepth(998).setScale(1.5);
                        this.addTimeout(() => {
                            dmgEffect.destroy();
                        }, 150)
                    }
                }
            ]
        ];
    }
}
