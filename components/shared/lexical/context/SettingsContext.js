/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { DEFAULT_SETTINGS, INITIAL_SETTINGS } from '../appSettings'

const Context = createContext()
export const SettingsContext = ({ children }) => {
  const [settings, setSettings] = useState(INITIAL_SETTINGS)

  const setOption = useCallback((setting, value) => {
    setSettings(options => ({
      ...options,
      [setting]: value
    }))
    setURLParam(setting, value)
  }, [])

  const contextValue = useMemo(() => {
    return { setOption, settings }
  }, [setOption, settings])

  return <Context.Provider value={contextValue}>{children}</Context.Provider>
}

export const useSettings = () => {
  return useContext(Context)
}

function setURLParam(param, value) {
  const url = new URL(window.location.href)
  const params = new URLSearchParams(url.search)
  if (value !== DEFAULT_SETTINGS[param]) {
    params.set(param, String(value))
  } else {
    params.delete(param)
  }

  url.search = params.toString()
  window.history.pushState(null, '', url.toString())
}
