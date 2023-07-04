// All this class does is display the status effects on both player and enemy.

class StatusManager {
    constructor(scene) {
        this.scene = scene;
        this.enemyStatusDisplay = [];
        this.playerStatusDisplayList = [];
        this.listOfFreeStatuses = [];
        this.lastUpdateTime = 0;
        messageBus.subscribe('selfTakeEffect', this.manualUpdateSelf.bind(this));
        messageBus.subscribe('enemyTakeEffect', this.manualUpdateEnemy.bind(this));
        messageBus.subscribe("selfClearEffect", this.clearEffects.bind(this)),
        updateManager.addFunction(this.update.bind(this));

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
            statusObj = this.createStatusObj(spellID, this.getPlayerStatusXPos(), this.getPlayerStatusYPos(), spriteSrc1, spriteSrc2, displayAmt);
            this.playerStatusDisplayList.push(statusObj);
        }
        statusObj.setDurationText(newObj.duration);
        statusObj.statusOrig = newObj;
        newObj.statusObj = statusObj;
    }

    manualUpdateEnemy() {

    }

    getPlayerStatusXPos() {
        return 30;
    }

    getPlayerStatusYPos() {
        return gameConsts.height - 45 - this.playerStatusDisplayList.length * 45;
    }

    createStatusObj(spellID, x, y, spriteSrc1, spriteSrc2, displayAmt) {
        let retObj = this.listOfFreeStatuses.pop();
        if (!retObj) {
            retObj = new StatusObj(this.scene, spellID, x, y, spriteSrc1, spriteSrc2, displayAmt);
        } else {
            retObj.init(spellID, x, y, spriteSrc1, spriteSrc2, displayAmt);
        }
        return retObj;
    }

    recycleStatusObj(statusObj) {
        for (let i = 0; i < this.playerStatusDisplayList.length; i++) {
            if (this.playerStatusDisplayList[i] == statusObj) {
                this.playerStatusDisplayList.splice(i, 1);
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
        for (let i in this.playerStatusDisplayList) {
            let statusDisplayObj = this.playerStatusDisplayList[i]
            let status = statusDisplayObj.statusOrig;
            if (status == null || status.duration === undefined) {
                continue;
            }
            status.duration -= 1;
            if (status.displayAmt !== undefined && status.displayAmt.toString() != statusDisplayObj.amtText.text) {
                statusDisplayObj.setAmtText(status.displayAmt);
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

    clearEffects(spellId = null, skipCleanup = false) {
        for (let i in this.playerStatusDisplayList) {
            let statusDisplayObj = this.playerStatusDisplayList[i]
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
