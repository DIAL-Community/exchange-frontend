import { gql, useQuery } from '@apollo/client'
import { useCallback } from 'react'
import { Accordion, AccordionItem, AccordionItemHeading, AccordionItemButton, AccordionItemPanel } from 'react-accessible-accordion'
import { useIntl } from 'react-intl'

const COUNTRIES_QUERY = gql`
  query Countries($search: String) {
    countries(search: $search) {
      id
      name
    }
  }
`

const CAPABILITIES_QUERY = gql`
  query Capabilities(
    $search: String,
    $aggregatorIds: [Int!]
  ) {
    capabilities(
      search: $search,
      aggregatorIds: $aggregatorIds
    ) {
      service
      capability
      operatorServiceId
      countryId
    }
  }
`

const OPERATORS_QUERY = gql`
  query OperatorServices(
    $search: String,
    $operatorIds: [Int!]
  ) {
    operatorServices(
      search: $search,
      operatorIds: $operatorIds
    ) {
      id
      name
      countryId
    }
  }
`

const OperatorCapability = (props) => {
  const { operatorId, operatorData, operators } = props
  const operator = operators[operatorId]

  return (
    <Accordion allowMultipleExpanded allowZeroExpanded>
      <AccordionItem>
        <AccordionItemHeading>
          <AccordionItemButton>
            <div className='h5 inline'>{operator.name} ({operatorData.length})</div>
          </AccordionItemButton>
        </AccordionItemHeading>
        {
          operatorData
            .sort((a, b) => {
              if (a < b) {
                return -1
              }

              if (b > a) {
                return 1
              }

              return 0
            })
            .map((capability, index) => (
              <AccordionItemPanel key={index}>
                <div className='text-sm text-button-gray pl-6'>
                  {capability}
                </div>
              </AccordionItemPanel>
            ))
        }
      </AccordionItem>
    </Accordion>
  )
}

const ServiceCapability = (props) => {
  const { service, serviceData, operators } = props

  return (
    <AccordionItem>
      <AccordionItemHeading>
        <AccordionItemButton>
          <div className='h5 inline'>{service}</div>
        </AccordionItemButton>
      </AccordionItemHeading>
      <AccordionItemPanel>
        {
          Object.keys(serviceData).map((operatorId, index) => {
            const operatorData = serviceData[operatorId]

            return (
              <Accordion key={index} allowMultipleExpanded allowZeroExpanded>
                <OperatorCapability {...{ operatorId, operatorData, operators }} />
              </Accordion>
            )
          })
        }
      </AccordionItemPanel>
    </AccordionItem>
  )
}

const CountryCapability = (props) => {
  const { country, countryData, operators } = props

  return (
    <AccordionItem>
      <AccordionItemHeading>
        <AccordionItemButton>
          <div className='h5 inline'>{country.name}</div>
        </AccordionItemButton>
      </AccordionItemHeading>
      <AccordionItemPanel>
        {
          countryData &&
            Object.keys(countryData).map((service, index) => {
              const serviceData = countryData[service]

              return (
                <Accordion key={index} allowMultipleExpanded allowZeroExpanded>
                  <ServiceCapability {...{ service, serviceData, operators }} />
                </Accordion>
              )
            })
        }
      </AccordionItemPanel>
    </AccordionItem>
  )
}

const AggregatorCapability = (props) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { aggregatorId } = props
  const { loading: loadingCountryData, data: countryData } = useQuery(COUNTRIES_QUERY)

  const countries = {}
  if (countryData) {
    countryData.countries.forEach(country => {
      countries[country.id] = country
    })
  }

  const { loading: loadingCapabilityData, data: capabilityData } = useQuery(CAPABILITIES_QUERY, {
    variables: {
      aggregatorIds: [parseInt(aggregatorId)]
    },
    skip: !aggregatorId
  })

  let operatorIds = []
  // Will be map:
  // countryId -> services -> operatorId -> [capabilities]
  const mappedCapabilities = {}
  if (capabilityData) {
    capabilityData.capabilities
      .forEach(capability => {
        operatorIds.push(capability.operatorServiceId)

        // Map country of services
        const countryCapability = mappedCapabilities[capability.countryId] || {}
        mappedCapabilities[capability.countryId] = countryCapability

        const serviceByCountry = countryCapability[capability.service] || {}
        countryCapability[capability.service] = serviceByCountry

        const operatorByService = serviceByCountry[capability.operatorServiceId] || []
        serviceByCountry[capability.operatorServiceId] = operatorByService

        operatorByService.push(capability.capability)
      })

    // Get all unique operator id data from the capability table
    operatorIds = operatorIds.filter((value, index, self) => self.indexOf(value) === index)
  }

  const { loading: loadingOperatorData, data: operatorData } = useQuery(OPERATORS_QUERY, {
    variables: {
      operatorIds: operatorIds.map(operatorId => parseInt(operatorId))
    },
    skip: operatorIds.length <= 0
  })

  const operators = {}
  if (operatorData) {
    operatorData.operatorServices.forEach(operator => {
      operators[operator.id] = operator
    })
  }

  return (
    <Accordion allowMultipleExpanded allowZeroExpanded>
      {(loadingCountryData || loadingCapabilityData || loadingOperatorData) && `${format('organization.aggregator.loading')}`}
      {
        // Start rendering only when we have all data.
        Object.keys(countries).length > 0 && Object.keys(mappedCapabilities).length > 0 && Object.keys(operators).length > 0 &&
          Object.keys(mappedCapabilities).map((countryId, index) => {
            const country = countries[countryId]
            const countryData = mappedCapabilities[countryId]

            return (
              <CountryCapability key={index} {...{ country, countryData, operators }} />
            )
          })
      }
    </Accordion>
  )
}

export default AggregatorCapability
