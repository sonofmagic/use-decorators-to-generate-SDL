import 'reflect-metadata'
import { Flowchart, LineTo, Node, Renderer } from '@/index'
describe('[Default]', () => {
  @Flowchart({
    direction: 'LR'
  })
  class MyChart {
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

  test('should ', () => {
    const renderer = new Renderer()
    const chart = new MyChart()
    // @ts-ignore
    const str = renderer.render(chart)
    expect(str).toBe(
      'flowchart LR\nA[Hard]-->|Text|B\nB(round)-->C\nC{Decision}-->|Two|E\nC{Decision}-->|One|D\nD[Result 1]\nE[Result 2]'
    )
  })
})
