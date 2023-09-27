import DatasetDetailHeader from './fragments/DatasetDetailHeader'

const DatasetEditLeft = ({ dataset }) => {
  return (
    <div className='bg-dial-slate-100 lg:h-full'>
      <div className='flex flex-col gap-y-3 px-4 lg:px-6 lg:py-3'>
        <DatasetDetailHeader dataset={dataset}/>
        <hr className='border-b border-dial-slate-200'/>
      </div>
    </div>
  )
}

export default DatasetEditLeft
