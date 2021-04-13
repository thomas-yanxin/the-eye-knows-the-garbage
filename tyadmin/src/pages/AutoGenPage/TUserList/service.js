import request from 'umi-request';

import { buildFileFormData } from '@/utils/utils'
export async function queryTUser(params) {
  return request('/api/xadmin/v1/t_user', {
    params,
  });
}
export async function removeTUser(params) {
  return request(`/api/xadmin/v1/t_user/${params}`, {
    method: 'DELETE',
  });
}
export async function addTUser(params) {
  let fileFieldList = ["face"]
  let fileData = buildFileFormData(params, fileFieldList);
  return request('/api/xadmin/v1/t_user', {
    method: 'POST',
    data: fileData,
  });
}
export async function updateTUser(params, id) {
  let fileFieldList = ["face"]
  let fileData = buildFileFormData(params, fileFieldList);
  return request(`/api/xadmin/v1/t_user/${id}`, {
    method: 'PUT',
    data: fileData,
  });
}
export async function queryTUserVerboseName(params) {
  return request('/api/xadmin/v1/t_user/verbose_name', {
    params,
  });
}
export async function queryTUserListDisplay(params) {
  return request('/api/xadmin/v1/t_user/list_display', {
    params,
  });
}
export async function queryTUserDisplayOrder(params) {
  return request('/api/xadmin/v1/t_user/display_order', {
    params,
  });
}

export async function updateUserPassword(params) {
    return request('/api/xadmin/v1/list_change_password', {
     method: 'POST',
     data: { ...params},
});
}

