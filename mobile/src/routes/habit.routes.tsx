import {createNativeStackNavigator} from '@react-navigation/native-stack'

const { Navigator, Screen } = createNativeStackNavigator();

import {HabitHome} from '../screens/HabitHome'
import {Habit} from '../screens/Habit'
import {RegisterHabit} from '../screens/RegisterHabit'


export function HabitRoutes(){
    return(
        <Navigator screenOptions={{headerShown:false}}>
            <Screen
                name="habit-home"
                component={HabitHome}
            />

            <Screen
                name="habit"
                component={Habit}
            />

            <Screen
                name="register-habit"
                component={RegisterHabit}
            />
        </Navigator>
    )
    
}