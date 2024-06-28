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
        if (!this.darkenBG) {
            this.darkenBG = PhaserScene.add.image(gameConsts.halfWidth, gameConsts.halfHeight, 'blackPixel').setDepth(this.baseDepth);
            this.darkenBG.setScale(500, 500);
        }
        if (!this.bgPage) {
            this.bgPage = PhaserScene.add.image(gameConsts.halfWidth, gameConsts.halfHeight - 10, 'ui', 'battleOverScreen.png').setDepth(this.baseDepth).setAlpha(0);
            this.listOfThingsToHide.push(this.bgPage);
        }
        if (!this.title) {
            this.title = PhaserScene.add.text(gameConsts.halfWidth - 242, gameConsts.halfHeight - 282, getLangText('pre_fight_0a'), {fontFamily: 'verdanabold', fontSize: 24, color: '#000000', align: 'left'}).setDepth(this.baseDepth).setAlpha(0);
            this.listOfThingsToHide.push(this.title);
        }
        this.setFirstPage();

        createGlobalClickBlocker();
        if (!this.closeButton) {
            this.closeButton = new Button({
                normal: {
                    atlas: 'buttons',
                    ref: "closebtn.png",
                    alpha: 0.9,
                    x: gameConsts.halfWidth + 260,
                    y: gameConsts.halfHeight - 320,
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
        PhaserScene.tweens.add({
            targets: this.listOfThingsToHide,
            alpha: 1,
            ease: 'Cubic.easeOut',
            duration: 1,
        });
        PhaserScene.tweens.add({
            targets: this.currentPageItems,
            alpha: 1,
            ease: 'Cubic.easeOut',
            duration: 1,
        });

        // this.bgPage.setAlpha(0.2);
        // PhaserScene.tweens.add({
        //      targets: this.bgPage,
        //      alpha: 1,
        //      ease: 'Cubic.easeOut',
        //      duration: 1,
        // });
        messageBus.publish('pauseGame', 0.002);

    }

    clearCurrentPage() {
        let currentPageItemsTemp = [...this.currentPageItems];
        PhaserScene.tweens.add({
            targets: currentPageItemsTemp,
            alpha: 0,
            ease: 'Cubic.easeOut',
            duration: 400,
            onComplete: () => {
                for (let i in currentPageItemsTemp) {
                    currentPageItemsTemp[i].destroy();
                }
            }
        });
        this.currentPageItems = [];
    }

    setFirstPage() {
        let imageCover = PhaserScene.add.image(gameConsts.halfWidth, gameConsts.halfHeight - 40, 'ui', 'newgame_paper.png').setDepth(this.baseDepth).setAlpha(0).setScale(0.92);
        let text2 = PhaserScene.add.text(gameConsts.halfWidth - 238, gameConsts.halfHeight - 228, getLangText('pre_fight_0b'), {fontFamily: 'verdanabold', fontSize: 15, color: '#200000', align: 'left'});
        text2.setDepth(this.baseDepth).setOrigin(0, 0).setAlpha(0);
        let text3 = PhaserScene.add.text(gameConsts.halfWidth - 63, gameConsts.halfHeight - 133, getLangText('pre_fight_0c'), {fontFamily: 'verdanabold', fontSize: 22, color: '#200000', align: 'left'});
        text3.setDepth(this.baseDepth).setAlpha(0).setOrigin(0, 0.5);
        let text4 = PhaserScene.add.text(gameConsts.halfWidth - 63, gameConsts.halfHeight - 81, getLangText('pre_fight_0d'), {fontFamily: 'verdanabold', fontSize: 22, color: '#200000', align: 'left'});
        text4.setDepth(this.baseDepth).setAlpha(0).setOrigin(0, 0.5);
        let text5 = PhaserScene.add.text(text3.x, text3.y + 1, getLangText('pre_fight_0e'), {fontFamily: 'verdanabold', fontSize: 17, color: '#200000', align: 'left'});
        text5.setDepth(this.baseDepth).setAlpha(0).setOrigin(0, 0.5).setVisible(false);
        let text6 = PhaserScene.add.text(text4.x, text4.y + 2, getLangText('pre_fight_0f'), {fontFamily: 'verdanabold', fontSize: 17, color: '#200000', align: 'left'});
        text6.setDepth(this.baseDepth).setAlpha(0).setOrigin(0, 0.5).setVisible(false);
        let text7 = PhaserScene.add.text(gameConsts.halfWidth + 8, gameConsts.halfHeight - 33, getLangText('pre_fight_0g'), {fontFamily: 'verdanabold', fontSize: 22, color: '#200000', align: 'center'});
        text7.setDepth(this.baseDepth).setAlpha(0).setOrigin(0.5, 0.5);
        let text8 = PhaserScene.add.text(gameConsts.halfWidth, gameConsts.halfHeight + 175, getLangText('pre_fight_0h'), {fontFamily: 'verdanabold', fontSize: 15, color: '#200000', align: 'center'});
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
    }

    hideEncyclopedia() {
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
