// @ts-nocheck
import { ApplyPluginsType, dynamic } from '/home/thomas/python/tyadmin_api_cli/demos/tyadmin_demo_init/tyadmin/node_modules/@umijs/runtime';
import { plugin } from './plugin';

const routes = [
  {
    "path": "/xadmin/login",
    "component": dynamic({ loader: () => import(/* webpackChunkName: 'layouts__UserLayout' */'/home/thomas/python/tyadmin_api_cli/demos/tyadmin_demo_init/tyadmin/src/layouts/UserLayout'), loading: require('@/components/PageLoading/index').default}),
    "routes": [
      {
        "name": "login",
        "path": "/xadmin/login",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__TyAdminBuiltIn__UserLogin' */'/home/thomas/python/tyadmin_api_cli/demos/tyadmin_demo_init/tyadmin/src/pages/TyAdminBuiltIn/UserLogin'), loading: require('@/components/PageLoading/index').default}),
        "exact": true
      }
    ]
  },
  {
    "path": "/xadmin/",
    "component": dynamic({ loader: () => import(/* webpackChunkName: 'layouts__SecurityLayout' */'/home/thomas/python/tyadmin_api_cli/demos/tyadmin_demo_init/tyadmin/src/layouts/SecurityLayout'), loading: require('@/components/PageLoading/index').default}),
    "routes": [
      {
        "path": "/xadmin/",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'layouts__BasicLayout' */'/home/thomas/python/tyadmin_api_cli/demos/tyadmin_demo_init/tyadmin/src/layouts/BasicLayout'), loading: require('@/components/PageLoading/index').default}),
        "authority": [
          "admin",
          "user"
        ],
        "routes": [
          {
            "name": "Home",
            "path": "/xadmin/index",
            "icon": "dashboard",
            "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__TyAdminBuiltIn__DashBoard' */'/home/thomas/python/tyadmin_api_cli/demos/tyadmin_demo_init/tyadmin/src/pages/TyAdminBuiltIn/DashBoard'), loading: require('@/components/PageLoading/index').default}),
            "exact": true
          },
          {
            "path": "/xadmin/",
            "redirect": "/xadmin/index",
            "exact": true
          },
          {
            "name": "Authentication and Authorization",
            "icon": "BarsOutlined",
            "path": "/xadmin/auth",
            "routes": [
              {
                "name": "permission",
                "path": "/xadmin/auth/permission",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__AutoGenPage__PermissionList' */'/home/thomas/python/tyadmin_api_cli/demos/tyadmin_demo_init/tyadmin/src/pages/AutoGenPage/PermissionList'), loading: require('@/components/PageLoading/index').default}),
                "exact": true
              },
              {
                "name": "group",
                "path": "/xadmin/auth/group",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__AutoGenPage__GroupList' */'/home/thomas/python/tyadmin_api_cli/demos/tyadmin_demo_init/tyadmin/src/pages/AutoGenPage/GroupList'), loading: require('@/components/PageLoading/index').default}),
                "exact": true
              }
            ]
          },
          {
            "name": "Garbage",
            "icon": "BarsOutlined",
            "path": "/xadmin/garbage",
            "routes": [
              {
                "name": "用户概览",
                "path": "/xadmin/garbage/t_user",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__AutoGenPage__TUserList' */'/home/thomas/python/tyadmin_api_cli/demos/tyadmin_demo_init/tyadmin/src/pages/AutoGenPage/TUserList'), loading: require('@/components/PageLoading/index').default}),
                "exact": true
              },
              {
                "name": "识别结果",
                "path": "/xadmin/garbage/t_analysis",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__AutoGenPage__TAnalysisList' */'/home/thomas/python/tyadmin_api_cli/demos/tyadmin_demo_init/tyadmin/src/pages/AutoGenPage/TAnalysisList'), loading: require('@/components/PageLoading/index').default}),
                "exact": true
              },
              {
                "name": "投放记录",
                "path": "/xadmin/garbage/t_camera",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__AutoGenPage__TCameraList' */'/home/thomas/python/tyadmin_api_cli/demos/tyadmin_demo_init/tyadmin/src/pages/AutoGenPage/TCameraList'), loading: require('@/components/PageLoading/index').default}),
                "exact": true
              },
              {
                "name": "登入管理",
                "path": "/xadmin/garbage/user_profile",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__AutoGenPage__UserProfileList' */'/home/thomas/python/tyadmin_api_cli/demos/tyadmin_demo_init/tyadmin/src/pages/AutoGenPage/UserProfileList'), loading: require('@/components/PageLoading/index').default}),
                "exact": true
              }
            ]
          },
          {
            "name": "TyadminBuiltin",
            "icon": "VideoCamera",
            "path": "/xadmin/sys",
            "routes": [
              {
                "name": "TyAdminLog",
                "icon": "smile",
                "path": "/xadmin/sys/ty_admin_sys_log",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__TyAdminBuiltIn__TyAdminSysLogList' */'/home/thomas/python/tyadmin_api_cli/demos/tyadmin_demo_init/tyadmin/src/pages/TyAdminBuiltIn/TyAdminSysLogList'), loading: require('@/components/PageLoading/index').default}),
                "exact": true
              },
              {
                "name": "TyAdminVerify",
                "icon": "smile",
                "path": "/xadmin/sys/ty_admin_email_verify_record",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__TyAdminBuiltIn__TyAdminEmailVerifyRecordList' */'/home/thomas/python/tyadmin_api_cli/demos/tyadmin_demo_init/tyadmin/src/pages/TyAdminBuiltIn/TyAdminEmailVerifyRecordList'), loading: require('@/components/PageLoading/index').default}),
                "exact": true
              }
            ]
          },
          {
            "name": "passwordModify",
            "path": "/xadmin/account/change_password",
            "hideInMenu": true,
            "icon": "dashboard",
            "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__TyAdminBuiltIn__ChangePassword' */'/home/thomas/python/tyadmin_api_cli/demos/tyadmin_demo_init/tyadmin/src/pages/TyAdminBuiltIn/ChangePassword'), loading: require('@/components/PageLoading/index').default}),
            "exact": true
          },
          {
            "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__404' */'/home/thomas/python/tyadmin_api_cli/demos/tyadmin_demo_init/tyadmin/src/pages/404'), loading: require('@/components/PageLoading/index').default}),
            "exact": true
          }
        ]
      },
      {
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__404' */'/home/thomas/python/tyadmin_api_cli/demos/tyadmin_demo_init/tyadmin/src/pages/404'), loading: require('@/components/PageLoading/index').default}),
        "exact": true
      }
    ]
  },
  {
    "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__404' */'/home/thomas/python/tyadmin_api_cli/demos/tyadmin_demo_init/tyadmin/src/pages/404'), loading: require('@/components/PageLoading/index').default}),
    "exact": true
  }
];

// allow user to extend routes
plugin.applyPlugins({
  key: 'patchRoutes',
  type: ApplyPluginsType.event,
  args: { routes },
});

export { routes };
