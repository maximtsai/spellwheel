const fs = require('fs');
const path = require('path');
const Terser = require('terser');

const SRC = __dirname;
const DIST = path.join(SRC, 'dist');

const JS_FILES = [
    // Data registries (must come first)
    'audioFiles.js',
    'imageFiles.js',
    'fontFiles.js',
    'textData1.js',
    'textData2.js',
    'textData3.js',
    'textData4.js',
    // Utilities
    'util/messageBus.js',
    'util/buttonManager.js',
    'util/updateManager.js',
    'util/button.js',
    'util/hoverText.js',
    'util/mouseManager.js',
    'util/audioManager.js',
    'util/helperFunction.js',
    'util/poolManager.js',
    'util/sha256.js',
    // Game scripts (in dependency order per scripts/combine_m.sh)
    'scripts/popupManager.js',
    'scripts/deathHandler.js',
    'scripts/levelHandler.js',
    'scripts/tutorialHandler.js',
    'scripts/bgHandler.js',
    'scripts/gameConsts.js',
    'scripts/gameAnims.js',
    'scripts/gameplaySetup.js',
    'scripts/gameStats.js',
    'scripts/spellManager.js',
    'scripts/statusObj.js',
    'scripts/statusManager.js',
    'scripts/textPopupManager.js',
    'scripts/combatTextManager.js',
    'scripts/spellRecorder.js',
    'scripts/magicCircle.js',
    'scripts/player.js',
    'scripts/menuButtons.js',
    'scripts/postFightScreen.js',
    'scripts/confirmPopup.js',
    'scripts/bannerTextManager.js',
    'scripts/miscFunctions.js',
    'scripts/encyclopedia.js',
    'scripts/options.js',
    'scripts/cutsceneManager.js',
    'scripts/unlocks.js',
    // Enemies (in dependency order per enemies/combine_m.sh)
    'scripts/enemies/enemyhandler.js',
    'scripts/enemies/enemy.js',
    'scripts/enemies/armordummy.js',
    'scripts/enemies/lesserdummy.js',
    'scripts/enemies/dummy.js',
    'scripts/enemies/dummypractice.js',
    'scripts/enemies/dummymind.js',
    'scripts/enemies/dummyshield.js',
    'scripts/enemies/dummybody.js',
    'scripts/enemies/dummytime.js',
    'scripts/enemies/dummyvoid.js',
    'scripts/enemies/superdummy.js',
    'scripts/enemies/water.js',
    'scripts/enemies/goblin.js',
    'scripts/enemies/statue.js',
    'scripts/enemies/killerrobot.js',
    'scripts/enemies/tree.js',
    'scripts/enemies/magician.js',
    'scripts/enemies/knight.js',
    'scripts/enemies/wall.js',
    'scripts/enemies/mantis.js',
    'scripts/enemies/death.js',
    'scripts/enemies/death2.js',
    'scripts/enemies/death2plus.js',
    'scripts/enemies/death3.js',
    // Entry point (must be last)
    'main.js',
];

const COPY_DIRS = ['sprites', 'audio', 'fonts'];
const EXTRA_FILES = ['phaser.min.js'];

function copyRecursive(src, dest) {
    fs.mkdirSync(dest, { recursive: true });
    for (const entry of fs.readdirSync(src)) {
        const srcPath = path.join(src, entry);
        const destPath = path.join(dest, entry);
        if (fs.statSync(srcPath).isDirectory()) {
            copyRecursive(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    }
}

async function build() {
    // Clean dist
    if (fs.existsSync(DIST)) {
        fs.rmSync(DIST, { recursive: true });
    }
    fs.mkdirSync(DIST);

    // Concatenate JS
    let combined = '';
    for (const relPath of JS_FILES) {
        const fullPath = path.join(SRC, relPath);
        if (!fs.existsSync(fullPath)) {
            console.error(`Missing: ${relPath}`);
            process.exit(1);
        }
        combined += fs.readFileSync(fullPath, 'utf8') + '\n';
    }
    console.log(`Concatenated: ${(combined.length / 1024).toFixed(0)} KB`);

    // Minify with Terser
    const result = await Terser.minify(combined, {
        ecma: 2017,
        compress: true,
        mangle: true,
    });
    if (result.error) {
        console.error('Terser error:', result.error);
        process.exit(1);
    }
    const minified = result.code;

    fs.writeFileSync(path.join(DIST, 'game.js'), minified);
    console.log(`Minified: ${(combined.length / 1024).toFixed(0)} KB → ${(minified.length / 1024).toFixed(0)} KB`);

    // Copy phaser.min.js
    for (const file of EXTRA_FILES) {
        fs.copyFileSync(path.join(SRC, file), path.join(DIST, file));
        console.log(`Copied ${file}`);
    }

    // Copy asset directories
    for (const dir of COPY_DIRS) {
        const srcDir = path.join(SRC, dir);
        if (fs.existsSync(srcDir)) {
            copyRecursive(srcDir, path.join(DIST, dir));
            console.log(`Copied ${dir}/`);
        }
    }

    // Generate index.html
    const html = `<!doctype html>
<html lang="en">
<link href=data:, rel=icon>
<head>
    <meta charset="UTF-8" />
    <title>SpellWheel</title>
    <link rel="icon" type="image/x-icon" href="sprites/favicon.png">
    <script src="phaser.min.js"></script>
    <script src="game.js"></script>
    <noscript>Enable JavaScript to play this game.</noscript>
    <style media='screen' type="text/css">
        #background {
            margin: 0;
            z-index: -2;
            background-image: url("sprites/preload/grass_bg.webp");
            background-color: #111010;
            background-position: center;
            background-size: cover;
            width: 100%;
            height: 100%;
            max-height: 100%;
            animation-duration: 3s;
            opacity: 0;
            animation-iteration-count: 1;
            animation-direction: normal;
            position: absolute;
        }
        #leftborder {
            margin: 0;
            z-index: -1;
            background-image: url("sprites/preload/handshield_back.webp");
            background-size: cover;
            height: 100%;
            width: 86px;
            opacity: 0;
            max-height: 100%;
            left: calc(50% - 453px);
            animation-duration: 0.6s;
            position: fixed;
        }
        #rightborder {
            margin: 0;
            z-index: -1;
            background-image: url("sprites/preload/handshield_back.webp");
            background-size: cover;
            height: 100%;
            width: 86px;
            opacity: 0;
            max-height: 100%;
            right: calc(50% - 453px);
            position: fixed;
            animation-duration: 0.6s;
            -moz-transform: scaleX(-1);
            -o-transform: scaleX(-1);
            -webkit-transform: scaleX(-1);
            transform: scaleX(-1);
            filter: FlipH;
            -ms-filter: "FlipH";
        }
        @keyframes changeShadow {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        @keyframes fadeAway {
            from { opacity: 1; }
            to { opacity: 0; }
        }
        @keyframes changeFull {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        @keyframes fastChange {
            from { opacity: 0.5; }
            to { opacity: 1; }
        }
        body {
            margin: 0;
            background-color: #111010;
            width: 100%;
            height: 100%;
            max-height: 100%;
            overflow-x: hidden;
        }
        #preload {
            margin: 0;
            height: 0px;
            width: 0px;
            opacity: 0;
            position: fixed;
        }
        html {
            margin: 0;
            width: 100%;
            height: 100%;
            max-height: 100%;
        }
        canvas {
            display: block;
            margin: 0;
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
        }
        #spellwheel {
            margin: 0 auto;
        }
        #preload-notice {
            color: white;
            text-align: center;
            vertical-align: middle;
            white-space: pre-line
        }
        @font-face {
            font-family: robotomedium;
            src: local('robotomedium'), url('fonts/robotomedium.ttf') format('truetype');
            font-weight: 400;
            font-weight: normal;
        }
        @font-face {
            font-family: garamondbold;
            src: local('garamondbold'), url('fonts/EBGaramond-ExtraBold.ttf') format('truetype');
            font-weight: normal;
        }
        @font-face {
            font-family: garamondmax;
            src: local('garamondmax'), url('fonts/Garamond.ttf') format('truetype');
            font-weight: 500;
            font-weight: bold;
        }
        @font-face {
            font-family: germania;
            src: local('germania'), url('fonts/GermaniaOne-Bold.ttf') format('truetype');
            font-weight: 800;
            font-weight: bold;
        }
        @font-face {
            font-family: germania_italics;
            src: local('germania_italics'), url('fonts/GermaniaOne-BoldItalic.ttf') format('truetype');
            font-weight: 800;
            font-weight: bold;
        }
    </style>
</head>
<body onload="onloadFunc()" onresize="resizeGame()">
    <script>
        document.fonts.load('10pt "robotomedium"')
        document.fonts.load('10pt "garamondbold"')
        document.fonts.load('10pt "garamondmax"')
        document.fonts.load('10pt "germania"')
        document.fonts.load('10pt "germania_italics"')
    </script>
    <div id="background"></div>
    <div id="preload"></div>
    <div id="leftborder"></div>
    <div id="rightborder"></div>
    <div style="font-family:robotomedium; position:absolute; left:-1000px; visibility:hidden;">.</div>
    <div style="font-family:garamondbold; position:absolute; left:-1000px; visibility:hidden;">.</div>
    <div style="font-family:garamondmax; position:absolute; left:-1000px; visibility:hidden;">.</div>
    <div style="font-family:germania; position:absolute; left:-1000px; visibility:hidden;">.</div>
    <div style="font-family:germania_italics; position:absolute; left:-1000px; visibility:hidden;">.</div>
    <div id="preload-notice">Loading Preloader ...</div>
</body>
</html>`;

    fs.writeFileSync(path.join(DIST, 'index.html'), html);
    console.log('Wrote dist/index.html');
    console.log('Build complete.');
}

build();
