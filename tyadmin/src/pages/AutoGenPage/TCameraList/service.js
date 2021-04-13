import request from 'umi-request';

import { buildFileFormData } from '@/utils/utils'
export async function queryTCamera(params) {
  return request('/api/xadmin/v1/t_camera', {
    params,
  });
}
export async function removeTCamera(params) {
  return request(`/api/xadmin/v1/t_camera/${params}`, {
    method: 'DELETE',
  });
}
export async function addTCamera(params) {
  let fileFieldList = ["face","picture_face","picture_trush"]
  let fileData = buildFileFormData(params, fileFieldList);
  return request('/api/xadmin/v1/t_camera', {
    method: 'POST',
    data: fileData,
  });
}
export async function updateTCamera(params, id) {
  let fileFieldList = ["face","picture_face","picture_trush"]
  let fileData = buildFileFormData(params, fileFieldList);
  return request(`/api/xadmin/v1/t_camera/${id}`, {
    method: 'PUT',
    data: fileData,
  });
}
export async function queryTCameraVerboseName(params) {
  return request('/api/xadmin/v1/t_camera/verbose_name', {
    params,
  });
}
export async function queryTCameraListDisplay(params) {
  return request('/api/xadmin/v1/t_camera/list_display', {
    params,
  });
}
export async function queryTCameraDisplayOrder(params) {
  return request('/api/xadmin/v1/t_camera/display_order', {
    params,
  });
}

export async function updateUserPassword(params) {
    return request('/api/xadmin/v1/list_change_password', {
     method: 'POST',
     data: { ...params},
});
}

