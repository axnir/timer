import * as echarts from '../../ec-canvas/echarts'

function setOption(chart, ydata) {
  const option = {
    color: ['#ff6347'],
    tooltip: {
      trigger: 'axis',
      axisPointer: { // 坐标轴指示器，坐标轴触发有效
        type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
      }
    },
    grid: {
      left: 20,
      right: 20,
      bottom: 15,
      top: 40,
      containLabel: true
    },
    xAxis: [{
      type: 'value',
      axisLine: {
        lineStyle: {
          color: '#999'
        }
      },
      axisLabel: {
        color: '#666'
      }
    }],
    yAxis: [{
      type: 'category',
      axisTick: {
        show: false
      },
      data: ['工作', '休息'],
      axisLine: {
        lineStyle: {
          color: '#999'
        }
      },
      axisLabel: {
        color: '#666'
      }
    }],
    series: [{
      type: 'bar',
      label: {
        normal: {
          show: true,
          position: 'inside'
        }
      },
      data: ydata,
      // itemStyle: {
      //   emphasis: {
      //     color: '#ff6347'
      //   }
      // }
    }]
  }
  chart.setOption(option)
}

Page({
  data: {
    ec: {
      // 将 lazyLoad 设为 true 后，需要手动初始化图表
      lazyLoad: true
    },
    isLoaded: false,
    isDisposed: false,
    modalHidden: true,
    chartsHidden: false,
    tomatoTotal: 0,
    timeTotal: 0,
    firstLoad: true
  },
  onReady: function () {
    // 获取组件
    this.ecComponent = this.selectComponent('#mychart-dom-bar')
    this.getOption()
    this.getInfo()
    this.data.firstLoad = false
  },
  onShow: function () {
    if (this.data.firstLoad === false) {
      this.getOption()
      this.getInfo()
    }
  },
  getOption: function () {
    this.init([wx.getStorageSync('totalWorkTime'), wx.getStorageSync('totalRestTime')])
  },

  // 初始化图表
  init: function (ydata) {
    this.ecComponent.init((canvas, width, height, dpr) => {
      // 获取组件的 canvas、width、height 后的回调函数
      // 在这里初始化图表
      const chart = echarts.init(canvas, null, {
        width: width,
        height: height,
        devicePixelRatio: dpr // new
      });
      setOption(chart, ydata)

      // 将图表实例绑定到 this 上，可以在其他成员函数（如 dispose）中访问
      this.chart = chart

      this.setData({
        isLoaded: true,
        isDisposed: false
      });

      // 注意这里一定要返回 chart 实例，否则会影响事件处理等
      return chart;
    });
  },
  dispose: function () {
    if (this.chart) {
      this.chart.dispose()
    }

    this.setData({
      isDisposed: true
    });
  },
  getInfo: function () {
    let tomatoTotal = wx.getStorageSync('totalTomato')
    let timeTotal = wx.getStorageSync('totalWorkTime') + wx.getStorageSync('totalRestTime')
    this.setData({
      tomatoTotal: tomatoTotal,
      timeTotal: timeTotal
    })
  },
  switchModal() {
    this.setData({
      modalHidden: !this.data.modalHidden,
      chartsHidden: !this.data.chartsHidden
    })
  },
  clearInfo: function () {
    wx.setStorageSync('totalTomato', [0])
    wx.setStorageSync('totalWorkTime', [0])
    wx.setStorageSync('totalRestTime', [0])
    this.switchModal()
    this.getOption()
    this.getInfo()
  }
});