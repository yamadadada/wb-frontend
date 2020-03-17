import { verifyToken, openDialog } from '../../utils/util'
import { $stopWuxRefresher } from '../../lib/index'

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
  },

  tabChange: function (e) {
    if (e.detail == 1) {
      wx.switchTab({
        url: '/pages/find/find'
      })
    } else if (e.detail == 2) {

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
                app.globalData.uid = res.data.data.uid;
                app.globalData.token = res.data.data.token;
              },
              fail() {
                openDialog('错误', '登录失败，请稍后再试！');
              },
              complete() {
                that.getWeiboInfo();
              }
            })
          } else {
            openDialog('错误', '登录失败：' + res.errMsg);
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
            weiboList: res.data.data
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
  }
})