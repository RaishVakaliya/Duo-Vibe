export interface ConnectGridCardProps {
  title: string;
  subtitle: string;
  iconName: string;
  isGradient?: boolean;
  gradientColors?: [string, string];
  isComingSoon?: boolean;
  needsPartner?: boolean;
  hasPartner?: boolean;
  onPress?: () => void;
  onLinkPartnerPress?: () => void;
}
