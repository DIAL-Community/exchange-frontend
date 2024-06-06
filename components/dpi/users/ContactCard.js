import { FaGithub, FaInstagram, FaTwitter } from 'react-icons/fa6'

const ContactCard = ({ contact }) => {
  return (
    <div className="relative py-20">
      <div className="rounded overflow-hidden shadow-md">
        <div className="absolute -mt-20 w-full flex justify-center">
          <div className="h-32 w-32">
            {contact?.imageFile &&
              <img
                alt='Picture of the contact'
                src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + contact.imageFile}
                className="rounded-full object-cover h-full w-full"
              />
            }
            {!contact?.imageFile &&
              <img
                alt='Picture of the contact'
                src='/ui/v1/user-header.svg'
                className="rounded-full object-cover h-full w-full"
              />
            }
          </div>
        </div>
        <div className="mt-16">
          <div className="font-bold text-3xl text-center mb-1">
            {`${contact?.name ?? 'First+Last Name'}`}
          </div>
          <p className="text-sm text-center">
            {`${contact?.title ?? 'Title of Contact'}`}
          </p>
          <div className="flex justify-center pt-5 pb-5">
            <a href="#" className="mx-5">
              <div aria-label="Github">
                <FaGithub />
              </div>
            </a>
            <a href="#" className="mx-5">
              <div aria-label="Twitter">
                <FaTwitter />
              </div>
            </a>
            <a href="#" className="mx-5">
              <div aria-label="Instagram">
                <FaInstagram />
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContactCard
