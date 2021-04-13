var http = require('../../../utils/http.js')
var baiduTokenUtil = require('../../../utils/baidu-token-util.js');

// import { Utilaa } from 'util'
// var u = require('underscore')
Page({
    data: {
        results: [],
        src: "",
        isCamera: true,
    },
    accessToken: "",
    onLoad() {
        this.ctx = wx.createCameraContext();
        var that=this
        wx.showShareMenu({
            withShareTicket: true //要求小程序返回分享目标信息
        });
        try {
            baiduTokenUtil.getBdAiAccessToken().then(
                function (res) {
                    console.log('获取百度ai token:' + JSON.stringify(res));
                    that.accessToken = res.access_token;
                }, function (error) {
                    console.error('获取百度ai token:' + error);
                }
            );
        } catch (error) {
            console.error(error);
        }

    },
    takePhoto() {
        var that = this
        if (this.data.isCamera == false) {
            this.setData({
                isCamera: true,
                btnTxt: "拍照"
            })
            return
        }
        this.ctx.takePhoto({
            quality: 'high',
            success: (res) => {
                this.setData({
                    src: res.tempImagePath,
                    isCamera: false,
                    btnTxt: "重拍"
                })
                wx.showLoading({
                    title: '正在加载中',
                })
                wx.getFileSystemManager().readFile({
                    filePath: res.tempImagePath,
                    encoding: "base64",
                    success: res => {
                        that.req(that.accessToken, res.data);
                    },
                    fail: res => {
                        wx.hideLoading()
                        wx.showToast({
                            title: '拍照失败,未获取相机权限或其他原因',
                            icon: "none"
                        })
                    }
                })
            }
        })
    },
    req: function (token, image) {
        var that = this
        var myimgdata = image
        wx.setStorageSync('myimgdata', myimgdata);
        wx.navigateBack({
            delta: 1,
        });
        // wx.getStorage({
        //     key: 'myrealname',
        //     success: function(res){
        //         var myname = rea.data;
        //         // that.setData({
        //         //     myname: res.data,
        //         // });
        //     }
        // });



    //     var myname = "沈晨"
    //     var token = wx.getStorageSync('token');
    //     var openid = wx.getStorageSync('openid');
    //     console.log(myname);
    //     console.log(token);
    //     console.log(image);
    //     console.log(openid);
    //     var data = {
    //         'token': token,
    //         'openid': openid,
    //         'name': myname,
    //         'img':myimgdata,
    //     };
    //     wx.request({
    //         url: 'http://127.0.0.1:8000/intput_identify/',
    //         method: 'POST',
    //         data: data,
    //         header: {
    //             "content-type": "application/x-www-form-urlencoded",
    //         },
    //         success (res) {
    //             wx.hideLoading();
    //             console.log(res.data)
    //             var results = res.data.results;
    //             if (results) {
    //                 that.setData({
    //                     isShow: true,
    //                     results: results
    //                 }) 
    //             } else {
    //                 wx.showToast({
    //                     icon: 'none',
    //                     title: '没有认出来，可以再试试~',
    //                 })
    //             }

    //         },
    //         fail(error){
    //             wx.hideLoading();
    //             console.log(error);
    //             wx.showToast({
    //                 icon: 'none',
    //                 title: '请求失败了，请确保网络正常，重新试试~',
    //             })
    //         }
    //     });

    },





    // hideModal: function () {
    //     this.setData({
    //         isShow: false,
    //     })
    // },

    error(e) {
        console.log(e.detail)
    }

})