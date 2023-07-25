//Fastify é um Framework substituindo o Express já utilizado anteriormente
import Fastify from 'fastify'
import cors from '@fastify/cors'
import { appRoutes } from './routes';



//Inicia a Aplicação com o Fastify;
const app = Fastify();



//Registra o CORS para que as aplicações Front-End possam utilizar esse banco de dados
app.register(cors, {
    origin: '*',
  methods: ['GET', 'PUT', 'POST', 'DELETE']
})

//Registro das Rotas em Routes.ts
app.register(appRoutes)

const port = 3333


//Inicia a escuta do servidor na porta 3333
app.listen({
    port: port,
}).then(() => {
    //Caso esteja rodando informa no terminal um aviso de confirmação.
    console.log("Servidor HTTP Rodando :" + port)
} )