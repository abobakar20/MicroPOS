import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  TextInput, Modal, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCustomerStore } from '../../store/useCustomerStore';
import { Colors } from '../../constants/colors';
import { Customer } from '../../types';

export default function CustomersScreen() {
  const { customers, addCustomer, updateCustomer, deleteCustomer } = useCustomerStore();
  const [search, setSearch] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [editing, setEditing] = useState<Customer | null>(null);
  const [form, setForm] = useState({ name: '', phone: '', address: '', balance: '' });

  const filtered = customers.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search)
  );

  const openAdd = () => {
    setEditing(null);
    setForm({ name: '', phone: '', address: '', balance: '0' });
    setModalVisible(true);
  };

  const openEdit = (c: Customer) => {
    setEditing(c);
    setForm({ name: c.name, phone: c.phone, address: c.address || '', balance: c.balance.toString() });
    setModalVisible(true);
  };

  const handleSave = () => {
    if (!form.name || !form.phone) {
      Alert.alert('Error', 'Name and phone are required.');
      return;
    }
    const data = {
      name: form.name,
      phone: form.phone,
      address: form.address,
      balance: parseFloat(form.balance) || 0,
    };
    if (editing) {
      updateCustomer(editing.id, data);
    } else {
      addCustomer(data);
    }
    setModalVisible(false);
  };

  const handleDelete = (c: Customer) => {
    Alert.alert('Delete', `Delete customer "${c.name}"?`, [
      { text: 'Cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteCustomer(c.id) },
    ]);
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.header}>
        <Text style={styles.title}>Customers</Text>
        <TouchableOpacity style={styles.addBtn} onPress={openAdd}>
          <Text style={styles.addBtnText}>+ Add</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.search}
        placeholder="Search by name or phone..."
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
              <Text style={styles.avatarText}>{item.name.charAt(0).toUpperCase()}</Text>
            </View>
            <View style={styles.info}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.phone}>{item.phone}</Text>
              {item.address ? <Text style={styles.address}>{item.address}</Text> : null}
            </View>
            <View style={styles.right}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>${item.totalPurchases.toFixed(2)}</Text>
              {item.balance !== 0 && (
                <Text style={[styles.balance, { color: item.balance > 0 ? Colors.danger : Colors.success }]}>
                  {item.balance > 0 ? `Owes $${item.balance.toFixed(2)}` : `Credit $${Math.abs(item.balance).toFixed(2)}`}
                </Text>
              )}
            </View>
            <View style={styles.actions}>
              <TouchableOpacity onPress={() => openEdit(item)} style={styles.actionBtn}>
                <Text>✏️</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDelete(item)} style={styles.actionBtn}>
                <Text>🗑️</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No customers yet</Text>
          </View>
        }
      />

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>{editing ? 'Edit Customer' : 'Add Customer'}</Text>

            {[
              { label: 'Full Name *', key: 'name', placeholder: 'Customer name' },
              { label: 'Phone *', key: 'phone', placeholder: '+252 ...' },
              { label: 'Address', key: 'address', placeholder: 'City, Country' },
              { label: 'Balance ($)', key: 'balance', placeholder: '0.00' },
            ].map(({ label, key, placeholder }) => (
              <View key={key}>
                <Text style={styles.label}>{label}</Text>
                <TextInput
                  style={styles.input}
                  value={form[key as keyof typeof form]}
                  onChangeText={(v) => setForm((f) => ({ ...f, [key]: v }))}
                  placeholder={placeholder}
                  keyboardType={key === 'balance' ? 'decimal-pad' : 'default'}
                />
              </View>
            ))}

            <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
              <Text style={styles.saveBtnText}>{editing ? 'Save Changes' : 'Add Customer'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalVisible(false)}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
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
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: { fontSize: 20, fontWeight: '800', color: '#fff' },
  addBtn: { backgroundColor: '#fff', borderRadius: 8, paddingHorizontal: 14, paddingVertical: 6 },
  addBtnText: { color: Colors.primary, fontWeight: '700', fontSize: 14 },
  search: {
    margin: 16,
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
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: 18, fontWeight: '700', color: Colors.primary },
  info: { flex: 1 },
  name: { fontSize: 14, fontWeight: '700', color: Colors.text },
  phone: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  address: { fontSize: 11, color: Colors.textMuted, marginTop: 1 },
  right: { alignItems: 'flex-end' },
  totalLabel: { fontSize: 10, color: Colors.textMuted },
  totalValue: { fontSize: 14, fontWeight: '700', color: Colors.text },
  balance: { fontSize: 11, fontWeight: '600', marginTop: 2 },
  actions: { gap: 4 },
  actionBtn: { padding: 4 },
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
  saveBtn: { backgroundColor: Colors.primary, borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginTop: 20 },
  saveBtnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  cancelBtn: { alignItems: 'center', paddingVertical: 12 },
  cancelBtnText: { color: Colors.textSecondary, fontSize: 15 },
});
