import { FaGithub, FaInstagram, FaTwitter } from 'react-icons/fa6'

const ContactCard = ({ contact }) => {
  return (
    <div class="relative py-20">
      <div class="rounded overflow-hidden shadow-md">
        <div class="absolute -mt-20 w-full flex justify-center">
          <div class="h-32 w-32">
            {contact?.imageFile &&
              <img
                alt='Picture of the contact'
                src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + contact.imageFile}
                class="rounded-full object-cover h-full w-full"
              />
            }
            {!contact?.imageFile &&
              <img
                alt='Picture of the contact'
                src='https://randomuser.me/api/portraits/lego/1.jpg'
                class="rounded-full object-cover h-full w-full"
              />
            }
          </div>
        </div>
        <div class="mt-16">
          <div class="font-bold text-3xl text-center mb-1">
            {`${contact?.name ?? 'First+Last Name'}`}
          </div>
          <p class="text-sm text-center">
            {`${contact?.title ?? 'Title of Contact'}`}
          </p>
          <div class="flex justify-center pt-5 pb-5">
            <a href="#" class="mx-5">
              <div aria-label="Github">
                <FaGithub />
              </div>
            </a>
            <a href="#" class="mx-5">
              <div aria-label="Twitter">
                <FaTwitter />
              </div>
            </a>
            <a href="#" class="mx-5">
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
