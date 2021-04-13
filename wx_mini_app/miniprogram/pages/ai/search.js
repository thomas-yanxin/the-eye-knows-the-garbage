const  searchGarbage = require('../../utils/garbage-search.js');
const db = wx.cloud.database();
//调用插件
const plugin = requirePlugin('WechatSI');
//获取全局唯一的语音识别管理器recordRecoManager
const manager = plugin.getRecordRecognitionManager();
var innerAudioContext = wx.createInnerAudioContext();
innerAudioContext.onError((res) => {
  // 播放音频失败的回调
})
var util = require('../../utils/util.js')



Page(
    {
    data: {
      datas:[],
      searchText:"",
        noResult:"没有查到结果，换个词试试奥~",
      logo:"",
      src:"",
      
  },

 
  onLoad: function (options) {
      if(options.searchText){
          this.setData({
              searchText:options.searchText
          });
        this.onGetData(options.searchText);
      }
  },
  searchIcon:function(e){
      console.log('search:'+e);
      if(!e.detail.value){
        return ;
      }
      this.setData({
          searchText:e.detail.value
      });
    console.log("====="+e.detail.value)
    this.onGetData(this.data.searchText)
  },
  onGetData:function(text){
    console.log("搜索text:"+text);
      db.collection('search_record').add({
          data:{
                keyword:text,
                date:util.formatTime(new Date())
          },
          success:function(res){
             console.log('保存搜索记录：'+res);
          },
          fail:function(error){
              console.error('保存搜索记录错误：'+error);

          }
      });
    var that=this
    var searchResult = new Array();

    searchGarbage.search(text, function success(res){
      console.log('searchResult:'+res);
      searchResult = res;
      that.setData({
        datas:searchResult
      })
     });

      console.log('datas:'+JSON.stringify(this.data.datas));
      console.log('that.searchText:'+that.data.searchText);
      console.log(!that.data.datas);
      console.log(that.data.searchText.length>0);
      console.log(that.data.datas);
  },
  
  text_audio:function(content){
    console.log(content);
    var that = this ;
    var dataset = content.currentTarget.dataset;
    var garbagename = dataset.garname;
    var categroname = dataset.catename;
    console.log(dataset);
     plugin.textToSpeech({
        lang: "zh_CN",//代表中文
        tts: true, //是否对翻译结果进行语音合成，默认为false，不进行语音合成
        content: garbagename+'是'+categroname,//要转为语音的文字
        success: function (res) {
          console.log("succ tts", res.filename);
          innerAudioContext.src = res.filename;
          innerAudioContext.play()
          // that.setData({
          //   src: res.filename//将文字转为语音后的路径地址
          // })
          // that.text_audio_status();//调用此方法来监听语音播放情况
        },
        fail: function (res) {
          console.log("fail tts", res)
        }
      })
  },

  text_audio_stop:function(){
    innerAudioContext.stop()
  },
  
  onItemClick:function(event){
    var index =event.currentTarget.dataset.index
    var logoImg=""
    console.log(index)
    switch (parseInt(index)) {
      case 1:
        logoImg = "/images/RecycleableWaste.jpg"
        break;
      case 2:
        logoImg = "/images/HazardouAwaste.jpg"
        break;
      case 3:
        logoImg = "/images/HouseholdfoodWaste.jpg"
        break;
      case 4:
        logoImg = "/images/ResidualWaste.png"
        break;
    }
    console.log(logoImg)
    this.setData({
      logo:logoImg,
      isShow:!this.data.isShow
    })
  }
  
})