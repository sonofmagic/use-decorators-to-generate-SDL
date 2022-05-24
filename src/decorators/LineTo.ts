import defu from 'defu'
const LineToMetadataKey = Symbol('LineTo')

export const defaultArrow = '-->'

export interface LineToOptions {
  to: string
  text?: string
}

export function renderLineToStr (optionsArray: LineToOptions[]): string[] {
  return optionsArray.map((options) => {
    const { to, text } = options
    return `${defaultArrow}${text ? `|${text}|` : ''}${to}`
  })
}

export function getLineTo (
  target: any,
  propertyKey: string | symbol
): LineToOptions[] | undefined {
  return Reflect.getMetadata(LineToMetadataKey, target, propertyKey)
}

export function LineTo (options: LineToOptions) {
  const opt = defu<LineToOptions, Partial<LineToOptions>>(options, {})
  if (opt.to === undefined) {
    throw new TypeError('LineTo decorator requires a `to` property')
  }
  return (prototype: Object, propertyKey: string | symbol) => {
    const meta = getLineTo(prototype, propertyKey)
    if (meta) {
      meta.push(options)
    } else {
      Reflect.defineMetadata(
        LineToMetadataKey,
        [options],
        prototype,
        propertyKey
      )
    }
  }
}
