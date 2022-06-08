import ProjectMap from '../../../../components/maps/projects/ProjectMap'

const Landing = () => {
  return (
    <div className='relative overflow-hidden landing-with-menu'>
      <div className='m-6 text-xl text-dial-gray-dark'>
        Mapping deployments of digital technologies in Sierra Leone and West Africa
      </div>
      <ProjectMap initialCountry='Sierra Leone' center={[8,-10]} zoom={6} />
    </div>
  )
}

export default Landing