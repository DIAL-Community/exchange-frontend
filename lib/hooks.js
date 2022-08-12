import { useQuery } from '@apollo/client'
import { useEffect, useState } from 'react'
import { OWNED_PRODUCTS_QUERY } from '../queries/product'

export const useUser = (session) => {
  const loadingUserSession = session === undefined

  const isAdminUser = session?.user?.canEdit

  return { loadingUserSession, isAdminUser }
}

export const useProductOwnerUser = (product = null, products = [], skipQuery) => {
  const { data: ownedProductsData, loading: loadingOwnedProducts } = useQuery(OWNED_PRODUCTS_QUERY, {
    skip: skipQuery
  })

  const ownedProducts = ownedProductsData?.ownedProducts ?? []

  const ownedProductsSlugs = ownedProducts.map(({ slug }) => slug)

  const isProductOwner = !!ownedProducts.length

  const ownsProduct = ownedProductsSlugs.includes(product?.slug)

  const ownsSomeProduct = products.some(({ slug }) => ownedProductsSlugs.includes(slug))

  return { isProductOwner, ownedProducts, loadingOwnedProducts, ownsProduct, ownsSomeProduct }
}

export const useOrganizationOwnerUser = (session, organization = null, organizations = []) => {
  const ownedOrganization = session?.user?.own?.organization

  const isOrganizationOwner = !!ownedOrganization

  const ownsOrganization = ownedOrganization?.slug === organization?.slug

  const ownsSomeOrganization = organizations.some(({ slug }) => slug === ownedOrganization?.slug)

  return { ownedOrganization, isOrganizationOwner, ownsOrganization, ownsSomeOrganization }
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
