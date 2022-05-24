const NodeMetadataKey = Symbol('Node')

export function Node (options?: Record<string, any>) {
  return Reflect.metadata(NodeMetadataKey, options)
}

export function getNode (target: any, propertyKey: string) {
  return Reflect.getMetadata(NodeMetadataKey, target, propertyKey)
}
