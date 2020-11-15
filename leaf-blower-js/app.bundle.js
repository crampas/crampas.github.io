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
    title: 'Leaf Blower JS',
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
var intro_scene_1 = __webpack_require__(/*! ./intro-scene */ "./src/scenes/intro-scene.ts");
var leaf_blower_scene_1 = __webpack_require__(/*! ./leaf-blower-scene */ "./src/scenes/leaf-blower-scene.ts");
exports.default = [intro_scene_1.IntroScene, leaf_blower_scene_1.LeafBlowerScene];


/***/ }),

/***/ "./src/scenes/intro-scene.ts":
/*!***********************************!*\
  !*** ./src/scenes/intro-scene.ts ***!
  \***********************************/
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
exports.IntroScene = void 0;
var Phaser = __webpack_require__(/*! phaser */ "./node_modules/phaser/dist/phaser.js");
var sceneConfig = {
    active: false,
    visible: false,
    key: 'Intro'
};
var FlowPart = /** @class */ (function () {
    function FlowPart(name, duration, next) {
        this.name = name;
        this.duration = duration;
        this.next = next;
    }
    FlowPart.prototype.repeat = function (callback) {
        this.repeatCallback = callback;
        return this;
    };
    return FlowPart;
}());
var Flow = /** @class */ (function () {
    function Flow() {
        this.parts = [];
        this.currentPart = null;
        this.currentStart = 0;
        this.currentIndex = 0;
        this.currentDuration = 0;
    }
    Flow.prototype.add = function (part) {
        this.parts.push(part);
    };
    Flow.prototype.createPart = function (name, duration, next) {
        var part = new FlowPart(name, duration, next);
        this.parts.push(part);
        return part;
    };
    Flow.prototype.step = function (time) {
        var _this = this;
        if (this.currentPart === null) {
            this.currentPart = this.parts[0];
            this.currentStart = time;
            this.currentIndex = 0;
        }
        else {
            var currentDuration = time - this.currentStart;
            if (currentDuration > this.currentPart.duration) {
                this.currentPart = this.parts.find(function (part) { return part.name == _this.currentPart.next; });
                this.currentStart = time;
                this.currentIndex = 0;
            }
        }
        this.currentPart.repeatCallback(time - this.currentStart, this.currentIndex);
        this.currentIndex++;
    };
    return Flow;
}());
var IntroScene = /** @class */ (function (_super) {
    __extends(IntroScene, _super);
    function IntroScene() {
        var _this = _super.call(this, sceneConfig) || this;
        _this.leafs = [];
        _this.workflow = new Flow();
        return _this;
    }
    IntroScene.prototype.preload = function () {
        this.load.image('intro-image', 'assets/leaf-blower-into.jpg');
        this.load.spritesheet('intro-leafs', 'assets/sprites/leaf-4.png', { frameWidth: 32, frameHeight: 32 });
    };
    IntroScene.prototype.create = function () {
        var _this = this;
        this.cursorKeys = this.input.keyboard.createCursorKeys();
        var image = this.add.image(0, 0, 'intro-image').setOrigin(0, 0);
        var scale = Math.max(this.game.canvas.width / image.width, this.game.canvas.height / image.height);
        image.setScale(scale);
        var fontSize = this.game.canvas.width / 32;
        this.text = this.add.text(0, 0, '').setFontSize(fontSize).setFontStyle('bold').setDepth(100).setScrollFactor(0);
        this.text.setText([
            'Ich habe einen Freund',
            'der ist Laubbläser',
            '',
            'Cursor keys to move,',
            ' Space to blow',
            'Press Space to start'
        ]);
        this.text.setFill('#a01003');
        this.text.setStroke('#ffffff', 4);
        this.text.x = this.game.canvas.width - this.text.width - fontSize;
        this.text.y = this.game.canvas.height - this.text.height - fontSize;
        this.workflow.createPart('create', 10000, 'move').repeat(function () {
            var leaf = _this.physics.add.sprite(Math.random() * _this.game.canvas.width, Math.random() * _this.game.canvas.height, "intro-leafs", Math.floor(Math.random() * 5.0));
            leaf.setMass(0.01);
            leaf.setDrag(10, 10);
            leaf.setBounce(0.5, 0.5);
            leaf.setRotation(Math.random() * Math.PI);
            leaf.setScale(Math.random() * 10.0);
            _this.leafs.push(leaf);
        });
        this.workflow.createPart('return', 10000, 'move').repeat(function (time, index) {
            if (index < _this.leafs.length) {
                var leaf = _this.leafs[index];
                leaf.setVelocity(0, 0);
                if (leaf.x < 0 || leaf.x > _this.game.canvas.width ||
                    leaf.y < 0 || leaf.y > _this.game.canvas.height) {
                    leaf.setPosition(Math.random() * _this.game.canvas.width, Math.random() * _this.game.canvas.height);
                    leaf.setScale(Math.random() * 10.0);
                }
            }
        });
        this.workflow.createPart('move', -1, 'wait').repeat(function () {
            _this.cameras.main.shake(500);
            _this.leafs.forEach(function (leaf) {
                leaf.setVelocity(Math.random() * 800 - 400, Math.random() * 800 - 400);
            });
        });
        this.workflow.createPart('wait', 5000, 'return').repeat(function () {
        });
    };
    IntroScene.prototype.update = function () {
        this.workflow.step(this.time.now);
        this.leafs.forEach(function (leaf) {
            if (leaf.scale > 1.0) {
                leaf.setScale((leaf.scale - 1.0) * 0.99 + 1.0);
            }
        });
        if (this.cursorKeys.space.isDown || this.input.activePointer.isDown) {
            this.scene.start('LeafBlowerScene');
        }
    };
    return IntroScene;
}(Phaser.Scene));
exports.IntroScene = IntroScene;


/***/ }),

/***/ "./src/scenes/leaf-blower-scene.ts":
/*!*****************************************!*\
  !*** ./src/scenes/leaf-blower-scene.ts ***!
  \*****************************************/
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
exports.LeafBlowerScene = void 0;
var Phaser = __webpack_require__(/*! phaser */ "./node_modules/phaser/dist/phaser.js");
var leaf_blower_1 = __webpack_require__(/*! ./leaf-blower */ "./src/scenes/leaf-blower.ts");
var road_sweeper_1 = __webpack_require__(/*! ./road-sweeper */ "./src/scenes/road-sweeper.ts");
var sceneConfig = {
    active: false,
    visible: false,
    key: 'LeafBlowerScene',
};
var LeafBlowerScene = /** @class */ (function (_super) {
    __extends(LeafBlowerScene, _super);
    function LeafBlowerScene() {
        var _this = _super.call(this, sceneConfig) || this;
        _this.leafs = [];
        _this.energy = 3000;
        _this.blower = new leaf_blower_1.LeafBlower(_this, _this.leafs);
        _this.sweeper = new road_sweeper_1.RoadSweeper(_this, _this.leafs);
        return _this;
    }
    LeafBlowerScene.prototype.preload = function () {
        var fontSize = Math.min(this.game.canvas.width, 1024) / 32;
        this.text = this.add.text(fontSize, fontSize, 'Starting...').setFontSize(fontSize).setDepth(100).setScrollFactor(0);
        this.sweeperText = this.add.text(0, 0, '').setFontSize(fontSize).setDepth(100);
        this.load.image('player', 'assets/sprites/player.png');
        this.load.image('leaf', 'assets/sprites/leaf-4.png');
        this.load.image('background', 'assets/tiles/garden/garden-01-background.png');
        this.load.image('foreground', 'assets/tiles/garden/garden-01-foreground.png');
        this.load.spritesheet('leafs', 'assets/sprites/leaf-4.png', { frameWidth: 32, frameHeight: 32 });
        this.load.audio('playerAh', 'assets/audio/player-ah.mp3');
        this.blower.preload();
        this.sweeper.preload();
    };
    LeafBlowerScene.prototype.create = function () {
        var _this = this;
        this.cursorKeys = this.input.keyboard.createCursorKeys();
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
        this.player = this.physics.add.sprite(450, 400, 'player');
        this.player.setCollideWorldBounds(true);
        this.cameras.main.startFollow(this.player, true);
        this.obstacles = this.physics.add.staticGroup();
        var obstacle1 = this.add.zone(432, 208, 32, 32);
        // this.add.rectangle(432, 208, 32, 32, 0x80ffffff);
        this.obstacles.add(obstacle1);
        this.physics.add.collider(this.player, this.obstacles);
        this.blower.player = this.player;
        this.blower.create();
        this.sweeper.player = this.player;
        this.sweeper.create();
        this.sweeper.onCollidePlayer = function () {
            _this.player.setPosition(_this.player.x + 40, _this.player.y);
            _this.playerAh.play();
            _this.sweeperText.setPosition(_this.sweeper.sweeper.x, _this.sweeper.sweeper.y);
            _this.sweeperText.setVisible(true);
            _this.time.addEvent({ delay: 3000 }).callback = function () {
                _this.sweeperText.setVisible(false);
            };
        };
        this.add.image(0, 0, 'foreground').setScale(1, 1).setOrigin(0, 0);
        this.sweeperText.setVisible(false);
        this.sweeperText.setText('Pass doch auf du Depp ...');
    };
    LeafBlowerScene.prototype.update = function () {
        var playerNewRotation = 0;
        var playerNewVelocity = new Phaser.Math.Vector2(0, 0);
        if (this.cursorKeys.left.isDown) {
            if (this.cursorKeys.shift.isDown) {
                playerNewVelocity.y = -100;
            }
            else {
                playerNewRotation = -0.05;
            }
        }
        if (this.cursorKeys.right.isDown) {
            if (this.cursorKeys.shift.isDown) {
                playerNewVelocity.y = 100;
            }
            else {
                playerNewRotation = 0.05;
            }
        }
        if (this.cursorKeys.up.isDown) {
            playerNewVelocity.x = 100;
        }
        if (this.cursorKeys.down.isDown) {
            playerNewVelocity.x = -100;
        }
        playerNewVelocity.rotate(this.player.rotation);
        this.player.setVelocity(playerNewVelocity.x, playerNewVelocity.y);
        this.player.setRotation(Phaser.Math.Angle.Wrap(this.player.rotation + playerNewRotation));
        this.blower.isBlowing = false;
        if (this.cursorKeys.space.isDown && this.energy > 0) {
            this.energy--;
            this.blower.isBlowing = true;
        }
        this.blower.update();
        this.sweeper.update();
        this.text.setText([
            'Leafs: ' + this.sweeper.collectedLeafs.toString(),
            'Energy:' + this.energy,
        ]);
    };
    return LeafBlowerScene;
}(Phaser.Scene));
exports.LeafBlowerScene = LeafBlowerScene;


/***/ }),

/***/ "./src/scenes/leaf-blower.ts":
/*!***********************************!*\
  !*** ./src/scenes/leaf-blower.ts ***!
  \***********************************/
/*! flagged exports */
/*! export LeafBlower [provided] [no usage info] [missing usage info prevents renaming] */
/*! export __esModule [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_exports__, __webpack_require__ */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LeafBlower = void 0;
var Phaser = __webpack_require__(/*! phaser */ "./node_modules/phaser/dist/phaser.js");
var LeafBlower = /** @class */ (function () {
    function LeafBlower(scene, leafs) {
        this.scene = scene;
        this.leafs = leafs;
        this.cleanerVolume = 0;
    }
    LeafBlower.prototype.preload = function () {
        this.scene.load.audio('cleaner', 'assets/audio/leaf-blower-loop.mp3');
        this.scene.load.image('particle', 'assets/sprites/air-particle.png');
    };
    LeafBlower.prototype.create = function () {
        var winParticleManager = this.scene.add.particles('particle');
        this.windParticleEmitter = winParticleManager.createEmitter({ on: false });
        this.windParticleEmitter.setFrequency(0);
        this.windParticleEmitter.setBlendMode(Phaser.BlendModes.NORMAL);
        this.windParticleEmitter.acceleration = true;
        this.blowerSound = this.scene.sound.add('cleaner', { loop: true });
        this.blowerSound.play({ volume: 0 });
    };
    LeafBlower.prototype.blow = function () {
        // emit air particles
        var push = new Phaser.Math.Vector2(1, 0);
        push.setAngle(this.player.rotation);
        this.windParticleEmitter.setPosition(this.player.x + push.x * 50, this.player.y + push.y * 50);
        this.windParticleEmitter.on = true;
        var particleAngleMin = this.player.rotation - LeafBlower.BLOWER_OPENING_ANGLE;
        var particleAngleMax = this.player.rotation + LeafBlower.BLOWER_OPENING_ANGLE;
        this.windParticleEmitter.setAngle({ min: Phaser.Math.RadToDeg(particleAngleMin), max: Phaser.Math.RadToDeg(particleAngleMax) });
        this.windParticleEmitter.setSpeed({ min: 100, max: 500 });
        this.windParticleEmitter.setScale(0.5);
        // move leafs
        for (var _i = 0, _a = this.leafs; _i < _a.length; _i++) {
            var leaf = _a[_i];
            var leafAngle = Phaser.Math.Angle.Between(this.player.x, this.player.y, leaf.x, leaf.y);
            var diffAngle = angleDiff(leafAngle, this.player.rotation);
            if (diffAngle > -LeafBlower.BLOWER_OPENING_ANGLE && diffAngle < LeafBlower.BLOWER_OPENING_ANGLE) {
                var leafDistance = Phaser.Math.Distance.Between(this.player.x, this.player.y, leaf.x, leaf.y);
                var lefDistanceFactor = leafDistance / 50 + 1.0;
                var ref = Math.random() / (lefDistanceFactor * lefDistanceFactor * leafDistance) * 2000;
                leaf.setVelocity(Math.min(ref * (leaf.x - this.player.x), 500), Math.min(ref * (leaf.y - this.player.y), 500));
            }
        }
    };
    LeafBlower.prototype.update = function () {
        this.windParticleEmitter.on = false;
        if (this.isBlowing) {
            this.switchBlowerSound(true);
            this.blow();
        }
        else {
            this.switchBlowerSound(false);
        }
        this.windParticleEmitter.forEachAlive(function (particle, particleEmitter) {
            particle.scaleX = Math.max(particle.lifeT, 0.5);
            particle.scaleY = Math.max(particle.lifeT, 0.5);
        }, null);
    };
    LeafBlower.prototype.switchBlowerSound = function (value) {
        if (value) {
            this.cleanerVolume = Math.min(this.cleanerVolume + 10, 100);
        }
        else {
            this.cleanerVolume = Math.max(this.cleanerVolume - 3, 0);
        }
        this.blowerSound.setVolume(this.cleanerVolume / 100.0);
        this.blowerSound.setRate(Math.max(this.cleanerVolume / 100.0, 0.1));
    };
    LeafBlower.BLOWER_OPENING_ANGLE = 0.2;
    return LeafBlower;
}());
exports.LeafBlower = LeafBlower;
function angleDiff(angle1, angle2) {
    var diff = angle2 - angle1;
    diff = diff < -Math.PI ? diff + Math.PI + Math.PI : diff;
    diff = diff > Math.PI ? diff - Math.PI - Math.PI : diff;
    return diff;
}


/***/ }),

/***/ "./src/scenes/road-sweeper.ts":
/*!************************************!*\
  !*** ./src/scenes/road-sweeper.ts ***!
  \************************************/
/*! flagged exports */
/*! export RoadSweeper [provided] [no usage info] [missing usage info prevents renaming] */
/*! export __esModule [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_exports__ */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RoadSweeper = void 0;
var RoadSweeper = /** @class */ (function () {
    function RoadSweeper(scene, leafs) {
        this.scene = scene;
        this.leafs = leafs;
        this.collectedLeafs = 0;
    }
    RoadSweeper.prototype.preload = function () {
        this.scene.load.image('sweeper', 'assets/sprites/sweeper.png');
        this.scene.load.audio('slurp', 'assets/audio/squit.wav');
        this.scene.load.audio('sweeper-engine', 'assets/audio/diesel-loop.mp3');
    };
    RoadSweeper.prototype.create = function () {
        var _this = this;
        this.sweeper = this.scene.physics.add.sprite(370, 2000, 'sweeper');
        this.sweeper.setVelocityY(130);
        this.sweeperSlurp = this.scene.sound.add('slurp');
        this.sweeperEngine = this.scene.sound.add('sweeper-engine', { loop: true });
        this.scene.physics.add.overlap(this.player, this.sweeper, function () {
            if (_this.onCollidePlayer) {
                _this.onCollidePlayer();
            }
        });
    };
    RoadSweeper.prototype.update = function () {
        if (this.sweeper.y > 1050) {
            this.sweeper.y = 0;
            this.sweeperEngine.play();
        }
        var playerSweeperDistance = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.sweeper.x, this.sweeper.y);
        this.sweeperEngine.setVolume(1 / playerSweeperDistance * 100);
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
    };
    return RoadSweeper;
}());
exports.RoadSweeper = RoadSweeper;


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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9sZWFmLWJsb3dlci1waGFzZXIvLi9zcmMvbWFpbi50cyIsIndlYnBhY2s6Ly9sZWFmLWJsb3dlci1waGFzZXIvLi9zcmMvc2NlbmVzL2luZGV4LnRzIiwid2VicGFjazovL2xlYWYtYmxvd2VyLXBoYXNlci8uL3NyYy9zY2VuZXMvaW50cm8tc2NlbmUudHMiLCJ3ZWJwYWNrOi8vbGVhZi1ibG93ZXItcGhhc2VyLy4vc3JjL3NjZW5lcy9sZWFmLWJsb3dlci1zY2VuZS50cyIsIndlYnBhY2s6Ly9sZWFmLWJsb3dlci1waGFzZXIvLi9zcmMvc2NlbmVzL2xlYWYtYmxvd2VyLnRzIiwid2VicGFjazovL2xlYWYtYmxvd2VyLXBoYXNlci8uL3NyYy9zY2VuZXMvcm9hZC1zd2VlcGVyLnRzIiwid2VicGFjazovL2xlYWYtYmxvd2VyLXBoYXNlci93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9sZWFmLWJsb3dlci1waGFzZXIvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9sZWFmLWJsb3dlci1waGFzZXIvd2VicGFjay9ydW50aW1lL2pzb25wIGNodW5rIGxvYWRpbmciLCJ3ZWJwYWNrOi8vbGVhZi1ibG93ZXItcGhhc2VyL3dlYnBhY2svc3RhcnR1cCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSx1RkFBaUM7QUFDakMsNEVBQThCO0FBRTlCLElBQU0sVUFBVSxHQUFpQztJQUMvQyxLQUFLLEVBQUUsZ0JBQWdCO0lBRXZCLElBQUksRUFBRSxNQUFNLENBQUMsSUFBSTtJQUVqQixLQUFLLEVBQUU7UUFDTCxLQUFLLEVBQUUsTUFBTSxDQUFDLFVBQVU7UUFDeEIsTUFBTSxFQUFFLE1BQU0sQ0FBQyxXQUFXO0tBQzNCO0lBRUQsS0FBSyxFQUFFLGdCQUFNO0lBRWIsT0FBTyxFQUFFO1FBQ1AsT0FBTyxFQUFFLFFBQVE7UUFDakIsTUFBTSxFQUFFO1lB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RSxDQUFDO1FBRXpELElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUM7UUFFM0MsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQy9DLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztRQUM5QyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDdkUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBR3hFLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsWUFBWSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBRWxFLEtBQUssSUFBSSxLQUFLLEdBQUcsQ0FBQyxFQUFFLEtBQUssR0FBRyxJQUFJLEVBQUUsS0FBSyxFQUFFLEVBQUU7WUFDdkMsSUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxJQUFJLEVBQUUsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLElBQUksRUFBRSxPQUFPLEVBQUUsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQ3JHLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNqQyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztZQUN2QixJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztZQUM3QixJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ25CLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1lBQ3pCLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUMxQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUN6QjtRQUdELElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFDMUQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxxQkFBcUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN4QyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQztRQUVqRCxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLFdBQVcsRUFBRSxDQUFDO1FBQ2hELElBQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQ2xELG9EQUFvRDtRQUNwRCxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUM5QixJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7UUFFdkQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztRQUNqQyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBRXJCLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7UUFDbEMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUN0QixJQUFJLENBQUMsT0FBTyxDQUFDLGVBQWUsR0FBRztZQUMzQixLQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxLQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUUsS0FBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUMzRCxLQUFJLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDO1lBQ3JCLEtBQUksQ0FBQyxXQUFXLENBQUMsV0FBVyxDQUFDLEtBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBRSxLQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM3RSxLQUFJLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNsQyxLQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFDLEtBQUssRUFBRSxJQUFJLEVBQUMsQ0FBQyxDQUFDLFFBQVEsR0FBRztnQkFDekMsS0FBSSxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDdkMsQ0FBQyxDQUFDO1FBQ04sQ0FBQztRQUVELElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsWUFBWSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBRWxFLElBQUksQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ25DLElBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLDJCQUEyQixDQUFDLENBQUM7SUFFMUQsQ0FBQztJQUlNLGdDQUFNLEdBQWI7UUFFSSxJQUFJLGlCQUFpQixHQUFHLENBQUMsQ0FBQztRQUMxQixJQUFJLGlCQUFpQixHQUFHLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBRXRELElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFO1lBQzdCLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFO2dCQUM5QixpQkFBaUIsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUM7YUFDOUI7aUJBQ0k7Z0JBQ0QsaUJBQWlCLEdBQUcsQ0FBQyxJQUFJLENBQUM7YUFDN0I7U0FDSjtRQUNELElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFO1lBQzlCLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFO2dCQUM5QixpQkFBaUIsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDO2FBQzdCO2lCQUNJO2dCQUNELGlCQUFpQixHQUFHLElBQUksQ0FBQzthQUM1QjtTQUNKO1FBQ0QsSUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxNQUFNLEVBQUU7WUFDM0IsaUJBQWlCLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQztTQUM3QjtRQUNELElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFO1lBQzdCLGlCQUFpQixDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQztTQUM5QjtRQUVELGlCQUFpQixDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQy9DLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLGlCQUFpQixDQUFDLENBQUMsRUFBRSxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNsRSxJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLEdBQUcsaUJBQWlCLENBQUMsQ0FBQyxDQUFDO1FBRTFGLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztRQUM5QixJQUFJLElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtZQUNqRCxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7WUFDZCxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7U0FDaEM7UUFJRCxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQ3JCLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUM7UUFFdEIsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUM7WUFDZCxTQUFTLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsUUFBUSxFQUFFO1lBQ2xELFNBQVMsR0FBRyxJQUFJLENBQUMsTUFBTTtTQU0xQixDQUFDLENBQUM7SUFFUCxDQUFDO0lBR0wsc0JBQUM7QUFBRCxDQUFDLENBL0pvQyxNQUFNLENBQUMsS0FBSyxHQStKaEQ7QUEvSlksMENBQWU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNYNUIsdUZBQWlDO0FBSWpDO0lBWUksb0JBQTBCLEtBQW1CLEVBQVMsS0FBcUM7UUFBakUsVUFBSyxHQUFMLEtBQUssQ0FBYztRQUFTLFVBQUssR0FBTCxLQUFLLENBQWdDO1FBTHBGLGtCQUFhLEdBQVcsQ0FBQyxDQUFDO0lBTWpDLENBQUM7SUFFTSw0QkFBTyxHQUFkO1FBQ0ksSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsRUFBRSxtQ0FBbUMsQ0FBQyxDQUFDO1FBQ3RFLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLEVBQUUsaUNBQWlDLENBQUMsQ0FBQztJQUN6RSxDQUFDO0lBRU0sMkJBQU0sR0FBYjtRQUNJLElBQU0sa0JBQWtCLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ2hFLElBQUksQ0FBQyxtQkFBbUIsR0FBRyxrQkFBa0IsQ0FBQyxhQUFhLENBQUMsRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQztRQUMzRSxJQUFJLENBQUMsbUJBQW1CLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3pDLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNoRSxJQUFJLENBQUMsbUJBQW1CLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQztRQUU3QyxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxTQUFTLEVBQUUsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLENBQStCLENBQUM7UUFDakcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUN6QyxDQUFDO0lBRU0seUJBQUksR0FBWDtRQUVJLHFCQUFxQjtRQUNyQixJQUFJLElBQUksR0FBRyxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUN6QyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDcEMsSUFBSSxDQUFDLG1CQUFtQixDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDO1FBQy9GLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDO1FBQ25DLElBQU0sZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLEdBQUcsVUFBVSxDQUFDLG9CQUFvQixDQUFDO1FBQ2hGLElBQU0sZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLEdBQUcsVUFBVSxDQUFDLG9CQUFvQixDQUFDO1FBQ2hGLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxRQUFRLENBQUMsRUFBRSxHQUFHLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsZ0JBQWdCLENBQUMsRUFBRSxHQUFHLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsZ0JBQWdCLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDaEksSUFBSSxDQUFDLG1CQUFtQixDQUFDLFFBQVEsQ0FBQyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7UUFDMUQsSUFBSSxDQUFDLG1CQUFtQixDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUV2QyxhQUFhO1FBQ2IsS0FBaUIsVUFBVSxFQUFWLFNBQUksQ0FBQyxLQUFLLEVBQVYsY0FBVSxFQUFWLElBQVUsRUFBRTtZQUF4QixJQUFJLElBQUk7WUFDVCxJQUFNLFNBQVMsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDMUYsSUFBTSxTQUFTLEdBQUcsU0FBUyxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQzdELElBQUksU0FBUyxHQUFHLENBQUMsVUFBVSxDQUFDLG9CQUFvQixJQUFJLFNBQVMsR0FBRyxVQUFVLENBQUMsb0JBQW9CLEVBQUU7Z0JBQzdGLElBQU0sWUFBWSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDaEcsSUFBTSxpQkFBaUIsR0FBRyxZQUFZLEdBQUcsRUFBRSxHQUFHLEdBQUcsQ0FBQztnQkFDbEQsSUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsaUJBQWlCLEdBQUcsaUJBQWlCLEdBQUcsWUFBWSxDQUFDLEdBQUcsSUFBSSxDQUFDO2dCQUMxRixJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7YUFDbEg7U0FDSjtJQUNMLENBQUM7SUFHTSwyQkFBTSxHQUFiO1FBQ0ksSUFBSSxDQUFDLG1CQUFtQixDQUFDLEVBQUUsR0FBRyxLQUFLLENBQUM7UUFDcEMsSUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFO1lBQ2hCLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUM3QixJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7U0FDZjthQUNJO1lBQ0QsSUFBSSxDQUFDLGlCQUFpQixDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQ2pDO1FBRUQsSUFBSSxDQUFDLG1CQUFtQixDQUFDLFlBQVksQ0FBQyxVQUFDLFFBQVEsRUFBRSxlQUFlO1lBQzVELFFBQVEsQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1lBQ2hELFFBQVEsQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQ3BELENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztJQUNiLENBQUM7SUFHTyxzQ0FBaUIsR0FBekIsVUFBMEIsS0FBYztRQUNwQyxJQUFJLEtBQUssRUFBRTtZQUNQLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsYUFBYSxHQUFHLEVBQUUsRUFBRSxHQUFHLENBQUMsQ0FBQztTQUMvRDthQUNJO1lBQ0QsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxhQUFhLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1NBQzVEO1FBQ0QsSUFBSSxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLGFBQWEsR0FBRyxLQUFLLENBQUMsQ0FBQztRQUN2RCxJQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxhQUFhLEdBQUcsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFDeEUsQ0FBQztJQTNFc0IsK0JBQW9CLEdBQUcsR0FBRyxDQUFDO0lBNEV0RCxpQkFBQztDQUFBO0FBckZZLGdDQUFVO0FBd0Z2QixTQUFTLFNBQVMsQ0FBQyxNQUFjLEVBQUUsTUFBYztJQUM3QyxJQUFJLElBQUksR0FBRyxNQUFNLEdBQUcsTUFBTSxDQUFDO0lBQzNCLElBQUksR0FBRyxJQUFJLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7SUFDekQsSUFBSSxHQUFHLElBQUksR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7SUFDeEQsT0FBTyxJQUFJLENBQUM7QUFDaEIsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQzlGRDtJQVlJLHFCQUEwQixLQUFtQixFQUFTLEtBQXFDO1FBQWpFLFVBQUssR0FBTCxLQUFLLENBQWM7UUFBUyxVQUFLLEdBQUwsS0FBSyxDQUFnQztRQVBwRixtQkFBYyxHQUFXLENBQUMsQ0FBQztJQVFsQyxDQUFDO0lBRU0sNkJBQU8sR0FBZDtRQUNJLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLEVBQUUsNEJBQTRCLENBQUMsQ0FBQztRQUMvRCxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLHdCQUF3QixDQUFDLENBQUM7UUFDekQsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLGdCQUFnQixFQUFFLDhCQUE4QixDQUFDLENBQUM7SUFDNUUsQ0FBQztJQUVNLDRCQUFNLEdBQWI7UUFBQSxpQkFZQztRQVhHLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBQ25FLElBQUksQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBRS9CLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBK0IsQ0FBQztRQUNoRixJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsRUFBRSxFQUFDLElBQUksRUFBRSxJQUFJLEVBQUMsQ0FBK0IsQ0FBQztRQUV4RyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLE9BQU8sRUFBRTtZQUN0RCxJQUFJLEtBQUksQ0FBQyxlQUFlLEVBQUU7Z0JBQ3RCLEtBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQzthQUMxQjtRQUNMLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVNLDRCQUFNLEdBQWI7UUFFSSxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLElBQUksRUFBRTtZQUN2QixJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDbkIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLEVBQUUsQ0FBQztTQUM3QjtRQUNELElBQU0scUJBQXFCLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDekgsSUFBSSxDQUFDLGFBQWEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxHQUFHLHFCQUFxQixHQUFHLEdBQUcsQ0FBQyxDQUFDO1FBRTlELEtBQWlCLFVBQVUsRUFBVixTQUFJLENBQUMsS0FBSyxFQUFWLGNBQVUsRUFBVixJQUFVLEVBQUU7WUFBeEIsSUFBSSxJQUFJO1lBQ1QsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUU7Z0JBQ2YsU0FBUzthQUNaO1lBQ0QsSUFBTSxlQUFlLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3JHLElBQUksZUFBZSxHQUFHLEVBQUUsRUFBRTtnQkFDdEIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDdkIsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsQ0FBQztnQkFDekIsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO2FBQ3pCO1NBQ0o7SUFFTCxDQUFDO0lBRUwsa0JBQUM7QUFBRCxDQUFDO0FBMURZLGtDQUFXOzs7Ozs7O1VDSHhCO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOztVQUVBO1VBQ0E7Ozs7O1dDeEJBLHNGOzs7OztXQ0FBOztXQUVBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTs7V0FFQTtXQUNBO1dBQ0E7V0FDQTs7V0FFQTs7V0FFQTs7V0FFQTs7V0FFQTs7V0FFQTs7V0FFQTtXQUNBO1dBQ0E7V0FDQSxlQUFlLDRCQUE0QjtXQUMzQztXQUNBO1dBQ0EsZ0JBQWdCLDJCQUEyQjtXQUMzQztXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBOztXQUVBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBOztXQUVBO1dBQ0E7V0FDQSxlQUFlLCtCQUErQjtXQUM5QztXQUNBOztXQUVBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLE1BQU0sb0JBQW9CO1dBQzFCO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBOztXQUVBO1dBQ0E7O1dBRUE7V0FDQTtXQUNBOztXQUVBO1dBQ0E7V0FDQSwrQzs7OztVQzFGQTtVQUNBIiwiZmlsZSI6ImFwcC5idW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBQaGFzZXIgZnJvbSAncGhhc2VyJztcclxuaW1wb3J0IHNjZW5lcyBmcm9tICcuL3NjZW5lcyc7XHJcblxyXG5jb25zdCBnYW1lQ29uZmlnOiBQaGFzZXIuVHlwZXMuQ29yZS5HYW1lQ29uZmlnID0ge1xyXG4gIHRpdGxlOiAnTGVhZiBCbG93ZXIgSlMnLFxyXG4gXHJcbiAgdHlwZTogUGhhc2VyLkFVVE8sXHJcbiBcclxuICBzY2FsZToge1xyXG4gICAgd2lkdGg6IHdpbmRvdy5pbm5lcldpZHRoLFxyXG4gICAgaGVpZ2h0OiB3aW5kb3cuaW5uZXJIZWlnaHQsXHJcbiAgfSxcclxuIFxyXG4gIHNjZW5lOiBzY2VuZXMsXHJcblxyXG4gIHBoeXNpY3M6IHtcclxuICAgIGRlZmF1bHQ6ICdhcmNhZGUnLFxyXG4gICAgYXJjYWRlOiB7XHJcbiAgICAgIGRlYnVnOiBmYWxzZSxcclxuICAgIH0sXHJcbiAgfSxcclxuIFxyXG4gIHBhcmVudDogJ2dhbWUnLFxyXG4gIGJhY2tncm91bmRDb2xvcjogJyMwMDAwMDAnLFxyXG59O1xyXG4gXHJcbmV4cG9ydCBjb25zdCBnYW1lID0gbmV3IFBoYXNlci5HYW1lKGdhbWVDb25maWcpO1xyXG5cclxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsICgpID0+IHtcclxuICBnYW1lLnNjYWxlLnJlZnJlc2goKTtcclxufSk7XHJcbiIsImltcG9ydCB7IEludHJvU2NlbmUgfSBmcm9tICcuL2ludHJvLXNjZW5lJztcclxuaW1wb3J0IHsgTGVhZkJsb3dlclNjZW5lIH0gZnJvbSAnLi9sZWFmLWJsb3dlci1zY2VuZSc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBbSW50cm9TY2VuZSwgTGVhZkJsb3dlclNjZW5lXTtcclxuIiwiaW1wb3J0ICogYXMgUGhhc2VyIGZyb20gJ3BoYXNlcic7XHJcblxyXG5jb25zdCBzY2VuZUNvbmZpZzogUGhhc2VyLlR5cGVzLlNjZW5lcy5TZXR0aW5nc0NvbmZpZyA9IHtcclxuICAgIGFjdGl2ZTogZmFsc2UsXHJcbiAgICB2aXNpYmxlOiBmYWxzZSxcclxuICAgIGtleTogJ0ludHJvJ1xyXG59O1xyXG5cclxuXHJcblxyXG5jbGFzcyBGbG93UGFydCB7XHJcblxyXG4gICAgcHVibGljIHJlcGVhdENhbGxiYWNrOiAodGltZTogbnVtYmVyLCBpbmRleDogbnVtYmVyKSA9PiB2b2lkO1xyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihwdWJsaWMgbmFtZTogc3RyaW5nLCBwdWJsaWMgZHVyYXRpb246IG51bWJlciwgcHVibGljIG5leHQ6IHN0cmluZykge1xyXG4gICAgICAgIFxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyByZXBlYXQoY2FsbGJhY2s6ICh0aW1lOiBudW1iZXIsIGluZGV4OiBudW1iZXIpID0+IHZvaWQpOiBGbG93UGFydCB7XHJcbiAgICAgICAgdGhpcy5yZXBlYXRDYWxsYmFjayA9IGNhbGxiYWNrO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxufVxyXG5cclxuY2xhc3MgRmxvdyB7XHJcbiAgICBwcml2YXRlIHBhcnRzOiBGbG93UGFydFtdID0gW107XHJcbiAgICBwcml2YXRlIGN1cnJlbnRQYXJ0OiBGbG93UGFydCA9IG51bGw7XHJcbiAgICBwcml2YXRlIGN1cnJlbnRTdGFydDogbnVtYmVyID0gMDtcclxuICAgIHByaXZhdGUgY3VycmVudEluZGV4OiBudW1iZXIgPSAwO1xyXG4gICAgcHJpdmF0ZSBjdXJyZW50RHVyYXRpb246IG51bWJlciA9IDA7XHJcblxyXG4gICAgcHVibGljIGFkZChwYXJ0OiBGbG93UGFydCkge1xyXG4gICAgICAgIHRoaXMucGFydHMucHVzaChwYXJ0KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgY3JlYXRlUGFydChuYW1lOiBzdHJpbmcsIGR1cmF0aW9uOiBudW1iZXIsIG5leHQ6IHN0cmluZyk6IEZsb3dQYXJ0IHtcclxuICAgICAgICBjb25zdCBwYXJ0ID0gbmV3IEZsb3dQYXJ0KG5hbWUsIGR1cmF0aW9uLCBuZXh0KTtcclxuICAgICAgICB0aGlzLnBhcnRzLnB1c2gocGFydCk7XHJcbiAgICAgICAgcmV0dXJuIHBhcnQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0ZXAodGltZTogbnVtYmVyKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudFBhcnQgPT09IG51bGwpIHtcclxuICAgICAgICAgICAgdGhpcy5jdXJyZW50UGFydCA9IHRoaXMucGFydHNbMF07XHJcbiAgICAgICAgICAgIHRoaXMuY3VycmVudFN0YXJ0ID0gdGltZTtcclxuICAgICAgICAgICAgdGhpcy5jdXJyZW50SW5kZXggPSAwO1xyXG4gICAgICAgIH0gXHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGN1cnJlbnREdXJhdGlvbiA9IHRpbWUgLSB0aGlzLmN1cnJlbnRTdGFydDtcclxuICAgICAgICAgICAgaWYgKGN1cnJlbnREdXJhdGlvbiA+IHRoaXMuY3VycmVudFBhcnQuZHVyYXRpb24pIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudFBhcnQgPSB0aGlzLnBhcnRzLmZpbmQocGFydCA9PiBwYXJ0Lm5hbWUgPT0gdGhpcy5jdXJyZW50UGFydC5uZXh0KTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudFN0YXJ0ID0gdGltZTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudEluZGV4ID0gMDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmN1cnJlbnRQYXJ0LnJlcGVhdENhbGxiYWNrKHRpbWUgLSB0aGlzLmN1cnJlbnRTdGFydCwgdGhpcy5jdXJyZW50SW5kZXgpO1xyXG4gICAgICAgIHRoaXMuY3VycmVudEluZGV4Kys7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBJbnRyb1NjZW5lIGV4dGVuZHMgUGhhc2VyLlNjZW5lIHtcclxuXHJcbiAgICBwcml2YXRlIGN1cnNvcktleXM6IFBoYXNlci5UeXBlcy5JbnB1dC5LZXlib2FyZC5DdXJzb3JLZXlzO1xyXG4gICAgcHJpdmF0ZSBsZWFmczogUGhhc2VyLlBoeXNpY3MuQXJjYWRlLlNwcml0ZVtdID0gW107XHJcbiAgICBwcml2YXRlIHRleHQ6IFBoYXNlci5HYW1lT2JqZWN0cy5UZXh0O1xyXG5cclxuICAgIHByaXZhdGUgd29ya2Zsb3c6IEZsb3cgPSBuZXcgRmxvdygpO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHN1cGVyKHNjZW5lQ29uZmlnKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcHJlbG9hZCgpOiB2b2lkIHtcclxuXHJcbiAgICAgICAgdGhpcy5sb2FkLmltYWdlKCdpbnRyby1pbWFnZScsICdhc3NldHMvbGVhZi1ibG93ZXItaW50by5qcGcnKTtcclxuICAgICAgICB0aGlzLmxvYWQuc3ByaXRlc2hlZXQoJ2ludHJvLWxlYWZzJywgJ2Fzc2V0cy9zcHJpdGVzL2xlYWYtNC5wbmcnLCB7IGZyYW1lV2lkdGg6IDMyLCBmcmFtZUhlaWdodDogMzIgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGNyZWF0ZSgpOiB2b2lkIHtcclxuXHJcbiAgICAgICAgdGhpcy5jdXJzb3JLZXlzID0gdGhpcy5pbnB1dC5rZXlib2FyZC5jcmVhdGVDdXJzb3JLZXlzKCk7XHJcblxyXG4gICAgICAgIGNvbnN0IGltYWdlID0gdGhpcy5hZGQuaW1hZ2UoMCwgMCwgJ2ludHJvLWltYWdlJykuc2V0T3JpZ2luKDAsIDApO1xyXG5cclxuICAgICAgICBjb25zdCBzY2FsZSA9IE1hdGgubWF4KHRoaXMuZ2FtZS5jYW52YXMud2lkdGggLyBpbWFnZS53aWR0aCwgdGhpcy5nYW1lLmNhbnZhcy5oZWlnaHQgLyBpbWFnZS5oZWlnaHQpO1xyXG4gICAgICAgIGltYWdlLnNldFNjYWxlKHNjYWxlKTtcclxuXHJcbiAgICAgICAgY29uc3QgZm9udFNpemUgPSB0aGlzLmdhbWUuY2FudmFzLndpZHRoIC8gMzI7XHJcbiAgICAgICAgdGhpcy50ZXh0ID0gdGhpcy5hZGQudGV4dCgwLCAwLCAnJykuc2V0Rm9udFNpemUoZm9udFNpemUpLnNldEZvbnRTdHlsZSgnYm9sZCcpLnNldERlcHRoKDEwMCkuc2V0U2Nyb2xsRmFjdG9yKDApO1xyXG4gICAgICAgIHRoaXMudGV4dC5zZXRUZXh0KFtcclxuICAgICAgICAgICAgJ0ljaCBoYWJlIGVpbmVuIEZyZXVuZCcsXHJcbiAgICAgICAgICAgICdkZXIgaXN0IExhdWJibMOkc2VyJyxcclxuICAgICAgICAgICAgJycsXHJcbiAgICAgICAgICAgICdDdXJzb3Iga2V5cyB0byBtb3ZlLCcsXHJcbiAgICAgICAgICAgICcgU3BhY2UgdG8gYmxvdycsXHJcbiAgICAgICAgICAgICdQcmVzcyBTcGFjZSB0byBzdGFydCdcclxuICAgICAgICBdKTtcclxuICAgICAgICB0aGlzLnRleHQuc2V0RmlsbCgnI2EwMTAwMycpO1xyXG4gICAgICAgIHRoaXMudGV4dC5zZXRTdHJva2UoJyNmZmZmZmYnLCA0KTtcclxuICAgICAgICB0aGlzLnRleHQueCA9IHRoaXMuZ2FtZS5jYW52YXMud2lkdGggLSB0aGlzLnRleHQud2lkdGggLSBmb250U2l6ZTsgXHJcbiAgICAgICAgdGhpcy50ZXh0LnkgPSB0aGlzLmdhbWUuY2FudmFzLmhlaWdodCAtIHRoaXMudGV4dC5oZWlnaHQgLSBmb250U2l6ZTsgXHJcbiAgICAgICAgXHJcblxyXG5cclxuICAgICAgICB0aGlzLndvcmtmbG93LmNyZWF0ZVBhcnQoJ2NyZWF0ZScsIDEwMDAwLCAnbW92ZScpLnJlcGVhdCgoKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IGxlYWYgPSB0aGlzLnBoeXNpY3MuYWRkLnNwcml0ZShNYXRoLnJhbmRvbSgpICogdGhpcy5nYW1lLmNhbnZhcy53aWR0aCwgTWF0aC5yYW5kb20oKSAqIHRoaXMuZ2FtZS5jYW52YXMuaGVpZ2h0LCBcclxuICAgICAgICAgICAgICAgIFwiaW50cm8tbGVhZnNcIiwgTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogNS4wKSk7XHJcbiAgICAgICAgICAgIGxlYWYuc2V0TWFzcygwLjAxKTtcclxuICAgICAgICAgICAgbGVhZi5zZXREcmFnKDEwLCAxMCk7XHJcbiAgICAgICAgICAgIGxlYWYuc2V0Qm91bmNlKDAuNSwgMC41KTtcclxuICAgICAgICAgICAgbGVhZi5zZXRSb3RhdGlvbihNYXRoLnJhbmRvbSgpICogTWF0aC5QSSk7XHJcblxyXG4gICAgICAgICAgICBsZWFmLnNldFNjYWxlKE1hdGgucmFuZG9tKCkgKiAxMC4wKTtcclxuICAgICAgICAgICAgdGhpcy5sZWFmcy5wdXNoKGxlYWYpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMud29ya2Zsb3cuY3JlYXRlUGFydCgncmV0dXJuJywgMTAwMDAsICdtb3ZlJykucmVwZWF0KCh0aW1lLCBpbmRleCkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoaW5kZXggPCB0aGlzLmxlYWZzLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgbGVhZiA9IHRoaXMubGVhZnNbaW5kZXhdO1xyXG4gICAgICAgICAgICAgICAgbGVhZi5zZXRWZWxvY2l0eSgwLCAwKTtcclxuICAgICAgICAgICAgICAgIGlmIChsZWFmLnggPCAwIHx8IGxlYWYueCA+IHRoaXMuZ2FtZS5jYW52YXMud2lkdGggfHwgXHJcbiAgICAgICAgICAgICAgICAgICAgbGVhZi55IDwgMCB8fCBsZWFmLnkgPiB0aGlzLmdhbWUuY2FudmFzLmhlaWdodCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGxlYWYuc2V0UG9zaXRpb24oTWF0aC5yYW5kb20oKSAqIHRoaXMuZ2FtZS5jYW52YXMud2lkdGgsIE1hdGgucmFuZG9tKCkgKiB0aGlzLmdhbWUuY2FudmFzLmhlaWdodCk7ICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICBsZWFmLnNldFNjYWxlKE1hdGgucmFuZG9tKCkgKiAxMC4wKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pOyAgICAgICAgXHJcbiAgICAgICAgdGhpcy53b3JrZmxvdy5jcmVhdGVQYXJ0KCdtb3ZlJywgLTEsICd3YWl0JykucmVwZWF0KCgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5jYW1lcmFzLm1haW4uc2hha2UoNTAwKTtcclxuICAgICAgICAgICAgdGhpcy5sZWFmcy5mb3JFYWNoKGxlYWYgPT4ge1xyXG4gICAgICAgICAgICAgICAgbGVhZi5zZXRWZWxvY2l0eShNYXRoLnJhbmRvbSgpICogODAwIC0gNDAwLCBNYXRoLnJhbmRvbSgpICogODAwIC0gNDAwKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7ICAgICAgICBcclxuICAgICAgICB0aGlzLndvcmtmbG93LmNyZWF0ZVBhcnQoJ3dhaXQnLCA1MDAwLCAncmV0dXJuJykucmVwZWF0KCgpID0+IHtcclxuICAgICAgICB9KTsgICAgICAgIFxyXG4gICAgICAgIFxyXG5cclxuXHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHVwZGF0ZSgpOiB2b2lkIHtcclxuXHJcbiAgICAgICAgdGhpcy53b3JrZmxvdy5zdGVwKHRoaXMudGltZS5ub3cpO1xyXG5cclxuICAgICAgICB0aGlzLmxlYWZzLmZvckVhY2gobGVhZiA9PiB7XHJcbiAgICAgICAgICAgIGlmIChsZWFmLnNjYWxlID4gMS4wKSB7XHJcbiAgICAgICAgICAgICAgICBsZWFmLnNldFNjYWxlKChsZWFmLnNjYWxlIC0gMS4wKSAqIDAuOTkgKyAxLjApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuY3Vyc29yS2V5cy5zcGFjZS5pc0Rvd24gfHwgdGhpcy5pbnB1dC5hY3RpdmVQb2ludGVyLmlzRG93bikge1xyXG4gICAgICAgICAgICB0aGlzLnNjZW5lLnN0YXJ0KCdMZWFmQmxvd2VyU2NlbmUnKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBcclxufSAgXHJcblxyXG5cclxuIiwiaW1wb3J0ICogYXMgUGhhc2VyIGZyb20gJ3BoYXNlcic7XHJcbmltcG9ydCB7IExlYWZCbG93ZXIgfSBmcm9tICcuL2xlYWYtYmxvd2VyJztcclxuaW1wb3J0IHsgUm9hZFN3ZWVwZXIgfSBmcm9tICcuL3JvYWQtc3dlZXBlcic7XHJcbmltcG9ydCB7IFZlY3RvciB9IGZyb20gJ21hdHRlcic7XHJcblxyXG5jb25zdCBzY2VuZUNvbmZpZzogUGhhc2VyLlR5cGVzLlNjZW5lcy5TZXR0aW5nc0NvbmZpZyA9IHtcclxuICAgIGFjdGl2ZTogZmFsc2UsXHJcbiAgICB2aXNpYmxlOiBmYWxzZSxcclxuICAgIGtleTogJ0xlYWZCbG93ZXJTY2VuZScsXHJcbn07XHJcblxyXG5leHBvcnQgY2xhc3MgTGVhZkJsb3dlclNjZW5lIGV4dGVuZHMgUGhhc2VyLlNjZW5lIHtcclxuXHJcbiAgICBwcml2YXRlIGN1cnNvcktleXM6IFBoYXNlci5UeXBlcy5JbnB1dC5LZXlib2FyZC5DdXJzb3JLZXlzO1xyXG4gICAgcHJpdmF0ZSBwbGF5ZXI6IFBoYXNlci5QaHlzaWNzLkFyY2FkZS5TcHJpdGU7XHJcbiAgICBwcml2YXRlIG9ic3RhY2xlczogUGhhc2VyLlBoeXNpY3MuQXJjYWRlLlN0YXRpY0dyb3VwO1xyXG5cclxuICAgIHByaXZhdGUgbGVhZnM6IFBoYXNlci5QaHlzaWNzLkFyY2FkZS5TcHJpdGVbXSA9IFtdO1xyXG4gICAgcHJpdmF0ZSB0ZXh0OiBQaGFzZXIuR2FtZU9iamVjdHMuVGV4dDtcclxuICAgIHByaXZhdGUgc3dlZXBlclRleHQ6IFBoYXNlci5HYW1lT2JqZWN0cy5UZXh0O1xyXG5cclxuICAgIHByaXZhdGUgcGxheWVyQWg6IFBoYXNlci5Tb3VuZC5CYXNlU291bmQ7XHJcblxyXG4gICAgcHJpdmF0ZSBlbmVyZ3k6IG51bWJlciA9IDMwMDA7XHJcblxyXG4gICAgcHJpdmF0ZSBibG93ZXI6IExlYWZCbG93ZXI7XHJcbiAgICBwcml2YXRlIHN3ZWVwZXI6IFJvYWRTd2VlcGVyO1xyXG5cclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICBzdXBlcihzY2VuZUNvbmZpZyk7XHJcblxyXG4gICAgICAgIHRoaXMuYmxvd2VyID0gbmV3IExlYWZCbG93ZXIodGhpcywgdGhpcy5sZWFmcyk7XHJcbiAgICAgICAgdGhpcy5zd2VlcGVyID0gbmV3IFJvYWRTd2VlcGVyKHRoaXMsIHRoaXMubGVhZnMpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBwcmVsb2FkKCk6IHZvaWQge1xyXG4gICAgICAgIGNvbnN0IGZvbnRTaXplID0gTWF0aC5taW4odGhpcy5nYW1lLmNhbnZhcy53aWR0aCwgMTAyNCkgLyAzMjtcclxuICAgICAgICB0aGlzLnRleHQgPSB0aGlzLmFkZC50ZXh0KGZvbnRTaXplLCBmb250U2l6ZSwgJ1N0YXJ0aW5nLi4uJykuc2V0Rm9udFNpemUoZm9udFNpemUpLnNldERlcHRoKDEwMCkuc2V0U2Nyb2xsRmFjdG9yKDApO1xyXG4gICAgICAgIHRoaXMuc3dlZXBlclRleHQgPSB0aGlzLmFkZC50ZXh0KDAsIDAsICcnKS5zZXRGb250U2l6ZShmb250U2l6ZSkuc2V0RGVwdGgoMTAwKTtcclxuXHJcbiAgICAgICAgdGhpcy5sb2FkLmltYWdlKCdwbGF5ZXInLCAnYXNzZXRzL3Nwcml0ZXMvcGxheWVyLnBuZycpO1xyXG4gICAgICAgIHRoaXMubG9hZC5pbWFnZSgnbGVhZicsICdhc3NldHMvc3ByaXRlcy9sZWFmLTQucG5nJyk7XHJcbiAgICAgICAgdGhpcy5sb2FkLmltYWdlKCdiYWNrZ3JvdW5kJywgJ2Fzc2V0cy90aWxlcy9nYXJkZW4vZ2FyZGVuLTAxLWJhY2tncm91bmQucG5nJyk7XHJcbiAgICAgICAgdGhpcy5sb2FkLmltYWdlKCdmb3JlZ3JvdW5kJywgJ2Fzc2V0cy90aWxlcy9nYXJkZW4vZ2FyZGVuLTAxLWZvcmVncm91bmQucG5nJyk7XHJcblxyXG4gICAgICAgIHRoaXMubG9hZC5zcHJpdGVzaGVldCgnbGVhZnMnLCAnYXNzZXRzL3Nwcml0ZXMvbGVhZi00LnBuZycsIHsgZnJhbWVXaWR0aDogMzIsIGZyYW1lSGVpZ2h0OiAzMiB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5sb2FkLmF1ZGlvKCdwbGF5ZXJBaCcsICdhc3NldHMvYXVkaW8vcGxheWVyLWFoLm1wMycpO1xyXG5cclxuICAgICAgICB0aGlzLmJsb3dlci5wcmVsb2FkKCk7XHJcbiAgICAgICAgdGhpcy5zd2VlcGVyLnByZWxvYWQoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgY3JlYXRlKCk6IHZvaWQge1xyXG5cclxuICAgICAgICB0aGlzLmN1cnNvcktleXMgPSB0aGlzLmlucHV0LmtleWJvYXJkLmNyZWF0ZUN1cnNvcktleXMoKTtcclxuXHJcbiAgICAgICAgdGhpcy5wbGF5ZXJBaCA9IHRoaXMuc291bmQuYWRkKCdwbGF5ZXJBaCcpO1xyXG5cclxuICAgICAgICB0aGlzLnBoeXNpY3Mud29ybGQuc2V0Qm91bmRzKDAsIDAsIDEwMjQsIDEwMjQpO1xyXG4gICAgICAgIHRoaXMuY2FtZXJhcy5tYWluLnNldEJvdW5kcygwLCAwLCAxMDI0LCAxMDI0KTtcclxuICAgICAgICB0aGlzLmNhbWVyYXMubWFpbi54ID0gTWF0aC5tYXgoKHRoaXMuZ2FtZS5jYW52YXMud2lkdGggLSAxMDI0KSAvIDIsIDApO1xyXG4gICAgICAgIHRoaXMuY2FtZXJhcy5tYWluLnkgPSBNYXRoLm1heCgodGhpcy5nYW1lLmNhbnZhcy5oZWlnaHQgLSAxMDI0KSAvIDIsIDApO1xyXG5cclxuXHJcbiAgICAgICAgdGhpcy5hZGQuaW1hZ2UoMCwgMCwgJ2JhY2tncm91bmQnKS5zZXRTY2FsZSgxLCAxKS5zZXRPcmlnaW4oMCwgMCk7XHJcblxyXG4gICAgICAgIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCAyMDAwOyBpbmRleCsrKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGxlYWYgPSB0aGlzLnBoeXNpY3MuYWRkLnNwcml0ZShNYXRoLnJhbmRvbSgpICogMTAyNCwgTWF0aC5yYW5kb20oKSAqIDEwMjQsIFwibGVhZnNcIiwgaW5kZXggJSA0KTtcclxuICAgICAgICAgICAgbGVhZi5zZXRDb2xsaWRlV29ybGRCb3VuZHModHJ1ZSk7XHJcbiAgICAgICAgICAgIGxlYWYuc2V0RHJhZygxMDAsIDEwMCk7XHJcbiAgICAgICAgICAgIGxlYWYuc2V0RnJpY3Rpb24oMTAwMCwgMTAwMCk7XHJcbiAgICAgICAgICAgIGxlYWYuc2V0TWFzcygwLjAxKTtcclxuICAgICAgICAgICAgbGVhZi5zZXRCb3VuY2UoMC41LCAwLjUpO1xyXG4gICAgICAgICAgICBsZWFmLnNldFJvdGF0aW9uKE1hdGgucmFuZG9tKCkgKiBNYXRoLlBJKTtcclxuICAgICAgICAgICAgdGhpcy5sZWFmcy5wdXNoKGxlYWYpO1xyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgIHRoaXMucGxheWVyID0gdGhpcy5waHlzaWNzLmFkZC5zcHJpdGUoNDUwLCA0MDAsICdwbGF5ZXInKTtcclxuICAgICAgICB0aGlzLnBsYXllci5zZXRDb2xsaWRlV29ybGRCb3VuZHModHJ1ZSk7XHJcbiAgICAgICAgdGhpcy5jYW1lcmFzLm1haW4uc3RhcnRGb2xsb3codGhpcy5wbGF5ZXIsIHRydWUpO1xyXG5cclxuICAgICAgICB0aGlzLm9ic3RhY2xlcyA9IHRoaXMucGh5c2ljcy5hZGQuc3RhdGljR3JvdXAoKTtcclxuICAgICAgICBjb25zdCBvYnN0YWNsZTEgPSB0aGlzLmFkZC56b25lKDQzMiwgMjA4LCAzMiwgMzIpO1xyXG4gICAgICAgIC8vIHRoaXMuYWRkLnJlY3RhbmdsZSg0MzIsIDIwOCwgMzIsIDMyLCAweDgwZmZmZmZmKTtcclxuICAgICAgICB0aGlzLm9ic3RhY2xlcy5hZGQob2JzdGFjbGUxKTtcclxuICAgICAgICB0aGlzLnBoeXNpY3MuYWRkLmNvbGxpZGVyKHRoaXMucGxheWVyLCB0aGlzLm9ic3RhY2xlcyk7XHJcblxyXG4gICAgICAgIHRoaXMuYmxvd2VyLnBsYXllciA9IHRoaXMucGxheWVyO1xyXG4gICAgICAgIHRoaXMuYmxvd2VyLmNyZWF0ZSgpO1xyXG5cclxuICAgICAgICB0aGlzLnN3ZWVwZXIucGxheWVyID0gdGhpcy5wbGF5ZXI7XHJcbiAgICAgICAgdGhpcy5zd2VlcGVyLmNyZWF0ZSgpO1xyXG4gICAgICAgIHRoaXMuc3dlZXBlci5vbkNvbGxpZGVQbGF5ZXIgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMucGxheWVyLnNldFBvc2l0aW9uKHRoaXMucGxheWVyLnggKyA0MCwgdGhpcy5wbGF5ZXIueSk7XHJcbiAgICAgICAgICAgIHRoaXMucGxheWVyQWgucGxheSgpO1xyXG4gICAgICAgICAgICB0aGlzLnN3ZWVwZXJUZXh0LnNldFBvc2l0aW9uKHRoaXMuc3dlZXBlci5zd2VlcGVyLngsIHRoaXMuc3dlZXBlci5zd2VlcGVyLnkpO1xyXG4gICAgICAgICAgICB0aGlzLnN3ZWVwZXJUZXh0LnNldFZpc2libGUodHJ1ZSk7XHJcbiAgICAgICAgICAgIHRoaXMudGltZS5hZGRFdmVudCh7ZGVsYXk6IDMwMDB9KS5jYWxsYmFjayA9ICgpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc3dlZXBlclRleHQuc2V0VmlzaWJsZShmYWxzZSk7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmFkZC5pbWFnZSgwLCAwLCAnZm9yZWdyb3VuZCcpLnNldFNjYWxlKDEsIDEpLnNldE9yaWdpbigwLCAwKTtcclxuXHJcbiAgICAgICAgdGhpcy5zd2VlcGVyVGV4dC5zZXRWaXNpYmxlKGZhbHNlKTtcclxuICAgICAgICB0aGlzLnN3ZWVwZXJUZXh0LnNldFRleHQoJ1Bhc3MgZG9jaCBhdWYgZHUgRGVwcCAuLi4nKTtcclxuXHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgICBwdWJsaWMgdXBkYXRlKCk6IHZvaWQge1xyXG5cclxuICAgICAgICBsZXQgcGxheWVyTmV3Um90YXRpb24gPSAwO1xyXG4gICAgICAgIGxldCBwbGF5ZXJOZXdWZWxvY2l0eSA9IG5ldyBQaGFzZXIuTWF0aC5WZWN0b3IyKDAsIDApO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5jdXJzb3JLZXlzLmxlZnQuaXNEb3duKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmN1cnNvcktleXMuc2hpZnQuaXNEb3duKSB7XHJcbiAgICAgICAgICAgICAgICBwbGF5ZXJOZXdWZWxvY2l0eS55ID0gLTEwMDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHBsYXllck5ld1JvdGF0aW9uID0gLTAuMDU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMuY3Vyc29yS2V5cy5yaWdodC5pc0Rvd24pIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuY3Vyc29yS2V5cy5zaGlmdC5pc0Rvd24pIHtcclxuICAgICAgICAgICAgICAgIHBsYXllck5ld1ZlbG9jaXR5LnkgPSAxMDA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBwbGF5ZXJOZXdSb3RhdGlvbiA9IDAuMDU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMuY3Vyc29yS2V5cy51cC5pc0Rvd24pIHtcclxuICAgICAgICAgICAgcGxheWVyTmV3VmVsb2NpdHkueCA9IDEwMDtcclxuICAgICAgICB9IFxyXG4gICAgICAgIGlmICh0aGlzLmN1cnNvcktleXMuZG93bi5pc0Rvd24pIHtcclxuICAgICAgICAgICAgcGxheWVyTmV3VmVsb2NpdHkueCA9IC0xMDA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwbGF5ZXJOZXdWZWxvY2l0eS5yb3RhdGUodGhpcy5wbGF5ZXIucm90YXRpb24pO1xyXG4gICAgICAgIHRoaXMucGxheWVyLnNldFZlbG9jaXR5KHBsYXllck5ld1ZlbG9jaXR5LngsIHBsYXllck5ld1ZlbG9jaXR5LnkpOyAgICBcclxuICAgICAgICB0aGlzLnBsYXllci5zZXRSb3RhdGlvbihQaGFzZXIuTWF0aC5BbmdsZS5XcmFwKHRoaXMucGxheWVyLnJvdGF0aW9uICsgcGxheWVyTmV3Um90YXRpb24pKTtcclxuXHJcbiAgICAgICAgdGhpcy5ibG93ZXIuaXNCbG93aW5nID0gZmFsc2U7XHJcbiAgICAgICAgaWYgKHRoaXMuY3Vyc29yS2V5cy5zcGFjZS5pc0Rvd24gJiYgdGhpcy5lbmVyZ3kgPiAwKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZW5lcmd5LS07XHJcbiAgICAgICAgICAgIHRoaXMuYmxvd2VyLmlzQmxvd2luZyA9IHRydWU7XHJcbiAgICAgICAgfVxyXG5cclxuXHJcblxyXG4gICAgICAgIHRoaXMuYmxvd2VyLnVwZGF0ZSgpO1xyXG4gICAgICAgIHRoaXMuc3dlZXBlci51cGRhdGUoKTtcclxuXHJcbiAgICAgICAgdGhpcy50ZXh0LnNldFRleHQoW1xyXG4gICAgICAgICAgICAnTGVhZnM6ICcgKyB0aGlzLnN3ZWVwZXIuY29sbGVjdGVkTGVhZnMudG9TdHJpbmcoKSxcclxuICAgICAgICAgICAgJ0VuZXJneTonICsgdGhpcy5lbmVyZ3ksXHJcbiAgICAgICAgICAgIC8vIGBBbmdsZTogJHtwb2ludGVyQW5nbGV9YCxcclxuICAgICAgICAgICAgLy8gYFBsYXllcjogJHtwbGF5ZXJOZXdWZWxvY2l0eS54fSwgJHtwbGF5ZXJOZXdWZWxvY2l0eS55fWAsXHJcbiAgICAgICAgICAgIC8vIGBQb2ludGVyOiAke3RoaXMuaW5wdXQuYWN0aXZlUG9pbnRlci53b3JsZFh9LCAke3RoaXMuaW5wdXQuYWN0aXZlUG9pbnRlci53b3JsZFl9YCxcclxuICAgICAgICAgICAgLy8gYERpZmY6ICR7cG9pbnRlckRpZmZ9YCxcclxuICAgICAgICAgICAgLy8gYENhbWVyYTogJHt0aGlzLmNhbWVyYXMubWFpbi5zY3JvbGxYfSwgJHt0aGlzLmNhbWVyYXMubWFpbi5zY3JvbGxZfWAsXHJcbiAgICAgICAgXSk7XHJcblxyXG4gICAgfVxyXG5cclxuXHJcbn1cclxuXHJcblxyXG4iLCJpbXBvcnQgKiBhcyBQaGFzZXIgZnJvbSAncGhhc2VyJztcclxuaW1wb3J0IHsgTGVhZkJsb3dlclNjZW5lIH0gZnJvbSAnLi9sZWFmLWJsb3dlci1zY2VuZSc7XHJcblxyXG5cclxuZXhwb3J0IGNsYXNzIExlYWZCbG93ZXIge1xyXG5cclxuICAgIHByaXZhdGUgYmxvd2VyU291bmQ6IFBoYXNlci5Tb3VuZC5XZWJBdWRpb1NvdW5kO1xyXG4gICAgcHJpdmF0ZSB3aW5kUGFydGljbGVFbWl0dGVyOiBQaGFzZXIuR2FtZU9iamVjdHMuUGFydGljbGVzLlBhcnRpY2xlRW1pdHRlcjtcclxuXHJcbiAgICBwdWJsaWMgcGxheWVyOiBQaGFzZXIuUGh5c2ljcy5BcmNhZGUuU3ByaXRlO1xyXG4gICAgcHVibGljIGlzQmxvd2luZzogYm9vbGVhbjtcclxuICAgIHB1YmxpYyBjbGVhbmVyVm9sdW1lOiBudW1iZXIgPSAwO1xyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgQkxPV0VSX09QRU5JTkdfQU5HTEUgPSAwLjI7XHJcblxyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihwdWJsaWMgc2NlbmU6IFBoYXNlci5TY2VuZSwgcHVibGljIGxlYWZzOiBQaGFzZXIuUGh5c2ljcy5BcmNhZGUuU3ByaXRlW10pIHtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcHJlbG9hZCgpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLnNjZW5lLmxvYWQuYXVkaW8oJ2NsZWFuZXInLCAnYXNzZXRzL2F1ZGlvL2xlYWYtYmxvd2VyLWxvb3AubXAzJyk7XHJcbiAgICAgICAgdGhpcy5zY2VuZS5sb2FkLmltYWdlKCdwYXJ0aWNsZScsICdhc3NldHMvc3ByaXRlcy9haXItcGFydGljbGUucG5nJyk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGNyZWF0ZSgpOiB2b2lkIHtcclxuICAgICAgICBjb25zdCB3aW5QYXJ0aWNsZU1hbmFnZXIgPSB0aGlzLnNjZW5lLmFkZC5wYXJ0aWNsZXMoJ3BhcnRpY2xlJyk7XHJcbiAgICAgICAgdGhpcy53aW5kUGFydGljbGVFbWl0dGVyID0gd2luUGFydGljbGVNYW5hZ2VyLmNyZWF0ZUVtaXR0ZXIoeyBvbjogZmFsc2UgfSk7XHJcbiAgICAgICAgdGhpcy53aW5kUGFydGljbGVFbWl0dGVyLnNldEZyZXF1ZW5jeSgwKTtcclxuICAgICAgICB0aGlzLndpbmRQYXJ0aWNsZUVtaXR0ZXIuc2V0QmxlbmRNb2RlKFBoYXNlci5CbGVuZE1vZGVzLk5PUk1BTCk7XHJcbiAgICAgICAgdGhpcy53aW5kUGFydGljbGVFbWl0dGVyLmFjY2VsZXJhdGlvbiA9IHRydWU7XHJcblxyXG4gICAgICAgIHRoaXMuYmxvd2VyU291bmQgPSB0aGlzLnNjZW5lLnNvdW5kLmFkZCgnY2xlYW5lcicsIHsgbG9vcDogdHJ1ZSB9KSBhcyBQaGFzZXIuU291bmQuV2ViQXVkaW9Tb3VuZDtcclxuICAgICAgICB0aGlzLmJsb3dlclNvdW5kLnBsYXkoeyB2b2x1bWU6IDAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGJsb3coKTogdm9pZCB7XHJcblxyXG4gICAgICAgIC8vIGVtaXQgYWlyIHBhcnRpY2xlc1xyXG4gICAgICAgIGxldCBwdXNoID0gbmV3IFBoYXNlci5NYXRoLlZlY3RvcjIoMSwgMCk7XHJcbiAgICAgICAgcHVzaC5zZXRBbmdsZSh0aGlzLnBsYXllci5yb3RhdGlvbik7XHJcbiAgICAgICAgdGhpcy53aW5kUGFydGljbGVFbWl0dGVyLnNldFBvc2l0aW9uKHRoaXMucGxheWVyLnggKyBwdXNoLnggKiA1MCwgdGhpcy5wbGF5ZXIueSArIHB1c2gueSAqIDUwKTtcclxuICAgICAgICB0aGlzLndpbmRQYXJ0aWNsZUVtaXR0ZXIub24gPSB0cnVlO1xyXG4gICAgICAgIGNvbnN0IHBhcnRpY2xlQW5nbGVNaW4gPSB0aGlzLnBsYXllci5yb3RhdGlvbiAtIExlYWZCbG93ZXIuQkxPV0VSX09QRU5JTkdfQU5HTEU7XHJcbiAgICAgICAgY29uc3QgcGFydGljbGVBbmdsZU1heCA9IHRoaXMucGxheWVyLnJvdGF0aW9uICsgTGVhZkJsb3dlci5CTE9XRVJfT1BFTklOR19BTkdMRTtcclxuICAgICAgICB0aGlzLndpbmRQYXJ0aWNsZUVtaXR0ZXIuc2V0QW5nbGUoeyBtaW46IFBoYXNlci5NYXRoLlJhZFRvRGVnKHBhcnRpY2xlQW5nbGVNaW4pLCBtYXg6IFBoYXNlci5NYXRoLlJhZFRvRGVnKHBhcnRpY2xlQW5nbGVNYXgpIH0pO1xyXG4gICAgICAgIHRoaXMud2luZFBhcnRpY2xlRW1pdHRlci5zZXRTcGVlZCh7IG1pbjogMTAwLCBtYXg6IDUwMCB9KTtcclxuICAgICAgICB0aGlzLndpbmRQYXJ0aWNsZUVtaXR0ZXIuc2V0U2NhbGUoMC41KTtcclxuXHJcbiAgICAgICAgLy8gbW92ZSBsZWFmc1xyXG4gICAgICAgIGZvciAobGV0IGxlYWYgb2YgdGhpcy5sZWFmcykge1xyXG4gICAgICAgICAgICBjb25zdCBsZWFmQW5nbGUgPSBQaGFzZXIuTWF0aC5BbmdsZS5CZXR3ZWVuKHRoaXMucGxheWVyLngsIHRoaXMucGxheWVyLnksIGxlYWYueCwgbGVhZi55KTtcclxuICAgICAgICAgICAgY29uc3QgZGlmZkFuZ2xlID0gYW5nbGVEaWZmKGxlYWZBbmdsZSwgdGhpcy5wbGF5ZXIucm90YXRpb24pO1xyXG4gICAgICAgICAgICBpZiAoZGlmZkFuZ2xlID4gLUxlYWZCbG93ZXIuQkxPV0VSX09QRU5JTkdfQU5HTEUgJiYgZGlmZkFuZ2xlIDwgTGVhZkJsb3dlci5CTE9XRVJfT1BFTklOR19BTkdMRSkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgbGVhZkRpc3RhbmNlID0gUGhhc2VyLk1hdGguRGlzdGFuY2UuQmV0d2Vlbih0aGlzLnBsYXllci54LCB0aGlzLnBsYXllci55LCBsZWFmLngsIGxlYWYueSk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBsZWZEaXN0YW5jZUZhY3RvciA9IGxlYWZEaXN0YW5jZSAvIDUwICsgMS4wO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgcmVmID0gTWF0aC5yYW5kb20oKSAvIChsZWZEaXN0YW5jZUZhY3RvciAqIGxlZkRpc3RhbmNlRmFjdG9yICogbGVhZkRpc3RhbmNlKSAqIDIwMDA7XHJcbiAgICAgICAgICAgICAgICBsZWFmLnNldFZlbG9jaXR5KE1hdGgubWluKHJlZiAqIChsZWFmLnggLSB0aGlzLnBsYXllci54KSwgNTAwKSwgTWF0aC5taW4ocmVmICogKGxlYWYueSAtIHRoaXMucGxheWVyLnkpLCA1MDApKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcblxyXG4gICAgcHVibGljIHVwZGF0ZSgpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLndpbmRQYXJ0aWNsZUVtaXR0ZXIub24gPSBmYWxzZTtcclxuICAgICAgICBpZiAodGhpcy5pc0Jsb3dpbmcpIHtcclxuICAgICAgICAgICAgdGhpcy5zd2l0Y2hCbG93ZXJTb3VuZCh0cnVlKTtcclxuICAgICAgICAgICAgdGhpcy5ibG93KCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLnN3aXRjaEJsb3dlclNvdW5kKGZhbHNlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMud2luZFBhcnRpY2xlRW1pdHRlci5mb3JFYWNoQWxpdmUoKHBhcnRpY2xlLCBwYXJ0aWNsZUVtaXR0ZXIpID0+IHtcclxuICAgICAgICAgICAgcGFydGljbGUuc2NhbGVYID0gTWF0aC5tYXgocGFydGljbGUubGlmZVQsIDAuNSk7XHJcbiAgICAgICAgICAgIHBhcnRpY2xlLnNjYWxlWSA9IE1hdGgubWF4KHBhcnRpY2xlLmxpZmVULCAwLjUpO1xyXG4gICAgICAgIH0sIG51bGwpO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBwcml2YXRlIHN3aXRjaEJsb3dlclNvdW5kKHZhbHVlOiBib29sZWFuKSB7XHJcbiAgICAgICAgaWYgKHZhbHVlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY2xlYW5lclZvbHVtZSA9IE1hdGgubWluKHRoaXMuY2xlYW5lclZvbHVtZSArIDEwLCAxMDApO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5jbGVhbmVyVm9sdW1lID0gTWF0aC5tYXgodGhpcy5jbGVhbmVyVm9sdW1lIC0gMywgMCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuYmxvd2VyU291bmQuc2V0Vm9sdW1lKHRoaXMuY2xlYW5lclZvbHVtZSAvIDEwMC4wKTtcclxuICAgICAgICB0aGlzLmJsb3dlclNvdW5kLnNldFJhdGUoTWF0aC5tYXgodGhpcy5jbGVhbmVyVm9sdW1lIC8gMTAwLjAsIDAuMSkpO1xyXG4gICAgfVxyXG59XHJcblxyXG5cclxuZnVuY3Rpb24gYW5nbGVEaWZmKGFuZ2xlMTogbnVtYmVyLCBhbmdsZTI6IG51bWJlcik6IG51bWJlciB7XHJcbiAgICBsZXQgZGlmZiA9IGFuZ2xlMiAtIGFuZ2xlMTtcclxuICAgIGRpZmYgPSBkaWZmIDwgLU1hdGguUEkgPyBkaWZmICsgTWF0aC5QSSArIE1hdGguUEkgOiBkaWZmO1xyXG4gICAgZGlmZiA9IGRpZmYgPiBNYXRoLlBJID8gZGlmZiAtIE1hdGguUEkgLSBNYXRoLlBJIDogZGlmZjtcclxuICAgIHJldHVybiBkaWZmO1xyXG59XHJcblxyXG4iLCJcclxuXHJcblxyXG5leHBvcnQgY2xhc3MgUm9hZFN3ZWVwZXIge1xyXG5cclxuICAgIHByaXZhdGUgc3dlZXBlclNsdXJwOiBQaGFzZXIuU291bmQuV2ViQXVkaW9Tb3VuZDtcclxuICAgIHByaXZhdGUgc3dlZXBlckVuZ2luZTogUGhhc2VyLlNvdW5kLldlYkF1ZGlvU291bmQ7XHJcblxyXG4gICAgcHVibGljIGNvbGxlY3RlZExlYWZzOiBudW1iZXIgPSAwO1xyXG5cclxuICAgIHB1YmxpYyBwbGF5ZXI6IFBoYXNlci5QaHlzaWNzLkFyY2FkZS5TcHJpdGU7XHJcbiAgICBwdWJsaWMgc3dlZXBlcjogUGhhc2VyLlBoeXNpY3MuQXJjYWRlLlNwcml0ZTtcclxuXHJcbiAgICBwdWJsaWMgb25Db2xsaWRlUGxheWVyOiAoKSA9PiB2b2lkO1xyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihwdWJsaWMgc2NlbmU6IFBoYXNlci5TY2VuZSwgcHVibGljIGxlYWZzOiBQaGFzZXIuUGh5c2ljcy5BcmNhZGUuU3ByaXRlW10pIHtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcHJlbG9hZCgpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLnNjZW5lLmxvYWQuaW1hZ2UoJ3N3ZWVwZXInLCAnYXNzZXRzL3Nwcml0ZXMvc3dlZXBlci5wbmcnKTtcclxuICAgICAgICB0aGlzLnNjZW5lLmxvYWQuYXVkaW8oJ3NsdXJwJywgJ2Fzc2V0cy9hdWRpby9zcXVpdC53YXYnKTtcclxuICAgICAgICB0aGlzLnNjZW5lLmxvYWQuYXVkaW8oJ3N3ZWVwZXItZW5naW5lJywgJ2Fzc2V0cy9hdWRpby9kaWVzZWwtbG9vcC5tcDMnKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgY3JlYXRlKCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuc3dlZXBlciA9IHRoaXMuc2NlbmUucGh5c2ljcy5hZGQuc3ByaXRlKDM3MCwgMjAwMCwgJ3N3ZWVwZXInKTtcclxuICAgICAgICB0aGlzLnN3ZWVwZXIuc2V0VmVsb2NpdHlZKDEzMCk7XHJcblxyXG4gICAgICAgIHRoaXMuc3dlZXBlclNsdXJwID0gdGhpcy5zY2VuZS5zb3VuZC5hZGQoJ3NsdXJwJykgYXMgUGhhc2VyLlNvdW5kLldlYkF1ZGlvU291bmQ7XHJcbiAgICAgICAgdGhpcy5zd2VlcGVyRW5naW5lID0gdGhpcy5zY2VuZS5zb3VuZC5hZGQoJ3N3ZWVwZXItZW5naW5lJywge2xvb3A6IHRydWV9KSBhcyBQaGFzZXIuU291bmQuV2ViQXVkaW9Tb3VuZDtcclxuXHJcbiAgICAgICAgdGhpcy5zY2VuZS5waHlzaWNzLmFkZC5vdmVybGFwKHRoaXMucGxheWVyLCB0aGlzLnN3ZWVwZXIsICgpID0+IHtcclxuICAgICAgICAgICAgaWYgKHRoaXMub25Db2xsaWRlUGxheWVyKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm9uQ29sbGlkZVBsYXllcigpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHVwZGF0ZSgpOiB2b2lkIHtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuc3dlZXBlci55ID4gMTA1MCkge1xyXG4gICAgICAgICAgICB0aGlzLnN3ZWVwZXIueSA9IDA7XHJcbiAgICAgICAgICAgIHRoaXMuc3dlZXBlckVuZ2luZS5wbGF5KCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnN0IHBsYXllclN3ZWVwZXJEaXN0YW5jZSA9IFBoYXNlci5NYXRoLkRpc3RhbmNlLkJldHdlZW4odGhpcy5wbGF5ZXIueCwgdGhpcy5wbGF5ZXIueSwgdGhpcy5zd2VlcGVyLngsIHRoaXMuc3dlZXBlci55KTtcclxuICAgICAgICB0aGlzLnN3ZWVwZXJFbmdpbmUuc2V0Vm9sdW1lKDEgLyBwbGF5ZXJTd2VlcGVyRGlzdGFuY2UgKiAxMDApO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBsZWFmIG9mIHRoaXMubGVhZnMpIHtcclxuICAgICAgICAgICAgaWYgKCFsZWFmLnZpc2libGUpIHtcclxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNvbnN0IHN3ZWVwZXJEaXN0YW5jZSA9IFBoYXNlci5NYXRoLkRpc3RhbmNlLkJldHdlZW4odGhpcy5zd2VlcGVyLngsIHRoaXMuc3dlZXBlci55LCBsZWFmLngsIGxlYWYueSk7XHJcbiAgICAgICAgICAgIGlmIChzd2VlcGVyRGlzdGFuY2UgPCA0MCkge1xyXG4gICAgICAgICAgICAgICAgbGVhZi5zZXRWaXNpYmxlKGZhbHNlKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuc3dlZXBlclNsdXJwLnBsYXkoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY29sbGVjdGVkTGVhZnMrKztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG59XHJcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdGlmKF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0pIHtcblx0XHRyZXR1cm4gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuLy8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbl9fd2VicGFja19yZXF1aXJlX18ubSA9IF9fd2VicGFja19tb2R1bGVzX187XG5cbiIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApIiwiLy8gbm8gYmFzZVVSSVxuXG4vLyBvYmplY3QgdG8gc3RvcmUgbG9hZGVkIGFuZCBsb2FkaW5nIGNodW5rc1xuLy8gdW5kZWZpbmVkID0gY2h1bmsgbm90IGxvYWRlZCwgbnVsbCA9IGNodW5rIHByZWxvYWRlZC9wcmVmZXRjaGVkXG4vLyBQcm9taXNlID0gY2h1bmsgbG9hZGluZywgMCA9IGNodW5rIGxvYWRlZFxudmFyIGluc3RhbGxlZENodW5rcyA9IHtcblx0XCJhcHBcIjogMFxufTtcblxudmFyIGRlZmVycmVkTW9kdWxlcyA9IFtcblx0W1wiLi9zcmMvbWFpbi50c1wiLFwidmVuZG9yc1wiXVxuXTtcbi8vIG5vIGNodW5rIG9uIGRlbWFuZCBsb2FkaW5nXG5cbi8vIG5vIHByZWZldGNoaW5nXG5cbi8vIG5vIHByZWxvYWRlZFxuXG4vLyBubyBITVJcblxuLy8gbm8gSE1SIG1hbmlmZXN0XG5cbnZhciBjaGVja0RlZmVycmVkTW9kdWxlcyA9ICgpID0+IHtcblxufTtcbmZ1bmN0aW9uIGNoZWNrRGVmZXJyZWRNb2R1bGVzSW1wbCgpIHtcblx0dmFyIHJlc3VsdDtcblx0Zm9yKHZhciBpID0gMDsgaSA8IGRlZmVycmVkTW9kdWxlcy5sZW5ndGg7IGkrKykge1xuXHRcdHZhciBkZWZlcnJlZE1vZHVsZSA9IGRlZmVycmVkTW9kdWxlc1tpXTtcblx0XHR2YXIgZnVsZmlsbGVkID0gdHJ1ZTtcblx0XHRmb3IodmFyIGogPSAxOyBqIDwgZGVmZXJyZWRNb2R1bGUubGVuZ3RoOyBqKyspIHtcblx0XHRcdHZhciBkZXBJZCA9IGRlZmVycmVkTW9kdWxlW2pdO1xuXHRcdFx0aWYoaW5zdGFsbGVkQ2h1bmtzW2RlcElkXSAhPT0gMCkgZnVsZmlsbGVkID0gZmFsc2U7XG5cdFx0fVxuXHRcdGlmKGZ1bGZpbGxlZCkge1xuXHRcdFx0ZGVmZXJyZWRNb2R1bGVzLnNwbGljZShpLS0sIDEpO1xuXHRcdFx0cmVzdWx0ID0gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSBkZWZlcnJlZE1vZHVsZVswXSk7XG5cdFx0fVxuXHR9XG5cdGlmKGRlZmVycmVkTW9kdWxlcy5sZW5ndGggPT09IDApIHtcblx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLngoKTtcblx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnggPSAoKSA9PiB7XG5cblx0XHR9XG5cdH1cblx0cmV0dXJuIHJlc3VsdDtcbn1cbl9fd2VicGFja19yZXF1aXJlX18ueCA9ICgpID0+IHtcblx0Ly8gcmVzZXQgc3RhcnR1cCBmdW5jdGlvbiBzbyBpdCBjYW4gYmUgY2FsbGVkIGFnYWluIHdoZW4gbW9yZSBzdGFydHVwIGNvZGUgaXMgYWRkZWRcblx0X193ZWJwYWNrX3JlcXVpcmVfXy54ID0gKCkgPT4ge1xuXG5cdH1cblx0Y2h1bmtMb2FkaW5nR2xvYmFsID0gY2h1bmtMb2FkaW5nR2xvYmFsLnNsaWNlKCk7XG5cdGZvcih2YXIgaSA9IDA7IGkgPCBjaHVua0xvYWRpbmdHbG9iYWwubGVuZ3RoOyBpKyspIHdlYnBhY2tKc29ucENhbGxiYWNrKGNodW5rTG9hZGluZ0dsb2JhbFtpXSk7XG5cdHJldHVybiAoY2hlY2tEZWZlcnJlZE1vZHVsZXMgPSBjaGVja0RlZmVycmVkTW9kdWxlc0ltcGwpKCk7XG59O1xuXG4vLyBpbnN0YWxsIGEgSlNPTlAgY2FsbGJhY2sgZm9yIGNodW5rIGxvYWRpbmdcbnZhciB3ZWJwYWNrSnNvbnBDYWxsYmFjayA9IChkYXRhKSA9PiB7XG5cdHZhciBbY2h1bmtJZHMsIG1vcmVNb2R1bGVzLCBydW50aW1lLCBleGVjdXRlTW9kdWxlc10gPSBkYXRhO1xuXHQvLyBhZGQgXCJtb3JlTW9kdWxlc1wiIHRvIHRoZSBtb2R1bGVzIG9iamVjdCxcblx0Ly8gdGhlbiBmbGFnIGFsbCBcImNodW5rSWRzXCIgYXMgbG9hZGVkIGFuZCBmaXJlIGNhbGxiYWNrXG5cdHZhciBtb2R1bGVJZCwgY2h1bmtJZCwgaSA9IDAsIHJlc29sdmVzID0gW107XG5cdGZvcig7aSA8IGNodW5rSWRzLmxlbmd0aDsgaSsrKSB7XG5cdFx0Y2h1bmtJZCA9IGNodW5rSWRzW2ldO1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhpbnN0YWxsZWRDaHVua3MsIGNodW5rSWQpICYmIGluc3RhbGxlZENodW5rc1tjaHVua0lkXSkge1xuXHRcdFx0cmVzb2x2ZXMucHVzaChpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF1bMF0pO1xuXHRcdH1cblx0XHRpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF0gPSAwO1xuXHR9XG5cdGZvcihtb2R1bGVJZCBpbiBtb3JlTW9kdWxlcykge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhtb3JlTW9kdWxlcywgbW9kdWxlSWQpKSB7XG5cdFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLm1bbW9kdWxlSWRdID0gbW9yZU1vZHVsZXNbbW9kdWxlSWRdO1xuXHRcdH1cblx0fVxuXHRpZihydW50aW1lKSBydW50aW1lKF9fd2VicGFja19yZXF1aXJlX18pO1xuXHRwYXJlbnRDaHVua0xvYWRpbmdGdW5jdGlvbihkYXRhKTtcblx0d2hpbGUocmVzb2x2ZXMubGVuZ3RoKSB7XG5cdFx0cmVzb2x2ZXMuc2hpZnQoKSgpO1xuXHR9XG5cblx0Ly8gYWRkIGVudHJ5IG1vZHVsZXMgZnJvbSBsb2FkZWQgY2h1bmsgdG8gZGVmZXJyZWQgbGlzdFxuXHRpZihleGVjdXRlTW9kdWxlcykgZGVmZXJyZWRNb2R1bGVzLnB1c2guYXBwbHkoZGVmZXJyZWRNb2R1bGVzLCBleGVjdXRlTW9kdWxlcyk7XG5cblx0Ly8gcnVuIGRlZmVycmVkIG1vZHVsZXMgd2hlbiBhbGwgY2h1bmtzIHJlYWR5XG5cdHJldHVybiBjaGVja0RlZmVycmVkTW9kdWxlcygpO1xufVxuXG52YXIgY2h1bmtMb2FkaW5nR2xvYmFsID0gc2VsZltcIndlYnBhY2tDaHVua2xlYWZfYmxvd2VyX3BoYXNlclwiXSA9IHNlbGZbXCJ3ZWJwYWNrQ2h1bmtsZWFmX2Jsb3dlcl9waGFzZXJcIl0gfHwgW107XG52YXIgcGFyZW50Q2h1bmtMb2FkaW5nRnVuY3Rpb24gPSBjaHVua0xvYWRpbmdHbG9iYWwucHVzaC5iaW5kKGNodW5rTG9hZGluZ0dsb2JhbCk7XG5jaHVua0xvYWRpbmdHbG9iYWwucHVzaCA9IHdlYnBhY2tKc29ucENhbGxiYWNrOyIsIi8vIHJ1biBzdGFydHVwXG5yZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXy54KCk7XG4iXSwic291cmNlUm9vdCI6IiJ9