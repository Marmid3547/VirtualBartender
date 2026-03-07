// Powered by OnSpace.AI

import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Modal, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useBartender } from '@/hooks/useBartender';
import { theme } from '@/constants/theme';

// Категории ингредиентов
const ingredientCategories = {
  base: {
    label: 'Основа',
    items: ['Водка', 'Джин', 'Ром белый', 'Ром тёмный', 'Текила', 'Виски', 'Бурбон', 'Коньяк', 'Кашаса', 'Писко'],
  },
  liqueur: {
    label: 'Ликёры',
    items: ['Куантро', 'Трипл сек', 'Кампари', 'Апероль', 'Амаретто', 'Кофейный ликёр', 'Вермут сладкий', 'Вермут сухой'],
  },
  juice: {
    label: 'Соки',
    items: ['Сок лайма', 'Сок лимона', 'Апельсиновый сок', 'Ананасовый сок', 'Клюквенный сок', 'Томатный сок', 'Грейпфрутовый сок'],
  },
  mixer: {
    label: 'Миксеры',
    items: ['Содовая', 'Тоник', 'Кола', 'Имбирное пиво', 'Имбирный эль', 'Лимонад', 'Просекко', 'Шампанское'],
  },
  other: {
    label: 'Дополнительно',
    items: ['Мята', 'Сахар', 'Сахарный сироп', 'Медовый сироп', 'Биттер Ангостура', 'Гренадин', 'Кокосовые сливки', 'Сливки', 'Яичный белок'],
  },
};

type CategoryKey = keyof typeof ingredientCategories;

interface DropdownProps {
  label: string;
  selectedItem: string | null;
  items: string[];
  onSelect: (item: string | null) => void;
}

function Dropdown({ label, selectedItem, items, onSelect }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <View style={styles.dropdown}>
      <Pressable
        onPress={() => setIsOpen(true)}
        style={({ pressed }) => [
          styles.dropdownButton,
          selectedItem && styles.dropdownButtonSelected,
          pressed && styles.dropdownButtonPressed,
        ]}
      >
        <Text style={[styles.dropdownLabel, selectedItem && styles.dropdownLabelSelected]}>
          {selectedItem || label}
        </Text>
        <MaterialIcons 
          name="arrow-drop-down" 
          size={24} 
          color={selectedItem ? theme.colors.background : theme.colors.text} 
        />
      </Pressable>

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setIsOpen(false)}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{label}</Text>
              <Pressable onPress={() => setIsOpen(false)}>
                <MaterialIcons name="close" size={24} color={theme.colors.text} />
              </Pressable>
            </View>
            
            <ScrollView style={styles.itemList}>
              {selectedItem && (
                <Pressable
                  onPress={() => {
                    onSelect(null);
                    setIsOpen(false);
                  }}
                  style={styles.clearItem}
                >
                  <MaterialIcons name="clear" size={20} color={theme.colors.error} />
                  <Text style={styles.clearItemText}>Очистить выбор</Text>
                </Pressable>
              )}
              
              {items.map((item) => (
                <Pressable
                  key={item}
                  onPress={() => {
                    onSelect(item);
                    setIsOpen(false);
                  }}
                  style={({ pressed }) => [
                    styles.item,
                    selectedItem === item && styles.itemSelected,
                    pressed && styles.itemPressed,
                  ]}
                >
                  <Text style={[styles.itemText, selectedItem === item && styles.itemTextSelected]}>
                    {item}
                  </Text>
                  {selectedItem === item && (
                    <MaterialIcons name="check" size={20} color={theme.colors.primary} />
                  )}
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

export function IngredientSelector() {
  const { selectedIngredients, toggleIngredient, clearIngredients } = useBartender();
  const [selections, setSelections] = useState<Record<CategoryKey, string | null>>({
    base: null,
    liqueur: null,
    juice: null,
    mixer: null,
    other: null,
  });

  const handleSelect = (category: CategoryKey, item: string | null) => {
    const previousItem = selections[category];
    
    // Удалить предыдущий выбор из selectedIngredients
    if (previousItem && selectedIngredients.includes(previousItem)) {
      toggleIngredient(previousItem);
    }
    
    // Добавить новый выбор
    if (item && !selectedIngredients.includes(item)) {
      toggleIngredient(item);
    }
    
    setSelections((prev) => ({ ...prev, [category]: item }));
  };

  const handleClearAll = () => {
    clearIngredients();
    setSelections({
      base: null,
      liqueur: null,
      juice: null,
      mixer: null,
      other: null,
    });
  };

  const hasSelections = Object.values(selections).some((val) => val !== null);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Составить коктейль</Text>
        {hasSelections && (
          <Pressable onPress={handleClearAll} style={styles.clearButton}>
            <MaterialIcons name="refresh" size={20} color={theme.colors.primary} />
            <Text style={styles.clearText}>Сбросить</Text>
          </Pressable>
        )}
      </View>

      <View style={styles.dropdownsContainer}>
        {(Object.keys(ingredientCategories) as CategoryKey[]).map((key) => (
          <Dropdown
            key={key}
            label={ingredientCategories[key].label}
            selectedItem={selections[key]}
            items={ingredientCategories[key].items}
            onSelect={(item) => handleSelect(key, item)}
          />
        ))}
      </View>

      {hasSelections && (
        <View style={styles.selectedContainer}>
          <Text style={styles.selectedTitle}>Выбрано:</Text>
          <View style={styles.selectedChips}>
            {Object.entries(selections).map(([key, value]) => {
              if (!value) return null;
              return (
                <View key={key} style={styles.selectedChip}>
                  <Text style={styles.selectedChipText}>{value}</Text>
                </View>
              );
            })}
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  title: {
    ...theme.typography.h3,
    color: theme.colors.text,
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
  },
  clearText: {
    ...theme.typography.caption,
    color: theme.colors.primary,
  },
  dropdownsContainer: {
    gap: theme.spacing.sm,
  },
  dropdown: {
    marginBottom: theme.spacing.xs,
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  dropdownButtonSelected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  dropdownButtonPressed: {
    opacity: 0.7,
  },
  dropdownLabel: {
    ...theme.typography.body,
    color: theme.colors.text,
  },
  dropdownLabelSelected: {
    color: theme.colors.background,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.lg,
    width: '85%',
    maxHeight: '70%',
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  modalTitle: {
    ...theme.typography.h3,
    color: theme.colors.text,
  },
  itemList: {
    maxHeight: 400,
  },
  clearItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    backgroundColor: theme.colors.surfaceLight,
  },
  clearItemText: {
    ...theme.typography.body,
    color: theme.colors.error,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  itemSelected: {
    backgroundColor: theme.colors.surfaceLight,
  },
  itemPressed: {
    backgroundColor: theme.colors.surface,
  },
  itemText: {
    ...theme.typography.body,
    color: theme.colors.text,
  },
  itemTextSelected: {
    color: theme.colors.primary,
    fontWeight: '600',
  },
  selectedContainer: {
    marginTop: theme.spacing.md,
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  selectedTitle: {
    ...theme.typography.caption,
    color: theme.colors.textMuted,
    marginBottom: theme.spacing.sm,
  },
  selectedChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.xs,
  },
  selectedChip: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.round,
  },
  selectedChipText: {
    ...theme.typography.caption,
    color: theme.colors.background,
    fontSize: 11,
  },
});
