/// <reference types="cypress" />

describe('Organizations', () => {

  beforeEach(function() {
    cy.fixture('test_organization').as('testOrg')

    cy.visit('organizations')
  })

  it('Should open organization tab', () => {
    cy.getByTestId('org-card')
      .should('have.length', 6)
      .eq(1)
      .click()
  })

  it('Should create & edit an organization', function () {
    cy.loginAsAdmin()

    createOrganization(this.testOrg)

    cy.url({ timeout: 10000 })
      .should('contain', 'organizations/' + this.testOrg.slug)

    verifyOrganizationBasicContent(this.testOrg)
    editOrganizationAdditionalInfo(this.testOrg)
  })

  const createOrganization = orgData => {
    cy.getByTestId('create-new')
      .should('exist')
      .click()

    cy.url().should('contain', 'organizations/create')

    // name
    cy.getByTestId('organization-name').type(orgData.name)

    // description - need to click (TinyMCE)
    cy.getByTestId('organization-description')
      .click()

    // add aliases
    orgData.aliases.forEach(alias => {
      cy.getByTestId('alias-name')
        .last()
        .type(alias)

      cy.getByTestId('alias-add')
        .should('have.length', '1')
        .click()
    })

    // add and remove one alias, just for kicks
    cy.getByTestId('alias-name')
      .last()
      .type('This should be removed')

    cy.getByTestId('alias-remove')
      .last()
      .click()

    // website
    cy.getByTestId('organization-website')
      .type(orgData.website)

    // logo
    if (orgData.logoPath) {

      cy.getByTestId('organization-logo')
        .find('input[type="file"]')
        .attachFile(orgData.logoPath)
    }

    // endorser
    if (orgData.endorser) {
      cy.getByTestId('organization-is-endorser')
        .click()
    }

    // endorsed date
    cy.getByTestId('organization-when-endorsed')
      .type(orgData.endorsedOn)

    // endorser level
    cy.getByTestId('organization-endorser-level')
      .click()
      .contains(orgData.endorserLevel)
      .click()

    // MNI
    if (orgData.mni) {
      cy.getByTestId('organization-is-mni')
        .click()
    }

    // description - now we update the content
    cy.setTinyMceContent('description-editor', orgData.description)

    cy.getByTestId('submit-button')
      .click()
  }

  const verifyOrganizationBasicContent = orgData => {
    cy.getByTestId('organization-website')
      .should('contain', orgData.website)

    cy.getByTestId('organization-endorser-level')
      .should('contain', orgData.endorserLevel.toUpperCase())

    cy.getByTestId('organization-description')
      .should('contain', orgData.description)
  }

  const editOrganizationAdditionalInfo = orgData => {
    editContacts(orgData)
  }

  const editContacts = orgData => {
    cy.getByTestId('organization-contacts').then($orgContacts => {

      cy.findChildByTestId($orgContacts, 'edit-button')
        .click()

      orgData.contacts.forEach(contact => {
        cy.findChildByTestId($orgContacts, 'name-input')
          .type(contact.name)

        cy.findChildByTestId($orgContacts, 'email-input')
          .type(contact.email)

        cy.findChildByTestId($orgContacts, 'title-input')
          .type(contact.title)

        cy.findChildByTestId($orgContacts, 'assign-button')
          .click()
      })

      cy.findChildByTestId($orgContacts, 'submit-button')
        .click()
    })
  }

  // eslint-disable-next-line
  const enterOrganization = (orgName, expectedSlug) => {
    cy.getByTestId('search-input').type(orgName)

    cy.getByTestId('org-card')
      .should('have.length', 1)

    cy.getByTestId('list-counter')
      .should('contain', 1)

    cy.getByTestId('org-card').click()

    cy.url().should('contain', 'organizations/' + expectedSlug)
  }
})
