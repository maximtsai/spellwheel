// audiomanager
let soundList = [];
globalVolume = 0.9;
globalMusicVol = 0.9;
globalMusic = null;

function initializeSounds(scene) {
    // for (let i in audioFiles) {
    //     let audioData = audioFiles[i];
    //     if (soundList[audioData.name]) {
    //         console.warn('audio name duplicate ', audioData.name);
    //     }
    //     soundList[audioData.name] = scene.sound.add(audioData.name);
    // }
}

function playSound(name, volume = 1, loop = false, isMusic = false) {
    if (!soundList[name]) {
        soundList[name] = PhaserScene.sound.add(name);
    }
    soundList[name].fullVolume = volume;
    soundList[name].volume = volume * globalVolume;
    soundList[name].loop = loop;
    if (isMusic) {
        soundList[name].volume = volume * globalMusicVol;
        globalMusic = soundList[name];
    }
    soundList[name].play();
    return soundList[name];
}

function playMusic(name, volume = 1, loop = false) {
    return this.playSound(name, volume, loop, true);
}

function playFakeBGMusic(name) {
    soundList[name].volume = globalMusicVol;
    soundList[name].play();
}

function updateGlobalVolume(newVol = 1) {
    globalVolume = newVol;
    for (let i in soundList) {
        if (soundList[i].isPlaying) {
            if (soundList[i] !== globalMusic) {
                soundList[i].volume = soundList[i].fullVolume * globalVolume;
            }
        }
    }
}

function updateGlobalMusicVolume(newVol = 1) {
    globalMusicVol = newVol;
    if (globalMusic) {
        globalMusic.volume = newVol;
    }
}

function tweenVolume(name, volume, duration = 1500) {
    // return PhaserScene.tweens.timeline({
    //     targets: [soundList[name]],
    //     tweens: [
    //         {
    //             volume: volume,
    //             duration: duration
    //         }
    //     ]
    // });
}


function fadeAwaySound(sound, duration = 650, ease, onComplete) {
    PhaserScene.tweens.add({
        targets: sound,
        volume: 0,
        ease: ease,
        duration: duration,
        onComplete: () => {
            sound.stop();
            if (onComplete) {
                onComplete();
            }
        }
    });
}

function fadeInSound(sound, volume = 1) {
    PhaserScene.tweens.add({
        targets: sound,
        volume: volume,
        duration: 800
    });
}
