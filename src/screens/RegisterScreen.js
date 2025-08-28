import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

export default function RegisterScreen({ navigation }) {
  const [form, setForm] = useState({
    name: '', age: '', phone: '', email: '', password: '', role: 'user'
  });

  const handleRegister = () => {
    // Placeholder (replace with your backend API later)
    console.log("Registering:", form);
    alert("Register clicked!");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>
      {['name','age','phone','email','password','role'].map(key => (
        <TextInput
          key={key}
          style={styles.input}
          placeholder={key}
          secureTextEntry={key === 'password'}
          value={form[key]}
          onChangeText={(val) => setForm({ ...form, [key]: val })}
        />
      ))}
      <Button title="Register" onPress={handleRegister}/>
      <Button title="Back to Login" onPress={() => navigation.navigate('Login')}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{ flex:1, justifyContent:'center', padding:20 },
  input:{ borderWidth:1, padding:10, marginVertical:5, borderRadius:5 },
  title:{ fontSize:24, marginBottom:20, textAlign:'center' }
});
