// App.js
import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase/firebaseConfig';

import Home from './components/Home';
import BuildCreator from './components/BuildCreator';
import Logout from './components/Logout';
import Registro from './components/Registro';
import Login from './components/Login';
import Bosses from './components/Bosses';
import ItemDetail from './components/ItemDetail';

const Tab = createBottomTabNavigator();

export default function App() {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [bosses, setBosses] = useState([]);

  // Escucha el estado de autenticación
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUsuario(u);
      setCargando(false);
    });
    return unsub;
  }, []);

  // Trae los bosses desde la API
  useEffect(() => {
    fetch('https://eldenring.fanapis.com/api/bosses?limit=20')
      .then(res => res.json())
      .then(data => setBosses(data.data || []))
      .catch(err => console.error(err));
  }, []);

  if (cargando) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={{ headerShown: false }}>
        {usuario ? (
          <>
            <Tab.Screen name="Home" component={Home} />
            <Tab.Screen name="BuildCreator" component={BuildCreator} />

            {/* Bosses recibe los datos cargados */}
            <Tab.Screen name="Bosses">
              {() => <Bosses bosses={bosses} />}
            </Tab.Screen>

            <Tab.Screen name="Logout" component={Logout} />

            {/* OCULTO PERO FUNCIONAL */}
            <Tab.Screen 
              name="ItemDetail" 
              component={ItemDetail}
              options={{ tabBarButton: () => null }}
            />
          </>
        ) : (
          <>
            <Tab.Screen name="Registro" component={Registro} />
            <Tab.Screen name="Login" component={Login} />
          </>
        )}
      </Tab.Navigator>
    </NavigationContainer>
  );
}
