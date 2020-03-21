import { verifyToken } from '../../utils/util'

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    color: '#3A3A3A',
    background: '#FDFDFD',
    showSearch: false,
    showPop: false,
    hotList: [],
    realTimeList: [],
    schoolList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  tabChange: function (e) {
    if (e.detail == 0) {
      wx.switchTab({
        url: '/pages/index/index'
      })
    } else if (e.detail == 2) {
      
    } else if (e.detail == 3) {
      wx.switchTab({
        url: '/pages/wo/wo'
      })
    }
  },

  startSearch: function () {
    this.setData({
      showSearch: true
    })
  },

  onSearch: function () {

  },

  onCancel: function () {
    this.setData({
      showSearch: false
    })
  },

  openPop: function () {
    this.setData({
      showPop: true
    })
  },

  closePop: function () {
    this.setData({
      showPop: false
    })
  },

  changeTab: function () {
    const type = event.detail.name;
    const that = this;
    if (type === '0') {

    } else if (type === '1') {
      if (this.data.realTimeList.length === 0) {
        wx.request({
          url: app.globalData.host + '/weibo/realTime',
          header: {
            'token': app.globalData.token
          },
          success(res) {
            verifyToken(res);
            if (res.statusCode == 200) {
              that.setData({
                realTimeList: res.data.data
              })
            }
          }
        })
      }
    } else {

    }
  }
})