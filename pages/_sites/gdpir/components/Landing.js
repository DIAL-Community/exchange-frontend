import ProjectMap from '../../../../components/maps/projects/ProjectMap'

const Landing = () => {
  return (
    <div className='relative overflow-hidden landing-with-menu'>
      <div className='m-6 text-xl text-dial-gray-dark'>
        Tracking the Development and Use of Digital Public Infrastructure around the world
      </div>
      <ProjectMap />
    </div>
  )
}

export default Landing
