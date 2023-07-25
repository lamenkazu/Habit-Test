import {View} from 'react-native'

import {NavigationContainer} from '@react-navigation/native'
import { HabitRoutes } from './habit.routes'

export function Routes(){
    return (
        <View className='flex-1 bg-background'>

            <NavigationContainer>

                <HabitRoutes/>
                
            </NavigationContainer>

        </View>
    )
}