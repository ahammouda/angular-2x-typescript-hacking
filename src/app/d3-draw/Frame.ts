import { RenderItem } from './RenderItem';

import * as d3 from 'd3';

import { isNullOrUndefined } from 'util';


export class Frame {
  private static DURATION = 2500;
  // Any new SVG or DOM objects to be rendered in this frame using d3 are stored here
  private renderItems: Array<RenderItem> = [];

  // Every modification to existing SVG/DOM objects will be stored here
  // idAccessor should be a fully qualified path to an element
  private renderDeltas: { [idAccessor: string]: RenderItem; } = { };

  private removeDeltas: Array<string>;

  private nextFrame: Frame;
  private lastFrame: Frame;

  constructor(renderItems?: Array<RenderItem>) {
    if (!isNullOrUndefined(renderItems)) {
      this.renderItems = renderItems;
    }
  }

  addItem(item: RenderItem) {
    this.renderItems.push(item);
  }

  addDelta(item: RenderItem) {
    this.renderDeltas[item.getIdAccessor()] = item;
  }

  addRemoveElement(item: RenderItem) {
    this.removeDeltas.push( item.getIdAccessor() );
  }

  setNext(frame: Frame) {
    this.nextFrame = frame;
  }

  render() {
    // Renders d3 attributes -- probably the only time this should be called only on the initial frame
    // everything else after that should be
    for (const renderItem of this.renderItems) {
      renderItem.render();
    }
  }

  transition() {
    // TODO: Need an additional loop to transition any remove items separately -- will be same as the below, only
    // TODO) inner .attr('','') will be replaced with remove()
    if ( !isNullOrUndefined(this.renderDeltas) ) {
      let selection;

      for (const idAccessor in this.renderDeltas) {
        if (this.renderDeltas.hasOwnProperty(idAccessor)) {

          selection = d3.select(idAccessor)
            .transition()
            .duration(Frame.DURATION);

          for (const key in this.renderDeltas[idAccessor].attributes) {
            if (this.renderDeltas[idAccessor].attributes.hasOwnProperty(key)) {

              selection.attr(
                key, this.renderDeltas[idAccessor].attributes[key]
              );

            }
          }
        }
      }
      if (!isNullOrUndefined(this.nextFrame)) {
        // TODO: Control this externally either by passing in the callback or some other mechanism
        selection.on(
          'end', function () {
            this.nextFrame.render();
            this.nextFrame.transition();
          }.bind(this));
      }
    } else {
      if (!isNullOrUndefined(this.nextFrame)) {
        this.nextFrame.render();
        this.nextFrame.transition();
      }
    }
  } // End transition()
}
