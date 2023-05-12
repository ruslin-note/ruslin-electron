import type Addon from 'ruslin-addon/addon'

declare global {
    interface Window {
        addon: typeof Addon
    }
}
