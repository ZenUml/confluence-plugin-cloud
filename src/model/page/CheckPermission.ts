interface PermissionCheckResponse {
  body: string;
}
export interface PermissionCheckRequestFunc {
  (req: object): Promise<PermissionCheckResponse>;
}

export default async function CheckPermission(pageId: string, userId: string, requestFn: PermissionCheckRequestFunc): Promise<boolean> {
  if(!pageId || !userId) {
    console.error('pageId or userId is not provided.', pageId, userId);
    return false;
  }
  try {
    const resp = await requestFn({
      type: 'POST',
      url: `/rest/api/content/${pageId}/permission/check`,
      contentType: 'application/json',
      data: JSON.stringify({subject: {type: 'user', identifier: userId}, operation: 'update'})
    })
    return JSON.parse(resp.body).hasPermission;
  } catch (err) {
    console.log('Current user may not have permission to check permission.')
    console.info(err);
    return false;
  }
}
