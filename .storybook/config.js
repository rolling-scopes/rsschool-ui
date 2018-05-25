import { configure, setAddon, addDecorator } from '@storybook/react';
import infoAddon from '@storybook/addon-info';
import { setOptions } from '@storybook/addon-options';

setAddon(infoAddon);
setOptions({
    name: `RS School Storybook`,
    goFullScreen: false,
    showStoriesPanel: true,
    showAddonPanel: true,
    showSearchBox: false,
    addonPanelInRight: true,
    sortStoriesByKind: false,
});

const components = require.context('../src/app/components', true, /\.stories\.tsx?$/);
const containers = require.context('../src/app/containers', true, /\.stories\.tsx?$/);

function loadStories() {
    components.keys().forEach(components);
    containers.keys().forEach(containers);
}

configure(loadStories, module);
