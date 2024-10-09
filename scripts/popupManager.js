

function showYesNoPopup(yesText, noText, titleText = '...', bodyText = "...", onYes = () => {}, superFast = false) {
    let darkBG = PhaserScene.add.image(gameConsts.halfWidth, gameConsts.halfHeight, 'blackPixel').setScale(500).setDepth(110900).setAlpha(0);
    let dieClickBlocker = new Button({
        normal: {
            ref: "blackPixel",
            x: gameConsts.halfWidth,
            y: gameConsts.halfHeight,
            alpha: 0.001,
            scaleX: 1000,
            scaleY: 1000
        },
        onMouseUp: () => {

        }
    });
    PhaserScene.tweens.add({
        targets: darkBG,
        alpha: 0.75,
        ease: 'Cubic.easeOut',
        duration: superFast ? 0.2 : 50
    });

    let popupBG = PhaserScene.add.image(gameConsts.halfWidth, gameConsts.halfHeight - 40, 'ui', 'paper_half.png').setDepth(111000).setScale(0.7, 0.58);
    let newText = PhaserScene.add.text(gameConsts.halfWidth, popupBG.y - 75, titleText, {fontFamily: 'opensans', fontSize: 28, color: '#000000', align: 'center'}).setOrigin(0.5, 0.5).setDepth(111000).setAlpha(0.1);
    let descText = PhaserScene.add.text(gameConsts.halfWidth, popupBG.y - 17, bodyText, {fontFamily: 'opensans', fontSize: 20, color: '#000000', align: 'center'}).setOrigin(0.5, 0.5).setDepth(111000).setAlpha(0.1);
    PhaserScene.tweens.add({
        targets: [newText, descText],
        alpha: 1,
        ease: 'Cubic.easeOut',
        duration: superFast ? 0.7 : 200
    });

    PhaserScene.tweens.add({
        targets: popupBG,
        scaleX: 0.72,
        scaleY: 0.6,
        ease: 'Back.easeOut',
        duration: superFast ? 0.7 : 200
    });

    let noBtn;
    let closeBtn;
    let yesBtn = new Button({
        normal: {
            ref: "menu_btn_normal.png",
            atlas: 'buttons',
            x: gameConsts.halfWidth + 118,
            y: popupBG.y + 55,
        },
        hover: {
            ref: "menu_btn_hover.png",
            atlas: 'buttons',
        },
        press: {
            ref: "menu_btn_hover.png",
            atlas: 'buttons',
        },
        disable: {
            alpha: 0
        },
        onHover: () => {
            if (canvas) {
                playSound('button_hover');
                canvas.style.cursor = 'pointer';
            }
        },
        onHoverOut: () => {
            if (canvas) {
                canvas.style.cursor = 'default';
            }
        },
        onMouseUp: () => {
            if (noBtn) {
                noBtn.destroy();
            }
            if (closeBtn) {
                closeBtn.destroy();
            }
            yesBtn.destroy();
            darkBG.destroy();
            dieClickBlocker.destroy();
            popupBG.destroy();
            newText.destroy();
            descText.destroy();
            onYes();
        }
    });
    yesBtn.setOrigin(0.5, 0.5);
    yesBtn.addText(yesText, {fontFamily: 'opensans', fontSize: 28, color: '#000000', align: 'center'})
    yesBtn.setDepth(111000);
    yesBtn.setScale(0.7);

    closeBtn = new Button({
        normal: {
            atlas: 'buttons',
            ref: "closebtn.png",
            alpha: 0.95,
            x: gameConsts.halfWidth + 190,
            y: popupBG.y - 95,
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
                playSound('button_hover');
                canvas.style.cursor = 'pointer';
            }
        },
        onHoverOut: () => {
            if (canvas) {
                canvas.style.cursor = 'default';
            }
        },
        onMouseUp: () => {
            closeBtn.destroy();
            noBtn.destroy();
            yesBtn.destroy();
            darkBG.destroy();
            dieClickBlocker.destroy();
            newText.destroy();
            descText.destroy();
            popupBG.destroy();
        }
    });
    closeBtn.setOrigin(0.5, 0.5);
    closeBtn.setDepth(111000);

    let itemsToDestroy = []; //[closeBtn, noBtn, yesBtn, darkBG, dieClickBlocker, newText, descText, popupBG];

    noBtn = new Button({
        normal: {
            ref: "menu_btn_normal.png",
            atlas: 'buttons',
            x: gameConsts.halfWidth - 118,
            y: popupBG.y + 55,
        },
        hover: {
            ref: "menu_btn_hover.png",
            atlas: 'buttons',
        },
        press: {
            ref: "menu_btn_hover.png",
            atlas: 'buttons',
        },
        disable: {
            alpha: 0
        },
        onHover: () => {
            if (canvas) {
                playSound('button_hover');
                canvas.style.cursor = 'pointer';
            }
        },
        onHoverOut: () => {
            if (canvas) {
                canvas.style.cursor = 'default';
            }
        },
        onMouseUp: () => {
            for (let i in itemsToDestroy) {
                itemsToDestroy[i].destroy();
            }
            itemsToDestroy = [];
        }
    });
    itemsToDestroy = [closeBtn, noBtn, yesBtn, darkBG, dieClickBlocker, newText, descText, popupBG];

    noBtn.setOrigin(0.5, 0.5);
    noBtn.addText(noText, {fontFamily: 'opensans', fontSize: 28, color: '#000000', align: 'center'})
    noBtn.setDepth(111000);
    noBtn.setScale(0.7);

    return itemsToDestroy;
}
