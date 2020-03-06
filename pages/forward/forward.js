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
    imageWidth: 0,
    wid: null,
    name: '',
    image: '',
    content: '',
    forwardContent: ''
  },

  /**
   * 生命周期函数--监听页var面加载
   */
  onLoad: function (options) {
    this.calWidth();
    this.setData({
      wid: options.wid,
      name: options.name,
      image: options.image,
      content: options.content,
      forwardContent: options.forward_content
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

  calWidth: function () {
    const windowWidth = wx.getSystemInfoSync().windowWidth;
    const imageWidth = windowWidth * 0.17;
    this.setData({
      imageWidth: imageWidth
    })
  },

  textareaChange: function (e) {
    this.setData({
      forwardContent: e.detail.value
    })
  },

  addForward: function (e) {
    var content = this.data.forwardContent;
    if (content === '') {
      content = '转发微博'
    }
    wx.request({
      url: app.globalData.host + '/forward',
      header: {
        'token': app.globalData.token
      },
      method: 'POST',
      data: {
        content: content,
        wid: this.data.wid
      },
      success(res) {
        verifyToken(res);
        if (res.statusCode == 200) {
          Toast.success('转发成功');
          wx.navigateBack({});
        } else {
          Toast.fail(res.data.msg);
        }
      }
    })
  }
})