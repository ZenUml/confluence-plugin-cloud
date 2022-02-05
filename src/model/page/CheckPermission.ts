interface PermissionCheckResponse {
  body: string;
}
interface PermissionCheckRequestFunc {
  (req: object): Promise<PermissionCheckResponse>;
}

export default async function CheckPermission(pageId: string, userId: string, requestFn: PermissionCheckRequestFunc): Promise<boolean> {
  const resp = await requestFn({
    type: 'POST',
    url: `/rest/api/content/${pageId}/permission/check`,
    contentType: 'application/json',
    data: JSON.stringify({subject: {type: 'user', identifier: userId}, operation: 'update'})
  })
  return JSON.parse(resp.body).hasPermission;
}
