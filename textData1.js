let language = 'en_us';

let textData = {
    "matter_strike_desc": {
        "en_us": "Deal 12 damage",
        "fr": "Inflige 12 points de dégâts",
        "zh_tw": "造成12點傷害",
        "zh_cn": "造成 12 点伤害",
        "ru": "Наносит 12 ед. урона",
        "es": "Inflige 12 de daño",
        "jp": "12ダメージを与える"
    },
    "matter_strike_plus_desc": {
        "en_us": "Deal 14 damage",
        "fr": "Inflige 14 points de dégâts",
        "zh_tw": "造成14點傷害",
        "zh_cn": "造成 14 点伤害",
        "ru": "Наносит 14 ед. урона",
        "es": "Inflige 14 de daño",
        "jp": "14ダメージを与える"
    },
    "matter_enhance_desc": {
        "en_us": "Next attack\ngains +6\ndamage",
        "fr": "La prochaine attaque gagne +6 de dégâts",
        "zh_tw": "下一次攻擊獲得 +6 傷害",
        "zh_cn": "下一次攻击获得 +6 伤害",
        "ru": "Следующая атака дает +6 к урону",
        "es": "El siguiente ataque obtiene +6 de daño",
        "jp": "次の通常攻撃は+6ダメージを獲得"
    },
    "matter_protect_desc": {
        "en_us": "Create a shield\nthat blocks 12\ndamage",
        "fr": "Crée un bouclier qui bloque 12 points de dégâts",
        "zh_tw": "創建一個可以阻擋 12 點傷害的盾牌",
        "zh_cn": "创建一个可以阻挡 12 点伤害的盾牌",
        "ru": "Создает щит, блокирующий 12 ед. урона.",
        "es": "Crea un escudo que bloquea 12 de daño",
        "jp": "12ダメージをブロックするシールドを作成する"
    },
    "matter_protect_plus_desc": {
        "en_us": "Create a shield\nthat blocks 14\ndamage",
        "fr": "Crée un bouclier qui bloque 14 points de dégâts",
        "zh_tw": "創建一個阻擋 14 點傷害的盾牌",
        "zh_cn": "创建一个阻挡 14 点伤害的盾牌",
        "ru": "Создает щит, блокирующий 14 ед. урона.",
        "es": "Crea un escudo que bloquea 14 de daño",
        "jp": "14ダメージをブロックするシールドを作成する"
    },
    "matter_reinforce_desc": {
        "en_us": "Gain thorns that\nprotect you and\nreflect 1 damage",
        "fr": "Gagne des épines qui vous protègent et renvoient 1 point de dommage.",
        "zh_tw": "獲得保護你的荊棘並反射 1 點傷害",
        "zh_cn": "获得保护你的荆棘并反射 1 点伤害",
        "ru": "Вы получаете шипы, которые защищают вас и отражают 1 урон",
        "es": "Obtienes espinas que te protegen y reflejan 1 de daño",
        "jp": "自分を守る棘を獲得し、1ダメージを反射する"
    },
    "matter_unload_desc": {
        "en_us": "Deal 24 damage.\nGain 24 temporary\nprotection",
        "fr": "Inflige 24 points de dégâts. Protection temporaire Gain 24",
        "zh_tw": "造成 24 點傷害。獲得 24 點臨時保護",
        "zh_cn": "造成 24 点伤害。获得 24 点临时保护",
        "ru": "Наносит 24 ед. урона. Дает 24 ед. временной защиты.",
        "es": "Inflige 24 de daño. Obtén 24 de protección temporal",
        "jp": "24ダメージを与える。24個の一時的な保護を得る"
    },
    "time_strike_desc": {
        "en_us": "Attack twice.\nFirst attack deals\n6 damage, second\nattack deals 50%\nof first.",
        "fr": "Attaquez deux fois. La première attaque inflige 6 points de dégâts, la deuxième attaque inflige 50% de la première.",
        "zh_tw": "攻擊兩次。第一次攻擊造成 6 點傷害，第二次攻擊造成第一次傷害的 50%。",
        "zh_cn": "攻击两次。第一次攻击造成 6 点伤害，第二次攻击造成第一次伤害的 50%。",
        "ru": "Атакуйте дважды. Первая атака наносит 6 урона, вторая — 50% от первой.",
        "es": "Ataca dos veces. El primer ataque inflige 6 de daño, el segundo ataque inflige el 50% del primero.",
        "jp": "2回攻撃する。最初の攻撃は6ダメージを与え、2回目の攻撃は最初の攻撃の50%を与えます。"
    },
    "time_enhance_desc": {
        "en_us": "Create an extra\ncopy of your\nnext attack",
        "fr": "Créez une copie supplémentaire de votre prochaine attaque",
        "zh_tw": "創建下一次攻擊的額外副本",
        "zh_cn": "创建下一次攻击的额外副本",
        "ru": "Создайте дополнительную копию следующей атаки",
        "es": "Crea una copia extra de tu próximo ataque",
        "jp": "次の攻撃の追加コピーを作成する"
    },
    "time_protect_desc": {
        "en_us": "Create a shield\nthat delays up\nto 60 damage",
        "fr": "Crée un bouclier qui retarde jusqu’à 60 points de dégâts",
        "zh_tw": "創建一個盾牌，延遲多達 60 點傷害",
        "zh_cn": "创建一个盾牌，延迟多达 60 点伤害",
        "ru": "Создает щит, который задерживает до 60 ед. урона",
        "es": "Crea un escudo que retrasa hasta 60 de daño",
        "jp": "最大60ダメージを遅らせるシールドを作成"
    },
    "time_reinforce_desc": {
        "en_us": "Heal 50% of your\nlast injury and\n50% of your\ndelayed damage",
        "fr": "Soigne 50 % de vos dernières blessures et 50 % de vos dégâts différés.",
        "zh_tw": "治療50%的末次傷害和50%的延遲傷害",
        "zh_cn": "治疗50%的末次伤害和50%的延迟伤害",
        "ru": "Восстанавливает 50% от последней травмы и 50% от отсроченного урона",
        "es": "Cura el 50% de tu última lesión y el 50% de tu daño retrasado",
        "jp": "直近の負傷の50%と遅延ダメージの50%を回復"
    },
    "time_unload_desc": {
        "en_us": "Freeze time for\nthe next 7 spells.\nGets weaker\nwith repeat use.",
        "fr": "Geler le temps pour\nles 7 prochains sorts.\nS'affaiblit avec\nune utilisation\nrépétée.",
        "zh_tw": "接下來 7 個法術的凍結時間。重複使用會變弱。",
        "zh_cn": "接下来 7 个法术的冻结时间。重复使用会变弱。",
        "ru": "Заморозьте время на следующие 7 заклинаний. Слабеет при повторном использовании.",
        "es": "Congela el tiempo durante los siguientes 7 hechizos. Se debilita con el uso repetido.",
        "jp": "次の7つの呪文の凍結時間。繰り返し使用すると弱くなります。"
    },
    "void_strike_desc": {
        "en_us": "Attack 3 times\nafter a delay,\neach attack\ndeals 2% enemy\ncurrent HP",
        "fr": "Attaque 3 fois après\nun délai, chaque\nattaque inflige 2%\ndes PV actuels\nde l’ennemi.",
        "zh_tw": "延遲後攻擊 3 次，\n每次攻擊造成 2%\n敵人當前生命值",
        "zh_cn": "延迟后攻击 3 次，\n每次攻击造成 2%\n敌人当前生命值",
        "ru": "Атакует 3 раза после\nзадержки, каждая\nатака наносит 2%\nот текущего\nздоровья противника",
        "es": "Ataca 3 veces después\nde un retraso, cada\nataque inflige un\n2% de los PS\nactuales del enemigo",
        "jp": "遅延後に3回攻撃し、\n各攻撃で敵の現在のHP\nの2%にダメージを与える"
    },
    "void_enhance_desc": {
        "en_us": "Your attacks\npermanently gain\n+1 damage",
        "fr": "Vos attaques\ngagnent en\npermanence +1\ndégâts",
        "zh_tw": "你的攻擊永久獲得\n+1 傷害",
        "zh_cn": "你的攻击永久获得\n+1 伤害",
        "ru": "Ваша атака\nпостоянно\nусиливает +1 урон",
        "es": "Tu ataque gana\npermanentemente\n+1 daño",
        "jp": "あなたの攻撃力は\n永続的に増加します\n+1ダメージ"
    },
    "void_protect_desc": {
        "en_us": "Create a shield\nthat completely\nnegates one\nattack",
        "fr": "Crée un bouclier\nqui annule\ncomplètement\nune attaque",
        "zh_tw": "創建一個完全抵消\n一次攻擊的盾牌",
        "zh_cn": "创建一个完全抵消\n一次攻击的盾牌",
        "ru": "Создайте щит,\nкоторый полностью\nнейтрализует\nодну атаку",
        "es": "Crea un escudo\nque anula por\ncompleto un ataque",
        "jp": "1回の攻撃を完全\nに無効にするシ\nールドを作る"
    },
    "void_reinforce_desc": {
        "en_us": "Heal to full,\nbut lose 10\nmax hp",
        "fr": "Soigne complètement, mais perd 10 de PV max",
        "zh_tw": "治療至滿，但最大生命值損失 10",
        "zh_cn": "治疗至满，但最大生命值损失 10",
        "ru": "Лечится до полного, но теряет 10 от макс. здоровья",
        "es": "Te curas por completo, pero pierdes un 10 de los puntos de vida máximos",
        "jp": "最大回復するが、最大HPを10減少"
    },
    "void_unload_desc": {
        "en_us": "Damage 9% of\nenemy current HP\nand disrupt their\naction",
        "fr": "Endommagez 9% des PV actuels de l’ennemi et perturbez son action.",
        "zh_tw": "傷害敵人當前生命值的 9% 並破壞他們的行動",
        "zh_cn": "伤害敌人当前生命值的 9% 并破坏他们的行动",
        "ru": "Наносит урон 9% от текущего здоровья противника и мешает его действиям",
        "es": "Inflige daño al 9% de los PS actuales del enemigo e interrumpe su acción",
        "jp": "敵の現在HPの9%にダメージを与え、敵の行動を妨害する"
    },
    "mind_strike_desc": {
        "en_us": "Deal 1 True\ndamage. Enemy\ntakes x2 damage\nfrom your next\nattack.",
        "fr": "Inflige 1 point de dégâts. L’ennemi subit x2 dégâts lors de votre prochaine attaque",
        "zh_tw": "造成 1 點傷害。敵人從你的下一次攻擊中受到 x2 傷害",
        "zh_cn": "造成 1 点伤害。敌人从你的下一次攻击中受到 x2 伤害",
        "ru": "Наносит 1 ед. урона. Враг получает в 2 раза больше урона от вашей следующей атаки",
        "es": "Inflige 1 de daño. El enemigo recibe x2 de daño de tu próximo ataque",
        "jp": "1ダメージを与える。敵は次の攻撃で2倍のダメージを受ける"
    },
    "mind_enhance_desc": {
        "en_us": "Next attack burns\nenemy for 10\nTrue damage\nover 5 seconds",
        "fr": "La prochaine attaque brûle l’ennemi et lui inflige 10 points de dégâts bruts en 5 secondes",
        "zh_tw": "下一次攻擊在5秒內燃燒敵人10點真實傷害",
        "zh_cn": "下一次攻击在5秒内燃烧敌人10点真实伤害",
        "ru": "Следующая атака сжигает противника, нанося 10 ед. чистого урона в течение 5 сек.",
        "es": "El siguiente ataque quema al enemigo e inflige 10 de daño verdadero durante 5 segundos",
        "jp": "次の通常攻撃で敵を5秒間10確定ダメージで燃やす"
    },
    "mind_enhance_plus_desc": {
        "en_us": "Next attack burns\nenemy for 15\nTrue damage\nover 5 seconds",
        "fr": "La prochaine attaque brûle l’ennemi et lui inflige 15 points de dégâts bruts en 5 secondes",
        "zh_tw": "下一次攻擊燃燒敵人 15 真實傷害超過 5 秒",
        "zh_cn": "下一次攻击燃烧敌人 15 真实伤害超过 5 秒",
        "ru": "Следующая атака сжигает противника, нанося 15 ед. чистого урона в течение 5 сек.",
        "es": "El siguiente ataque quema al enemigo e inflige 15 de daño verdadero durante 5 segundos",
        "jp": "次の攻撃で敵を5秒間15確定ダメージで燃やす"
    },
    "mind_protect_desc": {
        "en_us": "Create a shield\nthat absorbs 50%\ndamage then\nblasts it back",
        "fr": "Crée un bouclier qui absorbe 50 % des dégâts puis les renvoie",
        "zh_tw": "創建一個吸收 50% 傷害的盾牌，然後將其擊退",
        "zh_cn": "创建一个吸收 50% 伤害的盾牌，然后将其击退",
        "ru": "Создает щит, который поглощает 50 % урона, а затем отбрасывает его назад.",
        "es": "Crea un escudo que absorbe un 50% de daño y luego lo devuelve",
        "jp": "50%のダメージを吸収して吹き返すシールドを作成する"
    },
    "mind_reinforce_desc": {
        "en_us": "All damage you\ndeal is increased\nby +2",
        "fr": "Tous les dégâts\nque vous infligez\naugmentent de +2",
        "zh_tw": "你造成的所有傷害\n增加 +2",
        "zh_cn": "你造成的所有伤害\n增加 +2",
        "ru": "Весь наносимый\nвами урон\nувеличивается\nна +2.",
        "es": "Todo el daño\nque infliges\naumenta en +2",
        "jp": "与えるダメージ\nはすべて +2\n増加します"
    },
    "mind_unload_desc": {
        "en_us": "Next non-attack\nspell has +200%\neffectiveness",
        "fr": "Le sort suivant de non-attaque a +200% d’efficacité",
        "zh_tw": "下一個非攻擊法術有+200%的有效性",
        "zh_cn": "下一个非攻击法术有+200%的有效性",
        "ru": "Следующее неатакующее заклинание имеет +200% к эффективности",
        "es": "El siguiente hechizo que no sea de ataque tiene +200% de efectividad",
        "jp": "次の非攻撃呪文の有効性は+200%です"
    },
    "matter_tut_desc": {
        "en_us": "The Matter rune grants\ncontrol over the physical.\nMatter spells are good at dealing direct damage\nand providing reliable protection.",
        "fr": "La rune Matière accorde le contrôle sur le physique. Les sorts de matière sont bons pour infliger des dégâts directs et fournir une protection fiable.",
        "zh_tw": "物質符文授予對物理的控制權。物質法術擅長造成直接傷害並提供可靠的保護。",
        "zh_cn": "物质符文授予对物理的控制权。物质法术擅长造成直接伤害并提供可靠的保护。",
        "ru": "Руна Материи дает контроль над физическим. Заклинания материи хорошо наносят прямой урон и обеспечивают надежную защиту.",
        "es": "La runa de materia otorga control sobre lo físico. Los hechizos de materia son buenos para infligir daño directo y proporcionar una protección fiable.",
        "jp": "物質のルーンは、物理的なものに対するコントロールを与えます。物質呪文は、直接的なダメージを与え、確実な防御力を発揮するのが得意です。"
    },
    "matter_plus_tut_desc": {
        "en_us": "Your mastery over the\nMatter element strengthens\nsome of your existing Matter spells.",
        "fr": "Votre maîtrise de l’élément Matière renforce certains de vos sorts de Matière existants.",
        "zh_tw": "你對物質元素的掌握加強了你現有的一些物質法術。",
        "zh_cn": "你对物质元素的掌握加强了你现有的一些物质法术。",
        "ru": "Ваше мастерство над элементом Материи усиливает некоторые из ваших существующих заклинаний Материи.",
        "es": "Tu maestría sobre el elemento Materia fortalece algunos de tus hechizos de Materia existentes.",
        "jp": "物質元素をマスターすると、既存の物質呪文の一部が強化されます。"
    },
    "matter_tut_strike_desc": {
        "en_us": "Conjure a ball of rock\nthat deals solid damage.\nSimple but effective.",
        "fr": "Invoque une boule de roche qui inflige des dégâts solides. Simple mais efficace.",
        "zh_tw": "召喚出一個造成固體傷害的岩石球。簡單但有效。",
        "zh_cn": "召唤出一个造成固体伤害的岩石球。简单但有效。",
        "ru": "Наколдуйте каменный шар, который наносит солидный урон. Просто, но эффективно.",
        "es": "Conjura una bola de roca que inflige daño sólido. Simple pero efectivo.",
        "jp": "固体ダメージを与える岩の球を召喚する。シンプルだけど効果的。"
    },
    "matter_tut_enhance_desc": {
        "en_us": "Makes your next attack\ndeal extra damage.\nAlso makes the attack a\nlittle bit bigger.",
        "fr": "Fait en sorte que votre prochaine attaque inflige des dégâts supplémentaires. Rend également l’attaque un peu plus grande.",
        "zh_tw": "使你的下一次攻擊造成額外的傷害。也使攻擊更大一點。",
        "zh_cn": "使你的下一次攻击造成额外的伤害。也使攻击更大一点。",
        "ru": "Ваша следующая атака наносит дополнительный урон. Также делает атаку немного больше.",
        "es": "Hace que tu próximo ataque inflija daño extra. También hace que el ataque sea un poco más grande.",
        "jp": "次の通常攻撃が追加ダメージを与えるようになる。また、攻撃を少し大きくします。"
    },
    "matter_tut_protect_desc": {
        "en_us": "Creates a shield that blocks\na flat amount of damage.",
        "fr": "Crée un bouclier qui bloque une quantité fixe de dégâts.",
        "zh_tw": "創建一個盾牌，阻擋一定量的傷害。",
        "zh_cn": "创建一个盾牌，阻挡一定量的伤害。",
        "ru": "Создает щит, который блокирует фиксированное количество урона.",
        "es": "Crea un escudo que bloquea una cantidad fija de daño.",
        "jp": "一定量のダメージをブロックするシールドを作成します。"
    },
    "matter_tut_reinforce_desc": {
        "en_us": "Defensive buff that protects\nyou with spiky skin.\nGreat against large quantities\nof weaker attacks.",
        "fr": "Buff défensif qui vous protège avec une peau hérissée. Idéal contre de grandes quantités d’attaques plus faibles.",
        "zh_tw": "防禦增益，保護你的尖刺皮膚。非常適合對抗大量較弱的攻擊。",
        "zh_cn": "防御增益，保护你的尖刺皮肤。非常适合对抗大量较弱的攻击。",
        "ru": "Защитный бафф, защищающий вас с помощью колючей кожи. Отлично справляется с большим количеством слабых атак.",
        "es": "Buff defensivo que te protege con piel puntiaguda. Excelente contra grandes cantidades de ataques más débiles.",
        "jp": "とがった肌で身を守る防御バフ。大量の弱い攻撃に対して最適です。"
    },
    "matter_tut_unload_desc": {
        "en_us": "Conjures a great deal of matter\nto simultaneously crush your\nenemies while keeping yourself\nprotected.",
        "fr": "Invoque beaucoup de matière pour écraser simultanément vos ennemis tout en vous protégeant.",
        "zh_tw": "召喚出大量的物質，在粉碎敵人的同時保護自己。",
        "zh_cn": "召唤出大量的物质，在粉碎敌人的同时保护自己。",
        "ru": "Создает множество материи, чтобы одновременно сокрушить врагов и защитить себя.",
        "es": "Conjura una gran cantidad de materia para aplastar simultáneamente a tus enemigos mientras te mantienes protegido.",
        "jp": "敵を粉砕すると同時に、自分自身を守るために、多くの物質を召喚します。"
    },
    "mind_tut_desc": {
        "en_us": "The Energy rune grants\ncontrol over raw energy.\nEnergy spells have powerful supportive\neffects and can deal True damage that\nbypasses enemy defenses.",
        "fr": "La rune Énergie accorde le contrôle de l’énergie brute. Les sorts d’énergie ont de puissants effets de soutien et peuvent infliger des dégâts bruts qui contournent les défenses ennemies.",
        "zh_tw": "能量符文授予對原始能量的控制權。能量法術具有強大的支援效果，可以造成繞過敵人防禦的真實傷害。",
        "zh_cn": "能量符文授予对原始能量的控制权。能量法术具有强大的支持效果，可以造成绕过敌人防御的真实伤害。",
        "ru": "Руна Энергия дает контроль над сырой энергией. Энергетические заклинания обладают мощными вспомогательными эффектами и могут наносить чистый урон, обойдя вражескую оборону.",
        "es": "La runa de energía otorga control sobre la energía bruta. Los hechizos de energía tienen poderosos efectos de apoyo y pueden infligir daño verdadero que supera las defensas enemigas.",
        "jp": "エネルギーのルーンは、生のエネルギーをコントロールすることを可能にします。エネルギー呪文は強力なサポート効果を持ち、敵の防御を迂回するトゥルーダメージを与えることができます。"
    },
    "mind_plus_tut_desc": {
        "en_us": "Your mastery over the element strengthens\nsome of your existing Energy spells.",
        "fr": "Votre maîtrise de l’élément renforce certains de vos sorts d’énergie existants.",
        "zh_tw": "你對元素的掌握加強了你現有的一些能量法術。",
        "zh_cn": "你对元素的掌握加强了你现有的一些能量法术。",
        "ru": "Ваше мастерство над стихией усиливает некоторые из ваших существующих энергетических заклинаний.",
        "es": "Tu dominio sobre el elemento fortalece algunos de tus hechizos de Energía existentes.",
        "jp": "元素をマスターすると、既存のエネルギー呪文の一部が強化されます。"
    },
    "mind_tut_strike_desc": {
        "en_us": "Fires a bolt of energy that\ndeals little damage by itself,\nbut amplifies your next\nattack for double (x2) damage.",
        "fr": "Tire un éclair d’énergie qui inflige peu de dégâts en soi, mais amplifie votre prochaine attaque pour doubler (x2) de dégâts.",
        "zh_tw": "發射一道能量彈，本身造成的傷害很小，但會放大你的下一次攻擊，造成雙倍 （x2） 傷害。",
        "zh_cn": "发射一道能量弹，本身造成的伤害很小，但会放大你的下一次攻击，造成双倍 （x2） 伤害。",
        "ru": "Выпускает заряд энергии, который сам по себе наносит небольшой урон, но усиливает вашу следующую атаку, нанося двойной (x2) урон.",
        "es": "Dispara un rayo de energía que inflige poco daño por sí solo, pero amplifica tu próximo ataque para infligir el doble (x2) de daño.",
        "jp": "それ自体はほとんどダメージを与えないエネルギーの稲妻を発射しますが、次の攻撃を増幅して2倍(x2)のダメージを与えます。"
    },
    "mind_tut_enhance_desc": {
        "en_us": "Your next attack sets the\nenemy on fire, which deals\nTrue damage over time that\nignores defenses.",
        "fr": "Votre prochaine attaque met le feu à l’ennemi, ce qui lui inflige des dégâts bruts sur la durée qui ignorent les défenses.",
        "zh_tw": "你的下一次攻擊會讓敵人著火，隨著時間的推移會造成真正的傷害，而忽略了防禦。",
        "zh_cn": "你的下一次攻击会让敌人着火，随着时间的推移会造成真正的伤害，而忽略了防御。",
        "ru": "Ваша следующая атака поджигает врага, который наносит периодический чистый урон, игнорируя защиту.",
        "es": "Tu próximo ataque prende fuego al enemigo, lo que inflige daño verdadero con el tiempo que ignora las defensas.",
        "jp": "次の通常攻撃で敵に火をつけ、防御を無視して継続ダメージを与える。"
    },
    "mind_tut_protect_desc": {
        "en_us": "Creates a shield that blocks\nhalf of all damage, while\nstoring up and retaliating with\nthe damage you do take.",
        "fr": "Crée un bouclier qui bloque la moitié de tous les dégâts, tout en accumulant et en ripostant avec les dégâts que vous subissez.",
        "zh_tw": "創建一個盾牌，可以阻擋所有傷害的一半，同時儲存並利用你所受到的傷害進行報復。",
        "zh_cn": "创建一个盾牌，可以阻挡所有伤害的一半，同时储存并利用你所受到的伤害进行报复。",
        "ru": "Создает щит, который блокирует половину всего урона, накапливая и нанося ответный урон.",
        "es": "Crea un escudo que bloquea la mitad de todo el daño, mientras acumula y toma represalias con el daño que recibes.",
        "jp": "ダメージの半分をブロックし、受けたダメージを溜め込んで報復するシールドを作成します。"
    },
    "mind_tut_reinforce_desc": {
        "en_us": "Offensive buff that electrifies\nyourself to boost your\nattacks with extra damage.",
        "fr": "Buff offensif qui vous électrise pour booster vos attaques avec des dégâts supplémentaires.",
        "zh_tw": "攻擊性增益，使自己興奮，以額外的傷害增強您的攻擊。",
        "zh_cn": "攻击性增益，使自己兴奋，以额外的伤害增强您的攻击。",
        "ru": "Атакующий бафф, который электризует вас, усиливая ваши атаки дополнительным уроном.",
        "es": "Beneficio ofensivo que te electrifica para potenciar tus ataques con daño extra.",
        "jp": "攻撃バフは、自分自身に電撃を与え、追加ダメージで攻撃力を高めます。"
    },
    "mind_tut_unload_desc": {
        "en_us": "Multiplies the effectiveness\nof your next non-attack spell.\nThose clever enough to cast\nthis spell twice in a row\ncan attain breathtaking\nspell-amplifying power.",
        "fr": "Multiplie l’efficacité de votre prochain sort de non-attaque. Ceux qui sont assez intelligents pour lancer ce sort deux fois de suite peuvent atteindre un pouvoir d’amplification des sorts à couper le souffle.",
        "zh_tw": "使你的下一個非攻擊法術的效果成倍增加。那些足夠聰明的人可以連續兩次施放這個咒語，可以獲得驚人的咒語放大能力。",
        "zh_cn": "使你的下一个非攻击法术的效果成倍增加。那些足够聪明的人可以连续两次施放这个咒语，可以获得惊人的咒语放大能力。",
        "ru": "Умножает эффективность вашего следующего заклинания, не связанного с атакой. Те, кто достаточно умен, чтобы произнести это заклинание два раза подряд, могут достичь захватывающей дух силы, усиливающей заклинания.",
        "es": "Multiplica la efectividad de tu próximo hechizo que no sea de ataque. Aquellos lo suficientemente inteligentes como para lanzar este hechizo dos veces seguidas pueden alcanzar un impresionante poder amplificador de hechizos.",
        "jp": "次の非攻撃呪文の効果を倍増させる。この呪文を2回連続で唱える賢い人は、息を呑むような呪文増幅力を得ることができます。"
    },
    "time_tut_desc": {
        "en_us": "The Time rune grants \ncontrol over the temporal.\nTime spells let you attack multiple\ntimes, delay injuries, or even slow\nyour enemies to a stand-still.",
        "fr": "La rune du temps donne le contrôle sur le temporel. Les sorts temporels vous permettent d’attaquer plusieurs fois, de retarder les blessures ou même de ralentir vos ennemis jusqu’à ce qu’ils s’arrêtent.",
        "zh_tw": "時間符文授予對時間的控制權。時間法術讓你可以多次攻擊，延緩受傷時間，甚至減慢敵人的速度，使其停滯不前。",
        "zh_cn": "时间符文授予对时间的控制权。时间法术让你可以多次攻击，延缓受伤时间，甚至减慢敌人的速度，使其停滞不前。",
        "ru": "Руна Время дает контроль над временным. Заклинания времени позволяют атаковать несколько раз, задерживать ранения или даже замедлять врагов.",
        "es": "La runa del tiempo otorga control sobre lo temporal. Los hechizos de tiempo te permiten atacar varias veces, retrasar las lesiones o incluso ralentizar a tus enemigos hasta detenerlos.",
        "jp": "タイムルーンは、時間的なものに対するコントロールを与える。時間呪文を使用すると、複数回攻撃したり、負傷を遅らせたり、敵の動きを鈍らせたりすることができます。"
    },
    "time_tut_strike_desc": {
        "en_us": "An attack that strikes twice.\nEach attack does modest damage\nbut can be powered\nup greatly with +damage\nenhancements.",
        "fr": "Une attaque qui frappe deux fois. Chaque attaque inflige des dégâts modestes, mais peut être considérablement renforcée avec des améliorations de +dégâts.",
        "zh_tw": "兩次攻擊。每次攻擊都會造成適度的傷害，但可以通過+傷害增強來大大增強。",
        "zh_cn": "两次攻击。每次攻击都会造成适度的伤害，但可以通过+伤害增强来大大增强。",
        "ru": "Атака, которая наносит двойной удар. Каждая атака наносит небольшой урон, но может быть значительно усилена с помощью улучшений +урона.",
        "es": "Un ataque que golpea dos veces. Cada ataque hace un daño modesto, pero se puede potenciar en gran medida con mejoras de +daño.",
        "jp": "2回攻撃する攻撃。各攻撃は中程度のダメージを与えますが、+ダメージ強化で大幅にパワーアップできます。"
    },
    "time_tut_enhance_desc": {
        "en_us": "Your next attack is duplicated\nallowing you to fire multiple\nattacks at the same time.",
        "fr": "Votre prochaine attaque est dupliquée, ce qui vous permet de lancer plusieurs attaques en même temps.",
        "zh_tw": "你的下一次攻擊是重複的，允許你同時發射多次攻擊。",
        "zh_cn": "你的下一次攻击是重复的，允许你同时发射多次攻击。",
        "ru": "Ваша следующая атака дублируется, что позволяет вам проводить несколько атак одновременно.",
        "es": "Tu próximo ataque se duplica, lo que te permite disparar varios ataques al mismo tiempo.",
        "jp": "次の攻撃は複製され、同時に複数の攻撃を発射することができます。"
    },
    "time_tut_protect_desc": {
        "en_us": "Creates a shield that delays\nthe damage you take to a\nslow trickle, up to a limit.",
        "fr": "Crée un bouclier qui retarde les dégâts que vous subissez à un filet lent, jusqu’à une limite.",
        "zh_tw": "創建一個盾牌，可以將您受到的傷害延遲到緩慢的涓涓細流，直至達到極限。",
        "zh_cn": "创建一个盾牌，可以将您受到的伤害延迟到缓慢的涓涓细流，直至达到极限。",
        "ru": "Создает щит, который задерживает получаемый вами урон до медленной струйки, до предела.",
        "es": "Crea un escudo que retrasa el daño que recibes a un goteo lento, hasta un límite.",
        "jp": "受けるダメージを限界までゆっくりと遅らせるシールドを作成します。"
    },
    "time_tut_reinforce_desc": {
        "en_us": "Heals you by partially\nundoing your most recent\ninjury.",
        "fr": "Vous guérit en réparant partiellement votre blessure la plus récente.",
        "zh_tw": "通過部分消除您最近的傷害來治癒您。",
        "zh_cn": "通过部分消除您最近的伤害来治愈您。",
        "ru": "Исцеляет вас, частично устраняя вашу последнюю травму.",
        "es": "Te cura deshaciendo parcialmente tu lesión más reciente.",
        "jp": "直近の怪我を部分的に元に戻すことで、あなたを癒します。"
    },
    "time_tut_unload_desc": {
        "en_us": "Slows down time to a near\nstand-still for several easy\nand stress-free spell casts.",
        "fr": "Ralentit le temps jusqu’à ce qu’il s’arrête pour plusieurs sorts faciles et sans stress.",
        "zh_tw": "將時間減慢到幾乎靜止，以進行幾次簡單且無壓力的法術施放。",
        "zh_cn": "将时间减慢到几乎静止，以进行几次简单且无压力的法术施放。",
        "ru": "Замедляет время почти до полной остановки для нескольких простых и беззаботных применений заклинаний.",
        "es": "Ralentiza el tiempo hasta casi detenerlo durante varios lanzamientos de hechizos fáciles y sin estrés.",
        "jp": "時間をほぼ停止状態まで遅くし、簡単でストレスのない呪文を何度か唱えます。"
    },
    "void_tut_desc": {
        "en_us": "The Void rune grants \ncontrol over the power of empty\nspace. Void spells can deal\npercentage health damage,\nnegate enemy attacks, or even\nfully heal you at a cost.",
        "fr": "La rune du Vide confère le contrôle du pouvoir de l’espace vide. Les sorts du Vide peuvent infliger un pourcentage de dégâts de santé, annuler les attaques ennemies ou même vous soigner complètement à un coût.",
        "zh_tw": "虛空符文賦予了對虛空力量的控制權。虛空法術可以造成一定比例的生命傷害，抵消敵人的攻擊，甚至需要付出一定代價才能完全治癒你。",
        "zh_cn": "虚空符文赋予了对虚空力量的控制权。虚空法术可以造成一定比例的生命伤害，抵消敌人的攻击，甚至需要付出一定代价才能完全治愈你。",
        "ru": "Руна Пустоты дает контроль над силой пустого пространства. Заклинания Бездны могут наносить процент урона от здоровья, нейтрализовать вражеские атаки или даже полностью исцелять вас за определенную плату.",
        "es": "La runa del Vacío otorga control sobre el poder del espacio vacío. Los hechizos de vacío pueden infligir un porcentaje de daño de salud, negar los ataques enemigos o incluso curarte por completo a un costo.",
        "jp": "ボイドルーンでは、何もない空間の力をコントロールすることができます。ボイド呪文は、一定の割合の体力ダメージを与えたり、敵の攻撃を無効にしたり、コストをかければ完全に回復したりします。"
    },
    "void_tut_strike_desc": {
        "en_us": "An attack that deals percentage\nhealth damage and strikes an\nadditional 2 more times after\na delay.",
        "fr": "Une attaque qui inflige un pourcentage de dégâts de santé et frappe 2 fois de plus après un certain délai.",
        "zh_tw": "造成一定百分比生命傷害並在延遲後再攻擊 2 次的攻擊。",
        "zh_cn": "造成一定百分比生命伤害并在延迟后再攻击 2 次的攻击。",
        "ru": "Атака, которая наносит процентный урон здоровью и наносит еще 2 удара после задержки.",
        "es": "Un ataque que inflige un porcentaje de daño de vida y golpea 2 veces más después de un retraso.",
        "jp": "一定の割合の体力ダメージを与え、遅延後にさらに2回攻撃する攻撃。"
    },
    "void_tut_enhance_desc": {
        "en_us": "Curses an enemy, causing them\nto take more damage from\neverything. Works well with\nother spells that deal damage\nmultiple times.",
        "fr": "Maudit un ennemi, lui faisant subir plus de dégâts de tout. Fonctionne bien avec d’autres sorts qui infligent des dégâts plusieurs fois.",
        "zh_tw": "詛咒敵人，使他們從一切事物中受到更多傷害。適用於其他多次造成傷害的法術。",
        "zh_cn": "诅咒敌人，使他们从一切事物中受到更多伤害。适用于其他多次造成伤害的法术。",
        "ru": "Проклинает врага, заставляя его получать больше урона от всего. Хорошо работает с другими заклинаниями, которые наносят урон несколько раз.",
        "es": "Maldice a un enemigo, lo que hace que reciba más daño de todo. Funciona bien con otros hechizos que infligen daño varias veces.",
        "jp": "敵を呪い、敵があらゆるものから受けるダメージが増加する。複数回ダメージを与える他の呪文とうまく連携します。"
    },
    "void_tut_protect_desc": {
        "en_us": "Creates a shield that negates\nall damage from a single\nenemy attack hit, no matter\nhow strong.",
        "fr": "Crée un bouclier qui annule tous les dégâts infligés par une seule attaque ennemie, quelle que soit sa force.",
        "zh_tw": "創建一個盾牌，無論強度如何，都可以抵消單次敵人攻擊造成的所有傷害。",
        "zh_cn": "创建一个盾牌，无论强度如何，都可以抵消单次敌人攻击造成的所有伤害。",
        "ru": "Создает щит, который сводит на нет весь урон от одной вражеской атаки, независимо от того, насколько она сильна.",
        "es": "Crea un escudo que niega todo el daño de un solo golpe de ataque enemigo, sin importar cuán fuerte sea.",
        "jp": "敵の攻撃が1回受けても、どんなに強くてもすべてのダメージを無効化するシールドを生成する。"
    },
    "void_tut_reinforce_desc": {
        "en_us": "Become briefly invulnerable\nand heal to full, but at\nthe cost of some max health.",
        "fr": "Devient brièvement invulnérable et guérit complètement, mais au prix d’une santé maximale.",
        "zh_tw": "變得短暫無敵並完全恢復，但以一些最大生命值為代價。",
        "zh_cn": "变得短暂无敌并完全恢复，但以一些最大生命值为代价。",
        "ru": "Ненадолго становится неуязвимым и полностью исцеляется, но ценой некоторого максимального здоровья.",
        "es": "Te vuelves brevemente invulnerable y te curas por completo, pero a costa de algo de salud máxima.",
        "jp": "一時的に無敵状態になり、完全に回復しますが、最大体力がいくらか犠牲になります。"
    },
    "void_tut_unload_desc": {
        "en_us": "Creates a vortex that deals\nheavy percent health damage\nwhile disrupting any action\nthe enemy is trying to make.",
        "fr": "Crée un vortex qui inflige un pourcentage élevé de dégâts de santé tout en perturbant toute action de l’ennemi.",
        "zh_tw": "創造一個漩渦，造成嚴重的生命傷害，同時破壞敵人試圖做出的任何行動。",
        "zh_cn": "创造一个漩涡，造成严重的生命伤害，同时破坏敌人试图做出的任何行动。",
        "ru": "Создает вихрь, который наносит большой урон в процентах здоровья, прерывая любые действия противника.",
        "es": "Crea un vórtice que inflige un gran porcentaje de daño de salud mientras interrumpe cualquier acción que el enemigo esté tratando de hacer.",
        "jp": "敵が行おうとしている行動を妨害しながら、重い体力パーセントダメージを与える渦を発生させます。"
    },
    "protect_tut_desc": {
        "en_us": "The Shield rune creates\nbarriers that protect you as\nlong as they are positioned\nbetween you and the enemy.",
        "fr": "La rune Bouclier crée des barrières qui vous protègent tant qu’elles sont positionnées entre vous et l’ennemi.",
        "zh_tw": "盾牌符文會創造障礙物，只要它們位於你和敵人之間，就可以保護你。",
        "zh_cn": "盾牌符文会创造障碍物，只要它们位于你和敌人之间，就可以保护你。",
        "ru": "Руна Щит создает барьеры, которые защищают вас, пока они находятся между вами и врагом.",
        "es": "La runa escudo crea barreras que te protegen siempre que estén colocadas entre tú y el enemigo.",
        "jp": "シールドルーンは、あなたと敵の間に配置されている限り、あなたを保護するバリアを作成します。"
    },
    "reinforce_tut_desc": {
        "en_us": "The Body rune grants effects\nthat persist until you cast\na new body spell.\nSome Body+Rune combos can even heal you.",
        "fr": "La rune Corps confère des effets qui persistent jusqu’à ce que vous lanciez un nouveau sort corporel. Certains combos corps+runes peuvent même vous soigner.",
        "zh_tw": "身體符文賦予的效果會一直持續到你施放新的身體法術。一些身體+符文組合甚至可以治癒你。",
        "zh_cn": "身体符文赋予的效果会一直持续到你施放新的身体法术。一些身体+符文组合甚至可以治愈你。",
        "ru": "Руна Тела дает эффекты, которые сохраняются до тех пор, пока вы не разыграете новое заклинание тела. Некоторые комбинации Тело+Руна могут даже исцелить вас.",
        "es": "La runa Cuerpo otorga efectos que persisten hasta que lanzas un nuevo hechizo de cuerpo. Algunos combos de Cuerpo + Runa pueden incluso curarte.",
        "jp": "身体のルーンは、あなたが新しい身体呪文を唱えるまで持続する効果を付与する。一部のボディ+ルーンコンボはあなたを癒すことさえできます。"
    },
    "unload_tut_desc": {
        "en_us": "The Ultimate rune grants you\nsome of the most powerful\nspells in your arsenal.\nUse this rune wisely.",
        "fr": "La rune ultime vous confère certains des sorts les plus puissants de votre arsenal. Utilisez cette rune à bon escient.",
        "zh_tw": "終極符文賦予您武器庫中一些最強大的法術。明智地使用這個符文。",
        "zh_cn": "终极符文赋予您武器库中一些最强大的法术。明智地使用这个符文。",
        "ru": "Руна Ultimate дает вам одни из самых мощных заклинаний в вашем арсенале. Используйте эту руну с умом.",
        "es": "La runa definitiva te otorga algunos de los hechizos más poderosos de tu arsenal. Usa esta runa sabiamente.",
        "jp": "アルティメットルーンは、あなたの武器の中で最も強力な呪文のいくつかをあなたに与えます。このルーンを賢く使いましょう。"
    },
    "no_improve_tut_desc": {
        "en_us": "You see no more need to\nimprove. You are certain that\nyou are strong enough to take\non any challenge.",
        "fr": "Vous ne voyez plus la nécessité de vous améliorer. Vous êtes certain d’être assez fort pour relever n’importe quel défi.",
        "zh_tw": "你認為沒有必要再改進了。你確信你足夠強大，可以接受任何挑戰。",
        "zh_cn": "你认为没有必要再改进了。你确信你足够强大，可以接受任何挑战。",
        "ru": "Вы больше не видите необходимости совершенствоваться. Вы уверены, что достаточно сильны, чтобы принять любой вызов.",
        "es": "Ya no ves la necesidad de mejorar. Estás seguro de que eres lo suficientemente fuerte como para asumir cualquier desafío.",
        "jp": "これ以上改善する必要はないと思います。あなたは、どんな挑戦にも立ち向かうのに十分な強さを持っていると確信しています。"
    }
}

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
