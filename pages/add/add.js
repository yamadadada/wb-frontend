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
    content: '',
    fileList: [],
    showPop1: false,
    searchValue1: '',
    showCancel: false,
    alternative1: [],
    userIndex: [],
    indexList: [],
    nodes: [{
      name: 'div',
      attrs: {
        class: 'blue_name'
      },
      children: [{
        type: 'text',
        text: 'Hello&nbsp;World!'
      }]
    }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    wx.request({
      url: app.globalData.host + '/user/userIndex',
      header: {
        'token': app.globalData.token
      },
      success(res) {
        verifyToken(res);
        if (res.statusCode == 200) {
          var list = []
          for (var i in res.data.data) {
            list.push(res.data.data[i].indexBar);
          }
          that.setData({
            indexList: list,
            userIndex: res.data.data
          })
        }
      }
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

  afterRead: function(event) {
    const { file } = event.detail;
    var fileList = this.data.fileList;
    fileList.push({url: file.path, name: '1'});
    this.setData({ fileList });
  },

  deleteImage: function(event) {
    const index = event.detail.index;
    var fileList = this.data.fileList;
    fileList.splice(index, 1);
    this.setData({ fileList });
  },

  textareaChange: function (e) {
    this.setData({
      content: e.detail.value
    })
  },

  addWeibo: function (e) {
    if (this.data.content == '') {
      Toast.fail('微博内容不能为空');
      return;
    }
    const that = this;
    wx.request({
      url: app.globalData.host + '/weibo',
      header: {
        'token': app.globalData.token
      },
      method: 'POST',
      data: {
        content: this.data.content
      },
      success(res) {
        verifyToken(res);
        if (res.statusCode == 200) {
          Toast.success('发布成功');
          that.sendImage(res.data.data, 0);
          setTimeout(function(){
            wx.navigateBack({});
          }, 2000);
        } else {
          Toast.fail(res.data.msg);
        }
      }
    })
  },

  sendImage: function(wid, index) {
    const fileList = this.data.fileList;
    const count = fileList.length;
    if (index >= count) {
      return;
    }
    const that = this;
    wx.uploadFile({
      url: app.globalData.host + '/weibo/upload/' + wid,
      header: {
        'token': app.globalData.token
      },
      filePath: fileList[index].url,
      name: 'file',
      success(res) {
        that.sendImage(wid, index + 1);
      }
    });
  },

  openPop1: function () {
    this.setData({
      showPop1: true
    })
  },

  closePop1: function () {
    this.setData({
      showPop1: false
    })
  },

  startSearch: function () {
    this.setData({
      showCancel: true
    })
  },

  endSearch: function () {
    this.setData({
      showCancel: false,
      searchValue1: ''
    })
  },

  changeSearch1: function (e) {
    const that = this;
    this.setData({
      searchValue1: e.detail
    })
    if (e.detail != null && e.detail != '') {
      wx.request({
        url: app.globalData.host + '/user/searchByName',
        header: {
          'token': app.globalData.token
        },
        data: {
          name: e.detail
        },
        success(res) {
          verifyToken(res);
          if (res.statusCode == 200) {
            that.setData({
              alternative1: res.data.data
            })
          }
        }
      })
    }
  },

  select1: function (e) {
    const name = e.currentTarget.dataset.name;
    this.setData({
      showPop1: false,
      searchValue1: '',
      showCancel: false,
      content: this.data.content + '@' + name + ' '
    })
  },

  onPageScroll(event) {
    this.setData({
      scrollTop: event.scrollTop
    });
  }
})