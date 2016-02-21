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

## Quick Start

1. Clone this repo into a new directory
    ```
    $ git clone https://github.com/jbaumbach/admin-app.git myapp
    ```

1. Go to the directory and install dependencies
    ```
    $ cd myapp && npm install
    ```

1. Set up gulp (removing any existing versions first):
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

You can use ES2015 Javascript on the frontend out of the box.  The babel transpiler is used to generate browser-safe ES5 files for you.
Your frontend javascript files are watched and rebuilt after every save.  Refresh your browser to see your changes during development.

The backend API files are watched by nodemon and the server is restarted when changes are noticed.

A nice todo would be to get hot-reloading working on the frontend.  This is pretty easy with **webpack's** dev server but a bit more of a
challenge with Gulp and Express.

### Testing
Run unit and integration tests to make sure your code is working as expected.  This framework uses **Mocha** and **Should**.
#### Backend
```
$ npm test
```

#### Frontend
An essential todo down the road is to implement a front end testing framework.  Angular is built from the ground
up with dependency injection (DI) in mind, so it's easy to get unit testing up and running.

## Deployment
The template is set up with deployment to Heroku in mind.  As such, there's a **Procfile** for you and the deployment
strategy takes into account the need to check in all your application files to Git.

Use this task to automate all the required steps.  Only staging is supported at this time, but it's easy to add a
production step.

```
$ gulp deploy -e staging
```

What this does is:
* Generate minified versions (with sourcemaps!) of your frontend files
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

## Troubleshooting Dev Setup
Sometimes, even in the best of templates, things go wrong!  Here are some possible solutions if you run into trouble.
### "bower install" complains about connection refused to Github
```
$ git config --global url."https://".insteadOf git://
```