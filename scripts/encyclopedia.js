class Encyclopedia {
    constructor(scene, x, y) {
        this.baseDepth = 101000;
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

        this.button.setScrollFactor(0, 0)
    }

    showEncyclopedia() {
        if (!this.darkenBG) {
            this.darkenBG = PhaserScene.add.image(gameConsts.halfWidth, gameConsts.halfHeight, 'blackPixel').setDepth(this.baseDepth);
            this.darkenBG.setScale(500, 500);
        }
        if (!this.bgPage) {
            this.bgPage = PhaserScene.add.image(gameConsts.halfWidth, gameConsts.halfHeight - 25, 'ui', 'battleOverScreen.png').setDepth(this.baseDepth);
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
             duration: 500,
        });

    }

    hideEncyclopedia() {
        hideGlobalClickBlocker();
        let listOfThingsToHide = [];
        if (this.bgPage) {
            listOfThingsToHide.push(this.bgPage);
            listOfThingsToHide.push(this.darkenBG);

        }
        PhaserScene.tweens.add({
             targets: listOfThingsToHide,
             alpha: 0,
             ease: 'Cubic.easeOut',
             duration: 400,
        });

        if (this.closeButton) {
            this.closeButton.setState(DISABLE);
        }
    }
}