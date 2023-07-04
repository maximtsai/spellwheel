/**
 * This file contains the code for the game's stats such as amount of money and upgrades purchased.
 * 
 **/
 
 class GameStats {
    constructor() {
        this.reset();
        messageBus.subscribe("addMoney", this.addMoney.bind(this));
        messageBus.subscribe("addStocks", this.addStocks.bind(this));
        messageBus.subscribe("addUpgrade", this.addUpgrade.bind(this));
        messageBus.subscribe("addDebt", this.addDebt.bind(this));
        messageBus.subscribe("debtCleared", this.clearDebt.bind(this));
        messageBus.subscribe("setInterest", this.setInterest.bind(this));
        messageBus.subscribe("setTitle", this.setTitle.bind(this));
        messageBus.subscribe("setMarketHistory", this.setMarketHistory.bind(this));
        setTimeout(() => {
            this.sendAllStatMessages();
        }, 0);
    }

    addMoney(amt) {
        if (amt === undefined) {
            amt = this.income;
        }
        if (amt < 0 && this.money + amt < 0) {
            console.warn("cannot go into debt!")
            return false;
        }
        this.money += amt;
        let displayText = this.money.toString();
        let dotIndex = displayText.indexOf('.');
        if (dotIndex === -1) {
            displayText += '.00';
            displayText = displayText.slice(0, displayText.length - 3);
        } else {
            displayText = displayText.slice(0, displayText.length + 3);
        }

        messageBus.publish('updateCashDisplay', displayText);
        messageBus.publish('showCashChange', amt);
        return this.money;
    }

    addStocks(amt) {
        if (amt < 0 && this.stocks + amt < 0) {
            console.warn("cannot short the market!")
            return false;
        }
        if (amt < 0) {
            this.totalStocksSold += amt;
            messageBus.publish('checkEnableStockSellUpgrades', this.totalStocksSold);
        }
        this.stocks += amt;
        messageBus.publish('updateStocksAmt', this.stocks);
        return this.stocks;
    }

    addUpgrade(upgrade) {
        if (this.upgrades[upgrade]) {
            console.warn("Already purchased upgrade")
        } else {
            this.upgrades[upgrade] = true;
        }
    }

    addDebt(amt) {
        this.debt += amt;
        if (this.debt < 1) {
            messageBus.publish('debtCleared', amt);
        }
    }

    clearDebt() {
        this.debt = 0;
        this.interest = 0;
    }

    setInterest(amt) {
        this.interest = amt;
    }

    setTitle(title) {
        this.title = title;
    }

    setMarketHistory(history) {
        this.marketHistory = history;
    }

    hasUpgrade(upgrade) {
        return this.upgrades[upgrade];
    }

    getMoney() {
        return this.money;
    }

    getStocks() {
        return this.stocks;
    }

    getTotalStocksSold() {
        return this.totalStocksSold;
    }

    getDebt() {
        return this.debt;
    }

    getTitle() {
        return this.title;
    }

    getMarketHistory() {
        return this.marketHistory;
    }

    getStockPrice() {
        return this.marketHistory[this.marketHistory.length - 1];
    }


    reset() {
        this.marketHistory = [];
        this.money = 0;
        this.income = 1;
        this.stocks = 0;
        this.debt = 0;
        this.interest = 0;
        this.upgrades = {};
        this.title = "Junior Money Printer Operator";
        this.sentimentShort = 25;
        this.sentimentLong = 25;

        this.totalStocksSold = 0;
    }

    setIncome(amt) {
        this.income = amt;
    }

    sendAllStatMessages() {
        this.addMoney(0)
        this.addStocks(0)
    }

}