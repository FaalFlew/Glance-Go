/**
 * @typedef {Object} LocationData
 * @property {string} locationName
 * @property {string} country
 * @property {string} countryCode
 * @property {string} timezone
 * @property {string} datetime
 * @property {string} abbreviation
 * @property {string} utcOffset
 * @property {string} flagUrl
 * @property {string} sunrise
 * @property {string} sunset
 * @property {boolean} isDay
 * @property {string} timeDifference
 * @property {number} temperature
 * @property {string} weatherDescription
 * @property {string} weatherIcon
 * @property {number} feelsLike
 * @property {number} humidity
 * @property {number} windSpeed
 * @property {number} pressure
 * @property {CurrencyInfo} currency
 * @property {CountryFacts} facts
 */

/**
 * @typedef {Object} CurrencyInfo
 * @property {string} name
 * @property {string} code
 * @property {string} symbol
 */

/**
 * @typedef {Object} CountryFacts
 * @property {CurrencyInfo} currency
 * @property {string} capital
 * @property {number} population
 * @property {string} region
 * @property {string} subregion
 * @property {string} languages
 * @property {string} callingCode
 * @property {string} drivingSide
 * @property {string} tld
 * @property {string} demonym
 * @property {string} vehicleSign
 */

/**
 * @typedef {Object} ForecastDay
 * @property {Date} date
 * @property {number} maxTemp
 * @property {number} minTemp
 * @property {string} iconUrl
 */

/**
 * @typedef {Object} NewsArticle
 * @property {string} title
 * @property {string} url
 * @property {Object} source
 * @property {string} source.name
 * @property {string} publishedAt
 */

/**
 * @typedef {Object} Coordinates
 * @property {number} lat
 * @property {number} lng
 */

/**
 * @typedef {Object} FavoriteLocation
 * @property {string} locationName
 * @property {string} timezone
 * @property {number} lat
 * @property {number} lng
 */

export {};
