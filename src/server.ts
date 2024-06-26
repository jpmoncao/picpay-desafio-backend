import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';

import UserRouter from './router/UserRouter.js';
import ShopkeeperRouter from './router/ShopkeeperRouter.js';
import WalletRouter from './router/WalletRouter.js';
import TransferRouter from './router/TransferRouter.js';

dotenv.config();
const app = express();

app.use(cors({ exposedHeaders: ['X-Pagination', 'X-Pagination-Pages'] }));
app.use(express.json());


app.use('/users', new UserRouter().router);
app.use('/shopkeepers', new ShopkeeperRouter().router);
app.use('/wallets', new WalletRouter().router);
app.use('/transfers', new TransferRouter().router);

app.get('/', (req, res) => {
    res.status(202).json({
        "list-all-users": process.env.API_ADDRESS + '/user',
        "list-user": process.env.API_ADDRESS + '/user/{id}',
        "create-user": process.env.API_ADDRESS + '/user/{id}',
        "edit-user": process.env.API_ADDRESS + '/user/edit/{id}',
        "delete-user": process.env.API_ADDRESS + '/user/delete/{id}',
    })
});

app.all('*', (req, res) => {
    res.status(404).json({
        message: "Route not found!",
        links: [
            {
                rel: 'home',
                href: process.env.API_ADDRESS + '/',
            }
        ]
    });
});


app.listen(process.env.API_PORT,
    () => console.log(`Server ping!\nRunning in port ${process.env.API_PORT}`)); 
