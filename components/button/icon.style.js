import { StyleSheet } from "react-native";

import { SIZES } from "../../constants";

const icon_styles = StyleSheet.create({
  btnContainer: {
    width: 40,
    height: 40,
    borderRadius: SIZES.small / 1.25,
    justifyContent: "center",
    alignItems: "center",
  },
  circleBtn:{
    borderRadius:100,
    alignItems:'center',
    justifyContent:'center',
    width: 50,
    height: 50,
    backgroundColor : '#402f1c',
    position:'absolute',
    right:10,
    bottom:10
  },
  btnImg: (dimension) => ({
    width: dimension,
    height: dimension,
    borderRadius: SIZES.small / 1.25,
  }),
});

export default icon_styles;
