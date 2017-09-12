module.exports = {
    uiPort: process.env.PORT || {{uiPort}},
    mqttReconnectTime: 15000,
    serialReconnectTime: 15000,
    debugMaxLength: 1000,
    flowFile: 'flows/flow_{{idUser}}.json',
    userDir: '{{{userDir}}}',
    httpRoot: '/red',
    ui: {path: "ui"},
    adminAuth: require("../user-authentication"),
    editorTheme: {
        page: {
            title: "Smart-*",
            favicon: "editor/favicon.ico",
        },
        header: {
            title: "Smart-*",
        },
        menu: {
            "menu-item-import-library": false,
            "menu-item-import":false,
            "menu-item-keyboard-shortcuts": false,
            "menu-item-search":false,
            "menu-item-edit-palette":false,
            "menu-item-show-tips":false,
            "menu-item-help":false,
            "menu-item-node-red-version":false,
        },
    },
    functionGlobalContext: {
    },
    logging: {
        console: {
            level: "info",
            metrics: false,
            audit: false
        }
    }
}