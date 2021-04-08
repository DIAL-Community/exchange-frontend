import Image from 'next/image'

const DigitalPrinciple = ({principle}) => {
  return(
  <a className='max-w-sm bg-white border-2 border-dial-gray p-4 m-4 shadow-lg' href={`${principle.url}`} target='_blank'>
    <div className='flex justify-center'>
      <Image src={`/images/principles/${principle.slug}.png`} alt={principle.slug} width='100' height='100' />
    </div>
    <div className='text-center pt-3'>{principle.name}</div>
  </a>)
}

export default DigitalPrinciple