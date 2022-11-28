import express, {Request, Response} from 'express';
import { nodeModuleNameResolver, servicesVersion } from 'typescript';

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

interface INewPost {
    userId: number,
    title: string,
    content: string,
    statusId: number;
}

interface IPost extends INewPost {
    id:number;
} 

interface INewPostStatus {
    status: string;
}

interface IPostStatus extends INewPostStatus {
    id: number;
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
const posts: IPost[] = [
    {
        id: 1,
        title: 'Esimene postitus',
        content: 'Esimese postituse sisu',
        userId: 1,
        statusId: 1
    },
    {
        id: 2,
        title: 'Teine postitus',
        content: 'Teine postituse sisu',
        userId: 1,
        statusId: 1
    }
]

const postStatuses: IPostStatus[] = [
    {
        id: 1,
        status: 'Draft',
    },
    {
        id: 2,
        status: 'Public',
    },
    {
        id: 3,
        status: 'Private',
    }
]

// API endpointi testmiseks
app.get('/api/v1/health', (req: Request, res: Response) => {
    res.status(200).json({
        message: "Tere maailm!",
    });
});
//k6ik kasutajad
app.get('/api/v1/users', (req: Request, res: Response) => {
    res.status(201).json({
        success: true,
        message: 'List of users',
        users
    });
});

//kasutaja p2rimine id alusel
app.get('/api/v1/users/:id', (req: Request, res: Response) => {
    const id = parseInt(req.params.id) ;
    const user = users.find(element => {
        return element.id === id;
    })
    if (!user) {
        return res.status(404).json({
            success: false,
            message: `User not found. `,
            
        });
    }
    
    return res.status(200).json({
        success: true,
        message: `User. `,
        data: {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email
        }
        
    });
});
//Kasutaja muutmine
app.patch('/api/v1/users/:id', (req: Request, res: Response) => {
    const id = parseInt(req.params.id) ;
    const {firstName, lastName, email, password} = req.body;
    const user = users.find(element => {
        return element.id === id;
    })
    if (!user) {
        return res.status(404).json({
            success: false,
            message: `User not found. `,
            
        });
    }
    if (!firstName && !lastName && !email &&!password) {
        return res.status(400).json({
            success: false,
            message: `Nothing to change. `,
            
        });
    }
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (email) user.email = email;
    if (password) user.password = password;
    
    return res.status(200).json({
        success: true,
        message: `User updated. `,

        
    });
});

//Kasutaja loomine
app.post('/api/v1/users', (req: Request, res: Response) => {
    const {firstName, lastName, email, password} = req.body;
    if (!firstName || !lastName || !email || !password) {
        return res.status(400).json({
            success: false,
            message: `Some data is missing(first name, last name, email, password). `,
            
        });
    }
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
//kasutaja kustutamine
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





//postituse loomine
app.post('/api/v1/posts', (req: Request, res: Response) => {
    const {title, content, userId, statusId} = req.body;
    if (!title || !content || !userId || !statusId) {
        return res.status(400).json({
            success: false,
            message: `Some data is missing(title, content, userId, statusId). `,
            
        });
    }
    const id = posts.length + 1; 
    const newPost: IPost = {
        id,
        title,
        content,
        userId,
        statusId
    }
    posts.push(newPost);
     
    return res.status(201).json({
        success: true,
        message: `Post with id ${newPost.id} created. `,
        
    });
});

app.delete('/api/v1/posts/:id', (req: Request, res: Response) => {
    const id = parseInt(req.params.id) ;
    const index = posts.findIndex(element => element.id === id);
    if (index === -1) {
        return res.status(404).json({
            success: false,
            message: `Post not found. `,
            
        });
    }
    posts.splice(index, 1);
    return res.status(200).json({
        success: true,
        message: `Post deleted. `,
        
    });
});

//postituse muutmine
app.patch('/api/v1/posts/:id', (req: Request, res: Response) => {
    const id = parseInt(req.params.id) ;
    const {title, content, statusId} = req.body;
    const post = posts.find(element => {
        return element.id === id;
    })
    if (!post) {
        return res.status(404).json({
            success: false,
            message: `Post not found. `,
            
        });
    }
    if (!title && !content && !statusId) {
        return res.status(400).json({
            success: false,
            message: `Nothing to change. `,
            
        });
    }
    if (title) post.title = title;
    if (content) post.content = content;
    if (statusId) post.statusId = statusId;
    
    
    return res.status(200).json({
        success: true,
        message: `Post updated. `,

        
    });
});


//k6ikide postituste staatuse p2rmine endpoint
app.get('/api/v1/posts/statuses', (req: Request, res: Response) => {
    res.status(201).json({
        success: true,
        message: 'List of post statuses',
        postStatuses,
    });
});

//staatuse p2rimine staatuse id alusel
app.get('/api/v1/posts/statuses/:id', (req: Request, res: Response) => {
    const id = parseInt(req.params.id) ;
    const postStatus = postStatuses.find(element => {
        return element.id === id;
    })
    if (!postStatus) {
        return res.status(404).json({
            success: false,
            message: `Post status not found. `,
            
        });
    }
    
    return res.status(200).json({
        success: true,
        message: `Post status. `,
        data: {
            postStatus,
        },
        
    });
});

//K6ikide postituste p2rimise endpoint
app.get('/api/v1/posts', (req: Request, res: Response) => {
    res.status(201).json({
        success: true,
        message: 'List of posts',
        posts
    });
});

//postituse p2rimine id alusel
app.get('/api/v1/posts/:id', (req: Request, res: Response) => {
    const id = parseInt(req.params.id) ;
    const post = posts.find(element => {
        return element.id === id;
    })
    if (!post) {
        return res.status(404).json({
            success: false,
            message: `Post not found. `,
            
        });
    }
    let postStatus: IPostStatus | undefined = postStatuses.find(element => element.id === post.statusId);
    if (!postStatus){
        postStatus = {
            id: 0,
            status: 'Unknown',
        }
    };
    let user: IUser | undefined = users.find(element => element.id === post.userId);
    if (!user) {
        user = {
            id: 0,
            firstName: 'Unknown',
            lastName: 'Unknown',
            email: 'Unknown',
            password: 'unknown',
        }
    };
    const postWithStatusAndUser = {
        id: post.id,
        title: post.title,
        user: {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
        },
        status: postStatus,
    };
    return res.status(200).json({
        success: true,
        message: `Post. `,
        data: {
            post: postWithStatusAndUser,
        },
        
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});