import { ApplicationCredentialsManager } from '@esri/arcgis-rest-request'

export default async function arcGisToken(_, res) {
  const token = await ApplicationCredentialsManager.fromCredentials({
    clientId: process.env.ESRI_CLIENT_ID,
    clientSecret: process.env.ESRI_CLIENT_SECRET
  }).getToken()

  res.status(200).json({ token })
}
