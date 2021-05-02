const SvgProjectLogo = (props) => {
  const { width, height } = props
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width={`${width || '1rem'}`}
      height={`${height || '1rem'}`}
      viewBox='0 0 96 96'
      {...props}
    >
      <path
        d='M38.044 0H57.77a8.454 8.454 0 018.455 8.454v5.637a8.454 8.454 0 01-8.455 8.454H38.044a8.454 8.454 0 01-8.454-8.455V8.453A8.454 8.454 0 0138.044 0zm0 5.636a2.818 2.818 0 00-2.818 2.818v5.637a2.818 2.818 0 002.818 2.818H57.77a2.818 2.818 0 002.82-2.819V8.453a2.818 2.818 0 00-2.818-2.818zm0 67.633H57.77a8.455 8.455 0 018.455 8.455v5.636a8.455 8.455 0 01-8.455 8.455H38.044a8.455 8.455 0 01-8.454-8.456v-5.636a8.455 8.455 0 018.454-8.455zm0 5.637a2.818 2.818 0 00-2.818 2.818v5.636a2.818 2.818 0 002.818 2.818H57.77a2.817 2.817 0 002.82-2.819v-5.636a2.817 2.817 0 00-2.818-2.818zm0-42.271H57.77a8.455 8.455 0 018.455 8.455v5.636a8.455 8.455 0 01-8.455 8.455H38.044a8.455 8.455 0 01-8.454-8.456v-5.636a8.455 8.455 0 018.454-8.455zm0 5.636a2.818 2.818 0 00-2.818 2.819v5.636a2.818 2.818 0 002.818 2.818H57.77a2.818 2.818 0 002.82-2.819v-5.636a2.818 2.818 0 00-2.818-2.819zM15.47 86.591a21.138 21.138 0 015.665-41.5h1.409a2.818 2.818 0 010 5.636h-1.409a15.5 15.5 0 00-3.857 30.516l-1.377-2.295a2.818 2.818 0 014.833-2.9l4.227 7.045a2.819 2.819 0 01-.656 3.651L17.26 92.38a2.818 2.818 0 11-3.521-4.4l1.731-1.385zm64.873-36.634l1.731 1.385a2.818 2.818 0 01-3.521 4.4l-7.045-5.636a2.818 2.818 0 01-.655-3.651l4.226-7.045a2.819 2.819 0 014.834 2.9l-1.377 2.295a15.5 15.5 0 00-3.858-30.516H73.27a2.818 2.818 0 010-5.637h1.408a21.139 21.139 0 015.665 41.5z'
      />
    </svg>
  )
}

export default SvgProjectLogo