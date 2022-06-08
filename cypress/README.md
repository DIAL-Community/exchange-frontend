# End to End Tests #

This directory contains E2E tests built using the [Cypress](https://www.cypress.io/) framework.

## Running Tests ##

Tests can be both executed with the use of an interactive UI (in development scenarios) or in headless mode (in CI scenarios).

### Development UI ###

In order to run the Cypress UI for running the tests, execute the following command from the root directory of the project:

```bash
yarn cypress:open
# the shorthand yarn cy:open will also work
```

This will open an interactive UI that can be used for running the tests.

### Running in headless mode ###

In order to run all the tests in headless mode, without opening any windows, use the
following command from the root directory of the project:

```bash
yarn cypress:run
# the shorthand yarn cy:run will also work
```

On failure, Cypress will take screenshots and preserve them in the `cypress/screenshots/` directory.

Tests are also recorded - their mp4 recordings will be saved in the `cypress/videos/` directory.


## Test Configuration ##

### Test Server ###

Cypress tests run in isolation from the test server - they need the server running. This can be a server available through the internet or the local machine.

The URL to the server is defined in the `cypress.json.` file as `baseUrl`. By default this points to a localhost instalation of the Catalog.

### Admin credentials ###

Cypress needs to know the admin credentials to perform some of the tests that require aqdmin priviledges. In order to set them, best to create a `cypress.env.json` file in the root of the project, with content as follows:

```json
{
    "ADMIN_EMAIL": "admin_usernane",
    "ADMIN_PASSWORD": "admin_password"
}
```

The environment variables in this file can override any others defined in `cypress.json`.

## Test Data ##

## Test Development ##

### Selecting elements ###

As per Cypress [best practices](https://docs.cypress.io/guides/references/best-practices#Selecting-Elements), we should use a special attribute to select elements for tests, rather than using IDs or any other complicated selectors.

In Catalog, we use the `data-testid` attribute for such selections. See the commands listed below for handy shorthands allowing such selections.

### Commands ###

Several additional Cypress commands have been defined for the project. They are listed out below with sample usage.

`getByTestId` - allows selecting an element using the `data-testid` attribute.

```javascript
cy.getByTestId('example-test-id').should('exist')
```

`findByTestId` - same as `getByTestId`, but works on a subject from previous call. This allows quickly finding child elements by test id.

```javascript
cy.getByTestId('parent-id').findByTestId('child-test-id').should('exist')
```

`findChildByTestId` - same as the command above, but can be used when the parent element does not come from a Cypress chain, but will be passed directly.

```javascript
cy.getByTestId('parent-id').then($elem) {
  cy.findChildByTestId($elem, 'example-test-id').should('exist')
}
```

`login` - the test will log in to the Catalog using the provided credentials.

```javascript
cy.login('user', 'password')
```

`loginAsAdmin` - the test will log in using the admin credentials from the configuration (ADMIN_USERNAME and ADMIN_PASSWORD environment values).

```javascript
cy.loginAsAdmin()
```

`setTinyMceContent` - sets TinyMCE editor content, using hte `window` object underneath. This is a workaround to make these editors work with Cypress test, since they work an iframe, which makes them hard to manipulate. It takes the `editorId` of the TinyMCE editor as param.

```javascript
cy.setTinyMceContent('editor-id', 'text for the editor')
```

### Fixtures ###

Test data can be defined in JSON format in the `cypress/fixtures/` directory. Storing
all test data in this format makes it easier to manage and makes it easier for reuse
across the tests.

### Best practices ###

It is important to follow best practices recommended by Cypress during test development. These can be quickly read through here: [Best Practices](https://docs.cypress.io/guides/references/best-practices).
