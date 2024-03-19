let language = 'en_us';

const textData = {
    matter_strike_desc: {en_us: 'DEAL 12 DAMAGE.', fr_FR: ''},
    matter_enhance_desc: {en_us: 'NEXT ATTACK\nDEALS +10\nEXTRA DAMAGE.', fr_FR: ''},
    matter_protect_desc: {en_us: 'CREATES A SHIELD\nTHAT BLOCKS 12\nDAMAGE.', fr_FR: ''},
    matter_reinforce_desc: {en_us: 'GAIN 2 THORNS.\nTHORNS BLOCK AND\nREFLECT DAMAGE.', fr_FR: ''},
    matter_unload_desc: {en_us: 'DEAL 18 DAMAGE.\nBLOCK 18 DAMAGE\nFOR THE NEXT\n5 SECONDS', fr_FR: ''},

    time_strike_desc: {en_us: 'DEAL 10 DAMAGE.\nCONVERT DAMAGE YOU\nDEAL OVER THE NEXT\n6 SECONDS INTO A\nSINGLE POWERFUL HIT.', fr_FR: ''},
    time_enhance_desc: {en_us: 'NEXT ATTACK\nPAUSES ENEMY FOR\n1.5 SECONDS.', fr_FR: ''},
    time_protect_desc: {en_us: 'CREATES A SHIELD\nTHAT DELAYS ALL\nDAMAGE.', fr_FR: ''},
    time_reinforce_desc: {en_us: 'SLOW DOWN TIME\nUNTIL YOUR NEXT\nATTACK.', fr_FR: ''},
    time_unload_desc: {en_us: 'HEAL 12% OF YOUR\nMISSING HEALTH.\nTHEN HEAL 12\nMORE HEALTH.', fr_FR: ''},

    void_strike_desc: {en_us: 'DEAL 4% OF ENEMY\'s\nTOTAL HEALTH OVER\n4 SECONDS.', fr_FR: ''},
    void_enhance_desc: {en_us: 'NEXT ATTACK\nDISRUPTS ENEMY\'S\nCURRENT ACTION.', fr_FR: ''},
    void_protect_desc: {en_us: 'CREATES A SHIELD\nTHAT FULLY NEGATES\nONE ATTACK.', fr_FR: ''},
    void_reinforce_desc: {en_us: 'BECOME INTANGIBLE\nFOR 7 SECONDS.\nLOSE 7 HEALTH.', fr_FR: ''},
    void_unload_desc: {en_us: 'DEAL DAMAGE EQUAL TO\n15% OF THE ENEMY\'s\nCURRENT HEALTH.', fr_FR: ''},

    mind_strike_desc: {en_us: 'DEAL 8 DAMAGE.\nENEMY TAKES 50%\nMORE DAMAGE FROM\nNEXT ATTACK.', fr_FR: ''},
    mind_enhance_desc: {en_us: 'NEXT ATTACK\nIS CAST AN\nEXTRA TIME.', fr_FR: ''},
    mind_protect_desc: {en_us: 'FIRES A CONTINUOUS\nBEAM OF DAMAGE THAT\nALSO BURNS THE ENEMY.', fr_FR: ''},
    mind_reinforce_desc: {en_us: 'CHARGE UP POWER\nTHAT IS RELEASED ON\nYOUR NEXT ATTACK.\nTHIS IS RESET\nIF YOU GET HIT.', fr_FR: ''},
    mind_unload_desc: {en_us: 'NEXT NON-ATTACK\nSPELL HAS X3\nEFFECTIVENESS.', fr_FR: ''},
};

function setLanguage(lang) {
    language = lang;
}

function getLangText(textName) {
    if (!textData[textName]) {
        console.error("Missing text name ", textName);
        return "MISSING TEXT";
    }
    return textData[textName][language];
}
