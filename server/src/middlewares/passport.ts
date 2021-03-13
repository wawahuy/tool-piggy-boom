import passport from "passport";
import { Express } from "express";
import { Strategy as LocalStrategy } from "passport-local";
import { CallbackError, Types } from "mongoose";
import ModelAdmin, { IAdminDocument } from "../models/schema/admin";
import passportConfigs from "../configs/passport";

export default function initMiddlewarePassport() {
  // config session
  passport.serializeUser(function (user, done) {
    done(null, (<IAdminDocument>user)?._id);
  });

  passport.deserializeUser(function (id, done) {
    ModelAdmin.findById(
      id,
      function (err: CallbackError, user: IAdminDocument) {
        done(err, user);
      }
    );
  });

  // config authentication login-session
  passport.use(
    passportConfigs.AUTH_SESSION,
    new LocalStrategy(
      {
        usernameField: "username",
        passwordField: "password",
        passReqToCallback: true,
      },
      async function (req, username, password, done) {
        const admin = await ModelAdmin.findOne({ username }).catch(
          (err) => null
        );
        if (admin?.comparePassword?.(password)) {
          return done(null, admin);
        }
        return done(null, false);
      }
    )
  );
}
