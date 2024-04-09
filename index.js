let config = {
  containerColorBG: "#353336",
  contentColorBG: "#525053",

  countRows: 10,
  countColumns: 10,

  offsetBorder: 10,
  borderRadius: 8,

  gemSize: 50,

  colorsCoins: [
    "#7851A9", //королевский пурпурный
    "#DD80CC", //пурпур
    "#082567", //индиго
    "#FFD700", //золотой
    "#21421E", //миртовый
    "#8CCB5E", //желтовато-зеленый
    "#A5260A", //бисмарк-фуриозо(темно-оранжевый)
    "#3EB489", //мятный
  ],

  gemClass: "gem",
  gemIdPrefix: "gem",
  gameStates: ["pick", "switch", "revert", "remove", "refill"],
  gameState: "",

  movingItems: 0,

  countScore: 0,
};

// хранится текущий выбор игрока
let player = {
  selectedRow: -1,
  selectedColumn: -1,
  posX: "",
  posY: "",
};

//все элементы
let components = {
  container: document.createElement("div"),
  content: document.createElement("div"),
  wrapper: document.createElement("div"),
  cursor: document.createElement("div"),
  score: document.createElement("div"),
  gems: new Array(),
};

initGame();

function initGame() {
  document.body.style.margin = "0px";
  createPage();
  createContentPage();
  createWrapper();
  createCursor();
  createGrid();
  createScore();
  config.gameState = config.gameStates[0]; //статус выбор
}

function createPage() {
  components.container.style.backgroundColor = config.containerColorBG;
  components.container.style.height = "100vh";
  components.container.style.overflow = "hidden";
  components.container.style.display = "flex";
  components.container.style.alignItems = "center";
  components.container.style.justifyContent = "center";

  document.body.append(components.container);
}

function createContentPage() {
  components.content.style.padding = config.offsetBorder + "px";
  components.content.style.width =
    config.gemSize * config.countColumns + config.offsetBorder * 2 + "px";
  components.content.style.height =
    config.gemSize * config.countRows + config.offsetBorder * 2 + "px";
  components.content.style.backgroundColor = config.contentColorBG;
  components.content.style.boxShadow = config.offsetBorder + "px";
  components.content.style.borderRadius = config.borderRadius + "px";
  components.content.style.boxSizing = "border-box";

  components.container.append(components.content);
}

function createWrapper() {
  components.wrapper.style.position = "relative";
  components.wrapper.style.height = "100%";
  components.wrapper.addEventListener("click", function (event) {
    handlerTab(event, event.target);
  });

  components.content.append(components.wrapper);
}

function createCursor() {
  components.cursor.id = "marker";
  components.cursor.style.width = config.gemSize - 10 + "px";
  components.cursor.style.height = config.gemSize - 10 + "px";
  components.cursor.style.border = "5px solid white";
  components.cursor.style.borderRadius = "20px";
  components.cursor.style.position = "absolute";
  components.cursor.style.display = "none";

  components.wrapper.append(components.cursor);
}

function cursorShow() {
  components.cursor.style.display = "block";
}

function cursorHide() {
  components.cursor.style.display = "none";
}

function createScore() {
  components.score.style.width = 200 + "px";
  components.score.style.height = 50 + "px";
  components.score.style.display = "flex";
  components.score.style.justifyContent = "center";
  components.score.style.alignItems = "center";
  components.score.style.borderRadius = config.borderRadius + "px";
  components.score.style.backgroundColor = config.contentColorBG;
  components.score.style.position = "absolute";
  components.score.style.bottom = "calc(100% + " + 24 + "px)";
  components.score.style.left =
    "calc(50% - " + parseInt(components.score.style.width) / 2 + "px)";

  components.score.style.fontFamily = "sans-serif";
  components.score.style.fontSize = "16px";
  components.score.style.color = "#ffffff";

  updateScore();
}

function updateScore() {
  components.score.innerHTML = config.countScore;
  components.wrapper.append(components.score);
}

function scoreInc(count) {
  if (count >= 4) {
    count *= 2;
  } else if (count >= 5) {
    count = (count + 1) * 2;
  } else if (count >= 6) {
    count *= (count + 2) * 2;
  }

  config.countScore += count;
  updateScore();
}

function createGem(t, l, row, column, color) {
  let coin = document.createElement("div");

  coin.classList.add(config.gemClass);
  coin.id = config.gemIdPrefix + "_" + row + "_" + column;
  coin.style.boxSizing = "border-box";
  coin.style.cursor = "pointer";
  coin.style.position = "absolute";
  coin.style.top = t + "px";
  coin.style.left = l + "px";
  coin.style.width = config.gemSize + "px";
  coin.style.height = config.gemSize + "px";
  coin.style.border = "1px solid transparent";
  coin.style.borderRadius = "50%";
  coin.style.backgroundColor = color;

  components.wrapper.append(coin);
}

function createGrid() {
  for (let i = 0; i < config.countRows; i++) {
    components.gems[i] = new Array();
    for (let j = 0; j < config.countColumns; j++) {
      components.gems[i][j] = -1;
    }
  }

  for (let i = 0; i < config.countRows; i++) {
    for (let j = 0; j < config.countColumns; j++) {
      do {
        components.gems[i][j] = Math.floor(Math.random() * 8);
      } while (isStreak(i, j));
      createGem(
        i * config.gemSize,
        j * config.gemSize,
        i,
        j,
        config.colorsCoins[components.gems[i][j]]
      );
    }
  }
}

function isStreak(row, col) {
  return isVerticalStreak(row, col) || isHorizontalStreak(row, col);
}

function isVerticalStreak(row, col) {
  let gemValue = components.gems[row][col];
  let streak = 0;
  let tmp = row;

  while (tmp > 0 && components.gems[tmp - 1][col] == gemValue) {
    streak++;
    tmp--;
  }

  tmp = row;
  while (
    tmp < config.countRows - 1 &&
    components.gems[tmp + 1][col] == gemValue
  ) {
    streak++;
    tmp++;
  }
  return streak > 1;
}

function isHorizontalStreak(row, col) {
  let gemValue = components.gems[row][col];
  let streak = 0;
  let tmp = col;

  while (tmp > 0 && components.gems[row][tmp - 1] == gemValue) {
    streak++;
    tmp--;
  }

  tmp = col;
  while (
    tmp < config.countColumns - 1 &&
    components.gems[row][tmp + 1] == gemValue
  ) {
    streak++;
    tmp++;
  }
  return streak > 1;
}

function handlerTab(event, target) {
  if (target.classList.contains(config.gemClass) && config.gameStates[0]) {
    let row = parseInt(target.getAttribute("id").split("_")[1]);
    let col = parseInt(target.getAttribute("id").split("_")[2]);

    cursorShow();
    components.cursor.style.top = parseInt(target.style.top) + "px";
    components.cursor.style.left = parseInt(target.style.left) + "px";

    if (player.selectedRow == -1) {
      player.selectedRow = row;
      player.selectedColumn = col;
    } else {
      if (
        (Math.abs(player.selectedRow - row) == 1 &&
          player.selectedColumn == col) ||
        (Math.abs(player.selectedColumn - col) == 1 &&
          player.selectedRow == row)
      ) {
        cursorHide();

        config.gameState = config.gameStates[1];

        player.posX = col;
        player.posY = row;

        gemSwitch();
      } else {
        player.selectedRow = row;
        player.selectedColumn = col;
      }
    }
  }
}

function gemSwitch() {
  let yOffset = player.selectedRow - player.posY;
  let xOffset = player.selectedColumn - player.posX;

  document
    .querySelector(
      "#" +
        config.gemIdPrefix +
        "_" +
        player.selectedRow +
        "_" +
        player.selectedColumn
    )
    .classList.add("switch");
  document
    .querySelector(
      "#" +
        config.gemIdPrefix +
        "_" +
        player.selectedRow +
        "_" +
        player.selectedColumn
    )
    .setAttribute("dir", "-1");

  document
    .querySelector(
      "#" + config.gemIdPrefix + "_" + player.posY + "_" + player.posX
    )
    .classList.add("switch");
  document.querySelector("#" + config.gemIdPrefix + "_" + player.posY + "_" + player.posX).setAttribute("dir", "1");



  //jquery
  document.querySelectorAll(".switch").forEach(function (elem) {
    config.movingItems++;

    let dir = parseInt(elem.getAttribute("dir"));
    let currentLeft = parseInt(elem.style.left) || 0;
    let currentTop = parseInt(elem.style.top) || 0;

    let newLeft = currentLeft + xOffset * config.gemSize * dir;
    let newTop = currentTop + yOffset * config.gemSize * dir;

    animateMoveElem(elem, {left: newLeft, top: newTop}, 250, function() {
      checkMoving()
    });

    elem.classList.remove("switch");
  });

  document.querySelector("#" + config.gemIdPrefix + "_" + player.selectedRow + "_" + player.selectedColumn).setAttribute("id", "temp");
  document.querySelector("#" + config.gemIdPrefix + "_" + player.posY + "_" + player.posX)
  .setAttribute("id", config.gemIdPrefix + "_" + player.selectedRow + "_" + player.selectedColumn);
  document.querySelector("#temp").setAttribute("id", config.gemIdPrefix + "_" + player.posY + "_" + player.posX);

  let temp = components.gems[player.selectedRow][player.selectedColumn];
  components.gems[player.selectedRow][player.selectedColumn] = components.gems[player.posY][player.posX];
  components.gems[player.posY][player.posX] = temp;
}

function animateMoveElem(elem, properties, duration, callback) {
  let startTime = performance.now();
  let initialValue = {};
  let changes = {};

  for(let prop in properties) {
    initialValue[prop] = parseFloat(elem.style[prop]) || 0;
    changes[prop] = properties[prop] - initialValue[prop];
  }

  requestAnimationFrame(function animate(time) {
    let elapsed = time - startTime;
    let progress = Math.min(elapsed / duration, 1);

    // Применяем изменения к элементу
    for (let prop in changes) {
      let value = initialValue[prop] + changes[prop] * progress;
      elem.style[prop] = value + "px";
    }
    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      if (typeof callback === "function") {
        callback();
      }
    }
  });
}

function checkMoving() {
  config.movingItems--;

  if (config.movingItems == 0) {
    switch (config.gameState) {
      case config.gameStates[1]:
      case config.gameStates[2]:
        if (
          !isStreak(player.selectedRow, player.selectedColumn) &&
          !isStreak(player.posY, player.posX)
        ) {
          if (config.gameState != config.gameStates[2]) {
            config.gameState = config.gameStates[2];
            gemSwitch();
          } else {
            config.gameState = config.gameStates[0];
            player.selectedRow = -1;
            player.selectedColumn = -1;
          }
        } else {
          config.gameState = config.gameStates[3];

          if (isStreak(player.selectedRow, player.selectedColumn)) {
            removeGems(player.selectedRow, player.selectedColumn);
          }

          if (isStreak(player.posY, player.posX)) {
            removeGems(player.posY, player.posX);
          }

          gemFade();
        }
        break;
      case config.gameStates[3]:
        checkFalling();
        break;
      case config.gameStates[4]:
        placeNewGems();
        break;
    }
  }
}

function removeGems(row, col) {
  let gemValue = components.gems[row][col];
  let tmp = row;

  document
    .querySelector("#" + config.gemIdPrefix + "_" + row + "_" + col)
    .classList.add("remove");
  let countRemoveGem = document.querySelectorAll(".remove").length;

  if (isVerticalStreak(row, col)) {
    while (tmp > 0 && components.gems[tmp - 1][col] == gemValue) {
      document.querySelector("#" + config.gemIdPrefix + "_" + (tmp - 1) + "_" + col).classList.add("remove");
      components.gems[tmp - 1][col] = -1;
      tmp--;
      countRemoveGem++;
    }

    tmp = row;

    while (
      tmp < config.countRows - 1 &&
      components.gems[tmp + 1][col] == gemValue
    ) {
      document.querySelector("#" + config.gemIdPrefix + "_" + (tmp + 1) + "_" + col).classList.add("remove");
      components.gems[tmp + 1][col] = -1;
      tmp++;
      countRemoveGem++;
    }
  }

  if (isHorizontalStreak(row, col)) {
    tmp = col;
    while (tmp > 0 && components.gems[row][tmp - 1] == gemValue) {
      document
        .querySelector("#" + config.gemIdPrefix + "_" + row + "_" + (tmp - 1))
        .classList.add("remove");
      components.gems[row][tmp - 1] = -1;
      tmp--;
      countRemoveGem++;
    }

    tmp = col;

    while (
      tmp < config.countColumns - 1 &&
      components.gems[row][tmp + 1] == gemValue
    ) {
      document
        .querySelector("#" + config.gemIdPrefix + "_" + row + "_" + (tmp + 1))
        .classList.add("remove");
      components.gems[row][tmp + 1] = -1;
      tmp++;
      countRemoveGem++;
    }
  }

  components.gems[row][col] = -1;
  scoreInc(countRemoveGem);
}

//jquery
function gemFade() {
  document.querySelectorAll(".remove").forEach(function (elem) {
    config.movingItems++;

    animateOpacityElem(elem, 0, 200, function () {
      elem.parentNode.removeChild(elem);
      checkMoving();
    });
  });
}

function animateOpacityElem(elem, targetOpacity, duration, callback) {
  let initialOpacity = parseFloat(window.getComputedStyle(elem).opacity);
  let opacityChange = targetOpacity - initialOpacity;
  let startTime = null;

  function step(currentTime) {
    if (!startTime) {
      startTime = currentTime;
    }

    let elapsedTime = currentTime - startTime;
    let progress = Math.min(elapsedTime / duration, 1);

    elem.style.opacity = initialOpacity + opacityChange * progress;
    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      if (typeof callback === "function") callback();
    }
  }
  requestAnimationFrame(step);
}

function checkFalling() {
  let fellDown = 0;
  for (let j = 0; j < config.countColumns; j++) {
    for (let i = config.countRows - 1; i > 0; i--) {
      if (components.gems[i][j] == -1 && components.gems[i - 1][j] >= 0) {
        document
          .querySelector("#" + config.gemIdPrefix + "_" + (i - 1) + "_" + j)
          .classList.add("fall");
        document
          .querySelector("#" + config.gemIdPrefix + "_" + (i - 1) + "_" + j)
          .setAttribute("id", config.gemIdPrefix + "_" + i + "_" + j);
        components.gems[i][j] = components.gems[i - 1][j];
        components.gems[i - 1][j] = -1;
        fellDown++;
      }
    }
  }

  document.querySelectorAll(".fall").forEach(function (elem) {
    config.movingItems++;

    let currentTop = parseInt(elem.style.top) || 0;

    animateVerticalPosition(elem, {top: currentTop + config.gemSize}, 100, function () {
      elem.classList.remove("fall");
      checkMoving();
    });
  });

  if (fellDown == 0) {
    config.gameState = config.gameStates[4];
    config.movingItems = 1;
    checkMoving();
  }
}

function animateVerticalPosition(elem, properties, duration, callback) {
  let start = performance.now();
  let initialValue = {};
  let changes = {};

  for(let prop in properties) {
    initialValue[prop] = parseInt(elem.style[prop]) || 0;
    changes[prop] = properties[prop] - initialValue[prop];
  }

  requestAnimationFrame(function animateVerticalPosition(time) {
    let elapsed = time - start;
    let progress = Math.min(elapsed / duration, 1);

    for(let prop in changes) {
      let value = initialValue[prop] + changes[prop] * progress;
      elem.style[prop] = value + "px";
    }

    if(progress < 1) {
      requestAnimationFrame(animateVerticalPosition);
    } else {
      if(typeof callback === "function") callback();
    }
  })
}

function placeNewGems() {
  let gemsPlaced = 0;

  for (let i = 0; i < config.countColumns; i++) {
    if (components.gems[0][i] == -1) {
      components.gems[0][i] = Math.floor(Math.random() * 8);
      createGem(
        0,
        i * config.gemSize,
        0,
        i,
        config.colorsCoins[components.gems[0][i]]
      );
      gemsPlaced++;
    }
  }

  if (gemsPlaced) {
    config.gameState = config.gameStates[3];
    checkFalling();
  } else {
    let combo = 0;
    for (let i = 0; i < config.countRows; i++) {
      for (let j = 0; j < config.countColumns; j++) {
        if (
          j <= config.countColumns - 3 &&
          components.gems[i][j] == components.gems[i][j + 1] &&
          components.gems[i][j] == components.gems[i][j + 2]
        ) {
          combo++;
          removeGems(i, j);
        }
        if (
          j <= config.countRows - 3 &&
          components.gems[i][j] == components.gems[i + 1][j] &&
          components.gems[i][j] == components.gems[i + 2][j]
        ) {
          combo++;
          removeGems(i, j);
        }
      }
    }

    if (combo > 0) {
      config.gameState = config.gameStates[3];
      gemFade();
    } else {
      config.gameState = config.gameStates[0];
      player.selectedRow = -1;
    }
  }
}
