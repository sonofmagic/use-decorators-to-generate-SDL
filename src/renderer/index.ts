import {
  renderNodeStr,
  getNodeFields,
  leftMap,
  rightMap
} from '@/decorators/Node'
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

  betterRender (instance: BaseGraph): string {
    const res: string[] = []
    const chartOptions = getFlowchart(instance)!
    res.push([chartOptions.type, chartOptions.direction].join(' '))
    const entitiesMap = getNodeFields(instance)
    const definedMap = Object.keys(entitiesMap).reduce<Record<string, boolean>>(
      (acc, cur) => {
        acc[cur] = false
        return acc
      },
      {}
    )
    for (const [key, value] of Object.entries(entitiesMap)) {
      const keyHasDefined = definedMap[key]
      let str: string = ''
      if (value) {
        if (!keyHasDefined) {
          str += `${key}${leftMap[value.shape]}${value.text}${
            rightMap[value.shape]
          }`
          definedMap[key] = true
        } else {
          str += key
        }
      }
      const lineTo = getLineTo(instance, key)
      if (Array.isArray(lineTo)) {
        lineTo
          .map((options) => {
            const { to, text } = options
            const toNodeIsDefined = definedMap[to]
            let tmp = `-->${text ? `|${text}|` : ''}${to}`
            if (!toNodeIsDefined) {
              const o = entitiesMap[to]
              tmp += `${leftMap[o.shape]}${o.text}${rightMap[o.shape]}`
              definedMap[to] = true
            }
            return tmp
          })
          .forEach((x) => {
            res.push(str + x)
          })
      } else {
        // 单个节点
        if (!keyHasDefined) {
          res.push(str)
        }
      }
    }

    return res.join('\n')
  }
}
