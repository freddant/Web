import { Router } from 'express'
import cpfController from '../../controllers/cpf/cpf.controller'
import authMiddleware from '../../middlewares/auth.middleware'

const cpfRoutes = Router()


cpfRoutes.get('/', authMiddleware, cpfController.index)
cpfRoutes.get('/:id', authMiddleware, cpfController.show)
cpfRoutes.post('/', authMiddleware, cpfController.store)
cpfRoutes.put('/:id', authMiddleware, cpfController.update)
cpfRoutes.delete('/:id', authMiddleware, cpfController.delete)

export default cpfRoutes