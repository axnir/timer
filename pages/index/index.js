const util = require('../../utils/util.js')
const taskName = {
  work: '工作',
  rest: '休息'
}
const initDeg = {
  left: 45,
  right: -45,
}

Page({
  data: {
    remainTimeText: '',
    timerType: 'work',
    completed: false,
    isRuning: false,
    startTime: 0,
    keepTime: 0,
    endTime: 0,
    leftDeg: initDeg.left,
    rightDeg: initDeg.right,
    totalTomato: 0,
    totalWorkTime: 0,
    totalRestTime: 0
  },

  onShow: function () {
    let workTime = util.formatTime(wx.getStorageSync('workTime'),'MM')
    let restTime = util.formatTime(wx.getStorageSync('restTime'),"MM")
    this.setData({
      workTime: workTime,
      restTime: restTime,
      remainTimeText: workTime + ':00'
    })
  },

  startTimer: function (e) {
    let startTime = Date.now()
    let isRuning = this.data.isRuning
    let timerType = e.target.dataset.type
    let showTime = this.data[timerType + 'Time']
    let keepTime = showTime * 60 * 1000
    let screenOn = wx.getStorageSync('screenOn')

    if (!isRuning) {
      console.log('start...')
      this.timer = setInterval((function () {
        this.updateTimer()
      }).bind(this), 1000)

      wx.setKeepScreenOn({
        keepScreenOn: screenOn
      })
      wx.hideTabBar({})

    } else {
      this.stopTimer()
      wx.showTabBar({})
      console.log('end...')
    }

    this.setData({
      isRuning: !isRuning,
      completed: false,
      timerType: timerType,
      remainTimeText: showTime + ':00',
      taskName: taskName[timerType],
      startTime: startTime,
      keepTime: keepTime,
      endTime: keepTime + startTime,
    })
    this.saveTimer()
    
  },

  stopTimer: function () {
    // 重设倒计时圆
    this.setData({
      leftDeg: initDeg.left,
      rightDeg: initDeg.right
    })

    // 清除定时器
    clearInterval(this.timer)
  },

  updateTimer: function () {
    let data = this.data
    let now = Date.now()
    let remainingTime = Math.round((data.endTime - now) / 1000)
    let M = util.formatTime(Math.floor(remainingTime / (60)) % 60, 'MM')
    let S = util.formatTime(Math.floor(remainingTime) % 60, 'SS')
    let halfTime

    //更新圆环进度条
    halfTime = data.keepTime / 2
    if ((remainingTime * 1000) > halfTime) {
      this.setData({
        leftDeg: initDeg.left - (180 * (now - data.startTime) / halfTime)
      })
    } else {
      this.setData({
        leftDeg: -135
      })
      this.setData({
        rightDeg: initDeg.right - (180 * (now - (data.startTime + halfTime)) / halfTime)
      })
    }

    if (remainingTime > 0) {
      let remainTimeText = M + ":" + S
      this.setData({
        remainTimeText: remainTimeText
      })
    } else if (remainingTime == 0) {
      this.setData({
        completed: true
      })

      //任务完成后的通知铃声
      let noticeRing = wx.getStorageSync('notice')
      if (noticeRing === true) {
        const innerAudioContext = wx.createInnerAudioContext()
        innerAudioContext.autoplay = true
        innerAudioContext.src = 'audio/notice.wav'
        innerAudioContext.onPlay(() => {
          console.log('start playing the notification ring')
        })
        innerAudioContext.onError((res) => {
          console.log(res.errMsg)
          console.log(res.errCode)
        })
      }

      //任务时间&次数
      this.setData({
        totalTomato: this.data.totalTomato + 1
      })
      if (this.data.timerType === 'work') {
        this.setData({
          totalWorkTime: this.data.totalWorkTime + wx.getStorageSync('workTime')
        })
      } else {
        this.setData({
          totalRestTime: this.data.totalRestTime + wx.getStorageSync('restTime')
        })
      }
      this.stopTimer()
    }
  },
  saveTimer: function () {
    wx.setStorage({
      data: this.data.totalTomato,
      key: 'totalTomato',
    })
    wx.setStorage({
      data: this.data.totalWorkTime,
      key: 'totalWorkTime',
    })
    wx.setStorage({
      data: this.data.totalRestTime,
      key: 'totalRestTime',
    })
  }
})