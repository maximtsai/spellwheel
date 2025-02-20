<?xml version="1.0" encoding="UTF-8"?>
<data version="1.0">
    <struct type="Settings">
        <key>fileFormatVersion</key>
        <int>6</int>
        <key>texturePackerVersion</key>
        <string>7.0.3</string>
        <key>autoSDSettings</key>
        <array>
            <struct type="AutoSDSettings">
                <key>scale</key>
                <double>1</double>
                <key>extension</key>
                <string></string>
                <key>spriteFilter</key>
                <string></string>
                <key>acceptFractionalValues</key>
                <false/>
                <key>maxTextureSize</key>
                <QSize>
                    <key>width</key>
                    <int>-1</int>
                    <key>height</key>
                    <int>-1</int>
                </QSize>
            </struct>
        </array>
        <key>allowRotation</key>
        <false/>
        <key>shapeDebug</key>
        <false/>
        <key>dpi</key>
        <uint>72</uint>
        <key>dataFormat</key>
        <string>phaser-maxim</string>
        <key>textureFileName</key>
        <filename></filename>
        <key>flipPVR</key>
        <false/>
        <key>pvrQualityLevel</key>
        <uint>3</uint>
        <key>astcQualityLevel</key>
        <uint>2</uint>
        <key>basisUniversalQualityLevel</key>
        <uint>2</uint>
        <key>etc1QualityLevel</key>
        <uint>70</uint>
        <key>etc2QualityLevel</key>
        <uint>70</uint>
        <key>dxtCompressionMode</key>
        <enum type="SettingsBase::DxtCompressionMode">DXT_PERCEPTUAL</enum>
        <key>ditherType</key>
        <enum type="SettingsBase::DitherType">NearestNeighbour</enum>
        <key>backgroundColor</key>
        <uint>0</uint>
        <key>libGdx</key>
        <struct type="LibGDX">
            <key>filtering</key>
            <struct type="LibGDXFiltering">
                <key>x</key>
                <enum type="LibGDXFiltering::Filtering">Linear</enum>
                <key>y</key>
                <enum type="LibGDXFiltering::Filtering">Linear</enum>
            </struct>
        </struct>
        <key>shapePadding</key>
        <uint>0</uint>
        <key>jpgQuality</key>
        <uint>80</uint>
        <key>pngOptimizationLevel</key>
        <uint>1</uint>
        <key>webpQualityLevel</key>
        <uint>80</uint>
        <key>textureSubPath</key>
        <string></string>
        <key>textureFormat</key>
        <enum type="SettingsBase::TextureFormat">webp</enum>
        <key>borderPadding</key>
        <uint>0</uint>
        <key>maxTextureSize</key>
        <QSize>
            <key>width</key>
            <int>2048</int>
            <key>height</key>
            <int>2048</int>
        </QSize>
        <key>fixedTextureSize</key>
        <QSize>
            <key>width</key>
            <int>-1</int>
            <key>height</key>
            <int>-1</int>
        </QSize>
        <key>algorithmSettings</key>
        <struct type="AlgorithmSettings">
            <key>algorithm</key>
            <enum type="AlgorithmSettings::AlgorithmId">MaxRects</enum>
            <key>freeSizeMode</key>
            <enum type="AlgorithmSettings::AlgorithmFreeSizeMode">Best</enum>
            <key>sizeConstraints</key>
            <enum type="AlgorithmSettings::SizeConstraints">AnySize</enum>
            <key>forceSquared</key>
            <false/>
            <key>maxRects</key>
            <struct type="AlgorithmMaxRectsSettings">
                <key>heuristic</key>
                <enum type="AlgorithmMaxRectsSettings::Heuristic">Best</enum>
            </struct>
            <key>basic</key>
            <struct type="AlgorithmBasicSettings">
                <key>sortBy</key>
                <enum type="AlgorithmBasicSettings::SortBy">Best</enum>
                <key>order</key>
                <enum type="AlgorithmBasicSettings::Order">Ascending</enum>
            </struct>
            <key>polygon</key>
            <struct type="AlgorithmPolygonSettings">
                <key>alignToGrid</key>
                <uint>1</uint>
            </struct>
        </struct>
        <key>dataFileNames</key>
        <map type="GFileNameMap">
            <key>json</key>
            <struct type="DataFile">
                <key>name</key>
                <filename>../sprites/enemies.json</filename>
            </struct>
        </map>
        <key>multiPackMode</key>
        <enum type="SettingsBase::MultiPackMode">MultiPackAuto</enum>
        <key>forceIdenticalLayout</key>
        <false/>
        <key>outputFormat</key>
        <enum type="SettingsBase::OutputFormat">RGBA8888</enum>
        <key>alphaHandling</key>
        <enum type="SettingsBase::AlphaHandling">ClearTransparentPixels</enum>
        <key>contentProtection</key>
        <struct type="ContentProtection">
            <key>key</key>
            <string></string>
        </struct>
        <key>autoAliasEnabled</key>
        <true/>
        <key>trimSpriteNames</key>
        <false/>
        <key>prependSmartFolderName</key>
        <false/>
        <key>autodetectAnimations</key>
        <true/>
        <key>globalSpriteSettings</key>
        <struct type="SpriteSettings">
            <key>scale</key>
            <double>1</double>
            <key>scaleMode</key>
            <enum type="ScaleMode">Smooth</enum>
            <key>extrude</key>
            <uint>1</uint>
            <key>trimThreshold</key>
            <uint>2</uint>
            <key>trimMargin</key>
            <uint>1</uint>
            <key>trimMode</key>
            <enum type="SpriteSettings::TrimMode">Trim</enum>
            <key>tracerTolerance</key>
            <int>200</int>
            <key>heuristicMask</key>
            <false/>
            <key>defaultPivotPoint</key>
            <point_f>0.5,0.5</point_f>
            <key>writePivotPoints</key>
            <true/>
        </struct>
        <key>individualSpriteSettings</key>
        <map type="IndividualSpriteSettingsMap">
            <key type="filename">enemies/bird_1.png</key>
            <struct type="IndividualSpriteSettings">
                <key>pivotPoint</key>
                <point_f>0.5,0.5</point_f>
                <key>spriteScale</key>
                <double>0.8</double>
                <key>scale9Enabled</key>
                <false/>
                <key>scale9Borders</key>
                <rect>14,13,28,25</rect>
                <key>scale9Paddings</key>
                <rect>14,13,28,25</rect>
                <key>scale9FromFile</key>
                <false/>
            </struct>
            <key type="filename">enemies/bird_2.png</key>
            <struct type="IndividualSpriteSettings">
                <key>pivotPoint</key>
                <point_f>0.5,0.5</point_f>
                <key>spriteScale</key>
                <double>0.8</double>
                <key>scale9Enabled</key>
                <false/>
                <key>scale9Borders</key>
                <rect>21,16,41,32</rect>
                <key>scale9Paddings</key>
                <rect>21,16,41,32</rect>
                <key>scale9FromFile</key>
                <false/>
            </struct>
            <key type="filename">enemies/blank.png</key>
            <struct type="IndividualSpriteSettings">
                <key>pivotPoint</key>
                <point_f>0.5,0.5</point_f>
                <key>spriteScale</key>
                <double>1</double>
                <key>scale9Enabled</key>
                <false/>
                <key>scale9Borders</key>
                <rect>1,1,1,1</rect>
                <key>scale9Paddings</key>
                <rect>1,1,1,1</rect>
                <key>scale9FromFile</key>
                <false/>
            </struct>
            <key type="filename">enemies/blood_0.png</key>
            <key type="filename">enemies/blood_1.png</key>
            <struct type="IndividualSpriteSettings">
                <key>pivotPoint</key>
                <point_f>0.5,0.5</point_f>
                <key>spriteScale</key>
                <double>1</double>
                <key>scale9Enabled</key>
                <false/>
                <key>scale9Borders</key>
                <rect>37,27,74,53</rect>
                <key>scale9Paddings</key>
                <rect>37,27,74,53</rect>
                <key>scale9FromFile</key>
                <false/>
            </struct>
            <key type="filename">enemies/blurryball.png</key>
            <key type="filename">enemies/void_knight_shield_eye.png</key>
            <key type="filename">enemies/void_knight_shield_eye_2.png</key>
            <struct type="IndividualSpriteSettings">
                <key>pivotPoint</key>
                <point_f>0.5,0.5</point_f>
                <key>spriteScale</key>
                <double>1</double>
                <key>scale9Enabled</key>
                <false/>
                <key>scale9Borders</key>
                <rect>20,20,40,40</rect>
                <key>scale9Paddings</key>
                <rect>20,20,40,40</rect>
                <key>scale9FromFile</key>
                <false/>
            </struct>
            <key type="filename">enemies/bonk.png</key>
            <struct type="IndividualSpriteSettings">
                <key>pivotPoint</key>
                <point_f>0.5,0.5</point_f>
                <key>spriteScale</key>
                <double>0.7</double>
                <key>scale9Enabled</key>
                <false/>
                <key>scale9Borders</key>
                <rect>64,36,129,71</rect>
                <key>scale9Paddings</key>
                <rect>64,36,129,71</rect>
                <key>scale9FromFile</key>
                <false/>
            </struct>
            <key type="filename">enemies/clock1.png</key>
            <struct type="IndividualSpriteSettings">
                <key>pivotPoint</key>
                <point_f>0.5,0.5</point_f>
                <key>spriteScale</key>
                <double>1</double>
                <key>scale9Enabled</key>
                <false/>
                <key>scale9Borders</key>
                <rect>5,5,9,9</rect>
                <key>scale9Paddings</key>
                <rect>5,5,9,9</rect>
                <key>scale9FromFile</key>
                <false/>
            </struct>
            <key type="filename">enemies/clock2.png</key>
            <struct type="IndividualSpriteSettings">
                <key>pivotPoint</key>
                <point_f>0.5,0.5</point_f>
                <key>spriteScale</key>
                <double>1</double>
                <key>scale9Enabled</key>
                <false/>
                <key>scale9Borders</key>
                <rect>10,10,19,19</rect>
                <key>scale9Paddings</key>
                <rect>10,10,19,19</rect>
                <key>scale9FromFile</key>
                <false/>
            </struct>
            <key type="filename">enemies/clock3.png</key>
            <struct type="IndividualSpriteSettings">
                <key>pivotPoint</key>
                <point_f>0.5,0.5</point_f>
                <key>spriteScale</key>
                <double>1</double>
                <key>scale9Enabled</key>
                <false/>
                <key>scale9Borders</key>
                <rect>15,15,29,29</rect>
                <key>scale9Paddings</key>
                <rect>15,15,29,29</rect>
                <key>scale9FromFile</key>
                <false/>
            </struct>
            <key type="filename">enemies/clock4.png</key>
            <struct type="IndividualSpriteSettings">
                <key>pivotPoint</key>
                <point_f>0.5,0.5</point_f>
                <key>spriteScale</key>
                <double>1</double>
                <key>scale9Enabled</key>
                <false/>
                <key>scale9Borders</key>
                <rect>20,20,39,39</rect>
                <key>scale9Paddings</key>
                <rect>20,20,39,39</rect>
                <key>scale9FromFile</key>
                <false/>
            </struct>
            <key type="filename">enemies/dizzystar.png</key>
            <struct type="IndividualSpriteSettings">
                <key>pivotPoint</key>
                <point_f>0.5,0.5</point_f>
                <key>spriteScale</key>
                <double>1</double>
                <key>scale9Enabled</key>
                <false/>
                <key>scale9Borders</key>
                <rect>20,21,39,43</rect>
                <key>scale9Paddings</key>
                <rect>20,21,39,43</rect>
                <key>scale9FromFile</key>
                <false/>
            </struct>
            <key type="filename">enemies/falling_leaves.png</key>
            <struct type="IndividualSpriteSettings">
                <key>pivotPoint</key>
                <point_f>0.5,0.5</point_f>
                <key>spriteScale</key>
                <double>0.75</double>
                <key>scale9Enabled</key>
                <false/>
                <key>scale9Borders</key>
                <rect>40,61,81,121</rect>
                <key>scale9Paddings</key>
                <rect>40,61,81,121</rect>
                <key>scale9FromFile</key>
                <false/>
            </struct>
            <key type="filename">enemies/falling_leaves_2.png</key>
            <struct type="IndividualSpriteSettings">
                <key>pivotPoint</key>
                <point_f>0.5,0.5</point_f>
                <key>spriteScale</key>
                <double>0.75</double>
                <key>scale9Enabled</key>
                <false/>
                <key>scale9Borders</key>
                <rect>69,87,137,173</rect>
                <key>scale9Paddings</key>
                <rect>69,87,137,173</rect>
                <key>scale9FromFile</key>
                <false/>
            </struct>
            <key type="filename">enemies/falling_leaves_3.png</key>
            <struct type="IndividualSpriteSettings">
                <key>pivotPoint</key>
                <point_f>0.5,0.5</point_f>
                <key>spriteScale</key>
                <double>0.75</double>
                <key>scale9Enabled</key>
                <false/>
                <key>scale9Borders</key>
                <rect>34,37,67,74</rect>
                <key>scale9Paddings</key>
                <rect>34,37,67,74</rect>
                <key>scale9FromFile</key>
                <false/>
            </struct>
            <key type="filename">enemies/glowSpike.png</key>
            <struct type="IndividualSpriteSettings">
                <key>pivotPoint</key>
                <point_f>0.5,0.5</point_f>
                <key>spriteScale</key>
                <double>0.9</double>
                <key>scale9Enabled</key>
                <false/>
                <key>scale9Borders</key>
                <rect>39,24,78,48</rect>
                <key>scale9Paddings</key>
                <rect>39,24,78,48</rect>
                <key>scale9FromFile</key>
                <false/>
            </struct>
            <key type="filename">enemies/glowSpike2.png</key>
            <struct type="IndividualSpriteSettings">
                <key>pivotPoint</key>
                <point_f>0.5,0.5</point_f>
                <key>spriteScale</key>
                <double>1</double>
                <key>scale9Enabled</key>
                <false/>
                <key>scale9Borders</key>
                <rect>45,45,90,90</rect>
                <key>scale9Paddings</key>
                <rect>45,45,90,90</rect>
                <key>scale9FromFile</key>
                <false/>
            </struct>
            <key type="filename">enemies/gobbo0.png</key>
            <key type="filename">enemies/gobbo2.png</key>
            <key type="filename">enemies/gobbo3.png</key>
            <struct type="IndividualSpriteSettings">
                <key>pivotPoint</key>
                <point_f>0.5,0.5</point_f>
                <key>spriteScale</key>
                <double>0.62</double>
                <key>scale9Enabled</key>
                <false/>
                <key>scale9Borders</key>
                <rect>100,100,200,200</rect>
                <key>scale9Paddings</key>
                <rect>100,100,200,200</rect>
                <key>scale9FromFile</key>
                <false/>
            </struct>
            <key type="filename">enemies/gobbo0_atk.png</key>
            <struct type="IndividualSpriteSettings">
                <key>pivotPoint</key>
                <point_f>0.5,0.5</point_f>
                <key>spriteScale</key>
                <double>0.68</double>
                <key>scale9Enabled</key>
                <false/>
                <key>scale9Borders</key>
                <rect>113,89,225,177</rect>
                <key>scale9Paddings</key>
                <rect>113,89,225,177</rect>
                <key>scale9FromFile</key>
                <false/>
            </struct>
            <key type="filename">enemies/gobbo4.png</key>
            <struct type="IndividualSpriteSettings">
                <key>pivotPoint</key>
                <point_f>0.5,0.5</point_f>
                <key>spriteScale</key>
                <double>0.62</double>
                <key>scale9Enabled</key>
                <false/>
                <key>scale9Borders</key>
                <rect>100,105,200,209</rect>
                <key>scale9Paddings</key>
                <rect>100,105,200,209</rect>
                <key>scale9FromFile</key>
                <false/>
            </struct>
            <key type="filename">enemies/gobbo5.png</key>
            <struct type="IndividualSpriteSettings">
                <key>pivotPoint</key>
                <point_f>0.5,0.5</point_f>
                <key>spriteScale</key>
                <double>0.62</double>
                <key>scale9Enabled</key>
                <false/>
                <key>scale9Borders</key>
                <rect>97,109,194,217</rect>
                <key>scale9Paddings</key>
                <rect>97,109,194,217</rect>
                <key>scale9FromFile</key>
                <false/>
            </struct>
            <key type="filename">enemies/gobboAttack1.png</key>
            <key type="filename">enemies/gobboAttack2.png</key>
            <struct type="IndividualSpriteSettings">
                <key>pivotPoint</key>
                <point_f>0.5,0.5</point_f>
                <key>spriteScale</key>
                <double>0.64</double>
                <key>scale9Enabled</key>
                <false/>
                <key>scale9Borders</key>
                <rect>97,109,194,217</rect>
                <key>scale9Paddings</key>
                <rect>97,109,194,217</rect>
                <key>scale9FromFile</key>
                <false/>
            </struct>
            <key type="filename">enemies/gobboDead.png</key>
            <struct type="IndividualSpriteSettings">
                <key>pivotPoint</key>
                <point_f>0.5,0.5</point_f>
                <key>spriteScale</key>
                <double>0.5</double>
                <key>scale9Enabled</key>
                <false/>
                <key>scale9Borders</key>
                <rect>256,256,512,512</rect>
                <key>scale9Paddings</key>
                <rect>256,256,512,512</rect>
                <key>scale9FromFile</key>
                <false/>
            </struct>
            <key type="filename">enemies/gobbo_elec1.png</key>
            <key type="filename">enemies/gobbo_elec2.png</key>
            <struct type="IndividualSpriteSettings">
                <key>pivotPoint</key>
                <point_f>0.5,0.5</point_f>
                <key>spriteScale</key>
                <double>0.58</double>
                <key>scale9Enabled</key>
                <false/>
                <key>scale9Borders</key>
                <rect>136,138,271,275</rect>
                <key>scale9Paddings</key>
                <rect>136,138,271,275</rect>
                <key>scale9FromFile</key>
                <false/>
            </struct>
            <key type="filename">enemies/gobbo_extinguish1.png</key>
            <key type="filename">enemies/gobbo_extinguish2.png</key>
            <struct type="IndividualSpriteSettings">
                <key>pivotPoint</key>
                <point_f>0.5,0.5</point_f>
                <key>spriteScale</key>
                <double>0.59</double>
                <key>scale9Enabled</key>
                <false/>
                <key>scale9Borders</key>
                <rect>114,110,229,221</rect>
                <key>scale9Paddings</key>
                <rect>114,110,229,221</rect>
                <key>scale9FromFile</key>
                <false/>
            </struct>
            <key type="filename">enemies/gobbo_fire1.png</key>
            <key type="filename">enemies/gobbo_fire2.png</key>
            <struct type="IndividualSpriteSettings">
                <key>pivotPoint</key>
                <point_f>0.5,0.5</point_f>
                <key>spriteScale</key>
                <double>0.62</double>
                <key>scale9Enabled</key>
                <false/>
                <key>scale9Borders</key>
                <rect>63,125,125,249</rect>
                <key>scale9Paddings</key>
                <rect>63,125,125,249</rect>
                <key>scale9FromFile</key>
                <false/>
            </struct>
            <key type="filename">enemies/gobbo_knock1.png</key>
            <key type="filename">enemies/gobbo_knock2.png</key>
            <key type="filename">enemies/gobbo_knock3.png</key>
            <key type="filename">enemies/gobbo_knock4.png</key>
            <struct type="IndividualSpriteSettings">
                <key>pivotPoint</key>
                <point_f>0.5,0.5</point_f>
                <key>spriteScale</key>
                <double>0.6</double>
                <key>scale9Enabled</key>
                <false/>
                <key>scale9Borders</key>
                <rect>114,164,229,329</rect>
                <key>scale9Paddings</key>
                <rect>114,164,229,329</rect>
                <key>scale9FromFile</key>
                <false/>
            </struct>
            <key type="filename">enemies/gobbo_knock_full.png</key>
            <struct type="IndividualSpriteSettings">
                <key>pivotPoint</key>
                <point_f>0.5,0.5</point_f>
                <key>spriteScale</key>
                <double>1</double>
                <key>scale9Enabled</key>
                <false/>
                <key>scale9Borders</key>
                <rect>114,164,229,329</rect>
                <key>scale9Paddings</key>
                <rect>114,164,229,329</rect>
                <key>scale9FromFile</key>
                <false/>
            </struct>
            <key type="filename">enemies/gobboshield1.png</key>
            <key type="filename">enemies/gobboshield2.png</key>
            <struct type="IndividualSpriteSettings">
                <key>pivotPoint</key>
                <point_f>0.5,0.5</point_f>
                <key>spriteScale</key>
                <double>0.62</double>
                <key>scale9Enabled</key>
                <false/>
                <key>scale9Borders</key>
                <rect>76,81,151,161</rect>
                <key>scale9Paddings</key>
                <rect>76,81,151,161</rect>
                <key>scale9FromFile</key>
                <false/>
            </struct>
            <key type="filename">enemies/gunflash_1.png</key>
            <key type="filename">enemies/gunflash_2.png</key>
            <key type="filename">enemies/gunflash_3.png</key>
            <key type="filename">enemies/gunflash_4.png</key>
            <key type="filename">enemies/gunflash_5.png</key>
            <key type="filename">enemies/missile.png</key>
            <struct type="IndividualSpriteSettings">
                <key>pivotPoint</key>
                <point_f>0.5,0.5</point_f>
                <key>spriteScale</key>
                <double>1</double>
                <key>scale9Enabled</key>
                <false/>
                <key>scale9Borders</key>
                <rect>35,35,69,69</rect>
                <key>scale9Paddings</key>
                <rect>35,35,69,69</rect>
                <key>scale9FromFile</key>
                <false/>
            </struct>
            <key type="filename">enemies/hat.png</key>
            <struct type="IndividualSpriteSettings">
                <key>pivotPoint</key>
                <point_f>0.5,0.5</point_f>
                <key>spriteScale</key>
                <double>0.8</double>
                <key>scale9Enabled</key>
                <false/>
                <key>scale9Borders</key>
                <rect>46,29,93,57</rect>
                <key>scale9Paddings</key>
                <rect>46,29,93,57</rect>
                <key>scale9FromFile</key>
                <false/>
            </struct>
            <key type="filename">enemies/healthbar_edge.png</key>
            <struct type="IndividualSpriteSettings">
                <key>pivotPoint</key>
                <point_f>0.5,0.5</point_f>
                <key>spriteScale</key>
                <double>1</double>
                <key>scale9Enabled</key>
                <false/>
                <key>scale9Borders</key>
                <rect>10,8,20,15</rect>
                <key>scale9Paddings</key>
                <rect>10,8,20,15</rect>
                <key>scale9FromFile</key>
                <false/>
            </struct>
            <key type="filename">enemies/healthbar_long.png</key>
            <key type="filename">enemies/healthbar_long2.png</key>
            <struct type="IndividualSpriteSettings">
                <key>pivotPoint</key>
                <point_f>0.5,0.5</point_f>
                <key>spriteScale</key>
                <double>1</double>
                <key>scale9Enabled</key>
                <false/>
                <key>scale9Borders</key>
                <rect>25,8,50,15</rect>
                <key>scale9Paddings</key>
                <rect>25,8,50,15</rect>
                <key>scale9FromFile</key>
                <false/>
            </struct>
            <key type="filename">enemies/lesser_dummy.png</key>
            <struct type="IndividualSpriteSettings">
                <key>pivotPoint</key>
                <point_f>0.5,0.5</point_f>
                <key>spriteScale</key>
                <double>0.8</double>
                <key>scale9Enabled</key>
                <false/>
                <key>scale9Borders</key>
                <rect>49,73,97,145</rect>
                <key>scale9Paddings</key>
                <rect>49,73,97,145</rect>
                <key>scale9FromFile</key>
                <false/>
            </struct>
            <key type="filename">enemies/lesser_dummy_blank.png</key>
            <key type="filename">enemies/lesser_dummy_eyes1.png</key>
            <key type="filename">enemies/lesser_dummy_eyes2.png</key>
            <key type="filename">enemies/lesser_dummy_eyes3.png</key>
            <key type="filename">enemies/lesser_dummy_eyes4.png</key>
            <key type="filename">enemies/lesser_dummy_eyes5.png</key>
            <key type="filename">enemies/lesser_dummy_eyes6.png</key>
            <key type="filename">enemies/lesser_dummy_eyes7.png</key>
            <key type="filename">enemies/lesser_dummy_eyes8.png</key>
            <key type="filename">enemies/lesser_dummy_eyes9.png</key>
            <key type="filename">enemies/lesser_dummy_mouth1.png</key>
            <key type="filename">enemies/lesser_dummy_mouth2.png</key>
            <key type="filename">enemies/lesser_dummy_mouth3.png</key>
            <key type="filename">enemies/lesser_dummy_mouth4.png</key>
            <key type="filename">enemies/lesser_dummy_mouth5.png</key>
            <key type="filename">enemies/lesser_dummy_mouth6.png</key>
            <key type="filename">enemies/lesser_dummy_mouth7.png</key>
            <key type="filename">enemies/lesser_dummy_mouth8.png</key>
            <key type="filename">enemies/lesser_dummy_mouth9.png</key>
            <key type="filename">enemies/lesser_dummy_noshadow.png</key>
            <key type="filename">enemies/lesser_dummy_smile.png</key>
            <struct type="IndividualSpriteSettings">
                <key>pivotPoint</key>
                <point_f>0.5,0.5</point_f>
                <key>spriteScale</key>
                <double>0.8</double>
                <key>scale9Enabled</key>
                <false/>
                <key>scale9Borders</key>
                <rect>58,78,115,155</rect>
                <key>scale9Paddings</key>
                <rect>58,78,115,155</rect>
                <key>scale9FromFile</key>
                <false/>
            </struct>
            <key type="filename">enemies/lesser_dummy_dead.png</key>
            <struct type="IndividualSpriteSettings">
                <key>pivotPoint</key>
                <point_f>0.5,0.5</point_f>
                <key>spriteScale</key>
                <double>0.8</double>
                <key>scale9Enabled</key>
                <false/>
                <key>scale9Borders</key>
                <rect>81,51,163,101</rect>
                <key>scale9Paddings</key>
                <rect>81,51,163,101</rect>
                <key>scale9FromFile</key>
                <false/>
            </struct>
            <key type="filename">enemies/lesser_dummy_dead_far.png</key>
            <struct type="IndividualSpriteSettings">
                <key>pivotPoint</key>
                <point_f>0.5,0.5</point_f>
                <key>spriteScale</key>
                <double>1</double>
                <key>scale9Enabled</key>
                <false/>
                <key>scale9Borders</key>
                <rect>41,26,81,51</rect>
                <key>scale9Paddings</key>
                <rect>41,26,81,51</rect>
                <key>scale9FromFile</key>
                <false/>
            </struct>
            <key type="filename">enemies/lesser_dummy_dead_far_glow.png</key>
            <struct type="IndividualSpriteSettings">
                <key>pivotPoint</key>
                <point_f>0.5,0.5</point_f>
                <key>spriteScale</key>
                <double>1</double>
                <key>scale9Enabled</key>
                <false/>
                <key>scale9Borders</key>
                <rect>61,31,122,62</rect>
                <key>scale9Paddings</key>
                <rect>61,31,122,62</rect>
                <key>scale9FromFile</key>
                <false/>
            </struct>
            <key type="filename">enemies/lesser_dummy_hurt.png</key>
            <struct type="IndividualSpriteSettings">
                <key>pivotPoint</key>
                <point_f>0.5,0.5</point_f>
                <key>spriteScale</key>
                <double>0.8</double>
                <key>scale9Enabled</key>
                <false/>
                <key>scale9Borders</key>
                <rect>62,80,125,160</rect>
                <key>scale9Paddings</key>
                <rect>62,80,125,160</rect>
                <key>scale9FromFile</key>
                <false/>
            </struct>
            <key type="filename">enemies/lesser_dummy_shield.png</key>
            <struct type="IndividualSpriteSettings">
                <key>pivotPoint</key>
                <point_f>0.5,0.5</point_f>
                <key>spriteScale</key>
                <double>0.73</double>
                <key>scale9Enabled</key>
                <false/>
                <key>scale9Borders</key>
                <rect>87,160,175,320</rect>
                <key>scale9Paddings</key>
                <rect>87,160,175,320</rect>
                <key>scale9FromFile</key>
                <false/>
            </struct>
            <key type="filename">enemies/lesser_dummy_shield_smal.png</key>
            <struct type="IndividualSpriteSettings">
                <key>pivotPoint</key>
                <point_f>0.5,0.5</point_f>
                <key>spriteScale</key>
                <double>1</double>
                <key>scale9Enabled</key>
                <false/>
                <key>scale9Borders</key>
                <rect>44,80,87,160</rect>
                <key>scale9Paddings</key>
                <rect>44,80,87,160</rect>
                <key>scale9FromFile</key>
                <false/>
            </struct>
            <key type="filename">enemies/lesser_dummy_shield_smal_hover.png</key>
            <struct type="IndividualSpriteSettings">
                <key>pivotPoint</key>
                <point_f>0.5,0.5</point_f>
                <key>spriteScale</key>
                <double>1</double>
                <key>scale9Enabled</key>
                <false/>
                <key>scale9Borders</key>
                <rect>44,81,87,161</rect>
                <key>scale9Paddings</key>
                <rect>44,81,87,161</rect>
                <key>scale9FromFile</key>
                <false/>
            </struct>
            <key type="filename">enemies/mantis_a.png</key>
            <key type="filename">enemies/mantis_b.png</key>
            <key type="filename">enemies/mantis_dead.png</key>
            <key type="filename">enemies/mantis_preparing.png</key>
            <struct type="IndividualSpriteSettings">
                <key>pivotPoint</key>
                <point_f>0.5,0.5</point_f>
                <key>spriteScale</key>
                <double>0.59</double>
                <key>scale9Enabled</key>
                <false/>
                <key>scale9Borders</key>
                <rect>133,138,265,275</rect>
                <key>scale9Paddings</key>
                <rect>133,138,265,275</rect>
                <key>scale9FromFile</key>
                <false/>
            </struct>
            <key type="filename">enemies/mantis_head_1.png</key>
            <struct type="IndividualSpriteSettings">
                <key>pivotPoint</key>
                <point_f>0.5,0.5</point_f>
                <key>spriteScale</key>
                <double>0.59</double>
                <key>scale9Enabled</key>
                <false/>
                <key>scale9Borders</key>
                <rect>37,55,73,111</rect>
                <key>scale9Paddings</key>
                <rect>37,55,73,111</rect>
                <key>scale9FromFile</key>
                <false/>
            </struct>
            <key type="filename">enemies/mantis_head_2.png</key>
            <struct type="IndividualSpriteSettings">
                <key>pivotPoint</key>
                <point_f>0.5,0.5</point_f>
                <key>spriteScale</key>
                <double>0.59</double>
                <key>scale9Enabled</key>
                <false/>
                <key>scale9Borders</key>
                <rect>28,19,55,37</rect>
                <key>scale9Paddings</key>
                <rect>28,19,55,37</rect>
                <key>scale9FromFile</key>
                <false/>
            </struct>
            <key type="filename">enemies/mantis_head_3.png</key>
            <struct type="IndividualSpriteSettings">
                <key>pivotPoint</key>
                <point_f>0.5,0.5</point_f>
                <key>spriteScale</key>
                <double>0.59</double>
                <key>scale9Enabled</key>
                <false/>
                <key>scale9Borders</key>
                <rect>26,20,51,40</rect>
                <key>scale9Paddings</key>
                <rect>26,20,51,40</rect>
                <key>scale9FromFile</key>
                <false/>
            </struct>
            <key type="filename">enemies/mantis_reveal.png</key>
            <key type="filename">enemies/mantis_shoot_headless.png</key>
            <key type="filename">enemies/mantis_shoot_left.png</key>
            <key type="filename">enemies/mantis_shoot_right.png</key>
            <key type="filename">enemies/mantis_unveiled.png</key>
            <struct type="IndividualSpriteSettings">
                <key>pivotPoint</key>
                <point_f>0.5,0.5</point_f>
                <key>spriteScale</key>
                <double>0.59</double>
                <key>scale9Enabled</key>
                <false/>
                <key>scale9Borders</key>
                <rect>153,138,305,275</rect>
                <key>scale9Paddings</key>
                <rect>153,138,305,275</rect>
                <key>scale9FromFile</key>
                <false/>
            </struct>
            <key type="filename">enemies/max_death_1_cast.png</key>
            <struct type="IndividualSpriteSettings">
                <key>pivotPoint</key>
                <point_f>0.5,0.5</point_f>
                <key>spriteScale</key>
                <double>0.9</double>
                <key>scale9Enabled</key>
                <false/>
                <key>scale9Borders</key>
                <rect>169,175,337,350</rect>
                <key>scale9Paddings</key>
                <rect>169,175,337,350</rect>
                <key>scale9FromFile</key>
                <false/>
            </struct>
            <key type="filename">enemies/max_death_1_magic_1.png</key>
            <key type="filename">enemies/max_death_1_magic_2.png</key>
            <struct type="IndividualSpriteSettings">
                <key>pivotPoint</key>
                <point_f>0.5,0.5</point_f>
                <key>spriteScale</key>
                <double>1</double>
                <key>scale9Enabled</key>
                <false/>
                <key>scale9Borders</key>
                <rect>43,46,85,93</rect>
                <key>scale9Paddings</key>
                <rect>43,46,85,93</rect>
                <key>scale9FromFile</key>
                <false/>
            </struct>
            <key type="filename">enemies/max_death_1a.png</key>
            <key type="filename">enemies/max_death_1a_angry.png</key>
            <key type="filename">enemies/max_death_1b.png</key>
            <key type="filename">enemies/max_death_1b_angry.png</key>
            <key type="filename">enemies/max_death_1b_angry_white.png</key>
            <key type="filename">enemies/max_death_left_sleeve_a.png</key>
            <key type="filename">enemies/max_death_left_sleeve_b.png</key>
            <struct type="IndividualSpriteSettings">
                <key>pivotPoint</key>
                <point_f>0.5,0.5</point_f>
                <key>spriteScale</key>
                <double>1</double>
                <key>scale9Enabled</key>
                <false/>
                <key>scale9Borders</key>
                <rect>169,175,337,350</rect>
                <key>scale9Paddings</key>
                <rect>169,175,337,350</rect>
                <key>scale9FromFile</key>
                <false/>
            </struct>
            <key type="filename">enemies/max_death_left_arm.png</key>
            <struct type="IndividualSpriteSettings">
                <key>pivotPoint</key>
                <point_f>0.5,0.5</point_f>
                <key>spriteScale</key>
                <double>1</double>
                <key>scale9Enabled</key>
                <false/>
                <key>scale9Borders</key>
                <rect>93,73,186,145</rect>
                <key>scale9Paddings</key>
                <rect>93,73,186,145</rect>
                <key>scale9FromFile</key>
                <false/>
            </struct>
            <key type="filename">enemies/max_death_right_hand.png</key>
            <struct type="IndividualSpriteSettings">
                <key>pivotPoint</key>
                <point_f>0.5,0.5</point_f>
                <key>spriteScale</key>
                <double>1</double>
                <key>scale9Enabled</key>
                <false/>
                <key>scale9Borders</key>
                <rect>63,38,125,75</rect>
                <key>scale9Paddings</key>
                <rect>63,38,125,75</rect>
                <key>scale9FromFile</key>
                <false/>
            </struct>
            <key type="filename">enemies/music_note.png</key>
            <struct type="IndividualSpriteSettings">
                <key>pivotPoint</key>
                <point_f>0.5,0.5</point_f>
                <key>spriteScale</key>
                <double>1</double>
                <key>scale9Enabled</key>
                <false/>
                <key>scale9Borders</key>
                <rect>55,55,110,110</rect>
                <key>scale9Paddings</key>
                <rect>55,55,110,110</rect>
                <key>scale9FromFile</key>
                <false/>
            </struct>
            <key type="filename">enemies/music_note_blue.png</key>
            <struct type="IndividualSpriteSettings">
                <key>pivotPoint</key>
                <point_f>0.5,0.5</point_f>
                <key>spriteScale</key>
                <double>0.5</double>
                <key>scale9Enabled</key>
                <false/>
                <key>scale9Borders</key>
                <rect>55,55,110,110</rect>
                <key>scale9Paddings</key>
                <rect>55,55,110,110</rect>
                <key>scale9FromFile</key>
                <false/>
            </struct>
            <key type="filename">enemies/palm.png</key>
            <struct type="IndividualSpriteSettings">
                <key>pivotPoint</key>
                <point_f>0.5,0.5</point_f>
                <key>spriteScale</key>
                <double>1</double>
                <key>scale9Enabled</key>
                <false/>
                <key>scale9Borders</key>
                <rect>65,143,129,285</rect>
                <key>scale9Paddings</key>
                <rect>65,143,129,285</rect>
                <key>scale9FromFile</key>
                <false/>
            </struct>
            <key type="filename">enemies/ready_glow.png</key>
            <struct type="IndividualSpriteSettings">
                <key>pivotPoint</key>
                <point_f>0.5,0.5</point_f>
                <key>spriteScale</key>
                <double>1</double>
                <key>scale9Enabled</key>
                <false/>
                <key>scale9Borders</key>
                <rect>26,8,52,15</rect>
                <key>scale9Paddings</key>
                <rect>26,8,52,15</rect>
                <key>scale9FromFile</key>
                <false/>
            </struct>
            <key type="filename">enemies/red_clock_arm_large.png</key>
            <struct type="IndividualSpriteSettings">
                <key>pivotPoint</key>
                <point_f>0.5,0.5</point_f>
                <key>spriteScale</key>
                <double>1</double>
                <key>scale9Enabled</key>
                <false/>
                <key>scale9Borders</key>
                <rect>74,15,148,30</rect>
                <key>scale9Paddings</key>
                <rect>74,15,148,30</rect>
                <key>scale9FromFile</key>
                <false/>
            </struct>
            <key type="filename">enemies/red_clock_back_large_red.png</key>
            <struct type="IndividualSpriteSettings">
                <key>pivotPoint</key>
                <point_f>0.5,0.5</point_f>
                <key>spriteScale</key>
                <double>1</double>
                <key>scale9Enabled</key>
                <false/>
                <key>scale9Borders</key>
                <rect>170,170,339,339</rect>
                <key>scale9Paddings</key>
                <rect>170,170,339,339</rect>
                <key>scale9FromFile</key>
                <false/>
            </struct>
            <key type="filename">enemies/robot0.png</key>
            <struct type="IndividualSpriteSettings">
                <key>pivotPoint</key>
                <point_f>0.5,0.5</point_f>
                <key>spriteScale</key>
                <double>0.625</double>
                <key>scale9Enabled</key>
                <false/>
                <key>scale9Borders</key>
                <rect>125,121,250,242</rect>
                <key>scale9Paddings</key>
                <rect>125,121,250,242</rect>
                <key>scale9FromFile</key>
                <false/>
            </struct>
            <key type="filename">enemies/robot1.png</key>
            <struct type="IndividualSpriteSettings">
                <key>pivotPoint</key>
                <point_f>0.5,0.5</point_f>
                <key>spriteScale</key>
                <double>0.6</double>
                <key>scale9Enabled</key>
                <false/>
                <key>scale9Borders</key>
                <rect>125,121,250,242</rect>
                <key>scale9Paddings</key>
                <rect>125,121,250,242</rect>
                <key>scale9FromFile</key>
                <false/>
            </struct>
            <key type="filename">enemies/robot2.png</key>
            <struct type="IndividualSpriteSettings">
                <key>pivotPoint</key>
                <point_f>0.5,0.5</point_f>
                <key>spriteScale</key>
                <double>0.6</double>
                <key>scale9Enabled</key>
                <false/>
                <key>scale9Borders</key>
                <rect>125,125,250,250</rect>
                <key>scale9Paddings</key>
                <rect>125,125,250,250</rect>
                <key>scale9FromFile</key>
                <false/>
            </struct>
            <key type="filename">enemies/robot_blast.png</key>
            <struct type="IndividualSpriteSettings">
                <key>pivotPoint</key>
                <point_f>0.5,0.5</point_f>
                <key>spriteScale</key>
                <double>1</double>
                <key>scale9Enabled</key>
                <false/>
                <key>scale9Borders</key>
                <rect>133,105,265,210</rect>
                <key>scale9Paddings</key>
                <rect>133,105,265,210</rect>
                <key>scale9FromFile</key>
                <false/>
            </struct>
            <key type="filename">enemies/robot_blast_small1.png</key>
            <key type="filename">enemies/robot_blast_small2.png</key>
            <struct type="IndividualSpriteSettings">
                <key>pivotPoint</key>
                <point_f>0.5,0.5</point_f>
                <key>spriteScale</key>
                <double>1</double>
                <key>scale9Enabled</key>
                <false/>
                <key>scale9Borders</key>
                <rect>53,43,107,85</rect>
                <key>scale9Paddings</key>
                <rect>53,43,107,85</rect>
                <key>scale9FromFile</key>
                <false/>
            </struct>
            <key type="filename">enemies/robot_blush.png</key>
            <key type="filename">enemies/roboteye.png</key>
            <struct type="IndividualSpriteSettings">
                <key>pivotPoint</key>
                <point_f>0.5,0.5</point_f>
                <key>spriteScale</key>
                <double>1</double>
                <key>scale9Enabled</key>
                <false/>
                <key>scale9Borders</key>
                <rect>125,121,250,242</rect>
                <key>scale9Paddings</key>
                <rect>125,121,250,242</rect>
                <key>scale9FromFile</key>
                <false/>
            </struct>
            <key type="filename">enemies/robot_broken.png</key>
            <struct type="IndividualSpriteSettings">
                <key>pivotPoint</key>
                <point_f>0.5,0.5</point_f>
                <key>spriteScale</key>
                <double>0.57</double>
                <key>scale9Enabled</key>
                <false/>
                <key>scale9Borders</key>
                <rect>143,138,285,275</rect>
                <key>scale9Paddings</key>
                <rect>143,138,285,275</rect>
                <key>scale9FromFile</key>
                <false/>
            </struct>
            <key type="filename">enemies/robot_charge.png</key>
            <struct type="IndividualSpriteSettings">
                <key>pivotPoint</key>
                <point_f>0.5,0.5</point_f>
                <key>spriteScale</key>
                <double>1</double>
                <key>scale9Enabled</key>
                <false/>
                <key>scale9Borders</key>
                <rect>75,75,150,150</rect>
                <key>scale9Paddings</key>
                <rect>75,75,150,150</rect>
                <key>scale9FromFile</key>
                <false/>
            </struct>
            <key type="filename">enemies/robot_claw_1.png</key>
            <key type="filename">enemies/robot_claw_2.png</key>
            <key type="filename">enemies/robot_claw_b1.png</key>
            <key type="filename">enemies/robot_claw_b2.png</key>
            <struct type="IndividualSpriteSettings">
                <key>pivotPoint</key>
                <point_f>0.5,0.5</point_f>
                <key>spriteScale</key>
                <double>0.64</double>
                <key>scale9Enabled</key>
                <false/>
                <key>scale9Borders</key>
                <rect>154,137,309,275</rect>
                <key>scale9Paddings</key>
                <rect>154,137,309,275</rect>
                <key>scale9FromFile</key>
                <false/>
            </struct>
            <key type="filename">enemies/robot_dead.png</key>
            <struct type="IndividualSpriteSettings">
                <key>pivotPoint</key>
                <point_f>0.5,0.5</point_f>
                <key>spriteScale</key>
                <double>0.625</double>
                <key>scale9Enabled</key>
                <false/>
                <key>scale9Borders</key>
                <rect>68,36,136,71</rect>
                <key>scale9Paddings</key>
                <rect>68,36,136,71</rect>
                <key>scale9FromFile</key>
                <false/>
            </struct>
            <key type="filename">enemies/robot_dead_left.png</key>
            <struct type="IndividualSpriteSettings">
                <key>pivotPoint</key>
                <point_f>0.5,0.5</point_f>
                <key>spriteScale</key>
                <double>0.625</double>
                <key>scale9Enabled</key>
                <false/>
                <key>scale9Borders</key>
                <rect>57,50,113,100</rect>
                <key>scale9Paddings</key>
                <rect>57,50,113,100</rect>
                <key>scale9FromFile</key>
                <false/>
            </struct>
            <key type="filename">enemies/robot_dead_right.png</key>
            <struct type="IndividualSpriteSettings">
                <key>pivotPoint</key>
                <point_f>0.5,0.5</point_f>
                <key>spriteScale</key>
                <double>0.625</double>
                <key>scale9Enabled</key>
                <false/>
                <key>scale9Borders</key>
                <rect>60,49,120,98</rect>
                <key>scale9Paddings</key>
                <rect>60,49,120,98</rect>
                <key>scale9FromFile</key>
                <false/>
            </struct>
            <key type="filename">enemies/robot_energy1.png</key>
            <key type="filename">enemies/robot_energy2.png</key>
            <key type="filename">enemies/robot_energy3.png</key>
            <struct type="IndividualSpriteSettings">
                <key>pivotPoint</key>
                <point_f>0.5,0.5</point_f>
                <key>spriteScale</key>
                <double>0.37</double>
                <key>scale9Enabled</key>
                <false/>
                <key>scale9Borders</key>
                <rect>205,149,409,299</rect>
                <key>scale9Paddings</key>
                <rect>205,149,409,299</rect>
                <key>scale9FromFile</key>
                <false/>
            </struct>
            <key type="filename">enemies/robot_fire_1.png</key>
            <key type="filename">enemies/robot_fire_2.png</key>
            <struct type="IndividualSpriteSettings">
                <key>pivotPoint</key>
                <point_f>0.5,0.5</point_f>
                <key>spriteScale</key>
                <double>0.625</double>
                <key>scale9Enabled</key>
                <false/>
                <key>scale9Borders</key>
                <rect>162,68,323,136</rect>
                <key>scale9Paddings</key>
                <rect>162,68,323,136</rect>
                <key>scale9FromFile</key>
                <false/>
            </struct>
            <key type="filename">enemies/robot_flutter.png</key>
            <struct type="IndividualSpriteSettings">
                <key>pivotPoint</key>
                <point_f>0.5,0.5</point_f>
                <key>spriteScale</key>
                <double>0.7</double>
                <key>scale9Enabled</key>
                <false/>
                <key>scale9Borders</key>
                <rect>153,136,305,272</rect>
                <key>scale9Paddings</key>
                <rect>153,136,305,272</rect>
                <key>scale9FromFile</key>
                <false/>
            </struct>
            <key type="filename">enemies/robot_heart.png</key>
            <struct type="IndividualSpriteSettings">
                <key>pivotPoint</key>
                <point_f>0.5,0.5</point_f>
                <key>spriteScale</key>
                <double>0.6</double>
                <key>scale9Enabled</key>
                <false/>
                <key>scale9Borders</key>
                <rect>130,145,260,289</rect>
                <key>scale9Paddings</key>
                <rect>130,145,260,289</rect>
                <key>scale9FromFile</key>
                <false/>
            </struct>
            <key type="filename">enemies/robot_hide.png</key>
            <struct type="IndividualSpriteSettings">
                <key>pivotPoint</key>
                <point_f>0.5,0.5</point_f>
                <key>spriteScale</key>
                <double>0.55</double>
                <key>scale9Enabled</key>
                <false/>
                <key>scale9Borders</key>
                <rect>84,88,167,175</rect>
                <key>scale9Paddings</key>
                <rect>84,88,167,175</rect>
                <key>scale9FromFile</key>
                <false/>
            </struct>
            <key type="filename">enemies/robot_hide_2.png</key>
            <struct type="IndividualSpriteSettings">
                <key>pivotPoint</key>
                <point_f>0.5,0.5</point_f>
                <key>spriteScale</key>
                <double>0.55</double>
                <key>scale9Enabled</key>
                <false/>
                <key>scale9Borders</key>
                <rect>85,88,171,176</rect>
                <key>scale9Paddings</key>
                <rect>85,88,171,176</rect>
                <key>scale9FromFile</key>
                <false/>
            </struct>
            <key type="filename">enemies/robot_laser.png</key>
            <struct type="IndividualSpriteSettings">
                <key>pivotPoint</key>
                <point_f>0.5,0.5</point_f>
                <key>spriteScale</key>
                <double>0.59</double>
                <key>scale9Enabled</key>
                <false/>
                <key>scale9Borders</key>
                <rect>144,121,287,242</rect>
                <key>scale9Paddings</key>
                <rect>144,121,287,242</rect>
                <key>scale9FromFile</key>
                <false/>
            </struct>
            <key type="filename">enemies/robot_laser_fire.png</key>
            <struct type="IndividualSpriteSettings">
                <key>pivotPoint</key>
                <point_f>0.5,0.5</point_f>
                <key>spriteScale</key>
                <double>1</double>
                <key>scale9Enabled</key>
                <false/>
                <key>scale9Borders</key>
                <rect>75,118,150,235</rect>
                <key>scale9Paddings</key>
                <rect>75,118,150,235</rect>
                <key>scale9FromFile</key>
                <false/>
            </struct>
            <key type="filename">enemies/robot_matter.png</key>
            <struct type="IndividualSpriteSettings">
                <key>pivotPoint</key>
                <point_f>0.5,0.5</point_f>
                <key>spriteScale</key>
                <double>0.59</double>
                <key>scale9Enabled</key>
                <false/>
                <key>scale9Borders</key>
                <rect>143,138,285,275</rect>
                <key>scale9Paddings</key>
                <rect>143,138,285,275</rect>
                <key>scale9FromFile</key>
                <false/>
            </struct>
            <key type="filename">enemies/robot_shoot.png</key>
            <struct type="IndividualSpriteSettings">
                <key>pivotPoint</key>
                <point_f>0.5,0.5</point_f>
                <key>spriteScale</key>
                <double>0.65</double>
                <key>scale9Enabled</key>
                <false/>
                <key>scale9Borders</key>
                <rect>151,91,301,182</rect>
                <key>scale9Paddings</key>
                <rect>151,91,301,182</rect>
                <key>scale9FromFile</key>
                <false/>
            </struct>
            <key type="filename">enemies/robot_time1.png</key>
            <key type="filename">enemies/robot_time2.png</key>
            <struct type="IndividualSpriteSettings">
                <key>pivotPoint</key>
                <point_f>0.5,0.5</point_f>
                <key>spriteScale</key>
                <double>0.59</double>
                <key>scale9Enabled</key>
                <false/>
                <key>scale9Borders</key>
                <rect>125,125,250,250</rect>
                <key>scale9Paddings</key>
                <rect>125,125,250,250</rect>
                <key>scale9FromFile</key>
                <false/>
            </struct>
            <key type="filename">enemies/robot_void.png</key>
            <struct type="IndividualSpriteSettings">
                <key>pivotPoint</key>
                <point_f>0.5,0.5</point_f>
                <key>spriteScale</key>
                <double>0.58</double>
                <key>scale9Enabled</key>
                <false/>
                <key>scale9Borders</key>
                <rect>125,125,250,250</rect>
                <key>scale9Paddings</key>
                <rect>125,125,250,250</rect>
                <key>scale9FromFile</key>
                <false/>
            </struct>
            <key type="filename">enemies/thorns.png</key>
            <struct type="IndividualSpriteSettings">
                <key>pivotPoint</key>
                <point_f>0.5,0.5</point_f>
                <key>spriteScale</key>
                <double>1</double>
                <key>scale9Enabled</key>
                <false/>
                <key>scale9Borders</key>
                <rect>55,24,110,48</rect>
                <key>scale9Paddings</key>
                <rect>55,24,110,48</rect>
                <key>scale9FromFile</key>
                <false/>
            </struct>
            <key type="filename">enemies/thorns2.png</key>
            <struct type="IndividualSpriteSettings">
                <key>pivotPoint</key>
                <point_f>0.5,0.5</point_f>
                <key>spriteScale</key>
                <double>1</double>
                <key>scale9Enabled</key>
                <false/>
                <key>scale9Borders</key>
                <rect>138,63,275,125</rect>
                <key>scale9Paddings</key>
                <rect>138,63,275,125</rect>
                <key>scale9FromFile</key>
                <false/>
            </struct>
            <key type="filename">enemies/time_magi.png</key>
            <struct type="IndividualSpriteSettings">
                <key>pivotPoint</key>
                <point_f>0.5,0.5</point_f>
                <key>spriteScale</key>
                <double>0.75</double>
                <key>scale9Enabled</key>
                <false/>
                <key>scale9Borders</key>
                <rect>80,80,160,160</rect>
                <key>scale9Paddings</key>
                <rect>80,80,160,160</rect>
                <key>scale9FromFile</key>
                <false/>
            </struct>
            <key type="filename">enemies/time_magi_cast.png</key>
            <struct type="IndividualSpriteSettings">
                <key>pivotPoint</key>
                <point_f>0.5,0.5</point_f>
                <key>spriteScale</key>
                <double>0.8</double>
                <key>scale9Enabled</key>
                <false/>
                <key>scale9Borders</key>
                <rect>80,80,160,160</rect>
                <key>scale9Paddings</key>
                <rect>80,80,160,160</rect>
                <key>scale9FromFile</key>
                <false/>
            </struct>
            <key type="filename">enemies/time_magi_cast_big.png</key>
            <struct type="IndividualSpriteSettings">
                <key>pivotPoint</key>
                <point_f>0.5,0.5</point_f>
                <key>spriteScale</key>
                <double>0.8</double>
                <key>scale9Enabled</key>
                <false/>
                <key>scale9Borders</key>
                <rect>78,100,155,200</rect>
                <key>scale9Paddings</key>
                <rect>78,100,155,200</rect>
                <key>scale9FromFile</key>
                <false/>
            </struct>
            <key type="filename">enemies/time_magi_fade.png</key>
            <struct type="IndividualSpriteSettings">
                <key>pivotPoint</key>
                <point_f>0.5,0.5</point_f>
                <key>spriteScale</key>
                <double>0.72</double>
                <key>scale9Enabled</key>
                <false/>
                <key>scale9Borders</key>
                <rect>78,100,155,200</rect>
                <key>scale9Paddings</key>
                <rect>78,100,155,200</rect>
                <key>scale9FromFile</key>
                <false/>
            </struct>
            <key type="filename">enemies/time_magi_flattened.png</key>
            <struct type="IndividualSpriteSettings">
                <key>pivotPoint</key>
                <point_f>0.5,0.5</point_f>
                <key>spriteScale</key>
                <double>0.75</double>
                <key>scale9Enabled</key>
                <false/>
                <key>scale9Borders</key>
                <rect>78,100,155,200</rect>
                <key>scale9Paddings</key>
                <rect>78,100,155,200</rect>
                <key>scale9FromFile</key>
                <false/>
            </struct>
            <key type="filename">enemies/time_magi_nervous.png</key>
            <struct type="IndividualSpriteSettings">
                <key>pivotPoint</key>
                <point_f>0.5,0.5</point_f>
                <key>spriteScale</key>
                <double>0.76</double>
                <key>scale9Enabled</key>
                <false/>
                <key>scale9Borders</key>
                <rect>80,80,160,160</rect>
                <key>scale9Paddings</key>
                <rect>80,80,160,160</rect>
                <key>scale9FromFile</key>
                <false/>
            </struct>
            <key type="filename">enemies/time_magi_shock1.png</key>
            <key type="filename">enemies/time_magi_shock2.png</key>
            <struct type="IndividualSpriteSettings">
                <key>pivotPoint</key>
                <point_f>0.5,0.5</point_f>
                <key>spriteScale</key>
                <double>0.74</double>
                <key>scale9Enabled</key>
                <false/>
                <key>scale9Borders</key>
                <rect>88,150,175,300</rect>
                <key>scale9Paddings</key>
                <rect>88,150,175,300</rect>
                <key>scale9FromFile</key>
                <false/>
            </struct>
            <key type="filename">enemies/time_magi_terrified.png</key>
            <struct type="IndividualSpriteSettings">
                <key>pivotPoint</key>
                <point_f>0.5,0.5</point_f>
                <key>spriteScale</key>
                <double>0.73</double>
                <key>scale9Enabled</key>
                <false/>
                <key>scale9Borders</key>
                <rect>78,100,155,200</rect>
                <key>scale9Paddings</key>
                <rect>78,100,155,200</rect>
                <key>scale9FromFile</key>
                <false/>
            </struct>
            <key type="filename">enemies/tree.png</key>
            <struct type="IndividualSpriteSettings">
                <key>pivotPoint</key>
                <point_f>0.5,0.5</point_f>
                <key>spriteScale</key>
                <double>0.8</double>
                <key>scale9Enabled</key>
                <false/>
                <key>scale9Borders</key>
                <rect>100,100,200,200</rect>
                <key>scale9Paddings</key>
                <rect>100,100,200,200</rect>
                <key>scale9FromFile</key>
                <false/>
            </struct>
            <key type="filename">enemies/tree_branch.webp</key>
            <struct type="IndividualSpriteSettings">
                <key>pivotPoint</key>
                <point_f>0.5,0.5</point_f>
                <key>spriteScale</key>
                <double>1</double>
                <key>scale9Enabled</key>
                <false/>
                <key>scale9Borders</key>
                <rect>63,40,125,80</rect>
                <key>scale9Paddings</key>
                <rect>63,40,125,80</rect>
                <key>scale9FromFile</key>
                <false/>
            </struct>
            <key type="filename">enemies/tree_eye.png</key>
            <struct type="IndividualSpriteSettings">
                <key>pivotPoint</key>
                <point_f>0.5,0.5</point_f>
                <key>spriteScale</key>
                <double>0.8</double>
                <key>scale9Enabled</key>
                <false/>
                <key>scale9Borders</key>
                <rect>8,23,15,45</rect>
                <key>scale9Paddings</key>
                <rect>8,23,15,45</rect>
                <key>scale9FromFile</key>
                <false/>
            </struct>
            <key type="filename">enemies/tree_leaf.webp</key>
            <struct type="IndividualSpriteSettings">
                <key>pivotPoint</key>
                <point_f>0.5,0.5</point_f>
                <key>spriteScale</key>
                <double>1</double>
                <key>scale9Enabled</key>
                <false/>
                <key>scale9Borders</key>
                <rect>10,25,20,50</rect>
                <key>scale9Paddings</key>
                <rect>10,25,20,50</rect>
                <key>scale9FromFile</key>
                <false/>
            </struct>
            <key type="filename">enemies/tree_open.png</key>
            <struct type="IndividualSpriteSettings">
                <key>pivotPoint</key>
                <point_f>0.5,0.5</point_f>
                <key>spriteScale</key>
                <double>0.8</double>
                <key>scale9Enabled</key>
                <false/>
                <key>scale9Borders</key>
                <rect>155,123,311,246</rect>
                <key>scale9Paddings</key>
                <rect>155,123,311,246</rect>
                <key>scale9FromFile</key>
                <false/>
            </struct>
            <key type="filename">enemies/tree_shock1.png</key>
            <key type="filename">enemies/tree_shock2.png</key>
            <struct type="IndividualSpriteSettings">
                <key>pivotPoint</key>
                <point_f>0.5,0.5</point_f>
                <key>spriteScale</key>
                <double>0.3334</double>
                <key>scale9Enabled</key>
                <false/>
                <key>scale9Borders</key>
                <rect>223,133,445,265</rect>
                <key>scale9Paddings</key>
                <rect>223,133,445,265</rect>
                <key>scale9FromFile</key>
                <false/>
            </struct>
            <key type="filename">enemies/tree_stumped.png</key>
            <key type="filename">enemies/tree_top.png</key>
            <struct type="IndividualSpriteSettings">
                <key>pivotPoint</key>
                <point_f>0.5,0.5</point_f>
                <key>spriteScale</key>
                <double>0.8</double>
                <key>scale9Enabled</key>
                <false/>
                <key>scale9Borders</key>
                <rect>155,128,311,255</rect>
                <key>scale9Paddings</key>
                <rect>155,128,311,255</rect>
                <key>scale9FromFile</key>
                <false/>
            </struct>
            <key type="filename">enemies/void_knight.png</key>
            <struct type="IndividualSpriteSettings">
                <key>pivotPoint</key>
                <point_f>0.5,0.5</point_f>
                <key>spriteScale</key>
                <double>0.54</double>
                <key>scale9Enabled</key>
                <false/>
                <key>scale9Borders</key>
                <rect>94,109,189,217</rect>
                <key>scale9Paddings</key>
                <rect>94,109,189,217</rect>
                <key>scale9FromFile</key>
                <false/>
            </struct>
            <key type="filename">enemies/void_knight_2.png</key>
            <struct type="IndividualSpriteSettings">
                <key>pivotPoint</key>
                <point_f>0.5,0.5</point_f>
                <key>spriteScale</key>
                <double>0.5</double>
                <key>scale9Enabled</key>
                <false/>
                <key>scale9Borders</key>
                <rect>223,183,445,365</rect>
                <key>scale9Paddings</key>
                <rect>223,183,445,365</rect>
                <key>scale9FromFile</key>
                <false/>
            </struct>
            <key type="filename">enemies/void_knight_3.png</key>
            <struct type="IndividualSpriteSettings">
                <key>pivotPoint</key>
                <point_f>0.5,0.5</point_f>
                <key>spriteScale</key>
                <double>0.5</double>
                <key>scale9Enabled</key>
                <false/>
                <key>scale9Borders</key>
                <rect>185,170,370,340</rect>
                <key>scale9Paddings</key>
                <rect>185,170,370,340</rect>
                <key>scale9FromFile</key>
                <false/>
            </struct>
            <key type="filename">enemies/void_knight_3_empty.png</key>
            <key type="filename">enemies/void_knight_3_legs.png</key>
            <key type="filename">enemies/void_knight_3_torso.png</key>
            <key type="filename">enemies/void_knight_tent_1_back.png</key>
            <key type="filename">enemies/void_knight_tent_1_front.png</key>
            <struct type="IndividualSpriteSettings">
                <key>pivotPoint</key>
                <point_f>0.5,0.5</point_f>
                <key>spriteScale</key>
                <double>0.5</double>
                <key>scale9Enabled</key>
                <false/>
                <key>scale9Borders</key>
                <rect>183,163,365,325</rect>
                <key>scale9Paddings</key>
                <rect>183,163,365,325</rect>
                <key>scale9FromFile</key>
                <false/>
            </struct>
            <key type="filename">enemies/void_knight_arm.png</key>
            <key type="filename">enemies/void_knight_injured.png</key>
            <struct type="IndividualSpriteSettings">
                <key>pivotPoint</key>
                <point_f>0.5,0.5</point_f>
                <key>spriteScale</key>
                <double>0.5</double>
                <key>scale9Enabled</key>
                <false/>
                <key>scale9Borders</key>
                <rect>108,123,215,245</rect>
                <key>scale9Paddings</key>
                <rect>108,123,215,245</rect>
                <key>scale9FromFile</key>
                <false/>
            </struct>
            <key type="filename">enemies/void_knight_attack.png</key>
            <struct type="IndividualSpriteSettings">
                <key>pivotPoint</key>
                <point_f>0.5,0.5</point_f>
                <key>spriteScale</key>
                <double>0.54</double>
                <key>scale9Enabled</key>
                <false/>
                <key>scale9Borders</key>
                <rect>200,193,400,385</rect>
                <key>scale9Paddings</key>
                <rect>200,193,400,385</rect>
                <key>scale9FromFile</key>
                <false/>
            </struct>
            <key type="filename">enemies/void_knight_dazed.png</key>
            <struct type="IndividualSpriteSettings">
                <key>pivotPoint</key>
                <point_f>0.5,0.5</point_f>
                <key>spriteScale</key>
                <double>0.52</double>
                <key>scale9Enabled</key>
                <false/>
                <key>scale9Borders</key>
                <rect>113,138,225,275</rect>
                <key>scale9Paddings</key>
                <rect>113,138,225,275</rect>
                <key>scale9FromFile</key>
                <false/>
            </struct>
            <key type="filename">enemies/void_knight_died.png</key>
            <struct type="IndividualSpriteSettings">
                <key>pivotPoint</key>
                <point_f>0.5,0.5</point_f>
                <key>spriteScale</key>
                <double>0.5</double>
                <key>scale9Enabled</key>
                <false/>
                <key>scale9Borders</key>
                <rect>143,183,285,365</rect>
                <key>scale9Paddings</key>
                <rect>143,183,285,365</rect>
                <key>scale9FromFile</key>
                <false/>
            </struct>
            <key type="filename">enemies/void_knight_fog.png</key>
            <struct type="IndividualSpriteSettings">
                <key>pivotPoint</key>
                <point_f>0.5,0.5</point_f>
                <key>spriteScale</key>
                <double>0.54</double>
                <key>scale9Enabled</key>
                <false/>
                <key>scale9Borders</key>
                <rect>100,125,200,250</rect>
                <key>scale9Paddings</key>
                <rect>100,125,200,250</rect>
                <key>scale9FromFile</key>
                <false/>
            </struct>
            <key type="filename">enemies/void_knight_helmet.png</key>
            <struct type="IndividualSpriteSettings">
                <key>pivotPoint</key>
                <point_f>0.5,0.5</point_f>
                <key>spriteScale</key>
                <double>0.5</double>
                <key>scale9Enabled</key>
                <false/>
                <key>scale9Borders</key>
                <rect>42,33,84,66</rect>
                <key>scale9Paddings</key>
                <rect>42,33,84,66</rect>
                <key>scale9FromFile</key>
                <false/>
            </struct>
            <key type="filename">enemies/void_knight_pullback.png</key>
            <struct type="IndividualSpriteSettings">
                <key>pivotPoint</key>
                <point_f>0.5,0.5</point_f>
                <key>spriteScale</key>
                <double>0.54</double>
                <key>scale9Enabled</key>
                <false/>
                <key>scale9Borders</key>
                <rect>125,155,250,310</rect>
                <key>scale9Paddings</key>
                <rect>125,155,250,310</rect>
                <key>scale9FromFile</key>
                <false/>
            </struct>
            <key type="filename">enemies/void_knight_shield_2.png</key>
            <struct type="IndividualSpriteSettings">
                <key>pivotPoint</key>
                <point_f>0.5,0.5</point_f>
                <key>spriteScale</key>
                <double>0.5</double>
                <key>scale9Enabled</key>
                <false/>
                <key>scale9Borders</key>
                <rect>125,128,250,255</rect>
                <key>scale9Paddings</key>
                <rect>125,128,250,255</rect>
                <key>scale9FromFile</key>
                <false/>
            </struct>
            <key type="filename">enemies/void_knight_sigil.png</key>
            <struct type="IndividualSpriteSettings">
                <key>pivotPoint</key>
                <point_f>0.5,0.5</point_f>
                <key>spriteScale</key>
                <double>0.54</double>
                <key>scale9Enabled</key>
                <false/>
                <key>scale9Borders</key>
                <rect>100,123,200,245</rect>
                <key>scale9Paddings</key>
                <rect>100,123,200,245</rect>
                <key>scale9FromFile</key>
                <false/>
            </struct>
            <key type="filename">enemies/void_knight_sigil2.png</key>
            <struct type="IndividualSpriteSettings">
                <key>pivotPoint</key>
                <point_f>0.5,0.5</point_f>
                <key>spriteScale</key>
                <double>0.5</double>
                <key>scale9Enabled</key>
                <false/>
                <key>scale9Borders</key>
                <rect>100,123,200,245</rect>
                <key>scale9Paddings</key>
                <rect>100,123,200,245</rect>
                <key>scale9FromFile</key>
                <false/>
            </struct>
            <key type="filename">enemies/void_knight_tent_1_front_spike.png</key>
            <struct type="IndividualSpriteSettings">
                <key>pivotPoint</key>
                <point_f>0.5,0.5</point_f>
                <key>spriteScale</key>
                <double>0.5</double>
                <key>scale9Enabled</key>
                <false/>
                <key>scale9Borders</key>
                <rect>183,213,365,425</rect>
                <key>scale9Paddings</key>
                <rect>183,213,365,425</rect>
                <key>scale9FromFile</key>
                <false/>
            </struct>
            <key type="filename">enemies/void_shock.png</key>
            <struct type="IndividualSpriteSettings">
                <key>pivotPoint</key>
                <point_f>0.5,0.5</point_f>
                <key>spriteScale</key>
                <double>0.5</double>
                <key>scale9Enabled</key>
                <false/>
                <key>scale9Borders</key>
                <rect>208,156,415,311</rect>
                <key>scale9Paddings</key>
                <rect>208,156,415,311</rect>
                <key>scale9FromFile</key>
                <false/>
            </struct>
            <key type="filename">enemies/void_tentacle_eye.png</key>
            <struct type="IndividualSpriteSettings">
                <key>pivotPoint</key>
                <point_f>0.5,0.5</point_f>
                <key>spriteScale</key>
                <double>0.5</double>
                <key>scale9Enabled</key>
                <false/>
                <key>scale9Borders</key>
                <rect>58,82,115,163</rect>
                <key>scale9Paddings</key>
                <rect>58,82,115,163</rect>
                <key>scale9FromFile</key>
                <false/>
            </struct>
            <key type="filename">enemies/warning.png</key>
            <struct type="IndividualSpriteSettings">
                <key>pivotPoint</key>
                <point_f>0.5,0.5</point_f>
                <key>spriteScale</key>
                <double>1</double>
                <key>scale9Enabled</key>
                <false/>
                <key>scale9Borders</key>
                <rect>2,50,3,100</rect>
                <key>scale9Paddings</key>
                <rect>2,50,3,100</rect>
                <key>scale9FromFile</key>
                <false/>
            </struct>
        </map>
        <key>fileLists</key>
        <map type="SpriteSheetMap">
            <key>default</key>
            <struct type="SpriteSheet">
                <key>files</key>
                <array>
                    <filename>enemies</filename>
                </array>
            </struct>
        </map>
        <key>ignoreFileList</key>
        <array/>
        <key>replaceList</key>
        <array/>
        <key>ignoredWarnings</key>
        <array/>
        <key>commonDivisorX</key>
        <uint>1</uint>
        <key>commonDivisorY</key>
        <uint>1</uint>
        <key>packNormalMaps</key>
        <false/>
        <key>autodetectNormalMaps</key>
        <true/>
        <key>normalMapFilter</key>
        <string></string>
        <key>normalMapSuffix</key>
        <string></string>
        <key>normalMapSheetFileName</key>
        <filename></filename>
        <key>exporterProperties</key>
        <map type="ExporterProperties"/>
    </struct>
</data>
