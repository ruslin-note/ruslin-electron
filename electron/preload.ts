/**
 * The preload script runs before. It has access to web APIs
 * as well as Electron's renderer process modules and some
 * polyfilled Node.js functions.
 * 
 * https://www.electronjs.org/docs/latest/tutorial/tutorial-preload
 */

// import { contextBridge } from 'electron'
import addon from '../ruslin-addon'

// contextBridge.exposeInMainWorld('addon', addon) // TODO: Re-enable contextIsolation
window.__addon = addon;
window.__appData = new addon.AppData(); // TODO: Multi-profile support?
