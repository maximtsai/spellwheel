// audiomanager
let soundList = [];
globalVolume = 0.9;
globalMusicVol = 0.9;
globalMusic = null;
globalTempMusic = null;
let lastLongSound = null;
let lastLongSound2 = null;
let useSecondLongSound = false;
let isMuted = false;

function muteAll() {
    isMuted = true;
    if (globalMusic) {
        globalMusic.setVolume(0);
    }
    if (globalTempMusic) {
        globalTempMusic.setVolume(0);
    }
    if (lastLongSound) {
        lastLongSound.setVolume(0);
    }
    if (lastLongSound2) {
        lastLongSound2.setVolume(0);
    }
}

function unmuteAll() {
    isMuted = false;
    if (globalMusic) {
        globalMusic.volume = globalMusic.fullVolume * globalMusicVol;
    }
    if (globalTempMusic) {
        globalTempMusic.volume = globalTempMusic.fullVolume * globalMusicVol;
    }
    if (lastLongSound) {
        lastLongSound.volume = lastLongSound.fullVolume * globalMusicVol;
    }
    if (lastLongSound2) {
        lastLongSound2.volume = lastLongSound2.fullVolume * globalMusicVol;
    }
}

function initializeSounds(scene) {
    // for (let i in audioFiles) {
    //     let audioData = audioFiles[i];
    //     if (soundList[audioData.name]) {
    //         console.warn('audio name duplicate ', audioData.name);
    //     }
    //     soundList[audioData.name] = scene.sound.add(audioData.name);
    // }
    globalVolume = localStorage.getItem("globalVolume") || 0.9;
    globalMusicVol = localStorage.getItem("globalMusicVol") || 0.9;
}

function playSound(name, volume = 1, loop = false, isMusic = false) {
    if (!soundList[name]) {
        soundList[name] = PhaserScene.sound.add(name);
    }
    soundList[name].fullVolume = volume;
    soundList[name].volume = soundList[name].fullVolume * globalVolume;
    soundList[name].loop = loop;
    soundList[name].isMusic = isMusic;
    if (soundList[name].currTween) {
        soundList[name].currTween.stop();
        soundList[name].currTween = null;
    }
    if (isMusic) {
        soundList[name].volume = volume * globalMusicVol;
        globalMusic = soundList[name];
    }
    if (!isMusic && soundList[name].duration > 3.5) {
        if (useSecondLongSound) {
            lastLongSound2 = soundList[name];
        } else {
            lastLongSound = soundList[name];
        }
        useSecondLongSound = !useSecondLongSound;
    }
    if (isMuted) {
        soundList[name].volume = 0;
    }
    soundList[name].detune = 0;
    soundList[name].pan = 0;
    soundList[name].play();
    return soundList[name];
}

function playMusic(name, volume = 1, loop = false) {
    return this.playSound(name, volume, loop, true);
}

function playFakeBGMusic(name, volume = 1, loop = false) {
    if (!soundList[name]) {
        soundList[name] = PhaserScene.sound.add(name);
    }
    globalTempMusic = soundList[name];

    soundList[name].fullVolume = volume;
    soundList[name].volume = soundList[name].fullVolume * globalMusicVol;
    soundList[name].loop = loop;

    if (soundList[name].currTween) {
        soundList[name].currTween.stop();
        soundList[name].currTween = null;
    }
    if (isMuted) {
        soundList[name].volume = 0;
    }
    soundList[name].isMusic = true;
    soundList[name].play();
    return soundList[name];
}

function updateGlobalVolume(newVol = 1) {
    globalVolume = newVol;
    localStorage.setItem("globalVolume", newVol.toString());
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
    localStorage.setItem("globalMusicVol", newVol.toString());
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
    sound.fullVolume = 0;
    sound.currTween = PhaserScene.tweens.add({
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

function fadeInSound(sound, volume = 1, duration = 1000) {
    let globalToUse = sound.isMusic ? globalMusicVol : globalVolume;
    sound.fullVolume = volume;
    let goalVol = sound.fullVolume * globalToUse;
    return PhaserScene.tweens.add({
        delay: 100,
        targets: sound,
        volume: goalVol,
        duration: duration,
        ease: 'Quad.easeIn'
    });
}
