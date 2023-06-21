import { sign } from 'jsonwebtoken';

/**
 * JWT를 서명합니다.
 */
export class createToken {
    /**
     * 액세스 토큰을 서명합니다.
     * @param { string } id
     * @returns { string | null }
     */
    accessToken(id) {
            try {
                return sign({
                    id: id
                }, process.env.JWT_SECRET, {
                    expiresIn: process.env.JWT_EXPIRES_IN,
                    issuer: process.env.JWT_ISSUER
                });
            } catch (e) {
                return null;
            }
        }
        /**
         * 리프래시 토큰을 서명합니다.
         * @returns { string | null }
         */
    refreshToken() {
        try {
            return sign({}, process.env.JWT_SECRET, {
                expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
                issuer: process.env.JWT_ISSUER
            });
        } catch (e) {
            return null;
        }
    }
}