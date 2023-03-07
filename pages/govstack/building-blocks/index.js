import Header from '../../../components/govstack/Header'
import { MetadataContextProvider } from '../../../components/govstack/MetadataContext'
import MetadataViewer from '../../../components/govstack/MetadataViewer'

const GovStackApi = () => {

  return (
    <>
      <Header />
      <div className='max-w-catalog mx-auto'>
        <MetadataContextProvider>
          <MetadataViewer />
        </MetadataContextProvider>
      </div>
    </>
  )
}

export default GovStackApi
