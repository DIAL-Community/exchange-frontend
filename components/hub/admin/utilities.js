export const allowedToView = (user) => user.isAdminUser || user.isAdliAdminUser

export const allowedToBrowseAdliPages = (user) => {
  const requiredRoles = ['admin', 'adli_admin', 'adli_user']
  const intersectingRoles = requiredRoles.filter(role => user.roles.includes(role))
  console.log('Roles: ', user.roles, 'intersection: ', intersectingRoles)

  return intersectingRoles.length > 0
}
