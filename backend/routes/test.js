import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  return res.json({ hello: 'world!' });
});

module.exports = router;