const TextMetadataKey = Symbol('Text')

export function Text (options?: Record<string, any>) {
  return Reflect.metadata(TextMetadataKey, options)
}

export function getText (target: any, propertyKey: string) {
  return Reflect.getMetadata(TextMetadataKey, target, propertyKey)
}
