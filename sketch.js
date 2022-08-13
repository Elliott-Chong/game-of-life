// util function
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// actual
let size = 20;
let cols = 60;
let rows = 40;
let cells = new Array();
let has_started = false;
let generation = 0;

// controls
let delay = 50;

// html controls
let start_btn;
let speed_slider;

// other
let inter;

function setup() {
  createCanvas(size * cols, size * rows).parent(select("#canvas"));
  start_btn = createButton("Start");
  let reset_btn = createButton("Reset");
  reset_btn.parent(select("#reset-btn"));
  reset_btn.elt.onclick = reset;
  speed_slider = createSlider(1, 10, 5);
  speed_slider.parent(select("#speed"));
  speed_slider.input(() => {
    delay = map(speed_slider.value(), 1, 10, 100, 10);
    if (has_started) {
      clearInterval(inter);
      inter = setInterval(start, delay);
    }
  });
  start_btn.parent(select("#start-btn"));
  start_btn.elt.onclick = async () => {
    if (!has_started) {
      start_btn.html("Stop");
      inter = setInterval(start, delay);
    } else {
      clearInterval(inter);
      start_btn.html("Start");
    }
    has_started = !has_started;
  };
}

function reset() {
  start_btn.html("Start");
  has_started = false;
  speed_slider.value(5);
  cells = new Array();
  for (let i = 0; i < Math.floor(height / size); i++) {
    let row = new Array();
    for (let j = 0; j < Math.floor(width / size); j++) {
      row.push(new Cell(i, j));
    }
    cells.push(row);
  }
  start();
  generation = 0;
  select("#generation").html(0);
  clearInterval(inter);
}

function draw() {
  background(126);
  noFill();
  frameRate(60);

  for (let i = 0; i < Math.floor(height / size); i++) {
    let row = new Array();
    for (let j = 0; j < Math.floor(width / size); j++) {
      row.push(new Cell(i, j));
    }
    cells.push(row);
  }

  for (let i = 0; i < Math.floor(height / size); i++) {
    for (let j = 0; j < Math.floor(width / size); j++) {
      cells[i][j].show();
    }
  }
  translate(30, 30);
}

function mousePressed() {
  if (has_started) return;
  let i = Math.floor(mouseY / size);
  let j = Math.floor(mouseX / size);
  if (i >= rows || i < 0 || j >= cols || j < 0) return;
  cells[i][j].live();
}

function start() {
  let new_state = new Array();
  for (let i = 0; i < rows; i++) {
    let row = new Array();
    for (let j = 0; j < cols; j++) {
      if (cells[i][j].alive) {
        row.push(true);
      } else {
        row.push(false);
      }
    }
    new_state.push(row);
  }

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      let cell = cells[i][j];
      if (cell.alive) {
        // find the number of neighbours
        let neighbour_count = cell.getNeighbours();
        if (neighbour_count <= 1) {
          new_state[i][j] = false;
        }

        if (neighbour_count >= 4) {
          new_state[i][j] = false;
        }
      } else {
        // cell is not alive, check if it can repopulate
        let neighbour_count = cell.getNeighbours();
        if (neighbour_count == 3) {
          new_state[i][j] = true;
        }
      }
    }
  }

  // update board
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (new_state[i][j]) {
        cells[i][j].alive = true;
      } else {
        cells[i][j].alive = false;
      }
    }
  }
  generation++;
  select("#generation").html(generation);
}
