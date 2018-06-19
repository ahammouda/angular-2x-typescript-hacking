import { Component, OnInit } from '@angular/core';

import * as d3 from 'd3';

import { Rectangle } from './Rectangle';
import { GridPoint } from './GridPoint';

import { PathTransition } from './PathTransition';

import { Frame } from './Frame';
import { RenderItem } from './RenderItem';
import {text} from "@angular/core/src/render3/instructions";
import {isNullOrUndefined} from "util";

const straightLine = d3.line()
  .x(function(d) { return d.x; })
  .y(function(d) { return d.y; });

const arcLine = d3.line()
  .x(function(d) { return d.x; })
  .y(function(d) { return d.y; })
  .curve(d3.curveBasis);


@Component({
  selector: 'app-d3-draw',
  templateUrl: './d3-draw.component.html',
  styleUrls: ['./d3-draw.component.css']
})
export class D3DrawComponent implements OnInit {
  x_orig = -350;
  y_orig = -250;

  // Defines grid element size in pixels for single coordinate in cartesian place
  BH = 22; BW = 22; // Single box to fit uppercase font-size = 10

  svg: any; // This grid

  /* Arbitrary distances between boxes or circles drawn */
  // Intercolumn Gap
  GC = 3 * this.BW;
  // Interrow Gap
  GR = 8 * this.BW;

  // Text Seems to need a padding of about 4 pixels for text to hit that centerpoint of a box
  center_padding = 4;

  TB_H = 2 * this.BH; // text-box height
  ARROW_LEN = 10; // static size of arrow tip

  rectangles: Array<Rectangle> = [];

  frames: Array<Frame> = [];

  constructor() { }

  constructFrameOne() {
    const frame1 = new Frame();

    this.rectangles.push(
      // id x, y, rx, ry, width, height, fill, label
      new Rectangle('r-0', 0, 0, 0, 0, null, this.TB_H, 'blue', 'Firm')
    );
    this.rectangles.push(
      // id x, y, rx, ry, width, height, fill, label
      new Rectangle('r-1', 0, this.TB_H * 4, 0, 0, null, this.TB_H, 'blue', 'Image')
    );

    for (let i = 0; i < this.rectangles.length; i++) {
      this.setWidth(this.rectangles[i]);
      const itemArray: Array<RenderItem> = this.textBoxToRenderItems(this.rectangles[i]);
      for (let j = 0; j < itemArray.length; j++) {
        frame1.addItem(itemArray[j]);
      }
    }

    const source = this.getEdgeCoordinate(this.rectangles[0], true, false);
    const target: GridPoint = this.getEdgeCoordinate(this.rectangles[1], false, false);

    /* Draw edge */
    // First draw arrow head and adjust the target x position (always assuming horizontal edges)
    const arrow_points: Array<GridPoint> = this.getArrowHead(target);
    // this.drawStraightEdge(arrow_points, 'tip-0');
    frame1.addItem(
      this.straightEdgeRenderItem(arrow_points, 'tip-0')
    );
    target.x = target.x + this.ARROW_LEN;

    // Then draw line b/w
    const edge: Array<GridPoint> = this.getJaggedEdge(source, target); // Get auxillary grid points
    // this.drawStraightEdge(edge, 'edge1'); // Then draw them
    frame1.addItem(
      this.straightEdgeRenderItem(edge, 'edge1')
    );

    // TODO: You need to refactor this, and determine how many renderItems this bbox will represent
    // this.attachBBox(this.rectangles[1], 'id'); // Testing...
    // this.attachBBox(this.rectangles[0], 'FK'); // Testing...

    let items = this.attachBBoxRenderItems(
      this.rectangles[1], 'id'
    );
    for (let i = 0; i < items.length; i++){
      frame1.addItem(items[i]);
    }
    items = this.attachBBoxRenderItems(
      this.rectangles[0], 'FK'
    );
    for (let i = 0; i < items.length; i++){
      frame1.addItem(items[i]);
    }
    frame1.render();
  }

  ngOnInit() {
    this.svg = d3.select('div#d3-draw')
      .append('svg')
      .attr('viewBox', '-350 -250 700 500')
      .classed('svg-content', true);

    this.constructFrameOne();
    /* ************************************************************************************************************* */
    // // TODO: Everything below should be put in it's own function or class, so you can set timeout on the whole process
    // //       at once
    // // Transition steps:
    // //  1.) Remove All text but one letter from the text box and transition its width
    // // Adjust text and resize text box
    // this.rectangles[0].label = 'F';
    // this.rectangles[1].label = 'I';
    // this.rectangles[0].rx = 100;
    // this.rectangles[0].ry = 100;
    // this.rectangles[1].rx = 100;
    // this.rectangles[1].ry = 100;
    //
    // for (let i = 0; i < this.rectangles.length; i++) {
    //   this.setWidth(this.rectangles[i]);
    // }
    // for (let i = 0; i < this.rectangles.length; i++) {
    //   this.rectangles[i].transition(this.x_orig, this.y_orig, this.center_padding);
    // }
    // // this.rectangles[0].toCircle();
    // // this.rectangles[1].toCircle();
    // // // d3.select(`svg rect#${this.rectangles[0].id}`)
    // // //   .transition()
    // // //   .duration(500)
    // // //   .attr('width', this.rectangles[0].width);
    // // //
    // // // d3.select(`svg text#l-${this.rectangles[0].id}`)
    // // //   .transition()
    // // //   .attr('x', this.rectangles[0].x + this.x_orig + this.rectangles[0].width / 2)
    // // //   .attr('y', this.rectangles[0].y + this.y_orig + this.rectangles[0].height / 2 + this.center_padding)
    // // //   .text( this.rectangles[0].label );
    //
    // //  2.) Slide arrow points from the bBox to the text-box
    // //  3.) Transition straight edge to Arc
    // const new_source = this.getEdgeCoordinate(this.rectangles[0], true, true);
    // const new_target: GridPoint = this.getEdgeCoordinate(this.rectangles[1], false, true);
    //
    // /* Draw edge */
    // // First draw arrow head and adjust the target x position (always assuming horizontal edges)
    //
    // const new_arrow_points: Array<GridPoint> = this.getArrowHead(new_target);
    // new_target.x = new_target.x + this.ARROW_LEN;  // Undo last update to this
    //
    // // Then draw line b/w
    // const new_edge: Array<GridPoint> = this.getCurvedEdge(new_source, new_target); // Get auxillary grid points
    //
    // const t1 = new PathTransition('svg path#tip-0', new_arrow_points); // Seems we need absolute id specification here
    // const t2 = new PathTransition('svg path#edge1', new_edge);
    // t1.transition(straightLine);
    // t2.transition(arcLine);
    //
    // //  4.) Remove the bBox
    //
    // // Remove bbox TODO - add the rest of this logic
    // // This id is not an input to any creation function.  Any drawable created should have accessor methods to it's element
    // // ID or IDs
    // this.removeElement('svg text#l-key');
    // this.removeElement( 'svg text#l-value');
    // this.removeElement( 'svg rect#bbox-0');
    // this.removeElement( 'svg path#bar-0');
    //
    // // TODO  6.) Transition circles to different order
    //
    // // TODO  7.) Transition circles back to rectangles with dependency layout
  }

  removeElement(id: string) {
    d3.selectAll( id )
      .transition()
      .duration(1000)
      .remove();
  }

  /**
   * @rectangle
   * @isSource if true is a source node coordinate (if false is a target node coordinate)
   * @fromRect if true implies you're pointing from the text box (rectangle) if false => pointing from it's bBox
   * */
  getEdgeCoordinate(rectangle: Rectangle, isSource: boolean, fromRect: boolean) {
    if (isSource) {
      let source: GridPoint;
      if (fromRect) {
        source = {
          x: rectangle.x + rectangle.width,
          y: rectangle.y + rectangle.height / 2
        };
      } else {
        source = {
          x: rectangle.x + rectangle.width,
          y: rectangle.y + rectangle.height + this.BH / 2
        };
      }
      return source;
    } else {
      let target: GridPoint;
      if (fromRect) {
        target = {
          x: rectangle.x + rectangle.width,
          y: rectangle.y + rectangle.height / 2
        };
      } else {
        target = {
          x: rectangle.x + rectangle.width,
          y: rectangle.y + rectangle.height + this.BH / 2
        };
      }
      return target;
    }
  }

  getArrowHead(tip: GridPoint) {
    const points: Array<GridPoint> = [];
    // One is down/one is up -- depending on your orientation
    const top: GridPoint = {
      x: tip.x + this.ARROW_LEN + this.x_orig,
      y: tip.y - this.ARROW_LEN / 2 + this.y_orig
    };

    const bottom: GridPoint = {
      x: tip.x + this.ARROW_LEN + this.x_orig,
      y: tip.y + this.ARROW_LEN / 2 + this.y_orig
    };

    // Draw triangle clockwise;
    points.push(top);
    // Adjust the tip for the svg origin without modifying -- should be better way to enforce this
    points.push({
      x: tip.x + this.x_orig,
      y: tip.y + this.y_orig
    });
    points.push(bottom);
    points.push(top);

    return points;
  }

  drawStraightEdge(points: Array<GridPoint>, id: string = 'foo') {

    d3.select('svg')
      .append('path')
      .attr('id', id)
      .attr('d', straightLine(points) )
      .attr('stroke', 'blue')
      .attr('stroke-width', 1)
      .attr('fill', 'none');

    // If each attribute where in a list, you could do this by calling something like this:
    // let selection = d3.select('svg').append('path');
    // for (let i = 0; i < 5; i++) {
    //   selection = selection.attr(kvs[i].key,kvs[i].value);
    // }
    // Text elements will be a little different because they'll end with .text( '' )
  }

  /**
   * @s source point
   * @p target point
   * @arc_left arc direction
   * given input, draw 2 grid points source and target */
  getJaggedEdge(s: GridPoint, t: GridPoint, arc_left: Boolean = false) {
    const points: Array<GridPoint> = [];
    const buffer = 12;
    let x2: number = null;

    if (s.y === t.y) {
      points.push({
        x: s.x + this.x_orig,
        y: s.y + this.y_orig
      });
      points.push({
        x: t.x + this.x_orig,
        y: t.y + this.y_orig
      });
    } else {
      if (arc_left) {
        x2 = Math.min(s.x, t.x) - buffer;
      } else {
        x2 = Math.max(s.x, t.x) + buffer;
      }
      points.push({
        x: s.x + this.x_orig,
        y: s.y + this.y_orig
      });
      points.push({
        x: x2 + this.x_orig,
        y: s.y + this.y_orig
      });
      points.push({
        x: x2 + this.x_orig,
        y: t.y + this.y_orig
      });
      points.push({
        x: t.x + this.x_orig,
        y: t.y + this.y_orig
      });
    }
    return points;
  }

  /**
   * @s source point
   * @p target point
   * @arc_left arc direction
   * given input, draw 1 GridPoint b/w source and target
   * Always assumes 2 nodes are above each other */
  getCurvedEdge(s: GridPoint, t: GridPoint, arc_left: Boolean = false) {
    const points: Array<GridPoint> = [];
    const buffer = 12;
    let x2: number = null;

    if (arc_left) {
      x2 = Math.min(s.x, t.x) - buffer;
    } else {
      x2 = Math.max(s.x, t.x) + buffer;
    }
    points.push({
      x: s.x + this.x_orig,
      y: s.y + this.y_orig
    });
    points.push({
      x: x2 + this.x_orig,
      y: s.y + (t.y - s.y) / 2 + this.y_orig // Midpoint
    });
    points.push({
      x: t.x + this.x_orig,
      y: t.y + this.y_orig
    });
    return points;
  }

  setWidth(rectangle) {
    rectangle.width = rectangle.label.length * this.BW + this.BW;
  }

  // drawTextBox(rectangle: Rectangle) {
  //   d3.select('svg')
  //     .append('rect')
  //     .attr('id', rectangle.id)
  //     .attr('rx', rectangle.rx)
  //     .attr('ry', rectangle.ry)
  //     .attr('x', rectangle.x + this.x_orig)
  //     .attr('y', rectangle.y + this.y_orig)
  //     .attr('width', rectangle.width)
  //     .attr('height', rectangle.height)
  //     .attr('fill', rectangle.color)
  //     .attr('stroke', 'black')
  //     .attr('opacity', '0.5');
  //   d3.select('svg')
  //     .append('text')
  //     .attr('id', `l-${rectangle.id}`)
  //     .attr('x', rectangle.x + this.x_orig + rectangle.width / 2)
  //     .attr('y', rectangle.y + this.y_orig + rectangle.height / 2 + this.center_padding)
  //     .attr('text-anchor', 'middle')
  //     .text( rectangle.label );
  // }

  // attachBBox(rectangle: Rectangle, keyStr: string) {
  //   // Creating the box
  //   // This state gets lost short of referencing the overwritten label
  //   const bbox: Rectangle = {
  //     id: 'bbox-0',
  //     x: 0,
  //     y: rectangle.y + rectangle.height,
  //     width: rectangle.width,
  //     height: this.TB_H * 2,
  //     color: 'green',
  //     label: 'below'
  //   };
  //
  //   // Creating the bar
  //   const line_points: Array<GridPoint> = [];
  //   line_points.push({
  //     x: bbox.x + this.BW * 2 + this.x_orig,
  //     y: bbox.y + this.y_orig
  //   });
  //   line_points.push({
  //     x: bbox.x + this.BW * 2 + this.x_orig,
  //     y: bbox.y + bbox.height + this.y_orig
  //   });
  //   // Drawing the bar
  //   this.drawStraightEdge(line_points, 'bar-0');
  //   // Drawing the box
  //   // this.drawTextBox(bbox);
  //   this.drawBBox(bbox, keyStr);
  // }
  //
  // drawBBox(rectangle: Rectangle, keyStr: string) {
  //   const val_buf = 4;
  //
  //   d3.select('svg')
  //     .append('rect')
  //     .attr('id', rectangle.id)
  //     .attr('rx', rectangle.rx)
  //     .attr('ry', rectangle.ry)
  //     .attr('x', rectangle.x + this.x_orig)
  //     .attr('y', rectangle.y + this.y_orig)
  //     .attr('width', rectangle.width)
  //     .attr('height', rectangle.height)
  //     .attr('fill', rectangle.color)
  //     .attr('stroke', 'black')
  //     .attr('opacity', '0.5');
  //
  //   /* Draw Labels - SHOULD BE ABLE TO PARAMETERIZE THIS TO PERFORM OPS FOR ARBITRARY N-ROWS/COLS of 'theoretical data' */
  //   // Key Label
  //   d3.select('svg')
  //     .append('text')
  //     .attr('id', `l-key`)
  //     .attr('x', rectangle.x + this.x_orig + val_buf ) // ** THIS + rectangle.width - val_buf could be the new source 'x'
  //     .attr('y', rectangle.y + this.y_orig + this.BH )  // ** This could be the new source (+/- this.BH/2) 'y'
  //     .attr('text-anchor', 'start')
  //     .text( keyStr );
  //     // .append('tspan')
  //     // .attr('baseline-shift', 'sub')
  //     // .attr('font-size', 10)
  //     // .text('0')
  //     // .select(function() {
  //     //   return this.parentNode;
  //     // })
  //     // .insert('tspan')
  //     // .text( ':' );
  //
  //
  //   // Value Label (should be able to generalize and parameterize this in  a function for spitting out values)
  //   d3.select('svg')
  //     .append('text')
  //     .attr('id', `l-value`)
  //     .attr('x', rectangle.x + this.x_orig + this.BW * 2 + val_buf )
  //     .attr('y', rectangle.y + this.y_orig + this.BH )
  //     .attr('text-anchor', 'start')
  //     .text( '...' );
  //     // .append('tspan')
  //     // .attr('baseline-shift', 'sub')
  //     // .attr('font-size', 10)
  //     // .text('0')
  //     // .select(function() {
  //     //   return this.parentNode;
  //     // })
  //     // .insert('tspan')
  //     // .text( ',v' )
  //     // .append('tspan')
  //     // .attr('baseline-shift', 'sub')
  //     // .attr('font-size', 10)
  //     // .text('1')
  //     // .select(function() {
  //     //   return this.parentNode;
  //     // })
  //     // .insert('tspan')
  //     // .text( ',...}' );
  // }

  attachBBoxRenderItems(rectangle: Rectangle, keyStr: string) {
    const val_buf = 4;
    const bbox: Rectangle = new Rectangle(
      `${rectangle.id}-bbox`, // id
      0, // x
      rectangle.y + rectangle.height, // u
      0, 0, // rx,ry
      rectangle.width, // width
      this.TB_H * 2, // height
      'green', // color
      ''); // label see notes below - label doesn't make sense for rect in this use case

    const boxItem: RenderItem = this.rectToRenderItem(bbox);
    // Creating the bar
    const line_points: Array<GridPoint> = [];
    line_points.push({
      x: bbox.x + this.BW * 2 + this.x_orig,
      y: bbox.y + this.y_orig
    });
    line_points.push({
      x: bbox.x + this.BW * 2 + this.x_orig,
      y: bbox.y + bbox.height + this.y_orig
    });
    const barItem: RenderItem = this.straightEdgeRenderItem(line_points, `${bbox.id}-bar`);

    const textItemK: RenderItem = this.textToRenderItem(
      `${bbox.id}-key`,
      bbox.x + this.x_orig + val_buf,
      bbox.y + this.y_orig + this.BH,
       'start',
      keyStr
    );
    const textItemV: RenderItem = this.textToRenderItem(
      `${bbox.id}-value`,
      bbox.x + this.x_orig + this.BW * 2 + val_buf,
      bbox.y + this.y_orig + this.BH,
       'start',
      '...'
    );
    return [boxItem, barItem, textItemK, textItemV];
  }

  textBoxToRenderItems(rectangle: Rectangle) {
    // TODO: Design points to consider: * since this is a text box, be nice if every transition of positional properties
    // TODO) of the rectangle also trickled to the text.
    // TODO) * May be better to define rectangle as a separate element than TextBox (which may have a rectangle and
    //         text component)
    const items: Array<RenderItem> = [];
    items.push(
      this.rectToRenderItem(rectangle)
    );
    items.push(
      this.textLabelToRenderItem(rectangle)
    );
    return items; // rectangle render items THEN text render item
  }

  rectToRenderItem(rectangle: Rectangle) {
    const rectItem = new RenderItem(rectangle.id, `svg`, 'rect');

    rectItem.addAttr('rx', rectangle.rx);
    rectItem.addAttr('rx', rectangle.ry);
    rectItem.addAttr('x', rectangle.x + this.x_orig);
    rectItem.addAttr('y', rectangle.y + this.y_orig);
    rectItem.addAttr('width', rectangle.width);
    rectItem.addAttr('height', rectangle.height);
    rectItem.addAttr('fill', rectangle.color);
    rectItem.addAttr('stroke', 'black');
    rectItem.addAttr('opacity', '0.5');

    return rectItem;
  }

  textToRenderItem(id: string, x: number, y: number,
                   textAnchor: string = 'middle', textString: string) {
    const textItem = new RenderItem(id, 'svg', 'text');
    textItem.addAttr('x', x);
    textItem.addAttr('y', y);
    textItem.addAttr('text-anchor', textAnchor);
    textItem.setText( textString );
    return textItem;
  }

  textLabelToRenderItem(rectangle: Rectangle, textAnchor: string = 'middle', x: number = null, y: number = null) {
    // TODO: Move this back to the way it was
    if (isNullOrUndefined(x)) {
      x = rectangle.x + this.x_orig + rectangle.width / 2;
    }
    if (isNullOrUndefined(y)) {
      y = rectangle.y + this.y_orig + rectangle.height / 2 + this.center_padding;
    }
    const textItem = new RenderItem(`l-${rectangle.id}`, `svg`, 'text');
    textItem.addAttr('x', x);
    textItem.addAttr('y', y);
    textItem.addAttr('text-anchor', textAnchor);
    textItem.setText( rectangle.label );
    return textItem;
  }

  straightEdgeRenderItem(points: Array<GridPoint>, id: string = 'foo') {
    const edgeItem = new RenderItem(id, 'svg', 'path');
    edgeItem.addAttr('d', straightLine(points));
    edgeItem.addAttr('stroke', 'blue');
    edgeItem.addAttr('stroke-width', 1);
    edgeItem.addAttr('fill', 'none');
    return edgeItem;
  }
}
