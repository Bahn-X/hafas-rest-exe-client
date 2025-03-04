'use strict'

const findRemarks = require('./find-remarks')

const ARRIVAL = 'a'
const DEPARTURE = 'd'

// todo: what is d.jny.dirFlg?
// todo: d.stbStop.dProgType/d.stbStop.aProgType

const createParseArrOrDep = (profile, opt, data, prefix) => {
	if (prefix !== ARRIVAL && prefix !== DEPARTURE) throw new Error('invalid prefix')

	const parseArrOrDep = (d) => {
		const tPlanned = d.stbStop[prefix + 'TimeS']
		const tPrognosed = d.stbStop[prefix + 'TimeR']
		const tzOffset = d.stbStop[prefix + 'TZOffset'] || null
		const cancelled = !!d.stbStop[prefix + 'Cncl']

		const res = {
			tripId: d.jid,
			stop: d.stbStop.location || null,
			...profile.parseWhen(profile, d.date, tPlanned, tPrognosed, tzOffset, cancelled),
			...profile.parsePlatform(profile, d.stbStop[prefix + 'PlatfS'], d.stbStop[prefix + 'PlatfR'], cancelled),
			// todo: for arrivals, this is the *origin*, not the *direction*
			direction: prefix === DEPARTURE && d.dirTxt && profile.parseStationName(d.dirTxt) || null,
			line: d.line || null,
			remarks: []
		}

		if (cancelled) {
			res.cancelled = true
			Object.defineProperty(res, 'canceled', {value: true})
		}

		if (opt.remarks) {
			res.remarks = findRemarks([
				...(d.remL || []),
				...(d.msgL || [])
			]).map(([remark]) => remark)
		}

   		if (opt.stopovers && d.stopL) {
  			const parse = profile.parseStopover(profile, opt, data)
  			// Filter stations the train passes without stopping, as this doesn't comply with FPTF (yet).
  			const stopovers = d.stopL
  			.map(st => parse(d.date, st))
  			.filter(st => !st.passBy)
  			if (prefix === ARRIVAL) res.previousStopovers = stopovers
			else if (prefix === DEPARTURE) res.nextStopovers = stopovers
  		}

		return res
	}

	return parseArrOrDep
}

module.exports = createParseArrOrDep
