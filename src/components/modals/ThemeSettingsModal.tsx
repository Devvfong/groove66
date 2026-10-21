import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Pressable,
  TouchableWithoutFeedback,
} from 'react-native';
import { Sun, Moon, Sparkles, Check, X } from 'lucide-react-native';
import { useTheme, type ThemePreference } from '../../context/ThemeContext';
import { radius, typography } from '../../theme/tokens';

type Props = {
  visible: boolean;
  onClose: () => void;
};

interface ThemeOption {
  key: ThemePreference;
  title: string;
  subtitle: string;
  icon: (color: string) => React.ReactNode;
}

export const ThemeSettingsModal: React.FC<Props> = ({ visible, onClose }) => {
  const { colors, themePreference, resolvedTheme, setThemePreference } = useTheme();

  const options: ThemeOption[] = [
    {
      key: 'system',
      title: 'Automatic (System)',
      subtitle: `Follows your device theme (currently ${resolvedTheme === 'dark' ? 'Dark' : 'Light'})`,
      icon: (color) => <Sparkles size={20} color={color} strokeWidth={2} />,
    },
    {
      key: 'light',
      title: 'Record Shop (Vintage Light)',
      subtitle: 'Warm cream card stock, rich ink, and terracotta accents',
      icon: (color) => <Sun size={20} color={color} strokeWidth={2} />,
    },
    {
      key: 'dark',
      title: 'Night Drive (Vintage Dark)',
      subtitle: 'Dark walnut cabinet, vinyl black, and warm cream lettering',
      icon: (color) => <Moon size={20} color={color} strokeWidth={2} />,
    },
  ];

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdrop}>
          <TouchableWithoutFeedback>
            <View
              style={[
                styles.card,
                {
                  backgroundColor: colors.paperLight,
                  borderColor: colors.paperDark,
                },
              ]}
            >
              {/* Header with Close Button */}
              <View style={styles.headerRow}>
                <View style={styles.titleContainer}>
                  <Text style={[styles.title, { color: colors.ink }]}>
                    Theme & Atmosphere
                  </Text>
                  <Text style={[styles.subtitle, { color: colors.inkMuted }]}>
                    Mid-century 1960s aesthetic
                  </Text>
                </View>

                <Pressable
                  onPress={onClose}
                  hitSlop={12}
                  accessibilityRole="button"
                  accessibilityLabel="Close theme settings"
                  style={({ pressed }) => [
                    styles.closeBtn,
                    { backgroundColor: colors.paperMuted, opacity: pressed ? 0.7 : 1 },
                  ]}
                >
                  <X size={18} color={colors.inkMuted} />
                </Pressable>
              </View>

              {/* Theme Options */}
              <View style={styles.optionsList}>
                {options.map((option) => {
                  const isSelected = themePreference === option.key;
                  return (
                    <Pressable
                      key={option.key}
                      onPress={() => setThemePreference(option.key)}
                      accessibilityRole="radio"
                      accessibilityState={{ selected: isSelected }}
                      accessibilityLabel={`${option.title}: ${option.subtitle}`}
                      style={({ pressed }) => [
                        styles.optionRow,
                        {
                          backgroundColor: isSelected ? colors.paperMuted : 'transparent',
                          borderColor: isSelected ? colors.rust : colors.hairline,
                          opacity: pressed ? 0.8 : 1,
                        },
                      ]}
                    >
                      <View
                        style={[
                          styles.iconContainer,
                          {
                            backgroundColor: isSelected ? colors.rust : colors.paperMuted,
                          },
                        ]}
                      >
                        {option.icon(isSelected ? '#FFFFFF' : colors.inkMuted)}
                      </View>

                      <View style={styles.optionTextContainer}>
                        <Text
                          style={[
                            styles.optionTitle,
                            {
                              color: isSelected ? colors.ink : colors.inkMuted,
                              fontWeight: isSelected ? '800' : '600',
                            },
                          ]}
                        >
                          {option.title}
                        </Text>
                        <Text
                          style={[
                            styles.optionSubtitle,
                            { color: colors.inkSubtle },
                          ]}
                          numberOfLines={2}
                        >
                          {option.subtitle}
                        </Text>
                      </View>

                      {isSelected ? (
                        <View
                          style={[
                            styles.radioCircleActive,
                            { backgroundColor: colors.rust },
                          ]}
                        >
                          <Check size={12} color="#FFFFFF" strokeWidth={3} />
                        </View>
                      ) : (
                        <View
                          style={[
                            styles.radioCircleInactive,
                            { borderColor: colors.inkSubtle },
                          ]}
                        />
                      )}
                    </Pressable>
                  );
                })}
              </View>

              {/* Contrast & Vintage Guarantee Footer */}
              <View
                style={[
                  styles.footerBanner,
                  { backgroundColor: colors.paperMuted, borderColor: colors.hairline },
                ]}
              >
                <Text style={[styles.footerText, { color: colors.inkMuted }]}>
                  Preserves authentic 1960s record shop warmth with WCAG AAA readable contrast.
                </Text>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(18, 14, 11, 0.72)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 380,
    borderRadius: radius.card,
    borderWidth: 1.5,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 10,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  titleContainer: {
    flex: 1,
    paddingRight: 12,
  },
  title: {
    fontFamily: typography.fontFamilySerifBold,
    fontSize: 21,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 12.5,
    marginTop: 2,
    fontWeight: '500',
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionsList: {
    gap: 10,
    marginBottom: 16,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: radius.md,
    borderWidth: 1.2,
  },
  iconContainer: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  optionTextContainer: {
    flex: 1,
    marginRight: 8,
  },
  optionTitle: {
    fontSize: 14.5,
    marginBottom: 2,
  },
  optionSubtitle: {
    fontSize: 11.5,
    lineHeight: 15,
  },
  radioCircleActive: {
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioCircleInactive: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
  },
  footerBanner: {
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderRadius: radius.sm,
    borderWidth: 1,
  },
  footerText: {
    fontSize: 11,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
