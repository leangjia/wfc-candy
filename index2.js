var bitcoin = require('bitcoin');
var StringBuffer = require("stringbuffer");
var redism=require("redis");
var maxprocess=2;
var client = new bitcoin.Client({
  host: 'localhost',
  port: 9665,
  user: 'test',
  pass: 'admin',
  timeout: 30000
});
var redis = redism.createClient(6379,'localhost',{});  
//loop 每隔60秒检测redis数据里是否有需要打款的
var sleep =async function (time) {
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            resolve();
        }, time);
    })
};
//每次只处理2笔candy
var process_redislist= function (time) {
    return new Promise(function (resolve, reject) {
          redis.llen("txlist",function(err,len){
              	console.log("txlist len="+len);
                if(len>=1){
                     redis.lrange("txlist", 0, maxprocess-1, function (error, items) {
                         console.log("txlist items="+items);
                         items.forEach(function (item,index) {
                                console.log("txlist item="+item);
                                var str=item.split(":")
                                var wfcaddr=str[0];
                                var txval=str[1];
                                console.log("txlist wfcaddr="+wfcaddr);
                                console.log("txlist txval="+txval);
                                client.sendToAddress(wfcaddr,txval,function(err, txid, resHeaders) {
                                    console.log('redis.rpush txid:', txid);
		                    redis.rpush("txs:"+wfcaddr, txid+"-"+txval,function(error){
		                         console.log("err="+error);
		                    });
                                    redis.lpop("txlist");
				});
                         });
                         resolve();
                     });
                }else{resolve();}
          });
    })
};

var start = async function () {
while(true){
    console.log('start');
    await process_redislist();
    await sleep(60000); 
    console.log('end');
}
};
start();
