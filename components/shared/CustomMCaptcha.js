import { useEffect, useRef } from 'react'
import Widget from '@mcaptcha/core-glue'

export const INPUT_NAME = 'mcaptcha__token'
export const INPUT_LABEL_ID = 'mcaptcha__token-label'
export const INSTRUCTIONS_URL = 'https://mcaptcha.org/docs/user-manual/how-to-mcaptcha-without-js/'

export const CustomMCaptcha = ({ captchaToken, setCaptchaToken }) => {
  const containerStyle = {
    width: '340px',
    height: '78px'
  }

  const input = useRef(null)
  const label = useRef(null)

  const config = {
    // TODO: We will eventually need to change this to a production URL.
    // For now, we're using a demo URL for testing. We need to roll out
    // our own mcaptcha server, and then we can use that.
    widgetLink: new URL('https://demo.mcaptcha.org/widget/?sitekey=oufG9xvsI39NSTk4rcI8L0bfythYLZ9k')
  }
  const w = new Widget(config, setCaptchaToken)

  useEffect(() => {
    [input, label].forEach((item) => {
      if (item && item.current) {
        item.current.style.display = 'none'
      }

      if (input && input.current) {
        input.current.readOnly = true
      }
    })

    w.listen()

    return () => w.destroy()
  })

  return (
    <div style={containerStyle}>
      <label
        id={INPUT_LABEL_ID}
        ref={label}
        data-mcaptcha_url={w.widgetLink.toString()}
        htmlFor={INPUT_NAME}
      >
        mCaptcha authorization token.{' '}
        <a href={INSTRUCTIONS_URL}>Instructions</a>.
        <input
          ref={input}
          id={INPUT_NAME}
          name={INPUT_NAME}
          value={captchaToken}
          required
          type='text'
        />
      </label>
      <iframe
        title='mCaptcha'
        src={w.widgetLink.toString()}
        role='presentation'
        name='mcaptcha-widget__iframe'
        id='mcaptcha-widget__iframe'
        sandbox='allow-same-origin allow-scripts allow-popups'
        width='100%'
        height='100%'
        style={{ border: '0px', overflow: 'hidden' }}
      />
    </div>
  )
}
