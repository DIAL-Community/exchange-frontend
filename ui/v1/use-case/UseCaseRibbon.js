import Ribbon from '../shared/Ribbon'

const UseCaseRibbon = () => {
  const titleImage =
    <img
      src='/ui/v1/use-case-header.svg'
      alt='Logo for use case header.'
      width={70}
      height={70}
      className='object-contain'
    />

  return (
    <Ribbon
      ribbonBg='bg-dial-blue-chalk'
      titleImage={titleImage}
      titleKey={'ui.useCase.ribbonTitle'}
    />
  )
}

export default UseCaseRibbon
