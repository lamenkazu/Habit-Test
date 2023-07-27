import { useEffect, useState } from "react";
import { View, ScrollView, Text, TextInput, TouchableOpacity, Alert} from "react-native";

//Components
import { BackButton } from './../components/BackButton';
import { Checkbox } from "../components/Checkbox";
import colors from "tailwindcss/colors";

import { Feather } from '@expo/vector-icons';

import { ConfirmButton } from "../components/ConfirmButton";

import { api } from "../lib/axios";

const availableWeekDays = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sabado"]


export function RegisterHabit(){

    const [titulo, setTitulo] = useState("")

    const [weekDays, setWeekDays] = useState<number[]>([]);
    const [everyDay, setEveryDay] = useState<boolean>(false);


    function handleToggleWeekDay(weekDayIndex: number){

            if(weekDays.includes(weekDayIndex)){
                //Remove o toggle
                setWeekDays((prevState) => prevState.filter(wkD => wkD !== weekDayIndex))
                if(weekDays.length <= 7){
                    setEveryDay(false)
                }
            }else{
                //Marca o toggle
                setWeekDays(prevState => [...prevState, weekDayIndex])
                if(weekDays.length == 6){
                    setEveryDay(true);
                }
            }

            


    }

    function handleToggleEveryDay(){
        setEveryDay(everyDay? false : true)

        if(!everyDay){
            setWeekDays([0,1,2,3,4,5,6])
        }else{
            setWeekDays([]);
        }
    }

    async function handleNewHabitRegister(){
        try{

            if(!titulo.trim()){
                Alert.alert("Opa!", "Você não pode registrar um habito sem nome...")
            }else if(weekDays.length === 0){
                Alert.alert("Opa!", "Você não pode registrar um habito definir um dia pra fazê-lo...")
            }else{
                await api.post('/habits', {titulo, weekDays})
                setTitulo('')
                setWeekDays([])

                Alert.alert("Tudo certo", "Seu Novo Hábito Foi Criado")
            }

        }catch(error){
            Alert.alert("Ops...", "Não foi possível criar um novo habito.")
            console.log(error)
        }
    }
    
    return (
        <View className="flex-1 bg-background px-8 pt-16">
            <ScrollView showsVerticalScrollIndicator={false}
                        contentContainerStyle={{paddingBottom: 50}}    
            >

                <BackButton/>

                <Text className="mt-6 text-white font-extrabold text-3xl">
                    Criar Habito
                </Text>

                <Text className="mt-6 text-white font-semibold text-base">
                    Juro solenemente 
                </Text>

                <TextInput className="h-12 pl-4 rounded-lg mt-3 bg-zinc-800 text-white focus:border-2 focus:border-green-600"
                           placeholder="não fazer nada de bom"
                           placeholderTextColor={colors.zinc[500]}
                           onChangeText={setTitulo}
                           value={titulo}
                />

                <Text className="font-semibold mt-4 mb-3 text-white text-base"> 
                    todo
                </Text>
                


                {
                    
                    availableWeekDays.map((weekDay, index)=>(

                        <Checkbox   
                                    key={index+weekDay}
                                    title={weekDay}
                                    checked={weekDays.includes(index)}      
                                    onPress={ () => handleToggleWeekDay(index)}              
                        />
                    ))
                }

                <Checkbox
                        title={"Todo dia"}
                        checked={everyDay}
                        onPress={() => handleToggleEveryDay()}

                />

                <View className="w-full h-fit flex-row items-center justify-center">
                    <TouchableOpacity className="w-52 h-14 flex-row items-center justify-center bg-green-600 rounded-md mt-6"
                                      onPress={handleNewHabitRegister}>
                        <Feather
                                name="check"
                                size={20}
                                color={colors.white}
                        />
                        <Text className="font-semibold text-base text-white ml-2">
                            Confirmar

                        </Text>
                    </TouchableOpacity>

                </View>
                

            </ScrollView>
        </View>
    )
}