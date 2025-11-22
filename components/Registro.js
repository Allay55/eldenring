import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/firebaseConfig';
import { useNavigation } from '@react-navigation/native';

export default function Registro() {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');

  const navigation = useNavigation();

  const handleRegistro = async () => {
    if (!nombre || !correo || !contrasena) {
      Alert.alert('Error', 'Completa todos los campos');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, correo, contrasena);
      const user = userCredential.user;

      await setDoc(doc(db, 'usuarios', user.uid), {
        uid: user.uid,
        nombre: nombre,
        correo: correo,
        ganados: 0,
        perdidos: 0
      });

      Alert.alert('Éxito', 'Usuario registrado correctamente');

      // Te manda al Login
      navigation.navigate('Login');

    } catch (error) {
      Alert.alert('Error al registrarse', error.message);
    }
  };

  return (
    <View style={styles.container}>

      <Text style={styles.titulo}>Registro</Text>

      <TextInput
        placeholder="Nombre"
        value={nombre}
        onChangeText={setNombre}
        style={styles.input}
      />

      <TextInput
        placeholder="Correo"
        value={correo}
        onChangeText={setCorreo}
        autoCapitalize="none"
        keyboardType="email-address"
        style={styles.input}
      />

      <TextInput
        placeholder="Contraseña"
        value={contrasena}
        onChangeText={setContrasena}
        secureTextEntry
        style={styles.input}
      />

      {/* BOTÓN REGISTRARSE */}
      <TouchableOpacity style={styles.boton} onPress={handleRegistro}>
        <Text style={styles.botonTexto}>Registrarse</Text>
      </TouchableOpacity>

      {/* ENLACE A LOGIN */}
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.link}>
          ¿Ya tienes una cuenta? Inicia sesión
        </Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    justifyContent: 'center',
    padding: 20 
  },

  titulo: { 
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: 'bold'
  },

  input: { 
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    marginBottom: 12,
    borderRadius: 6
  },

  boton: {
    backgroundColor: '#111',
    padding: 15,
    borderRadius: 6,
    marginTop: 10
  },

  botonTexto: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold'
  },

  link: {
    marginTop: 15,
    color: 'blue',
    textAlign: 'center'
  }
});
