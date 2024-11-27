import UserModel from "../models/user.js";
import bcryptjs from 'bcryptjs'

// Get All Users
const getUsers = async (req, res) => {
  try {
    const users = await UserModel.find();
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
    console.log(error);
  }
};

// Add a New User
const addUser = async (req, res) => {
    // console.log("Request body:", req.body);
  try {
    const { name, email, role} = req.body;
    // console.log(req.body)

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already exists" });
    }

    const password = "Test@123"
    const hashpassword = await bcryptjs.hash(password, 10)
    // console.log(hashpassword)
    const newUser= new UserModel({
        name, email, role, password:hashpassword
    })
    
      await newUser.save()

    res.status(201).json({ message: "User added successfully", user: newUser });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
    console.log(error);
  }
};

// Edit an Existing User
const editUser = async (req, res) => {
  try {
    const userId = req.params.id; // Target user to be edited
    console.log(req.body)
    let { name, email, role, status, currUser } = req.body; 

    // Fetch the target user (user to be edited)
    const userToEdit = await UserModel.findById(userId);

    // fetch the user who is changing the target user (currUser sent from frontend might not have updated permissions)
    currUser = await UserModel.findOne({ email: currUser.email });
    // console.log(currUser, userToEdit)

    if (!userToEdit) {
      return res.status(404).json({ message: "User not found" });
    }

    // 1. Admins can only modify themselves
    if (userToEdit.role === "admin") {
      if (currUser._id.toString() !== userToEdit._id.toString()) {
        return res.status(409).json({ message: "You cannot modify an admin user" });
      }
    }

    // 2. Mods cannot modify other mods
    if (userToEdit.role === "mod") {
      // console.log(currUser)
      if (currUser.role !== 'admin' && currUser._id.toString() !== userToEdit._id.toString()) {
        // console.log("In")
        return res.status(403).json({ message: "Mods cannot modify other mods." });
      }
    }

    // console.log(currUser)
    // 3. Mods can modify normal users if they have 'Write' permission
    if (userToEdit.role === "user") {
      if (
        currUser.role === "mod" &&
        (!currUser.permissions || !currUser.permissions.includes("Write"))
      ) {
        console.log("In")
        return res
          .status(403)
          .json({ message: "You do not have the required permissions to modify this user." });
      }
    }

    // 4. Normal users can only modify themselves
    if (currUser.role === "user" && currUser._id.toString() !== userToEdit._id.toString()) {
      return res.status(403).json({ message: "You are not authorized to modify this user." });
    }

    // 5. Mods and users cannot update the role to 'mod' or 'admin'
    if (
      ["mod", "admin"].includes(role) && // if the new role is mod or admin
      (currUser.role === "mod" || currUser.role === "user") // Ensure current user is not admin
    ) {
      return res
        .status(403)
        .json({ message: "You cannot assign 'mod' or 'admin' roles to a user." });
    }

    // Update the user
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { name, email, role, status },
      { new: true, runValidators: true }
    );

    res.status(200).json({ message: "User updated successfully", user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
    console.error(error);
  }
};


// Delete a User
const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role === "admin") {
      return res.status(409).json({ message: "You cannot delete an admin user" });
    }

    await UserModel.findByIdAndDelete(userId);

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
    console.log(error);
  }
};

// Toggle User Status
const toggleStatus = async (req, res) => {
  try {
    const userId = req.params.id;
    const { status } = req.body;

    const userToBeChanged = await UserModel.findById(userId);

    if(userToBeChanged.role === 'admin'){
      return res.status(401).json({message: "You cannot change status of an admin!"})
    }

    userToBeChanged.status = status;

    if(userToBeChanged.status === "Inactive"){
      userToBeChanged.permissions = []
    }else if(userToBeChanged.status === "Active"){
      userToBeChanged.permissions = ['Read']
    }

    userToBeChanged.save();

    res.status(200).json({ message: "User status updated successfully", user: userToBeChanged });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
    console.log(error);
  }
};


const updatePermissions = async (req, res) => {
  const userId = req.params.id;
  const { permissions } = req.body;
 // console.log(req.body)
  try {
    // console.log(userId)
    const user = await UserModel.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    if(permissions.includes('Delete')){
      return res.status(404).json({ message: 'Cannot grant delete permission to a mod or user!' });
    }

    if(user.role === 'user' && permissions.includes('Write')){
      return res.status(404).json({ message: 'Cannot grant Write permission to a user!' });
    }

    user.permissions = permissions;
    await user.save();
    console.log(user)
    return res.status(200).json({ message: 'Permissions updated successfully.', user });
  } catch (error) {
    console.error('Error updating permissions:', error);
    return res.status(500).json({ message: 'Internal Server Error.' });
  }
};


export { getUsers, addUser, editUser, deleteUser, toggleStatus, updatePermissions };
