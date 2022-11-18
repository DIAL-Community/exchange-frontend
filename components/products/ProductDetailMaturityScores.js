import { Accordion, AccordionItem, AccordionItemHeading, AccordionItemButton, AccordionItemPanel } from 'react-accessible-accordion'
import { useIntl } from 'react-intl'
import parse from 'html-react-parser'
import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import ReactTooltip from 'react-tooltip'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { useMutation, useQuery } from '@apollo/client'
import { useRouter } from 'next/router'
import Dialog from '../shared/Dialog'
import RadarChart from '../shared/RadarChart'
import BarChart from '../shared/BarChart'
import { useUser } from '../../lib/hooks'
import EditableSection from '../shared/EditableSection'
import Card from '../shared/Card'
import { PRODUCT_CATEGORY_INDICATORS_QUERY } from '../../queries/product'
import { getCategoryIndicatorBooleanOptions, getCategoryIndicatorNumericOptions, getCategoryIndicatorScaleOptions } from '../../lib/utilities'
import { CategoryIndicatorType } from '../../lib/constants'
import Select from '../shared/Select'
import { Loading } from '../shared/FetchStatus'
import { UPDATE_PRODUCT_CATEGORY_INDICATORS } from '../../mutations/product'
import { ToastContext } from '../../lib/ToastContext'

const MATURITY_SCORE_MULTIPLIER = 10
const MAX_MATURITY_SCORE = 100
const MIN_RADAR_CHART_CATEGORIES = 2
const CATEGORY_INDICATORS_FIELD_ARRAY_NAME = 'categoryIndicators'
const ASSIGNED_INDICATORS_ARRAY_NAME = 'assigned'
const NOT_ASSIGNED_INDICATORS_ARRAY_NAME = 'notAssigned'

const MaturityCategory = ({ category }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  return (
    <AccordionItem>
      <AccordionItemHeading>
        <AccordionItemButton>
          <div className='h5 inline'>{category.name}</div>
          <div className='h5 float-right inline'>
            {format('product.category-score')}: {Math.round(category.overall_score * MATURITY_SCORE_MULTIPLIER)} / {MAX_MATURITY_SCORE}
          </div>
        </AccordionItemButton>
      </AccordionItemHeading>
      <AccordionItemPanel>
        {category.indicator_scores.map((indicator, indicatorIdx) => {
          let indicatorScore = Math.round(indicator.score * category.indicator_scores.length * MATURITY_SCORE_MULTIPLIER)
          indicatorScore = indicatorScore > MAX_MATURITY_SCORE ? MAX_MATURITY_SCORE : indicatorScore

          return (
            <Accordion key={indicatorIdx} allowMultipleExpanded allowZeroExpanded>
              <AccordionItem>
                <AccordionItemHeading>
                  <AccordionItemButton>
                    <div className='h5 inline'>{indicator.name}</div>
                    <div className='h5 float-right inline'>
                      {format('product.indicator-score')}: {indicatorScore} / {MAX_MATURITY_SCORE}
                    </div>
                  </AccordionItemButton>
                </AccordionItemHeading>
                <AccordionItemPanel>
                  <div className='text-sm text-button-gray pl-6'>
                    {parse(indicator.description)}
                  </div>
                </AccordionItemPanel>
              </AccordionItem>
            </Accordion>
          )
        })}
      </AccordionItemPanel>
    </AccordionItem>
  )
}

const ProductDetailMaturityScores = ({ slug, maturityScore, maturityScoreDetails }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id) => formatMessage({ id }), [formatMessage])

  const { locale } = useRouter()

  const { showToast } = useContext(ToastContext)

  const scaleOptions = useMemo(() => getCategoryIndicatorScaleOptions(format), [format])

  const booleanOptions = useMemo(() => getCategoryIndicatorBooleanOptions(format), [format])

  const numericOptions = useMemo(() => getCategoryIndicatorNumericOptions(), [])

  const { isAdminUser, user } = useUser()

  const { handleSubmit, setValue, control, reset } = useForm()

  const { fields: categoryIndicators } = useFieldArray({
    control,
    name: CATEGORY_INDICATORS_FIELD_ARRAY_NAME
  })

  const [isDirty, setIsDirty] = useState(false)

  const [isMaturityScoreDetailsDialogOpen, setIsMaturityScoreDetailsDialogOpen] = useState(false)
  const toggleMaturityScoreDetailsDialog = () => setIsMaturityScoreDetailsDialogOpen(!isMaturityScoreDetailsDialogOpen)

  const [overallMaturityScore, setOverallMaturityScore] = useState(maturityScore?.overallScore)

  const sortMaturityScoreDetails = useCallback((data) => data?.filter(({ overall_score }) => overall_score > 0)
    .sort((categoryA, categoryB) => categoryA.name.localeCompare(categoryB.name)), [])

  const [validMaturityScores, setValidMaturityScores] = useState(sortMaturityScoreDetails(maturityScoreDetails))

  const chartLabels = useMemo(() => validMaturityScores?.map(({ name }) => name), [validMaturityScores])

  const chartValues = useMemo(
    () => validMaturityScores?.map(({ overall_score }) => overall_score * MATURITY_SCORE_MULTIPLIER),
    [validMaturityScores]
  )

  const {
    loading: loadingCategoryIndicators,
    data: categoryIndicatorsData,
    refetch: refetchCategoryIndicators,
  } = useQuery(PRODUCT_CATEGORY_INDICATORS_QUERY, {
    variables: { slug },
    skip: !isAdminUser
  })

  const defaultCategoryIndicators = useMemo(() => {
    if (categoryIndicatorsData?.product) {
      const assignedIndicators = categoryIndicatorsData.product.productIndicators?.map(({
        indicatorValue,
        categoryIndicator: {
          slug,
          name,
          indicatorType,
          categoryIndicatorDescription: { description },
          rubricCategory: { id: rubricCategoryId, name: rubricCategoryName }
        }
      }) => ({ slug, name, indicatorType, description, indicatorValue, rubricCategoryId, rubricCategoryName })) ?? []
      const notAssignedIndicators = categoryIndicatorsData.product.notAssignedCategoryIndicators?.map(({
        slug,
        name,
        indicatorType,
        categoryIndicatorDescription: { description },
        rubricCategory: { id: rubricCategoryId, name: rubricCategoryName }
      }) => ({ slug, name, indicatorType, description, indicatorValue: null, rubricCategoryId, rubricCategoryName })) ?? []

      return [...assignedIndicators, ...notAssignedIndicators]
        .reduce((
          groupedIndicators,
          { slug, name, indicatorType, description, indicatorValue, rubricCategoryId, rubricCategoryName }
        ) => {
          const groupIdx = groupedIndicators.findIndex((group) => group.rubricCategoryId === rubricCategoryId)
          const isAssigned = indicatorValue !== null
          const indicator = { slug, name, indicatorType, description, indicatorValue }
          if (groupIdx === -1) {
            groupedIndicators.push({
              rubricCategoryId,
              rubricCategoryName,
              indicators: {
                [ASSIGNED_INDICATORS_ARRAY_NAME]: isAssigned ? [indicator] : [],
                [NOT_ASSIGNED_INDICATORS_ARRAY_NAME]: isAssigned ? [] : [indicator],
              },
            })
          } else {
            groupedIndicators[groupIdx].indicators[
              isAssigned ? ASSIGNED_INDICATORS_ARRAY_NAME : NOT_ASSIGNED_INDICATORS_ARRAY_NAME
            ].push(indicator)
          }

          return groupedIndicators
        }, [])
        .sort(((categoryA, categoryB) => categoryA.rubricCategoryName.localeCompare(categoryB.rubricCategoryName)))
    }

    return []
  }, [categoryIndicatorsData?.product])

  useEffect(() => setValue(CATEGORY_INDICATORS_FIELD_ARRAY_NAME, defaultCategoryIndicators), [defaultCategoryIndicators, setValue])

  const [updateProductIndicators, { loading: isMutating }] = useMutation(UPDATE_PRODUCT_CATEGORY_INDICATORS, {
    onCompleted: (data) => {
      refetchCategoryIndicators()
      setValidMaturityScores(sortMaturityScoreDetails(data.updateProductIndicators.product.maturityScoreDetails))
      setOverallMaturityScore(data.updateProductIndicators.product.maturityScore.overallScore)
      setIsDirty(false)
      showToast(format('toast.category-indicator.update.success'), 'success', 'top-center')
    },
    onError: () => {
      setValue(CATEGORY_INDICATORS_FIELD_ARRAY_NAME, defaultCategoryIndicators)
      setIsDirty(false)
      showToast(format('toast.category-indicator.update.failure'), 'error', 'top-center')
    }
  })

  const doUpsert = async (data) => {
    if (user) {
      const { userEmail, userToken } = user
      const dirtyIndicators = []
      data.categoryIndicators.forEach(({ indicators }, categoryIdx) => {
        indicators[ASSIGNED_INDICATORS_ARRAY_NAME].forEach(({ slug, indicatorValue }, indicatorIdx) => {
          if (indicatorValue !== defaultCategoryIndicators[categoryIdx].indicators[ASSIGNED_INDICATORS_ARRAY_NAME][indicatorIdx].indicatorValue) {
            dirtyIndicators.push({ category_indicator_slug: slug, value: indicatorValue })
          }
        })
        indicators[NOT_ASSIGNED_INDICATORS_ARRAY_NAME].forEach(({ slug, indicatorValue }, indicatorIdx) => {
          if (indicatorValue !== defaultCategoryIndicators[categoryIdx].indicators[NOT_ASSIGNED_INDICATORS_ARRAY_NAME][indicatorIdx].indicatorValue) {
            dirtyIndicators.push({ category_indicator_slug: slug, value: indicatorValue })
          }
        })
      })

      updateProductIndicators({
        variables: {
          slug,
          indicatorsData: dirtyIndicators
        },
        context: {
          headers: {
            'Accept-Language': locale,
            Authorization: `${userEmail} ${userToken}`
          }
        }
      })
    }
  }

  const onCancel = () => {
    reset({ [CATEGORY_INDICATORS_FIELD_ARRAY_NAME]: defaultCategoryIndicators })
    setIsDirty(false)
  }

  const displayModeBody = (
    <>
      <div className='text-sm mb-3 text-dial-gray-dark highlight-link' dangerouslySetInnerHTML={{ __html: format('product.maturity-desc') }} />
      {validMaturityScores?.length ? (
        <>
          <div className='pb-5 mr-6 h4' data-testid='maturity-overall-score'>
            {format('product.overall-score')}: {overallMaturityScore} / {MAX_MATURITY_SCORE}
          </div>
          <div
            className='cursor-pointer min-h-[20rem] h-[25vh]'
            data-tip={format('product.maturity-chart-tooltip')}
            onClick={toggleMaturityScoreDetailsDialog}
            data-testid='maturity-scores-chart'
          >
            {validMaturityScores.length <= MIN_RADAR_CHART_CATEGORIES
              ? <BarChart labels={chartLabels} values={chartValues} maxScaleValue={MAX_MATURITY_SCORE} horizontal />
              : <RadarChart labels={chartLabels} values={chartValues} maxScaleValue={MAX_MATURITY_SCORE} />
            }
          </div>
          <ReactTooltip className='tooltip-prose bg-dial-gray-dark text-white rounded' />
          <Dialog
            isOpen={isMaturityScoreDetailsDialogOpen}
            onClose={toggleMaturityScoreDetailsDialog}
            closeButton
          >
            <div className='flex flex-col w-full'>
              <div className='h4 inline mb-2'>
                {format('product.maturity-details-label')}
              </div>
              <Accordion allowMultipleExpanded allowZeroExpanded className='max-h-[60vh] overflow-auto'>
                {validMaturityScores?.map((category, categoryIdx) => (
                  <MaturityCategory key={categoryIdx} category={category} />)
                )}
              </Accordion>
            </div>
          </Dialog>
        </>
      ) : <div className='text-sm pb-5 text-button-gray'>{format('product.no-maturity')}</div>}
    </>
  )

  const IndicatorsList = ({ categoryIdx, indicators, isAssignedIndicatorsList = true }) => {
    const indicatorsGroup = isAssignedIndicatorsList ? ASSIGNED_INDICATORS_ARRAY_NAME : NOT_ASSIGNED_INDICATORS_ARRAY_NAME

    return !!indicators[indicatorsGroup].length && (
      <>
        <label className='font-semibold m-2'>{format(`shared.category-indicator.${indicatorsGroup}`)}</label>
        {indicators[indicatorsGroup]
          .sort((indicatorA, indicatorB) => indicatorA.name.localeCompare(indicatorB.name))
          .map(({ id, indicatorType, name, description }, indicatorIdx) => (
            <Card key={indicatorIdx}>
              <div className="grid grid-cols-4 gap-8">
                <div className="col-span-3">
                  {name}
                  <div className="text-sm text-dial-gray-dark">{parse(description)}</div>
                </div>
                <div className="col-span-1">
                  <Controller
                    name={`${CATEGORY_INDICATORS_FIELD_ARRAY_NAME}.${categoryIdx}.indicators.${indicatorsGroup}.${indicatorIdx}.indicatorValue`}
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <Select
                        key={id}
                        isClearable
                        options={
                          indicatorType === CategoryIndicatorType.SCALE
                            ? scaleOptions
                            : indicatorType === CategoryIndicatorType.BOOLEAN
                              ? booleanOptions
                              : numericOptions
                        }
                        value={
                          indicatorType === CategoryIndicatorType.SCALE
                            ? scaleOptions.find((option) => option.value === value)
                            : indicatorType === CategoryIndicatorType.BOOLEAN
                              ? booleanOptions.find((option) => option.value === value)
                              : numericOptions.find((option) => option.value === value)
                        }
                        onChange={(option) => {
                          setIsDirty(true)
                          onChange(option?.value ?? null)
                        }}
                      />
                    )}
                  />
                </div>
              </div>
            </Card>
          )
          )}
      </>
    )
  }

  const editModeBody = (
    loadingCategoryIndicators ? <Loading /> : (
      <Accordion allowMultipleExpanded allowZeroExpanded className="bg-white">
        {categoryIndicators.map(({ indicators, rubricCategoryName }, categoryIdx) => (
          <AccordionItem key={categoryIdx}>
            <AccordionItemHeading>
              <AccordionItemButton>
                <div className="h5 inline">{rubricCategoryName}</div>
              </AccordionItemButton>
            </AccordionItemHeading>
            <AccordionItemPanel className="p-3">
              {!!indicators[ASSIGNED_INDICATORS_ARRAY_NAME].length && (
                <IndicatorsList categoryIdx={categoryIdx} indicators={indicators} />
              )}
              {!!indicators[ASSIGNED_INDICATORS_ARRAY_NAME].length && !!indicators[NOT_ASSIGNED_INDICATORS_ARRAY_NAME].length && (
                <hr className="my-5" />
              )}
              {!!indicators[NOT_ASSIGNED_INDICATORS_ARRAY_NAME].length && (
                <IndicatorsList categoryIdx={categoryIdx} indicators={indicators} isAssignedIndicatorsList={false} />
              )}
            </AccordionItemPanel>
          </AccordionItem>
        ))}
      </Accordion>
    )
  )

  return (
    <EditableSection
      canEdit={isAdminUser}
      sectionHeader={format('product.maturity-scores')}
      editModeBody={editModeBody}
      displayModeBody={displayModeBody}
      isDirty={isDirty}
      onSubmit={handleSubmit(doUpsert)}
      onCancel={onCancel}
      isMutating={isMutating}
    />
  )
}

export default ProductDetailMaturityScores
