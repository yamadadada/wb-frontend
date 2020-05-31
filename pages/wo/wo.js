import { verifyToken } from '../../utils/util'

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    color: '#3A3A3A',
    background: '#FDFDFD',
    loading: false,
    imageWidth: 0,
    user: null,
    totalCount: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.calWidth();
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
    const that = this;
    this.setData({
      loading: true
    })
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
      },
      complete() {
        that.setData({
          loading: false
        })
      }
    });
    var totalCount = wx.getStorageSync('messageCount').totalCount;
    if (totalCount > 0) {
      this.setData({
        totalCount: totalCount
      })
    } else {
      this.setData({
        totalCount: null
      })
    }
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
    } else if (e.detail == 1) {
      wx.switchTab({
        url: '/pages/find/find'
      })
    } else if (e.detail == 2) {
      wx.switchTab({
        url: '/pages/message/message'
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