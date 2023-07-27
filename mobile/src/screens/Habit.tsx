import { ScrollView, View, Text, Alert } from "react-native";
import { useState, useEffect } from 'react';
import clsx from 'clsx'

import dayjs from 'dayjs'

import { useRoute } from "@react-navigation/native";
import { BackButton } from "../components/BackButton";
import { ProgressBar } from "../components/ProgressBar";
import { Checkbox } from "../components/Checkbox";
import { Loading } from "../components/Loading";
import { HabitsEmpty } from './../components/HabitsEmpty';

import { api } from "../lib/axios";
import { generateProgressPercentage } from "../utils/generate-progress-percentage";

interface Params {
    date: string;
}

interface DayInfoProps {
    completedHabits: string[];
    habitosPossiveis: {
        id: string;
        titulo: string;
    }[];

}

export function Habit(){

    const [loading, setLoading] = useState(true)

    const [dayInfo, setDayInfo] = useState<DayInfoProps | null>(null)
    const [completedHabits, setCompletedHabits] = useState<string[]>([])

    const route = useRoute();

    const {date} = route.params as Params;
    const parsedDate = dayjs(date).endOf('day')
    const isDateInPast = parsedDate.endOf('day').isBefore(new Date())
    const dayOfWeek = parsedDate.format('dddd')
    const dayAndMonth = parsedDate.format('DD/MM')

    const habitProgress = dayInfo?.habitosPossiveis.length ?  generateProgressPercentage(dayInfo.habitosPossiveis.length, completedHabits?.length) : 0

    async function fetchHabits() {
        try{
            setLoading(true)

            const response = await api.get('/day', {params: {date: parsedDate}})

            setDayInfo(response.data)

            console.log(response.data)

            setCompletedHabits(response.data.completedHabits)



        }catch(error){
            console.log(error)
            Alert.alert("Ops", "Não foi possível carregar os dados do habito")
        }finally{

            setLoading(false)

        }
    }

    async function handleToggleHabit(habitId: string){

        try{
            await api.patch(`/habits/${habitId}/toggle`)
            if(completedHabits?.includes(habitId)){
                setCompletedHabits(prevState => prevState.filter(habit => habit !== habitId))
            }else{
                setCompletedHabits(prevState => [...prevState, habitId])
            }
        }catch(error){
            Alert.alert("Opa", "Não foi possivel atualizar seu habito no servidor")
            console.log(error)
        }

    }

    useEffect(() => {
        fetchHabits()
    }, [])

    if(loading){
        return(
            <Loading/>
        )
    }

    return (
        <View className="flex-1 bg-background px-8 pt-16">
            
            <ScrollView showsVerticalScrollIndicator={false}
                        contentContainerStyle={{paddingBottom: 50}}
            >

                <BackButton/>

                <Text className="mt-6 text-zinc-400 font-semibold text-base lowercase">
                    {dayOfWeek}
                </Text>

                <Text className="text-white font-extrabold text-3xl">
                    {dayAndMonth}
                </Text>

                <ProgressBar progress={habitProgress}/>

                <View className={clsx("mt-6", {
                    ["opacity-70"] : isDateInPast
                } )}>
                    {
                        dayInfo?.habitosPossiveis ?
                        dayInfo?.habitosPossiveis.map(habit => (
                            <Checkbox 
                                    key={habit.id}
                                    title={habit.titulo}
                                    checked={completedHabits?.includes(habit.id)}
                                    disabled={isDateInPast}
                                    onPress={() => handleToggleHabit(habit.id)}
                            />
                        ))
                        : <HabitsEmpty/>

                        
                    }
                </View>

                {
                    isDateInPast && (
                        <Text className="text-white mt-10 text-center">
                            Não da pra mudar o passado, lide com isso.
                        </Text>
                    )
                }
                
            </ScrollView>

        </View>
    )
}