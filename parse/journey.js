'use strict'

const findRemarks = require('./find-remarks')

const createParseJourney = (profile, opt, data) => {
	const parseLeg = profile.parseJourneyLeg(profile, opt, data)
	// todo: c.conSubscr
	// todo: c.trfRes x vbb-parse-ticket
	// todo: c.sotRating, c.isSotCon, c.sotCtxt
	// todo: c.showARSLink
	// todo: c.useableTime
	// todo: c.cksum
	// todo: c.isNotRdbl
	// todo: c.badSecRefX
	// todo: c.bfATS, c.bfIOSTS
	const parseJourney = (j) => {
		const legs = j.secL.map(leg => parseLeg(j, leg))
		const res = {
			type: 'journey',
			legs,
			refreshToken: j.ctxRecon || null
		}

		const freq = j.freq || {}
		if (freq.minC || freq.maxC) {
			res.cycle = {}
			if (freq.minC) res.cycle.min = freq.minC * 60
			if (freq.maxC) res.cycle.max = freq.maxC * 60
			// nr of connections in this frequency, from now on
			if (freq.numC) res.cycle.nr = freq.numC
		}

		if (opt.remarks && Array.isArray(j.msgL)) {
			res.remarks = findRemarks(j.msgL).map(([remark]) => remark)
		}

		if (opt.scheduledDays) {
			res.scheduledDays = profile.parseScheduledDays(profile, j.sDays.sDaysB)
		}

		return res
	}

	return parseJourney
}

module.exports = createParseJourney
