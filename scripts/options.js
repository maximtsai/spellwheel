class Options {
    constructor(scene, x, y) {
        this.startX = x;
        this.startY = y;
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
        this.button.setDepth(this.baseDepth);
        this.button.setScrollFactor(0, 0)
    }

    showOptions() {
        playSound('flip2')
        if (!this.darkenBG) {
            this.darkenBG = PhaserScene.add.image(gameConsts.halfWidth, gameConsts.halfHeight, 'blackPixel').setDepth(this.baseDepth);
            this.darkenBG.setScale(500, 500).setAlpha(0.4);
            this.listOfThingsToHide.push(this.darkenBG);
        }
        if (!this.bgPage) {
            this.bgPage = PhaserScene.add.image(gameConsts.halfWidth, gameConsts.halfHeight - 25, 'ui', 'paper.png').setDepth(this.baseDepth);
            this.listOfThingsToHide.push(this.bgPage);
        }

        if (!this.menuBtn) {
            this.menuBtn = new Button({
                normal: {
                    ref: "menu_btn_normal.png",
                    atlas: 'buttons',
                    x: gameConsts.halfWidth,
                    y: gameConsts.halfHeight + 200,
                    alpha: 1,
                },
                hover: {
                    ref: "menu_btn_hover.png",
                    atlas: 'buttons',
                    alpha: 1,
                },
                press: {
                    ref: "menu_btn_normal.png",
                    atlas: 'buttons',
                    alpha: 1,
                },
                disable: {
                    ref: "menu_btn_normal.png",
                    atlas: 'buttons',
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
                    this.hideOptions();
                    globalObjects.player.revive();
                    gotoMainMenu();
                    globalObjects.textPopupManager.hideInfoText();
                    globalObjects.bannerTextManager.closeBanner();
                    if (globalObjects.floatingDeath) {
                        globalObjects.floatingDeath.visible = false;
                        globalObjects.floatingDeath2.visible = false;
                    }
                    globalObjects.postFightScreen.clearPostFightScreen();
                }
            });
            this.menuBtn.addText('MENU', {fontFamily: 'garamondmax', fontSize: 34, color: '#000000', align: 'center'});
            this.menuBtn.setDepth(this.baseDepth + 1);
            this.listOfButtonsToDisable.push(this.menuBtn);
        }

        if (!this.resumeBtn) {
            this.resumeBtn = new Button({
                normal: {
                    ref: "menu_btn_normal.png",
                    atlas: 'buttons',
                    x: gameConsts.halfWidth,
                    y: gameConsts.halfHeight + 130,
                    alpha: 1,
                },
                hover: {
                    ref: "menu_btn_hover.png",
                    atlas: 'buttons',
                    alpha: 1,
                },
                press: {
                    ref: "menu_btn_normal.png",
                    atlas: 'buttons',
                    alpha: 1,
                },
                disable: {
                    ref: "menu_btn_normal.png",
                    atlas: 'buttons',
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
                    this.hideOptions();
                }
            });
            this.resumeBtn.addText('RESUME', {fontFamily: 'garamondmax', fontSize: 34, color: '#000000', align: 'center'});
            this.resumeBtn.setDepth(this.baseDepth + 1);
            this.listOfButtonsToDisable.push(this.resumeBtn);
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

            let musicExtraXPos = ((globalMusicVol * 10) - 9) * 30;
            let sfxExtraXPos = ((globalVolume * 10) - 9) * 30;
            this.draggerBGM = PhaserScene.add.image(startX + 4 * 30 + musicExtraXPos, gameConsts.halfHeight - 210, 'ui', 'slider_indicator.png').setDepth(this.baseDepth);
            this.draggerSFX = PhaserScene.add.image(startX + 4 * 30 + sfxExtraXPos, gameConsts.halfHeight - 120, 'ui', 'slider_indicator.png').setDepth(this.baseDepth);

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
                    x: gameConsts.halfWidth + 244,
                    y: 105,
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

        // buttonManager.bringButtonToTop(this.sliderBGM);
        // buttonManager.bringButtonToTop(this.sliderSFX);
        // buttonManager.bringButtonToTop(this.menuBtn);
        // this.sliderBGM.setState(NORMAL);
        // this.sliderSFX.setState(NORMAL);
        // this.menuBtn.setState(NORMAL);

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
             duration: 1,
        });
        messageBus.publish('pauseGame', 0.002);

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
