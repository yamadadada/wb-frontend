import { verifyToken } from '../../utils/util'
import { $stopWuxRefresher } from '../../lib/index'
import Toast from '../../vant/toast/toast';

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    color: '#000',
    background: '#ffffff',
    dialogVisible: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    weiboList: [],
    page: 1,
    size: 10,
    isAll: false,
    totalCount: null
  },

  tabChange: function (e) {
    if (e.detail == 1) {
      wx.switchTab({
        url: '/pages/find/find'
      })
    } else if (e.detail == 2) {
      wx.switchTab({
        url: '/pages/message/message'
      })
    } else if (e.detail == 3) {
      wx.switchTab({
        url: '/pages/wo/wo'
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    const that = this;
    // 无登录，进行登录操作
    if (!app.globalData.uid) {
      wx.login({
        success: res => {
          if (res.code) {
            // 发送 res.code 到后台换取 openId, sessionKey, unionId
            wx.request({
              url: app.globalData.host + '/login',
              data: {
                'code': res.code
              },
              success(res) {
                if (res.statusCode === 200) {
                  app.globalData.uid = res.data.data.uid;
                  app.globalData.token = res.data.data.token;
                  that.getWeiboInfo();
                  that.getBadge();
                } else {
                  Toast.fail('登录失败: ' + res.data.msg);
                }
              },
              fail() {
                Toast.fail('登录失败，请稍后再试！');
              }
            })
          } else {
            Toast.fail('登录失败：' + res.errMsg);
          }
        }
      })
    }
    // 检查用户是否授权
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，不会弹框
        } else {
          // 未授权，弹窗提示授权
          that.setData({
            dialogVisible: true
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (app.globalData.token != null) {
      this.getWeiboInfo();
    };
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

  dialogClose: function () {
    this.setData({
      dialogVisible: false
    })
  },

  getUserInfo: function (e) {
    this.setData({
      dialogVisible: false
    })
    app.globalData.userInfo = e.detail.userInfo
    // 传递数据给后台
    wx.request({
      url: app.globalData.host + '/getUserInfo',
      data: {
        'name': app.globalData.userInfo.nickName,
        'avatar': app.globalData.userInfo.avatarUrl,
        'gender': app.globalData.userInfo.gender,
        'country': app.globalData.userInfo.country,
        'province': app.globalData.userInfo.province,
        'city': app.globalData.userInfo.city
      },
      header: {
        'token': app.globalData.token
      },
      method: 'POST',
      success(res) {
        verifyToken(res);
        if (res.statusCode == 200 && !res.data.data.isNameChange) {
          openDialog('提示', '当前昵称已被占用，请前往个人中心修改昵称')
        }
      }
    })
  },
  
  getWeiboInfo: function () {
    const that = this;
    wx.request({
      url: app.globalData.host + '/weibo',
      header: {
        'token': app.globalData.token
      },
      success(res) {
        verifyToken(res);
        if (res.statusCode == 200) {
          that.setData({
            weiboList: res.data.data,
            page: 1,
            size: 10,
            isAll: false
          })
        }
      },
      complete() {
        $stopWuxRefresher();
      }
    })
  },

  toAddWeibo: function () {
    wx.navigateTo({
      url: '/pages/add/add'
    })
  },

/**
 * 监听用户上拉触底事件
 */
  onReachBottom: function () {
    if (this.data.isAll) {
      return;
    }
    const that = this;
    wx.request({
      url: app.globalData.host + '/weibo',
      header: {
        'token': app.globalData.token
      },
      data: {
        page: this.data.page + 1,
        size: this.data.size
      },
      success(res) {
        verifyToken(res);
        if (res.statusCode == 200) {
          const list = res.data.data;
          if (list == null || list.length == 0) {
            that.setData({
              isAll: true
            })
          } else {
            that.setData({
              weiboList: that.data.weiboList.concat(list),
              page: that.data.page + 1
            });
            if (list.length < that.data.size) {
              that.setData({
                isAll: true
              })
            }
          } 
        } else {
          Toast.fail('加载失败，请稍后再试')
        }
      }
    })
  },

  toTop: function () {
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 300
    })
  },

  getBadge: function () {
    var messageId = wx.getStorageSync('messageId');
    if (messageId == null) {
      messageId = { 'atId': 0, 'commentId': 0, 'likeId': 0, 'systemId': 0}
    }
    const that = this;
    wx.request({
      url: app.globalData.host + '/message/badge',
      header: {
        'token': app.globalData.token
      },
      data: {
        atId: messageId.atId,
        commentId: messageId.commentId,
        likeId: messageId.likeId,
        systemId: messageId.systemId
      },
      success(res) {
        verifyToken(res);
        if (res.statusCode == 200) {
          var messageCount = res.data.data;
          wx.setStorage({
            key: 'messageCount',
            data: messageCount
          });
          if (messageCount.totalCount > 0) {
            that.setData({
              totalCount: messageCount.totalCount
            })
          }
        }
      }
    })
  }
})