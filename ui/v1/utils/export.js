import { saveAs } from 'file-saver'

export const ExportType = {
  EXPORT_AS_CSV: 'csv',
  EXPORT_AS_JSON: 'json'
}

/* Convert the object keys to snake case key because rails is using snake case. */
export const convertKeys = (object) => {
  Object.keys(object).forEach(key => {
    // Flatten the filter selection if it's Array.
    // Convert it to array of slug only.
    if (Array.isArray(object[key])) {
      object[key] = object[key].map(value => value.slug)
    }

    // Convert the key to snake case.
    const snakeCaseKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`)
    if (key !== snakeCaseKey) {
      Object.defineProperty(object, snakeCaseKey,
        Object.getOwnPropertyDescriptor(object, key))
      delete object[key]
    }
  })

  return object
}

export const asyncExport = (exportType, backendType, exportParameters, userEmail) => {
  const exportPath = process.env.NEXT_PUBLIC_AUTH_SERVER + `/api/v1/${backendType}.${exportType}`
  fetch(
    exportPath,
    {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'Access-Control-Allow-Origin': process.env.NEXT_PUBLIC_AUTH_SERVER,
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Headers': 'Set-Cookie',
        'X-User-Email': userEmail
      },
      body: JSON.stringify(exportParameters)
    }
  )
    .then(response => response.body)
    .then(body => {
      const reader = body.getReader()

      return new ReadableStream({
        start (controller) {
          return pump()
          async function pump () {
            const { done, value } = await reader.read()
            // When no more data needs to be consumed, close the stream
            if (done) {
              controller.close()

              return
            }

            // Enqueue the next data chunk into our target stream
            controller.enqueue(value)

            return pump()
          }
        }
      })
    })
    .then(stream => new Response(stream))
    .then(response => response.blob())
    .then(blob => {
      saveAs(blob, `${backendType}-data.${exportType}`)
    })
}
