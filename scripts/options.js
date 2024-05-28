class Options {
    constructor(scene, x, y) {
        this.baseDepth = 101000;
        this.listOfThingsToHide = [];
        this.listOfButtonsToDisable = [];
        this.button = new Button({
            normal: {
                atlas: 'buttons',
                ref: "options_btn_normal.png",
                alpha: 1,
                x: x,
                y: y,
            },
            hover: {
                atlas: 'buttons',
                ref: "options_btn_hover.png",
                alpha: 1,
            },
            press: {
                atlas: 'buttons',
                ref: "options_btn_press.png",
                alpha: 1,
            },
            disable: {
                atlas: 'buttons',
                ref: "options_btn_press.png",
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
                this.showOptions()
            }
        });

        this.button.setScrollFactor(0, 0)
    }

    showOptions() {
        if (!this.darkenBG) {
            this.darkenBG = PhaserScene.add.image(gameConsts.halfWidth, gameConsts.halfHeight, 'blackPixel').setDepth(this.baseDepth);
            this.darkenBG.setScale(500, 500).setAlpha(0.4);
            this.listOfThingsToHide.push(this.darkenBG);
        }
        if (!this.bgPage) {
            this.bgPage = PhaserScene.add.image(gameConsts.halfWidth, gameConsts.halfHeight - 25, 'ui', 'paper.png').setDepth(this.baseDepth);
            this.listOfThingsToHide.push(this.bgPage);
        }
        if (!this.sliderBGM) {
            this.draggerBGM;
            this.draggerSFX;

            let startX = gameConsts.halfWidth + 40;
            this.BGMIcon = PhaserScene.add.image(gameConsts.halfWidth - 170, gameConsts.halfHeight - 210, 'ui', 'music.png').setDepth(this.baseDepth);
            this.SFXIcon = PhaserScene.add.image(gameConsts.halfWidth - 170, gameConsts.halfHeight - 120, 'ui', 'sound_full.png').setDepth(this.baseDepth);

            this.sliderBGM = new Button({
                isDraggable: true,
                normal: {
                    atlas: 'ui',
                    ref: "slider.png",
                    alpha: 0,
                    x: startX,
                    y: gameConsts.halfHeight - 210,
                },
                onDrag: (x, y) => {
                    this.updateBGMSlider(startX, x);
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
                onMouseDown: (x, y) => {
                    this.updateBGMSlider(startX, x);
                },
                onDrop: (x, y) => {
                    this.sliderBGM.setPos(startX, gameConsts.halfHeight - 210);
                    this.updateBGMSlider(startX, x);
                    playFakeBGMusic('button');
                    this.draggerBGM.setFrame('slider_indicator.png');
                },
            });
            this.sliderBGM.setDepth(this.baseDepth);
            this.listOfButtonsToDisable.push(this.sliderBGM);

            this.sliderSFX = new Button({
                isDraggable: true,
                normal: {
                    atlas: 'ui',
                    ref: "slider.png",
                    alpha: 0,
                    x: startX,
                    y: gameConsts.halfHeight - 120,
                },
                onDrag: (x, y) => {
                    this.updateSFXSlider(startX, x)
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
                onMouseDown: (x, y) => {
                    this.updateSFXSlider(startX, x)
                },
                onDrop: (x) => {
                    this.sliderSFX.setPos(startX, gameConsts.halfHeight - 120);
                    this.updateSFXSlider(startX, x);
                    playSound('button');
                    this.draggerSFX.setFrame('slider_indicator.png');
                },
            });
            this.sliderSFX.setDepth(this.baseDepth);
            this.listOfButtonsToDisable.push(this.sliderSFX);
            this.BGMVisual = PhaserScene.add.image(startX, gameConsts.halfHeight - 210, 'ui', 'slider.png').setDepth(this.baseDepth);
            this.SFXVisual = PhaserScene.add.image(startX, gameConsts.halfHeight - 120, 'ui', 'slider.png').setDepth(this.baseDepth);
  
            this.draggerBGM = PhaserScene.add.image(startX + 4 * 30, gameConsts.halfHeight - 210, 'ui', 'slider_indicator.png').setDepth(this.baseDepth);
            this.draggerSFX = PhaserScene.add.image(startX + 4 * 30, gameConsts.halfHeight - 120, 'ui', 'slider_indicator.png').setDepth(this.baseDepth);

            this.listOfThingsToHide.push(this.BGMIcon);
            this.listOfThingsToHide.push(this.SFXIcon);
            this.listOfThingsToHide.push(this.BGMVisual);
            this.listOfThingsToHide.push(this.SFXVisual);
            this.listOfThingsToHide.push(this.draggerBGM);
            this.listOfThingsToHide.push(this.draggerSFX);
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
                    this.hideOptions()
                }
            });
            this.closeButton.setDepth(this.baseDepth + 10);
            this.listOfButtonsToDisable.push(this.closeButton);
        }
        buttonManager.bringButtonToTop(this.sliderBGM);
        buttonManager.bringButtonToTop(this.sliderSFX);
        this.sliderBGM.setState(NORMAL);
        this.sliderSFX.setState(NORMAL);

        for (let i = 0; i < this.listOfButtonsToDisable.length; i++) {
            this.listOfButtonsToDisable[i].setState(NORMAL);
            buttonManager.bringButtonToTop(this.listOfButtonsToDisable[i]);
        }
        for (let i = 0; i < this.listOfThingsToHide.length; i++) {
            this.listOfThingsToHide[i].alpha = 1;
        }
        this.darkenBG.setAlpha(0.4);
        this.bgPage.setAlpha(0.2);
        PhaserScene.tweens.add({
             targets: this.bgPage,
             alpha: 1,
             ease: 'Cubic.easeOut',
             duration: 400,
        });

    }

    updateSFXSlider(startX, x) {
        let index = this.dragSlider(this.draggerSFX, startX, x);
        if (index >= 4) {
            this.SFXIcon.setFrame('sound_full.png')
        } else if (index >= 0) {
            this.SFXIcon.setFrame('sound_most.png');
        } else if (index === -5) {
            this.SFXIcon.setFrame('sound_mute.png');
        } else {
            this.SFXIcon.setFrame('sound_half.png');
        }
        updateGlobalVolume((index + 5) * 0.1);
    }

    updateBGMSlider(startX, x) {
        let index = this.dragSlider(this.draggerBGM, startX, x);
        if (index === -5) {
            this.BGMIcon.setFrame('music_mute.png')
        } else {
            this.BGMIcon.setFrame('music.png');
        }
        updateGlobalMusicVolume((index + 5) * 0.1);
    }

    dragSlider(dragger, startX, x = null) {
        let indicatorPosX = x;
        let xDiff = x - startX;
        let closestIndex = 0;
        if (xDiff < 30 * -5) {
            indicatorPosX = startX - 30 * 5;
            closestIndex = -5;
        } else if (xDiff > 30 * 5) {
            indicatorPosX = startX + 30 * 5;
            closestIndex = 5;
        } else {
            // let baseX = startX - 30 * 5
            closestIndex = Math.round(xDiff / 30);
            indicatorPosX = startX + closestIndex * 30;
        }
        dragger.setFrame('slider_indicator_glow.png');
        dragger.x = indicatorPosX;
        return closestIndex;
    }

    hideOptions() {
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
}