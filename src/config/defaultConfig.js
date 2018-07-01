module.exports = {
  root:process.cwd(),
  hostname:'127.0.0.1',
  port:9999,
  compress:/\.(html|js|css|md)/, //支持压缩的扩展名
  cache:{
    maxAge:600,
    expires:true,
    cacheControl:true,
    lastModified:true,
    etag:true
  }
}
