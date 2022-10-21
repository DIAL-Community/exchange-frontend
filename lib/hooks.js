import { useQuery } from '@apollo/client'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { OWNED_PRODUCTS_QUERY } from '../queries/product'

export const useUser = () => {
  const { data: session, status } = useSession()

  const user = session?.user
  const isAdminUser = session?.user?.canEdit
  const loadingUserSession = status === 'loading'

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
  const { data: session } = useSession()

  const ownedOrganization = session?.user?.own?.organization

  const isOrganizationOwner = ownedOrganization?.slug === organization?.slug

  const ownsAnyOrganization = !!ownedOrganization

  const ownsSomeOrganization = organizations.some(({ slug }) => slug === ownedOrganization?.slug)

  return { ownedOrganization, isOrganizationOwner, ownsAnyOrganization, ownsSomeOrganization }
}

export const useArcGisToken = () => {
  const [token, setToken] = useState(null)

  useEffect(() => {
    const fetchToken = async () => {
      const response = await fetch('/api/arcgis/')
      const data = await response.json()
      setToken(data?.token)
    }

    fetchToken()
  }, [])

  return { token }
}

export const createLink = (url) => {
  return url.includes('https://' || 'http://')
    ? url.split('https://' || 'http://')[1]
    : url
}
