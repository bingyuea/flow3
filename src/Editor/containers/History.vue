/**
 * Created by OXOYO on 2020/5/18
 *
 * 操作记录
 */

<style scoped lang="less">
  .history-model {
    .body {
      display: flex;
      margin-top: 30px;
      border: 1px solid rgba(0, 0, 0, .1);
      .history-list {
        flex: 1 1 auto;
        display: flex;
        flex-direction: column;
        height: 600px;
        overflow: auto;
        .list-item {
          padding: 10px;
          cursor: pointer;
          &:hover,
          &.active {
            color: #000000;
            background: rgba(0, 0, 0, .1);
          }
        }
      }
      .history-preview {
        width: 480px;
        height: 600px;
        position: relative;
        z-index: 100;
      }
      .no-data {
        flex: 1 1 auto;
      }
    }
  }
</style>

<template>
  <XModal class-name="history-model" :visible="isShow" width="660" @on-cancel="doHide">
    <!--  <Modal class-name="history-model" v-model="isShow" width="660" @on-cancel="doHide">-->
    <div class="body">
      <template v-if="log && log.list.length">
        <div class="history-list">
          <div
            v-for="(item, index) in log.list"
            :key="index"
            class="list-item"
            :class="{ 'active': index === currentIndex }"
            @click="toggleLog(index)"
          >
            {{ $X.utils.filters.formatDate(item.time, 'YYYY-MM-DD hh:mm:ss') }}
          </div>
        </div>
        <div id="history-preview" class="history-preview"></div>
      </template>
      <XNoData v-else></XNoData>
    </div>
    <div slot="footer">
      <XButton type="default" @click="doHide">{{ $t('L10203') }}</XButton>
      <XButton type="primary" @click="doRevert">{{ $t('L10209') }}</XButton>
    </div>
  </XModal>
</template>

<script>
  import G6 from '@/global/g6/index'

  export default {
    name: 'History',
    data () {
      return {
        isShow: false,
        editor: null,
        currentIndex: null,
        log: null
      }
    },
    methods: {
      show () {
        const _t = this
        _t.getLog()
        _t.isShow = true
        _t.$nextTick(function () {
          _t.toggleLog(0)
        })
      },
      doHide () {
        const _t = this
        if (_t.editor) {
          _t.editor.destroy()
          _t.editor = null
          _t.currentIndex = null
        }
        _t.isShow = false
      },
      doRevert () {
        const _t = this
        if (!_t.log) {
          return
        }
        const item = _t.log.list[_t.currentIndex]
        if (!item) {
          return
        }
        _t.$emit('on-revert', item.content)
        _t.doHide()
      },
      getLog () {
        const _t = this
        _t.log = _t.$X.utils.storage.get('log', _t.$X.config.storage.prefix)
      },
      toggleLog (index) {
        const _t = this
        if (!_t.log) {
          return
        }
        const el = _t.$el
        _t.currentIndex = index
        const item = _t.log.list[_t.currentIndex]
        if (!item) {
          return
        }
        if (!_t.editor) {
          // 画板
          const sketchpad = el.querySelector('#history-preview')
          const grid = new G6.Grid()
          _t.editor = new G6.Graph({
            plugins: [
              grid
            ],
            container: sketchpad,
            width: sketchpad.clientWidth,
            height: sketchpad.clientHeight,
            fitView: true,
            fitViewPadding: 20,
            autoPaint: true
          })
        }
        _t.editor.data(item.content)
        _t.editor.render()
        const width = _t.editor.get('width')
        const height = _t.editor.get('height')
        const center = {
          x: width / 2,
          y: height / 2
        }
        _t.editor.zoomTo(1, center)
      }
    }
  }
</script>
