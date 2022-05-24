import defu from 'defu'
const LineToMetadataKey = Symbol('LineTo')

export const defaultArrow = '-->'

export interface LineToOptions {
  to?: string
  text?: string
}

export function getLineTo (target: any, propertyKey: string | symbol) {
  return Reflect.getMetadata(LineToMetadataKey, target, propertyKey)
}

export function LineTo (options: LineToOptions = {}) {
  const opt = defu<LineToOptions, LineToOptions>(options, {})
  if (opt.to === undefined) {
    throw new TypeError('LineTo decorator requires a `to` property')
  }
  return (target: Object, propertyKey: string | symbol) => {
    const meta = getLineTo(target, propertyKey)
    if (meta) {
      meta.push(options)
    } else {
      Reflect.defineMetadata(
        LineToMetadataKey,
        [options],
        target.constructor.prototype,
        propertyKey
      )
    }
  }
}
