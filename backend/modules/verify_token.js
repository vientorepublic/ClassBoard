import { verify } from 'jsonwebtoken';
import { userSchema } from '../models/user';

/**
 * 액세스 토큰을 디코딩하여 페이로드를 반환하거나, DB 정보와 일치시켜 유효 여부를 확인합니다.
 */
export class verifyToken {
    /**
     * @param { string } token
     */
    constructor(token) {
            this.token = token;
        }
        /**
         * 액세스 토큰을 검사합니다. 유효한 경우, 디코딩된 페이로드가 반환됩니다.
         * @returns { object | null }
         */
    verifyAccess() {
            try {
                return verify(this.token, process.env.JWT_SECRET);
            } catch (e) {
                return null;
            }
        }
        /**
         * 리프래시 토큰을 DB 정보와 일치시켜 유효한지 확인합니다. 유효한 경우, 디코딩된 페이로드가 반환됩니다.
         * @returns { object | null }
         */
    async verifyRefresh() {
        try {
            const checkToken = await userSchema.findOne({ refresh_token: this.token });
            if (checkToken) {
                return verify(checkToken.refresh_token, process.env.JWT_SECRET);
            } else {
                return null;
            }
        } catch (e) {
            return null;
        }
    }
}