const path = require('path');
const { spawnSync } = require('child_process');

const getProjectPath = require('../GetProjectPath/GetProjectPath');
const getCliArgs = require('../GetCliArgs/GetCliArgs');

const {
    addRebuilderSceneToProjectAddonFolder,
    removeRebuilderSceneFromProjectAddonFolder,
} = require('./helpers/ImportRebuilderHelpers/ImportRebuilderHelpers');

function runGodotImport(exePath) {
    addRebuilderSceneToProjectAddonFolder();

    console.log("Running Godot import...");
    const start = Date.now();
    const { importTime } = getCliArgs();
    const importProcResults = spawnSync(
        exePath,
        [
            '--headless',
            '--editor',
            path.join(
                'addons',
                'gut',
                '.cli_support',
                '__rebuilder_scene.tscn',
            ),
        ],
        {
            cwd: getProjectPath(),
            timeout: importTime * 1000,
            stdio: 'inherit'
        }
    );

    const tookMs = Date.now() - start;
    console.log(`Import took ${tookMs / 1000}s; limit was ${importTime}.`);

    removeRebuilderSceneFromProjectAddonFolder();
};

module.exports = runGodotImport;
