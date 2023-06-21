import { connect, connection } from 'mongoose';
import { error, success } from 'consola';

/**
 * MongoDB에 연결하고 이벤트 리스너를 등록합니다.
 * @param { string } address
 * @returns { void }
 */
export const connectDB = (address) => {
    connect(address);
    let DB = connection;

    DB.on('error', (e) => {
        error(e);
    });

    DB.once('open', () => {
        success('MongoDB Connected!');
    });
}