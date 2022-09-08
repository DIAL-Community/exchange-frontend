import { useQuery } from '@apollo/client'
import { useSession } from 'next-auth/client'
import { useEffect, useState } from 'react'
import { OWNED_PRODUCTS_QUERY } from '../queries/product'

export const useUser = () => {
  const [session, loadingUserSession] = useSession()

  const user = session?.user

  const isAdminUser = session?.user?.canEdit

  return { loadingUserSession, user, isAdminUser }
}

export const useProductOwnerUser = (product = null, products = [], skipQuery) => {
  const { data: ownedProductsData, loading: loadingOwnedProducts } = useQuery(OWNED_PRODUCTS_QUERY, {
    skip: skipQuery
  })

  const ownedProducts = ownedProductsData?.ownedProducts ?? []

  const ownedProductsSlugs = ownedProducts.map(({ slug }) => slug)

  const isProductOwner = ownedProductsSlugs.includes(product?.slug)

  const ownsAnyProduct = !!ownedProducts.length

  const ownsSomeProduct = products.some(({ slug }) => ownedProductsSlugs.includes(slug))

  return { isProductOwner, ownedProducts, loadingOwnedProducts, ownsAnyProduct, ownsSomeProduct }
}

export const useOrganizationOwnerUser = (organization = null, organizations = []) => {
  const [session] = useSession()

  const ownedOrganization = session?.user?.own?.organization

  const isOrganizationOwner = ownedOrganization?.slug === organization?.slug

  const ownsAnyOrganization = !!ownedOrganization

  const ownsSomeOrganization = organizations.some(({ slug }) => slug === ownedOrganization?.slug)

  return { ownedOrganization, isOrganizationOwner, ownsAnyOrganization, ownsSomeOrganization }
}

export const useArcGisToken = () => {
  const [token, setToken] = useState(null)

  useEffect(() => (
    fetch('/api/arcgis/')
      .then(response => response.json())
      .then(data => setToken(data?.token))
  ), [])

  return { token }
}
