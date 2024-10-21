import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import parse from 'html-react-parser'
import { useRouter } from 'next/router'
import {
  Accordion, AccordionItem, AccordionItemButton, AccordionItemHeading, AccordionItemPanel
} from 'react-accessible-accordion'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { useIntl } from 'react-intl'
import { useMutation, useQuery } from '@apollo/client'
import { useUser } from '../../../../lib/hooks'
import { ToastContext } from '../../../../lib/ToastContext'
import BarChart from '../../../shared/BarChart'
import Dialog from '../../../shared/Dialog'
import EditableSection from '../../../shared/EditableSection'
import { Loading } from '../../../shared/FetchStatus'
import Select from '../../../shared/form/Select'
import { UPDATE_CANDIDATE_PRODUCT_CATEGORY_INDICATORS } from '../../../shared/mutation/candidateProduct'
import { CANDIDATE_PRODUCT_CATEGORY_INDICATORS_QUERY } from '../../../shared/query/candidateProduct'
import { COMMENTS_COUNT_QUERY, COMMENTS_QUERY } from '../../../shared/query/comment'
import RadarChart from '../../../shared/RadarChart'
import { CategoryIndicatorType, ObjectType } from '../../../utils/constants'
import {
  getCategoryIndicatorBooleanOptions, getCategoryIndicatorNumericOptions, getCategoryIndicatorScaleOptions
} from '../../../utils/maturity'

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
          <div className='inline text-xs uppercase font-semibold'>{category.name}</div>
          <div className='inline text-xs uppercase float-right mt-2'>
            {`
              ${format('product.maturity.categoryScore')}:
              ${Math.round((category.overallScore / category.maximumScore) * MAX_MATURITY_SCORE)} /
              ${MAX_MATURITY_SCORE}
            `}
          </div>
          <div className='text-xs text-justify'>
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
                    <div className='inline text-xs uppercase font-semibold'>{indicator.name}</div>
                    <div className='inline text-xs uppercase float-right mt-2'>
                      {`
                        ${format('product.maturity.indicatorScore')}:
                        ${isNaN(indicatorScore) ? 'N/A' : scoreText}
                      `}
                    </div>
                  </AccordionItemButton>
                </AccordionItemHeading>
                <AccordionItemPanel>
                  <div className='text-sm text-dial-stratos pl-4'>
                    {indicator?.description && parse(indicator.description)}
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

const ProductDetailMaturityScores = ({ id, slug, overallMaturityScore, maturityScoreDetails }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { locale } = useRouter()
  const { showSuccessMessage, showFailureMessage } = useContext(ToastContext)

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
  } = useQuery(CANDIDATE_PRODUCT_CATEGORY_INDICATORS_QUERY, {
    variables: { slug },
    skip: !isAdminUser
  })

  const defaultCategoryIndicators = useMemo(() => {
    if (categoryIndicatorsData?.candidateProduct) {
      const assignedIndicators =
        categoryIndicatorsData.candidateProduct.candidateProductCategoryIndicators?.map(
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
        categoryIndicatorsData.candidateProduct.notAssignedCategoryIndicators?.map(
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
  }, [categoryIndicatorsData?.candidateProduct])

  useEffect(
    () => setValue(CATEGORY_INDICATORS_FIELD_ARRAY_NAME, defaultCategoryIndicators),
    [defaultCategoryIndicators, setValue]
  )

  const [updateProductIndicators, { loading: isMutating, reset: resetMutation }] = useMutation(
    UPDATE_CANDIDATE_PRODUCT_CATEGORY_INDICATORS,
    {
      refetchQueries:[{
        query: COMMENTS_COUNT_QUERY,
        variables: {
          commentObjectId: parseInt(id),
          commentObjectType: ObjectType.CANDIDATE_PRODUCT
        }
      }, {
        query: COMMENTS_QUERY,
        variables: {
          commentObjectId: parseInt(id),
          commentObjectType: ObjectType.CANDIDATE_PRODUCT
        }
      }],
      onCompleted: (data) => {
        const { updateCandidateProductCategoryIndicators: response } = data
        if (response?.candidateProduct && response?.errors?.length === 0) {
          refetchCategoryIndicators()
          setMaturityScore(response.candidateProduct.overallMaturityScore)
          setValidMaturityScores(sortMaturityScoreDetails(response.candidateProduct.maturityScoreDetails))
          showSuccessMessage(format('toast.submit.success', { entity: format('ui.categoryIndicator.header') }))
          setIsDirty(false)
        } else {
          setValue(CATEGORY_INDICATORS_FIELD_ARRAY_NAME, defaultCategoryIndicators)
          showFailureMessage(format('toast.submit.failure', { entity: format('ui.categoryIndicator.header') }))
          setIsDirty(false)
          resetMutation()
        }
      },
      onError: () => {
        setValue(CATEGORY_INDICATORS_FIELD_ARRAY_NAME, defaultCategoryIndicators)
        showFailureMessage(format('toast.submit.failure', { entity: format('ui.categoryIndicator.header') }))
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
          categoryIndicatorValues: dirtyIndicators
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
              <div className='flex mx-auto'>
                <div className='w-40 h-40 rounded-full overflow-hidden'>
                  <div className='bg-gradient-radial from-dial-meadow to-dial-meadow h-full'>
                    <div className='text-center text-white h-full'>
                      <div className='flex justify-center py-12'>
                        <div className='text-5xl text-white'>{Math.round(maturityScore)}</div>
                        <div className='text-7xl font-thin text-white'>/</div>
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
            {validMaturityScores.length <= MIN_RADAR_CHART_CATEGORIES
              ? (
                <BarChart
                  fontSize={12}
                  labels={chartLabels}
                  values={chartValues}
                  maxScaleValue={MAX_MATURITY_SCORE}
                  horizontal
                />
              )
              : (
                <RadarChart
                  fontSize={12}
                  labels={chartLabels}
                  values={chartValues}
                  maxScaleValue={MAX_MATURITY_SCORE}
                />
              )
            }
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
        : <div className='text-sm text-dial-stratos'>
          {format('ui.candidateProduct.noEvaluationRubric')}
        </div>
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
                    <div className='text-dial-stratos'>{description && parse(description)}</div>
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
              <div className='text-sm my-auto inline font-semibold'>{rubricCategoryName}</div>
            </AccordionItemButton>
          </AccordionItemHeading>
          <AccordionItemPanel className='p-0'>
            {!!indicators[ASSIGNED_INDICATORS_ARRAY_NAME].length && (
              <IndicatorsList categoryIdx={categoryIdx} indicators={indicators} />
            )}
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

  const sectionHeader =
    <div className='text-base font-semibold text-dial-meadow'>
      {format('ui.candidateProduct.evaluationRubric')}
    </div>

  const sectionDisclaimer =
    <div className='text-xs text-justify italic text-dial-stratos mb-2'>
      {format('ui.candidateProduct.evaluationRubricDisclaimer')}
    </div>

  return (
    <div className='text-sm'>
      <EditableSection
        sectionHeader={sectionHeader}
        sectionDisclaimer={sectionDisclaimer}
        canEdit={isAdminUser}
        editModeBody={editModeBody}
        displayModeBody={displayModeBody}
        isDirty={isDirty}
        onSubmit={handleSubmit(doUpsert)}
        onCancel={onCancel}
        isMutating={isMutating}
      />
    </div>
  )
}

export default ProductDetailMaturityScores
