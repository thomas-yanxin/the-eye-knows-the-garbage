const checkPermission = scope =>
    new Promise((resolve, reject) => {
        wx.getSetting({
            success: res => {
                // 是否存在认证配置
                console.log(res);
                let hasAuthorized = res.authSetting.hasOwnProperty(scope);
                console.log('hasAuthorized:'+hasAuthorized);
                if (hasAuthorized) {
                    // 已授权
                    if (res.authSetting[scope]) {
                        resolve('已授权')
                        return
                    }
                    // 未授权，提示进入小程序设置页面，wx限制:需要主动点击才能执行openSetting()，因此使用modal
                    wx.showModal({
                        title: '没有权限',
                        content: '体验该功能需要您授权功能权限，现在前往设置开启',
                        success: res => {
                            if (res.confirm) {
                                reject('设置页面')
                                wx.openSetting()
                            } else if (res.cancel) {
                                reject('不进入设置')
                            }
                        }
                    })
                }else{
                    console.log('getSetting里面无该权限,申请授权！');
                    wx.authorize({
                        scope: scope,
                        success () {
                            resolve('已授权');
                        },fail(){
                            reject('申请授权失败！');

                        }
                    })
                }
            },
            fail: err => {
                console.error(err);
                reject(err.errMsg) }
        })
    });

module.exports = {
    checkPermission: checkPermission,
}