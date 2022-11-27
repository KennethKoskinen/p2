import express, {Request, Response} from 'express';

const app = express();
const PORT = 3000;

app.use(express.json());

interface INewUser {
    
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

interface IUser extends INewUser {
    id: number
}

const users: IUser[] = [
    {   
        id: 1,
        firstName : 'Juhan',
        lastName : 'Juurikas',
        email: 'juhanjuurikas@gmail.com',
        password: 'juhan' 
    }
];

app.get('/api/v1/health', (req: Request, res: Response) => {
    res.status(200).json({
        message: "Tere maailm!",
    });
});

app.get('/api/v1/users', (req: Request, res: Response) => {
    res.status(201).json({
        success: true,
        message: 'List of users',
        users
    });
});

app.post('/api/v1/users', (req: Request, res: Response) => {
    const {firstName, lastName, email, password} = req.body;
    const id = users.length + 1; 
    const newUser: IUser = {
        id,
        firstName,
        lastName,
        email,
        password
    }
    users.push(newUser);
     
    return res.status(201).json({
        success: true,
        message: `User with id ${newUser.id} created. `,
        
    });
});

app.delete('/api/v1/users/:id', (req: Request, res: Response) => {
    const id = parseInt(req.params.id) ;
    const index = users.findIndex(element => element.id === id);
    if (index === -1) {
        return res.status(404).json({
            success: false,
            message: `User not found. `,
            
        });
    }
    users.splice(index, 1);
    return res.status(200).json({
        success: true,
        message: `User deleted. `,
        
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});