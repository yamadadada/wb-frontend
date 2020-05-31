import { verifyToken } from '../../utils/util'
import Toast from '../../vant/toast/toast';
import Dialog from '../../vant/dialog/dialog';

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    color: '#3A3A3A',
    background: '#FDFDFD',
    loading: false,
    showSearch: false,
    showPop: false,
    hotWeiboList: [],
    realTimeList: [],
    schoolList: [],
    cityList: [],
    searchValue: '',
    history: [],
    candidateList: [],
    hotList: [],
    preHotList: [],
    type: '0',
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
    isAll4: false,
    totalCount: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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
    this.setData({
      loading: true
    })
    wx.request({
      url: app.globalData.host + '/search/hotSearch',
      header: {
        'token': app.globalData.token
      },
      success(res) {
        verifyToken(res);
        if (res.statusCode == 200) {
          const hotList = res.data.data;
          that.setData({
            hotList: res.data.data
          })
          var preHotList = that.getArrRandomly(hotList).splice(0, 7);
          that.setData({
            preHotList: preHotList
          })
        } else {
          Toast.fail(red.data.msg);
        }
      }
    });
    if (app.globalData.school != null) {
      wx.request({
        url: app.globalData.host + '/weibo/school',
        header: {
          'token': app.globalData.token
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
                schoolList: list,
                page3: 1,
                isAll3: false
              })
              if (list.length < that.data.size3) {
                that.setData({
                  isAll3: true
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
    } else {
      this.setData({
        loading: false
      })
      Dialog.confirm({
        title: '提示',
        message: '你还没有填写学校信息，请前往个人中心补充完整'
      }).then(() => {
        wx.navigateTo({
          url: '/pages/edit-user/edit-user',
        })
      })
    }
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
    this.setData({
      loading: true
    })
    const type = this.data.type;
    const that = this;
    if (type == '0') {
      if (this.data.isAll1) {
        this.setData({
          loading: false
        })
        return;
      }
      wx.request({
        url: app.globalData.host + '/weibo/hot',
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
                hotWeiboList: that.data.hotWeiboList.concat(list),
                page1: that.data.page1 + 1
              })
              if (list.length < that.data.size1) {
                that.setData({
                  isAll1: true
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
    } else if (type == '1') {
      if (this.data.isAll2) {
        this.setData({
          loading: false
        })
        return;
      }
      wx.request({
        url: app.globalData.host + '/weibo/realTime',
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
                realTimeList: that.data.realTimeList.concat(list),
                page2: that.data.page2 + 1
              })
              if (list.length < that.data.size2) {
                that.setData({
                  isAll2: true
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
    } else if (type == '2') {
      if (this.data.isAll3) {
        this.setData({
          loading: false
        })
        return;
      }
      wx.request({
        url: app.globalData.host + '/weibo/school',
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
                schoolList: that.data.schoolList.concat(list),
                page3: that.data.page3 + 1
              })
              if (list.length < that.data.size3) {
                that.setData({
                  isAll3: true
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
    } else {
      if (this.data.isAll4) {
        this.setData({
          loading: false
        })
        return;
      }
      wx.request({
        url: app.globalData.host + '/weibo/city',
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
                cityList: that.data.cityList.concat(list),
                page4: that.data.page4 + 1
              })
              if (list.length < that.data.size4) {
                that.setData({
                  isAll4: true
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
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  tabChange: function (e) {
    if (e.detail == 0) {
      wx.switchTab({
        url: '/pages/index/index'
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
    this.search(content);
  },

  onSearch3: function (e) {
    this.closePop();
    const content = e.currentTarget.dataset.content;
    if (content != '') {
      this.search(content);
    }
  },

  search: function (content) {
    var list = wx.getStorageSync('searchHistory');
    if (list == null || list == '') {
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
      history: list,
      searchValue: '',
      showSearch: false
    })
    wx.navigateTo({
      url: '/pages/search/search?content=' + content
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

  openPop: function () {
    this.setData({
      showPop: true
    })
  },

  closePop: function () {
    this.setData({
      showPop: false
    })
  },

  changeTab: function (event) {
    const type = event.detail.name;
    this.setData({
      type: type,
      loading: true
    })
    const that = this;
    if (type == '0') {
      if (this.data.hotWeiboList.length === 0) {
        wx.request({
          url: app.globalData.host + '/weibo/hot',
          header: {
            'token': app.globalData.token
          },
          success(res) {
            verifyToken(res);
            if (res.statusCode == 200) {
              that.setData({
                hotWeiboList: res.data.data,
                page1: 1,
                isAll1: false
              })
            } else {
              Toast.fail(red.data.msg);
            }
          },
          complete() {
            that.setData({
              loading: false
            })
          }
        });
      } else {
        this.setData({
          loading: false
        })
      }
    } else if (type == '1') {
      if (this.data.realTimeList.length === 0) {
        wx.request({
          url: app.globalData.host + '/weibo/realTime',
          header: {
            'token': app.globalData.token
          },
          success(res) {
            verifyToken(res);
            if (res.statusCode == 200) {
              that.setData({
                realTimeList: res.data.data,
                page2: 1,
                isAll2: false
              })
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
      } else {
        this.setData({
          loading: false
        })
      }
    } else if (type == '2') {
      if (this.data.schoolList.length === 0) {
        if (app.globalData.school == null) {
          this.setData({
            loading: false
          })
          Dialog.confirm({
            title: '提示',
            message: '你还没有填写学校信息，请前往个人中心补充完整'
          }).then(() => {
            wx.navigateTo({
              url: '/pages/edit-user/edit-user',
            })
          })
          return;
        }
        wx.request({
          url: app.globalData.host + '/weibo/school',
          header: {
            'token': app.globalData.token
          },
          success(res) {
            verifyToken(res);
            if (res.statusCode == 200) {
              that.setData({
                schoolList: res.data.data,
                page3: 1,
                isAll3: false
              })
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
      } else {
        this.setData({
          loading: false
        })
      }
    } else {
      if (this.data.cityList.length === 0) {
        if (app.globalData.city == null) {
          this.setData({
            loading: false
          })
          Dialog.confirm({
            title: '提示',
            message: '你还没有填写学校信息，请前往个人中心补充完整'
          }).then(() => {
            wx.navigateTo({
              url: '/pages/edit-user/edit-user',
            })
          })
          return;
        }
        wx.request({
          url: app.globalData.host + '/weibo/city',
          header: {
            'token': app.globalData.token
          },
          success(res) {
            verifyToken(res);
            if (res.statusCode == 200) {
              that.setData({
                cityList: res.data.data,
                page4: 1,
                isAll4: false
              })
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
      } else {
        this.setData({
          loading: false
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

/**
 * 打乱数组
 */
  getArrRandomly: function (arr) {
    var len = arr.length;
    for (var i = len - 1; i >= 0; i--) {
      var randomIndex = Math.floor(Math.random() * (i + 1));
      var itemIndex = arr[randomIndex];
      arr[randomIndex] = arr[i];
      arr[i] = itemIndex;
    }
    return arr;
  },

  toTop: function () {
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 300
    })
  }
})