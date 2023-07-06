const WizardDefinition = () => {
  return (
    <div className='relative h-[297px]'>
      <div className='absolute top-0 left-0 w-full h-[297px] bg-dial-white-linen' />
      <div className='absolute top-0 left-0 w-full h-[297px] '>
        <div
          className='bg-auto bg-right bg-no-repeat'
          style={{
            backgroundImage: 'url("/ui/v1/wizard-bg.svg")',
            height: '297px'
          }}
        >
          <div className='px-8 xl:px-56'>
            <div className='flex flex-col gap-y-6'>
              <div className='text-2xl font-semibold mt-12'>
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
