function sdkShowRewardAd(onStart, onFinish, onError) {

}

function sdkLoadingStart() {
    window.CrazyGames.SDK.game.loadingStart();
}

function sdkLoadingStop() {
    window.CrazyGames.SDK.game.loadingStop();
}

function sdkShowMidgameAd(onStart = () => {}, onFinish = () => {}, onError = () => {}) {
    muteAll();
    const callbacks = {
        adStarted: () => {
            onStart();
        },
        adFinished: () => {
            unmuteAll();
            onFinish();
        },
        adError: () => {
            unmuteAll();
            onError();
        },
    };
    window.CrazyGames.SDK.ad.requestAd("midgame", callbacks);
    // onFinish();
}

function sdkShowHappyTime() {
    window.CrazyGames.SDK.game.happytime();
}

let canCallBanner = true;
function displayBanner() {
    if (canCallBanner) {
        // // Prevent banner from being called multiple times in high frequency
        canCallBanner = false;
        setTimeout(() => {
            canCallBanner = true;
        }, 65000);
        const elem = document.getElementById("banner-container");
        elem.style.bottom = "0px";

        sdkShowBannerAd()
    }
}

async function sdkShowBannerAd() {
    try {
        // await is not mandatory when requesting banners, but it will allow you to catch errors
        await window.CrazyGames.SDK.banner.requestBanner({
            id: "banner-container",
            width: 468,
            height: 60,
        });
    } catch (e) {
        console.log("Banner request error", e);
    }
}

function sdkClearBanner() {
    const elem = document.getElementById("banner-container");
    elem.style.bottom = "-10000px";
    window.CrazyGames.SDK.banner.clearAllBanners();
}

function sdkGetItem(key) {
    return localStorage.getItem(key);
}

function sdkSetItem(key, val) {
    localStorage.setItem(key, val);
}

function sdkHasAdBlock() {

}

function sdkGameplayStart() {
    if (globalObjects && globalObjects.currentEnemy && !globalObjects.currentEnemy.isDestroyed) {
        window.CrazyGames.SDK.game.gameplayStart();
    }

}

function sdkGameplayStop() {
    window.CrazyGames.SDK.game.gameplayStop();

}

function sdkGameStart() {

}

function sdkGameEnd() {

}

function sdkGetAchievement(id) {

}
