class TextPopupManager {
    constructor(scene) {
        this.scene = scene;
        this.damageNums = []; // Depreciated, currently just using one damage num
        this.damageNum = this.scene.add.bitmapText(gameConsts.halfWidth, 200, 'damage', '', 32).setDepth(99999).setOrigin(0.5, 0.5);
        this.damageNum.startY = this.damageNum.y;
        this.damageTween = null;
        this.damageNumber = 0;
        this.bonusNums = [];
        this.healNums = [];
        this.blockNums = [];
        this.infoBox = this.scene.add.image(0, 0, 'blackPixel').setAlpha(0).setDepth(100001);
        this.infoText = this.scene.add.text(0, 0, 'WELCOME', {fontFamily: 'Arial', fontSize: 23, color: '#FFFFFF', align: 'center'}).setAlpha(0).setOrigin(0.5, 0.5).setDepth(100001);
        this.infoText.setFontStyle('bold');
        messageBus.subscribe('animateDamageNum', this.animateDamageNum.bind(this));
        messageBus.subscribe('animateDamageNumAccumulate', this.animateDamageNumAccumulate.bind(this));
        messageBus.subscribe('animateTrueDamageNum', this.animateTrueDamageNum.bind(this));
        messageBus.subscribe('animateHealNum', this.animateHealNum.bind(this));
        messageBus.subscribe('animateBlockNum', this.animateBlockNum.bind(this));

    }

    setInfoText(x, y, newText) {
        this.infoText.x = x; this.infoText.y = y;
        this.infoText.setAlpha(0);
        this.infoBox.setAlpha(0);
        this.infoBox.x = x; this.infoBox.y = y;
        this.infoText.setText(newText);
        let boxWidth = this.infoText.width * 0.5 + 8;
        let boxHeight = this.infoText.height * 0.5 + 6;
        this.infoBox.setScale(boxWidth, boxHeight);
        this.scene.tweens.add({
            targets: [this.infoText],
            alpha: 1,
            duration: 300,
        });
        this.scene.tweens.add({
            targets: [this.infoBox],
            alpha: 0.7,
            duration: 300,
        });
    }

    hideInfoText() {
        this.scene.tweens.add({
            targets: [this.infoText, this.infoBox],
            alpha: 0,
            duration: 300,
        });
    }

    animateDamageNum(x, y, text, scale, param) {
        let textObj = this.getTextObjFromArray(x, y, text, this.damageNums, 'damage');
        textObj.setScale(scale);
        this.animateNum(textObj, this.damageNums, param);
    }

    animateDamageNumAccumulate(val, offsetY = 0) {
        // let textObj = this.getTextObjFromArray(x, y, text, this.damageNums, 'damage');
        // textObj.setScale(scale);
        if (this.damageTween) {
            this.damageTween.stop();
        }
        if (this.damageNum.scaleX < 0.1) {
            this.damageNumber = 0;
        }
        this.damageNumber += val;
        this.damageNum.setText('-' + this.damageNumber);
        let newScale = 0.6 + Math.sqrt(val) * 0.2;
        this.damageNum.setScale(newScale)
        this.damageNum.y = this.damageNum.startY + offsetY;
        this.damageNum.alpha = 1;

        let tweenParams = {
            targets: this.damageNum,
            scaleX: newScale * 0.98,
            scaleY: newScale * 0.98,
            duration: 500,
            ease: 'Cubic.easeOut',
            onComplete: () => {
                this.damageTween = this.scene.tweens.add({
                    delay: 600,
                    targets: this.damageNum,
                    scaleX: 0,
                    scaleY: 0,
                    alpha: 0,
                    duration: 250,
                    ease: 'Quart.easeIn',
                });
            }
        }
        this.damageTween = this.scene.tweens.add(tweenParams);
        // this.animateNum(this.damageNum, this.damageNums, param);
    }

    animateTrueDamageNum(x, y, text, scale, param) {
        let textObj = this.getTextObjFromArray(x, y, text, this.bonusNums, 'bonus');
        textObj.setScale(scale);
        this.animateNum(textObj, this.bonusNums, param);
    }

    animateHealNum(x, y, text, scale, param) {
        let textObj = this.getTextObjFromArray(x, y, text, this.healNums, 'heal');
        textObj.setScale(scale);
        this.animateNum(textObj, this.healNums, param);
    }

    animateBlockNum(x, y, text, scale, param) {
        console.log(y, "animate blok num", text);
        let textObj = this.getTextObjFromArray(x, y, text, this.blockNums, 'block');
        textObj.setScale(scale);
        this.animateNum(textObj, this.blockNums, param);
    }

    getTextObjFromArray(x, y, text, array, fontName = 'block') {
        let textObj = array.pop();
        if (!textObj) {
            textObj = this.scene.add.bitmapText(x, y, fontName, text, 32);
            textObj.setDepth(99999);
            textObj.setOrigin(0.5, 0.5);
        }
        textObj.setPosition(x, y);
        textObj.setText(text);
        textObj.visible = true;
        return textObj;
    }

    animateNum(textObj, originArray, param = {}) {
        let tweenParams = {
            targets: textObj,
            y: textObj.y - 20,
            duration: 700,
            ease: 'Cubic.easeOut',
            onComplete: () => {
                this.scene.tweens.add({
                    targets: textObj,
                    scaleX: 0,
                    scaleY: 0,
                    duration: 400,
                    ease: 'Cubic.easeIn',
                    onComplete: () => {
                        textObj.visible = false;
                        originArray.push(textObj);
                    }
                });
            }
        }
        tweenParams = {...tweenParams, ...param};
        this.scene.tweens.add(tweenParams);
    }

}
