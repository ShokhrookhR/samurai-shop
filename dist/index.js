"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const routes_1 = require("./routes");
const db_1 = require("./repositories/db");
const app = (0, express_1.default)();
const PORT = 3000;
let requestCounter = 0;
const bodyMiddleware = express_1.default.json();
const requestCounterMiddleware = (req, res, next) => {
    requestCounter++;
    console.log(`Request #${requestCounter} - ${req.method} ${req.url}`);
    next();
};
app.use(bodyMiddleware);
app.use(requestCounterMiddleware);
app.get('/', (req, res) => {
    console.log('Hello World Kuku');
    res.status(200).send({ message: 'Hello World Kuku' });
});
app.use('/clubs', (0, routes_1.getClubRoutes)());
app.use('/products', (0, routes_1.getProductRoutes)());
app.use('/auth', (0, routes_1.getAuthRoutes)());
const startApp = () => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, db_1.runDB)();
    app.listen(PORT, () => {
        console.log(`Server is running on port:${PORT}`);
    });
});
startApp();
