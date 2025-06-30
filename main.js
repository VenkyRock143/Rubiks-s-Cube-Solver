// Class representing a Rubik's Cube
class RubiksCube {
  constructor() {
    // When a new cube is created, it is reset to the solved state
    this.reset(); 
  }

  // Resets the cube to its original (solved) state
  reset() {
    // Each face is represented by an array of 9 stickers (3x3 grid)
    this.faces = {
      U: Array(9).fill('w'), // Up face (white)
      D: Array(9).fill('y'), // Down face (yellow)
      F: Array(9).fill('g'), // Front face (green)
      B: Array(9).fill('b'), // Back face (blue)
      L: Array(9).fill('o'), // Left face (orange)
      R: Array(9).fill('r')  // Right face (red)
    };
  }

  // Rotates the 3x3 matrix of a face clockwise or counter-clockwise
  rotateFaceMatrix(face, clockwise = true) {
    const f = this.faces[face]; // Get the face array
    // Rearrange indices for rotation
    const rotated = clockwise
      ? [f[6], f[3], f[0], f[7], f[4], f[1], f[8], f[5], f[2]] // Clockwise rotation
      : [f[2], f[5], f[8], f[1], f[4], f[7], f[0], f[3], f[6]]; // Counter-clockwise rotation
    this.faces[face] = rotated; // Save the rotated face
  }

  // Rotates a face and also adjusts its adjacent edges
  rotateFace(face, clockwise = true) {
    this.rotateFaceMatrix(face, clockwise);         // Rotate the face itself
    this.rotateAdjacentEdges(face, clockwise);      // Adjust the surrounding edge pieces
  }

  // Rotates the edge pieces of adjacent faces when a face is turned
  rotateAdjacentEdges(face, clockwise) {
    // Map of each face to the 4 surrounding edges affected when that face is rotated
    const adjacentMap = {
      U: [['B', 0, 1, 2], ['R', 0, 1, 2], ['F', 0, 1, 2], ['L', 0, 1, 2]],
      D: [['F', 6, 7, 8], ['R', 6, 7, 8], ['B', 6, 7, 8], ['L', 6, 7, 8]],
      F: [['U', 6, 7, 8], ['R', 0, 3, 6], ['D', 2, 1, 0], ['L', 8, 5, 2]],
      B: [['U', 2, 1, 0], ['L', 0, 3, 6], ['D', 6, 7, 8], ['R', 8, 5, 2]],
      L: [['U', 0, 3, 6], ['F', 0, 3, 6], ['D', 0, 3, 6], ['B', 8, 5, 2]],
      R: [['U', 8, 5, 2], ['B', 0, 3, 6], ['D', 8, 5, 2], ['F', 8, 5, 2]]
    };

    const map = adjacentMap[face]; // Get the edge mapping for this face

    // Save the current edge pieces that will be rotated
    const temp = map.map(([f, ...idxs]) => idxs.map(i => this.faces[f][i]));

    // Decide how to rotate the edge pieces
    const rotateIdx = clockwise ? (i => (i + 3) % 4) : (i => (i + 1) % 4);

    // Apply the new edge values based on the rotation direction
    map.forEach(([f, ...idxs], i) => {
      const from = temp[rotateIdx(i)];
      idxs.forEach((idx, j) => {
        this.faces[f][idx] = from[j]; // Copy values from the correct neighbor
      });
    });
  }

  // Randomly scrambles the cube by performing a number of random rotations
  scramble(times = 20) {
    const faces = ['U', 'D', 'F', 'B', 'L', 'R']; // All six faces
    for (let i = 0; i < times; i++) {
      const face = faces[Math.floor(Math.random() * 6)]; // Pick a random face
      const clockwise = Math.random() > 0.5;             // Random direction
      this.rotateFace(face, clockwise);                  // Apply rotation
    }
  }

  // Example solve method: performs a fixed set of moves (not a real solver)
  solve() {
    const steps = ['Solving from scrambled...'];
    const moves = [
      ['F', true], ['U', true], ['R', false], ['U', false],
      ['R', true], ['F', false]
    ];

    // Apply each move and store the step description
    moves.forEach(([face, dir], i) => {
      this.rotateFace(face, dir);
      steps.push("Step " + (i+1) + ": " + face + (dir ? "" : "'")); // Add step string
    });

    return steps;
  }

  // Flattens the cube into a single string for visualization
  getFlatColors() {
    const order = ['U', 'R', 'F', 'D', 'L', 'B']; // Display order
    return order.map(f => this.faces[f].join('')).join('');
  }
}

// Helper function: turns the flat cube string into an HTML-friendly format
function getCubeSvg(flatString) {
  return "<pre>" + flatString + "</pre>";
}

// Create a new cube instance
const cube = new RubiksCube();

// Scrambles the cube and displays its current state
function scrambleAndDisplay() {
  cube.scramble();
  document.getElementById("output").innerHTML = getCubeSvg(cube.getFlatColors());
}

// Solves the cube and displays each solving step
function solveAndDisplay() {
  const steps = cube.solve();
  let html = "<h3>Steps:</h3><ul>";
  steps.forEach(step => {
    html += "<li>" + step + "</li>"; // Show each step in a list
  });
  html += "</ul>";
  html += getCubeSvg(cube.getFlatColors()); // Show final cube state
  document.getElementById("output").innerHTML = html;
}

// Resets the cube to the solved state and displays it
function resetAndDisplay() {
  cube.reset();
  document.getElementById("output").innerHTML = getCubeSvg(cube.getFlatColors());
}
