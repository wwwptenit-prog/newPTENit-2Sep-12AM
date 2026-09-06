import React from 'react';
import { MarketplaceGig, User as UserType } from '../types';
import { ServiceDetailModal } from './ServiceDetailModal';

export interface GigDetailPageProps {
  gig: MarketplaceGig;
  allGigs?: MarketplaceGig[];
  currentUser?: UserType | null;
  onBack: () => void;
  onSelectGig?: (gig: MarketplaceGig) => void;
  openAuthModal?: () => void;
  createDirectGigOrder?: (gigId: string, packageType: string, note: string) => void;
  setActiveTab?: (tab: string) => void;
  onOrderSuccess?: (orderId?: string) => void;
}

export const GigDetailPage: React.FC<GigDetailPageProps> = ({
  gig,
  onBack,
  openAuthModal,
  setActiveTab: setGlobalActiveTab,
}) => {
  return (
    <ServiceDetailModal
      service={gig}
      onClose={onBack}
      setActiveTab={setGlobalActiveTab}
      openAuthModal={openAuthModal}
    />
  );
};

export default GigDetailPage;
