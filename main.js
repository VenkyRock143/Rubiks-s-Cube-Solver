// Class representing a Rubik's Cube and its behavior
class RubiksCube {
  constructor() {
    // Initialize the cube in a solved state when an object is created
    this.reset();

    // To keep track of the scramble moves for solving later
    this.scrambleMoves = [];
  }

  // Reset the cube to the solved state
  reset() {
    // Each face of the cube is represented by an array of 9 color codes
    // 'w' = white, 'y' = yellow, 'g' = green, 'b' = blue, 'o' = orange, 'r' = red
    this.faces = {
      U: Array(9).fill('w'), // Up face
      D: Array(9).fill('y'), // Down face
      F: Array(9).fill('g'), // Front face
      B: Array(9).fill('b'), // Back face
      L: Array(9).fill('o'), // Left face
      R: Array(9).fill('r')  // Right face
    };

    // Clear the history of scramble moves
    this.scrambleMoves = [];
  }

  // Rotate a face of the cube (3x3) either clockwise or counter-clockwise
  rotateFaceMatrix(face, clockwise = true) {
    const f = this.faces[face]; // Get current face

    // New arrangement after rotating the face
    const rotated = clockwise
      ? [f[6], f[3], f[0], f[7], f[4], f[1], f[8], f[5], f[2]] // Clockwise
      : [f[2], f[5], f[8], f[1], f[4], f[7], f[0], f[3], f[6]]; // Counter-clockwise

    this.faces[face] = rotated; // Save rotated face back
  }

  // Rotate a face and its adjacent edge pieces
  rotateFace(face, clockwise = true) {
    this.rotateFaceMatrix(face, clockwise);       // Rotate the selected face
    this.rotateAdjacentEdges(face, clockwise);    // Adjust the edge strips around it
  }

  // Adjust the edges of the neighboring faces when rotating a face
  rotateAdjacentEdges(face, clockwise) {
    // Mapping: defines which edge pieces move when a face is rotated
    const adjacentMap = {
      U: [['B', 0, 1, 2], ['R', 0, 1, 2], ['F', 0, 1, 2], ['L', 0, 1, 2]],
      D: [['F', 6, 7, 8], ['R', 6, 7, 8], ['B', 6, 7, 8], ['L', 6, 7, 8]],
      F: [['U', 6, 7, 8], ['R', 0, 3, 6], ['D', 2, 1, 0], ['L', 8, 5, 2]],
      B: [['U', 2, 1, 0], ['L', 0, 3, 6], ['D', 6, 7, 8], ['R', 8, 5, 2]],
      L: [['U', 0, 3, 6], ['F', 0, 3, 6], ['D', 0, 3, 6], ['B', 8, 5, 2]],
      R: [['U', 8, 5, 2], ['B', 0, 3, 6], ['D', 8, 5, 2], ['F', 8, 5, 2]]
    };

    const map = adjacentMap[face]; // Get edges for this face

    // Save the edges before rotating
    const temp = map.map(([f, ...idxs]) => idxs.map(i => this.faces[f][i]));

    // Determine which direction to rotate edges
    const rotateIdx = clockwise ? (i => (i + 3) % 4) : (i => (i + 1) % 4);

    // Rotate and assign new values to the edge pieces
    map.forEach(([f, ...idxs], i) => {
      const from = temp[rotateIdx(i)];
      idxs.forEach((idx, j) => {
        this.faces[f][idx] = from[j];
      });
    });
  }

  // Scramble the cube using a series of random face rotations
  scramble(times = 20) {
    const faces = ['U', 'D', 'F', 'B', 'L', 'R']; // All cube faces
    this.scrambleMoves = []; // Reset the scramble move history

    for (let i = 0; i < times; i++) {
      const face = faces[Math.floor(Math.random() * 6)]; // Random face
      const clockwise = Math.random() > 0.5;             // Random direction
      this.rotateFace(face, clockwise);                  // Perform rotation
      this.scrambleMoves.push([face, clockwise]);        // Save move
    }
  }

  // Solves the cube by reversing the scramble (not optimal, but functional)
  solve() {
    const steps = ['Solving...'];

    // Reverse the scramble moves and apply them in reverse direction
    const reverseMoves = this.scrambleMoves.slice().reverse().map(
      ([face, dir]) => [face, !dir]
    );

    // Apply each reverse move and record the steps
    reverseMoves.forEach(([face, dir], i) => {
      this.rotateFace(face, dir); // Undo the scramble step
      steps.push(`Step ${i + 1}: ${face}${dir ? '' : "'"}`); // Add to log
      steps.push(getCubeSvg(this.getFlatColors())); // Show cube after each move
    });

    return steps;
  }

  // Convert the cube's face colors into a single string for display
  getFlatColors() {
    const order = ['U', 'R', 'F', 'D', 'L', 'B']; // Display order
    return order.map(f => this.faces[f].join('')).join('');
  }
}

// Display cube as preformatted colored string (simple visualization)
function getCubeSvg(flatString) {
  return "<pre>" + flatString + "</pre>";
}

// Create a new cube object
const cube = new RubiksCube();

// Function to scramble and show cube
function scrambleAndDisplay() {
  cube.scramble(); // Randomize the cube
  document.getElementById("output").innerHTML = getCubeSvg(cube.getFlatColors());
}

// Function to solve the cube and show each step
function solveAndDisplay() {
  const steps = cube.solve(); // Get solving steps
  let html = "<h3>Solution Steps:</h3>";
  steps.forEach(step => {
    // Use bold text for step descriptions, plain for visuals
    html += step.includes("Step") ? `<p><strong>${step}</strong></p>` : step;
  });
  document.getElementById("output").innerHTML = html;
}

// Function to reset the cube and show solved state
function resetAndDisplay() {
  cube.reset(); // Go back to solved state
  document.getElementById("output").innerHTML = getCubeSvg(cube.getFlatColors());
}
