import { verifyToken, openDialog } from '../../utils/util'
import { $stopWuxRefresher } from '../../lib/index'

const app = getApp()

Page({
  data: {
    color: '#000',
    background: '#ffffff',
    dialogVisible: false,
    sheetVisible: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    weiboList: [],
    likeColor: '#A7A7A7',
    imageWidth: 0,
    boardWidth: 0,
    actions: [
      {
        name: '收藏'
      },
      {
        name: '投诉'
      }
    ],
    list: [{
      "text": "微博",
      "iconPath": "/icon/home.png",
      "selectedIconPath": "/icon/home-fill.png",
      dot: true
    },
    {
      "text": "发现",
      "iconPath": "/icon/fangdajing.png",
      "selectedIconPath": "/icon/sousuofangdajing.png",
      badge: 'New'
    },
    {
      "text": "消息",
      "iconPath": "/icon/email.png",
      "selectedIconPath": "/icon/email-fill.png"
    },
    {
      "text": "我",
      "iconPath": "/icon/people.png",
      "selectedIconPath": "/icon/people-fill.png"
    }]
  },
  tabChange: function (e) {
    console.log('tab change', e)
  },
  onLoad: function () {
    this.calWidth();
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
      success (res) {
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

  calWidth: function () {
    const windowWidth = wx.getSystemInfoSync().windowWidth;
    const boardWidth = windowWidth * 0.0125;
    const imageWidth = windowWidth * 0.3;
    this.setData({
      imageWidth: imageWidth,
      boardWidth: boardWidth
    })
  },

  showGallery: function (e) {
    wx.previewImage({
      current: e.currentTarget.dataset.current,
      urls: e.currentTarget.dataset.urls,
    })
  },

  toWeiboDetail: function (e) {
    wx.navigateTo({
      url: '/pages/wb-detail/wb-detail?wid=' + e.currentTarget.dataset.wid
    })
  },

  showSheet: function (e) {
    const wid = e.currentTarget.dataset.wid;
    this.setData({
      sheetVisible: true
    })
  },

  sheetClose: function (e) {
    this.setData({
      sheetVisible: false
    })
  },
  
  sheetSelect: function (event) {
    console.log(event.detail);
  },

  toAddWeibo: function () {
    wx.navigateTo({
      url: '/pages/add/add'
    })
  },

  likeChange: function (e) {
    const wid = e.currentTarget.dataset.wid;
    const islike = e.currentTarget.dataset.islike;
    const index = e.currentTarget.dataset.index;
    const islikeIndex = "weiboList[" + index + "].isLike";
    const likeCountIndex = "weiboList[" + index + "].likeCount";
    if (islike) {
      this.setData ({
        [islikeIndex]: false,
        [likeCountIndex]: this.data.weiboList[index].likeCount - 1
      })
      wx.request({
        url: app.globalData.host + '/weiboLike/' + wid,
        header: {
          'token': app.globalData.token
        },
        method: 'delete',
        success(res) {
          verifyToken(res);
        }
      })
    } else {
      this.setData({
        [islikeIndex]: true,
        [likeCountIndex]: this.data.weiboList[index].likeCount + 1
      })
      wx.request({
        url: app.globalData.host + '/weiboLike/' + wid,
        header: {
          'token': app.globalData.token
        },
        method: 'put',
        success(res) {
          verifyToken(res);
        }
      })
    }
  },

  toAddForward: function (e) {
    const forwardContent = ''
    wx.navigateTo({
      url: '/pages/forward/forward?wid=' + e.currentTarget.dataset.wid + "&name=" + e.currentTarget.dataset.name + "&image=" + e.currentTarget.dataset.image + "&content=" + e.currentTarget.dataset.content + "&forward_content=" + forwardContent
    })
  }
})