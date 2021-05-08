import { Passport } from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { CallbackError, Types } from "mongoose";
import ModelAdmin, { IAdminDocument } from "../models/schema/admin";
import passportConfigs from "../configs/passport";
import combineMiddleware from "../helpers/combine_middleware";
import ModelAccountGame, { IAccountGameDocument } from "../models/schema/account_game";

export const passportUser = new Passport();

// config session
passportUser.serializeUser(function (user, done) {
  done(null, (<IAccountGameDocument>user)?._id);
});

passportUser.deserializeUser(function (id, done) {
  ModelAccountGame.findById(id, function (err: CallbackError, user: IAccountGameDocument) {
    done(err, user);
  });
});

// config authentication login-session
passportUser.use(
  passportConfigs.AUTH_SESSION,
  new LocalStrategy(
    {
      usernameField: "uid",
      passwordField: "password",
      passReqToCallback: true,
    },
    async function (req, uid, pwd, done) {
      const account = await ModelAccountGame.findOne({ uid }).catch((err) => null);
      if (!account) {
        return done(null, false, { message: "UID này chưa tham gia vào tools"});
      }
      if (account.pwd !== pwd) {
        return done(null, false, { message: "Mật khẩu không hợp lệ"});
      }
      return done(null, account);
    }
  )
);

export const passportUserMiddleware = combineMiddleware(
  passportUser.initialize(),
  passportUser.session()
);
