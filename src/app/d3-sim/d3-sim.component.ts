import {AfterViewInit, Component, OnInit} from '@angular/core';
import { Particle } from './particle';
import * as d3 from 'd3';

@Component({
  selector: 'app-d3-sim',
  templateUrl: './d3-sim.component.html',
  styleUrls: ['./d3-sim.component.css']
})
export class D3SimComponent implements OnInit, AfterViewInit {
  N_PARTICLES = 3;
  PARTICLE_RADIUS = 8;
  delta: number = 0; // this.PARTICLE_RADIUS - (0.5 * this.PARTICLE_RADIUS);

  width = 350;
  height = 250;

  particles: Array<Particle> = [];
  collisions: Array<number> = [];

  simulation_handler: any;

  paused: Boolean = true;

  count: number = 0;

  c_delta: number = 1;

  constructor() { }

  ngOnInit() {
    this.initParticles();
  }

  ngAfterViewInit() {
    this.startSimulation();
    this.paused = false;
  }

  startSimulation() {
    this.simulation_handler = setInterval(this.moveParticles.bind(this), 25);
    this.paused = false;
  }

  pauseSimulation() {
    clearInterval( this.simulation_handler );
    this.paused = true;
  }

  initParticles() {
    // Want a range of x coords and y coords within 600 x 600 box for 20 particles, and an initial velocity
    const pos_array = [{'x': 20, 'y': 20}, {'x': 200, 'y': 200}, {'x': 20, 'y': 200}];
    const dir_array = [{'dx': +1, 'dy': +1 }, {'dx': -1, 'dy': -1}, {'dx': +1, 'dy': -1}];
    for (let i = 0; i < this.N_PARTICLES; i++) {
      this.particles.push({
        id: 'qs' + String(i),
        cx: pos_array[i].x,
        cy: pos_array[i].y,
        dx: dir_array[i].dx,
        dy: dir_array[i].dy,
        // cx: this.uniform(0, this.width),
        // cy: this.uniform(0, this.height),
        // dx: this.randomDelta(),
        // dy: this.randomDelta(),
        // cx: this.uniform(-this.width, this.width),
        // cy: this.uniform(-this.height, this.height),
        // dx: this.randomDelta(),
        // dy: this.randomDelta(),
        color: (i % 2 === 0) ? 'red' : 'black'
      });
      this.collisions[i] = 0;
    }

    for (let i = 0; i < this.N_PARTICLES; i++) {
      d3.select('svg')
        .append('circle')
        .attr('id', this.particles[i].id)
        .attr('r', this.PARTICLE_RADIUS)
        .attr('cx', this.particles[i].cx)
        .attr('cy', this.particles[i].cy)
        .style('fill', this.particles[i].color);
    }
  }

  moveParticles() {
    //if (this.count % this.c_delta === 0 ) {
    this.computeVelocities();
    //}

    for (let i = 0; i < this.particles.length; i++) {
      this.particles[i].cx = this.particles[i].cx + this.particles[i].dx;
      this.particles[i].cy = this.particles[i].cy + this.particles[i].dy;
      if (i < this.collisions.length && this.collisions[i] > 0) {
        this.collisions[i]--;
      }
    }

    for (let i = 0; i < this.N_PARTICLES; i++) {
      d3.select('svg circle#' + this.particles[i].id)
        .transition()
        .attr('cx', this.particles[i].cx)
        .attr('cy', this.particles[i].cy);
    }
    this.count++;
  }

  computeVelocities() {
    /* Before setting up this transition check to see if any particles have hit each other; */
    for (let t of this.particles) {
    // this.particles.forEach(function (t, i, array) {
      // TODO: Note this relative positioning, you need to be able to draw a picture of all these params
      if (t.cx  >= this.width || t.cx  <= -this.width) {
        t.dx = -1 * t.dx;
      }
      if (t.cy >= this.height || t.cy  <= -this.height) {
        t.dy = -1 * t.dy;
      }
    }

    for (let i = 0; i < this.particles.length; i++) {
      for (let j = 0; j < this.particles.length; j++) {
        let collide = false;
        if (j === i || this.collisions[i]) {
          continue;
        }
        // if (this.isCollision(this.particles[i], this.particles[j])) {
          /* Reverse direction of both particles if they hit each other */
          if (this.isVerticalCollision(this.particles[i], this.particles[j])) {
            // Only do this for the i'th particle: jth particle will get tapped in next round
            this.particles[i].dy = -1 * this.particles[i].dy;
            // this.particles[j].dy = -1 * this.particles[j].dy;
            collide = true;
          }
          if (this.isHorizontalCollision(this.particles[i], this.particles[j])) {
            this.particles[i].dx = -1 * this.particles[i].dx;
            // this.particles[j].dx = -1 * this.particles[j].dx;
          }
        // }
        if (collide) {
          this.collisions[i] = 3;
        }
      }
    }
    console.log(this.particles);
  }

  isVerticalCollision(p1, p2) {
    // p1 behind: (ordering is behing && overlap) || in front of p2
    const horizontal_vicinity: Boolean = (p1.cx <= p2.cx && p1.cx + this.delta >= p2.cx - this.delta) ||
      (p1.cx >= p2.cx && p1.cx - this.delta <= p2.cx + this.delta);

    const above_collision: Boolean = p1.cy - this.delta <= (p2.cy ) + this.delta;
    const below_collision: Boolean = p1.cy <= p2.cy && p1.cy + this.delta >= p2.cy - this.delta;
    return (above_collision && horizontal_vicinity) || (below_collision && horizontal_vicinity);
  }

  isHorizontalCollision(p1, p2) {
    // p1 below || above p2
    const vertical_vicinity: Boolean = (p1.cy <= p2.cy && p1.cy + this.delta >= p2.cy - this.delta) ||
      (p1.cy >= p2.cy && p1.cy - this.delta <= p2.cy + this.delta);

    const right_collision: Boolean = p1.cx + this.delta >= p2.cx - this.delta;
    const left_collision: Boolean  = p1.cx >= p2.cx && p1.cx - this.delta <= p2.cx + this.delta;
    return (right_collision && vertical_vicinity) || (left_collision && vertical_vicinity);
  }

  isCollision(p1, p2) {
    // p1 below || above p2
    const vertical_vicinity: Boolean = (p1.cy <= p2.cy && p1.cy + this.delta >= p2.cy - this.delta) ||
      (p1.cy >= p2.cy && p1.cy - this.delta <= p2.cy + this.delta);

    // p1 behind || in front of p2
    const horizontal_vicinity: Boolean = (p1.cx <= p2.cx && p1.cx + this.delta >= p2.cx - this.delta) ||
      (p1.cx >= p2.cx && p1.cx - this.delta <= p2.cx + this.delta);

    // p1 hits p2 from the right
    const right_collision: Boolean  = p1.cx <= p2.cx && p1.cx + this.delta >= p2.cx - this.delta;

    // p1 hits p2 from the left
    const left_collision: Boolean  = p1.cx >= p2.cx && p1.cx - this.delta <= p2.cx + this.delta;

    // p1 hits p2 from above
    const above_collision: Boolean = p1.cy >= p2.cy && p1.cy - this.delta <= p2.cy + this.delta;

    // p1 hits p2 from below
    const below_collision: Boolean = p1.cy <= p2.cy && p1.cy + this.delta >= p2.cy - this.delta;

    return (right_collision && vertical_vicinity) || (left_collision && vertical_vicinity) ||
      (above_collision && horizontal_vicinity) || (below_collision && horizontal_vicinity);
  }

  randomDelta() {
    return (Math.floor(Math.random() * 2) === 0) ? -1 : 1;
  }

  uniform(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }
}
