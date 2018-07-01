const {cache} = require('./defaultConfig')

function refeshRes(stats,res) {
  const {maxAge,expires,cacheControl,lasModified,etag} = cache

  if(expires){
    res.setHeader('Expires', (new Date(Date.now()+maxAge*1000).toUTCString()))
  }
  if(cacheControl){
    res.setHeader('Cache-Control',`public,max-age = ${maxAge}`)
  }
  if (lasModified){
    res.setHeader('Last-Modified',stats.mtime.toUTCString())
  }
  if(etag){
    res.setHeader('ETag',`${stats.size}-${stats.mtime}`)
  }
}

module.exports = function isFresh(stats,req,res) {
  refeshRes(stats,res);

  const lasModified = req.headers['if-modified-since']
  const etag = req.headers['if-none-match']

  if (!lasModified && !etag){
    return false
  }
  if (lasModified && lasModified !== req.headers['if-modified-since']){
    return false
  }
  if (etag && etag !== res.getHeader('ETag')) {
      return false
  }
  return true
}
