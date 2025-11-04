import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Award, CheckCircle2, XCircle, ExternalLink, Download } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { fetchFromIPFS } from '@/lib/ipfs';
import { useEffect, useState } from 'react';

interface CertificateDisplayProps {
  tokenId: number;
  certificateData: any;
  isLoading: boolean;
}

export const CertificateDisplay = ({ 
  tokenId, 
  certificateData, 
  isLoading 
}: CertificateDisplayProps) => {
  const [metadata, setMetadata] = useState<any>(null);
  const [loadingMetadata, setLoadingMetadata] = useState(false);

  useEffect(() => {
    if (certificateData && certificateData[1]) {
      const [, uri] = certificateData;
      
      if (uri.startsWith('data:')) {
        // Data URL - decode it
        try {
          const base64Data = uri.split(',')[1];
          const jsonString = atob(base64Data);
          setMetadata(JSON.parse(jsonString));
        } catch (error) {
          console.error('Failed to decode metadata:', error);
        }
      } else if (uri.startsWith('ipfs://')) {
        // IPFS URL - fetch it
        setLoadingMetadata(true);
        fetchFromIPFS(uri)
          .then(setMetadata)
          .catch(console.error)
          .finally(() => setLoadingMetadata(false));
      }
    }
  }, [certificateData]);

  if (isLoading || loadingMetadata) {
    return (
      <Card className="glass-card p-8 space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-32 w-full" />
      </Card>
    );
  }

  if (!certificateData) {
    return null;
  }

  const [owner, uri, metadataHash, isRevoked] = certificateData;

  return (
    <Card className="glass-card p-8 space-y-6">
      {/* Status Badge */}
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-foreground">Certificate #{tokenId}</h2>
        <Badge 
          variant={isRevoked ? 'destructive' : 'default'}
          className="text-lg px-4 py-2"
        >
          {isRevoked ? (
            <>
              <XCircle className="w-5 h-5 mr-2" />
              Revoked
            </>
          ) : (
            <>
              <CheckCircle2 className="w-5 h-5 mr-2" />
              Valid
            </>
          )}
        </Badge>
      </div>

      <Separator />

      {/* Certificate Image */}
      {metadata?.image && (
        <div className="relative">
          <img 
            src={metadata.image} 
            alt="Certificate"
            className="w-full rounded-lg shadow-elevated"
          />
        </div>
      )}

      {/* Certificate Details */}
      <div className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <InfoItem 
            label="Owner Address" 
            value={owner}
            mono
          />
          <InfoItem 
            label="Token ID" 
            value={`#${tokenId}`}
          />
        </div>

        {metadata?.attributes && (
          <div className="space-y-3">
            <h3 className="text-xl font-semibold text-foreground">Certificate Details</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {metadata.attributes.map((attr: any, i: number) => (
                <InfoItem 
                  key={i}
                  label={attr.trait_type.replace(/_/g, ' ').toUpperCase()}
                  value={attr.value}
                />
              ))}
            </div>
          </div>
        )}

        <div className="space-y-2">
          <InfoItem 
            label="Metadata Hash" 
            value={metadataHash}
            mono
            truncate
          />
          <InfoItem 
            label="Metadata URI" 
            value={uri}
            mono
            truncate
          />
        </div>
      </div>

      <Separator />

      {/* Actions */}
      <div className="flex flex-wrap gap-4">
        <Button variant="outline" className="flex-1">
          <Download className="w-4 h-4 mr-2" />
          Download Certificate
        </Button>
        <Button variant="outline" className="flex-1">
          <ExternalLink className="w-4 h-4 mr-2" />
          View on Explorer
        </Button>
      </div>

      {!isRevoked && (
        <div className="primary-gradient p-6 rounded-lg text-primary-foreground">
          <div className="flex items-start gap-4">
            <Award className="w-6 h-6 flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-semibold mb-1">Verified Certificate</h4>
              <p className="text-sm opacity-90">
                This certificate has been verified on the blockchain and is authentic. 
                The metadata hash matches the on-chain record.
              </p>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

const InfoItem = ({ 
  label, 
  value, 
  mono = false, 
  truncate = false 
}: { 
  label: string; 
  value: string; 
  mono?: boolean;
  truncate?: boolean;
}) => (
  <div className="space-y-1">
    <p className="text-sm font-medium text-muted-foreground">{label}</p>
    <p className={`text-foreground ${mono ? 'font-mono text-sm' : ''} ${truncate ? 'truncate' : ''}`}>
      {value}
    </p>
  </div>
);
