import { TouchableOpacity, View, Text, TouchableOpacityProps } from "react-native";
import { Feather } from '@expo/vector-icons';
import colors from "tailwindcss/colors";


interface Props extends TouchableOpacityProps{
    title: string;
    checked: boolean;

}


function checkedBox(){
    return (
                <View className="h-8 w-8 bg-green-500 rounded-lg items-center justify-center">
                    <Feather name="check"
                            size={20}
                            color={colors.white}
                    />
                </View>
    )
}

function uncheckedBox(){

    return(
        <View className="h-8 w-8 bg-zinc-700 rounded-lg"/>
    )
}



export function Checkbox({title, checked, ...rest}: Props){



    return(
        <TouchableOpacity activeOpacity={0.5}
                          className="flex-row mb-2 items-center"
                          {...rest}
        >

            { 
            //Ternario. Se Checked for true, mostra quadrado marcado. Senão, mostra desmarcado.
               checked? checkedBox() : uncheckedBox() 
            }
            <Text className="text-white text-xl ml-3 font-semibold">
                {title}
            </Text>
            
        </TouchableOpacity>
    )
}