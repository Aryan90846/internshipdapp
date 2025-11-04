import { useState } from 'react';
import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Loader2, XCircle, ExternalLink, RefreshCw } from 'lucide-react';
import { CONTRACT_CONFIG } from '@/config/web3';
import { toast } from 'sonner';

export const CertificateList = () => {
  const [revokeReason, setRevokeReason] = useState('');
  const [selectedTokenId, setSelectedTokenId] = useState<number | null>(null);

  // Read total supply
  const { data: totalSupply, refetch } = useReadContract({
    address: CONTRACT_CONFIG.address,
    abi: CONTRACT_CONFIG.abi,
    functionName: 'totalSupply',
  });

  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const handleRevoke = (tokenId: number) => {
    if (!revokeReason.trim()) {
      toast.error('Please enter a revocation reason');
      return;
    }

    writeContract({
      address: CONTRACT_CONFIG.address,
      abi: CONTRACT_CONFIG.abi,
      functionName: 'revokeCertificate',
      args: [BigInt(tokenId), revokeReason],
    } as any);

    setSelectedTokenId(null);
    setRevokeReason('');
  };

  if (isSuccess) {
    toast.success('Certificate revoked successfully');
    refetch();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-foreground">Certificate Management</h3>
          <p className="text-sm text-muted-foreground">
            Total certificates issued: {totalSupply?.toString() || '0'}
          </p>
        </div>
        <Button onClick={() => refetch()} variant="outline" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Token ID</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {totalSupply && Number(totalSupply) > 0 ? (
              Array.from({ length: Number(totalSupply) }, (_, i) => (
                <CertificateRow
                  key={i}
                  tokenId={i}
                  onRevoke={() => setSelectedTokenId(i)}
                  selectedForRevoke={selectedTokenId === i}
                  revokeReason={revokeReason}
                  setRevokeReason={setRevokeReason}
                  handleRevoke={handleRevoke}
                  isPending={isPending}
                  isConfirming={isConfirming}
                />
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                  No certificates issued yet
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

const CertificateRow = ({ 
  tokenId, 
  onRevoke, 
  selectedForRevoke,
  revokeReason,
  setRevokeReason,
  handleRevoke,
  isPending,
  isConfirming 
}: any) => {
  const { data: certData } = useReadContract({
    address: CONTRACT_CONFIG.address,
    abi: CONTRACT_CONFIG.abi,
    functionName: 'verifyCertificate',
    args: [BigInt(tokenId)],
  });

  if (!certData) return null;

  const [owner, , , isRevoked] = certData;

  return (
    <TableRow>
      <TableCell className="font-mono">#{tokenId}</TableCell>
      <TableCell className="font-mono text-xs">
        {owner?.slice(0, 6)}...{owner?.slice(-4)}
      </TableCell>
      <TableCell>
        <Badge variant={isRevoked ? 'destructive' : 'default'}>
          {isRevoked ? 'Revoked' : 'Active'}
        </Badge>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(`/verify?tokenId=${tokenId}`, '_blank')}
          >
            <ExternalLink className="w-4 h-4" />
          </Button>
          
          {!isRevoked && (
            selectedForRevoke ? (
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Reason for revocation"
                  value={revokeReason}
                  onChange={(e) => setRevokeReason(e.target.value)}
                  className="w-48"
                />
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleRevoke(tokenId)}
                  disabled={isPending || isConfirming}
                >
                  {(isPending || isConfirming) ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    'Confirm'
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onRevoke(null)}
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <Button
                variant="destructive"
                size="sm"
                onClick={onRevoke}
              >
                <XCircle className="w-4 h-4 mr-1" />
                Revoke
              </Button>
            )
          )}
        </div>
      </TableCell>
    </TableRow>
  );
};
