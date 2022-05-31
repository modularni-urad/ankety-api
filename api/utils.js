const TRUSTED_IPS = process.env.TRUSTED_IPS || ''

export function trustedAuth (req, res, next) {
  if (!req.user && TRUSTED_IPS.indexOf(req.ip) >= 0) {
    req.user = { id: 'system' }
  }
  next()
}