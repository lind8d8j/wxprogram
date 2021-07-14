var app = getApp();
const innerAudioContext = wx.createInnerAudioContext();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    zongjiner: 0,
    zongpay: 0,
    zongin: 0,
    topics: [],
    pageSize: 5,
    totalCount: 0,
    sum: 0,
    imgUrl: "../../images/down.png",
    uhide: 9999,
    notdataimage: '',
    comeinId: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options.id)
    this.setData({
      comeinId: options.id
    })
    this.getData();
    this.getRmb();
  },
  //点击切换隐藏和显示
  toggleBtn: function(event) {
    var that = this;
    var toggleBtnVal = that.data.uhide; //页面初始uhide的数据
    console.log(toggleBtnVal);
    var itemId = event.currentTarget.id; //view中id，可以表示是第几个view
    console.log(itemId);
    if (toggleBtnVal == itemId) {
      that.setData({
        uhide: 9999,
        imgUrl: "../../images/down.png"
      })
    } else {
      that.setData({
        uhide: itemId,
        imgUrl: "../../images/up.png"
      })
    }
  },

  /* 插入一个wxml的理解
     id={{_id}}
     第一，_id？为什么是_id呢？
     理由很简单： 因为wx:for-index="_id".
     第二，id有什么用呢？
     因为用了wx:for="{{某数组}}"，所以有多少个数组就有多少个view，如果相对某一个view下手，则需要获取这个view的id.  即要用id={{_id}}.
  */

  //预览图片
  previewImage: function(e) {
    var photo = [];
    photo = this.data.topics[e.target.id].tempFilePaths;
    console.log(photo);
    wx.previewImage({
      urls: [photo]
    })
  },

  //开始播放
  audioPlay(e) {
    // console.log(e)
    // console.log(e.target.id)
    var audio = this.data.topics[e.target.id].audio
    console.log(audio)
    innerAudioContext.src = audio; //引入播放源
    innerAudioContext.play(); //播放
    innerAudioContext.onError((res) => {
      console.log(res.errMsg) //如果出错，打印错误信息
      console.log(res.errCode)
    })
  },
  //播放暂停
  audioPause() {
    innerAudioContext.pause(); //暂停
    innerAudioContext.onError((res) => {
      console.log(res.errMsg) //如果出错，打印错误信息
      console.log(res.errCode)
    })
  },
  /* 获取金额 */
  getRmb: function() {
    var that = this;
    wx.showLoading({
      title: '加载中....',
    })
    wx.cloud.callFunction({
      name: 'getUserinfo',
      success: res => {
        // console.log('云函数获取到的openid: ', res.result)
        var openid = res.result.openId;
        const db = wx.cloud.database();
        db.collection('zhangben').where({
            _openid: openid
          })
          .count({ //获取该数据库有多少组数据
            success: res => {
              console.log(res.total);
              that.data.totalCount = res.total;
              this.setData({
                totalCount: that.data.totalCount
              })
            }
          })
        wx.cloud.callFunction({
          name: 'getMoreRmb',
          data: {
            openId: openid
          }
        }).then(res => {
          // console.log(res.result.data)
          // res.result.data 是包含以上定义的两条记录的数组
          console.log(that.data.totalCount); //多少组数据
          that.data.sum = 0;
          that.data.zongpay = 0;
          that.data.zongin = 0;
          // console.log(that.data.sum);
          if (that.data.totalCount >= 0) {
            for (var i = 0; i < that.data.totalCount; i++) { //注意范围啊，被坑死了！！！
              if (res.result.data[i].account == that.data.comeinId) {
                that.data.sum += res.result.data[i].rmb;
                if (res.result.data[i].name == 'payform') { //判断是支出，把支出的都加起来
                  that.data.zongpay += res.result.data[i].rmb;
                }
                if (res.result.data[i].name == 'inname') { //判断是收入，把收入加起来
                  that.data.zongin += res.result.data[i].rmb;
                }
              }
            }
            console.log(that.data.sum)
            // console.log((that.data.sum).toFixed(2));
            that.setData({ //设置总金额的值
              zongjiner: (that.data.sum).toFixed(2) //(对象).toFixed(保留的小数点后几位)
            })
            that.setData({ //设置支出的值
              zongpay: (that.data.zongpay).toFixed(2)
            })
            that.setData({ //设置收入的值
              zongin: (that.data.zongin).toFixed(2)
            })
            wx.hideLoading();
          } else {
            console.log(error);
            wx.hideLoading();
          }
        })
      },
      fail: res => {
        console.log(res.errMsg);
        wx.hideLoading();
      }
    })
  },
  /**
   * 获取列表数据
   * 
   */
  getData: function() {
    var that = this;
    // console.log("page--->" + page);
    wx.cloud.callFunction({
      name: 'getUserinfo',
      success: res => {
        // console.log('云函数获取到的openid: ', res.result)
        var openid = res.result.openId;
        const db = wx.cloud.database();
        // 获取总数
        db.collection('zhangben').where({
          _openid: openid
        }).count({
          success: res => {
            console.log(res.total);
            that.data.totalCount = res.total;
          }
        })
        // 获取前十条
        try {
          wx.cloud.callFunction({
            name: 'getMoreData',
            data: {
              openId: openid
            }
          }).then(res => {
            console.log(res.result.data)
            // res.data 是包含以上定义的两条记录的数组
            console.log(this.data.comeinId)
            var shuzu1 = [];
            for (var i = 0; i < that.data.totalCount; i++) {
              if (res.result.data[i].account == that.data.comeinId) {
                shuzu1.push(res.result.data[i])
              }
            }
            console.log(shuzu1);  //传进来comeinId的记录数组
            this.setData({
              topics: shuzu1
            })

            if (shuzu1 == '') {
              that.setData({
                notdataimage: 'cloud://cloudtest-07050820.636c-cloudtest-07050820/image/暂无数据.png',
                notdatatext: '暂无数据喔'
              })
            } else {
              that.setData({
                notdataimage: '',
                notdatatext: ''
              })
            }
            wx.hideNavigationBarLoading(); //隐藏加载
            wx.stopPullDownRefresh();
            wx.hideLoading();
          })
        } catch (e) {
          wx.hideNavigationBarLoading(); //隐藏加载
          wx.stopPullDownRefresh();
          wx.hideLoading();
          console.error(e);
        }
      },
      fail: res => {
        console.log(res.errMsg);
      }
    })
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  deletee: function(e) {
    var id = this.data.topics[e.target.id]._id //获取列表中的_id，e.target.id为下标值
    console.log(id);
    const db = wx.cloud.database();
    db.collection('zhangben').doc(id).remove({
      success: res => {
        wx.showModal({
          title: '提示',
          content: '记录删除成功！',
          showCancel: false,
          success: res => {
            if (res.confirm) {
              this.onLoad();
            }
          }
        })
        console.log(res)
      },
      fail: res => {
        wx.showModal({
          title: '提示',
          content: '记录删除失败！',
          showCancel: false
        })
      }
    })
  },
  updata: function (e) {
    var id = this.data.topics[e.target.id]._id //获取列表中的_id，e.target.id为下标值
    var date = this.data.topics[e.target.id].date;
    var rmb = this.data.topics[e.target.id].rmb;
    var time = this.data.topics[e.target.id].time;
    var tempFilePaths1 = this.data.topics[e.target.id].tempFilePaths;
    if (tempFilePaths1 == undefined) {
      var tempFilePaths = '';
    } else {
      tempFilePaths = tempFilePaths1;
    }
    var accountIndex = this.data.topics[e.target.id].accountIndex;
    var rangeIndex = this.data.topics[e.target.id].rangeIndex;
    var audio = encodeURIComponent(this.data.topics[e.target.id].audio);
    var remarks = this.data.topics[e.target.id].remarks;
    var updata = true;
    if (this.data.topics[e.target.id].name == "payform") {
      wx.redirectTo({
        url: '../pay/pay?date=' + date + "&time=" + time + "&rmb=" + (-rmb) + "&accountIndex=" + accountIndex + "&rangeIndex=" + rangeIndex + "&tempFilePaths=" + tempFilePaths + "&audio=" + audio + "&remarks=" + remarks + "&updata=" + updata,
      })
      const db = wx.cloud.database();
      db.collection('zhangben').doc(id).remove({
        success: res => {
          console.log(res)
        }
      })
    } else {
      wx.redirectTo({
        url: '../in/in?date=' + date + "&time=" + time + "&rmb=" + rmb + "&accountIndex=" + accountIndex + "&rangeIndex=" + rangeIndex + "&tempFilePaths=" + tempFilePaths + "&audio=" + audio + "&remarks=" + remarks + "&updata=" + updata,
      })

      const db = wx.cloud.database();
      db.collection('zhangben').doc(id).remove({
        success: res => {
          console.log(res)
        }
      })
    }
  }
})