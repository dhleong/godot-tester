const fs = require('fs');
const getProjectPath = require('../../../GetProjectPath/GetProjectPath');
const isGodotFour = require('../../../IsGodotFour/IsGodotFour');
const path = require('path');

function getFolderPath() {
    return path.join(
        getProjectPath(),
        'addons',
        'gut',
        '.cli_support',
    );
}

function getFilePaths() {
    const folderPath = getFolderPath();
    const items = [
        {as: '__rebuilder_scene.tscn'},

        {
            file: isGodotFour() ? '__rebuilder.godot4.gd' : undefined,
            as: '__rebuilder.gd'
        },
    ];

    return items.map(({file, as}) => {
        const oldItemPath = path.join(
            process.env.THIS_ACTION_DIR,
            'assets',
            file ?? as,
        );
        const newItemPath = path.join(
            folderPath,
            as,
        );

        return {oldItemPath, newItemPath};
    });
}

function addRebuilderSceneToProjectAddonFolder() {
    if(!process.env.THIS_ACTION_DIR) {
        throw new Error('THIS_ACTION_DIR environment variable not set');
    };

    // create the folder if it doesn't exist
    const folderPath = getFolderPath();
    if(!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath);
    };

    getFilePaths().forEach(({oldItemPath, newItemPath}) => {
        fs.copyFileSync(oldItemPath, newItemPath);
    });
};

function removeRebuilderSceneFromProjectAddonFolder() {
    if(!process.env.THIS_ACTION_DIR) {
        throw new Error('THIS_ACTION_DIR environment variable not set');
    };

    getFilePaths().forEach(({newItemPath}) => {
        fs.unlinkSync(newItemPath);
    });
};

module.exports = {
    addRebuilderSceneToProjectAddonFolder,
    removeRebuilderSceneFromProjectAddonFolder,
};
