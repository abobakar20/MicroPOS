import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Product } from '../types';
import { Colors } from '../constants/colors';

interface Props { product: Product; onPress: () => void; }

export function ProductCard({ product, onPress }: Props) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <Text style={styles.emoji}>{product.emoji}</Text>
      <Text style={styles.name} numberOfLines={1}>{product.name}</Text>
      <Text style={styles.price}>${product.price.toFixed(2)}</Text>
      <View style={styles.stockBadge}>
        <Text style={styles.stockText}>{product.stock} left</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: Colors.surface, borderRadius: 12, padding: 12, alignItems: 'center', borderWidth: 1, borderColor: Colors.border, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  emoji: { fontSize: 36, marginBottom: 6 },
  name: { fontSize: 13, fontWeight: '600', color: Colors.text, textAlign: 'center', marginBottom: 4 },
  price: { fontSize: 14, fontWeight: '700', color: Colors.primary, marginBottom: 4 },
  stockBadge: { backgroundColor: Colors.primaryLight, borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 },
  stockText: { fontSize: 10, color: Colors.primary, fontWeight: '500' },
});
