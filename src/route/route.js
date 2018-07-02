 const fs = require('fs')
 const promisify = require('util').promisify
 const stat = promisify(fs.stat)
 const readdir = promisify(fs.readdir)
 const path = require('path')
 const HandleBars = require('handlebars')
//  const config = require('../config/defaultConfig.js')
 const tplPath = path.join(__dirname, '../template/dir.tpl')
 const source = fs.readFileSync(tplPath)
 const template = HandleBars.compile(source.toString())
//  const mime = require('../config/mime.js')
 const compress = require('../config/compress')
 const range = require('../config/range')
 const isFresh = require('../config/cache')
 const mime = require('mime-types')

 module.exports = async function (req, res, filePath, config) { // 为将defaultConfig做cli可配置化,不再读文件信息,转为server 传入
   try {
     const stats = await stat(filePath)
     if (stats.isFile()) {
       // res.setHeader('Content-Type', 'text/plain;charset=utf-8')

       const contentType = mime.lookup(path.extname(filePath).toLowerCase())
       res.setHeader('Content-Type', `${ contentType};charset=utf-8`) //指定下载js文件
       res.setHeader('Access-Control-Allow-Origin', '*')
       res.setHeader("Access-Control-Allow-Methods", "*");
       res.setHeader("Access-Control-Allow-Headers", "Content-Type,XFILENAME,XFILECATEGORY,XFILESIZE");
       if (isFresh(stats, req, res)) {
         res.statusCode = 304
         res.end()
         return
       }
       //压缩文件代码
       let rs;
       const {
         code,
         start,
         end
       } = range(stats.size, req, res)
       if (code === 200) {
         res.statusCode = 200
         rs = fs.createReadStream(filePath)
       } else {
         res.statusCode = 206
         rs = fs.createReadStream(filePath, {
           start,
           end
         })
       }
       if (filePath.match(config.compress)) {
         rs = compress(rs, req, res)
       }
       rs.pipe(res)
       // fs.readFile(filePath,(err,data)=>{
       //   res.end(data)
       // })
     } else if (stats.isDirectory()) {
       const files = await readdir(filePath)
       res.statusCode = 200
       res.setHeader('Content-Type', 'text/html')
       const dir = path.relative(config.root, filePath);
       const data = {
         title: path.basename(filePath),
         dir: dir ? `/${dir}` : '',
         files
       }
       //  res.end(files.join(','))
       res.end(template(data))
     }
   } catch (ex) {
     console.info(ex)
     res.statusCode = 404
     res.setHeader('Content-Type', 'text/plain')
     res.end(`${filePath} is not a directory or file`)
   }
 }
