const cheerio = require('cheerio')
const axios = require('axios')
const fs = require('fs')

/**
 * Get JSON formatted fitgirl repacks.
 */
module.exports = async () => {
  // Placeholder while settings page doesn't exist yet
  homepage = 'https://fitgirl-repacks.to/all-my-repacks-a-z/'

  const res = await axios.get(homepage)
  let $ = cheerio.load(res.data)
  let games = []
  let pageCount

  const pages = $('.lcp_paginator li')

  pageCount = pages.length - 1

  // Get all pages and data
  for (let i = 1; i <= pageCount; i++) {
    const page = await axios.get(homepage + i)
    $ = cheerio.load(page.data)

    const list = $('#lcp_instance_0 li')

    // Get name and link
    list.each((i, e) => {
      games.push({
        name: $(e).find('a').text().trim(),
        link: $(e).find('a').prop('href')
      })
    })
  }

  return games
}