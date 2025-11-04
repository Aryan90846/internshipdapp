import { useState } from 'react';
import { useAccount } from 'wagmi';
import { Header } from '@/components/Header';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, AlertCircle } from 'lucide-react';
import { MintCertificate } from '@/components/admin/MintCertificate';
import { BatchMint } from '@/components/admin/BatchMint';
import { CertificateList } from '@/components/admin/CertificateList';
import { ADMIN_WALLET } from '@/config/web3';

const Admin = () => {
  const { address, isConnected } = useAccount();
  const [activeTab, setActiveTab] = useState('mint');

  // Check if connected wallet is admin
  const isAdmin = address?.toLowerCase() === ADMIN_WALLET.toLowerCase();

  if (!isConnected) {
    return (
      <div className="min-h-screen hero-gradient">
        <Header />
        <div className="container mx-auto px-4 py-20">
          <Card className="glass-card max-w-lg mx-auto p-12 text-center space-y-6">
            <div className="primary-gradient w-20 h-20 rounded-full flex items-center justify-center mx-auto">
              <Shield className="w-10 h-10 text-primary-foreground" />
            </div>
            <h2 className="text-3xl font-bold text-foreground">Connect Wallet</h2>
            <p className="text-muted-foreground">
              Please connect your wallet to access the admin dashboard.
            </p>
          </Card>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen hero-gradient">
        <Header />
        <div className="container mx-auto px-4 py-20">
          <Alert className="max-w-lg mx-auto" variant="destructive">
            <AlertCircle className="h-5 w-5" />
            <AlertDescription className="text-base">
              Access Denied: Only authorized admin wallets can access this dashboard.
              <br />
              <span className="text-sm mt-2 block">Connected: {address}</span>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen hero-gradient">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage and issue internship certificates
          </p>
        </div>

        <Card className="glass-card p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="mint">Single Mint</TabsTrigger>
              <TabsTrigger value="batch">Batch Mint</TabsTrigger>
              <TabsTrigger value="manage">Manage</TabsTrigger>
            </TabsList>

            <TabsContent value="mint" className="mt-6">
              <MintCertificate />
            </TabsContent>

            <TabsContent value="batch" className="mt-6">
              <BatchMint />
            </TabsContent>

            <TabsContent value="manage" className="mt-6">
              <CertificateList />
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default Admin;
