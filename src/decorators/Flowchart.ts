export abstract class BaseGraph {
  public abstract type: string
  public abstract direction: string
}

const FlowchartMetadataKey = Symbol('Flowchart')

declare type ClassDecorator = <TFunction extends Function>(
  target: TFunction
) => TFunction | void

interface FlowchartOptions {
  // type?: string
  direction?: string
}

export function Flowchart (options?: FlowchartOptions): ClassDecorator {
  return (constructor) => {
    Reflect.defineMetadata(
      FlowchartMetadataKey,
      {
        type: 'flowchart',
        direction: options?.direction
      },
      constructor.prototype
    )
  }
}

export function getFlowchart (
  target: any
): { type: string; direction: string } | undefined {
  return Reflect.getMetadata(FlowchartMetadataKey, target)
}
