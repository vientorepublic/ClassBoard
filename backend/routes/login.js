import { Router } from 'express';
import { userSchema } from '../models/user';
import { createToken } from '../modules/create_token';
import { hash } from '../modules/hash';
import { utils } from '../modules/utils';
import { getClientIp } from 'request-ip';
import { error } from 'consola';

const router = Router();
const util = new utils();

router.post('/', async (req, res) => {
  try {
    const id = req.body.id;
    const password = req.body.password;
    const ip = getClientIp(req);

    if (id === '' || id === undefined || password === '' || password === undefined) {
      return res.status(400).json({
        code: 400,
        message: 'Parameter is not valid.'
      });
    }

    if (util.validateMail(id)) {
      const user = await userSchema.findOne({ email: id });
      if (user) {
        const compare = await new hash(password, user.password).compare();
        if (compare) {
          const accessToken = new createToken().accessToken(user.id);
          const refreshToken = new createToken().refreshToken();
          await user.updateOne({
            $set: {
              refresh_token: refreshToken,
              latest_ipaddr: ip
            }
          }).exec();

          res.cookie('accessToken', accessToken, {
            maxAge: 3600000
          });
          res.cookie('refreshToken', refreshToken, {
            maxAge: 604800000
          });

          return res.json({
            code: 200,
            message: 'Token Created!',
            data: {
              accessToken,
              refreshToken
            }
          });
        } else {
          return res.status(401).json({
            code: 401,
            message: 'ID 또는 비밀번호가 일치하지 않습니다.'
          });
        }
      } else {
        return res.status(401).json({
          code: 401,
          message: 'ID 또는 비밀번호가 일치하지 않습니다.'
        });
      }
    } else {
      const user = await userSchema.findOne({ id: id });
      if (user) {
        const compare = await new hash(password, user.password).compare();
        if (compare) {
          const accessToken = new createToken().accessToken(user.id);
          const refreshToken = new createToken().refreshToken();
          await user.updateOne({
            $set: {
              refresh_token: refreshToken,
              latest_ipaddr: ip
            }
          }).exec();

          res.cookie('accessToken', accessToken, {
            maxAge: 3600000
          });
          res.cookie('refreshToken', refreshToken, {
            maxAge: 604800000
          });

          return res.json({
            code: 200,
            message: 'Token Created!',
            data: {
              accessToken,
              refreshToken
            }
          });
        } else {
          return res.status(401).json({
            code: 401,
            message: 'ID 또는 비밀번호가 일치하지 않습니다.'
          });
        }
      } else {
        return res.status(401).json({
          code: 401,
          message: 'ID 또는 비밀번호가 일치하지 않습니다.'
        });
      }
    }
  } catch (err) {
    error(err);
    return res.status(500).json({
      code: 500,
      message: 'An error occurred while processing your request.'
    });
  }
});

module.exports = router;