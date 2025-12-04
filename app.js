import 'dotenv/config';
import express from 'express'
import { router } from './routes/auth.route.js'
import cors from 'cors'
import helmet from 'helmet'
import { authMiddleware } from './middlewares/auth.middleware.js'
import { errorHandling } from './middlewares/error.middleware.js'

const port = process.env.PORT || 3000;
const app = express()

app.use(cors())
app.use(helmet())

app.use(express.json())

app.use(errorHandling)

app.use('/auth', router)

app.listen(port, () => {
	console.log(`App listening on ${port}`)
})
