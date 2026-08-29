import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  FlatList,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  Bell,
  Truck,
  Tag,
  Sparkles,
  Heart,
  CheckCheck,
} from 'lucide-react-native';
import { useUIStore, AppNotification } from '@/store/ui-store';

export default function NotificationsScreen() {
  const router = useRouter();
  const { notifications, markNotificationRead, markAllNotificationsRead } = useUIStore();

  const getIcon = (type: AppNotification['type']) => {
    switch (type) {
      case 'order':
        return <Truck size={20} color="#365314" />;
      case 'promo':
        return <Tag size={20} color="#D97706" />;
      case 'health':
        return <Heart size={20} color="#DC2626" />;
      default:
        return <Sparkles size={20} color="#365314" />;
    }
  };

  const handleNotificationPress = (notif: AppNotification) => {
    markNotificationRead(notif.id);
    if (notif.actionUrl) {
      router.push(notif.actionUrl as any);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={22} color="#1C1917" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <TouchableOpacity
          style={styles.markAllBtn}
          onPress={markAllNotificationsRead}
        >
          <CheckCheck size={18} color="#365314" />
        </TouchableOpacity>
      </View>

      {/* List */}
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.notifCard, !item.isRead && styles.notifCardUnread]}
            onPress={() => handleNotificationPress(item)}
            activeOpacity={0.8}
          >
            <View
              style={[
                styles.iconBox,
                item.type === 'order' && styles.iconBoxOrder,
                item.type === 'promo' && styles.iconBoxPromo,
                item.type === 'health' && styles.iconBoxHealth,
              ]}
            >
              {getIcon(item.type)}
            </View>

            <View style={styles.contentBox}>
              <View style={styles.titleRow}>
                <Text style={styles.notifTitle}>{item.title}</Text>
                <Text style={styles.notifTime}>{item.time}</Text>
              </View>
              <Text style={styles.notifMessage}>{item.message}</Text>
            </View>

            {!item.isRead && <View style={styles.unreadDot} />}
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Bell size={48} color="#A8A29E" />
            <Text style={styles.emptyTitle}>All Caught Up!</Text>
            <Text style={styles.emptySubtitle}>
              You don't have any unread notifications right now.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF9F6',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F0EFEA',
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F5F5F4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1C1917',
  },
  markAllBtn: {
    padding: 8,
  },
  listContent: {
    padding: 16,
    gap: 12,
  },
  notifCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#F0EFEA',
    alignItems: 'center',
    gap: 12,
  },
  notifCardUnread: {
    backgroundColor: '#F7FEE7',
    borderColor: '#D9F99D',
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#ECFCCB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconBoxOrder: {
    backgroundColor: '#ECFCCB',
  },
  iconBoxPromo: {
    backgroundColor: '#FEF3C7',
  },
  iconBoxHealth: {
    backgroundColor: '#FEE2E2',
  },
  contentBox: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  notifTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1C1917',
  },
  notifTime: {
    fontSize: 11,
    color: '#A8A29E',
  },
  notifMessage: {
    fontSize: 13,
    color: '#57534E',
    lineHeight: 18,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#365314',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    gap: 12,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1C1917',
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#78716C',
  },
});
