import { useNavigation } from '@react-navigation/native'
import {Text} from 'react-native'
import { RegisterHabit } from './../screens/RegisterHabit';

export function HabitsEmpty(){

    const {navigate} = useNavigation();

    return(
        <Text className='text-zinc-400 text-base '>
            Você ainda não tem nenhum habito para este dia da semana :/ {'\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t'}
            <Text className='text-violet-400 text-base underline active:text-violet-500'
                  onPress={() => navigate('register-habit')}>
                    Crie um agora!
            </Text>
        </Text>
    )
}