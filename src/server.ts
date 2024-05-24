import dotenv from 'dotenv';
import express from 'express';

import UserRouter from './router/UserRouter.js';
import LojistaRouter from './router/LojistaRouter.js';
import CarteiraRouter from './router/CarteiraRouter.js';

dotenv.config();
const app = express();

app.use(express.json());

app.use('/user', new UserRouter().router);
app.use('/lojista', new LojistaRouter().router);
app.use('/carteira', new CarteiraRouter().router);

app.use('/', (req, res) => {
    res.status(202).json({
        "list-all-users": process.env.API_ADDRESS + '/user',
        "list-user": process.env.API_ADDRESS + '/user/{id}',
        "create-user": process.env.API_ADDRESS + '/user/{id}',
        "edit-user": process.env.API_ADDRESS + '/user/edit/{id}',
        "delete-user": process.env.API_ADDRESS + '/user/delete/{id}',
    })
});

app.listen(process.env.API_PORT,
    () => console.log(`Server ping!\nRunning in port ${process.env.API_PORT}`)); 
