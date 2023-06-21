import { Router } from 'express';
import { userSchema } from '../models/user';
import { createToken } from '../modules/create_token';
import { hash } from '../modules/hash';
import { utils } from '../modules/utils';
import { error } from 'consola';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

const router = Router();
const util = new utils();
const create = new createToken();


router.get('/', async(req, res) => {
    try {
        const id = req.body.id;
        const password = req.body.password;
        const now = dayjs().valueOf();

        if (id === '' || id === undefined || password === '' || password === undefined) {
            return res.status(400).json({
                code: 400,
                message: 'Parameter is not valid.'
            });
        }

        if (!util.validateId(id)) {
            return res.status(400).json({
                code: 400,
                message: 'ID는 영문 5자리 이상, 15자리 이하여야 하며, 숫자를 포함할 수 있습니다.'
            });
        }

        if (!util.validatePassword(password)) {
            return res.status(400).json({
                code: 400,
                message: '비밀번호는 8자리 이상, 32자리 이하여야 하며, 숫자/특수문자를 모두 포함해야 합니다.'
            });
        }

        const check = await userSchema.findOne({ id: id });
        if (check) {
            return res.status(400).json({
                code: 400,
                message: '해당 ID가 이미 사용중 입니다.'
            });
        }

        const encrypted = new hash(password).encrypt();
        const data = new userSchema({
            id: id,
            password: encrypted,
            createdAt: now
        });

        data.save().then(() => {
            return res.json({
                code: 200,
                message: '회원가입이 완료되었습니다.'
            });
        }).catch((_err) => {
            return res.status(500).json({
                code: 500,
                message: 'An error occurred while processing your request. (Save Failed)'
            });
        });

    } catch (err) {
        error(err);
        return res.status(500).json({
            code: 500,
            message: 'An error occurred while processing your request.'
        });
    }
});

module.exports = router;