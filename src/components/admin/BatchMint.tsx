import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Upload, Download, FileText } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';

export const BatchMint = () => {
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvData, setCsvData] = useState<any[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      toast.error('Please upload a CSV file');
      return;
    }

    setCsvFile(file);
    
    // Read CSV
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lines = text.split('\n');
      const headers = lines[0].split(',').map(h => h.trim());
      
      const data = lines.slice(1)
        .filter(line => line.trim())
        .map(line => {
          const values = line.split(',').map(v => v.trim());
          return headers.reduce((obj, header, i) => {
            obj[header] = values[i];
            return obj;
          }, {} as any);
        });
      
      setCsvData(data);
      toast.success(`Loaded ${data.length} certificates`);
    };
    
    reader.readAsText(file);
  };

  const downloadTemplate = () => {
    const template = `recipient,name,program,issueDate,certificateId
0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb,Alice Johnson,Full Stack Web3 Internship,2024-01-15,CERT-2024-001
0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199,Bob Smith,Blockchain Development,2024-01-16,CERT-2024-002`;

    const blob = new Blob([template], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'certificate-template.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleBatchMint = async () => {
    if (csvData.length === 0) {
      toast.error('Please upload a CSV file first');
      return;
    }

    toast.info('Batch minting feature coming soon!');
    // Implement batch minting logic here
  };

  return (
    <div className="space-y-6">
      <Alert>
        <FileText className="h-5 w-5" />
        <AlertDescription>
          Upload a CSV file with columns: recipient, name, program, issueDate, certificateId
        </AlertDescription>
      </Alert>

      <Card className="p-8 text-center space-y-6 border-dashed border-2">
        <div className="space-y-4">
          <div className="primary-gradient w-20 h-20 rounded-full flex items-center justify-center mx-auto">
            <Upload className="w-10 h-10 text-primary-foreground" />
          </div>
          
          <div>
            <h3 className="text-xl font-bold text-foreground mb-2">Upload CSV File</h3>
            <p className="text-sm text-muted-foreground">
              Drag and drop or click to select a file
            </p>
          </div>

          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="hidden"
            id="csv-upload"
          />
          
          <label htmlFor="csv-upload">
            <Button variant="outline" asChild className="cursor-pointer">
              <span>
                <Upload className="w-4 h-4 mr-2" />
                Select CSV File
              </span>
            </Button>
          </label>

          {csvFile && (
            <p className="text-sm text-muted-foreground">
              Selected: {csvFile.name} ({csvData.length} records)
            </p>
          )}
        </div>
      </Card>

      <div className="flex gap-4">
        <Button
          onClick={downloadTemplate}
          variant="outline"
          className="flex-1"
        >
          <Download className="w-4 h-4 mr-2" />
          Download Template
        </Button>

        <Button
          onClick={handleBatchMint}
          disabled={csvData.length === 0}
          className="flex-1 primary-gradient text-primary-foreground"
        >
          <Upload className="w-4 h-4 mr-2" />
          Batch Mint ({csvData.length})
        </Button>
      </div>

      {csvData.length > 0 && (
        <Card className="p-4">
          <h4 className="font-semibold mb-2">Preview ({csvData.length} records)</h4>
          <div className="max-h-64 overflow-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Name</th>
                  <th className="text-left p-2">Recipient</th>
                  <th className="text-left p-2">Cert ID</th>
                </tr>
              </thead>
              <tbody>
                {csvData.slice(0, 10).map((row, i) => (
                  <tr key={i} className="border-b">
                    <td className="p-2">{row.name}</td>
                    <td className="p-2 font-mono text-xs">{row.recipient?.slice(0, 10)}...</td>
                    <td className="p-2">{row.certificateId}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
};
