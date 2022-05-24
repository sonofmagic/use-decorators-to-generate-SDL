abstract class BaseGraph {
  public abstract type: string
  public abstract direction: string
}

interface FlowchartOptions {
  // type?: string
  direction?: string
}

export function Flowchart (options?: FlowchartOptions) {
  return (constructor: BaseGraph) => {
    constructor.prototype.type = 'flowchart' // options?.type
    constructor.prototype.direction = options?.direction
    // return class extends constructor {
    //   type = 'flowchart'
    //   direction = 'LR'
    // }
  }
}
