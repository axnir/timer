Page({
  onShow: function() {
    this.setData({
      workTime: wx.getStorageSync('workTime'),
      restTime: wx.getStorageSync('restTime')
    })
  },
  changeWorkTime: function(e) {
    wx.setStorage({
      key: 'workTime',
      data: e.detail.value
    })
  },
  changeRestTime: function(e) {
    wx.setStorage({
      key: 'restTime',
      data: e.detail.value
    })
  },
  switchNotice: function(e) {
    wx.setStorage({
      key: 'notice',
      data: e.detail.value
    })
  },
  switchScreenOn: function(e) {
    wx.setStorage({
      key: 'screenOn',
      data: e.detail.value
    })
    console.log(e.detail.value)
  }
})