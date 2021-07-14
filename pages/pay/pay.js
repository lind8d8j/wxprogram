const db = wx.cloud.database();
const dingdan = db.collection('dingdan');
const recorderManager = wx.getRecorderManager();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: 'payform',
    date: '无',
    time: '无',
    accountList: ['请选择', '现金', '信用卡', '银行卡', '校园卡', '支付宝', '微信', '余额宝', '花呗', '京东白条', '其他'],
    accountIndex: '0',
    rangeList: ['无', '娱乐', '购物', '学习', '交通', '寝室', '食品', '通讯', '其他'],
    rangeIndex: '0',
    imageurl: 'cloud://cloudtest-07050820.636c-cloudtest-07050820/image/图片.png',
    audio: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var rmb = options.rmb;
    var time = options.time;
    var date = options.date;
    var accountIndex = options.accountIndex;
    var rangeIndex = options.rangeIndex;
    var audio = decodeURIComponent(options.audio);
    var tempFilePaths = options.tempFilePaths;
    var remarks = options.remarks;
    var updata = options.updata;
    if (updata) {
      this.setData({
        imageurl: tempFilePaths,
        tempFilePaths: tempFilePaths,
        date: date,
        time: time,
        rmb: rmb,
        accountIndex: accountIndex,
        rangeIndex: rangeIndex,
        audio: audio,
        remarks: remarks
      })
    }
    var play = options.play;
    var date1 = options.date1;
    var time1 = options.time1;
    var pay = options.pay;
    if (pay) {
      this.setData({
        rangeIndex: play,
        date: date1,
        time: time1
      })
    }
  },


  bindDateChange(e) { //日期绑定的点击事件
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value
    })
  },
  bindTimeChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      time: e.detail.value
    })
  },
  changeAccount(e) { //账户绑定的点击事件
    this.setData({
      accountIndex: e.detail.value
    });
    console.log('账户的下标值为：' + e.detail.value);
  },
  changeRange(e) { //分类绑定的点击事件
    this.setData({
      rangeIndex: e.detail.value
    });
    console.log('分类的下标值为：' + e.detail.value);
  },

  upload: function() {
    wx.showActionSheet({
      itemList: ['拍照', '使用图库中的照片'],
      success: res => {
        if (res.tapIndex == 0) {
          wx.chooseImage({
            count: 1,
            sizeType: ['compressed'],
            sourceType: ['camera'],
            success: res => {
              wx.showLoading({
                title: '图片上传中...',
              })
              // tempFilePath可以作为img标签的src属性显示图片
              const tempFilePaths = res.tempFilePaths
              let randString = Math.floor(Math.random() * 10000000).toString() + '.png'
              wx.cloud.uploadFile({
                cloudPath: randString, // 上传至云端的路径
                filePath: tempFilePaths[0], // 小程序临时文件路径
                success: res => {
                  // 返回文件 ID
                  // console.log(res)
                  this.setData({
                    tempFilePaths: res.fileID,
                    imageurl: res.fileID
                  })
                  wx.hideLoading();
                  wx.showModal({
                    title: '提示',
                    content: '图片上传成功,记得点击完成按钮哦',
                    showCancel: false
                  })
                },
                fail: err => {
                  console.log(err)
                  wx.showModal({
                    title: '提示',
                    content: '图片上传成功',
                    showCancel: false
                  })
                }
              })
            }
          })
          //点击的是哪一个选项
          // console.log(res.tapIndex)
        }
        if (res.tapIndex == 1) {
          console.log(res.tapIndex)
          wx.chooseImage({
            count: 1,
            sizeType: ['compressed'],
            sourceType: ['album'],
            success: res => {
              wx.showLoading({
                title: '图片上传中...',
              })
              // tempFilePath可以作为img标签的src属性显示图片
              const tempFilePaths = res.tempFilePaths
              let randString = Math.floor(Math.random() * 10000000).toString() + '.png'
              wx.cloud.uploadFile({
                cloudPath: randString, // 上传至云端的路径
                filePath: tempFilePaths[0], // 小程序临时文件路径
                success: res => {
                  // 返回文件 ID
                  // console.log(res)
                  this.setData({
                    tempFilePaths: res.fileID,
                    imageurl: res.fileID
                  })
                  wx.hideLoading();
                  wx.showModal({
                    title: '提示',
                    content: '图片上传成功,记得点击完成按钮哦',
                    showCancel: false
                  })
                },
                fail: err => {
                  console.log(err)
                  wx.showModal({
                    title: '提示',
                    content: '图片上传失败',
                    showCancel: false
                  })
                }
              })
            }
          })
        }
      }
    })
  },
  start: function() {

    const options = {
      duration: 10000, //指定录音的时长，单位 ms
      sampleRate: 16000, //采样率
      numberOfChannels: 1, //录音通道数
      encodeBitRate: 96000, //编码码率
      format: 'mp3', //音频格式，有效值 aac/mp3
      frameSize: 50, //指定帧大小，单位 KB
    }
    //开始录音
    recorderManager.start(options);
    recorderManager.onStart(() => {
      console.log('recorder start')
    });
    //错误回调
    recorderManager.onError((res) => {
      console.log(res);
    })
  },

  //录音完成
  stop: function() {
    recorderManager.stop();
    recorderManager.onStop((res) => {
      this.data.audio = res.tempFilePath;
      console.log('录音完成', this.data.audio)
    })
    wx.showModal({
      title: '提示',
      content: '录音已完成',
      showCancel: false
    })
  },


  //开始播放
  audioPlay() {
    this.audioCtx = wx.createAudioContext('myAudio'); //定义audio实例
    this.audioCtx.setSrc(this.data.audio) //引入播放源
    this.audioCtx.play() //播放
  },
  //播放停止
  audioPause() {
    this.audioCtx.pause()
  },

  formSubmit(e) {
    this.setData({
      submitValue: e.detail.value
    })
    var that = this;
    if (this.data.date == '无') {
      wx.showModal({
        title: '系统提示',
        content: '日期不能为空',
        showCancel: false
      })
    } else if (this.data.time == '无') {
      wx.showModal({
        title: '系统提示',
        content: '时间不能为空',
        showCancel: false
      })
    } else if (this.data.accountIndex == 0) {
      wx.showModal({
        title: '系统提示',
        content: '账户不能为空',
        showCancel: false
      })
    } else if (this.data.rangeIndex == 0) {
      wx.showModal({
        title: '系统提示',
        content: '类别不能为空',
        showCancel: false
      })
    } else if (this.data.submitValue.rmb == '') {
      wx.showModal({
        title: '系统提示',
        content: '金额不能为空',
        showCancel: false
      })
    } else {
      wx.showModal({
        title: '系统提示',
        content: '确定表单没有错误吗',
        success: res => {
          console.log(res);
          if (res.confirm) { //当用户点击确认时，addcollection为true
            var addcollection = true;
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
          console.log(addcollection);
          if (addcollection == true) { //当addcollection为true时，传送数据上云数据库
            wx.getNetworkType({
              success: function(res) {
                var networkType = res.networkType;
                console.log(networkType);
                if (networkType != 'none') {
                  try {
                    db.collection('zhangben').add({
                      // data 字段表示需新增的 JSON 数据
                      data: {
                        rmb: -that.data.submitValue.rmb,
                        remarks: that.data.submitValue.remarks,
                        date: that.data.date,
                        time: that.data.time,
                        account: that.data.accountList[that.data.accountIndex],
                        accountIndex: that.data.accountIndex, //账户下标
                        rangeIndex: that.data.rangeIndex, //类别下标
                        range: that.data.rangeList[that.data.rangeIndex],
                        name: that.data.name,
                        tempFilePaths: that.data.tempFilePaths, //图片url
                        audio: that.data.audio //录音url
                      }
                    }).then(res => {
                      console.log(res);
                      wx.redirectTo({
                        url: '../success/success',
                      })
                    })
                  } catch (e) {
                    console.error(e);
                  }
                } else {
                  wx.showToast({
                    title: '网络开小差了耶。',
                    icon: 'success',
                    duration: 2000
                  })
                }
              },
            })
          } else {
            console.error;
          }
        }
      })
    }
    console.log('form发生了submit事件，携带数据为：', e.detail.value)

  },
  formReset: function(e) {
    this.setData({
      date: '无',
      time: '无',
      accountIndex: 0,
      rangeIndex: 0,
      imageurl: 'cloud://cloudtest-07050820.636c-cloudtest-07050820/image/图片.png',
      audio: ''
    })
    console.log('form发生了reset事件')
  }
})