// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add('getByTestId', testId => {
  return cy.get('[data-testid=' + testId +  ']')
})

Cypress.Commands.add('findByTestId', { prevSubject: true }, (subject, testId) => {
  return subject.find('[data-testid=' + testId +  ']')
})
  

Cypress.Commands.add('findChildByTestId', (elem, testId) => {
  return elem.find('[data-testid=' + testId +  ']')
})

Cypress.Commands.add('login', (username, password) => {
  cy.getByTestId('login')
    .contains('Log In')
    .click()

  cy.get('input[name=username]').type(username)
  cy.get('input[name=password]').type(password)

  cy.get('button[type="submit"]').click()

  cy.getByTestId('user-menu').should('exist')
  cy.getByTestId('login').should('not.exist')
})  

Cypress.Commands.add('loginAsAdmin', () => {
  cy.login(Cypress.env('ADMIN_EMAIL'), Cypress.env('ADMIN_PASSWORD'))
  
  cy.getByTestId('admin-menu').should('exist')
})

Cypress.Commands.add('setTinyMceContent', (editorId, content) => {
  cy.window().then(win => {
    const editor = win.tinymce.get(editorId)
    cy.log(editor)
    editor.setContent(content)
  })
})
