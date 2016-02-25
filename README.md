# Admin Application Template
This template application is a fairly full-featured starting point for building a single page application (SPA) and REST API using Angular 1.x and Node.  It uses
the excellent Bootstrap CSS library, so you can quickly make a sophisticated looking application without a lot of design skill
(e.g. a typical engineer!).

![Screenshot](public/images/homepage-screenshot.png "Homepage Screenshot")

It uses:

* [Node.js](https://nodejs.org)
* [Express](http://expressjs.com/)
* [Twitter Bootstrap](http://getbootstrap.com/)
* [Google Angular](https://angularjs.org/)
* [UI Bootstrap](http://angular-ui.github.io/bootstrap/)

And is supported by:

* [Babel](https://babeljs.io/)
* [Gulp](http://gulpjs.com/)
* [Mocha](https://mochajs.org/)
* [Nconf](https://github.com/indexzero/nconf)

With support for these deployment options (not required but still pretty cool):

* [Heroku](https://www.heroku.com/)
* [CircleCI](https://circleci.com/)
* [Docker](https://www.docker.com/)

## Quick Start

1. Clone this repo into a new directory
    ```
    $ git clone https://github.com/jbaumbach/admin-app.git myapp
    ```

1. Go to the directory and install dependencies
    ```
    $ cd myapp && npm install
    ```

1. Set up gulp if you don't have it already (removes any existing versions first):
    ```
    $ npm rm --global gulp && npm install --global gulp-cli
    ```

1. Start the server in dev mode:
    ```
    $ npm run dev
    ```

1. Open your favorite browser and check out your site:
    > <http://localhost:3000>

    and try an api call to see a list of users:
    ```
    $ curl http://localhost:3000/api/v1/users
    ```

## Background
As of this writing, two main technologies have emerged as great candidates to build your single page web-based application.

1. **React**  This technology from Facebook is has high rendering performance on the front end and can build
"Universal Javascript" applications.  This kind of app allows any url in your app to be rendered by the server
without having to load and run on the client first!  This is great for SEO.

1. **Angular**  This technology by Google was first on the scene, and therefore has built up a huge amount of support in the
developer community.  Angular is a complete and opinionated framework, so you have pretty clear instructions on how to
architect your application and you don't spend much time configuring your environment or having to make a lot of decisions.

Both frameworks are excellent and have their pros and cons.  As of this writing, I would choose React for building a
public facing site that has to be fast, efficient, and SEO friendly.  I would choose Angular for building
backend applications for your business, such as an admin site.  With two-way data binding and every plugin imaginable,
you can write a very complicated site quickly and easily.


## Development
The **gulp** build system is used in this project.  Gulp has been around a long time and there are plugins for just about
anything you can think of, and it's easy to understand, configure, and use.

You can use ES2015 Javascript on the frontend out of the box.  The **babel** transpiler is used to generate browser-safe ES5 files for you.
Your frontend javascript files are watched and rebuilt after every save.  Refresh your browser to see your changes during development.

The backend API files are watched by **nodemon** and the server is restarted when changes are noticed.

A nice todo would be to get hot-reloading working on the frontend.  This is pretty easy with **webpack's** dev server but a bit more of a
challenge with Gulp and Express.

### General File Structure
The files are arranged in typical Node.js and Angular fashion with some minor differences.
#### Backend
The backend consists of the Node/Express server that serves your API and all your application assets.
* **Controllers** are in the /controllers directory and serve your API and render any HTML using EJS.
* **Routes** are specified in the /bin/routes.js file
* **EJS** files are found in the /views directory.  Note, all HTML used by the front and back ends are stored here.  A minor
limitation of this architecture is the requirement to make sure all your Angular deep links are also served as a Node route on
the server.  Always just serve the index.ejs file.

#### Frontend
The frontend consists of all the assets required to show your SPA to the user.
* **Application** files are in the /public/javascripts/application directory, and are served by Express' static file server.
* **Bower Components** are found in the /public/javscripts/components directory.  Install new components like:
    ```
    $ bower install angular --save
    ```
    None of these files are checked into source control.  If you have any non-bower libs, put them in the
    /public/javascripts/application/lib directory.

* **Packages** for development are generated and stored in the /public/javascripts/dev directory.  These are not checked
into source control.  The build files for distribution are stored in the /public/javascripts/dist directory and ARE
checked into source control because Heroku.

### Configuration
You can pass config variables from your server to your frontend application pretty easily.  The template uses the excellent
**nconf** module to read settings from environment variables, config files, or command line params.  You specify the
variables to pass to the frontend in the backend index.js controller.

### Testing
Run unit and integration tests to make sure your code is working as expected.  This framework uses **Mocha** and **Should**.
All your test files are in the /test directory.

#### Backend
```
$ npm test
```

#### Frontend
An essential todo down the road is to implement a front end testing framework.  Angular is built from the ground
up with dependency injection (DI) in mind, so it's easy to get unit testing up and running.

## Deploying to Heroku
The template is set up with deployment to Heroku in mind.  As such, there's a **Procfile** for you and the deployment
strategy takes into account the need to check in all your application files to Git.

Use this task to automate all the required steps.  Only staging is supported at this time, but it's easy to add a
production step.

```
$ gulp deploy -e staging
```

What this does is:
* Generate minified versions (with sourcemaps!) of your frontend files.  They're all packed into two files, one for your
libs and one for your application files.
* Generates a cache-busting key used by the index.ejs file to make sure your users always use the latest version of your SPA
* Checks all this stuff into Git

Then, once you add your Heroku app as a remote to your local git, you can deploy everything with:
```
$ git push heroku
```

## Continuous Integration
A better solution than deploying from your workstation (for multiple developers at least!) is to use an automated
continuous integration process.  **CircleCI** is a nice cloud-based CI solution, and it can be configured to automatically
deploy your application to Heroku if the tests pass.  A sample **circle.yml** file is provided to build your app and test it.
There's also some commented-out code in the file that will push your code to Heroku!

## Docker
You can create a portable image of your site with Docker.
1. Make sure all your changes are done and checked into your repo's origin/master.
1. Build the docker image from origin/master:
    ```
    $ gulp dockerize
    ```
This will create an image "admin-app/sample-build" with port 3000 exposed as the main website.

### Deploying Your Docker Image to Amazon AWS
If you have an AWS account, you can deploy your docker image without too much bother.  To deploy to AWS:
1. Build the docker image as described above.
1. Create an AWS instance of Linux (see: http://docs.aws.amazon.com/AWSEC2/latest/UserGuide/launching-instance.html)
1. Ultimately your image needs to get to your Linux instance.  This is a very basic way to do it quickly using S3 as your
intermediate repository.  The official way is to use a paid private repository, but this is free and easy.  Export the docker
image as a .tar file:
    ```
    $ docker save -o admin-app-sample-build.tar admin-app/sample-build
    ```
1. Upload the .tar file to an S3 container and make it public.
1. SSH into your AWS Linux instance and install docker.
    ```
    $ ssh -i yourkeyfile.pem ec2-user@publicdns.us-west-2.compute.amazonaws.com

           __|  __|_  )
           _|  (     /   Amazon Linux AMI
          ___|\___|___|

    $ sudo yum install -y docker
    ...
    $ sudo service docker start
    ...

    ```
1. Download the .tar file from S3 with your public link:
    ```
    $ wget https://s3-us-west-2.amazonaws.com/yourcontainer/admin-app-sample-build.tar
    ```
1. Load your .tar into your local docker repository:
    ```
    $ docker load < admin-app-sample-build.tar
    ```
1. Fire up our app!
    ```
    $ docker run -p 80:3000 --name web --env NODE_ENV=staging admin-app/sample-build
    ```
1. Open up a browser and put in your AWS instance's url:
    > http://publicdns.us-west-2.compute.amazonaws.com/

## Troubleshooting Dev Setup
Sometimes, even in the best of templates, things go wrong.  Here are some possible solutions if you run into trouble.
### "bower install" complains about connection refused to Github
```
$ git config --global url."https://".insteadOf git://
```

## Todo
These items are in the works for when there's time.
* Login support with the "passport" Node middleware.  LocalStrategy only at first, but also support Google and FB login.
* Create login modal dialog box
* Store users in Firebase and call out from the backend API
* Authorization for API, based on a token or session id
* Caching of API calls in memcached, both anonymous and user-specific
* SASS compilation
