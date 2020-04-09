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
    avatarWidth: 0,
    active: 0,
    followList: [],
    fanList: [],
    likeList: [],
    favoriteList: [],
    page1: 1,
    size1: 10,
    isAll1: false,
    page2: 1,
    size2: 10,
    isAll2: false,
    page3: 1,
    size3: 10,
    isAll3: false,
    page4: 1,
    size4: 10,
    isAll4: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.calWidth();
    const active = options.active;
    this.setData({
      active: active
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
    const active = this.data.active;
    if (active == 0) {
      this.getFollowList();
    } else if (active == 1) {
      this.getFanList();
    } else if (active == 2) {
      this.getLikeList();
    } else {
      this.getFavortieList();
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
    if (this.data.active == 0) {
      this.getFollowList();
    } else if (this.data.active == 1) {
      this.getFanList();
    } else if (this.data.active == 2) {
      this.getLikeList();
    } else {
      this.getFavortieList();
    }
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
      this.setData({
        active: 0
      })
      if (this.data.followList.length === 0) {
        this.getFollowList();
      }
    } else if (type === '1') {
      this.setData({
        active: 1
      })
      if (this.data.fanList.length === 0) {
        this.getFanList();
      }
    } else if (type === '2') {
      this.setData({
        active: 2
      })
      if (this.data.likeList.length === 0) {
        this.getLikeList();
      }
    } else {
      this.setData({
        active: 3
      })
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
  },

  getFollowList: function () {
    if (this.data.isAll1) {
      return;
    }
    const that = this;
    wx.request({
      url: app.globalData.host + '/user/myFollow',
      header: {
        'token': app.globalData.token
      },
      data: {
        page: this.data.page1 + 1,
        size: this.data.size1
      },
      success(res) {
        verifyToken(res);
        if (res.statusCode == 200) {
          const list = res.data.data;
          if (list == null || list.length == 0) {
            that.setData({
              isAll1: true
            })
          } else {
            that.setData({
              followList: that.data.followList.concat(list),
              page1: that.data.page1 + 1
            })
            if (list.length < that.data.size1) {
              that.setData({
                isAll1: true
              })
            }
          }
        } else {
          Toast.fail('加载失败，请稍后再试');
        }
      }
    })
  },

  getFanList: function () {
    if (this.data.isAll2) {
      return;
    }
    const that = this;
    wx.request({
      url: app.globalData.host + '/user/myFans',
      header: {
        'token': app.globalData.token
      },
      data: {
        page: this.data.page2 + 1,
        size: this.data.size2
      },
      success(res) {
        verifyToken(res);
        if (res.statusCode == 200) {
          const list = res.data.data;
          if (list == null || list.length == 0) {
            that.setData({
              isAll2: true
            })
          } else {
            that.setData({
              fanList: that.data.fanList.concat(list),
              page2: that.data.page2 + 1
            })
            if (list.length < that.data.size2) {
              that.setData({
                isAll2: true
              })
            }
          }
        } else {
          Toast.fail('加载失败，请稍后再试');
        }
      }
    })
  },

  getLikeList: function () {
    if (this.data.isAll3) {
      return;
    }
    const that = this;
    wx.request({
      url: app.globalData.host + '/weibo/myLike',
      header: {
        'token': app.globalData.token
      },
      data: {
        page: this.data.page3 + 1,
        size: this.data.size3
      },
      success(res) {
        verifyToken(res);
        if (res.statusCode == 200) {
          const list = res.data.data;
          if (list == null || list.length == 0) {
            that.setData({
              isAll3: true
            })
          } else {
            that.setData({
              likeList: that.data.likeList.concat(list),
              page3: that.data.page3 + 1
            })
            if (list.length < that.data.size3) {
              that.setData({
                isAll3: true
              })
            }
          }
        } else {
          Toast.fail('加载失败，请稍后再试');
        }
      }
    })
  },

  getFavortieList: function () {
    if (this.data.isAll4) {
      return;
    }
    const that = this;
    wx.request({
      url: app.globalData.host + '/weibo/myFavorite',
      header: {
        'token': app.globalData.token
      },
      data: {
        page: this.data.page4 + 1,
        size: this.data.size4
      },
      success(res) {
        verifyToken(res);
        if (res.statusCode == 200) {
          const list = res.data.data;
          if (list == null || list.length == 0) {
            that.setData({
              isAll4: true
            })
          } else {
            that.setData({
              favoriteList: that.data.favoriteList.concat(list),
              page4: that.data.page4 + 1
            })
            if (list.length < that.data.size4) {
              that.setData({
                isAll4: true
              })
            }
          }
        } else {
          Toast.fail('加载失败，请稍后再试');
        }
      }
    })
  },

  toTop: function () {
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 300
    })
  }
})