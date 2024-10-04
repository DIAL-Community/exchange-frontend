export const allowedToView = (user) => user.isAdminUser || user.isAdliAdminUser

export const allowedToBrowseAdliPages = (user) => {
  const requiredRoles = ['admin', 'adli_admin', 'adli_user']
  const intersectingRoles = requiredRoles.filter(role => user.roles.includes(role))

  return intersectingRoles.length > 0
}
