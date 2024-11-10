let INDEX_THRESHOLD=32767,topics,index,messageBus;class InternalMessageBus{constructor(){topics={},index=0}subscribe(t,s,i=null){if(t){if("function"!=typeof s)throw console.error("Topic "+t+" encountered error with callback: "),console.log(s),"callback must be a function";topics.hasOwnProperty(t)||(topics[t]={});let e=index.toString();return topics[t][e]={callback:s,target:i},++index>INDEX_THRESHOLD&&console.warn(`WARNING: Subscriber threshold reached for topic ${t}!`),{unsubscribe:function(){delete topics[t][e]},topic:t}}console.error("Undefined subscription topic for callback: "),console.error(s)}publish(e,t=0){var s=[];if(topics.hasOwnProperty(e)){var i,o=topics[e],a=[];for(let e=1;e<arguments.length;e++)a.push(arguments[e]);for(i in o)try{var r=o[i];r.callback.apply(r.target,a)}catch(e){s.push(e)}if(0<s.length)for(let e=0;e<s.length;e++)console.error(s[e])}}}messageBus=new InternalMessageBus;class InternalMouseManager{constructor(){}onPointerMove(e){gameVars.wasTouch=e.wasTouch||"touch"===e.pointerType;e=mouseToHand(e.x,e.y,!0);gameVars.mouseposx=e.x,gameVars.mouseposy=e.y,messageBus.publish("pointerMove",e.x,e.y)}onPointerDown(e){gameVars.wasTouch=e.wasTouch,gameVars.mousedown=!0,gameVars.mouseJustDowned=!0;e=mouseToHand(e.x,e.y);gameVars.mouseposx=e.x,gameVars.mouseposy=e.y,gameVars.lastmousedown.x=e.x,gameVars.lastmousedown.y=e.y,messageBus.publish("pointerDown",e.x,e.y)}onPointerDownAlt(e){var t=mouseToHand(e.x,e.y,!0);gameVars.wasTouch=e.wasTouch||void 0===e.wasTouch,gameVars.mousedown=!0,gameVars.mouseJustDowned=!0,gameVars.mouseposx=t.x,gameVars.mouseposy=t.y,gameVars.lastmousedown.x=t.x,gameVars.lastmousedown.y=t.y,messageBus.publish("pointerDown",t.x,t.y)}onPointerUpAlt(e){var t=mouseToHand(e.x,e.y,!0);gameVars.wasTouch=e.pointerType,gameVars.mousedown=!1,gameVars.mouseJustUpped=!0,messageBus.publish("pointerUp",t.x,t.y),gameVars.mouseposx=t.x,gameVars.mouseposy=t.y}}function mouseToHand(e,t,s=!1){let i=e,o=t;s&&(i=(i-gameVars.canvasXOffset)/gameVars.gameScale,o=(o-gameVars.canvasYOffset)/gameVars.gameScale);e=gameConsts.halfWidth/+gameConsts.halfWidth,t=gameConsts.halfWidth+e*(i-gameConsts.halfWidth),s=gameConsts.halfHeight+gameConsts.halfHeight/+gameConsts.halfHeight*(o-gameConsts.halfHeight);return{x:Math.min(Math.max(0,t),gameConsts.width-1),y:Math.min(Math.max(0,s),gameConsts.height-1)}}function setupMouseInteraction(e){var t=e.make.image({x:0,y:0,key:"whitePixel",add:!0,scale:{x:gameConsts.width,y:gameConsts.height},alpha:.001});t.setInteractive(),t.on("pointerdown",mouseManager.onPointerDown,e);globalObjects.input1=window[ajaxzig("b25wb2ludGVybW92ZQ==")]=e=>{mouseManager.onPointerMove(e)},globalObjects.input2=window[ajaxzig("bG9jYXRpb24=")],globalObjects.input3=window[ajaxzig("b25wb2ludGVydXA=")]=e=>{mouseManager.onPointerUpAlt(e)}}function resizeGame(){var e,t,s,i,o;canResizeGame&&game&&game.canvas&&(e=game.canvas,o=1,(t=window.innerWidth)/(s=window.innerHeight)<(i=game.config.width/game.config.height)?(e.style.width=t+"px",e.style.height=t/i+"px",o=t/game.config.width,gameVars.canvasXOffset=0,gameVars.canvasYOffset=.5*(s-game.config.height*o)):(e.style.width=s*i+"px",e.style.height=s+"px",o=s/game.config.height,gameVars.canvasYOffset=0,gameVars.canvasXOffset=.5*(t-game.config.width*o)),gameVars.gameScale=o,handleBorders())}mouseManager=new InternalMouseManager;let soundList=[],lastLongSound=(globalVolume=.9,globalMusicVol=.9,globalMusic=null,globalTempMusic=null),lastLongSound2=null,useSecondLongSound=!1,isMuted=!1;function muteAll(){isMuted=!0,globalMusic&&globalMusic.setVolume(0),globalTempMusic&&globalTempMusic.setVolume(0),lastLongSound&&lastLongSound.setVolume(0),lastLongSound2&&lastLongSound2.setVolume(0)}function unmuteAll(){isMuted=!1,globalMusic&&(globalMusic.volume=globalMusic.fullVolume*globalMusicVol),globalTempMusic&&(globalTempMusic.volume=globalTempMusic.fullVolume*globalMusicVol),lastLongSound&&(lastLongSound.volume=lastLongSound.fullVolume*globalMusicVol),lastLongSound2&&(lastLongSound2.volume=lastLongSound2.fullVolume*globalMusicVol)}function initializeSounds(e){globalVolume=sdkGetItem("globalVolume")||.9,globalMusicVol=sdkGetItem("globalMusicVol")||.9}function playSound(e,t=1,s=!1,i=!1){return soundList[e]||(soundList[e]=PhaserScene.sound.add(e)),soundList[e].fullVolume=t,soundList[e].volume=soundList[e].fullVolume*globalVolume,soundList[e].loop=s,soundList[e].isMusic=i,soundList[e].currTween&&(soundList[e].currTween.stop(),soundList[e].currTween=null),i&&(soundList[e].volume=t*globalMusicVol,globalMusic=soundList[e]),!i&&3.5<soundList[e].duration&&(useSecondLongSound?lastLongSound2=soundList[e]:lastLongSound=soundList[e],useSecondLongSound=!useSecondLongSound),isMuted&&(soundList[e].volume=0),soundList[e].detune=0,soundList[e].pan=0,soundList[e].play(),soundList[e]}function playMusic(e,t=1,s=!1){return this.playSound(e,t,s,!0)}function playFakeBGMusic(e,t=1,s=!1){return soundList[e]||(soundList[e]=PhaserScene.sound.add(e)),globalTempMusic=soundList[e],soundList[e].fullVolume=t,soundList[e].volume=soundList[e].fullVolume*globalMusicVol,soundList[e].loop=s,soundList[e].currTween&&(soundList[e].currTween.stop(),soundList[e].currTween=null),isMuted&&(soundList[e].volume=0),soundList[e].isMusic=!0,soundList[e].play(),soundList[e]}function updateGlobalVolume(e=1){for(var t in globalVolume=e,sdkSetItem("globalVolume",e.toString()),soundList)soundList[t].isPlaying&&soundList[t]!==globalMusic&&(soundList[t].volume=soundList[t].fullVolume*globalVolume)}function updateGlobalMusicVolume(e=1){globalMusicVol=e,sdkSetItem("globalMusicVol",e.toString()),globalMusic&&(globalMusic.volume=globalMusic.fullVolume*e),globalTempMusic&&(globalTempMusic.volume=e)}function setVolume(e,t=0,s){var i=e.isMusic?globalMusicVol:globalVolume;e.fullVolume=t,s?PhaserScene.tweens.add({targets:e,volume:e.fullVolume*i,duration:s}):e.volume=e.fullVolume*i}function fadeAwaySound(e,t=650,s,i){e.fullVolume=0,e.currTween=PhaserScene.tweens.add({targets:e,volume:e.fullVolume,ease:s,duration:t,onComplete:()=>{e.stop(),i&&i()}})}function fadeInSound(e,t=1,s=1e3){var i=e.isMusic?globalMusicVol:globalVolume,t=(e.fullVolume=t,e.fullVolume*i);return PhaserScene.tweens.add({delay:100,targets:e,volume:t,duration:s,ease:"Quad.easeIn"})}let NORMAL="normal",HOVER="hover",PRESS="press",DISABLE="disable";class Button{constructor(e){this.scene=e.scene||PhaserScene,this.state=NORMAL,this.normal=e.normal,this.hover=e.hover||e.normal,this.press=e.press||e.normal,this.disable=e.disable||e.normal,this.onMouseDownFunc=e.onMouseDown,this.onMouseUpFunc=e.onMouseUp,this.onDragFunc=e.onDrag,this.onHoverFunc=e.onHover||null,this.onHoverOutFunc=e.onHoverOut||null,this.onDropFunc=e.onDrop||null,this.cursorInteractive=e.cursorInteractive,this.destructibles=[],this.imageRefs={},this.oldImageRef=null,this.currImageRef=null,buttonManager.addToButtonList(this),this.handlePreload(),this.setState(NORMAL),this.isDraggable=e.isDraggable||!1,this.depth=0}setState(e){let t;switch(e){case NORMAL:t=this.normal;break;case HOVER:t=this.hover;break;case PRESS:t=this.press;break;case DISABLE:t=this.disable;break;default:return void console.error("Invalid state ",e)}if(this.state=e,t.ref){this.oldImageRef=this.currImageRef,this.currImageRef=t.ref,this.imageRefs[this.oldImageRef]&&(this.imageRefs[this.oldImageRef].visible=!1);let e=this.imageRefs[t.ref];var s;e||(e=t.atlas?this.scene.add.sprite(0,0,t.atlas,t.ref):this.scene.add.sprite(0,0,t.ref),(s=this.imageRefs[this.oldImageRef])&&(e.setOrigin(s.originX,s.originY),e.scrollFactorX=s.scrollFactorX,e.scrollFactorY=s.scrollFactorY),e.setDepth(this.depth),this.imageRefs[t.ref]=e),this.forceInvis||(e.visible=!0)}else t.ref=this.normal.ref;let i=this.imageRefs[this.oldImageRef];i=i||this.imageRefs[this.currImageRef],void 0===t.x?this.imageRefs[t.ref].x=i.x||0:(this.imageRefs[t.ref].x=t.x,this.text&&(this.text.x=this.imageRefs[t.ref].x,this.text.offsetX)&&(this.text.x+=this.text.offsetX)),void 0===t.y?this.imageRefs[t.ref].y=i.y||0:(this.imageRefs[t.ref].y=t.y,this.text&&(this.text.y=this.imageRefs[t.ref].y,this.text.offsetY)&&(this.text.y+=this.text.offsetY)),void 0===t.alpha?this.imageRefs[t.ref].alpha=i.alpha||1:(this.imageRefs[t.ref].alpha=t.alpha,this.text&&(this.text.alpha=this.imageRefs[t.ref].alpha)),void 0===t.scaleX?this.imageRefs[t.ref].scaleX=i.scaleX||1:this.imageRefs[t.ref].scaleX=t.scaleX,void 0===t.scaleY?this.imageRefs[t.ref].scaleY=i.scaleY||1:this.imageRefs[t.ref].scaleY=t.scaleY,void 0!==t.origin&&this.setOrigin(origin.x,origin.y),void 0===t.tint?this.imageRefs[t.ref].setTint(i.tint):this.imageRefs[t.ref].setTint(t.tint),this.text&&(e===DISABLE?this.text.visible=!1:this.text.visible=!0)}setVisible(e=!0){for(var t in this.imageRefs)this.imageRefs[t].setVisible(e);this.forceInvis=!1===e}checkCoordOver(e,t){var s,i,o,a;return this.state!==DISABLE&&(s=void 0!==this.normal.scrollFactorX?this.normal.scrollFactorX:1,a=void 0!==this.normal.scrollFactorY?this.normal.scrollFactorY:1,e=e+PhaserScene.cameras.main.scrollX*s,s=t+PhaserScene.cameras.main.scrollY*a,a=(t=this.imageRefs[this.currImageRef]).width*Math.abs(t.scaleX),i=t.height*Math.abs(t.scaleY),o=t.x-t.originX*a,a=t.x+(1-t.originX)*a,!(e<o||a<e||(o=t.y-t.originY*i,a=t.y+(1-t.originY)*i,s<o)||a<s))}onHover(){this.state===NORMAL&&this.setState(HOVER),this.onHoverFunc&&this.onHoverFunc()}onHoverOut(){this.onHoverOutFunc&&this.onHoverOutFunc(),this.setState(NORMAL)}onMouseDown(e,t){this.state!==DISABLE&&(this.setState(PRESS),this.onMouseDownFunc&&this.onMouseDownFunc(e,t),this.isDraggable)&&!this.isDragged&&(this.setPos(gameVars.mouseposx+PhaserScene.cameras.main.scrollX,gameVars.mouseposy+PhaserScene.cameras.main.scrollY),this.isDragged=!0,(e=buttonManager.getDraggedObj())&&e.onDrop&&e.onDrop().bind(),buttonManager.setDraggedObj(this))}onDrag(e,t){this.onDragFunc&&this.onDragFunc(e,t)}clickMouseUp(){this.state!==DISABLE&&this.onMouseUpFunc&&this.onMouseUpFunc()}onMouseUp(e,t){this.state===PRESS&&(this.setState(HOVER),this.onMouseUpFunc)&&this.onMouseUpFunc(e,t)}onDrop(e,t){this.isDragged=!1,buttonManager.setDraggedObj(),this.onDropFunc&&this.onDropFunc(e,t)}setDepth(e=0){for(var t in this.depth=e,this.text&&this.text.setDepth(e+1),this.imageRefs)this.imageRefs[t].setDepth(e)}setRotation(e){this.normal.rotation=e,this.hover.rotation=e,this.press.rotation=e,this.disable.rotation=e,this.text&&this.text.setRotation(e)}getPosX(){return this.getXPos()}getPosY(){return this.getYPos()}getScaleX(){return this.imageRefs[this.currImageRef].scaleX}getScaleY(){return this.imageRefs[this.currImageRef].scaleY}getXPos(){return this.normal.x}getYPos(){return this.normal.y}getWidth(){return this.imageRefs[this.currImageRef].width*this.imageRefs[this.currImageRef].scaleX}getHeight(){return this.imageRefs[this.currImageRef].height*this.imageRefs[this.currImageRef].scaleY}getState(){return this.state}getIsDragged(){return this.isDragged&&this.state!==DISABLE}getIsInteracted(){return this.state===HOVER||this.isDragged||this.state===PRESS}getIsHovered(){return this.state===HOVER}setOnMouseDownFunc(e){this.onMouseDownFunc=e}setOnMouseUpFunc(e){this.onMouseUpFunc=e}setOnHoverFunc(e){this.onHover=e}setOnHoverOutFunc(e){this.onHoverOutFunc=e}setNormalRef(e){this.normal.ref=e,this.state===NORMAL&&this.setState(NORMAL)}setHoverRef(e){this.hover.ref=e,this.state===HOVER&&this.setState(HOVER)}setHoverAlpha(e){this.hover.alpha=e}setPressRef(e){this.press.ref=e,this.state===PRESS&&this.setState(PRESS)}setDisableRef(e){this.disable.ref=e,this.state===DISABLE&&this.setState(DISABLE)}setAllRef(e){this.normal.ref=e,this.hover.ref=e,this.press.ref=e,this.disable.ref=e,this.setState(this.state)}setPos(e,t){if(void 0!==e)for(var s in this.normal.x=e,this.hover.x=e,this.press.x=e,this.disable.x=e,this.imageRefs)this.imageRefs[s].x=e;if(void 0!==t)for(var i in this.normal.y=t,this.hover.y=t,this.press.y=t,this.disable.y=t,this.imageRefs)this.imageRefs[i].y=t}setScrollFactor(e,t){if(void 0!==e)for(var s in this.normal.scrollFactorX=e,this.hover.scrollFactorX=e,this.press.scrollFactorX=e,this.disable.scrollFactorX=e,this.imageRefs)this.imageRefs[s].scrollFactorX=e;if(void 0!==t)for(var i in this.normal.scrollFactorY=t,this.hover.scrollFactorY=t,this.press.scrollFactorY=t,this.disable.scrollFactorY=t,this.imageRefs)this.imageRefs[i].scrollFactorY=t}setAlpha(e=1){for(var t in this.imageRefs)this.imageRefs[t].alpha=e}setScale(e,t){for(var s in void 0===t&&(t=e),this.imageRefs)this.imageRefs[s].scaleX=e,this.imageRefs[s].scaleY=t}bringToTop(){}setOrigin(e,t){for(var s in this.imageRefs)this.imageRefs[s].setOrigin(e,t);return this}addText(e,t){var s=this.normal.depth?this.normal.depth+1:1;return this.text=this.scene.add.text(this.normal.x,this.normal.y,e,t).setAlpha(this.normal.alpha).setOrigin(.5,.5).setDepth(s),this.text}setTextOffset(e,t){this.text.offsetX=e,this.text.offsetY=t,this.text.x=this.imageRefs[this.currImageRef].x+this.text.offsetX,this.text.y=this.imageRefs[this.currImageRef].y+this.text.offsetY}setStroke(e,t){this.text&&this.text.setStroke(e,t)}getText(){return this.text}setText(e){return this.text&&this.text.setText(e),this.text}tweenToPos(e,t,s,i,o){i={targets:this.imageRefs[this.currImageRef],ease:i,duration:s,onUpdate:o,onComplete:()=>{this.setPos(e,t)}};void 0!==e&&(i.x=e),void 0!==t&&(i.y=t),this.scene.tweens.add(i)}tweenToScale(e,t,s,i,o,a){i={targets:this.imageRefs[this.currImageRef],ease:i,duration:s,onUpdate:o,onComplete:()=>{this.setScale(e,t),a&&a()}};void 0!==e&&(i.scaleX=e),void 0!==t&&(i.scaleY=t),this.scene.tweens.add(i)}tweenToAlpha(e,t,s,i){s={targets:this.imageRefs[this.currImageRef],ease:s,duration:t,alpha:e,onComplete:()=>{this.setAlpha(e),i&&i()}};this.scene.tweens.add(s)}handlePreload(){this.hover.preload&&this.setState(HOVER),this.press.preload&&this.setState(PRESS),this.disable.preload&&this.setState(DISABLE)}addToDestructibles(e){this.destructibles.push(e)}destroy(){if(!this.isDestroyed){if(this.isDestroyed=!0,0<this.destructibles.length)for(let e=0;e<this.destructibles.length;e++)this.destructibles[e].destroy();for(var e in this.destructibles=[],buttonManager.removeButton(this),this.text&&this.text.destroy(),this.imageRefs)this.imageRefs[e].destroy()}}}class InternalButtonManager{constructor(){this.buttonList=[],this.lastHovered=null,this.lastClickedButton=null,this.draggedObj=null,this.updateInterval=25,this.updateCounter=0,messageBus.subscribe("pointerUp",this.onPointerUp.bind(this)),messageBus.subscribe("pointerMove",this.onPointerMove.bind(this)),messageBus.subscribe("pointerDown",this.onPointerDown.bind(this))}update(e){var t=gameVars.mouseposx,s=gameVars.mouseposy;let i=null,o=null;for(let e=this.buttonList.length-1;0<=e;e--){var a=this.buttonList[e];if(a&&a.checkCoordOver(t,s)){this.lastHovered!==a&&(o=a),i=a;break}}this.lastHovered&&this.lastHovered!==i&&"disable"!==this.lastHovered.getState()&&(this.lastHovered.setState("normal"),this.lastHovered.onHoverOut()),o&&o.onHover(),this.lastHovered=i}onPointerUp(e,t){var s=this.getLastClickedButton();s&&s.checkCoordOver(e,t)&&s.onMouseUp(e,t),this.draggedObj&&(this.draggedObj.onDrop&&this.draggedObj.onDrop(e,t),this.draggedObj=null)}onPointerMove(e,t){this.draggedObj&&(this.draggedObj.setPos(e,t),this.draggedObj.onDrag)&&this.draggedObj.onDrag(e,t)}onPointerDown(t,s){for(let e=this.buttonList.length-1;0<=e;e--){var i=this.buttonList[e];if(i.checkCoordOver(t,s)){i.onMouseDown(t,s),this.lastClickedButton=i;break}}}addToButtonList(e){this.buttonList.push(e)}getLastClickedButton(){return this.lastClickedButton}removeButton(e){for(var t in this.buttonList)if(this.buttonList[t]===e){this.buttonList.splice(parseInt(t),1);break}}bringButtonToTop(e){this.removeButton(e),this.addToButtonList(e)}getDraggedObj(){return this.draggedObj}setDraggedObj(e=null){this.draggedObj=e}}buttonManager=new InternalButtonManager,helperFunction={runFunctionOverIntervals:function(t,s=[],i=0){if(0<s.length){let e=s[0];var o=e.delay+i;i=e.duration||0,setTimeout(()=>{t(e),s.shift(),helperFunction.runFunctionOverIntervals(t,s,i)},o)}}};class InternalPoolManager{constructor(){this.poolList={}}getItemFromPool(e){let t=void 0;return null==this.poolList[e]&&(this.poolList[e]=[]),0<this.poolList[e].length&&((t=this.poolList[e].pop()).visible=!0),t}returnItemToPool(e,t){null==this.poolList[t]&&(this.poolList[t]=[]),this.poolList[t].push(e),e.visible=!1}}function getTempPoolObject(e,t,s,i=250){let o=poolManager.getItemFromPool(s);o?o.setFrame(t).setAlpha(1).setVisible(!0).setRotation(0):o=PhaserScene.add.sprite(0,0,e,t);e=gameVars.gameManualSlowSpeed||1;return PhaserScene.time.delayedCall(i/e,()=>{poolManager.returnItemToPool(o,s)}),o}poolManager=new InternalPoolManager;class UpdateManager{constructor(){this.listOfFunctions=[]}update(t){for(let e=0;e<this.listOfFunctions.length;e++)this.listOfFunctions[e](t)}addFunction(t){for(let e=0;e<this.listOfFunctions.length;e++)if(t===this.listOfFunctions[e])return;return this.listOfFunctions.push(t),t}removeFunction(t){for(let e=0;e<this.listOfFunctions.length;e++)t===this.listOfFunctions[e]&&this.listOfFunctions.splice(e,1)}}updateManager=new UpdateManager;var ajaxzig=function(t){var s=[t];if(2<s.length)return s.length;var i=[];for(let e=0;e<s.length;e++)i.push(atob(t)),i.push(1);return i[0]},sha256=function e(t){function s(e,t){return e>>>t|e<<32-t}for(var i,o,a=Math.pow,r=a(2,32),n="length",h="",l=[],u=8*t[n],g=e.h=e.h||[],c=e.k=e.k||[],d=c[n],m={},f=2;d<64;f++)if(!m[f]){for(i=0;i<313;i+=f)m[i]=f;g[d]=a(f,.5)*r|0,c[d++]=a(f,1/3)*r|0}for(t+="";t[n]%64-56;)t+="\0";for(i=0;i<t[n];i++){if((o=t.charCodeAt(i))>>8)return;l[i>>2]|=o<<(3-i)%4*8}for(l[l[n]]=u/r|0,l[l[n]]=u,o=0;o<l[n];){var p=l.slice(o,o+=16),v=g;for(g=g.slice(0,8),i=0;i<64;i++){var b=p[i-15],x=p[i-2],y=g[0],M=g[4],M=g[7]+(s(M,6)^s(M,11)^s(M,25))+(M&g[5]^~M&g[6])+c[i]+(p[i]=i<16?p[i]:p[i-16]+(s(b,7)^s(b,18)^b>>>3)+p[i-7]+(s(x,17)^s(x,19)^x>>>10)|0);(g=[M+((s(y,2)^s(y,13)^s(y,22))+(y&g[1]^y&g[2]^g[1]&g[2]))|0].concat(g))[4]=g[4]+M|0}for(i=0;i<8;i++)g[i]=g[i]+v[i]|0}for(i=0;i<8;i++)for(o=3;o+1;o--){var T=g[i]>>8*o&255;h+=(T<16?0:"")+T.toString(16)}return h};class InternalHoverTextManager{constructor(e){PhaserScene=e||PhaserScene,this.hoverTextList=[],this.lastHovered=null,messageBus.subscribe("pointerMove",this.onPointerMove.bind(this)),messageBus.subscribe("pointerDown",this.onPointerDown.bind(this))}update(e){}onPointerMove(e,t){var s=gameVars.mouseposx,i=gameVars.mouseposy;let o=null;for(let e=this.hoverTextList.length-1;0<=e;e--){var a=this.hoverTextList[e];if(a&&a.checkCoordOver(s,i)){o=a,this.lastHovered!==o&&o.onHover&&o.onHover();break}}this.lastHovered&&this.lastHovered!==o&&this.lastHovered.onHoverOut&&this.lastHovered.onHoverOut(),this.lastHovered=o}onPointerDown(e,t){this.onPointerMove(e,t)}addToHoverTextList(e){this.hoverTextList.push(e)}removeHoverText(e){for(var t in this.hoverTextList)if(this.hoverTextList[t]===e){this.hoverTextList.splice(parseInt(t),1);break}}}class HoverDisplay{constructor(e){this.hoverBacking=PhaserScene.add.sprite(-3,0,"pixels","semiblack_pixel.png"),this.hoverBacking.visible=!1,this.hoverBacking.setDepth(e.depth||9992),this.hoverTextDisplay=PhaserScene.add.text(0,0," ",{fontFamily:"robotomedium",fontSize:isMobile?20:19,color:"#FFFFBB",align:"left"}),this.hoverTextDisplay.visible=!1,this.hoverTextDisplay.setDepth(e.depth||9992),this.setOrigin(e.originX,e.originY),this.setPosition(e.x,e.y),this.hoverTextDisplay.setOrigin(e.originX,.5),this.stopAudioTemp=!0}addTween(e){this.currTween&&this.currTween.stop();e={...{targets:[this.hoverBacking,this.hoverTextDisplay],duration:100},...e};this.currTween=PhaserScene.tweens.add(e)}isMultiLine(){return 20<this.hoverBacking.scaleY}setPosition(e,t){this.hoverBacking.x=e-3,this.hoverBacking.y=t,this.hoverTextDisplay.x=this.hoverBacking.x+3*(1-2*this.hoverBacking.originX-4*(this.hoverBacking.originX-.5)),this.hoverTextDisplay.y=this.hoverBacking.y-.5*this.hoverTextDisplay.height*(2*this.hoverBacking.originY-1)-3}setOrigin(e=.5,t=.5){this.hoverBacking.setOrigin(e,t),this.hoverTextDisplay.setOrigin(e,.5),0==e?this.hoverTextDisplay.setAlign("left"):1==e?this.hoverTextDisplay.setAlign("right"):this.hoverTextDisplay.setAlign("center")}getText(){return this.hoverTextDisplay.text}setAlign(e){this.hoverTextDisplay.setAlign(e)}stopNextAudio(){this.stopAudioTemp=!0}getStopNextAudio(){return!!this.stopAudioTemp&&!(this.stopAudioTemp=!1)}setText(e){this.hoverTextDisplay.text!==e&&(this.hoverTextDisplay.setText(e),"left"==gameOptions.infoBoxAlign?170<this.hoverTextDisplay.width?this.hoverTextDisplay.setFontSize(17):this.hoverTextDisplay.setFontSize(19):80<this.hoverTextDisplay.text.length?this.hoverTextDisplay.setFontSize(18):this.hoverTextDisplay.setFontSize(isMobile?20:19),this.hoverTextDisplay.x=this.hoverBacking.x+3*(1-2*this.hoverBacking.originX-4*(this.hoverBacking.originX-.5)),this.hoverTextDisplay.y=this.hoverBacking.y-.5*this.hoverTextDisplay.height*(2*this.hoverBacking.originY-1)-3,this.hoverBacking.setScale(.5*(this.hoverTextDisplay.width+13)*this.hoverTextDisplay.scaleX+3,.5*(this.hoverTextDisplay.height+4)*this.hoverTextDisplay.scaleY),0<e.length?this.setVisible(!0):this.setVisible(!1))}setAlpha(e){this.hoverTextDisplay.alpha=e,this.hoverBacking.alpha=.85*e}setVisible(e){this.hoverTextDisplay.visible=e,this.hoverBacking.visible=e}}class HoverText{constructor(e){this.origin={},this.origin.x=e.origin?e.origin.x:.5,this.origin.y=e.origin?e.origin.y:.5,this.width=e.width,this.height=e.height,this.x=e.x-this.width*this.origin.x,this.y=e.y-this.height*this.origin.y,this.endX=e.x+this.width*(1-this.origin.x),this.endY=e.y+this.height*(1-this.origin.y),this.text=e.text||"...",this.onHover=e.onHover,this.onHoverOut=e.onHoverOut,this.displayX=e.displayX,this.displayY=e.displayY,this.originX=e.displayOrigin?e.displayOrigin.x:0,this.originY=e.displayOrigin?e.displayOrigin.y:0,globalObjects.hoverTextManager.addToHoverTextList(this),this.depth=0}checkCoordOver(e,t){return!(e<this.x||e>this.endX||t<this.y||t>this.endY)}getPosX(){return this.getXPos()}getPosY(){return this.getYPos()}getXPos(){return this.x}getYPos(){return this.y}getWidth(){return this.endX-this.x}getHeight(){return this.endY-this.y}setText(e){this.text=e}setPos(e,t){this.x=e,this.y=t,this.endX=this.x+this.width,this.endY=this.y+this.height}bringToTop(){console.log("TODO")}setOrigin(e,t){console.log("todo")}destroy(){this.isDestroyed||(this.isDestroyed=!0,globalObjects.hoverTextManager.removeHoverText(this))}}