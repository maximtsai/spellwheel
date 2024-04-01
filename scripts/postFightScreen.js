class PostFightScreen {
    constructor(scene) {
        this.scene = scene;
        this.bgShade = null;
        this.backing = null;
        this.titleText = null;
        this.spellsCastText = null;
        this.locketSprite = null;
        this.locketText = null;
        this.locketDarkenBG = null;
        this.locketDialogIndex = 0;
    }

    initAssets(isWin = true) {
        this.locketIsOpen = false;
        this.locketIsClosable = false;
        if (!this.bgShade) {
            this.bgShade = this.scene.add.sprite(gameConsts.halfWidth, gameConsts.halfHeight, 'blackPixel').setDepth(100000).setAlpha(0).setScale(500, 500);
        }
        if (!this.backing) {
            this.backing = this.scene.add.sprite(gameConsts.halfWidth, gameConsts.halfHeight - 30, 'ui', 'battleOverScreen.png').setDepth(100000).setAlpha(0);
        }
        if (!this.titleText) {
            this.titleText = this.scene.add.text(gameConsts.halfWidth - 225, gameConsts.halfHeight - 250, '(placeholder title)', {fontFamily: 'Garamond', fontSize: 42, color: '#000000', align: 'left'}).setAlpha(0).setOrigin(0, 0.5).setDepth(100000);
        }
        if (!this.spellsCastText) {
            this.spellsCastText = this.scene.add.text(gameConsts.halfWidth - 225, gameConsts.halfHeight - 160, 'Spells Cast:', {fontFamily: 'Garamond', fontSize: 22, color: '#000000', align: 'left'}).setAlpha(0).setOrigin(0, 0.5).setDepth(100000);
        }
        if (!this.codeText) {
            this.codeText = this.scene.add.text(gameConsts.halfWidth - 225, gameConsts.halfHeight - 130, 'placeholder code: ', {fontFamily: 'Garamond', fontSize: 22, color: '#000000', align: 'left'}).setAlpha(0).setOrigin(0, 0.5).setDepth(100000);
        }
        if (!this.locketSprite) {
            this.locketSprite = this.scene.add.sprite(gameConsts.width + 300, gameConsts.halfHeight - 370, 'ui', 'locket1.png').setScale(0.75).setDepth(100002).setAlpha(0).setOrigin(0.5, 0.1);
        }
        if (!this.locketText) {
            this.locketTextBG = this.scene.add.sprite(gameConsts.halfWidth, gameConsts.height - 53, 'misc', 'victory_banner.png').setScale(100, 1).setDepth(100002).setAlpha(0);
            this.locketText = this.scene.add.text(gameConsts.halfWidth, gameConsts.height - 58, 'sappy romance stuff here', {fontFamily: 'Garamond', fontSize: 26, color: '#FFFFFF', align: 'center'}).setAlpha(0).setOrigin(0.5, 0.5).setDepth(100002);
        }
        if (!this.continueButton) {
            this.continueButton = new Button({
                normal: {
                    atlas: "ui",
                    ref: "nextLevel.png",
                    visible: true,
                    alpha: 0.95,
                    x: gameConsts.halfWidth,
                    y: gameConsts.halfHeight + 180,
                },
                hover: {
                    atlas: "ui",
                    alpha: 1,
                    ref: "nextLevel_hover.png",
                },
                press: {
                    atlas: "ui",
                    ref: "nextLevel_press.png",
                },
                disable: {
                    atlas: "ui",
                    ref: "nextLevel_press.png",
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

                }
            });
            this.continueButton.setDepth(100000);
        }
        if (!this.locketButton) {
            this.locketButton = new Button({
                normal: {
                    ref: "blackPixel",
                    alpha: 0.0001,
                    x: gameConsts.width * 0.8,
                    y: gameConsts.halfHeight - 160,
                    scaleX: 100,
                    scaleY: 110
                },
                disable: {
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
                    if (!this.locketIsOpen) {
                        this.openLocket();
                    } else if (this.locketIsClosable) {
                        this.locketSprite.setFrame('locket1.png');
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
        if (!this.locketDarkenBG) {
            this.locketDarkenBG = this.scene.add.sprite(gameConsts.halfWidth, gameConsts.halfHeight, 'blackPixel').setDepth(100001).setAlpha(0).setScale(500, 500);
        }
        this.locketButton.setState(DISABLE);

        this.backing.setScale(0.98);
        this.titleText.setScale(0.97);
        this.spellsCastText.setScale(0.97);
        if (isWin) {
            this.locketSprite.visible = true;
            this.locketSprite.x = gameConsts.width + 300;
            this.locketSprite.y = gameConsts.halfHeight - 370;
            this.locketSprite.setScale(0.75);
            this.locketSprite.setRotation(-0.6);
            this.locketSprite.setFrame('locket1.png');
        } else {
            this.locketSprite.visible = false;
        }

        setTimeout(() => {
            this.continueButton.setState(NORMAL);
        }, 1000);

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
                    targets: [this.spellsCastText],
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
                    PhaserScene.tweens.add({
                        delay: 400,
                        targets: [this.locketSprite],
                        alpha: 1,
                        duration: 700,
                        onStart: () => {
                            this.locketButton.setState(NORMAL);
                            PhaserScene.tweens.add({
                                targets: this.locketSprite,
                                rotation: 0.3,
                                x: gameConsts.width * 0.9,
                                ease: 'Cubic.easeOut',
                                duration: 1000,
                            });
                        }
                    });
                }
            }
        });
    }

    clearPostFightScreen() {
        PhaserScene.tweens.add({
            targets: [this.locketDarkenBG, this.bgShade, this.backing, this.titleText, this.spellsCastText, this.locketSprite, this.codeText, this.locketText, this.locketTextBG],
            alpha: 0,
            duration: 500,
        });
        this.continueButton.setState(DISABLE);
        this.locketButton.setState(DISABLE);
        globalObjects.magicCircle.enableMovement();
    }

    closeLocket() {
        if (this.locketTextAnim) {
            this.locketTextAnim.stop();
        }
        this.locketIsClosable = true;

        PhaserScene.tweens.add({
            targets: [this.locketText, this.locketTextBG, this.locketDarkenBG],
            alpha: 0,
            duration: 250,
        });

        PhaserScene.tweens.add({
            delay: 50,
            targets: [this.locketSprite],
            scaleX: 0.75,
            scaleY: 0.75,
            x: gameConsts.width * 0.9,
            y: gameConsts.halfHeight - 370,
            ease: 'Cubic.easeInOut',
            duration: 700
        });

        this.dialogButton.setState(DISABLE);
    }

    openLocket() {
        if (this.locketSprite) {
            this.locketIsOpen = true;
            this.locketSprite.setFrame('locket2.png');
            PhaserScene.tweens.add({
                targets: [this.locketSprite],
                x: gameConsts.halfWidth + 120,
                y: gameConsts.halfHeight - 310,
                duration: 410,
                ease: 'Cubic.easeOut'
            });
            PhaserScene.tweens.add({
                targets: [this.locketSprite],
                scaleX: 1,
                scaleY: 1,
                duration: 410,
                ease: 'Quad.easeOut'
            });
            PhaserScene.tweens.add({
                targets: [this.locketTextBG],
                alpha: 0.75,
                duration: 350,
            });
            PhaserScene.tweens.add({
                delay: 150,
                targets: [this.locketText],
                alpha: 1,
                duration: 250,
            });
            PhaserScene.tweens.add({
                targets: [this.locketDarkenBG],
                alpha: 0.4,
                duration: 300,
            });

            if (!this.dialogButton) {
                this.dialogButton = new Button({
                    normal: {
                        ref: "blackPixel",
                        alpha: 0.00001,
                        x: gameConsts.halfWidth,
                        y: gameConsts.halfHeight,
                        scaleX: 500,
                        scaleY: 500
                    },
                    disable: {
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
                        let isFinished = this.continueDialog();
                        if (canvas) {
                            canvas.style.cursor = 'default';
                        }
                        if (isFinished) {
                            this.closeLocket();
                        }
                    }
                });
                this.dialogButton.setDepth(100001);
            }

        }
    }

    continueDialog() {
        if (this.locketTextAnim) {
            this.locketTextAnim.stop();
        }
        if (!this.locketDialog[this.locketDialogIndex + 1]) {
            return true;
        }
        this.locketDialogIndex++;
        this.locketText.setText(this.locketDialog[this.locketDialogIndex]);
        this.locketText.alpha = 0;
        this.locketTextAnim = PhaserScene.tweens.add({
            targets: [this.locketText],
            alpha: 1,
            duration: 250,
        });

        return false;
    }

    createWinScreen(level = 0) {
        this.initAssets();
        globalObjects.magicCircle.disableMovement();
        this.titleText.setText("Fight Complete");
        this.spellsCastText.setText("Spells Cast: " + globalObjects.player.getPlayerCastSpellsCount());
        this.codeText.setText("LEVEL CODE: ABCDE");
        this.locketDialog = this.getLevelDialog(level);
        this.locketDialogIndex = 0;
        this.locketText.setText(this.locketDialog[this.locketDialogIndex])
        this.continueButton.setOnMouseUpFunc(() => {
            this.clearPostFightScreen();
        });
    }

    createLoseScreen(level) {
        this.initAssets(false);
        this.titleText.setText("You Have Fallen");
        this.spellsCastText.setText("Spells Cast: " + globalObjects.player.getPlayerCastSpellsCount());
        this.codeText.setText("CHEAT CODE: ABCDE");
        this.continueButton.setOnMouseUpFunc(() => {
            this.clearPostFightScreen();
        });
    }

    getLevelDialog(level) {
        switch(level) {
            case 0:
                return [
                    "Rosemary my beloved, your death was in vain.\nI shall valiantly rescue you (insert sappy stuff)"
                ]
                break;
            case 1:
                return [
                    "Rosemary my beloved, your death was in vain.\nI shall valiantly rescue you (insert sappy stuff)"
                ]
                break;
            case 2:
                return [
                    "This strange wheel device I've found is capable\nof magic and storing the strength of defeated opponents.",
                    "Perhaps if I defeat enough enemies I can gain\nthe strength to bring you back, Rosemary."
                ]
                break;
        }
    }
}
