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
        globalObjects.encyclopedia.hideButton();
        globalObjects.options.hideButton();
        if (!this.darkenBG) {
            this.darkenBG = PhaserScene.add.image(gameConsts.halfWidth, gameConsts.halfHeight, 'blackPixel').setDepth(this.baseDepth - 1);
            this.darkenBG.setScale(500, 500);
        }
        if (!this.tab1) {
            this.tab1 = PhaserScene.add.image(gameConsts.halfWidth - 180, gameConsts.halfHeight - 245, 'ui', 'paperTab.png').setDepth(this.baseDepth - 1).setAlpha(0);
            this.tab1Icon = PhaserScene.add.image(this.tab1.x, this.tab1.y - 30, 'ui', 'tab_icon_control.png').setDepth(this.baseDepth - 1).setAlpha(0);
            this.listOfThingsToHide.push(this.tab1);
            this.listOfThingsToHide.push(this.tab1Icon);
        }
        if (!this.tab2) {
            this.tab2 = PhaserScene.add.image(gameConsts.halfWidth - 90, gameConsts.halfHeight - 245, 'ui', 'paperTab.png').setDepth(this.baseDepth - 1).setAlpha(0);
            this.tab2Icon = PhaserScene.add.image(this.tab2.x, this.tab2.y - 30, 'ui', 'tab_icon_runes.png').setDepth(this.baseDepth - 1).setAlpha(0);
            this.listOfThingsToHide.push(this.tab2);
            this.listOfThingsToHide.push(this.tab2Icon);
        }
        if (!this.tab3) {
            this.tab3 = PhaserScene.add.image(gameConsts.halfWidth - 0, gameConsts.halfHeight - 245, 'ui', 'paperTab.png').setDepth(this.baseDepth - 1).setAlpha(0);
            this.tab3Icon = PhaserScene.add.image(this.tab3.x, this.tab3.y - 30, 'ui', 'tab_icon_combos.png').setDepth(this.baseDepth - 1).setAlpha(0);
            this.listOfThingsToHide.push(this.tab3);
            this.listOfThingsToHide.push(this.tab3Icon);
        }
        if (!this.bgPage) {
            this.bgPage = PhaserScene.add.image(gameConsts.halfWidth, gameConsts.halfHeight + 30, 'ui', 'battleOverScreen.png').setDepth(this.baseDepth).setAlpha(0);
            this.listOfThingsToHide.push(this.bgPage);
        }
        if (!this.title) {
            this.title = PhaserScene.add.text(gameConsts.halfWidth - 242, gameConsts.halfHeight - 242, getLangText('pre_fight_0a'), {fontFamily: 'verdanabold', fontSize: 24, color: '#000000', align: 'left'}).setDepth(this.baseDepth).setAlpha(0);
            this.listOfThingsToHide.push(this.title);
        }
        this.setFirstPage();

        createGlobalClickBlocker();
        this.activateTabButtons();

        if (!this.closeButton) {
            this.closeButton = new Button({
                normal: {
                    atlas: 'buttons',
                    ref: "closebtn.png",
                    alpha: 0.9,
                    x: gameConsts.width - 50,
                    y: 50,
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
        this.darkenBG.setAlpha(0.55);
        PhaserScene.tweens.add({
            targets: this.listOfThingsToHide,
            alpha: 1,
            ease: 'Cubic.easeOut',
            duration: 1,
        });

        this.raiseTab(1);

        // this.bgPage.setAlpha(0.2);
        // PhaserScene.tweens.add({
        //      targets: this.bgPage,
        //      alpha: 1,
        //      ease: 'Cubic.easeOut',
        //      duration: 1,
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
                    y: this.tab1Icon.y - 30,
                    scaleX: 42,
                    scaleY: 42
                },
                hover: {
                    ref: "blackPixel",
                    alpha: 0,
                    x: this.tab1Icon.x,
                    y: this.tab1Icon.y - 30,
                    scaleX: 43,
                    scaleY: 43
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
                    y: this.tab2Icon.y - 30,
                    scaleX: 42,
                    scaleY: 42
                },
                hover: {
                    ref: "blackPixel",
                    alpha: 0,
                    x: this.tab2Icon.x,
                    y: this.tab2Icon.y - 30,
                    scaleX: 43,
                    scaleY: 43
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
                    y: this.tab3Icon.y - 30,
                    scaleX: 42,
                    scaleY: 42
                },
                hover: {
                    ref: "blackPixel",
                    alpha: 0,
                    x: this.tab3Icon.x,
                    y: this.tab3Icon.y - 30,
                    scaleX: 43,
                    scaleY: 43
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
                    this.setFirstPage();
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
            y: gameConsts.halfHeight - 243,
            ease: 'Cubic.easeOut',
            duration: 1,
        });
        PhaserScene.tweens.add({
            targets: restOfTabIcons,
            y: gameConsts.halfHeight - 273,
            ease: 'Cubic.easeOut',
            duration: 1,
        });

        PhaserScene.tweens.add({
            targets: [currTab],
            y: gameConsts.halfHeight - 275,
            ease: 'Cubic.easeOut',
            duration: 1,
        });
        PhaserScene.tweens.add({
            targets: [currTabIcon],
            y: gameConsts.halfHeight - 300,
            ease: 'Cubic.easeOut',
            duration: 1,
        });
    }

    clearCurrentPage() {
        let currentPageItemsTemp = [...this.currentPageItems];
        PhaserScene.tweens.add({
            targets: currentPageItemsTemp,
            alpha: 0,
            ease: 'Cubic.easeOut',
            duration: 1,
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
        let imageCover = PhaserScene.add.image(gameConsts.halfWidth, gameConsts.halfHeight + 4, 'ui', 'newgame_paper.png').setDepth(this.baseDepth).setAlpha(0).setScale(0.92);
        let text2 = PhaserScene.add.text(gameConsts.halfWidth - 238, gameConsts.halfHeight + 58, getLangText('pre_fight_0b'), {fontFamily: 'verdanabold', fontSize: 15, color: '#200000', align: 'left'});
        text2.setDepth(this.baseDepth).setOrigin(0, 0).setAlpha(0);
        let text3 = PhaserScene.add.text(gameConsts.halfWidth - 63, gameConsts.halfHeight - 89, getLangText('pre_fight_0c'), {fontFamily: 'verdanabold', fontSize: 22, color: '#200000', align: 'left'});
        text3.setDepth(this.baseDepth).setAlpha(0).setOrigin(0, 0.5);
        let text4 = PhaserScene.add.text(gameConsts.halfWidth - 63, gameConsts.halfHeight - 37, getLangText('pre_fight_0d'), {fontFamily: 'verdanabold', fontSize: 22, color: '#200000', align: 'left'});
        text4.setDepth(this.baseDepth).setAlpha(0).setOrigin(0, 0.5);
        let text5 = PhaserScene.add.text(text3.x, text3.y + 5, getLangText('pre_fight_0e'), {fontFamily: 'verdanabold', fontSize: 17, color: '#200000', align: 'left'});
        text5.setDepth(this.baseDepth).setAlpha(0).setOrigin(0, 0.5).setVisible(false);
        let text6 = PhaserScene.add.text(text4.x, text4.y + 6, getLangText('pre_fight_0f'), {fontFamily: 'verdanabold', fontSize: 17, color: '#200000', align: 'left'});
        text6.setDepth(this.baseDepth).setAlpha(0).setOrigin(0, 0.5).setVisible(false);
        let text7 = PhaserScene.add.text(gameConsts.halfWidth + 200, gameConsts.halfHeight - 110, getLangText('pre_fight_0g'), {fontFamily: 'verdanabold', fontSize: 22, color: '#200000', align: 'center'});
        text7.setDepth(this.baseDepth).setAlpha(0).setOrigin(1, 0.5);
        let text8 = PhaserScene.add.text(gameConsts.halfWidth, gameConsts.halfHeight + 219, getLangText('pre_fight_0h'), {fontFamily: 'verdanabold', fontSize: 15, color: '#200000', align: 'center'});
        text8.setDepth(this.baseDepth).setAlpha(0).setOrigin(0.5, 0.5);
        this.currentPageItems.push(imageCover);
        // this.currentPageItems.push(text1);
        this.currentPageItems.push(text2);
        this.currentPageItems.push(text3);
        this.currentPageItems.push(text4);
        this.currentPageItems.push(text5);
        this.currentPageItems.push(text6);
        this.currentPageItems.push(text7);
        this.currentPageItems.push(text8);
        PhaserScene.tweens.add({
            targets: this.currentPageItems, alpha: 1, ease: 'Cubic.easeOut', duration: 1,
        });

    }

    setSecondPage() {
        playSound('flip2');
        this.title.setText(" ")
        let text1 = PhaserScene.add.text(gameConsts.halfWidth - 238, gameConsts.halfHeight - 238, getLangText('encyclopedia_rune_element'), {fontFamily: 'verdanabold', fontSize: 24, color: '#200000', align: 'left'}).setDepth(this.baseDepth);
        let text2 = PhaserScene.add.text(gameConsts.halfWidth - 238, gameConsts.halfHeight - 2, getLangText('encyclopedia_rune_action'), {fontFamily: 'verdanabold', fontSize: 24, color: '#200000', align: 'left'}).setDepth(this.baseDepth);
        this.currentPageItems.push(text1);
        this.currentPageItems.push(text2);

        let listOfRunes = ["rune_matter_large.png",
            "rune_strike_large.png", "rune_enhance_large.png",
            "rune_mind_large.png",
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
        let startPos1 = gameConsts.halfHeight - 183;
        let offset = 50;
        let startPos2 = gameConsts.halfHeight + 58;
        let listOfPositions = [startPos1,
            startPos2, startPos2 + offset,
            startPos1 + offset,
            startPos2 + offset * 2, startPos2 + offset * 3,
            startPos1 + offset * 2, startPos1 + offset * 3,
            startPos2 + offset * 4,
        ]
        console.log(gameVars.latestLevel);
        for (let i = 0; i < listOfRunes.length; i++) {
            if (i > gameVars.latestLevel + 2) {
                break;
            }
            let newIcon = PhaserScene.add.image(gameConsts.halfWidth - 212, listOfPositions[i], 'tutorial', listOfRunes[i]).setAlpha(0).setDepth(this.baseDepth).setScale(0.55);
            let newText = PhaserScene.add.text(gameConsts.halfWidth - 170, listOfPositions[i], listOfText[i], {fontFamily: 'verdanabold', fontSize: 24, color: '#200000', align: 'left'}).setDepth(this.baseDepth).setOrigin(0, 0.5);
            this.currentPageItems.push(newIcon);
            this.currentPageItems.push(newText);

        }

        PhaserScene.tweens.add({
            targets: this.currentPageItems, alpha: 1, ease: 'Cubic.easeOut', duration: 1,
        });
    }

    hideEncyclopedia() {
        globalObjects.encyclopedia.showButton();
        globalObjects.options.showButton();
        messageBus.publish('unpauseGame');
        hideGlobalClickBlocker();
        this.darkenBG.setAlpha(0);
        PhaserScene.tweens.add({
             targets: this.listOfThingsToHide,
             alpha: 0,
             ease: 'Cubic.easeOut',
             duration: 400,
        });
        this.clearCurrentPage();
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
