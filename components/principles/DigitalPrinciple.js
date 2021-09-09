import Image from 'next/image'

const DigitalPrinciple = ({ principle }) => {
  return (
    <a href={`${principle.url}`} target='_blank' rel='noreferrer'>
      <div className='overflow-ellipsis overflow-hidden bg-white border-4 border-transparent shadow-lg hover:border-dial-yellow hover:text-dial-yellow p-4 m-4 max-w-sm max-h-52 h-52'>
        <div className='flex justify-center'>
          <Image src={`/images/principles/${principle.slug}.png`} alt={principle.slug} width='100' height='100' />
        </div>
        <div className='text-center pt-3 overflow-hidden overflow-ellipsis'>{principle.name}</div>
      </div>
    </a>
  )
}

export default DigitalPrinciple
