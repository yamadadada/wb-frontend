import { verifyToken } from '../../utils/util'
import Toast from '../../vant/toast/toast';
import Dialog from '../../vant/dialog/dialog';

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
    uid: null,
    wid: null,
    actions1: [],
    sheetVisible1: false,
    weibo: null,
    isLike: false,
    forwardList: [],
    commentVOList: [],
    sort: "like_count",
    sortName: "按热度",
    likeList: [],
    forwardCount: 0,
    commentCount: 0,
    likeCount: 0,
    popupShow: false,
    checked: false,
    placeholder: '写评论',
    commentValue: '',
    actions2: [],
    sheetVisible2: false,
    description: '',
    selectCid: '',
    selectName: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      uid: app.globalData.uid,
      wid: options.wid
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.calWidth();
    const that = this;
    wx.request({
      url: app.globalData.host + '/weibo/' + this.data.wid,
      header: {
        'token': app.globalData.token
      },
      success(res) {
        verifyToken(res);
        if (res.statusCode == 200) {
          that.setData({
            weibo: res.data.data,
            commentVOList: res.data.data.commentVOList,
            forwardCount: res.data.data.forwardCount,
            commentCount: res.data.data.commentCount,
            likeCount: res.data.data.likeCount,
            isLike: res.data.data.isLike
          })
        }
      }
    })
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

  showSheet1: function (e) {
    var actions = [];
    if (this.data.weibo.isFavorite) {
      actions.push({name: '取消收藏'});
    } else {
      actions.push({name: '收藏'});
    }
    if (e.currentTarget.dataset.uid == app.globalData.uid) {
      actions.push({ name: '删除' });
    } else {
      actions.push({name: '投诉'})
    }
    this.setData({
      actions1: actions,
      sheetVisible1: true
    })
  },

  sheetClose1: function (e) {
    this.setData({
      sheetVisible1: false
    })
  },

  sheetSelect1: function (event) {
    if (event.detail.name === '删除') {
      const wid = this.data.weibo.wid;
      const that = this;
      Dialog.confirm({
        title: '提示',
        message: '确认删除该条微博?'
      }).then(() => {
        wx.request({
          url: app.globalData.host + '/weibo/' + wid,
          header: {
            'token': app.globalData.token
          },
          method: 'DELETE',
          success(res) {
            verifyToken(res);
            if (res.statusCode == 200) {
              Toast.success('删除成功');
              wx.navigateBack({})
            } else {
              Toast.fail(res.data.msg);
            }
          }
        })
      })
    } else if (event.detail.name === '收藏') {
      const that = this;
      const favoriteIndex = 'weibo.isFavorite';
      wx.request({
        url: app.globalData.host + '/favorite/' + this.data.weibo.wid,
        header: {
          'token': app.globalData.token
        },
        method: 'POST',
        success(res) {
          verifyToken(res);
          if (res.statusCode === 200) {
            Toast.success('收藏成功');
            that.setData({
              [favoriteIndex]: true
            });
          } else {
            Toast.fail('收藏失败，请稍后再试');
          }
        }
      })
    } else if (event.detail.name === '取消收藏') {
      const that = this;
      const favoriteIndex = 'weibo.isFavorite';
      wx.request({
        url: app.globalData.host + '/favorite/' + wid,
        header: {
          'token': app.globalData.token
        },
        method: 'DELETE',
        success(res) {
          verifyToken(res);
          if (res.statusCode === 200) {
            Toast.success('取消收藏成功');
            that.setData({
              [favoriteIndex]: false
            });
          } else {
            Toast.fail('取消收藏失败，请稍后再试');
          }
        }
      })
    }
  },

  sheetClose2: function (e) {
    this.setData({
      sheetVisible2: false
    })
  },

  sheetSelect2: function (event) {
    if (event.detail.name === '回复') {
      this.setData({
        popupShow: true,
        commentValue: '',
        placeholder: '回复 @' + this.selectName
      })
    } else if (event.detail.name === '删除') {
      const cid = this.data.selectCid;
      const that = this;
      Dialog.confirm({
        title: '提示',
        message: '确认删除该条评论?'
      }).then(() => {
        wx.request({
          url: app.globalData.host + '/comment/' + cid,
          header: {
            'token': app.globalData.token
          },
          method: 'DELETE',
          success(res) {
            verifyToken(res);
            if (res.statusCode == 200) {
              Toast.success('删除成功');
              that.setData({
                commentVOList: []
              })
              that.getCommentVOList();
            } else {
              Toast.fail(res.data.msg);
            }
          }
        })
      })
    } else if (event.detail.name === '转发') {
      var image = '';
      if (this.data.weibo.imageList.length > 0) {
        image = this.data.weibo.imageList[0];
      } else {
        image = this.data.weibo.avatar;
      }
      const forwardContent = '//@' + this.data.description
      wx.navigateTo({
        url: '/pages/forward/forward?wid=' + this.data.weibo.wid + "&name=" + this.data.weibo.name + "&image=" + image + "&content=" + this.data.weibo.content + "&forward_content=" + forwardContent
      })
    }
  },

  showSheet2: function (e) {
    const cid = e.currentTarget.dataset.cid;
    const haveDelete = e.currentTarget.dataset.have_delete;
    const name = e.currentTarget.dataset.name;
    const content = e.currentTarget.dataset.content;
    if (haveDelete) {
      this.setData({
        actions2: [
          {name: '回复'},
          {name: '转发'},
          {name: '投诉'},
          {name: '删除'}
        ]
      })
    } else {
      this.setData({
        actions2: [
          { name: '回复' },
          { name: '转发' },
          { name: '投诉' }
        ]
      })
    }
    this.setData({
      sheetVisible2: true,
      description: name + ': ' + content,
      selectCid: cid,
      selectName: name
    })
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
    var image = '';
    if (this.data.weibo.imageList.length > 0) {
      image = this.data.weibo.imageList[0];
    } else {
      image = this.data.weibo.avatar;
    }
    wx.navigateTo({
      url: '/pages/comment/comment?cid=' + e.currentTarget.dataset.cid + '&name=' + this.data.weibo.name + '&image=' + image + '&content=' + this.data.weibo.content
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
  },

  popupOpen: function (e) {
    this.setData({
      popupShow: true,
      commentValue: '',
      placeholder: '写评论',
      selectCid: '',
      selectName: ''
    })
  },

  popupClose: function () {
    this.setData({
      popupShow: false
    })
  },

  checkedChange: function () {
    this.setData({
      checked: !this.data.checked
    })
  },

  addComment: function () {
    var comment = this.data.commentValue;
    if (comment.length == 0) {
      Toast.fail('评论内容不能为空');
      return;
    }
    this.popupClose();
    Toast.loading({
      mask: true,
      message: '提交中...'
    });
    const that = this;
    wx.request({
      url: app.globalData.host + '/comment',
      header: {
        'token': app.globalData.token
      },
      data: {
        wid: this.data.weibo.wid,
        content: comment,
        commentCid: this.data.selectCid
      },
      method: 'POST',
      success(res) {
        verifyToken(res);
        if (res.statusCode == 200) {
          Toast.success('发送成功');
          that.setData({
            sort: 'create_time',
            sortName: '按时间',
            commentVOList: []
          })
          that.getCommentVOList();
        } else {
          Toast.fail(res.data.msg);
        }
      }
    })
    if (this.data.checked) {
      // 转发
      var content = ''
      if (this.selectName != null && this.selectName != '') {
        content = comment + '//@' + this.data.description;
      } else {
        content = comment;
      }
      wx.request({
        url: app.globalData.host + '/forward',
        header: {
          'token': app.globalData.token
        },
        method: 'POST',
        data: {
          content: content,
          wid: this.data.weibo.wid
        },
        success(res) {
          verifyToken(res);
        }
      })
    }
  },

  fieldChange: function (e) {
    this.setData({
      commentValue: e.detail
    })
  },

  toAddForward: function () {
    var image = '';
    if (this.data.weibo.status == 0) {
      if (this.data.weibo.imageList.length > 0) {
        image = this.data.weibo.imageList[0];
      } else {
        image = this.data.weibo.avatar;
      }
      const forwardContent = ''
      wx.navigateTo({
        url: '/pages/forward/forward?wid=' + this.data.weibo.wid + "&name=" + this.data.weibo.name + "&image=" + image + "&content=" + this.data.weibo.content + "&forward_content=" + forwardContent
      })
    } else {
      if (this.data.weibo.forwardImageList != null && this.data.weibo.forwardImageList.length > 0) {
        image = this.data.weibo.forwardImageList[0];
      } else {
        image = this.data.weibo.forwardAvatar;
      }
      const forwardContent = '//@' + this.data.weibo.name + ":" + this.data.weibo.content;
      wx.navigateTo({
        url: '/pages/forward/forward?wid=' + this.data.weibo.wid + "&name=" + this.data.weibo.forwardUsername + "&image=" + image + "&content=" + this.data.weibo.forwardContent + "&forward_content=" + forwardContent
      })
    }
  },

  toWeiboDetail: function (e) {
    wx.navigateTo({
      url: '/pages/wb-detail/wb-detail?wid=' + e.currentTarget.dataset.wid
    })
  },

  toUser: function (e) {
    const uid = e.currentTarget.dataset.uid;
    wx.navigateTo({
      url: '/pages/user/user?uid=' + uid
    })
  }
})