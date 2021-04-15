import Image from 'next/image'
import Link from 'next/link'

const ProjectCard = ({project, listType}) => {
  return(
    <Link className='card-link' href={`/projects/${project.slug}`}>
      {listType === 'list' ? (
        <div className='border-3 border-transparent hover:border-dial-yellow text-button-gray hover:text-dial-yellow cursor-pointer'>
          <div className='border border-dial-gray hover:border-transparent shadow-sm hover:shadow-lg'>
            <div className='flex justify-between my-4 px-4'>
              <div className='text-lg font-bold truncate '>
                {project.name}
              </div>
              <div className='right pr-5'>
                <Image src={`/images/origins/${project.origin.slug}.png`} alt={project.origin.slug} width="100%" height="30" />
              </div>
            </div>
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