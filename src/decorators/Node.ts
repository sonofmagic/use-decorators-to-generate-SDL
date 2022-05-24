import defu from 'defu'

const NodeMetadataKey = Symbol('Node')

export interface NodeOptions {
  text?: string
  shape?: 'diamond' | 'square' | 'round'
}

const leftMap = {
  diamond: '{',
  square: '[',
  round: '('
}
const rightMap = {
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
  return (target: Object, propertyKey: string | symbol) => {
    const opt = defu<NodeOptions, NodeOptions>(options, {
      shape: 'square',
      text: propertyKey.toString()
    })
    // target.constructor.prototype[propertyKey] = propertyKey
    Reflect.defineMetadata(
      NodeMetadataKey,
      opt,
      target.constructor.prototype,
      propertyKey
    )
  }
}

export function getNode (target: any, propertyKey: string | symbol) {
  return Reflect.getMetadata(NodeMetadataKey, target, propertyKey)
}
