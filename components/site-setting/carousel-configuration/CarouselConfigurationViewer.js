import { DigitalExchangeHeroCarousel, GenericHeroCarousel, MarketplaceHeroCarousel } from '../../shared/HeroCarousel'

const CarouselConfigurationViewer = ({ carouselConfiguration }) => {
  return carouselConfiguration.type === 'default.exchange.carousel'
    ? <DigitalExchangeHeroCarousel carouselConfiguration={carouselConfiguration} />
    : carouselConfiguration.type === 'default.marketplace.carousel'
      ? <MarketplaceHeroCarousel carouselConfiguration={carouselConfiguration} />
      : <GenericHeroCarousel carouselConfiguration={carouselConfiguration} />
}

export default CarouselConfigurationViewer
