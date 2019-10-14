'use strict'

const isObj = require('lodash/isObject')

const createFormatProductsBitmask = (profile) => {
	const byProduct = Object.create(null)
	const defaultProducts = Object.create(null)
	for (let product of profile.products) {
		byProduct[product.id] = product
		defaultProducts[product.id] = product.default
	}

	const formatProductsBitmask = (filter) => {
		if (!isObj(filter)) throw new TypeError('products filter must be an object')
		filter = Object.assign(Object.create(null), defaultProducts, filter)

		let res = 0
		for (let product in filter) {
			if (filter[product] !== true) continue
			if (!byProduct[product]) throw new TypeError('unknown product ' + product)

			for (let bitmask of byProduct[product].bitmasks) res = res ^ bitmask
		}
		return res
	}
	return formatProductsBitmask
}

module.exports = createFormatProductsBitmask
