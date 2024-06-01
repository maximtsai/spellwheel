class Encyclopedia {
    constructor(scene, x, y) {
        this.startX = x;
        this.startY = y;
        this.baseDepth = 101000;
        this.listOfThingsToHide = [];
        this.listOfButtonsToDisable = [];
        this.button = new Button({
            normal: {
                atlas: 'buttons',
                ref: "encyclopedia_btn_normal.png",
                alpha: 1,
                x: x,
                y: y,
            },
            hover: {
                atlas: 'buttons',
                ref: "encyclopedia_btn_hover.png",
                alpha: 1,
            },
            press: {
                atlas: 'buttons',
                ref: "encyclopedia_btn_press.png",
                alpha: 1,
            },
            disable: {
                atlas: 'buttons',
                ref: "encyclopedia_btn_press.png",
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
                this.showEncyclopedia()
            }
        });
        this.button.setDepth(this.baseDepth);

        this.button.setScrollFactor(0, 0)
    }

    showEncyclopedia() {
        if (!this.darkenBG) {
            this.darkenBG = PhaserScene.add.image(gameConsts.halfWidth, gameConsts.halfHeight, 'blackPixel').setDepth(this.baseDepth);
            this.darkenBG.setScale(500, 500);
            this.listOfThingsToHide.push(this.darkenBG);
        }
        if (!this.bgPage) {
            this.bgPage = PhaserScene.add.image(gameConsts.halfWidth, gameConsts.halfHeight - 25, 'ui', 'battleOverScreen.png').setDepth(this.baseDepth);
            this.listOfThingsToHide.push(this.bgPage);
        }
        createGlobalClickBlocker();
        if (!this.closeButton) {
            this.closeButton = new Button({
                normal: {
                    atlas: 'buttons',
                    ref: "closebtn.png",
                    alpha: 0.9,
                    x: gameConsts.width - 65,
                    y: 100,
                },
                hover: {
                    alpha: 1,
                    atlas: 'buttons',
                    ref: "closebtn.png",
                },
                press: {
                    atlas: 'buttons',
                    ref: "closebtn_press.png",
                    alpha: 1
                },
                disable: {
                    atlas: 'buttons',
                    ref: "closebtn.png",
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
                    this.hideEncyclopedia()
                }
            });
            this.closeButton.setDepth(this.baseDepth + 10);
            this.listOfButtonsToDisable.push(this.closeButton);
        } else {
            buttonManager.bringButtonToTop(this.closeButton);
            this.closeButton.setState(NORMAL);
        }
        this.darkenBG.setAlpha(0.4);
        this.bgPage.setAlpha(0.2);
        PhaserScene.tweens.add({
             targets: this.bgPage,
             alpha: 1,
             ease: 'Cubic.easeOut',
             duration: 1,
        });
        messageBus.publish('pauseGame', 0.002);

    }

    hideEncyclopedia() {
        messageBus.publish('unpauseGame');
        hideGlobalClickBlocker();
        PhaserScene.tweens.add({
             targets: this.listOfThingsToHide,
             alpha: 0,
             ease: 'Cubic.easeOut',
             duration: 400,
        });

        for (let i = 0; i < this.listOfButtonsToDisable.length; i++) {
            this.listOfButtonsToDisable[i].setState(DISABLE);
        }
    }

    showButton() {
        this.button.setPos(this.startX, this.startY);
    }

    hideButton() {
        this.button.setPos(this.startX, -100);
    }
}