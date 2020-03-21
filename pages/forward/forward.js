import Toast from '../../vant/toast/toast';
import { verifyToken } from '../../utils/util'

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    color: '#000',
    background: '#f8f8f8',
    imageWidth: 0,
    wid: null,
    name: '',
    image: '',
    content: '',
    forwardContent: '',
    showPop1: false,
    searchValue1: '',
    showCancel: false,
    alternative1: [],
    showPop2: false,
    searchValue2: '',
    alternative2: [],
    newTopic: null,
    userIndex: [],
    indexList: [],
    checked: false,
    commentCid: null,
    commentName: null,
    commentUid: null,
    nodes: []
  },

  /**
   * 生命周期函数--监听页var面加载
   */
  onLoad: function (options) {
    this.calWidth();
    if (options.select_cid) {
      this.setData({
        selectCid: options.select_cid
      })
    }
    if (options.select_name) {
      this.setData({
        selectName: options.select_name,
        selectUid: options.select_uid
      })
    }
    this.setData({
      wid: options.wid,
      name: options.name,
      image: options.image,
      content: options.content,
      forwardContent: options.forward_content
    })
    const that = this;
    wx.request({
      url: app.globalData.host + '/user/userIndex',
      header: {
        'token': app.globalData.token
      },
      success(res) {
        verifyToken(res);
        if (res.statusCode == 200) {
          var list = []
          for (var i in res.data.data) {
            list.push(res.data.data[i].indexBar);
          }
          that.setData({
            indexList: list,
            userIndex: res.data.data
          })
        }
      }
    });
    if (this.data.forwardContent != null && this.data.forwardContent != '') {
      var value = e.detail.value;
      const patt = /@[\w\u4e00-\u9fa5]{1,16}|#[\w\u4e00-\u9fa5]+#/;
      var list = patt.exec(value);
      var nodes = [];
      while (list != null && list.length > 0) {
        const item = list[0] + "";
        const start = value.search(patt);
        if (start != 0) {
          nodes.push({
            name: 'span',
            children: [{
              type: 'text',
              text: value.substring(0, start)
            }]
          })
        }
        nodes.push({
          name: 'span',
          attrs: {
            class: 'blue_name'
          },
          children: [{
            type: 'text',
            text: item
          }]
        });
        value = value.substring(start + item.length, value.length);
        list = patt.exec(value);
      }
      if (value.length > 0) {
        nodes.push({
          name: 'span',
          children: [{
            type: 'text',
            text: value
          }]
        })
      }
      this.setData({
        nodes: nodes
      })
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

  calWidth: function () {
    const windowWidth = wx.getSystemInfoSync().windowWidth;
    const imageWidth = windowWidth * 0.17;
    this.setData({
      imageWidth: imageWidth
    })
  },

  textareaChange: function (e) {
    this.setData({
      forwardContent: e.detail.value
    })
  },

  addForward: function (e) {
    if (this.data.name == 'null') {
      Toast.fail("原微博已被删除，无法转发！");
      return;
    }
    var content = this.data.forwardContent;
    if (content === '') {
      content = '转发微博'
    }
    wx.request({
      url: app.globalData.host + '/forward',
      header: {
        'token': app.globalData.token
      },
      method: 'POST',
      data: {
        content: content,
        wid: this.data.wid
      },
      success(res) {
        verifyToken(res);
        if (res.statusCode == 200) {
          Toast.success('转发成功');
          setTimeout(function(){
            wx.navigateBack({});
          }, 2000);
          wx.navigateBack({});
        } else {
          Toast.fail(res.data.msg);
        }
      }
    });
    if (this.data.checked) {
      // 同时评论
      wx.request({
        url: app.globalData.host + '/comment',
        header: {
          'token': app.globalData.token
        },
        data: {
          wid: this.data.wid,
          content: content,
          commentCid: this.data.commentCid,
          commentName: this.data.commentName,
          commentUid: this.data.commentUid
        },
        method: 'POST'
      })
    }
  },

  openPop1: function () {
    this.setData({
      showPop1: true
    })
  },

  closePop1: function () {
    this.setData({
      showPop1: false
    })
  },

  startSearch: function () {
    this.setData({
      showCancel: true
    })
  },

  endSearch: function () {
    this.setData({
      showCancel: false,
      searchValue1: ''
    })
  },

  changeSearch1: function (e) {
    const that = this;
    this.setData({
      searchValue1: e.detail
    })
    if (e.detail != null && e.detail != '') {
      wx.request({
        url: app.globalData.host + '/user/searchByName',
        header: {
          'token': app.globalData.token
        },
        data: {
          name: e.detail
        },
        success(res) {
          verifyToken(res);
          if (res.statusCode == 200) {
            that.setData({
              alternative1: res.data.data
            })
          }
        }
      })
    }
  },

  select1: function (e) {
    const name = e.currentTarget.dataset.name;
    var nodes = this.data.nodes;
    nodes.push({
      name: 'span',
      attrs: {
        class: 'blue_name'
      },
      children: [{
        type: 'text',
        text: this.data.content + '@' + name + ' '
      }]
    })
    this.setData({
      showPop1: false,
      searchValue1: '',
      showCancel: false,
      content: this.data.content + '@' + name + ' ',
      nodes: nodes
    })
  },

  onPageScroll(event) {
    this.setData({
      scrollTop: event.scrollTop
    });
  },

  openPop2: function () {
    this.setData({
      showPop2: true
    })
  },

  closePop2: function () {
    this.setData({
      showPop2: false,
      searchValue2: '',
      alternative2: [],
      newTopic: null
    })
  },

  changeSearch2: function (e) {
    const searchValue = e.detail;
    const that = this;
    this.setData({
      searchValue2: searchValue
    })
    if (searchValue != null && searchValue != '') {
      wx.request({
        url: app.globalData.host + '/topic/searchByName',
        header: {
          'token': app.globalData.token
        },
        data: {
          name: searchValue
        },
        success(res) {
          verifyToken(res);
          if (res.statusCode == 200) {
            const topicList = res.data.data
            var newTopic = '#' + searchValue + '#';
            for (var i in topicList) {
              if (topicList[i].name === searchValue) {
                newTopic = null;
                break;
              }
            }
            that.setData({
              alternative2: topicList,
              newTopic: newTopic
            })
          }
        }
      })
    }
  },

  select2: function (e) {
    const name = e.currentTarget.dataset.name;
    var nodes = this.data.nodes;
    nodes.push({
      name: 'span',
      attrs: {
        class: 'blue_name'
      },
      children: [{
        type: 'text',
        text: this.data.content + name
      }]
    })
    this.setData({
      showPop2: false,
      searchValue2: '',
      content: this.data.content + name,
      nodes: nodes
    })
  },

  checkedChange: function (e) {
    this.setData({
      checked: e.detail
    })
  },

  onInput: function (e) {
    var value = e.detail.value;
    const patt = /@[\w\u4e00-\u9fa5]{1,16}|#[\w\u4e00-\u9fa5]+#/;
    var list = patt.exec(value);
    var nodes = [];
    while (list != null && list.length > 0) {
      const item = list[0] + "";
      const start = value.search(patt);
      if (start != 0) {
        nodes.push({
          name: 'span',
          children: [{
            type: 'text',
            text: value.substring(0, start)
          }]
        })
      }
      nodes.push({
        name: 'span',
        attrs: {
          class: 'blue_name'
        },
        children: [{
          type: 'text',
          text: item
        }]
      });
      value = value.substring(start + item.length, value.length);
      list = patt.exec(value);
    }
    if (value.length > 0) {
      nodes.push({
        name: 'span',
        children: [{
          type: 'text',
          text: value
        }]
      })
    }
    this.setData({
      nodes: nodes,
      forwardContent: e.detail.value
    })
  }
})