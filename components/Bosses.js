import React from 'react';
import { ScrollView, View, Text, Image, StyleSheet } from 'react-native';

export default function Bosses({ bosses }) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {bosses.map((boss) => (
        <View key={boss.id} style={styles.bossCard}>
          <Image source={{ uri: boss.image }} style={styles.image} />
          <Text style={styles.name}>{boss.name}</Text>
          <Text style={styles.description}>{boss.description}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    alignItems: 'center',
  },
  bossCard: {
    marginBottom: 20,
    alignItems: 'center',
    width: '90%',
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 8,
  },
  name: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  description: {
    marginTop: 4,
    fontSize: 14,
    textAlign: 'center',
    color: '#555',
  },
});
