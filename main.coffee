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
#DEFAULT_NEGATIVE_CIRCLE_JOIN_RATE = 1

MINIMAL_VIABLE_RADIUS = 1
MAX_ENEMY_RADIUS = 450
MIN_ENEMY_RADIUS = 1
PROPORTION_MAX_NEW_ENEMY_SIZE = 12.0

BULLET_SHOOTER_RATIO = 0.2
SHOOTER_SHOOT_LOSS = 0.01


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

clamp = (min, max) -> Math.min(Math.max(this, min), max)

zeroTo255 = (n) ->
  until n? then return randomInt(0,255)
  if n <0 or n>255 then return randomInt(0,255)
  return n

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
  b.alive = true
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




#drawFunctions
drawCircleBox = (circle, ctx) ->


drawCircle = (ctx, circle, fill = randomColor(), border = randomColor()) ->
  [x,y,r]=rc(circle)
  ctx.globalCompositeOperation = "lighter"
  ctx.lineWidth = 2
  #ctx.fillStyle = makeColorString(fill)
  gradient = ctx.createRadialGradient(x, y, 0, x, y, r)
  #gradient.addColorStop(0, "white")
  #gradient.addColorStop(0.4, "white")
  gradient.addColorStop(0.4, makeColorString(fill))
  gradient.addColorStop(1, "black")
  ctx.fillStyle = gradient
  ctx.strokeStyle = makeColorString(border)
  ctx.beginPath()
  #ctx.arc(x,y,r,0,2*Math.PI)
  ctx.arc(((0.5 + x) | 0),((0.5 + y) | 0),((0.5 + r) | 0), 0,2*Math.PI)
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


      all_bubbles = players.concat(enemies)
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
        drawCircle(cctx, b.circle, b.fillColor, [0,0,0])


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
