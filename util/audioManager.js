let soundList = [];

function initializeSounds(scene) {
    for (let i in audioFiles) {
        let audioData = audioFiles[i];
        if (soundList[audioData.name]) {
            console.warn('audio name duplicate ', audioData.name);
        }
        soundList[audioData.name] = scene.sound.add(audioData.name);
    }
}

function playSound(name, volume = 1) {
    soundList[name].volume = volume;
    soundList[name].play();
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