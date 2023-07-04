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
        console.log("return item");
        console.log(item);
        if (this.poolList[poolName] == undefined) {
            this.poolList[poolName] = [];
        }
        this.poolList[poolName].push(item);
        item.visible = false;
    }
}

poolManager = new InternalPoolManager();
