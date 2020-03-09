import { verifyToken } from '../../utils/util'

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    color: '#3A3A3A',
    background: '#FDFDFD',
    imageWidth: 0,
    user: null
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
    this.calWidth();
    const that = this;
    wx.request({
      url: app.globalData.host + '/user',
      header: {
        'token': app.globalData.token
      },
      success(res) {
        verifyToken(res);
        if (res.statusCode == 200) {
          that.setData({
            user: res.data.data
          })
        }
      }
    })
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
    }
  },

  calWidth: function () {
    const windowWidth = wx.getSystemInfoSync().windowWidth;
    const imageWidth = windowWidth * 0.15;
    this.setData({
      imageWidth: imageWidth
    })
  }
})