const cheerio = require('cheerio')
const axios = require('axios')

/**
 * Meta info for module display
 */
module.exports.meta = {
  name: 'FitGirl',
  description: 'Games list for FitGirl Repacks',
  cachePath: 'fg.json'
}

/**
 * Get JSON formatted fitgirl repacks.
 */
module.exports.getAllGames = async (homepage) => {
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
        name: $(e).find('a').text().trim().split(' - v')[0],
        link: $(e).find('a').prop('href'),
        image: null
      })
    })
  }

  return games
}

/**
 * Get details of FitGirl game page.
 * 
 * @param {String} link 
 */
module.exports.getGame = async (link) => {
  const res = await axios.get(link)
  const $ = cheerio.load(res.data)
  const image = $('.entry-content p img').prop('src')
  const links = $('.entry-content ul').first().find('li')
  const description = $('.su-spoiler-content').first().text().trim()
  const parsed = []

  links.each((i, e) => {
    let thisLinks = []
    
    $(e).find('a').each((ind, el) => thisLinks.push({ title: $(el).text().trim(), link: $(el).prop('href')}))

    parsed.push({
      name: $(e).text().trim(),
      links: thisLinks
    })
  })

  return {
    items: parsed,
    image: image,
    description: description
  }
}