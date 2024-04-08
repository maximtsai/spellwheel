let soundList = [];
globalVolume = 1;

function initializeSounds(scene) {
    for (let i in audioFiles) {
        let audioData = audioFiles[i];
        if (soundList[audioData.name]) {
            console.warn('audio name duplicate ', audioData.name);
        }
        soundList[audioData.name] = scene.sound.add(audioData.name);
    }
}

function playSound(name, volume = 1, loop = false) {
    soundList[name].fullVolume = volume;
    soundList[name].volume = volume * globalVolume;
    soundList[name].loop = loop;
    soundList[name].play();
    return soundList[name];
}

function updateGlobalVolume(newVol = 1) {
    globalVolume = newVol;
    for (let i in soundList) {
        if (soundList[i].isPlaying) {
            soundList[i].volume = soundList[i].fullVolume * globalVolume;
        }
    }
}

function tweenVolume(name, volume, duration = 1500) {
    return PhaserScene.tweens.timeline({
        targets: [soundList[name]],
        tweens: [
            {
                volume: volume,
                duration: duration
            }
        ]
    });
}
