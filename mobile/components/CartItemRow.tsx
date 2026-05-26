import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { CartItem } from '../types';
import { Colors } from '../constants/colors';

interface Props { item: CartItem; onIncrease: () => void; onDecrease: () => void; onRemove: () => void; }

export function CartItemRow({ item, onIncrease, onDecrease, onRemove }: Props) {
  return (
    <View style={styles.row}>
      <Text style={styles.emoji}>{item.product.emoji}</Text>
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>{item.product.name}</Text>
        <Text style={styles.price}>${(item.product.price * item.quantity).toFixed(2)}</Text>
      </View>
      <View style={styles.controls}>
        <TouchableOpacity style={styles.btn} onPress={onDecrease}><Text style={styles.btnText}>−</Text></TouchableOpacity>
        <Text style={styles.qty}>{item.quantity}</Text>
        <TouchableOpacity style={[styles.btn, styles.btnAdd]} onPress={onIncrease}><Text style={[styles.btnText, { color: '#fff' }]}>+</Text></TouchableOpacity>
      </View>
      <TouchableOpacity onPress={onRemove} style={styles.removeBtn}><Text style={styles.removeText}>✕</Text></TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: Colors.border, gap: 8 },
  emoji: { fontSize: 24 },
  info: { flex: 1 },
  name: { fontSize: 13, fontWeight: '600', color: Colors.text },
  price: { fontSize: 12, color: Colors.primary, fontWeight: '600', marginTop: 2 },
  controls: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  btn: { width: 26, height: 26, borderRadius: 6, borderWidth: 1, borderColor: Colors.border, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.background },
  btnAdd: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  btnText: { fontSize: 16, color: Colors.text, fontWeight: '700', lineHeight: 20 },
  qty: { fontSize: 14, fontWeight: '700', color: Colors.text, minWidth: 20, textAlign: 'center' },
  removeBtn: { padding: 4 },
  removeText: { color: Colors.danger, fontSize: 14, fontWeight: '700' },
});
