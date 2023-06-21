import { Router } from 'express';
import { error } from 'consola';

const router = Router();

router.get('/', (req, res) => {
    try {
        return res.json({
            code: 200,
            message: 'Hello, World!'
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