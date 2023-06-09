import Document, { Html, Head, Main, NextScript } from 'next/document'
import { GOOGLE_ANALYTIC_ID } from '../lib/gtag'

// NextJS tracking taken from: https://github.com/vercel/next.js/tree/canary/examples/with-google-analytics
export default class MyDocument extends Document {
  render () {
    return (
      <Html className='scroll-smooth'>
        <Head>
          <script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ANALYTIC_ID}`}
          />
          <script
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GOOGLE_ANALYTIC_ID}');
              `
            }}
          />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
          <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap" rel="stylesheet" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
