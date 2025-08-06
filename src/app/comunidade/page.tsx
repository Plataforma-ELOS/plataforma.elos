import HeaderSecondary from '@/components/layout/header-secondary';
import Footer from '@/components/layout/footer';
import CommunityDashboard from '@/components/sections/community-dashboard';

export default function CommunityPage() {
  return (
    <div className="flex flex-col min-h-screen bg-muted/40">
      <HeaderSecondary />
      <main className="flex-1">
        <CommunityDashboard />
      </main>
      <Footer />
    </div>
  );
}
