const fs = require('fs')
const app = require('electron').app
const sPath = app.getPath('appData') + '/gstream/settings.json'

// As soon as we're imported, make sure there's a settings file
try {
  JSON.parse(fs.readFileSync(sPath))
} catch (e) {
  fs.writeFileSync(sPath, '{"module": "None", "site": "blank", "cachePath":"blank.json"}', 'utf-8')
  fs.writeFileSync(app.getPath('appData') + '/gstream/blank.json', '[]', 'utf-8')
}

/**
 * Get the raw settings object.
 */
module.exports.getSettings = () => {
  return JSON.parse(fs.readFileSync(sPath))
}

/**
 * Set the value of a setting.
 * 
 * @param {String} field 
 * @param {String} value 
 */
module.exports.setSetting = async (field, value) => {
  const settings = await this.getSettings()
  
  try {
    if (settings[field] !== value) settings[field] = value
  } catch(e) {
    return false
  }

  await fs.writeFileSync(sPath, JSON.stringify(settings), 'utf-8')
  return true
}