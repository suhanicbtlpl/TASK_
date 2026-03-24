import React from 'react';

const Timeline = ({ projects }) => {
    // Simple Gantt Chart using CSS Grid/Flex
    // Find min/max dates
    const allDates = projects.flatMap(p => [new Date(p.startDate), p.endDate ? new Date(p.endDate) : new Date()]);
    const minDate = new Date(Math.min(...allDates));
    const maxDate = new Date(Math.max(...allDates));
    
    // Add some padding to dates
    minDate.setDate(1);
    maxDate.setMonth(maxDate.getMonth() + 2);
    maxDate.setDate(0);

    const totalDays = Math.ceil((maxDate - minDate) / (1000 * 60 * 60 * 24));
    const months = [];
    let curr = new Date(minDate);
    while (curr <= maxDate) {
        months.push(new Date(curr));
        curr.setMonth(curr.getMonth() + 1);
    }

    const getPosition = (date) => {
        const d = new Date(date);
        const diff = Math.ceil((d - minDate) / (1000 * 60 * 60 * 24));
        return (diff / totalDays) * 100;
    };

    return (
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
            <div className="overflow-x-auto">
                <div className="min-w-[800px] p-6">
                    {/* Month Header */}
                    <div className="flex border-b border-slate-100 mb-6">
                        {months.map((m, i) => (
                            <div 
                                key={i} 
                                className="flex-1 text-center py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-r border-slate-50 last:border-0"
                            >
                                {m.toLocaleString('default', { month: 'short', year: '2-digit' })}
                            </div>
                        ))}
                    </div>

                    {/* Timeline Rows */}
                    <div className="space-y-4 relative">
                        {/* Vertical Grid Lines */}
                        <div className="absolute inset-0 flex pointer-events-none">
                            {months.map((_, i) => (
                                <div key={i} className="flex-1 border-r border-slate-50 last:border-0"></div>
                            ))}
                        </div>

                        {projects.map((project) => {
                            const start = getPosition(project.startDate);
                            const end = getPosition(project.endDate || new Date());
                            const width = Math.max(end - start, 2); // Min 2% width

                            return (
                                <div key={project._id} className="relative h-12 flex items-center group">
                                    <div 
                                        className="absolute h-8 rounded-lg shadow-sm flex items-center px-3 transition-all group-hover:shadow-md cursor-pointer z-10"
                                        style={{ 
                                            left: `${start}%`, 
                                            width: `${width}%`,
                                            backgroundColor: project.status === 'Completed' ? '#10b981' : 
                                                            project.status === 'On Hold' ? '#f59e0b' : '#3b82f6',
                                            opacity: 0.9
                                        }}
                                    >
                                        <span className="text-white text-[10px] font-bold truncate">
                                            {project.projectName}
                                        </span>
                                        
                                        {/* Tooltip on hover */}
                                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-50">
                                            <div className="bg-slate-800 text-white text-[10px] py-1 px-2 rounded whitespace-nowrap">
                                                {new Date(project.startDate).toLocaleDateString()} - {project.endDate ? new Date(project.endDate).toLocaleDateString() : 'Ongoing'}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
            
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex gap-4 justify-center">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-blue-500"></div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Active</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-emerald-500"></div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Completed</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-amber-500"></div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase">On Hold</span>
                </div>
            </div>
        </div>
    );
};

export default Timeline;
