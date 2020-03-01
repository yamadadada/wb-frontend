import { verifyToken } from '../../utils/util'

const app = getApp()

Page({
  
  /**
   * 页面的初始数据
   */
  data: {
    color: '#000',
    background: '#ffffff',
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
    sheetVisible: false,
    weibo: null,
    isLike: false,
    forwardList: [],
    commentVOList: [],
    sort: "like_count",
    sortName: "按热度",
    likeList: [],
    forwardCount: 0,
    commentCount: 0,
    likeCount: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.calWidth();
    const wid = options.wid;
    this.setData({
      forwardCount: options.forwardCount,
      likeCount: options.likeCount,
      isLike: options.isLike
    })
    const that = this;
    wx.request({
      url: app.globalData.host + '/weibo/' + wid,
      header: {
        'token': app.globalData.token
      },
      success(res) {
        verifyToken(res);
        if (res.statusCode == 200) {
          that.setData({
            weibo: res.data.data,
            commentVOList: res.data.data.commentVOList,
            commentCount: res.data.data.commentCount
          })
        }
      }
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
    const boardWidth = windowWidth * 0.0125;
    const imageWidth = windowWidth * 0.3;
    this.setData({
      imageWidth: imageWidth,
      boardWidth: boardWidth
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

  showGallery: function (e) {
    wx.previewImage({
      current: e.currentTarget.dataset.current,
      urls: e.currentTarget.dataset.urls,
    })
  },

  changeTab: function (event) {
    const that = this;
    const type = event.detail.name;
    if (type == '0') {
      wx.request({
        url: app.globalData.host + '/weibo/forward/' + this.data.weibo.wid,
        header: {
          'token': app.globalData.token
        },
        success(res) {
          verifyToken(res);
          if (res.statusCode == 200) {
            that.setData({
              forwardList: res.data.data.forwardList,
              forwardCount: res.data.data.forwardCount
            })
          }
        }
      })
    } else if (type == '1') {
    } else {
      wx.request({
        url: app.globalData.host + '/weibo/like/' + this.data.weibo.wid,
        header: {
          'token': app.globalData.token
        },
        success(res) {
          verifyToken(res);
          if (res.statusCode == 200) {
            that.setData({
              likeList: res.data.data.weiboLikeVOList,
              likeCount: res.data.data.likeCount
            })
          }
        }
      })
    }
  },
  
  toCommentDetail: function (e) {
    wx.navigateTo({
      url: '/pages/comment/comment?cid=' + e.currentTarget.dataset.cid
    })
  },

  getCommentVOList: function () {
    const that = this;
    wx.request({
      url: app.globalData.host + '/weibo/comment/' + this.data.weibo.wid + "?sort=" + this.data.sort,
      header: {
        'token': app.globalData.token
      },
      success(res) {
        verifyToken(res);
        if (res.statusCode == 200) {
          that.setData({
            commentVOList: that.data.commentVOList.concat(res.data.data.commentVOList),
            commentCount: res.data.data.commentCount
          })
        }
      }
    })
  },

  changeSort: function () {
    if (this.data.sort == 'like_count') {
      this.setData({
        sort: 'create_time',
        sortName: '按时间',
        commentVOList: []
      })
    } else {
      this.setData({
        sort: 'like_count',
        sortName: '按热度',
        commentVOList: []
      })
    }
    this.getCommentVOList();
  },

  likeChange: function () {
    const wid = this.data.weibo.wid;
    const islike = this.data.isLike;
    if (islike) {
      this.setData({
        isLike: false,
        likeCount: parseInt(this.data.likeCount) - 1
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
        isLike: true,
        likeCount: parseInt(this.data.likeCount) + 1
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

  commentLikeChange: function (e) {
    const cid = e.currentTarget.dataset.cid;
    const islike = e.currentTarget.dataset.is_like;
    const index = e.currentTarget.dataset.index;
    const islikeIndex = "commentVOList[" + index + "].isLike";
    const likeCountIndex = "commentVOList[" + index + "].likeCount";
    if (islike) {
      this.setData({
        [islikeIndex]: false,
        [likeCountIndex]: this.data.commentVOList[index].likeCount - 1
      })
      wx.request({
        url: app.globalData.host + '/commentLike/' + cid,
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
        [likeCountIndex]: this.data.commentVOList[index].likeCount + 1
      })
      wx.request({
        url: app.globalData.host + '/commentLike/' + cid,
        header: {
          'token': app.globalData.token
        },
        method: 'put',
        success(res) {
          verifyToken(res);
        }
      })
    }
  }
})