function sdkShowRewardAd(onStart, onFinish, onError) {

}

function sdkLoadingStart() {
}

function sdkLoadingStop() {
}

function sdkShowMidgameAd(onStart, onFinish, onError) {
    // Crazygames
    // const callbacks = {
    //     adFinished: () => {displayBanner()},
    //     adStarted: () => console.log("Start midgame ad (callback)"),
    // };
    //
    // window.CrazyGames.SDK.ad.requestAd("midgame", callbacks);
    onFinish();
}

function sdkShowHappyTime() {

}

let canCallBanner = false;
function displayBanner() {
    if (canCallBanner) {
        // // Prevent banner from being called multiple times in high frequency
        // canCallBanner = false;
        // setTimeout(() => {
        //     canCallBanner = true;
        // }, 65000);
        // const elem = document.getElementById("banner-container");
        // elem.style.top = "0px";
        // window.CrazyGames.SDK.banner.requestBanner({
        //     id: "banner-container",
        //     width: 468,
        //     height: 60,
        // });
    }
}

function sdkGetItem(key) {
    localStorage.getItem(key);
}

function sdkSetItem(key, val) {
    localStorage.setItem(key, val);
}

function sdkHasAdBlock() {

}

function sdkShowBannerAd() {

}

function sdkGameplayStart() {


}

function sdkGameplayStop() {

}

function sdkGameStart() {

}

function sdkGameEnd() {

}

function sdkGetAchievement(id) {

}
