# Angular CSRF Protection Implementation

This project is a test for CSRF/XSRF Protection in Angular Stateful environments

## Angular Stateful CSRF Protection 

### Getting Started
Run `npm install`
Run `ng build` to create a compiled app `/dist/angular-stateful`
Run `npm run server-stateful` to launch express (server) on port 8080. 

Navigate to `http://localhost:8080/`. The application will automatically reload if you change any of the server.js settings.

The server is using Angular pre-compiled files located in `/dist/angular-stateful` so that the server is running on the same port as the Angular web app. This is to avoid any issues with CORS blocking requests. 

This is using Node v18.12.1 (install a node manager `nvm` if you'd like to switch versions)

