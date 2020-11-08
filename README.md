# GStream

# Warning

I am not responsible for the content grabbed from the websites that this project can use. I am also not responsible for any legal issues you may face.

# Usage

Download the lastest release for your platform [here](https://github.com/SpikeHD/gstream/releases/) and run it. After that it should be fairly straight forward.

\**Mac support coming when I buy (or somone buys me 👀) a Mac 😛*

# Goals

- [x] Basic React UI with Electron
- [x] At least one scraper
- [ ] Direct link downloader
- [x] Torrent link downloader
- [ ] Better UI
- [x] More scrapers (technically done because of module support)
- [ ] Other types (ROMs n' stuff maybe?)

# Development

If you plan on contributing (thank you!), here's what you should know:

* `npm run start` - Starts the react server and Electron instance.
* `npm run build`- Builds the React app and the executable. You'll find it in `./dist/`.

If you are on Linux, you must have `wine` installed in order to compile for Windows. You do not need to build a binary when contributing, only do so when you want to make sure the installation works.

## Modules

You may notice the `modules` folder. That folder will contain all of the available site parsing tools. You can look at the existing ones as examples.

If you plan on making a new one, it *must* follow this format:

Module must contain:
  * `module.exports.meta` object containing the fields:
    * `name` - Name of module
    * `description` - Description of module
    * `cachePath` - Name of cache.json file (eg. `mymodule.json`)
    
  * `async getAllGames(page)` function that returns an array of objects, each containing the fields:
    * `name` - Game name
    * `link` - Link to game page
    * optional `image` - Link to image
    
  * `async getGame(link)` function that returns an object containing the fields:
    * `items` - Contains an array of objects with `name` and `link` fields
    * `description` - Game description
    * optional `image` - Link to image

**Note:** You do **not** need to worry about handling cache. This is done for you.

Once the module is written properly, it should automatically be found in the module list on the settings page. Select it to test it out!

### Heads up!

`electron-builder` is a bit [borked](https://github.com/electron-userland/electron-builder/issues/3569) right now and won't compile for linux unless it is done on a linux machine. If you are developing on Windows and the build fails after building the Windows binaries, don't worry, they should still be okay.
