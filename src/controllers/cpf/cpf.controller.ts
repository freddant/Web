import { Request, Response } from 'express'
import CPF from '../../models/cpf.entity'

export default class CPFController {
    static async store (req: Request, res: Response) {
        const { number } = req.body
        const { userId } = req.headers

        if(!number) {
            return res.status(400).json({ error: 'Número é obrigatório'})
        }

        if (!userId) return res.status(401).json({ error: 'Usuário não autenticado' })

        const cpf = new CPF()
        cpf.number = number
        cpf.userId = Number(userId)
        await cpf.save()
        
        return res.status(201).json(cpf)
    }

    static async index (req: Request, res: Response) {

        const { userId } = req.headers

        if (!userId) return res.status(401).json({ error: 'Usuário não autenticado' })

        const cpfs = await CPF.find({where: { userId: Number(userId) }})
        return res.json(cpfs)
    }

    static async show(req: Request, res: Response){

        const { id } = req.params
        const { userId } = req.headers
  
        if(!id || isNaN(Number(id))) {
        return res.status(400).json({ error: 'O id é obrigatório' })
      }
  
        if (!userId) return res.status(401).json({ error: 'Usuário não autenticado' })
  
        const cpf = await CPF.findOneBy({id: Number(id), userId: Number(userId)})
        return res.json(cpf)
  
    }

    static async delete (req: Request, res: Response) {
        const { id } = req.params
        const { userId } = req.headers
    
        if(!id || isNaN(Number(id))) {
          return res.status(400).json({ error: 'O id é obrigatório' })
        }
    
        if (!userId) return res.status(401).json({ error: 'Usuário não autenticado' })
    
        const cpf = await CPF.findOneBy({id: Number(id), userId: Number(userId)})
        if (!cpf) {
          return res.status(404).json({ error: 'Task não encontrada' })
        }
    
        await cpf.remove()
        return res.status(204).json()
    }

    static async update (req: Request, res: Response) {
        const { id } = req.params
       const { number } = req.body
       const { userId } = req.headers
 
       if(!id || isNaN(Number(id))) {
       return res.status(400).json({ error: 'O id é obrigatório' })
     }
 
       if (!userId) return res.status(401).json({ error: 'Usuário não autenticado' })
 
       const cpf = await CPF.findOneBy({id: Number(id), userId: Number(userId)})
       if (!cpf) {
       return res.status(404).json({ error: 'Task não encontrada' })
     }
 
       cpf.number = number ?? cpf.number
       await cpf.save()
 
       return res.json(cpf)
    }
}