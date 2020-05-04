# Public Health Law Information Portal Frontend
Frontend for the Public Health Law Office project.

## Getting started
These instructions will get you a copy of the project up and running on your local machine in Docker containers for 
development and testing purposes. 

### Prerequisites
Below are a list of items that are required and optional for the development environment. Each item is linked to a page about installing it. Really, you only need Docker, the Node/Yarn/NPM are if you want to run the commands from the package.json file. You're welcome to just look at the package.json file and run the Docker commands instead. All of the code running is done in a Docker container, so the Node and NPM are taken care of there.
 
* [Docker](https://docs.docker.com/engine/installation/ "Installing Docker")- latest stable version
* [Node.js](https://nodejs.org/en/download/current/ "Installing Node")- v12.14.1
  (or, via [package manager](https://nodejs.org/en/download/package-manager/ "Installing Node via Package Manager"))
* NPM - (latest that installs when Node.js is installed)
* [Yarn](https://yarnpkg.com/lang/en/docs/install/ "Installing Yarn")- latest version

### Getting the code
```
$ git clone https://github.com/informaticslab/esquire-frontend.git
$ cd esquire-frontend
```

### Things to know before development
We are doing everything, from testing to building to running the code, in Docker containers. We are using docker-compose
for easy management of services. Inside the project there's a docker-compose.yml file. The compose file has two services, 
one for development environment and one for production environment. It references the two Dockerfiles that exist in the 
project as well -- Dockerfile (for dev) and Dockerfile-prod for production. Learn more about docker-compose [here](https://docs.docker.com/compose/ "Docker compose").

The project is setup so that when npm (or yarn) commands from the package.json are run, they are automatically executed 
with regard to containers. If you want to learn the exact docker-compose command that is used, look at the package.json.

NOTE: For all commands below, if you use npm instead of yarn, substitute the word __'yarn'__ with __'npm run'__.

### Building the Docker images
Before we can run the containers with the app, the docker images of the application need to be built. For your convenience,
there's a command that you can run that will build the image. 

What this command does is run docker-compose using the docker-compose.yml file in the project directory and builds the 
'dev' service. docker-compose reads the Dockerfile and performs those tasks. It moves all of the code into the image, 
and installs the dependencies with npm. You can see all of what is done in building the image by looking at the Dockerfile. 

```
$ yarn build:image:dev
```

### Running the containers
Now, that we've built the image, we can start the development container using the command below. The command uses 
docker-compose to rebuild the image and then start the container. 

Inside the container, a webpack-dev-server is running on port 3000. That port is exposed to port 3000 on localhost on 
your local machine. So, if you open a browser and go to <http://localhost:3000>, you will see the application running. 

There is also a volume of the code mounted inside the container. Since, a webpack-dev-server is running and a volume is
mounted, then any changes you make to the code on your local machine, the webpack-dev-server will pick up those changes
and restart without having to stop and start the container again. 
```
$ yarn start
```

## Running tests
For testing we use [Jest] and [Enzyme]. Jest as the test runner, assertion library, and mock library. Enzyme for making it 
easier to write React tests. 


#### Run once
Like all other aspects of the project, the tests are run inside the dev container as well. The command uses docker-compose
to create a new dev container and run a one-time command in it. 
```
$ yarn test
```

#### Watch for changes
If you want Jest to watch the files and re-run the tests when there are changes, use the command below. 

Since the command is run inside the dev container and we have the volume mounted, you can make changes to the code on 
your local machine, and Jest inside the container will pick up these changes and re-run the tests inside the container.
```
$ yarn test:watch
```

## Built With
* React.js
* Docker
* Node.js
* Webpack


[Jest]: https://facebook.github.io/jest/ "Jest"
[Enzyme]: http://airbnb.io/enzyme/ "Enzyme"


