import { StyleSheet } from "react-native";
import { COLORS, SIZES } from "../constants";

const info_styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        justifyContent: 'flex-start',
        marginTop:60,
        },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 40,
        textAlign: 'center',
        },
    inputGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 30,
        marginTop:10,
        },
    label: {
        width: 70, // 라벨 너비 고정
        fontSize: SIZES.medium
        },
    input: {
        flex: 1,
        },
    picker: {
        flex:1,
        height: 30,
        marginBottom: 100,
        },
    input_container: {
        paddingHorizontal:16,
        paddingTop: 16,
    },
    picker_container:{
        flexDirection:'row',
         alignItems:'center',
         justifyContent: 'space-between',
    }
    
})

export default info_styles;