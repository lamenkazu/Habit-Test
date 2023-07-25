import { FastifyInstance } from "fastify"
import { prisma } from "./lib/prisma"

 //A biblioteca Zod além de fazer a validação (dos dados que vem do front_end) trás a tipagem de cada informação especificamente.
 import {z} from 'zod'
import dayjs from "dayjs"

export async function appRoutes(app: FastifyInstance ){

    //Rota POST para criação de um hábito. 
    app.post('/habits', async (req) => {


        //Especificação da tipagem com a biblioteca Zod 
        const createHabitBody = z.object({
            titulo: z.string(),
            weekDays: z.array(z.number().min(0).max(6))
        })

        //Pega os dados do front-end validados pela Zod
        const {titulo, weekDays} = createHabitBody.parse(req.body)


        //Como o que importa é apenas o Dia, e não o horario, ele zera o horario para não existir conflitos de uso de um novo habito criado
        const hoje = dayjs().startOf('day').toDate()

        //Cria o novo hábito com o título que vem do req.body (front-end) E também os Dias da Semana (WeekDays) em que ele ocorre
        await prisma.habit.create({
            data: {
                titulo,
                created_at: hoje,
                weekDays: {
                    create: weekDays.map(weekDay => {
                        return {
                            week_day: weekDay,
                        }
                    } )
                }
            }
        })
        
    })

    //Retorna dados específicos de um dia escolhido. Todos os habitos possíveis e todos os completados. 
    app.get('/day', async (req) => {
        const getDayParams = z.object({
            date: z.coerce.date()
        })

        const {date} = getDayParams.parse(req.query)

        const parsedDate = dayjs(date).startOf('day')
        const diaDaSemana = parsedDate.get('day')


        //Mostra habitos criados até aquela data.
        const habitosPossiveis = await prisma.habit.findMany({
            where: {
                created_at: {
                    //lte (menor ou igual)
                    lte: date, 
                }, 
                weekDays: {
                    // every, none ou some busca caso haja todos, nenhum ou algum preenche os requisitos que eu coloco.
                    some: {
                        week_day: diaDaSemana,

                    }
                }
            }
            
            
        })

        //*****Habitos que foram marcados como feitos

        //Encontra o dia único que foi escolhido
        const dia = await prisma.day.findUnique({
            where: {
                
                date: parsedDate.toDate(),
            },

            //Trás os Habitos completados junto com os dados do dia.
            include: {
                //Day Habits true habilita que venham os dados de Habits
                dayHabits: true
            }
        })

        const completedHabits = dia?.dayHabits.map(dayHabit => {
            //retornamos apenas o ID dos dados do habito
            return dayHabit.habit_id
        })



        return {
            habitosPossiveis,
            completedHabits
        }

    })

    //Rota para marcar e desmarcar um habito. 
//Rotas patch servem para alterações pequenas/pariais no banco de dados.
    app.patch('/habits/:id/toggle', async (req) => {

        //Tipa o parametro conforme o programado em Model, validando para o typescript.
        const toogleParam = z.object({
            id: z.string().uuid(),
        })

        //define id como o parametro dentro do tipo especificado com Z
        const { id } = toogleParam.parse(req.params);

/*
        A alteração só pode ser feita no dia atual,
        então preciso pegar a data de hoje para fazer a
        alteração apenas nesse dia
*/
        const hoje = dayjs().startOf('day').toDate();

        //Procurar um dia da data de hoje
        let dia = await prisma.day.findUnique({
            where: {
                date: hoje,
            }
        })

        //Se o dia não for encontrado, cria o dia no banco de dados.
        if(!dia){
            dia = await prisma.day.create({
                data: {
                    date: hoje,
                }
            })
        }

        //Procura  um registro que possui elo entre dia e habito.
        //Se esse registro existe, ele está marcado como completo.
        const dayHabit = await prisma.dayHabit.findUnique({
            where: {
                day_id_habit_id: {
                    day_id: dia.id,
                    habit_id: id,
                }
            }
        })

        //Se existe, está completo.
        //Se está completo, descompleta.
        //Se não está completo, completa.
        if(dayHabit){
            //Remove a marcação de completo
            await prisma.dayHabit.delete({
                where: {
                    id: dayHabit.id
                }
            })
        }else{
            //Marca o habito como completado
            await prisma.dayHabit.create({
                data: {
                    day_id: dia.id,
                    habit_id: id,
                }
            })
        }

        

    })

    /*Rota que retorna um resumo de uma data. 
        Um array de objetos que contem 
        -a data, 
        -quantos hábitos eram possiveis completar nessa data
        - e quantos foram de fato completos.
    */
    app.get('/summary', async () => {
        //Query mais complexa. Mais condições, relacionamentos etc.
        //Raw SQL => SQL na mão. Lidar nesse codigo diretamente com SQLITE

    
        //Todos os registros da tabela dayhabits one o DayID armazenado seja o mesmo em ambas as tabelas.
        const summary = await prisma.$queryRaw`
            SELECT 
                D.id,
                D.date,
                (
                    SELECT 
                        cast(count(*) as float)
                    FROM day_habits DH
                    WHERE DH.day_id = D.id
                ) as completos,

                (
                    SELECT
                        cast(count(*) as float)
                    FROM habit_week_days HWD
                    JOIN habits H
                        ON H.id = HWD.habit_id
                    WHERE 
                        HWD.week_day = cast(strftime('%w', D.date/1000.0, 'unixepoch') as int)
                    AND H.created_at < D.date
                ) as disponiveis

            FROM days D
        `

        return summary
    })

}

