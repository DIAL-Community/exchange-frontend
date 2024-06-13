import { useCallback, useEffect, useState } from 'react'
import { validate } from 'email-validator'
import { useSession } from 'next-auth/react'
import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/client'
import { OWNED_DATASETS_QUERY } from '../components/shared/query/dataset'
import { OWNED_PRODUCTS_QUERY } from '../components/shared/query/product'
import { USER_EMAIL_CHECK } from '../components/shared/query/user'

export const useUser = () => {
  const { data, status } = useSession()

  const user = data?.user
  const isAdminUser = data?.user?.isAdminUser
  const isEditorUser = data?.user?.isEditorUser
  const loadingUserSession = status === 'loading'

  return { loadingUserSession, user, isAdminUser, isEditorUser }
}

export const useProductOwnerUser = (product = null, skipQuery) => {
  const { data: ownedProductsData, loading: loadingOwnedProducts } = useQuery(OWNED_PRODUCTS_QUERY, {
    skip: skipQuery
  })

  const ownedProducts = ownedProductsData?.ownedProducts ?? []

  const ownedProductSlugs = ownedProducts.map(({ slug }) => slug)

  const isProductOwner = ownedProductSlugs.includes(product?.slug)

  const ownsAnyProduct = !!ownedProducts.length

  return { isProductOwner, ownedProducts, loadingOwnedProducts, ownsAnyProduct }
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

export const useOrganizationOwnerUser = (organization = null) => {
  const { data } = useSession()

  const ownedOrganization = data?.user?.own?.organization

  const isOrganizationOwner = (ownedOrganization && ownedOrganization?.slug === organization?.slug)

  const ownsAnyOrganization = !!ownedOrganization

  return { ownedOrganization, isOrganizationOwner, ownsAnyOrganization }
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

export const useActiveTenant = () => {
  const [waitingActiveTenant, setWaitingActiveTenant] = useState(false)
  const [hostname, setHostname] = useState()
  const [secured, setSecured] = useState()
  const [tenant, setTenant] = useState()

  useEffect(() => {
    const fetchActiveTenant = async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_GRAPHQL_SERVER}/tenant`)
      const data = await response.json()

      setHostname(data?.hostname)
      setSecured(data?.secured)
      setTenant(data?.tenant)
      setWaitingActiveTenant(false)
    }

    fetchActiveTenant()
  }, [])

  return { waitingActiveTenant, tenant, secured, hostname }
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
