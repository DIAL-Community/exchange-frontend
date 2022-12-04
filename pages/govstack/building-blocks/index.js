import Link from 'next/link'
import { useCallback } from 'react'
import { useIntl } from 'react-intl'
import { AiOutlineArrowRight } from 'react-icons/ai'
import { BUILDING_BLOCK_YAML_KEYS, DEFAULT_REPO_OWNER } from '../../../components/govstack/common'
import Header from '../../../components/govstack/Header'

const containerElementStyle = `
  border-3 cursor-pointer
  border-transparent hover:border-dial-yellow
  text-building-block hover:text-dial-yellow
`

const GovStackApi = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id) => formatMessage({ id }), [formatMessage])

  return (
    <>
      <Header />
      <div className='max-w-catalog mx-auto'>
        <div className='flex flex-col gap-1 mx-8 py-4'>
          <div className='mx-4 text-building-block font-semibold'>{format('govstack.api.repositories')}</div>
          {
            BUILDING_BLOCK_YAML_KEYS.map((buildingBlockName, index) => {
              return (
                <Link key={index} href={`building-blocks/${buildingBlockName.label}`}>
                  <a>
                    <div className={containerElementStyle}>
                      <div className='py-2 bg-white border border-dial-gray hover:border-transparent card-drop-shadow'>
                        <div className='py-4 px-4 flex text-base font-semibold'>
                          {`${DEFAULT_REPO_OWNER}/${buildingBlockName.label}`}
                          <AiOutlineArrowRight className='ml-auto my-auto' />
                        </div>
                      </div>
                    </div>
                  </a>
                </Link>
              )
            })
          }
        </div>
      </div>
    </>
  )
}

export default GovStackApi
