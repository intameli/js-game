const canvas = document.getElementById("canvas1");
const c = canvas.getContext("2d");
const rightSprite = new Image();
rightSprite.src = "ACharRight.png";
const leftSprite = new Image();
leftSprite.src = "ACharLeft.png";
const upSprite = new Image();
upSprite.src = "ACharUp.png";
const downSprite = new Image();
downSprite.src = "ACharDown.png";
const mapSprite = new Image();
mapSprite.src = "map.png";
const foreGroundSprite = new Image();
foreGroundSprite.src = "foreground.png";
const guiSprite = new Image();
guiSprite.src = "tiled/gui.png";
const mapTilesWidth = 32;
const gridSize = 24;
let frame = 0;
let counter = 0;
let player = {};
player.x = 240;
player.y = 192;
let speed = 4;
const frameDelay = 2;
let delay = false;
const fps = 30;
const pos = [
  { x: 6, y: 0 },
  { x: 30, y: 0 },
  { x: 6, y: 24 },
  { x: 30, y: 24 },
];
const markers = {
  1025: "wall",
  1030: "use",
};
let moveArr = [];
let lastDirection = "left";

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

fnMove = {
  "right": (s) => {
    return { ...player, x: player.x + s };
  },
  "left": (s) => {
    return { ...player, x: player.x - s };
  },
  "up": (s) => {
    return { ...player, y: player.y - s };
  },
  "down": (s) => {
    return { ...player, y: player.y + s };
  },
};

function addMove(key) {
  const i = moveArr.indexOf(key);
  if (i > -1) {
    moveArr.push(moveArr.splice(i, 1)[0]);
  } else {
    moveArr.push(key);
  }
}

//I wonder if using a set to store and delete the moves is faster?
function keyDownHandler(e) {
  if (e.key === "Right" || e.key === "ArrowRight") {
    addMove("right");
  } else if (e.key === "Left" || e.key === "ArrowLeft") {
    addMove("left");
  } else if (e.key === "Up" || e.key === "ArrowUp") {
    addMove("up");
  } else if (e.key === "Down" || e.key === "ArrowDown") {
    addMove("down");
  }
}
function keyUpHandler(e) {
  if (e.key === "Right" || e.key === "ArrowRight") {
    moveArr.splice(moveArr.indexOf("right"), 1);
  } else if (e.key === "Left" || e.key === "ArrowLeft") {
    moveArr.splice(moveArr.indexOf("left"), 1);
  } else if (e.key === "Up" || e.key === "ArrowUp") {
    moveArr.splice(moveArr.indexOf("up"), 1);
  } else if (e.key === "Down" || e.key === "ArrowDown") {
    moveArr.splice(moveArr.indexOf("down"), 1);
  }
}

function nextFrame() {
  if (player.x % 12 === speed || player.y % 12 === speed) {
    if (frame === 3) {
      frame = 0;
    } else {
      frame++;
    }
  }
}

function collisionCheck(p) {
  const [tileX, tileY] = [p.x / gridSize + 1, p.y / gridSize + 1];
  const index = mapTilesWidth * (tileY - 1) + tileX - 1;
  return collision[index];
}

function movePlayer(key, fn) {
  let added = 0;
  if (delay && counter > frameDelay) {
    delay = false;
  }
  if (lastDirection !== key && counter === 0) {
    delay = true;
    lastDirection = key;
  }
  if (!delay) {
    lastDirection = key;
    added += speed;
  }

  let nextPos = fn(gridSize);
  const inFront = markers[collisionCheck(nextPos)];
  if (inFront) added = 0;

  counter++;
  return fn(added);
}

function drawPrompt() {
  c.fillStyle = "brown";
  c.font = "36px Arial";
  c.drawImage(guiSprite, 0, 0, guiSprite.width * 2, guiSprite.height * 2);
  c.fillText("I am a sign!", 300, 600);
}
guiSprite.addEventListener("load", () => {
  c.drawImage(guiSprite, 0, 0, guiSprite.width * 2, guiSprite.height * 2);
});

function draw() {
  c.clearRect(0, 0, canvas.width, canvas.height);
  c.drawImage(mapSprite, 0, 0, mapSprite.width * 2, mapSprite.height * 2);

  //   c.beginPath();
  //   for (let i = 1; i < 11; i++) {
  //     c.moveTo(24 * i, 0);
  //     c.lineTo(24 * i, 240);
  //   }
  //   for (let i = 1; i < 11; i++) {
  //     c.moveTo(0, 24 * i);
  //     c.lineTo(240, 24 * i);
  //   }
  //   c.stroke();

  let img = null;
  if (lastDirection === "right") img = rightSprite;
  if (lastDirection === "left") img = leftSprite;
  if (lastDirection === "up") img = upSprite;
  if (lastDirection === "down") img = downSprite;
  c.drawImage(
    img,
    pos[frame].x,
    pos[frame].y,
    12,
    24,
    player.x,
    player.y - 24,
    24,
    48
  );
  c.drawImage(
    foreGroundSprite,
    0,
    0,
    foreGroundSprite.width * 2,
    foreGroundSprite.height * 2
  );
  nextFrame();
  const moveKeyPressed = moveArr[moveArr.length - 1];
  if (player.x % 24 > 0) {
    player.x += lastDirection === "right" ? speed : -speed;
  } else if (player.y % 24 > 0) {
    player.y += lastDirection === "down" ? speed : -speed;
  } else if (moveKeyPressed !== undefined) {
    player = movePlayer(moveKeyPressed, fnMove[moveKeyPressed]);
  } else {
    const fn = fnMove[lastDirection];
    const nextPos = fn(gridSize);
    const check = markers[collisionCheck(nextPos)];
    if (check === "use") {
      drawPrompt();
    }
  }
  if (moveKeyPressed === undefined) {
    counter = 0;
    delay = false;
  }
}

//I should prob check everything is loaded
document.getElementById("start").addEventListener("click", function () {
  setInterval(draw, 1000 / fps);
  this.disabled = true;
});
