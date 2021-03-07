/**
 * Created by OXOYO on 2019/11/9.
 *
 * 注册自定义节点
 */

import general from './general'
import arrow from './arrow'
import $X from '../../../config/materials'
import * as G6Util from '@antv/util'
import base from './base'
const obj = {
  ...general,
  ...arrow
}

export default function (G6, devices) {
  if (devices && devices.length) {
    devices = devices.map(device => {
      let height = $X.iconStyle[device.name].height
      let width = $X.iconStyle[device.name].width
      return {
        name: device.name,
        data: JSON.stringify(device),
        extendName: 'base-node',
        options: {
          ...base,
          shapeType: 'image',
          getShapeStyle (cfg) {
            const size = this.getSize(cfg)
            width = size[0]
            height = size[1]
            const x = 0 - width / 2
            const y = 0 - height / 2
            const color = cfg.color
            const style = G6Util.mix({}, {
              // 节点的位置在上层确定，所以这里仅使用相对位置即可
              x,
              y,
              width,
              height,
              stroke: color
            }, cfg.style)
            return style
          },
          options: G6Util.mix({}, {
            icon: device.imgUrl,
            iconStyle: {
              width: width / 2,
              height: height / 2,
              left: -width / 4,
              top: -height / 4
            },
            style: {
              fill: '#f9f9f9',
              stroke: '#bbb',
              cursor: 'default'
            },
            stateStyles: {
              selected: {
                fill: '#eee'
              }
            }
          })
        }
      }
    })
  }
  console.log(devices)
  const obj2 = {}
  devices && devices.map((e) => {
    obj2[e.name] = e
  })
  Object.assign(obj, obj2)
  console.log(obj2)
  console.log(obj)
  Object.values(obj).map(item => {
    G6.registerNode(item.name, item.options, item.extendName)
  })
}
