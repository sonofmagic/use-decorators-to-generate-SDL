import { getNode, renderNodeStr } from '@/decorators/Node'
import { getLineTo, renderLineToStr } from '@/decorators/LineTo'

export class Renderer {
  render (instance: Object): string {
    const res: string[] = []
    // @ts-ignore
    res.push([instance.type, instance.direction].join(' '))
    const keys = Reflect.ownKeys(instance).filter(
      (k) => typeof k === 'string'
    ) as string[]
    for (const key of keys) {
      let str: string = ''
      const node = getNode(instance, key)
      if (node) {
        str += renderNodeStr(key, node)
      }
      const lineTo = getLineTo(instance, key)
      if (Array.isArray(lineTo)) {
        const lineStrs = renderLineToStr(lineTo)
        lineStrs.forEach((x) => {
          res.push(str + x)
        })
      } else {
        res.push(str)
      }
    }

    return res.join('\n')
  }
}
