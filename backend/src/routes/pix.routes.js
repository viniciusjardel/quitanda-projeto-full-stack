import { Router } from 'express'
import { criarPix } from '../services/pix.service.js'

const router = Router()

router.post('/create', async (req, res) => {
  const { valor, descricao } = req.body

  if (!valor) {
    return res.status(400).json({ erro: 'Valor é obrigatório' })
  }

  const pix = await criarPix(valor, descricao)

  res.json(pix)
})

export default router
