(function(t){function e(e){for(var r,s,o=e[0],l=e[1],c=e[2],h=0,p=[];h<o.length;h++)s=o[h],Object.prototype.hasOwnProperty.call(i,s)&&i[s]&&p.push(i[s][0]),i[s]=0;for(r in l)Object.prototype.hasOwnProperty.call(l,r)&&(t[r]=l[r]);u&&u(e);while(p.length)p.shift()();return n.push.apply(n,c||[]),a()}function a(){for(var t,e=0;e<n.length;e++){for(var a=n[e],r=!0,o=1;o<a.length;o++){var l=a[o];0!==i[l]&&(r=!1)}r&&(n.splice(e--,1),t=s(s.s=a[0]))}return t}var r={},i={app:0},n=[];function s(e){if(r[e])return r[e].exports;var a=r[e]={i:e,l:!1,exports:{}};return t[e].call(a.exports,a,a.exports,s),a.l=!0,a.exports}s.m=t,s.c=r,s.d=function(t,e,a){s.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:a})},s.r=function(t){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},s.t=function(t,e){if(1&e&&(t=s(t)),8&e)return t;if(4&e&&"object"===typeof t&&t&&t.__esModule)return t;var a=Object.create(null);if(s.r(a),Object.defineProperty(a,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var r in t)s.d(a,r,function(e){return t[e]}.bind(null,r));return a},s.n=function(t){var e=t&&t.__esModule?function(){return t["default"]}:function(){return t};return s.d(e,"a",e),e},s.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},s.p="/piupiu/";var o=window["webpackJsonp"]=window["webpackJsonp"]||[],l=o.push.bind(o);o.push=e,o=o.slice();for(var c=0;c<o.length;c++)e(o[c]);var u=l;n.push([0,"chunk-vendors"]),a()})({0:function(t,e,a){t.exports=a("56d7")},"034f":function(t,e,a){"use strict";a("85ec")},"0c7a":function(t,e,a){t.exports=a.p+"img/play-button.b1b4fb5d.svg"},"17b9":function(t,e,a){},"56d7":function(t,e,a){"use strict";a.r(e);a("e260"),a("e6cf"),a("cca6"),a("a79d");var r=a("2b0e"),i=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"fullscreen-container",attrs:{id:"app"}},[a("h1",[t._v("Piu Piu")]),a("div",{staticClass:"horizontal-spacing button-container"},[a("button",{on:{click:t.startPlaying}},[t._v("Start")]),a("button",{on:{click:t.stopPlaying}},[t._v("Stop")]),a("button",{attrs:{disabled:this.playing},on:{click:t.singleMove}},[t._v("Single move")])]),a("div",{staticStyle:{display:"flex","flex-direction":"row"}},[t._v(" Speed: "),a("input",{directives:[{name:"model",rawName:"v-model",value:t.speed,expression:"speed"}],attrs:{type:"range",min:"0",max:"100"},domProps:{value:t.speed},on:{__r:function(e){t.speed=e.target.value}}}),t._v(" "+t._s(t.speed)+" ")]),a("p",[t._v(" Controlling player "+t._s(t.currentPlayer+1)),a("br"),t._v(" State size: "+t._s(t.stateSize)+" | Move: "+t._s(t.moveNumber)+" | Game "+t._s(t.gameNumber)),a("br"),t._v(" Player 1 wins: "+t._s(t.playerWins[0])+" | Player 2 wins: "+t._s(t.playerWins[1])+" ")]),a("Map",{attrs:{width:400,height:400,map_vals:t.map_vals}})],1)},n=[],s=(a("b64b"),a("2909")),o=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"map-container",style:t.mapSizeStyle},t._l(t.mapBlocks,(function(t){return a("MapBlock",{key:t.key,staticClass:"map-block",style:t.position,attrs:{type:t.type}})})),1)},l=[],c=(a("99af"),a("4160"),a("d81d"),a("a9e3"),a("159b"),function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("div",{staticClass:"map-block",style:t.colorStyle},[t.isPlayerBlock?r("img",{style:t.rotatePlayerStyle,attrs:{width:"100%",height:"100%",src:a("0c7a")}}):t._e()])}),u=[],h=(a("caad"),{name:"MapBlock",props:{type:Number},computed:{colorStyle:function(){switch(this.type){case 0:return{backgroundColor:"white"};case 1:return{backgroundColor:"black"};case 10:return{backgroundColor:"red"};default:return{backgroundColor:"white"}}},isPlayerBlock:function(){return[2,3,4,5,6,7,8,9].includes(this.type)},rotatePlayerStyle:function(){switch(this.type){case 2:case 6:return{transform:"rotate(-90deg)"};case 3:case 7:return{transform:"rotate(0deg)"};case 4:case 8:return{transform:"rotate(90deg)"};case 5:case 9:return{transform:"rotate(180deg)"};default:return{}}}}}),p=h,d=(a("ae28"),a("2877")),f=Object(d["a"])(p,c,u,!1,null,"1ac9dbf4",null),v=f.exports,y={name:"Map",components:{MapBlock:v},props:{width:Number,height:Number,map:String,map_vals:Array},computed:{mapSizeStyle:function(){return{width:this.width+"px",height:this.height+"px",backgroundColor:"blue"}},mapBlocks:function(){var t=[],e=this.height/this.map_vals.length,a=this.width/this.map_vals[0].length;return this.map_vals.forEach((function(r,i){t=t.concat(r.map((function(t,r){return{key:"".concat(i,",").concat(r),position:{left:r*a+"px",top:i*e+"px",width:a+"px",height:e+"px"},type:t}})))})),t}}},m=y,b=(a("9540"),Object(d["a"])(m,o,l,!1,null,"284792a6",null)),g=b.exports,_=(a("4de4"),a("13d5"),a("45fc"),a("07ac"),a("2532"),a("d4ec")),k=a("bee2"),w=a("ade3");a("d3b7"),a("ddb0");function O(t,e){if(e=e||[],e.length!=t.length)return t[Math.floor(Math.random()*t.length)];var a=e.reduce((function(t,e){return t+e}),0),r=0;e=e.map((function(t){return r=t+r}));var i=Math.random()*a;return t[e.filter((function(t){return t<=i})).length]}function P(t,e){return Object(s["a"])(Array(e-t).keys()).map((function(e){return e+t}))}var j={basic:[[1,1,1,1,1,1,1,1,1],[1,0,1,0,0,0,0,0,1],[1,0,1,0,0,0,1,0,1],[1,0,0,0,0,0,1,0,1],[1,0,0,0,1,1,1,0,1],[1,0,0,0,0,0,0,0,1],[1,0,0,1,0,0,0,0,1],[1,0,0,1,0,0,1,1,1],[1,0,0,0,0,0,0,0,1],[1,1,1,1,1,1,1,1,1]]},A=function(){function t(e){Object(_["a"])(this,t),Object(w["a"])(this,"move_reward",-1),Object(w["a"])(this,"orient_reward",-2),Object(w["a"])(this,"stay_still_reward",-2),Object(w["a"])(this,"move_into_wall_reward",-5),Object(w["a"])(this,"fire_reward",-10),Object(w["a"])(this,"kill_reward",100),Object(w["a"])(this,"player_locations",[[1,1],[8,8]]),Object(w["a"])(this,"default_starting_locations",[[1,1],[8,7]]),Object(w["a"])(this,"player_vals",[{up:2,right:3,down:4,left:5},{up:6,right:7,down:8,left:9}]),Object(w["a"])(this,"inverse_player_vals",this.player_vals.map((function(t){return Object.keys(t).reduce((function(e,a){return e[t[a]]=a,e}),{})}))),Object(w["a"])(this,"structure_vals",{space:0,wall:1,fire:10}),Object(w["a"])(this,"non_wall_vals",[0,2,3,4,5,6,7,8,9,10]),Object(w["a"])(this,"actions",["up","right","left","down","fire","none"]),this.map_vals=e}return Object(k["a"])(t,[{key:"getWidth",value:function(){return this.map_vals[0].length}},{key:"getHeight",value:function(){return this.map_vals.length}},{key:"extractNonWallBlocks",value:function(t){var e=this,a=[];return t.forEach((function(t,r){a=a.concat(t.map((function(t,e){return[r,e,t]})).filter((function(t){return t[2]!=e.structure_vals["wall"]})))})),a}},{key:"getStateAsPlayer",value:function(t){if(0==t)return this.getState();if(1==t){var e=this.getState().map((function(t){return Object(s["a"])(t)}));return e[this.player_locations[0][0]][this.player_locations[0][1]]=this.playerOrientationToVal(1,this.getPlayerOrientation(0)),e[this.player_locations[1][0]][this.player_locations[1][1]]=this.playerOrientationToVal(0,this.getPlayerOrientation(1)),e}}},{key:"getReducedStateAsPlayer",value:function(t){return this.extractNonWallBlocks(this.getStateAsPlayer(t)).map((function(t){return t[2]}))}},{key:"playerOrientationToVal",value:function(t,e){return this.player_vals[t][e]}},{key:"playerValToOrientation",value:function(t,e){return this.inverse_player_vals[t][e]}},{key:"getPlayerOrientation",value:function(t){return this.playerValToOrientation(t,this.getBlockAt(this.player_locations[t]))}},{key:"getState",value:function(){return this.map_vals}},{key:"valIsPlayer",value:function(t,e){return Object.values(this.player_vals[e]).includes(t)}},{key:"valIsAnyPlayer",value:function(t){return this.player_vals.some((function(e){return Object.values(e).includes(t)}))}},{key:"reset",value:function(){var t=arguments.length>0&&void 0!==arguments[0]&&arguments[0];this.clearFireFromBoard(),this.spawnPlayer(0,t),this.spawnPlayer(1,t)}},{key:"spawnPlayer",value:function(t){var e=this,a=arguments.length>1&&void 0!==arguments[1]&&arguments[1];if(this.clearPlayerFromBoard(t),a){var r=[];this.map_vals.forEach((function(t,a){r=r.concat(t.map((function(t,e){return[a,e,t]})).filter((function(t){return t[2]==e.structure_vals["space"]})))}));var i=O(r);this.setBlockAt(i,this.player_vals[t]["right"]),this.player_locations[t]=[i[0],i[1]]}else this.player_locations[t]=this.default_starting_locations[t],this.setBlockAt(this.player_locations[t],this.player_vals[t]["right"])}},{key:"action",value:function(t,e){var a=this.player_locations[e],r=Object(s["a"])(a),i=this.getPlayerOrientation(e);switch(this.clearFireFromBoard(),t){case"up":return"up"==i?(r[0]=Math.min(Math.max(a[0]-1,0),this.getHeight()),[this.movePlayer(a,r,e),!1]):(this.setBlockAt(a,this.player_vals[e]["up"]),[this.orient_reward,!1]);case"down":return"down"==i?(r[0]=Math.min(Math.max(a[0]+1,0),this.getHeight()),[this.movePlayer(a,r,e),!1]):(this.setBlockAt(a,this.player_vals[e]["down"]),[this.orient_reward,!1]);case"left":return"left"==i?(r[1]=Math.min(Math.max(a[1]-1,0),this.getWidth()),[this.movePlayer(a,r,e),!1]):(this.setBlockAt(a,this.player_vals[e]["left"]),[this.orient_reward,!1]);case"right":return"right"==i?(r[1]=Math.min(Math.max(a[1]+1,0),this.getWidth()),[this.movePlayer(a,r,e),!1]):(this.setBlockAt(a,this.player_vals[e]["right"]),[this.orient_reward,!1]);case"fire":var n=this.fire(r,i,e);return[n,n==this.kill_reward];case"none":return[this.stay_still_reward,!1];default:}}},{key:"movePlayer",value:function(t,e,a){if(this.getBlockAt(e)==this.structure_vals["space"]||this.getBlockAt(e)==this.structure_vals["fire"]){var r=this.getBlockAt(t);return this.setBlockAt(t,this.structure_vals["space"]),this.setBlockAt(e,r),this.player_locations[a]=e,this.move_reward}return this.move_into_wall_reward}},{key:"fire",value:function(t,e){var a,r=this,i=this.fire_reward;switch(e){case"right":a=P(t[1]+1,this.getWidth()),a=a.map((function(e){return[t[0],e]}));break;case"left":a=P(0,t[1]),a.reverse(),a=a.map((function(e){return[t[0],e]}));break;case"up":a=P(0,t[0]),a.reverse(),a=a.map((function(e){return[e,t[1]]}));break;case"down":a=P(t[0]+1,this.getHeight()),a=a.map((function(e){return[e,t[1]]}));break}return a.some((function(t){return 0==r.getBlockAt(t)?(r.setBlockAt(t,r.structure_vals["fire"]),!1):(r.valIsAnyPlayer(r.getBlockAt(t))&&(i=r.kill_reward),!0)})),i}},{key:"applyToBoard",value:function(t){for(var e=0;e<this.getHeight();e++)for(var a=0;a<this.getWidth();a++)t(e,a)}},{key:"clearFireFromBoard",value:function(){var t=this;this.applyToBoard((function(e,a){t.getBlockAt([e,a])==t.structure_vals["fire"]&&t.setBlockAt([e,a],t.structure_vals["space"])}))}},{key:"clearPlayerFromBoard",value:function(t){var e=this;this.applyToBoard((function(a,r){e.valIsPlayer(e.getBlockAt([a,r]),t)&&e.setBlockAt([a,r],e.structure_vals["space"])}))}},{key:"getBlockAt",value:function(t){return this.map_vals[t[0]][t[1]]}},{key:"setBlockAt",value:function(t,e){this.map_vals[t[0]][t[1]]=e}}]),t}(),M=(a("cb29"),a("c740"),function(){function t(e){Object(_["a"])(this,t),Object(w["a"])(this,"epsilon",1),Object(w["a"])(this,"max_epsilon",1),Object(w["a"])(this,"min_epsilon",.01),Object(w["a"])(this,"decay_rate",.01),Object(w["a"])(this,"learning_rate",.7),Object(w["a"])(this,"gamma",.7),Object(w["a"])(this,"episode",0),Object(w["a"])(this,"qTable",{}),this.actions=e}return Object(k["a"])(t,[{key:"chooseAction",value:function(t){if(Math.random()>this.epsilon&&t in this.qTable){var e=this.qTable[t],a=this.actions[e.findIndex((function(t){return t==Math.max.apply(Math,Object(s["a"])(e))}))];return a}var r=Array(this.actions.length).fill(1);return O(this.actions,r)}},{key:"update",value:function(t,e,a,r){var i=t in this.qTable?this.qTable[t]:Array(this.actions.length).fill(0),n=e in this.qTable?this.qTable[e]:Array(this.actions.length).fill(0),o=this.actions.findIndex((function(t){return t==a}));i[o]=i[o]+this.learning_rate*(r+this.gamma*Math.max.apply(Math,Object(s["a"])(n))-i[o]),this.qTable[t]=i,this.epsilon=this.min_epsilon+(this.max_epsilon-this.min_epsilon)*Math.exp(-this.decay_rate*this.episode),console.log("state_q_vals: ",this.epsilon,i)}},{key:"endGame",value:function(){this.episode=this.episode+1}}]),t}()),B={name:"App",components:{Map:g},data:function(){return{battleGround:new A(j["basic"]),map_vals:[[]],keyPressed:void 0,keyWatcher:void 0,playerMover:void 0,playing:!1,currentPlayer:0,gameOver:!1,newGame:!0,stateSize:0,agent:void 0,moveNumber:0,gameNumber:1,playerWins:[0,0],speed:50}},mounted:function(){this.battleGround.reset(!0),this.map_vals=this.battleGround.getState(),this.agent=new M(this.battleGround.actions)},created:function(){var t=this;window.addEventListener("keydown",(function(e){t.keyPressed=e.key})),window.addEventListener("keyup",(function(e){t.keyPressed=void 0}))},methods:{startPlaying:function(){this.playing=!0,this.doMove()},stopPlaying:function(){this.playing=!1},singleMove:function(){this.doMove()},doMove:function(){var t=arguments.length>0&&void 0!==arguments[0]&&arguments[0];if(t)return this.agent.endGame(),this.battleGround.reset(!0),this.gameNumber+=1,this.moveNumber=0,this.currentPlayer=0,this.updateMapFromState(),void(this.playing&&setTimeout(this.doMove,this.speed));var e=this.battleGround.getReducedStateAsPlayer(this.currentPlayer),a=this.agent.chooseAction(e),r=this.battleGround.action(a,this.currentPlayer);console.log("action/reward:",a,r);var i=this.battleGround.getReducedStateAsPlayer(this.currentPlayer);this.agent.update(e,i,a,r[0]),this.stateSize=Object.keys(this.agent.qTable).length,this.moveNumber+=1,this.updateMapFromState();var n=this.moveNumber>200;r[1]&&(this.playerWins[this.currentPlayer]+=1,n=!0),this.currentPlayer=(this.currentPlayer+1)%2,this.playing&&setTimeout(this.doMove,this.speed,n)},updateMapFromState:function(){this.speed>0&&(this.map_vals=Object(s["a"])(this.battleGround.getState()))},debug:function(){},takeAction:function(){if(this.gameOver)alert("Game Over"),this.gameOver=!1,this.battleGround.reset();else{var t;switch(this.keyPressed){case"ArrowUp":t=this.battleGround.action("up",this.currentPlayer);break;case"ArrowDown":t=this.battleGround.action("down",this.currentPlayer);break;case"ArrowLeft":t=this.battleGround.action("left",this.currentPlayer);break;case"ArrowRight":t=this.battleGround.action("right",this.currentPlayer);break;case" ":t=this.battleGround.action("fire",this.currentPlayer);break;default:t=this.battleGround.action("none",this.currentPlayer)}this.map_vals=Object(s["a"])(this.battleGround.getState()),t[0]&&console.log("Reward: ",t[0]),this.gameOver=t[1]}}}},S=B,x=(a("034f"),Object(d["a"])(S,i,n,!1,null,null,null)),G=x.exports;r["a"].config.productionTip=!1,new r["a"]({render:function(t){return t(G)}}).$mount("#app")},"85ec":function(t,e,a){},9540:function(t,e,a){"use strict";a("17b9")},ae28:function(t,e,a){"use strict";a("cccf")},cccf:function(t,e,a){}});
//# sourceMappingURL=app.f4a579d3.js.map