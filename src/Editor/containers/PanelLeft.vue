/**
* Created by OXOYO on 2019/7/2.
*
* PanelLeft 左侧面板
*/

<style scoped lang="less" rel="stylesheet/less">
  .panel-left {
    .card-item {
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-start;
      align-content: flex-start;
    }
  }
</style>

<template>
  <CardBox class="panel-left" placement="left" position="right" :width="250" :title="$t('L10300')" @expand="toggleHandler">
    <CardItem
      v-for="(item, index) in materials"
      :key="index"
      :title="$t(item.lang) || item.label"
      :enableFold="true"
      :bold="true"
    >
      <NodeElement
        v-for="(child, childIndex) in item.children.filter(target => target.enable)"
        :key="childIndex"
        :title="child.label"
        :info="child"
      >
      </NodeElement>
    </CardItem>
  </CardBox>
</template>

<script>
  import CardBox from '../components/CardBox'
  import CardItem from '../components/CardItem'
  import NodeElement from '../components/NodeElement'

  export default {
    name: 'PanelLeft',
    components: {
      CardBox,
      CardItem,
      NodeElement
    },
    props: {
      materialList: {},
      devices: {
        type: Object,
        default: () => {
          return {}
        }
      }
    },
    data () {
      return {}
    },
    computed: {
      materials () {
        const materials = []
        if (this.devices && Object.entries(this.devices).length) {
          for (const k in this.devices) {
            const temp = {
              name: this.devices[k][0].type || '',
              label: this.devices[k][0].type || '',
              icon: '',
              enable: true,
              children: this.devices[k].map(item => {
                const height = this.materialList.iconStyle[item.name].height
                const width = this.materialList.iconStyle[item.name].width
                return {
                  shape: item.name,
                  originId: item.id,
                  label: item.name,
                  data: JSON.stringify(item),
                  defaultLabel: '',
                  enable: true,
                  width: Number(width) / 2,
                  height: Number(height) / 2,
                  minWidth: 20,
                  minHeight: 20,
                  anchorPoints: this.materialList.iconStyle[item.name].anchorPoints,
                  shapeControl: this.materialList.shapeControl,
                  icon: item.imgUrl
                }
              }
              )
            }
            materials.push(temp)
          }
        }
        return materials
      }
    },
    methods: {
      toggleHandler (data) {
        const _t = this
        _t.$X.utils.bus.$emit('editor/panel/toggle', data)
      }
    }
  }
</script>
