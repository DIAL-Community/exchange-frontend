export default async function tenantInformation(_, res) {
  const dpiTenants = process.env.NEXT_PUBLIC_DPI_TENANTS.split(', ').filter(tenant => tenant)
  const defaultTenants = process.env.NEXT_PUBLIC_DEFAULT_TENANTS.split(', ').filter(tenant => tenant)

  return res.status(200).json({ dpiTenants, defaultTenants })
}
