export abstract class BaseGraph {
  public abstract type: string
  public abstract direction: string
}

declare type ClassDecorator = <TFunction extends Function>(
  target: TFunction
) => TFunction | void

interface FlowchartOptions {
  // type?: string
  direction?: string
}

export function Flowchart (options?: FlowchartOptions): ClassDecorator {
  return (constructor) => {
    constructor.prototype.type = 'flowchart' // options?.type
    constructor.prototype.direction = options?.direction
    // return class extends BaseGraph {
    //   type = 'flowchart'
    //   direction = options?.direction
    // }
  }
}
