import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';

export default function SplashScreen({ navigation }: any) {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Landing');
    }, 2000); // 2 second delay for splash
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View className="flex-1 items-center justify-center bg-slate-900">
      <Text className="text-4xl font-bold text-white mb-4 text-center">Chemical Safety Vault</Text>
      <ActivityIndicator size="large" color="#ffffff" />
    </View>
  );
}
