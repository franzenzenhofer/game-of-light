_DEBUG_ = true

#magic numbers
ENEMIES_PROPABILITY = 0.05
NUMBER_OF_ENEMIES = 100

MIN_ENEMY_SPEED = 0.5
MAX_ENEMY_SPEED = 1

PLAYER_START_SIZE = 20

DEFAULT_USER_ACCELERATION = 0.1
MAX_USER_SPEED = 4

#DEFAULT_LINE_WIDTH = 2
#DEFAULT_POSITIVE_CIRCLE_JOIN_RATE = 0.5
DEFAULT_NEGATIVE_CIRCLE_JOIN_RATE = 0.5
RATIO_PREVAILANCE_WITH_MERGE = 0.8

MINIMAL_VIABLE_RADIUS = 1
MAX_ENEMY_RADIUS = 450
MIN_ENEMY_RADIUS = 1
PROPORTION_MAX_NEW_ENEMY_SIZE = 12.0

BULLET_SHOOTER_RATIO = 0.2
SHOOTER_SHOOT_LOSS = 0.01

DRAW_BIGGER_RADIUS_FACTOR = 1.4


dlog = (msg) ->
  console.log(msg) if _DEBUG_
  return msg


randomInt = (from,to) ->
  Math.floor(Math.random()*to)+from

randomNumber = (from, to) ->
  (Math.random()*to)+from

randomPlusOrMinusOne = () -> 
  if Math.random() < 0.5
    return -1
  else
    return 1

clamp = (v, min, max) -> Math.min(Math.max(v, min), max)

clampRgb = (v) -> 
  parseInt(clamp(v,0,255))

zeroTo255 = (n) ->
  until n? then return randomInt(0,255)
  if n <0 or n>255 then return randomInt(0,255)
  return parseInt(n)

randomColor = (r,g,b) ->
  return [zeroTo255(r),zeroTo255(g),zeroTo255(b)]

makeColorString = (color_rgb) ->
  [r,g,b] = color_rgb
  return "rgb(#{r},#{g},#{b})"

c = circle = (x,y,r) ->
  [x,y,r]

rc = reverse_circle = (a) ->
  [x,y,r] = a

calcCircleBox = (circle) ->
  [x,y,r] = rc(circe)
  return [x-r,y-r,r*2]

doTheCirclesColide = (circle_0, circle_1) ->

isCircleViable = (circle) ->
  
joinCircles = (circle_0, circle_1) ->

maxEnemySize = (player) ->
  return Math.floor(Math.sqrt(player.circle[2]) * PROPORTION_MAX_NEW_ENEMY_SIZE)

maxEnemyVelocity = (player) ->
  Math.max.apply(Math,[player.vx,player.vy])

#higher abstractions
moveBubble = (bubble) ->
  bubble.circle[0] = bubble.circle[0] + bubble.vx
  bubble.circle[1] = bubble.circle[1] + bubble.vy
  return bubble

limitPlayerVelocity = (v) ->
  if Math.abs(v) > MAX_USER_SPEED
    return MAX_USER_SPEED *(v/Math.abs(v))
  else
    return v

movePlayer = (active_commands, w, h, p) ->
  for command in active_commands
    do (command) ->
      if command is 'up'
        p.vy = p.vy - DEFAULT_USER_ACCELERATION
        p.vy = limitPlayerVelocity(p.vy)
      else if command is 'down'
        p.vy = p.vy + DEFAULT_USER_ACCELERATION
        p.vy = limitPlayerVelocity(p.vy)
      else if command is 'left'
        p.vx = p.vx - DEFAULT_USER_ACCELERATION
        p.vx = limitPlayerVelocity(p.vx)
      else if command is 'right'
        p.vx = p.vx + DEFAULT_USER_ACCELERATION
        p.vx = limitPlayerVelocity(p.vx)
      else
        dlog('unkown command: '+c)
  moveBubbleWithinBounds(w,h,p)

moveBubbleWithinBounds = (w,h,bubble) ->
  [x,y,r] = bubble.circle
  if y < (r * -1)
    #top
    #dlog('top')
    #dlog(bubble)
    #dlog('y:'+y)
    bubble.circle[1] = h+r
    #bubble.vy = bubble.vy * -1
    #dlog(bubble)
    #debugger;
    return moveBubble(bubble)
  else if y > (h + r)
    #bottom
    #dlog('bottom')
    bubble.circle[1] = r * -1
    #bubble.vy = bubble.vy * -1
    return moveBubble(bubble)
  else if x < (r * -1)
    #left
    #dlog('left')
    bubble.circle[0] = w + r
    #bubble.vx = bubble.vx * -1
    return moveBubble(bubble)
  else if x > w+r
    #right
    #dlog('right')
    bubble.circle[0] = r * -1
    #bubble.vx = bubble.vx * -1
    return moveBubble(bubble)
  else
    #withinbounds
    #dlog('withinbounds')
    return moveBubble(bubble)

makeBubble = (x = 100, y = 100, r = 100, vx = 0, vy = 0, rgb) ->
  b = {}
  b.circle = c(x,y,r)
  b.fillColor = rgb ? randomColor()
  b.strokeColor = [0,0,255]
  b.alive = true
  b.explode = false
  b.vx = vx
  b.vy = vy
  return b

makeEnemy = (x, y, r, vx, vy, rgb) ->
  if r > MAX_ENEMY_RADIUS then r = MAX_ENEMY_RADIUS
  makeBubble(x, y, r, vx, vy, rgb)

makePlayer = (x,y,r) ->
  makeBubble(x,y,r,0,0,[255,255,0])

spawnPlayer = (w,h) ->
  makePlayer(Math.floor(w/2), Math.floor(h/2), PLAYER_START_SIZE)

spawnEnemy = (world_width, world_height, min_r = 15, max_r = 75, min_v = MIN_ENEMY_SPEED, max_v = MAX_ENEMY_SPEED) ->
  r = randomInt(min_r, max_r)
  vx = randomNumber(min_v, max_v)
  vy = randomNumber(min_v, max_v)
  where = Math.random()
  switch
    when (where < 0.25)
      #top
      x = Math.random()*world_width
      y = r * -1
      #vy = vy
      vx = vx * randomPlusOrMinusOne() 
    when (where < 0.5)
      #bottom
      x = Math.random()*world_width
      y = world_height+r
      vy = vy * -1
      vx = vx * randomPlusOrMinusOne()
    when (where < 0.75)
      #left
      x = r * -1
      y = Math.random()*world_height
      vy = vy * randomPlusOrMinusOne()
      vx = vx 
    else 
      #right
      x = world.width + r
      y = Math.random()*world_height
      vy = vy * randomPlusOrMinusOne()
      vx = vx * -1
  makeEnemy(x, y, r, vx, vy)

#collison detection
rectangleCollision = (a,b) -> 
  [a_x, a_y, a_width] = a
  [b_x, b_y, b_width] = b
  a_x < b_x + b_width &&
  a_x + a_width > b_x &&
  a_y < b_y + b_width &&
  a_y + a_width > b_y

circleCollision = (c1, c2) ->
  [c1_x, c1_y, c1_r] = rc(c1)
  [c2_x, c2_y, c2_r] = rc(c2)
  a = c2_x - c1_x
  b = c2_y - c1_y
  d = Math.sqrt(a*a + b*b)
  if (d - c1_r - c2_r) < 0
    return true
  return false

bubbleCollision = (b1, b2) ->
  [c1_x, c1_y, c1_r] = rc(b1.circle)
  [c2_x, c2_y, c2_r] = rc(b2.circle)
  if rectangleCollision([c1_x-(c1_r/2),c1_y-(c1_y/2), c1_r*2],[c2_x-(c2_r/2),c2_y-(c2_y/2), c2_r*2])
    #b1.strokeColor=[255,128,0]
    #b2.strokeColor=[255,128,0]
    return circleCollision(b1.circle,b2.circle)
  return false

getA = (circle) ->
  return circle[2]*circle[2]*Math.PI

getADifference = (c1, c2) ->
  return Math.abs(getA(c1)-getA(c2))

getRadiusByArea = (a) ->
  return Math.sqrt(a/Math.PI)

getADifferenceMinusRadius = (circle, minus) ->
  c2 = [circle[0], circle[1], circle[2]-minus]
  getADifference(circle, c2)

colorMix = (rgb1, rgb2, percentage) ->
    [r1, g1, b1] = rgb1
    [r2, g2, b2] = rgb2

    if r1+g1+b1 > 255
      r_faktor = 1; if r1 < r2 then r_faktor = r_faktor*-1
      g_faktor = 1; if g1 < g2 then g_faktor = g_faktor*-1 
      b_faktor = 1; if b1 < b2 then b_faktor = b_faktor*-1
    else
      #return [255,255,255]
      r_faktor = g_faktor = b_faktor = 1


    r_diff = Math.abs(r1-r2)
    g_diff = Math.abs(g1-g2)
    b_diff = Math.abs(b1-b2)

    r_n = clampRgb(r1+(r_diff*percentage*r_faktor))
    g_n = clampRgb(g1+(g_diff*percentage*g_faktor))
    b_n = clampRgb(b1+(b_diff*percentage*b_faktor))
    return [r_n, g_n, b_n]

    #r_diff = r1 - r2
    #g_diff = g1 - g2
    #b_diff = b1 - b2

    #r_new = r1 + r_diff * percentage
    #g_new = g1 + g_diff * percentage
    #b_new = b1 + b_diff * percentage
    #r_new = clampRgb(r1+(r_diff))
    #g_new = clampRgb(g1+(g_diff))
    #b_new = clampRgb(b1+(b_diff))
    #dlog(percentage)
    #dlog(rgb1)
    #dlog(rgb2)
    #dlog([r_new, g_new, b_new])
    #dlog('---')
    #debugger;
    #return [r_new, g_new, b_new]
    dlog(r1+'-'+r2+'='+r_diff+'+'+r1+(''))
    return [r_new,g_new,b_new]


joinBubbles = (b1, b2) ->
  [c1_x, c1_y, c1_r] = rc(b1.circle)
  [c2_x, c2_y, c2_r] = rc(b2.circle)
  if c1_r > c2_r
    winner = b1
    looser = b2
  else if c1_r < c2_r
    winner = b2
    looser = b1
  else
    if Math.random() <= 0.5
      b1.explode = true
      b1.alive = false
    else
      b2.explode = true
      b2.alive = false
    return true

  winner.strokeColor = [0,255,0]
  looser.strokeColor = [255,0,0]

  if (winner and looser)
    looser_area_difference = getADifferenceMinusRadius(looser.circle, DEFAULT_NEGATIVE_CIRCLE_JOIN_RATE)
    looser.circle[2] = looser.circle[2] - DEFAULT_NEGATIVE_CIRCLE_JOIN_RATE
    winner_area = getA(winner.circle)
    percentage_of_area = looser_area_difference / winner_area
    winner.fillColor = colorMix(winner.fillColor, looser.fillColor, percentage_of_area)
    #winner.fillColor = colorMix(winner.fillColor, looser.fillColor, percentage_of_area)
    winner.circle[2] = getRadiusByArea(winner_area+(looser_area_difference*RATIO_PREVAILANCE_WITH_MERGE))
    
    if looser.circle[2] < MINIMAL_VIABLE_RADIUS
      looser.alive = false
  
  return true





#drawFunctions
drawCircleBox = (circle, ctx) ->


drawCircle = (ctx, circle, fill = randomColor(), border = [0,0,255]) ->
  [x,y,r]=rc(circle)
  if r <= 0 then return false
  ctx.globalCompositeOperation = "lighter"
  ctx.lineWidth = 2
  #ctx.fillStyle = makeColorString(fill)
  gradient = ctx.createRadialGradient(x, y, 0, x, y, r*DRAW_BIGGER_RADIUS_FACTOR)
  #gradient.addColorStop(0, "white")
  #gradient.addColorStop(0.4, "white")
  gradient.addColorStop(0.4, makeColorString(fill))
  gradient.addColorStop(1, "black")
  ctx.fillStyle = gradient
  #ctx.strokeStyle = makeColorString(border)
  #ctx.strokeStyle = makeColorString(border)
  ctx.beginPath()
  #ctx.arc(x,y,r,0,2*Math.PI)
  ctx.arc(((0.5 + x) | 0),((0.5 + y) | 0),((0.5 + r*DRAW_BIGGER_RADIUS_FACTOR) | 0), 0,2*Math.PI)
  #ctx.arc((~~(0.5 + x)),(~~(0.5 + y)),(~~(0.5 + r)), 0,2*Math.PI)
  #.arc((Math.round(x)),(Math.round(y)),(Math.round(r)), 0,2*Math.PI)
  ctx.fill()
  #ctx.stroke()

drawCircleExplosion = (circle, options, board_cxt) ->


init = (w) ->
  dlog('in init')
  world_width = w.width = window.innerWidth
  world_height = w.height = window.innerHeight

  document.addEventListener('keydown', (event) ->
    event.preventDefault()
    command = event2Command(event)
    if command then setActiveCommand(command)
    )

  document.addEventListener('keyup', (event) ->
    event.preventDefault()
    command = event2Command(event)
    if command then removeActiveCommand(command)
    )

  currently_active_commands = []
  
  event2Command = (event) ->
    if event.keyCode is 40 then return 'down'
    if event.keyCode is 38 then return 'up'
    if event.keyCode is 37 then return 'left'
    if event.keyCode is 39 then return 'right'
    return false

  getActiveCommands = () ->
    return currently_active_commands

  setActiveCommand = (command) ->
    if currently_active_commands.indexOf(command) is -1
      currently_active_commands.push(command)
    dlog(currently_active_commands)

  removeActiveCommand = (command) ->
    temp = []
    for co in currently_active_commands
      do (co) ->
        if co isnt command
          temp.push(co)
    currently_active_commands = temp
    dlog(currently_active_commands)

  game = (w, max_nr_of_enemies, chance_of_new_enemy, min_enemy_speed, max_enemy_speed, number_of_active_players = 1) ->
    wctx = w.getContext('2d')
    cache_canvas = document.createElement('canvas')
    cache_canvas.width = world_width
    cache_canvas.height = world_height
    cctx = cache_canvas.getContext('2d')
    dlog('in game')
    #cctx = wctx
    enemies = []
    players = []


    update = () ->

      if players.length < number_of_active_players
        players.push(spawnPlayer(world_width, world_height))

      if enemies.length < max_nr_of_enemies and Math.random() < chance_of_new_enemy
        enemies.push(spawnEnemy(world_width, world_height, MIN_ENEMY_RADIUS, maxEnemySize(players[0]), MIN_ENEMY_SPEED, maxEnemyVelocity(players[0])))


      #move
      for e in enemies
        do (e) ->
          moveBubbleWithinBounds(world_width, world_height, e)

      for p in players
        do (p) ->
          #dlog(p)
          #debugger;
          movePlayer(getActiveCommands(), world_width, world_height, p)

      #dlog(enemies)
      #debugger;

      players_and_enemies = players.concat(enemies)

      #check if the bubbles collide
      for b, i in players_and_enemies
        for b2, i2 in players_and_enemies
          #if i isnt i2 and bubbleCollision(b,b2)
          if i isnt i2 and circleCollision(b.circle, b2.circle)
            joinBubbles(b,b2)
      #push into explosion and iterrate explosion, get rid of explosions

      #get rid of not alive ones
      temp = []
      for b in players_and_enemies
        if b.alive isnt false
          temp.push(b)

      players_and_enemies = temp

      all_bubbles = players_and_enemies
      #return players
      #return enemies
      return all_bubbles
    draw = (bubbles) ->
      #wctx.clearRect(0, 0, world_width, world_height)
      cctx.clearRect(0, 0, world_width, world_height)
      #cctx.globalCompositeOperation = "source-over"
      cctx.fillStyle = "rgba(0, 0, 0, 0.3)"
      cctx.fillRect(0, 0, world_width, world_height)
      #debugger;
      #cctx.beginPath()

      for b in bubbles 
        drawCircle(cctx, b.circle, b.fillColor, b.strokeColor)


      #final step, draw the cache over to the world
      wctx.drawImage(cache_canvas,0,0)

    run = () ->
      window.stats.begin()
      window.requestAnimationFrame(run)
      bubbles = update()
      draw(bubbles)
      window.stats.end()
    run()

  game(w, NUMBER_OF_ENEMIES, ENEMIES_PROPABILITY)

init(document.getElementById('world'))
