class InternalPoolManager {
    constructor() {
        this.poolList = {};
    }

    getItemFromPool(poolName) {
        let returnObj = undefined;
        if (this.poolList[poolName] == undefined) {
            this.poolList[poolName] = [];
        }
        if (this.poolList[poolName].length > 0) {
            returnObj = this.poolList[poolName].pop();
            returnObj.visible = true;
        }

        return returnObj;
    }

    returnItemToPool(item, poolName) {
        if (this.poolList[poolName] == undefined) {
            this.poolList[poolName] = [];
        }
        this.poolList[poolName].push(item);
        item.visible = false;
    }
}

poolManager = new InternalPoolManager();

function getTempPoolObject(atlas, name, poolName, duration = 250) {
    let effect = poolManager.getItemFromPool(poolName);
    if (!effect) {
        effect = PhaserScene.add.sprite(0, 0, atlas, name);
    } else {
        effect.setFrame(name).setAlpha(1).setVisible(true).setRotation(0)
    }
    let timeScale = gameVars.gameManualSlowSpeed || 1;
    PhaserScene.time.delayedCall(duration / timeScale, () => {
        poolManager.returnItemToPool(effect, poolName);
    });

    return effect;
}
