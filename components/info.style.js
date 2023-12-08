import { StyleSheet } from "react-native";
import { COLORS, SIZES } from "../constants";

const info_styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#DFEFDF"
    },
    modalContainer: {
        flex: 1,
        backgroundColor: "#DFEFDF",
    },
    content_container: {
        flex: 1,
        paddingHorizontal: 20,
        justifyContent: 'flex-start',
        marginTop: 40,
    },
    header: {
        fontFamily: "jua",
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 30,
        textAlign: 'center',
    },
    inputGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
        marginTop: 10,
    },
    label: {
        width: 70, // 라벨 너비 고정
        fontSize: SIZES.medium,
        fontFamily: "jua"
    },
    input: {
        flex: 1,
    },
    picker: {
        flex: 1,
        height: 30,
        marginBottom: 100,
    },
    input_container: {
        paddingHorizontal: 16,
        paddingTop: 16,
    },
    picker_container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 25,
        height: 100,
    },
    BtnStyle: {
        backgroundColor: '#a2e78d', // 밝은 초록색으로 변경
        padding: 5,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 10
    },
    centeredView: {  // 로딩관련
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
})

export default info_styles;