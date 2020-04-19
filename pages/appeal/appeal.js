import Toast from '../../vant/toast/toast';
import { verifyToken } from '../../utils/util'

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    color: '#000',
    background: '#f8f8f8',
    targetId: null,
    targetType: null,
    focus: false,
    appealType: null,
    content: '',
    disabled: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      targetId: options.id,
      targetType: options.type
    })
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

  onChange: function (e) {
    this.setData({
      appealType: e.detail,
      disabled: false
    })
    if (e.detail == '6') {
      this.setData({
        focus: true
      })
    } else {
      this.setData({
        focus: false
      })
    }
  },

  onInput: function (e) {
    this.setData({
      content: e.detail.value
    })
  },

  commit: function () {
    const appealType = this.data.appealType;
    if (appealType == '12' && this.data.content.length == 0) {
      Toast.fail('投诉内容不能为空')
    }
    wx.request({
      url: app.globalData.host + '/appeal/' + this.data.targetType + '/' + this.data.targetId,
      header: {
        'token': app.globalData.token
      },
      data: {
        type: appealType,
        content: this.data.content
      },
      success(res) {
        verifyToken(res);
        if (res.statusCode == 200) {
          Toast.success('投诉成功');
          setTimeout(function () {
            wx.navigateBack({});
          }, 2000);
        } else {
          Toast.fail('投诉失败，请稍后再试')
        }
      },
      fail() {
        Toast.fail('投诉失败，请稍后再试')
      }
    })
  }
})