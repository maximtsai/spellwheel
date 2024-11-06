class SpellRecorder {
    constructor(scene) {
        this.scene = scene;
        messageBus.subscribe('recordSpell', this.handleRecordNonAttack.bind(this));
        messageBus.subscribe('recordSpellAttack', this.handleRecordAttack.bind(this));
        this.castHistory = [];
        this.castCount = {};

        this.spellAnnounceBG = this.scene.add.sprite(gameConsts.halfWidth, gameConsts.halfHeight - 17, 'misc', 'announceBg.png');
        this.spellAnnounceBG.setOrigin(0.5);
        this.spellAnnounceBG.setDepth(9991);
        this.spellAnnounceBG.alpha = 0;
        this.spellAnnounceBG.setScale(2, 1.1);

        this.spellAnnounceText = this.scene.add.bitmapText(gameConsts.halfWidth, gameConsts.halfHeight - 11, 'bonus', 'dfbfdb', 32, 1);
        this.spellAnnounceText.setOrigin(0.5, 0.5);
        this.spellAnnounceText.setDepth(9991);
        this.spellAnnounceText.alpha = 0;

        this.attackAnnounceText = this.scene.add.bitmapText(gameConsts.halfWidth, gameConsts.halfHeight - 16, 'damage', 'dfbfdb', 36, 1);
        this.attackAnnounceText.setOrigin(0.5, 0.5);
        this.attackAnnounceText.setDepth(9991);
        this.attackAnnounceText.alpha = 0;

        this.attackBonusText = this.scene.add.bitmapText(gameConsts.halfWidth, this.attackAnnounceText.y + 19, 'damage', 'dfbfdb', 33, 1);
        this.attackBonusText.setOrigin(0.5, 0);
        this.attackBonusText.setDepth(9991);
        this.attackBonusText.alpha = 0;

        this.attackMultText = this.scene.add.bitmapText(gameConsts.halfWidth, this.attackAnnounceText.y + 19, 'damage', 'dfbfdb', 31, 1);
        this.attackMultText.setOrigin(0.5, 0);
        this.attackMultText.setDepth(9991);
        this.attackMultText.alpha = 0;

    }

    handleRecordAttack(spellID, spellName, bonusSize = 0, additionalDamage, multiplier) {
        // console.log("handle attack",spellID);

        let bonusText1;
        let bonusText2;
        if (additionalDamage) {
            bonusText1 = "+" + additionalDamage;
        }
        if (multiplier && multiplier > 1.01) {
            bonusText2 = "X" + multiplier;
        }
        this.handleRecordSpell(this.attackAnnounceText, spellID, spellName, bonusSize, bonusText1, bonusText2);
    }

    handleRecordNonAttack(spellID, spellName, bonusSize = 0) {
        this.handleRecordSpell(this.spellAnnounceText, spellID, spellName, bonusSize);
    }

    handleRecordSpell(textObj, spellID, spellName, bonusSize = 0, bonusText1, bonusText2) {
        // this.castHistory.push(spellName);
        textObj.setText(spellName);
        let extraScale = bonusSize;
        let hasBonusText = bonusText1 || bonusText2;
        let extraDuration = bonusSize * 900 + (hasBonusText ? 220 : 0);
        textObj.setScale(0.78 + extraScale, 0.82 + extraScale);
        this.spellAnnounceBG.setScale(textObj.width / 350 + 0.1, 0.5 + extraScale * 0.25);
        let origSpellAnnounceBGScale = this.spellAnnounceBG.scaleX;
        textObj.setAlpha(0.5);
        if (hasBonusText) {
            textObj.setOrigin(0.5, 0.75)
        } else {
            textObj.setOrigin(0.5, 0.5)
        }
        this.spellAnnounceBG.setAlpha(0.7);
        if (this.currAnim) {
            this.currAnim.stop();
            if (this.currAnimObj !== textObj) {
                let objectsToFade = [this.currAnimObj];
                if (!bonusText1) {
                    objectsToFade.push(this.attackBonusText)
                }
                if (!bonusText2) {
                    objectsToFade.push(this.attackMultText)
                }
                this.scene.tweens.add({
                    targets: objectsToFade,
                    ease: 'Cubic.easeOut',
                    alpha: 0,
                    scaleY: 0.95,
                    duration: 290,
                });
            }
        }
        this.scene.tweens.add({
            targets: this.spellAnnounceBG,
            scaleX: origSpellAnnounceBGScale * 1.25,
            scaleY: 0.6 + extraScale * 0.25,
            alpha: 0.8,
            duration: 300,
            ease: 'Quad.easeOut'
        });
        this.scene.tweens.add({
            targets: textObj,
            scaleX: 0.9 + extraScale,
            scaleY: 0.9 + extraScale,
            alpha: 1,
            duration: 300,
            easeParams: [3],
            ease: 'Back.easeOut'
        });

        this.animateBonusText(bonusText1, bonusText2, extraScale)

        this.currAnim = this.scene.tweens.add({
            delay: 750 + spellName.length * 3 + extraDuration,
            targets: [textObj, this.spellAnnounceBG, this.attackBonusText, this.attackMultText],
            ease: 'Cubic.easeIn',
            alpha: 0,
            scaleY: 0.95,
            duration: 350,
        });
        this.currAnimObj = textObj;
        if (this.castCount[spellID]) {
            this.castCount[spellID] += 1;
        } else {
            this.castCount[spellID] = 1;
        }
    }

    animateBonusText(bonusText1, bonusText2, extraScale) {
        if (bonusText1 && bonusText2) {
            // separate them
            this.attackBonusText.setText(bonusText1);
            this.attackBonusText.x = gameConsts.halfWidth - this.attackBonusText.width * 0.5 - 2;
            this.attackBonusText.setOrigin(0.55, 0.5);
            this.attackBonusText.setAlpha(0).setRotation(-0.2).setScale(1.75 + extraScale * 1.25, 1.75 + extraScale * 1.25);

            this.attackMultText.setText(bonusText2);
            this.attackMultText.x = gameConsts.halfWidth + this.attackMultText.width * 0.5 + 2;
            this.attackMultText.setOrigin(0.45, 0.5);
            this.attackMultText.setAlpha(0).setRotation(0.25).setScale(1.75 + extraScale * 1.25, 1.75 + extraScale * 1.25);

            this.scene.tweens.add({
                targets: this.attackBonusText,
                delay: 300,
                scaleX: 1 + extraScale,
                scaleY: 1 + extraScale,
                alpha: 1,
                rotation: 0,
                duration: 300,
                easeParams: [2],
                ease: 'Back.easeIn',
                onStart: () => {
                    this.attackBonusText.setAlpha(1);
                }
            });
            this.scene.tweens.add({
                targets: this.attackMultText,
                delay: 600,
                scaleX: 1 + extraScale,
                scaleY: 1 + extraScale,
                alpha: 1,
                rotation: 0,
                duration: 300,
                easeParams: [2.5],
                ease: 'Back.easeIn',
                onStart: () => {
                    this.attackMultText.setAlpha(1);
                }
            });

        } else if (bonusText1) {
            this.attackBonusText.setText(bonusText1);
            this.attackBonusText.x = gameConsts.halfWidth;
            this.attackBonusText.setOrigin(0.5, 0.5);
            this.attackBonusText.setAlpha(0).setRotation(-0.2).setScale(1.5 + extraScale, 1.5 + extraScale);

            this.scene.tweens.add({
                targets: this.attackBonusText,
                delay: 400,
                scaleX: 1 + extraScale,
                scaleY: 1 + extraScale,
                alpha: 1,
                rotation: 0,
                duration: 400,
                easeParams: [3],
                ease: 'Back.easeOut',
                onStart: () => {
                    this.attackBonusText.setAlpha(1);
                }
            });
        } else if (bonusText2) {
            this.attackMultText.setText(bonusText2);
            this.attackMultText.x = gameConsts.halfWidth;
            this.attackMultText.setOrigin(0.5, 0.5);
            this.attackMultText.setAlpha(0).setRotation(-0.2).setScale(1.5 + extraScale, 1.5 + extraScale);

            this.scene.tweens.add({
                targets: this.attackMultText,
                delay: 400,
                scaleX: 1 + extraScale,
                scaleY: 1 + extraScale,
                alpha: 1,
                rotation: 0,
                duration: 400,
                easeParams: [3],
                ease: 'Back.easeOut',
                onStart: () => {
                    this.attackMultText.setAlpha(1);
                }
            });
        }
    }

}
