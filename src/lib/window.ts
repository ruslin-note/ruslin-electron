/* eslint-disable */
import type Addon from "ruslin-addon/addon";

declare global {
  interface Window {
    __addon: typeof Addon | null;
    __appData: Addon.AppData | null;
  }
}
