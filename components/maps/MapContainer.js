import { useRouter } from 'next/router'
import AggregatorMap from './aggregators/AggregatorMap'
import EndorserMap from './endorsers/EndorserMap'
import MapActiveFilter from './MapActiveFilter'
import MapFilter from './MapFilter'
import MapTabNav from './MapTabNav'
import ProjectMap from './projects/ProjectMap'

const MapContainer = () => {
  const router = useRouter()

  return (
    <div className='px-4 lg:px-8 xl:px-56 mt-3'>
      <MapTabNav />
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
        <div className='col-span-3 xl:col-span-1 bg-dial-slate-100'>
          <div className='flex flex-col gap-y-3 px-4 lg:px-6 py-3 min-h-[70vh]'>
            <MapActiveFilter />
            <MapFilter />
          </div>
        </div>
        <div className='col-span-3 md:col-span-2'>
          { router.pathname.indexOf('projects') >= 0 && <ProjectMap /> }
          { router.pathname.indexOf('endorsers') >= 0 && <EndorserMap /> }
          { router.pathname.indexOf('aggregators') >= 0 && <AggregatorMap /> }
        </div>
      </div>
    </div>
  )
}

export default MapContainer
