import { configure, setAddon, addDecorator } from '@storybook/react';
import infoAddon from '@storybook/addon-info';
import { setOptions } from '@storybook/addon-options';
import { GlobalStorybookDecorator } from './global-decorator';

setAddon(infoAddon);
setOptions({
    name: `RS School`,
    goFullScreen: false,
    showStoriesPanel: true,
    showAddonPanel: true,
    showSearchBox: false,
    addonPanelInRight: true,
    sortStoriesByKind: false,
});

addDecorator(GlobalStorybookDecorator);

const containers = require.context('../src/app/containers', true, /\.stories\.tsx?$/);
const components = require.context('../src/app/components', true, /\.stories\.tsx?$/);

function loadStories() {
    containers.keys().forEach(containers);
    components.keys().forEach(components);
}

configure(loadStories, module);
