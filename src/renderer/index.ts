import { getNode, renderNodeStr } from '@/decorators/Node'
import { getLineTo } from '@/decorators/LineTo'

export class Renderer {
  render (instance: Object): string {
    console.log(instance)
    const res = []
    // @ts-ignore
    res.push([instance.type, instance.direction])
    const keys = Reflect.ownKeys(instance).filter((k) => typeof k === 'string') as string[]
    for (const key of keys) {
      const node = getNode(instance, key)
      if (node) {
        res.push(renderNodeStr(key, node))
      }
      const lineTo = getLineTo(instance, key)
      if (lineTo) {
        res.push(lineTo)
      }
    }
    console.log(keys)
    return ''
  }
}
