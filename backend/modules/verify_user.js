import { createToken } from '../modules/create_token';
import { verifyToken } from '../modules/verify_token';
import { userSchema } from '../models/user';
import { getClientIp } from 'request-ip';
import { error } from 'consola';

export const verifyUser = async(req, res, next) => {
    try {
        const accessToken = req.cookies['accessToken'];
        const refreshToken = req.cookies['refreshToken'];
        const ip = getClientIp(req);

        const access = new verifyToken(accessToken).verifyAccess();
        const refresh = await new verifyToken(refreshToken).verifyRefresh();

        if (access === null && refresh === null) {
            if (accessToken !== undefined) res.clearCookie('accessToken');
            if (refreshToken !== undefined) res.clearCookie('refreshToken');
            return res.status(401).json({
                code: 401,
                message: 'Authorization Required.'
            });
        } else if (access === null) {
            const user = await userSchema.findOne({ refresh_token: refreshToken });
            if (user.latest_ipaddr !== ip) {
                user.updateOne({
                    $set: {
                        latest_ipaddr: ip
                    }
                }).exec();
            }
            const newAccess = new createToken().accessToken(user.id);
            res.cookie('accessToken', newAccess, {
                maxAge: 3600000
            });
            return next();
        } else if (refresh === null) {
            const newRefresh = new createToken().refreshToken();
            const user = await userSchema.findOne({ id: access.id });
            if (user.latest_ipaddr !== ip) {
                await user.updateOne({
                    $set: {
                        refresh_token: newRefresh,
                        latest_ipaddr: ip
                    }
                }).exec();
            } else {
                await user.updateOne({
                    $set: {
                        refresh_token: newRefresh
                    }
                }).exec();
            }
            res.cookie('refreshToken', newRefresh, {
                maxAge: 604800000
            });
            return next();
        } else {
            return next();
        }
    } catch (err) {
        error(err);
        return res.status(500).json({
            code: 500,
            message: 'An error occurred while processing your request.'
        });
    }
}