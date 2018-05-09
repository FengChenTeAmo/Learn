现在遇到的问题：  
1、需要准确的推送消息给各个网页端、客户端、App等终端，后期还会引入物联网设备，当前无在用方案  
2、要能批量推送  
3、要能精确推送，精确到某个人推送或者某个用户组推送等需求  
4、能接受推送信息，能传递内容，能够跨平台推送  
5、与门控等互联网设备能够融合，能够满足直接通信，  
6、能够满足通过HTTP协议推送，保障推送到达率等  

网上搜集的部分方案常用方案：  
1、长连接  
2、轮训  
3、持久化链接  

各个方案的优缺点比较请自行百度补充理解  

之前考虑过的备选方案  

MQTT之配置文件内容：见项目配置目录下的[mosquito.conf](../mosquitto.conf) 

mosquitto.conf文件存放在服务器的/web/docker/mqtt/目录下
进入该目录后使用docker命令启动mqtt服务，
```
#停止mqtt服务并删除mqtt容器
docker stop mqtt && docker rm mqtt
#启动mqtt的docker服务，并同时开启1883和9001端口用于socket链接和websocket链接
docker run -d --name mqtt --restart=always -p 1883:1883 -p 9001:9001 -v /web/docker/mqtt:/mosquitto/config eclipse-mosquitto
```
firewall防火墙操作命令
```
#配置添加1883和9001的端口开放
firewall-cmd --zone=public --add-port=1883/tcp --permanent
firewall-cmd --zone-publci --add-port=9001/tcp --permanent
#重新加载防火圈配置，使得刚才配置的配置生效
firewall-cmd --reload
```