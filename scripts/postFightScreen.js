class PostFightScreen {
    constructor(scene) {
        this.scene = scene;
        this.bgShade = null;
        this.backing = null;
        this.titleText = null;
        this.spellsCastText = null;
        this.healthLeftText = null;
        this.locketSprite = null;
        this.locketDialog = null;
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
            this.titleText = this.scene.add.text(gameConsts.halfWidth - 225, gameConsts.halfHeight - 255, '(placeholder title)', {fontFamily: 'Garamond', fontSize: 42, color: '#000000', align: 'left'}).setAlpha(0).setOrigin(0, 0.5).setDepth(100000);
        }
        if (!this.spellsCastText) {
            this.spellsCastText = this.scene.add.text(gameConsts.halfWidth - 225, gameConsts.halfHeight - 160, 'Spells Cast:', {fontFamily: 'Garamond', fontSize: 26, color: '#000000', align: 'left'}).setAlpha(0).setOrigin(0, 0.5).setDepth(100000);
        }
        if (!this.healthLeftText) {
            this.healthLeftText = this.scene.add.text(gameConsts.halfWidth - 225, gameConsts.halfHeight - 130, 'Health Left:', {fontFamily: 'Garamond', fontSize: 26, color: '#000000', align: 'left'}).setAlpha(0).setOrigin(0, 0.5).setDepth(100000);
        }
        if (!this.codeText) {
            this.codeText = this.scene.add.text(gameConsts.halfWidth, gameConsts.halfHeight + 30, 'placeholder code: ', {fontFamily: 'Garamond', fontSize: 26, color: '#000000', align: 'center'}).setAlpha(0).setOrigin(0.5, 0).setDepth(100000);
        }
        if (!this.locketSprite) {
            this.locketSprite = this.scene.add.sprite(gameConsts.width + 300, gameConsts.halfHeight - 380, 'ui', 'locket1.png').setScale(0.75).setDepth(100002).setAlpha(0).setOrigin(0.5, 0.1);
        }
        if (!this.locketDialog) {
            this.locketDialog = this.scene.add.text(gameConsts.halfWidth - 225, gameConsts.halfHeight - 220, '(placeholder story)', {fontFamily: 'Garamond', fontSize: 26, color: '#000000', align: 'left'}).setAlpha(0).setOrigin(0, 0).setDepth(100000);
        }
        if (!this.flashObj) {
            this.flashObj = this.scene.add.sprite(gameConsts.width * 0.76, gameConsts.halfHeight - 160, 'lowq', 'flash.webp').setScale(0).setRotation(-0.2).setDepth(100002).setAlpha(0.5);
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
                    alpha: 1,
                    ref: "nextLevel_press.png",
                },
                disable: {
                    atlas: "ui",
                    ref: "nextLevel_press.png",
                    alpha: 0.001
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
        this.locketButton.setState(DISABLE);

        this.backing.setScale(0.98);
        this.titleText.setScale(0.97);
        this.spellsCastText.setScale(0.97);
        this.healthLeftText.setScale(0.97);
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
        this.continueButton.setState(DISABLE);
        setTimeout(() => {
            this.continueButton.setState(NORMAL);
        }, 3000);

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
                    targets: [this.spellsCastText, this.healthLeftText],
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
                                onComplete: () => {
                                    let oldScale = this.locketSprite.scaleX;
                                    this.locketSprite.setFrame('locket2.png').setScale(oldScale * 1.05);
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

    clearPostFightScreen(clearFog = true) {
        PhaserScene.tweens.add({
            targets: [this.bgShade, this.backing, this.titleText, this.spellsCastText, this.healthLeftText, this.locketSprite, this.codeText, this.locketDialog],
            alpha: 0,
            ease: 'Quad.easeOut',
            duration: 700,
        });
        globalObjects.bannerTextManager.setOnFinishFunc(() => {});
        globalObjects.bannerTextManager.closeBanner();
        this.continueButton.setState(DISABLE);
        this.locketButton.setState(DISABLE);
        globalObjects.magicCircle.enableMovement();
        if (clearFog) {
            clearDeathFog();
        }
    }

    closeLocket() {
        this.locketIsClosable = true;
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
        this.returnStatText();
    }

    openLocket() {
        if (this.locketSprite) {
            this.locketIsOpen = true;
            this.locketSprite.setFrame('locket3.png');
            this.locketSprite.setScale(this.locketSprite.scaleX + 0.02);
            PhaserScene.tweens.add({
                targets: [this.locketSprite],
                scaleX: 0.75,
                scaleY: 0.75,
                y: '-=15',
                x: "+=10",
                ease: 'Cubic.easeOut',
                duration: 250,
            });
            this.showStoryText(this.currLevel);
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

    createWinScreen(level = 0) {
        this.currLevel = level;
        this.createWinScreenUI(level);
        this.continueButton.setOnMouseUpFunc(() => {
            this.clearPostFightScreen();
            beginLevel(level + 1);
            if (canvas) {
                canvas.style.cursor = 'default';
            }
        });
    }

    createWinScreenBoom(level = 0) {
        this.createWinScreenUI(level);
        this.continueButton.setOnMouseUpFunc(() => {
            this.clearPostFightScreen(false);
            messageBus.publish('robotExplosion');
            if (canvas) {
                canvas.style.cursor = 'default';
            }
        });
    }

    createWinScreenUI(level = 0) {
        this.initAssets(true);
        globalObjects.magicCircle.disableMovement();
        this.titleText.setText("Fight Complete");
        this.spellsCastText.setText("Spells Cast: " + globalObjects.player.getPlayerCastSpellsCount());
        this.healthLeftText.setText("Health Left: " + globalObjects.player.getHealth() + "/" + globalObjects.player.getHealthMax());
        this.codeText.setText("LEVEL CODE: placeholder\n(placeholder)");
        this.locketDialog.setText(this.getStoryDialog(level));

        globalObjects.bannerTextManager.setDialog(this.locketDialog);
    }

    createLoseScreen(level) {
        this.initAssets(false);
        this.titleText.setText("You Have Fallen");
        this.spellsCastText.setText("Spells Cast: " + globalObjects.player.getPlayerCastSpellsCount());
        // healthLeftText
        this.codeText.setText("CHEAT CODE: ABCDE");
        this.continueButton.setOnMouseUpFunc(() => {
            this.clearPostFightScreen();
            beginLevel(level);
            if (canvas) {
                canvas.style.cursor = 'default';
            }
        });
    }

    showStoryText(level) {
        let objectsToFade = [this.spellsCastText, this.healthLeftText, this.codeText];

        PhaserScene.tweens.add({
            delay: 100,
            targets: this.locketDialog,
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
                this.titleText.setText('DAY ' + level);
                PhaserScene.tweens.add({
                    targets: this.titleText,
                    alpha: 1,
                    duration: 350,
                });
            }
        });
    }

    returnStatText() {
        let objectsToFade = [this.titleText, this.spellsCastText, this.healthLeftText, this.codeText];
        PhaserScene.tweens.add({
            targets: this.locketDialog,
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

    getStoryDialog(level) {
        switch(level) {
            case 0:
                return "And so my journey begins.\nIt won't be long before\nI see you again, Rosemary."
            case 1:
                return "Finally, I've found\nthe entry way to\nyour resting place.\n\n"+
                "Almost immediately I can feel\nthis place trying to prevent me from\ngoing further.\n\n"+
                "But I know I will find you here dear\nRosemary, and no creature or construct\nwill stop me from reaching you."
            case 2:
                return "Finally, I've found the\nthe entry way to\nthe mystical land of\nthe dead.\n\n"+
                "Almost immediately I can feel\nthis place trying to resist\nmy entry.\n\n"+
                "But I know you are here my Rosemary,\nand no creature or construct will stop me\nfrom reaching you."
            case 3:
                return "DAY 3\n\ntest";

            case 4:
                return "DAY 4\n\ntest";

            case 5:
                return "DAY 5\n\ntest";

            case 6:
                return "DAY 6\n\ntest";

            case 7:
                return "DAY 7\n\ntest";

            case 8:
                return "DAY 8\n\ntest";

            case 9:
                return "DAY 9\n\ntest";

            default:
                return "..."
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
