## Admin App Template

Shell of a Bootstrap-based admin page.

![Screenshot](public/images/homepage-screenshot.png "Homepage Screenshot")

It uses:

* [Node.js](https://nodejs.org)
* [Express](http://expressjs.com/)
* [Twitter Bootstrap](http://getbootstrap.com/)
* [Google Angular](https://angularjs.org/)
* [UI Bootstrap](http://angular-ui.github.io/bootstrap/)

### Dev Environment Setup

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

1. Start nodemon and the frontend file watcher during development:
    ```
    $ npm run dev
    ```

1. Open your favorite browser and check out your site:
    > <http://localhost:3000>

### Development
Your front end javascript files are watched and rebuilt after every save.  Refresh your browser to see your changes during development.

todo: get the hotreloading working

todo: store development-built files in a git-ignored directory.

### Testing
Run unit and integration tests to make sure your code is working as expected.
#### Backend
```
$ npm test
```

#### Frontend
todo: implement front end testing framework

(great tips but from 1 yr ago: http://developer.telerik.com/featured/planning-front-end-javascript-application/)

### Deployment
Deployment to Heroku requires all build files to be checked in to Git.  Use this task to make it easy:
```
$ gulp deploy -e staging
```
Down the road, CircleCI can be used to automatically deploy to Heroku if the tests pass.  For now, manually push
to production.

### Troubleshooting Dev Setup

#### "bower install" complains about connection refused to Github
```
$ git config --global url."https://".insteadOf git://
```