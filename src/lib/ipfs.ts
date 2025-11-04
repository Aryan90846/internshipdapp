import QRCode from 'qrcode';

// IPFS Gateway URLs
const IPFS_GATEWAYS = [
  'https://gateway.pinata.cloud/ipfs/',
  'https://ipfs.io/ipfs/',
  'https://cloudflare-ipfs.com/ipfs/',
];

/**
 * Upload metadata to IPFS (using Pinata API)
 * Note: In production, this should be done via backend to protect API keys
 */
export async function uploadToIPFS(data: any): Promise<string> {
  // For now, this is a placeholder
  // In production, implement backend API endpoint
  console.log('Upload to IPFS:', data);
  return 'QmPlaceholder123...';
}

/**
 * Generate certificate image with QR code
 */
export async function generateCertificateImage(
  name: string,
  program: string,
  issueDate: string,
  certificateId: string,
  verifyUrl: string
): Promise<string> {
  try {
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 800;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) throw new Error('Could not get canvas context');

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#0ea5e9');
    gradient.addColorStop(1, '#14b8a6');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Border
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 8;
    ctx.strokeRect(40, 40, canvas.width - 80, canvas.height - 80);

    // Title
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('INTERNSHIP CERTIFICATE', canvas.width / 2, 150);

    // Organization
    ctx.font = '28px Arial';
    ctx.fillText('Aryan Web3 Labs', canvas.width / 2, 200);

    // Main content
    ctx.font = '24px Arial';
    ctx.fillText('This certifies that', canvas.width / 2, 280);

    ctx.font = 'bold 42px Arial';
    ctx.fillText(name, canvas.width / 2, 340);

    ctx.font = '24px Arial';
    ctx.fillText('has successfully completed', canvas.width / 2, 400);

    ctx.font = 'bold 32px Arial';
    ctx.fillText(program, canvas.width / 2, 460);

    // Date and ID
    ctx.font = '20px Arial';
    ctx.fillText(`Issue Date: ${issueDate}`, canvas.width / 2, 540);
    ctx.fillText(`Certificate ID: ${certificateId}`, canvas.width / 2, 580);

    // Generate QR code
    const qrCodeDataUrl = await QRCode.toDataURL(verifyUrl, {
      width: 150,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#ffffff',
      },
    });

    // Load and draw QR code
    return new Promise((resolve, reject) => {
      const qrImage = new Image();
      qrImage.onload = () => {
        ctx.drawImage(qrImage, canvas.width / 2 - 75, 620, 150, 150);
        
        // Verify text
        ctx.font = '16px Arial';
        ctx.fillText('Scan to verify on blockchain', canvas.width / 2, 650);
        
        resolve(canvas.toDataURL('image/png'));
      };
      qrImage.onerror = reject;
      qrImage.src = qrCodeDataUrl;
    });
  } catch (error) {
    console.error('Error generating certificate image:', error);
    throw error;
  }
}

/**
 * Create certificate metadata
 */
export function createCertificateMetadata(
  name: string,
  wallet: string,
  program: string,
  issueDate: string,
  certificateId: string,
  imageDataUrl: string
): any {
  return {
    name: `Internship Certificate — ${name}`,
    description: `${name} successfully completed ${program} internship at Aryan Web3 Labs`,
    image: imageDataUrl, // In production, upload to IPFS
    attributes: [
      { trait_type: 'name', value: name },
      { trait_type: 'wallet', value: wallet },
      { trait_type: 'program', value: program },
      { trait_type: 'issue_date', value: issueDate },
      { trait_type: 'certificate_id', value: certificateId },
      { trait_type: 'organization', value: 'Aryan Web3 Labs' },
    ],
  };
}

/**
 * Fetch metadata from IPFS with fallback gateways
 */
export async function fetchFromIPFS(cid: string): Promise<any> {
  const cleanCid = cid.replace('ipfs://', '');
  
  for (const gateway of IPFS_GATEWAYS) {
    try {
      const response = await fetch(`${gateway}${cleanCid}`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
      });
      
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.warn(`Failed to fetch from ${gateway}:`, error);
      continue;
    }
  }
  
  throw new Error('Failed to fetch from IPFS using all gateways');
}

/**
 * Calculate SHA256 hash of metadata
 */
export async function hashMetadata(metadata: any): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(JSON.stringify(metadata));
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return '0x' + hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}
