class BannerTextManager {
    constructor(scene) {
        this.scene = scene;
        this.dialog = ["..."];
        this.dialogIndex = 0;
        this.darkenBG = this.scene.add.sprite(gameConsts.halfWidth, gameConsts.halfHeight, 'blackPixel').setDepth(100002).setAlpha(0).setScale(500, 500);
        this.textBG = this.scene.add.sprite(gameConsts.halfWidth, gameConsts.halfHeight + 25, 'misc', 'victory_banner.png').setScale(100, 1).setDepth(100002).setAlpha(0);
        this.text = this.scene.add.text(gameConsts.halfWidth, this.textBG.y, '...', {fontFamily: 'Garamond', fontSize: 26, color: '#FFFFFF', align: 'center'}).setAlpha(0).setOrigin(0.5, 0.5).setDepth(100002);
        // this.text.setFontStyle('bold');
    }

    setDialog(dialogArray) {
        this.dialog = dialogArray;
    }

    setText(text) {
        this.text.setText(text);
    }

    showBanner() {
        this.setText(this.dialog[this.dialogIndex]);
        PhaserScene.tweens.add({
            targets: [this.darkenBG],
            alpha: 0.5,
            duration: 350,
        });
        PhaserScene.tweens.add({
            targets: [this.textBG],
            alpha: 1,
            duration: 250,
        });
        PhaserScene.tweens.add({
            delay: 100,
            targets: [this.text],
            alpha: 1,
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
                }
            });

            setTimeout(() => {
                this.dialogButton.setOnMouseUpFunc(() => {
                    this.continueDialog();
                })
            }, 400)
        }
    }

    closeBanner() {
        if (this.dialogButton) {
            this.dialogButton.destroy();
            this.dialogButton = null;
        }
        if (this.currAnim) {
            this.currAnim.stop();
        }
        if (this.onFinishFunc) {
            this.onFinishFunc();
            this.onFinishFunc = null;
        }
        PhaserScene.tweens.add({
            targets: [this.darkenBG, this.textBG, this.text],
            alpha: 0,
            duration: 500,
        });
        this.dialog = ["..."];
        this.dialogIndex = 0;
    }

    setPosition(x, y, textOffsetY = 0) {
        this.textBG.setPosition(x, y);
        this.text.setPosition(x, y + textOffsetY);
    }

    setOnFinishFunc(func) {
        this.onFinishFunc = func;
    }

    continueDialog() {
        this.dialogIndex++;
        if (this.currAnim) {
            this.currAnim.stop();
        }
        if (!this.dialog[this.dialogIndex]) {
            this.closeBanner();
        } else {
            this.currAnim = PhaserScene.tweens.add({
                targets: [this.text],
                alpha: 0,
                duration: 250,
                onComplete: () => {
                    this.setText(this.dialog[this.dialogIndex]);
                    this.currAnim = PhaserScene.tweens.add({
                        targets: [this.text],
                        alpha: 1,
                        duration: 250,
                    });
                }
            });
        }
    }
}