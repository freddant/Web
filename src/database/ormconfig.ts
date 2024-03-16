import {DataSource} from "typeorm"
import { join } from "path"
 
const dataBase = new DataSource ({
    type: 'sqlite',
    database: process.env.DATABASE || './src/database/database.sqlite',
    entities: [
      join(__dirname, '..', 'models/*.{ts,js}')
    ],
    logging: true,
    synchronize: true

})

dataBase.initialize()
.then(() => {
    console.log(`Banco de dados inicializado`)
})
.catch((err) => {
    console.error(`Erro ao inicializar`)
})

export default dataBase