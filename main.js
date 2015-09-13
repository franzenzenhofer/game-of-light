// Generated by CoffeeScript 1.10.0
(function() {
  var BULLET_SHOOTER_RATIO, DEFAULT_NEGATIVE_CIRCLE_JOIN_RATE, DEFAULT_USER_ACCELERATION, DRAW_BIGGER_RADIUS_FACTOR, ENEMIES_PROPABILITY, FULL_SCREEN, MAX_ENEMY_RADIUS, MAX_ENEMY_SPEED, MAX_RADIUS, MAX_USER_SPEED, MINIMAL_VIABLE_RADIUS, MIN_ENEMY_RADIUS, MIN_ENEMY_SPEED, NUMBER_OF_ENEMIES, PLAYER_START_SIZE, PROPORTION_MAX_NEW_ENEMY_SIZE, RATIO_PREVAILANCE_WITH_MERGE, SHOOTER_SHOOT_LOSS, _DEBUG_, _NODE_WEBKIT_CONTEXT_, bubbleCollision, c, calcCircleBox, circle, circleCollision, clamp, clampRgb, colorMix, colorMixHsl, colorMixRgbLikeHsv, delay, dlog, drawCircle, drawCircleBox, drawCircleExplosion, event2Command, getA, getADifference, getADifferenceMinusRadius, getRadiusByArea, getRidOfTheDeadAndReturnTheLiving, init, isCircleRadiusViable, limitPlayerVelocity, makeBubble, makeBullet, makeColorString, makeEnemy, makeHslColorString, makePlayer, maxEnemySize, maxEnemyVelocity, moveBubble, moveBubbleWithinBounds, randomColor, randomColorHsl, randomInt, randomIntDefault, randomNumber, randomPlusOrMinusOne, randomPrettyColor, randomPrettyHslColor, rc, rectangleCollision, reverse_circle, setWorldWidthAndHeight, spawnEnemy, spawnPlayer, zeroTo255;

  _DEBUG_ = false;

  ENEMIES_PROPABILITY = 0.05;

  NUMBER_OF_ENEMIES = 100;

  MIN_ENEMY_SPEED = 0.5;

  MAX_ENEMY_SPEED = 1;

  PLAYER_START_SIZE = 20;

  DEFAULT_USER_ACCELERATION = 0.1;

  MAX_USER_SPEED = 4;

  DEFAULT_NEGATIVE_CIRCLE_JOIN_RATE = 0.5;

  RATIO_PREVAILANCE_WITH_MERGE = 0.8;

  MINIMAL_VIABLE_RADIUS = 1;

  MAX_RADIUS = 500;

  MAX_ENEMY_RADIUS = 450;

  MIN_ENEMY_RADIUS = 1;

  PROPORTION_MAX_NEW_ENEMY_SIZE = 8.0;

  BULLET_SHOOTER_RATIO = 0.2;

  SHOOTER_SHOOT_LOSS = 0.01;

  DRAW_BIGGER_RADIUS_FACTOR = 1.9;

  _NODE_WEBKIT_CONTEXT_ = false;

  if (typeof require !== "undefined" && require !== null) {
    _NODE_WEBKIT_CONTEXT_ = true;
  }

  FULL_SCREEN = false;

  dlog = function(msg) {
    if (_DEBUG_) {
      console.log(msg);
    }
    return msg;
  };

  delay = function(ms, func) {
    return setTimeout(func, ms);
  };

  randomInt = function(from, to) {
    return Math.floor(Math.random() * to) + from;
  };

  randomIntDefault = function(from, to, default_value) {
    if (default_value != null) {
      pareseInt(default_value);
    }
    return randomInt(from, to);
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

  clamp = function(v, min, max) {
    return Math.min(Math.max(v, min), max);
  };

  clampRgb = function(v) {
    return parseInt(clamp(v, 0, 255));
  };

  zeroTo255 = function(n) {
    while (n == null) {
      return randomInt(0, 255);
    }
    if (n < 0 || n > 255) {
      return randomInt(0, 255);
    }
    return parseInt(n);
  };

  randomColor = function(r, g, b) {
    return [zeroTo255(r), zeroTo255(g), zeroTo255(b)];
  };

  randomPrettyColor = function(r, g, b) {
    var c;
    c = Please.make_color({
      format: 'rgb',
      saturation: randomInt(80, 100) / 100,
      value: randomInt(50, 100) / 100
    });
    return [c[0].r, c[0].g, c[0].b];
  };

  randomColorHsl = function(h, s, l) {
    return [randomIntDefault(0, 360, h), randomIntDefault(0, 100, l), randomIntDefault(0, 100, l)];
  };

  randomPrettyHslColor = function(h) {
    var c;
    c = Please.make_color({
      format: 'hsl',
      saturation: 1.0
    });
    return [c[0].h, c[0].s, c[0].l];
  };

  makeColorString = function(color_rgb_array, opacity) {
    var b, g, r;
    if (opacity == null) {
      opacity = 1;
    }
    r = color_rgb_array[0], g = color_rgb_array[1], b = color_rgb_array[2];
    return "rgba(" + r + "," + g + "," + b + ", " + opacity + ")";
  };

  makeHslColorString = function(color_hsl_array) {
    var h, l, s;
    h = color_hsl_array[0], s = color_hsl_array[1], l = color_hsl_array[2];
    return "hsl(" + h + "," + s + "%," + l + "%)";
  };

  c = circle = function(x, y, r) {
    return [x, y, r];
  };

  rc = reverse_circle = function(a) {
    var r, x, y;
    return x = a[0], y = a[1], r = a[2], a;
  };

  calcCircleBox = function(circle) {
    var r, ref, x, y;
    ref = rc(circe), x = ref[0], y = ref[1], r = ref[2];
    return [x - r, y - r, r * 2];
  };

  isCircleRadiusViable = function(radius, minradius) {
    if (minradius == null) {
      minradius = MINIMAL_VIABLE_RADIUS;
    }
    if (radius < minradius) {
      return false;
    }
    return true;
  };

  maxEnemySize = function(player) {
    return Math.floor(Math.sqrt(player.circle[2]) * PROPORTION_MAX_NEW_ENEMY_SIZE);
  };

  maxEnemyVelocity = function(player) {
    return Math.max.apply(Math, [player.vx, player.vy]);
  };

  moveBubble = function(bubble) {
    bubble.circle[0] = bubble.circle[0] + bubble.vx * (1 - bubble.circle[2] / MAX_RADIUS);
    bubble.circle[1] = bubble.circle[1] + bubble.vy * (1 - bubble.circle[2] / MAX_RADIUS);
    return bubble;
  };

  limitPlayerVelocity = function(v) {
    if (Math.abs(v) > MAX_USER_SPEED) {
      return MAX_USER_SPEED * (v / Math.abs(v));
    } else {
      return v;
    }
  };

  moveBubbleWithinBounds = function(w, h, bubble) {
    var r, r_exp, ref, x, y;
    ref = bubble.circle, x = ref[0], y = ref[1], r = ref[2];
    r_exp = r * DRAW_BIGGER_RADIUS_FACTOR;
    if (y < (r_exp * -1)) {
      bubble.circle[1] = h + r_exp;
      return moveBubble(bubble);
    } else if (y > (h + r_exp)) {
      bubble.circle[1] = r_exp * -1;
      return moveBubble(bubble);
    } else if (x < (r_exp * -1)) {
      bubble.circle[0] = w + r_exp;
      return moveBubble(bubble);
    } else if (x > w + r_exp) {
      bubble.circle[0] = r_exp * -1;
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
    b.fillColor = rgb != null ? rgb : randomPrettyColor();
    b.opacity = 1;
    b.strokeColor = [0, 0, 255];
    b.alive = true;
    b.explode = false;
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

  makeBullet = function(x, y, r, vx, vy, rgb) {
    return makeBubble(x, y, r, vx, vy, rgb);
  };

  spawnEnemy = function(world_width, world_height, min_r, max_r, min_v, max_v) {
    var r, r_exp, vx, vy, where, x, y;
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
    r_exp = r * DRAW_BIGGER_RADIUS_FACTOR;
    vx = randomNumber(min_v, max_v);
    vy = randomNumber(min_v, max_v);
    where = Math.random();
    switch (false) {
      case !(where < 0.25):
        x = Math.random() * world_width;
        y = r_exp * -1;
        vx = vx * randomPlusOrMinusOne();
        break;
      case !(where < 0.5):
        x = Math.random() * world_width;
        y = world_height + r_exp;
        vy = vy * -1;
        vx = vx * randomPlusOrMinusOne();
        break;
      case !(where < 0.75):
        x = r_exp * -1;
        y = Math.random() * world_height;
        vy = vy * randomPlusOrMinusOne();
        vx = vx;
        break;
      default:
        x = world.width + r_exp;
        y = Math.random() * world_height;
        vy = vy * randomPlusOrMinusOne();
        vx = vx * -1;
    }
    return makeEnemy(x, y, r, vx, vy);
  };

  rectangleCollision = function(a, b) {
    var a_width, a_x, a_y, b_width, b_x, b_y;
    a_x = a[0], a_y = a[1], a_width = a[2];
    b_x = b[0], b_y = b[1], b_width = b[2];
    return a_x < b_x + b_width && a_x + a_width > b_x && a_y < b_y + b_width && a_y + a_width > b_y;
  };

  circleCollision = function(c1, c2) {
    var a, b, c1_r, c1_x, c1_y, c2_r, c2_x, c2_y, d, ref, ref1;
    ref = rc(c1), c1_x = ref[0], c1_y = ref[1], c1_r = ref[2];
    ref1 = rc(c2), c2_x = ref1[0], c2_y = ref1[1], c2_r = ref1[2];
    a = c2_x - c1_x;
    b = c2_y - c1_y;
    d = Math.sqrt(a * a + b * b);
    if ((d - c1_r - c2_r) < 0) {
      return true;
    }
    return false;
  };

  bubbleCollision = function(b1, b2) {
    var c1_r, c1_x, c1_y, c2_r, c2_x, c2_y, ref, ref1;
    ref = rc(b1.circle), c1_x = ref[0], c1_y = ref[1], c1_r = ref[2];
    ref1 = rc(b2.circle), c2_x = ref1[0], c2_y = ref1[1], c2_r = ref1[2];
    if (rectangleCollision([c1_x - (c1_r / 2), c1_y - (c1_y / 2), c1_r * 2], [c2_x - (c2_r / 2), c2_y - (c2_y / 2), c2_r * 2])) {
      return circleCollision(b1.circle, b2.circle);
    }
    return false;
  };

  getA = function(circle) {
    return circle[2] * circle[2] * Math.PI;
  };

  getADifference = function(c1, c2) {
    return Math.abs(getA(c1) - getA(c2));
  };

  getRadiusByArea = function(a) {
    return Math.sqrt(a / Math.PI);
  };

  getADifferenceMinusRadius = function(circle, minus) {
    var c2;
    c2 = [circle[0], circle[1], circle[2] - minus];
    return getADifference(circle, c2);
  };

  colorMixHsl = function(hsl1, hsl2, ratio) {
    var h1, h2, l1, l2, s1, s2;
    h1 = hsl1[0], s1 = hsl1[1], l1 = hsl1[2];
    h2 = hsl2[0], s2 = hsl2[1], l2 = hsl2[2];
    return [(h1 + (parseInt(h2 * ratio))) % 360, (s1 + s2) / 2, (l1 + l2) / 2];
  };

  colorMixRgbLikeHsv = function(rgb1, rgb2, percentage) {
    var b1, b2, g1, g2, hsv1, hsv2, r1, r2, rgb_new;
    r1 = rgb1[0], g1 = rgb1[1], b1 = rgb1[2];
    r2 = rgb2[0], g2 = rgb2[1], b2 = rgb2[2];
    hsv1 = Please.RGB_to_HSV({
      r: r1,
      g: g1,
      b: b1
    });
    hsv2 = Please.RGB_to_HSV({
      r: r2,
      g: g2,
      b: b2
    });
    hsv1.h = (hsv1.h + (hsv2.h * percentage)) % 360;
    rgb_new = Please.HSV_to_RGB(hsv1);
    return [Math.floor(rgb_new.r), Math.floor(rgb_new.g), Math.floor(rgb_new.b)];
  };

  colorMix = function(rgb1, rgb2, percentage) {
    var b1, b2, b_diff, b_faktor, b_n, g1, g2, g_diff, g_faktor, g_n, r1, r2, r_diff, r_faktor, r_n;
    r1 = rgb1[0], g1 = rgb1[1], b1 = rgb1[2];
    r2 = rgb2[0], g2 = rgb2[1], b2 = rgb2[2];
    if (r1 + g1 + b1 > 255) {
      r_faktor = 1;
      if (r1 < r2) {
        r_faktor = r_faktor * -1;
      }
      g_faktor = 1;
      if (g1 < g2) {
        g_faktor = g_faktor * -1;
      }
      b_faktor = 1;
      if (b1 < b2) {
        b_faktor = b_faktor * -1;
      }
    } else {
      r_faktor = g_faktor = b_faktor = 1;
    }
    r_diff = Math.abs(r1 - r2);
    g_diff = Math.abs(g1 - g2);
    b_diff = Math.abs(b1 - b2);
    r_n = clampRgb(r1 + (r_diff * percentage * r_faktor));
    g_n = clampRgb(g1 + (g_diff * percentage * g_faktor));
    b_n = clampRgb(b1 + (b_diff * percentage * b_faktor));
    return [r_n, g_n, b_n];
  };

  getRidOfTheDeadAndReturnTheLiving = function(bubbles) {
    var b, j, len, temp;
    temp = [];
    for (j = 0, len = bubbles.length; j < len; j++) {
      b = bubbles[j];
      if (b.alive !== false) {
        temp.push(b);
      }
    }
    return temp;
  };

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
    if (event.keyCode === 32) {
      return 'fire';
    }
    return false;
  };

  drawCircleBox = function(circle, ctx) {};

  drawCircle = function(ctx, circle, fill, border, opacity) {
    var gradient, r, ref, x, y;
    if (fill == null) {
      fill = randomColor();
    }
    if (border == null) {
      border = [0, 0, 255];
    }
    if (opacity == null) {
      opacity = 1;
    }
    ref = rc(circle), x = ref[0], y = ref[1], r = ref[2];
    if (r <= 0) {
      return false;
    }
    ctx.globalCompositeOperation = "lighter";
    ctx.lineWidth = 2;
    gradient = ctx.createRadialGradient(x, y, 0, x, y, r * DRAW_BIGGER_RADIUS_FACTOR);
    gradient.addColorStop(0, makeColorString(fill, opacity));
    gradient.addColorStop(1 / DRAW_BIGGER_RADIUS_FACTOR, makeColorString(fill, opacity));
    gradient.addColorStop(1, 'black');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc((0.5 + x) | 0, (0.5 + y) | 0, (0.5 + r * DRAW_BIGGER_RADIUS_FACTOR) | 0, 0, 2 * Math.PI);
    return ctx.fill();
  };

  drawCircleExplosion = function(circle, options, board_cxt) {};

  setWorldWidthAndHeight = function(w, full_screen) {
    var dom_window, ngui, nwin;
    if (full_screen == null) {
      full_screen = FULL_SCREEN;
    }
    dom_window = window;
    if (_NODE_WEBKIT_CONTEXT_ === true) {
      ngui = require('nw.gui');
      nwin = ngui.Window.get();
      dom_window = nwin.window;
      if (full_screen) {
        nwin.show();
        nwin.maximize();
        w.width = nwin.width - nwin.x;
        w.height = nwin.height - nwin.y;
      } else {
        w.width = dom_window.innerWidth;
        w.height = dom_window.innerHeight;
      }
    } else {
      w.width = dom_window.innerWidth;
      w.height = dom_window.innerHeight;
    }
    return w;
  };

  init = function(w, full_screen) {
    var currently_active_commands, game, getActiveCommands, joystick, keydown, keyup, loop_id, removeActiveCommand, removeAllActiveCommand, setActiveCommand;
    if (w == null) {
      w = document.getElementById('world');
    }
    if (full_screen == null) {
      full_screen = FULL_SCREEN;
    }
    loop_id = void 0;
    currently_active_commands = [];
    getActiveCommands = function() {
      return currently_active_commands;
    };
    setActiveCommand = function(command) {
      dlog('set active command');
      dlog(command);
      if (currently_active_commands.indexOf(command) === -1) {
        currently_active_commands.push(command);
      }
      dlog('set currently active commands');
      return dlog(currently_active_commands);
    };
    removeAllActiveCommand = function() {
      return currently_active_commands = [];
    };
    removeActiveCommand = function(command) {
      var co, fn, j, len, temp;
      temp = [];
      fn = function(co) {
        if (co !== command) {
          return temp.push(co);
        }
      };
      for (j = 0, len = currently_active_commands.length; j < len; j++) {
        co = currently_active_commands[j];
        fn(co);
      }
      currently_active_commands = temp;
      dlog('remove currently active commands');
      return dlog(currently_active_commands);
    };
    joystick = nipplejs.create();
    joystick.on('move', function(evt, data) {
      var command, fake_event, ref;
      dlog(data);
      setActiveCommand(data);
      return true;
      if (data.force < 1) {
        removeAllActiveCommand();
        return setActiveCommand('slowdown');
      } else {
        command = data != null ? (ref = data.direction) != null ? ref.angle : void 0 : void 0;
        dlog('!!!!' + command);
        fake_event = {};
        removeAllActiveCommand();
        if (command === 'up') {
          fake_event.keyCode = 38;
          return keydown(fake_event);
        } else if (command === 'down') {
          fake_event.keyCode = 40;
          return keydown(fake_event);
        } else if (command === 'left') {
          fake_event.keyCode = 37;
          return keydown(fake_event);
        } else if (command === 'right') {
          fake_event.keyCode = 39;
          return keydown(fake_event);
        }
      }
    });
    joystick.on('end', function(evt, data) {
      return removeAllActiveCommand();
    });
    keydown = function(event) {
      var command;
      command = event2Command(event);
      if (command) {
        return setActiveCommand(command);
      }
    };
    keyup = function(event) {
      var command;
      command = event2Command(event);
      if (command) {
        return removeActiveCommand(command);
      }
    };
    document.addEventListener('keydown', function(event) {
      event.preventDefault();
      return keydown(event);
    });
    document.addEventListener('keyup', function(event) {
      event.preventDefault();
      return keyup(event);
    });
    window.onresize = function() {
      window.cancelAnimationFrame(loop_id);
      return game(w, true);
    };
    game = function(w, full_screen, max_nr_of_enemies, chance_of_new_enemy, min_enemy_speed, max_enemy_speed, number_of_active_players) {
      var _JUST_FIRED_A_BULLET_, bullets, cache_canvas, cctx, draw, enemies, explodeBubble, explosions, fireBulletBy, joinBubbles, movePlayer, players, run, update, wctx, world_height, world_width;
      if (full_screen == null) {
        full_screen = FULL_SCREEN;
      }
      if (max_nr_of_enemies == null) {
        max_nr_of_enemies = NUMBER_OF_ENEMIES;
      }
      if (chance_of_new_enemy == null) {
        chance_of_new_enemy = ENEMIES_PROPABILITY;
      }
      if (number_of_active_players == null) {
        number_of_active_players = 1;
      }
      w = setWorldWidthAndHeight(w);
      world_width = w.width;
      world_height = w.height;
      wctx = w.getContext('2d');
      cache_canvas = document.createElement('canvas');
      cache_canvas.width = world_width;
      cache_canvas.height = world_height;
      cctx = cache_canvas.getContext('2d');
      players = [];
      enemies = [];
      explosions = [];
      bullets = [];
      _JUST_FIRED_A_BULLET_ = false;
      explodeBubble = function(b) {
        var r, ref, x, y;
        console.log(b);
        ref = rc(b.circle), x = ref[0], y = ref[1], r = ref[2];
        explosions.push(makeBullet(x, y, r, 0, 0, b.fillColor));
        return b.alive = false;
      };
      joinBubbles = function(b1, b2) {
        var c1_r, c1_x, c1_y, c2_r, c2_x, c2_y, looser, looser_area_difference, percentage_of_area, ref, ref1, winner, winner_area;
        ref = rc(b1.circle), c1_x = ref[0], c1_y = ref[1], c1_r = ref[2];
        ref1 = rc(b2.circle), c2_x = ref1[0], c2_y = ref1[1], c2_r = ref1[2];
        if (c1_r > c2_r) {
          winner = b1;
          looser = b2;
        } else if (c1_r < c2_r) {
          winner = b2;
          looser = b1;
        } else {
          if (Math.random() <= 0.5) {
            explodeBubble(b1);
          } else {
            explodeBubble(b2);
          }
          return true;
        }
        winner.strokeColor = [0, 255, 0];
        looser.strokeColor = [255, 0, 0];
        if (winner && looser) {
          looser_area_difference = getADifferenceMinusRadius(looser.circle, DEFAULT_NEGATIVE_CIRCLE_JOIN_RATE);
          looser.circle[2] = looser.circle[2] - DEFAULT_NEGATIVE_CIRCLE_JOIN_RATE;
          winner_area = getA(winner.circle);
          percentage_of_area = looser_area_difference / winner_area;
          colorMixRgbLikeHsv;
          winner.fillColor = colorMixRgbLikeHsv(winner.fillColor, looser.fillColor, percentage_of_area);
          winner.circle[2] = getRadiusByArea(winner_area + (looser_area_difference * RATIO_PREVAILANCE_WITH_MERGE));
          if (looser.circle[2] < MINIMAL_VIABLE_RADIUS) {
            looser.alive = false;
          }
        }
        return [b1, b2];
      };
      movePlayer = function(active_commands, w, h, p) {
        var command, fn, j, len;
        fn = function(command) {
          var d, x_factor, y_factor;
          if (typeof command === 'string') {
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
            } else if (command === 'fire') {
              return fireBulletBy(p);
            } else if (command === 'slowdown') {
              p.vx = limitPlayerVelocity(p.vx * 0.95);
              return p.vy = limitPlayerVelocity(p.vy * 0.95);
            } else if (command === 'stop') {
              p.vy = 0;
              return p.vx = 0;
            } else {

            }
          } else if (command != null ? command.angle : void 0) {
            dlog('awesome command');
            dlog(command);
            d = command.angle.degree;
            y_factor = 0;
            x_factor = 0;
            if (d > 0 && d <= 90) {
              y_factor = -1 * (d / 90);
              x_factor = 1 * Math.abs((d - 90) / 90);
            } else if (d > 90 && d <= 180) {
              y_factor = -1 * ((d - 90) / 90);
              x_factor = -1 * Math.abs((d - 90) / 90);
            } else if (d > 180 && d <= 270) {
              y_factor = 1 * ((d - 90) / 90);
              x_factor = -1 * Math.abs((d - 90) / 90);
            } else if (d > 270) {
              y_factor = 1 * ((d - 90) / 90);
              x_factor = 1 * Math.abs((d - 90) / 90);
            }
            dlog('y_factor:' + y_factor);
            p.vx = limitPlayerVelocity((MAX_USER_SPEED * command.force * 1) * x_factor);
            return p.vy = limitPlayerVelocity((MAX_USER_SPEED * command.force * 1) * y_factor);
          }
        };
        for (j = 0, len = active_commands.length; j < len; j++) {
          command = active_commands[j];
          fn(command);
        }
        return moveBubbleWithinBounds(w, h, p);
      };
      fireBulletBy = function(p) {
        var bullet_area, bullet_r, p_area, r, ref, x, y;
        if (_JUST_FIRED_A_BULLET_ === true) {

        }
        _JUST_FIRED_A_BULLET_ = true;
        delay(500, (function() {
          return _JUST_FIRED_A_BULLET_ = false;
        }));
        ref = p.circle, x = ref[0], y = ref[1], r = ref[2];
        bullet_r = r * 0.3;
        bullet_area = getA([0, 0, bullet_r]);
        p_area = getA(p.circle);
        p.circle[2] = getRadiusByArea(p_area - bullet_area);
        if (p.circle[2] < MINIMAL_VIABLE_RADIUS) {
          p.alive = false;
        }
        return bullets.push(makeBullet(x, y, bullet_r, p.vx * 1.8, p.vy * 1.8, p.fillColor));
      };
      update = function() {
        var aa, ab, all_bubbles, bullet, continue_game, e, e2, fn, fn1, fn2, fn3, i, j, k, len, len1, len2, len3, len4, len5, len6, len7, len8, len9, m, o, p, q, ref, t, u, z;
        continue_game = true;
        if (players.length < number_of_active_players) {
          players.push(spawnPlayer(world_width, world_height));
        }
        if (enemies.length < max_nr_of_enemies && Math.random() < chance_of_new_enemy) {
          enemies.push(spawnEnemy(world_width, world_height, MIN_ENEMY_RADIUS, maxEnemySize(players[0]), MIN_ENEMY_SPEED, maxEnemyVelocity(players[0])));
        }
        fn = function(e) {
          return moveBubbleWithinBounds(world_width, world_height, e);
        };
        for (j = 0, len = enemies.length; j < len; j++) {
          e = enemies[j];
          fn(e);
        }
        fn1 = function(p) {
          movePlayer(getActiveCommands(), world_width, world_height, p);
          if (p.circle[2] > MAX_RADIUS || p.circle[2] > world_height || p.circle[2] > world_width) {
            return continue_game = false;
          }
        };
        for (k = 0, len1 = players.length; k < len1; k++) {
          p = players[k];
          fn1(p);
        }
        fn2 = function(bullet) {
          return moveBubbleWithinBounds(world_width, world_height, bullet);
        };
        for (m = 0, len2 = bullets.length; m < len2; m++) {
          bullet = bullets[m];
          fn2(bullet);
        }
        fn3 = function(e) {
          e.circle[2] = e.circle[2] + 50;
          e.opacity = Math.round((e.opacity - 0.1) * 100) / 100;
          if (e.opacity <= 0) {
            return e.alive = false;
          }
        };
        for (o = 0, len3 = explosions.length; o < len3; o++) {
          e = explosions[o];
          fn3(e);
        }
        for (i = q = 0, len4 = enemies.length; q < len4; i = ++q) {
          e = enemies[i];
          ref = enemies.slice(i + 1);
          for (t = 0, len5 = ref.length; t < len5; t++) {
            e2 = ref[t];
            if (circleCollision(e.circle, e2.circle)) {
              joinBubbles(e, e2);
            }
          }
        }
        for (i = u = 0, len6 = bullets.length; u < len6; i = ++u) {
          bullet = bullets[i];
          for (z = 0, len7 = enemies.length; z < len7; z++) {
            e = enemies[z];
            if (circleCollision(e.circle, bullet.circle)) {
              explodeBubble(e);
              bullet.alive = false;
            }
          }
        }
        for (aa = 0, len8 = players.length; aa < len8; aa++) {
          p = players[aa];
          for (ab = 0, len9 = enemies.length; ab < len9; ab++) {
            e = enemies[ab];
            if (circleCollision(p.circle, e.circle)) {
              joinBubbles(p, e);
            }
          }
        }
        enemies = getRidOfTheDeadAndReturnTheLiving(enemies);
        bullets = getRidOfTheDeadAndReturnTheLiving(bullets);
        explosions = getRidOfTheDeadAndReturnTheLiving(explosions);
        players = getRidOfTheDeadAndReturnTheLiving(players);
        if (players.length === 0) {
          continue_game = false;
        }
        all_bubbles = players.concat(enemies, bullets, explosions);
        return [continue_game, all_bubbles];
      };
      draw = function(bubbles) {
        var b, j, len;
        cctx.clearRect(0, 0, world_width, world_height);
        cctx.fillStyle = "rgba(0, 0, 0, 0.3)";
        cctx.fillRect(0, 0, world_width, world_height);
        for (j = 0, len = bubbles.length; j < len; j++) {
          b = bubbles[j];
          drawCircle(cctx, b.circle, b.fillColor, b.strokeColor, b.opacity);
        }
        return wctx.drawImage(cache_canvas, 0, 0);
      };
      run = function() {
        var bubbles, continue_game, ref;
        window.stats.begin();
        loop_id = window.requestAnimationFrame(run);
        ref = update(), continue_game = ref[0], bubbles = ref[1];
        if (continue_game === false) {
          window.cancelAnimationFrame(loop_id);
          loop_id = void 0;
          game(w);
        }
        draw(bubbles);
        return window.stats.end();
      };
      return run();
    };
    return game(w);
  };

  init();

}).call(this);
