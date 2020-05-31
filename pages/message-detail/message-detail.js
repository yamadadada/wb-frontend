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
    title: '',
    type: 0,
    messageList: [],
    page: 0,
    size: 10,
    isAll: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      type: options.type
    })
    this.calWidth()
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
    const type = this.data.type;
    if (type == '0') {
      this.getList('at');
      this.setData({
        title: '@我的'
      })
    } else if (type == '1') {
      this.getList('comment');
      this.setData({
        title: '回复我的'
      })
    } else {
      this.getList('like');
      this.setData({
        title: '收到的赞'
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
    const type = this.data.type;
    if (type == '0') {
      this.getList('at');
    } else if (type == '1') {
      this.getList('comment');
    } else {
      this.getList('like');
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  getList: function (type) {
    if (this.data.isAll) {
      return;
    }
    const that = this;
    this.setData({
      loading: true
    })
    wx.request({
      url: app.globalData.host + '/message/' + type,
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
            var messageId = wx.getStorageSync('messageId');
            if (that.data.type == '0') {
              messageCount.totalCount = messageCount.totalCount - messageCount.atCount;
              messageCount.atCount = 0;
              messageId.atId = list[0].mid;
            } else if (that.data.type == '1') {
              messageCount.totalCount = messageCount.totalCount - messageCount.commentCount;
              messageCount.commentCount = 0;
              messageId.commentId = list[0].mid;
            } else {
              messageCount.totalCount = messageCount.totalCount - messageCount.likeCount;
              messageCount.likeCount = 0;
              messageId.likeId = list[0].mid;
            }
            wx.setStorageSync('messageCount', messageCount);
            wx.setStorageSync('messageId', messageId);
            that.parseDescription(list);
            that.setData({
              messageList: that.data.messageList.concat(list),
              page: that.data.page + 1
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

  calWidth: function () {
    const windowWidth = wx.getSystemInfoSync().windowWidth;
    const avatarWidth = windowWidth * 0.088;
    this.setData({
      avatarWidth: avatarWidth
    })
  },

  toUser: function (e) {
    const uid = e.currentTarget.dataset.uid;
    wx.navigateTo({
      url: '/pages/user/user?uid=' + uid
    })
  },

  parseDescription: function (list) {
    for (var i in list) {
      if (list[i].type == 0) {
        list[i].description = '@了我'
      } else if (list[i].type == 1) {
        if (list[i].wid == null) {
          list[i].description = '回复了我的评论'
        } else {
          list[i].description = '回复了我的微博'
        }
      } else {
        if (list[i].wid == null) {
          list[i].description = '赞了我的评论'
        } else {
          list[i].description = '赞了我的微博'
        }
      }
    }
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

  toDetail: function (e) {
    console.log('点击了')
    const wid = e.currentTarget.dataset.wid;
    const cid = e.currentTarget.dataset.cid;
    if (wid != null) {
      if (cid == null) {
        wx.navigateTo({
          url: '/pages/wb-detail/wb-detail?wid=' + wid
        })
      } else {
        wx.navigateTo({
          url: '/pages/wb-detail/wb-detail?wid=' + wid
        })
      }
    } else {
      wx.navigateTo({
        url: '/pages/comment/comment?cid=' + cid
      })
    }
  },

  toTop: function () {
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 300
    })
  }
})