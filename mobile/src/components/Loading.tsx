import { ActivityIndicator, View } from "react-native";

export function Loading(){

    return (
        //Style faz com que essa View ocupe toda a tela disponivel e centraliza o elemento na vertical e horizontal.
        <View style={{backgroundColor: '#09090A', flex:1, justifyContent: 'center', alignItems: 'center'}}>
            <ActivityIndicator color="#7C3AED"/>
        </View>

    );
}