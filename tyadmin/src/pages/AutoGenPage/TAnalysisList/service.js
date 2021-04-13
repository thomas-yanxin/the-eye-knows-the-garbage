import request from 'umi-request';

import { buildFileFormData } from '@/utils/utils'
export async function queryTAnalysis(params) {
  return request('/api/xadmin/v1/t_analysis', {
    params,
  });
}
export async function removeTAnalysis(params) {
  return request(`/api/xadmin/v1/t_analysis/${params}`, {
    method: 'DELETE',
  });
}
export async function addTAnalysis(params) {
  let fileFieldList = ["picture_trush"]
  let fileData = buildFileFormData(params, fileFieldList);
  return request('/api/xadmin/v1/t_analysis', {
    method: 'POST',
    data: fileData,
  });
}
export async function updateTAnalysis(params, id) {
  let fileFieldList = ["picture_trush"]
  let fileData = buildFileFormData(params, fileFieldList);
  return request(`/api/xadmin/v1/t_analysis/${id}`, {
    method: 'PUT',
    data: fileData,
  });
}
export async function queryTAnalysisVerboseName(params) {
  return request('/api/xadmin/v1/t_analysis/verbose_name', {
    params,
  });
}
export async function queryTAnalysisListDisplay(params) {
  return request('/api/xadmin/v1/t_analysis/list_display', {
    params,
  });
}
export async function queryTAnalysisDisplayOrder(params) {
  return request('/api/xadmin/v1/t_analysis/display_order', {
    params,
  });
}

export async function updateUserPassword(params) {
    return request('/api/xadmin/v1/list_change_password', {
     method: 'POST',
     data: { ...params},
});
}

