import 'reflect-metadata'
import { Flowchart, BaseGraph } from './decorators/Flowchart'
import { Node } from './decorators/Node'
import { LineTo } from './decorators/LineTo'

import { Renderer } from './renderer'

@Flowchart({
  direction: 'LR'
})
export class MyChart {
  @Node({ text: 'Hard', shape: 'square' })
  @LineTo({ to: 'B', text: 'Text' })
    A: string

  @Node({ text: 'round', shape: 'round' })
  @LineTo({ to: 'C' })
    B: string

  @Node({ text: 'Decision', shape: 'diamond' })
  @LineTo({ to: 'D', text: 'One' })
  @LineTo({ to: 'E', text: 'Two' })
    C: string

  @Node({ text: 'Result 1', shape: 'square' })
    D: string

  @Node({ text: 'Result 2', shape: 'square' })
    E: string
}

const renderer = new Renderer()
const chart = new MyChart()
// @ts-ignore
const str = renderer.render(chart as BaseGraph)
console.log(str)
