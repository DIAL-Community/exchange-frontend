import Image from 'next/image'

const HeroSection = () => {
  return (
    <div className="max-w-catalog mx-auto image-block-hack image-h-full-hack">
      <Image
        width={2120}
        height={650}
        src="/assets/exchange/exchange-hero.png"
        alt='Digital Impact Exchage Hero Image.'
      />
    </div>
  )
}

export default HeroSection
