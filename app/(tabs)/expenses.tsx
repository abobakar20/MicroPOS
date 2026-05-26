import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  TextInput, Modal, Alert, ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useExpenseStore } from '../../store/useExpenseStore';
import { Colors } from '../../constants/colors';
import { Expense } from '../../types';
import { EXPENSE_CATEGORIES } from '../../constants/mockData';

const CATEGORY_COLORS: Record<string, string> = {
  Rent: '#6366f1',
  Utilities: '#f59e0b',
  Salaries: '#10b981',
  Marketing: '#ec4899',
  Supplies: '#3b82f6',
  Other: '#94a3b8',
};

const CATEGORY_EMOJIS: Record<string, string> = {
  Rent: '🏠',
  Utilities: '⚡',
  Salaries: '👥',
  Marketing: '📣',
  Supplies: '📦',
  Other: '💼',
};

export default function ExpensesScreen() {
  const { expenses, addExpense, deleteExpense, getTotalExpenses } = useExpenseStore();
  const [modalVisible, setModalVisible] = useState(false);
  const [form, setForm] = useState<{ category: Expense['category']; amount: string; note: string }>({
    category: 'Rent',
    amount: '',
    note: '',
  });

  const handleSave = () => {
    if (!form.amount) { Alert.alert('Error', 'Amount is required.'); return; }
    addExpense({
      category: form.category,
      amount: parseFloat(form.amount),
      note: form.note,
    });
    setModalVisible(false);
    setForm({ category: 'Rent', amount: '', note: '' });
  };

  // Category breakdown
  const breakdown = EXPENSE_CATEGORIES.map((cat) => ({
    cat,
    total: expenses.filter((e) => e.category === cat).reduce((s, e) => s + e.amount, 0),
  })).filter((b) => b.total > 0);

  const totalExpenses = getTotalExpenses();

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.header}>
        <Text style={styles.title}>Expenses</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => setModalVisible(true)}>
          <Text style={styles.addBtnText}>+ Add</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
        {/* Total */}
        <View style={styles.totalCard}>
          <Text style={styles.totalCardLabel}>Total Expenses</Text>
          <Text style={styles.totalCardValue}>${totalExpenses.toFixed(2)}</Text>
          <Text style={styles.totalCardSub}>{expenses.length} expense records</Text>
        </View>

        {/* Breakdown */}
        {breakdown.length > 0 && (
          <View style={styles.breakdownCard}>
            <Text style={styles.sectionTitle}>By Category</Text>
            {breakdown.map(({ cat, total }) => (
              <View key={cat} style={styles.breakdownRow}>
                <Text style={styles.breakdownEmoji}>{CATEGORY_EMOJIS[cat]}</Text>
                <Text style={styles.breakdownCat}>{cat}</Text>
                <View style={styles.breakdownBarWrap}>
                  <View
                    style={[
                      styles.breakdownBar,
                      {
                        width: `${Math.min(100, (total / totalExpenses) * 100)}%`,
                        backgroundColor: CATEGORY_COLORS[cat],
                      },
                    ]}
                  />
                </View>
                <Text style={styles.breakdownAmount}>${total.toFixed(2)}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Expense list */}
        <Text style={styles.sectionTitle}>All Expenses</Text>
        {expenses.map((item) => (
          <View key={item.id} style={styles.expenseCard}>
            <View style={[styles.catDot, { backgroundColor: CATEGORY_COLORS[item.category] }]}>
              <Text style={styles.catDotEmoji}>{CATEGORY_EMOJIS[item.category]}</Text>
            </View>
            <View style={styles.expInfo}>
              <Text style={styles.expCategory}>{item.category}</Text>
              {item.note ? <Text style={styles.expNote}>{item.note}</Text> : null}
              <Text style={styles.expDate}>
                {new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </Text>
            </View>
            <Text style={styles.expAmount}>${item.amount.toFixed(2)}</Text>
            <TouchableOpacity
              onPress={() => Alert.alert('Delete', 'Delete this expense?', [
                { text: 'Cancel' },
                { text: 'Delete', style: 'destructive', onPress: () => deleteExpense(item.id) },
              ])}
              style={{ padding: 4 }}
            >
              <Text>🗑️</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Add Expense</Text>

            <Text style={styles.label}>Category</Text>
            <View style={styles.chipRow}>
              {EXPENSE_CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[styles.chip, form.category === cat && styles.chipActive]}
                  onPress={() => setForm((f) => ({ ...f, category: cat as Expense['category'] }))}
                >
                  <Text style={styles.chipEmoji}>{CATEGORY_EMOJIS[cat]}</Text>
                  <Text style={[styles.chipText, form.category === cat && styles.chipTextActive]}>{cat}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Amount ($)</Text>
            <TextInput
              style={styles.input}
              value={form.amount}
              onChangeText={(v) => setForm((f) => ({ ...f, amount: v }))}
              keyboardType="decimal-pad"
              placeholder="0.00"
            />

            <Text style={styles.label}>Note (optional)</Text>
            <TextInput
              style={styles.input}
              value={form.note}
              onChangeText={(v) => setForm((f) => ({ ...f, note: v }))}
              placeholder="e.g. January rent"
            />

            <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
              <Text style={styles.saveBtnText}>Add Expense</Text>
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
  totalCard: {
    backgroundColor: Colors.primary,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  totalCardLabel: { fontSize: 13, color: 'rgba(255,255,255,0.8)' },
  totalCardValue: { fontSize: 36, fontWeight: '900', color: '#fff', marginVertical: 4 },
  totalCardSub: { fontSize: 12, color: 'rgba(255,255,255,0.7)' },
  breakdownCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 10,
  },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: Colors.text },
  breakdownRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  breakdownEmoji: { fontSize: 18, width: 24 },
  breakdownCat: { fontSize: 13, color: Colors.text, width: 70 },
  breakdownBarWrap: { flex: 1, height: 8, backgroundColor: Colors.border, borderRadius: 4, overflow: 'hidden' },
  breakdownBar: { height: 8, borderRadius: 4 },
  breakdownAmount: { fontSize: 13, fontWeight: '700', color: Colors.text, width: 65, textAlign: 'right' },
  expenseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 10,
  },
  catDot: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  catDotEmoji: { fontSize: 20 },
  expInfo: { flex: 1 },
  expCategory: { fontSize: 14, fontWeight: '700', color: Colors.text },
  expNote: { fontSize: 12, color: Colors.textSecondary, marginTop: 1 },
  expDate: { fontSize: 11, color: Colors.textMuted, marginTop: 2 },
  expAmount: { fontSize: 16, fontWeight: '800', color: Colors.danger },
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
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 4 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  chipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  chipEmoji: { fontSize: 14 },
  chipText: { fontSize: 12, color: Colors.textSecondary },
  chipTextActive: { color: '#fff', fontWeight: '600' },
  saveBtn: { backgroundColor: Colors.primary, borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginTop: 20 },
  saveBtnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  cancelBtn: { alignItems: 'center', paddingVertical: 12 },
  cancelBtnText: { color: Colors.textSecondary, fontSize: 15 },
});
