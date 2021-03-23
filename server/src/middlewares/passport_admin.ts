import { Passport } from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { CallbackError, Types } from "mongoose";
import ModelAdmin, { IAdminDocument } from "../models/schema/admin";
import passportConfigs from "../configs/passport";
import combineMiddleware from "../helpers/combine_middleware";

export const passportAdmin = new Passport();

// config session
passportAdmin.serializeUser(function (user, done) {
  done(null, (<IAdminDocument>user)?._id);
});

passportAdmin.deserializeUser(function (id, done) {
  ModelAdmin.findById(id, function (err: CallbackError, user: IAdminDocument) {
    done(err, user);
  });
});

// config authentication login-session
passportAdmin.use(
  passportConfigs.AUTH_SESSION,
  new LocalStrategy(
    {
      usernameField: "username",
      passwordField: "password",
      passReqToCallback: true,
    },
    async function (req, username, password, done) {
      const admin = await ModelAdmin.findOne({ username }).catch((err) => null);
      if (admin?.comparePassword?.(password)) {
        return done(null, admin);
      }
      return done(null, false);
    }
  )
);

export const passportAdminMiddleware = combineMiddleware(
  passportAdmin.initialize(),
  passportAdmin.session()
);
