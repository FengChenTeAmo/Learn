import {connect} from 'mqtt'
import { enum } from '../store/modules/Orders';
const client = connect('ws://js.s.tansuyun.cn:9001')
client.subscribe('mqtt/demo')
client.on('message',(topic:string,payload:any)=>{
    console.log(topic,payload.toString());
})
const prefix = 'stockv3/';
client.publish('mqtt/demo',"hello")
export function publish(w:string,data:any){
    client.publish(prefix+w,data instanceof String ? data : JSON.stringify(data));
}
export const Type={
    ONLY_ONE:2,
    LESS_ONE:1,
    NOT_ENSURE:0
}
export function subscribe(channel:string,type:number){

}

export enum LogType{
    // 错误日志
    ERROR='E',
    // 记录日志
    LOG='L',

}
/**
 * 发送日志数据
 * @param data 
 */
export function log(type:LogType,who:string,where:string,when:string,what:string){
    client.publish(prefix+'log',JSON.stringify({
        T:type,
        WO:who,
        WE:where,
        WN:when,
        WT:what
    }))
}