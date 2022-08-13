class Cell {
  constructor(i, j) {
    this.i = i;
    this.j = j;
    this.alive = false;
  }

  show() {
    stroke(255);
    strokeWeight(0.2);
    if (this.alive) {
      fill(100, 0, 0);
    } else {
      noFill();
    }
    rect(this.j * size, this.i * size, size, size);
  }

  live() {
    this.alive = true;
  }

  getNeighbours() {
    let count = 0;
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        if (dx == 0 && dy == 0) continue;
        let new_i = (this.i + dy + rows) % rows;
        let new_j = (this.j + dx + cols) % cols;
        // if (new_i >= rows || new_i < 0 || new_j >= cols || new_j < 0) continue;
        if (cells[new_i][new_j].alive) {
          count++;
        }
      }
    }
    return count;
  }
}
