import { DataSource } from "typeorm"
import { join } from "path"
import dotenv from 'dotenv'

dotenv.config()
 
const dataBase = new DataSource ({
    type: 'sqlite',
    database: process.env.DATABASE || './src/database/database.sqlite',
    logging: true,
    synchronize: true,
    entities: [
        join(__dirname, '..', 'models/*.{ts,js}')
    ]

})

dataBase.initialize()
.then(() => {
    console.log(`Banco de dados inicializado`)
})
.catch((err) => {
    console.error(`Erro ao inicializar`, err)
})

export default dataBase