import fs from 'fs';
import _path from 'path';
import express, { json, urlencoded } from 'express';
import cookieParser from 'cookie-parser';
import asyncify from 'express-asyncify';
import cors from 'cors';
import consola from 'consola';

const app = asyncify(express());
app.use(json());
app.use(cookieParser());
app.use(urlencoded({ extended: true }));
app.use(cors({
  origin: process.env.BACKEND_HOST,
  optionsSuccessStatus: 200
}));
app.disable('x-powered-by');

fs.readdirSync(_path.join(__dirname, 'routes')).forEach(file => {
  if (file.endsWith('.js')) {
    try {
      const route = require(_path.join(__dirname, 'routes', file));
      app.use(`/${file.split('.')[0]}`, route);
      consola.info(`Loaded Backend Router: ./routes/${file}`);
    } catch (err) {
      consola.error(err);
    }
  }
});

export const path = '/api';
export const handler = app;