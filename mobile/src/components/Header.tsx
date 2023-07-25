import { View, TouchableOpacity, Text} from "react-native";
import {Feather} from '@expo/vector-icons'

import colors from 'tailwindcss/colors'
import Logo from '../assets/logo.svg'

import {useNavigation} from '@react-navigation/native'
import { RegisterHabit } from './../screens/RegisterHabit';

export function Header(){

    const {navigate} = useNavigation();

    return(
        <View className="w-full flex-row items-center justify-between">
            <Logo />

            <TouchableOpacity 
                activeOpacity={0.4}
                className="flex-row h-11 px-3 border border-violet-500 rounded-lg items-center"
                onPress={() => navigate('register-habit')}
            >
                <Feather
                    name="plus"
                    color={colors.violet[500]}
                    size={25}
                />
                <Text className="text-orange-200 ml-3 font-semibold, text-base ">
                    New
                </Text>
            </TouchableOpacity>
            
            
        </View>
    )
}