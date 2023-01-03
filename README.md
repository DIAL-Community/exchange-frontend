# DIAL Catalog of Digital Solutions

The Catalog of Digital Solutions is an interactive online resource to support donors, 
governments, and procurers in the development and implementation of digital strategies.​
The catalog aggregates data from a variety of sources (including the Digital Public 
Goods Alliance, WHO, Digital Square and the DIAL Open Source Center) and allows the 
user to identify and evaluate digital tools that may be applicable for their use cases
or projects. 

The catalog supports the [SDG Digital Investment Framework](https://digitalimpactalliance.org/research/sdg-digital-investment-framework/) developed by DIAL and ITU.

## Repositories
Note that this repository contains the code for the front-end for the Catalog. It requires connection to the 
Catalog back-end/API, which can be referenced at: https://gitlab.com/dial/online-catalog/product-registry/-/tree/development

## Documentation
Complete documentation is available (including detailed installation and configuration instructions) at [DIAL Online Catalog Documentation](https://docs.osc.dial.community/projects/product-registry/en/latest/)

Please also reference the [Wiki page for the Catalog](https://solutions-catalog.atlassian.net/wiki/spaces/SOLUTIONS/overview?homepageId=33072), which contains information about upcoming feature development, releases, and additional documentation.

## Development environment setup
This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).
### Prerequisites
* `Node.js` (Version 16 or greater)
* `yarn`

### Application configuration for development 
Environment variables must be set in the **.env.development** file in the root of the project. See the **.env.example** file for a list of variables to be set. These variables will be loaded automatically when the application starts.

To install project's dependencies, navigate to project directory and execute the following command:
```
yarn install
```

Then, to start the development environment execute the following command: 
```
yarn dev
```

The application will run on localhost port 3002 by default.

## End to End Tests
For information on End to End Tests, refer to [README](cypress/README.md) in the `cypress` directory.

## Copyright Information
Copyright © 2023 Digital Impact Alliance. This program is free software: you can 
redistribute it and/or modify it under the terms of the GNU Affero General 
Public License as published by the Free Software Foundation, either version 3 
of the License, or any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY 
WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A 
PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License along 
with this program.  If not, see <https://www.gnu.org/licenses/>.
