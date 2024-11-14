class Options {
    constructor(scene, x, y) {
        this.startX = x;
        this.startY = y;
        this.canBeClicked = true;
        this.baseDepth = 101000;
        this.langTextToUpdate = [];
        this.listOfThingsToHide = [];
        this.listOfThingsToHideSemiAlpha = [];
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
                playSound('click',1.1).detune = 220;
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
        messageBus.subscribe('cancelScreen', this.cancelScreen.bind(this));
    }

    cancelScreen() {
        if (this.popupElements && this.popupElements.length > 0) {
            if (!this.popupElements[0].isDestroyed) {
                for (let i in this.popupElements) {
                    this.popupElements[i].destroy();
                }
                return;
            }
        }
        this.hideOptions();
    }

    addLangTextUpdateable(obj, textid) {
        this.langTextToUpdate.push([obj, textid]);
    }

    showOptions() {
        if (!this.canBeClicked || this.opened || this.canClose) {
            console.log("fail open because", this.canBeClicked, this.opened, this.canClose);
            return;
        }
        if (globalObjects.currentEnemy && !globalObjects.currentEnemy.dead) {
            sdkGameplayStop();
        }
        this.opened = true;
        addPopup(this.hideOptions.bind(this));
        globalObjects.encyclopedia.hideButton();
        globalObjects.options.hideButton();
        playSound('flip2')
        if (this.hidingAnim1) {
            this.hidingAnim1.stop();
        }
        if (this.hidingAnim2) {
            this.hidingAnim2.stop();
        }

        if (!this.darkenBG) {
            this.darkenBG = PhaserScene.add.image(gameConsts.halfWidth, gameConsts.halfHeight, 'blackPixel').setDepth(this.baseDepth);
            this.darkenBG.setScale(500, 500).setAlpha(0.4);
            this.listOfThingsToHide.push(this.darkenBG);
        }
        if (!this.bgPage) {
            this.bgPage = PhaserScene.add.image(gameConsts.halfWidth, gameConsts.halfHeight - 2, 'ui', 'paper.png').setDepth(this.baseDepth).setScale(1, 0.9);
            this.listOfThingsToHide.push(this.bgPage);
        }

        if (!this.settingsTitle) {
            this.settingsTitle = PhaserScene.add.text(gameConsts.halfWidth - 230, isMobile ? gameConsts.halfWidth - 115 : gameConsts.halfWidth - 132, getLangText('settings'), {fontFamily: 'germania', fontSize: 28, color: '#200000', align: 'left'}).setOrigin(0, 1).setDepth(this.baseDepth);
        }
        this.listOfThingsToHideSemiAlpha.push(this.settingsTitle);
        this.addLangTextUpdateable(this.settingsTitle, 'settings')

        if (!this.menuBtn) {
            this.menuBtn = new Button({
                normal: {
                    ref: "menu_btn_normal.png",
                    atlas: 'buttons',
                    x: gameConsts.halfWidth - 135,
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
                    if (globalObjects.currentEnemy && !globalObjects.currentEnemy.isDestroyed) {
                        this.popupElements = showYesNoPopup(getLangText('exit'), getLangText('back'), getLangText('main_menu'), getLangText('exit_long'), () => {
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
                        }, true)
                    } else {
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
                }
            });
            this.menuBtn.addText(getLangText('menu'), {fontFamily: 'germania', fontSize: 28, color: '#000000', align: 'center'});
            this.addLangTextUpdateable(this.menuBtn, 'menu')
            this.menuBtn.setDepth(this.baseDepth + 1);
            this.menuBtn.setScale(0.8, 0.8);
            this.listOfButtonsToDisable.push(this.menuBtn);
        } else {
            this.menuBtn.setText(getLangText('menu'));
        }

        if (!this.resumeBtn) {
            this.resumeBtn = new Button({
                normal: {
                    ref: "menu_btn2_normal.png",
                    atlas: 'buttons',
                    x: gameConsts.halfWidth + 135,
                    y: gameConsts.halfHeight + 220,
                    alpha: 1,
                },
                hover: {
                    ref: "menu_btn2_hover.png",
                    atlas: 'buttons',
                    alpha: 1,
                },
                press: {
                    ref: "menu_btn2_normal.png",
                    atlas: 'buttons',
                    alpha: 1,
                },
                disable: {
                    ref: "menu_btn2_normal.png",
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
                    if (globalObjects.currentEnemy && !globalObjects.currentEnemy.dead) {
                        sdkGameplayStart();
                    }
                }
            });
            this.resumeBtn.addText(getLangText('resume'), {fontFamily: 'germania', fontSize: 28, color: '#000000', align: 'center'});
            this.addLangTextUpdateable(this.resumeBtn, 'resume')
            this.resumeBtn.setDepth(this.baseDepth + 1);
            this.resumeBtn.setScale(0.8, 0.8);
            this.listOfButtonsToDisable.push(this.resumeBtn);
        } else {
            this.resumeBtn.setText(getLangText('resume'));
        }

        if (!this.sliderBGM) {
            this.draggerBGM;
            this.draggerSFX;

            let startX = gameConsts.halfWidth + 15;
            this.BGMIcon = PhaserScene.add.image(gameConsts.halfWidth - 200, gameConsts.halfHeight - 179, 'ui', 'music.png').setDepth(this.baseDepth);
            this.SFXIcon = PhaserScene.add.image(gameConsts.halfWidth - 200, gameConsts.halfHeight - 113, 'ui', 'sound_full.png').setDepth(this.baseDepth);

            this.sliderBGM = new Button({
                isDraggable: true,
                normal: {
                    atlas: 'ui',
                    ref: "slider.png",
                    alpha: 0,
                    x: startX,
                    y: this.BGMIcon.y,
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
                    this.sliderBGM.setPos(startX, this.BGMIcon.y);
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
                    y: this.SFXIcon.y,
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
                    this.sliderSFX.setPos(startX, this.SFXIcon.y);
                    this.updateSFXSlider(startX, x);
                    playSound('button');
                    this.draggerSFX.setFrame('slider_indicator.png');
                },
            });
            this.sliderSFX.setDepth(this.baseDepth);
            this.listOfButtonsToDisable.push(this.sliderSFX);
            this.BGMVisual = PhaserScene.add.image(startX, this.BGMIcon.y, 'ui', 'slider.png').setDepth(this.baseDepth);
            this.SFXVisual = PhaserScene.add.image(startX, this.SFXIcon.y, 'ui', 'slider.png').setDepth(this.baseDepth);

            let musicExtraXPos = ((globalMusicVol * 10) - 9) * 30;
            let sfxExtraXPos = ((globalVolume * 10) - 9) * 30;
            this.draggerBGM = PhaserScene.add.image(startX + 4 * 30 + musicExtraXPos, this.BGMIcon.y, 'ui', 'slider_indicator.png').setDepth(this.baseDepth);
            this.draggerSFX = PhaserScene.add.image(startX + 4 * 30 + sfxExtraXPos, this.SFXIcon.y, 'ui', 'slider_indicator.png').setDepth(this.baseDepth);

            this.listOfThingsToHideSemiAlpha.push(this.BGMIcon);
            this.listOfThingsToHideSemiAlpha.push(this.SFXIcon);
            this.listOfThingsToHideSemiAlpha.push(this.BGMVisual);
            this.listOfThingsToHideSemiAlpha.push(this.SFXVisual);
            this.listOfThingsToHide.push(this.draggerBGM);
            this.listOfThingsToHide.push(this.draggerSFX);
        }

        this.createInfoBoxPosText();
        this.createSkipIntroToggle();

        createGlobalClickBlocker();
        if (!this.closeButton) {
            this.closeButton = new Button({
                normal: {
                    atlas: 'buttons',
                    ref: "closebtn.png",
                    alpha: 0.95,
                    x: gameConsts.halfWidth + 240,
                    y: gameConsts.halfHeight - 241,
                },
                hover: {
                    alpha: 1,
                    atlas: 'buttons',
                    ref: "closebtn_hover.png",
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
                    this.hideOptions();
                    if (globalObjects.currentEnemy && !globalObjects.currentEnemy.dead) {
                        sdkGameplayStart();
                    }
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
        this.createCodeItem();

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
        for (let i = 0; i < this.listOfThingsToHideSemiAlpha.length; i++) {
            this.listOfThingsToHideSemiAlpha[i].alpha = 0.82;
        }
        this.darkenBG.setAlpha(0.4);
        this.bgPage.setAlpha(0.2);
        PhaserScene.tweens.add({
             targets: this.bgPage,
             alpha: 1,
             ease: 'Cubic.easeOut',
             duration: 0.25,
            onComplete: () => {
                 this.canClose = true;
            }
        });
        messageBus.publish('pauseGame', 0.002);

    }

    createInfoBoxPosText() {

        if (!this.infoBoxPosText) {
            let startPos = gameConsts.halfHeight - 10;
            this.infoBoxPosText = PhaserScene.add.text(gameConsts.halfWidth - 230, startPos - 23, getLangText('spell_info_position'), {fontFamily: 'germania', fontSize: 28, color: '#200000', align: 'left'}).setOrigin(0, 1).setDepth(this.baseDepth);
            this.listOfThingsToHideSemiAlpha.push(this.infoBoxPosText);

            this.infoBoxPosTextLeft = PhaserScene.add.text(gameConsts.halfWidth - 193, startPos, getLangText('left'), {fontFamily: 'germania', fontSize: 20, color: '#200000', align: 'left'}).setOrigin(0, 0.5).setDepth(this.baseDepth);
            this.listOfThingsToHideSemiAlpha.push(this.infoBoxPosTextLeft);

            this.infoBoxPosTextCenter = PhaserScene.add.text(gameConsts.halfWidth - 18, startPos, getLangText('center'), {fontFamily: 'germania', fontSize: 20, color: '#200000', align: 'left'}).setOrigin(0, 0.5).setDepth(this.baseDepth);
            this.listOfThingsToHideSemiAlpha.push(this.infoBoxPosTextCenter);

            this.infoBoxPosTextNone = PhaserScene.add.text(gameConsts.halfWidth + 157, startPos, getLangText('hidden'), {fontFamily: 'germania', fontSize: 20, color: '#200000', align: 'left'}).setOrigin(0, 0.5).setDepth(this.baseDepth);
            this.listOfThingsToHideSemiAlpha.push(this.infoBoxPosTextNone);


            this.addLangTextUpdateable(this.infoBoxPosText, 'spell_info_position')
            this.addLangTextUpdateable(this.infoBoxPosTextLeft, 'left')
            this.addLangTextUpdateable(this.infoBoxPosTextCenter, 'center')
            this.addLangTextUpdateable(this.infoBoxPosTextNone, 'hidden')


            this.infoLeftButton = new Button({
                normal: {
                    atlas: 'buttons',
                    ref: "select_btn_normal.png",
                    alpha: 1,
                    x: gameConsts.halfWidth - 178,
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
                    sdkSetItem("info_align", gameOptions.infoBoxAlign);
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
                    x: gameConsts.halfWidth - 5,
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
                    sdkSetItem("info_align", gameOptions.infoBoxAlign);
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
                    sdkSetItem("info_align", gameOptions.infoBoxAlign);
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
        let listOfLanguages = ['English', '简体中文', '繁体中文', 'Français'];
        let listOfLanguageCodes = ['en_us', 'zh_cn', 'zh_tw', 'fr'];
        if (!this.langSelectText) {
            let startPos = gameConsts.halfHeight + 80;
            this.langSelectText = PhaserScene.add.text(gameConsts.halfWidth - 230, startPos - 43, getLangText('language_text'), {fontFamily: 'germania', fontSize: 28, color: '#200000', align: 'left'}).setOrigin(0, 0.5).setDepth(this.baseDepth).setAlpha(0.82);
            this.addLangTextUpdateable(this.langSelectText, 'language_text')

            this.langWarningText = PhaserScene.add.text(gameConsts.halfWidth + 215, startPos - 31, getLangText('translate_warn'), {fontFamily: 'germania', fontSize: 16, color: '#604A4A', align: 'right'}).setOrigin(1, 0.6).setDepth(this.baseDepth).setAlpha(0.82);
            this.addLangTextUpdateable(this.langWarningText, 'translate_warn')


            this.listOfThingsToHideSemiAlpha.push(this.langSelectText);
            this.listOfThingsToHideSemiAlpha.push(this.langWarningText);

            this.listOfLanguageText = [];
            this.listOfLangButtons = [];

            for (let i in listOfLanguages) {
                let language = listOfLanguages[i];
                let furthestLeft = gameConsts.halfWidth - 193;
                let furthestRight = gameConsts.halfWidth + 157;
                let totalDist = furthestRight - furthestLeft;
                let intervalDist = totalDist / (listOfLanguages.length - 1)
                let newLangText = PhaserScene.add.text(furthestLeft + intervalDist * i - 4, startPos, language, {fontFamily: 'germania', fontSize: 20, color: '#200000', align: 'left'}).setOrigin(0, 0.5).setDepth(this.baseDepth);
                this.listOfThingsToHideSemiAlpha.push(newLangText);

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

    createCodeItem() {
        if (!this.codeAnnounce) {
            return;
            // let startPos = gameConsts.halfHeight + 100;
            let leftMostX = gameConsts.halfWidth - 200;
            let topMostY = this.bgPage.y + 100;
            let spacingX = 160;
            let spacingY = 45;

            this.codeAnnounce = PhaserScene.add.text(gameConsts.halfWidth, topMostY + spacingY * 3, "HELLO!", {fontFamily: 'germania', fontSize: 30, color: '#00FF33', align: 'center'}).setOrigin(0.5, 0.4).setDepth(this.baseDepth + 2).setStroke('#200000', 5);
            this.codeAnnounce.visible = false;
            this.listOfThingsToHide.push(this.codeAnnounce);

            this.codeItemText = PhaserScene.add.text(gameConsts.halfWidth - 230, gameConsts.halfHeight + 45, getLangText('access_code'), {fontFamily: 'germania', fontSize: 28, color: '#200000', align: 'left'}).setOrigin(0, 0.5).setDepth(this.baseDepth + 1);
            this.listOfThingsToHideSemiAlpha.push(this.codeItemText);
            this.addLangTextUpdateable(this.codeItemText, 'access_code')

            let order = [
                'energy',
                'shield',
                'void'
            ];
            for (let i = 0; i < 3; i++) {
                let nextBtn = new Button({
                    normal: {
                        ref: order[i] + "_btn.png",
                        atlas: 'ui',
                        x: leftMostX + i * spacingX,
                        y: topMostY,
                        alpha: 0.95,
                    },
                    hover: {
                        ref: order[i] + "_btn_hover.png",
                        atlas: 'ui',
                        alpha: 1,
                    },
                    press: {
                        ref: order[i] + "_btn_press.png",
                        atlas: 'ui',
                        alpha: 1,
                    },
                    disable: {
                        ref: order[i] + "_btn_disable.png",
                        atlas: 'ui',
                        alpha: 0.95
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
                        this.activateCode(i);
                    }
                });
                nextBtn.setDepth(this.baseDepth + 1);
                this.listOfButtonsToDisable.push(nextBtn);
            }
            /*


            this.addLangTextUpdateable(this.codeItemText, 'access_code')
            for (let i = 0; i < 5; i++) {
                let arrowBtn = new Button({
                    normal: {
                        ref: "combo_btn.png",
                        atlas: 'ui',
                        x: arrowStartX + i * spacing,
                        y: arrowDownY,
                        alpha: 1,
                    },
                    hover: {
                        ref: "combo_btn_hover.png",
                        atlas: 'ui',
                        alpha: 1,
                    },
                    press: {
                        ref: "combo_btn_press.png",
                        atlas: 'ui',
                        alpha: 1,
                    },
                    disable: {
                        ref: "combo_btn.png",
                        atlas: 'ui',
                        alpha: 0
                    },
                    onHover: () => {
                        if (canvas) {
                            canvas.style.cursor = 'pointer';
                            canvas.style.cursorOn = arrowBtn;
                        }
                    },
                    onHoverOut: () => {
                        if (canvas) {
                            if (canvas.style.cursorOn == arrowBtn) {
                                canvas.style.cursor = 'default';
                            }
                        }
                    },
                    onMouseUp: () => {
                        this.scrollDown(i);
                    }
                });
                arrowBtn.setDepth(this.baseDepth + 1);
                // this.resumeBtn.setScale(0.82, 0.82);
                this.listOfButtonsToDisable.push(arrowBtn);
            }
            for (let i = 0; i < 5; i++) {
                let arrowBtnUp = new Button({
                    normal: {
                        ref: "combo_btn.png",
                        atlas: 'ui',
                        x: arrowStartX + i * spacing,
                        y: arrowUpY,
                        scaleY: -1,
                        alpha: 1,
                    },
                    hover: {
                        ref: "combo_btn_hover.png",
                        atlas: 'ui',
                        scaleY: -1,
                        alpha: 1,
                    },
                    press: {
                        ref: "combo_btn_press.png",
                        atlas: 'ui',
                        scaleY: -1,
                        alpha: 1,
                    },
                    disable: {
                        ref: "combo_btn.png",
                        atlas: 'ui',
                        scaleY: -1,
                        alpha: 0
                    },
                    onHover: () => {
                        if (canvas) {
                            canvas.style.cursor = 'pointer';
                            canvas.style.cursorOn = arrowBtnUp;
                        }
                    },
                    onHoverOut: () => {
                        if (canvas) {
                            if (canvas.style.cursorOn == arrowBtnUp) {
                                canvas.style.cursor = 'default';
                            }
                        }
                    },
                    onMouseUp: () => {
                        this.scrollUp(i);
                    }
                });
                arrowBtnUp.setDepth(this.baseDepth + 1);
                // this.resumeBtn.setScale(0.82, 0.82);
                this.listOfButtonsToDisable.push(arrowBtnUp);
            }

            this.listOfRunes = ['bright_rune_matter.png', 'bright_rune_mind.png', 'bright_rune_time.png', 'bright_rune_void.png',
                'bright_rune_strike.png', 'bright_rune_enhance.png', 'bright_rune_protect.png', 'bright_rune_reinforce.png', 'bright_rune_unload.png',
            ];
            this.listOfIconPos = [0, 0, 0, 0, 0];
            this.listOfIcons = []
            for (let i = 0; i < 5; i++) {
                this.listOfIcons[i] = [];
                this.icon1PosY = centerPos - 34;
                this.icon2PosY = centerPos ;
                this.icon3PosY = centerPos + 34;
                let rune1 = PhaserScene.add.sprite(arrowStartX + spacing * i, this.icon1PosY, 'circle', this.listOfRunes[1]).setDepth(this.baseDepth).setOrigin(0.5, 0.16).setScale(0.92, 0.41).setAlpha(0.82);
                let rune2 = PhaserScene.add.sprite(arrowStartX + spacing * i, this.icon2PosY, 'circle', this.listOfRunes[0]).setDepth(this.baseDepth).setOrigin(0.5, 0.16).setScale(0.92).setAlpha(1);
                let rune3 = PhaserScene.add.sprite(arrowStartX + spacing * i, this.icon3PosY, 'circle', this.listOfRunes[8]).setDepth(this.baseDepth).setOrigin(0.5, 0.16).setScale(0.92, 0.41).setAlpha(0.82);
                this.listOfIcons[i].push(rune1);
                this.listOfIcons[i].push(rune2);
                this.listOfIcons[i].push(rune3);
                this.listOfThingsToHideSemiAlpha.push(rune1);
                this.listOfThingsToHide.push(rune2);
                this.listOfThingsToHideSemiAlpha.push(rune3);
            }
             */
        }
    }

    createSkipIntroToggle() {
        if (!this.introText) {
            let startPos = gameConsts.halfHeight + 150;
            // this.introText = PhaserScene.add.text(gameConsts.halfWidth - 230, startPos, getLangText('skip_intro'), {fontFamily: 'germania', fontSize: 28, color: '#200000', align: 'left'}).setOrigin(0, 0.5).setDepth(this.baseDepth).setAlpha(0.82);
            this.introText = PhaserScene.add.text(gameConsts.halfWidth - 193, startPos, getLangText('skip_intro'), {fontFamily: 'germania', fontSize: 20, color: '#200000', align: 'left'}).setOrigin(0, 0.5).setDepth(this.baseDepth).setAlpha(0.82);
            this.addLangTextUpdateable(this.introText, 'skip_intro')
            this.listOfThingsToHideSemiAlpha.push(this.introText);


            this.introToggleVisual = PhaserScene.add.sprite(gameConsts.halfWidth - 153, startPos, 'buttons', gameOptions.skipIntro ? 'check_box_on.png' : 'check_box_normal.png')
            this.introToggleVisual.setDepth(this.baseDepth + 1);
            this.listOfThingsToHide.push(this.introToggleVisual);

            this.introButton = new Button({
                normal: {
                    atlas: 'buttons',
                    ref: "check_box_normal.png",
                    alpha: 0,
                    x: this.introToggleVisual.x,
                    y: startPos,
                },
                onHover: () => {
                    if (canvas) {
                        canvas.style.cursor = 'pointer';
                    }
                    if (gameOptions.skipIntro) {
                        this.introToggleVisual.setFrame('check_box_hover2.png');
                    } else {
                        this.introToggleVisual.setFrame('check_box_hover.png');
                    }
                },
                onHoverOut: () => {
                    if (canvas) {
                        canvas.style.cursor = 'default';
                    }
                    this.introToggleVisual.setFrame(gameOptions.skipIntro ? 'check_box_on.png' : 'check_box_normal.png');

                },
                onMouseUp: (x, y) => {
                    gameOptions.skipIntro = !gameOptions.skipIntro;
                    this.introToggleVisual.setFrame(gameOptions.skipIntro ? 'check_box_on.png' : 'check_box_normal.png');

                    sdkSetItem("skip_intro", gameOptions.skipIntro.toString());
                },
            });
            this.introButton.setDepth(this.baseDepth + 10);
            this.listOfButtonsToDisable.push(this.introButton);
        }
    }

    updateRunes(rune1, rune2, rune3, idx) {
        rune1.setFrame(this.listOfRunes[(this.listOfIconPos[idx] + 1) % 9])
        rune2.setFrame(this.listOfRunes[this.listOfIconPos[idx]])
        rune3.setFrame(this.listOfRunes[(this.listOfIconPos[idx] + 8) % 9])
        rune1.setOrigin(0.5, 0.16);
        rune2.setOrigin(0.5, 0.16);
        rune3.setOrigin(0.5, 0.16);
    }

    scrollDown(idx) {
        let rune1 = this.listOfIcons[idx][0];
        let rune2 = this.listOfIcons[idx][1];
        let rune3 = this.listOfIcons[idx][2];
        this.updateRunes(rune1, rune2, rune3, idx);

        this.listOfIconPos[idx] = (this.listOfIconPos[idx] + 1) % 9;
        if (rune1.currAnim1) {
            rune1.currAnim1.stop();
            rune1.currAnim2.stop();
            rune2.currAnim1.stop();
            rune2.currAnim2.stop();
            rune3.currAnim1.stop();
            rune3.currAnim2.stop();
        }
        rune1.y = this.icon1PosY;
        rune2.y = this.icon2PosY;
        rune3.y = this.icon3PosY;

        rune1.setScale(0.92, 0.41);
        rune2.setScale(0.92);
        rune3.setScale(0.92, 0.41);

        rune1.currAnim1 = PhaserScene.tweens.add({
            targets: rune1,
            y: this.icon2PosY,
            duration: 0.15,
        });
        rune1.currAnim2 = PhaserScene.tweens.add({
            targets: rune1,
            scaleY: 0.92,
            ease: 'Cubic.easeOut',
            duration: 0.15,

        });
        rune2.currAnim1 = PhaserScene.tweens.add({
            targets: rune2,
            y: this.icon3PosY,
            ease: 'Quad.easeOut',
            duration: 0.15,
        });
        rune2.currAnim2 = PhaserScene.tweens.add({
            targets: rune2,
            scaleY: 0.41,
            alpha: 0.82,
            ease: 'Quad.easeIn',
            duration: 0.15,
        });

        rune3.currAnim1 = PhaserScene.tweens.add({
            targets: rune3,
            y: this.icon3PosY + 4,
            duration: 0.1,
            ease: 'Quad.easeOut',
            onComplete: () => {
                rune3.y = this.icon1PosY - 4
                rune3.setFrame(this.listOfRunes[(this.listOfIconPos[idx] + 1) % 9])
                rune3.setOrigin(0.5, 0.16);
                rune3.currAnim1 = PhaserScene.tweens.add({
                    targets: rune3,
                    y: this.icon1PosY,
                    duration: 0.1,
                    onComplete: () => {
                        rune1.scaleY = 0.41;
                        rune1.y = this.icon1PosY;
                        rune2.scaleY = 0.92;
                        rune2.y = this.icon2PosY;
                        rune2.alpha = 1;
                        rune3.scaleY = 0.41;
                        rune3.y = this.icon3PosY;
                        this.updateRunes(rune1, rune2, rune3, idx);
                    }
                });
                rune3.currAnim2 = PhaserScene.tweens.add({
                    targets: rune3,
                    scaleY: 0.41,
                    duration: 0.1,
                });
            }
        });
        rune3.currAnim2 = PhaserScene.tweens.add({
            targets: rune3,
            ease: 'Quad.easeOut',
            scaleY: 0,
            duration: 0.1,
        });
    }

    scrollUp(idx) {
        let rune1 = this.listOfIcons[idx][0];
        let rune2 = this.listOfIcons[idx][1];
        let rune3 = this.listOfIcons[idx][2];
        this.updateRunes(rune1, rune2, rune3, idx);

        this.listOfIconPos[idx] = (this.listOfIconPos[idx] + 8) % 9;
        if (rune1.currAnim1) {
            rune1.currAnim1.stop();
            rune1.currAnim2.stop();
            rune2.currAnim1.stop();
            rune2.currAnim2.stop();
            rune3.currAnim1.stop();
            rune3.currAnim2.stop();
        }
        rune1.y = this.icon1PosY;
        rune2.y = this.icon2PosY;
        rune3.y = this.icon3PosY;

        rune1.setScale(0.92, 0.41);
        rune2.setScale(0.92);
        rune3.setScale(0.92, 0.41);

        rune3.currAnim1 = PhaserScene.tweens.add({
            targets: rune3,
            y: this.icon2PosY,
            duration: 0.2,
        });
        rune3.currAnim2 = PhaserScene.tweens.add({
            targets: rune3,
            scaleY: 0.92,
            ease: 'Cubic.easeOut',
            duration: 0.2,

        });
        rune2.currAnim1 = PhaserScene.tweens.add({
            targets: rune2,
            y: this.icon1PosY,
            ease: 'Quad.easeOut',
            duration: 0.2,
        });
        rune2.currAnim2 = PhaserScene.tweens.add({
            targets: rune2,
            scaleY: 0.41,
            alpha: 0.82,
            ease: 'Quad.easeIn',
            duration: 0.2,
        });

        rune1.currAnim1 = PhaserScene.tweens.add({
            targets: rune1,
            y: this.icon1PosY - 4,
            duration: 0.1,
            ease: 'Quad.easeOut',
            onComplete: () => {
                rune1.y = this.icon3PosY + 4;
                rune1.setFrame(this.listOfRunes[(this.listOfIconPos[idx] + 8) % 9])
                rune1.setOrigin(0.5, 0.16);
                rune1.currAnim1 = PhaserScene.tweens.add({
                    targets: rune1,
                    y: this.icon3PosY,
                    duration: 0.1,
                    onComplete: () => {
                        rune1.scaleY = 0.41;
                        rune1.y = this.icon1PosY;
                        rune2.scaleY = 0.92;
                        rune2.y = this.icon2PosY;
                        rune2.alpha = 1;
                        rune3.scaleY = 0.41;
                        rune3.y = this.icon3PosY;
                        this.updateRunes(rune1, rune2, rune3, idx);
                    }
                });
                rune1.currAnim2 = PhaserScene.tweens.add({
                    targets: rune1,
                    scaleY: 0.41,
                    duration: 0.1,
                });
            }
        });
        rune1.currAnim2 = PhaserScene.tweens.add({
            targets: rune1,
            ease: 'Quad.easeOut',
            scaleY: 0,
            duration: 0.1,
        });
    }

    activateCode() {
        if (!this.listOfIconPos) {
            return;
        }
        if (this.listOfIconPos.length < 5) {
            return;
        }
        let codeVal = this.listOfIconPos[1] * 1000 + this.listOfIconPos[2] * 100 + this.listOfIconPos[3] * 10 + this.listOfIconPos[4];
        codeVal = String.fromCharCode(this.listOfIconPos[0] + 65) + codeVal.toString();
        console.log(codeVal);
        console.log(sha256(codeVal));
        this.codeAnnounce.visible = true;
        this.codeAnnounce.alpha = 1;
        this.codeAnnounce.setColor('#00FF33');
        this.codeAnnounce.setScale(1);
        if (this.codeAnnounce.currAnim) {
            this.codeAnnounce.currAnim.stop();
        }

        switch(sha256(codeVal)) {
            case 'aa508c2187fca56f397ff75adc52b94e02f38122cdd48bd42105106e5e0f8e14':
                // all matter
                this.codeAnnounce.setText("CODES CAN UNLOCK\nDIFFERENT PARTS OF THE GAME.");
                this.codeAnnounce.setScale(0.75);
                break;
            case '1865223aedef36687e7506a828eb83b78f139d3a927946593cca1636933be360':
                this.codeAnnounce.setText("Level: Goblin")
                clearMenuButtons();
                globalObjects.postFightScreen.clearPostFightScreen();
                beginPreLevel(2);
                this.hideOptions();
                globalObjects.encyclopedia.hideButton();
                globalObjects.options.hideButton();
                break;
            case '959c1c84d4572ce1b60ed01e0ffef02db605a973792b7c632b0bdc402654a456':
                this.codeAnnounce.setText("Level: Tree")
                clearMenuButtons();
                globalObjects.postFightScreen.clearPostFightScreen();
                beginPreLevel(3);
                this.hideOptions();
                globalObjects.encyclopedia.hideButton();
                globalObjects.options.hideButton();
                break;
            case '4fb04b4ad0f01d65f9848680910fbb8587136f3845c0edca243f827005d86eb8':
                this.codeAnnounce.setText("Level: Magician")
                clearMenuButtons();
                globalObjects.postFightScreen.clearPostFightScreen();
                beginPreLevel(4);
                this.hideOptions();
                globalObjects.encyclopedia.hideButton();
                globalObjects.options.hideButton();
                break;
            case 'eb0c0da2a8245bf41ab37672ee7b3497e5ec47b4b69d0d58741a280aa250763c':
                this.codeAnnounce.setText("Level: Knight")
                clearMenuButtons();
                globalObjects.postFightScreen.clearPostFightScreen();
                beginPreLevel(5);
                this.hideOptions();
                globalObjects.encyclopedia.hideButton();
                globalObjects.options.hideButton();
                break;
            case '5c864ebe1619f609becf7c741d074a54e66f3d77b0d4274ad290a5b68a4b8468':
                this.codeAnnounce.setText("Level: Wall")
                clearMenuButtons();
                globalObjects.postFightScreen.clearPostFightScreen();
                beginPreLevel(6);
                this.hideOptions();
                globalObjects.encyclopedia.hideButton();
                globalObjects.options.hideButton();
                break;
            case '65daf73e9bc15ea710fdb3873b397d2b6eb180fecaf9bf43507a63f22a857b5b':
                this.codeAnnounce.setText("Level: Super Doll")
                clearMenuButtons();
                globalObjects.postFightScreen.clearPostFightScreen();
                beginPreLevel(7);
                this.hideOptions();
                globalObjects.encyclopedia.hideButton();
                globalObjects.options.hideButton();
                break;
            case '445714fa45b496cd630e03e196c77fcb1710e285cb5180f22c9cf9210cff4603':
                this.codeAnnounce.setText("Level: Assassin")
                clearMenuButtons();
                globalObjects.postFightScreen.clearPostFightScreen();
                beginPreLevel(8);
                this.hideOptions();
                globalObjects.encyclopedia.hideButton();
                globalObjects.options.hideButton();
                break;
            case '26d38d317704c4982064ac2867e0556d6935cb53a81889ce85ea60be7f1771c5':
                this.codeAnnounce.setText("Level: Robot")
                clearMenuButtons();
                globalObjects.postFightScreen.clearPostFightScreen();
                beginPreLevel(9);
                this.hideOptions();
                globalObjects.encyclopedia.hideButton();
                globalObjects.options.hideButton();
                break;
            case '74291ba36b6bdc4c9cf428eda60dcaac0b867971312a61240c1d834b06b34fd7':
                this.codeAnnounce.setText("Level: Death The Reaper")
                clearMenuButtons();
                globalObjects.postFightScreen.clearPostFightScreen();
                beginPreLevel(10);
                this.hideOptions();
                break;
            case 'dd0e5c288c1062d8abb0b28f1dfd35129c576a28ee7ba1603c43e696cbe6a8cb':
                this.codeAnnounce.setText("Level: Death The Destroyer")
                clearMenuButtons();
                globalObjects.postFightScreen.clearPostFightScreen();
                beginPreLevel(11);
                this.hideOptions();
                break;
            case '85ea9896b888eae23cb13e39826cde6c2511183518f2c31d218be4cc7fd51446':
                this.codeAnnounce.setText("Level: Death The Destroyer++")
                clearMenuButtons();
                globalObjects.postFightScreen.clearPostFightScreen();
                beginPreLevel(12);
                this.hideOptions();
                break;
            case 'f8fefa9c66edaa0100adb94e85641e9ec3e612a76573e2a18d5dcdbfb4426482':
                this.codeAnnounce.setText("Level: Death The Guide")
                clearMenuButtons();
                globalObjects.postFightScreen.clearPostFightScreen();
                beginPreLevel(13);
                this.hideOptions();
                break;
            case 'b71eb988a0e29ad88f899faa4123a6eaa2d7978b230989fca0dd112f08efec2e':
                this.codeAnnounce.setText("Skipping entire game!!!")
                this.codeAnnounce.setScale(0.9);
                setTimeout(() => {
                    this.codeAnnounce.setText("(joking)")
                    playSound('derp', 0.4);
                }, 2500)
                break;
            case '4ce5c0152be75f840fc291699586c69dc49aacd4b66d44ed82bac3ab81fba232':
                toggleCheat('inam')
                if (cheats.infiniteAmmo) {
                    this.codeAnnounce.setText("CHEAT: INFINITE AMMO ENABLED");
                    playSound('mind_ultimate_2', 0.75);
                } else {
                    this.codeAnnounce.setText("INFINITE AMMO DISABLED");
                    this.codeAnnounce.setColor('#888888');
                    this.codeAnnounce.setScale(0.9);
                }
                break;
            case '07a3f553bd83604c46badf5d59495e72a539c570fbc58ab16d5c0fb6a5a1535a':
                toggleCheat('flal')
                if (cheats.fullArsenal) {
                    this.codeAnnounce.setText("CHEAT: FULL ARSENAL ENABLED");
                    playSound('matter_body', 0.6);
                } else {
                    this.codeAnnounce.setText("FULL ARSENAL DISABLED");
                    this.codeAnnounce.setColor('#888888');
                    this.codeAnnounce.setScale(0.9);
                }
                break;
            case '7468eb2fafacc40a127adab1f3e84914ddb48c8daa63f4992ef42d5390aa8e2b':
                toggleCheat('ultr')
                if (cheats.extraUlt) {
                    this.codeAnnounce.setText("CHEAT: EXTRA ULT RUNE ENABLED");
                    playSound('matter_body', 0.6);
                } else {
                    this.codeAnnounce.setText("EXTRA ULT RUNE DISABLED");
                    this.codeAnnounce.setColor('#888888');
                    this.codeAnnounce.setScale(0.9);
                }
                break;
            case '16a36e86f6fed5d465ff332511a0ce1a863b55d364b25a7cdaa25db19abf9648':
                toggleCheat('hpdx')
                if (cheats.bonusHealth) {
                    this.codeAnnounce.setText("CHEAT: +20 HEALTH ENABLED");
                    playSound('magic', 0.6);
                } else {
                    this.codeAnnounce.setText("+20 HEALTH DISABLED");
                    this.codeAnnounce.setColor('#888888');
                    this.codeAnnounce.setScale(0.9);
                }
                break;
            case '96c89195a5a61917821ba4bef1e432bebcc13db08e6c36b6210f5bc6a0268fab':
                this.codeAnnounce.setText("HEAL SELF");
                playSound('magic', 0.6);
                gameVars.hasCheated = true;
                updateCheatsDisplay();
                globalObjects.player.selfHeal(80);
                break;
            case 'ec3851e00c9a510bd82c08299cc9366df7291b0e35e3cc8577c6e18c913d944e':
                toggleCheat('cene');
                if (cheats.calmEnemies) {
                    this.codeAnnounce.setText("CHEAT: CALM ENEMIES ENABLED");
                    playSound('mind_enhance', 0.7);
                } else {
                    this.codeAnnounce.setText("CALM ENEMIES DISABLED");
                    this.codeAnnounce.setColor('#888888');
                    this.codeAnnounce.setScale(0.9);
                }
                break;
            case '38a5be817f63fcd1d3207358368ad2f7ef81e1c21d225c6c15efcc8184c4ca49':
                challenges.angryEnemies = !challenges.angryEnemies;
                if (challenges.angryEnemies) {
                    this.codeAnnounce.setText("CHALLENGE: ANGRY ENEMIES ENABLED");
                    this.codeAnnounce.setColor('#FF0000');
                    playSound('mind_shield_retaliate', 0.7);
                } else {
                    this.codeAnnounce.setText("ANGRY ENEMIES DISABLED");
                    this.codeAnnounce.setColor('#888888');
                    this.codeAnnounce.setScale(0.9);
                }
                break;
            case 'c283b107c9be924f5be08e4f91abf2a042d2b58b0770ff9810bd4dc2620fcf0c':
                challenges.lowHealth = !challenges.lowHealth;
                globalObjects.player.reInitStats();
                globalObjects.player.resetStats();
                if (challenges.lowHealth) {
                    this.codeAnnounce.setText("CHALLENGE: LOW HEALTH ENABLED");
                    this.codeAnnounce.setColor('#FF0000');
                    playSound('void_body', 0.7);
                } else {
                    this.codeAnnounce.setText("CHALLENGE: LOW HEALTH DISABLED");
                    this.codeAnnounce.setColor('#888888');
                    this.codeAnnounce.setScale(0.9);
                }
                break;
            case 'd7b9a5d383a37262fe24f1985d7eb39c9c664292cf2c313911978467f2cb583b':
                toggleCheat('dd')
                if (cheats.extraDmg) {
                    this.codeAnnounce.setText("CHEAT: X2 DAMAGE ENABLED");
                    playSound('mind_enhance', 0.7);
                } else {
                    this.codeAnnounce.setText("X2 DAMAGE DISABLED");
                    this.codeAnnounce.setColor('#888888');
                    this.codeAnnounce.setScale(0.9);
                }
                break;
            case 'd81bbd22822c4b94dd25738ab60f2fa452f0359d0c5f2634c07c7a7b6aa7b16b':
                toggleCheat('edd')
                if (cheats.extraExtraDmg) {
                    this.codeAnnounce.setText("CHEAT: X2 MORE DAMAGE ENABLED");
                    playSound('mind_enhance', 0.7);
                } else {
                    this.codeAnnounce.setText("X2 MORE DAMAGE DISABLED");
                    this.codeAnnounce.setColor('#888888');
                    this.codeAnnounce.setScale(0.9);
                }
                break;
            case '663409641b29b53f255ed4e01ce8ad89dd6179119a2abb8845552c38735342a6':
                toggleCheat('sshd')
                if (cheats.superShield) {
                    this.codeAnnounce.setText("CHEAT: SUPER SHIELD ENABLED");
                    playSound('matter_shield', 0.7);
                } else {
                    this.codeAnnounce.setText("SUPER SHIELD DISABLED");
                    this.codeAnnounce.setColor('#888888');
                    this.codeAnnounce.setScale(0.9);
                }
                break;
            case 'bf8ee00cae00a44aaabcc577dd4bdcb97f1ec6e53d776cb23ac1b3e683aea14a':
                toggleCheat('hpx')
                if (cheats.extraHealth) {
                    this.codeAnnounce.setText("CHEAT: +1000 HEALTH ENABLED");
                    playSound('magic', 0.75);
                } else {
                    this.codeAnnounce.setText("+1000 HEALTH DISABLED");
                    this.codeAnnounce.setColor('#888888');
                    this.codeAnnounce.setScale(0.9);
                }
                break;

            default:
                playSound('fizzle', 0.8)
                this.codeAnnounce.setText(getLangText('unknown_code'))
                this.codeAnnounce.setColor('#E01010');
                this.codeAnnounce.setScale(0.9);
                break;
        }

        this.codeAnnounce.currAnim = PhaserScene.tweens.add({
            delay: 3.6 + (0.2 * this.codeAnnounce.text.length),
            targets: this.codeAnnounce,
            alpha: 0,
            duration: 1,
            onComplete: () => {
                this.codeAnnounce.visible = false;
            }
        });
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

    hideOptions(shouldPop = true) {
        if (!this.opened || !this.canClose) {
            return false;
        }
        if (shouldPop) {
            removePopup();
        }
        this.opened = false;
        this.canClose = false;
        globalObjects.encyclopedia.showButton();
        globalObjects.options.showButton();

        messageBus.publish('unpauseGame');
        hideGlobalClickBlocker();
        this.hidingAnim1 = PhaserScene.tweens.add({
             targets: this.listOfThingsToHide,
             alpha: 0,
             duration: 180,
        });
        this.hidingAnim2 = PhaserScene.tweens.add({
            targets: this.listOfThingsToHideSemiAlpha,
            alpha: 0,
            duration: 180,
        });

        for (let i = 0; i < this.listOfButtonsToDisable.length; i++) {
            this.listOfButtonsToDisable[i].setState(DISABLE);
            this.listOfButtonsToDisable[i].setAlpha(0);
        }
        return true;
    }

    showButton() {
        this.canBeClicked = true;
        this.button.setPos(this.startX, this.startY);
    }

    hideButton() {
        this.canBeClicked = false;
        this.button.setPos(this.startX, -100);
    }
}
