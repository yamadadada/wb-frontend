import { verifyToken } from '../../utils/util'
import Dialog from '../../vant/dialog/dialog';
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
    smallAvatarWidth: 0,
    imageWidth: 0,
    boardWidth: 0,
    loginUid: null,
    uid: null,
    name: null,
    user: null,
    weiboList: [],
    type: '1',
    page: 1,
    size: 10,
    isAll: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      loginUid: app.globalData.uid
    })
    this.calWidth();
    if (options.name) {
      this.setData({
        name: options.name
      })
    } else {
      if (options.uid) {
        this.setData({
          uid: options.uid
        })
      } else {
        this.setData({
          uid: app.globalData.uid
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
    const that = this;
    if (this.data.name) {
      const that = this;
      wx.request({
        url: app.globalData.host + '/getByName',
        header: {
          'token': app.globalData.token
        },
        data: {
          name: this.data.name
        },
        success(res) {
          verifyToken(res);
          if (res.statusCode == 200) {
            that.setData({
              user: res.data.data,
              uid: res.data.data.uid
            });
            that.getWeiboList();
          }
        }
      })
    } else {
      wx.request({
        url: app.globalData.host + '/user/' + this.data.uid,
        header: {
          'token': app.globalData.token
        },
        success(res) {
          verifyToken(res);
          if (res.statusCode == 200) {
            that.setData({
              user: res.data.data
            });
            that.getWeiboList();
          }
        }
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
    if (this.data.type === '1') {
      this.getWeiboList();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  calWidth: function () {
    const windowWidth = wx.getSystemInfoSync().windowWidth;
    const avatarWidth = windowWidth * 0.184;
    this.setData({
      avatarWidth: avatarWidth,
    })
  },

  changeFollow: function (e) {
    const uid = this.data.uid;
    const isFollowIndex = "user.isFollow";
    const that = this;
    if (this.data.user.isFollow) {
      Dialog.confirm({
        title: '提示',
        message: '确定不再关注此人？'
      }).then(() => {
        that.setData({
          [isFollowIndex]: false
        })
        wx.request({
          url: app.globalData.host + '/follow/' + uid,
          header: {
            'token': app.globalData.token
          },
          method: 'DELETE',
          success(res) {
            verifyToken(res);
          }
        })
      })
    } else {
      that.setData({
        [isFollowIndex]: true
      })
      wx.request({
        url: app.globalData.host + '/follow/' + uid,
        header: {
          'token': app.globalData.token
        },
        method: 'POST',
        success(res) {
          verifyToken(res);
          if (res.statusCode == 200) {
            Toast.success('关注成功');
          }
        }
      })
    }
  },

  getWeiboList: function () {
    if (this.data.isAll) {
      return;
    }
    const that = this;
    wx.request({
      url: app.globalData.host + '/weibo/user/' + this.data.uid,
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
          } else{
            that.setData({
              weiboList: that.data.weiboList.concat(list),
              page: that.data.page + 1
            })
            if (list.length < that.data.size) {
              that.setData({
                isAll: true
              })
            }
          }
        }
      }
    })
  },

  changeTab: function (event) {
    const type = event.detail.name;
    if (type === '0') {
      this.setData({
        type: '0'
      })
    } else {
      this.setData({
        type: '1'
      })
    }
  },

  toTop: function () {
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 300
    })
  },

  appeal: function () {
    wx.navigateTo({
      url: '/pages/appeal/appeal?id=' + this.data.user.uid + '&type=2'
    })
  }
})