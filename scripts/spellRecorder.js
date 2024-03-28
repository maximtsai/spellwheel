class SpellRecorder {
    constructor(scene) {
        this.scene = scene;
        messageBus.subscribe('recordSpell', this.handleRecordNonAttack.bind(this));
        messageBus.subscribe('recordSpellAttack', this.handleRecordAttack.bind(this));
        this.castHistory = [];
        this.castCount = {};

        this.spellAnnounceBG = this.scene.add.sprite(gameConsts.halfWidth, gameConsts.halfHeight - 1, 'misc', 'announceBg.png');
        this.spellAnnounceBG.setOrigin(0.5);
        this.spellAnnounceBG.setDepth(99999);
        this.spellAnnounceBG.alpha = 0;
        this.spellAnnounceBG.setScale(2, 1.1);

        this.spellAnnounceText = this.scene.add.bitmapText(gameConsts.halfWidth, gameConsts.halfHeight - 5, 'bonus', 'dfbfdb', 36, 1);
        this.spellAnnounceText.setOrigin(0.5, 0.5);
        this.spellAnnounceText.setDepth(99999);
        this.spellAnnounceText.alpha = 0;

        this.attackAnnounceText = this.scene.add.bitmapText(gameConsts.halfWidth, gameConsts.halfHeight - 5, 'damage', 'dfbfdb', 36, 1);
        this.attackAnnounceText.setOrigin(0.5, 0.5);
        this.attackAnnounceText.setDepth(99999);
        this.attackAnnounceText.alpha = 0;
    }

    handleRecordAttack(spellID, spellName, bonusSize = 0) {
        // console.log("handle attack",spellID);
        this.handleRecordSpell(this.attackAnnounceText, spellID, spellName, bonusSize);
    }

    handleRecordNonAttack(spellID, spellName, bonusSize = 0) {
        this.handleRecordSpell(this.spellAnnounceText, spellID, spellName, bonusSize);
    }

    handleRecordSpell(textObj, spellID, spellName, bonusSize = 0) {
        // this.castHistory.push(spellName);
        textObj.setText(spellName);
        let extraScale = bonusSize;
        let extraDuration = bonusSize * 1000;
        textObj.setScale(0.8 + extraScale, 0.85 + extraScale);
        this.spellAnnounceBG.setScale(textObj.width / 350 + 0.1, 0.5 + extraScale * 0.25);
        let origSpellAnnounceBGScale = this.spellAnnounceBG.scaleX;
        textObj.setAlpha(0.5);
        this.spellAnnounceBG.setAlpha(0.7);
        if (this.currAnim) {
            this.currAnim.stop();
            if (this.currAnimObj != textObj) {
                this.scene.tweens.add({
                    targets: this.currAnimObj,
                    ease: 'Cubic.easeOut',
                    alpha: 0,
                    scaleY: 0.95,
                    duration: 400,
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
            duration: 350,
            easeParams: [3],
            ease: 'Back.easeOut'
        });

        this.currAnim = this.scene.tweens.add({
            delay: 1000 + spellName.length * 40 + extraDuration,
            targets: [textObj, this.spellAnnounceBG],
            ease: 'Cubic.easeIn',
            alpha: 0,
            scaleY: 0.95,
            duration: 400,
        });
        this.currAnimObj = textObj;
        if (this.castCount[spellID]) {
            this.castCount[spellID] += 1;
        } else {
            this.castCount[spellID] = 1;
        }
    }

}
