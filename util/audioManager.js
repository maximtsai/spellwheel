// audiomanager
let soundList = [];
globalVolume = 0.9;
globalMusicVol = 0.9;
globalMusic = null;
globalTempMusic = null;

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
    soundList[name].volume = soundList[name].fullVolume * globalVolume;
    soundList[name].loop = loop;
    soundList[name].isMusic = isMusic;
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
    if (!soundList[name]) {
        soundList[name] = PhaserScene.sound.add(name);
    }
    globalTempMusic = soundList[name];
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
        globalMusic.volume = globalMusic.fullVolume * newVol;
    }
    if (globalTempMusic) {
        globalTempMusic.volume = newVol;
    }
}

function setVolume(sound, volume = 0, duration) {
    let globalToUse = sound.isMusic ? globalMusicVol : globalVolume;
    sound.fullVolume = volume;
    if (!duration) {
        sound.volume = sound.fullVolume * globalToUse;
    } else {
        PhaserScene.tweens.add({
            targets: sound,
            volume: sound.fullVolume * globalToUse,
            duration: duration
        });
    }
}


function fadeAwaySound(sound, duration = 650, ease, onComplete) {
    sound.fullVolume = 0
    PhaserScene.tweens.add({
        targets: sound,
        volume: sound.fullVolume,
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
    let globalToUse = sound.isMusic ? globalMusicVol : globalVolume;
    sound.fullVolume = volume
    PhaserScene.tweens.add({
        targets: sound,
        volume: sound.fullVolume * globalToUse,
        duration: 900
    });
}
