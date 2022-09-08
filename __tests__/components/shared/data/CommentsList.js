export const comments = [{
  userId: '1',
  comId: '100',
  fullName: 'user1',
  avatarUrl: 'https://ui-avatars.com/api/name=user1&background=random',
  text: '<p>1</p>',
  replies: [
    {
      userId: '2',
      comId: '101',
      fullName: 'user2',
      avatarUrl: 'https://ui-avatars.com/api/name=user2&background=random',
      text: '<p>2</p>'
    }
  ]
}]

export const deleteCommentSuccess = {
  data: {
    deleteComment: {
      errors: []
    }
  }
}

export const deleteCommentFailure = {
  data: {
    deleteComment: {
      errors: ['An error occurred']
    }
  }
}
