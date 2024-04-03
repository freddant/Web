import { Request, Response } from 'express'
import User from '../../models/user.entity'
import Token from '../../models/token.entity'
import bcrypt from 'bcrypt'

export default class AuthController {
  static async store (req: Request, res: Response) {
    const { name, email, password } = req.body

    if (!name) return res.status(400).json({ error: 'O nome é obrigatório' })
    if (!email) return res.status(400).json({ error: 'O email é obrigatório' })
    if (!password) return res.status(400).json({ error: 'A senha é obrigatória' })

    const user = new User()
    user.name = name
    user.email = email
    user.password = bcrypt.hashSync(password, 10)
    await user.save()


    return res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email
    })
  }

  static async login (req: Request, res: Response) {
    const { email, password } = req.body

    if (!email || !password) return res.status(400).json({ error: 'Email e senha são obrigatórios' })

    const user = await User.findOneBy({ email })
    if (!user) return res.status(401).json({ error: 'Usuário não encontrado' })

    const passCheck = bcrypt.compareSync(password, user.password)
    if (!passCheck) return res.status(401).json({ error: 'Senha inválida' })

    await Token.delete(
      { user: { id: user.id } } // opcional
    )

    const token = new Token()
    const stringRand = Math.random().toString(36) + new Date().toString()
    token.token = bcrypt.hashSync(stringRand, 1).slice(-20)
    token.expiresAt = new Date(Date.now() + 60 * 60 * 1000)
    token.refreshToken = bcrypt.hashSync(stringRand+2,1)
    token.user = user
    await token.save()

    return res.json({
      token: token.token,
      expiresAt: token.expiresAt,
      refreshToken: token.refreshToken
    })
  }

  static async refresh (req: Request, res: Response) {
    const { authorization } = req.headers

    if (!authorization) return res.status(400).json({ error: 'O refresh token é obrigatório' })

    const token = await Token.findOneBy({ refreshToken: authorization })
    if (!token) return res.status(401).json({ error: 'Refresh token inválido' })

    if (token.expiresAt < new Date()) {
      await token.remove()
      return res.status(401).json({ error: 'Refresh token expirado' })
    }


    token.token = bcrypt.hashSync(Math.random().toString(36), 1).slice(-20)
    token.refreshToken = bcrypt.hashSync(Math.random().toString(36), 1).slice(-20)
    token.expiresAt = new Date(Date.now() + 60 * 60 * 1000)
    await token.save()

    return res.json({
      token: token.token,
      expiresAt: token.expiresAt,
      refreshToken: token.refreshToken
    })
  }

  static async logout (req: Request, res: Response) {
    const { authorization } = req.headers
    
    if (!authorization) return res.status(400).json({ error: 'O token é obrigatório' })

    // Verifica se o token existe
    const userToken = await Token.findOneBy({ token: authorization })
    if (!userToken) return res.status(401).json({ error: 'Token inválido' })

    // Remove o token
    await userToken.remove()

    // Retorna uma resposta vazia
    return res.status(204).json()
  }
}