import { renderNodeStr, getNodeFields } from '@/decorators/Node'
import { getLineTo, renderLineToStr } from '@/decorators/LineTo'
import { BaseGraph, getFlowchart } from '@/decorators/Flowchart'
export class Renderer {
  render (instance: BaseGraph): string {
    const res: string[] = []
    const chartOptions = getFlowchart(instance)!
    res.push([chartOptions.type, chartOptions.direction].join(' '))
    const entitiesMap = getNodeFields(instance)

    for (const [key, value] of Object.entries(entitiesMap)) {
      let str: string = ''
      if (value) {
        str += renderNodeStr(key, value)
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
