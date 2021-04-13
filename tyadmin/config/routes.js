[
    {
        name: 'Home',
        path: '/xadmin/index',
        icon: 'dashboard',
        component: './TyAdminBuiltIn/DashBoard'
    },
    {
        path: '/xadmin/',
        redirect: '/xadmin/index',
    },
    {
        name: 'Authentication and Authorization',
        icon: 'BarsOutlined',
        path: '/xadmin/auth',
        routes:
        [
            {
                name: 'permission',
                path: '/xadmin/auth/permission',
                component: './AutoGenPage/PermissionList',
            },
            {
                name: 'group',
                path: '/xadmin/auth/group',
                component: './AutoGenPage/GroupList',
            }
        ]
    },
    {
        name: 'Garbage',
        icon: 'BarsOutlined',
        path: '/xadmin/garbage',
        routes:
        [
            {
                name: '用户概览',
                path: '/xadmin/garbage/t_user',
                component: './AutoGenPage/TUserList',
            },
            {
                name: '识别结果',
                path: '/xadmin/garbage/t_analysis',
                component: './AutoGenPage/TAnalysisList',
            },
            {
                name: '投放记录',
                path: '/xadmin/garbage/t_camera',
                component: './AutoGenPage/TCameraList',
            },
            {
                name: '登入管理',
                path: '/xadmin/garbage/user_profile',
                component: './AutoGenPage/UserProfileList',
            }
        ]
    },
    {
        name: 'TyadminBuiltin',
        icon: 'VideoCamera',
        path: '/xadmin/sys',
        routes:
        [
            {
                name: 'TyAdminLog',
                icon: 'smile',
                path: '/xadmin/sys/ty_admin_sys_log',
                component: './TyAdminBuiltIn/TyAdminSysLogList'
            },
            {
                name: 'TyAdminVerify',
                icon: 'smile',
                path: '/xadmin/sys/ty_admin_email_verify_record',
                component: './TyAdminBuiltIn/TyAdminEmailVerifyRecordList'
            }
        ]
    },
    {
        name: 'passwordModify',
        path: '/xadmin/account/change_password',
        hideInMenu: true,
        icon: 'dashboard',
        component: './TyAdminBuiltIn/ChangePassword',
    },
    {
        component: './404',
    },
]
