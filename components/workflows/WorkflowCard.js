import Link from 'next/link'
import ReactHtmlParser from 'react-html-parser'

const WorkflowCard = ({ workflow, listType }) => {
  return (
    <Link href={`/workflows/${workflow.id}`}>
      {
        listType === 'list'
          ? (
            <div className='bg-white border-2 border-dial-gray p-2 m-2 shadow-lg flex justify-between items-center'>
              <div className='inline-block w-2/3 text-lg font-bold truncate '>
                {workflow.name}
              </div>
              <div className='inline-block w-1/4 right'>
                <img className='inline pr-4' src={`${process.env.NEXT_PUBLIC_GRAPHQL_SERVER + workflow.imageFile}`} alt={workflow.imageFile} width='30' height='30' />
              </div>
            </div>
            )
          : (
            <div className='bg-white border-2 border-dial-gray p-6 tracking-wide shadow-lg'>
              <div id='header' className='flex items-center mb-4'>
                <img alt='avatar' className='w-20 rounded-full border-2 border-gray-300' src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + workflow.imageFile} />
                <div id='header-text' className='leading-5 ml-6 sm'>
                  <h4 id='name' className='text-xl font-semibold'>{workflow.name}</h4>
                </div>
              </div>
              <div id='quote' className='italic text-gray-600'>
                {workflow.workflowDescriptions[0] && ReactHtmlParser(workflow.workflowDescriptions[0].description)}
              </div>
            </div>
            )
      }
    </Link>
  )
}

export default WorkflowCard
