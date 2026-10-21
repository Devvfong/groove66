import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  type ReactNode,
} from 'react';
import {
  equalizerService,
  type EqualizerPresetId,
  type EqualizerState,
} from '../services/equalizer';

export interface EqualizerContextType {
  isEqualizerOpen: boolean;
  openEqualizer: () => void;
  closeEqualizer: () => void;
  toggleEqualizer: () => void;
  state: EqualizerState;
  setBandLevel: (bandIndex: number, dbLevel: number) => Promise<void>;
  applyPreset: (presetId: EqualizerPresetId) => Promise<void>;
  toggleEnabled: () => Promise<void>;
  setEnabled: (enabled: boolean) => Promise<void>;
  resetToFlat: () => Promise<void>;
}

const EqualizerContext = createContext<EqualizerContextType | null>(null);

export const EqualizerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isEqualizerOpen, setIsEqualizerOpen] = useState(false);
  const [state, setState] = useState<EqualizerState>(() => equalizerService.getState());

  useEffect(() => {
    equalizerService.init();
    const unsubscribe = equalizerService.subscribe((nextState) => {
      setState(nextState);
    });
    return unsubscribe;
  }, []);

  const openEqualizer = useCallback(() => setIsEqualizerOpen(true), []);
  const closeEqualizer = useCallback(() => setIsEqualizerOpen(false), []);
  const toggleEqualizer = useCallback(() => setIsEqualizerOpen((prev) => !prev), []);

  const setBandLevel = useCallback(async (bandIndex: number, dbLevel: number) => {
    await equalizerService.setBandLevel(bandIndex, dbLevel);
  }, []);

  const applyPreset = useCallback(async (presetId: EqualizerPresetId) => {
    await equalizerService.applyPreset(presetId);
  }, []);

  const toggleEnabled = useCallback(async () => {
    await equalizerService.toggleEnabled();
  }, []);

  const setEnabled = useCallback(async (enabled: boolean) => {
    await equalizerService.setEnabled(enabled);
  }, []);

  const resetToFlat = useCallback(async () => {
    await equalizerService.resetToFlat();
  }, []);

  const value = useMemo<EqualizerContextType>(
    () => ({
      isEqualizerOpen,
      openEqualizer,
      closeEqualizer,
      toggleEqualizer,
      state,
      setBandLevel,
      applyPreset,
      toggleEnabled,
      setEnabled,
      resetToFlat,
    }),
    [
      isEqualizerOpen,
      openEqualizer,
      closeEqualizer,
      toggleEqualizer,
      state,
      setBandLevel,
      applyPreset,
      toggleEnabled,
      setEnabled,
      resetToFlat,
    ]
  );

  return <EqualizerContext.Provider value={value}>{children}</EqualizerContext.Provider>;
};

export function useEqualizer(): EqualizerContextType {
  const context = useContext(EqualizerContext);
  if (!context) {
    throw new Error('useEqualizer must be used within an EqualizerProvider');
  }
  return context;
}
