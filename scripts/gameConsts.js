const RUNE_TIME = 'rune_time';
const RUNE_MIND = 'rune_mind';
const RUNE_MATTER = 'rune_matter';
const RUNE_VOID = 'rune_void';
const RUNE_ENHANCE = 'rune_enhance';
const RUNE_PROTECT = 'rune_protect';
const RUNE_REINFORCE = 'rune_reinforce';
const RUNE_STRIKE = 'rune_strike';
const RUNE_UNLOAD = 'rune_unload';

let highestLevel = 0;

let ELEMENT_ARRAY = [RUNE_MATTER, RUNE_MATTER, null, null, null, null, null];
let EMBODIMENT_ARRAY = [RUNE_STRIKE, RUNE_STRIKE, null, null, null, null, null, null, null, null];

function updateSpellState(level = 0) {
    if (level <= highestLevel) {
        return;
    }
    highestLevel = level;
    switch(level) {
        case 0:
            // start, fight lesser dummy
            EMBODIMENT_ARRAY = [RUNE_STRIKE, RUNE_STRIKE, null, null, null, null, null, null, null, null];
            ELEMENT_ARRAY = [RUNE_MATTER, RUNE_MATTER, null, null, null, null, null];
        case 1:
            // start, fight dummy
            EMBODIMENT_ARRAY = [RUNE_STRIKE, RUNE_STRIKE, RUNE_ENHANCE, null, null, null, null, null, null, RUNE_ENHANCE];
            ELEMENT_ARRAY = [RUNE_MATTER, RUNE_MATTER, RUNE_MATTER, null, null, null, null];
            break;
        case 2:
            // fight goblin
            EMBODIMENT_ARRAY = [RUNE_STRIKE, RUNE_STRIKE, RUNE_ENHANCE, null, null, null, null, null, RUNE_ENHANCE, RUNE_STRIKE];
            ELEMENT_ARRAY = [RUNE_MATTER, RUNE_MIND, RUNE_MATTER, null, null, RUNE_MATTER, RUNE_MIND];
            break;
        case 3:
            // fight tree
            EMBODIMENT_ARRAY = [RUNE_STRIKE, RUNE_STRIKE, RUNE_PROTECT, RUNE_ENHANCE, null, null, null, RUNE_ENHANCE, RUNE_PROTECT, RUNE_STRIKE];
            ELEMENT_ARRAY = [RUNE_MATTER, RUNE_MIND, RUNE_MATTER, null, null, RUNE_MATTER, RUNE_MIND];
            break;
        case 4:
            // fight wizard
            EMBODIMENT_ARRAY = [RUNE_STRIKE, RUNE_STRIKE, RUNE_PROTECT, RUNE_ENHANCE, RUNE_STRIKE, null, RUNE_REINFORCE, RUNE_ENHANCE, RUNE_PROTECT, RUNE_STRIKE];
            ELEMENT_ARRAY = [RUNE_MATTER, RUNE_MIND, RUNE_MATTER, null, null, RUNE_MATTER, RUNE_MIND];
            break;
        case 5:
            // fight knight
            EMBODIMENT_ARRAY = [RUNE_STRIKE, RUNE_STRIKE, RUNE_PROTECT, RUNE_ENHANCE, RUNE_STRIKE, null, RUNE_REINFORCE, RUNE_ENHANCE, RUNE_PROTECT, RUNE_STRIKE];
            ELEMENT_ARRAY = [RUNE_MATTER, RUNE_MIND, RUNE_TIME, null, RUNE_MATTER, RUNE_MIND, RUNE_TIME];
            break;
        case 6:
            // fight wall
            EMBODIMENT_ARRAY = [RUNE_STRIKE, RUNE_STRIKE, RUNE_PROTECT, RUNE_ENHANCE, RUNE_STRIKE, null, RUNE_REINFORCE, RUNE_ENHANCE, RUNE_PROTECT, RUNE_STRIKE];
            ELEMENT_ARRAY = [RUNE_MATTER, RUNE_MIND, RUNE_TIME, RUNE_VOID, RUNE_MATTER, RUNE_MIND, RUNE_TIME];
            break;
        case 7:
            // fight super dummy
            EMBODIMENT_ARRAY = [RUNE_STRIKE, RUNE_STRIKE, RUNE_PROTECT, RUNE_ENHANCE, RUNE_STRIKE, null, RUNE_REINFORCE, RUNE_ENHANCE, RUNE_PROTECT, RUNE_STRIKE];
            ELEMENT_ARRAY = [RUNE_MATTER, RUNE_MIND, RUNE_TIME, RUNE_VOID, RUNE_MATTER, RUNE_MIND, RUNE_TIME];
            break;
        case 8:
        case 9:
        case 10:
        case 11:
            EMBODIMENT_ARRAY = [RUNE_STRIKE, RUNE_STRIKE, RUNE_PROTECT, RUNE_ENHANCE, RUNE_STRIKE, RUNE_UNLOAD, RUNE_REINFORCE, RUNE_ENHANCE, RUNE_PROTECT, RUNE_STRIKE];
            ELEMENT_ARRAY = [RUNE_MATTER, RUNE_MIND, RUNE_TIME, RUNE_VOID, RUNE_MATTER, RUNE_MIND, RUNE_TIME];
            break;
        default:
            EMBODIMENT_ARRAY = [RUNE_STRIKE, RUNE_STRIKE, RUNE_ENHANCE, null, null, null, null, null, RUNE_ENHANCE, RUNE_STRIKE];
            ELEMENT_ARRAY = [RUNE_MATTER, RUNE_MIND, RUNE_MATTER, null, null, null, RUNE_MIND];
            break;
    }
}
