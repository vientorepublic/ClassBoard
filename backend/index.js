require('dotenv').config();
import fs from 'fs';
import _path from 'path';
import express, { json, urlencoded } from 'express';
import { connectDB } from './modules/mongodb_init';
import cookieParser from 'cookie-parser';
import asyncify from 'express-asyncify';
import cors from 'cors';
import { stream } from './modules/logger';
import morgan from 'morgan';
import { info, error } from 'consola';

connectDB(process.env.MONGODB_URL);

const app = asyncify(express());
app.use(json());
app.use(cookieParser());
app.use(urlencoded({ extended: true }));
app.use(morgan('combined', { stream }));
app.use(cors({
    origin: process.env.BACKEND_HOST,
    optionsSuccessStatus: 200
}));
app.disable('x-powered-by');

app.use('/', require('./main'));
fs.readdirSync(_path.join(__dirname, 'routes')).forEach(file => {
    if (file.endsWith('.js')) {
        try {
            const route = require(_path.join(__dirname, 'routes', file));
            app.use(`/${file.split('.')[0]}`, route);
            info(`Loaded Backend Router: ./routes/${file}`);
        } catch (err) {
            error(err);
        }
    }
});

app.get('*', (_req, res) => {
    return res.status(404).json({
        code: 404,
        message: 'The requested path could not be found.'
    });
});

export const path = '/api';
export const handler = app;