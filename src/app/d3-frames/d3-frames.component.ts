// import { Component, OnInit } from '@angular/core';
//
// import * as d3 from 'd3';
//
// import { Rectangle } from '../d3-draw/Rectangle';
//
// import { RenderItem } from '../d3-draw/RenderItem';
// import { Frame } from '../d3-draw/Frame';
//
//
// const straightLine = d3.line()
//   .x(function(d) { return d.x; })
//   .y(function(d) { return d.y; });
//
// const arcLine = d3.line()
//   .x(function(d) { return d.x; })
//   .y(function(d) { return d.y; })
//   .curve(d3.curveBasis);
//
// @Component({
//   selector: 'app-d3-frames',
//   templateUrl: './d3-frames.component.html',
//   styleUrls: ['./d3-frames.component.css']
// })
// export class D3FramesComponent implements OnInit {
//   x_orig = -350;
//   y_orig = -250;
//
//   // Defines grid element size in pixels for single coordinate in cartesian place
//   BH = 22; BW = 22; // Single box to fit uppercase font-size = 10
//
//   svg: any; // This grid
//
//   /* Arbitrary distances between boxes or circles drawn */
//   // Intercolumn Gap
//   GC = 3 * this.BW;
//   // Interrow Gap
//   GR = 8 * this.BW;
//
//   // Text Seems to need a padding of about 4 pixels for text to hit that centerpoint of a box
//   center_padding = 4;
//
//   TB_H = 2 * this.BH; // text-box height
//   ARROW_LEN = 10; // static size of arrow tip
//
//   rectangles: Array<Rectangle> = [];
//
//   frames: Array<Frame> = [];
//
//   constructor() { }
//
//   ngOnInit() {
//     this.svg = d3.select('div#d3-draw')
//       .append('svg')
//       .attr('viewBox', '-350 -250 700 500')
//       .classed('svg-content', true);
//
//     // (1st) Frame:
//     this.rectangles.push(
//       // id x, y, rx, ry, width, height, fill, label
//       new Rectangle('r-0', 0, 0, 0, 0, null, this.TB_H, 'blue', 'Firm')
//     );
//
//     this.rectangles.push(
//       // id x, y, rx, ry, width, height, fill, label
//       new Rectangle('r-1', 0, this.TB_H * 4, 0, 0, null, this.TB_H, 'blue', 'Image')
//     );
//
//     const frame1 = new Frame();
//
//     for (let i = 0; i < this.rectangles.length; i++) {
//       this.setWidth(this.rectangles[i]);
//
//       frame1.addItem(
//         this.toRenderItem(this.rectangles[i])
//       );
//     }
//
//     for (let i = 0; i < this.rectangles.length; i++) {
//       this.rectangles[i].x = this.rectangles[i].x + this.rectangles[i].width + 10;
//
//       frame1.addDelta(
//         this.toRenderItem(this.rectangles[i])
//       );
//     }
//
//     const frame2 = new Frame();
//     frame1.setNext(frame2);
//     this.frames.push(frame1);
//
//     // (2nd) Frame:
//     for (let i = 0; i < this.rectangles.length; i++) {
//       this.rectangles[i].y = this.rectangles[i].y + this.rectangles[i].height + 10;
//
//       frame2.addDelta(
//         this.toRenderItem(this.rectangles[i])
//       );
//     }
//     this.rectangles.push(
//       // id x, y, rx, ry, width, height, fill, label
//       new Rectangle('r-2', 0, 0, 0, 0, null, this.TB_H, 'blue', 'Firm')
//     );
//
//     this.rectangles.push(
//       // id x, y, rx, ry, width, height, fill, label
//       new Rectangle('r-3', 0, this.TB_H * 4, 0, 0, null, this.TB_H, 'blue', 'Image')
//     );
//     this.setWidth( this.rectangles[2] );
//     this.setWidth( this.rectangles[3] );
//     frame2.addItem(
//         this.toRenderItem(this.rectangles[2])
//     );
//     frame2.addItem(
//         this.toRenderItem(this.rectangles[3])
//     );
//
//     this.frames.push(frame2);
//
//     frame1.render();
//     frame1.transition();
//   }
//
//   setWidth(rectangle) {
//     rectangle.width = rectangle.label.length * this.BW + this.BW;
//   }
//
//   toRenderDelta(rectangle: Rectangle) {
//     const rectItem = new RenderItem(rectangle.id, `svg`, 'rect');
//
//     rectItem.addAttr('rx', rectangle.rx);
//
//     return rectItem;
//   }
//
//
//   toRenderItem(rectangle: Rectangle) {
//     const rectItem = new RenderItem(rectangle.id, `svg`, 'rect');
//
//     rectItem.addAttr('rx', rectangle.rx);
//     rectItem.addAttr('rx', rectangle.ry);
//     rectItem.addAttr('x', rectangle.x + this.x_orig);
//     rectItem.addAttr('y', rectangle.y + this.y_orig);
//     rectItem.addAttr('width', rectangle.width);
//     rectItem.addAttr('height', rectangle.height);
//     rectItem.addAttr('fill', rectangle.color);
//     rectItem.addAttr('stroke', 'black');
//     rectItem.addAttr('opacity', '0.5');
//
//     // const textItem = new RenderItem(`l-${rectangle.id}`, `svg`, 'text');
//     // textItem.addAttr('x', rectangle.x + this.x_orig + rectangle.width / 2);
//     // textItem.addAttr('y', rectangle.y + this.y_orig + rectangle.height / 2 + this.center_padding);
//     // textItem.addAttr('text-anchor', 'middle');
//     // textItem.setText( rectangle.label );
//     return rectItem;
//   }
// }
