import { getNodeFields, leftMap, rightMap } from '@/decorators/Node'
import { getLineTo } from '@/decorators/LineTo'
import { BaseGraph, getFlowchart } from '@/decorators/Flowchart'

function render (instance: BaseGraph): string {
  // 每一行都是一个字符串，所以结果用字符串数组来表示
  const res: string[] = []
  // 获取class类型元数据
  const chartOptions = getFlowchart(instance)!
  // 第一行，图表的定义
  res.push([chartOptions.type, chartOptions.direction].join(' '))
  // 获取所有的节点
  const entitiesMap = getNodeFields(instance)
  // 开始遍历
  for (const [key, value] of Object.entries(entitiesMap)) {
    if (value) {
      let str: string = ''
      // from 节点的定义 string
      str += `${key}${leftMap[value.shape]}${value.text}${
        rightMap[value.shape]
      }`
      // 获取字段上的指向元数据
      const lineTo = getLineTo(instance, key)
      // 如果是数组，说明from节点，指向多个to节点
      if (Array.isArray(lineTo)) {
        // node 一对多 line
        const lineStrs = lineTo.map((options) => {
          const { to, text } = options
          return `-->${text ? `|${text}|` : ''}${to}`
        })
        // 把一对多关系每个单独成行
        lineStrs.forEach((x) => {
          res.push(str + x)
        })
      } else {
        // 没有 lineTo 的指向，直接把from节点的定义push进去
        res.push(str)
      }
    }
  }
  // 返回结果
  return res.join('\n')
}

function betterRender (instance: BaseGraph): string {
  const res: string[] = []
  const chartOptions = getFlowchart(instance)!
  res.push([chartOptions.type, chartOptions.direction].join(' '))
  const entitiesMap = getNodeFields(instance)
  // 是否节点已经定义过的 Record<string, boolean>
  const definedMap = Object.keys(entitiesMap).reduce<Record<string, boolean>>(
    (acc, cur) => {
      acc[cur] = false
      return acc
    },
    {}
  )
  for (const [key, value] of Object.entries(entitiesMap)) {
    if (value) {
      const keyHasDefined = definedMap[key]
      let str: string = ''
      if (!keyHasDefined) {
        // 没有定义过则定义 from 节点属性
        str += `${key}${leftMap[value.shape]}${value.text}${
          rightMap[value.shape]
        }`
        // 声明已经定义过
        definedMap[key] = true
      } else {
        // 定义过则直接使用 key 进行引用
        str += key
      }
      const lineTo = getLineTo(instance, key)
      if (Array.isArray(lineTo)) {
        lineTo
          .map((options) => {
            const { to, text } = options
            const toNodeIsDefined = definedMap[to]
            let tmp = `-->${text ? `|${text}|` : ''}${to}`
            // 是否需要在指向时，定义 to 节点的属性
            if (!toNodeIsDefined) {
              // 没有定义过则去定义，并声明 to 节点已经被定义了
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
        // 只有单个节点时，假如已经在之前被定义过
        // 那么此处不需要再次定义
        // 有 line 的时候是需要 key 来进行引用的
        if (!keyHasDefined) {
          res.push(str)
        }
      }
    }
  }

  return res.join('\n')
}
export class Renderer {
  render = render
  betterRender = betterRender
}
