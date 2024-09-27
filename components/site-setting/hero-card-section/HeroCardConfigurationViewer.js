import { ExternalHeroCardDefinition, InternalHeroCardDefinition } from '../../shared/ToolDefinition'

const HeroCardConfigurationViewer = ({ heroCardConfiguration }) => {
  return heroCardConfiguration.external
    ? <ExternalHeroCardDefinition
      key={heroCardConfiguration.slug}
      heroCardConfiguration={heroCardConfiguration}
    />
    : <InternalHeroCardDefinition
      key={heroCardConfiguration.slug}
      heroCardConfiguration={heroCardConfiguration}
    />
}

export default HeroCardConfigurationViewer
