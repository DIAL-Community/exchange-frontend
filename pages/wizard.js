import styles from '../styles/Home.module.css'

// import { I18nProvider } from './I18nProvider';
// import config from './config';
import Header from '../components/Header'
import WizardHeader from '../components/wizard/WizardHeader'
import WizardContent from '../components/wizard/WizardContent'
import withApollo from '../lib/apolloClient'

const WizardPage = () => {
  return (
    <div className={styles.container}>
      <Header />
      <WizardHeader stage={0} />
      <WizardContent />
      <footer className={styles.footer} />
    </div>
  )
}

export default withApollo()(WizardPage)
