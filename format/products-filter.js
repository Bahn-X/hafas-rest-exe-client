'use strict'

const createFormatProductsFilter = (profile) => {
	const formatProductsBitmask = profile.formatProductsBitmask(profile)

	const formatProductsFilter = (filter) => {
		const bitmask = formatProductsBitmask(filter)
		if (bitmask === 0) throw new Error('no products used')
		return {
			type: 'PROD',
			mode: 'INC',
			value: bitmask + ''
		}
	}
	return formatProductsFilter
}

module.exports = createFormatProductsFilter
