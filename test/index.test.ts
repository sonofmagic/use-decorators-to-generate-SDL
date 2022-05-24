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

  test('should 1', () => {
    // flowchart LR
    // A[Hard]-->|Text|B
    // B(round)-->C
    // C{Decision}-->|Two|E
    // C{Decision}-->|One|D
    // D[Result 1]
    // E[Result 2]
    const renderer = new Renderer()
    const chart = new MyChart()
    // @ts-ignore
    const str = renderer.render(chart)
    expect(str).toBe(
      'flowchart LR\nA[Hard]-->|Text|B\nB(round)-->C\nC{Decision}-->|Two|E\nC{Decision}-->|One|D\nD[Result 1]\nE[Result 2]'
    )
  })

  test('should 2', () => {
    // flowchart LR
    // A[Hard]-->|Text|B(round)
    // B-->C{Decision}
    // C-->|Two|E[Result 2]
    // C-->|One|D[Result 1]
    const renderer = new Renderer()
    const chart = new MyChart()
    // @ts-ignore
    const str = renderer.betterRender(chart)
    expect(str).toBe(
      'flowchart LR\nA[Hard]-->|Text|B(round)\nB-->C{Decision}\nC-->|Two|E[Result 2]\nC-->|One|D[Result 1]'
    )
  })
})
