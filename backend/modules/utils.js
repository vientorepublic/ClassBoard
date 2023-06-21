const idRegex = new RegExp(/^[a-z]+[a-z0-9]{5,15}$/g);
const emailRegex = new RegExp(/^[a-zA-Z0-9+-\_.]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/);
const passwordRegex = new RegExp(/^(?=.*[a-zA-z])(?=.*[0-9])(?=.*[$`~!@$!%*#^?&\\(\\)\-_=+]).{8,32}$/);
const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

/**
 * 필수 유틸리티
 */
export class utils {
    /**
     * @param { number } len 
     * @returns { string }
     */
    genRandomString(len) {
            let result = '';
            for (let i = 0; i < len; i++) {
                result += characters.charAt(Math.floor(Math.random() * characters.length));
            }
            return result;
        }
        /**
         * @param { number } min 
         * @param { number } max 
         * @returns { number }
         */
    genRandomInt(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }
        /**
         * @param { string } mail 
         * @returns { boolean }
         */
    validateMail(address) {
            return emailRegex.test(address);
        }
        /**
         * @param { string } password 
         * @returns { boolean }
         */
    validatePassword(password) {
            return passwordRegex.test(password);
        }
        /**
         * @param { string } id 
         * @returns { boolean }
         */
    validateId(id) {
            return idRegex.test(id);
        }
        /**
         * @param { string } otp
         * @returns { boolean }
         */
    validateOTP(otp) {
        return isNaN(Number(otp)) || !String(otp).length > 6 ? true : false;
    }
}