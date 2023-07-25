import { View } from "react-native"


interface Props {
    progress?: number

}

export function ProgressBar( {progress = 0} : Props){

    return(
        <View className="w-full h-3 rounded-xl bg-zinc-700">

            <View className="h-3 rounded-xl bg-violet-800"
                style={{width: `${progress}%`}}
            >

            </View>

        </View>
    )

}