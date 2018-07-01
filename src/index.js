const http = require('http')
const chalk = require('chalk')
const conf = require('./config/defaultConfig')
const path = require('path')
const route = require('./route/route')
const openUrl = require('./config/openUrl')


class Server {
  constructor(config) {
    this.conf = Object.assign({},conf,config)
  }

  start(){
    const server = http.createServer((req, res) => {
      const filePath = path.join(this.conf.root, req.url)
      route(req, res, filePath,this.conf)
    })

    server.listen(this.conf.port, this.conf.hostname, () => {
      const addr = `http://${this.conf.hostname}:${this.conf.port}`;
      console.info(`Server started at ${chalk.green(addr)}`)
      openUrl(addr)
    })

  }
}

module.exports = Server

// const server = http.createServer((req,res)=>{
//   const filePath = path.join(conf.root,req.url)
//   console.info(res)
//   fs.stat(filePath,(err,stats)=>{
//     if(err){
//       res.statusCode = 404

//       res.setHeader('Content-Type','text/plain')
//       res.end(`${filePath} is not a directory or file`)
//     }
//     if(stats.isFile()){
//       res.statusCode = 200
//       res.setHeader('Content-Type','text/plain;charset=utf-8')
//       // res.setEncoding('utf-8');
//       // res.setHeader('Content-Type','text/plain,	application/x-jpg')//指定下载js文件
//       fs.createReadStream(filePath).pipe(res)
//       // fs.readFile(filePath,(err,data)=>{
//       //   res.end(data)
//       // })
//     }else if(stats.isDirectory()){
//       fs.readdir(filePath,(err,files)=>{
//         res.statusCode = 200
//         res.setHeader('Content-Type','text/plain')
//         res.end(files.join(','))
//       })
//     }
//   })
// res.statusCode = 200
// res.setHeader('Content-Type','text/html')
// res.write('<html><body><b>Hello Http</b></body></html>')//wirte可重复多写
// res.end(filePath)
//})
