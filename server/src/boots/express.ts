import Express from 'express';

const expressApp = Express();

expressApp.use(Express.json());

// test add
import ModelAccountGame from '../models/schema/account_game';
expressApp.post('/addUserProxy', async (req, res) => {
  const m = {
    uid: req.body.uid,
    loginType: req.body.data.loginType,
    access_token: req.body.data.access_token,
    deviceToken: req.body.data.deviceToken,
    mac: req.body.data.mac,
    deviceModel: req.body.data.deviceModel,
  };
  const r  = await ModelAccountGame.updateOne({ uid: req.body.uid }, m, { upsert: true }).then(e => null);
  res.send(r);
});

export default expressApp;