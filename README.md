# PHLIP Frontend
This repository holds the code for the UI the PHLIP project. There are other repositories that make up this project, they can be found here:
- Projects Backend API - [phlip-backend](https://github.com/CDCgov/phlip-backend)
- Document Management API - [phlip-doc-management](https://github.com/CDCgov/phlip-doc-management)

## Getting started
These instructions will get you a copy of the project up and running on your local machine.

### Prerequisites
Below are a list of items that are required and optional for the development environment. Each item is linked to a page about installing it. 

* [Node.js](https://nodejs.org/en/download/current/ "Installing Node") - v12.14.1
  (or, via [package manager](https://nodejs.org/en/download/package-manager/ "Installing Node via Package Manager"))
* NPM - (latest that installs when Node.js is installed)

### Getting the code
```bash
$ git clone https://github.com/CDCgov/phlip.git
$ cd phlip
```

### Installing modules
Before we can run the application, we have to install node_module dependencies. Use the command below to install node_module dependencies.
```bash
$ npm install
```

### Creating .env file
The application relies on evironment variables like API urls. Use the command below to copy .env.template to .env to use the default values.
```bash
$ cp .env.template .env
```

### Running the application
Use the command below to run the application in development mode. The application will start on http://localhost:5200. You can use the default user tester1@test.gov to log in.
```bash
$ npm run start
```

## Running tests
For testing we use [Jest] and [Enzyme]. Jest as the test runner, assertion library, and mock library. Enzyme for making it 
easier to write React tests. 

#### Run once
Run tests once on the code.

```bash
$ npm run test
```

#### Watch for changes
If you want Jest to watch the files and re-run the tests when there are changes, use the command below. 

```bash
$ npm run test:watch
```

## Built With
* React.js
* Node.js
* Webpack

[Jest]: https://facebook.github.io/jest/ "Jest"
[Enzyme]: http://airbnb.io/enzyme/ "Enzyme"