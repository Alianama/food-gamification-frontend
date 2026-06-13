import { Colors } from '@/constants/theme';
import Ionicons from '@expo/vector-icons/Ionicons';
import api from '@/utils/api/services';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
  useColorScheme,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';

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

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) +
    ' • ' + d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
}

export default function LogScreen() {
  const [history, setHistory] = useState<FoodHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme ?? 'light'];

  const fetchHistory = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    try {
      const res = await api.get<ApiResponse>('/character/food-history?limit=50');
      setHistory(res.data.foodHistory);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const renderItem = ({ item, index }: { item: FoodHistory; index: number }) => {
    const isFed = item.isConsumed;
    return (
      <View style={styles.card}>
        {/* Left accent bar */}
        <View style={[styles.accentBar, { backgroundColor: isFed ? '#10B981' : '#6B7280' }]} />

        <View style={styles.cardBody}>
          <View style={styles.cardHeader}>
            {/* Food icon */}
            <View style={[styles.foodIconBg, { backgroundColor: isFed ? '#D1FAE5' : '#F3F4F6' }]}>
              <Ionicons
                name={isFed ? 'restaurant' : 'scan-circle-outline'}
                size={20}
                color={isFed ? '#065F46' : '#6B7280'}
              />
            </View>

            <View style={styles.foodInfo}>
              <Text style={styles.title} numberOfLines={1}>{item.foodName}</Text>
              <View style={styles.metaRow}>
                <Ionicons name="flame-outline" size={12} color="#9CA3AF" />
                <Text style={styles.metaText}>
                  {item.calories ? `${item.calories} kcal` : 'No calorie data'}
                </Text>
              </View>
            </View>

            {/* Status badge */}
            {isFed ? (
              <View style={styles.badgeFed}>
                <Ionicons name="add-circle" size={12} color="#065F46" />
                <Text style={styles.badgeTextFed}>+{item.xpGained} XP</Text>
              </View>
            ) : (
              <View style={styles.badgeScanned}>
                <Ionicons name="eye-outline" size={12} color="#4B5563" />
                <Text style={styles.badgeTextScanned}>Scanned</Text>
              </View>
            )}
          </View>

          <View style={styles.dateRow}>
            <Ionicons name="time-outline" size={12} color="#D1D5DB" />
            <Text style={styles.date}>{formatDate(item.createdAt)}</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      {/* Page Header */}
      <View style={styles.pageHeader}>
        <View style={styles.headerLeft}>
          <Ionicons name="list" size={26} color="#667eea" />
          <Text style={[styles.heading, { color: themeColors.text }]}>Food Log</Text>
        </View>
        <TouchableOpacity
          style={styles.refreshBtn}
          onPress={() => fetchHistory(true)}
          activeOpacity={0.7}
        >
          <Ionicons name="refresh" size={18} color="#667eea" />
        </TouchableOpacity>
      </View>

      {/* Summary chips */}
      {!loading && (
        <View style={styles.summaryChips}>
          <View style={[styles.summaryChip, { backgroundColor: '#D1FAE5' }]}>
            <Ionicons name="restaurant" size={14} color="#065F46" />
            <Text style={[styles.summaryChipText, { color: '#065F46' }]}>
              {history.filter(h => h.isConsumed).length} Fed
            </Text>
          </View>
          <View style={[styles.summaryChip, { backgroundColor: '#F3F4F6' }]}>
            <Ionicons name="scan-circle-outline" size={14} color="#4B5563" />
            <Text style={[styles.summaryChipText, { color: '#4B5563' }]}>
              {history.filter(h => !h.isConsumed).length} Scanned Only
            </Text>
          </View>
        </View>
      )}

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#667eea" />
          <Text style={styles.loadingText}>Loading food history...</Text>
        </View>
      ) : (
        <FlatList
          data={history}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => fetchHistory(true)}
              tintColor="#667eea"
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="restaurant-outline" size={56} color="#D1D5DB" />
              <Text style={styles.emptyTitle}>No food logged yet</Text>
              <Text style={styles.emptyDesc}>Start scanning food to track your nutrition!</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  pageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 60,
    marginBottom: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  heading: {
    fontSize: 28,
    fontWeight: '800',
  },
  refreshBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryChips: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
  },
  summaryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  summaryChipText: {
    fontSize: 12,
    fontWeight: '700',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    color: '#667eea',
    fontWeight: '600',
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    overflow: 'hidden',
  },
  accentBar: {
    width: 4,
    flexShrink: 0,
  },
  cardBody: {
    flex: 1,
    padding: 14,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  foodIconBg: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  foodInfo: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1F2937',
    textTransform: 'capitalize',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  badgeFed: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 10,
    flexShrink: 0,
  },
  badgeTextFed: {
    color: '#065F46',
    fontSize: 11,
    fontWeight: '800',
  },
  badgeScanned: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 10,
    flexShrink: 0,
  },
  badgeTextScanned: {
    color: '#4B5563',
    fontSize: 11,
    fontWeight: '700',
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  date: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 60,
    gap: 10,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#374151',
  },
  emptyDesc: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
  },
});
