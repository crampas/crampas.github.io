/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/main.ts":
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
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
    backgroundColor: '#000030',
};
exports.game = new Phaser.Game(gameConfig);
window.addEventListener('resize', function () {
    exports.game.scale.refresh();
});


/***/ }),

/***/ "./src/scenes/asteroid.ts":
/*!********************************!*\
  !*** ./src/scenes/asteroid.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AsteroidController = exports.Asteroid = void 0;
var Vector2 = Phaser.Math.Vector2;
var Asteroid = /** @class */ (function () {
    function Asteroid(scene, explosionController, scoreController, source, target) {
        this.scene = scene;
        this.explosionController = explosionController;
        this.scoreController = scoreController;
        this.source = source;
        this.target = target;
        this.exploded = false;
        var dx = target.x - source.x;
        var dy = target.y - source.y;
        var direction = new Phaser.Math.Vector2(dx / 10, dy / 10);
        var speed = direction.length();
        var c1 = this.scene.add.container(source.x, 0);
        var ball = this.scene.add.sprite(0, 0, "ball");
        c1.add(ball);
        var wisp = this.scene.add.particles(0, 0, 'flares', {
            frame: 'white',
            color: [0xffffff, 0xff8000, 0x000000],
            colorEase: 'quart.out',
            lifespan: 5000,
            angle: { min: -2, max: 2 },
            scale: { start: 0.1, end: 1, ease: 'sine.in' },
            speed: { min: speed, max: speed },
            advance: 0, // 2000
            blendMode: 'ADD',
            accelerationX: 0,
            accelerationY: 0
        });
        c1.add(wisp);
        c1.setRotation((new Phaser.Math.Vector2(-dx, -dy).angle()));
        var missileGroup = this.scene.physics.add.group(c1);
        missileGroup.setVelocity(direction.x, direction.y);
        this.sprite = c1;
        this.engineSound = this.scene.sound.add('engine-2');
        this.engineSound.play();
    }
    Asteroid.prototype.update = function () {
        var location = new Vector2(this.sprite.x, this.sprite.y);
        if (this.sprite && !this.exploded) {
            var isHit = false;
            if (this.explosionController.isHit(location)) {
                isHit = true;
                this.scoreController.notifyAsteriodDestroy();
            }
            if (isHit || this.sprite.y >= this.scene.game.canvas.height - 100) {
                var k = this.sprite.getAt(0);
                k.setVisible(false);
                var p = this.sprite.getAt(1);
                p.stop(false);
                this.engineSound.stop();
                if (isHit) {
                    this.explosionController.explode(new Vector2(this.sprite.x, this.sprite.y), 1, 0.98, 0xffa080, 0);
                }
                else {
                    this.scoreController.notifyAsteriodExploded();
                    this.explosionController.explode(new Vector2(this.sprite.x, this.sprite.y), 10, 0.99, 0xff8000, 0.1);
                }
                this.exploded = true;
            }
        }
    };
    return Asteroid;
}());
exports.Asteroid = Asteroid;
var AsteroidController = /** @class */ (function () {
    function AsteroidController(scene, explosionController, scoreController) {
        this.scene = scene;
        this.explosionController = explosionController;
        this.scoreController = scoreController;
        this.asteriods = [];
    }
    AsteroidController.prototype.preload = function () {
        this.scene.load.spritesheet('ball', 'https://labs.phaser.io/assets/sprites/balls.png', { frameWidth: 17, frameHeight: 17 });
        this.scene.load.atlas('flares', 'https://labs.phaser.io/assets/particles/flares.png', 'https://labs.phaser.io/assets/particles/flares.json');
        this.scene.load.audio('engine-1', 'assets/audio/enginehum.ogg');
        this.scene.load.audio('engine-2', 'assets/audio/enginehum3.ogg');
    };
    AsteroidController.prototype.create = function () {
    };
    AsteroidController.prototype.update = function () {
        this.asteriods.forEach(function (item) { return item.update(); });
    };
    AsteroidController.prototype.createAsteriod = function (source, target) {
        this.asteriods.push(new Asteroid(this.scene, this.explosionController, this.scoreController, source, target));
    };
    return AsteroidController;
}());
exports.AsteroidController = AsteroidController;


/***/ }),

/***/ "./src/scenes/explosion.ts":
/*!*********************************!*\
  !*** ./src/scenes/explosion.ts ***!
  \*********************************/
/***/ (function(__unused_webpack_module, exports) {


var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ExplosionController = exports.Explosion = void 0;
var Explosion = /** @class */ (function () {
    function Explosion(scene, location, intensity, reduction, color, upwind) {
        this.scene = scene;
        this.location = location;
        this.intensity = intensity;
        this.reduction = reduction;
        this.color = color;
        this.upwind = upwind;
        this.lights = [];
        var indexMax = intensity;
        for (var index = 0; index < indexMax; index++) {
            var dx = indexMax > 1 ? 100 * index / (indexMax - 1) - 50 : 0;
            var dy = Math.random() * 20 - 10;
            var newlight = this.scene.add.pointlight(location.x + dx, location.y + dy, color, 30, 1);
            newlight.attenuation = 0.1;
            this.lights.push(newlight);
        }
        this.explosionSound = this.intensity > 1 ?
            this.scene.sound.add('explosion-1') :
            this.scene.sound.add('explosion-2');
        this.explosionSound.play();
    }
    Explosion.prototype.update = function () {
        var _this = this;
        this.lights.forEach(function (light) {
            light.y -= _this.upwind;
            light.radius *= 1.01;
            light.intensity *= _this.reduction;
        });
        var removeExplosion = this.lights.reduce(function (remove, light) { return remove || light.intensity < 0.001; }, false);
        if (removeExplosion) {
            this.lights.forEach(function (light) {
                light.destroy(true);
            });
            this.lights = [];
        }
    };
    Explosion.prototype.isActive = function () {
        return this.lights.length > 0;
    };
    Explosion.prototype.isHit = function (location) {
        if (this.isActive()) {
            return this.location.distance(location) < 20;
        }
        return false;
    };
    return Explosion;
}());
exports.Explosion = Explosion;
var ExplosionController = /** @class */ (function () {
    function ExplosionController(scene) {
        this.scene = scene;
        this.explosions = [];
    }
    ExplosionController.prototype.preload = function () {
        this.scene.load.audio('explosion-1', 'assets/audio/rock_breaking.flac');
        this.scene.load.audio('explosion-2', 'assets/audio/DeathFlash.flac');
    };
    ExplosionController.prototype.create = function () {
    };
    ExplosionController.prototype.update = function () {
        this.explosions.forEach(function (missile) { return missile.update(); });
        this.explosions = this.explosions.reduce(function (active, explosion) {
            if (explosion.isActive()) {
                return __spreadArray(__spreadArray([], active, true), [explosion], false);
            }
            return active;
        }, []);
    };
    ExplosionController.prototype.explode = function (location, intensity, reduction, color, upwind) {
        this.explosions.push(new Explosion(this.scene, location, intensity, reduction, color, upwind));
    };
    ExplosionController.prototype.isHit = function (location) {
        return this.explosions.reduce(function (hit, explosion) { return hit || explosion.isHit(location); }, false);
    };
    return ExplosionController;
}());
exports.ExplosionController = ExplosionController;


/***/ }),

/***/ "./src/scenes/index.ts":
/*!*****************************!*\
  !*** ./src/scenes/index.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
var light_test_scene_1 = __webpack_require__(/*! ./light-test-scene */ "./src/scenes/light-test-scene.ts");
var missile_test_scene_1 = __webpack_require__(/*! ./missile-test-scene */ "./src/scenes/missile-test-scene.ts");
exports["default"] = [missile_test_scene_1.MissileTestScene, light_test_scene_1.LightTestScene];


/***/ }),

/***/ "./src/scenes/light-test-scene.ts":
/*!****************************************!*\
  !*** ./src/scenes/light-test-scene.ts ***!
  \****************************************/
/***/ (function(__unused_webpack_module, exports) {


var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LightTestScene = void 0;
var LightTestScene = /** @class */ (function (_super) {
    __extends(LightTestScene, _super);
    function LightTestScene() {
        var _this = _super.call(this) || this;
        _this.mylights = [];
        _this.colorIndex = 0;
        _this.colorIndexMax = 32;
        _this.explosionIntensity = 1;
        return _this;
    }
    LightTestScene.prototype.update = function () {
        this.text.text = "Wheel: Hue\nA + D: Explosion intensity ".concat(this.explosionIntensity, "\nW + S: Attenuation\nClick to set Light\ncolorIndex: ").concat(this.colorIndex);
        this.mylights.forEach(function (light) {
            light.y = (light.y - 60) * 0.997 + 60;
            light.radius *= 1.01;
            light.intensity *= 0.99;
        });
    };
    LightTestScene.prototype.create = function () {
        var _this = this;
        this.text = this.add.text(10, 10, 'Wheel: Hue\nA + D: Radius\nW + S: Attenuation\nClick to set Light').setDepth(1);
        var spectrum = Phaser.Display.Color.ColorSpectrum(this.colorIndexMax);
        var radius = 30;
        var intensity = 1;
        var attenuation = 0.1;
        var light = this.add.pointlight(400, 300, 0, radius, intensity);
        var color = spectrum[this.colorIndex];
        light.color.setTo(color.r, color.g, color.b);
        this.input.on('pointerdown', function (pointer) {
            _this.colorIndex = (_this.colorIndex + 1) % _this.colorIndexMax;
            var indexMax = _this.explosionIntensity;
            for (var index = 0; index < indexMax; index++) {
                var dx = indexMax > 1 ? 300 * index / (indexMax - 1) - 150 : 0;
                var dy = Math.random() * 20 - 10;
                var newlight = _this.add.pointlight(pointer.x + dx, pointer.y + dy, 0, radius, intensity);
                color = spectrum[_this.colorIndex];
                newlight.attenuation = attenuation;
                newlight.color.setTo(color.r, color.g, color.b);
                _this.mylights.push(newlight);
            }
        });
        this.input.on('pointermove', function (pointer) {
            light.x = pointer.x;
            light.y = pointer.y;
        });
        this.input.on('wheel', function (pointer, over, deltaX, deltaY, deltaZ) {
            if (deltaY < 0) {
                _this.colorIndex--;
            }
            else if (deltaY > 0) {
                _this.colorIndex++;
            }
            if (_this.colorIndex === spectrum.length) {
                _this.colorIndex = 0;
            }
            else if (_this.colorIndex < 0) {
                _this.colorIndex = spectrum.length - 1;
            }
            _this.colorIndex = _this.colorIndex % _this.colorIndexMax;
            color = spectrum[_this.colorIndex];
            light.color.setTo(color.r, color.g, color.b);
        });
        this.input.keyboard.on('keydown-A', function () {
            _this.explosionIntensity = Math.max(_this.explosionIntensity - 1, 0);
        });
        this.input.keyboard.on('keydown-D', function () {
            _this.explosionIntensity = Math.min(_this.explosionIntensity + 1, 100);
        });
        this.input.keyboard.on('keydown-W', function () {
            light.attenuation += 0.01;
            attenuation += 0.01;
        });
        this.input.keyboard.on('keydown-S', function () {
            light.attenuation -= 0.01;
            attenuation -= 0.01;
        });
    };
    return LightTestScene;
}(Phaser.Scene));
exports.LightTestScene = LightTestScene;


/***/ }),

/***/ "./src/scenes/missile-test-scene.ts":
/*!******************************************!*\
  !*** ./src/scenes/missile-test-scene.ts ***!
  \******************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MissileTestScene = void 0;
var Vector2 = Phaser.Math.Vector2;
var missile_1 = __webpack_require__(/*! ./missile */ "./src/scenes/missile.ts");
var asteroid_1 = __webpack_require__(/*! ./asteroid */ "./src/scenes/asteroid.ts");
var explosion_1 = __webpack_require__(/*! ./explosion */ "./src/scenes/explosion.ts");
var score_1 = __webpack_require__(/*! ./score */ "./src/scenes/score.ts");
var sceneConfig = {
    active: false,
    visible: true,
    key: 'MissileTestScene',
};
var MissileTestScene = /** @class */ (function (_super) {
    __extends(MissileTestScene, _super);
    function MissileTestScene() {
        var _this = _super.call(this, sceneConfig) || this;
        _this.scoreController = new score_1.ScoreController();
        _this.explosionController = new explosion_1.ExplosionController(_this);
        _this.missileController = new missile_1.MissileController(_this, _this.explosionController);
        _this.asteriodController = new asteroid_1.AsteroidController(_this, _this.explosionController, _this.scoreController);
        return _this;
    }
    MissileTestScene.prototype.preload = function () {
        this.load.image('bg', 'https://labs.phaser.io/assets/skies/space3.png');
        this.missileController.preload();
        this.asteriodController.preload();
        this.explosionController.preload();
    };
    MissileTestScene.prototype.create = function () {
        var _this = this;
        var background = this.add.image(this.game.canvas.width / 2, this.game.canvas.height / 2, 'bg');
        background.scaleX = this.game.canvas.width / background.width;
        background.scaleY = this.game.canvas.height / background.height;
        this.text = this.add.text(10, 10, 'Wheel: Hue\nA + D: Radius\nW + S: Attenuation\nClick to set Light').setDepth(1);
        var light = this.add.pointlight(400, 300, 0xa0a0a0, 15, 1);
        this.input.on('pointerdown', function (pointer) {
            _this.launchMissile(pointer.x, pointer.y);
        });
        this.input.on('pointermove', function (pointer) {
            light.x = pointer.x;
            light.y = pointer.y;
        });
        this.input.keyboard.on('keydown-D', function () {
            // this.explosionIntensity = Math.min(this.explosionIntensity + 1, 100);
        });
        this.missileController.create();
        this.asteriodController.create();
    };
    MissileTestScene.prototype.update = function () {
        this.text.text = this.scoreController.toString();
        this.explosionController.update();
        this.missileController.update();
        this.asteriodController.update();
        if (Math.random() < 0.003) {
            this.dropAsteroid();
        }
    };
    MissileTestScene.prototype.launchMissile = function (x, y) {
        this.scoreController.notifyMissileLaunched();
        this.missileController.createMissile(new Vector2(this.game.canvas.width / 2.0, this.game.canvas.height - 20), new Vector2(x, y));
    };
    MissileTestScene.prototype.dropAsteroid = function () {
        this.scoreController.notifyAsteriodDropped();
        var sourceX = Phaser.Math.Between(-0.1 * this.game.canvas.width, 1.1 * this.game.canvas.width);
        var targetX = Phaser.Math.Between(0.1 * this.game.canvas.width, 0.9 * this.game.canvas.width);
        this.asteriodController.createAsteriod(new Vector2(sourceX, 0), new Vector2(targetX, this.game.canvas.height - 20));
    };
    return MissileTestScene;
}(Phaser.Scene));
exports.MissileTestScene = MissileTestScene;


/***/ }),

/***/ "./src/scenes/missile.ts":
/*!*******************************!*\
  !*** ./src/scenes/missile.ts ***!
  \*******************************/
/***/ (function(__unused_webpack_module, exports) {


var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MissileController = exports.Missile = void 0;
var Vector2 = Phaser.Math.Vector2;
var Missile = /** @class */ (function () {
    function Missile(scene, explosionController, source, target) {
        this.scene = scene;
        this.explosionController = explosionController;
        this.source = source;
        this.target = target;
        this.exploded = false;
        this.sprite = this.scene.physics.add.sprite(source.x, source.y, 'missile-1');
        var direction = new Vector2(target).subtract(source);
        var velocity = direction.normalize().scale(300);
        this.sprite.setRotation(direction.angle() + Math.PI / 2.0);
        this.sprite.setVelocityX(velocity.x);
        this.sprite.setVelocityY(velocity.y);
    }
    Missile.prototype.update = function () {
        if (this.sprite) {
            var location_1 = new Vector2(this.sprite.x, this.sprite.y);
            if (location_1.distance(this.target) < 10.0) {
                this.sprite.destroy();
                this.sprite = null;
                this.explosionController.explode(location_1, 1, 0.99, 0xa0a0ff, 0);
                this.exploded = true;
            }
        }
    };
    Missile.prototype.isActive = function () {
        return this.sprite != null;
    };
    return Missile;
}());
exports.Missile = Missile;
var MissileController = /** @class */ (function () {
    function MissileController(scene, explosionController) {
        this.scene = scene;
        this.explosionController = explosionController;
        this.missiles = [];
    }
    MissileController.prototype.preload = function () {
        this.scene.load.image('missile-1', 'assets/storm_shadow.png');
    };
    MissileController.prototype.create = function () {
    };
    MissileController.prototype.update = function () {
        this.missiles.forEach(function (missile) { return missile.update(); });
        this.missiles = this.missiles.reduce(function (active, explosion) {
            if (explosion.isActive()) {
                return __spreadArray(__spreadArray([], active, true), [explosion], false);
            }
            return active;
        }, []);
    };
    MissileController.prototype.createMissile = function (source, target) {
        if (this.missiles.length < 3) {
            this.missiles.push(new Missile(this.scene, this.explosionController, source, target));
        }
    };
    return MissileController;
}());
exports.MissileController = MissileController;


/***/ }),

/***/ "./src/scenes/score.ts":
/*!*****************************!*\
  !*** ./src/scenes/score.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ScoreController = void 0;
var ScoreController = /** @class */ (function () {
    function ScoreController() {
        this.asteriodsDestroid = 0;
        this.asteriodsExploded = 0;
        this.missiles = 0;
        this.asteriods = 0;
    }
    ScoreController.prototype.notifyAsteriodDestroy = function () {
        this.asteriodsDestroid++;
    };
    ScoreController.prototype.notifyAsteriodExploded = function () {
        this.asteriodsExploded++;
    };
    ScoreController.prototype.notifyMissileLaunched = function () {
        this.missiles++;
    };
    ScoreController.prototype.notifyAsteriodDropped = function () {
        this.asteriods++;
    };
    ScoreController.prototype.toString = function () {
        return "Destroyed: ".concat(this.asteriodsDestroid, "\nExplosions: ").concat(this.asteriodsExploded, "\nMissiles: ").concat(this.missiles);
    };
    return ScoreController;
}());
exports.ScoreController = ScoreController;


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
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
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	(() => {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = (result, chunkIds, fn, priority) => {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var [chunkIds, fn, priority] = deferred[i];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"app": 0
/******/ 		};
/******/ 		
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
/******/ 		__webpack_require__.O.j = (chunkId) => (installedChunks[chunkId] === 0);
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 			return __webpack_require__.O(result);
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunkarmageddon_phaser"] = self["webpackChunkarmageddon_phaser"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["vendors"], () => (__webpack_require__("./src/main.ts")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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LHFCQUFxQjtXQUN0QztXQUNBO1dBQ0Esa0JBQWtCLHFCQUFxQjtXQUN2QztXQUNBO1dBQ0EsS0FBSztXQUNMO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTs7Ozs7V0MzQkE7Ozs7O1dDQUE7O1dBRUE7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBOztXQUVBOztXQUVBOztXQUVBOztXQUVBOztXQUVBOztXQUVBOztXQUVBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLE1BQU0scUJBQXFCO1dBQzNCO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7O1dBRUE7V0FDQTtXQUNBOzs7OztVRWhEQTtVQUNBO1VBQ0E7VUFDQTtVQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vYXJtYWdlZGRvbi1waGFzZXIvLi9zcmMvbWFpbi50cyIsIndlYnBhY2s6Ly9hcm1hZ2VkZG9uLXBoYXNlci8uL3NyYy9zY2VuZXMvYXN0ZXJvaWQudHMiLCJ3ZWJwYWNrOi8vYXJtYWdlZGRvbi1waGFzZXIvLi9zcmMvc2NlbmVzL2V4cGxvc2lvbi50cyIsIndlYnBhY2s6Ly9hcm1hZ2VkZG9uLXBoYXNlci8uL3NyYy9zY2VuZXMvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vYXJtYWdlZGRvbi1waGFzZXIvLi9zcmMvc2NlbmVzL2xpZ2h0LXRlc3Qtc2NlbmUudHMiLCJ3ZWJwYWNrOi8vYXJtYWdlZGRvbi1waGFzZXIvLi9zcmMvc2NlbmVzL21pc3NpbGUtdGVzdC1zY2VuZS50cyIsIndlYnBhY2s6Ly9hcm1hZ2VkZG9uLXBoYXNlci8uL3NyYy9zY2VuZXMvbWlzc2lsZS50cyIsIndlYnBhY2s6Ly9hcm1hZ2VkZG9uLXBoYXNlci8uL3NyYy9zY2VuZXMvc2NvcmUudHMiLCJ3ZWJwYWNrOi8vYXJtYWdlZGRvbi1waGFzZXIvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vYXJtYWdlZGRvbi1waGFzZXIvd2VicGFjay9ydW50aW1lL2NodW5rIGxvYWRlZCIsIndlYnBhY2s6Ly9hcm1hZ2VkZG9uLXBoYXNlci93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2FybWFnZWRkb24tcGhhc2VyL3dlYnBhY2svcnVudGltZS9qc29ucCBjaHVuayBsb2FkaW5nIiwid2VicGFjazovL2FybWFnZWRkb24tcGhhc2VyL3dlYnBhY2svYmVmb3JlLXN0YXJ0dXAiLCJ3ZWJwYWNrOi8vYXJtYWdlZGRvbi1waGFzZXIvd2VicGFjay9zdGFydHVwIiwid2VicGFjazovL2FybWFnZWRkb24tcGhhc2VyL3dlYnBhY2svYWZ0ZXItc3RhcnR1cCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBQaGFzZXIgZnJvbSAncGhhc2VyJztcbmltcG9ydCBzY2VuZXMgZnJvbSAnLi9zY2VuZXMnO1xuXG5jb25zdCBnYW1lQ29uZmlnOiBQaGFzZXIuVHlwZXMuQ29yZS5HYW1lQ29uZmlnID0ge1xuICB0aXRsZTogJ0xlYWYgQmxvd2VyIEpTJyxcbiBcbiAgdHlwZTogUGhhc2VyLkFVVE8sXG4gXG4gIHNjYWxlOiB7XG4gICAgd2lkdGg6IHdpbmRvdy5pbm5lcldpZHRoLFxuICAgIGhlaWdodDogd2luZG93LmlubmVySGVpZ2h0LFxuICB9LFxuIFxuICBzY2VuZTogc2NlbmVzLFxuXG4gIHBoeXNpY3M6IHtcbiAgICBkZWZhdWx0OiAnYXJjYWRlJyxcbiAgICBhcmNhZGU6IHtcbiAgICAgIGRlYnVnOiBmYWxzZSxcbiAgICB9LFxuICB9LFxuIFxuICBwYXJlbnQ6ICdnYW1lJyxcbiAgYmFja2dyb3VuZENvbG9yOiAnIzAwMDAzMCcsXG59O1xuIFxuZXhwb3J0IGNvbnN0IGdhbWUgPSBuZXcgUGhhc2VyLkdhbWUoZ2FtZUNvbmZpZyk7XG5cbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCAoKSA9PiB7XG4gIGdhbWUuc2NhbGUucmVmcmVzaCgpO1xufSk7XG4iLCJpbXBvcnQgQ29udGFpbmVyID0gUGhhc2VyLkdhbWVPYmplY3RzLkNvbnRhaW5lcjtcbmltcG9ydCBWZWN0b3IyID0gUGhhc2VyLk1hdGguVmVjdG9yMjtcbmltcG9ydCBTcHJpdGUgPSBQaGFzZXIuR2FtZU9iamVjdHMuU3ByaXRlO1xuaW1wb3J0IFBhcnRpY2xlRW1pdHRlciA9IFBoYXNlci5HYW1lT2JqZWN0cy5QYXJ0aWNsZXMuUGFydGljbGVFbWl0dGVyO1xuaW1wb3J0IFdlYkF1ZGlvU291bmQgPSBQaGFzZXIuU291bmQuV2ViQXVkaW9Tb3VuZDtcbmltcG9ydCB7RXhwbG9zaW9uQ29udHJvbGxlcn0gZnJvbSBcIi4vZXhwbG9zaW9uXCI7XG5pbXBvcnQge1Njb3JlQ29udHJvbGxlcn0gZnJvbSBcIi4vc2NvcmVcIjtcblxuXG5leHBvcnQgY2xhc3MgQXN0ZXJvaWQge1xuICAgIHByaXZhdGUgc3ByaXRlOiBDb250YWluZXI7XG4gICAgcHJpdmF0ZSBleHBsb2RlZDogYm9vbGVhbiA9IGZhbHNlO1xuICAgIHByaXZhdGUgZW5naW5lU291bmQ6IFdlYkF1ZGlvU291bmQ7XG5cblxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihwdWJsaWMgc2NlbmU6IFBoYXNlci5TY2VuZSwgcHVibGljIGV4cGxvc2lvbkNvbnRyb2xsZXI6IEV4cGxvc2lvbkNvbnRyb2xsZXIsIHB1YmxpYyBzY29yZUNvbnRyb2xsZXI6IFNjb3JlQ29udHJvbGxlcixcbiAgICAgICAgICAgICAgICAgICAgICAgcHVibGljIHNvdXJjZTogVmVjdG9yMiwgcHVibGljIHRhcmdldDogVmVjdG9yMikge1xuICAgICAgICBjb25zdCBkeCA9IHRhcmdldC54IC0gc291cmNlLng7XG4gICAgICAgIGNvbnN0IGR5ID0gdGFyZ2V0LnkgLSBzb3VyY2UueTtcbiAgICAgICAgY29uc3QgZGlyZWN0aW9uID0gbmV3IFBoYXNlci5NYXRoLlZlY3RvcjIoZHggLyAxMCwgZHkgLyAxMCk7XG4gICAgICAgIGNvbnN0IHNwZWVkID0gZGlyZWN0aW9uLmxlbmd0aCgpO1xuXG4gICAgICAgIGNvbnN0IGMxID0gdGhpcy5zY2VuZS5hZGQuY29udGFpbmVyKHNvdXJjZS54LCAwKTtcbiAgICAgICAgY29uc3QgYmFsbCA9IHRoaXMuc2NlbmUuYWRkLnNwcml0ZSgwLCAwLCBcImJhbGxcIik7XG4gICAgICAgIGMxLmFkZChiYWxsKTtcbiAgICAgICAgY29uc3Qgd2lzcCA9IHRoaXMuc2NlbmUuYWRkLnBhcnRpY2xlcygwLCAwLCAnZmxhcmVzJyxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBmcmFtZTogJ3doaXRlJyxcbiAgICAgICAgICAgICAgICBjb2xvcjogWyAweGZmZmZmZiwgMHhmZjgwMDAsIDB4MDAwMDAwIF0sXG4gICAgICAgICAgICAgICAgY29sb3JFYXNlOiAncXVhcnQub3V0JyxcbiAgICAgICAgICAgICAgICBsaWZlc3BhbjogNTAwMCxcbiAgICAgICAgICAgICAgICBhbmdsZTogeyBtaW46IC0yLCBtYXg6IDIgfSxcbiAgICAgICAgICAgICAgICBzY2FsZTogeyBzdGFydDogMC4xLCBlbmQ6IDEsIGVhc2U6ICdzaW5lLmluJyB9LFxuICAgICAgICAgICAgICAgIHNwZWVkOiB7IG1pbjogc3BlZWQsIG1heDogc3BlZWQgfSxcbiAgICAgICAgICAgICAgICBhZHZhbmNlOiAwLCAvLyAyMDAwXG4gICAgICAgICAgICAgICAgYmxlbmRNb2RlOiAnQUREJyxcbiAgICAgICAgICAgICAgICBhY2NlbGVyYXRpb25YOiAwLFxuICAgICAgICAgICAgICAgIGFjY2VsZXJhdGlvblk6IDBcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIGMxLmFkZCh3aXNwKTtcbiAgICAgICAgYzEuc2V0Um90YXRpb24oKG5ldyBQaGFzZXIuTWF0aC5WZWN0b3IyKC1keCwgLWR5KS5hbmdsZSgpKSk7XG5cbiAgICAgICAgY29uc3QgbWlzc2lsZUdyb3VwID0gdGhpcy5zY2VuZS5waHlzaWNzLmFkZC5ncm91cChjMSk7XG4gICAgICAgIG1pc3NpbGVHcm91cC5zZXRWZWxvY2l0eShkaXJlY3Rpb24ueCwgZGlyZWN0aW9uLnkpO1xuICAgICAgICB0aGlzLnNwcml0ZSA9IGMxO1xuXG4gICAgICAgIHRoaXMuZW5naW5lU291bmQgPSB0aGlzLnNjZW5lLnNvdW5kLmFkZCgnZW5naW5lLTInKSBhcyBQaGFzZXIuU291bmQuV2ViQXVkaW9Tb3VuZDtcblxuICAgICAgICB0aGlzLmVuZ2luZVNvdW5kLnBsYXkoKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgdXBkYXRlKCk6IHZvaWQge1xuICAgICAgICBjb25zdCBsb2NhdGlvbiA9IG5ldyBWZWN0b3IyKHRoaXMuc3ByaXRlLngsIHRoaXMuc3ByaXRlLnkpO1xuXG4gICAgICAgIGlmICh0aGlzLnNwcml0ZSAmJiAhdGhpcy5leHBsb2RlZCkge1xuICAgICAgICAgICAgbGV0IGlzSGl0ID0gZmFsc2U7XG4gICAgICAgICAgICBpZiAodGhpcy5leHBsb3Npb25Db250cm9sbGVyLmlzSGl0KGxvY2F0aW9uKSkge1xuICAgICAgICAgICAgICAgIGlzSGl0ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB0aGlzLnNjb3JlQ29udHJvbGxlci5ub3RpZnlBc3RlcmlvZERlc3Ryb3koKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGlzSGl0IHx8IHRoaXMuc3ByaXRlLnkgPj0gdGhpcy5zY2VuZS5nYW1lLmNhbnZhcy5oZWlnaHQgLSAxMDApIHtcbiAgICAgICAgICAgICAgICBjb25zdCBrID0gdGhpcy5zcHJpdGUuZ2V0QXQoMCkgYXMgU3ByaXRlO1xuICAgICAgICAgICAgICAgIGsuc2V0VmlzaWJsZShmYWxzZSk7XG5cbiAgICAgICAgICAgICAgICBjb25zdCBwID0gdGhpcy5zcHJpdGUuZ2V0QXQoMSkgYXMgUGFydGljbGVFbWl0dGVyO1xuICAgICAgICAgICAgICAgIHAuc3RvcChmYWxzZSk7XG5cbiAgICAgICAgICAgICAgICB0aGlzLmVuZ2luZVNvdW5kLnN0b3AoKTtcblxuICAgICAgICAgICAgICAgIGlmIChpc0hpdCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmV4cGxvc2lvbkNvbnRyb2xsZXIuZXhwbG9kZShuZXcgVmVjdG9yMih0aGlzLnNwcml0ZS54LCB0aGlzLnNwcml0ZS55KSwgMSwgMC45OCwgMHhmZmEwODAsIDApO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2NvcmVDb250cm9sbGVyLm5vdGlmeUFzdGVyaW9kRXhwbG9kZWQoKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5leHBsb3Npb25Db250cm9sbGVyLmV4cGxvZGUobmV3IFZlY3RvcjIodGhpcy5zcHJpdGUueCwgdGhpcy5zcHJpdGUueSksIDEwLCAwLjk5LCAweGZmODAwMCwgMC4xKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5leHBsb2RlZCA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBBc3Rlcm9pZENvbnRyb2xsZXIge1xuICAgIHByaXZhdGUgYXN0ZXJpb2RzOiBBc3Rlcm9pZFtdID0gW107XG5cbiAgICBwdWJsaWMgY29uc3RydWN0b3IocHVibGljIHNjZW5lOiBQaGFzZXIuU2NlbmUsIHB1YmxpYyBleHBsb3Npb25Db250cm9sbGVyOiBFeHBsb3Npb25Db250cm9sbGVyLCBwdWJsaWMgc2NvcmVDb250cm9sbGVyOiBTY29yZUNvbnRyb2xsZXIpIHtcbiAgICB9XG5cbiAgICBwcmVsb2FkKCkge1xuICAgICAgICB0aGlzLnNjZW5lLmxvYWQuc3ByaXRlc2hlZXQoJ2JhbGwnLCAnaHR0cHM6Ly9sYWJzLnBoYXNlci5pby9hc3NldHMvc3ByaXRlcy9iYWxscy5wbmcnLCB7IGZyYW1lV2lkdGg6IDE3LCBmcmFtZUhlaWdodDogMTcgfSk7XG4gICAgICAgIHRoaXMuc2NlbmUubG9hZC5hdGxhcygnZmxhcmVzJywgJ2h0dHBzOi8vbGFicy5waGFzZXIuaW8vYXNzZXRzL3BhcnRpY2xlcy9mbGFyZXMucG5nJywgJ2h0dHBzOi8vbGFicy5waGFzZXIuaW8vYXNzZXRzL3BhcnRpY2xlcy9mbGFyZXMuanNvbicpO1xuXG4gICAgICAgIHRoaXMuc2NlbmUubG9hZC5hdWRpbygnZW5naW5lLTEnLCAnYXNzZXRzL2F1ZGlvL2VuZ2luZWh1bS5vZ2cnKTtcbiAgICAgICAgdGhpcy5zY2VuZS5sb2FkLmF1ZGlvKCdlbmdpbmUtMicsICdhc3NldHMvYXVkaW8vZW5naW5laHVtMy5vZ2cnKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgY3JlYXRlKCk6IHZvaWQge1xuICAgIH1cblxuICAgIHB1YmxpYyB1cGRhdGUoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuYXN0ZXJpb2RzLmZvckVhY2goaXRlbSA9PiBpdGVtLnVwZGF0ZSgpKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgY3JlYXRlQXN0ZXJpb2Qoc291cmNlOiBWZWN0b3IyLCB0YXJnZXQ6IFZlY3RvcjIpIHtcbiAgICAgICAgdGhpcy5hc3RlcmlvZHMucHVzaChuZXcgQXN0ZXJvaWQodGhpcy5zY2VuZSwgdGhpcy5leHBsb3Npb25Db250cm9sbGVyLCB0aGlzLnNjb3JlQ29udHJvbGxlciwgc291cmNlLCB0YXJnZXQpKTtcbiAgICB9XG59IiwiaW1wb3J0IFBvaW50TGlnaHQgPSBQaGFzZXIuR2FtZU9iamVjdHMuUG9pbnRMaWdodDtcbmltcG9ydCBWZWN0b3IyID0gUGhhc2VyLk1hdGguVmVjdG9yMjtcbmltcG9ydCBXZWJBdWRpb1NvdW5kID0gUGhhc2VyLlNvdW5kLldlYkF1ZGlvU291bmQ7XG5cblxuZXhwb3J0IGNsYXNzIEV4cGxvc2lvbiB7XG4gICAgcHJpdmF0ZSBsaWdodHM6IFBvaW50TGlnaHRbXSA9IFtdO1xuICAgIHByaXZhdGUgZXhwbG9zaW9uU291bmQ6IFdlYkF1ZGlvU291bmQ7XG5cbiAgICBwdWJsaWMgY29uc3RydWN0b3IocHVibGljIHNjZW5lOiBQaGFzZXIuU2NlbmUsIHB1YmxpYyBsb2NhdGlvbjogVmVjdG9yMiwgcHVibGljIGludGVuc2l0eTogbnVtYmVyLCBwdWJsaWMgcmVkdWN0aW9uOiBudW1iZXIsXG4gICAgICAgICAgICAgICAgICAgICAgIHB1YmxpYyBjb2xvcjogbnVtYmVyLCBwdWJsaWMgdXB3aW5kOiBudW1iZXIpIHtcbiAgICAgICAgbGV0IGluZGV4TWF4ID0gaW50ZW5zaXR5O1xuICAgICAgICBmb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDwgaW5kZXhNYXg7IGluZGV4KyspIHtcbiAgICAgICAgICAgIGxldCBkeCA9IGluZGV4TWF4ID4gMSA/IDEwMCAqIGluZGV4IC8gKGluZGV4TWF4IC0gMSkgLSA1MCA6IDA7XG4gICAgICAgICAgICBsZXQgZHkgPSBNYXRoLnJhbmRvbSgpICogMjAgLSAxMDtcbiAgICAgICAgICAgIGxldCBuZXdsaWdodCA9IHRoaXMuc2NlbmUuYWRkLnBvaW50bGlnaHQobG9jYXRpb24ueCArIGR4LCBsb2NhdGlvbi55ICsgZHksIGNvbG9yLCAzMCwgMSk7XG4gICAgICAgICAgICBuZXdsaWdodC5hdHRlbnVhdGlvbiA9IDAuMTtcbiAgICAgICAgICAgIHRoaXMubGlnaHRzLnB1c2gobmV3bGlnaHQpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5leHBsb3Npb25Tb3VuZCA9IHRoaXMuaW50ZW5zaXR5ID4gMSA/XG4gICAgICAgICAgICB0aGlzLnNjZW5lLnNvdW5kLmFkZCgnZXhwbG9zaW9uLTEnKSBhcyBQaGFzZXIuU291bmQuV2ViQXVkaW9Tb3VuZCA6XG4gICAgICAgICAgICB0aGlzLnNjZW5lLnNvdW5kLmFkZCgnZXhwbG9zaW9uLTInKSBhcyBQaGFzZXIuU291bmQuV2ViQXVkaW9Tb3VuZDtcbiAgICAgICAgdGhpcy5leHBsb3Npb25Tb3VuZC5wbGF5KCk7XG4gICAgfVxuXG4gICAgcHVibGljIHVwZGF0ZSgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5saWdodHMuZm9yRWFjaChsaWdodCA9PiB7XG4gICAgICAgICAgICBsaWdodC55IC09IHRoaXMudXB3aW5kO1xuICAgICAgICAgICAgbGlnaHQucmFkaXVzICo9IDEuMDFcbiAgICAgICAgICAgIGxpZ2h0LmludGVuc2l0eSAqPSB0aGlzLnJlZHVjdGlvbjtcbiAgICAgICAgfSk7XG4gICAgICAgIGNvbnN0IHJlbW92ZUV4cGxvc2lvbiA9IHRoaXMubGlnaHRzLnJlZHVjZSgocmVtb3ZlLCBsaWdodCkgPT4gcmVtb3ZlIHx8IGxpZ2h0LmludGVuc2l0eSA8IDAuMDAxLCBmYWxzZSk7XG4gICAgICAgIGlmIChyZW1vdmVFeHBsb3Npb24pIHtcbiAgICAgICAgICAgIHRoaXMubGlnaHRzLmZvckVhY2gobGlnaHQgPT4ge1xuICAgICAgICAgICAgICAgIGxpZ2h0LmRlc3Ryb3kodHJ1ZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMubGlnaHRzID0gW107XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgaXNBY3RpdmUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmxpZ2h0cy5sZW5ndGggPiAwO1xuICAgIH1cblxuICAgIHB1YmxpYyBpc0hpdChsb2NhdGlvbjogVmVjdG9yMik6IGJvb2xlYW4ge1xuICAgICAgICBpZiAodGhpcy5pc0FjdGl2ZSgpKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5sb2NhdGlvbi5kaXN0YW5jZShsb2NhdGlvbikgPCAyMDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxufVxuXG5cbmV4cG9ydCBjbGFzcyBFeHBsb3Npb25Db250cm9sbGVyIHtcbiAgICBwcml2YXRlIGV4cGxvc2lvbnM6IEV4cGxvc2lvbltdID0gW107XG5cbiAgICBwdWJsaWMgY29uc3RydWN0b3IocHVibGljIHNjZW5lOiBQaGFzZXIuU2NlbmUpIHtcbiAgICB9XG5cbiAgICBwcmVsb2FkKCkge1xuICAgICAgICB0aGlzLnNjZW5lLmxvYWQuYXVkaW8oJ2V4cGxvc2lvbi0xJywgJ2Fzc2V0cy9hdWRpby9yb2NrX2JyZWFraW5nLmZsYWMnKTtcbiAgICAgICAgdGhpcy5zY2VuZS5sb2FkLmF1ZGlvKCdleHBsb3Npb24tMicsICdhc3NldHMvYXVkaW8vRGVhdGhGbGFzaC5mbGFjJyk7XG4gICAgfVxuXG4gICAgcHVibGljIGNyZWF0ZSgpOiB2b2lkIHtcbiAgICB9XG5cbiAgICBwdWJsaWMgdXBkYXRlKCk6IHZvaWQge1xuICAgICAgICB0aGlzLmV4cGxvc2lvbnMuZm9yRWFjaChtaXNzaWxlID0+IG1pc3NpbGUudXBkYXRlKCkpO1xuICAgICAgICB0aGlzLmV4cGxvc2lvbnMgPSB0aGlzLmV4cGxvc2lvbnMucmVkdWNlPEV4cGxvc2lvbltdPigoYWN0aXZlLCBleHBsb3Npb24pID0+IHtcbiAgICAgICAgICAgIGlmIChleHBsb3Npb24uaXNBY3RpdmUoKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBbLi4uYWN0aXZlLCBleHBsb3Npb25dO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGFjdGl2ZTtcbiAgICAgICAgfSwgW10pO1xuICAgIH1cblxuICAgIHB1YmxpYyBleHBsb2RlKGxvY2F0aW9uOiBWZWN0b3IyLCBpbnRlbnNpdHk6IG51bWJlciwgcmVkdWN0aW9uOiBudW1iZXIsIGNvbG9yOiBudW1iZXIsIHVwd2luZDogbnVtYmVyKSB7XG4gICAgICAgIHRoaXMuZXhwbG9zaW9ucy5wdXNoKG5ldyBFeHBsb3Npb24odGhpcy5zY2VuZSwgbG9jYXRpb24sIGludGVuc2l0eSwgcmVkdWN0aW9uLCBjb2xvciwgdXB3aW5kKSlcbiAgICB9XG5cbiAgICBpc0hpdChsb2NhdGlvbjogUGhhc2VyLk1hdGguVmVjdG9yMik6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5leHBsb3Npb25zLnJlZHVjZSgoaGl0LCBleHBsb3Npb24pID0+IGhpdCB8fCBleHBsb3Npb24uaXNIaXQobG9jYXRpb24pLCBmYWxzZSk7XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgTGlnaHRUZXN0U2NlbmUgfSBmcm9tICcuL2xpZ2h0LXRlc3Qtc2NlbmUnO1xuaW1wb3J0IHtNaXNzaWxlVGVzdFNjZW5lfSBmcm9tIFwiLi9taXNzaWxlLXRlc3Qtc2NlbmVcIjtcblxuZXhwb3J0IGRlZmF1bHQgW01pc3NpbGVUZXN0U2NlbmUsIExpZ2h0VGVzdFNjZW5lXTtcbiIsImltcG9ydCBQb2ludExpZ2h0ID0gUGhhc2VyLkdhbWVPYmplY3RzLlBvaW50TGlnaHQ7XG5pbXBvcnQgVGV4dCA9IFBoYXNlci5HYW1lT2JqZWN0cy5UZXh0O1xuXG5leHBvcnQgY2xhc3MgTGlnaHRUZXN0U2NlbmUgZXh0ZW5kcyBQaGFzZXIuU2NlbmVcbntcbiAgICBjb25zdHJ1Y3RvciAoKVxuICAgIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIG15bGlnaHRzOiBQb2ludExpZ2h0W10gPSBbXTtcbiAgICBwcml2YXRlIHRleHQ6IFRleHQ7XG4gICAgcHJpdmF0ZSBjb2xvckluZGV4ID0gMDtcbiAgICBwcml2YXRlIGNvbG9ySW5kZXhNYXggPSAzMjtcbiAgICBwcml2YXRlIGV4cGxvc2lvbkludGVuc2l0eSA9IDE7XG5cblxuXG5cbiAgICB1cGRhdGUoKSB7XG4gICAgICAgIHRoaXMudGV4dC50ZXh0ID0gYFdoZWVsOiBIdWVcXG5BICsgRDogRXhwbG9zaW9uIGludGVuc2l0eSAke3RoaXMuZXhwbG9zaW9uSW50ZW5zaXR5fVxcblcgKyBTOiBBdHRlbnVhdGlvblxcbkNsaWNrIHRvIHNldCBMaWdodFxcbmNvbG9ySW5kZXg6ICR7dGhpcy5jb2xvckluZGV4fWA7XG5cbiAgICAgICAgdGhpcy5teWxpZ2h0cy5mb3JFYWNoKGxpZ2h0ID0+IHtcbiAgICAgICAgICAgIGxpZ2h0LnkgPSAobGlnaHQueSAtIDYwKSAqIDAuOTk3ICsgNjA7XG4gICAgICAgICAgICBsaWdodC5yYWRpdXMgKj0gMS4wMVxuICAgICAgICAgICAgbGlnaHQuaW50ZW5zaXR5ICo9IDAuOTk7XG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgY3JlYXRlICgpXG4gICAge1xuICAgICAgICB0aGlzLnRleHQgPSB0aGlzLmFkZC50ZXh0KDEwLCAxMCwgJ1doZWVsOiBIdWVcXG5BICsgRDogUmFkaXVzXFxuVyArIFM6IEF0dGVudWF0aW9uXFxuQ2xpY2sgdG8gc2V0IExpZ2h0Jykuc2V0RGVwdGgoMSk7XG5cbiAgICAgICAgY29uc3Qgc3BlY3RydW0gPSBQaGFzZXIuRGlzcGxheS5Db2xvci5Db2xvclNwZWN0cnVtKHRoaXMuY29sb3JJbmRleE1heCk7XG5cbiAgICAgICAgbGV0IHJhZGl1cyA9IDMwO1xuICAgICAgICBsZXQgaW50ZW5zaXR5ID0gMTtcbiAgICAgICAgbGV0IGF0dGVudWF0aW9uID0gMC4xO1xuXG4gICAgICAgIGxldCBsaWdodCA9IHRoaXMuYWRkLnBvaW50bGlnaHQoNDAwLCAzMDAsIDAsIHJhZGl1cywgaW50ZW5zaXR5KTtcblxuICAgICAgICBsZXQgY29sb3IgPSBzcGVjdHJ1bVt0aGlzLmNvbG9ySW5kZXhdO1xuXG4gICAgICAgIGxpZ2h0LmNvbG9yLnNldFRvKGNvbG9yLnIsIGNvbG9yLmcsIGNvbG9yLmIpO1xuXG5cbiAgICAgICAgdGhpcy5pbnB1dC5vbigncG9pbnRlcmRvd24nLCBwb2ludGVyID0+IHtcbiAgICAgICAgICAgIHRoaXMuY29sb3JJbmRleCA9ICh0aGlzLmNvbG9ySW5kZXggKyAxKSAlIHRoaXMuY29sb3JJbmRleE1heDtcbiAgICAgICAgICAgIGxldCBpbmRleE1heCA9IHRoaXMuZXhwbG9zaW9uSW50ZW5zaXR5O1xuICAgICAgICAgICAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IGluZGV4TWF4OyBpbmRleCsrKSB7XG4gICAgICAgICAgICAgICAgbGV0IGR4ID0gaW5kZXhNYXggPiAxID8gMzAwICogaW5kZXggLyAoaW5kZXhNYXggLSAxKSAtIDE1MCA6IDA7XG4gICAgICAgICAgICAgICAgbGV0IGR5ID0gTWF0aC5yYW5kb20oKSAqIDIwIC0gMTA7XG4gICAgICAgICAgICAgICAgbGV0IG5ld2xpZ2h0ID0gdGhpcy5hZGQucG9pbnRsaWdodChwb2ludGVyLnggKyBkeCwgcG9pbnRlci55ICsgZHksIDAsIHJhZGl1cywgaW50ZW5zaXR5KTtcbiAgICAgICAgICAgICAgICBjb2xvciA9IHNwZWN0cnVtW3RoaXMuY29sb3JJbmRleF07XG4gICAgICAgICAgICAgICAgbmV3bGlnaHQuYXR0ZW51YXRpb24gPSBhdHRlbnVhdGlvbjtcbiAgICAgICAgICAgICAgICBuZXdsaWdodC5jb2xvci5zZXRUbyhjb2xvci5yLCBjb2xvci5nLCBjb2xvci5iKTtcbiAgICAgICAgICAgICAgICB0aGlzLm15bGlnaHRzLnB1c2gobmV3bGlnaHQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLmlucHV0Lm9uKCdwb2ludGVybW92ZScsIHBvaW50ZXIgPT4ge1xuXG4gICAgICAgICAgICBsaWdodC54ID0gcG9pbnRlci54O1xuICAgICAgICAgICAgbGlnaHQueSA9IHBvaW50ZXIueTtcblxuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLmlucHV0Lm9uKCd3aGVlbCcsIChwb2ludGVyLCBvdmVyLCBkZWx0YVgsIGRlbHRhWSwgZGVsdGFaKSA9PiB7XG5cbiAgICAgICAgICAgIGlmIChkZWx0YVkgPCAwKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHRoaXMuY29sb3JJbmRleC0tO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoZGVsdGFZID4gMClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNvbG9ySW5kZXgrKztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHRoaXMuY29sb3JJbmRleCA9PT0gc3BlY3RydW0ubGVuZ3RoKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHRoaXMuY29sb3JJbmRleCA9IDA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmICh0aGlzLmNvbG9ySW5kZXggPCAwKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHRoaXMuY29sb3JJbmRleCA9IHNwZWN0cnVtLmxlbmd0aCAtIDE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmNvbG9ySW5kZXggPSB0aGlzLmNvbG9ySW5kZXggJSB0aGlzLmNvbG9ySW5kZXhNYXg7XG5cbiAgICAgICAgICAgIGNvbG9yID0gc3BlY3RydW1bdGhpcy5jb2xvckluZGV4XTtcblxuICAgICAgICAgICAgbGlnaHQuY29sb3Iuc2V0VG8oY29sb3IuciwgY29sb3IuZywgY29sb3IuYik7XG5cbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5pbnB1dC5rZXlib2FyZC5vbigna2V5ZG93bi1BJywgKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5leHBsb3Npb25JbnRlbnNpdHkgPSBNYXRoLm1heCh0aGlzLmV4cGxvc2lvbkludGVuc2l0eSAtIDEsIDApO1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLmlucHV0LmtleWJvYXJkLm9uKCdrZXlkb3duLUQnLCAoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmV4cGxvc2lvbkludGVuc2l0eSA9IE1hdGgubWluKHRoaXMuZXhwbG9zaW9uSW50ZW5zaXR5ICsgMSwgMTAwKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5pbnB1dC5rZXlib2FyZC5vbigna2V5ZG93bi1XJywgKCkgPT4ge1xuXG4gICAgICAgICAgICBsaWdodC5hdHRlbnVhdGlvbiArPSAwLjAxO1xuICAgICAgICAgICAgYXR0ZW51YXRpb24gKz0gMC4wMTtcblxuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLmlucHV0LmtleWJvYXJkLm9uKCdrZXlkb3duLVMnLCAoKSA9PiB7XG5cbiAgICAgICAgICAgIGxpZ2h0LmF0dGVudWF0aW9uIC09IDAuMDE7XG4gICAgICAgICAgICBhdHRlbnVhdGlvbiAtPSAwLjAxO1xuXG4gICAgICAgIH0pO1xuICAgIH1cbn1cbiIsImltcG9ydCBUZXh0ID0gUGhhc2VyLkdhbWVPYmplY3RzLlRleHQ7XG5pbXBvcnQgVmVjdG9yMiA9IFBoYXNlci5NYXRoLlZlY3RvcjI7XG5pbXBvcnQge01pc3NpbGVDb250cm9sbGVyfSBmcm9tIFwiLi9taXNzaWxlXCI7XG5pbXBvcnQge0FzdGVyb2lkQ29udHJvbGxlcn0gZnJvbSBcIi4vYXN0ZXJvaWRcIjtcbmltcG9ydCB7RXhwbG9zaW9uQ29udHJvbGxlcn0gZnJvbSBcIi4vZXhwbG9zaW9uXCI7XG5pbXBvcnQge1Njb3JlQ29udHJvbGxlcn0gZnJvbSBcIi4vc2NvcmVcIjtcblxuXG5jb25zdCBzY2VuZUNvbmZpZzogUGhhc2VyLlR5cGVzLlNjZW5lcy5TZXR0aW5nc0NvbmZpZyA9IHtcbiAgICBhY3RpdmU6IGZhbHNlLFxuICAgIHZpc2libGU6IHRydWUsXG4gICAga2V5OiAnTWlzc2lsZVRlc3RTY2VuZScsXG59O1xuXG5leHBvcnQgY2xhc3MgTWlzc2lsZVRlc3RTY2VuZSBleHRlbmRzIFBoYXNlci5TY2VuZSB7XG4gICAgcHJpdmF0ZSBleHBsb3Npb25Db250cm9sbGVyOiBFeHBsb3Npb25Db250cm9sbGVyO1xuICAgIHByaXZhdGUgbWlzc2lsZUNvbnRyb2xsZXI6IE1pc3NpbGVDb250cm9sbGVyO1xuICAgIHByaXZhdGUgYXN0ZXJpb2RDb250cm9sbGVyOiBBc3Rlcm9pZENvbnRyb2xsZXI7XG4gICAgcHJpdmF0ZSBzY29yZUNvbnRyb2xsZXI6IFNjb3JlQ29udHJvbGxlciA9IG5ldyBTY29yZUNvbnRyb2xsZXIoKTtcbiAgICBwcml2YXRlIHRleHQ6IFRleHQ7XG5cbiAgICBjb25zdHJ1Y3RvciAoKSB7XG4gICAgICAgIHN1cGVyKHNjZW5lQ29uZmlnKTtcbiAgICAgICAgdGhpcy5leHBsb3Npb25Db250cm9sbGVyID0gbmV3IEV4cGxvc2lvbkNvbnRyb2xsZXIodGhpcyk7XG4gICAgICAgIHRoaXMubWlzc2lsZUNvbnRyb2xsZXIgPSBuZXcgTWlzc2lsZUNvbnRyb2xsZXIodGhpcywgdGhpcy5leHBsb3Npb25Db250cm9sbGVyKTtcbiAgICAgICAgdGhpcy5hc3RlcmlvZENvbnRyb2xsZXIgPSBuZXcgQXN0ZXJvaWRDb250cm9sbGVyKHRoaXMsIHRoaXMuZXhwbG9zaW9uQ29udHJvbGxlciwgdGhpcy5zY29yZUNvbnRyb2xsZXIpO1xuICAgIH1cblxuICAgIHByZWxvYWQgKCkge1xuICAgICAgICB0aGlzLmxvYWQuaW1hZ2UoJ2JnJywgJ2h0dHBzOi8vbGFicy5waGFzZXIuaW8vYXNzZXRzL3NraWVzL3NwYWNlMy5wbmcnKTtcbiAgICAgICAgdGhpcy5taXNzaWxlQ29udHJvbGxlci5wcmVsb2FkKCk7XG4gICAgICAgIHRoaXMuYXN0ZXJpb2RDb250cm9sbGVyLnByZWxvYWQoKTtcbiAgICAgICAgdGhpcy5leHBsb3Npb25Db250cm9sbGVyLnByZWxvYWQoKTtcbiAgICB9XG5cblxuICAgIHB1YmxpYyBjcmVhdGUoKSB7XG4gICAgICAgIGNvbnN0IGJhY2tncm91bmQgPSB0aGlzLmFkZC5pbWFnZSh0aGlzLmdhbWUuY2FudmFzLndpZHRoIC8gMiwgdGhpcy5nYW1lLmNhbnZhcy5oZWlnaHQgLyAyLCAnYmcnKVxuICAgICAgICBiYWNrZ3JvdW5kLnNjYWxlWCA9IHRoaXMuZ2FtZS5jYW52YXMud2lkdGggLyBiYWNrZ3JvdW5kLndpZHRoO1xuICAgICAgICBiYWNrZ3JvdW5kLnNjYWxlWSA9IHRoaXMuZ2FtZS5jYW52YXMuaGVpZ2h0IC8gYmFja2dyb3VuZC5oZWlnaHQ7XG5cbiAgICAgICAgdGhpcy50ZXh0ID0gdGhpcy5hZGQudGV4dCgxMCwgMTAsICdXaGVlbDogSHVlXFxuQSArIEQ6IFJhZGl1c1xcblcgKyBTOiBBdHRlbnVhdGlvblxcbkNsaWNrIHRvIHNldCBMaWdodCcpLnNldERlcHRoKDEpO1xuXG4gICAgICAgIGxldCBsaWdodCA9IHRoaXMuYWRkLnBvaW50bGlnaHQoNDAwLCAzMDAsIDB4YTBhMGEwLCAxNSwgMSk7XG5cbiAgICAgICAgdGhpcy5pbnB1dC5vbigncG9pbnRlcmRvd24nLCBwb2ludGVyID0+IHtcbiAgICAgICAgICAgIHRoaXMubGF1bmNoTWlzc2lsZShwb2ludGVyLngsIHBvaW50ZXIueSk7XG4gICAgICAgIH0pXG5cbiAgICAgICAgdGhpcy5pbnB1dC5vbigncG9pbnRlcm1vdmUnLCBwb2ludGVyID0+IHtcbiAgICAgICAgICAgIGxpZ2h0LnggPSBwb2ludGVyLng7XG4gICAgICAgICAgICBsaWdodC55ID0gcG9pbnRlci55O1xuICAgICAgICB9KTtcblxuXG4gICAgICAgIHRoaXMuaW5wdXQua2V5Ym9hcmQub24oJ2tleWRvd24tRCcsICgpID0+IHtcbiAgICAgICAgICAgIC8vIHRoaXMuZXhwbG9zaW9uSW50ZW5zaXR5ID0gTWF0aC5taW4odGhpcy5leHBsb3Npb25JbnRlbnNpdHkgKyAxLCAxMDApO1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLm1pc3NpbGVDb250cm9sbGVyLmNyZWF0ZSgpO1xuICAgICAgICB0aGlzLmFzdGVyaW9kQ29udHJvbGxlci5jcmVhdGUoKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgdXBkYXRlKCkge1xuICAgICAgICB0aGlzLnRleHQudGV4dCA9IHRoaXMuc2NvcmVDb250cm9sbGVyLnRvU3RyaW5nKCk7XG5cbiAgICAgICAgdGhpcy5leHBsb3Npb25Db250cm9sbGVyLnVwZGF0ZSgpO1xuICAgICAgICB0aGlzLm1pc3NpbGVDb250cm9sbGVyLnVwZGF0ZSgpO1xuICAgICAgICB0aGlzLmFzdGVyaW9kQ29udHJvbGxlci51cGRhdGUoKTtcblxuICAgICAgICBpZiAoTWF0aC5yYW5kb20oKSA8IDAuMDAzKSB7XG4gICAgICAgICAgICB0aGlzLmRyb3BBc3Rlcm9pZCgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBsYXVuY2hNaXNzaWxlKHg6IG51bWJlciwgeTogbnVtYmVyKSB7XG4gICAgICAgIHRoaXMuc2NvcmVDb250cm9sbGVyLm5vdGlmeU1pc3NpbGVMYXVuY2hlZCgpO1xuICAgICAgICB0aGlzLm1pc3NpbGVDb250cm9sbGVyLmNyZWF0ZU1pc3NpbGUobmV3IFZlY3RvcjIodGhpcy5nYW1lLmNhbnZhcy53aWR0aCAvIDIuMCwgdGhpcy5nYW1lLmNhbnZhcy5oZWlnaHQgLSAyMCksIG5ldyBWZWN0b3IyKHgsIHkpKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGRyb3BBc3Rlcm9pZCgpIHtcbiAgICAgICAgdGhpcy5zY29yZUNvbnRyb2xsZXIubm90aWZ5QXN0ZXJpb2REcm9wcGVkKCk7XG4gICAgICAgIGNvbnN0IHNvdXJjZVggPSBQaGFzZXIuTWF0aC5CZXR3ZWVuKC0gMC4xICogdGhpcy5nYW1lLmNhbnZhcy53aWR0aCwgMS4xICogdGhpcy5nYW1lLmNhbnZhcy53aWR0aCk7XG4gICAgICAgIGNvbnN0IHRhcmdldFggPSBQaGFzZXIuTWF0aC5CZXR3ZWVuKDAuMSAqIHRoaXMuZ2FtZS5jYW52YXMud2lkdGgsIDAuOSAqIHRoaXMuZ2FtZS5jYW52YXMud2lkdGgpO1xuICAgICAgICB0aGlzLmFzdGVyaW9kQ29udHJvbGxlci5jcmVhdGVBc3RlcmlvZChuZXcgVmVjdG9yMihzb3VyY2VYLCAwKSwgbmV3IFZlY3RvcjIodGFyZ2V0WCwgdGhpcy5nYW1lLmNhbnZhcy5oZWlnaHQgLSAyMCkpO1xuICAgIH1cbn1cbiIsImltcG9ydCBWZWN0b3IyID0gUGhhc2VyLk1hdGguVmVjdG9yMjtcbmltcG9ydCB7RXhwbG9zaW9uQ29udHJvbGxlcn0gZnJvbSBcIi4vZXhwbG9zaW9uXCI7XG5cblxuZXhwb3J0IGNsYXNzIE1pc3NpbGUge1xuICAgIHB1YmxpYyBzcHJpdGU6IFBoYXNlci5QaHlzaWNzLkFyY2FkZS5TcHJpdGU7XG4gICAgcHJpdmF0ZSBleHBsb2RlZCA9IGZhbHNlO1xuXG4gICAgY29uc3RydWN0b3IocHVibGljIHNjZW5lOiBQaGFzZXIuU2NlbmUsIHB1YmxpYyBleHBsb3Npb25Db250cm9sbGVyOiBFeHBsb3Npb25Db250cm9sbGVyLCBwdWJsaWMgc291cmNlOiBWZWN0b3IyLCBwdWJsaWMgdGFyZ2V0OiBWZWN0b3IyKSB7XG4gICAgICAgIHRoaXMuc3ByaXRlID0gdGhpcy5zY2VuZS5waHlzaWNzLmFkZC5zcHJpdGUoc291cmNlLngsIHNvdXJjZS55LCAnbWlzc2lsZS0xJyk7XG4gICAgICAgIGNvbnN0IGRpcmVjdGlvbiA9IG5ldyBWZWN0b3IyKHRhcmdldCkuc3VidHJhY3Qoc291cmNlKTtcbiAgICAgICAgY29uc3QgdmVsb2NpdHkgPSBkaXJlY3Rpb24ubm9ybWFsaXplKCkuc2NhbGUoMzAwKTtcbiAgICAgICAgdGhpcy5zcHJpdGUuc2V0Um90YXRpb24oZGlyZWN0aW9uLmFuZ2xlKCkgKyBNYXRoLlBJIC8gMi4wKTtcbiAgICAgICAgdGhpcy5zcHJpdGUuc2V0VmVsb2NpdHlYKHZlbG9jaXR5LngpO1xuICAgICAgICB0aGlzLnNwcml0ZS5zZXRWZWxvY2l0eVkodmVsb2NpdHkueSk7XG4gICAgfVxuXG4gICAgcHVibGljIHVwZGF0ZSgpOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMuc3ByaXRlKSB7XG4gICAgICAgICAgICBjb25zdCBsb2NhdGlvbiA9IG5ldyBWZWN0b3IyKHRoaXMuc3ByaXRlLngsIHRoaXMuc3ByaXRlLnkpO1xuICAgICAgICAgICAgaWYgKGxvY2F0aW9uLmRpc3RhbmNlKHRoaXMudGFyZ2V0KSA8IDEwLjApIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNwcml0ZS5kZXN0cm95KCk7XG4gICAgICAgICAgICAgICAgdGhpcy5zcHJpdGUgPSBudWxsO1xuICAgICAgICAgICAgICAgIHRoaXMuZXhwbG9zaW9uQ29udHJvbGxlci5leHBsb2RlKGxvY2F0aW9uLCAxLCAwLjk5LCAweGEwYTBmZiwgMCk7XG4gICAgICAgICAgICAgICAgdGhpcy5leHBsb2RlZCA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgaXNBY3RpdmUoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLnNwcml0ZSAhPSBudWxsO1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIE1pc3NpbGVDb250cm9sbGVyIHtcbiAgICBwcml2YXRlIG1pc3NpbGVzOiBNaXNzaWxlW10gPSBbXTtcblxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihwdWJsaWMgc2NlbmU6IFBoYXNlci5TY2VuZSwgcHVibGljIGV4cGxvc2lvbkNvbnRyb2xsZXI6IEV4cGxvc2lvbkNvbnRyb2xsZXIpIHtcbiAgICB9XG5cbiAgICBwcmVsb2FkKCkge1xuICAgICAgICB0aGlzLnNjZW5lLmxvYWQuaW1hZ2UoJ21pc3NpbGUtMScsICdhc3NldHMvc3Rvcm1fc2hhZG93LnBuZycpO1xuICAgIH1cblxuICAgIHB1YmxpYyBjcmVhdGUoKTogdm9pZCB7XG4gICAgfVxuXG4gICAgcHVibGljIHVwZGF0ZSgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5taXNzaWxlcy5mb3JFYWNoKG1pc3NpbGUgPT4gbWlzc2lsZS51cGRhdGUoKSk7XG4gICAgICAgIHRoaXMubWlzc2lsZXMgPSB0aGlzLm1pc3NpbGVzLnJlZHVjZTxNaXNzaWxlW10+KChhY3RpdmUsIGV4cGxvc2lvbikgPT4ge1xuICAgICAgICAgICAgaWYgKGV4cGxvc2lvbi5pc0FjdGl2ZSgpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFsuLi5hY3RpdmUsIGV4cGxvc2lvbl07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gYWN0aXZlO1xuICAgICAgICB9LCBbXSk7XG4gICAgfVxuXG4gICAgcHVibGljIGNyZWF0ZU1pc3NpbGUoc291cmNlOiBWZWN0b3IyLCB0YXJnZXQ6IFZlY3RvcjIpIHtcbiAgICAgICAgaWYgKHRoaXMubWlzc2lsZXMubGVuZ3RoIDwgMykge1xuICAgICAgICAgICAgdGhpcy5taXNzaWxlcy5wdXNoKG5ldyBNaXNzaWxlKHRoaXMuc2NlbmUsIHRoaXMuZXhwbG9zaW9uQ29udHJvbGxlciwgc291cmNlLCB0YXJnZXQpKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsIlxuZXhwb3J0IGNsYXNzIFNjb3JlQ29udHJvbGxlciB7XG4gICAgcHJpdmF0ZSBhc3RlcmlvZHNEZXN0cm9pZDogbnVtYmVyID0gMDtcbiAgICBwcml2YXRlIGFzdGVyaW9kc0V4cGxvZGVkOiBudW1iZXIgPSAwO1xuICAgIHByaXZhdGUgbWlzc2lsZXM6IG51bWJlciA9IDA7XG4gICAgcHJpdmF0ZSBhc3RlcmlvZHM6IG51bWJlciA9IDA7XG5cbiAgICBwdWJsaWMgbm90aWZ5QXN0ZXJpb2REZXN0cm95KCkge1xuICAgICAgICB0aGlzLmFzdGVyaW9kc0Rlc3Ryb2lkKys7XG4gICAgfVxuXG4gICAgcHVibGljIG5vdGlmeUFzdGVyaW9kRXhwbG9kZWQoKSB7XG4gICAgICAgIHRoaXMuYXN0ZXJpb2RzRXhwbG9kZWQrKztcbiAgICB9XG5cbiAgICBwdWJsaWMgbm90aWZ5TWlzc2lsZUxhdW5jaGVkKCkge1xuICAgICAgICB0aGlzLm1pc3NpbGVzKys7XG4gICAgfVxuXG4gICAgcHVibGljIG5vdGlmeUFzdGVyaW9kRHJvcHBlZCgpIHtcbiAgICAgICAgdGhpcy5hc3RlcmlvZHMrKztcbiAgICB9XG5cbiAgICBwdWJsaWMgdG9TdHJpbmcoKSB7XG4gICAgICAgIHJldHVybiBgRGVzdHJveWVkOiAke3RoaXMuYXN0ZXJpb2RzRGVzdHJvaWR9XFxuRXhwbG9zaW9uczogJHt0aGlzLmFzdGVyaW9kc0V4cGxvZGVkfVxcbk1pc3NpbGVzOiAke3RoaXMubWlzc2lsZXN9YDtcbiAgICB9XG59XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuLy8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbl9fd2VicGFja19yZXF1aXJlX18ubSA9IF9fd2VicGFja19tb2R1bGVzX187XG5cbiIsInZhciBkZWZlcnJlZCA9IFtdO1xuX193ZWJwYWNrX3JlcXVpcmVfXy5PID0gKHJlc3VsdCwgY2h1bmtJZHMsIGZuLCBwcmlvcml0eSkgPT4ge1xuXHRpZihjaHVua0lkcykge1xuXHRcdHByaW9yaXR5ID0gcHJpb3JpdHkgfHwgMDtcblx0XHRmb3IodmFyIGkgPSBkZWZlcnJlZC5sZW5ndGg7IGkgPiAwICYmIGRlZmVycmVkW2kgLSAxXVsyXSA+IHByaW9yaXR5OyBpLS0pIGRlZmVycmVkW2ldID0gZGVmZXJyZWRbaSAtIDFdO1xuXHRcdGRlZmVycmVkW2ldID0gW2NodW5rSWRzLCBmbiwgcHJpb3JpdHldO1xuXHRcdHJldHVybjtcblx0fVxuXHR2YXIgbm90RnVsZmlsbGVkID0gSW5maW5pdHk7XG5cdGZvciAodmFyIGkgPSAwOyBpIDwgZGVmZXJyZWQubGVuZ3RoOyBpKyspIHtcblx0XHR2YXIgW2NodW5rSWRzLCBmbiwgcHJpb3JpdHldID0gZGVmZXJyZWRbaV07XG5cdFx0dmFyIGZ1bGZpbGxlZCA9IHRydWU7XG5cdFx0Zm9yICh2YXIgaiA9IDA7IGogPCBjaHVua0lkcy5sZW5ndGg7IGorKykge1xuXHRcdFx0aWYgKChwcmlvcml0eSAmIDEgPT09IDAgfHwgbm90RnVsZmlsbGVkID49IHByaW9yaXR5KSAmJiBPYmplY3Qua2V5cyhfX3dlYnBhY2tfcmVxdWlyZV9fLk8pLmV2ZXJ5KChrZXkpID0+IChfX3dlYnBhY2tfcmVxdWlyZV9fLk9ba2V5XShjaHVua0lkc1tqXSkpKSkge1xuXHRcdFx0XHRjaHVua0lkcy5zcGxpY2Uoai0tLCAxKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGZ1bGZpbGxlZCA9IGZhbHNlO1xuXHRcdFx0XHRpZihwcmlvcml0eSA8IG5vdEZ1bGZpbGxlZCkgbm90RnVsZmlsbGVkID0gcHJpb3JpdHk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGlmKGZ1bGZpbGxlZCkge1xuXHRcdFx0ZGVmZXJyZWQuc3BsaWNlKGktLSwgMSlcblx0XHRcdHZhciByID0gZm4oKTtcblx0XHRcdGlmIChyICE9PSB1bmRlZmluZWQpIHJlc3VsdCA9IHI7XG5cdFx0fVxuXHR9XG5cdHJldHVybiByZXN1bHQ7XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBubyBiYXNlVVJJXG5cbi8vIG9iamVjdCB0byBzdG9yZSBsb2FkZWQgYW5kIGxvYWRpbmcgY2h1bmtzXG4vLyB1bmRlZmluZWQgPSBjaHVuayBub3QgbG9hZGVkLCBudWxsID0gY2h1bmsgcHJlbG9hZGVkL3ByZWZldGNoZWRcbi8vIFtyZXNvbHZlLCByZWplY3QsIFByb21pc2VdID0gY2h1bmsgbG9hZGluZywgMCA9IGNodW5rIGxvYWRlZFxudmFyIGluc3RhbGxlZENodW5rcyA9IHtcblx0XCJhcHBcIjogMFxufTtcblxuLy8gbm8gY2h1bmsgb24gZGVtYW5kIGxvYWRpbmdcblxuLy8gbm8gcHJlZmV0Y2hpbmdcblxuLy8gbm8gcHJlbG9hZGVkXG5cbi8vIG5vIEhNUlxuXG4vLyBubyBITVIgbWFuaWZlc3RcblxuX193ZWJwYWNrX3JlcXVpcmVfXy5PLmogPSAoY2h1bmtJZCkgPT4gKGluc3RhbGxlZENodW5rc1tjaHVua0lkXSA9PT0gMCk7XG5cbi8vIGluc3RhbGwgYSBKU09OUCBjYWxsYmFjayBmb3IgY2h1bmsgbG9hZGluZ1xudmFyIHdlYnBhY2tKc29ucENhbGxiYWNrID0gKHBhcmVudENodW5rTG9hZGluZ0Z1bmN0aW9uLCBkYXRhKSA9PiB7XG5cdHZhciBbY2h1bmtJZHMsIG1vcmVNb2R1bGVzLCBydW50aW1lXSA9IGRhdGE7XG5cdC8vIGFkZCBcIm1vcmVNb2R1bGVzXCIgdG8gdGhlIG1vZHVsZXMgb2JqZWN0LFxuXHQvLyB0aGVuIGZsYWcgYWxsIFwiY2h1bmtJZHNcIiBhcyBsb2FkZWQgYW5kIGZpcmUgY2FsbGJhY2tcblx0dmFyIG1vZHVsZUlkLCBjaHVua0lkLCBpID0gMDtcblx0aWYoY2h1bmtJZHMuc29tZSgoaWQpID0+IChpbnN0YWxsZWRDaHVua3NbaWRdICE9PSAwKSkpIHtcblx0XHRmb3IobW9kdWxlSWQgaW4gbW9yZU1vZHVsZXMpIHtcblx0XHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhtb3JlTW9kdWxlcywgbW9kdWxlSWQpKSB7XG5cdFx0XHRcdF9fd2VicGFja19yZXF1aXJlX18ubVttb2R1bGVJZF0gPSBtb3JlTW9kdWxlc1ttb2R1bGVJZF07XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGlmKHJ1bnRpbWUpIHZhciByZXN1bHQgPSBydW50aW1lKF9fd2VicGFja19yZXF1aXJlX18pO1xuXHR9XG5cdGlmKHBhcmVudENodW5rTG9hZGluZ0Z1bmN0aW9uKSBwYXJlbnRDaHVua0xvYWRpbmdGdW5jdGlvbihkYXRhKTtcblx0Zm9yKDtpIDwgY2h1bmtJZHMubGVuZ3RoOyBpKyspIHtcblx0XHRjaHVua0lkID0gY2h1bmtJZHNbaV07XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGluc3RhbGxlZENodW5rcywgY2h1bmtJZCkgJiYgaW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdKSB7XG5cdFx0XHRpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF1bMF0oKTtcblx0XHR9XG5cdFx0aW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdID0gMDtcblx0fVxuXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXy5PKHJlc3VsdCk7XG59XG5cbnZhciBjaHVua0xvYWRpbmdHbG9iYWwgPSBzZWxmW1wid2VicGFja0NodW5rYXJtYWdlZGRvbl9waGFzZXJcIl0gPSBzZWxmW1wid2VicGFja0NodW5rYXJtYWdlZGRvbl9waGFzZXJcIl0gfHwgW107XG5jaHVua0xvYWRpbmdHbG9iYWwuZm9yRWFjaCh3ZWJwYWNrSnNvbnBDYWxsYmFjay5iaW5kKG51bGwsIDApKTtcbmNodW5rTG9hZGluZ0dsb2JhbC5wdXNoID0gd2VicGFja0pzb25wQ2FsbGJhY2suYmluZChudWxsLCBjaHVua0xvYWRpbmdHbG9iYWwucHVzaC5iaW5kKGNodW5rTG9hZGluZ0dsb2JhbCkpOyIsIiIsIi8vIHN0YXJ0dXBcbi8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuLy8gVGhpcyBlbnRyeSBtb2R1bGUgZGVwZW5kcyBvbiBvdGhlciBsb2FkZWQgY2h1bmtzIGFuZCBleGVjdXRpb24gbmVlZCB0byBiZSBkZWxheWVkXG52YXIgX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18uTyh1bmRlZmluZWQsIFtcInZlbmRvcnNcIl0sICgpID0+IChfX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9zcmMvbWFpbi50c1wiKSkpXG5fX3dlYnBhY2tfZXhwb3J0c19fID0gX193ZWJwYWNrX3JlcXVpcmVfXy5PKF9fd2VicGFja19leHBvcnRzX18pO1xuIiwiIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9