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
        <uint>101</uint>
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
            <uint>1</uint>
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
            <key type="filename">enemies/angry1.png</key>
            <key type="filename">enemies/angry2.png</key>
            <struct type="IndividualSpriteSettings">
                <key>pivotPoint</key>
                <point_f>0.5,0.5</point_f>
                <key>spriteScale</key>
                <double>1</double>
                <key>scale9Enabled</key>
                <false/>
                <key>scale9Borders</key>
                <rect>13,13,25,25</rect>
                <key>scale9Paddings</key>
                <rect>13,13,25,25</rect>
                <key>scale9FromFile</key>
                <false/>
            </struct>
            <key type="filename">enemies/bone1.png</key>
            <key type="filename">enemies/bone2.png</key>
            <struct type="IndividualSpriteSettings">
                <key>pivotPoint</key>
                <point_f>0.5,0.5</point_f>
                <key>spriteScale</key>
                <double>1</double>
                <key>scale9Enabled</key>
                <false/>
                <key>scale9Borders</key>
                <rect>12,12,24,23</rect>
                <key>scale9Paddings</key>
                <rect>12,12,24,23</rect>
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
            <key type="filename">enemies/dummy.png</key>
            <key type="filename">enemies/dummybrows.png</key>
            <key type="filename">enemies/tree.png</key>
            <struct type="IndividualSpriteSettings">
                <key>pivotPoint</key>
                <point_f>0.5,0.5</point_f>
                <key>spriteScale</key>
                <double>1</double>
                <key>scale9Enabled</key>
                <false/>
                <key>scale9Borders</key>
                <rect>100,100,200,200</rect>
                <key>scale9Paddings</key>
                <rect>100,100,200,200</rect>
                <key>scale9FromFile</key>
                <false/>
            </struct>
            <key type="filename">enemies/dummy_angry.png</key>
            <key type="filename">enemies/dummy_w_eyes.png</key>
            <key type="filename">enemies/lesser_dummy.png</key>
            <key type="filename">enemies/lesser_dummy_headless.png</key>
            <struct type="IndividualSpriteSettings">
                <key>pivotPoint</key>
                <point_f>0.5,0.5</point_f>
                <key>spriteScale</key>
                <double>1</double>
                <key>scale9Enabled</key>
                <false/>
                <key>scale9Borders</key>
                <rect>49,73,97,145</rect>
                <key>scale9Paddings</key>
                <rect>49,73,97,145</rect>
                <key>scale9FromFile</key>
                <false/>
            </struct>
            <key type="filename">enemies/dummy_broken.png</key>
            <struct type="IndividualSpriteSettings">
                <key>pivotPoint</key>
                <point_f>0.5,0.5</point_f>
                <key>spriteScale</key>
                <double>0.98</double>
                <key>scale9Enabled</key>
                <false/>
                <key>scale9Borders</key>
                <rect>75,75,150,150</rect>
                <key>scale9Paddings</key>
                <rect>75,75,150,150</rect>
                <key>scale9FromFile</key>
                <false/>
            </struct>
            <key type="filename">enemies/dummyeyes.png</key>
            <struct type="IndividualSpriteSettings">
                <key>pivotPoint</key>
                <point_f>0.5,0.5</point_f>
                <key>spriteScale</key>
                <double>1</double>
                <key>scale9Enabled</key>
                <false/>
                <key>scale9Borders</key>
                <rect>21,9,43,19</rect>
                <key>scale9Paddings</key>
                <rect>21,9,43,19</rect>
                <key>scale9FromFile</key>
                <false/>
            </struct>
            <key type="filename">enemies/dummysnort.png</key>
            <struct type="IndividualSpriteSettings">
                <key>pivotPoint</key>
                <point_f>0.5,0.5</point_f>
                <key>spriteScale</key>
                <double>1</double>
                <key>scale9Enabled</key>
                <false/>
                <key>scale9Borders</key>
                <rect>44,23,88,45</rect>
                <key>scale9Paddings</key>
                <rect>44,23,88,45</rect>
                <key>scale9FromFile</key>
                <false/>
            </struct>
            <key type="filename">enemies/exclamation.png</key>
            <struct type="IndividualSpriteSettings">
                <key>pivotPoint</key>
                <point_f>0.5,0.5</point_f>
                <key>spriteScale</key>
                <double>1</double>
                <key>scale9Enabled</key>
                <false/>
                <key>scale9Borders</key>
                <rect>12,12,23,23</rect>
                <key>scale9Paddings</key>
                <rect>12,12,23,23</rect>
                <key>scale9FromFile</key>
                <false/>
            </struct>
            <key type="filename">enemies/exclamation1.png</key>
            <key type="filename">enemies/exclamation2.png</key>
            <struct type="IndividualSpriteSettings">
                <key>pivotPoint</key>
                <point_f>0.5,0.5</point_f>
                <key>spriteScale</key>
                <double>1</double>
                <key>scale9Enabled</key>
                <false/>
                <key>scale9Borders</key>
                <rect>5,10,9,20</rect>
                <key>scale9Paddings</key>
                <rect>5,10,9,20</rect>
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
            <key type="filename">enemies/gobbo0.png</key>
            <key type="filename">enemies/gobbo1.png</key>
            <key type="filename">enemies/gobbo2.png</key>
            <key type="filename">enemies/gobbo3.png</key>
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
            <key type="filename">enemies/gobbo0_atk.png</key>
            <struct type="IndividualSpriteSettings">
                <key>pivotPoint</key>
                <point_f>0.5,0.5</point_f>
                <key>spriteScale</key>
                <double>1</double>
                <key>scale9Enabled</key>
                <false/>
                <key>scale9Borders</key>
                <rect>113,89,225,177</rect>
                <key>scale9Paddings</key>
                <rect>113,89,225,177</rect>
                <key>scale9FromFile</key>
                <false/>
            </struct>
            <key type="filename">enemies/gobbo1_alt.png</key>
            <struct type="IndividualSpriteSettings">
                <key>pivotPoint</key>
                <point_f>0.5,0.5</point_f>
                <key>spriteScale</key>
                <double>1</double>
                <key>scale9Enabled</key>
                <false/>
                <key>scale9Borders</key>
                <rect>76,81,151,161</rect>
                <key>scale9Paddings</key>
                <rect>76,81,151,161</rect>
                <key>scale9FromFile</key>
                <false/>
            </struct>
            <key type="filename">enemies/gobbo4.png</key>
            <struct type="IndividualSpriteSettings">
                <key>pivotPoint</key>
                <point_f>0.5,0.5</point_f>
                <key>spriteScale</key>
                <double>0.8</double>
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
            <key type="filename">enemies/gobboAttack1.png</key>
            <key type="filename">enemies/gobboAttack2.png</key>
            <struct type="IndividualSpriteSettings">
                <key>pivotPoint</key>
                <point_f>0.5,0.5</point_f>
                <key>spriteScale</key>
                <double>0.8</double>
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
                <double>0.75</double>
                <key>scale9Enabled</key>
                <false/>
                <key>scale9Borders</key>
                <rect>256,256,512,512</rect>
                <key>scale9Paddings</key>
                <rect>256,256,512,512</rect>
                <key>scale9FromFile</key>
                <false/>
            </struct>
            <key type="filename">enemies/lesser_dummy_head.png</key>
            <struct type="IndividualSpriteSettings">
                <key>pivotPoint</key>
                <point_f>0.5,0.5</point_f>
                <key>spriteScale</key>
                <double>1</double>
                <key>scale9Enabled</key>
                <false/>
                <key>scale9Borders</key>
                <rect>24,24,47,47</rect>
                <key>scale9Paddings</key>
                <rect>24,24,47,47</rect>
                <key>scale9FromFile</key>
                <false/>
            </struct>
            <key type="filename">enemies/max_death_1.png</key>
            <struct type="IndividualSpriteSettings">
                <key>pivotPoint</key>
                <point_f>0.5,0.5</point_f>
                <key>spriteScale</key>
                <double>1</double>
                <key>scale9Enabled</key>
                <false/>
                <key>scale9Borders</key>
                <rect>199,153,397,305</rect>
                <key>scale9Paddings</key>
                <rect>199,153,397,305</rect>
                <key>scale9FromFile</key>
                <false/>
            </struct>
            <key type="filename">enemies/max_death_2.png</key>
            <struct type="IndividualSpriteSettings">
                <key>pivotPoint</key>
                <point_f>0.5,0.5</point_f>
                <key>spriteScale</key>
                <double>1</double>
                <key>scale9Enabled</key>
                <false/>
                <key>scale9Borders</key>
                <rect>143,130,285,260</rect>
                <key>scale9Paddings</key>
                <rect>143,130,285,260</rect>
                <key>scale9FromFile</key>
                <false/>
            </struct>
            <key type="filename">enemies/max_death_3.png</key>
            <struct type="IndividualSpriteSettings">
                <key>pivotPoint</key>
                <point_f>0.5,0.5</point_f>
                <key>spriteScale</key>
                <double>1</double>
                <key>scale9Enabled</key>
                <false/>
                <key>scale9Borders</key>
                <rect>175,135,350,270</rect>
                <key>scale9Paddings</key>
                <rect>175,135,350,270</rect>
                <key>scale9FromFile</key>
                <false/>
            </struct>
            <key type="filename">enemies/super_dummy_2.png</key>
            <key type="filename">enemies/super_dummy_3.png</key>
            <struct type="IndividualSpriteSettings">
                <key>pivotPoint</key>
                <point_f>0.5,0.5</point_f>
                <key>spriteScale</key>
                <double>1</double>
                <key>scale9Enabled</key>
                <false/>
                <key>scale9Borders</key>
                <rect>366,269,731,539</rect>
                <key>scale9Paddings</key>
                <rect>366,269,731,539</rect>
                <key>scale9FromFile</key>
                <false/>
            </struct>
            <key type="filename">enemies/super_dummy_angry.png</key>
            <struct type="IndividualSpriteSettings">
                <key>pivotPoint</key>
                <point_f>0.5,0.5</point_f>
                <key>spriteScale</key>
                <double>1</double>
                <key>scale9Enabled</key>
                <false/>
                <key>scale9Borders</key>
                <rect>100,85,200,170</rect>
                <key>scale9Paddings</key>
                <rect>100,85,200,170</rect>
                <key>scale9FromFile</key>
                <false/>
            </struct>
            <key type="filename">enemies/time_magi.png</key>
            <struct type="IndividualSpriteSettings">
                <key>pivotPoint</key>
                <point_f>0.5,0.5</point_f>
                <key>spriteScale</key>
                <double>0.95</double>
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
            <key type="filename">enemies/time_magi_nervous.png</key>
            <struct type="IndividualSpriteSettings">
                <key>pivotPoint</key>
                <point_f>0.5,0.5</point_f>
                <key>spriteScale</key>
                <double>1</double>
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
            <key type="filename">enemies/time_magi_terrified.png</key>
            <struct type="IndividualSpriteSettings">
                <key>pivotPoint</key>
                <point_f>0.5,0.5</point_f>
                <key>spriteScale</key>
                <double>1</double>
                <key>scale9Enabled</key>
                <false/>
                <key>scale9Borders</key>
                <rect>78,100,155,200</rect>
                <key>scale9Paddings</key>
                <rect>78,100,155,200</rect>
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
                <double>1</double>
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
                <double>1</double>
                <key>scale9Enabled</key>
                <false/>
                <key>scale9Borders</key>
                <rect>155,123,311,246</rect>
                <key>scale9Paddings</key>
                <rect>155,123,311,246</rect>
                <key>scale9FromFile</key>
                <false/>
            </struct>
            <key type="filename">enemies/tree_open_glow.png</key>
            <key type="filename">enemies/tree_stumped.png</key>
            <key type="filename">enemies/tree_top.png</key>
            <struct type="IndividualSpriteSettings">
                <key>pivotPoint</key>
                <point_f>0.5,0.5</point_f>
                <key>spriteScale</key>
                <double>1</double>
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
                <double>1</double>
                <key>scale9Enabled</key>
                <false/>
                <key>scale9Borders</key>
                <rect>94,109,189,217</rect>
                <key>scale9Paddings</key>
                <rect>94,109,189,217</rect>
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
