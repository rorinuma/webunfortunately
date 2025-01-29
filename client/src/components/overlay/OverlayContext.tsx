import { createContext, useState, PropsWithChildren, SetStateAction } from 'react';

export interface OverlayContent {
  content: JSX.Element | null;
  statusNumber: string,
  username: string
}

interface OverlayProviderType {
  isOverlayVisible: boolean;
  setIsOverlayVisible: (value: SetStateAction<boolean>) => void;
  overlayContent: OverlayContent | null;
  setOverlayContent: (value: OverlayContent | null) => void;
}

export const OverlayContext = createContext<OverlayProviderType | null>(null);

export const OverlayProvider: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  const [isOverlayVisible, setIsOverlayVisible] = useState<boolean>(false);
  const [overlayContent, setOverlayContent] = useState<OverlayContent | null>(null);

  return (
    <OverlayContext.Provider
      value={{
        isOverlayVisible,
        setIsOverlayVisible,
        overlayContent,
        setOverlayContent,
      }}
    >
      {children}
    </OverlayContext.Provider>
  );
};
