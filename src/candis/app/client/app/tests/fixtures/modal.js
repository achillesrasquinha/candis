export default {
    component: 'FileEditor',
        title: 'Create',
        size: 'lg',
    buttons:
    [
        {
            label: "Ok",
        className: "btn-primary",
        },
        {
            label: "Cancel",
        }
    ],
        props:
        {
        classNames: { root: ['no-background', 'no-border', 'no-shadow', 'no-margin'] },
        }
}
