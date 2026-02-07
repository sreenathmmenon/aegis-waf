import Link from "next/link";
import { Shield, Lock, Zap, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="flex flex-col min-h-full">
      {/* Hero Section */}
      <section className="bg-grid-pattern px-8 py-24 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold mb-6 text-gradient">
            AEGIS AI Firewall
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Multi-layered AI protection against prompt injection attacks.
            Secure your AI agents with real-time threat detection.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/playground">
              <Button size="lg" className="bg-green-500 hover:bg-green-600">
                Try Playground
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="lg" variant="outline">
                View Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-8 py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Defense Layers
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-green-500/20 glow-green">
              <CardHeader>
                <Shield className="h-8 w-8 text-green-500 mb-2" />
                <CardTitle>Pattern Detection</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Regex-based detection with zero latency for known attack patterns
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-blue-500/20 glow-blue">
              <CardHeader>
                <Lock className="h-8 w-8 text-blue-500 mb-2" />
                <CardTitle>Intent Classification</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  GPT-4o-mini powered analysis for hidden malicious intent
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-purple-500/20 glow-purple">
              <CardHeader>
                <Zap className="h-8 w-8 text-purple-500 mb-2" />
                <CardTitle>Semantic Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Embedding-based similarity detection for variant attacks
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-yellow-500/20 glow-yellow">
              <CardHeader>
                <BarChart3 className="h-8 w-8 text-yellow-500 mb-2" />
                <CardTitle>Real-time Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Monitor threats and performance metrics in real-time
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-8 py-16 border-t border-border">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold text-green-500">99.9%</div>
            <div className="text-muted-foreground mt-2">Detection Rate</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-blue-500">&lt;50ms</div>
            <div className="text-muted-foreground mt-2">Avg Latency</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-purple-500">7</div>
            <div className="text-muted-foreground mt-2">Attack Categories</div>
          </div>
        </div>
      </section>
    </div>
  );
}
