import Link from 'next/link'
import classNames from 'classnames'

const Card = ({ onClick, href, children, className }) => {

  const cardContainerStyles = classNames(
    'border-3 border-transparent',
    { 'hover:border-dial-sunshine cursor-pointer': onClick || href }
  )

  const CardBody = () => (
    <div className={classNames(className, 'grid gap-x-4 py-4 px-8 w-full')}>
      {children}
    </div>
  )

  return (
    href ? (
      <Link href={href}>
        <div className={cardContainerStyles}>
          <CardBody />
        </div>
      </Link>
    ) : onClick ? (
      <div className={cardContainerStyles} onClick={onClick}>
        <CardBody />
      </div>
    ) : (
      <div className={cardContainerStyles}>
        <CardBody />
      </div>
    )
  )
}

export default Card
