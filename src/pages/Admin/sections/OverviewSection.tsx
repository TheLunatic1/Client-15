import { motion } from 'framer-motion';
import { 
  Briefcase, Clock, Check, LayoutDashboard, MapPin, TrendingUp, 
  Plus, MessageSquare, Users 
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell, PieChart, Pie
} from 'recharts';

interface OverviewProps {
  signupData: any[];
  categoryData: any[];
  locationData: any[];
  stats?: {
    totalBusinesses?: number;
    pendingBusinesses?: number;
    approvedBusinesses?: number;
    totalCategories?: number;
    totalLocations?: number;
    totalUsers?: number;
    totalBlogs?: number;
    recentActivity?: { text: string; time: string; type: string }[];
  };
  isLoading?: boolean;
}

const OverviewSection = ({ signupData, categoryData, locationData, stats, isLoading }: OverviewProps) => {
  const statCards = [
    {
      label: 'Total Businesses',
      value: isLoading ? '…' : (stats?.totalBusinesses ?? '—'),
      change: '+8.2%',
      vs: 'vs last month',
      icon: Briefcase,
      color: 'text-primary',
      bg: 'bg-primary/5'
    },
    {
      label: 'Pending Approvals',
      value: isLoading ? '…' : (stats?.pendingBusinesses ?? '—'),
      change: 'Awaiting Review',
      icon: Clock,
      color: 'text-amber-600',
      bg: 'bg-amber-50'
    },
    {
      label: 'Active Listings',
      value: isLoading ? '…' : (stats?.approvedBusinesses ?? '—'),
      change: '+4.1%',
      icon: Check,
      color: 'text-emerald-500',
      bg: 'bg-emerald-50'
    },
    {
      label: 'Categories',
      value: isLoading ? '…' : (stats?.totalCategories ?? '—'),
      change: 'Service Types',
      icon: LayoutDashboard,
      color: 'text-blue-500',
      bg: 'bg-blue-50'
    },
    {
      label: 'Locations',
      value: isLoading ? '…' : (stats?.totalLocations ?? '—'),
      change: 'Regions',
      icon: MapPin,
      color: 'text-indigo-500',
      bg: 'bg-indigo-50'
    },
    {
      label: 'Total Users',
      value: isLoading ? '…' : (stats?.totalUsers ?? '—'),
      change: 'Registered',
      icon: TrendingUp,
      color: 'text-emerald-500',
      bg: 'bg-emerald-50'
    },
  ];

  const activityIcons: Record<string, any> = {
    add: Plus,
    approve: Check,
    message: MessageSquare,
    user: Users,
    business: Briefcase,
  };

  const defaultActivity = [
    { text: 'No recent activity yet', time: 'Now', type: 'business' },
  ];

  const activity = stats?.recentActivity?.length ? stats.recentActivity : defaultActivity;

  return (
    <motion.div key="overview" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        {statCards.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
            <div className="flex items-center justify-between mb-4">
              <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
              <div className={`p-2.5 rounded-xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                <stat.icon size={16} />
              </div>
            </div>
            <p className="text-xl font-black text-slate-900 mb-2">{String(stat.value)}</p>
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-md ${stat.color === 'text-amber-600' ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'}`}>
                {stat.change}
              </span>
              {'vs' in stat && stat.vs && <span className="text-[10px] font-bold text-slate-300 uppercase tracking-tighter">{stat.vs}</span>}
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 bg-white rounded-[3rem] p-10 border border-slate-100 shadow-sm">
          <div className="mb-8">
            <h3 className="text-lg font-black text-[#0D1F43]">New business signups</h3>
            <p className="text-[12px] font-bold text-slate-400">Last 7 months</p>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={signupData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#097DDD" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#097DDD" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 700, fill: '#94a3b8' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 700, fill: '#94a3b8' }} />
                <Tooltip
                  contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', fontSize: '13px', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="value" stroke="#097DDD" strokeWidth={4} fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-sm">
          <h3 className="text-lg font-black text-[#0D1F43] mb-8">Recent activity</h3>
          <div className="space-y-8">
            {activity.map((act, i) => {
              const IconComp = activityIcons[act.type] ?? Briefcase;
              const bgMap: Record<string, string> = {
                add: 'bg-blue-50 text-blue-500',
                approve: 'bg-emerald-50 text-emerald-500',
                message: 'bg-indigo-50 text-indigo-500',
                user: 'bg-purple-50 text-purple-500',
                business: 'bg-slate-50 text-slate-500',
              };
              const cls = bgMap[act.type] ?? 'bg-slate-50 text-slate-500';
              return (
                <div key={i} className="flex gap-5 group">
                  <div className={`w-10 h-10 rounded-xl ${cls} flex-shrink-0 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <IconComp size={16} />
                  </div>
                  <div>
                    <p className="text-[13px] font-black text-slate-800 leading-snug group-hover:text-primary transition-colors">{act.text}</p>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">{act.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-10">
        <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-sm">
          <div className="mb-10">
            <h3 className="text-lg font-black text-[#0D1F43]">Category distribution</h3>
            <p className="text-[12px] font-bold text-slate-400">Top categories</p>
          </div>
          <div className="flex items-center justify-between">
            <div className="h-[250px] w-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={8}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-x-12 gap-y-6">
              {categoryData.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-[12px] font-black text-slate-500 uppercase tracking-widest">{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-sm">
          <div className="mb-10">
            <h3 className="text-lg font-black text-[#0D1F43]">Location distribution</h3>
            <p className="text-[12px] font-bold text-slate-400">Listings by region</p>
          </div>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={locationData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 800, fill: '#94a3b8' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 800, fill: '#94a3b8' }} />
                <Tooltip
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', fontSize: '13px', fontWeight: 'bold' }}
                />
                <Bar dataKey="value" fill="#097DDD" radius={[8, 8, 0, 0]} barSize={60} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default OverviewSection;
