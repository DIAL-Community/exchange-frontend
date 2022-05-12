import Head from 'next/head'
import { useIntl } from 'react-intl'
import { useContext } from 'react'
import dynamic from 'next/dynamic'
import Header from '../../../components/Header'
import Landing from '../../../components/Landing'
import Definition from '../../../components/Definition'
import WizardDescription from '../../../components/WizardDescription'
import Carousel from '../../../components/Carousel'
import CatalogTitle from '../../../components/CatalogTitle'
import Footer from '../../../components/Footer'
import TabNav from '../../../components/main/TabNav'
import MobileNav from '../../../components/main/MobileNav'
import PageContent from '../../../components/main/PageContent'
import ProductHint from '../../../components/filter/hint/ProductHint'
import ProductFilter from '../../../components/products/ProductFilter'
import ProductActiveFilter from '../../../components/products/ProductActiveFilter'
import ProductListQuery from '../../../components/products/ProductList'
import SearchFilter from '../../../components/shared/SearchFilter'
import { ProductFilterContext, ProductFilterDispatchContext } from '../../../components/context/ProductFilterContext'
import ClientOnly from '../../../lib/ClientOnly'
const ReactTooltip = dynamic(() => import('react-tooltip'), { ssr: false })

const HomePage = () => {
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id: id }, values)

  const { search } = useContext(ProductFilterContext)
  const { setSearch } = useContext(ProductFilterDispatchContext)

  return (
    <>
      <Head>
        <title>{format('app.title')}</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <div className="relative" is="flynt-hero-image-text"> <picture className="absolute"> <source srcSet="
        https://www.govstack.global/wp-content/uploads/resized/2021/07/GovStack_Hero_mb_750x800@2x-750x928-c-default.png 750w,
        https://www.govstack.global/wp-content/uploads/resized/2021/07/GovStack_Hero_mb_750x800@2x-1125x1392-c-default.png 1125w" data-srcset="
        https://www.govstack.global/wp-content/uploads/resized/2021/07/GovStack_Hero_mb_750x800@2x-750x928-c-default.png 750w,
        https://www.govstack.global/wp-content/uploads/resized/2021/07/GovStack_Hero_mb_750x800@2x-1125x1392-c-default.png 1125w" media="(max-width: 767px)" sizes="1636px" /> <img className="image lazyload--fade lazyautosizes lazyloaded" data-srcset="
        https://www.govstack.global/wp-content/uploads/resized/2021/07/GovStack_BackgroundVisual_Icons_1920x1080@2x-min-1440x822-c-center.png 1440w,
        https://www.govstack.global/wp-content/uploads/resized/2021/07/GovStack_BackgroundVisual_Icons_1920x1080@2x-min-2880x1644-c-center.png 2880w" src="https://www.govstack.global/wp-content/uploads/resized/2021/07/GovStack_BackgroundVisual_Icons_1920x1080@2x-min-1440x822-c-default.png" data-sizes="auto" data-object-fit="cover" alt="" sizes="1636px" srcSet="
        https://www.govstack.global/wp-content/uploads/resized/2021/07/GovStack_BackgroundVisual_Icons_1920x1080@2x-min-1440x822-c-center.png 1440w,
        https://www.govstack.global/wp-content/uploads/resized/2021/07/GovStack_BackgroundVisual_Icons_1920x1080@2x-min-2880x1644-c-center.png 2880w"></img> 
      </picture>
      <div className="absolute flex pb-12 pt-20"><div className="block text-white"><div className="content-limiter">
        <div className='text-2xl'>Accelerating the digital transformation of government services</div>
        <p>Our vision is that in five years, we can empower governments to take ownership of their digital futures by building more effective and cost-efficient digital government services.</p></div></div></div> <button data-scroll-down="" className="scroll-button"><span className="visuallyHidden">Scroll Down</span><svg width="32" height="33" viewBox="0 0 32 33" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M.746 16.079l1.386-1.415a.828.828 0 011.188 0l10.86 11.081V1.357c0-.473.376-.857.84-.857h1.96c.464 0 .84.384.84.857v24.388l10.86-11.08a.828.828 0 011.188 0l1.386 1.414a.87.87 0 010 1.212l-14.66 14.958a.828.828 0 01-1.188 0L.746 17.291a.87.87 0 010-1.212z" fill="currentColor"></path></svg> </button></div>
      <ReactTooltip className='tooltip-prose bg-dial-gray-dark text-white rounded' />
    </>
  )
}

export default HomePage
