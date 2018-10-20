import F2 from '../../f2-canvas/lib/f2';
var app = getApp();
var http = require('../../utils/request.js')

let chart = null;

function getTime() {
  var Time = [];
  // var allMonth = ["一月", "二月", "三月", "四月","五月","六月","七月","八月","九月","十月","十一月","十二月"];
  var month = new Date().getMonth() + 2;
  var year = new Date().getFullYear() - 1;
  for (var i = 0; i < 12; i++) {
    if (month > 12) {
      year++;
      month = 1;
    }
    Time.push((''+year).substr(2,2) + "-" + month);
    month++;
  }
  return Time;

}

function page(fn){
  
}

function initChart(canvas, width, height) {

  http.header.Authorization = 'Bearer ' + app.globalData.token
  http.getReq('chart?QueryType=0&times=1', res => {
    console.log(res)
    if (res.status == 200) {
      if (res.data.total == 0) {
        wx.showToast({
          title: '暂无数据',
        })
      } else {
        let arr = []
        
        let Time = getTime()
        res.data.series.map((el, index) => {
          el.Data.map((month, index1) => {
            let obj = {}
            obj.type = el.CompanyName
            obj.value = month
            obj.year = Time[index1]
            arr.push(obj)
          })
        })
        // var data = arr
        //console.log(arr)
        //设置左侧节点最大数据，默认9
        var maxData=9
        for(var i=0;i<arr.length;i++){
          var idata = arr[i].value
            if (idata > maxData)
              maxData = idata
        }

        chart = new F2.Chart({
          el: canvas,
          width,
          height
        });
        // console.log(arr)

        chart.source(arr, {
          year: {
            range: [0, 1],
            ticks: getTime()
          },
          value: {
            max: maxData,
            tickCount:10,
            formatter(val) {
              return val.toFixed(0)
            }
          }
        });
        chart.line().position('year*value').color('type');
        chart.render();
        return chart;
      }
    } else {
      wx.showToast({
        title: res.error,
        icon: 'none'
      })
    }
  })



  // chart.tooltip({
  //   custom: true, // 自定义 tooltip 内容框
  //   onChange(obj) {
  //     const legend = chart.get('legendController').legends.top[0];
  //     const tooltipItems = obj.items;
  //     const legendItems = legend.items;
  //     const map = {};
  //     legendItems.map(item => {
  //       map[item.name] = Object.assign({}, item);
  //     });
  //     tooltipItems.map(item => {
  //       const {
  //         name,
  //         value
  //       } = item;
  //       if (map[name]) {
  //         map[name].value = value;
  //       }
  //     });
  //     legend.setItems(Object.values(map));
  //   },
  //   onHide() {
  //     const legend = chart.get('legendController').legends.top[0];
  //     legend.setItems(chart.getLegendItems().country);
  //   }
  // });

  // chart.guide().rect({
  //   start: [2011, 'max'],
  //   end: ['max', 'min'],
  //   style: {
  //     fill: '#CCD6EC',
  //     opacity: 0.3
  //   }
  // });
  // chart.guide().text({
  //   position: [2014, 'max'],
  //   content: 'Scott administratio\n(2011 to present)',
  //   style: {
  //     fontSize: 10,
  //     textBaseline: 'top'
  //   }
  // });

}


Page({
  data: {
    opts: {
      onInit: null
    },
    xAxis: null
  },
  page() {
    http.header.Authorization = 'Bearer ' + app.globalData.token
    http.getReq('chart?QueryType=0&times=1', res => {
      if (res.status == 200) {
        if (res.data.total == 0) {
          wx.showToast({
            title: '暂无数据',
          })
        } else {
          let arr = []
          res.data.series.map((el, index) => {
            el.Data.map((month, index1) => {
              let obj = {}
              obj.type = el.CompanyName
              obj.value = month
              obj.year = this.data.xAxis[index1]
              arr.push(obj)
            })
          })
          this.setData({
            arr
          })
        }
      } else {
        wx.showToast({
          title: res.error,
          icon: 'none'
        })
      }
    })
    // var opts = {
    //   onInit: initChart
    // }
    // this.setData({
    //   opts
    // })
  },
  // getTime() {
  //   var Time = [];
  //   // var allMonth = ["一月", "二月", "三月", "四月","五月","六月","七月","八月","九月","十月","十一月","十二月"];
  //   var month = new Date().getMonth() + 2;
  //   var year = new Date().getFullYear() - 1;
  //   for (var i = 0; i < 12; i++) {
  //     if (month > 12) {
  //       year++;
  //       month = 1;
  //     }
  //     Time.push(year + "-" + month);
  //     month++;
  //   }
  //   return Time;

  // },

  onLoad() {

    var opts = {
      onInit: initChart
    }
    // let time = this.getTime()
    // this.page()
    this.setData({
      //  xAxis: time,
       opts
    })
  }
});