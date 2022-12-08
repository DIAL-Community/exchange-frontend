const userOwnedOrganization =  {
  id: 2,
  name: 'owned organization',
  slug: 'oo',
}

export const organizationOwnerUserProps = {
  own: {
    organization: userOwnedOrganization
  }
}

export const organizations = {
  data: {
    organizations: [
      {
        id: 3,
        name: 'Another Organization',
        imageFile: 'fake-image.png',
        slug: 'ao',
        website: 'another_rganization@gmail.com'
      },
    ]
  }
}
