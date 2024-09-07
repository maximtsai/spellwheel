class Options {
    constructor(scene, x, y) {
        this.startX = x;
        this.startY = y;
        this.baseDepth = 101000;
        this.langTextToUpdate = [];
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

    addLangTextUpdateable(obj, textid) {
        this.langTextToUpdate.push([obj, textid]);
    }

    showOptions() {
        globalObjects.encyclopedia.hideButton();
        globalObjects.options.hideButton();
        playSound('flip2')
        if (!this.darkenBG) {
            this.darkenBG = PhaserScene.add.image(gameConsts.halfWidth, gameConsts.halfHeight, 'blackPixel').setDepth(this.baseDepth);
            this.darkenBG.setScale(500, 500).setAlpha(0.4);
            this.listOfThingsToHide.push(this.darkenBG);
        }
        if (!this.bgPage) {
            this.bgPage = PhaserScene.add.image(gameConsts.halfWidth, gameConsts.halfHeight - 15, 'ui', 'paper.png').setDepth(this.baseDepth).setScale(1, 1.1);
            this.listOfThingsToHide.push(this.bgPage);
        }

        if (!this.menuBtn) {
            this.menuBtn = new Button({
                normal: {
                    ref: "menu_btn_normal.png",
                    atlas: 'buttons',
                    x: gameConsts.halfWidth,
                    y: gameConsts.halfHeight + 280,
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
                    let bgBlackout = getBackgroundBlackout();
                    bgBlackout.alpha = 0;
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
            this.menuBtn.addText(getLangText('menu'), {fontFamily: 'garamondmax', fontSize: 34, color: '#000000', align: 'center'});
            this.addLangTextUpdateable(this.menuBtn, 'menu')
            this.menuBtn.setDepth(this.baseDepth + 1);
            this.menuBtn.setScale(0.75, 0.75);
            this.listOfButtonsToDisable.push(this.menuBtn);
        } else {
            this.menuBtn.setText(getLangText('menu'));
        }

        if (!this.resumeBtn) {
            this.resumeBtn = new Button({
                normal: {
                    ref: "menu_btn_normal.png",
                    atlas: 'buttons',
                    x: gameConsts.halfWidth,
                    y: gameConsts.halfHeight + 220,
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
            this.resumeBtn.addText(getLangText('resume'), {fontFamily: 'garamondmax', fontSize: 32, color: '#000000', align: 'center'});
            this.addLangTextUpdateable(this.resumeBtn, 'resume')
            this.resumeBtn.setDepth(this.baseDepth + 1);
            this.resumeBtn.setScale(0.75, 0.75);
            this.listOfButtonsToDisable.push(this.resumeBtn);
        } else {
            this.resumeBtn.setText(getLangText('resume'));
        }

        if (!this.sliderBGM) {
            this.draggerBGM;
            this.draggerSFX;

            let startX = gameConsts.halfWidth + 25;
            this.BGMIcon = PhaserScene.add.image(gameConsts.halfWidth - 185, gameConsts.halfHeight - 270, 'ui', 'music.png').setDepth(this.baseDepth);
            this.SFXIcon = PhaserScene.add.image(gameConsts.halfWidth - 185, gameConsts.halfHeight - 190, 'ui', 'sound_full.png').setDepth(this.baseDepth);

            this.sliderBGM = new Button({
                isDraggable: true,
                normal: {
                    atlas: 'ui',
                    ref: "slider.png",
                    alpha: 0,
                    x: startX,
                    y: gameConsts.halfHeight - 270,
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
                    this.sliderBGM.setPos(startX, gameConsts.halfHeight - 250);
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
                    y: gameConsts.halfHeight - 190,
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
                    this.sliderSFX.setPos(startX, gameConsts.halfHeight - 190);
                    this.updateSFXSlider(startX, x);
                    playSound('button');
                    this.draggerSFX.setFrame('slider_indicator.png');
                },
            });
            this.sliderSFX.setDepth(this.baseDepth);
            this.listOfButtonsToDisable.push(this.sliderSFX);
            this.BGMVisual = PhaserScene.add.image(startX, gameConsts.halfHeight - 270, 'ui', 'slider.png').setDepth(this.baseDepth);
            this.SFXVisual = PhaserScene.add.image(startX, gameConsts.halfHeight - 190, 'ui', 'slider.png').setDepth(this.baseDepth);

            let musicExtraXPos = ((globalMusicVol * 10) - 9) * 30;
            let sfxExtraXPos = ((globalVolume * 10) - 9) * 30;
            this.draggerBGM = PhaserScene.add.image(startX + 4 * 30 + musicExtraXPos, gameConsts.halfHeight - 270, 'ui', 'slider_indicator.png').setDepth(this.baseDepth);
            this.draggerSFX = PhaserScene.add.image(startX + 4 * 30 + sfxExtraXPos, gameConsts.halfHeight - 190, 'ui', 'slider_indicator.png').setDepth(this.baseDepth);

            this.listOfThingsToHide.push(this.BGMIcon);
            this.listOfThingsToHide.push(this.SFXIcon);
            this.listOfThingsToHide.push(this.BGMVisual);
            this.listOfThingsToHide.push(this.SFXVisual);
            this.listOfThingsToHide.push(this.draggerBGM);
            this.listOfThingsToHide.push(this.draggerSFX);
        }

        this.createInfoBoxPosText();

        createGlobalClickBlocker();
        if (!this.closeButton) {
            this.closeButton = new Button({
                normal: {
                    atlas: 'buttons',
                    ref: "closebtn.png",
                    alpha: 0.9,
                    x: gameConsts.halfWidth + 238,
                    y: 91,
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

        this.createLanguageSelect();

        if (gameOptions.infoBoxAlign == 'left') {
            this.infoLeftButton.setState(DISABLE);
        } else if (gameOptions.infoBoxAlign == 'center') {
            this.infoCenterButton.setState(DISABLE);
        } else if (gameOptions.infoBoxAlign == 'none') {
            this.infoNoneButton.setState(DISABLE);
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

    createInfoBoxPosText() {

        if (!this.infoBoxPosText) {
            let startPos = gameConsts.halfHeight - 75;
            this.infoBoxPosText = PhaserScene.add.text(gameConsts.halfWidth - 215, startPos - 25, getLangText('spell_info_position'), {fontFamily: 'garamondmax', fontSize: 26, color: '#000000', align: 'left'}).setOrigin(0, 1).setDepth(this.baseDepth);
            this.listOfThingsToHide.push(this.infoBoxPosText);

            this.infoBoxPosTextLeft = PhaserScene.add.text(gameConsts.halfWidth - 183, startPos, getLangText('left'), {fontFamily: 'garamondmax', fontSize: 18, color: '#000000', align: 'left'}).setOrigin(0, 0.5).setDepth(this.baseDepth);
            this.listOfThingsToHide.push(this.infoBoxPosTextLeft);

            this.infoBoxPosTextCenter = PhaserScene.add.text(gameConsts.halfWidth - 13, startPos, getLangText('center'), {fontFamily: 'garamondmax', fontSize: 18, color: '#000000', align: 'left'}).setOrigin(0, 0.5).setDepth(this.baseDepth);
            this.listOfThingsToHide.push(this.infoBoxPosTextCenter);

            this.infoBoxPosTextNone = PhaserScene.add.text(gameConsts.halfWidth + 157, startPos, getLangText('hidden'), {fontFamily: 'garamondmax', fontSize: 18, color: '#000000', align: 'left'}).setOrigin(0, 0.5).setDepth(this.baseDepth);
            this.listOfThingsToHide.push(this.infoBoxPosTextNone);


            this.addLangTextUpdateable(this.infoBoxPosText, 'spell_info_position')
            this.addLangTextUpdateable(this.infoBoxPosTextLeft, 'left')
            this.addLangTextUpdateable(this.infoBoxPosTextCenter, 'center')
            this.addLangTextUpdateable(this.infoBoxPosTextNone, 'hidden')


            this.infoLeftButton = new Button({
                normal: {
                    atlas: 'buttons',
                    ref: "select_btn_normal.png",
                    alpha: 1,
                    x: gameConsts.halfWidth - 168,
                    y: startPos,
                },
                hover: {
                    atlas: 'buttons',
                    ref: "select_btn_hover.png",
                    alpha: 1,
                },
                press: {
                    atlas: 'buttons',
                    ref: "select_btn_press.png",
                    alpha: 1,
                },
                disable: {
                    atlas: 'buttons',
                    ref: "select_btn_disable.png",
                    alpha: 1,
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
                onMouseUp: (x, y) => {
                    this.infoLeftButton.setState(DISABLE);
                    this.infoCenterButton.setState(NORMAL);
                    this.infoNoneButton.setState(NORMAL);
                    gameOptions.infoBoxAlign = "left";
                    messageBus.publish('refreshHoverDisplay');
                    if (canvas) {
                        canvas.style.cursor = 'default';
                    }
                },
            });
            this.infoLeftButton.setDepth(this.baseDepth + 10);
            this.listOfButtonsToDisable.push(this.infoLeftButton);

            this.infoCenterButton = new Button({
                normal: {
                    atlas: 'buttons',
                    ref: "select_btn_normal.png",
                    alpha: 1,
                    x: gameConsts.halfWidth,
                    y: startPos,
                },
                hover: {
                    atlas: 'buttons',
                    ref: "select_btn_hover.png",
                    alpha: 1,
                },
                press: {
                    atlas: 'buttons',
                    ref: "select_btn_press.png",
                    alpha: 1,
                },
                disable: {
                    atlas: 'buttons',
                    ref: "select_btn_disable.png",
                    alpha: 1,
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
                onMouseUp: (x, y) => {
                    this.infoLeftButton.setState(NORMAL);
                    this.infoCenterButton.setState(DISABLE);
                    this.infoNoneButton.setState(NORMAL);
                    gameOptions.infoBoxAlign = "center";
                    messageBus.publish('refreshHoverDisplay');
                    if (canvas) {
                        canvas.style.cursor = 'default';
                    }
                },
            });
            this.infoCenterButton.setDepth(this.baseDepth + 10);
            this.listOfButtonsToDisable.push(this.infoCenterButton);

            this.infoNoneButton = new Button({
                normal: {
                    atlas: 'buttons',
                    ref: "select_btn_normal.png",
                    alpha: 1,
                    x: gameConsts.halfWidth + 168,
                    y: startPos,
                },
                hover: {
                    atlas: 'buttons',
                    ref: "select_btn_hover.png",
                    alpha: 1,
                },
                press: {
                    atlas: 'buttons',
                    ref: "select_btn_press.png",
                    alpha: 1,
                },
                disable: {
                    atlas: 'buttons',
                    ref: "select_btn_disable.png",
                    alpha: 1,
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
                onMouseUp: (x, y) => {
                    this.infoLeftButton.setState(NORMAL);
                    this.infoCenterButton.setState(NORMAL);
                    this.infoNoneButton.setState(DISABLE);
                    gameOptions.infoBoxAlign = "none";
                    messageBus.publish('refreshHoverDisplay');
                    if (canvas) {
                        canvas.style.cursor = 'default';
                    }
                },
            });
            this.infoNoneButton.setDepth(this.baseDepth + 10);
            this.listOfButtonsToDisable.push(this.infoNoneButton);
        } else {
            this.infoBoxPosText.setText(getLangText('spell_info_position'));
            this.infoBoxPosTextLeft.setText(getLangText('left'));
            this.infoBoxPosTextCenter.setText(getLangText('center'));
            this.infoBoxPosTextNone.setText(getLangText('hidden'));
        }
    }

    createLanguageSelect() {
        let listOfLanguages = ['english', '简体中文', '繁体中文', 'français'];
        let listOfLanguageCodes = ['en_us', 'zh_cn', 'zh_tw', 'fr'];
        if (!this.langSelectText) {
            let startPos = gameConsts.halfHeight + 15;
            this.langSelectText = PhaserScene.add.text(gameConsts.halfWidth - 215, startPos - 25, getLangText('language_text'), {fontFamily: 'garamondmax', fontSize: 26, color: '#000000', align: 'left'}).setOrigin(0, 1).setDepth(this.baseDepth);
            this.addLangTextUpdateable(this.langSelectText, 'language_text')

            this.listOfThingsToHide.push(this.langSelectText);

            this.listOfLanguageText = [];
            this.listOfLangButtons = [];

            for (let i in listOfLanguages) {
                let language = listOfLanguages[i];
                let furthestLeft = gameConsts.halfWidth - 183;
                let furthestRight = gameConsts.halfWidth + 157;
                let totalDist = furthestRight - furthestLeft;
                let intervalDist = totalDist / (listOfLanguages.length - 1)
                let newLangText = PhaserScene.add.text(furthestLeft + intervalDist * i, startPos, language, {fontFamily: 'garamondmax', fontSize: 18, color: '#000000', align: 'left'}).setOrigin(0, 0.5).setDepth(this.baseDepth);
                this.listOfThingsToHide.push(newLangText);

                let newBtn = new Button({
                    normal: {
                        atlas: 'buttons',
                        ref: "select_btn_normal.png",
                        alpha: 1,
                        x: furthestLeft + intervalDist * i + 15,
                        y: startPos,
                    },
                    hover: {
                        atlas: 'buttons',
                        ref: "select_btn_hover.png",
                        alpha: 1,
                    },
                    press: {
                        atlas: 'buttons',
                        ref: "select_btn_press.png",
                        alpha: 1,
                    },
                    disable: {
                        atlas: 'buttons',
                        ref: "select_btn_disable.png",
                        alpha: 1,
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
                    onMouseUp: (x, y) => {
                        for (let i in this.listOfLangButtons) {
                            this.listOfLangButtons[i].setState(NORMAL);
                        }
                        newBtn.setState(DISABLE);
                        messageBus.publish('refreshHoverDisplay');
                        if (canvas) {
                            canvas.style.cursor = 'default';
                        }
                        setLanguage(listOfLanguageCodes[i])
                        updateMenuLanguage();
                        this.updateOptionsLanguage();
                    },
                });
                if (language == listOfLanguageCodes[i]) {
                    newBtn.setState(DISABLE);
                }
                newBtn.language = listOfLanguageCodes[i];
                newBtn.setDepth(this.baseDepth + 10);
                this.listOfButtonsToDisable.push(newBtn);
                this.listOfLangButtons.push(newBtn);
            }
        } else {
            this.langSelectText.setText(getLangText('language_text'));
        }
        for (let i in this.listOfLangButtons) {
            if (language == this.listOfLangButtons[i].language) {
                this.listOfLangButtons[i].setState(DISABLE);
            }

        }
    }

    updateOptionsLanguage() {
        for (let i in this.langTextToUpdate) {
            let textObj = this.langTextToUpdate[i];
            textObj[0].setText(getLangText(textObj[1]))
        }
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
        globalObjects.encyclopedia.showButton();
        globalObjects.options.showButton();
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
            this.listOfButtonsToDisable[i].setAlpha(0);
        }
    }

    showButton() {
        this.button.setPos(this.startX, this.startY);
    }

    hideButton() {
        this.button.setPos(this.startX, -100);
    }
}
