class PostFightScreen {
    constructor(scene) {
        this.scene = scene;
        this.bgShade = null;
        this.backing = null;
        this.titleText = null;
        this.healthLeftText = null;
        this.locketSprite = null;
        this.locketDialogImage = null;
        this.locketDialog = null;
        this.locketMusic = null;
        this.locketRecentlyClicked = false;
        this.locketDialogIndex = 0;
        this.isActive = false;
    }

    startGloom() {
        console.log("start gloom");
        if (!this.gloom) {
            this.gloom = this.scene.add.image(gameConsts.width + 600, gameConsts.halfHeight - 160, 'blurry', 'gloom.webp').setScale(5.4, 6).setDepth(100002).setAlpha(0).setBlendMode(Phaser.BlendModes.MULTIPLY)
        }
        this.gloom.setPosition(gameConsts.width + 600, gameConsts.halfHeight - 155)
        if (this.gloom.currAnim) {
            this.gloom.currAnim.stop();
        }
        this.gloom.currAnim = PhaserScene.tweens.add({
            targets: [this.gloom],
            alpha: 0.2,
            duration: 1000,
        })
    }

    initAssets(isWin = true, isPractice = false) {
        this.locketIsOpen = false;
        this.locketIsClosable = false;
        if (!this.bgShade) {
            this.bgShade = this.scene.add.sprite(gameConsts.halfWidth, gameConsts.halfHeight, 'blackPixel').setDepth(100000).setAlpha(0).setScale(500, 500);
        }
        if (!this.backing) {
            this.backing = this.scene.add.sprite(gameConsts.halfWidth, gameConsts.halfHeight - 30, 'ui', 'battleOverScreen.png').setDepth(100000).setAlpha(0);
        }
        if (!this.titleText) {
            this.titleText = this.scene.add.text(gameConsts.halfWidth - 225, gameConsts.halfHeight - 268, '(placeholder title)', {fontFamily: 'garamondmax', fontSize: 42, color: '#000000', align: 'left'}).setAlpha(0).setOrigin(0, 0.5).setDepth(100000);
        }
        if (!this.healthLeftText) {
            this.healthLeftText = this.scene.add.text(gameConsts.halfWidth - 225, gameConsts.halfHeight - 200, getLangText('post_fight_health'), {fontFamily: 'garamondmax', fontSize: 26, color: '#000000', align: 'left'}).setAlpha(0).setOrigin(0, 0.5).setDepth(100000);
        }
        if (!this.locketSprite) {
            this.locketSprite = this.scene.add.sprite(gameConsts.width + 300, gameConsts.halfHeight - 120, 'misc', 'locket1.png').setScale(0.75).setDepth(100003).setAlpha(0).setOrigin(0.5, 0.5);
        }
        if (!this.locketDialogImage) {
            this.locketDialogImage = this.scene.add.sprite(gameConsts.halfWidth - 146, gameConsts.halfHeight - 170, 'lowq', 'story_img_1.png').setDepth(100003).setAlpha(0).setOrigin(0.46, 0.1).setBlendMode(Phaser.BlendModes.MULTIPLY);
        }
        if (!this.locketDialog) {
            this.locketDialog = this.scene.add.text(gameConsts.halfWidth - 225, gameConsts.halfHeight - 85, '(placeholder story)', {fontFamily: 'garamondmax', fontSize: 24, color: '#000000', align: 'left'}).setAlpha(0).setOrigin(0, 0).setDepth(100000);
        }
        if (!this.newRuneAnnounce) {
            this.newRuneAnnounce =  this.scene.add.text(gameConsts.halfWidth - 225, gameConsts.halfHeight - 154, getLangText('post_fight_newrune'), {fontFamily: 'garamondmax', fontSize: 26, color: '#000000', align: 'left'}).setAlpha(0).setOrigin(0, 0.5).setDepth(100000);
        }
        if (!this.newRuneDesc) {
            this.newRuneDesc =  this.scene.add.text(gameConsts.halfWidth - 225, gameConsts.halfHeight - 120, '(insert rune description)', {fontFamily: 'garamondmax', fontSize: 22, color: '#000000', align: 'left'}).setAlpha(0).setOrigin(0, 0).setDepth(100000);
        }
        if (!this.newRuneIcon) {
            this.newRuneIcon =  this.scene.add.image(gameConsts.halfWidth - 55, gameConsts.halfHeight - 158, 'tutorial', 'rune_matter_large.png').setScale(0).setDepth(100002).setAlpha(0);
        }
        if (!this.flashObj) {
            this.flashObj = this.scene.add.image(gameConsts.width * 0.76, gameConsts.halfHeight - 160, 'blurry', 'flash.webp').setScale(0).setDepth(100002).setAlpha(0.5);
        }

        if (!this.codeText) {
            this.codeText = this.scene.add.text(gameConsts.halfWidth, gameConsts.halfHeight + 80, 'placeholder code: ', {fontFamily: 'garamondmax', fontSize: 24, color: '#000000', align: 'center'}).setAlpha(0).setOrigin(0.5, 1).setDepth(100000);
        }
        if (!this.listOfCodes) {
            this.listOfCodes = [];
            for (let i = 0; i < 5; i++) {
                let newImage = this.scene.add.sprite(gameConsts.halfWidth - 100 + i * 50, this.codeText.y + 76, 'circle', 'bright_rune_matter.png').setScale(0.92).setAlpha(0).setDepth(100000);
                //newImage.setVisible(false);
                this.listOfCodes.push(newImage);
            }
        }

        if (!this.showCodeBtn) {
            this.showCodeBtn = new Button({
                normal: {
                    atlas: "ui",
                    ref: "more.png",
                    visible: true,
                    alpha: 0.85,
                    x: gameConsts.halfWidth,
                    y: this.codeText.y - 13,
                },
                hover: {
                    atlas: "ui",
                    alpha: 1,
                    ref: "more_hover.png",
                },
                press: {
                    atlas: "ui",
                    alpha: 0.8,
                    ref: "more_press.png",
                },
                disable: {
                    atlas: "ui",
                    ref: "more_press.png",
                    alpha: 0
                },
                onHover: () => {
                    if (canvas) {
                        canvas.style.cursor = 'pointer';
                    }
                },
                onHoverOut: () => {
                    if (canvas) {
                        canvas.style.cursor = 'default';
                    }
                },
                onMouseUp: () => {
                    this.showCodeBtn.setState(DISABLE);
                    if (canvas) {
                        canvas.style.cursor = 'default';
                    }
                    for (let i = 0; i < this.listOfCodes.length; i++) {
                        this.listOfCodes[i].visible = true;
                    }
                    PhaserScene.tweens.add({
                        targets: this.listOfCodes,
                        alpha: 1,
                        ease: 'Cubic.easeOut',
                        duration: 250,
                    });
                }
            });
            this.showCodeBtn.setDepth(100000);
            this.showCodeBtn.setState(DISABLE)
        }
        if (!this.continueButton) {
            this.continueButton = new Button({
                normal: {
                    atlas: "ui",
                    ref: "nextLevel.png",
                    visible: true,
                    alpha: 0.95,
                    x: gameConsts.halfWidth - 161,
                    y: gameConsts.halfHeight + 226,
                },
                hover: {
                    atlas: "ui",
                    alpha: 1,
                    ref: "nextLevel_hover.png",
                },
                press: {
                    atlas: "ui",
                    alpha: 1,
                    ref: "nextLevel_press.png",
                },
                disable: {
                    atlas: "ui",
                    ref: "nextLevel_press.png",
                    alpha: 0
                },
                onHover: () => {
                    playSound('button_hover');
                    if (canvas) {
                        canvas.style.cursor = 'pointer';
                    }
                },
                onHoverOut: () => {
                    if (canvas) {
                        canvas.style.cursor = 'default';
                    }
                },
                onMouseUp: () => {

                }
            });
            this.continueButton.addText(getLangText('post_fight_skip_training'), {fontFamily: 'garamondmax', fontSize: 19, color: '#000000', align: 'center'});
            let text = this.continueButton.getText();
            text.alpha = 0;
            this.continueButton.setOnHoverFunc(() => {
                playSound('button_hover');
                if (canvas) {
                    canvas.style.cursor = 'pointer';
                }
                text.alpha = 1;
            });
            this.continueButton.setOnHoverOutFunc(() => {
                if (canvas) {
                    canvas.style.cursor = 'default';
                }
                text.alpha = 0.7;
            })
            this.continueButton.setDepth(100000);
        }
        if (!this.trainingButton) {
            this.trainingButton = new Button({
                normal: {
                    atlas: "ui",
                    ref: "practice.png",
                    visible: true,
                    alpha: 0.95,
                    x: gameConsts.halfWidth,
                    y: gameConsts.halfHeight + 175,
                },
                hover: {
                    atlas: "ui",
                    alpha: 1,
                    ref: "practice_hover.png",
                },
                press: {
                    atlas: "ui",
                    alpha: 1,
                    ref: "practice_press.png",
                },
                disable: {
                    atlas: "ui",
                    ref: "practice_press.png",
                    alpha: 0
                },
                onHover: () => {
                    playSound('button_hover');
                    if (canvas) {
                        canvas.style.cursor = 'pointer';
                    }
                },
                onHoverOut: () => {
                    if (canvas) {
                        canvas.style.cursor = 'default';
                    }
                },
                onMouseUp: () => {

                }
            });
            this.trainingButton.addText(getLangText('post_fight_training'), {fontFamily: 'garamondmax', fontSize: 26, color: '#000000', align: 'center'});
            this.trainingButton.setDepth(100000);
            this.trainingButton.setState(DISABLE);

            this.trainingRuneIcon =  this.scene.add.image(this.trainingButton.getXPos() - 128, this.trainingButton.getYPos(), 'tutorial', 'rune_matter_large.png').setScale(0).setDepth(100002).setAlpha(0);
        }

        if (!this.gloom) {
            this.gloom = this.scene.add.image(this.locketSprite.x, this.locketSprite.y - 55, 'blurry', 'gloom.webp').setScale(5.4, 6).setDepth(100002).setAlpha(0).setBlendMode(Phaser.BlendModes.MULTIPLY)
        }

        if (!this.locketButton) {
            this.locketButton = new Button({
                normal: {
                    ref: "blackPixel",
                    alpha: 0,
                    x: gameConsts.width * 0.8,
                    y: gameConsts.halfHeight - 150,
                    scaleX: 110,
                    scaleY: 110
                },
                disable: {
                    alpha: 0
                },
                onHover: () => {
                    if (canvas) {
                        canvas.style.cursor = 'pointer';
                    }
                    if (this.gloom.currAnim) {
                        this.gloom.currAnim.stop();
                    }
                    this.gloom.currAnim = PhaserScene.tweens.add({
                        targets: this.gloom,
                        scaleX: 8,
                        scaleY: 9.3,
                        alpha: 0.23,
                        duration: 800,
                        ease: 'Cubic.easeOut',
                    })
                },
                onHoverOut: () => {
                    if (canvas) {
                        canvas.style.cursor = 'default';
                    }
                    if (this.gloom.currAnim) {
                        this.gloom.currAnim.stop();
                    }
                    this.gloom.currAnim = PhaserScene.tweens.add({
                        targets: this.gloom,
                        scaleX: 5,
                        scaleY: 6,
                        alpha: 0.27,
                        duration: 500,
                        ease: 'Back.easeOut',
                    })
                },
                onMouseUp: () => {
                    this.locketRecentlyClicked = true;
                    if (!this.locketIsOpen) {
                        this.openLocket();
                    } else if (this.locketIsClosable) {
                        playSound('locket_close');
                        if (this.locketSprite.frame.name == 'locket1.png') {
                            globalObjects.bannerTextManager.setDialog(["I must press on."]);
                            globalObjects.bannerTextManager.setPosition(gameConsts.halfWidth, gameConsts.height - 130, 0);
                            globalObjects.bannerTextManager.showBanner();
                        }


                        this.locketSprite.setFrame('locket4.png').setOrigin(0.5, 0.8);
                        this.locketSprite.setScale(this.locketSprite.scaleX + 0.02);
                        PhaserScene.tweens.add({
                            targets: [this.locketSprite],
                            scaleX: 0.75,
                            scaleY: 0.75,
                            ease: 'Cubic.easeOut',
                            duration: 250,
                        });
                    } else {
                        this.closeLocket();
                    }
                }
            });
            this.locketButton.setDepth(100001);
        }

        if (!this.subscription) {
            this.subscription = messageBus.subscribe("language_switch", (lang) => {
                if (gameVars.currLevel <= 6 && gameVars.currLevel >= 0) {
                    this.trainingButton.setText(getLangText('post_fight_training'))
                } else {
                    this.trainingButton.setText(getLangText('post_fight_no_training'))
                }
                this.setTextUI(gameVars.currLevel);
            });
        }
        this.locketButton.setState(DISABLE);

        this.backing.setScale(0.98);
        this.titleText.setScale(0.97);
        this.healthLeftText.setScale(0.97);
        this.newRuneAnnounce.setScale(0.97);
        this.newRuneIcon.setScale(0.4);
        this.trainingRuneIcon.setScale(0.4).setVisible(true);
        if (isWin) {
            if (!this.locketRecentlyClicked) {
                this.locketSprite.visible = true;
                this.locketSprite.x = gameConsts.width + 300;
                this.locketSprite.y = gameConsts.halfHeight - 105;
                this.locketSprite.setScale(0.75);
                this.locketSprite.setFrame('locket1.png').setOrigin(0.5, 0.8);
            }

            if (!isPractice) {
                this.gloom.visible = true;
                this.gloom.setPosition(this.locketSprite.x, this.locketSprite.y - 50);
                if (this.gloom.currAnim) {
                    this.gloom.currAnim.stop();
                }
                this.gloom.currAnim = PhaserScene.tweens.add({
                    targets: [this.gloom],
                    alpha: 0.25,
                    ease: 'Cubic.easeOut',
                    duration: 400,
                })
            } else {
                this.gloom.visible = false
            }
        }
        this.continueButton.setState(DISABLE);
        if (gameVars.currLevel <= 6 && gameVars.currLevel >= 0) {
            this.trainingButton.setText(getLangText('post_fight_training'))
            this.trainingButton.setState(NORMAL);
            setTimeout(() => {
                if (this.trainingButton.getState() !== DISABLE) {
                    this.continueButton.setText(getLangText('post_fight_skip_training'));
                    let text = this.continueButton.getText();

                    if (gameVars.currLevel < gameVars.latestLevel) {
                        text.alpha = 0.7;
                    } else {
                        text.alpha = 0;
                    }
                    this.continueButton.setState(NORMAL);
                }
            }, 3000);
        } else {
            this.trainingButton.setText(getLangText('post_fight_no_training'))
            this.trainingButton.setState(NORMAL);
            this.continueButton.setState(DISABLE);
            this.continueButton.setText(getLangText('post_fight_continue'));
            this.trainingRuneIcon.visible = false;
        }


        PhaserScene.tweens.add({
            targets: [this.bgShade],
            alpha: 0.4,
        });

        PhaserScene.tweens.add({
            targets: [this.backing, this.titleText],
            scaleX: 1,
            scaleY: 1,
            alpha: 1,
            ease: 'Back.easeOut',
            duration: 300,
            onComplete: () => {

                PhaserScene.tweens.add({
                    delay: 200,
                    targets: [this.newRuneIcon, this.trainingRuneIcon],
                    scaleX: 0.435,
                    scaleY: 0.435,
                    alpha: 1,
                    duration: 250,
                    onComplete: () => {
                        if (this.canShowCodeBtn) {
                            this.showCodeBtn.setState(NORMAL);
                        }
                    }
                });

                PhaserScene.tweens.add({
                    delay: 200,
                    targets: [this.healthLeftText, this.newRuneAnnounce, this.newRuneDesc],
                    scaleX: 1,
                    scaleY: 1,
                    alpha: 1,
                    duration: 250,
                });
                PhaserScene.tweens.add({
                    delay: 500,
                    targets: [this.codeText],
                    scaleX: 1,
                    scaleY: 1,
                    alpha: 1,
                    duration: 250,
                });
                if (isWin) {
                    if (this.locketRecentlyClicked) {
                        this.locketSprite.visible = false;
                    } else {
                        this.locketSprite.visible = true;
                    }
                    PhaserScene.tweens.add({
                        delay: 400,
                        targets: [this.locketSprite],
                        alpha: 1,
                        duration: 700,
                        onStart: () => {
                            if (!this.locketRecentlyClicked) {
                                this.locketButton.setState(NORMAL);
                            } else {
                                return;
                            }

                            PhaserScene.tweens.add({
                                targets: [this.locketSprite, this.gloom],
                                x: gameConsts.width * 0.76,
                                ease: 'Cubic.easeOut',
                                duration: 1000,
                                onComplete: () => {
                                    let oldScale = this.locketSprite.scaleX;
                                    this.locketSprite.setFrame('locket2.png').setOrigin(0.5, 0.8).setScale(oldScale * 1.05)
                                    PhaserScene.tweens.add({
                                        targets: this.locketSprite,
                                        scaleY: oldScale,
                                        scaleX: oldScale,
                                        ease: 'Back.easeOut',
                                        duration: 300,
                                    });

                                    this.flashObj.alpha = 0.5;
                                    this.scene.tweens.add({
                                        targets: this.flashObj,
                                        scaleX: 1.7,
                                        scaleY: 1.7,
                                        ease: 'Cubic.easeIn',
                                        rotation: "+=0.1",
                                        duration: 300,
                                        alpha: 1,
                                        onComplete: () => {
                                            this.scene.tweens.add({
                                                targets: this.flashObj,
                                                scaleX: 0,
                                                scaleY: 0,
                                                ease: 'Cubic.easeOut',
                                                rotation: "+=0.15",
                                                duration: 500,
                                                onComplete: () => {
                                                    this.flashObj.alpha = 0;
                                                    this.flashObj.rotation = -0.2;
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            }
        });
    }

    closeLocket() {
        this.locketIsClosable = true;
        PhaserScene.tweens.add({
            delay: 50,
            targets: [this.locketSprite],
            scaleX: 0.75,
            scaleY: 0.75,
            x: gameConsts.width * 0.8 + 10,
            y: gameConsts.halfHeight - 115,
            ease: 'Cubic.easeInOut',
            duration: 400
        });
        // playSound('locket_close');

        this.returnStatText();
    }

    openLocket() {
        if (this.locketSprite) {
            playSound('locket_open');
            this.locketIsOpen = true;
            this.locketSprite.setFrame('locket3.png').setOrigin(0.5, 0.8);
            this.locketSprite.setScale(this.locketSprite.scaleX + 0.02);
            if (this.gloom.currAnim) {
                this.gloom.currAnim.stop();
            }
            this.gloom.currAnim = PhaserScene.tweens.add({
                targets: [this.gloom],
                alpha: 0,
                ease: 'Cubic.easeOut',
                duration: 301,
                onComplete: () => {
                    this.gloom.visible = false;
                }
            })
            PhaserScene.tweens.add({
                targets: [this.locketSprite],
                scaleX: 0.75,
                scaleY: 0.75,
                y: '-=35',
                x: "+=12",
                ease: 'Cubic.easeOut',
                duration: 250,
            });
            this.showStoryText(gameVars.currLevel);
            // PhaserScene.tweens.add({
            //     targets: [this.locketSprite],
            //     x: gameConsts.halfWidth + 120,
            //     y: gameConsts.halfHeight - 310,
            //     duration: 410,
            //     ease: 'Cubic.easeOut'
            // });
            // PhaserScene.tweens.add({
            //     targets: [this.locketSprite],
            //     scaleX: 1,
            //     scaleY: 1,
            //     duration: 410,
            //     ease: 'Quad.easeOut'
            // });
        }
    }

    clearWindSound() {
        if (this.windSfx) {
            fadeAwaySound(this.windSfx, 1500);
        }
    }

    createWinScreen(level = 0) {
        this.windSfx = playSound('wind', 0.01, true);
        this.windSfx.detune = -700;
        fadeInSound(this.windSfx, 0.85, 2000);
        globalObjects.encyclopedia.showButton();
        globalObjects.options.showButton();
        if (level > gameVars.latestLevel) {
            console.log("set latest level");
            gameVars.latestLevel = level;
            localStorage.setItem("latestLevel", level.toString());
        }

        gameVars.currLevel = level;
        this.createWinScreenUI(level);
        this.continueButton.setOnMouseUpFunc(() => {
            this.locketRecentlyClicked = false;
            if (this.trainingButton.getState() !== DISABLE) {
                this.moveToNextLevel(level);
                // messageBus.publish("showConfirmPopup", () => {
                //     this.moveToNextLevel(level);
                // })
            } else {
                this.moveToNextLevel(level);
            }
        });
        this.trainingButton.setOnMouseUpFunc(() => {
            playSound('button_click');
            this.clearPostFightScreen();
            if (level < 7) {
                beginPreLevel(-level);
            } else {
                beginPreLevel(level + 1);
            }
            if (canvas) {
                canvas.style.cursor = 'default';
            }
        });

    }

    moveToNextLevel(level) {
        playSound('button_click');
        this.clearPostFightScreen();
        beginPreLevel(level + 1);
        if (canvas) {
            canvas.style.cursor = 'default';
        }
    }

    createWinScreenMin(level = 0) {
        globalObjects.encyclopedia.showButton();
        globalObjects.options.showButton();
        this.createWinScreenUIMin(level);

        this.continueButton.setState(DISABLE);
        this.trainingButton.setState(NORMAL);
        this.trainingButton.setOnMouseUpFunc(() => {
            this.locketRecentlyClicked = false;
            this.clearPostFightScreen();
            beginPreLevel(level + 1);
            if (canvas) {
                canvas.style.cursor = 'default';
            }
        });
    }

    createWinScreenBoom(level = 0) {
        this.createWinScreenUI(level);
        this.continueButton.setState(DISABLE);
        this.trainingButton.setState(NORMAL);
        this.trainingButton.setOnMouseUpFunc(() => {
            this.locketRecentlyClicked = false;
            this.clearPostFightScreen(false);
            messageBus.publish('robotExplosion');
            if (canvas) {
                canvas.style.cursor = 'default';
            }
        });
    }

    createWinScreenUI(level = 0) {
        this.isMin = false;
        this.isCreated = true;
        if (this.trainingRuneIcon) {
            this.trainingRuneIcon.visible = true;
        }
        this.locketRecentlyClicked = false;

        this.initAssets(true);
        globalObjects.magicCircle.disableMovement();

        this.newRuneDesc.alpha = 0;
        this.newRuneIcon.visible = true;
        this.gloom.alpha = 0;

        this.newRuneIcon.setFrame(this.getNewRuneFrame(level));
        this.trainingRuneIcon.setFrame(this.getNewRuneFrame(level));

        this.setTextUI(level);
        this.locketDialogImage.setFrame('story_img_' + level + ".png");
        globalObjects.bannerTextManager.setDialog(this.locketDialog);
    }

    setTextUI(level = gameVars.currLevel) {

        if (this.isMin) {
            this.titleText.setText(getLangText('post_fight_title2'));
            this.newRuneAnnounce.setText(' ');
            this.newRuneDesc.setText(' ')
            this.codeText.setText(' ');
            this.trainingButton.setText(getLangText('post_fight_no_training'));
            this.canShowCodeBtn = false;
        } else {
            this.titleText.setText(getLangText('post_fight_title'));
            // this.spellsCastText.setText("Spells Cast: " + globalObjects.player.getPlayerCastSpellsCount());
            this.newRuneAnnounce.setText(this.getNewRuneAnnounce(level));
            this.newRuneDesc.setText(this.getNewRuneDesc(level));
            if (gameVars.hasCheated) {
                this.codeText.setText(getLangText('level_code_cheat'));
                this.codeText.setFontSize(20);
                this.canShowCodeBtn = false;
            } else {
                this.canShowCodeBtn = true;
                this.codeText.setText(getLangText('level_code'));
                this.codeText.setFontSize(24);
                this.getLevelCodes(level);
            }
        }

        this.healthLeftText.setText(getLangText('post_fight_health') + globalObjects.player.getHealth() + "/" + globalObjects.player.getHealthMax());
        this.locketDialog.setText(this.getStoryDialog(level));
        this.titleText.setText(getLangText('post_fight_day') + level + getLangText('post_fight_day2'));
    }

    getLevelCodes(level) {
        let listOfCodes = [
            ["bright_rune_matter.png", "bright_rune_matter.png", "bright_rune_matter.png", "bright_rune_matter.png", "bright_rune_matter.png"],
            ["bright_rune_mind.png", "bright_rune_matter.png", "bright_rune_mind.png", "bright_rune_matter.png", "bright_rune_strike.png"],
            ["bright_rune_mind.png", "bright_rune_matter.png", "bright_rune_mind.png", "bright_rune_matter.png", "bright_rune_protect.png"],
            ["bright_rune_reinforce.png", "bright_rune_enhance.png", "bright_rune_enhance.png", "bright_rune_enhance.png", "bright_rune_protect.png"],
            ["bright_rune_time.png", "bright_rune_time.png", "bright_rune_time.png", "bright_rune_time.png", "bright_rune_reinforce.png"],
            ["bright_rune_void.png", "bright_rune_void.png", "bright_rune_void.png", "bright_rune_void.png", "bright_rune_enhance.png"],
            ["bright_rune_matter.png", "bright_rune_mind.png", "bright_rune_time.png", "bright_rune_void.png", "bright_rune_strike.png"],
            ["bright_rune_enhance.png", "bright_rune_enhance.png", "bright_rune_enhance.png", "bright_rune_unload.png", "bright_rune_unload.png"],
            ["bright_rune_mind.png", "bright_rune_strike.png", "bright_rune_mind.png", "bright_rune_unload.png", "bright_rune_mind.png"],
            ["bright_rune_unload.png", "bright_rune_protect.png", "bright_rune_protect.png", "bright_rune_protect.png", "bright_rune_protect.png"],
            ["bright_rune_reinforce.png", "bright_rune_matter.png", "bright_rune_mind.png", "bright_rune_time.png", "bright_rune_void.png"],
            ["bright_rune_unload.png", "bright_rune_unload.png", "bright_rune_unload.png", "bright_rune_unload.png", "bright_rune_reinforce.png"],
            ["bright_rune_reinforce.png", "bright_rune_time.png", "bright_rune_protect.png", "bright_rune_unload.png", "bright_rune_void.png"],
            ["bright_rune_matter.png", "bright_rune_matter.png", "bright_rune_matter.png", "bright_rune_matter.png", "bright_rune_matter.png"],

        ];
        for (let i in this.listOfCodes) {
            this.listOfCodes[i].setFrame(listOfCodes[level][i]);
        }
    }

    createWinScreenUIMin(level = 0) {
        this.isMin = true;
        this.isCreated = true;
        this.initAssets(true, true);
        globalObjects.magicCircle.disableMovement();
        this.newRuneIcon.visible = false;
        this.trainingRuneIcon.visible = false;
        // this.newRuneIcon.setFrame(' ');
        this.locketDialogImage.setFrame('story_img_' + level + ".png");

        this.continueButton.setState(DISABLE);

        this.setTextUI(level);
        this.trainingButton.setState(NORMAL);
        this.trainingButton.setOnMouseUpFunc(() => {
            this.locketRecentlyClicked = false;
            this.clearPostFightScreen();
            beginPreLevel(level + 1);
            if (canvas) {
                canvas.style.cursor = 'default';
            }
        });
        globalObjects.bannerTextManager.setDialog(this.locketDialog);
    }

    createLoseScreen(level) {
        this.initAssets(false);
        this.titleText.setText("You Have Fallen");
        // healthLeftText
        this.codeText.setText("CHEAT CODE: ABCDE");
        this.continueButton.setOnMouseUpFunc(() => {
            this.locketRecentlyClicked = false;
            this.clearPostFightScreen();
            beginPreLevel(level);
            if (canvas) {
                canvas.style.cursor = 'default';
            }
        });
        this.trainingButton.setOnMouseUpFunc(() => {
            this.clearPostFightScreen();
            let trainLevel = -level - 1;
            beginPreLevel(trainLevel);
            if (canvas) {
                canvas.style.cursor = 'default';
            }
        });
    }

    showStoryText(level) {
        let objectsToFade = [this.healthLeftText, this.codeText, this.newRuneAnnounce, this.newRuneDesc, this.newRuneIcon];
        objectsToFade = objectsToFade.concat(this.listOfCodes);

        this.locketMusic = playMusic('sleepless', 0.5);
        if (!this.windSfx) {
            this.windSfx = playSound('wind', 0.01, true);
            this.windSfx.detune = -700;
        }
        fadeInSound(this.windSfx, 0.3, 2000);

        this.showCodeBtn.setState(DISABLE);
        PhaserScene.tweens.add({
            delay: 100,
            targets: [this.locketDialog, this.locketDialogImage],
            alpha: 1,
            ease: 'Cubic.easeIn',
            duration: 500,
        });
        PhaserScene.tweens.add({
            targets: objectsToFade,
            alpha: 0,
            ease: 'Cubic.easeOut',
            duration: 500,
        });
        PhaserScene.tweens.add({
            targets: this.titleText,
            alpha: 0.1,
            ease: 'Cubic.easeOut',
            duration: 300,
            onComplete: () => {
                this.titleText.setText(getLangText('post_fight_day') + level + getLangText('post_fight_day2'));
                PhaserScene.tweens.add({
                    targets: this.titleText,
                    alpha: 1,
                    duration: 350,
                });
            }
        });
    }

    returnStatText() {
        if (!this.newRuneDesc.visible && this.trainingButton.getState() !== DISABLE) {
            this.showCodeBtn.setState(NORMAL);
        }
        if (this.locketMusic) {
            fadeAwaySound(this.locketMusic, 3500, 'Quad.easeOut');
        }
        let objectsToFade = [this.titleText, this.healthLeftText, this.codeText, this.newRuneAnnounce, this.newRuneDesc, this.newRuneIcon];
        objectsToFade = objectsToFade.concat(this.listOfCodes);

        PhaserScene.tweens.add({
            targets: [this.locketDialog, this.locketDialogImage],
            alpha: 0,
            ease: 'Cubic.easeOut',
            duration: 500,
        });
        PhaserScene.tweens.add({
            delay: 100,
            targets: objectsToFade,
            alpha: 1,
            ease: 'Cubic.easeIn',
            duration: 500,
        });
    }

    getNewRuneAnnounce(level) {
        if (level < 7) {
            return getLangText('post_fight_newrune');
        } else if (level >= 9) {
            return getLangText('post_fight_noupgrade');
        } else {
            return getLangText('post_fight_upgrade');
        }
    }

    getNewRuneDesc(level) {
        switch(level) {
            case 1:
                return getLangText('mind_tut_desc');
                break;
            case 2:
                return getLangText('protect_tut_desc');
                break;
            case 3:
                return getLangText('reinforce_tut_desc');
                break;
            case 4:
                return getLangText('time_tut_desc');
                break
            case 5:
                return getLangText('void_tut_desc');
                break;
            case 6:
                return getLangText('unload_tut_desc');
                break
            case 7:
                return getLangText('matter_plus_tut_desc');
                break;
            case 8:
                return getLangText('mind_plus_tut_desc');
                break
            case 9:
                return getLangText('no_improve_tut_desc');
                break;
            default:
                return '(missing description)'
        }
    }

    getNewRuneFrame(level) {
        switch(level) {
            case 1:
                return 'rune_energy_large.png';
                break;
            case 2:
                return 'rune_protect_large.png';
                break;
            case 3:
                return 'rune_reinforce_large.png';
                break;
            case 4:
                return 'rune_time_large.png';
                break
            case 5:
                return 'rune_void_large.png';
                break;
            case 6:
                return 'rune_unload_large.png';
                break
            case 7:
                return 'rune_matter_large.png';
                break;
            case 8:
                return 'rune_energy_large.png';
                break
            case 9:
                return 'blank.png';
                break;
            default:
                return 'blank.png'
        }
    }

    getStoryDialog(level) {
        switch(level) {
            case 0:
                return "And so my journey begins.\nIt won't be long before\nI see you again, Rosemary."
            case 1:
                return getLangText('post_fight_story1')
            case 2:
                return getLangText('post_fight_story2');
            case 3:
                return getLangText('post_fight_story3');
            case 4:
                return getLangText('post_fight_story4');
            case 5:
                return getLangText('post_fight_story5')
            case 6:
                return getLangText("post_fight_story6");

            case 7:
                return getLangText("post_fight_story7");

            case 8:
                return getLangText("post_fight_story8");

            case 9:
                return getLangText("post_fight_story9");

            default:
                return "..."
        }
    }

    clearPostFightScreen(clearFog = true) {
        if (!this.isCreated) {
            return;
        }
        this.clearWindSound();
        if (this.gloom.currAnim) {
            this.gloom.currAnim.stop();
        }
        this.gloom.currAnim = PhaserScene.tweens.add({
            targets: [this.gloom],
            alpha: 0,
            ease: 'Cubic.easeOut',
            duration: 500,
        })
        PhaserScene.tweens.add({
            targets: [this.bgShade, this.backing, this.titleText, this.healthLeftText, this.newRuneDesc, this.newRuneIcon, this.trainingRuneIcon, this.newRuneAnnounce, this.locketSprite, this.codeText, this.locketDialog, this.locketDialogImage],
            alpha: 0,
            ease: 'Quad.easeOut',
            duration: 600,
        });
        PhaserScene.tweens.add({
            targets: this.listOfCodes,
            alpha: 0,
            ease: 'Quad.easeOut',
            duration: 600,
        });

        if (this.locketMusic) {
            fadeAwaySound(this.locketMusic, 800, undefined, () => {
                this.locketMusic = null;
            });
        }
        globalObjects.bannerTextManager.setOnFinishFunc(() => {});
        globalObjects.bannerTextManager.closeBanner();
        this.continueButton.setState(DISABLE);
        this.trainingButton.setState(DISABLE);
        this.locketButton.setState(DISABLE);
        this.showCodeBtn.setState(DISABLE);
        globalObjects.magicCircle.enableMovement();
        if (clearFog) {
            clearDeathFog();
        }
    }


    getLevelDialog(level) {
        switch(level) {
            case 0:
                return [
                    "And so my journey begins. It won't be long\nbefore I see you again, Rosemary."
                ]
                break;
            case 1:
                return [
                    "DAY 1",
                    "I'm sure this is the right place."
                ]
                break;
            case 2:
                return [
                    "This strange wheel device I've found is capable\nof storing the strength of defeated opponents.",
                    "Perhaps if I defeat enough enemies, I can gain\nthe power to bring you back, Rosemary."
                ]
                break;
            case 3:
                return [
                    "This strange wheel device I've found is capable\nof storing the strength of defeated opponents.",
                    "Perhaps if I defeat enough enemies, I can gain\nthe power to bring you back, Rosemary."
                ]
                break;
            case 4:
                return [
                    "This strange wheel device I've found is capable\nof storing the strength of defeated opponents.",
                    "Perhaps if I defeat enough enemies, I can gain\nthe power to bring you back, Rosemary."
                ]
                break;
            case 5:
                return [
                    "This strange wheel device I've found is capable\nof storing the strength of defeated opponents.",
                    "Perhaps if I defeat enough enemies, I can gain\nthe power to bring you back, Rosemary."
                ]
                break;
            case 6:
                return [
                    "This strange wheel device I've found is capable\nof storing the strength of defeated opponents.",
                    "Perhaps if I defeat enough enemies, I can gain\nthe power to bring you back, Rosemary."
                ]
                break;
            case 7:
                return [
                    "This strange wheel device I've found is capable\nof storing the strength of defeated opponents.",
                    "Perhaps if I defeat enough enemies, I can gain\nthe power to bring you back, Rosemary."
                ]
                break;
            case 8:
                return [
                    "This strange wheel device I've found is capable\nof storing the strength of defeated opponents.",
                    "Perhaps if I defeat enough enemies, I can gain\nthe power to bring you back, Rosemary."
                ]
                break;
            case 9:
                return [
                    "This strange wheel device I've found is capable\nof storing the strength of defeated opponents.",
                    "Perhaps if I defeat enough enemies, I can gain\nthe power to bring you back, Rosemary."
                ]
                break;
            default:
                return [
                    "I must keep pressing on.",
                ]
                break;
        }
    }
}
