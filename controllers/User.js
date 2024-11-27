import UserModel from "../models/user.js";

const getAllUsers = async(req, res) => {
    
    try{
        console.log('Cookies set:', res.getHeaders()['set-cookie']);
        const user = req.user;
        let users;
        if(user.role === "admin")
            users = await UserModel.find({});
        else if(user.role === "mod")
            users = await UserModel.find({role: {$in: ["mod", "user"]}})
        else    
            users = await UserModel.find({role: {$in: ["user"]}})

            // console.log(users)
        res.status(200).json({ users });
    }catch(err){
        console.error(err);
        res.status(500).json({ message: 'Failed to fetch users' });
    }
}

export {getAllUsers}