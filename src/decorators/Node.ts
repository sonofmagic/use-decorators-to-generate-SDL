import defu from 'defu'

// const NodeMetadataKey = Symbol('Node')
const NodeFieldsMetadataKey = Symbol('NodeFields')
export interface NodeOptions {
  text?: string
  shape?: 'diamond' | 'square' | 'round'
}

export const leftMap = {
  diamond: '{',
  square: '[',
  round: '('
}
export const rightMap = {
  diamond: '}',
  square: ']',
  round: ')'
}

export function renderNodeStr (key: string, options: Required<NodeOptions>) {
  return `${key}${leftMap[options.shape]}${options.text}${
    rightMap[options.shape]
  }`
}

export function Node (options: NodeOptions = {}) {
  return (prototype: Record<string, any>, propertyKey: string) => {
    const opt = defu<NodeOptions, Required<NodeOptions>>(options, {
      shape: 'square',
      text: propertyKey.toString()
    })

    const map = getNodeFields(prototype)
    if (map) {
      Reflect.defineProperty(map, propertyKey, {
        value: opt,
        configurable: true,
        enumerable: true,
        writable: true
      })
    } else {
      Reflect.defineMetadata(
        NodeFieldsMetadataKey,
        {
          [propertyKey]: opt
        },
        prototype
      )
    }
  }
}

// export function getNode (
//   target: any,
//   propertyKey: string | symbol
// ): Required<NodeOptions> {
//   return Reflect.getMetadata(NodeMetadataKey, target, propertyKey)
// }

export function getNodeFields (
  target: any,
  propertyKey?: string | symbol
): Record<string, Required<NodeOptions>> {
  return propertyKey
    ? Reflect.getMetadata(NodeFieldsMetadataKey, target, propertyKey)
    : Reflect.getMetadata(NodeFieldsMetadataKey, target)
}
