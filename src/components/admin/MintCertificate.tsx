import { useState } from 'react';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Loader2, Award } from 'lucide-react';
import { CONTRACT_CONFIG } from '@/config/web3';
import { toast } from 'sonner';
import { generateCertificateImage, createCertificateMetadata, hashMetadata } from '@/lib/ipfs';

export const MintCertificate = () => {
  const [formData, setFormData] = useState({
    recipient: '',
    name: '',
    program: 'Full Stack Web3 Internship',
    issueDate: new Date().toISOString().split('T')[0],
    certificateId: `CERT-${Date.now()}`,
  });

  const [isGenerating, setIsGenerating] = useState(false);

  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleMint = async () => {
    // Validation
    if (!formData.recipient || !formData.name) {
      toast.error('Please fill all required fields');
      return;
    }

    if (!formData.recipient.match(/^0x[a-fA-F0-9]{40}$/)) {
      toast.error('Invalid wallet address');
      return;
    }

    setIsGenerating(true);

    try {
      // Generate certificate image with QR code
      const verifyUrl = `${window.location.origin}/verify?id=${formData.certificateId}`;
      const imageDataUrl = await generateCertificateImage(
        formData.name,
        formData.program,
        formData.issueDate,
        formData.certificateId,
        verifyUrl
      );

      // Create metadata
      const metadata = createCertificateMetadata(
        formData.name,
        formData.recipient,
        formData.program,
        formData.issueDate,
        formData.certificateId,
        imageDataUrl
      );

      // Calculate metadata hash
      const metadataHash = await hashMetadata(metadata);

      // For demo: use data URL as URI (in production, upload to IPFS)
      const metadataUri = `data:application/json;base64,${btoa(JSON.stringify(metadata))}`;

      toast.info('Minting certificate...');

      // Mint certificate
      writeContract({
        address: CONTRACT_CONFIG.address,
        abi: CONTRACT_CONFIG.abi,
        functionName: 'mintCertificate',
        args: [
          formData.recipient as `0x${string}`,
          metadataUri,
          metadataHash as `0x${string}`,
          formData.certificateId,
        ],
      } as any);
    } catch (error) {
      console.error('Mint error:', error);
      toast.error('Failed to generate certificate');
    } finally {
      setIsGenerating(false);
    }
  };

  if (isSuccess) {
    return (
      <Card className="p-8 text-center space-y-4">
        <div className="primary-gradient w-20 h-20 rounded-full flex items-center justify-center mx-auto">
          <Award className="w-10 h-10 text-primary-foreground" />
        </div>
        <h3 className="text-2xl font-bold text-foreground">Certificate Minted!</h3>
        <p className="text-muted-foreground">
          Transaction Hash: <code className="text-xs">{hash}</code>
        </p>
        <Button onClick={() => window.location.reload()} variant="outline">
          Mint Another
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="recipient">Recipient Wallet Address *</Label>
          <Input
            id="recipient"
            placeholder="0x..."
            value={formData.recipient}
            onChange={(e) => handleChange('recipient', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="name">Recipient Name *</Label>
          <Input
            id="name"
            placeholder="John Doe"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="program">Program Name</Label>
          <Input
            id="program"
            placeholder="Full Stack Web3 Internship"
            value={formData.program}
            onChange={(e) => handleChange('program', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="issueDate">Issue Date</Label>
          <Input
            id="issueDate"
            type="date"
            value={formData.issueDate}
            onChange={(e) => handleChange('issueDate', e.target.value)}
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="certificateId">Certificate ID</Label>
          <Input
            id="certificateId"
            placeholder="CERT-2024-001"
            value={formData.certificateId}
            onChange={(e) => handleChange('certificateId', e.target.value)}
          />
          <p className="text-xs text-muted-foreground">Unique identifier for this certificate</p>
        </div>
      </div>

      <Button
        onClick={handleMint}
        disabled={isPending || isConfirming || isGenerating}
        className="w-full primary-gradient text-primary-foreground"
        size="lg"
      >
        {(isPending || isConfirming || isGenerating) ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            {isGenerating ? 'Generating...' : isConfirming ? 'Confirming...' : 'Minting...'}
          </>
        ) : (
          <>
            <Award className="w-5 h-5 mr-2" />
            Mint Certificate
          </>
        )}
      </Button>

      {isPending && (
        <p className="text-sm text-center text-muted-foreground">
          Confirm transaction in your wallet...
        </p>
      )}
    </div>
  );
};
