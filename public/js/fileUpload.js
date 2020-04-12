FilePond.registerPlugin(
    FilePondPluginFileEncode,
    FilePondPluginImageResize,
    FilePondPluginImagePreview,
)

FilePond.setOptions({
    styleItemPanelAspectRatio: 150 / 100,
    imageResizeTargetWidth: 100,
    imageResizeTargetHeight: 150
})

FilePond.parse(document.body);