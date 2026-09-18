import React from 'react';
import { Card } from '../../components/ui';
import { PageContainer, PageHero } from '../../components/layout';
import { Bell, CheckCircle2, DollarSign, MessageSquare } from 'lucide-react';

export const NotificationsPage: React.FC = () => {
  const notifications = [
    {
      id: 1,
      title: 'New Quotation Received',
      time: '10 mins ago',
      desc: 'PrintHub submitted a quote of ₹27,500 for Custom T-Shirts.',
      icon: DollarSign,
    },
    {
      id: 2,
      title: 'Requirement Match Alert',
      time: '1 hour ago',
      desc: 'New opportunity matching your category: Office Furniture Setup.',
      icon: MessageSquare,
    },
    {
      id: 3,
      title: 'Order Status Updated',
      time: '3 hours ago',
      desc: 'Order ORD-1045 has been marked as Shipped.',
      icon: CheckCircle2,
    },
  ];

  return (
    <PageContainer bgText="ALERTS">
      <div className="max-w-4xl mx-auto space-y-6">
        <PageHero
          eyebrow="REAL-TIME ACTIVITY FEED"
          title="Platform Notifications"
          description="Stay updated with new quote broadcasts, requirement matches, and order fulfillment milestones."
          bgText="ALERTS"
        />

        <div className="space-y-3 font-mono-tech">
          {notifications.map((n) => {
            const Icon = n.icon;
            return (
              <Card key={n.id} variant="interactive" className="p-5 flex items-start gap-4 border-slate-800">
                <div className="p-2.5 bg-indigo-950/80 text-indigo-400 border border-indigo-800/50 rounded-xl shrink-0 mt-0.5">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-white text-sm font-sans">{n.title}</h3>
                    <span className="text-xs text-slate-500">{n.time}</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{n.desc}</p>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </PageContainer>
  );
};

export default NotificationsPage;

