
import ByteView from 'byteview'

const HOUR = 60 * 60 * 1000
const MINUTE = 60 * 1000
const DAY = 60 * 60 * 1000 * 24 * 1

class NeuDate extends Date {
  static isDate (input) {
    return (
      typeof input === 'object' &&
      (
        input instanceof Date ||
        (input.constructor && input.constructor.name === 'Date') ||
        input instanceof NeuDate ||
        (input.constructor && input.constructor.name === 'NeuDate')
      )
    )
  }

  static DAY = 60 * 60 * 1000 * 24 * 1
  static HOUR = 60 * 60 * 1000
  static MINUTE = 60 * 1000
  static SECOND = 1000

  /**
   * 
   * @param  {[number|string|Date|NeuDate, number|undefined, number|undefined, number|undefined, number|undefined, number|undefined, number|undefined]} args
   */
  constructor (...args) {
    super(...args)
  }

  get [Symbol.toStringTag] () {
    return 'Sku'
  }

  [Symbol.toPrimitive] (hint) {
    return hint === 'number' ? this.valueOf() : this.toString()
  }

  get isWeekend () {
    const day = this.getDay()
    return day === 0 || day === 6
  }

  get isWeekday () {
    const day = this.getDay()
    return day !== 0 && day !== 6
  }

  get isToday () {
    return this.isSameDate(new NeuDate())
  }

  clone () {
    return new NeuDate(this.valueOf())
  }

  addDays (days) {
    if (!days) return this
    this.setDate(this.getDate() + days)
    return this
  }

  isSameDate (date) {
    return (
      this.getFullYear() === date.getFullYear() &&
      this.getMonth() === date.getMonth() &&
      this.getDate() === date.getDate()
    )
  }

  difference (milliseconds1, milliseconds2) {
    let difference = milliseconds1 - milliseconds2
    let response = ''
    if (difference >= NeuDate.DAY) {
      const day = Math.floor(difference / NeuDate.DAY)
      response += `${day}`
      difference -= day
    } else {
      response += '0d'
    }
    if (difference >= NeuDate.HOUR) {
      const hour = Math.floor(difference / NeuDate.HOUR)
      response += `-${hour}`
      difference -= hour
    } else {
      response += '-0'
    }
    if (difference >= NeuDate.MINUTE) {
      const minute = Math.floor(difference / NeuDate.MINUTE)
      response += `:${minute}`
      difference -= minute
    } else {
      response += ':0'
    }
    if (difference >= 1000) {
      const second = Math.floor(difference / 1000)
      response += `:${second}`
      difference -= second
    } else {
      response += ':0'
    }
    return response
  }

  toString (format) {
    if (typeof format === 'undefined' || !format) return super.toString()
    let response = ''

    switch (format) {
      case 'MM/DD/YY':
        response = getMMY(this)
        break
      case 'MM-DD-YY':
        response = getMMYDashes(this)
        break
      case 'MMM DD, YY':
        response = getMMMY(this)
        break
      case 'MMM DD':
        response = getMMM(this)
        break
      case 'MMMM DD, YY':
        response = getMMMMY(this)
        break
      case 'MMMM DD':
        response = getMMMM(this)
        break
      case 'MM/DD/YY TT':
        response = getMMYT(this)
        break
      case 'MM-DD-YY-TT':
        response = getMMYTDashes(this)
        break
      case 'MMM DD, YY TT':
        response = getMMMYT(this)
        break
      case 'MMM DD TT':
        response = getMMMT(this)
        break
      case 'MMMM DD, YY TT':
        response = getMMMMYT(this)
        break
      case 'MMMM DD T':
        response = getMMMMT(this)
        break
      case 'hex':
        response = getHex(this)
        break
      default:
        response = super.toString()
        break
    }

    return response
  }
}

function getTimeDifference (ms1, ms2) {
  let difference = ms1 - ms2
  let response = ''
  if (difference >= DAY) {
    const day = Math.floor(difference / DAY)
    response += `${day}`
    difference -= day
  } else {
    response += '0d'
  }
  if (difference >= HOUR) {
    const hour = Math.floor(difference / HOUR)
    response += `-${hour}`
    difference -= hour
  } else {
    response += '-0'
  }
  if (difference >= MINUTE) {
    const minute = Math.floor(difference / MINUTE)
    response += `:${minute}`
    difference -= minute
  } else {
    response += ':0'
  }
  if (difference >= 1000) {
    const second = Math.floor(difference / 1000)
    response += `:${second}`
    difference -= second
  } else {
    response += ':0'
  }
  return response
}

function getMMY (date) {
  let month = date.getMonth()
  month = ++month < 10 ? `0${month}` : month
  let day = date.getDate()
  day = day < 10 ? `0${day}` : day
  const year = date.getFullYear()
  return `${month}/${day}/${year}`
}

function getMMYDashes (date) {
  let month = date.getMonth()
  month = ++month < 10 ? `0${month}` : month
  let day = date.getDate()
  day = day < 10 ? `0${day}` : day
  const year = date.getFullYear()
  return `${month}-${day}-${year}`
}

/**
 *
 * @param {NeuDate} date 
 * @returns {string}
 */
function getHex (date) {
  const bv = new ByteView(13)
  let offset = 0
  console.log(date.getFullYear())
  console.log(date.getMonth() + 1)
  console.log(date.getDate())
  console.log(date.getHours())
  console.log(date.getMinutes())
  console.log(date.getSeconds())
  console.log(date.getMilliseconds())
  offset = bv.setUint16(offset, date.getFullYear())
  offset = bv.setUint8(offset, date.getMonth() + 1)
  offset = bv.setUint8(offset, date.getDate())
  offset = bv.setUint8(offset, date.getHours())
  offset = bv.setUint8(offset, date.getMinutes())
  offset = bv.setUint8(offset, date.getSeconds())
  offset = bv.setUint16(offset, date.getMilliseconds())
  return bv.toString('hex')
}

function getMMMY (date) {
  const month = MONTHS_SHORT[date.getMonth()]
  const day = date.getDate()
  const year = date.getFullYear()
  return `${month} ${day}, ${year}`
}

function getMMM (date) {
  const month = MONTHS_SHORT[date.getMonth()]
  const day = date.getDate()
  return `${month} ${day}`
}

function getMMMMY (date) {
  const month = MONTHS[date.getMonth()]
  const day = date.getDate()
  const year = date.getFullYear()
  return `${month} ${day}, ${year}`
}

function getMMMM (date) {
  const month = MONTHS[date.getMonth()]
  const day = date.getDate()
  return `${month} ${day}`
}

function getMMYT (date) {
  let month = date.getMonth()
  month = ++month < 10 ? `0${month}` : month
  let day = date.getDate()
  day = day < 10 ? `0${day}` : day
  const year = date.getFullYear()
  return `${month}/${day}/${year} ${date.toLocaleTimeString()}`
}

function getMMYTDashes (date) {
  let month = date.getMonth()
  month = ++month < 10 ? `0${month}` : month
  let day = date.getDate()
  day = day < 10 ? `0${day}` : day
  const year = date.getFullYear()
  return `${month}-${day}-${year}-T${date.toLocaleTimeString().replace(/:/g, '-').replace(/ [AP]M/g, '')}`
}

function getMMMYT (date) {
  const month = MONTHS_SHORT[date.getMonth()]
  const day = date.getDate()
  const year = date.getFullYear()
  return `${month} ${day}, ${year} ${date.toLocaleTimeString()}`
}

function getMMMT (date) {
  const month = MONTHS_SHORT[date.getMonth()]
  const day = date.getDate()
  return `${month} ${day} ${date.toLocaleTimeString()}`
}

function getMMMMYT (date) {
  const month = MONTHS[date.getMonth()]
  const day = date.getDate()
  const year = date.getFullYear()
  return `${month} ${day}, ${year} ${date.toLocaleTimeString()}`
}

function getMMMMT (date) {
  const month = MONTHS[date.getMonth()]
  const day = date.getDate()
  return `${month} ${day} ${date.toLocaleTimeString()}`
}

console.log(new NeuDate().toString('hex'))
