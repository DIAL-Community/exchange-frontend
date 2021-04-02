import Image from 'next/image'
import Link from 'next/link'

const ProjectCard = ({project, listType}) => {
  return(
    <Link href='/'>
      {listType === 'list' ? (
        <div className='bg-white border-2 border-dial-gray p-2 m-2 shadow-lg flex justify-between items-center'>
          <div className='inline-block w-2/3 text-lg font-bold truncate '>
            {project.name}
          </div>
          <div className='inline-block w-1/4 right'>
            <Image src={`/images/origins/${project.origin.slug}.png`} alt={project.origin.slug} width="100%" height="30" />
          </div>
        </div>
      ) : (
        <div>Card View</div>
      )
      }
    </Link>
  )
}

export default ProjectCard