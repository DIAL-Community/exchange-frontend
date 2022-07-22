/* global fetch:false */
/* global Response:false */
/* global ReadableStream:false */

import { saveAs } from 'file-saver'
import { useSession } from 'next-auth/client'
import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'
import { useContext, useEffect, useState } from 'react'
import { FaSearch } from 'react-icons/fa'
import { FilterContext } from '../context/FilterContext'
import { ProductFilterContext } from '../context/ProductFilterContext'
import { DatasetFilterContext } from '../context/DatasetFilterContext'
import { OrganizationFilterContext } from '../context/OrganizationFilterContext'
import { BuildingBlockFilterContext } from '../context/BuildingBlockFilterContext'
import { ProjectFilterContext } from '../context/ProjectFilterContext'
import { SDGFilterContext } from '../context/SDGFilterContext'
import { UseCaseFilterContext } from '../context/UseCaseFilterContext'
import { WorkflowFilterContext } from '../context/WorkflowFilterContext'
import { useOrganizationOwnerUser, useProductOwnerUser, useUser } from '../../lib/hooks'
import { SearchInput } from './SearchInput'

const SearchFilter = (props) => {
  const { search, setSearch, hint } = props
  const { resultCounts, displayType, setDisplayType } = useContext(FilterContext)

  const router = useRouter()
  const { locale } = useRouter()
  const [session] = useSession()

  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id: id }, values)

  const [searchTerm, setSearchTerm] = useState(search)

  const { isAdminUser } = useUser(session)
  const { isOrganizationOwner } = useOrganizationOwnerUser(session)
  const { isProductOwner } = useProductOwnerUser()
  
  const canEdit = isAdminUser || isOrganizationOwner || isProductOwner 

  const linkPath = router.asPath.split('/')
  linkPath.shift()
  if (!linkPath[0]) {
    linkPath[0] = 'products'
  }

  useEffect(() => {
    const timeOutId = setTimeout(() => setSearch(searchTerm), 500)

    return () => clearTimeout(timeOutId)
  }, [searchTerm, setSearch])

  const handleChange = (e) => setSearchTerm(e.target.value)

  const toggleDisplayType = (e) => {
    e.preventDefault()
    setDisplayType(displayType === 'list' ? 'card' : 'list')
  }

  const generateCreateLink = () => {
    if (!session.user) {
      return '/create-not-available'
    }

    if (!session.user.canEdit && linkPath.includes('candidate')) {
      return `/candidate/${linkPath[1]}/create`
    }

    const withCandidatePaths = ['products', 'organizations']
    if (!session.user.canEdit && withCandidatePaths.some(el => linkPath.includes(el))) {
      return `/candidate/${linkPath[0]}/create`
    }

    if (canEdit && linkPath.includes('projects')) {
      return 'projects/create'
    }

    const reactEditPaths = ['playbooks', 'plays', 'organizations', 'products', 'datasets', 'use_cases', 'building_blocks']
    if (reactEditPaths.some(el => linkPath.includes(el))) {
      // These create functions are in React, not Rails
      return `/${linkPath[0]}/create`
    }

    const { userEmail, userToken } = session.user

    return `${process.env.NEXT_PUBLIC_RAILS_SERVER}/${linkPath[0]}/` +
      `new?user_email=${userEmail}&user_token=${userToken}&locale=${locale}`
  }

  const productFilters = useContext(ProductFilterContext)
  const datasetFilters = useContext(DatasetFilterContext)
  const organizationFilters = useContext(OrganizationFilterContext)
  const buildingBlockFilters = useContext(BuildingBlockFilterContext)
  const workflowFilters = useContext(WorkflowFilterContext)
  const useCaseFilters = useContext(UseCaseFilterContext)
  const projectFilters = useContext(ProjectFilterContext)
  const sdgFilters = useContext(SDGFilterContext)

  /* Convert the object keys to snake case key because rails is using snake case. */
  const convertKeys = (object) => {
    Object.keys(object).forEach(key => {
      // Flatten the filter selection if it's Array.
      // Convert it to array of slug only.
      if (Array.isArray(object[key])) {
        object[key] = object[key].map(value => value.slug)
      }

      // Convert the key to snake case.
      const snakeCaseKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`)
      if (key !== snakeCaseKey) {
        Object.defineProperty(object, snakeCaseKey,
          Object.getOwnPropertyDescriptor(object, key))
        delete object[key]
      }
    })

    return object
  }

  const buildExportParameters = (path) => {
    let exportParameters = { pageSize: -1 }
    switch (String(path).toLowerCase()) {
    case 'products':
      exportParameters = { ...exportParameters, ...productFilters }
      break
    case 'datasets':
      exportParameters = { ...exportParameters, ...datasetFilters }
      break
    case 'organizations':
      exportParameters = { ...exportParameters, ...organizationFilters }
      break
    case 'building_blocks':
      exportParameters = { ...exportParameters, ...buildingBlockFilters }
      break
    case 'workflows':
      exportParameters = { ...exportParameters, ...workflowFilters }
      break
    case 'use_cases':
      exportParameters = { ...exportParameters, ...useCaseFilters }
      break
    case 'projects':
      exportParameters = { ...exportParameters, ...projectFilters }
      break
    case 'sdgs':
      exportParameters = { ...exportParameters, ...sdgFilters }
      break
    default:
      break
    }

    return convertKeys(exportParameters)
  }

  const asyncExport = (e, fileType) => {
    e.preventDefault()

    const { userEmail } = session.user
    const exportPath = process.env.NEXT_PUBLIC_AUTH_SERVER + `/api/v1/${linkPath[0]}.${fileType}`
    fetch(
      exportPath,
      {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          'Access-Control-Allow-Origin': process.env.NEXT_PUBLIC_AUTH_SERVER,
          'Access-Control-Allow-Credentials': true,
          'Access-Control-Allow-Headers': 'Set-Cookie',
          'X-User-Email': userEmail
        },
        body: JSON.stringify(buildExportParameters(linkPath[0]))
      }
    )
      .then(response => response.body)
      .then(body => {
        const reader = body.getReader()

        return new ReadableStream({
          start (controller) {
            return pump()
            async function pump () {
              const { done, value } = await reader.read()
              // When no more data needs to be consumed, close the stream
              if (done) {
                controller.close()

                return
              }

              // Enqueue the next data chunk into our target stream
              controller.enqueue(value)

              return pump()
            }
          }
        })
      })
      .then(stream => new Response(stream))
      .then(response => response.blob())
      .then(blob => {
        saveAs(blob, `${linkPath[0]}-data.${fileType}`)
      })
  }

  const exportAsJson = async (e) => {
    asyncExport(e, 'json')
  }

  const exportAsCsv = async (e) => {
    asyncExport(e, 'csv')
  }

  return (
    <div className='bg-dial-gray-light md:bg-transparent w-full pt-1 md:pt-2'>
      <div className='flex flex-wrap gap-x-4 px-3'>
        <div className='flex flex-wrap gap-x-4 gap-y-4 lg:gap-x-8 xl:gap-20'>
          <div className='hidden md:block ml-auto text-xl font-semibold my-auto animated-drawer'>
            {format(hint)}
            <span data-testid='list-counter' className='ml-2 px-2 py-1.5 text-base rounded text-dial-gray-dark bg-dial-yellow'>
              {resultCounts[hint]}
            </span>
          </div>
          <div className='ml-auto flex gap-x-3'>
            <label className='my-auto'>
              <span className='sr-only'>{format('search.input.label')}</span>
              <SearchInput
                value={searchTerm} onChange={handleChange}
                className={`
                  form-input py-2 px-3 text-sm rounded-md w-96 2xl:w-[32rem]
                  placeholder-dial-gray-dark placeholder-opacity-40 border border-dial-gray-dark focus:border-dial-yellow
                `}
                placeholder={`${format('app.search')} ${format(hint).toString().toLowerCase()}`}
              />
            </label>
            <button
              className={`
                hidden form-input px-4 bg-dial-gray-dark rounded-md border border-dial-gray-dark focus:border-dial-yellow
                hover:border-dial-yellow
              `}
            >
              <FaSearch className='text-dial-gray-light' />
            </button>
          </div>
        </div>
        <div className='ml-auto my-auto'>
          <div className='flex flex-col md:flex-row'>
            <div className='text-xs my-auto font-semibold text-dial-gray-dark opacity-50'>
              {format('view.switch.title')}
            </div>
            <div className='my-auto pt-2 pb-3 px-2 flex flex-row'>
              {
                displayType === 'card' &&
                  <>
                    <img
                      alt={format('image.alt.logoFor', { name: format('view.active.card') })}
                      className='mr-2 h-6' src='/icons/card-active/card-active.png'
                    />
                    <a href='toggle-display' onClick={toggleDisplayType}>
                      <img
                        alt={format('image.alt.logoFor', { name: format('view.inactive.list') })}
                        className='h-6 cursor-pointer' src='/icons/list-inactive/list-inactive.png'
                      />
                    </a>
                  </>
              }
              {
                displayType === 'list' &&
                  <>
                    <a className='mr-2' href='toggle-display' onClick={toggleDisplayType}>
                      <img
                        alt={format('image.alt.logoFor', { name: format('view.inactive.card') })}
                        className='h-6 cursor-pointer' src='/icons/card-inactive/card-inactive.png'
                      />
                    </a>
                    <img
                      alt={format('image.alt.logoFor', { name: format('view.active.list') })}
                      className='h-6' src='/icons/list-active/list-active.png'
                    />
                  </>
              }
            </div>
          </div>
        </div>
      </div>
      <div>
        {
          session && session.user && (
            <div className='text-xs mt-2'>
              <div className='flex justify-end px-3'>
                <>
                  <a className='border-b-2 border-transparent hover:border-dial-yellow'
                    data-testid='create-new' href={generateCreateLink()}>

                    <span className='text-dial-yellow'>{format('app.create-new')}</span>
                  </a>
                  <div className='border-r mx-2 border-gray-400' />
                  <a
                    className='border-b-2 border-transparent hover:border-dial-yellow'
                    href='/export-as-json' onClick={(e) => exportAsJson(e)}
                  >
                    <span className='text-dial-yellow'>{format('app.exportAsJson')}</span>
                  </a>
                  <div className='border-r mx-2 border-gray-400' />
                  <a
                    className='border-b-2 border-transparent hover:border-dial-yellow'
                    href='/export-as-csv' onClick={(e) => exportAsCsv(e)}
                  >
                    <span className='text-dial-yellow'>{format('app.exportAsCSV')}</span>
                  </a>
                </>
              </div>
            </div>
          )
        }
      </div>
    </div>
  )
}

export default SearchFilter
