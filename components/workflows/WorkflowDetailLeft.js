import { useIntl } from 'react-intl'

const WorkflowDetailLeft = ({ workflow }) => {
  const { formatMessage } = useIntl()
  const format = (id) => formatMessage({ id })

  return (
    <>
      <div className='h-20'>
        <div className='w-full'>
          <button className='bg-dial-blue px-2 rounded text-white mr-5'>
            <img src='/icons/edit.svg' className='inline mr-2' alt='Edit' height='12px' width='12px' />
            {format('app.edit')}
          </button>
          <img src='/icons/comment.svg' className='inline mr-2' alt='Edit' height='15px' width='15px' />
          <div className='text-dial-blue inline'>{format('app.comment')}</div>
        </div>
        <div className='h4 font-bold py-4'>{format('workflow.label')}</div>
      </div>
      <div className='bg-white border-t-2 border-l-2 border-r-2 border-dial-gray mr-6 shadow-lg'>
        <div className='flex flex-col h-80 p-4'>
          <div className='text-2xl font-semibold absolute w-80'>
            {workflow.name}
          </div>
          <div className='m-auto align-middle w-40'>
            <img
              alt={`Logo for ${workflow.name}`}
              src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + workflow.imageFile}
            />
          </div>
        </div>
      </div>
    </>
  )
}

export default WorkflowDetailLeft
