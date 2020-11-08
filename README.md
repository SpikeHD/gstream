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
- [ ] More scrapers

# Development

If you plan on contributing (thank you!), here's what you should know:

* `npm run start` - Starts the react server. This will *not* open it in the browser
* `npm run electron` - Starts the electron instance
* `npm run pack` - Automatically builds with React as well as with electron.
* `npm run dist`- Builds the executable. You'll find it in `./dist/`

If you are on Linux, you must have `wine` installed in order to compile for Windows.

### Heads up!

`electron-builder` is a bit [borked](https://github.com/electron-userland/electron-builder/issues/3569) right now and won't compile for linux unless it is done on a linux machine. If you are developing on Windows and the build fails after building the Windows binaries, don't worry, they should still be okay.
