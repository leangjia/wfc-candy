基础环境为ubuntu nodejs v4以上

1 安装forever
sudo npm install forever -g

2 安装redis
sudo apt-get install redis-server

3 编译安装wificoind启动并同步完区块链

  host: 'localhost',
  
  port: 9665,
  
  user: 'test',
  
  pass: 'admin',
  
  timeout: 30000
  
以下配置的json调用可以正常使用

如修改了主链的用户名和密码需修改index.js里相应的参数。

4 git clone https://github.com/wificoin-project/wfc-candy/

cd wfc-candy

5 npm install

6 npm run test

7 访问 http://localhost:8089 就可以体验发糖果了

8 如果需要修改服务端口 请修改 index.js 的serport参数
