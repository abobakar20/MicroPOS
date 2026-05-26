import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BarChart } from 'react-native-chart-kit';
import { useOrderStore } from '../../store/useOrderStore';
import { useProductStore } from '../../store/useProductStore';
import { Colors } from '../../constants/colors';

const screenWidth = Dimensions.get('window').width;

function StatCard({ emoji, label, value, color }: { emoji: string; label: string; value: string; color: string }) {
  return (
    <View style={[styles.statCard, { borderTopColor: color, borderTopWidth: 3 }]}>
      <Text style={styles.statEmoji}>{emoji}</Text>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

export default function ReportsScreen() {
  const { orders } = useOrderStore();
  const { products } = useProductStore();

  const today = new Date();
  const todayStr = today.toDateString();

  const todayOrders = orders.filter((o) => new Date(o.createdAt).toDateString() === todayStr);
  const todayRevenue = todayOrders.reduce((sum, o) => sum + o.finalTotal, 0);
  const totalRevenue = orders.reduce((sum, o) => sum + o.finalTotal, 0);

  // Top products
  const productSales: Record<string, number> = {};
  orders.forEach((order) => {
    order.items.forEach((item) => {
      productSales[item.product.name] = (productSales[item.product.name] || 0) + item.quantity;
    });
  });
  const topProducts = Object.entries(productSales)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // Weekly sales
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const weeklySales = Array(7).fill(0);
  orders.forEach((order) => {
    const day = new Date(order.createdAt).getDay();
    weeklySales[day] += order.finalTotal;
  });

  const chartData = {
    labels: weekDays,
    datasets: [{ data: weeklySales }],
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.header}>
        <Text style={styles.title}>Reports</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, gap: 16 }}>
        {/* Stats Row */}
        <View style={styles.statsRow}>
          <StatCard emoji="💰" label="Today's Revenue" value={`$${todayRevenue.toFixed(2)}`} color={Colors.primary} />
          <StatCard emoji="📋" label="Today's Orders" value={String(todayOrders.length)} color={Colors.success} />
          <StatCard emoji="📦" label="Products" value={String(products.length)} color={Colors.secondary} />
        </View>

        <View style={styles.statsRow}>
          <StatCard emoji="💵" label="Total Revenue" value={`$${totalRevenue.toFixed(2)}`} color={Colors.primaryDark} />
          <StatCard emoji="🛒" label="Total Orders" value={String(orders.length)} color={Colors.warning} />
          <StatCard
            emoji="📊"
            label="Avg. Order"
            value={orders.length > 0 ? `$${(totalRevenue / orders.length).toFixed(2)}` : '$0'}
            color={Colors.danger}
          />
        </View>

        {/* Weekly Chart */}
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>📈 Weekly Sales</Text>
          <BarChart
            data={chartData}
            width={screenWidth - 48}
            height={200}
            yAxisLabel="$"
            yAxisSuffix=""
            chartConfig={{
              backgroundColor: Colors.surface,
              backgroundGradientFrom: Colors.surface,
              backgroundGradientTo: Colors.surface,
              decimalPlaces: 0,
              color: () => Colors.primary,
              labelColor: () => Colors.textSecondary,
              barPercentage: 0.6,
            }}
            style={{ borderRadius: 8 }}
          />
        </View>

        {/* Top Products */}
        <View style={styles.topCard}>
          <Text style={styles.chartTitle}>🏆 Top Selling Products</Text>
          {topProducts.length === 0 ? (
            <Text style={styles.emptyText}>No sales data yet</Text>
          ) : (
            topProducts.map(([name, qty], i) => (
              <View key={name} style={styles.topProductRow}>
                <Text style={styles.topRank}>#{i + 1}</Text>
                <Text style={styles.topName}>{name}</Text>
                <View style={[styles.topBar, { width: `${Math.min(100, (qty / topProducts[0][1]) * 60)}%` }]} />
                <Text style={styles.topQty}>{qty} sold</Text>
              </View>
            ))
          )}
        </View>

        {/* Recent Orders Summary */}
        <View style={styles.topCard}>
          <Text style={styles.chartTitle}>🕐 Recent Orders</Text>
          {orders.slice(0, 5).map((order) => (
            <View key={order.id} style={styles.recentRow}>
              <Text style={styles.recentId}>{order.id}</Text>
              <Text style={styles.recentDate}>
                {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
              <Text style={styles.recentTotal}>${order.finalTotal.toFixed(2)}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  title: { fontSize: 20, fontWeight: '800', color: '#fff' },
  statsRow: { flexDirection: 'row', gap: 10 },
  statCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statEmoji: { fontSize: 24, marginBottom: 4 },
  statValue: { fontSize: 18, fontWeight: '800', color: Colors.text },
  statLabel: { fontSize: 11, color: Colors.textSecondary, textAlign: 'center', marginTop: 2 },
  chartCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  chartTitle: { fontSize: 15, fontWeight: '700', color: Colors.text, marginBottom: 12 },
  topCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 10,
  },
  emptyText: { color: Colors.textMuted, textAlign: 'center', paddingVertical: 10 },
  topProductRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  topRank: { fontSize: 13, fontWeight: '700', color: Colors.primary, width: 24 },
  topName: { fontSize: 13, color: Colors.text, flex: 1 },
  topBar: { height: 8, backgroundColor: Colors.primaryLight, borderRadius: 4, minWidth: 8 },
  topQty: { fontSize: 12, color: Colors.textSecondary, width: 60, textAlign: 'right' },
  recentRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  recentId: { fontSize: 13, fontWeight: '600', color: Colors.text, flex: 1 },
  recentDate: { fontSize: 12, color: Colors.textSecondary },
  recentTotal: { fontSize: 14, fontWeight: '700', color: Colors.primary },
});
