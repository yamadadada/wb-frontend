import { verifyToken } from '../../utils/util'
import Toast from '../../vant/toast/toast';

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    color: '#3A3A3A',
    background: '#FDFDFD',
    loading: false,
    avatarWidth: 0,
    messageList: [],
    page: 0,
    size: 10,
    isAll: false,
    atCount: null,
    commentCount: null,
    likeCount: null,
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
    var messageCount = wx.getStorageSync('messageCount');
    if (messageCount.atCount > 0) {
      this.setData({
        atCount: messageCount.atCount
      })
    } else {
      this.setData({
        atCount: null
      })
    }
    if (messageCount.commentCount > 0) {
      this.setData({
        commentCount: messageCount.commentCount
      })
    } else {
      this.setData({
        commentCount: null
      })
    }
    if (messageCount.likeCount > 0) {
      this.setData({
        likeCount: messageCount.likeCount
      })
    } else {
      this.setData({
        likeCount: null
      })
    }
    if (messageCount.totalCount > 0) {
      this.setData({
        totalCount: messageCount.totalCount
      })
    } else {
      this.setData({
        totalCount: null
      })
    }
    this.getList();
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
    this.getList();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  tabbarChange: function (e) {
    if (e.detail == 0) {
      wx.switchTab({
        url: '/pages/index/index'
      })
    } else if (e.detail == 1) {
      wx.switchTab({
        url: '/pages/find/find'
      })
    } else if (e.detail == 3) {
      wx.switchTab({
        url: '/pages/wo/wo'
      })
    }
  },

  calWidth: function () {
    const windowWidth = wx.getSystemInfoSync().windowWidth;
    const avatarWidth = windowWidth * 0.1;
    this.setData({
      avatarWidth: avatarWidth
    })
  },

  getList: function () {
    if (this.data.isAll) {
      return;
    }
    const that = this;
    this.setData({
      loading: true
    })
    wx.request({
      url: app.globalData.host + '/message/system',
      header: {
        'token': app.globalData.token
      },
      data: {
        page: this.data.page + 1,
        size: this.data.size
      },
      success(res) {
        verifyToken(res);
        if (res.statusCode === 200) {
          const list = res.data.data;
          if (list == null || list.length == 0) {
            that.setData({
              isAll: true
            })
          } else {
            var messageCount = wx.getStorageSync('messageCount');
            messageCount.totalCount = messageCount.totalCount - messageCount.systemCount;
            messageCount.systemCount = 0;
            wx.setStorageSync('messageCount', messageCount);
            var messageId = wx.getStorageSync('messageId')
            messageId.systemId = list[0].mid;
            wx.setStorageSync('messageId', messageId);
            that.setData({
              messageList: that.data.messageList.concat(list),
              page: that.data.page + 1,
              totalCount: messageCount.totalCount
            })
            if (list.length < that.data.size) {
              that.setData({
                isAll: true
              })
            }
          }
        } else {
          Toast.fail(res.data.msg);
        }
      },
      complete() {
        that.setData({
          loading: false
        })
      }
    })
  },

  closeSwipe: function (event) {
    const { position, instance } = event.detail;
    const list = this.data.messageList;
    wx.request({
      url: app.globalData.host + '/message/' + event.currentTarget.dataset.mid,
      header: {
        'token': app.globalData.token
      },
      method: 'DELETE'
    })
    list.splice(event.currentTarget.dataset.index, 1);
    this.setData({
      messageList: list
    })
    instance.close();
  },

  toUser: function (e) {
    const uid = e.currentTarget.dataset.uid;
    wx.navigateTo({
      url: '/pages/user/user?uid=' + uid
    })
  },

  toTop: function () {
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 300
    })
  }
})