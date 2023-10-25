const topicBgColors = {
  'ui.resource.topic.participation': 'bg-dial-acid',
  'ui.resource.topic.technology': 'bg-dial-sapphire',
  'ui.resource.topic.oversight' : 'bg-dial-blueberry',
  'ui.resource.topic.laws': 'bg-dial-plum'
}

const topicTextColors = {
  'ui.resource.topic.participation': 'text-dial-stratos',
  'ui.resource.topic.technology': 'text-white',
  'ui.resource.topic.oversight' : 'text-white',
  'ui.resource.topic.laws': 'text-white'
}

export const topicColors = (topic) => `${topicBgColors[topic]} ${topicTextColors[topic]}`
