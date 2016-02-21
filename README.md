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
    $ npm rm --global gulp
    $ npm install --global gulp-cli
    ```

1. Start nodemon and the frontend file watcher:
    ```
    $ gulp
    ```

1. Open your favorite browser and check out your site:
    > <http://localhost:3000>
