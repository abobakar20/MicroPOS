import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useOrderStore } from '../../store/useOrderStore';
import { Colors } from '../../constants/colors';
import { Order } from '../../types';

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function OrdersScreen() {
  const { orders } = useOrderStore();
  const [selected, setSelected] = useState<Order | null>(null);

  const paymentIcon = (method: Order['paymentMethod']) =>
    method === 'cash' ? '💵' : method === 'card' ? '💳' : '📱';

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.header}>
        <Text style={styles.title}>Order History</Text>
        <Text style={styles.subtitle}>{orders.length} orders</Text>
      </View>

      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, gap: 10 }}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.orderCard} onPress={() => setSelected(item)}>
            <View style={styles.orderTop}>
              <Text style={styles.orderId}>{item.id}</Text>
              <View style={[styles.statusBadge, { backgroundColor: item.status === 'completed' ? '#d1fae5' : '#fee2e2' }]}>
                <Text style={[styles.statusText, { color: item.status === 'completed' ? Colors.success : Colors.danger }]}>
                  {item.status}
                </Text>
              </View>
            </View>
            <View style={styles.orderBottom}>
              <Text style={styles.orderDate}>{formatDate(item.createdAt)}</Text>
              <Text style={styles.orderItems}>{item.items.length} items</Text>
              <Text style={styles.orderPayment}>{paymentIcon(item.paymentMethod)}</Text>
              <Text style={styles.orderTotal}>${item.finalTotal.toFixed(2)}</Text>
            </View>
          </TouchableOpacity>
        )}
      />

      {/* Order Detail Modal */}
      <Modal visible={!!selected} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            {selected && (
              <>
                <Text style={styles.modalTitle}>{selected.id}</Text>
                <Text style={styles.modalDate}>{formatDate(selected.createdAt)}</Text>

                <View style={styles.divider} />

                {selected.items.map((item, i) => (
                  <View key={i} style={styles.itemRow}>
                    <Text style={styles.itemEmoji}>{item.product.emoji}</Text>
                    <Text style={styles.itemName}>{item.product.name}</Text>
                    <Text style={styles.itemQty}>×{item.quantity}</Text>
                    <Text style={styles.itemPrice}>${(item.product.price * item.quantity).toFixed(2)}</Text>
                  </View>
                ))}

                <View style={styles.divider} />

                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Subtotal</Text>
                  <Text style={styles.summaryValue}>${selected.total.toFixed(2)}</Text>
                </View>
                {selected.discount > 0 && (
                  <View style={styles.summaryRow}>
                    <Text style={[styles.summaryLabel, { color: Colors.success }]}>Discount</Text>
                    <Text style={[styles.summaryValue, { color: Colors.success }]}>-${selected.discount.toFixed(2)}</Text>
                  </View>
                )}
                <View style={styles.summaryRow}>
                  <Text style={styles.totalLabel}>Total</Text>
                  <Text style={styles.totalValue}>${selected.finalTotal.toFixed(2)}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Payment</Text>
                  <Text style={styles.summaryValue}>{paymentIcon(selected.paymentMethod)} {selected.paymentMethod}</Text>
                </View>

                <TouchableOpacity style={styles.closeBtn} onPress={() => setSelected(null)}>
                  <Text style={styles.closeBtnText}>Close</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: { fontSize: 20, fontWeight: '800', color: '#fff' },
  subtitle: { fontSize: 13, color: 'rgba(255,255,255,0.8)' },
  orderCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  orderTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  orderId: { fontSize: 15, fontWeight: '700', color: Colors.text },
  statusBadge: { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 2 },
  statusText: { fontSize: 12, fontWeight: '600' },
  orderBottom: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  orderDate: { flex: 1, fontSize: 12, color: Colors.textSecondary },
  orderItems: { fontSize: 12, color: Colors.textMuted },
  orderPayment: { fontSize: 16 },
  orderTotal: { fontSize: 16, fontWeight: '700', color: Colors.primary },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalCard: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    maxHeight: '85%',
  },
  modalTitle: { fontSize: 18, fontWeight: '700', color: Colors.text, textAlign: 'center' },
  modalDate: { fontSize: 13, color: Colors.textSecondary, textAlign: 'center', marginBottom: 16 },
  divider: { height: 1, backgroundColor: Colors.border, marginVertical: 12 },
  itemRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  itemEmoji: { fontSize: 20 },
  itemName: { flex: 1, fontSize: 14, color: Colors.text, fontWeight: '500' },
  itemQty: { fontSize: 13, color: Colors.textSecondary },
  itemPrice: { fontSize: 14, fontWeight: '600', color: Colors.primary },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  summaryLabel: { fontSize: 14, color: Colors.textSecondary },
  summaryValue: { fontSize: 14, color: Colors.text, fontWeight: '500' },
  totalLabel: { fontSize: 16, fontWeight: '700', color: Colors.text },
  totalValue: { fontSize: 18, fontWeight: '800', color: Colors.primary },
  closeBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 16,
  },
  closeBtnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
