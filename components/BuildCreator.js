import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Image, Alert, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { auth, db } from '../firebase/firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';

// BuildCreator.js
// Página para crear y guardar "builds" de Elden Ring usando la API fanapis y Firestore.
// Cómo usar: poner este archivo en src/components/BuildCreator.js y exportarlo en tu navegación.

const API_BASE = 'https://eldenring.fanapis.com/api';

export default function BuildCreator() {
  const [query, setQuery] = useState('');
  const [weapons, setWeapons] = useState([]);
  const [armors, setArmors] = useState([]);
  const [items, setItems] = useState([]); // para cenizas / consumibles
  const [loading, setLoading] = useState(true);

  const [selectedWeapon, setSelectedWeapon] = useState(null);
  const [selectedArmor, setSelectedArmor] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);

  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Cargar datos iniciales (limit razonable)
    const load = async () => {
      try {
        setLoading(true);
        const [wRes, aRes, iRes] = await Promise.all([
          fetch(`${API_BASE}/weapons?limit=100`),
          fetch(`${API_BASE}/armors?limit=100`),
          fetch(`${API_BASE}/items?limit=200`),
        ]);
        const wJson = await wRes.json();
        const aJson = await aRes.json();
        const iJson = await iRes.json();
        setWeapons(wJson.data || []);
        setArmors(aJson.data || []);
        setItems(iJson.data || []);
      } catch (e) {
        console.error('Error cargando recursos:', e);
        Alert.alert('Error', 'No se pudieron cargar recursos de la API. Revisa tu conexión.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filteredWeapons = weapons.filter(w => w.name.toLowerCase().includes(query.toLowerCase()));
  const filteredArmors = armors.filter(a => a.name.toLowerCase().includes(query.toLowerCase()));
  const filteredItems = items.filter(i => i.name.toLowerCase().includes(query.toLowerCase()));

  const toggleItem = (item) => {
    if (selectedItems.find(i => i.id === item.id)) {
      setSelectedItems(selectedItems.filter(i => i.id !== item.id));
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };

  const saveBuild = async () => {
    if (!auth.currentUser) return Alert.alert('Debes iniciar sesión', 'Inicia sesión para guardar tu build.');
    if (!name.trim()) return Alert.alert('Nombre requerido', 'Dale un nombre a tu build.');

    setSaving(true);
    try {
      const payload = {
        uid: auth.currentUser.uid,
        name: name.trim(),
        createdAt: new Date().toISOString(),
        weapon: selectedWeapon ? { id: selectedWeapon.id, name: selectedWeapon.name, image: selectedWeapon.image } : null,
        armor: selectedArmor ? { id: selectedArmor.id, name: selectedArmor.name, image: selectedArmor.image } : null,
        items: selectedItems.map(it => ({ id: it.id, name: it.name, image: it.image })),
      };
      await addDoc(collection(db, 'builds'), payload);
      Alert.alert('Guardado', 'Tu build se ha guardado correctamente.');
      // reset
      setName('');
      setSelectedWeapon(null);
      setSelectedArmor(null);
      setSelectedItems([]);
    } catch (e) {
      console.error('Error guardando build:', e);
      Alert.alert('Error', 'No se pudo guardar la build. Intenta de nuevo.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <View style={styles.center}><ActivityIndicator size="large" /></View>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.h1}>Crear Build</Text>

      <TextInput placeholder="Nombre de tu build" value={name} onChangeText={setName} style={styles.input} />

      <Text style={styles.label}>Buscar (armas, armaduras, objetos)</Text>
      <TextInput placeholder="Busca por nombre..." value={query} onChangeText={setQuery} style={styles.input} />

      <Text style={styles.sectionTitle}>Arma</Text>
      <FlatList data={filteredWeapons} horizontal keyExtractor={(i)=>String(i.id)} style={styles.horizontalList}
        renderItem={({item})=> (
          <TouchableOpacity onPress={()=>setSelectedWeapon(item)} style={[styles.card, selectedWeapon?.id===item.id && styles.cardSelected]}>
            {item.image ? <Image source={{uri:item.image}} style={styles.thumbnail} /> : <View style={styles.placeholder}><Text>Sin imagen</Text></View>}
            <Text numberOfLines={1} style={styles.cardTitle}>{item.name}</Text>
          </TouchableOpacity>
        )} />

      <Text style={styles.sectionTitle}>Armadura</Text>
      <FlatList data={filteredArmors} horizontal keyExtractor={(i)=>String(i.id)} style={styles.horizontalList}
        renderItem={({item})=> (
          <TouchableOpacity onPress={()=>setSelectedArmor(item)} style={[styles.card, selectedArmor?.id===item.id && styles.cardSelected]}>
            {item.image ? <Image source={{uri:item.image}} style={styles.thumbnail} /> : <View style={styles.placeholder}><Text>Sin imagen</Text></View>}
            <Text numberOfLines={1} style={styles.cardTitle}>{item.name}</Text>
          </TouchableOpacity>
        )} />

      <Text style={styles.sectionTitle}>Objetos / Cenizas (selecciona varios)</Text>
      <FlatList data={filteredItems} horizontal keyExtractor={(i)=>String(i.id)} style={styles.horizontalList}
        renderItem={({item})=> (
          <TouchableOpacity onPress={()=>toggleItem(item)} style={[styles.card, selectedItems.find(si=>si.id===item.id) && styles.cardSelected]}>
            {item.image ? <Image source={{uri:item.image}} style={styles.thumbnail} /> : <View style={styles.placeholder}><Text>Sin imagen</Text></View>}
            <Text numberOfLines={1} style={styles.cardTitle}>{item.name}</Text>
          </TouchableOpacity>
        )} />

      <Text style={styles.sectionTitle}>Resumen</Text>
      <View style={styles.summary}>
        <Text style={styles.summaryText}>Arma: {selectedWeapon ? selectedWeapon.name : '—'}</Text>
        <Text style={styles.summaryText}>Armadura: {selectedArmor ? selectedArmor.name : '—'}</Text>
        <Text style={styles.summaryText}>Objetos: {selectedItems.length}</Text>
      </View>

      <TouchableOpacity onPress={saveBuild} style={styles.saveButton} disabled={saving}>
        <Text style={styles.saveButtonText}>{saving ? 'Guardando...' : 'Guardar Build'}</Text>
      </TouchableOpacity>

      <View style={{height:40}} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, paddingBottom: 40 },
  center: { flex:1, justifyContent:'center', alignItems:'center' },
  h1: { fontSize: 22, fontWeight:'700', marginBottom: 12 },
  input: { borderWidth:1, borderColor:'#ddd', padding:10, borderRadius:8, marginBottom:12 },
  label: { marginBottom:6 },
  sectionTitle: { fontSize:16, fontWeight:'600', marginTop:10, marginBottom:6 },
  horizontalList: { maxHeight:150, marginBottom:12 },
  card: { width:110, marginRight:10, backgroundColor:'#fafafa', borderRadius:8, padding:8, alignItems:'center', borderWidth:1, borderColor:'#eee' },
  cardSelected: { borderColor:'#4caf50', backgroundColor:'#e8f5e9' },
  thumbnail: { width:80, height:80, resizeMode:'contain' },
  placeholder: { width:80, height:80, justifyContent:'center', alignItems:'center', backgroundColor:'#f0f0f0' },
  cardTitle: { marginTop:6, fontSize:12, textAlign:'center' },
  summary: { padding:12, backgroundColor:'#fff', borderRadius:8, borderWidth:1, borderColor:'#eee' },
  summaryText: { marginBottom:6 },
  saveButton: { marginTop:14, backgroundColor:'#0066cc', padding:12, borderRadius:8, alignItems:'center' },
  saveButtonText: { color:'#fff', fontWeight:'700' }
});
