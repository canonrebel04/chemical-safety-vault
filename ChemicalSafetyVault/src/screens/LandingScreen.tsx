import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { ShieldAlert } from 'lucide-react-native';

export default function LandingScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-slate-900 p-6">
      <ShieldAlert size={64} color="#3b82f6" className="mb-8" />
      <Text className="text-4xl font-extrabold text-white text-center mb-4">
        Chemical Safety Log Vault
      </Text>
      <Text className="text-lg text-slate-400 text-center mb-12">
        The ultimate safety companion for auto-parts & small blender shops.
      </Text>
      <TouchableOpacity 
        className="bg-blue-600 px-10 py-4 rounded-xl shadow-lg w-full"
        onPress={() => console.log('Sign in pressed')}
      >
        <Text className="text-white text-xl font-bold text-center">Sign In</Text>
      </TouchableOpacity>
    </View>
  );
}
