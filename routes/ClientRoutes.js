import {
    addClient, 
    editClient ,
    deleteClient , 
    getAllClients
} from '../controllers/ClientController.js'
import express from 'express'
import upload from '../middleware/Multer.js'

const clientRouter = express.Router()

clientRouter.get('/', getAllClients)
clientRouter.post('/' , upload.single('image'), addClient)
clientRouter.patch('/', upload.single('image'), editClient)
clientRouter.delete('/', deleteClient)

export default clientRouter