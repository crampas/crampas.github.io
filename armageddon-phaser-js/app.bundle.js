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
    title: 'Armageddon Phaser JS',
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
    Asteroid.prototype.isActive = function () {
        return !this.exploded;
    };
    return Asteroid;
}());
exports.Asteroid = Asteroid;
var AsteroidController = /** @class */ (function () {
    function AsteroidController(scene, explosionController, scoreController, maxAsteroids) {
        this.scene = scene;
        this.explosionController = explosionController;
        this.scoreController = scoreController;
        this.maxAsteroids = maxAsteroids;
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
        if (this.asteriods.length < this.maxAsteroids) {
            this.asteriods.push(new Asteroid(this.scene, this.explosionController, this.scoreController, source, target));
            return true;
        }
        return false;
    };
    AsteroidController.prototype.countActive = function () {
        return this.asteriods.reduce(function (count, asteroid) { return count + (asteroid.isActive() ? 1 : 0); }, 0);
    };
    return AsteroidController;
}());
exports.AsteroidController = AsteroidController;


/***/ }),

/***/ "./src/scenes/building.ts":
/*!********************************!*\
  !*** ./src/scenes/building.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BuildingController = exports.Building = void 0;
var once_1 = __webpack_require__(/*! ../utils/once */ "./src/utils/once.ts");
var Vector2 = Phaser.Math.Vector2;
var Rectangle = Phaser.Geom.Rectangle;
var Building = /** @class */ (function () {
    function Building(scene, explosionController, scoreController, position) {
        this.scene = scene;
        this.explosionController = explosionController;
        this.scoreController = scoreController;
        this.position = position;
        this.damaged = false;
        this.destroyTime = 0;
        this.burning = false;
        this.toDestroy = new once_1.Once();
        var frames = ["building-1", "building-2", "building-3", "building-4"];
        var index = Phaser.Math.Between(0, 3);
        this.sprite = this.scene.add.sprite(position.x, position.y, "atlas-1", frames[index % frames.length]);
        this.plume = this.scene.add.particles(this.position.x + 0.5 * this.sprite.width, this.position.y, 'flares', {
            emitting: false,
            frame: 'white',
            color: [0x000000, 0x444444],
            colorEase: 'quart.out',
            lifespan: 2000,
            frequency: 30,
            angle: { min: -100, max: -80 },
            scale: { start: 0.8, end: 1.2, ease: 'sine.in' },
            speed: { min: 10, max: 200 },
            advance: 0, // 2000
            blendMode: 'NORMAL',
            accelerationX: 0,
            accelerationY: 0
        });
        var graphics = this.scene.add.graphics({ lineStyle: { width: 2, color: 0x00ff00 }, fillStyle: { color: 0x110000 } });
        var rect = new Phaser.Geom.Rectangle(position.x, position.y - this.sprite.height, this.sprite.width, this.sprite.height);
        graphics.lineStyle(1, 0x777711);
        this.scoreController.addBuilding();
    }
    Building.prototype.onDestroy = function (time) {
        this.scoreController.notifyBuildingDestroy();
        this.damaged = true;
        if (this.destroyTime == 0) {
            this.destroyTime = time;
            var chain = this.scene.tweens.chain({
                targets: this.sprite,
                tweens: [
                    {
                        angle: '+=70',
                        duration: 5000,
                        repeat: 0,
                        scale: { value: 0.0, duration: 5000 },
                    }
                ]
            });
        }
    };
    Building.prototype.update = function (time, delta) {
        var _this = this;
        var location = new Vector2(this.sprite.x, this.sprite.y);
        this.toDestroy.check(time, function () { return _this.explosionController.hitRect(new Rectangle(_this.sprite.x, _this.sprite.y - _this.sprite.height, _this.sprite.width, _this.sprite.height)); }, function () { return _this.onDestroy(time); });
        this.toDestroy.after(time, 500, function () {
            _this.burning = true;
            _this.plume.start(50, 0);
        });
        if (this.toDestroy.isDone()) {
            if ((time - this.destroyTime) > 500 && !this.burning) {
                // this.plume.active = true;
                // this.plume.emitting = true;
                this.burning = true;
                this.plume.start(50, 0);
            }
            if (time - this.destroyTime > 5000 && this.burning) {
                this.plume.frequency += 100;
            }
        }
    };
    return Building;
}());
exports.Building = Building;
var BuildingController = /** @class */ (function () {
    function BuildingController(scene, explosionController, scoreController) {
        this.scene = scene;
        this.explosionController = explosionController;
        this.scoreController = scoreController;
        this.buildings = [];
    }
    BuildingController.prototype.preload = function () {
        this.scene.load.atlas('atlas-1', 'assets/Day.png', 'assets/Day.json');
        this.scene.load.atlas('fan', 'assets/fan.png', 'assets/fan-frames.json');
        this.scene.load.animation('fan-anim', 'assets/fan-anim.json');
    };
    BuildingController.prototype.create = function () {
    };
    BuildingController.prototype.update = function (time, delta) {
        this.buildings.forEach(function (item) { return item.update(time, delta); });
    };
    BuildingController.prototype.createBuilding = function (position) {
        this.buildings.push(new Building(this.scene, this.explosionController, this.scoreController, position));
    };
    return BuildingController;
}());
exports.BuildingController = BuildingController;


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
var Circle = Phaser.Geom.Circle;
var CircleToRectangle = Phaser.Geom.Intersects.CircleToRectangle;
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
            return this.location.distance(location) < this.intensity * 20; // 20;
        }
        return false;
    };
    Explosion.prototype.hitRect = function (rect) {
        if (this.isActive()) {
            var exploseionArea = new Circle(this.location.x, this.location.y, this.intensity * 20);
            return CircleToRectangle(exploseionArea, rect);
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
    ExplosionController.prototype.hitRect = function (rect) {
        return this.explosions.reduce(function (hit, explosion) { return hit || explosion.hitRect(rect); }, false);
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
var missile_scene_1 = __webpack_require__(/*! ./missile-scene */ "./src/scenes/missile-scene.ts");
exports["default"] = [missile_scene_1.MissileScene];


/***/ }),

/***/ "./src/scenes/missile-scene.ts":
/*!*************************************!*\
  !*** ./src/scenes/missile-scene.ts ***!
  \*************************************/
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
exports.MissileScene = void 0;
var Vector2 = Phaser.Math.Vector2;
var missile_1 = __webpack_require__(/*! ./missile */ "./src/scenes/missile.ts");
var asteroid_1 = __webpack_require__(/*! ./asteroid */ "./src/scenes/asteroid.ts");
var explosion_1 = __webpack_require__(/*! ./explosion */ "./src/scenes/explosion.ts");
var score_1 = __webpack_require__(/*! ./score */ "./src/scenes/score.ts");
var building_1 = __webpack_require__(/*! ./building */ "./src/scenes/building.ts");
var sceneConfig = {
    active: false,
    visible: true,
    key: 'MissileTestScene',
};
var MissileScene = /** @class */ (function (_super) {
    __extends(MissileScene, _super);
    function MissileScene() {
        var _this = _super.call(this, sceneConfig) || this;
        _this.scoreController = new score_1.ScoreController();
        _this.isPaused = false;
        _this.nextAsteroidTime = 0;
        _this.lastAsteriod = false;
        _this.explosionController = new explosion_1.ExplosionController(_this);
        _this.missileController = new missile_1.MissileController(_this, _this.explosionController, _this.scoreController);
        _this.asteriodController = new asteroid_1.AsteroidController(_this, _this.explosionController, _this.scoreController, 20);
        _this.buildingController = new building_1.BuildingController(_this, _this.explosionController, _this.scoreController);
        return _this;
    }
    MissileScene.prototype.preload = function () {
        this.load.image('bg', 'https://labs.phaser.io/assets/skies/space3.png');
        this.buildingController.preload();
        this.missileController.preload();
        this.asteriodController.preload();
        this.explosionController.preload();
    };
    MissileScene.prototype.create = function () {
        var _this = this;
        var background = this.add.image(this.game.canvas.width / 2, this.game.canvas.height / 2, 'bg');
        background.scaleX = this.game.canvas.width / background.width;
        background.scaleY = this.game.canvas.height / background.height;
        this.input.setDefaultCursor('url(assets/pointer.png) 32 16, crosshair');
        var frames = ["building-1", "building-2", "building-3", "building-4"];
        // const frames = ["fan-1", "fan-2", "fan-3", "fan-4", "fan-5", "fan-6", "fan-7", "fan-8"];
        for (var index = 1; index < this.game.canvas.width / 120 - 1; index++) {
            //            const s1 = this.add.sprite(index * 120, this.game.canvas.height, "atlas-1", frames[index % frames.length]);
            //            const fan = this.add.sprite(index * 120 + 90, this.game.canvas.height - 60, "fan").play("fan-screw")
            // this.add.sprite(index * 120 + 60, this.game.canvas.height - 30, "fan", frames[index % frames.length]);
            this.buildingController.createBuilding(new Vector2(index * 120 + 10, this.game.canvas.height - 120));
            this.buildingController.createBuilding(new Vector2(index * 120 + 30, this.game.canvas.height - 90));
            this.buildingController.createBuilding(new Vector2(index * 120 + 60, this.game.canvas.height - 60));
            this.buildingController.createBuilding(new Vector2(index * 120, this.game.canvas.height - 30));
        }
        this.text = this.add.text(10, 10, 'Wheel: Hue\nA + D: Radius\nW + S: Attenuation\nClick to set Light').setDepth(1);
        this.gameOver = this.add.text(0, 100, 'Game Over', { fontSize: 120 }).setDepth(1);
        this.gameOver.x = 0.5 * (this.game.canvas.width - this.gameOver.width);
        this.gameOver.y = 0.3 * (this.game.canvas.height - this.gameOver.height);
        this.gameOver.visible = false;
        this.missileController.create();
        this.asteriodController.create();
        this.input.on('pointerdown', function (pointer) {
            _this.launchMissile(pointer.x, pointer.y);
        });
    };
    MissileScene.prototype.update = function (time, delta) {
        this.text.text = this.scoreController.toString();
        this.explosionController.update();
        this.missileController.update(time);
        this.asteriodController.update();
        this.buildingController.update(time, delta);
        if (!this.nextAsteroidTime) {
            this.nextAsteroidTime = time + Phaser.Math.Between(1000, 2000);
        }
        if (!this.lastAsteriod && time > this.nextAsteroidTime) {
            this.nextAsteroidTime = time + Phaser.Math.Between(1000, 10000);
            this.dropAsteroid();
        }
        if (this.scoreController.isGameOver()) {
            this.onGameOver();
        }
        if (this.lastAsteriod && this.asteriodController.countActive() && this.scoreController.getBuildingsLeft() > 0) {
            this.onGameWin();
        }
    };
    MissileScene.prototype.onGameOver = function () {
        this.isPaused = true;
        this.gameOver.visible = true;
    };
    MissileScene.prototype.onGameWin = function () {
        this.isPaused = true;
        var gameWin = this.add.text(0, 100, "Score ".concat(this.scoreController.getScore()), {
            fontSize: 0.1 * this.game.canvas.width
        }).setDepth(1);
        gameWin.x = 0.5 * (this.game.canvas.width - gameWin.width);
        gameWin.y = 0.3 * (this.game.canvas.height - gameWin.height);
    };
    MissileScene.prototype.launchMissile = function (x, y) {
        var _this = this;
        if (this.isPaused) {
            return;
        }
        var centerX = this.game.canvas.width / 2.0;
        var missile = this.missileController.createMissile(new Vector2(x < centerX ? 0 : this.game.canvas.width, this.game.canvas.height - 20), new Vector2(x, y));
        if (missile) {
            this.input.setDefaultCursor('url(assets/pointer-loading.png) 32 16, crosshair');
            missile.onExplode(function () { return _this.input.setDefaultCursor('url(assets/pointer.png) 32 16, crosshair'); });
        }
    };
    MissileScene.prototype.dropAsteroid = function () {
        this.scoreController.notifyAsteriodDropped();
        var sourceX = Phaser.Math.Between(-0.1 * this.game.canvas.width, 1.1 * this.game.canvas.width);
        var targetX = Phaser.Math.Between(0.1 * this.game.canvas.width, 0.9 * this.game.canvas.width);
        var dropped = this.asteriodController.createAsteriod(new Vector2(sourceX, 0), new Vector2(targetX, this.game.canvas.height - 20));
        this.lastAsteriod = !dropped;
    };
    return MissileScene;
}(Phaser.Scene));
exports.MissileScene = MissileScene;


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
        this.velocity = direction.normalize().scale(300);
        this.sprite.setRotation(direction.angle() + Math.PI / 2.0);
        this.sprite.setVelocityX(this.velocity.x);
        this.sprite.setVelocityY(this.velocity.y);
    }
    Missile.prototype.update = function (time) {
        if (!this.exploded) {
            this.velocity = this.velocity.scale(1.005);
            this.sprite.setVelocityX(this.velocity.x);
            this.sprite.setVelocityY(this.velocity.y);
            var location_1 = new Vector2(this.sprite.x, this.sprite.y);
            if (location_1.distance(this.target) < 10.0) {
                this.sprite.destroy(true);
                this.sprite = null;
                this.explosionController.explode(location_1, 1, 0.99, 0xa0a0ff, 0);
                this.exploded = true;
                if (this.explodeCallback) {
                    this.explodeCallback();
                }
            }
        }
    };
    Missile.prototype.isActive = function () {
        return this.sprite != null;
    };
    Missile.prototype.onExplode = function (callback) {
        this.explodeCallback = callback;
    };
    return Missile;
}());
exports.Missile = Missile;
var MissileController = /** @class */ (function () {
    function MissileController(scene, explosionController, scoreController) {
        this.scene = scene;
        this.explosionController = explosionController;
        this.scoreController = scoreController;
        this.missiles = [];
    }
    MissileController.prototype.preload = function () {
        this.scene.load.image('missile-1', 'assets/storm_shadow.png');
    };
    MissileController.prototype.create = function () {
    };
    MissileController.prototype.update = function (time) {
        this.missiles.forEach(function (missile) { return missile.update(time); });
        this.missiles = this.missiles.reduce(function (active, explosion) {
            if (explosion.isActive()) {
                return __spreadArray(__spreadArray([], active, true), [explosion], false);
            }
            return active;
        }, []);
    };
    MissileController.prototype.createMissile = function (source, target) {
        if (this.missiles.length < 1) {
            this.scoreController.notifyMissileLaunched();
            var missile = new Missile(this.scene, this.explosionController, source, target);
            this.missiles.push(missile);
            return missile;
        }
        return null;
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
        this.asteriodsDestroyed = 0;
        this.asteriodsExploded = 0;
        this.missiles = 0;
        this.asteriods = 0;
        this.buildings = 0;
        this.buildingsDestroyed = 0;
    }
    ScoreController.prototype.getScore = function () {
        return 100 * (this.buildings - this.buildingsDestroyed);
    };
    ScoreController.prototype.getBuildingsLeft = function () {
        return this.buildings - this.buildingsDestroyed;
    };
    ScoreController.prototype.notifyAsteriodDestroy = function () {
        this.asteriodsDestroyed++;
    };
    ScoreController.prototype.notifyBuildingDestroy = function () {
        this.buildingsDestroyed++;
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
        return "Destroyed: ".concat(this.asteriodsDestroyed, "\nExplosions: ").concat(this.asteriodsExploded, "\nMissiles: ").concat(this.missiles, "\nBuildings: ").concat(this.buildings, "/").concat(this.buildingsDestroyed);
    };
    ScoreController.prototype.addBuilding = function () {
        this.buildings++;
    };
    ScoreController.prototype.isGameOver = function () {
        return this.buildingsDestroyed >= this.buildings;
    };
    return ScoreController;
}());
exports.ScoreController = ScoreController;


/***/ }),

/***/ "./src/utils/once.ts":
/*!***************************!*\
  !*** ./src/utils/once.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Once = void 0;
var Once = /** @class */ (function () {
    function Once() {
        this.done = false;
    }
    Once.prototype.check = function (time, condition, target) {
        if (!this.done && condition()) {
            this.time = time;
            target();
            this.done = true;
        }
    };
    Once.prototype.isDone = function () {
        return this.done;
    };
    Once.prototype.after = function (time, delta, target) {
        if (this.done && time > this.time + delta) {
            target();
        }
    };
    return Once;
}());
exports.Once = Once;


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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Q0E7V0FDQTtXQUNBOztXQUVBOztXQUVBOztXQUVBOztXQUVBOztXQUVBOztXQUVBOztXQUVBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLE1BQU0scUJBQXFCO1dBQzNCO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7O1dBRUE7V0FDQTtXQUNBOzs7OztVRWhEQTtVQUNBO1VBQ0E7VUFDQTtVQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vYXJtYWdlZGRvbi1waGFzZXIvLi9zcmMvbWFpbi50cyIsIndlYnBhY2s6Ly9hcm1hZ2VkZG9uLXBoYXNlci8uL3NyYy9zY2VuZXMvYXN0ZXJvaWQudHMiLCJ3ZWJwYWNrOi8vYXJtYWdlZGRvbi1waGFzZXIvLi9zcmMvc2NlbmVzL2J1aWxkaW5nLnRzIiwid2VicGFjazovL2FybWFnZWRkb24tcGhhc2VyLy4vc3JjL3NjZW5lcy9leHBsb3Npb24udHMiLCJ3ZWJwYWNrOi8vYXJtYWdlZGRvbi1waGFzZXIvLi9zcmMvc2NlbmVzL2luZGV4LnRzIiwid2VicGFjazovL2FybWFnZWRkb24tcGhhc2VyLy4vc3JjL3NjZW5lcy9taXNzaWxlLXNjZW5lLnRzIiwid2VicGFjazovL2FybWFnZWRkb24tcGhhc2VyLy4vc3JjL3NjZW5lcy9taXNzaWxlLnRzIiwid2VicGFjazovL2FybWFnZWRkb24tcGhhc2VyLy4vc3JjL3NjZW5lcy9zY29yZS50cyIsIndlYnBhY2s6Ly9hcm1hZ2VkZG9uLXBoYXNlci8uL3NyYy91dGlscy9vbmNlLnRzIiwid2VicGFjazovL2FybWFnZWRkb24tcGhhc2VyL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2FybWFnZWRkb24tcGhhc2VyL3dlYnBhY2svcnVudGltZS9jaHVuayBsb2FkZWQiLCJ3ZWJwYWNrOi8vYXJtYWdlZGRvbi1waGFzZXIvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9hcm1hZ2VkZG9uLXBoYXNlci93ZWJwYWNrL3J1bnRpbWUvanNvbnAgY2h1bmsgbG9hZGluZyIsIndlYnBhY2s6Ly9hcm1hZ2VkZG9uLXBoYXNlci93ZWJwYWNrL2JlZm9yZS1zdGFydHVwIiwid2VicGFjazovL2FybWFnZWRkb24tcGhhc2VyL3dlYnBhY2svc3RhcnR1cCIsIndlYnBhY2s6Ly9hcm1hZ2VkZG9uLXBoYXNlci93ZWJwYWNrL2FmdGVyLXN0YXJ0dXAiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgUGhhc2VyIGZyb20gJ3BoYXNlcic7XG5pbXBvcnQgc2NlbmVzIGZyb20gJy4vc2NlbmVzJztcblxuY29uc3QgZ2FtZUNvbmZpZzogUGhhc2VyLlR5cGVzLkNvcmUuR2FtZUNvbmZpZyA9IHtcbiAgdGl0bGU6ICdBcm1hZ2VkZG9uIFBoYXNlciBKUycsXG4gXG4gIHR5cGU6IFBoYXNlci5BVVRPLFxuIFxuICBzY2FsZToge1xuICAgIHdpZHRoOiB3aW5kb3cuaW5uZXJXaWR0aCxcbiAgICBoZWlnaHQ6IHdpbmRvdy5pbm5lckhlaWdodCxcbiAgfSxcbiBcbiAgc2NlbmU6IHNjZW5lcyxcblxuICBwaHlzaWNzOiB7XG4gICAgZGVmYXVsdDogJ2FyY2FkZScsXG4gICAgYXJjYWRlOiB7XG4gICAgICBkZWJ1ZzogZmFsc2UsXG4gICAgfSxcbiAgfSxcblxuICBwYXJlbnQ6ICdnYW1lJyxcbiAgYmFja2dyb3VuZENvbG9yOiAnIzAwMDAzMCcsXG59O1xuIFxuZXhwb3J0IGNvbnN0IGdhbWUgPSBuZXcgUGhhc2VyLkdhbWUoZ2FtZUNvbmZpZyk7XG5cbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCAoKSA9PiB7XG4gIGdhbWUuc2NhbGUucmVmcmVzaCgpO1xufSk7XG4iLCJpbXBvcnQgQ29udGFpbmVyID0gUGhhc2VyLkdhbWVPYmplY3RzLkNvbnRhaW5lcjtcbmltcG9ydCBWZWN0b3IyID0gUGhhc2VyLk1hdGguVmVjdG9yMjtcbmltcG9ydCBTcHJpdGUgPSBQaGFzZXIuR2FtZU9iamVjdHMuU3ByaXRlO1xuaW1wb3J0IFBhcnRpY2xlRW1pdHRlciA9IFBoYXNlci5HYW1lT2JqZWN0cy5QYXJ0aWNsZXMuUGFydGljbGVFbWl0dGVyO1xuaW1wb3J0IFdlYkF1ZGlvU291bmQgPSBQaGFzZXIuU291bmQuV2ViQXVkaW9Tb3VuZDtcbmltcG9ydCB7RXhwbG9zaW9uQ29udHJvbGxlcn0gZnJvbSBcIi4vZXhwbG9zaW9uXCI7XG5pbXBvcnQge1Njb3JlQ29udHJvbGxlcn0gZnJvbSBcIi4vc2NvcmVcIjtcblxuXG5leHBvcnQgY2xhc3MgQXN0ZXJvaWQge1xuICAgIHByaXZhdGUgc3ByaXRlOiBDb250YWluZXI7XG4gICAgcHJpdmF0ZSBleHBsb2RlZDogYm9vbGVhbiA9IGZhbHNlO1xuICAgIHByaXZhdGUgZW5naW5lU291bmQ6IFdlYkF1ZGlvU291bmQ7XG5cblxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihwdWJsaWMgc2NlbmU6IFBoYXNlci5TY2VuZSwgcHVibGljIGV4cGxvc2lvbkNvbnRyb2xsZXI6IEV4cGxvc2lvbkNvbnRyb2xsZXIsIHB1YmxpYyBzY29yZUNvbnRyb2xsZXI6IFNjb3JlQ29udHJvbGxlcixcbiAgICAgICAgICAgICAgICAgICAgICAgcHVibGljIHNvdXJjZTogVmVjdG9yMiwgcHVibGljIHRhcmdldDogVmVjdG9yMikge1xuICAgICAgICBjb25zdCBkeCA9IHRhcmdldC54IC0gc291cmNlLng7XG4gICAgICAgIGNvbnN0IGR5ID0gdGFyZ2V0LnkgLSBzb3VyY2UueTtcbiAgICAgICAgY29uc3QgZGlyZWN0aW9uID0gbmV3IFBoYXNlci5NYXRoLlZlY3RvcjIoZHggLyAxMCwgZHkgLyAxMCk7XG4gICAgICAgIGNvbnN0IHNwZWVkID0gZGlyZWN0aW9uLmxlbmd0aCgpO1xuXG4gICAgICAgIGNvbnN0IGMxID0gdGhpcy5zY2VuZS5hZGQuY29udGFpbmVyKHNvdXJjZS54LCAwKTtcbiAgICAgICAgY29uc3QgYmFsbCA9IHRoaXMuc2NlbmUuYWRkLnNwcml0ZSgwLCAwLCBcImJhbGxcIik7XG4gICAgICAgIGMxLmFkZChiYWxsKTtcbiAgICAgICAgY29uc3Qgd2lzcCA9IHRoaXMuc2NlbmUuYWRkLnBhcnRpY2xlcygwLCAwLCAnZmxhcmVzJyxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBmcmFtZTogJ3doaXRlJyxcbiAgICAgICAgICAgICAgICBjb2xvcjogWyAweGZmZmZmZiwgMHhmZjgwMDAsIDB4MDAwMDAwIF0sXG4gICAgICAgICAgICAgICAgY29sb3JFYXNlOiAncXVhcnQub3V0JyxcbiAgICAgICAgICAgICAgICBsaWZlc3BhbjogNTAwMCxcbiAgICAgICAgICAgICAgICBhbmdsZTogeyBtaW46IC0yLCBtYXg6IDIgfSxcbiAgICAgICAgICAgICAgICBzY2FsZTogeyBzdGFydDogMC4xLCBlbmQ6IDEsIGVhc2U6ICdzaW5lLmluJyB9LFxuICAgICAgICAgICAgICAgIHNwZWVkOiB7IG1pbjogc3BlZWQsIG1heDogc3BlZWQgfSxcbiAgICAgICAgICAgICAgICBhZHZhbmNlOiAwLCAvLyAyMDAwXG4gICAgICAgICAgICAgICAgYmxlbmRNb2RlOiAnQUREJyxcbiAgICAgICAgICAgICAgICBhY2NlbGVyYXRpb25YOiAwLFxuICAgICAgICAgICAgICAgIGFjY2VsZXJhdGlvblk6IDBcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIGMxLmFkZCh3aXNwKTtcbiAgICAgICAgYzEuc2V0Um90YXRpb24oKG5ldyBQaGFzZXIuTWF0aC5WZWN0b3IyKC1keCwgLWR5KS5hbmdsZSgpKSk7XG5cbiAgICAgICAgY29uc3QgbWlzc2lsZUdyb3VwID0gdGhpcy5zY2VuZS5waHlzaWNzLmFkZC5ncm91cChjMSk7XG4gICAgICAgIG1pc3NpbGVHcm91cC5zZXRWZWxvY2l0eShkaXJlY3Rpb24ueCwgZGlyZWN0aW9uLnkpO1xuICAgICAgICB0aGlzLnNwcml0ZSA9IGMxO1xuXG4gICAgICAgIHRoaXMuZW5naW5lU291bmQgPSB0aGlzLnNjZW5lLnNvdW5kLmFkZCgnZW5naW5lLTInKSBhcyBQaGFzZXIuU291bmQuV2ViQXVkaW9Tb3VuZDtcblxuICAgICAgICB0aGlzLmVuZ2luZVNvdW5kLnBsYXkoKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgdXBkYXRlKCk6IHZvaWQge1xuICAgICAgICBjb25zdCBsb2NhdGlvbiA9IG5ldyBWZWN0b3IyKHRoaXMuc3ByaXRlLngsIHRoaXMuc3ByaXRlLnkpO1xuXG4gICAgICAgIGlmICh0aGlzLnNwcml0ZSAmJiAhdGhpcy5leHBsb2RlZCkge1xuICAgICAgICAgICAgbGV0IGlzSGl0ID0gZmFsc2U7XG4gICAgICAgICAgICBpZiAodGhpcy5leHBsb3Npb25Db250cm9sbGVyLmlzSGl0KGxvY2F0aW9uKSkge1xuICAgICAgICAgICAgICAgIGlzSGl0ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB0aGlzLnNjb3JlQ29udHJvbGxlci5ub3RpZnlBc3RlcmlvZERlc3Ryb3koKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGlzSGl0IHx8IHRoaXMuc3ByaXRlLnkgPj0gdGhpcy5zY2VuZS5nYW1lLmNhbnZhcy5oZWlnaHQgLSAxMDApIHtcbiAgICAgICAgICAgICAgICBjb25zdCBrID0gdGhpcy5zcHJpdGUuZ2V0QXQoMCkgYXMgU3ByaXRlO1xuICAgICAgICAgICAgICAgIGsuc2V0VmlzaWJsZShmYWxzZSk7XG5cbiAgICAgICAgICAgICAgICBjb25zdCBwID0gdGhpcy5zcHJpdGUuZ2V0QXQoMSkgYXMgUGFydGljbGVFbWl0dGVyO1xuICAgICAgICAgICAgICAgIHAuc3RvcChmYWxzZSk7XG5cbiAgICAgICAgICAgICAgICB0aGlzLmVuZ2luZVNvdW5kLnN0b3AoKTtcblxuICAgICAgICAgICAgICAgIGlmIChpc0hpdCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmV4cGxvc2lvbkNvbnRyb2xsZXIuZXhwbG9kZShuZXcgVmVjdG9yMih0aGlzLnNwcml0ZS54LCB0aGlzLnNwcml0ZS55KSwgMSwgMC45OCwgMHhmZmEwODAsIDApO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2NvcmVDb250cm9sbGVyLm5vdGlmeUFzdGVyaW9kRXhwbG9kZWQoKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5leHBsb3Npb25Db250cm9sbGVyLmV4cGxvZGUobmV3IFZlY3RvcjIodGhpcy5zcHJpdGUueCwgdGhpcy5zcHJpdGUueSksIDEwLCAwLjk5LCAweGZmODAwMCwgMC4xKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5leHBsb2RlZCA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpc0FjdGl2ZSgpIHtcbiAgICAgICAgcmV0dXJuICF0aGlzLmV4cGxvZGVkO1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIEFzdGVyb2lkQ29udHJvbGxlciB7XG4gICAgcHJpdmF0ZSBhc3RlcmlvZHM6IEFzdGVyb2lkW10gPSBbXTtcblxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihwdWJsaWMgc2NlbmU6IFBoYXNlci5TY2VuZSwgcHVibGljIGV4cGxvc2lvbkNvbnRyb2xsZXI6IEV4cGxvc2lvbkNvbnRyb2xsZXIsIHB1YmxpYyBzY29yZUNvbnRyb2xsZXI6IFNjb3JlQ29udHJvbGxlciwgcHVibGljIG1heEFzdGVyb2lkczogbnVtYmVyKSB7XG4gICAgfVxuXG4gICAgcHJlbG9hZCgpIHtcbiAgICAgICAgdGhpcy5zY2VuZS5sb2FkLnNwcml0ZXNoZWV0KCdiYWxsJywgJ2h0dHBzOi8vbGFicy5waGFzZXIuaW8vYXNzZXRzL3Nwcml0ZXMvYmFsbHMucG5nJywgeyBmcmFtZVdpZHRoOiAxNywgZnJhbWVIZWlnaHQ6IDE3IH0pO1xuICAgICAgICB0aGlzLnNjZW5lLmxvYWQuYXRsYXMoJ2ZsYXJlcycsICdodHRwczovL2xhYnMucGhhc2VyLmlvL2Fzc2V0cy9wYXJ0aWNsZXMvZmxhcmVzLnBuZycsICdodHRwczovL2xhYnMucGhhc2VyLmlvL2Fzc2V0cy9wYXJ0aWNsZXMvZmxhcmVzLmpzb24nKTtcblxuICAgICAgICB0aGlzLnNjZW5lLmxvYWQuYXVkaW8oJ2VuZ2luZS0xJywgJ2Fzc2V0cy9hdWRpby9lbmdpbmVodW0ub2dnJyk7XG4gICAgICAgIHRoaXMuc2NlbmUubG9hZC5hdWRpbygnZW5naW5lLTInLCAnYXNzZXRzL2F1ZGlvL2VuZ2luZWh1bTMub2dnJyk7XG4gICAgfVxuXG4gICAgcHVibGljIGNyZWF0ZSgpOiB2b2lkIHtcbiAgICB9XG5cbiAgICBwdWJsaWMgdXBkYXRlKCk6IHZvaWQge1xuICAgICAgICB0aGlzLmFzdGVyaW9kcy5mb3JFYWNoKGl0ZW0gPT4gaXRlbS51cGRhdGUoKSk7XG4gICAgfVxuXG4gICAgcHVibGljIGNyZWF0ZUFzdGVyaW9kKHNvdXJjZTogVmVjdG9yMiwgdGFyZ2V0OiBWZWN0b3IyKSB7XG4gICAgICAgIGlmICh0aGlzLmFzdGVyaW9kcy5sZW5ndGggPCB0aGlzLm1heEFzdGVyb2lkcykge1xuICAgICAgICAgICAgdGhpcy5hc3RlcmlvZHMucHVzaChuZXcgQXN0ZXJvaWQodGhpcy5zY2VuZSwgdGhpcy5leHBsb3Npb25Db250cm9sbGVyLCB0aGlzLnNjb3JlQ29udHJvbGxlciwgc291cmNlLCB0YXJnZXQpKTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBwdWJsaWMgY291bnRBY3RpdmUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmFzdGVyaW9kcy5yZWR1Y2UoKGNvdW50LCBhc3Rlcm9pZCkgPT4gY291bnQgKyAoYXN0ZXJvaWQuaXNBY3RpdmUoKSA/IDEgOiAwKSwgMCk7XG4gICAgfVxufSIsImltcG9ydCB7RXhwbG9zaW9uQ29udHJvbGxlcn0gZnJvbSBcIi4vZXhwbG9zaW9uXCI7XG5pbXBvcnQge1Njb3JlQ29udHJvbGxlcn0gZnJvbSBcIi4vc2NvcmVcIjtcbmltcG9ydCB7T25jZX0gZnJvbSBcIi4uL3V0aWxzL29uY2VcIjtcbmltcG9ydCBWZWN0b3IyID0gUGhhc2VyLk1hdGguVmVjdG9yMjtcbmltcG9ydCBTcHJpdGUgPSBQaGFzZXIuR2FtZU9iamVjdHMuU3ByaXRlO1xuaW1wb3J0IFBhcnRpY2xlRW1pdHRlciA9IFBoYXNlci5HYW1lT2JqZWN0cy5QYXJ0aWNsZXMuUGFydGljbGVFbWl0dGVyO1xuaW1wb3J0IFJlY3RhbmdsZSA9IFBoYXNlci5HZW9tLlJlY3RhbmdsZTtcblxuXG5leHBvcnQgY2xhc3MgQnVpbGRpbmcge1xuICAgIHByaXZhdGUgc3ByaXRlOiBTcHJpdGU7XG4gICAgcHJpdmF0ZSBkYW1hZ2VkOiBib29sZWFuID0gZmFsc2U7XG4gICAgcHJpdmF0ZSBwbHVtZTogUGFydGljbGVFbWl0dGVyO1xuICAgIHByaXZhdGUgZGVzdHJveVRpbWU6IG51bWJlciA9IDA7XG4gICAgcHJpdmF0ZSBidXJuaW5nID0gZmFsc2U7XG4gICAgcHJpdmF0ZSB0b0Rlc3Ryb3kgPSBuZXcgT25jZSgpO1xuXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKHB1YmxpYyBzY2VuZTogUGhhc2VyLlNjZW5lLCBwdWJsaWMgZXhwbG9zaW9uQ29udHJvbGxlcjogRXhwbG9zaW9uQ29udHJvbGxlciwgcHVibGljIHNjb3JlQ29udHJvbGxlcjogU2NvcmVDb250cm9sbGVyLFxuICAgICAgICAgICAgICAgICAgICAgICBwdWJsaWMgcG9zaXRpb246IFZlY3RvcjIpIHtcbiAgICAgICAgY29uc3QgZnJhbWVzID0gW1wiYnVpbGRpbmctMVwiLCBcImJ1aWxkaW5nLTJcIiwgXCJidWlsZGluZy0zXCIsIFwiYnVpbGRpbmctNFwiXTtcbiAgICAgICAgY29uc3QgaW5kZXggPSBQaGFzZXIuTWF0aC5CZXR3ZWVuKDAsIDMpO1xuICAgICAgICB0aGlzLnNwcml0ZSA9IHRoaXMuc2NlbmUuYWRkLnNwcml0ZShwb3NpdGlvbi54LCBwb3NpdGlvbi55LCBcImF0bGFzLTFcIiwgZnJhbWVzW2luZGV4ICUgZnJhbWVzLmxlbmd0aF0pO1xuXG4gICAgICAgIHRoaXMucGx1bWUgPSB0aGlzLnNjZW5lLmFkZC5wYXJ0aWNsZXModGhpcy5wb3NpdGlvbi54ICsgMC41ICogdGhpcy5zcHJpdGUud2lkdGgsIHRoaXMucG9zaXRpb24ueSwgJ2ZsYXJlcycsXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgZW1pdHRpbmc6IGZhbHNlLFxuICAgICAgICAgICAgICAgIGZyYW1lOiAnd2hpdGUnLFxuICAgICAgICAgICAgICAgIGNvbG9yOiBbIDB4MDAwMDAwLCAweDQ0NDQ0NCBdLFxuICAgICAgICAgICAgICAgIGNvbG9yRWFzZTogJ3F1YXJ0Lm91dCcsXG4gICAgICAgICAgICAgICAgbGlmZXNwYW46IDIwMDAsXG4gICAgICAgICAgICAgICAgZnJlcXVlbmN5OiAzMCxcbiAgICAgICAgICAgICAgICBhbmdsZTogeyBtaW46IC0xMDAsIG1heDogLTgwIH0sXG4gICAgICAgICAgICAgICAgc2NhbGU6IHsgc3RhcnQ6IDAuOCwgZW5kOiAxLjIsIGVhc2U6ICdzaW5lLmluJyB9LFxuICAgICAgICAgICAgICAgIHNwZWVkOiB7IG1pbjogMTAsIG1heDogMjAwIH0sXG4gICAgICAgICAgICAgICAgYWR2YW5jZTogMCwgLy8gMjAwMFxuICAgICAgICAgICAgICAgIGJsZW5kTW9kZTogJ05PUk1BTCcsXG4gICAgICAgICAgICAgICAgYWNjZWxlcmF0aW9uWDogMCxcbiAgICAgICAgICAgICAgICBhY2NlbGVyYXRpb25ZOiAwXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICBjb25zdCBncmFwaGljcyA9IHRoaXMuc2NlbmUuYWRkLmdyYXBoaWNzKHsgbGluZVN0eWxlOiB7IHdpZHRoOiAyLCBjb2xvcjogMHgwMGZmMDAgfSwgZmlsbFN0eWxlOiB7IGNvbG9yOiAweDExMDAwMCB9fSk7XG4gICAgICAgIGNvbnN0IHJlY3QgPSBuZXcgUGhhc2VyLkdlb20uUmVjdGFuZ2xlKHBvc2l0aW9uLngsIHBvc2l0aW9uLnkgLSB0aGlzLnNwcml0ZS5oZWlnaHQsIHRoaXMuc3ByaXRlLndpZHRoLCB0aGlzLnNwcml0ZS5oZWlnaHQpO1xuICAgICAgICBncmFwaGljcy5saW5lU3R5bGUoMSwgMHg3Nzc3MTEpO1xuXG4gICAgICAgIHRoaXMuc2NvcmVDb250cm9sbGVyLmFkZEJ1aWxkaW5nKCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBvbkRlc3Ryb3kodGltZTogbnVtYmVyKSB7XG4gICAgICAgIHRoaXMuc2NvcmVDb250cm9sbGVyLm5vdGlmeUJ1aWxkaW5nRGVzdHJveSgpO1xuICAgICAgICB0aGlzLmRhbWFnZWQgPSB0cnVlO1xuICAgICAgICBpZiAodGhpcy5kZXN0cm95VGltZSA9PSAwKSB7XG4gICAgICAgICAgICB0aGlzLmRlc3Ryb3lUaW1lID0gdGltZTtcblxuICAgICAgICAgICAgY29uc3QgY2hhaW4gPSB0aGlzLnNjZW5lLnR3ZWVucy5jaGFpbih7XG4gICAgICAgICAgICAgICAgdGFyZ2V0czogdGhpcy5zcHJpdGUsXG4gICAgICAgICAgICAgICAgdHdlZW5zOiBbXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFuZ2xlOiAnKz03MCcsXG4gICAgICAgICAgICAgICAgICAgICAgICBkdXJhdGlvbjogNTAwMCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlcGVhdDogMCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjYWxlOiB7IHZhbHVlOiAwLjAsIGR1cmF0aW9uOiA1MDAwIH0sXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB9XG4gICAgfVxuXG5cbiAgICBwdWJsaWMgdXBkYXRlKHRpbWU6IG51bWJlciwgZGVsdGE6IG51bWJlcik6IHZvaWQge1xuICAgICAgICBjb25zdCBsb2NhdGlvbiA9IG5ldyBWZWN0b3IyKHRoaXMuc3ByaXRlLngsIHRoaXMuc3ByaXRlLnkpO1xuICAgICAgICB0aGlzLnRvRGVzdHJveS5jaGVjayhcbiAgICAgICAgICAgIHRpbWUsXG4gICAgICAgICAgICAoKSA9PiB0aGlzLmV4cGxvc2lvbkNvbnRyb2xsZXIuaGl0UmVjdChuZXcgUmVjdGFuZ2xlKHRoaXMuc3ByaXRlLngsIHRoaXMuc3ByaXRlLnkgLSB0aGlzLnNwcml0ZS5oZWlnaHQsIHRoaXMuc3ByaXRlLndpZHRoLCB0aGlzLnNwcml0ZS5oZWlnaHQpKSxcbiAgICAgICAgICAgICgpID0+IHRoaXMub25EZXN0cm95KHRpbWUpXG4gICAgICAgICk7XG5cbiAgICAgICAgdGhpcy50b0Rlc3Ryb3kuYWZ0ZXIodGltZSwgNTAwLCAoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmJ1cm5pbmcgPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy5wbHVtZS5zdGFydCg1MCwgMCk7XG4gICAgICAgIH0pXG5cbiAgICAgICAgaWYgKHRoaXMudG9EZXN0cm95LmlzRG9uZSgpKSB7XG4gICAgICAgICAgICBpZiAoKHRpbWUgLSB0aGlzLmRlc3Ryb3lUaW1lKSA+IDUwMCAmJiAhdGhpcy5idXJuaW5nKSB7XG4gICAgICAgICAgICAgICAgLy8gdGhpcy5wbHVtZS5hY3RpdmUgPSB0cnVlO1xuICAgICAgICAgICAgICAgIC8vIHRoaXMucGx1bWUuZW1pdHRpbmcgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHRoaXMuYnVybmluZyA9IHRydWU7XG4gICAgICAgICAgICAgICAgdGhpcy5wbHVtZS5zdGFydCg1MCwgMCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGltZSAtIHRoaXMuZGVzdHJveVRpbWUgPiA1MDAwICYmIHRoaXMuYnVybmluZykge1xuICAgICAgICAgICAgICAgIHRoaXMucGx1bWUuZnJlcXVlbmN5ICs9IDEwMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cblxuXG5leHBvcnQgY2xhc3MgQnVpbGRpbmdDb250cm9sbGVyIHtcbiAgICBwcml2YXRlIGJ1aWxkaW5nczogQnVpbGRpbmdbXSA9IFtdO1xuXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKHB1YmxpYyBzY2VuZTogUGhhc2VyLlNjZW5lLCBwdWJsaWMgZXhwbG9zaW9uQ29udHJvbGxlcjogRXhwbG9zaW9uQ29udHJvbGxlciwgcHVibGljIHNjb3JlQ29udHJvbGxlcjogU2NvcmVDb250cm9sbGVyKSB7XG4gICAgfVxuXG4gICAgcHJlbG9hZCgpIHtcbiAgICAgICAgdGhpcy5zY2VuZS5sb2FkLmF0bGFzKCdhdGxhcy0xJywgJ2Fzc2V0cy9EYXkucG5nJywgJ2Fzc2V0cy9EYXkuanNvbicpO1xuICAgICAgICB0aGlzLnNjZW5lLmxvYWQuYXRsYXMoJ2ZhbicsICdhc3NldHMvZmFuLnBuZycsICdhc3NldHMvZmFuLWZyYW1lcy5qc29uJyk7XG4gICAgICAgIHRoaXMuc2NlbmUubG9hZC5hbmltYXRpb24oJ2Zhbi1hbmltJywgJ2Fzc2V0cy9mYW4tYW5pbS5qc29uJyk7XG4gICAgfVxuXG4gICAgcHVibGljIGNyZWF0ZSgpOiB2b2lkIHtcbiAgICB9XG5cbiAgICBwdWJsaWMgdXBkYXRlKHRpbWU6IG51bWJlciwgZGVsdGE6IG51bWJlcik6IHZvaWQge1xuICAgICAgICB0aGlzLmJ1aWxkaW5ncy5mb3JFYWNoKGl0ZW0gPT4gaXRlbS51cGRhdGUodGltZSwgZGVsdGEpKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgY3JlYXRlQnVpbGRpbmcocG9zaXRpb246IFZlY3RvcjIpIHtcbiAgICAgICAgdGhpcy5idWlsZGluZ3MucHVzaChuZXcgQnVpbGRpbmcodGhpcy5zY2VuZSwgdGhpcy5leHBsb3Npb25Db250cm9sbGVyLCB0aGlzLnNjb3JlQ29udHJvbGxlciwgcG9zaXRpb24pKTtcbiAgICB9XG59XG4iLCJpbXBvcnQgUG9pbnRMaWdodCA9IFBoYXNlci5HYW1lT2JqZWN0cy5Qb2ludExpZ2h0O1xuaW1wb3J0IFZlY3RvcjIgPSBQaGFzZXIuTWF0aC5WZWN0b3IyO1xuaW1wb3J0IFdlYkF1ZGlvU291bmQgPSBQaGFzZXIuU291bmQuV2ViQXVkaW9Tb3VuZDtcbmltcG9ydCBDaXJjbGUgPSBQaGFzZXIuR2VvbS5DaXJjbGU7XG5pbXBvcnQgUmVjdGFuZ2xlID0gUGhhc2VyLkdlb20uUmVjdGFuZ2xlO1xuaW1wb3J0IENpcmNsZVRvUmVjdGFuZ2xlID0gUGhhc2VyLkdlb20uSW50ZXJzZWN0cy5DaXJjbGVUb1JlY3RhbmdsZTtcblxuXG5leHBvcnQgY2xhc3MgRXhwbG9zaW9uIHtcbiAgICBwcml2YXRlIGxpZ2h0czogUG9pbnRMaWdodFtdID0gW107XG5cbiAgICBwcml2YXRlIGV4cGxvc2lvblNvdW5kOiBXZWJBdWRpb1NvdW5kO1xuXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKHB1YmxpYyBzY2VuZTogUGhhc2VyLlNjZW5lLCBwdWJsaWMgbG9jYXRpb246IFZlY3RvcjIsIHB1YmxpYyBpbnRlbnNpdHk6IG51bWJlciwgcHVibGljIHJlZHVjdGlvbjogbnVtYmVyLFxuICAgICAgICAgICAgICAgICAgICAgICBwdWJsaWMgY29sb3I6IG51bWJlciwgcHVibGljIHVwd2luZDogbnVtYmVyKSB7XG4gICAgICAgIGxldCBpbmRleE1heCA9IGludGVuc2l0eTtcbiAgICAgICAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IGluZGV4TWF4OyBpbmRleCsrKSB7XG4gICAgICAgICAgICBsZXQgZHggPSBpbmRleE1heCA+IDEgPyAxMDAgKiBpbmRleCAvIChpbmRleE1heCAtIDEpIC0gNTAgOiAwO1xuICAgICAgICAgICAgbGV0IGR5ID0gTWF0aC5yYW5kb20oKSAqIDIwIC0gMTA7XG4gICAgICAgICAgICBsZXQgbmV3bGlnaHQgPSB0aGlzLnNjZW5lLmFkZC5wb2ludGxpZ2h0KGxvY2F0aW9uLnggKyBkeCwgbG9jYXRpb24ueSArIGR5LCBjb2xvciwgMzAsIDEpO1xuICAgICAgICAgICAgbmV3bGlnaHQuYXR0ZW51YXRpb24gPSAwLjE7XG4gICAgICAgICAgICB0aGlzLmxpZ2h0cy5wdXNoKG5ld2xpZ2h0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuZXhwbG9zaW9uU291bmQgPSB0aGlzLmludGVuc2l0eSA+IDEgP1xuICAgICAgICAgICAgdGhpcy5zY2VuZS5zb3VuZC5hZGQoJ2V4cGxvc2lvbi0xJykgYXMgUGhhc2VyLlNvdW5kLldlYkF1ZGlvU291bmQgOlxuICAgICAgICAgICAgdGhpcy5zY2VuZS5zb3VuZC5hZGQoJ2V4cGxvc2lvbi0yJykgYXMgUGhhc2VyLlNvdW5kLldlYkF1ZGlvU291bmQ7XG4gICAgICAgIHRoaXMuZXhwbG9zaW9uU291bmQucGxheSgpO1xuICAgIH1cblxuICAgIHB1YmxpYyB1cGRhdGUoKTogdm9pZCB7XG4gICAgICAgIHRoaXMubGlnaHRzLmZvckVhY2gobGlnaHQgPT4ge1xuICAgICAgICAgICAgbGlnaHQueSAtPSB0aGlzLnVwd2luZDtcbiAgICAgICAgICAgIGxpZ2h0LnJhZGl1cyAqPSAxLjAxXG4gICAgICAgICAgICBsaWdodC5pbnRlbnNpdHkgKj0gdGhpcy5yZWR1Y3Rpb247XG4gICAgICAgIH0pO1xuICAgICAgICBjb25zdCByZW1vdmVFeHBsb3Npb24gPSB0aGlzLmxpZ2h0cy5yZWR1Y2UoKHJlbW92ZSwgbGlnaHQpID0+IHJlbW92ZSB8fCBsaWdodC5pbnRlbnNpdHkgPCAwLjAwMSwgZmFsc2UpO1xuICAgICAgICBpZiAocmVtb3ZlRXhwbG9zaW9uKSB7XG4gICAgICAgICAgICB0aGlzLmxpZ2h0cy5mb3JFYWNoKGxpZ2h0ID0+IHtcbiAgICAgICAgICAgICAgICBsaWdodC5kZXN0cm95KHRydWUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLmxpZ2h0cyA9IFtdO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIGlzQWN0aXZlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5saWdodHMubGVuZ3RoID4gMDtcbiAgICB9XG5cbiAgICBwdWJsaWMgaXNIaXQobG9jYXRpb246IFZlY3RvcjIpOiBib29sZWFuIHtcbiAgICAgICAgaWYgKHRoaXMuaXNBY3RpdmUoKSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMubG9jYXRpb24uZGlzdGFuY2UobG9jYXRpb24pIDwgdGhpcy5pbnRlbnNpdHkgKiAyMDsgLy8gMjA7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHB1YmxpYyBoaXRSZWN0KHJlY3Q6IFJlY3RhbmdsZSk6IGJvb2xlYW4ge1xuICAgICAgICBpZiAodGhpcy5pc0FjdGl2ZSgpKSB7XG4gICAgICAgICAgICBjb25zdCBleHBsb3NlaW9uQXJlYSA9IG5ldyBDaXJjbGUodGhpcy5sb2NhdGlvbi54LCB0aGlzLmxvY2F0aW9uLnksIHRoaXMuaW50ZW5zaXR5ICogMjApO1xuICAgICAgICAgICAgcmV0dXJuIENpcmNsZVRvUmVjdGFuZ2xlKGV4cGxvc2Vpb25BcmVhLCByZWN0KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG5cbn1cblxuXG5leHBvcnQgY2xhc3MgRXhwbG9zaW9uQ29udHJvbGxlciB7XG4gICAgcHJpdmF0ZSBleHBsb3Npb25zOiBFeHBsb3Npb25bXSA9IFtdO1xuXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKHB1YmxpYyBzY2VuZTogUGhhc2VyLlNjZW5lKSB7XG4gICAgfVxuXG4gICAgcHJlbG9hZCgpIHtcbiAgICAgICAgdGhpcy5zY2VuZS5sb2FkLmF1ZGlvKCdleHBsb3Npb24tMScsICdhc3NldHMvYXVkaW8vcm9ja19icmVha2luZy5mbGFjJyk7XG4gICAgICAgIHRoaXMuc2NlbmUubG9hZC5hdWRpbygnZXhwbG9zaW9uLTInLCAnYXNzZXRzL2F1ZGlvL0RlYXRoRmxhc2guZmxhYycpO1xuICAgIH1cblxuICAgIHB1YmxpYyBjcmVhdGUoKTogdm9pZCB7XG4gICAgfVxuXG4gICAgcHVibGljIHVwZGF0ZSgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5leHBsb3Npb25zLmZvckVhY2gobWlzc2lsZSA9PiBtaXNzaWxlLnVwZGF0ZSgpKTtcbiAgICAgICAgdGhpcy5leHBsb3Npb25zID0gdGhpcy5leHBsb3Npb25zLnJlZHVjZTxFeHBsb3Npb25bXT4oKGFjdGl2ZSwgZXhwbG9zaW9uKSA9PiB7XG4gICAgICAgICAgICBpZiAoZXhwbG9zaW9uLmlzQWN0aXZlKCkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gWy4uLmFjdGl2ZSwgZXhwbG9zaW9uXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBhY3RpdmU7XG4gICAgICAgIH0sIFtdKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZXhwbG9kZShsb2NhdGlvbjogVmVjdG9yMiwgaW50ZW5zaXR5OiBudW1iZXIsIHJlZHVjdGlvbjogbnVtYmVyLCBjb2xvcjogbnVtYmVyLCB1cHdpbmQ6IG51bWJlcikge1xuICAgICAgICB0aGlzLmV4cGxvc2lvbnMucHVzaChuZXcgRXhwbG9zaW9uKHRoaXMuc2NlbmUsIGxvY2F0aW9uLCBpbnRlbnNpdHksIHJlZHVjdGlvbiwgY29sb3IsIHVwd2luZCkpXG4gICAgfVxuXG4gICAgaXNIaXQobG9jYXRpb246IFBoYXNlci5NYXRoLlZlY3RvcjIpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZXhwbG9zaW9ucy5yZWR1Y2UoKGhpdCwgZXhwbG9zaW9uKSA9PiBoaXQgfHwgZXhwbG9zaW9uLmlzSGl0KGxvY2F0aW9uKSwgZmFsc2UpO1xuICAgIH1cblxuICAgIHB1YmxpYyBoaXRSZWN0KHJlY3Q6IFJlY3RhbmdsZSk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5leHBsb3Npb25zLnJlZHVjZSgoaGl0LCBleHBsb3Npb24pID0+IGhpdCB8fCBleHBsb3Npb24uaGl0UmVjdChyZWN0KSwgZmFsc2UpO1xuICAgIH1cblxufVxuIiwiaW1wb3J0IHtNaXNzaWxlU2NlbmV9IGZyb20gXCIuL21pc3NpbGUtc2NlbmVcIjtcblxuZXhwb3J0IGRlZmF1bHQgW01pc3NpbGVTY2VuZV07XG4iLCJpbXBvcnQgVGV4dCA9IFBoYXNlci5HYW1lT2JqZWN0cy5UZXh0O1xuaW1wb3J0IFZlY3RvcjIgPSBQaGFzZXIuTWF0aC5WZWN0b3IyO1xuaW1wb3J0IHtNaXNzaWxlQ29udHJvbGxlcn0gZnJvbSBcIi4vbWlzc2lsZVwiO1xuaW1wb3J0IHtBc3Rlcm9pZENvbnRyb2xsZXJ9IGZyb20gXCIuL2FzdGVyb2lkXCI7XG5pbXBvcnQge0V4cGxvc2lvbkNvbnRyb2xsZXJ9IGZyb20gXCIuL2V4cGxvc2lvblwiO1xuaW1wb3J0IHtTY29yZUNvbnRyb2xsZXJ9IGZyb20gXCIuL3Njb3JlXCI7XG5pbXBvcnQge0J1aWxkaW5nQ29udHJvbGxlcn0gZnJvbSBcIi4vYnVpbGRpbmdcIjtcblxuXG5jb25zdCBzY2VuZUNvbmZpZzogUGhhc2VyLlR5cGVzLlNjZW5lcy5TZXR0aW5nc0NvbmZpZyA9IHtcbiAgICBhY3RpdmU6IGZhbHNlLFxuICAgIHZpc2libGU6IHRydWUsXG4gICAga2V5OiAnTWlzc2lsZVRlc3RTY2VuZScsXG59O1xuXG5leHBvcnQgY2xhc3MgTWlzc2lsZVNjZW5lIGV4dGVuZHMgUGhhc2VyLlNjZW5lIHtcbiAgICBwcml2YXRlIGV4cGxvc2lvbkNvbnRyb2xsZXI6IEV4cGxvc2lvbkNvbnRyb2xsZXI7XG4gICAgcHJpdmF0ZSBtaXNzaWxlQ29udHJvbGxlcjogTWlzc2lsZUNvbnRyb2xsZXI7XG4gICAgcHJpdmF0ZSBhc3RlcmlvZENvbnRyb2xsZXI6IEFzdGVyb2lkQ29udHJvbGxlcjtcbiAgICBwcml2YXRlIGJ1aWxkaW5nQ29udHJvbGxlcjogQnVpbGRpbmdDb250cm9sbGVyO1xuICAgIHByaXZhdGUgc2NvcmVDb250cm9sbGVyOiBTY29yZUNvbnRyb2xsZXIgPSBuZXcgU2NvcmVDb250cm9sbGVyKCk7XG4gICAgcHJpdmF0ZSB0ZXh0OiBUZXh0O1xuICAgIHByaXZhdGUgaXNQYXVzZWQ6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICBwcml2YXRlIGdhbWVPdmVyOiBQaGFzZXIuR2FtZU9iamVjdHMuVGV4dDtcbiAgICBwcml2YXRlIG5leHRBc3Rlcm9pZFRpbWUgPSAwO1xuICAgIHByaXZhdGUgbGFzdEFzdGVyaW9kOiBib29sZWFuID0gZmFsc2U7XG5cbiAgICBjb25zdHJ1Y3RvciAoKSB7XG4gICAgICAgIHN1cGVyKHNjZW5lQ29uZmlnKTtcbiAgICAgICAgdGhpcy5leHBsb3Npb25Db250cm9sbGVyID0gbmV3IEV4cGxvc2lvbkNvbnRyb2xsZXIodGhpcyk7XG4gICAgICAgIHRoaXMubWlzc2lsZUNvbnRyb2xsZXIgPSBuZXcgTWlzc2lsZUNvbnRyb2xsZXIodGhpcywgdGhpcy5leHBsb3Npb25Db250cm9sbGVyLCB0aGlzLnNjb3JlQ29udHJvbGxlcik7XG4gICAgICAgIHRoaXMuYXN0ZXJpb2RDb250cm9sbGVyID0gbmV3IEFzdGVyb2lkQ29udHJvbGxlcih0aGlzLCB0aGlzLmV4cGxvc2lvbkNvbnRyb2xsZXIsIHRoaXMuc2NvcmVDb250cm9sbGVyLCAyMCk7XG4gICAgICAgIHRoaXMuYnVpbGRpbmdDb250cm9sbGVyID0gbmV3IEJ1aWxkaW5nQ29udHJvbGxlcih0aGlzLCB0aGlzLmV4cGxvc2lvbkNvbnRyb2xsZXIsIHRoaXMuc2NvcmVDb250cm9sbGVyKTtcbiAgICB9XG5cbiAgICBwcmVsb2FkICgpIHtcbiAgICAgICAgdGhpcy5sb2FkLmltYWdlKCdiZycsICdodHRwczovL2xhYnMucGhhc2VyLmlvL2Fzc2V0cy9za2llcy9zcGFjZTMucG5nJyk7XG5cbiAgICAgICAgdGhpcy5idWlsZGluZ0NvbnRyb2xsZXIucHJlbG9hZCgpO1xuICAgICAgICB0aGlzLm1pc3NpbGVDb250cm9sbGVyLnByZWxvYWQoKTtcbiAgICAgICAgdGhpcy5hc3RlcmlvZENvbnRyb2xsZXIucHJlbG9hZCgpO1xuICAgICAgICB0aGlzLmV4cGxvc2lvbkNvbnRyb2xsZXIucHJlbG9hZCgpO1xuICAgIH1cblxuXG4gICAgcHVibGljIGNyZWF0ZSgpIHtcbiAgICAgICAgY29uc3QgYmFja2dyb3VuZCA9IHRoaXMuYWRkLmltYWdlKHRoaXMuZ2FtZS5jYW52YXMud2lkdGggLyAyLCB0aGlzLmdhbWUuY2FudmFzLmhlaWdodCAvIDIsICdiZycpXG4gICAgICAgIGJhY2tncm91bmQuc2NhbGVYID0gdGhpcy5nYW1lLmNhbnZhcy53aWR0aCAvIGJhY2tncm91bmQud2lkdGg7XG4gICAgICAgIGJhY2tncm91bmQuc2NhbGVZID0gdGhpcy5nYW1lLmNhbnZhcy5oZWlnaHQgLyBiYWNrZ3JvdW5kLmhlaWdodDtcblxuICAgICAgICB0aGlzLmlucHV0LnNldERlZmF1bHRDdXJzb3IoJ3VybChhc3NldHMvcG9pbnRlci5wbmcpIDMyIDE2LCBjcm9zc2hhaXInKTtcblxuICAgICAgICBjb25zdCBmcmFtZXMgPSBbXCJidWlsZGluZy0xXCIsIFwiYnVpbGRpbmctMlwiLCBcImJ1aWxkaW5nLTNcIiwgXCJidWlsZGluZy00XCJdO1xuICAgICAgICAvLyBjb25zdCBmcmFtZXMgPSBbXCJmYW4tMVwiLCBcImZhbi0yXCIsIFwiZmFuLTNcIiwgXCJmYW4tNFwiLCBcImZhbi01XCIsIFwiZmFuLTZcIiwgXCJmYW4tN1wiLCBcImZhbi04XCJdO1xuICAgICAgICBmb3IgKGxldCBpbmRleCA9IDE7IGluZGV4IDwgdGhpcy5nYW1lLmNhbnZhcy53aWR0aCAvIDEyMCAtIDE7IGluZGV4KyspIHtcbi8vICAgICAgICAgICAgY29uc3QgczEgPSB0aGlzLmFkZC5zcHJpdGUoaW5kZXggKiAxMjAsIHRoaXMuZ2FtZS5jYW52YXMuaGVpZ2h0LCBcImF0bGFzLTFcIiwgZnJhbWVzW2luZGV4ICUgZnJhbWVzLmxlbmd0aF0pO1xuLy8gICAgICAgICAgICBjb25zdCBmYW4gPSB0aGlzLmFkZC5zcHJpdGUoaW5kZXggKiAxMjAgKyA5MCwgdGhpcy5nYW1lLmNhbnZhcy5oZWlnaHQgLSA2MCwgXCJmYW5cIikucGxheShcImZhbi1zY3Jld1wiKVxuICAgICAgICAgICAgLy8gdGhpcy5hZGQuc3ByaXRlKGluZGV4ICogMTIwICsgNjAsIHRoaXMuZ2FtZS5jYW52YXMuaGVpZ2h0IC0gMzAsIFwiZmFuXCIsIGZyYW1lc1tpbmRleCAlIGZyYW1lcy5sZW5ndGhdKTtcbiAgICAgICAgICAgIHRoaXMuYnVpbGRpbmdDb250cm9sbGVyLmNyZWF0ZUJ1aWxkaW5nKG5ldyBWZWN0b3IyKGluZGV4ICogMTIwICsgMTAsIHRoaXMuZ2FtZS5jYW52YXMuaGVpZ2h0IC0gMTIwKSk7XG4gICAgICAgICAgICB0aGlzLmJ1aWxkaW5nQ29udHJvbGxlci5jcmVhdGVCdWlsZGluZyhuZXcgVmVjdG9yMihpbmRleCAqIDEyMCArIDMwLCB0aGlzLmdhbWUuY2FudmFzLmhlaWdodCAtIDkwKSk7XG4gICAgICAgICAgICB0aGlzLmJ1aWxkaW5nQ29udHJvbGxlci5jcmVhdGVCdWlsZGluZyhuZXcgVmVjdG9yMihpbmRleCAqIDEyMCArIDYwLCB0aGlzLmdhbWUuY2FudmFzLmhlaWdodCAtIDYwKSk7XG4gICAgICAgICAgICB0aGlzLmJ1aWxkaW5nQ29udHJvbGxlci5jcmVhdGVCdWlsZGluZyhuZXcgVmVjdG9yMihpbmRleCAqIDEyMCwgdGhpcy5nYW1lLmNhbnZhcy5oZWlnaHQgLSAzMCkpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy50ZXh0ID0gdGhpcy5hZGQudGV4dCgxMCwgMTAsICdXaGVlbDogSHVlXFxuQSArIEQ6IFJhZGl1c1xcblcgKyBTOiBBdHRlbnVhdGlvblxcbkNsaWNrIHRvIHNldCBMaWdodCcpLnNldERlcHRoKDEpO1xuICAgICAgICB0aGlzLmdhbWVPdmVyID0gdGhpcy5hZGQudGV4dCgwLCAxMDAsICdHYW1lIE92ZXInLCB7Zm9udFNpemU6IDEyMH0pLnNldERlcHRoKDEpO1xuICAgICAgICB0aGlzLmdhbWVPdmVyLnggPSAwLjUgKiAodGhpcy5nYW1lLmNhbnZhcy53aWR0aCAtIHRoaXMuZ2FtZU92ZXIud2lkdGgpO1xuICAgICAgICB0aGlzLmdhbWVPdmVyLnkgPSAwLjMgKiAodGhpcy5nYW1lLmNhbnZhcy5oZWlnaHQgLSB0aGlzLmdhbWVPdmVyLmhlaWdodCk7XG4gICAgICAgIHRoaXMuZ2FtZU92ZXIudmlzaWJsZSA9IGZhbHNlO1xuXG4gICAgICAgIHRoaXMubWlzc2lsZUNvbnRyb2xsZXIuY3JlYXRlKCk7XG4gICAgICAgIHRoaXMuYXN0ZXJpb2RDb250cm9sbGVyLmNyZWF0ZSgpO1xuXG4gICAgICAgIHRoaXMuaW5wdXQub24oJ3BvaW50ZXJkb3duJywgcG9pbnRlciA9PiB7XG4gICAgICAgICAgICB0aGlzLmxhdW5jaE1pc3NpbGUocG9pbnRlci54LCBwb2ludGVyLnkpO1xuICAgICAgICB9KVxuICAgIH1cblxuXG4gICAgcHVibGljIHVwZGF0ZSh0aW1lOiBudW1iZXIsIGRlbHRhOiBudW1iZXIpIHtcbiAgICAgICAgdGhpcy50ZXh0LnRleHQgPSB0aGlzLnNjb3JlQ29udHJvbGxlci50b1N0cmluZygpO1xuXG4gICAgICAgIHRoaXMuZXhwbG9zaW9uQ29udHJvbGxlci51cGRhdGUoKTtcbiAgICAgICAgdGhpcy5taXNzaWxlQ29udHJvbGxlci51cGRhdGUodGltZSk7XG4gICAgICAgIHRoaXMuYXN0ZXJpb2RDb250cm9sbGVyLnVwZGF0ZSgpO1xuICAgICAgICB0aGlzLmJ1aWxkaW5nQ29udHJvbGxlci51cGRhdGUodGltZSwgZGVsdGEpO1xuXG4gICAgICAgIGlmICghdGhpcy5uZXh0QXN0ZXJvaWRUaW1lKSB7XG4gICAgICAgICAgICB0aGlzLm5leHRBc3Rlcm9pZFRpbWUgPSB0aW1lICsgUGhhc2VyLk1hdGguQmV0d2VlbigxMDAwLCAyMDAwKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXRoaXMubGFzdEFzdGVyaW9kICYmIHRpbWUgPiB0aGlzLm5leHRBc3Rlcm9pZFRpbWUpIHtcbiAgICAgICAgICAgIHRoaXMubmV4dEFzdGVyb2lkVGltZSA9IHRpbWUgKyBQaGFzZXIuTWF0aC5CZXR3ZWVuKDEwMDAsIDEwMDAwKTtcbiAgICAgICAgICAgIHRoaXMuZHJvcEFzdGVyb2lkKCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5zY29yZUNvbnRyb2xsZXIuaXNHYW1lT3ZlcigpKSB7XG4gICAgICAgICAgICB0aGlzLm9uR2FtZU92ZXIoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmxhc3RBc3RlcmlvZCAmJiB0aGlzLmFzdGVyaW9kQ29udHJvbGxlci5jb3VudEFjdGl2ZSgpICYmIHRoaXMuc2NvcmVDb250cm9sbGVyLmdldEJ1aWxkaW5nc0xlZnQoKSA+IDApIHtcbiAgICAgICAgICAgIHRoaXMub25HYW1lV2luKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIG9uR2FtZU92ZXIoKSB7XG4gICAgICAgIHRoaXMuaXNQYXVzZWQgPSB0cnVlO1xuICAgICAgICB0aGlzLmdhbWVPdmVyLnZpc2libGUgPSB0cnVlO1xuICAgIH1cblxuICAgIHByaXZhdGUgb25HYW1lV2luKCkge1xuICAgICAgICB0aGlzLmlzUGF1c2VkID0gdHJ1ZTtcblxuICAgICAgICBjb25zdCBnYW1lV2luID0gdGhpcy5hZGQudGV4dCgwLCAxMDAsIGBTY29yZSAke3RoaXMuc2NvcmVDb250cm9sbGVyLmdldFNjb3JlKCl9YCwge1xuICAgICAgICAgICAgZm9udFNpemU6IDAuMSAqIHRoaXMuZ2FtZS5jYW52YXMud2lkdGhcbiAgICAgICAgfSkuc2V0RGVwdGgoMSk7XG4gICAgICAgIGdhbWVXaW4ueCA9IDAuNSAqICh0aGlzLmdhbWUuY2FudmFzLndpZHRoIC0gZ2FtZVdpbi53aWR0aCk7XG4gICAgICAgIGdhbWVXaW4ueSA9IDAuMyAqICh0aGlzLmdhbWUuY2FudmFzLmhlaWdodCAtIGdhbWVXaW4uaGVpZ2h0KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGxhdW5jaE1pc3NpbGUoeDogbnVtYmVyLCB5OiBudW1iZXIpIHtcbiAgICAgICAgaWYgKHRoaXMuaXNQYXVzZWQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBjZW50ZXJYID0gdGhpcy5nYW1lLmNhbnZhcy53aWR0aCAvIDIuMDtcbiAgICAgICAgY29uc3QgbWlzc2lsZSA9IHRoaXMubWlzc2lsZUNvbnRyb2xsZXIuY3JlYXRlTWlzc2lsZShcbiAgICAgICAgICAgIG5ldyBWZWN0b3IyKHggPCBjZW50ZXJYID8gMCA6IHRoaXMuZ2FtZS5jYW52YXMud2lkdGgsIHRoaXMuZ2FtZS5jYW52YXMuaGVpZ2h0IC0gMjApLFxuICAgICAgICAgICAgbmV3IFZlY3RvcjIoeCwgeSkpO1xuICAgICAgICBpZiAobWlzc2lsZSkge1xuICAgICAgICAgICAgdGhpcy5pbnB1dC5zZXREZWZhdWx0Q3Vyc29yKCd1cmwoYXNzZXRzL3BvaW50ZXItbG9hZGluZy5wbmcpIDMyIDE2LCBjcm9zc2hhaXInKTtcbiAgICAgICAgICAgIG1pc3NpbGUub25FeHBsb2RlKCgpID0+IHRoaXMuaW5wdXQuc2V0RGVmYXVsdEN1cnNvcigndXJsKGFzc2V0cy9wb2ludGVyLnBuZykgMzIgMTYsIGNyb3NzaGFpcicpKVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBkcm9wQXN0ZXJvaWQoKSB7XG4gICAgICAgIHRoaXMuc2NvcmVDb250cm9sbGVyLm5vdGlmeUFzdGVyaW9kRHJvcHBlZCgpO1xuICAgICAgICBjb25zdCBzb3VyY2VYID0gUGhhc2VyLk1hdGguQmV0d2VlbigtIDAuMSAqIHRoaXMuZ2FtZS5jYW52YXMud2lkdGgsIDEuMSAqIHRoaXMuZ2FtZS5jYW52YXMud2lkdGgpO1xuICAgICAgICBjb25zdCB0YXJnZXRYID0gUGhhc2VyLk1hdGguQmV0d2VlbigwLjEgKiB0aGlzLmdhbWUuY2FudmFzLndpZHRoLCAwLjkgKiB0aGlzLmdhbWUuY2FudmFzLndpZHRoKTtcbiAgICAgICAgY29uc3QgZHJvcHBlZCA9IHRoaXMuYXN0ZXJpb2RDb250cm9sbGVyLmNyZWF0ZUFzdGVyaW9kKG5ldyBWZWN0b3IyKHNvdXJjZVgsIDApLCBuZXcgVmVjdG9yMih0YXJnZXRYLCB0aGlzLmdhbWUuY2FudmFzLmhlaWdodCAtIDIwKSk7XG4gICAgICAgIHRoaXMubGFzdEFzdGVyaW9kID0gIWRyb3BwZWQ7XG4gICAgfVxuXG59XG4iLCJpbXBvcnQgVmVjdG9yMiA9IFBoYXNlci5NYXRoLlZlY3RvcjI7XG5pbXBvcnQge0V4cGxvc2lvbkNvbnRyb2xsZXJ9IGZyb20gXCIuL2V4cGxvc2lvblwiO1xuaW1wb3J0IHtTY29yZUNvbnRyb2xsZXJ9IGZyb20gXCIuL3Njb3JlXCI7XG5cblxuZXhwb3J0IGNsYXNzIE1pc3NpbGUgIHtcbiAgICBwdWJsaWMgc3ByaXRlOiBQaGFzZXIuUGh5c2ljcy5BcmNhZGUuU3ByaXRlO1xuICAgIHByaXZhdGUgZXhwbG9kZWQgPSBmYWxzZTtcbiAgICBwcml2YXRlIGV4cGxvZGVDYWxsYmFjazogKCkgPT4gdm9pZDtcbiAgICBwcml2YXRlIHZlbG9jaXR5OiBWZWN0b3IyO1xuXG4gICAgY29uc3RydWN0b3IocHVibGljIHNjZW5lOiBQaGFzZXIuU2NlbmUsIHB1YmxpYyBleHBsb3Npb25Db250cm9sbGVyOiBFeHBsb3Npb25Db250cm9sbGVyLCBwdWJsaWMgc291cmNlOiBWZWN0b3IyLCBwdWJsaWMgdGFyZ2V0OiBWZWN0b3IyKSB7XG4gICAgICAgIHRoaXMuc3ByaXRlID0gdGhpcy5zY2VuZS5waHlzaWNzLmFkZC5zcHJpdGUoc291cmNlLngsIHNvdXJjZS55LCAnbWlzc2lsZS0xJyk7XG4gICAgICAgIGNvbnN0IGRpcmVjdGlvbiA9IG5ldyBWZWN0b3IyKHRhcmdldCkuc3VidHJhY3Qoc291cmNlKTtcbiAgICAgICAgdGhpcy52ZWxvY2l0eSA9IGRpcmVjdGlvbi5ub3JtYWxpemUoKS5zY2FsZSgzMDApO1xuICAgICAgICB0aGlzLnNwcml0ZS5zZXRSb3RhdGlvbihkaXJlY3Rpb24uYW5nbGUoKSArIE1hdGguUEkgLyAyLjApO1xuICAgICAgICB0aGlzLnNwcml0ZS5zZXRWZWxvY2l0eVgodGhpcy52ZWxvY2l0eS54KTtcbiAgICAgICAgdGhpcy5zcHJpdGUuc2V0VmVsb2NpdHlZKHRoaXMudmVsb2NpdHkueSk7XG4gICAgfVxuXG4gICAgcHVibGljIHVwZGF0ZSh0aW1lOiBudW1iZXIpOiB2b2lkIHtcbiAgICAgICAgaWYgKCF0aGlzLmV4cGxvZGVkKSB7XG4gICAgICAgICAgICB0aGlzLnZlbG9jaXR5ID0gdGhpcy52ZWxvY2l0eS5zY2FsZSgxLjAwNSk7XG4gICAgICAgICAgICB0aGlzLnNwcml0ZS5zZXRWZWxvY2l0eVgodGhpcy52ZWxvY2l0eS54KTtcbiAgICAgICAgICAgIHRoaXMuc3ByaXRlLnNldFZlbG9jaXR5WSh0aGlzLnZlbG9jaXR5LnkpO1xuXG4gICAgICAgICAgICBjb25zdCBsb2NhdGlvbiA9IG5ldyBWZWN0b3IyKHRoaXMuc3ByaXRlLngsIHRoaXMuc3ByaXRlLnkpO1xuICAgICAgICAgICAgaWYgKGxvY2F0aW9uLmRpc3RhbmNlKHRoaXMudGFyZ2V0KSA8IDEwLjApIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNwcml0ZS5kZXN0cm95KHRydWUpO1xuICAgICAgICAgICAgICAgIHRoaXMuc3ByaXRlID0gbnVsbDtcbiAgICAgICAgICAgICAgICB0aGlzLmV4cGxvc2lvbkNvbnRyb2xsZXIuZXhwbG9kZShsb2NhdGlvbiwgMSwgMC45OSwgMHhhMGEwZmYsIDApO1xuICAgICAgICAgICAgICAgIHRoaXMuZXhwbG9kZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmV4cGxvZGVDYWxsYmFjaykge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmV4cGxvZGVDYWxsYmFjaygpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBpc0FjdGl2ZSgpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3ByaXRlICE9IG51bGw7XG4gICAgfVxuXG4gICAgcHVibGljIG9uRXhwbG9kZShjYWxsYmFjazogKCkgPT4gdm9pZCkge1xuICAgICAgICB0aGlzLmV4cGxvZGVDYWxsYmFjayA9IGNhbGxiYWNrO1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIE1pc3NpbGVDb250cm9sbGVyIHtcbiAgICBwcml2YXRlIG1pc3NpbGVzOiBNaXNzaWxlW10gPSBbXTtcblxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihwdWJsaWMgc2NlbmU6IFBoYXNlci5TY2VuZSwgcHVibGljIGV4cGxvc2lvbkNvbnRyb2xsZXI6IEV4cGxvc2lvbkNvbnRyb2xsZXIsIHB1YmxpYyBzY29yZUNvbnRyb2xsZXI6IFNjb3JlQ29udHJvbGxlcikge1xuICAgIH1cblxuICAgIHByZWxvYWQoKSB7XG4gICAgICAgIHRoaXMuc2NlbmUubG9hZC5pbWFnZSgnbWlzc2lsZS0xJywgJ2Fzc2V0cy9zdG9ybV9zaGFkb3cucG5nJyk7XG4gICAgfVxuXG4gICAgcHVibGljIGNyZWF0ZSgpOiB2b2lkIHtcbiAgICB9XG5cbiAgICBwdWJsaWMgdXBkYXRlKHRpbWU6IG51bWJlcik6IHZvaWQge1xuICAgICAgICB0aGlzLm1pc3NpbGVzLmZvckVhY2gobWlzc2lsZSA9PiBtaXNzaWxlLnVwZGF0ZSh0aW1lKSk7XG4gICAgICAgIHRoaXMubWlzc2lsZXMgPSB0aGlzLm1pc3NpbGVzLnJlZHVjZTxNaXNzaWxlW10+KChhY3RpdmUsIGV4cGxvc2lvbikgPT4ge1xuICAgICAgICAgICAgaWYgKGV4cGxvc2lvbi5pc0FjdGl2ZSgpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFsuLi5hY3RpdmUsIGV4cGxvc2lvbl07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gYWN0aXZlO1xuICAgICAgICB9LCBbXSk7XG4gICAgfVxuXG4gICAgcHVibGljIGNyZWF0ZU1pc3NpbGUoc291cmNlOiBWZWN0b3IyLCB0YXJnZXQ6IFZlY3RvcjIpIHtcbiAgICAgICAgaWYgKHRoaXMubWlzc2lsZXMubGVuZ3RoIDwgMSkge1xuICAgICAgICAgICAgdGhpcy5zY29yZUNvbnRyb2xsZXIubm90aWZ5TWlzc2lsZUxhdW5jaGVkKCk7XG4gICAgICAgICAgICBjb25zdCBtaXNzaWxlID0gbmV3IE1pc3NpbGUodGhpcy5zY2VuZSwgdGhpcy5leHBsb3Npb25Db250cm9sbGVyLCBzb3VyY2UsIHRhcmdldCk7XG4gICAgICAgICAgICB0aGlzLm1pc3NpbGVzLnB1c2gobWlzc2lsZSk7XG4gICAgICAgICAgICByZXR1cm4gbWlzc2lsZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG59XG4iLCJcbmV4cG9ydCBjbGFzcyBTY29yZUNvbnRyb2xsZXIge1xuICAgIHByaXZhdGUgYXN0ZXJpb2RzRGVzdHJveWVkOiBudW1iZXIgPSAwO1xuICAgIHByaXZhdGUgYXN0ZXJpb2RzRXhwbG9kZWQ6IG51bWJlciA9IDA7XG4gICAgcHJpdmF0ZSBtaXNzaWxlczogbnVtYmVyID0gMDtcbiAgICBwcml2YXRlIGFzdGVyaW9kczogbnVtYmVyID0gMDtcbiAgICBwcml2YXRlIGJ1aWxkaW5nczogbnVtYmVyID0gMDtcbiAgICBwcml2YXRlIGJ1aWxkaW5nc0Rlc3Ryb3llZDogbnVtYmVyID0gMDtcblxuICAgIHB1YmxpYyBnZXRTY29yZSgpIHtcbiAgICAgICAgcmV0dXJuIDEwMCAqICh0aGlzLmJ1aWxkaW5ncyAtIHRoaXMuYnVpbGRpbmdzRGVzdHJveWVkKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0QnVpbGRpbmdzTGVmdCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYnVpbGRpbmdzIC0gdGhpcy5idWlsZGluZ3NEZXN0cm95ZWQ7XG4gICAgfVxuXG4gICAgcHVibGljIG5vdGlmeUFzdGVyaW9kRGVzdHJveSgpIHtcbiAgICAgICAgdGhpcy5hc3RlcmlvZHNEZXN0cm95ZWQrKztcbiAgICB9XG5cbiAgICBwdWJsaWMgbm90aWZ5QnVpbGRpbmdEZXN0cm95KCkge1xuICAgICAgICB0aGlzLmJ1aWxkaW5nc0Rlc3Ryb3llZCsrO1xuICAgIH1cblxuICAgIHB1YmxpYyBub3RpZnlBc3RlcmlvZEV4cGxvZGVkKCkge1xuICAgICAgICB0aGlzLmFzdGVyaW9kc0V4cGxvZGVkKys7XG4gICAgfVxuXG4gICAgcHVibGljIG5vdGlmeU1pc3NpbGVMYXVuY2hlZCgpIHtcbiAgICAgICAgdGhpcy5taXNzaWxlcysrO1xuICAgIH1cblxuICAgIHB1YmxpYyBub3RpZnlBc3RlcmlvZERyb3BwZWQoKSB7XG4gICAgICAgIHRoaXMuYXN0ZXJpb2RzKys7XG4gICAgfVxuXG4gICAgcHVibGljIHRvU3RyaW5nKCkge1xuICAgICAgICByZXR1cm4gYERlc3Ryb3llZDogJHt0aGlzLmFzdGVyaW9kc0Rlc3Ryb3llZH1cXG5FeHBsb3Npb25zOiAke3RoaXMuYXN0ZXJpb2RzRXhwbG9kZWR9XFxuTWlzc2lsZXM6ICR7dGhpcy5taXNzaWxlc31cXG5CdWlsZGluZ3M6ICR7dGhpcy5idWlsZGluZ3N9LyR7dGhpcy5idWlsZGluZ3NEZXN0cm95ZWR9YDtcbiAgICB9XG5cbiAgICBhZGRCdWlsZGluZygpIHtcbiAgICAgICAgdGhpcy5idWlsZGluZ3MrKztcbiAgICB9XG5cbiAgICBpc0dhbWVPdmVyKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5idWlsZGluZ3NEZXN0cm95ZWQgPj0gdGhpcy5idWlsZGluZ3M7XG4gICAgfVxufVxuIiwiaW1wb3J0IHtyYzJ9IGZyb20gXCJub2RlLWZvcmdlXCI7XG5cbmV4cG9ydCBjbGFzcyBPbmNlIHtcbiAgICBwcml2YXRlIGRvbmUgPSBmYWxzZTtcbiAgICBwdWJsaWMgdGltZTogbnVtYmVyO1xuXG4gICAgcHVibGljIGNoZWNrKHRpbWU6IG51bWJlciwgY29uZGl0aW9uOiAoKSA9PiBib29sZWFuLCB0YXJnZXQ6ICgpID0+IHZvaWQpIHtcbiAgICAgICAgaWYgKCF0aGlzLmRvbmUgJiYgY29uZGl0aW9uKCkpIHtcbiAgICAgICAgICAgIHRoaXMudGltZSA9IHRpbWU7XG4gICAgICAgICAgICB0YXJnZXQoKTtcbiAgICAgICAgICAgIHRoaXMuZG9uZSA9IHRydWU7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgaXNEb25lKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5kb25lO1xuICAgIH1cblxuICAgIHB1YmxpYyBhZnRlcih0aW1lOiBudW1iZXIsIGRlbHRhOiBudW1iZXIsIHRhcmdldDogKCkgPT4gdm9pZCkge1xuICAgICAgICBpZiAodGhpcy5kb25lICYmIHRpbWUgPiB0aGlzLnRpbWUgKyBkZWx0YSkge1xuICAgICAgICAgICAgdGFyZ2V0KCk7XG4gICAgICAgIH1cbiAgICB9XG59IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbi8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBfX3dlYnBhY2tfbW9kdWxlc19fO1xuXG4iLCJ2YXIgZGVmZXJyZWQgPSBbXTtcbl9fd2VicGFja19yZXF1aXJlX18uTyA9IChyZXN1bHQsIGNodW5rSWRzLCBmbiwgcHJpb3JpdHkpID0+IHtcblx0aWYoY2h1bmtJZHMpIHtcblx0XHRwcmlvcml0eSA9IHByaW9yaXR5IHx8IDA7XG5cdFx0Zm9yKHZhciBpID0gZGVmZXJyZWQubGVuZ3RoOyBpID4gMCAmJiBkZWZlcnJlZFtpIC0gMV1bMl0gPiBwcmlvcml0eTsgaS0tKSBkZWZlcnJlZFtpXSA9IGRlZmVycmVkW2kgLSAxXTtcblx0XHRkZWZlcnJlZFtpXSA9IFtjaHVua0lkcywgZm4sIHByaW9yaXR5XTtcblx0XHRyZXR1cm47XG5cdH1cblx0dmFyIG5vdEZ1bGZpbGxlZCA9IEluZmluaXR5O1xuXHRmb3IgKHZhciBpID0gMDsgaSA8IGRlZmVycmVkLmxlbmd0aDsgaSsrKSB7XG5cdFx0dmFyIFtjaHVua0lkcywgZm4sIHByaW9yaXR5XSA9IGRlZmVycmVkW2ldO1xuXHRcdHZhciBmdWxmaWxsZWQgPSB0cnVlO1xuXHRcdGZvciAodmFyIGogPSAwOyBqIDwgY2h1bmtJZHMubGVuZ3RoOyBqKyspIHtcblx0XHRcdGlmICgocHJpb3JpdHkgJiAxID09PSAwIHx8IG5vdEZ1bGZpbGxlZCA+PSBwcmlvcml0eSkgJiYgT2JqZWN0LmtleXMoX193ZWJwYWNrX3JlcXVpcmVfXy5PKS5ldmVyeSgoa2V5KSA9PiAoX193ZWJwYWNrX3JlcXVpcmVfXy5PW2tleV0oY2h1bmtJZHNbal0pKSkpIHtcblx0XHRcdFx0Y2h1bmtJZHMuc3BsaWNlKGotLSwgMSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRmdWxmaWxsZWQgPSBmYWxzZTtcblx0XHRcdFx0aWYocHJpb3JpdHkgPCBub3RGdWxmaWxsZWQpIG5vdEZ1bGZpbGxlZCA9IHByaW9yaXR5O1xuXHRcdFx0fVxuXHRcdH1cblx0XHRpZihmdWxmaWxsZWQpIHtcblx0XHRcdGRlZmVycmVkLnNwbGljZShpLS0sIDEpXG5cdFx0XHR2YXIgciA9IGZuKCk7XG5cdFx0XHRpZiAociAhPT0gdW5kZWZpbmVkKSByZXN1bHQgPSByO1xuXHRcdH1cblx0fVxuXHRyZXR1cm4gcmVzdWx0O1xufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gbm8gYmFzZVVSSVxuXG4vLyBvYmplY3QgdG8gc3RvcmUgbG9hZGVkIGFuZCBsb2FkaW5nIGNodW5rc1xuLy8gdW5kZWZpbmVkID0gY2h1bmsgbm90IGxvYWRlZCwgbnVsbCA9IGNodW5rIHByZWxvYWRlZC9wcmVmZXRjaGVkXG4vLyBbcmVzb2x2ZSwgcmVqZWN0LCBQcm9taXNlXSA9IGNodW5rIGxvYWRpbmcsIDAgPSBjaHVuayBsb2FkZWRcbnZhciBpbnN0YWxsZWRDaHVua3MgPSB7XG5cdFwiYXBwXCI6IDBcbn07XG5cbi8vIG5vIGNodW5rIG9uIGRlbWFuZCBsb2FkaW5nXG5cbi8vIG5vIHByZWZldGNoaW5nXG5cbi8vIG5vIHByZWxvYWRlZFxuXG4vLyBubyBITVJcblxuLy8gbm8gSE1SIG1hbmlmZXN0XG5cbl9fd2VicGFja19yZXF1aXJlX18uTy5qID0gKGNodW5rSWQpID0+IChpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF0gPT09IDApO1xuXG4vLyBpbnN0YWxsIGEgSlNPTlAgY2FsbGJhY2sgZm9yIGNodW5rIGxvYWRpbmdcbnZhciB3ZWJwYWNrSnNvbnBDYWxsYmFjayA9IChwYXJlbnRDaHVua0xvYWRpbmdGdW5jdGlvbiwgZGF0YSkgPT4ge1xuXHR2YXIgW2NodW5rSWRzLCBtb3JlTW9kdWxlcywgcnVudGltZV0gPSBkYXRhO1xuXHQvLyBhZGQgXCJtb3JlTW9kdWxlc1wiIHRvIHRoZSBtb2R1bGVzIG9iamVjdCxcblx0Ly8gdGhlbiBmbGFnIGFsbCBcImNodW5rSWRzXCIgYXMgbG9hZGVkIGFuZCBmaXJlIGNhbGxiYWNrXG5cdHZhciBtb2R1bGVJZCwgY2h1bmtJZCwgaSA9IDA7XG5cdGlmKGNodW5rSWRzLnNvbWUoKGlkKSA9PiAoaW5zdGFsbGVkQ2h1bmtzW2lkXSAhPT0gMCkpKSB7XG5cdFx0Zm9yKG1vZHVsZUlkIGluIG1vcmVNb2R1bGVzKSB7XG5cdFx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8obW9yZU1vZHVsZXMsIG1vZHVsZUlkKSkge1xuXHRcdFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLm1bbW9kdWxlSWRdID0gbW9yZU1vZHVsZXNbbW9kdWxlSWRdO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRpZihydW50aW1lKSB2YXIgcmVzdWx0ID0gcnVudGltZShfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblx0fVxuXHRpZihwYXJlbnRDaHVua0xvYWRpbmdGdW5jdGlvbikgcGFyZW50Q2h1bmtMb2FkaW5nRnVuY3Rpb24oZGF0YSk7XG5cdGZvcig7aSA8IGNodW5rSWRzLmxlbmd0aDsgaSsrKSB7XG5cdFx0Y2h1bmtJZCA9IGNodW5rSWRzW2ldO1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhpbnN0YWxsZWRDaHVua3MsIGNodW5rSWQpICYmIGluc3RhbGxlZENodW5rc1tjaHVua0lkXSkge1xuXHRcdFx0aW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdWzBdKCk7XG5cdFx0fVxuXHRcdGluc3RhbGxlZENodW5rc1tjaHVua0lkXSA9IDA7XG5cdH1cblx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18uTyhyZXN1bHQpO1xufVxuXG52YXIgY2h1bmtMb2FkaW5nR2xvYmFsID0gc2VsZltcIndlYnBhY2tDaHVua2FybWFnZWRkb25fcGhhc2VyXCJdID0gc2VsZltcIndlYnBhY2tDaHVua2FybWFnZWRkb25fcGhhc2VyXCJdIHx8IFtdO1xuY2h1bmtMb2FkaW5nR2xvYmFsLmZvckVhY2god2VicGFja0pzb25wQ2FsbGJhY2suYmluZChudWxsLCAwKSk7XG5jaHVua0xvYWRpbmdHbG9iYWwucHVzaCA9IHdlYnBhY2tKc29ucENhbGxiYWNrLmJpbmQobnVsbCwgY2h1bmtMb2FkaW5nR2xvYmFsLnB1c2guYmluZChjaHVua0xvYWRpbmdHbG9iYWwpKTsiLCIiLCIvLyBzdGFydHVwXG4vLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbi8vIFRoaXMgZW50cnkgbW9kdWxlIGRlcGVuZHMgb24gb3RoZXIgbG9hZGVkIGNodW5rcyBhbmQgZXhlY3V0aW9uIG5lZWQgdG8gYmUgZGVsYXllZFxudmFyIF9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fLk8odW5kZWZpbmVkLCBbXCJ2ZW5kb3JzXCJdLCAoKSA9PiAoX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vc3JjL21haW4udHNcIikpKVxuX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18uTyhfX3dlYnBhY2tfZXhwb3J0c19fKTtcbiIsIiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==