import { useRouter } from 'next/router'
import MapActiveFilter from './MapActiveFilter'
import MapFilter from './MapFilter'
import AggregatorMap from './aggregators/AggregatorMap'
import EndorserMap from './endorsers/EndorserMap'
import ProjectMap from './projects/ProjectMap'
import MapNav from './MapNav'

const MapContainer = () => {
  const router = useRouter()

  return (
    <div className='px-4 lg:px-8 xl:px-56'>
      <MapNav />
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-x-8'>
        <div className='col-span-3 xl:col-span-1'>
          <div className='bg-dial-slate-100 h-full'>
            <div className='flex flex-col gap-y-3 px-4 lg:px-6 lg:py-3'>
              <MapActiveFilter />
              <MapFilter />
            </div>
          </div>
        </div>
        <div className='col-span-3 xl:col-span-2'>
          { router.pathname.indexOf('projects') >= 0 && <ProjectMap /> }
          { router.pathname.indexOf('endorsers') >= 0 && <EndorserMap /> }
          { router.pathname.indexOf('aggregators') >= 0 && <AggregatorMap /> }
        </div>
      </div>
    </div>
  )
}

export default MapContainer
