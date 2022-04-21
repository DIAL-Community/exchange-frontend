import { resolve } from 'path'
import { config } from 'dotenv'

const envFile = async () => {
  config({ path: resolve(__dirname, './.env.test') })
}

export default envFile
