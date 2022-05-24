import 'reflect-metadata'
import { Flowchart } from './decorators/Flowchart'
import { Node } from './decorators/Node'
import { LineTo } from './decorators/LineTo'

import { Renderer } from './renderer'
@Flowchart({
  direction: 'LR'
})
class MyChart {
  @Node({ text: 'Hard', shape: 'square' })
  @LineTo({ to: 'B', text: 'Text' })
    A: string = 'aaaa'

  @Node({ text: 'round', shape: 'round' })
  @LineTo({ to: 'C' })
    B = 'B'

  @Node({ text: 'Decision', shape: 'diamond' })
  @LineTo({ to: 'D', text: 'One' })
  @LineTo({ to: 'E', text: 'Two' })
    C = 'C'

  @Node({ text: 'Result 1', shape: 'square' })
    D = 'D'

  @Node({ text: 'Result 2', shape: 'square' })
    E = 'E'
}

const renderer = new Renderer()
const chart = new MyChart()

const str = renderer.render(chart)
console.log(str)
