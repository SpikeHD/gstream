const cheerio = require('cheerio')
const axios = require('axios')

/**
 * Get JSON formatted fitgirl repacks.
 */
module.exports = async () => {
  // Placeholder while settings page doesn't exist yet
  homepage = 'https://fitgirl-repacks.to/all-my-repacks-a-z/'

  const res = await axios.get(homepage)
  const $ = cheerio.load(res.data)
  let pageCount

  const pages = $('.lcp_paginator li')

  pageCount = pages.length - 1

  return pageCount
}