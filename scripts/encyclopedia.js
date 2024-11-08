class Encyclopedia {
    constructor(scene, x, y) {
        this.startX = x;
        this.startY = y;
        this.baseDepth = 101000;
        this.listOfThingsToHide = [];
        this.currentPageItems = [];
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
                playSound('click',1.1).detune = 100;
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
        messageBus.subscribe('cancelScreen', this.hideEncyclopedia.bind(this));

        this.button.setScrollFactor(0, 0)
    }

    showEncyclopedia() {
        globalObjects.encyclopedia.hideButton();
        globalObjects.options.hideButton();
        if (this.hidingAnim1) {
            this.hidingAnim1.stop();
        }
        if (!this.darkenBG) {
            this.darkenBG = PhaserScene.add.image(gameConsts.halfWidth, gameConsts.halfHeight, 'blackPixel').setDepth(this.baseDepth - 1);
            this.darkenBG.setScale(500, 500);
        }
        if (!this.tab1) {
            this.tab1 = PhaserScene.add.image(gameConsts.halfWidth - 190, gameConsts.halfHeight - 310, 'ui', 'paperTab.png').setDepth(this.baseDepth - 1).setAlpha(0);
            this.tab1Icon = PhaserScene.add.image(this.tab1.x, this.tab1.y - 70, 'ui', 'tab_icon_control.png').setDepth(this.baseDepth - 1).setAlpha(0);
            this.listOfThingsToHide.push(this.tab1);
            this.listOfThingsToHide.push(this.tab1Icon);
        }
        if (!this.tab2) {
            this.tab2 = PhaserScene.add.image(gameConsts.halfWidth - 90, gameConsts.halfHeight - 310, 'ui', 'paperTab.png').setDepth(this.baseDepth - 1).setAlpha(0);
            this.tab2Icon = PhaserScene.add.image(this.tab2.x, this.tab2.y - 70, 'ui', 'tab_icon_runes.png').setDepth(this.baseDepth - 1).setAlpha(0);
            this.listOfThingsToHide.push(this.tab2);
            this.listOfThingsToHide.push(this.tab2Icon);
        }
        if (!this.tab3) {
            this.tab3 = PhaserScene.add.image(gameConsts.halfWidth + 10, gameConsts.halfHeight - 310, 'ui', 'paperTab.png').setDepth(this.baseDepth - 1).setAlpha(0);
            this.tab3Icon = PhaserScene.add.image(this.tab3.x, this.tab3.y - 70, 'ui', 'tab_icon_combos.png').setDepth(this.baseDepth - 1).setAlpha(0);
            this.listOfThingsToHide.push(this.tab3);
            this.listOfThingsToHide.push(this.tab3Icon);
        }
        if (!this.bgPage) {
            this.bgPage = PhaserScene.add.image(gameConsts.halfWidth, gameConsts.halfHeight + 22, 'ui', 'paper.png').setDepth(this.baseDepth).setAlpha(0).setScale(1, 1.08);
            this.listOfThingsToHide.push(this.bgPage);
        }
        if (!this.title) {
            this.title = PhaserScene.add.text(gameConsts.halfWidth - 255, gameConsts.halfHeight - 290, getLangText('pre_fight_0a'), {fontFamily: 'germania', fontSize: 24, color: '#000000', align: 'left'}).setDepth(this.baseDepth).setAlpha(0);
            this.listOfThingsToHide.push(this.title);
        }

        createGlobalClickBlocker();
        this.activateTabButtons();

        if (!this.closeButton) {
            this.closeButton = new Button({
                normal: {
                    atlas: 'buttons',
                    ref: "closebtn.png",
                    alpha: 0.95,
                    x: gameConsts.halfWidth + 230,
                    y: gameConsts.halfHeight - 275,
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
                    this.hideEncyclopedia()
                }
            });
            this.closeButton.setDepth(this.baseDepth + 10);
            this.listOfButtonsToDisable.push(this.closeButton);
        } else {
            buttonManager.bringButtonToTop(this.closeButton);
            this.closeButton.setState(NORMAL);
        }

        this.setFirstPage();

        this.darkenBG.setAlpha(0.55);
        PhaserScene.tweens.add({
            targets: this.listOfThingsToHide,
            alpha: 1,
            ease: 'Cubic.easeOut',
            duration: 0.25,
            onComplete: () => {
                this.canClose = true;
            }
        });

        this.raiseTab(1);

        // this.bgPage.setAlpha(0.2);
        // PhaserScene.tweens.add({
        //      targets: this.bgPage,
        //      alpha: 1,
        //      ease: 'Cubic.easeOut',
        //      duration: 0.5,
        // });
        messageBus.publish('pauseGame', 0.002);

    }

    activateTabButtons() {
        if (!this.tab1Button) {
            this.tab1Button = new Button({
                normal: {
                    ref: "blackPixel",
                    alpha: 0,
                    x: this.tab1Icon.x,
                    y: this.tab1Icon.y + 26,
                    scaleX: 42,
                    scaleY: 52
                },
                hover: {
                    ref: "blackPixel",
                    alpha: 0,
                    x: this.tab1Icon.x,
                    y: this.tab1Icon.y + 26,
                    scaleX: 43,
                    scaleY: 53
                },
                disable: {
                    alpha: 0
                },
                onHover: () => {
                    this.tab1.setFrame('paperTab_glow.png')
                    if (canvas) {
                        canvas.style.cursor = 'pointer';
                    }
                },
                onHoverOut: () => {
                    this.tab1.setFrame('paperTab.png')
                    if (canvas) {
                        canvas.style.cursor = 'default';
                    }
                },
                onMouseUp: () => {
                    this.clearCurrentPage();
                    this.setFirstPage();
                    this.raiseTab(1);
                }
            });
            this.tab1Button.setDepth(this.baseDepth);
            this.listOfButtonsToDisable.push(this.tab1Button);
        } else {
            buttonManager.bringButtonToTop(this.tab1Button);
            this.tab1Button.setState(NORMAL);
        }
        if (!this.tab2Button) {
            this.tab2Button = new Button({
                normal: {
                    ref: "blackPixel",
                    alpha: 0,
                    x: this.tab2Icon.x,
                    y: this.tab2Icon.y + 26,
                    scaleX: 42,
                    scaleY: 52
                },
                hover: {
                    ref: "blackPixel",
                    alpha: 0,
                    x: this.tab2Icon.x,
                    y: this.tab2Icon.y + 26,
                    scaleX: 43,
                    scaleY: 53
                },
                disable: {
                    alpha: 0
                },
                onHover: () => {
                    this.tab2.setFrame('paperTab_glow.png')
                    if (canvas) {
                        canvas.style.cursor = 'pointer';
                    }
                },
                onHoverOut: () => {
                    this.tab2.setFrame('paperTab.png')
                    if (canvas) {
                        canvas.style.cursor = 'default';
                    }
                },
                onMouseUp: () => {
                    this.clearCurrentPage();
                    this.setSecondPage();
                    this.raiseTab(2);
                }
            });
            this.tab2Button.setDepth(this.baseDepth);
            this.listOfButtonsToDisable.push(this.tab2Button);
        } else {
            buttonManager.bringButtonToTop(this.tab2Button);
            this.tab2Button.setState(NORMAL);
        }
        if (!this.tab3Button) {
            this.tab3Button = new Button({
                normal: {
                    ref: "blackPixel",
                    alpha: 0,
                    x: this.tab3Icon.x,
                    y: this.tab3Icon.y + 26,
                    scaleX: 42,
                    scaleY: 52
                },
                hover: {
                    ref: "blackPixel",
                    alpha: 0,
                    x: this.tab3Icon.x,
                    y: this.tab3Icon.y + 26,
                    scaleX: 43,
                    scaleY: 53
                },
                disable: {
                    alpha: 0
                },
                onHover: () => {
                    this.tab3.setFrame('paperTab_glow.png')
                    if (canvas) {
                        canvas.style.cursor = 'pointer';
                    }
                },
                onHoverOut: () => {
                    this.tab3.setFrame('paperTab.png')
                    if (canvas) {
                        canvas.style.cursor = 'default';
                    }
                },
                onMouseUp: () => {
                    this.clearCurrentPage();
                    this.setThirdPage();
                    this.raiseTab(3);
                }
            });
            this.tab3Button.setDepth(this.baseDepth);
            this.listOfButtonsToDisable.push(this.tab3Button);
        } else {
            buttonManager.bringButtonToTop(this.tab3Button);
            this.tab3Button.setState(NORMAL);
        }
    }

    raiseTab(idx) {
        let restOfTabs = [this.tab2, this.tab3];
        let restOfTabIcons = [this.tab2Icon, this.tab3Icon];
        let currTab = this.tab1;
        let currTabIcon = this.tab1Icon;
        if (idx == 2) {
            currTab = this.tab2;
            currTabIcon = this.tab2Icon;
            restOfTabs = [this.tab1, this.tab3];
            restOfTabIcons = [this.tab1Icon, this.tab3Icon];

        } else if (idx == 3) {
            currTab = this.tab3;
            currTabIcon = this.tab3Icon;
            restOfTabs = [this.tab1, this.tab2];
            restOfTabIcons = [this.tab1Icon, this.tab2Icon];
        }
        PhaserScene.tweens.add({
            targets: restOfTabs,
            y: gameConsts.halfHeight - 293,
            ease: 'Cubic.easeOut',
            duration: 0.5,
        });
        PhaserScene.tweens.add({
            targets: restOfTabIcons,
            y: gameConsts.halfHeight - 323,
            ease: 'Cubic.easeOut',
            duration: 0.5,
        });

        PhaserScene.tweens.add({
            targets: [currTab],
            y: gameConsts.halfHeight - 325,
            ease: 'Cubic.easeOut',
            duration: 0.5,
        });
        PhaserScene.tweens.add({
            targets: [currTabIcon],
            y: gameConsts.halfHeight - 350,
            ease: 'Cubic.easeOut',
            duration: 0.5,
        });
    }

    clearCurrentPage() {
        let currentPageItemsTemp = [...this.currentPageItems];
        PhaserScene.tweens.add({
            targets: currentPageItemsTemp,
            alpha: 0,
            ease: 'Cubic.easeOut',
            duration: 0.5,
            onComplete: () => {
                for (let i in currentPageItemsTemp) {
                    currentPageItemsTemp[i].destroy();
                }
            }
        });
        this.currentPageItems = [];
    }

    setFirstPage() {
        playSound('flip1');
        this.title.setText(getLangText('pre_fight_0a'));
        let imageCover = PhaserScene.add.image(gameConsts.halfWidth - 3, gameConsts.halfHeight + 14, 'ui', 'newgame_paper.png').setDepth(this.baseDepth).setAlpha(0).setScale(1);
        let imageCover2 = PhaserScene.add.image(gameConsts.halfWidth - 3, gameConsts.halfHeight + 10, 'ui', 'newgame_paper_bot.png').setDepth(this.baseDepth).setAlpha(0).setScale(1);
        let smallFontSize = (language == 'zh_cn' || language == 'zh_tw') ? 24 : 18;
        let text1 = PhaserScene.add.text(gameConsts.halfWidth, gameConsts.halfHeight + 47, getLangText('encyc_action'), {fontFamily: 'germania', fontSize: smallFontSize, color: '#200000', align: 'center'});
        text1.setDepth(this.baseDepth).setOrigin(0.5, 0).setAlpha(0).setStroke('#ffffff', 2);
        let text2 = PhaserScene.add.text(gameConsts.halfWidth, gameConsts.halfHeight + 115, getLangText('encyc_element'), {fontFamily: 'germania', fontSize: smallFontSize, color: '#200000', align: 'center'});
        text2.setDepth(this.baseDepth).setOrigin(0.5, 0).setAlpha(0).setStroke('#ffffff', 2);

        let text3 = PhaserScene.add.text(gameConsts.halfWidth + 138, gameConsts.halfHeight - 185, getLangText('pre_fight_0c'), {fontFamily: 'germania', fontSize: 24, color: '#200000', align: 'right'});
        text3.setDepth(this.baseDepth).setAlpha(0).setOrigin(1, 0.5);
        let text4 = PhaserScene.add.text(gameConsts.halfWidth + 138, gameConsts.halfHeight - 125, getLangText('pre_fight_0d'), {fontFamily: 'germania', fontSize: 24, color: '#200000', align: 'right'});
        text4.setDepth(this.baseDepth).setAlpha(0).setOrigin(1, 0.5);

        let text7 = PhaserScene.add.text(gameConsts.halfWidth + 212, gameConsts.halfHeight - 66, getLangText('pre_fight_0g'), {fontFamily: 'germania', fontSize: 24, color: '#200000', align: 'right'});
        text7.setDepth(this.baseDepth).setAlpha(0).setOrigin(1, 0.5);
        let text8 = PhaserScene.add.text(gameConsts.halfWidth - 1, gameConsts.halfHeight + 236, getLangText('pre_fight_0h'), {fontFamily: 'germania', fontSize: 20, color: '#200000', align: 'center'});
        text8.setDepth(this.baseDepth).setAlpha(0).setOrigin(0.5, 0.5);
        this.currentPageItems.push(imageCover);
        this.currentPageItems.push(imageCover2);
        this.currentPageItems.push(text1);
        this.currentPageItems.push(text2);
        this.currentPageItems.push(text3);
        this.currentPageItems.push(text4);
        this.currentPageItems.push(text7);
        this.currentPageItems.push(text8);
        PhaserScene.tweens.add({
            targets: this.currentPageItems, alpha: 1, ease: 'Cubic.easeOut', duration: 0.5,
        });
        this.closeButton.tweenToPos(this.closeButton.getXPos(), gameConsts.halfHeight - 275, 0.5, 'Cubic.easeOut')

        PhaserScene.tweens.add({
            targets: this.bgPage,
            scaleY: 1.08,
            y: gameConsts.halfHeight + 22,
            ease: 'Cubic.easeOut',
            duration: 0.5
        })

    }

    setSecondPage() {
        playSound('flip2');
        this.title.setText(" ")
        let text1 = PhaserScene.add.text(gameConsts.halfWidth - 252, gameConsts.halfHeight - 290, getLangText('encyclopedia_rune_element'), {fontFamily: 'germania', fontSize: 24, color: '#200000', align: 'left'}).setDepth(this.baseDepth);
        let text2 = PhaserScene.add.text(gameConsts.halfWidth - 252, gameConsts.halfHeight - 15, getLangText('encyclopedia_rune_action'), {fontFamily: 'germania', fontSize: 24, color: '#200000', align: 'left'}).setDepth(this.baseDepth);
        this.currentPageItems.push(text1);
        this.currentPageItems.push(text2);
        this.closeButton.tweenToPos(this.closeButton.getXPos(), gameConsts.halfHeight - 275, 0.5, 'Cubic.easeOut')

        PhaserScene.tweens.add({
            targets: this.bgPage,
            scaleY: 1.08,
            y: gameConsts.halfHeight + 22,
            ease: 'Cubic.easeOut',
            duration: 0.5
        })

        let listOfRunes = ["rune_matter_large.png",
            "rune_strike_large.png", "rune_enhance_large.png",
            "rune_energy_large.png",
            "rune_protect_large.png", "rune_reinforce_large.png",
            "rune_time_large.png", "rune_void_large.png",
            "rune_unload_large.png"];
        let listOfText = [getLangText("pre_fight_0d"),
            getLangText("pre_fight_0c"), getLangText("encyc_enhance"),
            getLangText("encyc_energy"),
            getLangText('encyc_shield'), getLangText('encyc_body'),
            getLangText("encyc_time"), getLangText("encyc_void"),
            getLangText('encyc_ultimate')];
        let listOfDesc = [getLangText("pre_fight_0f"),
            getLangText("pre_fight_0e"), getLangText("encyc_desc_enhance"),
            getLangText("encyc_desc_energy"),
            getLangText('encyc_desc_shield'), getLangText('encyc_desc_body'),
            getLangText("encyc_desc_time"), getLangText("encyc_desc_void"),
            getLangText('encyc_desc_ultimate')
        ];
        let startPos1 = gameConsts.halfHeight - 226;
        let offset = 56;
        let startPos2 = gameConsts.halfHeight + 49;
        let listOfPositions = [startPos1,
            startPos2, startPos2 + offset,
            startPos1 + offset,
            startPos2 + offset * 2, startPos2 + offset * 3,
            startPos1 + offset * 2, startPos1 + offset * 3,
            startPos2 + offset * 4,
        ]
        for (let i = 0; i < listOfRunes.length; i++) {
            if (i > Math.min(gameVars.maxLevel + 1, 6)) {
                break;
            }
            let newIcon = PhaserScene.add.image(gameConsts.halfWidth - 212, listOfPositions[i], 'tutorial', listOfRunes[i]).setAlpha(0).setDepth(this.baseDepth).setScale(0.6);
            let newText = PhaserScene.add.text(gameConsts.halfWidth - 170, listOfPositions[i], listOfText[i], {fontFamily: 'germania', fontSize: 24, color: '#200000', align: 'left'}).setDepth(this.baseDepth).setOrigin(0, 0.5);
            this.currentPageItems.push(newIcon);
            this.currentPageItems.push(newText);

        }

        PhaserScene.tweens.add({
            targets: this.currentPageItems, alpha: 1, ease: 'Cubic.easeOut', duration: 0.5,
        });
    }

    createDescLong(action, element) {
        if (action === 'unload' && element === 'time') {
            return 'time_unload_desc_long_full';
        }
        let plusText = '';//'_plus'
        if (gameVars.latestLevel > 8 && element === 'matter') {
            if (action === 'strike' || action === 'protect') {
                plusText = '_plus';
            }
        }
        if (gameVars.latestLevel > 9 && element === 'mind' && action === 'enhance') {
            plusText = '_plus';
        }

        return element + "_" + action + plusText + "_desc_long";
    }

    removeNewlinesIfLong(str) {
        let strToReturn = str;
        if (language === 'zh_cn' || language === 'zh_tw' || language === 'jp') {
            strToReturn = str.replace('\n', '');
            let textLim = 29;
            let numSpaces = 0;
            for (let i = 0; i < Math.min(33, strToReturn.length); i++) {
                if (strToReturn[i] == ' ') {
                    numSpaces++;
                }
            }

            let trueLength = Math.floor(textLim + numSpaces * 0.5);
            if (strToReturn.length > trueLength) {
                strToReturn = strToReturn.substring(0, trueLength) + '\n' + strToReturn.substring(trueLength);
            }
        } else {
            strToReturn = str.replace('\n', ' ');
            let textLim = 55;
            if (language == 'fr') {
                textLim = 59;
            }
            if (strToReturn.length > textLim) {
                //let lastSpacePos = 0;
                for (let i = textLim; i > 0; i--) {
                    if (strToReturn[i] == ' ') {
                        //lastSpacePos = i;
                        strToReturn = strToReturn.substring(0, i) + '\n' + strToReturn.substring(i + 1);
                        break;
                    }
                }
                //return str.replace('\n', ' ');
            }
        }

        return strToReturn;
    }

    setThirdPage() {
        playSound('flip2');
        this.title.setText(" ")
        let text1 = PhaserScene.add.text(gameConsts.halfWidth - 252, gameConsts.halfHeight - 303, getLangText('encyclopedia_rune_combos'), {fontFamily: 'germania', fontSize: 24, color: '#200000', align: 'left'}).setDepth(this.baseDepth);
        this.currentPageItems.push(text1);
        PhaserScene.tweens.add({
            targets: text1,
            y: "-=20",
            ease: 'Cubic.easeOut',
            duration: 0.5
        })
        this.closeButton.tweenToPos(this.closeButton.getXPos(), gameConsts.halfHeight - 298, 0.5, 'Cubic.easeOut')

        PhaserScene.tweens.add({
            targets: this.bgPage,
            scaleY: 1.18,
            y: gameConsts.halfHeight + 31,
            ease: 'Cubic.easeOut',
            duration: 0.5
        });


        // let listOfRunes = ["rune_matter_large.png",
        //     "rune_strike_large.png",
        //     "rune_enhance_large.png",
        //     "rune_energy_large.png",
        //     "rune_protect_large.png",
        //     "rune_reinforce_large.png",
        //     "rune_time_large.png",
        //     "rune_void_large.png",
        //     "rune_unload_large.png"];
        let allRunes = [
            "enhance",
            "energy",
            "protect",
            "reinforce",
            "time",
            "void",
            "unload"];
        let availableRunes = ["strike",
            "matter"];
        let targetLevel = Math.max(gameVars.latestLevel + 1, Math.min(gameVars.maxLevel, 5));
        for (let i = 0; i < Math.min(allRunes.length, targetLevel); i++) {
            availableRunes.push(allRunes[i]);
        }
        //rune_question_large.png
        let listOfText = [
            ['strike', 'matter'],
            ['strike', 'energy'],
            ['strike', 'time'],
            ['strike', 'void'],
            ['enhance', 'matter'],
            ['enhance', 'energy'],
            ['enhance', 'time'],
            ['enhance', 'void'],
            ['protect', 'matter'],
            ['protect', 'energy'],
            ['protect', 'time'],
            ['protect', 'void'],
            ['reinforce', 'matter'],
            ['reinforce', 'energy'],
            ['reinforce', 'time'],
            ['reinforce', 'void'],
            ['unload', 'matter'],
            ['unload', 'energy'],
            ['unload', 'time'],
            ['unload', 'void'],
        ];
        let startPos1 = gameConsts.halfHeight - 278;
        let offset = 33.4;

        for (let i = 0; i < listOfText.length; i++) {
            let action = listOfText[i][0];
            let element = listOfText[i][1];
            let actionAvailable = availableRunes.indexOf(action) !== -1;
            let elementAvailable = availableRunes.indexOf(element) !== -1;

            let actionRuneName = "rune_" + (actionAvailable ? action : 'question') + "_large.png"
            let actionRune = PhaserScene.add.image(gameConsts.halfWidth - 244, startPos1 + i * offset, 'tutorial', actionRuneName).setAlpha(0).setDepth(this.baseDepth).setScale(0.38, 0.36);
            this.currentPageItems.push(actionRune);

            let elementRuneName = "rune_" + (elementAvailable ? element : 'question') + "_large.png"
            let elementRune = PhaserScene.add.image(gameConsts.halfWidth - 199, startPos1 + i * offset, 'tutorial', elementRuneName).setAlpha(0).setDepth(this.baseDepth).setScale(0.38, 0.36);
            this.currentPageItems.push(elementRune);

            if (actionAvailable && elementAvailable) {
                if (element === 'energy') {
                    element = 'mind'
                }
                let descText = PhaserScene.add.text(gameConsts.halfWidth - 168, startPos1 + i * offset, this.removeNewlinesIfLong(getLangText(this.createDescLong(action, element))), {fontFamily: 'robotomedium', fontSize: 16, color: '#200000', align: 'left', lineSpacing: -3}).setAlpha(0).setDepth(this.baseDepth).setScale(0.95, 1);
                descText.setOrigin(0, 0.5);
                this.currentPageItems.push(descText);
            }

        }
        // for (let i = 0; i < listOfRunes.length; i++) {
        //     if (i > gameVars.latestLevel + 2) {
        //         break;
        //     }
        //     let newIcon = PhaserScene.add.image(gameConsts.halfWidth - 212, listOfPositions[i], 'tutorial', listOfRunes[i]).setAlpha(0).setDepth(this.baseDepth).setScale(0.55);
        //     let newText = PhaserScene.add.text(gameConsts.halfWidth - 170, listOfPositions[i], listOfText[i], {fontFamily: 'germania', fontSize: 24, color: '#200000', align: 'left'}).setDepth(this.baseDepth).setOrigin(0, 0.5);
        //     this.currentPageItems.push(newIcon);
        //     this.currentPageItems.push(newText);
        // }

        PhaserScene.tweens.add({
            targets: this.currentPageItems, alpha: 1, ease: 'Cubic.easeOut', duration: 0.5,
        });
    }

    hideEncyclopedia() {
        if (!this.canClose) {
            return false;
        }
        this.canClose = false;

        globalObjects.encyclopedia.showButton();
        globalObjects.options.showButton();
        messageBus.publish('unpauseGame');
        hideGlobalClickBlocker();
        this.darkenBG.setAlpha(0);
        this.hidingAnim1 = PhaserScene.tweens.add({
             targets: this.listOfThingsToHide,
             alpha: 0,
             ease: 'Cubic.easeOut',
             duration: 400,
        });
        this.clearCurrentPage();
        for (let i = 0; i < this.listOfButtonsToDisable.length; i++) {
            this.listOfButtonsToDisable[i].setState(DISABLE);
        }
        return true;
    }

    showButton() {
        this.button.setPos(this.startX, this.startY);
    }

    hideButton() {
        this.button.setPos(this.startX, -100);
    }
}
