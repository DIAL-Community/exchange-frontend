const WizardDefinition = () => {
  return (
    <div className='relative h-[20rem]'>
      <div className='absolute top-0 left-0 w-full h-[20rem] bg-dial-white-linen' />
      <div className='absolute top-0 left-0 w-full h-[20rem] '>
        <div
          className='bg-contain bg-right bg-no-repeat'
          style={{
            backgroundImage: 'url("/ui/v1/wizard-bg.svg")',
            height: '20rem'
          }}
        >
          <div className='px-56 pt-8 pb-12'>
            <div className='flex flex-col gap-y-6'>
              <div className='text-2xl font-semibold'>
                New to the Digital Impact Exchange?
              </div>
              <div className='max-w-prose'>
                Our Recommendations Wizard can help get you started to find you a curated
                list of resources, tailored to wherever you are in a project lifecycle —
                ideation, planning, implementation, or monitoring/evaluation.
              </div>
              <div className='flex text-sm text-dial-stratos'>
                <button className='rounded px-5 py-2.5 bg-dial-sunshine'>
                  Launch
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WizardDefinition
