# Angular CSRF Protection Implementation

This project is a test for CSRF/XSRF Protection in Angular Stateless environments

## Angular Stateless CSRF Protection 

### Getting Started
Run `npm install`
Run `ng build` to create a compiled app `/dist/angular-stateless`
Run `npm run server-stateless` to launch express (server) on port 8080. 

Navigate to `http://localhost:8080/`. The application will automatically reload if you change any of the server.js settings.
**NOTE:** Using safari when testing on localhost will not work when setting cookies for cross-domains. Use Google Chrome instead. 

The server is using Angular pre-compiled files located in `/dist/angular-stateless` so that the server is running on the same port as the Angular web app. This is to avoid any issues with CORS blocking requests. 

This is using Node v18.12.1 (install a node manager `nvm` if you'd like to switch versions)

