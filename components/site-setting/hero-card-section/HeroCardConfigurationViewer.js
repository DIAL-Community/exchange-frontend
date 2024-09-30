import { ExternalHeroCardDefinition, InternalHeroCardDefinition } from '../../shared/ToolDefinition'

const HeroCardConfigurationViewer = ({ heroCardConfiguration }) => {
  return (
    <div className='px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8'>
      {heroCardConfiguration.external
        ? <ExternalHeroCardDefinition
          key={heroCardConfiguration.slug}
          heroCardConfiguration={heroCardConfiguration}
        />
        : <InternalHeroCardDefinition
          key={heroCardConfiguration.slug}
          heroCardConfiguration={heroCardConfiguration}
        />
      }
    </div>
  )
}

export default HeroCardConfigurationViewer
