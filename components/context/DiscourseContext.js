import React, { createContext, useState } from 'react'

const DiscourseContext = createContext()
const DiscourseDispatchContext = createContext()

const DiscourseProvider = ({ children }) => {
  const [postCount, setPostCount] = useState(0)

  const discourseValues = {
    postCount
  }
  const discourseDispatchValues = {
    setPostCount
  }

  return (
    <DiscourseContext.Provider value={discourseValues}>
      <DiscourseDispatchContext.Provider value={discourseDispatchValues}>
        {children}
      </DiscourseDispatchContext.Provider>
    </DiscourseContext.Provider>
  )
}

export { DiscourseProvider, DiscourseContext, DiscourseDispatchContext }
