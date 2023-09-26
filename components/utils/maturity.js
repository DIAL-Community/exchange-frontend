export const getCategoryIndicatorTypes = (format) => [
  { label: format('shared.categoryIndicator.type.numeric'), value: 'numeric' },
  { label: format('shared.categoryIndicator.type.scale'), value: 'scale' },
  { label: format('shared.categoryIndicator.type.boolean'), value: 'boolean' }
]

export const getCategoryIndicatorScaleOptions = (format) => [
  { label: format('shared.categoryIndicator.type.scale.low'), value: 'low' },
  { label: format('shared.categoryIndicator.type.scale.medium'), value: 'medium' },
  { label: format('shared.categoryIndicator.type.scale.high'), value: 'high' }
]

export const getCategoryIndicatorBooleanOptions = (format) => [
  { label: format('shared.categoryIndicator.type.boolean.true'), value: 't' },
  { label: format('shared.categoryIndicator.type.boolean.false'), value: 'f' }
]

export const getCategoryIndicatorNumericOptions = () =>
  ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'].map(value => ({ label: value, value }))
