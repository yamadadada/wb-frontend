import { verifyToken } from '../../utils/util'

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    color: '#3A3A3A',
    background: '#FDFDFD',
    avatarWidth: 0,
    active: 0,
    followList: [],
    fanList: [],
    likeList: [],
    favoriteList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.calWidth();
    const active = options.active;
    const that = this;
    this.setData({
      active: active
    })
    if (active === '0') {
      if (this.data.followList.length === 0) {
        wx.request({
          url: app.globalData.host + '/user/myFollow',
          header: {
            'token': app.globalData.token
          },
          success(res) {
            verifyToken(res);
            if (res.statusCode == 200) {
              that.setData({
                followList: res.data.data
              })
            }
          }
        })
      }
    } else if (active === '1') {
      if (this.data.fanList.length === 0) {
        wx.request({
          url: app.globalData.host + '/user/myFans',
          header: {
            'token': app.globalData.token
          },
          success(res) {
            verifyToken(res);
            if (res.statusCode == 200) {
              that.setData({
                fanList: res.data.data
              })
            }
          }
        })
      }
    } else if (active === '2') {
      if (this.data.likeList.length === 0) {
        wx.request({
          url: app.globalData.host + '/weibo/myLike',
          header: {
            'token': app.globalData.token
          },
          success(res) {
            verifyToken(res);
            if (res.statusCode == 200) {
              that.setData({
                likeList: res.data.data
              })
            }
          }
        })
      }
    } else {
      if (this.data.favoriteList.length === 0) {
        wx.request({
          url: app.globalData.host + '/weibo/myFavorite',
          header: {
            'token': app.globalData.token
          },
          success(res) {
            verifyToken(res);
            if (res.statusCode == 200) {
              that.setData({
                favoriteList: res.data.data
              })
            }
          }
        })
      }
    }
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

  changeTab: function (event) {
    const type = event.detail.name;
    const that = this;
    if (type === '0') {
      if (this.data.followList.length === 0) {
        wx.request({
          url: app.globalData.host + '/user/myFollow',
          header: {
            'token': app.globalData.token
          },
          success(res) {
            verifyToken(res);
            if (res.statusCode == 200) {
              that.setData({
                followList: res.data.data
              })
            }
          }
        })
      }
    } else if (type === '1') {
      if (this.data.fanList.length === 0) {
        wx.request({
          url: app.globalData.host + '/user/myFans',
          header: {
            'token': app.globalData.token
          },
          success(res) {
            verifyToken(res);
            if (res.statusCode == 200) {
              that.setData({
                fanList: res.data.data
              })
            }
          }
        })
      }
    } else if (type === '2') {
      if (this.data.likeList.length === 0) {
        wx.request({
          url: app.globalData.host + '/weibo/myLike',
          header: {
            'token': app.globalData.token
          },
          success(res) {
            verifyToken(res);
            if (res.statusCode == 200) {
              that.setData({
                likeList: res.data.data
              })
            }
          }
        })
      }
    } else {
      if (this.data.favoriteList.length === 0) {
        wx.request({
          url: app.globalData.host + '/weibo/myFavorite',
          header: {
            'token': app.globalData.token
          },
          success(res) {
            verifyToken(res);
            if (res.statusCode == 200) {
              that.setData({
                favoriteList: res.data.data
              })
            }
          }
        })
      }
    }
  },

  calWidth: function () {
    const windowWidth = wx.getSystemInfoSync().windowWidth;
    const avatarWidth = windowWidth * 0.099;
    this.setData({
      avatarWidth: avatarWidth
    })
  },

  toUser: function (e) {
    const uid = e.currentTarget.dataset.uid;
    wx.navigateTo({
      url: '/pages/user/user?uid=' + uid
    })
  }
})