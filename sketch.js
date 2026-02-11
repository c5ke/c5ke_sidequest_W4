let data;
let levelIndex = 0;

let world;
let player;
let star; // {x, y, r}

function preload() {
  data = loadJSON("levels.json");
}

function setup() {
  player = new BlobPlayer();
  loadLevel(0);
  noStroke();
  textFont("sans-serif");
  textSize(14);
}

function draw() {
  world.drawWorld();
  player.update(world.platforms);
  player.draw(world.theme.blob);

  // Draw the star
  fill("#FFD700");
  ellipse(star.x, star.y, star.r * 2);

  // HUD
  fill(0);
  text(world.name, 10, 18);
  text("Move: A/D or ←/→ • Jump: Space/W/↑", 10, 36);

  // Check if player touches the star
  if (dist(player.x, player.y, star.x, star.y) < player.r + star.r) {
    loadLevel((levelIndex + 1) % data.levels.length);
  }
}

function keyPressed() {
  if (key === " " || key === "W" || key === "w" || keyCode === UP_ARROW) {
    player.jump();
  }
}

function loadLevel(i) {
  levelIndex = i;
  const levelJson = data.levels[levelIndex];

  // Generate platforms dynamically if empty
  if (levelJson.platforms.length === 0) {
    levelJson.platforms = generatePlatforms(levelJson.name);
  }

  world = new WorldLevel(levelJson);

  const W = world.inferWidth(640);
  const H = world.inferHeight(360);
  resizeCanvas(W, H);

  player.spawnFromLevel(world);

  // Place star at the last platform’s center
  const lastPlat = world.platforms[world.platforms.length - 1];
  star = {
    x: lastPlat.x + lastPlat.w / 2,
    y: lastPlat.y - 15,
    r: 10
  };
}

/*
Dynamically generate platforms for each level
*/
function generatePlatforms(levelName) {
  let platforms = [];

  if (levelName === "Intro Steps") {
    // Staircase using a loop
    for (let i = 0; i < 5; i++) {
      platforms.push({
        x: 50 + i * 120,
        y: 324 - i * 60,
        w: 100,
        h: 12
      });
    }
  } else if (levelName === "Looped Challenge") {
    // Grid of floating platforms
    for (let i = 0; i < 5; i++) {
      platforms.push({
        x: 50 + i * 120,
        y: 324 - i * 60,
        w: 100,
        h: 12
      });
    }
  }

  return platforms;
}
