import { Link } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Shield, Award, Zap, Lock, Globe, Users } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen hero-gradient">
      <Header />
      
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto space-y-6">
          <div className="inline-block">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <Zap className="w-4 h-4" />
              Powered by Blockchain Technology
            </span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-foreground">
            Verifiable Digital
            <span className="block primary-gradient bg-clip-text text-transparent">
              Certificates
            </span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Issue tamper-proof internship certificates as NFTs on the blockchain. 
            Instantly verifiable by anyone, anywhere in the world.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link to="/verify">
              <Button size="lg" className="w-full sm:w-auto primary-gradient text-primary-foreground hover:opacity-90 transition-smooth">
                <Shield className="w-5 h-5 mr-2" />
                Verify Certificate
              </Button>
            </Link>
            <Link to="/admin">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                <Award className="w-5 h-5 mr-2" />
                Admin Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="glass-card p-8 space-y-4 transition-smooth hover:shadow-elevated">
            <div className="primary-gradient w-14 h-14 rounded-xl flex items-center justify-center">
              <Lock className="w-7 h-7 text-primary-foreground" />
            </div>
            <h3 className="text-2xl font-bold text-foreground">Tamper-Proof</h3>
            <p className="text-muted-foreground">
              Every certificate is stored on the blockchain with cryptographic verification, 
              making it impossible to forge or alter.
            </p>
          </Card>

          <Card className="glass-card p-8 space-y-4 transition-smooth hover:shadow-elevated">
            <div className="primary-gradient w-14 h-14 rounded-xl flex items-center justify-center">
              <Globe className="w-7 h-7 text-primary-foreground" />
            </div>
            <h3 className="text-2xl font-bold text-foreground">Globally Accessible</h3>
            <p className="text-muted-foreground">
              Certificates can be verified instantly by anyone with internet access, 
              no middleman required.
            </p>
          </Card>

          <Card className="glass-card p-8 space-y-4 transition-smooth hover:shadow-elevated">
            <div className="primary-gradient w-14 h-14 rounded-xl flex items-center justify-center">
              <Users className="w-7 h-7 text-primary-foreground" />
            </div>
            <h3 className="text-2xl font-bold text-foreground">Lifetime Ownership</h3>
            <p className="text-muted-foreground">
              Recipients truly own their certificates as NFTs, with full control 
              and permanent proof of achievement.
            </p>
          </Card>
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">How It Works</h2>
          <p className="text-xl text-muted-foreground">Simple, secure, and transparent</p>
        </div>
        
        <div className="max-w-4xl mx-auto space-y-8">
          {[
            {
              step: '01',
              title: 'Issue Certificate',
              description: 'Admin mints certificate NFT with internship details and recipient wallet address'
            },
            {
              step: '02',
              title: 'Blockchain Storage',
              description: 'Certificate metadata and verification hash stored immutably on Polygon/Base testnet'
            },
            {
              step: '03',
              title: 'Instant Verification',
              description: 'Anyone can verify authenticity by entering certificate ID, token ID, or wallet address'
            },
          ].map((item) => (
            <div key={item.step} className="glass-card p-8 flex gap-6 transition-smooth hover:shadow-elevated">
              <div className="primary-gradient text-primary-foreground text-3xl font-bold w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0">
                {item.step}
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-foreground">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <Card className="glass-card p-12 text-center space-y-6">
          <h2 className="text-4xl font-bold text-foreground">Ready to Get Started?</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Connect your wallet and start issuing blockchain-verified certificates today.
          </p>
          <Link to="/admin">
            <Button size="lg" className="primary-gradient text-primary-foreground hover:opacity-90 transition-smooth">
              Launch Admin Dashboard
            </Button>
          </Link>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-muted-foreground">
            <p>© 2024 Aryan Web3 Labs. Powered by blockchain technology.</p>
            <p className="text-sm mt-2">Admin: {ADMIN_WALLET}</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

const ADMIN_WALLET = '0xbE27...431d';

export default Index;
