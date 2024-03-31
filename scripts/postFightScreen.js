class PostFightScreen {
    constructor(scene) {
        this.scene = scene;
        this.bgShade = null;
        this.backing = null;
        this.titleText = null;
        this.spellsCastText = null;
        this.locket = null;
        this.locketText = null;
    }

    initAssets(isWin = true) {
        this.locketIsOpen = false;

        if (!this.bgShade) {
            this.bgShade = this.scene.add.sprite(gameConsts.halfWidth, gameConsts.halfHeight, 'blackPixel').setDepth(100000).setAlpha(0).setScale(500, 500);
        }
        if (!this.backing) {
            this.backing = this.scene.add.sprite(gameConsts.halfWidth, gameConsts.halfHeight - 50, 'ui', 'battleOverScreen.png').setDepth(100000).setAlpha(0);
        }
        if (!this.titleText) {
            this.titleText = this.scene.add.text(gameConsts.halfWidth - 225, gameConsts.halfHeight - 250, '(placeholder title)', {fontFamily: 'Times New Roman', fontSize: 42, color: '#000000', align: 'left'}).setAlpha(0).setOrigin(0, 0.5).setDepth(100000);
        }
        if (!this.spellsCastText) {
            this.spellsCastText = this.scene.add.text(gameConsts.halfWidth - 225, gameConsts.halfHeight - 160, 'Spells Cast:', {fontFamily: 'Times New Roman', fontSize: 22, color: '#000000', align: 'left'}).setAlpha(0).setOrigin(0, 0.5).setDepth(100000);
        }
        if (!this.codeText) {
            this.codeText = this.scene.add.text(gameConsts.halfWidth - 225, gameConsts.halfHeight - 130, 'placeholder code: ', {fontFamily: 'Times New Roman', fontSize: 22, color: '#000000', align: 'left'}).setAlpha(0).setOrigin(0, 0.5).setDepth(100000);
        }
        if (!this.locket) {
            this.locket = this.scene.add.sprite(gameConsts.width + 300, gameConsts.halfHeight - 350, 'ui', 'locket1.png').setScale(0.75).setDepth(100000).setAlpha(0).setOrigin(0.5, 0.1);
        }
        if (!this.locketText) {
            this.locketTextBG = this.scene.add.sprite(gameConsts.halfWidth, gameConsts.height - 80, 'misc', 'victory_banner.png').setScale(100, 1).setDepth(100000).setAlpha(0);
            this.locketText = this.scene.add.text(gameConsts.halfWidth, gameConsts.height - 85, 'sappy romance stuff here', {fontFamily: 'Times New Roman', fontSize: 26, color: '#FFFFFF', align: 'center'}).setAlpha(0).setOrigin(0.5, 0.5).setDepth(100000);
        }
        if (!this.continueButton) {
            this.continueButton = new Button({
                normal: {
                    atlas: "ui",
                    ref: "nextLevel.png",
                    visible: true,
                    alpha: 0.95,
                    x: gameConsts.halfWidth,
                    y: gameConsts.halfHeight + 160,
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
                onMouseUp: () => {

                }
            });
            this.continueButton.setDepth(100000);
        }
        if (!this.locketButton) {
            this.locketButton = new Button({
                normal: {
                    ref: "blackPixel",
                    alpha: 0.1,
                    x: gameConsts.width * 0.8,
                    y: gameConsts.halfHeight - 170,
                    scaleX: 150,
                    scaleY: 180
                },
                disable: {
                    alpha: 0
                },
                onMouseUp: () => {
                    if (!this.locketIsOpen) {
                        this.openLocket();
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
        if (isWin) {
            this.locket.visible = true;
            this.locket.x = gameConsts.width + 300;
            this.locket.setRotation(-0.6);
            this.locket.setFrame('locket1.png');
        } else {
            this.locket.visible = false;
        }

        this.continueButton.setState(NORMAL);

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
                    delay: 500,
                    targets: [this.spellsCastText, this.codeText ],
                    scaleX: 1,
                    scaleY: 1,
                    alpha: 1,
                    duration: 300,
                });
                if (isWin) {
                    PhaserScene.tweens.add({
                        delay: 1000,
                        targets: [this.locket],
                        alpha: 1,
                        duration: 500,
                        onStart: () => {
                            this.locketButton.setState(NORMAL);
                            PhaserScene.tweens.add({
                                targets: this.locket,
                                rotation: 0.3,
                                x: gameConsts.width * 0.95,
                                ease: 'Cubic.easeOut',
                                duration: 1000,
                            });
                        }
                    });
                    PhaserScene.tweens.add({
                        delay: 600,
                        targets: [this.locket],
                        rotation: 0,
                        ease: 'Back.easeOut',
                        duration: 700,
                    });
                }
            }
        });
    }

    clearPostFightScreen() {
        PhaserScene.tweens.add({
            targets: [this.bgShade, this.backing, this.titleText, this.spellsCastText, this.locket, this.codeText, this.locketText, this.locketTextBG],
            alpha: 0,
            duration: 500,
        });
        this.continueButton.setState(DISABLE);
        this.locketButton.setState(DISABLE);
    }

    closeLocket() {
    }

    openLocket() {
        if (this.locket) {
            this.locketIsOpen = true;
            this.locket.setFrame('locket2.png');
            PhaserScene.tweens.add({
                targets: [this.locketTextBG],
                alpha: 0.85,
                duration: 250,
            });
            PhaserScene.tweens.add({
                targets: [this.locketText],
                alpha: 1,
                duration: 250,
            });
        }
    }

    createWinScreen(level) {
        this.initAssets();
        this.titleText.setText("Fight Complete");
        this.spellsCastText.setText("Spells Cast: " + globalObjects.player.getPlayerCastSpellsCount());
        this.codeText.setText("LEVEL CODE: ABCDE");
        this.locketText.setText("Rosemary my beloved, your death was in vain.\nI shall valiantly rescue you (insert sappy stuff)")
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
}
