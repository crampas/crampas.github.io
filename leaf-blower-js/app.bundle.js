/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/main.ts":
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/*! flagged exports */
/*! export __esModule [provided] [no usage info] [missing usage info prevents renaming] */
/*! export game [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_exports__, __webpack_require__ */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.game = void 0;
var Phaser = __webpack_require__(/*! phaser */ "./node_modules/phaser/dist/phaser.js");
var scenes_1 = __webpack_require__(/*! ./scenes */ "./src/scenes/index.ts");
var gameConfig = {
    title: 'Sample',
    type: Phaser.AUTO,
    scale: {
        width: window.innerWidth,
        height: window.innerHeight,
    },
    scene: scenes_1.default,
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
        },
    },
    parent: 'game',
    backgroundColor: '#000000',
};
exports.game = new Phaser.Game(gameConfig);
window.addEventListener('resize', function () {
    exports.game.scale.refresh();
});


/***/ }),

/***/ "./src/scenes/index.ts":
/*!*****************************!*\
  !*** ./src/scenes/index.ts ***!
  \*****************************/
/*! flagged exports */
/*! export __esModule [provided] [no usage info] [missing usage info prevents renaming] */
/*! export default [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_exports__, __webpack_require__ */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
var intro_1 = __webpack_require__(/*! ./intro */ "./src/scenes/intro.ts");
var leaf_blower_garden_1 = __webpack_require__(/*! ./leaf-blower-garden */ "./src/scenes/leaf-blower-garden.ts");
exports.default = [intro_1.Intro, leaf_blower_garden_1.LeafBlowerGarden];


/***/ }),

/***/ "./src/scenes/intro.ts":
/*!*****************************!*\
  !*** ./src/scenes/intro.ts ***!
  \*****************************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements: top-level-this-exports, __webpack_exports__, __webpack_require__ */
/*! CommonJS bailout: this is used directly at 2:17-21 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Intro = void 0;
var Phaser = __webpack_require__(/*! phaser */ "./node_modules/phaser/dist/phaser.js");
var sceneConfig = {
    active: false,
    visible: false,
    key: 'Intro',
};
var Intro = /** @class */ (function (_super) {
    __extends(Intro, _super);
    function Intro() {
        var _this = _super.call(this, sceneConfig) || this;
        _this.leafs = [];
        return _this;
    }
    Intro.prototype.preload = function () {
        this.load.image('intro-image', 'assets/leaf-blower-into.jpg');
        this.load.spritesheet('intro-leafs', 'assets/sprites/leaf-4.png', { frameWidth: 32, frameHeight: 32 });
    };
    Intro.prototype.create = function () {
        var _this = this;
        this.cursorKeys = this.input.keyboard.createCursorKeys();
        var image = this.add.image(0, 0, 'intro-image').setOrigin(0, 0);
        var scaleX = Math.min(this.game.canvas.width, 1024) / image.width;
        image.setScale(scaleX);
        var offsetX = (this.game.canvas.width - image.width * scaleX) / 2;
        image.setX(offsetX);
        this.text = this.add.text(offsetX + 300, 400, '').setFontSize(48).setFontStyle('bold').setColor('#a01003').setDepth(100).setScrollFactor(0);
        this.text.setText([
            'Ich habe einen Freund',
            'der ist Laubbläser',
            '',
            'Cursor keys to move,',
            ' Space to blow',
            'Press Space to start'
        ]);
        // .setDisplaySize(1024, 1024).setOrigin(0, 0);
        this.time.addEvent({ delay: 100, loop: true }).callback = function () {
            if (_this.leafs.length > 5000) {
                return;
            }
            var leaf = _this.physics.add.sprite(Math.random() * _this.game.canvas.width, Math.random() * _this.game.canvas.height, "intro-leafs", Math.floor(Math.random() * 5.0));
            leaf.setCollideWorldBounds(true);
            leaf.setDrag(100, 100);
            leaf.setFriction(1000, 1000);
            leaf.setMass(0.01);
            leaf.setBounce(0.5, 0.5);
            leaf.setRotation(Math.random() * Math.PI);
            _this.leafs.push(leaf);
        };
    };
    Intro.prototype.update = function () {
        if (this.cursorKeys.space.isDown) {
            this.scene.start('LeafBlowerGarden');
        }
    };
    return Intro;
}(Phaser.Scene));
exports.Intro = Intro;


/***/ }),

/***/ "./src/scenes/leaf-blower-garden.ts":
/*!******************************************!*\
  !*** ./src/scenes/leaf-blower-garden.ts ***!
  \******************************************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements: top-level-this-exports, __webpack_exports__, __webpack_require__ */
/*! CommonJS bailout: this is used directly at 2:17-21 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LeafBlowerGarden = void 0;
var Phaser = __webpack_require__(/*! phaser */ "./node_modules/phaser/dist/phaser.js");
var sceneConfig = {
    active: false,
    visible: false,
    key: 'LeafBlowerGarden',
};
/**
 * The initial scene that loads all necessary assets to the game and displays a loading bar.
 */
var LeafBlowerGarden = /** @class */ (function (_super) {
    __extends(LeafBlowerGarden, _super);
    function LeafBlowerGarden() {
        var _this = _super.call(this, sceneConfig) || this;
        _this.leafs = [];
        _this.cleanerOn = false;
        _this.cleanerVolume = 0;
        _this.collectedLeafs = 0;
        _this.energy = 3000;
        return _this;
    }
    LeafBlowerGarden.prototype.preload = function () {
        this.text = this.add.text(100, 100, 'Starting...').setFontSize(32).setDepth(100).setScrollFactor(0);
        this.sweeperText = this.add.text(0, 0, '').setFontSize(32).setDepth(100);
        // const line = this.add.line(200, 200, 0, 0, 50, 10, 0xff0000);
        // line.rotation = 0.5;
        // this.load.image('man', 'assets/sprites/character.png');
        this.load.image('man', 'assets/sprites/player.png');
        this.load.image('particle', 'assets/sprites/air-particle.png');
        this.load.image('leaf', 'assets/sprites/leaf-4.png');
        this.load.image('background', 'assets/tiles/garden/garden-01-background.png');
        this.load.image('foreground', 'assets/tiles/garden/garden-01-foreground.png');
        this.load.image('sweeper', 'assets/sprites/sweeper.png');
        this.load.spritesheet('leafs', 'assets/sprites/leaf-4.png', { frameWidth: 32, frameHeight: 32 });
        this.load.audio('slurp', 'assets/audio/squit.wav');
        this.load.audio('sweeper-engine', 'assets/audio/diesel-loop.mp3');
        this.load.audio('cleaner', 'assets/audio/leaf-blower-loop.mp3');
        this.load.audio('playerAh', 'assets/audio/player-ah.mp3');
    };
    LeafBlowerGarden.prototype.create = function () {
        var _this = this;
        this.cursorKeys = this.input.keyboard.createCursorKeys();
        this.sweeperSlurp = this.sound.add('slurp');
        this.sweeperEngine = this.sound.add('sweeper-engine', { loop: true });
        this.playerBlower = this.sound.add('cleaner', { loop: true });
        this.playerAh = this.sound.add('playerAh');
        this.physics.world.setBounds(0, 0, 1024, 1024);
        this.cameras.main.setBounds(0, 0, 1024, 1024);
        this.cameras.main.x = Math.max((this.game.canvas.width - 1024) / 2, 0);
        this.cameras.main.y = Math.max((this.game.canvas.height - 1024) / 2, 0);
        this.add.image(0, 0, 'background').setScale(1, 1).setOrigin(0, 0);
        for (var index = 0; index < 2000; index++) {
            var leaf = this.physics.add.sprite(Math.random() * 1024, Math.random() * 1024, "leafs", index % 4);
            leaf.setCollideWorldBounds(true);
            leaf.setDrag(100, 100);
            leaf.setFriction(1000, 1000);
            leaf.setMass(0.01);
            leaf.setBounce(0.5, 0.5);
            leaf.setRotation(Math.random() * Math.PI);
            this.leafs.push(leaf);
        }
        this.player = this.physics.add.sprite(450, 400, 'man');
        this.player.setCollideWorldBounds(true);
        this.cameras.main.startFollow(this.player, true);
        this.obstacles = this.physics.add.staticGroup();
        var obstacle1 = this.add.zone(432, 208, 32, 32);
        // this.add.rectangle(432, 208, 32, 32, 0x80ffffff);
        this.obstacles.add(obstacle1);
        this.sweeper = this.physics.add.sprite(370, 2000, 'sweeper');
        this.sweeper.setVelocityY(130);
        var winParticleManager = this.add.particles('particle');
        this.windParticleEmitter = winParticleManager.createEmitter({ on: false });
        this.windParticleEmitter.setFrequency(0);
        this.windParticleEmitter.setBlendMode(Phaser.BlendModes.NORMAL);
        this.windParticleEmitter.acceleration = true;
        this.add.image(0, 0, 'foreground').setScale(1, 1).setOrigin(0, 0);
        this.playerBlower.play({ volume: 0 });
        this.sweeperText.setVisible(false);
        this.sweeperText.setText('Pass doch auf du Depp ...');
        this.physics.add.collider(this.player, this.obstacles);
        this.physics.add.overlap(this.player, this.sweeper, function () {
            _this.player.setPosition(_this.player.x + 40, _this.player.y);
            _this.playerAh.play();
            _this.sweeperText.setPosition(_this.sweeper.x, _this.sweeper.y);
            _this.sweeperText.setVisible(true);
            _this.time.addEvent({ delay: 3000 }).callback = function () {
                _this.sweeperText.setVisible(false);
            };
        });
    };
    LeafBlowerGarden.prototype.update = function () {
        this.text.setText([
            'Leafs: ' + this.collectedLeafs.toString(),
            'Energy:' + this.energy,
        ]);
        if (this.sweeper.y > 1050) {
            this.sweeper.y = 0;
            this.sweeperEngine.play();
        }
        for (var _i = 0, _a = this.leafs; _i < _a.length; _i++) {
            var leaf = _a[_i];
            if (!leaf.visible) {
                continue;
            }
            var sweeperDistance = Phaser.Math.Distance.Between(this.sweeper.x, this.sweeper.y, leaf.x, leaf.y);
            if (sweeperDistance < 40) {
                leaf.setVisible(false);
                this.sweeperSlurp.play();
                this.collectedLeafs++;
            }
        }
        var manSweeperDistance = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.sweeper.x, this.sweeper.y);
        this.sweeperEngine.setVolume(1 / manSweeperDistance * 100);
        // Phaser.Math.Angle.WrapDegrees(this.man.rotation);
        var manAngle = this.player.rotation;
        var push = new Phaser.Math.Vector2(1, 0);
        push.setAngle(manAngle);
        this.player.setVelocity(0);
        this.windParticleEmitter.on = false;
        if (this.cursorKeys.left.isDown) {
            if (this.cursorKeys.shift.isDown) {
                this.player.setVelocity(push.y * 100, -push.x * 100);
            }
            else {
                manAngle -= 0.05;
            }
        }
        if (this.cursorKeys.right.isDown) {
            if (this.cursorKeys.shift.isDown) {
                this.player.setVelocity(-push.y * 100, push.x * 100);
            }
            else {
                manAngle += 0.05;
            }
        }
        if (this.cursorKeys.up.isDown) {
            this.player.setVelocity(push.x * 100, push.y * 100);
        }
        if (this.cursorKeys.down.isDown) {
            this.player.setVelocity(-push.x * 100, -push.y * 100);
        }
        if (this.cursorKeys.space.isDown && this.energy > 0) {
            this.energy--;
            this.switchCleaner(true);
            for (var _b = 0, _c = this.leafs; _b < _c.length; _b++) {
                var leaf = _c[_b];
                var leafAngle = Phaser.Math.Angle.Between(this.player.x, this.player.y, leaf.x, leaf.y);
                if (leafAngle > manAngle - 0.4 && leafAngle < manAngle + 0.4) {
                    var leafDistance = Phaser.Math.Distance.Between(this.player.x, this.player.y, leaf.x, leaf.y);
                    var lefDistanceFactor = leafDistance / 50 + 1.0;
                    var ref = Math.random() / (lefDistanceFactor * lefDistanceFactor * leafDistance) * 2000;
                    leaf.setVelocity(ref * (leaf.x - this.player.x), ref * (leaf.y - this.player.y));
                }
            }
            this.windParticleEmitter.setPosition(this.player.x + push.x * 50, this.player.y + push.y * 50);
            this.windParticleEmitter.on = true;
            var particleAngle = manAngle / Math.PI * 180.0;
            this.windParticleEmitter.setAngle({ min: particleAngle - 10, max: particleAngle + 10 });
            this.windParticleEmitter.setSpeed({ min: 100, max: 500 });
            this.windParticleEmitter.setScale(0.5);
        }
        else {
            this.switchCleaner(false);
        }
        this.player.setRotation(Phaser.Math.Angle.Wrap(manAngle));
        this.windParticleEmitter.forEachAlive(function (particle, particleEmitter) {
            particle.scaleX = Math.max(particle.lifeT, 0.5);
            particle.scaleY = Math.max(particle.lifeT, 0.5);
        }, null);
    };
    LeafBlowerGarden.prototype.switchCleaner = function (value) {
        if (value) {
            this.cleanerVolume = Math.min(this.cleanerVolume + 10, 100);
        }
        else {
            this.cleanerVolume = Math.max(this.cleanerVolume - 3, 0);
        }
        this.playerBlower.setVolume(this.cleanerVolume / 100.0);
        this.playerBlower.setRate(Math.max(this.cleanerVolume / 100.0, 0.1));
        this.cleanerOn = value;
    };
    return LeafBlowerGarden;
}(Phaser.Scene));
exports.LeafBlowerGarden = LeafBlowerGarden;


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop)
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// Promise = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"app": 0
/******/ 		};
/******/ 		
/******/ 		var deferredModules = [
/******/ 			["./src/main.ts","vendors"]
/******/ 		];
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		var checkDeferredModules = () => {
/******/ 		
/******/ 		};
/******/ 		function checkDeferredModulesImpl() {
/******/ 			var result;
/******/ 			for(var i = 0; i < deferredModules.length; i++) {
/******/ 				var deferredModule = deferredModules[i];
/******/ 				var fulfilled = true;
/******/ 				for(var j = 1; j < deferredModule.length; j++) {
/******/ 					var depId = deferredModule[j];
/******/ 					if(installedChunks[depId] !== 0) fulfilled = false;
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferredModules.splice(i--, 1);
/******/ 					result = __webpack_require__(__webpack_require__.s = deferredModule[0]);
/******/ 				}
/******/ 			}
/******/ 			if(deferredModules.length === 0) {
/******/ 				__webpack_require__.x();
/******/ 				__webpack_require__.x = () => {
/******/ 		
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		}
/******/ 		__webpack_require__.x = () => {
/******/ 			// reset startup function so it can be called again when more startup code is added
/******/ 			__webpack_require__.x = () => {
/******/ 		
/******/ 			}
/******/ 			chunkLoadingGlobal = chunkLoadingGlobal.slice();
/******/ 			for(var i = 0; i < chunkLoadingGlobal.length; i++) webpackJsonpCallback(chunkLoadingGlobal[i]);
/******/ 			return (checkDeferredModules = checkDeferredModulesImpl)();
/******/ 		};
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (data) => {
/******/ 			var [chunkIds, moreModules, runtime, executeModules] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0, resolves = [];
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					resolves.push(installedChunks[chunkId][0]);
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 			for(moduleId in moreModules) {
/******/ 				if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 					__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 				}
/******/ 			}
/******/ 			if(runtime) runtime(__webpack_require__);
/******/ 			parentChunkLoadingFunction(data);
/******/ 			while(resolves.length) {
/******/ 				resolves.shift()();
/******/ 			}
/******/ 		
/******/ 			// add entry modules from loaded chunk to deferred list
/******/ 			if(executeModules) deferredModules.push.apply(deferredModules, executeModules);
/******/ 		
/******/ 			// run deferred modules when all chunks ready
/******/ 			return checkDeferredModules();
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunkleaf_blower_phaser"] = self["webpackChunkleaf_blower_phaser"] || [];
/******/ 		var parentChunkLoadingFunction = chunkLoadingGlobal.push.bind(chunkLoadingGlobal);
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback;
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	// run startup
/******/ 	return __webpack_require__.x();
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9sZWFmLWJsb3dlci1waGFzZXIvLi9zcmMvbWFpbi50cyIsIndlYnBhY2s6Ly9sZWFmLWJsb3dlci1waGFzZXIvLi9zcmMvc2NlbmVzL2luZGV4LnRzIiwid2VicGFjazovL2xlYWYtYmxvd2VyLXBoYXNlci8uL3NyYy9zY2VuZXMvaW50cm8udHMiLCJ3ZWJwYWNrOi8vbGVhZi1ibG93ZXItcGhhc2VyLy4vc3JjL3NjZW5lcy9sZWFmLWJsb3dlci1nYXJkZW4udHMiLCJ3ZWJwYWNrOi8vbGVhZi1ibG93ZXItcGhhc2VyL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2xlYWYtYmxvd2VyLXBoYXNlci93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2xlYWYtYmxvd2VyLXBoYXNlci93ZWJwYWNrL3J1bnRpbWUvanNvbnAgY2h1bmsgbG9hZGluZyIsIndlYnBhY2s6Ly9sZWFmLWJsb3dlci1waGFzZXIvd2VicGFjay9zdGFydHVwIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLHVGQUFpQztBQUNqQyw0RUFBOEI7QUFFOUIsSUFBTSxVQUFVLEdBQWlDO0lBQy9DLEtBQUssRUFBRSxRQUFRO0lBRWYsSUFBSSxFQUFFLE1BQU0sQ0FBQyxJQUFJO0lBRWpCLEtBQUssRUFBRTtRQUNMLEtBQUssRUFBRSxNQUFNLENBQUMsVUFBVTtRQUN4QixNQUFNLEVBQUUsTUFBTSxDQUFDLFdBQVc7S0FDM0I7SUFFRCxLQUFLLEVBQUUsZ0JBQU07SUFFYixPQUFPLEVBQUU7UUFDUCxPQUFPLEVBQUUsUUFBUTtRQUNqQixNQUFNLEVBQUU7WUFDTixLQUFLLEVBQUUsS0FBSztTQUNiO0tBQ0Y7SUFFRCxNQUFNLEVBQUUsTUFBTTtJQUNkLGVBQWUsRUFBRSxTQUFTO0NBQzNCLENBQUM7QUFFVyxZQUFJLEdBQUcsSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FB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Q0FBQyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDL0MsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQzlDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUN2RSxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFHeEUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxZQUFZLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFFbEUsS0FBSyxJQUFJLEtBQUssR0FBRyxDQUFDLEVBQUUsS0FBSyxHQUFHLElBQUksRUFBRSxLQUFLLEVBQUUsRUFBRTtZQUN2QyxJQUFNLElBQUksR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLElBQUksRUFBRSxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsSUFBSSxFQUFFLE9BQU8sRUFBRSxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDckcsSUFBSSxDQUFDLHFCQUFxQixDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ2pDLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLEdBQUcs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O1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQSxNQUFNLG9CQUFvQjtXQUMxQjtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTs7V0FFQTtXQUNBOztXQUVBO1dBQ0E7V0FDQTs7V0FFQTtXQUNBO1dBQ0EsK0M7Ozs7VUMxRkE7VUFDQSIsImZpbGUiOiJhcHAuYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgUGhhc2VyIGZyb20gJ3BoYXNlcic7XHJcbmltcG9ydCBzY2VuZXMgZnJvbSAnLi9zY2VuZXMnO1xyXG5cclxuY29uc3QgZ2FtZUNvbmZpZzogUGhhc2VyLlR5cGVzLkNvcmUuR2FtZUNvbmZpZyA9IHtcclxuICB0aXRsZTogJ1NhbXBsZScsXHJcbiBcclxuICB0eXBlOiBQaGFzZXIuQVVUTyxcclxuIFxyXG4gIHNjYWxlOiB7XHJcbiAgICB3aWR0aDogd2luZG93LmlubmVyV2lkdGgsXHJcbiAgICBoZWlnaHQ6IHdpbmRvdy5pbm5lckhlaWdodCxcclxuICB9LFxyXG4gXHJcbiAgc2NlbmU6IHNjZW5lcyxcclxuXHJcbiAgcGh5c2ljczoge1xyXG4gICAgZGVmYXVsdDogJ2FyY2FkZScsXHJcbiAgICBhcmNhZGU6IHtcclxuICAgICAgZGVidWc6IGZhbHNlLFxyXG4gICAgfSxcclxuICB9LFxyXG4gXHJcbiAgcGFyZW50OiAnZ2FtZScsXHJcbiAgYmFja2dyb3VuZENvbG9yOiAnIzAwMDAwMCcsXHJcbn07XHJcbiBcclxuZXhwb3J0IGNvbnN0IGdhbWUgPSBuZXcgUGhhc2VyLkdhbWUoZ2FtZUNvbmZpZyk7XHJcblxyXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgKCkgPT4ge1xyXG4gIGdhbWUuc2NhbGUucmVmcmVzaCgpO1xyXG59KTtcclxuIiwiaW1wb3J0IHsgSW50cm8gfSBmcm9tICcuL2ludHJvJztcclxuaW1wb3J0IHsgTGVhZkJsb3dlckdhcmRlbiB9IGZyb20gJy4vbGVhZi1ibG93ZXItZ2FyZGVuJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IFtJbnRybywgTGVhZkJsb3dlckdhcmRlbl07XHJcbiIsImltcG9ydCAqIGFzIFBoYXNlciBmcm9tICdwaGFzZXInO1xyXG5cclxuY29uc3Qgc2NlbmVDb25maWc6IFBoYXNlci5UeXBlcy5TY2VuZXMuU2V0dGluZ3NDb25maWcgPSB7XHJcbiAgICBhY3RpdmU6IGZhbHNlLFxyXG4gICAgdmlzaWJsZTogZmFsc2UsXHJcbiAgICBrZXk6ICdJbnRybycsXHJcbn07XHJcbiAgXHJcbmV4cG9ydCBjbGFzcyBJbnRybyBleHRlbmRzIFBoYXNlci5TY2VuZSB7XHJcblxyXG4gICAgcHJpdmF0ZSBjdXJzb3JLZXlzOiBQaGFzZXIuVHlwZXMuSW5wdXQuS2V5Ym9hcmQuQ3Vyc29yS2V5cztcclxuICAgIHByaXZhdGUgbGVhZnM6IFBoYXNlci5QaHlzaWNzLkFyY2FkZS5TcHJpdGVbXSA9IFtdO1xyXG4gICAgcHJpdmF0ZSB0ZXh0OiBQaGFzZXIuR2FtZU9iamVjdHMuVGV4dDtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICBzdXBlcihzY2VuZUNvbmZpZyk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHByZWxvYWQoKTogdm9pZCB7XHJcblxyXG4gICAgICAgIHRoaXMubG9hZC5pbWFnZSgnaW50cm8taW1hZ2UnLCAnYXNzZXRzL2xlYWYtYmxvd2VyLWludG8uanBnJyk7XHJcbiAgICAgICAgdGhpcy5sb2FkLnNwcml0ZXNoZWV0KCdpbnRyby1sZWFmcycsICdhc3NldHMvc3ByaXRlcy9sZWFmLTQucG5nJywgeyBmcmFtZVdpZHRoOiAzMiwgZnJhbWVIZWlnaHQ6IDMyIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBjcmVhdGUoKTogdm9pZCB7XHJcblxyXG4gICAgICAgIHRoaXMuY3Vyc29yS2V5cyA9IHRoaXMuaW5wdXQua2V5Ym9hcmQuY3JlYXRlQ3Vyc29yS2V5cygpO1xyXG5cclxuICAgICAgICBjb25zdCBpbWFnZSA9IHRoaXMuYWRkLmltYWdlKDAsIDAsICdpbnRyby1pbWFnZScpLnNldE9yaWdpbigwLCAwKTtcclxuICAgICAgICBjb25zdCBzY2FsZVggPSBNYXRoLm1pbih0aGlzLmdhbWUuY2FudmFzLndpZHRoLCAxMDI0KSAvIGltYWdlLndpZHRoO1xyXG4gICAgICAgIGltYWdlLnNldFNjYWxlKHNjYWxlWCk7XHJcbiAgICAgICAgY29uc3Qgb2Zmc2V0WCA9ICh0aGlzLmdhbWUuY2FudmFzLndpZHRoIC0gaW1hZ2Uud2lkdGggKiBzY2FsZVgpIC8gMjtcclxuICAgICAgICBpbWFnZS5zZXRYKG9mZnNldFgpO1xyXG5cclxuICAgICAgICB0aGlzLnRleHQgPSB0aGlzLmFkZC50ZXh0KG9mZnNldFggKyAzMDAsIDQwMCwgJycpLnNldEZvbnRTaXplKDQ4KS5zZXRGb250U3R5bGUoJ2JvbGQnKS5zZXRDb2xvcignI2EwMTAwMycpLnNldERlcHRoKDEwMCkuc2V0U2Nyb2xsRmFjdG9yKDApO1xyXG4gICAgICAgIHRoaXMudGV4dC5zZXRUZXh0KFtcclxuICAgICAgICAgICAgJ0ljaCBoYWJlIGVpbmVuIEZyZXVuZCcsXHJcbiAgICAgICAgICAgICdkZXIgaXN0IExhdWJibMOkc2VyJyxcclxuICAgICAgICAgICAgJycsXHJcbiAgICAgICAgICAgICdDdXJzb3Iga2V5cyB0byBtb3ZlLCcsXHJcbiAgICAgICAgICAgICcgU3BhY2UgdG8gYmxvdycsXHJcbiAgICAgICAgICAgICdQcmVzcyBTcGFjZSB0byBzdGFydCdcclxuICAgICAgICBdKTtcclxuXHJcbiAgICAgICAgLy8gLnNldERpc3BsYXlTaXplKDEwMjQsIDEwMjQpLnNldE9yaWdpbigwLCAwKTtcclxuXHJcbiAgICAgICAgdGhpcy50aW1lLmFkZEV2ZW50KHtkZWxheTogMTAwLCBsb29wOiB0cnVlfSkuY2FsbGJhY2sgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmxlYWZzLmxlbmd0aCA+IDUwMDApIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjb25zdCBsZWFmID0gdGhpcy5waHlzaWNzLmFkZC5zcHJpdGUoTWF0aC5yYW5kb20oKSAqIHRoaXMuZ2FtZS5jYW52YXMud2lkdGgsIE1hdGgucmFuZG9tKCkgKiB0aGlzLmdhbWUuY2FudmFzLmhlaWdodCwgXHJcbiAgICAgICAgICAgICAgICBcImludHJvLWxlYWZzXCIsIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDUuMCkpO1xyXG4gICAgICAgICAgICBsZWFmLnNldENvbGxpZGVXb3JsZEJvdW5kcyh0cnVlKTtcclxuICAgICAgICAgICAgbGVhZi5zZXREcmFnKDEwMCwgMTAwKTtcclxuICAgICAgICAgICAgbGVhZi5zZXRGcmljdGlvbigxMDAwLCAxMDAwKTtcclxuICAgICAgICAgICAgbGVhZi5zZXRNYXNzKDAuMDEpO1xyXG4gICAgICAgICAgICBsZWFmLnNldEJvdW5jZSgwLjUsIDAuNSk7XHJcbiAgICAgICAgICAgIGxlYWYuc2V0Um90YXRpb24oTWF0aC5yYW5kb20oKSAqIE1hdGguUEkpO1xyXG4gICAgICAgICAgICB0aGlzLmxlYWZzLnB1c2gobGVhZik7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICB9XHJcblxyXG5cclxuICAgIHB1YmxpYyB1cGRhdGUoKTogdm9pZCB7XHJcbiAgICAgICAgaWYgKHRoaXMuY3Vyc29yS2V5cy5zcGFjZS5pc0Rvd24pIHtcclxuICAgICAgICAgICAgdGhpcy5zY2VuZS5zdGFydCgnTGVhZkJsb3dlckdhcmRlbicpOyAgICAgICAgICAgIFxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIFxyXG59ICBcclxuXHJcblxyXG4iLCJpbXBvcnQgKiBhcyBQaGFzZXIgZnJvbSAncGhhc2VyJztcclxuXHJcbmNvbnN0IHNjZW5lQ29uZmlnOiBQaGFzZXIuVHlwZXMuU2NlbmVzLlNldHRpbmdzQ29uZmlnID0ge1xyXG4gICAgYWN0aXZlOiBmYWxzZSxcclxuICAgIHZpc2libGU6IGZhbHNlLFxyXG4gICAga2V5OiAnTGVhZkJsb3dlckdhcmRlbicsXHJcbn07XHJcbiAgXHJcbi8qKlxyXG4gKiBUaGUgaW5pdGlhbCBzY2VuZSB0aGF0IGxvYWRzIGFsbCBuZWNlc3NhcnkgYXNzZXRzIHRvIHRoZSBnYW1lIGFuZCBkaXNwbGF5cyBhIGxvYWRpbmcgYmFyLlxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIExlYWZCbG93ZXJHYXJkZW4gZXh0ZW5kcyBQaGFzZXIuU2NlbmUge1xyXG5cclxuICAgIHByaXZhdGUgY3Vyc29yS2V5czogUGhhc2VyLlR5cGVzLklucHV0LktleWJvYXJkLkN1cnNvcktleXM7XHJcbiAgICBwcml2YXRlIHBsYXllcjogUGhhc2VyLlBoeXNpY3MuQXJjYWRlLlNwcml0ZTtcclxuICAgIHByaXZhdGUgb2JzdGFjbGVzOiBQaGFzZXIuUGh5c2ljcy5BcmNhZGUuU3RhdGljR3JvdXA7XHJcblxyXG4gICAgcHJpdmF0ZSB3aW5kUGFydGljbGVFbWl0dGVyOiBQaGFzZXIuR2FtZU9iamVjdHMuUGFydGljbGVzLlBhcnRpY2xlRW1pdHRlcjtcclxuICAgIHByaXZhdGUgbGVhZnM6IFBoYXNlci5QaHlzaWNzLkFyY2FkZS5TcHJpdGVbXSA9IFtdO1xyXG4gICAgcHJpdmF0ZSB0ZXh0OiBQaGFzZXIuR2FtZU9iamVjdHMuVGV4dDtcclxuICAgIHByaXZhdGUgc3dlZXBlcjogUGhhc2VyLlBoeXNpY3MuQXJjYWRlLlNwcml0ZTtcclxuICAgIHByaXZhdGUgc3dlZXBlckVuZ2luZTogUGhhc2VyLlNvdW5kLkJhc2VTb3VuZDtcclxuICAgIHByaXZhdGUgc3dlZXBlclRleHQ6IFBoYXNlci5HYW1lT2JqZWN0cy5UZXh0O1xyXG5cclxuICAgIHByaXZhdGUgc3dlZXBlclNsdXJwOiBQaGFzZXIuU291bmQuQmFzZVNvdW5kO1xyXG4gICAgcHJpdmF0ZSBwbGF5ZXJCbG93ZXI6IFBoYXNlci5Tb3VuZC5CYXNlU291bmQ7XHJcbiAgICBwcml2YXRlIGNsZWFuZXJPbjogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgcHJpdmF0ZSBjbGVhbmVyVm9sdW1lOiBudW1iZXIgPSAwO1xyXG5cclxuICAgIHByaXZhdGUgcGxheWVyQWg6IFBoYXNlci5Tb3VuZC5CYXNlU291bmQ7XHJcblxyXG4gICAgcHJpdmF0ZSBjb2xsZWN0ZWRMZWFmczogbnVtYmVyID0gMDtcclxuICAgIHByaXZhdGUgZW5lcmd5OiBudW1iZXIgPSAzMDAwO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHN1cGVyKHNjZW5lQ29uZmlnKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcHJlbG9hZCgpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLnRleHQgPSB0aGlzLmFkZC50ZXh0KDEwMCwgMTAwLCAnU3RhcnRpbmcuLi4nKS5zZXRGb250U2l6ZSgzMikuc2V0RGVwdGgoMTAwKS5zZXRTY3JvbGxGYWN0b3IoMCk7XHJcbiAgICAgICAgdGhpcy5zd2VlcGVyVGV4dCA9IHRoaXMuYWRkLnRleHQoMCwgMCwgJycpLnNldEZvbnRTaXplKDMyKS5zZXREZXB0aCgxMDApO1xyXG5cclxuICAgICAgICAvLyBjb25zdCBsaW5lID0gdGhpcy5hZGQubGluZSgyMDAsIDIwMCwgMCwgMCwgNTAsIDEwLCAweGZmMDAwMCk7XHJcbiAgICAgICAgLy8gbGluZS5yb3RhdGlvbiA9IDAuNTtcclxuXHJcbiAgICAgICAgLy8gdGhpcy5sb2FkLmltYWdlKCdtYW4nLCAnYXNzZXRzL3Nwcml0ZXMvY2hhcmFjdGVyLnBuZycpO1xyXG4gICAgICAgIHRoaXMubG9hZC5pbWFnZSgnbWFuJywgJ2Fzc2V0cy9zcHJpdGVzL3BsYXllci5wbmcnKTtcclxuICAgICAgICB0aGlzLmxvYWQuaW1hZ2UoJ3BhcnRpY2xlJywgJ2Fzc2V0cy9zcHJpdGVzL2Fpci1wYXJ0aWNsZS5wbmcnKTtcclxuICAgICAgICB0aGlzLmxvYWQuaW1hZ2UoJ2xlYWYnLCAnYXNzZXRzL3Nwcml0ZXMvbGVhZi00LnBuZycpO1xyXG4gICAgICAgIHRoaXMubG9hZC5pbWFnZSgnYmFja2dyb3VuZCcsICdhc3NldHMvdGlsZXMvZ2FyZGVuL2dhcmRlbi0wMS1iYWNrZ3JvdW5kLnBuZycpO1xyXG4gICAgICAgIHRoaXMubG9hZC5pbWFnZSgnZm9yZWdyb3VuZCcsICdhc3NldHMvdGlsZXMvZ2FyZGVuL2dhcmRlbi0wMS1mb3JlZ3JvdW5kLnBuZycpO1xyXG4gICAgICAgIHRoaXMubG9hZC5pbWFnZSgnc3dlZXBlcicsICdhc3NldHMvc3ByaXRlcy9zd2VlcGVyLnBuZycpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMubG9hZC5zcHJpdGVzaGVldCgnbGVhZnMnLCAnYXNzZXRzL3Nwcml0ZXMvbGVhZi00LnBuZycsIHsgZnJhbWVXaWR0aDogMzIsIGZyYW1lSGVpZ2h0OiAzMiB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5sb2FkLmF1ZGlvKCdzbHVycCcsICdhc3NldHMvYXVkaW8vc3F1aXQud2F2Jyk7XHJcbiAgICAgICAgdGhpcy5sb2FkLmF1ZGlvKCdzd2VlcGVyLWVuZ2luZScsICdhc3NldHMvYXVkaW8vZGllc2VsLWxvb3AubXAzJyk7XHJcbiAgICAgICAgdGhpcy5sb2FkLmF1ZGlvKCdjbGVhbmVyJywgJ2Fzc2V0cy9hdWRpby9sZWFmLWJsb3dlci1sb29wLm1wMycpO1xyXG4gICAgICAgIHRoaXMubG9hZC5hdWRpbygncGxheWVyQWgnLCAnYXNzZXRzL2F1ZGlvL3BsYXllci1haC5tcDMnKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgY3JlYXRlKCk6IHZvaWQge1xyXG5cclxuICAgICAgICB0aGlzLmN1cnNvcktleXMgPSB0aGlzLmlucHV0LmtleWJvYXJkLmNyZWF0ZUN1cnNvcktleXMoKTtcclxuXHJcbiAgICAgICAgdGhpcy5zd2VlcGVyU2x1cnAgPSB0aGlzLnNvdW5kLmFkZCgnc2x1cnAnKTtcclxuICAgICAgICB0aGlzLnN3ZWVwZXJFbmdpbmUgPSB0aGlzLnNvdW5kLmFkZCgnc3dlZXBlci1lbmdpbmUnLCB7bG9vcDogdHJ1ZX0pO1xyXG5cclxuICAgICAgICB0aGlzLnBsYXllckJsb3dlciA9IHRoaXMuc291bmQuYWRkKCdjbGVhbmVyJywge2xvb3A6IHRydWV9KTtcclxuICAgICAgICB0aGlzLnBsYXllckFoID0gdGhpcy5zb3VuZC5hZGQoJ3BsYXllckFoJyk7XHJcblxyXG4gICAgICAgIHRoaXMucGh5c2ljcy53b3JsZC5zZXRCb3VuZHMoMCwgMCwgMTAyNCwgMTAyNCk7XHJcbiAgICAgICAgdGhpcy5jYW1lcmFzLm1haW4uc2V0Qm91bmRzKDAsIDAsIDEwMjQsIDEwMjQpO1xyXG4gICAgICAgIHRoaXMuY2FtZXJhcy5tYWluLnggPSBNYXRoLm1heCgodGhpcy5nYW1lLmNhbnZhcy53aWR0aCAtIDEwMjQpIC8gMiwgMCk7XHJcbiAgICAgICAgdGhpcy5jYW1lcmFzLm1haW4ueSA9IE1hdGgubWF4KCh0aGlzLmdhbWUuY2FudmFzLmhlaWdodCAtIDEwMjQpIC8gMiwgMCk7XHJcblxyXG5cclxuICAgICAgICB0aGlzLmFkZC5pbWFnZSgwLCAwLCAnYmFja2dyb3VuZCcpLnNldFNjYWxlKDEsIDEpLnNldE9yaWdpbigwLCAwKTtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IDIwMDA7IGluZGV4KyspIHtcclxuICAgICAgICAgICAgY29uc3QgbGVhZiA9IHRoaXMucGh5c2ljcy5hZGQuc3ByaXRlKE1hdGgucmFuZG9tKCkgKiAxMDI0LCBNYXRoLnJhbmRvbSgpICogMTAyNCwgXCJsZWFmc1wiLCBpbmRleCAlIDQpO1xyXG4gICAgICAgICAgICBsZWFmLnNldENvbGxpZGVXb3JsZEJvdW5kcyh0cnVlKTtcclxuICAgICAgICAgICAgbGVhZi5zZXREcmFnKDEwMCwgMTAwKTtcclxuICAgICAgICAgICAgbGVhZi5zZXRGcmljdGlvbigxMDAwLCAxMDAwKTtcclxuICAgICAgICAgICAgbGVhZi5zZXRNYXNzKDAuMDEpO1xyXG4gICAgICAgICAgICBsZWFmLnNldEJvdW5jZSgwLjUsIDAuNSk7XHJcbiAgICAgICAgICAgIGxlYWYuc2V0Um90YXRpb24oTWF0aC5yYW5kb20oKSAqIE1hdGguUEkpO1xyXG4gICAgICAgICAgICB0aGlzLmxlYWZzLnB1c2gobGVhZik7XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgdGhpcy5wbGF5ZXIgPSB0aGlzLnBoeXNpY3MuYWRkLnNwcml0ZSg0NTAsIDQwMCwgJ21hbicpO1xyXG4gICAgICAgIHRoaXMucGxheWVyLnNldENvbGxpZGVXb3JsZEJvdW5kcyh0cnVlKTtcclxuICAgICAgICB0aGlzLmNhbWVyYXMubWFpbi5zdGFydEZvbGxvdyh0aGlzLnBsYXllciwgdHJ1ZSk7XHJcblxyXG4gICAgICAgIHRoaXMub2JzdGFjbGVzID0gdGhpcy5waHlzaWNzLmFkZC5zdGF0aWNHcm91cCgpO1xyXG4gICAgICAgIGNvbnN0IG9ic3RhY2xlMSA9IHRoaXMuYWRkLnpvbmUoNDMyLCAyMDgsIDMyLCAzMik7XHJcbiAgICAgICAgLy8gdGhpcy5hZGQucmVjdGFuZ2xlKDQzMiwgMjA4LCAzMiwgMzIsIDB4ODBmZmZmZmYpO1xyXG4gICAgICAgIHRoaXMub2JzdGFjbGVzLmFkZChvYnN0YWNsZTEpO1xyXG5cclxuICAgICAgICB0aGlzLnN3ZWVwZXIgPSB0aGlzLnBoeXNpY3MuYWRkLnNwcml0ZSgzNzAsIDIwMDAsICdzd2VlcGVyJyk7XHJcbiAgICAgICAgdGhpcy5zd2VlcGVyLnNldFZlbG9jaXR5WSgxMzApO1xyXG5cclxuICAgICAgICBjb25zdCB3aW5QYXJ0aWNsZU1hbmFnZXIgPSB0aGlzLmFkZC5wYXJ0aWNsZXMoJ3BhcnRpY2xlJyk7XHJcbiAgICAgICAgdGhpcy53aW5kUGFydGljbGVFbWl0dGVyID0gd2luUGFydGljbGVNYW5hZ2VyLmNyZWF0ZUVtaXR0ZXIoe29uOiBmYWxzZX0pO1xyXG4gICAgICAgIHRoaXMud2luZFBhcnRpY2xlRW1pdHRlci5zZXRGcmVxdWVuY3koMCk7XHJcbiAgICAgICAgdGhpcy53aW5kUGFydGljbGVFbWl0dGVyLnNldEJsZW5kTW9kZShQaGFzZXIuQmxlbmRNb2Rlcy5OT1JNQUwpO1xyXG4gICAgICAgIHRoaXMud2luZFBhcnRpY2xlRW1pdHRlci5hY2NlbGVyYXRpb24gPSB0cnVlO1xyXG5cclxuICAgICAgICB0aGlzLmFkZC5pbWFnZSgwLCAwLCAnZm9yZWdyb3VuZCcpLnNldFNjYWxlKDEsIDEpLnNldE9yaWdpbigwLCAwKTtcclxuXHJcbiAgICAgICAgdGhpcy5wbGF5ZXJCbG93ZXIucGxheSh7dm9sdW1lOiAwfSk7XHJcblxyXG4gICAgICAgIHRoaXMuc3dlZXBlclRleHQuc2V0VmlzaWJsZShmYWxzZSk7XHJcbiAgICAgICAgdGhpcy5zd2VlcGVyVGV4dC5zZXRUZXh0KCdQYXNzIGRvY2ggYXVmIGR1IERlcHAgLi4uJyk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5waHlzaWNzLmFkZC5jb2xsaWRlcih0aGlzLnBsYXllciwgdGhpcy5vYnN0YWNsZXMpO1xyXG4gICAgICAgIHRoaXMucGh5c2ljcy5hZGQub3ZlcmxhcCh0aGlzLnBsYXllciwgdGhpcy5zd2VlcGVyLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMucGxheWVyLnNldFBvc2l0aW9uKHRoaXMucGxheWVyLnggKyA0MCwgdGhpcy5wbGF5ZXIueSk7XHJcbiAgICAgICAgICAgIHRoaXMucGxheWVyQWgucGxheSgpO1xyXG4gICAgICAgICAgICB0aGlzLnN3ZWVwZXJUZXh0LnNldFBvc2l0aW9uKHRoaXMuc3dlZXBlci54LCB0aGlzLnN3ZWVwZXIueSk7XHJcbiAgICAgICAgICAgIHRoaXMuc3dlZXBlclRleHQuc2V0VmlzaWJsZSh0cnVlKTtcclxuICAgICAgICAgICAgdGhpcy50aW1lLmFkZEV2ZW50KHtkZWxheTogMzAwMH0pLmNhbGxiYWNrID0gKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zd2VlcGVyVGV4dC5zZXRWaXNpYmxlKGZhbHNlKTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcblxyXG5cclxuXHJcblxyXG4gICAgcHVibGljIHVwZGF0ZSgpOiB2b2lkIHtcclxuICAgIFxyXG4gICAgICAgIHRoaXMudGV4dC5zZXRUZXh0KFtcclxuICAgICAgICAgICAgJ0xlYWZzOiAnICsgdGhpcy5jb2xsZWN0ZWRMZWFmcy50b1N0cmluZygpLFxyXG4gICAgICAgICAgICAnRW5lcmd5OicgKyB0aGlzLmVuZXJneSxcclxuLy8gICAgICAgICAgICAnQW5nbGU6JyArIHRoaXMucGxheWVyLmFuZ2xlXHJcbiAgICAgICAgXSk7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLnN3ZWVwZXIueSA+IDEwNTApIHtcclxuICAgICAgICAgICAgdGhpcy5zd2VlcGVyLnkgPSAwO1xyXG4gICAgICAgICAgICB0aGlzLnN3ZWVwZXJFbmdpbmUucGxheSgpO1xyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgIGZvciAobGV0IGxlYWYgb2YgdGhpcy5sZWFmcykge1xyXG4gICAgICAgICAgICBpZiAoIWxlYWYudmlzaWJsZSkge1xyXG4gICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY29uc3Qgc3dlZXBlckRpc3RhbmNlID0gUGhhc2VyLk1hdGguRGlzdGFuY2UuQmV0d2Vlbih0aGlzLnN3ZWVwZXIueCwgdGhpcy5zd2VlcGVyLnksIGxlYWYueCwgbGVhZi55KTtcclxuICAgICAgICAgICAgaWYgKHN3ZWVwZXJEaXN0YW5jZSA8IDQwKSB7XHJcbiAgICAgICAgICAgICAgICBsZWFmLnNldFZpc2libGUoZmFsc2UpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zd2VlcGVyU2x1cnAucGxheSgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jb2xsZWN0ZWRMZWFmcysrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBtYW5Td2VlcGVyRGlzdGFuY2UgPSBQaGFzZXIuTWF0aC5EaXN0YW5jZS5CZXR3ZWVuKHRoaXMucGxheWVyLngsIHRoaXMucGxheWVyLnksIHRoaXMuc3dlZXBlci54LCB0aGlzLnN3ZWVwZXIueSk7XHJcbiAgICAgICAgdGhpcy5zd2VlcGVyRW5naW5lLnNldFZvbHVtZSgxIC8gbWFuU3dlZXBlckRpc3RhbmNlICogMTAwKTtcclxuXHJcblxyXG4gICAgICAgIC8vIFBoYXNlci5NYXRoLkFuZ2xlLldyYXBEZWdyZWVzKHRoaXMubWFuLnJvdGF0aW9uKTtcclxuICAgICAgICBsZXQgbWFuQW5nbGUgPSB0aGlzLnBsYXllci5yb3RhdGlvbjtcclxuICAgICAgICBsZXQgcHVzaCA9IG5ldyBQaGFzZXIuTWF0aC5WZWN0b3IyKDEsIDApO1xyXG4gICAgICAgIHB1c2guc2V0QW5nbGUobWFuQW5nbGUpO1xyXG5cclxuICAgICAgICB0aGlzLnBsYXllci5zZXRWZWxvY2l0eSgwKTtcclxuXHJcbiAgICAgICAgdGhpcy53aW5kUGFydGljbGVFbWl0dGVyLm9uID0gZmFsc2U7XHJcbiAgICAgICAgXHJcblxyXG5cclxuICAgICAgICBpZiAodGhpcy5jdXJzb3JLZXlzLmxlZnQuaXNEb3duKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmN1cnNvcktleXMuc2hpZnQuaXNEb3duKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBsYXllci5zZXRWZWxvY2l0eShwdXNoLnkgKiAxMDAsIC1wdXNoLnggKiAxMDApOyAgICBcclxuICAgICAgICAgICAgfSBcclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBtYW5BbmdsZSAtPSAwLjA1OyAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLmN1cnNvcktleXMucmlnaHQuaXNEb3duKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmN1cnNvcktleXMuc2hpZnQuaXNEb3duKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBsYXllci5zZXRWZWxvY2l0eSgtcHVzaC55ICogMTAwLCBwdXNoLnggKiAxMDApOyAgICBcclxuICAgICAgICAgICAgfSBcclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBtYW5BbmdsZSArPSAwLjA1O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLmN1cnNvcktleXMudXAuaXNEb3duKSB7ICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHRoaXMucGxheWVyLnNldFZlbG9jaXR5KHB1c2gueCAqIDEwMCwgcHVzaC55ICogMTAwKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMuY3Vyc29yS2V5cy5kb3duLmlzRG93bikge1xyXG4gICAgICAgICAgICB0aGlzLnBsYXllci5zZXRWZWxvY2l0eSgtcHVzaC54ICogMTAwLCAtcHVzaC55ICogMTAwKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMuY3Vyc29yS2V5cy5zcGFjZS5pc0Rvd24gJiYgdGhpcy5lbmVyZ3kgPiAwKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZW5lcmd5LS07XHJcbiAgICAgICAgICAgIHRoaXMuc3dpdGNoQ2xlYW5lcih0cnVlKTtcclxuICAgICAgICAgICAgZm9yIChsZXQgbGVhZiBvZiB0aGlzLmxlYWZzKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBsZWFmQW5nbGUgPSBQaGFzZXIuTWF0aC5BbmdsZS5CZXR3ZWVuKHRoaXMucGxheWVyLngsIHRoaXMucGxheWVyLnksIGxlYWYueCwgbGVhZi55KTtcclxuICAgICAgICAgICAgICAgIGlmIChsZWFmQW5nbGUgPiBtYW5BbmdsZSAtIDAuNCAmJiBsZWFmQW5nbGUgPCBtYW5BbmdsZSArIDAuNCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGxlYWZEaXN0YW5jZSA9IFBoYXNlci5NYXRoLkRpc3RhbmNlLkJldHdlZW4odGhpcy5wbGF5ZXIueCwgdGhpcy5wbGF5ZXIueSwgbGVhZi54LCBsZWFmLnkpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGxlZkRpc3RhbmNlRmFjdG9yID0gbGVhZkRpc3RhbmNlIC8gNTAgKyAxLjA7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcmVmID0gTWF0aC5yYW5kb20oKSAvIChsZWZEaXN0YW5jZUZhY3RvciAqIGxlZkRpc3RhbmNlRmFjdG9yICogbGVhZkRpc3RhbmNlKSAqIDIwMDA7XHJcbiAgICAgICAgICAgICAgICAgICAgbGVhZi5zZXRWZWxvY2l0eShyZWYgKiAobGVhZi54IC0gdGhpcy5wbGF5ZXIueCksIHJlZiAqIChsZWFmLnkgLSB0aGlzLnBsYXllci55KSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHRoaXMud2luZFBhcnRpY2xlRW1pdHRlci5zZXRQb3NpdGlvbih0aGlzLnBsYXllci54ICsgcHVzaC54ICogNTAsIHRoaXMucGxheWVyLnkgKyBwdXNoLnkgKiA1MCk7XHJcbiAgICAgICAgICAgIHRoaXMud2luZFBhcnRpY2xlRW1pdHRlci5vbiA9IHRydWU7XHJcbiAgICAgICAgICAgIGNvbnN0IHBhcnRpY2xlQW5nbGUgPSBtYW5BbmdsZSAvIE1hdGguUEkgKiAxODAuMDtcclxuICAgICAgICAgICAgdGhpcy53aW5kUGFydGljbGVFbWl0dGVyLnNldEFuZ2xlKHttaW46IHBhcnRpY2xlQW5nbGUgLSAxMCwgbWF4OiBwYXJ0aWNsZUFuZ2xlICsgMTB9KTtcclxuICAgICAgICAgICAgdGhpcy53aW5kUGFydGljbGVFbWl0dGVyLnNldFNwZWVkKHttaW46IDEwMCwgbWF4OiA1MDB9KTtcclxuICAgICAgICAgICAgdGhpcy53aW5kUGFydGljbGVFbWl0dGVyLnNldFNjYWxlKDAuNSk7IFxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuc3dpdGNoQ2xlYW5lcihmYWxzZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnBsYXllci5zZXRSb3RhdGlvbihQaGFzZXIuTWF0aC5BbmdsZS5XcmFwKG1hbkFuZ2xlKSk7XHJcblxyXG4gICAgICAgIHRoaXMud2luZFBhcnRpY2xlRW1pdHRlci5mb3JFYWNoQWxpdmUoKHBhcnRpY2xlLCBwYXJ0aWNsZUVtaXR0ZXIpID0+IHtcclxuICAgICAgICAgICAgcGFydGljbGUuc2NhbGVYID0gTWF0aC5tYXgocGFydGljbGUubGlmZVQsIDAuNSk7XHJcbiAgICAgICAgICAgIHBhcnRpY2xlLnNjYWxlWSA9IE1hdGgubWF4KHBhcnRpY2xlLmxpZmVULCAwLjUpO1xyXG4gICAgICAgIH0sIG51bGwpO1xyXG5cclxuICAgIH1cclxuICAgIFxyXG5cclxuICAgIHByaXZhdGUgc3dpdGNoQ2xlYW5lcih2YWx1ZTogYm9vbGVhbikge1xyXG4gICAgICAgIGlmICh2YWx1ZSkge1xyXG4gICAgICAgICAgICB0aGlzLmNsZWFuZXJWb2x1bWUgPSBNYXRoLm1pbih0aGlzLmNsZWFuZXJWb2x1bWUgKyAxMCwgMTAwKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLmNsZWFuZXJWb2x1bWUgPSBNYXRoLm1heCh0aGlzLmNsZWFuZXJWb2x1bWUgLSAzLCAwKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5wbGF5ZXJCbG93ZXIuc2V0Vm9sdW1lKHRoaXMuY2xlYW5lclZvbHVtZSAvIDEwMC4wKTtcclxuICAgICAgICB0aGlzLnBsYXllckJsb3dlci5zZXRSYXRlKE1hdGgubWF4KHRoaXMuY2xlYW5lclZvbHVtZSAvIDEwMC4wLCAwLjEpKTtcclxuXHJcbiAgICAgICAgdGhpcy5jbGVhbmVyT24gPSB2YWx1ZTtcclxuICAgIH1cclxuICAgIFxyXG59ICBcclxuXHJcblxyXG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHRpZihfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdKSB7XG5cdFx0cmV0dXJuIF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0uZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbi8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBfX3dlYnBhY2tfbW9kdWxlc19fO1xuXG4iLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSIsIi8vIG5vIGJhc2VVUklcblxuLy8gb2JqZWN0IHRvIHN0b3JlIGxvYWRlZCBhbmQgbG9hZGluZyBjaHVua3Ncbi8vIHVuZGVmaW5lZCA9IGNodW5rIG5vdCBsb2FkZWQsIG51bGwgPSBjaHVuayBwcmVsb2FkZWQvcHJlZmV0Y2hlZFxuLy8gUHJvbWlzZSA9IGNodW5rIGxvYWRpbmcsIDAgPSBjaHVuayBsb2FkZWRcbnZhciBpbnN0YWxsZWRDaHVua3MgPSB7XG5cdFwiYXBwXCI6IDBcbn07XG5cbnZhciBkZWZlcnJlZE1vZHVsZXMgPSBbXG5cdFtcIi4vc3JjL21haW4udHNcIixcInZlbmRvcnNcIl1cbl07XG4vLyBubyBjaHVuayBvbiBkZW1hbmQgbG9hZGluZ1xuXG4vLyBubyBwcmVmZXRjaGluZ1xuXG4vLyBubyBwcmVsb2FkZWRcblxuLy8gbm8gSE1SXG5cbi8vIG5vIEhNUiBtYW5pZmVzdFxuXG52YXIgY2hlY2tEZWZlcnJlZE1vZHVsZXMgPSAoKSA9PiB7XG5cbn07XG5mdW5jdGlvbiBjaGVja0RlZmVycmVkTW9kdWxlc0ltcGwoKSB7XG5cdHZhciByZXN1bHQ7XG5cdGZvcih2YXIgaSA9IDA7IGkgPCBkZWZlcnJlZE1vZHVsZXMubGVuZ3RoOyBpKyspIHtcblx0XHR2YXIgZGVmZXJyZWRNb2R1bGUgPSBkZWZlcnJlZE1vZHVsZXNbaV07XG5cdFx0dmFyIGZ1bGZpbGxlZCA9IHRydWU7XG5cdFx0Zm9yKHZhciBqID0gMTsgaiA8IGRlZmVycmVkTW9kdWxlLmxlbmd0aDsgaisrKSB7XG5cdFx0XHR2YXIgZGVwSWQgPSBkZWZlcnJlZE1vZHVsZVtqXTtcblx0XHRcdGlmKGluc3RhbGxlZENodW5rc1tkZXBJZF0gIT09IDApIGZ1bGZpbGxlZCA9IGZhbHNlO1xuXHRcdH1cblx0XHRpZihmdWxmaWxsZWQpIHtcblx0XHRcdGRlZmVycmVkTW9kdWxlcy5zcGxpY2UoaS0tLCAxKTtcblx0XHRcdHJlc3VsdCA9IF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gZGVmZXJyZWRNb2R1bGVbMF0pO1xuXHRcdH1cblx0fVxuXHRpZihkZWZlcnJlZE1vZHVsZXMubGVuZ3RoID09PSAwKSB7XG5cdFx0X193ZWJwYWNrX3JlcXVpcmVfXy54KCk7XG5cdFx0X193ZWJwYWNrX3JlcXVpcmVfXy54ID0gKCkgPT4ge1xuXG5cdFx0fVxuXHR9XG5cdHJldHVybiByZXN1bHQ7XG59XG5fX3dlYnBhY2tfcmVxdWlyZV9fLnggPSAoKSA9PiB7XG5cdC8vIHJlc2V0IHN0YXJ0dXAgZnVuY3Rpb24gc28gaXQgY2FuIGJlIGNhbGxlZCBhZ2FpbiB3aGVuIG1vcmUgc3RhcnR1cCBjb2RlIGlzIGFkZGVkXG5cdF9fd2VicGFja19yZXF1aXJlX18ueCA9ICgpID0+IHtcblxuXHR9XG5cdGNodW5rTG9hZGluZ0dsb2JhbCA9IGNodW5rTG9hZGluZ0dsb2JhbC5zbGljZSgpO1xuXHRmb3IodmFyIGkgPSAwOyBpIDwgY2h1bmtMb2FkaW5nR2xvYmFsLmxlbmd0aDsgaSsrKSB3ZWJwYWNrSnNvbnBDYWxsYmFjayhjaHVua0xvYWRpbmdHbG9iYWxbaV0pO1xuXHRyZXR1cm4gKGNoZWNrRGVmZXJyZWRNb2R1bGVzID0gY2hlY2tEZWZlcnJlZE1vZHVsZXNJbXBsKSgpO1xufTtcblxuLy8gaW5zdGFsbCBhIEpTT05QIGNhbGxiYWNrIGZvciBjaHVuayBsb2FkaW5nXG52YXIgd2VicGFja0pzb25wQ2FsbGJhY2sgPSAoZGF0YSkgPT4ge1xuXHR2YXIgW2NodW5rSWRzLCBtb3JlTW9kdWxlcywgcnVudGltZSwgZXhlY3V0ZU1vZHVsZXNdID0gZGF0YTtcblx0Ly8gYWRkIFwibW9yZU1vZHVsZXNcIiB0byB0aGUgbW9kdWxlcyBvYmplY3QsXG5cdC8vIHRoZW4gZmxhZyBhbGwgXCJjaHVua0lkc1wiIGFzIGxvYWRlZCBhbmQgZmlyZSBjYWxsYmFja1xuXHR2YXIgbW9kdWxlSWQsIGNodW5rSWQsIGkgPSAwLCByZXNvbHZlcyA9IFtdO1xuXHRmb3IoO2kgPCBjaHVua0lkcy5sZW5ndGg7IGkrKykge1xuXHRcdGNodW5rSWQgPSBjaHVua0lkc1tpXTtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oaW5zdGFsbGVkQ2h1bmtzLCBjaHVua0lkKSAmJiBpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF0pIHtcblx0XHRcdHJlc29sdmVzLnB1c2goaW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdWzBdKTtcblx0XHR9XG5cdFx0aW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdID0gMDtcblx0fVxuXHRmb3IobW9kdWxlSWQgaW4gbW9yZU1vZHVsZXMpIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8obW9yZU1vZHVsZXMsIG1vZHVsZUlkKSkge1xuXHRcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tW21vZHVsZUlkXSA9IG1vcmVNb2R1bGVzW21vZHVsZUlkXTtcblx0XHR9XG5cdH1cblx0aWYocnVudGltZSkgcnVudGltZShfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblx0cGFyZW50Q2h1bmtMb2FkaW5nRnVuY3Rpb24oZGF0YSk7XG5cdHdoaWxlKHJlc29sdmVzLmxlbmd0aCkge1xuXHRcdHJlc29sdmVzLnNoaWZ0KCkoKTtcblx0fVxuXG5cdC8vIGFkZCBlbnRyeSBtb2R1bGVzIGZyb20gbG9hZGVkIGNodW5rIHRvIGRlZmVycmVkIGxpc3Rcblx0aWYoZXhlY3V0ZU1vZHVsZXMpIGRlZmVycmVkTW9kdWxlcy5wdXNoLmFwcGx5KGRlZmVycmVkTW9kdWxlcywgZXhlY3V0ZU1vZHVsZXMpO1xuXG5cdC8vIHJ1biBkZWZlcnJlZCBtb2R1bGVzIHdoZW4gYWxsIGNodW5rcyByZWFkeVxuXHRyZXR1cm4gY2hlY2tEZWZlcnJlZE1vZHVsZXMoKTtcbn1cblxudmFyIGNodW5rTG9hZGluZ0dsb2JhbCA9IHNlbGZbXCJ3ZWJwYWNrQ2h1bmtsZWFmX2Jsb3dlcl9waGFzZXJcIl0gPSBzZWxmW1wid2VicGFja0NodW5rbGVhZl9ibG93ZXJfcGhhc2VyXCJdIHx8IFtdO1xudmFyIHBhcmVudENodW5rTG9hZGluZ0Z1bmN0aW9uID0gY2h1bmtMb2FkaW5nR2xvYmFsLnB1c2guYmluZChjaHVua0xvYWRpbmdHbG9iYWwpO1xuY2h1bmtMb2FkaW5nR2xvYmFsLnB1c2ggPSB3ZWJwYWNrSnNvbnBDYWxsYmFjazsiLCIvLyBydW4gc3RhcnR1cFxucmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18ueCgpO1xuIl0sInNvdXJjZVJvb3QiOiIifQ==