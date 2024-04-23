export default async function tenantInformation(_, res) {
  const validTenants = process.env.VALID_TENANTS.split(', ')

  const dpiTenants = process.env.DPI_TENANTS.split(', ')
  const defaultTenants = process.env.DEFAULT_TENANTS.split(', ')

  res.status(200).json({ validTenants, dpiTenants, defaultTenants })
}
