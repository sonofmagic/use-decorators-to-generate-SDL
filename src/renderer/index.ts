import { getNode, renderNodeStr, getNodeFields } from '@/decorators/Node'
import { getLineTo, renderLineToStr } from '@/decorators/LineTo'
import { BaseGraph, getFlowchart } from '@/decorators/Flowchart'
export class Renderer {
  render (instance: BaseGraph): string {
    const res: string[] = []
    const chartOptions = getFlowchart(instance)!
    res.push([chartOptions.type, chartOptions.direction].join(' '))
    const entities = getNodeFields(instance)

    for (const entity of entities) {
      let str: string = ''
      const node = getNode(instance, entity.key)
      if (node) {
        str += renderNodeStr(entity.key, node)
      }
      const lineTo = getLineTo(instance, entity.key)
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
