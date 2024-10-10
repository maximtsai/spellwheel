function sdkShowRewardAd(onStart, onFinish, onError) {

}

function sdkShowMidgameAd(onStart, onFinish, onError) {
    // Crazygames
    // const callbacks = {
    //     adFinished: () => {displayBanner()},
    //     adStarted: () => console.log("Start midgame ad (callback)"),
    // };
    //
    // window.CrazyGames.SDK.ad.requestAd("midgame", callbacks);
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

function sdkShowBannerAd() {

}

function sdkGameStart() {

}

function sdkGameEnd() {

}

function sdkGetAchievement(id) {

}
