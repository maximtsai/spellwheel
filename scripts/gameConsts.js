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
    if (cheats.fullArsenal) {
        EMBODIMENT_ARRAY = [RUNE_STRIKE, RUNE_STRIKE, RUNE_PROTECT, RUNE_ENHANCE, RUNE_STRIKE, RUNE_UNLOAD, RUNE_REINFORCE, RUNE_ENHANCE, RUNE_PROTECT, RUNE_STRIKE];
        ELEMENT_ARRAY = [RUNE_MATTER, RUNE_MIND, RUNE_TIME, RUNE_VOID, RUNE_MATTER, RUNE_MIND, RUNE_TIME];
        return;
    }
    highestLevel = level;
    gameVars.matterPlus = false;
    gameVars.mindPlus = false;
    switch(level) {
        case -5:
            // void dummy
            EMBODIMENT_ARRAY = [RUNE_STRIKE, RUNE_STRIKE, RUNE_PROTECT, RUNE_ENHANCE, null, null, null, RUNE_REINFORCE, RUNE_ENHANCE, RUNE_STRIKE];
            ELEMENT_ARRAY = [RUNE_VOID, RUNE_VOID, RUNE_MATTER, null, null, RUNE_VOID, RUNE_VOID];
            break;
        case -4:
            // time dummy
            EMBODIMENT_ARRAY = [RUNE_STRIKE, RUNE_STRIKE, RUNE_PROTECT, RUNE_ENHANCE, null, null, null, RUNE_REINFORCE, RUNE_ENHANCE, RUNE_STRIKE];
            ELEMENT_ARRAY = [RUNE_TIME, RUNE_TIME, RUNE_TIME, RUNE_TIME, RUNE_TIME, null, null];
            break;
        case -3:
            // body dummy
            EMBODIMENT_ARRAY = [RUNE_STRIKE, RUNE_STRIKE, RUNE_REINFORCE, RUNE_REINFORCE, RUNE_REINFORCE, RUNE_REINFORCE, RUNE_REINFORCE, RUNE_REINFORCE, RUNE_REINFORCE, RUNE_REINFORCE];
            ELEMENT_ARRAY = [RUNE_MATTER, RUNE_MIND, null, null, null, null, null];
            break;
        case -2:
            // shield dummy
            EMBODIMENT_ARRAY = [null, RUNE_PROTECT, null, RUNE_PROTECT, null, RUNE_PROTECT, null, RUNE_PROTECT, null, RUNE_PROTECT];
            ELEMENT_ARRAY = [RUNE_MIND, RUNE_MIND, null, null, null, RUNE_MATTER, RUNE_MATTER];
            break;
        case -1:
            // mind dummy
            EMBODIMENT_ARRAY = [RUNE_STRIKE, RUNE_STRIKE, RUNE_STRIKE, RUNE_STRIKE, RUNE_STRIKE, RUNE_STRIKE, RUNE_STRIKE, RUNE_STRIKE, RUNE_STRIKE, RUNE_STRIKE];
            ELEMENT_ARRAY = [RUNE_MIND, RUNE_MATTER, null, null, null, RUNE_MIND, RUNE_MATTER];
            break;
        case 0:
            // start, fight lesser dummy
            EMBODIMENT_ARRAY = [RUNE_STRIKE, RUNE_STRIKE, null, null, null, null, null, null, null, null];
            ELEMENT_ARRAY = [RUNE_MATTER, RUNE_MATTER, null, null, null, null, null];
            break;
        case 1:
            // start, fight dummy
            EMBODIMENT_ARRAY = [RUNE_STRIKE, RUNE_STRIKE, RUNE_ENHANCE, null, null, null, null, null, null, RUNE_ENHANCE];
            ELEMENT_ARRAY = [RUNE_MATTER, RUNE_MATTER, RUNE_MATTER, null, null, null, null];
            break;
        case 2:
            // fight goblin
            EMBODIMENT_ARRAY = [RUNE_STRIKE, RUNE_STRIKE, RUNE_ENHANCE, null, null, null, null, null, RUNE_ENHANCE, RUNE_STRIKE];
            ELEMENT_ARRAY = [RUNE_MATTER, RUNE_MIND, RUNE_MATTER, null, null, null, RUNE_MIND];
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
            EMBODIMENT_ARRAY = [RUNE_STRIKE, RUNE_STRIKE, RUNE_PROTECT, RUNE_ENHANCE, RUNE_STRIKE, RUNE_ENHANCE, RUNE_REINFORCE, RUNE_ENHANCE, RUNE_PROTECT, RUNE_STRIKE];
            ELEMENT_ARRAY = [RUNE_MATTER, RUNE_MIND, RUNE_TIME, RUNE_VOID, RUNE_MATTER, RUNE_MIND, RUNE_TIME];
            break;
        case -6:
        case 7:
            // fight super dummy
            EMBODIMENT_ARRAY = [RUNE_STRIKE, RUNE_STRIKE, RUNE_PROTECT, RUNE_ENHANCE, RUNE_STRIKE, RUNE_UNLOAD, RUNE_REINFORCE, RUNE_ENHANCE, RUNE_PROTECT, RUNE_STRIKE];
            ELEMENT_ARRAY = [RUNE_MATTER, RUNE_MIND, RUNE_TIME, RUNE_VOID, RUNE_MATTER, RUNE_MIND, RUNE_TIME];
            break;
        case 8:
            // fight mitochondria
            EMBODIMENT_ARRAY = [RUNE_STRIKE, RUNE_STRIKE, RUNE_PROTECT, RUNE_ENHANCE, RUNE_STRIKE, RUNE_UNLOAD, RUNE_REINFORCE, RUNE_ENHANCE, RUNE_PROTECT, RUNE_STRIKE];
            ELEMENT_ARRAY = [RUNE_MATTER, RUNE_MIND, RUNE_TIME, RUNE_VOID, RUNE_MATTER, RUNE_MIND, RUNE_TIME];
            gameVars.matterPlus = true;
            break;
        case 9:
            // fight robot
            EMBODIMENT_ARRAY = [RUNE_STRIKE, RUNE_STRIKE, RUNE_PROTECT, RUNE_ENHANCE, RUNE_STRIKE, RUNE_UNLOAD, RUNE_REINFORCE, RUNE_ENHANCE, RUNE_PROTECT, RUNE_STRIKE];
            ELEMENT_ARRAY = [RUNE_MATTER, RUNE_MIND, RUNE_TIME, RUNE_VOID, RUNE_MATTER, RUNE_MIND, RUNE_TIME];
            gameVars.matterPlus = true;
            gameVars.mindPlus = true;
            break;
        case 10:
        case 11:
        case 12:
            // fight death
            EMBODIMENT_ARRAY = [RUNE_STRIKE, RUNE_STRIKE, RUNE_PROTECT, RUNE_ENHANCE, RUNE_STRIKE, RUNE_UNLOAD, RUNE_REINFORCE, RUNE_ENHANCE, RUNE_PROTECT, RUNE_STRIKE];
            ELEMENT_ARRAY = [RUNE_MATTER, RUNE_MIND, RUNE_TIME, RUNE_VOID, RUNE_MATTER, RUNE_MIND, RUNE_TIME];
            gameVars.matterPlus = true;
            gameVars.mindPlus = true;
            break;
        default:
            EMBODIMENT_ARRAY = [RUNE_STRIKE, RUNE_STRIKE, RUNE_ENHANCE, null, null, null, null, null, RUNE_ENHANCE, RUNE_STRIKE];
            ELEMENT_ARRAY = [RUNE_MATTER, RUNE_MIND, RUNE_MATTER, null, null, null, RUNE_MIND];
            break;
    }
}
