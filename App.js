import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Button, Alert } from 'react-native';
import JsSIP from 'jssip';
import * as Permissions from 'expo-permissions';
import { Audio } from 'expo-av';

export default function App() {
  const [number, setNumber] = useState('');

  // Configuration for the SIP connection
  const configuration = {
    sockets: [new JsSIP.WebSocketInterface('')],
    uri: '',
    password: '',
  };

  const ua = new JsSIP.UA(configuration);

  const requestPermissions = async () => {
    const { status } = await Audio.requestPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission not granted', 'Sorry, we need microphone permissions to make this work!');
    }
  }

  // Handle the call initiation
  const handleCall = async () => {
    await requestPermissions();
    ua.start();

    const session = ua.call(number);

    // Add event listeners
    session.on('progress', (event) => {
      console.log('Call is in progress');
    });

    session.on('confirmed', (event) => {
      console.log('Call is established');
    });

    session.on('ended', (event) => {
      console.log('Call ended with cause:', event.cause);
    });

    session.on('failed', (event) => {
      console.log('Call failed with cause:', event.cause);
    });
  }

  return (
      <View style={styles.container}>
        <Text>Enter the number to call:</Text>
        <TextInput
            style={styles.input}
            value={number}
            onChangeText={setNumber}
            placeholder="Enter the number"
            keyboardType="numeric"
        />
        <Button title="Call" onPress={handleCall} />
        <StatusBar style="auto" />
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    width: 200,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    margin: 10,
    padding: 5
  }
});
