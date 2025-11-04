import { useState } from 'react';
import { Header } from '@/components/Header';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Loader2 } from 'lucide-react';
import { CertificateDisplay } from '@/components/verify/CertificateDisplay';
import { useReadContract } from 'wagmi';
import { CONTRACT_CONFIG } from '@/config/web3';
import { toast } from 'sonner';

const Verify = () => {
  const [searchType, setSearchType] = useState<'tokenId' | 'certificateId' | 'wallet'>('certificateId');
  const [searchValue, setSearchValue] = useState('');
  const [tokenId, setTokenId] = useState<number | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  // Read certificate data
  const { data: certificateData, isLoading } = useReadContract({
    address: CONTRACT_CONFIG.address,
    abi: CONTRACT_CONFIG.abi,
    functionName: 'verifyCertificate',
    args: tokenId !== null ? [BigInt(tokenId)] : undefined,
    query: {
      enabled: tokenId !== null,
    },
  });

  const handleSearch = async () => {
    if (!searchValue.trim()) {
      toast.error('Please enter a search value');
      return;
    }

    setIsSearching(true);
    setTokenId(null);

    try {
      if (searchType === 'tokenId') {
        const tid = parseInt(searchValue);
        if (isNaN(tid)) {
          toast.error('Invalid token ID');
          return;
        }
        setTokenId(tid);
      } else if (searchType === 'certificateId') {
        // Call contract to get token ID from certificate ID
        // This is a placeholder - implement contract read
        toast.info('Certificate ID lookup not yet implemented');
      } else if (searchType === 'wallet') {
        toast.info('Wallet lookup not yet implemented');
      }
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Failed to search certificate');
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="min-h-screen hero-gradient">
      <Header />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-foreground">Verify Certificate</h1>
            <p className="text-xl text-muted-foreground">
              Enter certificate details to verify authenticity on the blockchain
            </p>
          </div>

          <Card className="glass-card p-8">
            <Tabs value={searchType} onValueChange={(v) => setSearchType(v as any)}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="certificateId">Certificate ID</TabsTrigger>
                <TabsTrigger value="tokenId">Token ID</TabsTrigger>
                <TabsTrigger value="wallet">Wallet Address</TabsTrigger>
              </TabsList>

              <TabsContent value="certificateId" className="space-y-4 mt-6">
                <div className="space-y-2">
                  <Label htmlFor="certId">Certificate ID</Label>
                  <Input
                    id="certId"
                    placeholder="CERT-2024-001"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  />
                  <p className="text-sm text-muted-foreground">
                    Enter the unique certificate identifier
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="tokenId" className="space-y-4 mt-6">
                <div className="space-y-2">
                  <Label htmlFor="tokenId">Token ID</Label>
                  <Input
                    id="tokenId"
                    type="number"
                    placeholder="0"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  />
                  <p className="text-sm text-muted-foreground">
                    Enter the NFT token ID number
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="wallet" className="space-y-4 mt-6">
                <div className="space-y-2">
                  <Label htmlFor="wallet">Wallet Address</Label>
                  <Input
                    id="wallet"
                    placeholder="0x..."
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  />
                  <p className="text-sm text-muted-foreground">
                    Enter the recipient's wallet address
                  </p>
                </div>
              </TabsContent>
            </Tabs>

            <Button
              onClick={handleSearch}
              disabled={isSearching || !searchValue.trim()}
              className="w-full mt-6 primary-gradient text-primary-foreground"
              size="lg"
            >
              {isSearching ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="w-5 h-5 mr-2" />
                  Verify Certificate
                </>
              )}
            </Button>
          </Card>

          {/* Certificate Display */}
          {tokenId !== null && (
            <CertificateDisplay
              tokenId={tokenId}
              certificateData={certificateData}
              isLoading={isLoading}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Verify;
