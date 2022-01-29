import { lookup } from 'geoip-lite'

export default async function ipInfo(req, res) {
  let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
  if (Array.isArray(ip)) {
    ip = ip[0]
  }

  if (typeof ip === 'undefined') {
    res.status(500).end()
    return
  }

  ip = ip.split(', ')[0]

  const geo = lookup(ip)
  res.status(200).json({
    ip,
    geo,
  })
  res.end()
}
