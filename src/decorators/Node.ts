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
  return (prototype: Record<string, any>, propertyKey: string) => {
    const opt = defu<NodeOptions, NodeOptions>(options, {
      shape: 'square',
      text: propertyKey.toString()
    })
    Reflect.defineProperty(prototype, propertyKey, {
      value: options.text ?? propertyKey.toString(),
      configurable: true,
      enumerable: true,
      writable: true
    })
    Reflect.defineMetadata(NodeMetadataKey, opt, prototype, propertyKey)
  }
}

export function getNode (target: any, propertyKey: string | symbol) {
  return Reflect.getMetadata(NodeMetadataKey, target, propertyKey)
}
