// Keys for local storage
export const itemsLocalStorageKey = 'exchange-items'
export const layoutsLocalStorageKey = 'exchange-layouts'

// Height of a step in the grid in pixel.
export const layoutGridHeight = 16
// Margin between items [x, y] in px.
export const layoutMargins = [8, 8]
// Handles for resizing the grid-layout. There are 8 options
// but we're just doing bottom left and bottom right when resizing.
export const resizeHandles = ['sw', 'se']
// Number of columns for each breakpoints
// (we could add more if we want to be more granular)
export const layoutGridColumns = { lg: 12, md: 6, sm: 2 }
// Screen width for each breakpoints
// (we could add more if we want to be more granular)
export const layoutBreakpoints = { lg: 1024, md: 768, sm: 640 }
