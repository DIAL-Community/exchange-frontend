import { useRouter } from 'next/router'
import { useState, useEffect, useContext } from 'react'
import { useSession } from 'next-auth/client'
import { useIntl } from 'react-intl'
import { FilterContext } from '../context/FilterContext'

import { saveAs } from 'file-saver'
import { ProductFilterContext } from '../context/ProductFilterContext'
import { OrganizationFilterContext } from '../context/OrganizationFilterContext'
import { BuildingBlockFilterContext } from '../context/BuildingBlockFilterContext'
import { WorkflowFilterContext } from '../context/WorkflowFilterContext'
import { UseCaseFilterContext } from '../context/UseCaseFilterContext'
import { ProjectFilterContext } from '../context/ProjectFilterContext'
import { SDGFilterContext } from '../context/SDGFilterContext'

const SearchFilter = (props) => {
  const { search, setSearch, placeholder } = props
  const { displayType, setDisplayType } = useContext(FilterContext)

  const router = useRouter()
  const { locale } = useRouter()
  const [session] = useSession()

  const { formatMessage } = useIntl()
  const format = (id) => formatMessage({ id })

  const [searchTerm, setSearchTerm] = useState(search)
  const [loading, setLoading] = useState(false)

  const linkPath = router.asPath.split('/')
  linkPath.shift()
  if (!linkPath[0]) {
    linkPath[0] = 'products'
  }

  useEffect(() => {
    const timeOutId = setTimeout(() => setSearch(searchTerm), 500)
    return () => clearTimeout(timeOutId)
  }, [searchTerm])

  const handleChange = (e) => setSearchTerm(e.target.value)

  const toggleDisplayType = (e) => {
    e.preventDefault()
    setDisplayType(displayType === 'list' ? 'card' : 'list')
  }

  const generateCreateLink = () => {
    if (!session.user) {
      return '/create-not-available'
    }

    const { userEmail, userToken } = session.user
    return `${process.env.NEXT_PUBLIC_RAILS_SERVER}/${linkPath[0]}/` +
      `new?user_email=${userEmail}&user_token=${userToken}&locale=${locale}`
  }

  const productFilters = useContext(ProductFilterContext)
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
          Object.getOwnPropertyDescriptor(object, key));
        delete object[key];
      }
    })
    return object
  }

  const buildExportParameters = (path) => {
    let exportParameters = { pageSize: -1 }
    switch (String(path).toLowerCase()) {
      case 'products':
        exportParameters = { ...exportParameters, ...productFilters }
        break;
      case 'organizations':
        exportParameters = { ...exportParameters, ...organizationFilters }
        break;
      case 'building_blocks':
        exportParameters = { ...exportParameters, ...buildingBlockFilters }
        break;
      case 'workflows':
        exportParameters = { ...exportParameters, ...workflowFilters }
        break;
      case 'use_cases':
        exportParameters = { ...exportParameters, ...useCaseFilters }
        break;
      case 'projects':
        exportParameters = { ...exportParameters, ...projectFilters }
        break;
      case 'sdgs':
        exportParameters = { ...exportParameters, ...sdgFilters }
        break;
      default:
        break;
    }
    return convertKeys(exportParameters)
  }

  const asyncExport = (e, acceptType, contentType) => {
    e.preventDefault()
    setLoading(true)

    const { userEmail } = session.user
    const fileExtension = acceptType === 'application/json' ? 'json': 'csv'
    const exportPath = process.env.NEXT_PUBLIC_AUTH_SERVER + `/api/v1/${linkPath[0]}`
    fetch(
      exportPath,
      {
        method: 'POST',
        mode: 'cors',
        headers: {
          Accept: acceptType,
          'Content-Type': contentType,
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
      const reader = body.getReader();
      return new ReadableStream({
        start(controller) {
          return pump();
          async function pump() {
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
      saveAs(blob, `${linkPath[0]}-data.${fileExtension}`)
      setLoading(false)
    })
  }

  const exportAsJson = async (e) => {
    const mimeType = 'application/json'
    asyncExport(e, mimeType, mimeType)
  }

  const exportAsCsv = async (e) => {
    const mimeType = 'text/csv; charset=utf-8'
    asyncExport(e, mimeType, mimeType)
  }

  return (
    <div className='relative px-2 grid grid-cols-12 gap-4 bg-transparent max-w-catalog mx-auto'>
      <div className='col-span-12'>
        <div className='flex flex-row flex-wrap mt-2 mr-2'>
          <label className='w-9/12 lg:w-4/12 my-auto'>
            <span className='sr-only'>{format('search.input.label')}</span>
            <input
              type='search'
              value={searchTerm} onChange={handleChange}
              className='form-input text-sm md:text-base py-4 md:py-3 px-4 w-full rounded-md border'
              placeholder={placeholder}
            />
          </label>
          <div className='w-3/12 lg:w-3/12'>
            <div className='flex flex-col md:flex-row'>
              <div className='my-auto px-2 md:px-0 md:pl-2 pt-2 md:pt-0 text-xs md:text-sm lg:text-base text-dial-gray-dark'>{format('view.switch.title')}</div>
              <div className='my-auto pt-2 pb-3 px-2 flex flex-row'>
                {
                  displayType === 'card' &&
                    <>
                      <img className='mr-2 h-6 md:h-8' src='/icons/card-active/card-active.png' />
                      <a href='toggle-display' onClick={toggleDisplayType}>
                        <img className='h-6 md:h-8 cursor-pointer' src='/icons/list-inactive/list-inactive.png' />
                      </a>
                    </>
                }
                {
                  displayType === 'list' &&
                    <>
                      <a className='mr-2' href='toggle-display' onClick={toggleDisplayType}>
                        <img className='h-6 md:h-8 cursor-pointer' src='/icons/card-inactive/card-inactive.png' />
                      </a>
                      <img className='h-6 md:h-8' src='/icons/list-active/list-active.png' />
                    </>
                }
              </div>
            </div>
          </div>
          <div className='w-full lg:w-5/12 mt-2 md:mt-4 text-xs md:text-base text-right'>
            <div className='flex justify-end'>
              {
                session && session.user && (
                  <>
                    <a className='border-b-2 border-transparent hover:border-dial-yellow' href={generateCreateLink()}>
                      <span className='text-dial-yellow'>{format('app.create-new')}</span>
                    </a>
                    <div className='border-r mx-2 border-gray-400' />
                  </>
                )
              }
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
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}

export default SearchFilter
