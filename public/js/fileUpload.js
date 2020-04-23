const rootStyles = window.getComputedStyle(document.documentElement)

if (rootStyles.getPropertyValue('--book-cover-width-large') != null && rootStyles.getPropertyValue('--book-cover-width-large') != '') {
    ready()
} else {
    document.getElementById('main_css').addEventListener('load', ready)
}

function ready() {
    const coverWidth = parseFloat(rootStyles.getPropertyValue('--book-cover-width-large'));
    const coverRatio = parseFloat(rootStyles.getPropertyValue('--book-cover-aspect-ratio'));
    const coverHeight = coverWidth / coverRatio 

    FilePond.registerPlugin(
        FilePondPluginFileEncode,
        FilePondPluginImageResize,
        FilePondPluginImagePreview,
    )
    
    FilePond.setOptions({
        styleItemPanelAspectRatio: 1 / coverRatio,
        imageResizeTargetWidth: coverWidth,
        imageResizeTargetHeight: coverHeight
    })
    
    FilePond.parse(document.body);
}

