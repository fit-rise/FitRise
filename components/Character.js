// Character.js
import React, { useState } from 'react';
import { Image, TouchableOpacity, StyleSheet, Vibration } from 'react-native';
import { images } from '../constants';

const Character = ({ characterImage }) => {
  // 반응 이미지 배열을 컴포넌트 내부에서 정의
  const reactionImages = [
    { source: images.act_bfly, width: 200, height: 120 },
    { source: images.act_heart, width: 80, height: 80 },
    // ...기타 반응 이미지
  ];

  const [selectedReactionImage, setSelectedReactionImage] = useState(null);

  const handlePress = () => {
    Vibration.vibrate(500);
    const randomIndex = Math.floor(Math.random() * reactionImages.length);
    setSelectedReactionImage(reactionImages[randomIndex]);

    setTimeout(() => {
      setSelectedReactionImage(null);
    }, 2400);
  };

  return (
    <TouchableOpacity onPress={handlePress} style={styles.characterContainer}>
      <Image source={characterImage} style={styles.characterImage} />
      {selectedReactionImage && (
        <Image
          source={selectedReactionImage.source}
          style={{
            ...styles.reactionImage,
            width: selectedReactionImage.width,
            height: selectedReactionImage.height,
            top: -(styles.characterImage.height / 2),
            marginLeft: -(selectedReactionImage.width / 2),
          }}
        />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  characterContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  characterImage: {
    width: 100, // 캐릭터 이미지의 너비
    height: 100, // 캐릭터 이미지의 높이
  },
  reactionImage: {
    position: 'absolute',
  },
});

export default Character;
