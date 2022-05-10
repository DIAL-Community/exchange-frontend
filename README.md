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
Catalog back-end/API, which can be referenced at:
https://gitlab.com/dial/osc/eng/t4d-online-catalog/product-registry/-/tree/development(https://gitlab.com/dial/osc/eng/t4d-online-catalog/product-registry/-/tree/development)


## Documentation

Complete documentation is available (including detailed installation and configuration
instructions) at 
[https://docs.osc.dial.community/projects/product-registry/en/latest/](https://docs.osc.dial.community/projects/product-registry/en/latest/ "DIAL Online Catalog Documentation")

Please also reference the [Wiki page for the Catalog](https://solutions-catalog.atlassian.net/wiki/spaces/SOLUTIONS/overview?homepageId=33072), which contains information about upcoming feature development, releases, and additional documentation.


## Prerequisites

 * Node.js (Version 16 or greater)
 * Npm

## Application configuration for development 

Environment variables must be set in the **.env.development** file in the root of the project. See the
.env.example file for a list of variables to be set. These variables will be loaded automatically when
the application starts.

A sample **env.development** file with values to use can be found at the [Onboarding
Confluence Page](https://solutions-catalog.atlassian.net/wiki/spaces/SOLUTIONS/pages/
196575233/New+Developer+Onboarding).

To configure and run the application, navigate to project directory and run the following commands:

 * yarn install
 * yarn dev

 This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

The application will run on localhost port 3002 by default.


## Copyright Information

Copyright © 2021 Digital Impact Alliance. This program is free software: you can 
redistribute it and/or modify it under the terms of the GNU Affero General 
Public License as published by the Free Software Foundation, either version 3 
of the License, or any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY 
WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A 
PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License along 
with this program.  If not, see <https://www.gnu.org/licenses/>.



