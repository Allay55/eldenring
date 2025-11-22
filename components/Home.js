// src/components/Home.js
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';

const API_BASE = 'https://eldenring.fanapis.com/api';

export default function Home({ navigation }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchItems = async () => {
    try {
      const res = await fetch(`${API_BASE}/items?limit=50`);
      const json = await res.json();
      if (json && json.data) {
        setData(json.data);
      }
    } catch (e) {
      console.error('Error fetching items', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchItems(); }, []);

  if (loading) return (
    <View style={{flex:1,justifyContent:'center',alignItems:'center'}}><ActivityIndicator size="large" /></View>
  );

  return (
    <ScrollView contentContainerStyle={styles.lista}>
      {data.map((item) => (
        <TouchableOpacity
          key={item.id}
          style={styles.item}
          onPress={() => navigation.navigate('ItemDetail', { id: item.id })}
        >
          <Image source={{ uri: item.image }} style={styles.imagen} />
          <Text numberOfLines={1} style={styles.name}>{item.name}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  lista: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', padding: 10 },
  item: { width: '48%', marginBottom: 12, alignItems: 'center', backgroundColor: '#f2f2f2', padding:8, borderRadius:8 },
  imagen: { width: 100, height: 100, resizeMode: 'contain' },
  name: { marginTop: 6, fontWeight: '600' }
});
