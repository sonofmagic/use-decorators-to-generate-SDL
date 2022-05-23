export function Flowchart (options?: Record<string, any>) {
  return (constructor: any) => {
    constructor.prototype.type = 'flowchart'
    constructor.prototype.direction = 'LR'
    // return class extends constructor {
    //   type = 'flowchart'
    //   direction = 'LR'
    // }
  }
}
