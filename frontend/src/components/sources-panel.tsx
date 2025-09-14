import React from 'react';
import { ExternalLink, Shield, Clock, CheckCircle, AlertTriangle, Globe } from 'lucide-react';
import { Badge } from './ui/badge';

interface Source {
  name: string;
  url: string;
  reliability: 'high' | 'medium' | 'low';
  lastUpdated: string;
  icon: string;
  verified: boolean;
  dataPoints: number;
}

interface SourcesPanelProps {
  sources: Source[];
}

const getReliabilityColor = (reliability: Source['reliability']) => {
  switch (reliability) {
    case 'high': return 'text-green-400 border-green-400';
    case 'medium': return 'text-yellow-400 border-yellow-400';
    case 'low': return 'text-red-400 border-red-400';
    default: return 'text-primary border-primary';
  }
};

const getReliabilityIcon = (reliability: Source['reliability']) => {
  switch (reliability) {
    case 'high': return <CheckCircle className="w-4 h-4" />;
    case 'medium': return <Clock className="w-4 h-4" />;
    case 'low': return <AlertTriangle className="w-4 h-4" />;
    default: return <Globe className="w-4 h-4" />;
  }
};

const SourcesPanel: React.FC<SourcesPanelProps> = ({ sources }) => {
  if (sources.length === 0) {
    return (
      <div className="cyber-border rounded-lg p-6 text-center neon-glow">
        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-3">
          <Globe className="w-6 h-6 text-primary/60" />
        </div>
        <h3 className="text-lg font-semibold mb-2 terminal-font">NO_DATA_FOUND</h3>
        <p className="text-muted-foreground mb-4 text-sm terminal-font">
          neural_scan_incomplete
        </p>
        <button className="px-4 py-2 cyber-border rounded-md hover:neon-glow transition-all duration-300 text-sm terminal-font">
          ADD_SOURCE
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-lg font-bold mb-2 neon-text terminal-font">DATA_SOURCES</h3>
        <p className="text-muted-foreground text-xs terminal-font">verified_information_nodes</p>
      </div>

      {/* Sources Grid */}
      <div className="grid gap-3">
        {sources.map((source, index) => (
          <div key={index} className="cyber-border rounded-lg p-4 hover:neon-glow transition-all duration-300 group">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center text-lg">
                  {source.icon}
                </div>
                <div>
                  <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors text-sm terminal-font">
                    {source.name}
                  </h4>
                  <p className="text-xs text-muted-foreground terminal-font">
                    {source.dataPoints} NODES
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-1">
                {source.verified && (
                  <div className="w-4 h-4 rounded-sm bg-green-500/20 flex items-center justify-center">
                    <Shield className="w-2 h-2 text-green-400" />
                  </div>
                )}
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-6 h-6 rounded-sm bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors"
                >
                  <ExternalLink className="w-3 h-3 text-primary" />
                </a>
              </div>
            </div>

            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1">
                <div className={`flex items-center gap-1 ${getReliabilityColor(source.reliability)}`}>
                  {getReliabilityIcon(source.reliability)}
                  <span className="text-xs capitalize terminal-font">{source.reliability}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="w-2 h-2" />
                <span className="terminal-font">{source.lastUpdated}</span>
              </div>
            </div>

            {/* Reliability Indicator */}
            <div className="flex gap-px">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className={`h-1 flex-1 ${
                    i < (source.reliability === 'high' ? 5 : source.reliability === 'medium' ? 3 : 1)
                      ? 'bg-primary'
                      : 'bg-primary/20'
                  }`}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Add Source Button */}
      <div className="text-center pt-4">
        <button className="px-4 py-2 cyber-border rounded-md hover:neon-glow transition-all duration-300 flex items-center gap-2 mx-auto text-sm terminal-font">
          <ExternalLink className="w-3 h-3" />
          ADD_SOURCE
        </button>
      </div>

      {/* Source Quality Legend */}
      <div className="cyber-border rounded-lg p-3">
        <h4 className="font-semibold mb-2 text-center text-sm terminal-font">TRUST_LEVELS</h4>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="flex flex-col items-center gap-1">
            <CheckCircle className="w-3 h-3 text-green-400" />
            <span className="text-xs text-green-400 terminal-font">HIGH</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Clock className="w-3 h-3 text-yellow-400" />
            <span className="text-xs text-yellow-400 terminal-font">MED</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <AlertTriangle className="w-3 h-3 text-red-400" />
            <span className="text-xs text-red-400 terminal-font">LOW</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SourcesPanel;