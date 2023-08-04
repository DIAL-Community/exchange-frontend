import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel
} from 'react-accessible-accordion'
import { useIntl } from 'react-intl'
import parse from 'html-react-parser'
import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { useMutation, useQuery } from '@apollo/client'
import { useRouter } from 'next/router'
import EditableSection from '../../../shared/EditableSection'
import { Loading } from '../../../shared/FetchStatus'
import { PRODUCT_CATEGORY_INDICATORS_QUERY } from '../../../shared/query/product'
import { useUser } from '../../../../../lib/hooks'
import { ToastContext } from '../../../../../lib/ToastContext'
import {
  getCategoryIndicatorBooleanOptions,
  getCategoryIndicatorNumericOptions,
  getCategoryIndicatorScaleOptions
} from '../../../utils/maturity'
import { UPDATE_PRODUCT_CATEGORY_INDICATORS } from '../../../shared/mutation/product'
import BarChart from '../../../shared/BarChart'
import RadarChart from '../../../shared/RadarChart'
import Dialog from '../../../shared/Dialog'
import Select from '../../../shared/form/Select'
import { CategoryIndicatorType } from '../../../utils/constants'

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
      <AccordionItemHeading className='bg-dial-spearmint text-dial-stratos hover:bg-dial-mint'>
        <AccordionItemButton>
          <div className='h5 my-auto'>{category.name}</div>
          <div className='h5 ml-auto my-auto'>
            {`
              ${format('product.maturity.categoryScore')}:
              ${Math.round((category.overallScore / category.maximumScore) * MAX_MATURITY_SCORE)} /
              ${MAX_MATURITY_SCORE}
            `}
          </div>
          <div className='text-xs pl-4 pt-3'>
            {category.description && parse(category.description)}
          </div>
        </AccordionItemButton>
      </AccordionItemHeading>
      <AccordionItemPanel>
        {category.categoryIndicators.map((indicator, indicatorIdx) => {
          let indicatorScore = Math.round(indicator.score / indicator.weight) * MATURITY_SCORE_MULTIPLIER
          indicatorScore = indicatorScore > MAX_MATURITY_SCORE ? MAX_MATURITY_SCORE : indicatorScore
          const scoreText = `${Math.round(indicatorScore)} / ${MAX_MATURITY_SCORE}`

          return (
            <Accordion key={indicatorIdx} allowMultipleExpanded allowZeroExpanded>
              <AccordionItem>
                <AccordionItemHeading className='bg-dial-spearmint text-dial-stratos hover:bg-dial-mint'>
                  <AccordionItemButton>
                    <div className='h5 inline'>{indicator.name}</div>
                    <div className='h5 float-right inline'>
                      {`
                        ${format('product.maturity.indicatorScore')}:
                        ${isNaN(indicatorScore) ? 'N/A' : scoreText}
                      `}
                    </div>
                  </AccordionItemButton>
                </AccordionItemHeading>
                <AccordionItemPanel>
                  <div className='text-sm text-dial-stratos pl-4'>
                    {parse(indicator.description)}
                  </div>
                  <div className='text-sm text-dial-stratos pl-4'>
                    {format('categoryIndicator.weight')}: {indicator.weight}
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

const ProductDetailMaturityScores = ({ slug, overallMaturityScore, maturityScoreDetails }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id) => formatMessage({ id }), [formatMessage])

  const { locale } = useRouter()
  const { showToast } = useContext(ToastContext)

  const scaleOptions = useMemo(() => getCategoryIndicatorScaleOptions(format), [format])
  const booleanOptions = useMemo(() => getCategoryIndicatorBooleanOptions(format), [format])
  const numericOptions = useMemo(() => getCategoryIndicatorNumericOptions(), [])

  const { isAdminUser, user } = useUser()

  const [maturityScore, setMaturityScore] = useState(overallMaturityScore)

  const { handleSubmit, setValue, control, reset } = useForm()
  const { fields: categoryIndicators } = useFieldArray({
    control,
    name: CATEGORY_INDICATORS_FIELD_ARRAY_NAME
  })

  const [isDirty, setIsDirty] = useState(false)

  const [isMaturityScoreDetailsDialogOpen, setIsMaturityScoreDetailsDialogOpen] = useState(false)
  const toggleMaturityScoreDetailsDialog = () =>
    setIsMaturityScoreDetailsDialogOpen(!isMaturityScoreDetailsDialogOpen)

  const sortMaturityScoreDetails = useCallback(
    (data) =>
      data
        ?.filter(({ overallScore }) => overallScore > 0)
        .sort((categoryA, categoryB) => categoryA.name.localeCompare(categoryB.name)),
    []
  )

  const [validMaturityScores, setValidMaturityScores] = useState(
    sortMaturityScoreDetails(maturityScoreDetails)
  )

  const chartLabels = useMemo(
    () => validMaturityScores?.map(({ name }) => name),
    [validMaturityScores]
  )

  const chartValues = useMemo(
    () =>
      validMaturityScores?.map(
        ({ overallScore, maximumScore }) => (overallScore / maximumScore) * MAX_MATURITY_SCORE
      ),
    [validMaturityScores]
  )

  const {
    loading: loadingCategoryIndicators,
    data: categoryIndicatorsData,
    refetch: refetchCategoryIndicators
  } = useQuery(PRODUCT_CATEGORY_INDICATORS_QUERY, {
    variables: { slug },
    skip: !isAdminUser
  })

  const defaultCategoryIndicators = useMemo(() => {
    if (categoryIndicatorsData?.product) {
      const assignedIndicators =
        categoryIndicatorsData.product.productIndicators?.map(
          ({
            indicatorValue,
            categoryIndicator: {
              slug,
              name,
              indicatorType,
              categoryIndicatorDescription: { description },
              rubricCategory: { id: rubricCategoryId, name: rubricCategoryName }
            }
          }) => ({
            slug,
            name,
            indicatorType,
            description,
            indicatorValue,
            rubricCategoryId,
            rubricCategoryName
          })
        ) ?? []
      const notAssignedIndicators =
        categoryIndicatorsData.product.notAssignedCategoryIndicators?.map(
          ({
            slug,
            name,
            indicatorType,
            categoryIndicatorDescription: { description },
            rubricCategory: { id: rubricCategoryId, name: rubricCategoryName }
          }) => ({
            slug,
            name,
            indicatorType,
            description,
            indicatorValue: null,
            rubricCategoryId,
            rubricCategoryName
          })
        ) ?? []

      return [...assignedIndicators, ...notAssignedIndicators]
        .reduce(
          (
            groupedIndicators,
            {
              slug,
              name,
              indicatorType,
              description,
              indicatorValue,
              rubricCategoryId,
              rubricCategoryName
            }
          ) => {
            const groupIdx = groupedIndicators.findIndex(
              (group) => group.rubricCategoryId === rubricCategoryId
            )
            const isAssigned = indicatorValue !== null
            const indicator = { slug, name, indicatorType, description, indicatorValue }
            if (groupIdx === -1) {
              groupedIndicators.push({
                rubricCategoryId,
                rubricCategoryName,
                indicators: {
                  [ASSIGNED_INDICATORS_ARRAY_NAME]: isAssigned ? [indicator] : [],
                  [NOT_ASSIGNED_INDICATORS_ARRAY_NAME]: isAssigned ? [] : [indicator]
                }
              })
            } else {
              groupedIndicators[groupIdx].indicators[
                isAssigned ? ASSIGNED_INDICATORS_ARRAY_NAME : NOT_ASSIGNED_INDICATORS_ARRAY_NAME
              ].push(indicator)
            }

            return groupedIndicators
          },
          []
        )
        .sort((categoryA, categoryB) =>
          categoryA.rubricCategoryName.localeCompare(categoryB.rubricCategoryName)
        )
    }

    return []
  }, [categoryIndicatorsData?.product])

  useEffect(
    () => setValue(CATEGORY_INDICATORS_FIELD_ARRAY_NAME, defaultCategoryIndicators),
    [defaultCategoryIndicators, setValue]
  )

  const [updateProductIndicators, { loading: isMutating, reset: resetMutation }] = useMutation(
    UPDATE_PRODUCT_CATEGORY_INDICATORS,
    {
      onCompleted: (data) => {
        const { updateProductIndicators: response } = data
        if (response?.product && response?.errors?.length === 0) {
          refetchCategoryIndicators()
          setValidMaturityScores(sortMaturityScoreDetails(data.updateProductIndicators.product.maturityScoreDetails))
          setMaturityScore(data.updateProductIndicators.product.overallMaturityScore)
          showToast(format('toast.category-indicator.update.success'), 'success', 'top-center')
          setIsDirty(false)
        } else {
          setValue(CATEGORY_INDICATORS_FIELD_ARRAY_NAME, defaultCategoryIndicators)
          showToast(format('toast.category-indicator.update.failure'), 'error', 'top-center')
          setIsDirty(false)
          resetMutation()
        }
      },
      onError: () => {
        setValue(CATEGORY_INDICATORS_FIELD_ARRAY_NAME, defaultCategoryIndicators)
        showToast(format('toast.category-indicator.update.failure'), 'error', 'top-center')
        setIsDirty(false)
        resetMutation()
      }
    }
  )

  const doUpsert = async (data) => {
    if (user) {
      const { userEmail, userToken } = user
      const dirtyIndicators = []
      data.categoryIndicators.forEach(({ indicators }, categoryIdx) => {
        indicators[ASSIGNED_INDICATORS_ARRAY_NAME].forEach(
          ({ slug, indicatorValue }, indicatorIdx) => {
            if (
              indicatorValue !==
              defaultCategoryIndicators[categoryIdx].indicators[ASSIGNED_INDICATORS_ARRAY_NAME][
                indicatorIdx
              ].indicatorValue
            ) {
              dirtyIndicators.push({ category_indicator_slug: slug, value: indicatorValue })
            }
          }
        )
        indicators[NOT_ASSIGNED_INDICATORS_ARRAY_NAME].forEach(
          ({ slug, indicatorValue }, indicatorIdx) => {
            if (
              indicatorValue !==
              defaultCategoryIndicators[categoryIdx].indicators[NOT_ASSIGNED_INDICATORS_ARRAY_NAME][
                indicatorIdx
              ].indicatorValue
            ) {
              dirtyIndicators.push({ category_indicator_slug: slug, value: indicatorValue })
            }
          }
        )
      })

      updateProductIndicators({
        variables: {
          slug,
          indicatorsData: dirtyIndicators
        },
        context: {
          headers: {
            'Accept-Language': locale,
            'Authorization': `${userEmail} ${userToken}`
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
      {validMaturityScores?.length
        ? <div className='grid grid-cols-1 xl:grid-cols-3 gap-12'>
          <div className='text-dial-meadow'>
            <div className='flex flex-col gap-y-6'>
              <div className='text-lg text-center font-semibold'>
                {format('product.maturity.overallScore')}
              </div>
              <div className="flex mx-auto">
                <div className='w-48 h-48 rounded-full overflow-hidden'>
                  <div className="bg-gradient-radial from-dial-mint to-dial-mint-dark h-full">
                    <div className='text-center text-dial-sapphire h-full'>
                      <div className='flex justify-center py-16'>
                        <div className='text-5xl text-dial-sapphire'>{Math.round(maturityScore)}</div>
                        <div className='text-7xl font-thin text-dial-slate-400'>/</div>
                        <div className='text-xl mt-auto pb-1'>{MAX_MATURITY_SCORE}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            className='xl:col-span-2 cursor-pointer min-h-[20rem] h-[25vh]'
            data-tooltip-id='react-tooltip'
            data-tooltip-content={format('product.maturity.chartTooltip')}
            onClick={toggleMaturityScoreDetailsDialog}
          >
            {validMaturityScores.length <= MIN_RADAR_CHART_CATEGORIES ? (
              <BarChart
                labels={chartLabels}
                values={chartValues}
                maxScaleValue={MAX_MATURITY_SCORE}
                horizontal
              />
            ) : (
              <RadarChart
                labels={chartLabels}
                values={chartValues}
                maxScaleValue={MAX_MATURITY_SCORE}
              />
            )}
          </div>
          <Dialog
            isOpen={isMaturityScoreDetailsDialogOpen}
            onClose={toggleMaturityScoreDetailsDialog}
            closeButton
          >
            <div className='flex flex-col w-full'>
              <div className='h4 inline mb-6'>{format('product.maturity.detailLabel')}</div>
              <Accordion
                allowMultipleExpanded
                allowZeroExpanded
                className='max-h-[60vh] overflow-auto'
              >
                {validMaturityScores?.map((category, categoryIdx) => (
                  <MaturityCategory key={categoryIdx} category={category} />
                ))}
              </Accordion>
            </div>
          </Dialog>
        </div>
        : <div className='text-sm pb-5 text-button-gray'>{format('product.noMaturity')}</div>
      }
    </>
  )

  const IndicatorsList = ({ categoryIdx, indicators, isAssignedIndicatorsList = true }) => {
    const indicatorsGroup = isAssignedIndicatorsList
      ? ASSIGNED_INDICATORS_ARRAY_NAME
      : NOT_ASSIGNED_INDICATORS_ARRAY_NAME

    return (
      !!indicators[indicatorsGroup].length && (
        <>
          <div className='text-sm font-semibold py-4 mx-6 px-6 border-t border-dial-slate-400'>
            {format(`shared.categoryIndicator.${indicatorsGroup}`)}
          </div>
          {indicators[indicatorsGroup]
            .sort((indicatorA, indicatorB) => indicatorA.name.localeCompare(indicatorB.name))
            .map(({ id, indicatorType, name, description }, indicatorIdx) => (
              <div key={indicatorIdx} className='py-4 mx-6 px-6 border-t border-dial-slate-400'>
                <div className='grid grid-cols-4 gap-8'>
                  <div className='text-sm col-span-3'>
                    {name}
                    <div className='text-dial-stratos'>{parse(description)}</div>
                  </div>
                  <div className='col-span-1'>
                    <Controller
                      name={
                        `${CATEGORY_INDICATORS_FIELD_ARRAY_NAME}.` +
                        `${categoryIdx}.` +
                        'indicators.' +
                        `${indicatorsGroup}.` +
                        `${indicatorIdx}.` +
                        'indicatorValue'
                      }
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
              </div>
            ))}
        </>
      )
    )
  }

  const editModeBody = loadingCategoryIndicators
    ? <Loading />
    : <Accordion allowMultipleExpanded allowZeroExpanded>
      {categoryIndicators.map(({ indicators, rubricCategoryName }, categoryIdx) => (
        <AccordionItem key={categoryIdx}>
          <AccordionItemHeading className='text-dial-stratos'>
            <AccordionItemButton>
              <div className='text-sm my-auto'>{rubricCategoryName}</div>
            </AccordionItemButton>
          </AccordionItemHeading>
          <AccordionItemPanel className='p-0'>
            {!!indicators[ASSIGNED_INDICATORS_ARRAY_NAME].length && (
              <IndicatorsList categoryIdx={categoryIdx} indicators={indicators} />
            )}
            {!!indicators[ASSIGNED_INDICATORS_ARRAY_NAME].length &&
              !!indicators[NOT_ASSIGNED_INDICATORS_ARRAY_NAME].length && <hr className='my-5' />}
            {!!indicators[NOT_ASSIGNED_INDICATORS_ARRAY_NAME].length && (
              <IndicatorsList
                categoryIdx={categoryIdx}
                indicators={indicators}
                isAssignedIndicatorsList={false}
              />
            )}
          </AccordionItemPanel>
        </AccordionItem>
      ))}
    </Accordion>

  return (
    <EditableSection
      canEdit={isAdminUser}
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
