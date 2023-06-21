import bcrypt from 'bcrypt';

/**
 * 비밀번호 해싱/비교 모듈
 */
export class hash {
    /**
     * @param { string } password 
     * @param { string } encrypted 
     */
    constructor(password, encrypted) {
            this.password = password;
            this.encrypted = encrypted;
        }
        /**
         * 비밀번호를 해싱합니다.
         * @returns { string | null }
         */
    async encrypt() {
            try {
                return bcrypt.hash(this.password, 10);
            } catch (e) {
                return null;
            }
        }
        /**
         * 해싱된 비밀번호를 평문 비밀번호와 비교합니다.
         * @returns { boolean | null }
         */
    async compare() {
        try {
            return bcrypt.compare(this.password, this.encrypted);
        } catch (e) {
            return null;
        }
    }
}