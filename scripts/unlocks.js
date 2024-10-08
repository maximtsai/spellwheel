// All this class does is display the status effects on both player and enemy.
let unlocks = {};

class Unlocks {
    constructor() {
        this.subscriptions = [
            messageBus.subscribe('newUnlock', this.newUnlock.bind(this)),
        ];
    }

    newUnlock(id) {
        if (!unlocks[id]) {
            // New thing unlocked
            unlocks[id] = true;
            switch(id) {
                case 'gobbohit':
                    break;
                case 'shieldgain':
                    break;
                default:
                    console.warn("Unrecognized unlock: ", id);
            }
        }
    }

}
