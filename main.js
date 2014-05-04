// Generated by CoffeeScript 1.6.3
(function() {
  var BULLET_SHOOTER_RATIO, DEFAULT_USER_ACCELERATION, ENEMIES_PROPABILITY, MAX_ENEMY_RADIUS, MAX_ENEMY_SPEED, MAX_USER_SPEED, MINIMAL_VIABLE_RADIUS, MIN_ENEMY_RADIUS, MIN_ENEMY_SPEED, NUMBER_OF_ENEMIES, PLAYER_START_SIZE, PROPORTION_MAX_NEW_ENEMY_SIZE, SHOOTER_SHOOT_LOSS, c, calcCircleBox, circle, clamp, dlog, doTheCirclesColide, drawCircle, drawCircleBox, drawCircleExplosion, init, isCircleViable, joinCircles, limitPlayerVelocity, makeBubble, makeColorString, makeEnemy, makePlayer, maxEnemySize, maxEnemyVelocity, moveBubble, moveBubbleWithinBounds, movePlayer, randomColor, randomInt, randomNumber, randomPlusOrMinusOne, rc, reverse_circle, spawnEnemy, spawnPlayer, zeroTo255, _DEBUG_;

  _DEBUG_ = true;

  ENEMIES_PROPABILITY = 0.05;

  NUMBER_OF_ENEMIES = 100;

  MIN_ENEMY_SPEED = 0.5;

  MAX_ENEMY_SPEED = 1;

  PLAYER_START_SIZE = 20;

  DEFAULT_USER_ACCELERATION = 0.1;

  MAX_USER_SPEED = 4;

  MINIMAL_VIABLE_RADIUS = 1;

  MAX_ENEMY_RADIUS = 450;

  MIN_ENEMY_RADIUS = 1;

  PROPORTION_MAX_NEW_ENEMY_SIZE = 12.0;

  BULLET_SHOOTER_RATIO = 0.2;

  SHOOTER_SHOOT_LOSS = 0.01;

  dlog = function(msg) {
    if (_DEBUG_) {
      console.log(msg);
    }
    return msg;
  };

  randomInt = function(from, to) {
    return Math.floor(Math.random() * to) + from;
  };

  randomNumber = function(from, to) {
    return (Math.random() * to) + from;
  };

  randomPlusOrMinusOne = function() {
    if (Math.random() < 0.5) {
      return -1;
    } else {
      return 1;
    }
  };

  clamp = function(min, max) {
    return Math.min(Math.max(this, min), max);
  };

  zeroTo255 = function(n) {
    while (n == null) {
      return randomInt(0, 255);
    }
    if (n < 0 || n > 255) {
      return randomInt(0, 255);
    }
    return n;
  };

  randomColor = function(r, g, b) {
    return [zeroTo255(r), zeroTo255(g), zeroTo255(b)];
  };

  makeColorString = function(color_rgb) {
    var b, g, r;
    r = color_rgb[0], g = color_rgb[1], b = color_rgb[2];
    return "rgb(" + r + "," + g + "," + b + ")";
  };

  c = circle = function(x, y, r) {
    return [x, y, r];
  };

  rc = reverse_circle = function(a) {
    var r, x, y;
    return x = a[0], y = a[1], r = a[2], a;
  };

  calcCircleBox = function(circle) {
    var r, x, y, _ref;
    _ref = rc(circe), x = _ref[0], y = _ref[1], r = _ref[2];
    return [x - r, y - r, r * 2];
  };

  doTheCirclesColide = function(circle_0, circle_1) {};

  isCircleViable = function(circle) {};

  joinCircles = function(circle_0, circle_1) {};

  maxEnemySize = function(player) {
    return Math.floor(Math.sqrt(player.circle[2]) * PROPORTION_MAX_NEW_ENEMY_SIZE);
  };

  maxEnemyVelocity = function(player) {
    return Math.max.apply(Math, [player.vx, player.vy]);
  };

  moveBubble = function(bubble) {
    bubble.circle[0] = bubble.circle[0] + bubble.vx;
    bubble.circle[1] = bubble.circle[1] + bubble.vy;
    return bubble;
  };

  limitPlayerVelocity = function(v) {
    if (Math.abs(v) > MAX_USER_SPEED) {
      return MAX_USER_SPEED * (v / Math.abs(v));
    } else {
      return v;
    }
  };

  movePlayer = function(active_commands, w, h, p) {
    var command, _fn, _i, _len;
    _fn = function(command) {
      if (command === 'up') {
        p.vy = p.vy - DEFAULT_USER_ACCELERATION;
        return p.vy = limitPlayerVelocity(p.vy);
      } else if (command === 'down') {
        p.vy = p.vy + DEFAULT_USER_ACCELERATION;
        return p.vy = limitPlayerVelocity(p.vy);
      } else if (command === 'left') {
        p.vx = p.vx - DEFAULT_USER_ACCELERATION;
        return p.vx = limitPlayerVelocity(p.vx);
      } else if (command === 'right') {
        p.vx = p.vx + DEFAULT_USER_ACCELERATION;
        return p.vx = limitPlayerVelocity(p.vx);
      } else {
        return dlog('unkown command: ' + c);
      }
    };
    for (_i = 0, _len = active_commands.length; _i < _len; _i++) {
      command = active_commands[_i];
      _fn(command);
    }
    return moveBubbleWithinBounds(w, h, p);
  };

  moveBubbleWithinBounds = function(w, h, bubble) {
    var r, x, y, _ref;
    _ref = bubble.circle, x = _ref[0], y = _ref[1], r = _ref[2];
    if (y < (r * -1)) {
      bubble.circle[1] = h + r;
      return moveBubble(bubble);
    } else if (y > (h + r)) {
      bubble.circle[1] = r * -1;
      return moveBubble(bubble);
    } else if (x < (r * -1)) {
      bubble.circle[0] = w + r;
      return moveBubble(bubble);
    } else if (x > w + r) {
      bubble.circle[0] = r * -1;
      return moveBubble(bubble);
    } else {
      return moveBubble(bubble);
    }
  };

  makeBubble = function(x, y, r, vx, vy, rgb) {
    var b;
    if (x == null) {
      x = 100;
    }
    if (y == null) {
      y = 100;
    }
    if (r == null) {
      r = 100;
    }
    if (vx == null) {
      vx = 0;
    }
    if (vy == null) {
      vy = 0;
    }
    b = {};
    b.circle = c(x, y, r);
    b.fillColor = rgb != null ? rgb : randomColor();
    b.alive = true;
    b.vx = vx;
    b.vy = vy;
    return b;
  };

  makeEnemy = function(x, y, r, vx, vy, rgb) {
    if (r > MAX_ENEMY_RADIUS) {
      r = MAX_ENEMY_RADIUS;
    }
    return makeBubble(x, y, r, vx, vy, rgb);
  };

  makePlayer = function(x, y, r) {
    return makeBubble(x, y, r, 0, 0, [255, 255, 0]);
  };

  spawnPlayer = function(w, h) {
    return makePlayer(Math.floor(w / 2), Math.floor(h / 2), PLAYER_START_SIZE);
  };

  spawnEnemy = function(world_width, world_height, min_r, max_r, min_v, max_v) {
    var r, vx, vy, where, x, y;
    if (min_r == null) {
      min_r = 15;
    }
    if (max_r == null) {
      max_r = 75;
    }
    if (min_v == null) {
      min_v = MIN_ENEMY_SPEED;
    }
    if (max_v == null) {
      max_v = MAX_ENEMY_SPEED;
    }
    r = randomInt(min_r, max_r);
    vx = randomNumber(min_v, max_v);
    vy = randomNumber(min_v, max_v);
    where = Math.random();
    switch (false) {
      case !(where < 0.25):
        x = Math.random() * world_width;
        y = r * -1;
        vx = vx * randomPlusOrMinusOne();
        break;
      case !(where < 0.5):
        x = Math.random() * world_width;
        y = world_height + r;
        vy = vy * -1;
        vx = vx * randomPlusOrMinusOne();
        break;
      case !(where < 0.75):
        x = r * -1;
        y = Math.random() * world_height;
        vy = vy * randomPlusOrMinusOne();
        vx = vx;
        break;
      default:
        x = world.width + r;
        y = Math.random() * world_height;
        vy = vy * randomPlusOrMinusOne();
        vx = vx * -1;
    }
    return makeEnemy(x, y, r, vx, vy);
  };

  drawCircleBox = function(circle, ctx) {};

  drawCircle = function(ctx, circle, fill, border) {
    var gradient, r, x, y, _ref;
    if (fill == null) {
      fill = randomColor();
    }
    if (border == null) {
      border = randomColor();
    }
    _ref = rc(circle), x = _ref[0], y = _ref[1], r = _ref[2];
    ctx.globalCompositeOperation = "lighter";
    ctx.lineWidth = 2;
    gradient = ctx.createRadialGradient(x, y, 0, x, y, r);
    gradient.addColorStop(0.4, makeColorString(fill));
    gradient.addColorStop(1, "black");
    ctx.fillStyle = gradient;
    ctx.strokeStyle = makeColorString(border);
    ctx.beginPath();
    ctx.arc((0.5 + x) | 0, (0.5 + y) | 0, (0.5 + r) | 0, 0, 2 * Math.PI);
    return ctx.fill();
  };

  drawCircleExplosion = function(circle, options, board_cxt) {};

  init = function(w) {
    var currently_active_commands, event2Command, game, getActiveCommands, removeActiveCommand, setActiveCommand, world_height, world_width;
    dlog('in init');
    world_width = w.width = window.innerWidth;
    world_height = w.height = window.innerHeight;
    document.addEventListener('keydown', function(event) {
      var command;
      event.preventDefault();
      command = event2Command(event);
      if (command) {
        return setActiveCommand(command);
      }
    });
    document.addEventListener('keyup', function(event) {
      var command;
      event.preventDefault();
      command = event2Command(event);
      if (command) {
        return removeActiveCommand(command);
      }
    });
    currently_active_commands = [];
    event2Command = function(event) {
      if (event.keyCode === 40) {
        return 'down';
      }
      if (event.keyCode === 38) {
        return 'up';
      }
      if (event.keyCode === 37) {
        return 'left';
      }
      if (event.keyCode === 39) {
        return 'right';
      }
      return false;
    };
    getActiveCommands = function() {
      return currently_active_commands;
    };
    setActiveCommand = function(command) {
      if (currently_active_commands.indexOf(command) === -1) {
        currently_active_commands.push(command);
      }
      return dlog(currently_active_commands);
    };
    removeActiveCommand = function(command) {
      var co, temp, _fn, _i, _len;
      temp = [];
      _fn = function(co) {
        if (co !== command) {
          return temp.push(co);
        }
      };
      for (_i = 0, _len = currently_active_commands.length; _i < _len; _i++) {
        co = currently_active_commands[_i];
        _fn(co);
      }
      currently_active_commands = temp;
      return dlog(currently_active_commands);
    };
    game = function(w, max_nr_of_enemies, chance_of_new_enemy, min_enemy_speed, max_enemy_speed, number_of_active_players) {
      var cache_canvas, cctx, draw, enemies, players, run, update, wctx;
      if (number_of_active_players == null) {
        number_of_active_players = 1;
      }
      wctx = w.getContext('2d');
      cache_canvas = document.createElement('canvas');
      cache_canvas.width = world_width;
      cache_canvas.height = world_height;
      cctx = cache_canvas.getContext('2d');
      dlog('in game');
      enemies = [];
      players = [];
      update = function() {
        var all_bubbles, e, p, _fn, _fn1, _i, _j, _len, _len1;
        if (players.length < number_of_active_players) {
          players.push(spawnPlayer(world_width, world_height));
        }
        if (enemies.length < max_nr_of_enemies && Math.random() < chance_of_new_enemy) {
          enemies.push(spawnEnemy(world_width, world_height, MIN_ENEMY_RADIUS, maxEnemySize(players[0]), MIN_ENEMY_SPEED, maxEnemyVelocity(players[0])));
        }
        _fn = function(e) {
          return moveBubbleWithinBounds(world_width, world_height, e);
        };
        for (_i = 0, _len = enemies.length; _i < _len; _i++) {
          e = enemies[_i];
          _fn(e);
        }
        _fn1 = function(p) {
          return movePlayer(getActiveCommands(), world_width, world_height, p);
        };
        for (_j = 0, _len1 = players.length; _j < _len1; _j++) {
          p = players[_j];
          _fn1(p);
        }
        all_bubbles = players.concat(enemies);
        return all_bubbles;
      };
      draw = function(bubbles) {
        var b, _i, _len;
        cctx.clearRect(0, 0, world_width, world_height);
        cctx.fillStyle = "rgba(0, 0, 0, 0.3)";
        cctx.fillRect(0, 0, world_width, world_height);
        for (_i = 0, _len = bubbles.length; _i < _len; _i++) {
          b = bubbles[_i];
          drawCircle(cctx, b.circle, b.fillColor, [0, 0, 0]);
        }
        return wctx.drawImage(cache_canvas, 0, 0);
      };
      run = function() {
        var bubbles;
        window.stats.begin();
        window.requestAnimationFrame(run);
        bubbles = update();
        draw(bubbles);
        return window.stats.end();
      };
      return run();
    };
    return game(w, NUMBER_OF_ENEMIES, ENEMIES_PROPABILITY);
  };

  init(document.getElementById('world'));

}).call(this);
