import express from 'express'
import { fetchAllUsers, login, register } from '../controllers/auth.controller.js'
import { authMiddleware } from '../middleware/authMiddleware.js'
const router = express.Router()

router.post('/register', register)
router.post('/login',login)
router.get("/allusers", authMiddleware, fetchAllUsers)

export default router