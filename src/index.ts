// Must be the first import: modules below read process.env at import time
import 'dotenv/config';
import express, {NextFunction, Request, Response} from 'express';
import {
    getAuthRoutes,
    getClubRoutes,
    getProductRoutes,
    getFeedbackRoutes,
} from './routes';
import {runDB} from './repositories/db';

const app = express();
const PORT = process.env.APP_PORT || 3000;
let requestCounter = 0;
const bodyMiddleware = express.json();
const requestCounterMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    requestCounter++;
    console.log(`Request #${requestCounter} - ${req.method} ${req.url}`);
    next();
};
app.use(bodyMiddleware);
app.use(requestCounterMiddleware);
app.get('/', (req, res) => {
    console.log('Hello World Kuku');
    res.status(200).send({message: 'Hello World Kuku'});
});
app.use('/clubs', getClubRoutes());
app.use('/products', getProductRoutes());
app.use('/auth', getAuthRoutes());
app.use('/feedbacks', getFeedbackRoutes());

const startApp = async () => {
    await runDB();
    app.listen(PORT, () => {
        console.log(`Server is running on port:${PORT}`);
    });
};
startApp().catch((error) => {
    console.error('Failed to start app', error);
    process.exit(1);
});
