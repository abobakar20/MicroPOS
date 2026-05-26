import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ProductCard } from '../../components/ProductCard';
import { CartItemRow } from '../../components/CartItemRow';
import { useCartStore } from '../../store/useCartStore';
import { useProductStore } from '../../store/useProductStore';
import { useOrderStore } from '../../store/useOrderStore';
import { Colors } from '../../constants/colors';
import { CATEGORIES } from '../../constants/mockData';
import { Order } from '../../types';

const { width } = Dimensions.get('window');
const isTablet = width >= 768;

export default function POSScreen() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<Order['paymentMethod']>('cash');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [discountInput, setDiscountInput] = useState('');

  const { products } = useProductStore();
  const { items, addItem, removeItem, updateQuantity, discount, setDiscount, clearCart, getTotal, getFinalTotal } = useCartStore();
  const { addOrder } = useOrderStore();

  const filteredProducts = products.filter((p) => {
    const matchCat = selectedCategory === 'All' || p.category === selectedCategory;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleCheckout = () => {
    if (items.length === 0) {
      Alert.alert('Cart Empty', 'Add products before checkout.');
      return;
    }
    setShowPaymentModal(true);
  };

  const handleConfirmPayment = () => {
    addOrder(items, getTotal(), discount, paymentMethod);
    clearCart();
    setDiscountInput('');
    setShowPaymentModal(false);
    Alert.alert('✅ Success', 'Order completed!');
  };

  const handleDiscountChange = (val: string) => {
    setDiscountInput(val);
    const num = parseFloat(val);
    setDiscount(isNaN(num) ? 0 : num);
  };

  const cartContent = (
    <View style={styles.cart}>
      <Text style={styles.cartTitle}>🛒 Cart ({items.length})</Text>
      {items.length === 0 ? (
        <View style={styles.emptyCart}>
          <Text style={styles.emptyCartText}>No items yet</Text>
          <Text style={styles.emptyCartSub}>Tap products to add</Text>
        </View>
      ) : (
        <ScrollView style={styles.cartScroll} showsVerticalScrollIndicator={false}>
          {items.map((item) => (
            <CartItemRow
              key={item.product.id}
              item={item}
              onIncrease={() => updateQuantity(item.product.id, item.quantity + 1)}
              onDecrease={() => updateQuantity(item.product.id, item.quantity - 1)}
              onRemove={() => removeItem(item.product.id)}
            />
          ))}
        </ScrollView>
      )}
      <View style={styles.cartFooter}>
        <View style={styles.discountRow}>
          <Text style={styles.discountLabel}>Discount ($)</Text>
          <TextInput
            style={styles.discountInput}
            value={discountInput}
            onChangeText={handleDiscountChange}
            keyboardType="decimal-pad"
            placeholder="0.00"
          />
        </View>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Subtotal</Text>
          <Text style={styles.totalValue}>${getTotal().toFixed(2)}</Text>
        </View>
        {discount > 0 && (
          <View style={styles.totalRow}>
            <Text style={[styles.totalLabel, { color: Colors.success }]}>Discount</Text>
            <Text style={[styles.totalValue, { color: Colors.success }]}>-${discount.toFixed(2)}</Text>
          </View>
        )}
        <View style={[styles.totalRow, styles.finalRow]}>
          <Text style={styles.finalLabel}>Total</Text>
          <Text style={styles.finalValue}>${getFinalTotal().toFixed(2)}</Text>
        </View>
        <TouchableOpacity
          style={[styles.checkoutBtn, items.length === 0 && styles.checkoutBtnDisabled]}
          onPress={handleCheckout}
        >
          <Text style={styles.checkoutText}>Checkout →</Text>
        </TouchableOpacity>
        {items.length > 0 && (
          <TouchableOpacity style={styles.clearBtn} onPress={clearCart}>
            <Text style={styles.clearBtnText}>Clear Cart</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>MicroPOS</Text>
        <Text style={styles.headerSub}>Point of Sale</Text>
      </View>

      <View style={styles.body}>
        {/* Products Section */}
        <View style={styles.productsSection}>
          <TextInput
            style={styles.search}
            placeholder="Search products..."
            value={search}
            onChangeText={setSearch}
            placeholderTextColor={Colors.textMuted}
          />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.categories}
            contentContainerStyle={{ gap: 8 }}
          >
            {CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[styles.catChip, selectedCategory === cat && styles.catChipActive]}
                onPress={() => setSelectedCategory(cat)}
              >
                <Text style={[styles.catChipText, selectedCategory === cat && styles.catChipTextActive]}>
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <FlatList
            data={filteredProducts}
            numColumns={isTablet ? 4 : 3}
            key={isTablet ? 'tablet' : 'phone'}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.productWrapper}>
                <ProductCard product={item} onPress={() => addItem(item)} />
              </View>
            )}
            contentContainerStyle={{ paddingBottom: 20 }}
            showsVerticalScrollIndicator={false}
          />
        </View>

        {/* Cart Section */}
        {isTablet ? (
          cartContent
        ) : (
          <View style={styles.cartMobile}>{cartContent}</View>
        )}
      </View>

      {/* Payment Modal */}
      <Modal visible={showPaymentModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Select Payment Method</Text>
            <Text style={styles.modalTotal}>Total: ${getFinalTotal().toFixed(2)}</Text>
            {(['cash', 'card', 'mobile'] as const).map((method) => (
              <TouchableOpacity
                key={method}
                style={[styles.paymentOption, paymentMethod === method && styles.paymentOptionActive]}
                onPress={() => setPaymentMethod(method)}
              >
                <Text style={styles.paymentEmoji}>
                  {method === 'cash' ? '💵' : method === 'card' ? '💳' : '📱'}
                </Text>
                <Text style={[styles.paymentText, paymentMethod === method && styles.paymentTextActive]}>
                  {method.charAt(0).toUpperCase() + method.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.confirmBtn} onPress={handleConfirmPayment}>
              <Text style={styles.confirmText}>Confirm Payment</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowPaymentModal(false)}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
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
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: { fontSize: 20, fontWeight: '800', color: '#fff' },
  headerSub: { fontSize: 12, color: 'rgba(255,255,255,0.8)' },
  body: { flex: 1, flexDirection: isTablet ? 'row' : 'column' },
  productsSection: { flex: isTablet ? 2 : 1.4, padding: 12 },
  search: {
    backgroundColor: Colors.surface,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 10,
    color: Colors.text,
  },
  categories: { marginBottom: 10 },
  catChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  catChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  catChipText: { fontSize: 13, color: Colors.textSecondary, fontWeight: '500' },
  catChipTextActive: { color: '#fff', fontWeight: '600' },
  productWrapper: { flex: 1, margin: 4 },
  cart: {
    flex: isTablet ? 1 : undefined,
    height: isTablet ? undefined : 340,
    backgroundColor: Colors.surface,
    borderTopWidth: isTablet ? 0 : 1,
    borderTopColor: Colors.border,
    borderLeftWidth: isTablet ? 1 : 0,
    borderLeftColor: Colors.border,
    padding: 12,
  },
  cartMobile: { height: 340 },
  cartTitle: { fontSize: 16, fontWeight: '700', color: Colors.text, marginBottom: 8 },
  emptyCart: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 20 },
  emptyCartText: { fontSize: 15, color: Colors.textSecondary, fontWeight: '600' },
  emptyCartSub: { fontSize: 12, color: Colors.textMuted, marginTop: 4 },
  cartScroll: { flex: 1 },
  cartFooter: { borderTopWidth: 1, borderTopColor: Colors.border, paddingTop: 8 },
  discountRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 },
  discountLabel: { fontSize: 13, color: Colors.textSecondary },
  discountInput: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    fontSize: 13,
    width: 80,
    textAlign: 'right',
    color: Colors.text,
  },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  totalLabel: { fontSize: 13, color: Colors.textSecondary },
  totalValue: { fontSize: 13, color: Colors.text, fontWeight: '600' },
  finalRow: { marginBottom: 8, marginTop: 4 },
  finalLabel: { fontSize: 16, fontWeight: '700', color: Colors.text },
  finalValue: { fontSize: 18, fontWeight: '800', color: Colors.primary },
  checkoutBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 6,
  },
  checkoutBtnDisabled: { backgroundColor: Colors.textMuted },
  checkoutText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  clearBtn: { alignItems: 'center', paddingVertical: 4 },
  clearBtnText: { color: Colors.danger, fontSize: 13, fontWeight: '500' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalCard: { backgroundColor: Colors.surface, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 24 },
  modalTitle: { fontSize: 18, fontWeight: '700', color: Colors.text, marginBottom: 4, textAlign: 'center' },
  modalTotal: { fontSize: 22, fontWeight: '800', color: Colors.primary, textAlign: 'center', marginBottom: 20 },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.border,
    marginBottom: 10,
  },
  paymentOptionActive: { borderColor: Colors.primary, backgroundColor: Colors.primaryLight },
  paymentEmoji: { fontSize: 24 },
  paymentText: { fontSize: 16, fontWeight: '600', color: Colors.text },
  paymentTextActive: { color: Colors.primary },
  confirmBtn: { backgroundColor: Colors.primary, borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginTop: 10 },
  confirmText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  cancelBtn: { alignItems: 'center', paddingVertical: 12 },
  cancelText: { color: Colors.textSecondary, fontSize: 15 },
});
