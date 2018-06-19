import { GridPoint } from './GridPoint';
import * as d3 from 'd3';

// export class Transition {}

export class PathTransition {
  new_points: Array<GridPoint>;

  path_id: string;

  constructor(path_id: string, new_points: Array<GridPoint>) {
    this.path_id = path_id;
    this.new_points = new_points;
  }

  addNewPoint(point: GridPoint) {
    this.new_points.push(point);
  }

  transition(path_function: (a: Array<GridPoint>) => any) {
    this.transitionPoints(path_function);
  }

  transitionPoints(path_function: (a: Array<GridPoint>) => any) {
    d3.select( this.path_id ).transition().duration(500).attr('d', path_function(this.new_points));
  }
}
