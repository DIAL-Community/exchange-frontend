const WizardContent = ({ stage }) => {
  return (
    <>
      <div className='bg-dial-gray-dark text-dial-gray-light p-6 w-full'>
        <div className='flow-root'>
          <button className='bg-buttongray p-4 float-right text-buttongray-light'>Close</button>
        </div>
        <div className='block'>Wizard Content</div>
      </div>
    </>
  )
}

export default WizardContent
