import axios from 'axios';
import {get_url} from "./request";
import {isString,isFunction} from 'lodash'
const WX_ID = 'gh_ede0a4305d31';
declare let wx:any;
export const Api = {
    onMenuShareTimeline:'onMenuShareTimeline',
    onMenuShareAppMessage:'onMenuShareAppMessage',
    onMenuShareQQ:'onMenuShareQQ',
    onMenuShareWeibo:'onMenuShareWeibo',
    onMenuShareQZone:'onMenuShareQZone',
    startRecord:'startRecord',
    stopRecord:'stopRecord',
    onVoiceRecordEnd:'onVoiceRecordEnd',
    playVoice:'playVoice',
    pauseVoice:'pauseVoice',
    stopVoice:'stopVoice',
    onVoicePlayEnd:'onVoicePlayEnd',
    uploadVoice:'uploadVoice',
    downloadVoice:'downloadVoice',
    chooseImage:'chooseImage',
    previewImage:'previewImage',
    uploadImage:'uploadImage',
    downloadImage:'downloadImage',
    translateVoice:'translateVoice',
    getNetworkType:'getNetworkType',
    openLocation:'openLocation',
    getLocation:'getLocation',
    hideOptionMenu:'hideOptionMenu',
    showOptionMenu:'showOptionMenu',
    hideMenuItems:'hideMenuItems',
    showMenuItems:'showMenuItems',
    hideAllNonBaseMenuItem:'hideAllNonBaseMenuItem',
    showAllNonBaseMenuItem:'showAllNonBaseMenuItem',
    closeWindow:'closeWindow',
    scanQRCode:'scanQRCode',
    chooseWXPay:'chooseWXPay',
    openProductSpecificView:'openProductSpecificView',
    addCard:'addCard',
    chooseCard:'chooseCard',
    openCard:'openCard'
}
const defaultApis=[
    Api.getLocation,Api.getNetworkType,Api.chooseImage,Api.closeWindow,Api.downloadImage,Api.hideAllNonBaseMenuItem,Api.hideMenuItems,Api.hideOptionMenu
]
const WXStatus={
    config:false
}
const request = axios.create({
    withCredentials: true,
});
request.interceptors.response.use((response: any) => {
    return response.data
    // return response.data.d;
})
const post = function (url:string, data: any, success: Function, error?: Function) {
    request.post(url, data).then((d: any) => {
        if (isString(d.e) && d.e.length > 0 && isFunction(error)) {
            error(d.e)
        } else {
            success(d.d)
        }
    }).catch(e => {
        if (typeof error == 'function') {
            error.apply([], e)
        }
    })
}

export function isWeixinBrowser() {
    var agent:any = navigator.userAgent.toLowerCase();
    if (agent.match(/MicroMessenger/i) == "micromessenger") {
        return true;
    } else {
        return false;
    }
}
/**
 * 获取已认证用户的信息
 * @param {Function} s
 * @param {Function} e
 */
export function getLogined(s:Function,e?:Function){
    post('http://r.tansuyun.cn/w.php?i=Js/getLogined',{},s,e)
}

/**
 * 配置
 * @param {Function} s
 * @param {string[]} Apis
 */
export function config(s:Function,Apis:string[]=[],e?:Function) {
    if(isWeixinBrowser())
    post('http://r.tansuyun.cn/w.php?i=Js/config',{
        ID:WX_ID,
        APIs:Apis.length>0?Apis:defaultApis,
        Debug:false,
        URL:window.location.href
    },(d:any)=>{
        if(wx&&wx.config){
            wx.config(d)
            getLogined((d:any)=>{
                if(false===d){
                    window.location.href = `http://r.tansuyun.cn/w.php?i=Js/user&Scope=snsapi_userinfo&URL=${encodeURIComponent(window.location.href)}&ID=`+WX_ID
                }else{
                    if(isFunction(s)){
                        s(d)
                    }
                }
            })
        }
    })
    else
        if(isFunction(e)){e({code:500,text:'不在微信中，请使用微信打开'})}
}

/**
 * 地理坐标获取
 * @param {Function} s
 * @param {Function} e
 */
export function location(s:Function,e?:Function) {
    if(wx&&wx.getLocation){
        wx.getLocation({
            type:'wgs84',
            success:(res:any)=>{
                if(isFunction(s)){
                    s(res)
                }
            }
        })
    }else{
        if(isFunction(e))
            e({
                code:404,
                text:'不是微信环境'
            })
    }
}

/**
 * 微信扫码
 * @param {Function} s
 * @param {boolean} NeedResult
 * @param {Function} e
 */
export function scan(s:Function,NeedResult:boolean=false,e?:Function) {
    if(wx&&wx.scanQRCode){
        wx.scanQRCode({
            needResult:NeedResult?1:0,
            success:(d:any)=>{
                if(isFunction(s)){
                    s(d.resultStr)
                }
            }
        })
    }else{
        if(isFunction(e))
            e({
                code:404,
                text:'不是微信环境'
            })
    }
}
export function pay(s:Function,e?:Function) {

}

/**
 * 关闭窗口
 */
export function close() {
    if(wx&&wx.closeWindow){wx.closeWindow()}
}
export function hideMenuItems() {
    if(wx&&wx.hideMenuItems){wx.hideMenuItems()}
}

/**
 * 获取网络接口类型
 * @param {Function} s
 */
export function networkType(s:Function) {
    if(wx&&wx.getNetworkType){wx.getNetworkType({
        success:(d:any)=>{if(isFunction(s))s(d)}
    })}
}