import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../src/constants/colors';
import { useClinicStore } from '../../src/stores/useClinicStore';
import { CardVisual } from '../../src/components/CardVisual';

export default function CardsScreen() {
  const clinics = useClinicStore((s) => s.clinics);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>マイ診察券</Text>
        <Text style={styles.subtitle}>タップして詳細・QRコードを表示</Text>
      </View>

      <ScrollView
        style={styles.list}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        {clinics
          .sort((a, b) => a.order - b.order)
          .map((clinic) => (
            <TouchableOpacity
              key={clinic.id}
              onPress={() => router.push(`/card/${clinic.id}`)}
              activeOpacity={0.9}
            >
              <CardVisual clinic={clinic} compact />
            </TouchableOpacity>
          ))}

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push('/clinic/add')}
        >
          <Ionicons name="add" size={28} color={Colors.textTertiary} />
          <Text style={styles.addText}>新しい医院の診察券を追加</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.navy,
  },
  subtitle: {
    fontSize: 12,
    color: Colors.textTertiary,
    marginTop: 4,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 20,
    gap: 12,
    paddingBottom: 20,
  },
  addButton: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: Colors.border,
    borderRadius: 14,
    padding: 24,
    alignItems: 'center',
    gap: 8,
  },
  addText: {
    fontSize: 13,
    color: Colors.textTertiary,
  },
});
