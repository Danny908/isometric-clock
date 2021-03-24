// Global variables...
const zoneCols = 3;
const zoneRows = 5;
let is24 = false;
// Board number zones...
const digitOne = 1;
const digitTwo = 5;
const digitThree = 11;
const digitFour = 15;
// Not supported values on "number zone"...
const not_supported = [
  ['1', '14', ''],
  ['1237', '0123456789', '56'],
  ['17', '017', ''],
  ['134579', '0123456789', '2'],
  ['1479', '1479', ''],
];

function init() {
  const rows = 7;
  const cols = 24;
  const subcols = 9;
  const accuracy = '500ms';
  // Board initialization...
  const board = createBoard('board', 'tile', rows, cols);
  const subboard = createBoard('subboard', 'subtile', rows, subcols);
  // Make clock draggable...
  board.style.webkitAppRegion = 'drag';
  // Attach subboard to board...
  board.append(subboard);
  // Attach board to document body...
  document.body.append(board);
  // Get computer time...
  setInterval(getClientTime, accuracy);
}

function createBoard(boardName, dataName, rows, cols) {
  // Board ref...
  const boardRef = document.createElement('div');
  // Tiles list...
  // Populate board with tiles...
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      // Custom data-* attr for query purposes...
      const tile = document.createElement('div');
      tile.setAttribute(`data-${dataName}`, `${row}-${col}`);
      boardRef.append(tile);
    }
  }
  // Set class to board..
  boardRef.className = boardName;
  // Return board ref...
  return boardRef;
}

function getClientTime() {
  // Get current time...
  const now = new Date();
  // Convert to 24 if need it...
  const preFormattedhours =
    !is24 && now.getHours() > 12 ? now.getHours() - 12 : now.getHours();
  // Set time variables...
  const hours =
    preFormattedhours > 9
      ? `${preFormattedhours}`.split('')
      : ['0', preFormattedhours];
  const minutes =
    now.getMinutes() > 9
      ? `${now.getMinutes()}`.split('')
      : ['0', now.getMinutes()];
  const seconds =
    now.getSeconds() > 9
      ? `${now.getSeconds()}`.split('')
      : ['0', now.getSeconds()];

  // Draw time on specific time zone board...
  drawNumber('tile', hours[0], digitOne);
  drawNumber('tile', hours[1], digitTwo);
  drawNumber('tile', minutes[0], digitThree);
  drawNumber('tile', minutes[1], digitFour);
  drawNumber('subtile', seconds[0], digitOne);
  drawNumber('subtile', seconds[1], digitTwo);
}

// Draw number on board...
function drawNumber(query, number, colZone) {
  const numRow = 1;
  for (const [indexR, _rows] of not_supported.entries()) {
    for (const [indexC, _col] of _rows.entries()) {
      const tile = document.querySelector(
        `[data-${query}="${numRow + indexR}-${colZone + indexC}"]`
      );
      tile.className = !_col.includes(number) ? 'active' : '';
    }
  }
}

function listenTimeFormat() {
  // Data emited from main process...
  window['api']?.receive('24TimeFormat', (data) => {
    // Update clock...
    is24 = data;
    getClientTime();
  });
}

// Init clock...
init();
// Register listener for time format...
listenTimeFormat();
