import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
} from 'react-native';
import { X, Disc3, Radio, Tv2, Check, Info } from 'lucide-react-native';
import { colors, typography } from '../../theme/tokens';

type Props = {
  visible: boolean;
  onClose: () => void;
};

export const DevicesModal: React.FC<Props> = ({ visible, onClose }) => {
  const [selectedDevice, setSelectedDevice] = useState('deck');

  const devices = [
    {
      id: 'deck',
      name: "Groove '66 Turntable Deck",
      type: 'Built-in Turntable Platter',
      icon: Disc3,
      isCurrent: true,
      available: true,
    },
    {
      id: 'console',
      name: 'Walnut Living Room Hi-Fi Console',
      type: 'Stereo Vacuum Tube Speakers',
      icon: Tv2,
      isCurrent: false,
      available: false,
    },
    {
      id: 'radio',
      name: '1966 AM/FM Transistor Radio',
      type: 'Vintage Monophonic Broadcast',
      icon: Radio,
      isCurrent: false,
      available: false,
    },
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.titleRow}>
              <Tv2 size={20} color={colors.rust} strokeWidth={2.2} />
              <Text style={styles.title}>Audio Devices</Text>
            </View>
            <Pressable
              onPress={onClose}
              hitSlop={12}
              accessibilityRole="button"
              accessibilityLabel="Close devices"
              style={styles.closeBtn}
            >
              <X size={20} color={colors.inkMuted} />
            </Pressable>
          </View>

          <Text style={styles.subtitle}>
            Select output for 1960s vinyl playback
          </Text>

          <View style={styles.divider} />

          {/* Device list */}
          <View style={styles.deviceList}>
            {devices.map((dev) => {
              const Icon = dev.icon;
              const isSelected = selectedDevice === dev.id;
              return (
                <Pressable
                  key={dev.id}
                  onPress={() => {
                    if (dev.available) {
                      setSelectedDevice(dev.id);
                    }
                  }}
                  style={({ pressed }) => [
                    styles.deviceRow,
                    isSelected && styles.deviceRowSelected,
                    { opacity: dev.available ? (pressed ? 0.8 : 1) : 0.65 },
                  ]}
                >
                  <View style={[styles.deviceIconWrapper, isSelected && styles.deviceIconSelected]}>
                    <Icon size={20} color={isSelected ? colors.rust : colors.ink} />
                  </View>

                  <View style={styles.deviceMeta}>
                    <Text style={[styles.deviceName, isSelected && styles.deviceNameSelected]}>
                      {dev.name}
                    </Text>
                    <Text style={styles.deviceType}>
                      {dev.type} {dev.available ? '• Connected' : '• Demo Only'}
                    </Text>
                  </View>

                  {isSelected && (
                    <Check size={18} color={colors.rust} strokeWidth={2.5} />
                  )}
                </Pressable>
              );
            })}
          </View>

          {/* Honest Demo Mode Banner */}
          <View style={styles.infoBox}>
            <Info size={16} color={colors.rust} style={{ marginTop: 2 }} />
            <Text style={styles.infoText}>
              Groove '66 is currently in <Text style={{ fontWeight: '800' }}>UI Demo Mode</Text>. External Bluetooth and network speaker cast functionality is not connected.
            </Text>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(20, 10, 6, 0.65)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.paper,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 20,
    paddingHorizontal: 22,
    paddingBottom: 36,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontFamily: typography.fontFamilySerifBold,
    fontSize: 20,
    fontWeight: '900',
    color: colors.ink,
  },
  subtitle: {
    fontSize: 12.5,
    color: colors.inkMuted,
    marginTop: 3,
  },
  closeBtn: {
    padding: 6,
  },
  divider: {
    height: 1,
    backgroundColor: '#DFD3BD',
    marginVertical: 14,
  },
  deviceList: {
    gap: 8,
    marginBottom: 16,
  },
  deviceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: '#F0E8D7',
  },
  deviceRowSelected: {
    backgroundColor: '#E6DCC7',
    borderWidth: 1,
    borderColor: '#D4C6AB',
  },
  deviceIconWrapper: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#E4D8C1',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  deviceIconSelected: {
    backgroundColor: '#D9C8AC',
  },
  deviceMeta: {
    flex: 1,
    gap: 2,
  },
  deviceName: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.ink,
  },
  deviceNameSelected: {
    color: colors.rust,
    fontWeight: '800',
  },
  deviceType: {
    fontSize: 11.5,
    color: colors.inkMuted,
  },
  infoBox: {
    flexDirection: 'row',
    gap: 10,
    backgroundColor: '#EDE4D1',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DFD2BC',
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 17,
    color: colors.ink,
  },
});
