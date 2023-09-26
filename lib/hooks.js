import { useQuery } from '@apollo/client'
import { validate } from 'email-validator'
import { useSession } from 'next-auth/react'
import { useCallback, useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import { USER_EMAIL_CHECK } from '../components/shared/query/user'
import { OWNED_PRODUCTS_QUERY } from '../components/shared/query/product'
import { OWNED_DATASETS_QUERY } from '../components/shared/query/dataset'

export const useUser = () => {
  const { data, status } = useSession()

  const user = data?.user
  const isAdminUser = data?.user?.isAdminUser
  const isEditorUser = data?.user?.isEditorUser
  const loadingUserSession = status === 'loading'

  return { loadingUserSession, user, isAdminUser, isEditorUser }
}

export const useProductOwnerUser = (product = null, products = [], skipQuery) => {
  const { data: ownedProductsData, loading: loadingOwnedProducts } = useQuery(OWNED_PRODUCTS_QUERY, {
    skip: skipQuery
  })

  const ownedProducts = ownedProductsData?.ownedProducts ?? []

  const ownedProductSlugs = ownedProducts.map(({ slug }) => slug)

  const isProductOwner = ownedProductSlugs.includes(product?.slug)

  const ownsAnyProduct = !!ownedProducts.length

  const ownsSomeProduct = products.some(({ slug }) => ownedProductSlugs.includes(slug))

  return { isProductOwner, ownedProducts, loadingOwnedProducts, ownsAnyProduct, ownsSomeProduct }
}

export const useDatasetOwnerUser = (dataset = null, skipQuery) => {
  const { data: ownedDatasetsData, loading: loadingOwnedDatasets } = useQuery(OWNED_DATASETS_QUERY, {
    skip: skipQuery
  })

  const ownedDatasets = ownedDatasetsData?.ownedDatasets ?? []

  const ownedDatasetsSlugs = ownedDatasets.map(({ slug }) => slug)

  const isDatasetOwner = ownedDatasetsSlugs.includes(dataset?.slug)

  return { isDatasetOwner, ownedDatasets, loadingOwnedDatasets }
}

export const useOrganizationOwnerUser = (organization = null, organizations = []) => {
  const { data } = useSession()

  const ownedOrganization = data?.user?.own?.organization

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

export const useEmailValidation = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { refetch } = useQuery(USER_EMAIL_CHECK, { skip: true })

  const isUniqueUserEmail = async (value, user) => {
    const isEmailValid = validate(value)

    return await refetch({ email: value }).then((userEmailCheck) => {
      if (user?.email === value) {
        return true
      } else if (isEmailValid && userEmailCheck.data.userEmailCheck) {
        return format('validation.unique-email')
      } else if (!isEmailValid) {
        return format('validation.email')
      }

      return true
    })
  }

  return { isUniqueUserEmail }
}
