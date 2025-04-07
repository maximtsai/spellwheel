// All this class does is display the status effects on both player and enemy.

class StatusManager {
    constructor(scene) {
        this.scene = scene;
        this.enemyStatusDisplay = [];
        this.playerStatusDisplayStack = [];
        this.listOfFreeStatuses = [];
        this.lastUpdateTime = 0;
        this.subscriptions = [
            messageBus.subscribe('selfTakeEffect', this.manualUpdateSelf.bind(this)),
            messageBus.subscribe('enemyTakeEffect', this.manualUpdateEnemy.bind(this)),
            messageBus.subscribe("selfClearStatuses", this.clearPlayerStatuses.bind(this)),
            messageBus.subscribe("enemyHasDied", this.clearPlayerStatuses.bind(this)),

            messageBus.subscribe("showStatusInfo", this.showStatusInfo.bind(this)),
            messageBus.subscribe("hideStatusInfo", this.hideStatusInfo.bind(this)),
            messageBus.subscribe("globalPointerDown", this.hideStatusInfo.bind(this)),
        ];


        updateManager.addFunction(this.update.bind(this));

        this.textBG = this.scene.add.sprite(57, gameConsts.height + 10, 'blackPixel').setScale(50, 50).setAlpha(0.6).setDepth(200).setOrigin(0, 1).setVisible(false);
        this.textDisplay = this.scene.add.text(62, gameConsts.height - 3, 'Test abc', {fontFamily: 'robotomedium', fontSize: 20, color: '#FFFFFF', align: 'center'}).setOrigin(0, 1).setDepth(201).setVisible(false);

    }

    showStatusInfo(info) {
        if (!info) {
            return;
        }
        this.textBG.setVisible(true);
        this.textDisplay.setVisible(true);
        this.textDisplay.setText(info);
        this.textBG.setScale(this.textDisplay.width * 0.5 + 6, this.textDisplay.height * 0.5 + 8);
    }

    hideStatusInfo() {
        this.textBG.setVisible(false);
        this.textDisplay.setVisible(false);
    }

    manualUpdateSelf(newObj) {
        if (newObj.ignoreBuff) {
            return;
        }
        let spriteSrc1 = newObj.spriteSrc1;
        let spriteSrc2 = newObj.spriteSrc2;
        let displayAmt = newObj.displayAmt;
        let spellID = newObj.spellID;
        let statusObj;
        if (newObj.statusObj) {
            statusObj = newObj.statusObj;
        } else {
            let indexFound = -1;
            for (let i = 0; i < this.playerStatusDisplayStack.length; i++) {
                if (this.playerStatusDisplayStack[i] === null) {
                    indexFound = i;
                    break;
                }
            }

            if (indexFound === -1) {
                indexFound = this.playerStatusDisplayStack.length;
                statusObj = this.createStatusObj(spellID, this.getPlayerStatusXPos(), this.getPlayerStatusYPos(indexFound), spriteSrc1, spriteSrc2, displayAmt, "");
                this.playerStatusDisplayStack.push(statusObj);
            } else {
                statusObj = this.createStatusObj(spellID, this.getPlayerStatusXPos(), this.getPlayerStatusYPos(indexFound), spriteSrc1, spriteSrc2, displayAmt, "");
                this.playerStatusDisplayStack[indexFound] = statusObj;
            }
        }
        statusObj.setAmtText(newObj.displayAmt);
        statusObj.setDurationText(newObj.duration);
        statusObj.statusOrig = newObj;
        statusObj.setHoverText(this.generateInfoText(spellID, displayAmt));
        newObj.statusObj = statusObj;
    }

    generateInfoText(spellID, displayAmt) {
        let returnText = "";
        switch(spellID) {
            case 'matterEnhance':
                returnText = "Your attacks gain\n+" + displayAmt + " damage";
                break;
            case 'matterReinforce':
                returnText = "You reflect "+displayAmt+"\ndamage back to\nyour opponent.";
                break;
            case 'mindReinforce':
                returnText = "All damage you\ndeal is increased\nby +"+displayAmt+".";
                break;
            case 'timeEnhance':
                returnText = "You attack an\nextra +" + displayAmt + "\ntimes.";
                break;
            case 'timeUnload':
                returnText = "Freeze time for\nthe next "+displayAmt+"\nspellcasts.";
                break;
        }
        return returnText;
    }

    manualUpdateEnemy() {

    }

    getPlayerStatusXPos() {
        return 30;
    }

    getPlayerStatusYPos(index) {
        return gameConsts.height - 40 - index * 45;
    }

    createStatusObj(spellID, x, y, spriteSrc1, spriteSrc2, displayAmt, infoText) {
        let retObj = this.listOfFreeStatuses.pop();
        if (!retObj) {
            retObj = new StatusObj(this.scene, spellID, x, y, spriteSrc1, spriteSrc2, displayAmt, infoText);
        } else {
            retObj.init(spellID, x, y, spriteSrc1, spriteSrc2, displayAmt, infoText);
        }
        return retObj;
    }

    recycleStatusObj(statusObj) {
        for (let i = 0; i < this.playerStatusDisplayStack.length; i++) {
            if (this.playerStatusDisplayStack[i] == statusObj) {
                this.playerStatusDisplayStack[i] = null;
                break;
            }
        }
        statusObj.clear();
        statusObj.statusOrig = null;
        this.listOfFreeStatuses.push(statusObj);
    }



    update(dt) {
        this.lastUpdateTime += dt * gameVars.timeSlowRatio;
        if (this.lastUpdateTime >= 60) {
            this.lastUpdateTime -= 60;
            this.tickPlayerStatuses();
        }
    }

    tickPlayerStatuses() {
        for (let i in this.playerStatusDisplayStack) {
            let statusDisplayObj = this.playerStatusDisplayStack[i]
            if (statusDisplayObj === null) {
                continue;
            }
            let status = statusDisplayObj.statusOrig;
            if (status == null || status.duration === undefined) {
                continue;
            }
            status.duration -= 1;
            if (status.displayAmt !== undefined && status.displayAmt.toString() != statusDisplayObj.amtText.text) {
                statusDisplayObj.setAmtText(status.displayAmt);
            }
            if (status.onUpdate) {
                status.onUpdate();
            }

            statusDisplayObj.setDurationText(status.duration);
            if (status.duration <= 0) {
                let statuses = globalObjects.player.getStatuses();
                if (status.cleanUp) {
                    status.cleanUp(statuses);
                }
                this.recycleStatusObj(statusDisplayObj);
            }
        }
        messageBus.publish("statusesTicked");
    }

    clearPlayerStatuses(spellId = null, skipCleanup = false) {
        for (let i in this.playerStatusDisplayStack) {
            let statusDisplayObj = this.playerStatusDisplayStack[i]
            if (statusDisplayObj == null) {
                continue;
            }
            let status = statusDisplayObj.statusOrig;
            if (status == null) {
                continue;
            }
            if (spellId === null || spellId == status.spellID) {
                let statuses = globalObjects.player.getStatuses();
                this.recycleStatusObj(statusDisplayObj);
                if (status.cleanUp && !skipCleanup) {
                    status.cleanUp(statuses);
                }
            }
        }
    }
}
