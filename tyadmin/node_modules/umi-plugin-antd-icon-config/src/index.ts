import { IApi } from 'umi';
import * as allIcons from '@ant-design/icons';

export interface MenuDataItem {
  children?: MenuDataItem[];
  routes?: MenuDataItem[];
  hideChildrenInMenu?: boolean;
  hideInMenu?: boolean;
  icon?: string;
  locale?: string;
  name?: string;
  key?: string;
  path?: string;
  [key: string]: any;
}

function toHump(name: string) {
  return name.replace(/\-(\w)/g, function(all, letter) {
    return letter.toUpperCase();
  });
}

function formatter(data: MenuDataItem[]): MenuDataItem[] {
  if (!Array.isArray(data)) {
    return [];
  }
  let icons = [];
  (data || []).forEach((item = { path: '/' }) => {
    if (item.icon) {
      const { icon } = item;
      const v4IconName = toHump(icon.replace(icon[0], icon[0].toUpperCase()));
      if (allIcons[icon]) {
        icons.push(icon);
      }
      if (allIcons[`${v4IconName}Outlined`]) {
        icons.push(`${v4IconName}Outlined`);
      }
    }
    if (item.routes || item.children) {
      icons = icons.concat(formatter(item.routes || item.children));
    }
  });

  return Array.from(new Set(icons));
}

export default function(api: IApi) {
  api.onGenerateFiles(() => {
    const { userConfig } = api;
    const icons = formatter(userConfig.routes);
    let iconsString = icons.map(
      iconName => `import ${iconName} from '@ant-design/icons/${iconName}'`,
    );
    api.writeTmpFile({
      path: './plugin-antd-icon/icons.ts',
      content: `
${iconsString.join(';\n')}

export default {
  ${icons.join(',\n')}
}
    `,
    });
  });
  api.addRuntimePlugin(() => require.resolve('./app.js'));
}
