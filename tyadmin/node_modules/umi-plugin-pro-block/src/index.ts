/** @format */

// ref:
// - https://umijs.org/plugin/develop.html
import { join } from 'path';
import { existsSync } from 'fs';
import { IApi } from 'umi';

const debug = require('debug')('umi-plugin-pro-block');

export interface ProBlockOption {
  moveMock?: boolean;
  moveService?: boolean;
  modifyRequest?: boolean;
  autoAddMenu?: boolean;
}

export default function(api: IApi, opts: ProBlockOption = {}) {
  const { paths, userConfig = {} } = api;
  api.describe({
    key: 'ProBlockOption',
    config: {
      default: {
        moveMock: true,
        moveService: true,
        modifyRequest: true,
        autoAddMenu: true,
      },
      schema(joi) {
        return joi.string();
      },
      onChange: api.ConfigChangeType.regenerateTmpFiles,
    },
  });

  debug('options', opts);

  api.register({
    key: 'beforeBlockWriting',
    fn({ sourcePath, blockPath }) {
      const utilsPath = join(paths.absSrcPath, `utils`);
      hasUtil =
        existsSync(join(utilsPath, 'request.js')) || existsSync(join(utilsPath, 'request.ts'));
      hasService = existsSync(join(sourcePath, './src/service.js'));
      newFileName = blockPath.replace(/^\//, '').replace(/\//g, '');
      debug(
        'beforeBlockWriting... hasUtil:',
        hasUtil,
        'hasService:',
        hasService,
        'newFileName:',
        newFileName
      );
    },
  });
  let hasUtil, hasService, newFileName;

  api.register({
    key: '_modifyBlockTarget',
    fn(target, { sourceName }) {
      if (sourceName === '_mock.js' && opts.moveMock !== false) {
        // src/pages/test/t/_mock.js -> mock/test-t.js
        return join(paths.cwd, 'mock', `${newFileName}.js`);
      }
      if (sourceName === 'service.js' && hasService && opts.moveService !== false) {
        // src/pages/test/t/service.js -> services/test.t.js
        return join(
          paths.absSrcPath,
          userConfig.singular ? 'service' : 'services',
          `${newFileName}.js`
        );
      }
      return target;
    },
  });
  api.register({
    key: '_modifyBlockTarget',
    fn(content) {
      if (hasUtil && opts.modifyRequest !== false) {
        content = content.replace(
          /[\'\"]umi\-request[\'\"]/g,
          `'@/util${userConfig.singular ? '' : 's'}/request'`
        );
      }
      if (hasService && opts.moveService !== false) {
        content = content.replace(
          /[\'\"][\.\/]+service[\'\"]/g,
          `'@/service${userConfig.singular ? '' : 's'}/${newFileName}'`
        );
      }
      return content;
    },
  });

  api.register({
    key: '_modifyBlockNewRouteConfig',
    fn(memo) {
      if (opts.autoAddMenu === false) {
        return memo;
      }
      const icon = memo.path.indexOf('/') === 0 ? 'smile' : undefined;
      memo = {
        name: memo.name || memo.path.split('/').pop(),
        icon,
        ...memo,
      };
      return memo;
    },
  });
}
