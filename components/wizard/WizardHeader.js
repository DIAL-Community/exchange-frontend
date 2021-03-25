const WizardHeader = ({ stage }) => {
  return (
    <>
      <div className=' bg-dial-yellow p-6 w-full'>
        <div className='float-left'>Requirements and Recommendation Wizard</div>
        <div className='float-right'>Stage {stage}</div>
      </div>
    </>
  )
}

export default WizardHeader
