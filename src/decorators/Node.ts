import defu from 'defu'

const NodeMetadataKey = Symbol('Node')
const NodeFieldsMetadataKey = Symbol('NodeFields')
export interface NodeOptions {
  text?: string
  shape?: 'diamond' | 'square' | 'round'
}

export interface NodeField {
  key: string
  value: string
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

    const arr = getNodeFields(prototype)
    if (Array.isArray(arr)) {
      arr.push({
        key: propertyKey,
        value: options.text ?? propertyKey.toString()
      })
    } else {
      Reflect.defineMetadata(
        NodeFieldsMetadataKey,
        [
          {
            key: propertyKey,
            value: options.text ?? propertyKey.toString()
          }
        ],
        prototype
      )
    }

    Reflect.defineMetadata(NodeMetadataKey, opt, prototype, propertyKey)
  }
}

export function getNode (
  target: any,
  propertyKey: string | symbol
): Required<NodeOptions> {
  return Reflect.getMetadata(NodeMetadataKey, target, propertyKey)
}

export function getNodeFields (
  target: any,
  propertyKey?: string | symbol
): NodeField[] {
  return propertyKey
    ? Reflect.getMetadata(NodeFieldsMetadataKey, target, propertyKey)
    : Reflect.getMetadata(NodeFieldsMetadataKey, target)
}
