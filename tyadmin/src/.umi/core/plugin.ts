// @ts-nocheck
import { Plugin } from '/home/thomas/python/tyadmin_api_cli/demos/tyadmin_demo_init/tyadmin/node_modules/@umijs/runtime';

const plugin = new Plugin({
  validKeys: ['modifyClientRenderOpts','patchRoutes','rootContainer','render','onRouteChange','dva','getInitialState','locale','locale','request',],
});
plugin.register({
  apply: require('/home/thomas/python/tyadmin_api_cli/demos/tyadmin_demo_init/tyadmin/node_modules/umi-plugin-antd-icon-config/lib/app.js'),
  path: '/home/thomas/python/tyadmin_api_cli/demos/tyadmin_demo_init/tyadmin/node_modules/umi-plugin-antd-icon-config/lib/app.js',
});
plugin.register({
  apply: require('/home/thomas/python/tyadmin_api_cli/demos/tyadmin_demo_init/tyadmin/src/.umi/plugin-dva/runtime.tsx'),
  path: '/home/thomas/python/tyadmin_api_cli/demos/tyadmin_demo_init/tyadmin/src/.umi/plugin-dva/runtime.tsx',
});
plugin.register({
  apply: require('../plugin-initial-state/runtime'),
  path: '../plugin-initial-state/runtime',
});
plugin.register({
  apply: require('/home/thomas/python/tyadmin_api_cli/demos/tyadmin_demo_init/tyadmin/src/.umi/plugin-locale/runtime.tsx'),
  path: '/home/thomas/python/tyadmin_api_cli/demos/tyadmin_demo_init/tyadmin/src/.umi/plugin-locale/runtime.tsx',
});
plugin.register({
  apply: require('../plugin-model/runtime'),
  path: '../plugin-model/runtime',
});

export { plugin };
