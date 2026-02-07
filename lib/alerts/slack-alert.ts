/**
 * Slack Alert Integration
 * Sends critical security events to Slack workspace
 */

import { ValidationResult } from '@/lib/types';

interface SlackBlock {
  type: string;
  text?: {
    type: string;
    text: string;
    emoji?: boolean;
  };
  fields?: Array<{
    type: string;
    text: string;
  }>;
  elements?: Array<any>;
  accessory?: any;
}

interface SlackMessage {
  blocks: SlackBlock[];
}

/**
 * Send security alert to Slack
 */
export async function sendSlackAlert(
  validation: ValidationResult,
  outputGuard?: any
): Promise<void> {
  // Only alert on BLOCK and FLAG
  if (validation.decision === 'ALLOW') {
    return;
  }

  const webhookUrl = process.env.SLACK_WEBHOOK_URL;
  if (!webhookUrl) {
    console.log('ℹ️ SLACK_WEBHOOK_URL not set, skipping alert');
    return;
  }

  // Build Slack message
  const emoji = validation.decision === 'BLOCK' ? '🔴' : '🟡';
  const title = validation.decision === 'BLOCK'
    ? 'AEGIS: Threat Blocked'
    : 'AEGIS: Suspicious Activity';

  const message: SlackMessage = {
    blocks: [
      // Header
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: `${emoji} ${title}`,
          emoji: true
        }
      },
      // Details fields
      {
        type: 'section',
        fields: [
          {
            type: 'mrkdwn',
            text: `*Attack Type:*\n${validation.category || 'Unknown'}`
          },
          {
            type: 'mrkdwn',
            text: `*Severity:*\n${validation.threatLevel}`
          },
          {
            type: 'mrkdwn',
            text: `*Latency:*\n${validation.latencyMs}ms`
          },
          {
            type: 'mrkdwn',
            text: `*Time:*\n${new Date(validation.timestamp).toLocaleString()}`
          }
        ]
      },
      // Input preview
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*Input Preview:*\n\`\`\`${validation.input.substring(0, 150)}${validation.input.length > 150 ? '...' : ''}\`\`\``
        }
      },
      // Layers triggered
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*Defense Layers:*\n${validation.layers.map(l => {
            const icon = l.status === 'PASS' ? '✅' : l.status === 'FAIL' ? '❌' : '⚠️';
            return `${icon} ${l.layer}: ${l.status} (${l.latencyMs.toFixed(1)}ms)`;
          }).join('\n')}`
        }
      }
    ]
  };

  // Add output guard info if present
  if (outputGuard && outputGuard.violations && outputGuard.violations.length > 0) {
    message.blocks.push({
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `*Output Violations:*\n${outputGuard.violations.map((v: any) =>
          `• ${v.description} (${v.severity})`
        ).join('\n')}`
      }
    });
  }

  // Context footer
  message.blocks.push({
    type: 'context',
    elements: [
      {
        type: 'mrkdwn',
        text: `Session: ${validation.sessionId || 'N/A'} | 🛡️ Protected by AEGIS WAF`
      }
    ]
  });

  // Action button
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  message.blocks.push({
    type: 'actions',
    elements: [
      {
        type: 'button',
        text: {
          type: 'plain_text',
          text: '📊 View Dashboard',
          emoji: true
        },
        url: `${appUrl}/dashboard`,
        action_id: 'view_dashboard'
      }
    ]
  });

  // Fire and forget - don't await
  fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(message)
  })
    .then(res => {
      if (!res.ok) {
        console.error('❌ Slack alert failed:', res.status);
      } else {
        console.log(`✅ Slack alert sent: ${validation.decision}`);
      }
    })
    .catch(err => {
      console.error('❌ Slack alert error:', err.message);
    });
}
