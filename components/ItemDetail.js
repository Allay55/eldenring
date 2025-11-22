// src/components/ItemDetail.js
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const API_BASE = 'https://eldenring.fanapis.com/api';

export default function ItemDetail({ route }) {
  const navigation = useNavigation();
  const { id } = route.params || {};

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const getItem = async () => {
      try {
        const res = await fetch(`${API_BASE}/items/${id}`);
        const json = await res.json();
        setItem(json.data || json);
      } catch (error) {
        console.error('Error al cargar el item:', error);
      } finally {
        setLoading(false);
      }
    };

    getItem();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 10 }}>Cargando item...</Text>
      </View>
    );
  }

  if (!item) {
    return (
      <View style={styles.center}>
        <Text>No se encontró el item</Text>

        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.btn}>
          <Text style={styles.btnText}>← Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>

      {/* BOTÓN VOLVER */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.btn}>
        <Text style={styles.btnText}>← Volver</Text>
      </TouchableOpacity>

      {/* IMAGEN */}
      {item.image && (
        <Image source={{ uri: item.image }} style={styles.image} />
      )}

      {/* INFO */}
      <Text style={styles.title}>{item.name}</Text>

      {item.description && (
        <Text style={styles.desc}>{item.description}</Text>
      )}

      {item.type && (
        <Text style={styles.meta}>Tipo: {item.type}</Text>
      )}

      {item.effect && (
        <Text style={styles.meta}>Efecto: {item.effect}</Text>
      )}

      {item.location && (
        <Text style={styles.meta}>Ubicación: {item.location}</Text>
      )}

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    alignItems: 'center'
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    marginBottom: 12
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 10,
    textAlign: 'center'
  },
  desc: {
    textAlign: 'center',
    marginBottom: 10
  },
  meta: {
    fontStyle: 'italic',
    marginTop: 6
  },
  btn: {
    alignSelf: 'flex-start',
    marginBottom: 20,
    backgroundColor: '#222',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6
  },
  btnText: {
    color: 'white',
    fontWeight: '600'
  }
});
