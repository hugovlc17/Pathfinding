const grid = [
  [4,4,5,4,4,3,2,4,2,5,1,4,3,3,1,3,2,2,2,2],
  [3,4,1,3,1,4,3,2,4,3,4,2,1,5,1,4,5,4,4,1],
  [2,1,3,3,1,4,5,1,3,5,3,2,2,4,3,3,4,5,1,4],
  [2,4,-1,3,2,-1,-1,-1,-1,-1,3,2,3,4,4,4,5,5,4,4],
  [2,1,4,2,4,-1,2,3,1,5,1,1,5,3,1,1,2,5,5,4],
  [3,1,5,2,5,-1,3,1,5,1,1,3,3,5,2,4,2,4,1,5],
  [5,1,4,5,5,-1,3,3,3,3,4,-1,1,1,3,-1,5,4,5,4],
  [2,2,1,4,2,-1,3,3,1,4,5,-1,4,1,2,-1,1,3,2,4],
  [2,5,4,5,2,-1,5,2,4,-1,-1,-1,5,1,3,-1,-1,-1,-1,3],
  [1,4,1,3,1,-1,-1,-1,3,5,1,4,5,4,3,-1,5,2,3,4],
  [3,3,3,1,3,4,1,-1,1,3,3,4,5,1,5,-1,5,1,3,4],
  [2,2,3,2,1,5,3,-1,5,5,2,5,5,5,1,5,4,2,3,4],
  [2,5,1,3,5,1,4,-1,3,2,5,2,4,1,2,5,1,4,2,5],
  [1,4,4,3,3,1,2,-1,1,2,3,1,-1,-1,-1,4,3,4,4,1],
  [1,5,3,2,3,3,3,-1,4,5,2,3,1,2,4,2,5,3,1,2],
  [3,1,1,4,-1,-1,-1,-1,3,4,3,3,2,3,3,3,2,4,4,1],
  [5,2,5,2,2,2,5,4,2,2,5,2,2,4,5,1,3,4,3,5],
  [2,1,5,2,1,4,3,5,2,1,5,5,3,3,5,4,3,3,4,1],
  [2,1,5,2,5,1,4,3,3,1,3,5,1,1,1,1,1,4,3,1],
  [2,2,1,5,2,3,4,3,1,2,3,1,2,3,3,2,5,5,4,1]
];

var strategicPoints = [
  { pt : [1,1], status : true},
  { pt : [11,11], status : false},
  { pt : [12,5], status : true},
  { pt : [5,7], status : false},
  { pt : [16,13], status : false},
  { pt : [2,14], status : true},
  { pt : [1,18], status : true } 
];

const pointsOfInterest = [
  { pt : [6, 1], value : 18, use : false},
  { pt : [18, 1], value : 12, use : false},
  { pt : [1, 6], value : 13, use : false},
  { pt : [13, 10], value : 9, use : false},
  { pt : [4, 12], value : 25, use : false},
  { pt : [5, 17], value : 8, use : false},
  { pt : [16, 18], value : 5, use : false},
];

const dataset =[ 
  {startPt : [1,1], endPt : [12,5], path : [], cost : 0},
  {startPt : [1,1], endPt : [2,14], path : [], cost :  0},
  {startPt : [1,1], endPt : [1,18], path : [], cost :  0},
  {startPt : [12,5], endPt : [1,1], path : [], cost :  0},
  {startPt : [12,5], endPt : [2,14], path : [], cost :  0},
  {startPt : [12,5], endPt : [1,18], path : [], cost : 0},
  {startPt : [2,14], endPt : [1,1], path : [], cost : 0},
  {startPt : [2,14], endPt : [12,5], path : [], cost : 0 },
  {startPt : [2,14], endPt : [1,18], path : [], cost : 0 },
  {startPt : [1,18], endPt : [1,1],path : [], cost : 0 },
  {startPt : [1,18], endPt : [12,5], path : [], cost : 0},
  {startPt : [1,18], endPt : [2,14],path : [], cost : 0 }
];



var finalpath = [];
var totalPoints = 0;
var lostPt = 0;
var ptWin = 0;
var startPt = [18,10];


var firstPeak = [];
var pathPtStrat = [];
var costBestPath = Infinity;

var pathsBetweenPtStrat;
var bestPathPtStrat;



function dijkstra(grid, start, end) {
  const nrows = grid.length;
  const ncols = grid[0].length;
  
  const distances = [];
  for(let i = 0; i < nrows; i++) {
    distances[i] = [];
    for(let j = 0; j < ncols; j++) {
      distances[i][j] = Infinity;
    }
  }
  distances[start[0]][start[1]] = 0;
  
  const heap = [[0, start]];
  
  const visited = new Set();
  const predecessors = {};
  
  while (heap.length > 0) {
    const [dist, node] = heap.shift();

    if (visited.has(node))
    {
      continue;
    }
  
    if (node[0] === end[0] && node[1] === end[1]) {
      const path = getPath(predecessors, end);
      return {
        path: path.path,
        cost: path.cost
      };
    }
  
    visited.add(node);
  
    const neighbors = getNeighbors(node, grid);
    for (const neighbor of neighbors) {
      const [i, j] = neighbor;
      const newDist = dist + grid[i][j];
      if (newDist < distances[i][j]) {
        distances[i][j] = newDist;
        predecessors[neighbor] = node;
        heap.push([newDist, neighbor]);
      }
    }
  
    heap.sort((a, b) => a[0] - b[0]);
  }
  
  return null;
}

function getPath(predecessors, end) {
  const path = [];
  let node = end;
  let cost = 0;
  while (predecessors.hasOwnProperty(node)) {
      path.unshift(node);
      const pred = predecessors[node];
      cost += Math.abs(node[0] - pred[0]) + Math.abs(node[1] - pred[1]);
      node = pred;
  }
  path.unshift(node);
  return {
    path: path,
    cost: cost
  };
}

function getNeighbors(pos, grid) {
  const neighbors = [];
  const nbrRows = grid.length;
  const nbrCols = grid[0].length;
  const row = pos[0];
  const col = pos[1];
 
  if (row > 0 && grid[row-1][col] !== -1) neighbors.push([row - 1, col]);
  if (row < nbrRows - 1 && grid[row+1][col] !== -1) neighbors.push([row + 1, col]);
  if (col > 0 && grid[row][col-1] !== -1) neighbors.push([row, col - 1]);
  if (col < nbrCols - 1 && grid[row][col+1] !== -1) neighbors.push([row, col + 1]);

  return neighbors;

}


//Construction du dataset
for (const data of dataset) {
  const result = dijkstra(grid, data.startPt, data.endPt);
  data.path = result.path;
  data.cost = result.cost;
}





//trouver le chemin le plus court vert un des pt strategiques
for(var i = 0; i < strategicPoints.length; i++){
  if(strategicPoints[i].status == true){
    var result = dijkstra(grid, startPt, strategicPoints[i].pt);
    if(result.cost < costBestPath){
      costBestPath = result.cost;
      bestPathPtStrat = result.path;
      firstPeak = strategicPoints[i].pt; //on garde le Pt strategique 
    }
  }
}

//ajout du chemin au total + ajout du cout du chemin
lostPt += costBestPath;
finalpath.push(bestPathPtStrat);


function orderOfPtStrat(strategicPoints, startPoint) { //trouve tous les chemins possible entre un point strategique de depart et tous les autres
  var paths = [];

  function permute(points, path) {
    if (points.length === 0) {
      var newPath = [];
      for (var i = 0; i < path.length; i++) {
        newPath.push(path[i].pt);
      }
      paths.push(newPath);
      return;
    }

    for (var i = 0; i < points.length; i++) {
      var currentPoint = points[i];
      var remainingPoints = [];
      for (var j = 0; j < points.length; j++) {
        if (j !== i) {
          remainingPoints.push(points[j]);
        }
      }

      permute(remainingPoints, path.concat(currentPoint));
    }
  }

  var validPoints = [];
  for (var i = 0; i < strategicPoints.length; i++) {
    if (strategicPoints[i].status) {
      validPoints.push(strategicPoints[i]);
    }
  }

  // Find the starting point
  var startPointIndex = validPoints.findIndex(function(point) {
    return point.pt[0] === startPoint[0] && point.pt[1] === startPoint[1];
  });

  if (startPointIndex !== -1) {
    var startPointObject = validPoints[startPointIndex];
    validPoints.splice(startPointIndex, 1); // Retirer le point de départ des points valides
    permute(validPoints, [startPointObject]);
  }

  return paths;
}

pathsBetweenPtStrat = orderOfPtStrat(strategicPoints, firstPeak);


function findBestPath(paths, dataset) { //trouve le meilleur chemin entre les pt strategiques
  var bestPath = null;
  var lowestCost = Infinity;

  for (var i = 0; i < paths.length; i++) {
    var currentPath = paths[i];
    var currentCost = 0;

    for (var j = 0; j < currentPath.length - 1; j++) {
      var startPoint = currentPath[j];
      var endPoint = currentPath[j + 1];

      var matchingEntry = dataset.find(function(entry) {
        return (
          entry.startPt[0] === startPoint[0] &&
          entry.startPt[1] === startPoint[1] &&
          entry.endPt[0] === endPoint[0] &&
          entry.endPt[1] === endPoint[1]
        );
      });

      if (matchingEntry) {
        currentCost += matchingEntry.cost;
      }
    }

    if (currentCost < lowestCost) {
      lowestCost = currentCost;
      bestPath = currentPath;
    }
  }

  return bestPath;
}


pathPtStrat = findBestPath(pathsBetweenPtStrat, dataset);


//determiner l'itineraire et le cout total du chemin entre les pt strategiques
for(var i = 0; i < pathPtStrat.length; i++){
    for(var j = 0; j < dataset.length; j++){
      if(JSON.stringify(dataset[j].startPt) == JSON.stringify(pathPtStrat[i]) && JSON.stringify(dataset[j].endPt) == JSON.stringify(pathPtStrat[i+1])){ // JSON.stringify converti un table en chaine de caracteres
        //Ajouter valeur au resultat final
        finalpath.push(dataset[j].path);
        lostPt += dataset[j].cost
      }
    }
}

//calcule points gagner
ptWin += pathPtStrat.length*30; // +30 pour chaque point strategique

for(var i = 0; i < finalpath.length; i++){ //parcourir chaque cellule visite
  for(var j = 0; j < finalpath[i].length; j++){
    for(var k = 0; k < pointsOfInterest.length; k++){
      if(JSON.stringify(finalpath[i][j]) == JSON.stringify(pointsOfInterest[i].pt) && pointsOfInterest[i].use == false ){
        pointsOfInterest[i].use = true;
        ptWin += pointsOfInterest[i].value;
      }
    }
  }
}


totalPoints = ptWin - lostPt;


console.log('TOTAL path : ', finalpath );
console.log('Total des points: ', totalPoints);
