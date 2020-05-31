import Toast from '../../vant/toast/toast';
import { verifyToken } from '../../utils/util'

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
    showSearch: false,
    searchValue: '',
    weiboList: [],
    userList: [],
    history: [],
    candidateList: [],
    page1: 1,
    size1: 10,
    isAll1: false,
    page2: 1,
    size2: 10,
    isAll2: false,
    type: '0'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.calWidth();
    const content = options.content;
    this.setData({
      searchValue: content
    });
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
    const content = this.data.searchValue;
    this.search(content);
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
    const that = this;
    if (type == '0') {
      if (this.data.isAll1) {
        return;
      }
      wx.request({
        url: app.globalData.host + '/weibo/search',
        header: {
          'token': app.globalData.token
        },
        data: {
          content: content,
          page: this.data.page1,
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
                weiboList: that.data.weiboList.concat(list),
                page1: that.data.page1 + 1
              })
              if (list.length < that.data.size1) {
                that.setData({
                  isAll1: true
                })
              }
            }
          } else {
            Toast.fail("加载失败，请稍后再试")
          }
        }
      })
    } else {
      if (this.data.isAll2) {
        return;
      }
      wx.request({
        url: app.globalData.host + '/user/searchByName',
        header: {
          'token': app.globalData.token
        },
        data: {
          name: this.data.searchValue,
          page: this.data.page2,
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
                userList: that.data.userList.concat(list),
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
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  calWidth: function () {
    const windowWidth = wx.getSystemInfoSync().windowWidth;
    const avatarWidth = windowWidth * 0.099;
    this.setData({
      avatarWidth: avatarWidth
    })
  },

  startSearch: function () {
    const history = wx.getStorageSync('searchHistory');
    this.setData({
      showSearch: true,
      history: history
    })
  },

  onSearch1: function () {
    const value = this.data.searchValue.replace(/(^\s*)|(\s*$)/g, "");
    this.search(value);
  },

  onSearch2: function (e) {
    const content = e.currentTarget.dataset.content;
    this.setData({
      searchValue: content
    })
    this.search(content);
  },

  search: function (content) {
    this.setData({
      loading: true
    })
    var list = wx.getStorageSync('searchHistory');
    if (list == null) {
      list = [];
    }
    for (var index in list) {
      if (list[index] === content) {
        list.splice(index, 1);
        break;
      }
    }
    list.unshift(content);
    if (list.length > 20) {
      list.pop();
    }
    wx.setStorage({
      key: 'searchHistory',
      data: list
    })
    this.setData({
      showSearch: false
    })
    const that = this;
    wx.request({
      url: app.globalData.host + '/weibo/search',
      header: {
        'token': app.globalData.token
      },
      data: {
        content: content
      },
      success(res) {
        verifyToken(res);
        if (res.statusCode == 200) {
          that.setData({
            weiboList: res.data.data,
            page1: 1,
            isAll1: false
          })
        } else {
          Toast.fail("加载失败，请稍后再试")
        }
      },
      complete() {
        that.setData({
          loading: false
        })
      }
    })
  },

  changeSearch: function (e) {
    const searchValue = e.detail.replace(/(^\s*)|(\s*$)/g, "");
    const that = this;
    if (searchValue != null && searchValue.length > 0) {
      wx.request({
        url: app.globalData.host + '/search/candidate',
        header: {
          'token': app.globalData.token
        },
        data: {
          content: searchValue
        },
        success(res) {
          verifyToken(res);
          if (res.statusCode == 200) {
            that.setData({
              candidateList: res.data.data
            })
          }
        }
      })
    }
    this.setData({
      searchValue: searchValue
    })
  },

  onCancel: function () {
    this.setData({
      showSearch: false
    })
  },

  changeTab: function (event) {
    const type = event.detail.name;
    this.setData({
      type: type
    })
    const that = this;
    if (type === '1') {
      if (this.data.userList.length === 0) {
        wx.request({
          url: app.globalData.host + '/user/searchByName',
          header: {
            'token': app.globalData.token
          },
          data: {
            name: this.data.searchValue
          },
          success(res) {
            verifyToken(res);
            if (res.statusCode == 200) {
              that.setData({
                userList: res.data.data,
                page2: 1,
                isAll2: false
              })
            } else {
              Toast.fail('加载失败，请稍后再试');
            }
          }
        })
      }
    }
  },

  deleteHistory: function (e) {
    const index = e.currentTarget.dataset.index;
    var history = this.data.history;
    history.splice(index, 1);
    wx.setStorage({
      key: 'searchHistory',
      data: history,
    })
    this.setData({
      history: history
    })
  },

  clearHistory: function () {
    wx.setStorage({
      key: 'searchHistory',
      data: []
    });
    this.setData({
      history: []
    })
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