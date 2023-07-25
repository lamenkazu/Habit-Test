import { TouchableOpacity, Text, View } from "react-native";
import colors from "tailwindcss/colors";
import { Feather } from '@expo/vector-icons';

export function ConfirmButton(){
    return(
        <View className="w-full h-fit flex-row items-center justify-center">
                <TouchableOpacity className="w-52 h-14 flex-row items-center justify-center bg-purple-800 rounded-md mt-6">
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
    )
}