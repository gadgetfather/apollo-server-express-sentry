import * as Sentry from "@sentry/node";
import express from "express";
export const createApp = ()=> {
    const app = express();
    Sentry.init({
        dsn: "https://263de62b20f90f49261d7e85d82ae83b@o4506615275716608.ingest.sentry.io/4506615277027328",
        integrations: [],
      });
      
      // The request handler must be the first middleware on the app
      app.use(Sentry.Handlers.requestHandler());
      const myLogger = function (req, res, next) {
        console.log('LOGGED')
        next()
      }
      app.use(myLogger)
      
      // All your controllers should live here
      app.get("/", function rootHandler(req, res) {
          throw new Error("Broke!");
        res.end("Hello world!");
      });
      
      // The error handler must be registered before any other error middleware and after all controllers
      app.use(Sentry.Handlers.errorHandler());
      
      // Optional fallthrough error handler
      app.use(function onError(err, req, res, next) {
        // The error id is attached to `res.sentry` to be returned
        // and optionally displayed to the user for support.
        res.statusCode = 500;
        res.end(res.sentry + "\n");
      });

    return app;
}