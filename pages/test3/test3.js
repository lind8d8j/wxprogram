import * as echarts from '../../ec-canvas/echarts.js'

function setOption(chart, name, num) {
  const option = {
    title: {
      text: '支出',
      x: 'center'
    },
    tooltip: {
      trigger: 'item',
      position: ['50%', '50%'], //提示框的位置
      formatter: "{b} : {c} ({d}%)" //回调函数，回调提示框中的信息
    },
    legend: { //说明
      orient: 'vertical', //图例列表的布局朝向。
      left: 'left', //图例位置
      textStyle: {
        fontSize: 13
      },
      data: ['娱乐', '购物', '学习', '交通', '寝室', '食品', '通讯','其他']
    },
    series: [{
      type: 'pie',
      radius: '55%',
      center: ['50%', '50%'],
      data: [{
          name: name[0],
          value: num[0]
        },
        {
          name: '购物',
          value: num[1]
        },
        {
          name: '学习',
          value: num[2]
        },
        {
          name: '交通',
          value: num[3]
        },
        {
          name: '寝室',
          value: num[4]
        },
        {
          name: '食品',
          value: num[5]
        },
        {
          name: '通讯',
          value: num[6]
        },
        {
          name: '其他',
          value: num[7]
        }
      ],
      symbol: 'none',
      lineStyle: {
        width: 1
      },
      label: {
        fontSize: 14
      }
    }]
  };
  chart.setOption(option)
}
Page({
  data: {
    ecOne: {
      lazyLoad: true
    },
    timer: '' //因为我要实时刷新，所以设置了个定时器
  },
  onLoad: function(options) {
    var _this = this;
    wx.showLoading({
      title: '加载中...',
    })
    this.getOneOption();
    this.setData({ //每隔一分钟刷新一次
      timer: setInterval(function() {
        _this.getOneOption();
      }, 60000)
    })
  },
  onReady: function() { //这一步是一定要注意的
    this.oneComponent = this.selectComponent('#mychart-one');
  },
  onUnload: function() {
    clearInterval(this.data.timer)
  },
  init_one: function(name, num) { //初始化第一个图表
    this.oneComponent.init((canvas, width, height) => {
      const chart = echarts.init(canvas, null, {
        width: width,
        height: height
      });
      setOption(chart, name, num)
      this.chart = chart;
      return chart;
    });
  },


  getOneOption: function(event) {
    wx.cloud.callFunction({
      name: 'getUserinfo',
      success: res => {
        // console.log('云函数获取到的openid: ', res.result)
        var openid = res.result.openId;
        const db = wx.cloud.database();
        const dingdan = db.collection('zhangben');
        db.collection('zhangben').where({
          _openid: openid
        }).get({
          success: res => {
            // res.data 是包含以上定义的两条记录的数组
            console.log(res.data)
            var length = res.data.length;
            var name = [];
            var num = [];
            var sum = 0,
              sum1 = 0,
              sum2 = 0,
              sum3 = 0,
              sum4 = 0,
              sum5 = 0,
              sum6 = 0,
              sum7 = 0
            for (var i = 0; i < length; i++) {
              if (res.data[i].range == '娱乐') {
                sum += res.data[i].rmb
              }
              if (res.data[i].range == '购物') {
                sum1 += res.data[i].rmb
              }
              if (res.data[i].range == '学习') {
                sum2 += res.data[i].rmb
              }
              if (res.data[i].range == '交通') {
                sum3 += res.data[i].rmb
              }
              if (res.data[i].range == '寝室') {
                sum4 += res.data[i].rmb
              }
              if (res.data[i].range == '食品') {
                sum5 += res.data[i].rmb
              }
              if (res.data[i].range == '通讯') {
                sum6 += res.data[i].rmb
              }
              if(res.data[i].range == '其他'){
                sum7 += res.data[i].rmb
              }
            }
            console.log(sum, sum1, sum2, sum3, sum4, sum5, sum6,sum7)
            num.push(sum, sum1, sum2, sum3, sum4, sum5, sum6,sum7)
            name.push('娱乐', '购物', '学习', '交通', '寝室', '食品', '通讯','其他')
            console.log(num)
            console.log(name)
            this.init_one(name, num)
            wx.hideLoading();
          },
          fail: res => {
            wx.showToast({
              title: '网络出问题了哦',
            })
          }
        })
      }
    })
  }

})