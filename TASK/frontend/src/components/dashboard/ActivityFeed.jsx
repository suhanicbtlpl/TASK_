import React from 'react';

const ActivityFeed = ({ activities }) => {
    if (!activities || activities.length === 0) {
        return <p className="text-slate-400 text-sm py-4 text-center">No recent activity found.</p>;
    }

    const getActionStyle = (action) => {
        switch (action) {
            case 'CREATE': return { bg: 'bg-emerald-500', icon: '+' };
            case 'UPDATE': return { bg: 'bg-blue-500', icon: '✎' };
            case 'DELETE': return { bg: 'bg-rose-500', icon: '×' };
            default: return { bg: 'bg-slate-500', icon: '•' };
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 mt-4">
            {activities.map((activity, i) => {
                const style = getActionStyle(activity.action);
                return (
                    <div key={activity._id || i} className="flex items-start gap-4 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                        <div className="relative">
                            {activity.user?.profilePhoto ? (
                                <img 
                                    src={activity.user.profilePhoto} 
                                    alt="" 
                                    className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm" 
                                />
                            ) : (
                                <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-bold">
                                    {activity.user?.name?.charAt(0) || '?'}
                                </div>
                            )}
                            <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white flex items-center justify-center text-[10px] text-white ${style.bg}`}>
                                {style.icon}
                            </div>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-800 line-clamp-1">{activity.details}</p>
                            <p className="text-xs text-slate-400 mt-0.5 whitespace-nowrap">
                                {new Date(activity.createdAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                            </p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default ActivityFeed;
