# Code First 探秘: 利用装饰器生成 SDL

- [Code First 探秘: 利用装饰器生成 SDL](#code-first-探秘-利用装饰器生成-sdl)
  - [前言](#前言)
  - [生成 mermaid SDL](#生成-mermaid-sdl)
    - [观察 mermaid SDL](#观察-mermaid-sdl)
    - [设计装饰器](#设计装饰器)
    - [实现装饰器](#实现装饰器)
      - [实现 `Flowchart`](#实现-flowchart)
      - [实现 `Node` 和 `LineTo`](#实现-node-和-lineto)
    - [实现转化器](#实现转化器)
      - [原始转化器](#原始转化器)
      - [更好的转化器](#更好的转化器)
  - [参考文档](#参考文档)

## 前言

在我们日常的开发中，经常会遇到许许多多的 `SDL`( `schema definition language` 模式定义语言)，它与我们使用的具体编程语言是无关的。它允许我们在不同平台之间共享模式定义文件，比如我们非常熟悉的 `GraphQL schema` 便是一种 `SDL`。

那么说完了 `SDL` ，标题中的 `Code First (代码优先)` 是什么意思呢？ 笔者之前写 `.net` 的时候，使用过一段时间的 `ado.net EF`，这个框架里就可以使用 `Code First` 模式来和数据库进行交互。在这种模式下，数据库中表的字段属性，被编程语言中类的字段属性所描述，表与表之间的关系，也被编程语言中类的相互关系所描述。所以在这种模式下，我们仅仅需要操纵类派生的对象实例，就可以做到对数据库增删改查的功能了。

`Code First` 这种思想，也被用在各种各样的语言或者框架中。比如我们 `nodejs` 开发者非常熟悉的 `nestjs`，它的 `@nestjs/graphql` 就支持这种模式，这使得我们只需要对某些类进行描述，就能够自动的生成 `GraphQL schema`，即 `schema.gql` 文件。它是如何做到的呢？在前面的文字中，笔者不停的提到了 **描述** 2 字。在 `js` 中，最方便的描述方式，自然就是使用 `装饰器` 了。

> [tc39/proposal-decorators](https://github.com/tc39/proposal-decorators) 这个提案目前已经到了 `Stage: 3` 阶段。

装饰器(`Decorators`)，相信大家都非常熟悉了，毕竟在各个不同的编程语言中都是老生常谈了，在此不在叙述。值得注意的是，在 `js` 的世界中，函数是一等公民。目前 `js` 中装饰器工厂的实现，基本都是用函数生成函数，来保证使用起来足够的灵活。(用前端技术来打比方的话，就相当于用一个 `function` 来生成不同的 `mixin`，这样随着入参的不同，`mixin` 内容也不同，用这种方式来兼容更多的情景)

说了这么多，接下来我们通过实操，来看看我们描述的类是如何与 `SDL` 进行相互转化的吧！

## 生成 mermaid SDL

因为 `graphql SDL` 已经有包生成了，笔者向来喜欢开新坑，于是便指定我们描述类的生成目标为 `mermaid SDL`。`mermaid` 这个库也是非常的有名，它可以通过我们编写的 `SDL` 字符串来渲染生成各种不同的 `svg` 图表。现在让我们开始吧！

### 观察 mermaid SDL

在生成前我们自然要通过观察，来找出我们使用的编程语言和 `SDL` 之间的关系。我们以最常见的 `flowchart` 为例：
```
flowchart LR
A[Hard]-->|Text|B(round)
B-->C{Decision}
C-->|Two|E[Result 2]
C-->|One|D[Result 1]
```

0line: `flowchart LR` 是描述图表的类型(`type`)和方向(`direction`)，显然这2个的值都是枚举

1-4line: 描述了节点和流程线，其中节点定义了它的引用键值 `key`，节点的形状 `shape`(正方形，椭圆形，菱形...)，和节点文字 `text`，而流程线则定义了节点之间的指向 `to` 和流程线上的文字 `text`。值得注意的是，在 `1-4` 行中，关系的描述和节点和流程线的一起完成的！比如在 `3-4` 行中，`C` 指向了 `E` 和 `D`，它们就随着指向的确立，与节点的定义一起完成了，没有单独起一行 `append` 在最后，描述为 `E[Result 2]`。

这里笔者给出一个 **等价** 的示例，来让你更好的理解我的意思。

```
flowchart LR
A[Hard]-->|Text|B
B(round)-->C
C{Decision}-->|Two|E
C{Decision}-->|One|D
D[Result 1]
E[Result 2]
```

从这个例子中你就可以得到这个 `SDL` 的一些特性了。

### 设计装饰器

通过上述的分析，我们就可以进行一个简单的设计：
```js
// 描述图表类型定义
@Graph({ type:Enum, direction?:Enum })
// 继承自 Graph，相当于固定了 type 的 Graph
@Flowchart({ direction?:Enum }) 
// 节点装饰
@Node({ text?:string,shape?:Enum})
// 流程线装饰
@LineTo({ to:string,text?:string })
// 其中非必填的，要不就是有默认值，要不就是不影响 mermaid 的生成验证
```

那么我们就很容易把上述的 `mermaid SDL` 示例编写成一个类:

```ts
@Flowchart({ direction: 'LR' })
class MyChart {
  @Node({ text: 'Hard', shape: 'square' })
  @LineTo({ to: 'B', text: 'Text' })
  A: string
  @Node({ text: 'round', shape: 'round' })
  @LineTo({ to: 'C' })
  B: string
  @Node({ text: 'Decision', shape: 'diamond' })
  @LineTo({ to: 'D', text: 'One' })
  @LineTo({ to: 'E', text: 'Two' })
  C: string
  @Node({ text: 'Result 1', shape: 'square' })
  D: string
  @Node({ text: 'Result 2', shape: 'square' })
  E: string
}
```

接下来我们就聚焦在使用的装饰器的实现部分

### 实现装饰器

我们知道，装饰器的实现离不开 `reflect-metadata`，它给 `js` 添加了元数据(`Metadata`)的功能,也提供了对应的操纵`API`。接下来我们围绕 `Reflect` 来实现我们的装饰器。

#### 实现 `Flowchart`

这个装饰器是一个 `Class Decorator`，它接受的入参只有一个被装饰的 `class` 的构造函数 `constructor`，当然它的返回值也会替换原先类的声明。

我们这个装饰器的目的，是为了声明 `class` 是一个 `Flowchart`，那么这里我们需要做的，便是给 `class` 打上标记，详见下方代码：

```ts
export function Flowchart (options?: FlowchartOptions): ClassDecorator {
  return (constructor) => {
    Reflect.defineMetadata(
      FlowchartMetadataKey,
      {
        type: 'flowchart',
        direction: options?.direction
      },
      constructor.prototype
    )
  }
}
```
#### 实现 `Node` 和 `LineTo` 

这两个都是 `Property Decorator`，它们接受的入参有两个，第一个是原型对象(如果是静态字段(`static`)，则为类的构造函数)，第二个是被装饰的属性名。

在设计这 2 个装饰器的时候，我们会发现这 2 个装饰器之间存在着一些联动。

抛开 `LineTo` 看 `Node` 的视角，可以发现它仅仅只用来描述字段的属性。在这种情形下使用:

```ts
Reflect.defineMetadata(metadataKey, metadata, prototype, propertyKey)
```

把元数据定义在字段上，感觉就足够了。

但是一旦我们把 `LineTo` 也纳入考察范围，就会发现定义在字段上的元数据，并不能很好的表示字段之间的关系。这样我们在实现 `LineTo` 中的 `to` 参数的时候，针对节点的寻址就会变得非常麻烦。于是我们在实现 `Node` 的时候，便把元数据定义在原型对象上，而不是字段上：

```ts
// 粗略的实现
export function Node (options: NodeOptions = {}) {
  return (prototype: Record<string, any>, propertyKey: string) => {
    const opt = defu<NodeOptions, Required<NodeOptions>>(options, {
      shape: 'square',
      text: propertyKey.toString()
    })

    const fields = getNodeFields(prototype)
    if (fields) {
      Reflect.defineProperty(fields, propertyKey, {
        value: opt,
        configurable: true,
        enumerable: true,
        writable: true
      })
    } else {
      Reflect.defineMetadata(
        NodeFieldsMetadataKey,
        {
          [propertyKey]: opt
        },
        prototype
      )
    }
  }
}
```
这样我们就保存了一份 `Map<Node>` 在元数据里，这给后面 `LineTo` 的寻址和验证，提供了实现基础。

关于这点，我用前端熟悉的语言来举个例子：

在 `vue element-ui` 中有 `el-form` 和 `el-form-item` 组件，`el-form-item` 在组件挂载时，会把组件实例给附加到父级的 `el-form` 中去，这样开发者就能够通过直接操纵 `el-form` 组件实例，来操作所有内部的 `el-form-item` 的组件实例。

接下来我们来实现 `LineTo`，由于一个节点和连接线是一对多的关系，所以我们可以用数组来保存这种关系：

```ts
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
```

这样我们的装饰器部分就定义完成了，不过目前我们只是完成了 `Code First` 中类的字段关系的抽象，接下来如何把这样的关系，转化为特定的 `SDL` 呢？接下来我们来 **实现转化器**。


### 实现转化器

#### 原始转化器

#### 更好的转化器


## 参考文档

[Source Code(源码)](https://github.com/sonofmagic/use-decorators-to-generate-SDL)

[mermaid-js](https://github.com/mermaid-js/mermaid)

[Decorators(装饰器)](https://www.typescriptlang.org/docs/handbook/decorators.html)