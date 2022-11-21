# AngularStateful

This project is a test for CSRF/XSRF Protection in Angular Stateful environments

## Development server

Run `npm run start` to launch  angular on port 4200
Run `npm run server-stateful` to launch express (server) on port 8080. 

Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

### Breakdown:
Located in `scripts` within the package.json:
node server.js & run this server in the background
ng serve & run this service in the foreground
fg move the most recently backgrounded shell into the foreground