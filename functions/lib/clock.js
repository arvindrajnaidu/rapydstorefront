const moment = require('moment')
const tz = require('moment-timezone')

module.exports.getToday = (timezone = 'America/Los_Angeles', daysBack = 0) => {
  return process.env.TODAY || moment.tz(timezone).subtract(daysBack, 'days').format('YYYY-MM-DD')
}

module.exports.startOfDay = (timezone = 'America/Los_Angeles', daysBack = 0) => {
  return process.env.TODAY || moment.tz(timezone).subtract(daysBack, 'days').startOf('day').valueOf()
}

module.exports.endOfDay = (timezone = 'America/Los_Angeles', daysBack = 0) => {
  return process.env.TODAY || moment.tz(timezone).subtract(daysBack, 'days').endOf('day').valueOf()
}
