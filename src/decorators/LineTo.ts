const LineToMetadataKey = Symbol('LineTo')

export function LineTo (options?: Record<string, any>) {
  return Reflect.metadata(LineToMetadataKey, options)
}

export function getLineTo (target: any, propertyKey: string) {
  return Reflect.getMetadata(LineToMetadataKey, target, propertyKey)
}
