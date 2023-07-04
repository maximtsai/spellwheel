class TextPopupManager {
    constructor(scene) {
        this.scene = scene;
        this.damageNums = [];
        this.bonusNums = [];
        this.healNums = [];
        this.blockNums = [];
        messageBus.subscribe('animateDamageNum', this.animateDamageNum.bind(this));
        messageBus.subscribe('animateTrueDamageNum', this.animateTrueDamageNum.bind(this));
        messageBus.subscribe('animateHealNum', this.animateHealNum.bind(this));
        messageBus.subscribe('animateBlockNum', this.animateBlockNum.bind(this));

    }

    animateDamageNum(x, y, text, scale, param) {
        let textObj = this.getTextObjFromArray(x, y, text, this.damageNums, 'damage');
        textObj.setScale(scale);
        this.animateNum(textObj, this.damageNums, param);
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
