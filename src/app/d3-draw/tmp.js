/* TODO: Eventually automate this rather than hardcoding for your example:  https://llimllib.github.io/pymag-trees/ */
/**************************  PROBLEM DIMENSIONS **************************/
var tri_size = 10;
var x_orig = -350;
var y_orig = -250;

var BH = 22, BW = 22; //Single box to fit uppercase font-size = 10

//Intercolumn Gap
var GC = 3*BW;
//Interrow Gap
var GR = 8*BW;

var tb_h = 2*BH; //text-box height

//columns[depth_i].x = cum_sum( columns[:i-1].max_width )

//TODO: Note - setting up this grid is exactly the kind of thing that d3 generators are good for,
// (TODO) however may require some clever thought for operation
//Each entry represents a depth index
var columns = [{
  'max_width':-1,
  'elems': [
    {'x':0, 'y': 0, 'w':-1, 'h': tb_h, 'label': 'Firm'},
    {'x':0, 'y': (3*BH + GR)*1, 'w':-1, 'h': tb_h, 'label': 'User'},
    {'x':0, 'y': (3*BH + GR)*2, 'w':-1, 'h': tb_h, 'label': 'Source'}
  ]
},{
  'max_width':-1,
  'elems': [
    {'x':-1, 'y': (3*BH + GR)*1, 'w':-1, 'h': tb_h, 'label': 'UP'}
  ]
},{
  'max_width': -1,
  'elems': [
    {'x': -1, 'y': (3*BH + GR)*1, 'w': -1, 'h': tb_h, 'label': 'Tag'}
  ]
},{
  'max_width': -1,
  'elems': [
    {'x':-1, 'y': (3*BH + GR)*1, 'w':-1, 'h': tb_h, 'label': 'Image'}
  ]
}];
var edges = [
  {'fromCol':0,'fromRow':0,'toCol':1,'toRow':0},
  {'fromCol':0,'fromRow':0,'toCol':3,'toRow':0},
  {'fromCol':0,'fromRow':1,'toCol':1,'toRow':0},

  {'fromCol':1,'fromRow':0,'toCol':2,'toRow':0},
  {'fromCol':2,'fromRow':0,'toCol':3,'toRow':0},

  {'fromCol':0,'fromRow':2,'toCol':3,'toRow':0},
];

//Calculate the width of each rectangle based on length of text, and set max width
var max = -1;
for (var i=0; i<columns[0].elems.length; i++) {
  columns[0].elems[i].w = (columns[0].elems[i].label.length)*BW + BW;
  if (columns[0].elems[i].w > max)
    max = columns[0].elems[i].w;
}
columns[0].max_width = max;

var sum = 0;

//Now perform the operation of each other column
for (var i=1; i<columns.length;i++){
  sum += columns[i-1].max_width + GC;

  //Same operation we did for the first column across each column-row
  max = -1;
  for (var j=0; j<columns[i].elems.length; j++) {

    columns[i].elems[j].x = sum; //x starts where max width of previous ends (plus some buffer)

    //Calculate width and max-width again
    columns[i].elems[j].w = (columns[i].elems[j].label.length)*BW + BW;
    if (columns[i].elems[j].w > max)
      max = columns[i].elems[j].w;
  }
  columns[i].max_width = max;
}

var getTrianglePoints = function(column,row){
  // Given the column and row, access the data structure at x,y, and proceed from there
  // Returns list of 4 points to draw straight lines between to generate a triangle (start vertex = end vertex)
  var points = [];

  var tipX = columns[column].elems[row].x + columns[column].elems[row].w;
  var tipY = columns[column].elems[row].y + columns[column].elems[row].h/2;

  //One is down/one is up -- depending on your orientation
  var topX = tipX + tri_size;
  var topY = tipY - tri_size/2;

  var botX = tipX + tri_size;
  var botY = tipY + tri_size/2;

  // Draw triangle clockwise;
  points.push({
    'x':topX + x_orig, 'y': topY + y_orig
  });

  points.push({
    'x':tipX + x_orig, 'y': tipY + y_orig
  });

  points.push({
    'x':botX + x_orig, 'y': botY + y_orig
  });

  points.push({
    'x':topX + x_orig, 'y': topY + y_orig
  });
  return points;
};

var getEdgePoints = function(fromColumn,fromRow,toColumn,toRow){
  return [
    {
      'x': columns[fromColumn].elems[fromRow].x + columns[fromColumn].elems[fromRow].w + tri_size + x_orig,
      'y': columns[fromColumn].elems[fromRow].y + columns[fromColumn].elems[fromRow].h/2 + y_orig
    },
    {
      'x': columns[toColumn].elems[toRow].x + x_orig,
      'y': columns[toColumn].elems[toRow].y + columns[toColumn].elems[toRow].h/2 + y_orig
    }
  ];
};

var straightLine = d3.line()
  .x(function(d) { return d.x; })
  .y(function(d) { return d.y; });

//Seems to need a padding of about 4 for text to hit that centerpoint of a box
var center_padding = 4;

// Now you should have everything, so you should be able to loop over each and record position, width, height;
for (var i=0;i<columns.length; i++){
  for (var j=0; j<columns[i].elems.length; j++){
    d3.select("svg")
      .append("rect")
      .attr("id", columns[i].elems[j].label)
      .attr("x", columns[i].elems[j].x + x_orig)
      .attr("y", columns[i].elems[j].y + y_orig)
      .attr("width", columns[i].elems[j].w)
      .attr("height", columns[i].elems[j].h)
      .attr("fill", "blue")
      .attr("stroke", 'black')
      .attr("opacity", '0.5');
    d3.select("svg")
      .append("text")
      .attr("id","l-"+columns[i].elems[j].label)
      .attr("x",columns[i].elems[j].x + x_orig + columns[i].elems[j].w/2)
      .attr("y",columns[i].elems[j].y + y_orig + columns[i].elems[j].h/2 + center_padding)
      .attr("text-anchor",'middle')
      .text( columns[i].elems[j].label );
  }
}
// Next you will need to be able to get triangle points (given grid position (i,j) and 'columns' data structure
var triangles = [];
for (var i=0; i<columns.length - 1; i++){
  for (var j=0; j<columns[i].elems.length; j++){
    triangles.push(
      getTrianglePoints(i,j)
    );
    d3.select("svg")
      .append("path")
      .attr("id", "t"+i+"-"+j)
      .attr("d", straightLine(
        getTrianglePoints(i,j)
      ))
      .attr("stroke", "blue")
      .attr("stroke-width", 1)
      .attr("fill", "none");
  }
}

// Then get 2 endpoints of an edge given 2 grid positions (i,j) and (i',j')
for ( var i = 0; i<edges.length; i++ ){
  edges.push(
    /* There's one more loop in here than their should be */
    getEdgePoints(edges[i].fromCol,edges[i].fromRow,edges[i].toCol,edges[i].toRow)
  );
  d3.select("svg")
    .append("path")
    .attr("id","c1")
    .attr("d", straightLine(
      getEdgePoints(edges[i].fromCol,edges[i].fromRow,edges[i].toCol,edges[i].toRow)
    ))
    .attr("stroke", "blue")
    .attr("stroke-width", 1)
    .attr("fill", "none");
}



/* N.B: Illustrates perfect spacing of letters, etc */
//    var BH = 22, BW = 22; //Single box to fit uppercase font-size = 10
//
//    d3.select("svg")
//        .append("rect")
//        .attr("id", "r" + String.toString(0))
//        .attr("x", 50) //-130 # Note that moving it to the edges makes it unresponsive
//        .attr("y", 50) //+1
//        .attr("width", BW)
//        .attr("height", BH)
//        .attr("fill", "blue")
//        .attr("stroke", 'black')
//        .attr("opacity", '0.5');
//
//    d3.select("svg")
//        .append("text")
//        .attr("id","l1")
//        .attr("x",50+BW/2)
//        .attr("y",50+BH/2+4) //Seems to need a padding of about 4 to hit that centerpoint
//        .attr("text-anchor",'middle')
//        .text("P")
//        .append("tspan")
//        .attr("baseline-shift",'sub')
//        .attr("font-size",10)
//        .text("i");
