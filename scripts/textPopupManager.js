class TextPopupManager {
    constructor(scene) {
        this.scene = scene;
        this.damageNums = []; // Depreciated, currently just using one damage num
        this.damageNum = this.scene.add.bitmapText(gameConsts.halfWidth, 200, 'damage', '', isMobile ? 34 : 32).setDepth(100000).setOrigin(0.5, 0.65);
        this.damageNum.startY = this.damageNum.y;
        this.damageTween = null;
        this.damageNumber = 0;
        this.bonusNums = [];
        this.healNums = [];
        this.blockNums = [];
        this.armorNums = [];
        this.voidNums = [];
        this.infoBox = this.scene.add.image(0, 0, 'blackPixel').setAlpha(0).setDepth(10000);
        this.infoText = this.scene.add.text(0, 0, 'WELCOME', {fontFamily: 'Arial', fontSize: isMobile ? 23 : 22, color: '#FFFFFF', align: 'center'}).setAlpha(0).setOrigin(0.5, 0.5).setDepth(10000);
        this.infoText.setFontStyle('bold');
        this.infoBorderTop = this.scene.add.image(0, 0, 'blurry', 'box_length.png').setAlpha(0).setDepth(10000);
        this.infoBorderBot = this.scene.add.image(0, 0, 'blurry', 'box_length.png').setAlpha(0).setDepth(10000);
        messageBus.subscribe('animateDamageNum', this.animateDamageNum.bind(this));
        messageBus.subscribe('animateDamageNumAccumulate', this.animateDamageNumAccumulate.bind(this));
        messageBus.subscribe('animateTrueDamageNum', this.animateTrueDamageNum.bind(this));
        messageBus.subscribe('animateHealNum', this.animateHealNum.bind(this));
        messageBus.subscribe('animateBlockNum', this.animateBlockNum.bind(this));
        messageBus.subscribe('animateArmorNum', this.animateArmorNum.bind(this));
        messageBus.subscribe('animateVoidNum', this.animateVoidNum.bind(this));


    }

    getBoxBottomPos() {
        return this.infoBox.y + this.infoBox.scaleY;
    }

    getCenterPos() {
        return this.infoBox.x - this.infoBox.scaleX * (this.infoBox.originX - 0.5) * 2;
    }

    setInfoText(x, y, newText, align = 'center', useSmall) {
        this.infoText.x = x; this.infoText.y = y;
        this.infoText.setAlpha(0);
        this.infoBox.setAlpha(0);
        this.infoBorderTop.setAlpha(0);
        this.infoBorderBot.setAlpha(0);
        this.infoText.setAlign('left');
        this.infoBox.x = x; this.infoBox.y = y + 2;
        if (align == "left") {
            this.infoText.x += 3;
            this.infoText.setOrigin(0, 0.5);
            this.infoBox.setOrigin(0, 0.5);
        } else if (align == "center") {
            // this.infoText.x -= 1;
            this.infoText.setAlign('center');
            this.infoText.setOrigin(0.5, 0.5);
            this.infoBox.setOrigin(0.5, 0.5);

        } else if (align == "right") {
            this.infoText.setOrigin(1, 0.5);
            this.infoText.x -= 6;
            this.infoBox.setOrigin(1, 0.5);
        }

        this.infoBorderTop.setAlpha(0);
        this.infoBorderBot.setAlpha(0);

        this.infoText.setText(newText);
        let multScale = useSmall ? 0.9 : 1;
        this.infoText.setScale(multScale);
        let boxWidth = this.infoText.width * 0.5 + 8;
        let boxHeight = this.infoText.height * 0.5 + 10;
        this.infoBox.setScale(boxWidth * multScale, boxHeight * multScale);
        let borderGoalScale = boxWidth * multScale * 0.02;
        this.infoBorderTop.setScale(borderGoalScale*0.1, 0.5).setPosition(this.getCenterPos(), this.infoBox.y - (boxHeight + 2) * multScale);
        this.infoBorderBot.setScale(borderGoalScale*0.1, -0.5).setPosition(this.getCenterPos(), this.infoBox.y + (boxHeight - 2) * multScale);

        this.currAnim = this.scene.tweens.add({
            targets: [this.infoText, this.infoBorderTop, this.infoBorderBot],
            alpha: 1,
            duration: 300,
        });
        this.currAnim3 = this.scene.tweens.add({
            targets: [this.infoBorderTop, this.infoBorderBot],
            scaleX: borderGoalScale,
            ease: 'Quart.easeInOut',
            duration: 1000,
            onComplete: () => {
                this.currAnim = this.scene.tweens.add({
                    targets: [this.infoBorderTop, this.infoBorderBot],
                    alpha: 0.7,
                    duration: 1000,
                });
            }
        });
        this.currAnim2 = this.scene.tweens.add({
            targets: [this.infoBox],
            alpha: 0.7,
            duration: 300,
        });
    }

    getWidth() {
        return this.infoBox.scaleX * 2;
    }

    hideInfoText() {
        if (this.currAnim) {
            this.currAnim.stop();
            this.currAnim2.stop();
            this.currAnim3.stop();
        }
        this.scene.tweens.add({
            targets: [this.infoText, this.infoBox, this.infoBorderTop, this.infoBorderBot],
            alpha: 0,
            duration: 300,
        });
    }

    animateDamageNum(x, y, text, scale, param) {
        let textObj = this.getTextObjFromArray(x, y, text, this.damageNums, 'damage');
        let mobileScale = isMobile ? 1.15 : 1;
        textObj.setScale(scale * mobileScale).setAlpha(1);
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
        let shakeMult = 0;
        this.damageNumber += val;
        if (this.damageNumber === 0) {
            shakeMult = 0.05;
        } else if (this.damageNumber < 15) {
            shakeMult = 0.5;
        } else if (this.damageNumber < 40) {
            shakeMult = 0.8;
        } else if (this.damageNumber < 100) {
            shakeMult = 1;
        } else if (this.damageNumber < 160) {
            shakeMult = 1.15;
        } else {
            shakeMult = 1.2;
        }
        this.damageNum.setText('-' + this.damageNumber);
        let newScale = 0.8 + Math.sqrt(this.damageNumber) * 0.15;
        if (isMobile) {
            newScale += 0.1;
        }
        this.damageNum.setScale(newScale * 0.98)
        this.damageNum.y = this.damageNum.startY + offsetY;
        this.damageNum.alpha = 1;

        let extraDur = Math.floor(shakeMult * shakeMult * 40);
        let tweenParams = {
            targets: this.damageNum,
            scaleX: newScale * (1 + shakeMult),
            scaleY: newScale * (1 + shakeMult),
            rotation: shakeMult * 0.075 * (Math.random() < 0.5 ? 1 : -1),
            duration: 150 + extraDur,
            ease: 'Cubic.easeOut',
            onComplete: () => {
                this.damageTween = this.scene.tweens.add({
                    targets: this.damageNum,
                    scaleX: newScale,
                    scaleY: newScale,
                    rotation: 0,
                    duration: 300 + extraDur,
                    ease: 'Bounce.easeOut',
                    onComplete: () => {
                        this.damageTween = this.scene.tweens.add({
                            delay: 850 + Math.floor(this.damageNumber * 4),
                            targets: this.damageNum,
                            scaleX: 0,
                            scaleY: 0,
                            alpha: 0,
                            duration: 250,
                            ease: 'Quart.easeIn',
                        });
                    }
                });

            }
        }
        this.damageTween = this.scene.tweens.add(tweenParams);
        // this.animateNum(this.damageNum, this.damageNums, param);
    }

    animateTrueDamageNum(x, y, text, scale, param, param2) {
        let textObj = this.getTextObjFromArray(x, y, text, this.bonusNums, 'bonus');
        let mobileScale = isMobile ? 1.15 : 1;
        textObj.setScale(scale * mobileScale).setAlpha(1);
        this.animateNum(textObj, this.bonusNums, param, param2);
    }

    animateHealNum(x, y, text, scale, param = {}, param2) {
        let textObj = this.getTextObjFromArray(x, y, text, this.healNums, 'heal');
        let mobileScale = isMobile ? 1.15 : 1;
        textObj.setScale(scale * mobileScale).setAlpha(1);
        param.duration = param.duration ? param.duration + 300 : 1000;
        this.animateNum(textObj, this.healNums, param, param2);

        if (!this.healVisual) {
            this.healVisual = this.scene.add.image(x, y + 30, 'misc', 'heal.png').setDepth(99999);
        }
        this.healVisual.setAlpha(1).setPosition(x, y+15).setScale(Math.sqrt(scale * 0.8));
        if (Math.random() < 0.5) {
            this.healVisual.scaleX *= -1;
        }
        this.scene.tweens.add({
            targets: this.healVisual,
            y: "-=30",
            duration: 1000,
        });
        this.scene.tweens.add({
            targets: this.healVisual,
            alpha: 0,
            duration: 1000,
            ease: 'Cubic.easeIn'
        });
    }

    animateBlockNum(x, y, text, scale, param, param2) {
        let textObj = this.getTextObjFromArray(x, y, text, this.blockNums, 'block');
        let mobileScale = isMobile ? 1.15 : 1;
        textObj.setScale(scale * mobileScale).setAlpha(1);
        this.animateNum(textObj, this.blockNums, param, param2);
    }

    animateArmorNum(x, y, text, scale, param, param2) {
        let textObj = this.getTextObjFromArray(x, y, text, this.armorNums, 'armor');
        let mobileScale = isMobile ? 1.15 : 1;
        textObj.setScale(scale * mobileScale).setAlpha(1);
        this.animateNum(textObj, this.armorNums, param, param2);
    }

    animateVoidNum(x, y, text, scale, param, param2) {
        let textObj = this.getTextObjFromArray(x, y, text, this.voidNums, 'void');
        let mobileScale = isMobile ? 1.15 : 1;
        textObj.setScale(scale * mobileScale).setAlpha(1);
        this.animateNum(textObj, this.voidNums, param, param2);
    }

    getTextObjFromArray(x, y, text, array, fontName = 'block') {
        let textObj = array.pop();
        if (!textObj) {
            textObj = this.scene.add.bitmapText(x, y, fontName, text, 32);
            textObj.setDepth(99999);
            textObj.setOrigin(0.5, 0.5);
            textObj.setCenterAlign();
        }
        textObj.setPosition(x, y);
        textObj.setText(text);
        textObj.visible = true;
        return textObj;
    }

    animateNum(textObj, originArray, param = {}, param2 = {}) {
        let tweenParams = {
            targets: textObj,
            y: "-=20",
            duration: 700,
            ease: 'Cubic.easeOut',
            onComplete: () => {
                let tweenParams2 = {
                    targets: textObj,
                    scaleX: textObj.scaleX * 0.4,
                    scaleY: textObj.scaleY * 0.4,
                    alpha: 0,
                    duration: 350,
                    ease: 'Quart.easeIn',
                    onComplete: () => {
                        textObj.visible = false;
                        originArray.push(textObj);
                    }
                }
                tweenParams2 = {...tweenParams2, ...param2};
                this.scene.tweens.add(tweenParams2);
            }
        }
        tweenParams = {...tweenParams, ...param};
        this.scene.tweens.add(tweenParams);
    }

}
