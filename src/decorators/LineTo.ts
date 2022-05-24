const LineToMetadataKey = Symbol('LineTo')

const defaultArrow = '-->'

export function LineTo (options?: Record<string, any>) {
  return Reflect.metadata(LineToMetadataKey, options)
}

export function getLineTo (target: any, propertyKey: string | symbol) {
  return Reflect.getMetadata(LineToMetadataKey, target, propertyKey)
}
