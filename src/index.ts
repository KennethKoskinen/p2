import express, {Request, Response} from 'express';

const app = express();

app.get('/', (req: Request, res: Response) => {
    res.status(200).json({
        message: "Tere maailm!",
    });
});

app.listen(3000, () => {
    console.log("Server is running");
});