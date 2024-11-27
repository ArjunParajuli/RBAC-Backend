import express from 'express'
import { getUsers, deleteUser, editUser, toggleStatus, addUser, updatePermissions } from '../controllers/Admin.js'
import { isAdmin } from '../middleware/verifyToken.js'

const AdminRoutes=express.Router()

 AdminRoutes.get('/getuser',isAdmin, getUsers)
 AdminRoutes.delete('/delete/:id',isAdmin, deleteUser)
 AdminRoutes.post('/add', isAdmin, addUser);
 AdminRoutes.put("/edit/:id", editUser);
 AdminRoutes.put("/status/:id", isAdmin, toggleStatus);
 AdminRoutes.put('/permissions/:id', isAdmin, updatePermissions)

export default AdminRoutes