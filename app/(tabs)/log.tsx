import { Colors } from '@/constants/theme';
import api from '@/utils/api/services';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View, useColorScheme } from 'react-native';

interface FoodHistory {
  id: number;
  foodName: string;
  calories: number | null;
  isConsumed: boolean;
  xpGained: number | null;
  createdAt: string;
}

interface ApiResponse {
  data: {
    foodHistory: FoodHistory[];
  };
}

export default function LogScreen() {
  const [history, setHistory] = useState<FoodHistory[]>([]);
  const [loading, setLoading] = useState(true);
  
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme ?? 'light'];

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get<ApiResponse>('/character/food-history?limit=50');
        setHistory(res.data.foodHistory);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const renderItem = ({ item }: { item: FoodHistory }) => {
    const isFed = item.isConsumed;
    return (
      <View style={[styles.card, { borderColor: '#E5E7EB' }]}>
        <View style={styles.header}>
          <Text style={styles.title}>{item.foodName}</Text>
          {isFed ? (
            <View style={[styles.badge, styles.badgeFed]}>
              <Text style={styles.badgeTextFed}>Fed (+{item.xpGained} XP)</Text>
            </View>
          ) : (
            <View style={[styles.badge, styles.badgeScanned]}>
              <Text style={styles.badgeTextScanned}>Scanned</Text>
            </View>
          )}
        </View>
        <Text style={styles.description}>
          {item.calories ? `${item.calories} Kalori` : 'Tidak ada info kalori'}
        </Text>
        <Text style={styles.date}>
          {new Date(item.createdAt).toLocaleString()}
        </Text>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      <Text style={[styles.heading, { color: themeColors.text }]}>Riwayat Log Makanan</Text>
      {loading ? (
        <ActivityIndicator size="large" color={themeColors.tint} style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={history}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
          ListEmptyComponent={
            <Text style={{ textAlign: 'center', marginTop: 20, color: '#888' }}>
              Belum ada makanan yang di-scan.
            </Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
    marginTop: 40,
  },
  card: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    flex: 1,
    textTransform: 'capitalize',
  },
  description: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  date: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    marginLeft: 8,
  },
  badgeFed: {
    backgroundColor: '#D1FAE5',
  },
  badgeTextFed: {
    color: '#065F46',
    fontSize: 12,
    fontWeight: 'bold',
  },
  badgeScanned: {
    backgroundColor: '#F3F4F6',
  },
  badgeTextScanned: {
    color: '#4B5563',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
