import './style.css';
type GameMap = {
  isBomb: boolean;
  isFlag: boolean;
  isOpen: boolean;
}[][];
let gameMap: GameMap = [];
let width = 23;
let height = 11;
//------------------------
function game() {
  checkSize();
  gameMap = [];
  generateField();
  generateBomb();
  render();
}
function generateField() {
  for (let i = 0; i < width; i++) {
    const rowY = [];
    for (let k = 0; k < height; k++) {
      const field = {
        isBomb: false,
        isFlag: false,
        isOpen: false,
      };
      const rowX = field;
      rowY.push(rowX);
    }

    gameMap.push(rowY);
  }
}

function generateBomb() {
  for (let i = 0; i < width; i++) {
    gameMap[i][Math.round(Math.random() * (height - 1))].isBomb = true;
    gameMap[i][Math.round(Math.random() * (height - 1))].isBomb = true;
    gameMap[i][Math.round(Math.random() * (height - 1))].isBomb = true;
  }
  gameMap[Math.floor(width / 2)][Math.floor(height / 2)].isBomb = false;
  gameMap[Math.floor(width / 2)][Math.floor(height / 2 - 1)].isBomb = false;
  gameMap[Math.floor(width / 2)][Math.floor(height / 2 + 1)].isBomb = false;
  gameMap[Math.floor(width / 2 - 1)][Math.floor(height / 2)].isBomb = false;
  gameMap[Math.floor(width / 2 - 1)][Math.floor(height / 2 - 1)].isBomb = false;
  gameMap[Math.floor(width / 2 - 1)][Math.floor(height / 2 + 1)].isBomb = false;
  gameMap[Math.floor(width / 2 + 1)][Math.floor(height / 2)].isBomb = false;
  gameMap[Math.floor(width / 2 + 1)][Math.floor(height / 2 - 1)].isBomb = false;
  gameMap[Math.floor(width / 2 + 1)][Math.floor(height / 2 + 1)].isBomb = false;
}

function countBombs(y: number, x: number) {
  let numberOfBombs = 0;
  if (gameMap[y + 1]?.[x]?.isBomb === true) {
    numberOfBombs++;
  }
  if (gameMap[y - 1]?.[x]?.isBomb === true) {
    numberOfBombs++;
  }
  if (gameMap[y]?.[x + 1]?.isBomb === true) {
    numberOfBombs++;
  }
  if (gameMap[y]?.[x - 1]?.isBomb === true) {
    numberOfBombs++;
  }
  if (gameMap[y + 1]?.[x + 1]?.isBomb === true) {
    numberOfBombs++;
  }
  if (gameMap[y - 1]?.[x + 1]?.isBomb === true) {
    numberOfBombs++;
  }
  if (gameMap[y - 1]?.[x - 1]?.isBomb === true) {
    numberOfBombs++;
  }
  if (gameMap[y + 1]?.[x - 1]?.isBomb === true) {
    numberOfBombs++;
  }

  return numberOfBombs;
}

function render() {
  const gameField = document.querySelector('.field');
  if (gameField !== null) {
    gameField.innerHTML = '';
  }
  gameField?.setAttribute('style', `grid-template-columns: repeat(${width},1fr); width: ${50 * width}px;`);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const tile = document.createElement('div');
      tile.className = 'tile';
      if (x === Math.floor(width / 2) && y === Math.floor(height / 2)) {
        tile.setAttribute('isMiddle', 'middle');
      }
      tile.onclick = () => tileClick(x, y);
      tile.oncontextmenu = e => {
        e.preventDefault();
        placeFlag(x, y);
      };
      gameField?.appendChild(tile);
      if (gameMap[x][y].isOpen === true) {
        tile.setAttribute('isOpen', 'open');
        if (gameMap[x][y].isBomb === true) {
          tile.innerHTML = '💣';
        } else {
          tile.innerHTML = `${countBombs(x, y)}`;
          if (countBombs(x, y) === 0) {
            setTimeout(() => {
              checkArea(x, y);
            }, 200);
          }
        }
      } else if (gameMap[x][y].isOpen === false) {
        if (gameMap[x][y].isFlag === true) {
          tile.innerHTML = '🚩';
        } else {
          tile.innerHTML = '';
        }
      }
    }
  }
}

function tileClick(yIndex: number, xIndex: number) {
  if (gameMap[yIndex][xIndex].isFlag === true) {
    return;
  }
  if (gameMap[yIndex][xIndex].isBomb === true) {
    lost(yIndex, xIndex);
  } else {
    if (gameMap[yIndex][xIndex].isOpen === false) {
      gameMap[yIndex][xIndex].isOpen = true;
      render();
    }
  }
  checkWin();
}

function placeFlag(yIndex: number, xIndex: number) {
  if (gameMap[yIndex][xIndex].isFlag === false) {
    gameMap[yIndex][xIndex].isFlag = true;
  } else {
    gameMap[yIndex][xIndex].isFlag = false;
  }
  render();
}

function lost(yIndex: number, xIndex: number) {
  for (let k = 0; k < height; k++) {
    if (gameMap[yIndex][xIndex].isBomb === true) {
      game();
      const dialog = document.querySelector('dialog');
      if (dialog) {
        dialog.showModal();
      }
    }
  }
}
function checkWin() {
  if (gameMap.every(a => a.every(b => b.isOpen === true || b.isBomb === true))) {
    const winText = document.querySelector('.winText') as HTMLDialogElement;
    if (winText) {
      winText.showModal();
      game();
    }
  }
}

function checkSize() {
  const gameMapSize = document.querySelector('select');
  if (gameMapSize) {
    if (gameMapSize.value === 'small') {
      width = 11;
      height = 9;
    } else if (gameMapSize.value === 'medium') {
      width = 23;
      height = 11;
    } else {
      width = 37;
      height = 15;
    }
  }
}
function checkArea(x: number, y: number) {
  if (gameMap[x + 0]?.[y + 1]?.isOpen === false) {
    tileClick(x, y + 1);
  }
  if (gameMap[x + 0]?.[y - 1]?.isOpen === false) {
    tileClick(x, y - 1);
  }
  if (gameMap[x + 1]?.[y + 1]?.isOpen === false) {
    tileClick(x + 1, y + 1);
  }
  if (gameMap[x + 1]?.[y - 1]?.isOpen === false) {
    tileClick(x + 1, y - 1);
  }
  if (gameMap[x - 1]?.[y + 1]?.isOpen === false) {
    tileClick(x - 1, y + 1);
  }
  if (gameMap[x - 1]?.[y - 1]?.isOpen === false) {
    tileClick(x - 1, y - 1);
  }
  if (gameMap[x - 1]?.[y + 0]?.isOpen === false) {
    tileClick(x - 1, y);
  }
  if (gameMap[x + 1]?.[y + 0]?.isOpen === false) {
    tileClick(x + 1, y);
  }
}

const options = document.querySelector('.start') as HTMLDialogElement;
options.showModal();
declare global {
  interface Window {
    game: Function;
  }
}
window.game = game;
