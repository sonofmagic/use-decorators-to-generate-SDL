import 'reflect-metadata'
import { Flowchart } from './decorators/Flowchart'
import { Node } from './decorators/Node'
import { LineTo } from './decorators/LineTo'
@Flowchart({
  direction: 'LR'
})
class MyChart {
  // diamond , square ,round
  @Node({ text: 'Hard', shape: 'square' })
  @LineTo({ to: 'B', text: 'Text' })
    A: undefined

  @Node({ text: 'round', shape: 'round' })
  @LineTo({ to: 'C' })
    B: undefined

  @Node({ text: 'Decision', shape: 'diamond' })
  @LineTo({ to: 'D', text: 'One' })
  @LineTo({ to: 'E', text: 'Two' })
    C: undefined

  @Node({ text: 'Result 1', shape: 'square' })
    D: undefined

  @Node({ text: 'Result 2', shape: 'square' })
    E: undefined
}
