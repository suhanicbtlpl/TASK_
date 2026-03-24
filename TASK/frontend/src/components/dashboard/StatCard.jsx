import React from 'react';
import { Card } from '../shared/UIComponents';

const StatCard = ({ label, value, icon: Icon, color, bg }) => (
    <Card className="flex flex-col items-center justify-center text-center py-8">
        <div className={`p-3 rounded-2xl ${bg} ${color} mb-4`}>
            <Icon size={28} />
        </div>
        <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">{label}</p>
        <p className="text-3xl font-bold text-slate-900 mt-1">{value}</p>
    </Card>
);

export default StatCard;
