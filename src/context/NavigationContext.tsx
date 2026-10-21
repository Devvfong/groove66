import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  type ReactNode,
} from 'react';
import { BackHandler } from 'react-native';
import { type TabKey } from '../components/layout/RetroBottomBar';
import { type GenreName, type Playlist, type Track } from '../data/musicData';
import { type Artist, type SearchCategory } from '../utils/searchEngine';

export interface NavigationContextType {
  activeTab: TabKey;
  originTab: TabKey;
  isNowPlaying: boolean;
  selectedGenreFilter: GenreName | null;
  selectedPlaylistModal: Playlist | null;
  selectedArtistModal: Artist | null;
  demoNoticeTrack: Track | null;
  searchQuery: string;
  searchCategory: SearchCategory;

  setActiveTab: (tab: TabKey) => void;
  openNowPlaying: () => void;
  closeNowPlaying: () => void;
  openPlaylistModal: (playlist: Playlist) => void;
  closePlaylistModal: () => void;
  openArtistModal: (artist: Artist) => void;
  closeArtistModal: () => void;
  setDemoNoticeTrack: (track: Track | null) => void;
  setSearchQuery: (query: string) => void;
  setSearchCategory: (category: SearchCategory) => void;
  setSelectedGenreFilter: (genre: GenreName | null) => void;
}

const NavigationContext = createContext<NavigationContextType | null>(null);

export const NavigationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTabState] = useState<TabKey>(() => {
    if (typeof window !== 'undefined' && window.location?.hash) {
      const h = window.location.hash.replace('#', '').toLowerCase();
      if (h.startsWith('favorites')) return 'favorites';
      if (h.startsWith('search')) return 'search';
      if (h === 'records' || h === 'favorites' || h === 'search') return h;
    }
    return 'discover';
  });

  const [originTab, setOriginTab] = useState<TabKey>('discover');

  const [isNowPlaying, setIsNowPlaying] = useState<boolean>(() => {
    if (typeof window !== 'undefined' && window.location?.hash) {
      const h = window.location.hash.replace('#', '').toLowerCase();
      return h.startsWith('player') || h === 'nowplaying';
    }
    return false;
  });

  const [selectedGenreFilter, setSelectedGenreFilter] = useState<GenreName | null>(null);
  const [selectedPlaylistModal, setSelectedPlaylistModal] = useState<Playlist | null>(null);
  const [selectedArtistModal, setSelectedArtistModal] = useState<Artist | null>(null);
  const [demoNoticeTrack, setDemoNoticeTrack] = useState<Track | null>(null);

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchCategory, setSearchCategory] = useState<SearchCategory>('all');

  const setActiveTab = useCallback((tab: TabKey) => {
    setActiveTabState(tab);
  }, []);

  const openNowPlaying = useCallback(() => {
    setOriginTab(activeTab);
    setIsNowPlaying(true);
  }, [activeTab]);

  const closeNowPlaying = useCallback(() => {
    setIsNowPlaying(false);
    setActiveTabState(originTab);
  }, [originTab]);

  const openPlaylistModal = useCallback((playlist: Playlist) => {
    setSelectedPlaylistModal(playlist);
  }, []);

  const closePlaylistModal = useCallback(() => {
    setSelectedPlaylistModal(null);
  }, []);

  const openArtistModal = useCallback((artist: Artist) => {
    setSelectedArtistModal(artist);
  }, []);

  const closeArtistModal = useCallback(() => {
    setSelectedArtistModal(null);
  }, []);

  // Hardware back handler for Android
  useEffect(() => {
    const onBackPress = () => {
      if (demoNoticeTrack) {
        setDemoNoticeTrack(null);
        return true;
      }
      if (selectedPlaylistModal) {
        closePlaylistModal();
        return true;
      }
      if (selectedArtistModal) {
        closeArtistModal();
        return true;
      }
      if (isNowPlaying) {
        closeNowPlaying();
        return true;
      }
      if (activeTab !== 'discover') {
        setActiveTab('discover');
        return true;
      }
      return false;
    };

    const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => subscription.remove();
  }, [
    demoNoticeTrack,
    selectedPlaylistModal,
    selectedArtistModal,
    isNowPlaying,
    activeTab,
    closePlaylistModal,
    closeArtistModal,
    closeNowPlaying,
    setActiveTab,
  ]);

  const value = useMemo<NavigationContextType>(() => ({
    activeTab,
    originTab,
    isNowPlaying,
    selectedGenreFilter,
    selectedPlaylistModal,
    selectedArtistModal,
    demoNoticeTrack,
    searchQuery,
    searchCategory,

    setActiveTab,
    openNowPlaying,
    closeNowPlaying,
    openPlaylistModal,
    closePlaylistModal,
    openArtistModal,
    closeArtistModal,
    setDemoNoticeTrack,
    setSearchQuery,
    setSearchCategory,
    setSelectedGenreFilter,
  }), [
    activeTab,
    originTab,
    isNowPlaying,
    selectedGenreFilter,
    selectedPlaylistModal,
    selectedArtistModal,
    demoNoticeTrack,
    searchQuery,
    searchCategory,
    setActiveTab,
    openNowPlaying,
    closeNowPlaying,
    openPlaylistModal,
    closePlaylistModal,
    openArtistModal,
    closeArtistModal,
  ]);

  return <NavigationContext.Provider value={value}>{children}</NavigationContext.Provider>;
};

export function useNavigation(): NavigationContextType {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
}
