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
var leaf_blower_1 = __webpack_require__(/*! ./leaf-blower */ "./src/scenes/leaf-blower.ts");
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
    FlowPart.prototype.start = function (callback) {
        this.startCallback = callback;
        return this;
    };
    FlowPart.prototype.repeat = function (callback) {
        this.repeatCallback = callback;
        return this;
    };
    FlowPart.prototype.end = function (callback) {
        this.endCallback = callback;
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
                if (!!this.currentPart.endCallback) {
                    this.currentPart.endCallback(time - this.currentStart, this.currentIndex);
                }
                this.currentPart = this.parts.find(function (part) { return part.name == _this.currentPart.next; });
                this.currentStart = time;
                this.currentIndex = 0;
            }
        }
        if (this.currentIndex == 0 && !!this.currentPart.startCallback) {
            this.currentPart.startCallback(time - this.currentStart, this.currentIndex);
        }
        var result = this.currentPart.repeatCallback(time - this.currentStart, this.currentIndex);
        this.currentIndex++;
        if (!!result) {
            this.currentPart.endCallback(time - this.currentStart, this.currentIndex);
            this.currentPart = this.parts.find(function (part) { return part.name == result; });
            this.currentStart = time;
            this.currentIndex = 0;
        }
    };
    return Flow;
}());
var IntroScene = /** @class */ (function (_super) {
    __extends(IntroScene, _super);
    function IntroScene() {
        var _this = _super.call(this, sceneConfig) || this;
        _this.leafs = [];
        _this.leafBlowerList = [];
        _this.workflow = new Flow();
        return _this;
    }
    IntroScene.prototype.preload = function () {
        this.load.image('intro-image', 'assets/leaf-blower-into.jpg');
        this.load.spritesheet('intro-leafs', 'assets/sprites/leaf-4.png', { frameWidth: 32, frameHeight: 32 });
        for (var i = 0; i < 10; i++) {
            var blower = new leaf_blower_1.LeafBlower(this, this.leafs);
            blower.preload();
            this.leafBlowerList.push(blower);
        }
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
        this.leafBlowerList.forEach(function (blower, index) {
            blower.create();
        });
        this.workflow.createPart('create', 10000, 'blow').repeat(function () {
            var leaf = _this.physics.add.sprite(Math.random() * _this.game.canvas.width, Math.random() * _this.game.canvas.height, "intro-leafs", Math.floor(Math.random() * 4));
            leaf.setMass(0.01);
            leaf.setDrag(10, 10);
            leaf.setBounce(0.5, 0.5);
            leaf.setRotation(Math.random() * Math.PI);
            leaf.setScale(Math.random() * 10.0);
            _this.leafs.push(leaf);
        });
        this.workflow.createPart('return', 10000, 'blow').repeat(function (time, index) {
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
        this.workflow.createPart('blow', 60000, 'return').start(function () {
            _this.leafBlowerList.forEach(function (blower, index) {
                blower.sprite.setPosition(-150 + Math.random() * 100, 100 * index + 50);
                blower.sprite.setCollideWorldBounds(false);
                blower.sprite.setVelocityX(60);
                blower.isBlowing = true;
            });
        }).repeat(function (time, index) {
            for (var _i = 0, _a = _this.leafBlowerList; _i < _a.length; _i++) {
                var blower = _a[_i];
                blower.sprite.rotation = Math.PI / 6 * Math.sin(time / 300 + _this.leafBlowerList.indexOf(blower));
                if (blower.sprite.x > _this.game.canvas.width + 100) {
                    return "return";
                }
            }
        }).end(function () {
            _this.leafBlowerList.forEach(function (blower) {
                blower.isBlowing = false;
                blower.sprite.setVelocityX(0);
            });
        });
    };
    IntroScene.prototype.update = function () {
        this.leafBlowerList.forEach(function (blower) { return blower.update(); });
        this.workflow.step(this.time.now);
        this.leafs.forEach(function (leaf) {
            if (leaf.scale > 1.0) {
                leaf.setScale((leaf.scale - 1.0) * 0.99 + 1.0);
            }
        });
        if (this.cursorKeys.space.isDown || this.input.activePointer.isDown) {
            this.game.sound.stopAll();
            this.scene.start('LeafBlowerScene');
        }
    };
    return IntroScene;
}(Phaser.Scene));
exports.IntroScene = IntroScene;


/***/ }),

/***/ "./src/scenes/leaf-blower-jet.ts":
/*!***************************************!*\
  !*** ./src/scenes/leaf-blower-jet.ts ***!
  \***************************************/
/*! flagged exports */
/*! export LeafBlowerJet [provided] [no usage info] [missing usage info prevents renaming] */
/*! export __esModule [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_exports__, __webpack_require__ */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LeafBlowerJet = void 0;
var Phaser = __webpack_require__(/*! phaser */ "./node_modules/phaser/dist/phaser.js");
var LeafBlowerJet = /** @class */ (function () {
    function LeafBlowerJet(scene, leafs) {
        this.scene = scene;
        this.leafs = leafs;
        this.cleanerVolume = 0;
    }
    LeafBlowerJet.prototype.preload = function () {
        this.scene.load.audio('cleaner', 'assets/audio/leaf-blower-loop.mp3');
        this.scene.load.image('particle', 'assets/sprites/air-particle.png');
    };
    LeafBlowerJet.prototype.create = function () {
        var winParticleManager = this.scene.add.particles('particle');
        this.windParticleEmitter = winParticleManager.createEmitter({ on: false });
        this.windParticleEmitter.setFrequency(0);
        this.windParticleEmitter.setBlendMode(Phaser.BlendModes.NORMAL);
        this.windParticleEmitter.acceleration = true;
        this.blowerSound = this.scene.sound.add('cleaner', { loop: true });
        this.blowerSound.play({ volume: 0 });
    };
    LeafBlowerJet.prototype.blow = function () {
        // emit air particles
        var push = new Phaser.Math.Vector2(1, 0);
        push.setAngle(this.player.rotation);
        this.windParticleEmitter.setPosition(this.player.x + push.x * 50, this.player.y + push.y * 50);
        this.windParticleEmitter.on = true;
        var particleAngleMin = this.player.rotation - LeafBlowerJet.BLOWER_OPENING_ANGLE;
        var particleAngleMax = this.player.rotation + LeafBlowerJet.BLOWER_OPENING_ANGLE;
        this.windParticleEmitter.setAngle({ min: Phaser.Math.RadToDeg(particleAngleMin), max: Phaser.Math.RadToDeg(particleAngleMax) });
        this.windParticleEmitter.setSpeed({ min: 100, max: 500 });
        this.windParticleEmitter.setScale(0.5);
        // move leafs
        for (var _i = 0, _a = this.leafs; _i < _a.length; _i++) {
            var leaf = _a[_i];
            var leafAngle = Phaser.Math.Angle.Between(this.player.x, this.player.y, leaf.x, leaf.y);
            var diffAngle = angleDiff(leafAngle, this.player.rotation);
            if (diffAngle > -LeafBlowerJet.BLOWER_OPENING_ANGLE && diffAngle < LeafBlowerJet.BLOWER_OPENING_ANGLE) {
                var leafDistance = Phaser.Math.Distance.Between(this.player.x, this.player.y, leaf.x, leaf.y);
                var lefDistanceFactor = leafDistance / 50 + 1.0;
                var ref = Math.random() / (lefDistanceFactor * lefDistanceFactor * leafDistance) * 2000;
                leaf.setVelocity(Math.min(ref * (leaf.x - this.player.x), 500), Math.min(ref * (leaf.y - this.player.y), 500));
            }
        }
    };
    LeafBlowerJet.prototype.update = function () {
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
    LeafBlowerJet.prototype.switchBlowerSound = function (value) {
        if (value) {
            this.cleanerVolume = Math.min(this.cleanerVolume + 10, 100);
        }
        else {
            this.cleanerVolume = Math.max(this.cleanerVolume - 3, 0);
        }
        this.blowerSound.setVolume(this.cleanerVolume / 100.0);
        this.blowerSound.setRate(Math.max(this.cleanerVolume / 100.0, 0.1));
    };
    LeafBlowerJet.BLOWER_OPENING_ANGLE = 0.2;
    return LeafBlowerJet;
}());
exports.LeafBlowerJet = LeafBlowerJet;
function angleDiff(angle1, angle2) {
    var diff = angle2 - angle1;
    diff = diff < -Math.PI ? diff + Math.PI + Math.PI : diff;
    diff = diff > Math.PI ? diff - Math.PI - Math.PI : diff;
    return diff;
}


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
var road_sweeper_1 = __webpack_require__(/*! ./road-sweeper */ "./src/scenes/road-sweeper.ts");
var leaf_blower_1 = __webpack_require__(/*! ./leaf-blower */ "./src/scenes/leaf-blower.ts");
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
        _this.sweeper = new road_sweeper_1.RoadSweeper(_this, _this.leafs);
        _this.leafBlower = new leaf_blower_1.LeafBlower(_this, _this.leafs);
        return _this;
    }
    LeafBlowerScene.prototype.preload = function () {
        var fontSize = Math.min(this.game.canvas.width, 1024) / 32;
        this.text = this.add.text(fontSize, fontSize, 'Starting...').setFontSize(fontSize).setDepth(100).setScrollFactor(0);
        this.sweeperText = this.add.text(0, 0, '').setFontSize(fontSize).setDepth(100);
        this.load.image('background', 'assets/tiles/garden/garden-01-background.png');
        this.load.image('foreground', 'assets/tiles/garden/garden-01-foreground.png');
        this.load.spritesheet('leafs', 'assets/sprites/leaf-4.png', { frameWidth: 32, frameHeight: 32 });
        this.sweeper.preload();
        this.leafBlower.preload();
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
        this.leafBlower.create();
        this.cameras.main.startFollow(this.leafBlower.sprite, true);
        this.obstacles = this.physics.add.staticGroup();
        var obstacle1 = this.add.zone(432, 208, 32, 32);
        // this.add.rectangle(432, 208, 32, 32, 0x80ffffff);
        this.obstacles.add(obstacle1);
        this.physics.add.collider(this.leafBlower.sprite, this.obstacles);
        this.sweeper.player = this.leafBlower.sprite;
        this.sweeper.create();
        this.leafBlower.onCollideWith(this.sweeper.sprite, function () {
            _this.leafBlower.sprite.setPosition(_this.leafBlower.sprite.x + 40, _this.leafBlower.sprite.y);
            _this.playerAh.play();
            _this.sweeperText.setPosition(_this.sweeper.sprite.x, _this.sweeper.sprite.y);
            _this.sweeperText.setVisible(true);
            _this.time.addEvent({ delay: 3000 }).callback = function () {
                _this.sweeperText.setVisible(false);
            };
        });
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
        this.leafBlower.move(playerNewVelocity, playerNewRotation);
        this.leafBlower.isBlowing = false;
        if (this.cursorKeys.space.isDown && this.energy > 0) {
            this.energy--;
            this.leafBlower.isBlowing = true;
        }
        this.leafBlower.update();
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
var leaf_blower_jet_1 = __webpack_require__(/*! ./leaf-blower-jet */ "./src/scenes/leaf-blower-jet.ts");
var LeafBlower = /** @class */ (function () {
    function LeafBlower(scene, leafs) {
        this.scene = scene;
        this.leafs = leafs;
        this.isBlowing = false;
        this.leafBlowerJet = new leaf_blower_jet_1.LeafBlowerJet(scene, this.leafs);
    }
    LeafBlower.prototype.preload = function () {
        this.scene.load.image('player', 'assets/sprites/player.png');
        this.scene.load.audio('playerAh', 'assets/audio/player-ah.mp3');
        this.leafBlowerJet.preload();
    };
    LeafBlower.prototype.create = function () {
        this.sprite = this.scene.physics.add.sprite(450, 400, 'player');
        this.sprite.setCollideWorldBounds(true);
        this.leafBlowerJet.player = this.sprite;
        this.leafBlowerJet.create();
    };
    LeafBlower.prototype.update = function () {
        this.leafBlowerJet.isBlowing = this.isBlowing;
        this.leafBlowerJet.update();
    };
    LeafBlower.prototype.move = function (playerNewVelocity, playerNewRotation) {
        playerNewVelocity.rotate(this.sprite.rotation);
        this.sprite.setVelocity(playerNewVelocity.x, playerNewVelocity.y);
        this.sprite.setRotation(Phaser.Math.Angle.Wrap(this.sprite.rotation + playerNewRotation));
    };
    LeafBlower.prototype.onCollideWith = function (sprite, handler) {
        this.scene.physics.add.overlap(this.sprite, sprite, handler);
    };
    return LeafBlower;
}());
exports.LeafBlower = LeafBlower;


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
        this.sprite = this.scene.physics.add.sprite(370, 2000, 'sweeper');
        this.sprite.setVelocityY(130);
        this.sweeperSlurp = this.scene.sound.add('slurp');
        this.sweeperEngine = this.scene.sound.add('sweeper-engine', { loop: true });
    };
    RoadSweeper.prototype.update = function () {
        if (this.sprite.y > 1050) {
            this.sprite.y = 0;
            this.sweeperEngine.play();
        }
        var playerSweeperDistance = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.sprite.x, this.sprite.y);
        this.sweeperEngine.setVolume(1 / playerSweeperDistance * 100);
        for (var _i = 0, _a = this.leafs; _i < _a.length; _i++) {
            var leaf = _a[_i];
            if (!leaf.visible) {
                continue;
            }
            var sweeperDistance = Phaser.Math.Distance.Between(this.sprite.x, this.sprite.y, leaf.x, leaf.y);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9sZWFmLWJsb3dlci1waGFzZXIvLi9zcmMvbWFpbi50cyIsIndlYnBhY2s6Ly9sZWFmLWJsb3dlci1waGFzZXIvLi9zcmMvc2NlbmVzL2luZGV4LnRzIiwid2VicGFjazovL2xlYWYtYmxvd2VyLXBoYXNlci8uL3NyYy9zY2VuZXMvaW50cm8tc2NlbmUudHMiLCJ3ZWJwYWNrOi8vbGVhZi1ibG93ZXItcGhhc2VyLy4vc3JjL3NjZW5lcy9sZWFmLWJsb3dlci1qZXQudHMiLCJ3ZWJwYWNrOi8vbGVhZi1ibG93ZXItcGhhc2VyLy4vc3JjL3NjZW5lcy9sZWFmLWJsb3dlci1zY2VuZS50cyIsIndlYnBhY2s6Ly9sZWFmLWJsb3dlci1waGFzZXIvLi9zcmMvc2NlbmVzL2xlYWYtYmxvd2VyLnRzIiwid2VicGFjazovL2xlYWYtYmxvd2VyLXBoYXNlci8uL3NyYy9zY2VuZXMvcm9hZC1zd2VlcGVyLnRzIiwid2VicGFjazovL2xlYWYtYmxvd2VyLXBoYXNlci93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9sZWFmLWJsb3dlci1waGFzZXIvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9sZWFmLWJsb3dlci1waGFzZXIvd2VicGFjay9ydW50aW1lL2pzb25wIGNodW5rIGxvYWRpbmciLCJ3ZWJwYWNrOi8vbGVhZi1ibG93ZXItcGhhc2VyL3dlYnBhY2svc3RhcnR1cCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSx1RkFBaUM7QUFDakMsNEVBQThCO0FBRTlCLElBQU0sVUFBVSxHQUFpQztJQUMvQyxLQUFLLEVBQUUsZ0JBQWdCO0lBRXZCLElBQUksRUFBRSxNQUFNLENBQUMsSUFBSTtJQUVqQixLQUFLLEVBQUU7UUFDTCxLQUFLLEVBQUUsTUFBTSxDQUFDLFVBQVU7UUFDeEIsTUFBTSxFQUFFLE1BQU0sQ0FBQyxXQUFXO0tBQzNCO0lBRUQsS0FBSyxF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QyxLQUFLLENBQUMsUUFBUSxDQUFDLGdCQUFnQixFQUFFLENBQUM7UUFFekQsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUUzQyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDL0MsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQzlDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUN2RSxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFHeEUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxZQUFZLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFFbEUsS0FBSyxJQUFJLEtBQUssR0FBRyxDQUFDLEVBQUUsS0FBSyxHQUFHLElBQUksRUFBRSxLQUFLLEVBQUUsRUFBRTtZQUN2QyxJQUFNLElBQUksR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLElBQUksRUFB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RUE7VUFDQTs7Ozs7V0N4QkEsc0Y7Ozs7O1dDQUE7O1dBRUE7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBOztXQUVBO1dBQ0E7V0FDQTtXQUNBOztXQUVBOztXQUVBOztXQUVBOztXQUVBOztXQUVBOztXQUVBO1dBQ0E7V0FDQTtXQUNBLGVBQWUsNEJBQTRCO1dBQzNDO1dBQ0E7V0FDQSxnQkFBZ0IsMkJBQTJCO1dBQzNDO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7O1dBRUE7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7O1dBRUE7V0FDQTtXQUNBLGVBQWUsK0JBQStCO1dBQzlDO1dBQ0E7O1dBRUE7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsTUFBTSxvQkFBb0I7V0FDMUI7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7O1dBRUE7V0FDQTs7V0FFQTtXQUNBO1dBQ0E7O1dBRUE7V0FDQTtXQUNBLCtDOzs7O1VDMUZBO1VBQ0EiLCJmaWxlIjoiYXBwLmJ1bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIFBoYXNlciBmcm9tICdwaGFzZXInO1xyXG5pbXBvcnQgc2NlbmVzIGZyb20gJy4vc2NlbmVzJztcclxuXHJcbmNvbnN0IGdhbWVDb25maWc6IFBoYXNlci5UeXBlcy5Db3JlLkdhbWVDb25maWcgPSB7XHJcbiAgdGl0bGU6ICdMZWFmIEJsb3dlciBKUycsXHJcbiBcclxuICB0eXBlOiBQaGFzZXIuQVVUTyxcclxuIFxyXG4gIHNjYWxlOiB7XHJcbiAgICB3aWR0aDogd2luZG93LmlubmVyV2lkdGgsXHJcbiAgICBoZWlnaHQ6IHdpbmRvdy5pbm5lckhlaWdodCxcclxuICB9LFxyXG4gXHJcbiAgc2NlbmU6IHNjZW5lcyxcclxuXHJcbiAgcGh5c2ljczoge1xyXG4gICAgZGVmYXVsdDogJ2FyY2FkZScsXHJcbiAgICBhcmNhZGU6IHtcclxuICAgICAgZGVidWc6IGZhbHNlLFxyXG4gICAgfSxcclxuICB9LFxyXG4gXHJcbiAgcGFyZW50OiAnZ2FtZScsXHJcbiAgYmFja2dyb3VuZENvbG9yOiAnIzAwMDAwMCcsXHJcbn07XHJcbiBcclxuZXhwb3J0IGNvbnN0IGdhbWUgPSBuZXcgUGhhc2VyLkdhbWUoZ2FtZUNvbmZpZyk7XHJcblxyXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgKCkgPT4ge1xyXG4gIGdhbWUuc2NhbGUucmVmcmVzaCgpO1xyXG59KTtcclxuIiwiaW1wb3J0IHsgSW50cm9TY2VuZSB9IGZyb20gJy4vaW50cm8tc2NlbmUnO1xyXG5pbXBvcnQgeyBMZWFmQmxvd2VyU2NlbmUgfSBmcm9tICcuL2xlYWYtYmxvd2VyLXNjZW5lJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IFtJbnRyb1NjZW5lLCBMZWFmQmxvd2VyU2NlbmVdO1xyXG4iLCJpbXBvcnQgKiBhcyBQaGFzZXIgZnJvbSAncGhhc2VyJztcclxuaW1wb3J0IHsgTGVhZkJsb3dlciB9IGZyb20gJy4vbGVhZi1ibG93ZXInO1xyXG5cclxuY29uc3Qgc2NlbmVDb25maWc6IFBoYXNlci5UeXBlcy5TY2VuZXMuU2V0dGluZ3NDb25maWcgPSB7XHJcbiAgICBhY3RpdmU6IGZhbHNlLFxyXG4gICAgdmlzaWJsZTogZmFsc2UsXHJcbiAgICBrZXk6ICdJbnRybydcclxufTtcclxuXHJcblxyXG5cclxuY2xhc3MgRmxvd1BhcnQge1xyXG5cclxuICAgIHB1YmxpYyBzdGFydENhbGxiYWNrOiAodGltZTogbnVtYmVyLCBpbmRleDogbnVtYmVyKSA9PiB2b2lkO1xyXG4gICAgcHVibGljIHJlcGVhdENhbGxiYWNrOiAodGltZTogbnVtYmVyLCBpbmRleDogbnVtYmVyKSA9PiBzdHJpbmcgfCB2b2lkO1xyXG4gICAgcHVibGljIGVuZENhbGxiYWNrOiAodGltZTogbnVtYmVyLCBpbmRleDogbnVtYmVyKSA9PiB2b2lkO1xyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihwdWJsaWMgbmFtZTogc3RyaW5nLCBwdWJsaWMgZHVyYXRpb246IG51bWJlciwgcHVibGljIG5leHQ6IHN0cmluZykge1xyXG4gICAgICAgIFxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGFydChjYWxsYmFjazogKHRpbWU6IG51bWJlciwgaW5kZXg6IG51bWJlcikgPT4gdm9pZCk6IEZsb3dQYXJ0IHtcclxuICAgICAgICB0aGlzLnN0YXJ0Q2FsbGJhY2sgPSBjYWxsYmFjaztcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIHB1YmxpYyByZXBlYXQoY2FsbGJhY2s6ICh0aW1lOiBudW1iZXIsIGluZGV4OiBudW1iZXIpID0+IHN0cmluZyB8IHZvaWQpOiBGbG93UGFydCB7XHJcbiAgICAgICAgdGhpcy5yZXBlYXRDYWxsYmFjayA9IGNhbGxiYWNrO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGVuZChjYWxsYmFjazogKHRpbWU6IG51bWJlciwgaW5kZXg6IG51bWJlcikgPT4gdm9pZCk6IEZsb3dQYXJ0IHtcclxuICAgICAgICB0aGlzLmVuZENhbGxiYWNrID0gY2FsbGJhY2s7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG59XHJcblxyXG5jbGFzcyBGbG93IHtcclxuICAgIHByaXZhdGUgcGFydHM6IEZsb3dQYXJ0W10gPSBbXTtcclxuICAgIHByaXZhdGUgY3VycmVudFBhcnQ6IEZsb3dQYXJ0ID0gbnVsbDtcclxuICAgIHByaXZhdGUgY3VycmVudFN0YXJ0OiBudW1iZXIgPSAwO1xyXG4gICAgcHJpdmF0ZSBjdXJyZW50SW5kZXg6IG51bWJlciA9IDA7XHJcbiAgICBwcml2YXRlIGN1cnJlbnREdXJhdGlvbjogbnVtYmVyID0gMDtcclxuXHJcbiAgICBwdWJsaWMgYWRkKHBhcnQ6IEZsb3dQYXJ0KSB7XHJcbiAgICAgICAgdGhpcy5wYXJ0cy5wdXNoKHBhcnQpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBjcmVhdGVQYXJ0KG5hbWU6IHN0cmluZywgZHVyYXRpb246IG51bWJlciwgbmV4dDogc3RyaW5nKTogRmxvd1BhcnQge1xyXG4gICAgICAgIGNvbnN0IHBhcnQgPSBuZXcgRmxvd1BhcnQobmFtZSwgZHVyYXRpb24sIG5leHQpO1xyXG4gICAgICAgIHRoaXMucGFydHMucHVzaChwYXJ0KTtcclxuICAgICAgICByZXR1cm4gcGFydDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RlcCh0aW1lOiBudW1iZXIpIHtcclxuICAgICAgICBpZiAodGhpcy5jdXJyZW50UGFydCA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRQYXJ0ID0gdGhpcy5wYXJ0c1swXTtcclxuICAgICAgICAgICAgdGhpcy5jdXJyZW50U3RhcnQgPSB0aW1lO1xyXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRJbmRleCA9IDA7XHJcbiAgICAgICAgfSBcclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgY29uc3QgY3VycmVudER1cmF0aW9uID0gdGltZSAtIHRoaXMuY3VycmVudFN0YXJ0OyAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBpZiAoY3VycmVudER1cmF0aW9uID4gdGhpcy5jdXJyZW50UGFydC5kdXJhdGlvbikge1xyXG4gICAgICAgICAgICAgICAgaWYgKCEhdGhpcy5jdXJyZW50UGFydC5lbmRDYWxsYmFjaykge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudFBhcnQuZW5kQ2FsbGJhY2sodGltZSAtIHRoaXMuY3VycmVudFN0YXJ0LCB0aGlzLmN1cnJlbnRJbmRleCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRQYXJ0ID0gdGhpcy5wYXJ0cy5maW5kKHBhcnQgPT4gcGFydC5uYW1lID09IHRoaXMuY3VycmVudFBhcnQubmV4dCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRTdGFydCA9IHRpbWU7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRJbmRleCA9IDA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudEluZGV4ID09IDAgJiYgISF0aGlzLmN1cnJlbnRQYXJ0LnN0YXJ0Q2FsbGJhY2spIHtcclxuICAgICAgICAgICAgdGhpcy5jdXJyZW50UGFydC5zdGFydENhbGxiYWNrKHRpbWUgLSB0aGlzLmN1cnJlbnRTdGFydCwgdGhpcy5jdXJyZW50SW5kZXgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zdCByZXN1bHQgPSB0aGlzLmN1cnJlbnRQYXJ0LnJlcGVhdENhbGxiYWNrKHRpbWUgLSB0aGlzLmN1cnJlbnRTdGFydCwgdGhpcy5jdXJyZW50SW5kZXgpO1xyXG4gICAgICAgIHRoaXMuY3VycmVudEluZGV4Kys7XHJcbiAgICAgICAgaWYgKCEhcmVzdWx0KSB7XHJcbiAgICAgICAgICAgIHRoaXMuY3VycmVudFBhcnQuZW5kQ2FsbGJhY2sodGltZSAtIHRoaXMuY3VycmVudFN0YXJ0LCB0aGlzLmN1cnJlbnRJbmRleCk7XHJcbiAgICAgICAgICAgIHRoaXMuY3VycmVudFBhcnQgPSB0aGlzLnBhcnRzLmZpbmQocGFydCA9PiBwYXJ0Lm5hbWUgPT0gcmVzdWx0KTtcclxuICAgICAgICAgICAgdGhpcy5jdXJyZW50U3RhcnQgPSB0aW1lO1xyXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRJbmRleCA9IDA7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgSW50cm9TY2VuZSBleHRlbmRzIFBoYXNlci5TY2VuZSB7XHJcblxyXG4gICAgcHJpdmF0ZSBjdXJzb3JLZXlzOiBQaGFzZXIuVHlwZXMuSW5wdXQuS2V5Ym9hcmQuQ3Vyc29yS2V5cztcclxuICAgIHByaXZhdGUgbGVhZnM6IFBoYXNlci5QaHlzaWNzLkFyY2FkZS5TcHJpdGVbXSA9IFtdO1xyXG4gICAgcHJpdmF0ZSB0ZXh0OiBQaGFzZXIuR2FtZU9iamVjdHMuVGV4dDtcclxuICAgIFxyXG4gICAgcHJpdmF0ZSBsZWFmQmxvd2VyTGlzdDogTGVhZkJsb3dlcltdID0gW107XHJcblxyXG4gICAgcHJpdmF0ZSB3b3JrZmxvdzogRmxvdyA9IG5ldyBGbG93KCk7XHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgc3VwZXIoc2NlbmVDb25maWcpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBwcmVsb2FkKCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMubG9hZC5pbWFnZSgnaW50cm8taW1hZ2UnLCAnYXNzZXRzL2xlYWYtYmxvd2VyLWludG8uanBnJyk7XHJcbiAgICAgICAgdGhpcy5sb2FkLnNwcml0ZXNoZWV0KCdpbnRyby1sZWFmcycsICdhc3NldHMvc3ByaXRlcy9sZWFmLTQucG5nJywgeyBmcmFtZVdpZHRoOiAzMiwgZnJhbWVIZWlnaHQ6IDMyIH0pO1xyXG4gICAgXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCAxMDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGJsb3dlciA9IG5ldyBMZWFmQmxvd2VyKHRoaXMsIHRoaXMubGVhZnMpO1xyXG4gICAgICAgICAgICBibG93ZXIucHJlbG9hZCgpO1xyXG4gICAgICAgICAgICB0aGlzLmxlYWZCbG93ZXJMaXN0LnB1c2goYmxvd2VyKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGNyZWF0ZSgpOiB2b2lkIHtcclxuXHJcbiAgICAgICAgdGhpcy5jdXJzb3JLZXlzID0gdGhpcy5pbnB1dC5rZXlib2FyZC5jcmVhdGVDdXJzb3JLZXlzKCk7XHJcblxyXG4gICAgICAgIGNvbnN0IGltYWdlID0gdGhpcy5hZGQuaW1hZ2UoMCwgMCwgJ2ludHJvLWltYWdlJykuc2V0T3JpZ2luKDAsIDApO1xyXG5cclxuICAgICAgICBjb25zdCBzY2FsZSA9IE1hdGgubWF4KHRoaXMuZ2FtZS5jYW52YXMud2lkdGggLyBpbWFnZS53aWR0aCwgdGhpcy5nYW1lLmNhbnZhcy5oZWlnaHQgLyBpbWFnZS5oZWlnaHQpO1xyXG4gICAgICAgIGltYWdlLnNldFNjYWxlKHNjYWxlKTtcclxuXHJcbiAgICAgICAgY29uc3QgZm9udFNpemUgPSB0aGlzLmdhbWUuY2FudmFzLndpZHRoIC8gMzI7XHJcbiAgICAgICAgdGhpcy50ZXh0ID0gdGhpcy5hZGQudGV4dCgwLCAwLCAnJykuc2V0Rm9udFNpemUoZm9udFNpemUpLnNldEZvbnRTdHlsZSgnYm9sZCcpLnNldERlcHRoKDEwMCkuc2V0U2Nyb2xsRmFjdG9yKDApO1xyXG4gICAgICAgIHRoaXMudGV4dC5zZXRUZXh0KFtcclxuICAgICAgICAgICAgJ0ljaCBoYWJlIGVpbmVuIEZyZXVuZCcsXHJcbiAgICAgICAgICAgICdkZXIgaXN0IExhdWJibMOkc2VyJyxcclxuICAgICAgICAgICAgJycsXHJcbiAgICAgICAgICAgICdDdXJzb3Iga2V5cyB0byBtb3ZlLCcsXHJcbiAgICAgICAgICAgICcgU3BhY2UgdG8gYmxvdycsXHJcbiAgICAgICAgICAgICdQcmVzcyBTcGFjZSB0byBzdGFydCdcclxuICAgICAgICBdKTtcclxuICAgICAgICB0aGlzLnRleHQuc2V0RmlsbCgnI2EwMTAwMycpO1xyXG4gICAgICAgIHRoaXMudGV4dC5zZXRTdHJva2UoJyNmZmZmZmYnLCA0KTtcclxuICAgICAgICB0aGlzLnRleHQueCA9IHRoaXMuZ2FtZS5jYW52YXMud2lkdGggLSB0aGlzLnRleHQud2lkdGggLSBmb250U2l6ZTsgXHJcbiAgICAgICAgdGhpcy50ZXh0LnkgPSB0aGlzLmdhbWUuY2FudmFzLmhlaWdodCAtIHRoaXMudGV4dC5oZWlnaHQgLSBmb250U2l6ZTsgXHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5sZWFmQmxvd2VyTGlzdC5mb3JFYWNoKChibG93ZXIsIGluZGV4KSA9PiB7XHJcbiAgICAgICAgICAgIGJsb3dlci5jcmVhdGUoKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy53b3JrZmxvdy5jcmVhdGVQYXJ0KCdjcmVhdGUnLCAxMDAwMCwgJ2Jsb3cnKS5yZXBlYXQoKCkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBsZWFmID0gdGhpcy5waHlzaWNzLmFkZC5zcHJpdGUoTWF0aC5yYW5kb20oKSAqIHRoaXMuZ2FtZS5jYW52YXMud2lkdGgsIE1hdGgucmFuZG9tKCkgKiB0aGlzLmdhbWUuY2FudmFzLmhlaWdodCwgXHJcbiAgICAgICAgICAgICAgICBcImludHJvLWxlYWZzXCIsIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDQpKTtcclxuICAgICAgICAgICAgbGVhZi5zZXRNYXNzKDAuMDEpO1xyXG4gICAgICAgICAgICBsZWFmLnNldERyYWcoMTAsIDEwKTtcclxuICAgICAgICAgICAgbGVhZi5zZXRCb3VuY2UoMC41LCAwLjUpO1xyXG4gICAgICAgICAgICBsZWFmLnNldFJvdGF0aW9uKE1hdGgucmFuZG9tKCkgKiBNYXRoLlBJKTtcclxuXHJcbiAgICAgICAgICAgIGxlYWYuc2V0U2NhbGUoTWF0aC5yYW5kb20oKSAqIDEwLjApO1xyXG4gICAgICAgICAgICB0aGlzLmxlYWZzLnB1c2gobGVhZik7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy53b3JrZmxvdy5jcmVhdGVQYXJ0KCdyZXR1cm4nLCAxMDAwMCwgJ2Jsb3cnKS5yZXBlYXQoKHRpbWUsIGluZGV4KSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChpbmRleCA8IHRoaXMubGVhZnMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBsZWFmID0gdGhpcy5sZWFmc1tpbmRleF07XHJcbiAgICAgICAgICAgICAgICBsZWFmLnNldFZlbG9jaXR5KDAsIDApO1xyXG4gICAgICAgICAgICAgICAgaWYgKGxlYWYueCA8IDAgfHwgbGVhZi54ID4gdGhpcy5nYW1lLmNhbnZhcy53aWR0aCB8fCBcclxuICAgICAgICAgICAgICAgICAgICBsZWFmLnkgPCAwIHx8IGxlYWYueSA+IHRoaXMuZ2FtZS5jYW52YXMuaGVpZ2h0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGVhZi5zZXRQb3NpdGlvbihNYXRoLnJhbmRvbSgpICogdGhpcy5nYW1lLmNhbnZhcy53aWR0aCwgTWF0aC5yYW5kb20oKSAqIHRoaXMuZ2FtZS5jYW52YXMuaGVpZ2h0KTsgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIGxlYWYuc2V0U2NhbGUoTWF0aC5yYW5kb20oKSAqIDEwLjApO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7ICAgICAgICBcclxuICAgICAgICB0aGlzLndvcmtmbG93LmNyZWF0ZVBhcnQoJ21vdmUnLCAtMSwgJ3dhaXQnKS5yZXBlYXQoKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmNhbWVyYXMubWFpbi5zaGFrZSg1MDApO1xyXG4gICAgICAgICAgICB0aGlzLmxlYWZzLmZvckVhY2gobGVhZiA9PiB7XHJcbiAgICAgICAgICAgICAgICBsZWFmLnNldFZlbG9jaXR5KE1hdGgucmFuZG9tKCkgKiA4MDAgLSA0MDAsIE1hdGgucmFuZG9tKCkgKiA4MDAgLSA0MDApO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTsgICAgICAgIFxyXG4gICAgICAgIHRoaXMud29ya2Zsb3cuY3JlYXRlUGFydCgnd2FpdCcsIDUwMDAsICdyZXR1cm4nKS5yZXBlYXQoKCkgPT4ge1xyXG4gICAgICAgIH0pOyAgICAgICAgXHJcbiAgICAgICAgdGhpcy53b3JrZmxvdy5jcmVhdGVQYXJ0KCdibG93JywgNjAwMDAsICdyZXR1cm4nKS5zdGFydCgoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMubGVhZkJsb3dlckxpc3QuZm9yRWFjaCgoYmxvd2VyLCBpbmRleCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgYmxvd2VyLnNwcml0ZS5zZXRQb3NpdGlvbigtMTUwICsgTWF0aC5yYW5kb20oKSAqIDEwMCwgMTAwICogaW5kZXggKyA1MCk7XHJcbiAgICAgICAgICAgICAgICBibG93ZXIuc3ByaXRlLnNldENvbGxpZGVXb3JsZEJvdW5kcyhmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICBibG93ZXIuc3ByaXRlLnNldFZlbG9jaXR5WCg2MCk7XHJcbiAgICAgICAgICAgICAgICBibG93ZXIuaXNCbG93aW5nID0gdHJ1ZTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSkucmVwZWF0KCh0aW1lLCBpbmRleCkgPT4ge1xyXG4gICAgICAgICAgICBmb3IobGV0IGJsb3dlciBvZiB0aGlzLmxlYWZCbG93ZXJMaXN0KSB7XHJcbiAgICAgICAgICAgICAgICBibG93ZXIuc3ByaXRlLnJvdGF0aW9uID0gTWF0aC5QSSAvIDYgKiBNYXRoLnNpbih0aW1lIC8gMzAwICsgdGhpcy5sZWFmQmxvd2VyTGlzdC5pbmRleE9mKGJsb3dlcikpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGJsb3dlci5zcHJpdGUueCA+IHRoaXMuZ2FtZS5jYW52YXMud2lkdGggKyAxMDApIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gXCJyZXR1cm5cIjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pLmVuZCgoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMubGVhZkJsb3dlckxpc3QuZm9yRWFjaChibG93ZXIgPT4ge1xyXG4gICAgICAgICAgICAgICAgYmxvd2VyLmlzQmxvd2luZyA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgYmxvd2VyIC5zcHJpdGUuc2V0VmVsb2NpdHlYKDApO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTsgICAgICAgIFxyXG4gICAgICAgIFxyXG5cclxuXHJcbiAgICB9XHJcblxyXG5cclxuICAgIHB1YmxpYyB1cGRhdGUoKTogdm9pZCB7XHJcblxyXG4gICAgICAgIHRoaXMubGVhZkJsb3dlckxpc3QuZm9yRWFjaChibG93ZXIgPT4gYmxvd2VyLnVwZGF0ZSgpKTtcclxuXHJcbiAgICAgICAgdGhpcy53b3JrZmxvdy5zdGVwKHRoaXMudGltZS5ub3cpO1xyXG5cclxuICAgICAgICB0aGlzLmxlYWZzLmZvckVhY2gobGVhZiA9PiB7XHJcbiAgICAgICAgICAgIGlmIChsZWFmLnNjYWxlID4gMS4wKSB7XHJcbiAgICAgICAgICAgICAgICBsZWFmLnNldFNjYWxlKChsZWFmLnNjYWxlIC0gMS4wKSAqIDAuOTkgKyAxLjApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuY3Vyc29yS2V5cy5zcGFjZS5pc0Rvd24gfHwgdGhpcy5pbnB1dC5hY3RpdmVQb2ludGVyLmlzRG93bikge1xyXG4gICAgICAgICAgICB0aGlzLmdhbWUuc291bmQuc3RvcEFsbCgpO1xyXG4gICAgICAgICAgICB0aGlzLnNjZW5lLnN0YXJ0KCdMZWFmQmxvd2VyU2NlbmUnKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBcclxufSAgXHJcblxyXG5cclxuIiwiaW1wb3J0ICogYXMgUGhhc2VyIGZyb20gJ3BoYXNlcic7XHJcbmltcG9ydCB7IExlYWZCbG93ZXJTY2VuZSB9IGZyb20gJy4vbGVhZi1ibG93ZXItc2NlbmUnO1xyXG5cclxuXHJcbmV4cG9ydCBjbGFzcyBMZWFmQmxvd2VySmV0IHtcclxuXHJcbiAgICBwcml2YXRlIGJsb3dlclNvdW5kOiBQaGFzZXIuU291bmQuV2ViQXVkaW9Tb3VuZDtcclxuICAgIHByaXZhdGUgd2luZFBhcnRpY2xlRW1pdHRlcjogUGhhc2VyLkdhbWVPYmplY3RzLlBhcnRpY2xlcy5QYXJ0aWNsZUVtaXR0ZXI7XHJcblxyXG4gICAgcHVibGljIHBsYXllcjogUGhhc2VyLlBoeXNpY3MuQXJjYWRlLlNwcml0ZTtcclxuICAgIHB1YmxpYyBpc0Jsb3dpbmc6IGJvb2xlYW47XHJcbiAgICBwdWJsaWMgY2xlYW5lclZvbHVtZTogbnVtYmVyID0gMDtcclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IEJMT1dFUl9PUEVOSU5HX0FOR0xFID0gMC4yO1xyXG5cclxuXHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IocHVibGljIHNjZW5lOiBQaGFzZXIuU2NlbmUsIHB1YmxpYyBsZWFmczogUGhhc2VyLlBoeXNpY3MuQXJjYWRlLlNwcml0ZVtdKSB7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHByZWxvYWQoKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5zY2VuZS5sb2FkLmF1ZGlvKCdjbGVhbmVyJywgJ2Fzc2V0cy9hdWRpby9sZWFmLWJsb3dlci1sb29wLm1wMycpO1xyXG4gICAgICAgIHRoaXMuc2NlbmUubG9hZC5pbWFnZSgncGFydGljbGUnLCAnYXNzZXRzL3Nwcml0ZXMvYWlyLXBhcnRpY2xlLnBuZycpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBjcmVhdGUoKTogdm9pZCB7XHJcbiAgICAgICAgY29uc3Qgd2luUGFydGljbGVNYW5hZ2VyID0gdGhpcy5zY2VuZS5hZGQucGFydGljbGVzKCdwYXJ0aWNsZScpO1xyXG4gICAgICAgIHRoaXMud2luZFBhcnRpY2xlRW1pdHRlciA9IHdpblBhcnRpY2xlTWFuYWdlci5jcmVhdGVFbWl0dGVyKHsgb246IGZhbHNlIH0pO1xyXG4gICAgICAgIHRoaXMud2luZFBhcnRpY2xlRW1pdHRlci5zZXRGcmVxdWVuY3koMCk7XHJcbiAgICAgICAgdGhpcy53aW5kUGFydGljbGVFbWl0dGVyLnNldEJsZW5kTW9kZShQaGFzZXIuQmxlbmRNb2Rlcy5OT1JNQUwpO1xyXG4gICAgICAgIHRoaXMud2luZFBhcnRpY2xlRW1pdHRlci5hY2NlbGVyYXRpb24gPSB0cnVlO1xyXG5cclxuICAgICAgICB0aGlzLmJsb3dlclNvdW5kID0gdGhpcy5zY2VuZS5zb3VuZC5hZGQoJ2NsZWFuZXInLCB7IGxvb3A6IHRydWUgfSkgYXMgUGhhc2VyLlNvdW5kLldlYkF1ZGlvU291bmQ7XHJcbiAgICAgICAgdGhpcy5ibG93ZXJTb3VuZC5wbGF5KHsgdm9sdW1lOiAwIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBibG93KCk6IHZvaWQge1xyXG5cclxuICAgICAgICAvLyBlbWl0IGFpciBwYXJ0aWNsZXNcclxuICAgICAgICBsZXQgcHVzaCA9IG5ldyBQaGFzZXIuTWF0aC5WZWN0b3IyKDEsIDApO1xyXG4gICAgICAgIHB1c2guc2V0QW5nbGUodGhpcy5wbGF5ZXIucm90YXRpb24pO1xyXG4gICAgICAgIHRoaXMud2luZFBhcnRpY2xlRW1pdHRlci5zZXRQb3NpdGlvbih0aGlzLnBsYXllci54ICsgcHVzaC54ICogNTAsIHRoaXMucGxheWVyLnkgKyBwdXNoLnkgKiA1MCk7XHJcbiAgICAgICAgdGhpcy53aW5kUGFydGljbGVFbWl0dGVyLm9uID0gdHJ1ZTtcclxuICAgICAgICBjb25zdCBwYXJ0aWNsZUFuZ2xlTWluID0gdGhpcy5wbGF5ZXIucm90YXRpb24gLSBMZWFmQmxvd2VySmV0LkJMT1dFUl9PUEVOSU5HX0FOR0xFO1xyXG4gICAgICAgIGNvbnN0IHBhcnRpY2xlQW5nbGVNYXggPSB0aGlzLnBsYXllci5yb3RhdGlvbiArIExlYWZCbG93ZXJKZXQuQkxPV0VSX09QRU5JTkdfQU5HTEU7XHJcbiAgICAgICAgdGhpcy53aW5kUGFydGljbGVFbWl0dGVyLnNldEFuZ2xlKHsgbWluOiBQaGFzZXIuTWF0aC5SYWRUb0RlZyhwYXJ0aWNsZUFuZ2xlTWluKSwgbWF4OiBQaGFzZXIuTWF0aC5SYWRUb0RlZyhwYXJ0aWNsZUFuZ2xlTWF4KSB9KTtcclxuICAgICAgICB0aGlzLndpbmRQYXJ0aWNsZUVtaXR0ZXIuc2V0U3BlZWQoeyBtaW46IDEwMCwgbWF4OiA1MDAgfSk7XHJcbiAgICAgICAgdGhpcy53aW5kUGFydGljbGVFbWl0dGVyLnNldFNjYWxlKDAuNSk7XHJcblxyXG4gICAgICAgIC8vIG1vdmUgbGVhZnNcclxuICAgICAgICBmb3IgKGxldCBsZWFmIG9mIHRoaXMubGVhZnMpIHtcclxuICAgICAgICAgICAgY29uc3QgbGVhZkFuZ2xlID0gUGhhc2VyLk1hdGguQW5nbGUuQmV0d2Vlbih0aGlzLnBsYXllci54LCB0aGlzLnBsYXllci55LCBsZWFmLngsIGxlYWYueSk7XHJcbiAgICAgICAgICAgIGNvbnN0IGRpZmZBbmdsZSA9IGFuZ2xlRGlmZihsZWFmQW5nbGUsIHRoaXMucGxheWVyLnJvdGF0aW9uKTtcclxuICAgICAgICAgICAgaWYgKGRpZmZBbmdsZSA+IC1MZWFmQmxvd2VySmV0LkJMT1dFUl9PUEVOSU5HX0FOR0xFICYmIGRpZmZBbmdsZSA8IExlYWZCbG93ZXJKZXQuQkxPV0VSX09QRU5JTkdfQU5HTEUpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGxlYWZEaXN0YW5jZSA9IFBoYXNlci5NYXRoLkRpc3RhbmNlLkJldHdlZW4odGhpcy5wbGF5ZXIueCwgdGhpcy5wbGF5ZXIueSwgbGVhZi54LCBsZWFmLnkpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgbGVmRGlzdGFuY2VGYWN0b3IgPSBsZWFmRGlzdGFuY2UgLyA1MCArIDEuMDtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHJlZiA9IE1hdGgucmFuZG9tKCkgLyAobGVmRGlzdGFuY2VGYWN0b3IgKiBsZWZEaXN0YW5jZUZhY3RvciAqIGxlYWZEaXN0YW5jZSkgKiAyMDAwO1xyXG4gICAgICAgICAgICAgICAgbGVhZi5zZXRWZWxvY2l0eShNYXRoLm1pbihyZWYgKiAobGVhZi54IC0gdGhpcy5wbGF5ZXIueCksIDUwMCksIE1hdGgubWluKHJlZiAqIChsZWFmLnkgLSB0aGlzLnBsYXllci55KSwgNTAwKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG5cclxuICAgIHB1YmxpYyB1cGRhdGUoKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy53aW5kUGFydGljbGVFbWl0dGVyLm9uID0gZmFsc2U7XHJcbiAgICAgICAgaWYgKHRoaXMuaXNCbG93aW5nKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc3dpdGNoQmxvd2VyU291bmQodHJ1ZSk7XHJcbiAgICAgICAgICAgIHRoaXMuYmxvdygpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5zd2l0Y2hCbG93ZXJTb3VuZChmYWxzZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLndpbmRQYXJ0aWNsZUVtaXR0ZXIuZm9yRWFjaEFsaXZlKChwYXJ0aWNsZSwgcGFydGljbGVFbWl0dGVyKSA9PiB7XHJcbiAgICAgICAgICAgIHBhcnRpY2xlLnNjYWxlWCA9IE1hdGgubWF4KHBhcnRpY2xlLmxpZmVULCAwLjUpO1xyXG4gICAgICAgICAgICBwYXJ0aWNsZS5zY2FsZVkgPSBNYXRoLm1heChwYXJ0aWNsZS5saWZlVCwgMC41KTtcclxuICAgICAgICB9LCBudWxsKTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgcHJpdmF0ZSBzd2l0Y2hCbG93ZXJTb3VuZCh2YWx1ZTogYm9vbGVhbikge1xyXG4gICAgICAgIGlmICh2YWx1ZSkge1xyXG4gICAgICAgICAgICB0aGlzLmNsZWFuZXJWb2x1bWUgPSBNYXRoLm1pbih0aGlzLmNsZWFuZXJWb2x1bWUgKyAxMCwgMTAwKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuY2xlYW5lclZvbHVtZSA9IE1hdGgubWF4KHRoaXMuY2xlYW5lclZvbHVtZSAtIDMsIDApO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmJsb3dlclNvdW5kLnNldFZvbHVtZSh0aGlzLmNsZWFuZXJWb2x1bWUgLyAxMDAuMCk7XHJcbiAgICAgICAgdGhpcy5ibG93ZXJTb3VuZC5zZXRSYXRlKE1hdGgubWF4KHRoaXMuY2xlYW5lclZvbHVtZSAvIDEwMC4wLCAwLjEpKTtcclxuICAgIH1cclxufVxyXG5cclxuXHJcbmZ1bmN0aW9uIGFuZ2xlRGlmZihhbmdsZTE6IG51bWJlciwgYW5nbGUyOiBudW1iZXIpOiBudW1iZXIge1xyXG4gICAgbGV0IGRpZmYgPSBhbmdsZTIgLSBhbmdsZTE7XHJcbiAgICBkaWZmID0gZGlmZiA8IC1NYXRoLlBJID8gZGlmZiArIE1hdGguUEkgKyBNYXRoLlBJIDogZGlmZjtcclxuICAgIGRpZmYgPSBkaWZmID4gTWF0aC5QSSA/IGRpZmYgLSBNYXRoLlBJIC0gTWF0aC5QSSA6IGRpZmY7XHJcbiAgICByZXR1cm4gZGlmZjtcclxufVxyXG5cclxuIiwiaW1wb3J0ICogYXMgUGhhc2VyIGZyb20gJ3BoYXNlcic7XHJcbmltcG9ydCB7IFJvYWRTd2VlcGVyIH0gZnJvbSAnLi9yb2FkLXN3ZWVwZXInO1xyXG5pbXBvcnQgeyBMZWFmQmxvd2VyIH0gZnJvbSAnLi9sZWFmLWJsb3dlcic7XHJcblxyXG5jb25zdCBzY2VuZUNvbmZpZzogUGhhc2VyLlR5cGVzLlNjZW5lcy5TZXR0aW5nc0NvbmZpZyA9IHtcclxuICAgIGFjdGl2ZTogZmFsc2UsXHJcbiAgICB2aXNpYmxlOiBmYWxzZSxcclxuICAgIGtleTogJ0xlYWZCbG93ZXJTY2VuZScsXHJcbn07XHJcblxyXG5leHBvcnQgY2xhc3MgTGVhZkJsb3dlclNjZW5lIGV4dGVuZHMgUGhhc2VyLlNjZW5lIHtcclxuXHJcbiAgICBwcml2YXRlIGN1cnNvcktleXM6IFBoYXNlci5UeXBlcy5JbnB1dC5LZXlib2FyZC5DdXJzb3JLZXlzO1xyXG4gICAgcHJpdmF0ZSBvYnN0YWNsZXM6IFBoYXNlci5QaHlzaWNzLkFyY2FkZS5TdGF0aWNHcm91cDtcclxuXHJcbiAgICBwcml2YXRlIGxlYWZzOiBQaGFzZXIuUGh5c2ljcy5BcmNhZGUuU3ByaXRlW10gPSBbXTtcclxuICAgIHByaXZhdGUgdGV4dDogUGhhc2VyLkdhbWVPYmplY3RzLlRleHQ7XHJcbiAgICBwcml2YXRlIHN3ZWVwZXJUZXh0OiBQaGFzZXIuR2FtZU9iamVjdHMuVGV4dDtcclxuXHJcbiAgICBwcml2YXRlIHBsYXllckFoOiBQaGFzZXIuU291bmQuQmFzZVNvdW5kO1xyXG5cclxuICAgIHByaXZhdGUgZW5lcmd5OiBudW1iZXIgPSAzMDAwO1xyXG5cclxuICAgIHByaXZhdGUgc3dlZXBlcjogUm9hZFN3ZWVwZXI7XHJcbiAgICBwcml2YXRlIGxlYWZCbG93ZXI6IExlYWZCbG93ZXI7XHJcblxyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHN1cGVyKHNjZW5lQ29uZmlnKTtcclxuXHJcbiAgICAgICAgdGhpcy5zd2VlcGVyID0gbmV3IFJvYWRTd2VlcGVyKHRoaXMsIHRoaXMubGVhZnMpO1xyXG4gICAgICAgIHRoaXMubGVhZkJsb3dlciA9IG5ldyBMZWFmQmxvd2VyKHRoaXMsIHRoaXMubGVhZnMpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBwcmVsb2FkKCk6IHZvaWQge1xyXG4gICAgICAgIGNvbnN0IGZvbnRTaXplID0gTWF0aC5taW4odGhpcy5nYW1lLmNhbnZhcy53aWR0aCwgMTAyNCkgLyAzMjtcclxuICAgICAgICB0aGlzLnRleHQgPSB0aGlzLmFkZC50ZXh0KGZvbnRTaXplLCBmb250U2l6ZSwgJ1N0YXJ0aW5nLi4uJykuc2V0Rm9udFNpemUoZm9udFNpemUpLnNldERlcHRoKDEwMCkuc2V0U2Nyb2xsRmFjdG9yKDApO1xyXG4gICAgICAgIHRoaXMuc3dlZXBlclRleHQgPSB0aGlzLmFkZC50ZXh0KDAsIDAsICcnKS5zZXRGb250U2l6ZShmb250U2l6ZSkuc2V0RGVwdGgoMTAwKTtcclxuXHJcbiAgICAgICAgdGhpcy5sb2FkLmltYWdlKCdiYWNrZ3JvdW5kJywgJ2Fzc2V0cy90aWxlcy9nYXJkZW4vZ2FyZGVuLTAxLWJhY2tncm91bmQucG5nJyk7XHJcbiAgICAgICAgdGhpcy5sb2FkLmltYWdlKCdmb3JlZ3JvdW5kJywgJ2Fzc2V0cy90aWxlcy9nYXJkZW4vZ2FyZGVuLTAxLWZvcmVncm91bmQucG5nJyk7XHJcbiAgICAgICAgdGhpcy5sb2FkLnNwcml0ZXNoZWV0KCdsZWFmcycsICdhc3NldHMvc3ByaXRlcy9sZWFmLTQucG5nJywgeyBmcmFtZVdpZHRoOiAzMiwgZnJhbWVIZWlnaHQ6IDMyIH0pO1xyXG5cclxuICAgICAgICB0aGlzLnN3ZWVwZXIucHJlbG9hZCgpO1xyXG4gICAgICAgIHRoaXMubGVhZkJsb3dlci5wcmVsb2FkKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGNyZWF0ZSgpOiB2b2lkIHtcclxuXHJcbiAgICAgICAgdGhpcy5jdXJzb3JLZXlzID0gdGhpcy5pbnB1dC5rZXlib2FyZC5jcmVhdGVDdXJzb3JLZXlzKCk7XHJcblxyXG4gICAgICAgIHRoaXMucGxheWVyQWggPSB0aGlzLnNvdW5kLmFkZCgncGxheWVyQWgnKTtcclxuXHJcbiAgICAgICAgdGhpcy5waHlzaWNzLndvcmxkLnNldEJvdW5kcygwLCAwLCAxMDI0LCAxMDI0KTtcclxuICAgICAgICB0aGlzLmNhbWVyYXMubWFpbi5zZXRCb3VuZHMoMCwgMCwgMTAyNCwgMTAyNCk7XHJcbiAgICAgICAgdGhpcy5jYW1lcmFzLm1haW4ueCA9IE1hdGgubWF4KCh0aGlzLmdhbWUuY2FudmFzLndpZHRoIC0gMTAyNCkgLyAyLCAwKTtcclxuICAgICAgICB0aGlzLmNhbWVyYXMubWFpbi55ID0gTWF0aC5tYXgoKHRoaXMuZ2FtZS5jYW52YXMuaGVpZ2h0IC0gMTAyNCkgLyAyLCAwKTtcclxuXHJcblxyXG4gICAgICAgIHRoaXMuYWRkLmltYWdlKDAsIDAsICdiYWNrZ3JvdW5kJykuc2V0U2NhbGUoMSwgMSkuc2V0T3JpZ2luKDAsIDApO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDwgMjAwMDsgaW5kZXgrKykge1xyXG4gICAgICAgICAgICBjb25zdCBsZWFmID0gdGhpcy5waHlzaWNzLmFkZC5zcHJpdGUoTWF0aC5yYW5kb20oKSAqIDEwMjQsIE1hdGgucmFuZG9tKCkgKiAxMDI0LCBcImxlYWZzXCIsIGluZGV4ICUgNCk7XHJcbiAgICAgICAgICAgIGxlYWYuc2V0Q29sbGlkZVdvcmxkQm91bmRzKHRydWUpO1xyXG4gICAgICAgICAgICBsZWFmLnNldERyYWcoMTAwLCAxMDApO1xyXG4gICAgICAgICAgICBsZWFmLnNldEZyaWN0aW9uKDEwMDAsIDEwMDApO1xyXG4gICAgICAgICAgICBsZWFmLnNldE1hc3MoMC4wMSk7XHJcbiAgICAgICAgICAgIGxlYWYuc2V0Qm91bmNlKDAuNSwgMC41KTtcclxuICAgICAgICAgICAgbGVhZi5zZXRSb3RhdGlvbihNYXRoLnJhbmRvbSgpICogTWF0aC5QSSk7XHJcbiAgICAgICAgICAgIHRoaXMubGVhZnMucHVzaChsZWFmKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMubGVhZkJsb3dlci5jcmVhdGUoKTtcclxuICAgICAgICB0aGlzLmNhbWVyYXMubWFpbi5zdGFydEZvbGxvdyh0aGlzLmxlYWZCbG93ZXIuc3ByaXRlLCB0cnVlKTtcclxuXHJcbiAgICAgICAgdGhpcy5vYnN0YWNsZXMgPSB0aGlzLnBoeXNpY3MuYWRkLnN0YXRpY0dyb3VwKCk7XHJcbiAgICAgICAgY29uc3Qgb2JzdGFjbGUxID0gdGhpcy5hZGQuem9uZSg0MzIsIDIwOCwgMzIsIDMyKTtcclxuICAgICAgICAvLyB0aGlzLmFkZC5yZWN0YW5nbGUoNDMyLCAyMDgsIDMyLCAzMiwgMHg4MGZmZmZmZik7XHJcbiAgICAgICAgdGhpcy5vYnN0YWNsZXMuYWRkKG9ic3RhY2xlMSk7ICAgICAgICBcclxuICAgICAgICB0aGlzLnBoeXNpY3MuYWRkLmNvbGxpZGVyKHRoaXMubGVhZkJsb3dlci5zcHJpdGUsIHRoaXMub2JzdGFjbGVzKTtcclxuXHJcblxyXG4gICAgICAgIHRoaXMuc3dlZXBlci5wbGF5ZXIgPSB0aGlzLmxlYWZCbG93ZXIuc3ByaXRlO1xyXG4gICAgICAgIHRoaXMuc3dlZXBlci5jcmVhdGUoKTtcclxuXHJcbiAgICAgICAgdGhpcy5sZWFmQmxvd2VyLm9uQ29sbGlkZVdpdGgodGhpcy5zd2VlcGVyLnNwcml0ZSwgKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmxlYWZCbG93ZXIuc3ByaXRlLnNldFBvc2l0aW9uKHRoaXMubGVhZkJsb3dlci5zcHJpdGUueCArIDQwLCB0aGlzLmxlYWZCbG93ZXIuc3ByaXRlLnkpO1xyXG4gICAgICAgICAgICB0aGlzLnBsYXllckFoLnBsYXkoKTtcclxuICAgICAgICAgICAgdGhpcy5zd2VlcGVyVGV4dC5zZXRQb3NpdGlvbih0aGlzLnN3ZWVwZXIuc3ByaXRlLngsIHRoaXMuc3dlZXBlci5zcHJpdGUueSk7XHJcbiAgICAgICAgICAgIHRoaXMuc3dlZXBlclRleHQuc2V0VmlzaWJsZSh0cnVlKTtcclxuICAgICAgICAgICAgdGhpcy50aW1lLmFkZEV2ZW50KHtkZWxheTogMzAwMH0pLmNhbGxiYWNrID0gKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zd2VlcGVyVGV4dC5zZXRWaXNpYmxlKGZhbHNlKTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5hZGQuaW1hZ2UoMCwgMCwgJ2ZvcmVncm91bmQnKS5zZXRTY2FsZSgxLCAxKS5zZXRPcmlnaW4oMCwgMCk7XHJcblxyXG4gICAgICAgIHRoaXMuc3dlZXBlclRleHQuc2V0VmlzaWJsZShmYWxzZSk7XHJcbiAgICAgICAgdGhpcy5zd2VlcGVyVGV4dC5zZXRUZXh0KCdQYXNzIGRvY2ggYXVmIGR1IERlcHAgLi4uJyk7XHJcblxyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICAgcHVibGljIHVwZGF0ZSgpOiB2b2lkIHtcclxuXHJcbiAgICAgICAgbGV0IHBsYXllck5ld1JvdGF0aW9uID0gMDtcclxuICAgICAgICBsZXQgcGxheWVyTmV3VmVsb2NpdHkgPSBuZXcgUGhhc2VyLk1hdGguVmVjdG9yMigwLCAwKTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuY3Vyc29yS2V5cy5sZWZ0LmlzRG93bikge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5jdXJzb3JLZXlzLnNoaWZ0LmlzRG93bikge1xyXG4gICAgICAgICAgICAgICAgcGxheWVyTmV3VmVsb2NpdHkueSA9IC0xMDA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBwbGF5ZXJOZXdSb3RhdGlvbiA9IC0wLjA1O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLmN1cnNvcktleXMucmlnaHQuaXNEb3duKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmN1cnNvcktleXMuc2hpZnQuaXNEb3duKSB7XHJcbiAgICAgICAgICAgICAgICBwbGF5ZXJOZXdWZWxvY2l0eS55ID0gMTAwO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcGxheWVyTmV3Um90YXRpb24gPSAwLjA1O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLmN1cnNvcktleXMudXAuaXNEb3duKSB7XHJcbiAgICAgICAgICAgIHBsYXllck5ld1ZlbG9jaXR5LnggPSAxMDA7XHJcbiAgICAgICAgfSBcclxuICAgICAgICBpZiAodGhpcy5jdXJzb3JLZXlzLmRvd24uaXNEb3duKSB7XHJcbiAgICAgICAgICAgIHBsYXllck5ld1ZlbG9jaXR5LnggPSAtMTAwO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5sZWFmQmxvd2VyLm1vdmUocGxheWVyTmV3VmVsb2NpdHksIHBsYXllck5ld1JvdGF0aW9uKTtcclxuXHJcbiAgICAgICAgdGhpcy5sZWFmQmxvd2VyLmlzQmxvd2luZyA9IGZhbHNlO1xyXG4gICAgICAgIGlmICh0aGlzLmN1cnNvcktleXMuc3BhY2UuaXNEb3duICYmIHRoaXMuZW5lcmd5ID4gMCkge1xyXG4gICAgICAgICAgICB0aGlzLmVuZXJneS0tO1xyXG4gICAgICAgICAgICB0aGlzLmxlYWZCbG93ZXIuaXNCbG93aW5nID0gdHJ1ZTtcclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICB0aGlzLmxlYWZCbG93ZXIudXBkYXRlKCk7XHJcbiAgICAgICAgdGhpcy5zd2VlcGVyLnVwZGF0ZSgpO1xyXG5cclxuICAgICAgICB0aGlzLnRleHQuc2V0VGV4dChbXHJcbiAgICAgICAgICAgICdMZWFmczogJyArIHRoaXMuc3dlZXBlci5jb2xsZWN0ZWRMZWFmcy50b1N0cmluZygpLFxyXG4gICAgICAgICAgICAnRW5lcmd5OicgKyB0aGlzLmVuZXJneSxcclxuICAgICAgICAgICAgLy8gYEFuZ2xlOiAke3BvaW50ZXJBbmdsZX1gLFxyXG4gICAgICAgICAgICAvLyBgUGxheWVyOiAke3BsYXllck5ld1ZlbG9jaXR5Lnh9LCAke3BsYXllck5ld1ZlbG9jaXR5Lnl9YCxcclxuICAgICAgICAgICAgLy8gYFBvaW50ZXI6ICR7dGhpcy5pbnB1dC5hY3RpdmVQb2ludGVyLndvcmxkWH0sICR7dGhpcy5pbnB1dC5hY3RpdmVQb2ludGVyLndvcmxkWX1gLFxyXG4gICAgICAgICAgICAvLyBgRGlmZjogJHtwb2ludGVyRGlmZn1gLFxyXG4gICAgICAgICAgICAvLyBgQ2FtZXJhOiAke3RoaXMuY2FtZXJhcy5tYWluLnNjcm9sbFh9LCAke3RoaXMuY2FtZXJhcy5tYWluLnNjcm9sbFl9YCxcclxuICAgICAgICBdKTtcclxuXHJcbiAgICB9XHJcblxyXG5cclxufVxyXG5cclxuXHJcbiIsImltcG9ydCB7IExlYWZCbG93ZXJKZXQgfSBmcm9tIFwiLi9sZWFmLWJsb3dlci1qZXRcIjtcclxuXHJcblxyXG5cclxuZXhwb3J0IGNsYXNzIExlYWZCbG93ZXIge1xyXG5cclxuICAgIHB1YmxpYyBzcHJpdGU6IFBoYXNlci5QaHlzaWNzLkFyY2FkZS5TcHJpdGU7XHJcbiAgICBwcml2YXRlIGxlYWZCbG93ZXJKZXQ6IExlYWZCbG93ZXJKZXQ7XHJcbiAgICBwdWJsaWMgaXNCbG93aW5nOiBib29sZWFuID0gZmFsc2U7XHJcblxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKHB1YmxpYyBzY2VuZTogUGhhc2VyLlNjZW5lLCBwdWJsaWMgbGVhZnM6IFBoYXNlci5QaHlzaWNzLkFyY2FkZS5TcHJpdGVbXSkge1xyXG4gICAgICAgIHRoaXMubGVhZkJsb3dlckpldCA9IG5ldyBMZWFmQmxvd2VySmV0KHNjZW5lLCB0aGlzLmxlYWZzKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcHJlbG9hZCgpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLnNjZW5lLmxvYWQuaW1hZ2UoJ3BsYXllcicsICdhc3NldHMvc3ByaXRlcy9wbGF5ZXIucG5nJyk7XHJcbiAgICAgICAgdGhpcy5zY2VuZS5sb2FkLmF1ZGlvKCdwbGF5ZXJBaCcsICdhc3NldHMvYXVkaW8vcGxheWVyLWFoLm1wMycpO1xyXG4gICAgICAgIHRoaXMubGVhZkJsb3dlckpldC5wcmVsb2FkKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGNyZWF0ZSgpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLnNwcml0ZSA9IHRoaXMuc2NlbmUucGh5c2ljcy5hZGQuc3ByaXRlKDQ1MCwgNDAwLCAncGxheWVyJyk7XHJcbiAgICAgICAgdGhpcy5zcHJpdGUuc2V0Q29sbGlkZVdvcmxkQm91bmRzKHRydWUpO1xyXG5cclxuICAgICAgICB0aGlzLmxlYWZCbG93ZXJKZXQucGxheWVyID0gdGhpcy5zcHJpdGU7XHJcbiAgICAgICAgdGhpcy5sZWFmQmxvd2VySmV0LmNyZWF0ZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyB1cGRhdGUoKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5sZWFmQmxvd2VySmV0LmlzQmxvd2luZyA9IHRoaXMuaXNCbG93aW5nO1xyXG4gICAgICAgIHRoaXMubGVhZkJsb3dlckpldC51cGRhdGUoKTsgICAgICAgIFxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBtb3ZlKHBsYXllck5ld1ZlbG9jaXR5OiBQaGFzZXIuTWF0aC5WZWN0b3IyLCBwbGF5ZXJOZXdSb3RhdGlvbjogbnVtYmVyKSB7XHJcbiAgICAgICAgcGxheWVyTmV3VmVsb2NpdHkucm90YXRlKHRoaXMuc3ByaXRlLnJvdGF0aW9uKTtcclxuICAgICAgICB0aGlzLnNwcml0ZS5zZXRWZWxvY2l0eShwbGF5ZXJOZXdWZWxvY2l0eS54LCBwbGF5ZXJOZXdWZWxvY2l0eS55KTsgICAgXHJcbiAgICAgICAgdGhpcy5zcHJpdGUuc2V0Um90YXRpb24oUGhhc2VyLk1hdGguQW5nbGUuV3JhcCh0aGlzLnNwcml0ZS5yb3RhdGlvbiArIHBsYXllck5ld1JvdGF0aW9uKSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIG9uQ29sbGlkZVdpdGgoc3ByaXRlOiBQaGFzZXIuUGh5c2ljcy5BcmNhZGUuU3ByaXRlLCBoYW5kbGVyOiAoKSA9PiB2b2lkKSB7XHJcbiAgICAgICAgdGhpcy5zY2VuZS5waHlzaWNzLmFkZC5vdmVybGFwKHRoaXMuc3ByaXRlLCBzcHJpdGUsICBoYW5kbGVyKTtcclxuICAgIH1cclxuXHJcbn1cclxuXHJcbiIsIlxyXG5cclxuXHJcbmV4cG9ydCBjbGFzcyBSb2FkU3dlZXBlciB7XHJcblxyXG4gICAgcHJpdmF0ZSBzd2VlcGVyU2x1cnA6IFBoYXNlci5Tb3VuZC5XZWJBdWRpb1NvdW5kO1xyXG4gICAgcHJpdmF0ZSBzd2VlcGVyRW5naW5lOiBQaGFzZXIuU291bmQuV2ViQXVkaW9Tb3VuZDtcclxuXHJcbiAgICBwdWJsaWMgY29sbGVjdGVkTGVhZnM6IG51bWJlciA9IDA7XHJcblxyXG4gICAgcHVibGljIHNwcml0ZTogUGhhc2VyLlBoeXNpY3MuQXJjYWRlLlNwcml0ZTtcclxuICAgIHB1YmxpYyBwbGF5ZXI6IFBoYXNlci5QaHlzaWNzLkFyY2FkZS5TcHJpdGU7XHJcblxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKHB1YmxpYyBzY2VuZTogUGhhc2VyLlNjZW5lLCBwdWJsaWMgbGVhZnM6IFBoYXNlci5QaHlzaWNzLkFyY2FkZS5TcHJpdGVbXSkge1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBwcmVsb2FkKCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuc2NlbmUubG9hZC5pbWFnZSgnc3dlZXBlcicsICdhc3NldHMvc3ByaXRlcy9zd2VlcGVyLnBuZycpO1xyXG4gICAgICAgIHRoaXMuc2NlbmUubG9hZC5hdWRpbygnc2x1cnAnLCAnYXNzZXRzL2F1ZGlvL3NxdWl0LndhdicpO1xyXG4gICAgICAgIHRoaXMuc2NlbmUubG9hZC5hdWRpbygnc3dlZXBlci1lbmdpbmUnLCAnYXNzZXRzL2F1ZGlvL2RpZXNlbC1sb29wLm1wMycpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBjcmVhdGUoKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5zcHJpdGUgPSB0aGlzLnNjZW5lLnBoeXNpY3MuYWRkLnNwcml0ZSgzNzAsIDIwMDAsICdzd2VlcGVyJyk7XHJcbiAgICAgICAgdGhpcy5zcHJpdGUuc2V0VmVsb2NpdHlZKDEzMCk7XHJcblxyXG4gICAgICAgIHRoaXMuc3dlZXBlclNsdXJwID0gdGhpcy5zY2VuZS5zb3VuZC5hZGQoJ3NsdXJwJykgYXMgUGhhc2VyLlNvdW5kLldlYkF1ZGlvU291bmQ7XHJcbiAgICAgICAgdGhpcy5zd2VlcGVyRW5naW5lID0gdGhpcy5zY2VuZS5zb3VuZC5hZGQoJ3N3ZWVwZXItZW5naW5lJywge2xvb3A6IHRydWV9KSBhcyBQaGFzZXIuU291bmQuV2ViQXVkaW9Tb3VuZDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgdXBkYXRlKCk6IHZvaWQge1xyXG5cclxuICAgICAgICBpZiAodGhpcy5zcHJpdGUueSA+IDEwNTApIHtcclxuICAgICAgICAgICAgdGhpcy5zcHJpdGUueSA9IDA7XHJcbiAgICAgICAgICAgIHRoaXMuc3dlZXBlckVuZ2luZS5wbGF5KCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnN0IHBsYXllclN3ZWVwZXJEaXN0YW5jZSA9IFBoYXNlci5NYXRoLkRpc3RhbmNlLkJldHdlZW4odGhpcy5wbGF5ZXIueCwgdGhpcy5wbGF5ZXIueSwgdGhpcy5zcHJpdGUueCwgdGhpcy5zcHJpdGUueSk7XHJcbiAgICAgICAgdGhpcy5zd2VlcGVyRW5naW5lLnNldFZvbHVtZSgxIC8gcGxheWVyU3dlZXBlckRpc3RhbmNlICogMTAwKTtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgbGVhZiBvZiB0aGlzLmxlYWZzKSB7XHJcbiAgICAgICAgICAgIGlmICghbGVhZi52aXNpYmxlKSB7XHJcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjb25zdCBzd2VlcGVyRGlzdGFuY2UgPSBQaGFzZXIuTWF0aC5EaXN0YW5jZS5CZXR3ZWVuKHRoaXMuc3ByaXRlLngsIHRoaXMuc3ByaXRlLnksIGxlYWYueCwgbGVhZi55KTtcclxuICAgICAgICAgICAgaWYgKHN3ZWVwZXJEaXN0YW5jZSA8IDQwKSB7XHJcbiAgICAgICAgICAgICAgICBsZWFmLnNldFZpc2libGUoZmFsc2UpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zd2VlcGVyU2x1cnAucGxheSgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jb2xsZWN0ZWRMZWFmcysrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcbn1cclxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0aWYoX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSkge1xuXHRcdHJldHVybiBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4vLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuX193ZWJwYWNrX3JlcXVpcmVfXy5tID0gX193ZWJwYWNrX21vZHVsZXNfXztcblxuIiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkiLCIvLyBubyBiYXNlVVJJXG5cbi8vIG9iamVjdCB0byBzdG9yZSBsb2FkZWQgYW5kIGxvYWRpbmcgY2h1bmtzXG4vLyB1bmRlZmluZWQgPSBjaHVuayBub3QgbG9hZGVkLCBudWxsID0gY2h1bmsgcHJlbG9hZGVkL3ByZWZldGNoZWRcbi8vIFByb21pc2UgPSBjaHVuayBsb2FkaW5nLCAwID0gY2h1bmsgbG9hZGVkXG52YXIgaW5zdGFsbGVkQ2h1bmtzID0ge1xuXHRcImFwcFwiOiAwXG59O1xuXG52YXIgZGVmZXJyZWRNb2R1bGVzID0gW1xuXHRbXCIuL3NyYy9tYWluLnRzXCIsXCJ2ZW5kb3JzXCJdXG5dO1xuLy8gbm8gY2h1bmsgb24gZGVtYW5kIGxvYWRpbmdcblxuLy8gbm8gcHJlZmV0Y2hpbmdcblxuLy8gbm8gcHJlbG9hZGVkXG5cbi8vIG5vIEhNUlxuXG4vLyBubyBITVIgbWFuaWZlc3RcblxudmFyIGNoZWNrRGVmZXJyZWRNb2R1bGVzID0gKCkgPT4ge1xuXG59O1xuZnVuY3Rpb24gY2hlY2tEZWZlcnJlZE1vZHVsZXNJbXBsKCkge1xuXHR2YXIgcmVzdWx0O1xuXHRmb3IodmFyIGkgPSAwOyBpIDwgZGVmZXJyZWRNb2R1bGVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0dmFyIGRlZmVycmVkTW9kdWxlID0gZGVmZXJyZWRNb2R1bGVzW2ldO1xuXHRcdHZhciBmdWxmaWxsZWQgPSB0cnVlO1xuXHRcdGZvcih2YXIgaiA9IDE7IGogPCBkZWZlcnJlZE1vZHVsZS5sZW5ndGg7IGorKykge1xuXHRcdFx0dmFyIGRlcElkID0gZGVmZXJyZWRNb2R1bGVbal07XG5cdFx0XHRpZihpbnN0YWxsZWRDaHVua3NbZGVwSWRdICE9PSAwKSBmdWxmaWxsZWQgPSBmYWxzZTtcblx0XHR9XG5cdFx0aWYoZnVsZmlsbGVkKSB7XG5cdFx0XHRkZWZlcnJlZE1vZHVsZXMuc3BsaWNlKGktLSwgMSk7XG5cdFx0XHRyZXN1bHQgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IGRlZmVycmVkTW9kdWxlWzBdKTtcblx0XHR9XG5cdH1cblx0aWYoZGVmZXJyZWRNb2R1bGVzLmxlbmd0aCA9PT0gMCkge1xuXHRcdF9fd2VicGFja19yZXF1aXJlX18ueCgpO1xuXHRcdF9fd2VicGFja19yZXF1aXJlX18ueCA9ICgpID0+IHtcblxuXHRcdH1cblx0fVxuXHRyZXR1cm4gcmVzdWx0O1xufVxuX193ZWJwYWNrX3JlcXVpcmVfXy54ID0gKCkgPT4ge1xuXHQvLyByZXNldCBzdGFydHVwIGZ1bmN0aW9uIHNvIGl0IGNhbiBiZSBjYWxsZWQgYWdhaW4gd2hlbiBtb3JlIHN0YXJ0dXAgY29kZSBpcyBhZGRlZFxuXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnggPSAoKSA9PiB7XG5cblx0fVxuXHRjaHVua0xvYWRpbmdHbG9iYWwgPSBjaHVua0xvYWRpbmdHbG9iYWwuc2xpY2UoKTtcblx0Zm9yKHZhciBpID0gMDsgaSA8IGNodW5rTG9hZGluZ0dsb2JhbC5sZW5ndGg7IGkrKykgd2VicGFja0pzb25wQ2FsbGJhY2soY2h1bmtMb2FkaW5nR2xvYmFsW2ldKTtcblx0cmV0dXJuIChjaGVja0RlZmVycmVkTW9kdWxlcyA9IGNoZWNrRGVmZXJyZWRNb2R1bGVzSW1wbCkoKTtcbn07XG5cbi8vIGluc3RhbGwgYSBKU09OUCBjYWxsYmFjayBmb3IgY2h1bmsgbG9hZGluZ1xudmFyIHdlYnBhY2tKc29ucENhbGxiYWNrID0gKGRhdGEpID0+IHtcblx0dmFyIFtjaHVua0lkcywgbW9yZU1vZHVsZXMsIHJ1bnRpbWUsIGV4ZWN1dGVNb2R1bGVzXSA9IGRhdGE7XG5cdC8vIGFkZCBcIm1vcmVNb2R1bGVzXCIgdG8gdGhlIG1vZHVsZXMgb2JqZWN0LFxuXHQvLyB0aGVuIGZsYWcgYWxsIFwiY2h1bmtJZHNcIiBhcyBsb2FkZWQgYW5kIGZpcmUgY2FsbGJhY2tcblx0dmFyIG1vZHVsZUlkLCBjaHVua0lkLCBpID0gMCwgcmVzb2x2ZXMgPSBbXTtcblx0Zm9yKDtpIDwgY2h1bmtJZHMubGVuZ3RoOyBpKyspIHtcblx0XHRjaHVua0lkID0gY2h1bmtJZHNbaV07XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGluc3RhbGxlZENodW5rcywgY2h1bmtJZCkgJiYgaW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdKSB7XG5cdFx0XHRyZXNvbHZlcy5wdXNoKGluc3RhbGxlZENodW5rc1tjaHVua0lkXVswXSk7XG5cdFx0fVxuXHRcdGluc3RhbGxlZENodW5rc1tjaHVua0lkXSA9IDA7XG5cdH1cblx0Zm9yKG1vZHVsZUlkIGluIG1vcmVNb2R1bGVzKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKG1vcmVNb2R1bGVzLCBtb2R1bGVJZCkpIHtcblx0XHRcdF9fd2VicGFja19yZXF1aXJlX18ubVttb2R1bGVJZF0gPSBtb3JlTW9kdWxlc1ttb2R1bGVJZF07XG5cdFx0fVxuXHR9XG5cdGlmKHJ1bnRpbWUpIHJ1bnRpbWUoX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cdHBhcmVudENodW5rTG9hZGluZ0Z1bmN0aW9uKGRhdGEpO1xuXHR3aGlsZShyZXNvbHZlcy5sZW5ndGgpIHtcblx0XHRyZXNvbHZlcy5zaGlmdCgpKCk7XG5cdH1cblxuXHQvLyBhZGQgZW50cnkgbW9kdWxlcyBmcm9tIGxvYWRlZCBjaHVuayB0byBkZWZlcnJlZCBsaXN0XG5cdGlmKGV4ZWN1dGVNb2R1bGVzKSBkZWZlcnJlZE1vZHVsZXMucHVzaC5hcHBseShkZWZlcnJlZE1vZHVsZXMsIGV4ZWN1dGVNb2R1bGVzKTtcblxuXHQvLyBydW4gZGVmZXJyZWQgbW9kdWxlcyB3aGVuIGFsbCBjaHVua3MgcmVhZHlcblx0cmV0dXJuIGNoZWNrRGVmZXJyZWRNb2R1bGVzKCk7XG59XG5cbnZhciBjaHVua0xvYWRpbmdHbG9iYWwgPSBzZWxmW1wid2VicGFja0NodW5rbGVhZl9ibG93ZXJfcGhhc2VyXCJdID0gc2VsZltcIndlYnBhY2tDaHVua2xlYWZfYmxvd2VyX3BoYXNlclwiXSB8fCBbXTtcbnZhciBwYXJlbnRDaHVua0xvYWRpbmdGdW5jdGlvbiA9IGNodW5rTG9hZGluZ0dsb2JhbC5wdXNoLmJpbmQoY2h1bmtMb2FkaW5nR2xvYmFsKTtcbmNodW5rTG9hZGluZ0dsb2JhbC5wdXNoID0gd2VicGFja0pzb25wQ2FsbGJhY2s7IiwiLy8gcnVuIHN0YXJ0dXBcbnJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fLngoKTtcbiJdLCJzb3VyY2VSb290IjoiIn0=