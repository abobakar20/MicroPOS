import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  TextInput, Modal, Alert, ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSupplierStore } from '../../store/useSupplierStore';
import { useProductStore } from '../../store/useProductStore';
import { Colors } from '../../constants/colors';
import { Supplier } from '../../types';

export default function SuppliersScreen() {
  const { suppliers, purchases, addSupplier, updateSupplier, deleteSupplier, addPurchase } = useSupplierStore();
  const { products, updateProduct } = useProductStore();
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState<'suppliers' | 'purchases'>('suppliers');
  const [supplierModal, setSupplierModal] = useState(false);
  const [purchaseModal, setPurchaseModal] = useState(false);
  const [editing, setEditing] = useState<Supplier | null>(null);
  const [sForm, setSForm] = useState({ name: '', phone: '', company: '' });
  const [pForm, setPForm] = useState({ supplierId: '', productId: '', quantity: '', unitCost: '' });

  const filtered = suppliers.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.company.toLowerCase().includes(search.toLowerCase())
  );

  const handleSaveSupplier = () => {
    if (!sForm.name || !sForm.phone) { Alert.alert('Error', 'Name and phone required.'); return; }
    if (editing) {
      updateSupplier(editing.id, sForm);
    } else {
      addSupplier(sForm);
    }
    setSupplierModal(false);
  };

  const handleSavePurchase = () => {
    if (!pForm.supplierId || !pForm.productId || !pForm.quantity || !pForm.unitCost) {
      Alert.alert('Error', 'All fields required.');
      return;
    }
    const qty = parseInt(pForm.quantity);
    const cost = parseFloat(pForm.unitCost);
    const product = products.find((p) => p.id === pForm.productId);
    if (!product) return;
    addPurchase({
      supplierId: pForm.supplierId,
      productId: pForm.productId,
      productName: product.name,
      quantity: qty,
      unitCost: cost,
      totalCost: qty * cost,
    });
    // Update product stock
    updateProduct(pForm.productId, { stock: product.stock + qty });
    setPurchaseModal(false);
    Alert.alert('✅ Success', `Added ${qty} units of ${product.name} to stock.`);
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.header}>
        <Text style={styles.title}>Suppliers</Text>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => {
            if (tab === 'suppliers') {
              setEditing(null);
              setSForm({ name: '', phone: '', company: '' });
              setSupplierModal(true);
            } else {
              setPForm({ supplierId: '', productId: '', quantity: '', unitCost: '' });
              setPurchaseModal(true);
            }
          }}
        >
          <Text style={styles.addBtnText}>+ Add</Text>
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabRow}>
        {(['suppliers', 'purchases'] as const).map((t) => (
          <TouchableOpacity
            key={t}
            style={[styles.tabBtn, tab === t && styles.tabBtnActive]}
            onPress={() => setTab(t)}
          >
            <Text style={[styles.tabBtnText, tab === t && styles.tabBtnTextActive]}>
              {t === 'suppliers' ? `Suppliers (${suppliers.length})` : `Purchases (${purchases.length})`}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {tab === 'suppliers' ? (
        <>
          <TextInput
            style={styles.search}
            placeholder="Search suppliers..."
            value={search}
            onChangeText={setSearch}
            placeholderTextColor={Colors.textMuted}
          />
          <FlatList
            data={filtered}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ padding: 16, gap: 10 }}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{item.name.charAt(0)}</Text>
                </View>
                <View style={styles.info}>
                  <Text style={styles.name}>{item.name}</Text>
                  <Text style={styles.sub}>{item.company}</Text>
                  <Text style={styles.phone}>{item.phone}</Text>
                </View>
                <View style={styles.right}>
                  <Text style={styles.totalLabel}>Purchased</Text>
                  <Text style={styles.totalValue}>${item.totalPurchased.toFixed(2)}</Text>
                </View>
                <View style={styles.actions}>
                  <TouchableOpacity onPress={() => { setEditing(item); setSForm({ name: item.name, phone: item.phone, company: item.company }); setSupplierModal(true); }}>
                    <Text style={{ fontSize: 18 }}>✏️</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => {
                    Alert.alert('Delete', `Delete "${item.name}"?`, [
                      { text: 'Cancel' },
                      { text: 'Delete', style: 'destructive', onPress: () => deleteSupplier(item.id) },
                    ]);
                  }}>
                    <Text style={{ fontSize: 18 }}>🗑️</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        </>
      ) : (
        <FlatList
          data={purchases}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16, gap: 10 }}
          renderItem={({ item }) => {
            const supplier = suppliers.find((s) => s.id === item.supplierId);
            return (
              <View style={styles.purchaseCard}>
                <View style={styles.purchaseInfo}>
                  <Text style={styles.name}>{item.productName}</Text>
                  <Text style={styles.sub}>From: {supplier?.name || item.supplierId}</Text>
                  <Text style={styles.phone}>
                    {new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </Text>
                </View>
                <View style={styles.right}>
                  <Text style={styles.totalLabel}>×{item.quantity} @ ${item.unitCost.toFixed(2)}</Text>
                  <Text style={styles.totalValue}>${item.totalCost.toFixed(2)}</Text>
                </View>
              </View>
            );
          }}
          ListEmptyComponent={
            <View style={styles.empty}><Text style={styles.emptyText}>No purchases logged yet</Text></View>
          }
        />
      )}

      {/* Supplier Modal */}
      <Modal visible={supplierModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>{editing ? 'Edit Supplier' : 'Add Supplier'}</Text>
            {[
              { label: 'Name *', key: 'name', placeholder: 'Supplier name' },
              { label: 'Phone *', key: 'phone', placeholder: '+252 ...' },
              { label: 'Company', key: 'company', placeholder: 'Company name' },
            ].map(({ label, key, placeholder }) => (
              <View key={key}>
                <Text style={styles.label}>{label}</Text>
                <TextInput
                  style={styles.input}
                  value={sForm[key as keyof typeof sForm]}
                  onChangeText={(v) => setSForm((f) => ({ ...f, [key]: v }))}
                  placeholder={placeholder}
                />
              </View>
            ))}
            <TouchableOpacity style={styles.saveBtn} onPress={handleSaveSupplier}>
              <Text style={styles.saveBtnText}>{editing ? 'Save Changes' : 'Add Supplier'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelBtn} onPress={() => setSupplierModal(false)}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Purchase Modal */}
      <Modal visible={purchaseModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <ScrollView>
            <View style={[styles.modalCard, { marginTop: 60 }]}>
              <Text style={styles.modalTitle}>Log Purchase</Text>

              <Text style={styles.label}>Supplier</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 8 }}>
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  {suppliers.map((s) => (
                    <TouchableOpacity
                      key={s.id}
                      style={[styles.chip, pForm.supplierId === s.id && styles.chipActive]}
                      onPress={() => setPForm((f) => ({ ...f, supplierId: s.id }))}
                    >
                      <Text style={[styles.chipText, pForm.supplierId === s.id && { color: '#fff' }]}>{s.name}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>

              <Text style={styles.label}>Product</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 8 }}>
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  {products.map((p) => (
                    <TouchableOpacity
                      key={p.id}
                      style={[styles.chip, pForm.productId === p.id && styles.chipActive]}
                      onPress={() => setPForm((f) => ({ ...f, productId: p.id }))}
                    >
                      <Text style={[styles.chipText, pForm.productId === p.id && { color: '#fff' }]}>{p.emoji} {p.name}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>

              <Text style={styles.label}>Quantity</Text>
              <TextInput
                style={styles.input}
                value={pForm.quantity}
                onChangeText={(v) => setPForm((f) => ({ ...f, quantity: v }))}
                keyboardType="number-pad"
                placeholder="0"
              />

              <Text style={styles.label}>Unit Cost ($)</Text>
              <TextInput
                style={styles.input}
                value={pForm.unitCost}
                onChangeText={(v) => setPForm((f) => ({ ...f, unitCost: v }))}
                keyboardType="decimal-pad"
                placeholder="0.00"
              />

              {pForm.quantity && pForm.unitCost && (
                <Text style={styles.totalSummary}>
                  Total: ${(parseFloat(pForm.quantity || '0') * parseFloat(pForm.unitCost || '0')).toFixed(2)}
                </Text>
              )}

              <TouchableOpacity style={styles.saveBtn} onPress={handleSavePurchase}>
                <Text style={styles.saveBtnText}>Log Purchase</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setPurchaseModal(false)}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
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
  addBtn: { backgroundColor: '#fff', borderRadius: 8, paddingHorizontal: 14, paddingVertical: 6 },
  addBtnText: { color: Colors.primary, fontWeight: '700', fontSize: 14 },
  tabRow: { flexDirection: 'row', margin: 16, backgroundColor: Colors.border, borderRadius: 10, padding: 3 },
  tabBtn: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 8 },
  tabBtnActive: { backgroundColor: Colors.surface, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 2 },
  tabBtnText: { fontSize: 13, color: Colors.textSecondary, fontWeight: '500' },
  tabBtnTextActive: { color: Colors.text, fontWeight: '700' },
  search: {
    marginHorizontal: 16,
    backgroundColor: Colors.surface,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    color: Colors.text,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 10,
  },
  purchaseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  purchaseInfo: { flex: 1 },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#fef3c7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: 18, fontWeight: '700', color: '#d97706' },
  info: { flex: 1 },
  name: { fontSize: 14, fontWeight: '700', color: Colors.text },
  sub: { fontSize: 12, color: Colors.primary, marginTop: 1 },
  phone: { fontSize: 11, color: Colors.textMuted, marginTop: 1 },
  right: { alignItems: 'flex-end', marginLeft: 8 },
  totalLabel: { fontSize: 10, color: Colors.textMuted },
  totalValue: { fontSize: 14, fontWeight: '700', color: Colors.text },
  actions: { gap: 4 },
  empty: { paddingVertical: 40, alignItems: 'center' },
  emptyText: { fontSize: 15, color: Colors.textMuted },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalCard: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
  },
  modalTitle: { fontSize: 18, fontWeight: '700', color: Colors.text, marginBottom: 12, textAlign: 'center' },
  label: { fontSize: 13, fontWeight: '600', color: Colors.textSecondary, marginBottom: 4, marginTop: 10 },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: Colors.text,
    backgroundColor: Colors.background,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  chipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  chipText: { fontSize: 13, color: Colors.textSecondary, fontWeight: '500' },
  totalSummary: { fontSize: 15, fontWeight: '700', color: Colors.primary, textAlign: 'center', marginTop: 8 },
  saveBtn: { backgroundColor: Colors.primary, borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginTop: 16 },
  saveBtnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  cancelBtn: { alignItems: 'center', paddingVertical: 12 },
  cancelBtnText: { color: Colors.textSecondary, fontSize: 15 },
});
