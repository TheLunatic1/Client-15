import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';
import { Users, Briefcase, Mail, ShieldCheck, ShieldAlert, Clock, Trash2, Edit2 } from 'lucide-react';
import { getUsers, updateUser, deleteUser } from '../../../api/userApi';
import LoadingScreen from '../../../components/common/LoadingScreen';

const UsersSection = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getUsers();
        const mapped = data.map((u: any) => ({
          id: u._id,
          name: u.name || `${u.firstName} ${u.lastName}`,
          email: u.email,
          role: u.role.charAt(0).toUpperCase() + u.role.slice(1),
          status: u.status || 'Verified',
          joined: new Date(u.createdAt).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }),
          avatar: u.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name || u.firstName)}&background=097DDD&color=fff`
        }));
        setUsers(mapped);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const totalMembers = users.length;
  const activeTradies = users.filter(u => u.role === 'Tradie' && u.status === 'Verified').length;
  const pendingApprovals = users.filter(u => u.status === 'Pending').length;
  const blockedAccounts = users.filter(u => u.status === 'Blocked').length;

  const handleEdit = (user: any) => {
    Swal.fire({
      title: 'Manage Member Account',
      html: `
        <div class="text-left space-y-4 font-sans">
          <div class="flex items-center gap-4 mb-6 pb-6 border-b border-slate-100">
            <img src="${user.avatar}" class="w-14 h-14 rounded-2xl object-cover border" />
            <div>
              <h4 class="font-black text-slate-800 text-base leading-tight">${user.name}</h4>
              <p class="text-xs text-slate-400 font-bold">${user.email}</p>
            </div>
          </div>
          <div class="space-y-2">
            <label class="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Account Status</label>
            <select id="swal-user-status" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-700 font-bold focus:outline-none focus:border-[#097DDD] cursor-pointer">
              <option value="Verified" ${user.status === 'Verified' ? 'selected' : ''}>Active / Verified</option>
              <option value="Pending" ${user.status === 'Pending' ? 'selected' : ''}>Pending Verification</option>
              <option value="Blocked" ${user.status === 'Blocked' ? 'selected' : ''}>Blocked / Banned</option>
            </select>
          </div>
          <div class="space-y-2 mt-4">
            <label class="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Account Role</label>
            <select id="swal-user-role" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-700 font-bold focus:outline-none focus:border-[#097DDD] cursor-pointer">
              <option value="Tradie" ${user.role === 'Tradie' ? 'selected' : ''}>Tradie / Provider</option>
              <option value="User" ${user.role === 'User' ? 'selected' : ''}>User / Customer</option>
            </select>
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Apply Changes',
      confirmButtonColor: '#097DDD',
      cancelButtonColor: '#64748b',
      preConfirm: () => {
        const status = (document.getElementById('swal-user-status') as HTMLSelectElement).value;
        const role = (document.getElementById('swal-user-role') as HTMLSelectElement).value;
        return { status, role };
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        const { status, role } = result.value;

        // If the admin chose to block the account and it wasn't blocked already, ask for the reason
        if (status === 'Blocked' && user.status !== 'Blocked') {
          Swal.fire({
            title: 'Reason for Blocking',
            text: `Please provide a reason for blocking ${user.name}'s account:`,
            input: 'text',
            inputPlaceholder: 'e.g., Policy violation, suspicious activity...',
            showCancelButton: true,
            confirmButtonText: 'Block Account',
            confirmButtonColor: '#f43f5e',
            cancelButtonColor: '#64748b',
            preConfirm: (reason) => {
              if (!reason) {
                Swal.showValidationMessage('Please provide a reason to block this account.');
              }
              return reason;
            }
          }).then(async (blockResult) => {
            if (blockResult.isConfirmed) {
              try {
                await updateUser(user.id, { role: role.toLowerCase(), status: 'Blocked' });
                setUsers(users.map(u => u.id === user.id ? { ...u, status: 'Blocked', role } : u));
                Swal.fire({
                  title: 'Account Blocked',
                  text: `Account has been blocked. Reason logged: "${blockResult.value}"`,
                  icon: 'warning',
                  confirmButtonColor: '#097DDD',
                });
              } catch (error: any) {
                Swal.fire('Error', error.response?.data?.message || 'Failed to block account.', 'error');
              }
            }
          });
        } else {
          try {
            await updateUser(user.id, { role: role.toLowerCase(), status });
            setUsers(users.map(u => u.id === user.id ? { ...u, status, role } : u));
            Swal.fire({
              title: 'Changes Applied!',
              text: 'Member details have been updated successfully.',
              icon: 'success',
              confirmButtonColor: '#097DDD',
            });
          } catch (error: any) {
             Swal.fire('Error', error.response?.data?.message || 'Failed to update account.', 'error');
          }
        }
      }
    });
  };

  const handleRemove = (user: any) => {
    Swal.fire({
      title: 'Remove Member?',
      text: `Are you sure you want to permanently remove ${user.name}? This action cannot be undone. Please state the reason:`,
      input: 'text',
      inputPlaceholder: 'Reason for removal (e.g., Requested by user, inactive)...',
      inputAttributes: {
        autocapitalize: 'off'
      },
      showCancelButton: true,
      confirmButtonText: 'Yes, remove permanently',
      confirmButtonColor: '#f43f5e',
      cancelButtonColor: '#64748b',
      preConfirm: (reason) => {
        if (!reason) {
          Swal.showValidationMessage('Please provide a reason to remove this account.');
        }
        return reason;
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteUser(user.id);
          setUsers(users.filter(u => u.id !== user.id));
          Swal.fire({
            title: 'Account Removed',
            text: `Member account has been deleted. Reason logged: "${result.value}"`,
            icon: 'success',
            confirmButtonColor: '#097DDD',
          });
        } catch (error: any) {
          Swal.fire('Error', error.response?.data?.message || 'Failed to remove account.', 'error');
        }
      }
    });
  };

  if (isLoading) return <LoadingScreen />;

  return (
    <motion.div key="users" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10">
      <div className="bg-[#0D1F43] rounded-[3rem] p-12 text-white relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 blur-[120px] rounded-full -mr-48 -mt-48" />
        <div className="relative z-10">
          <div className="flex items-center gap-6 mb-8">
            <div className="w-16 h-16 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/10">
              <Users size={32} />
            </div>
            <div>
              <h2 className="text-3xl font-black tracking-tight mb-2">Member Directory</h2>
              <p className="text-white/40 text-[13px] font-black uppercase tracking-[0.4em]">Verified Pros & Platform Users</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { label: 'Total Members', value: totalMembers.toString(), icon: Users },
              { label: 'Active Tradies', value: activeTradies.toString(), icon: Briefcase },
              { label: 'Pending Approvals', value: pendingApprovals.toString(), icon: Clock },
              { label: 'Blocked Accounts', value: blockedAccounts.toString(), icon: ShieldAlert },
            ].map((stat, i) => (
              <div key={i} className="bg-white/5 backdrop-blur-xl border border-white/5 p-6 rounded-[2rem] hover:bg-white/10 transition-all">
                <p className="text-[11px] font-black text-white/40 uppercase tracking-widest mb-4">{stat.label}</p>
                <div className="flex items-end justify-between">
                  <span className="text-2xl font-black">{stat.value}</span>
                  <stat.icon size={20} className="text-primary mb-1" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-12 py-10 border-b border-slate-50 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-black text-[#0D1F43]">Recent Registrations</h3>
            <p className="text-[12px] font-bold text-slate-400 uppercase tracking-widest mt-1">Real-time overview of platform members</p>
          </div>
          <div className="flex gap-4">
            <span className="bg-primary/10 text-primary px-4 py-2 rounded-xl text-[12px] font-black uppercase tracking-widest">{users.length} Total Members</span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-12 py-6 text-[12px] font-black text-slate-400 uppercase tracking-widest">Member Profile</th>
                <th className="px-8 py-6 text-[12px] font-black text-slate-400 uppercase tracking-widest">Account Role</th>
                <th className="px-8 py-6 text-[12px] font-black text-slate-400 uppercase tracking-widest">Joined Date</th>
                <th className="px-8 py-6 text-[12px] font-black text-slate-400 uppercase tracking-widest">Trust Status</th>
                <th className="px-12 py-6 text-[12px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-12 py-8">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:scale-105 transition-transform overflow-hidden border-2 border-slate-50">
                        <img src={user.avatar} className="w-full h-full object-cover" alt="" />
                      </div>
                      <div>
                        <p className="text-[14px] font-black text-slate-900 leading-tight mb-1">{user.name}</p>
                        <div className="flex items-center gap-2 text-slate-400">
                          <Mail size={12} />
                          <span className="text-[12px] font-bold lowercase">{user.email}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-8">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${user.role === 'Tradie' ? 'bg-[#097DDD]' : 'bg-slate-300'}`} />
                      <span className={`text-[12px] font-black uppercase tracking-widest ${user.role === 'Tradie' ? 'text-[#0D1F43]' : 'text-slate-400'}`}>
                        {user.role}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-8">
                    <div className="flex items-center gap-2 text-slate-500">
                      <Clock size={14} className="text-slate-300" />
                      <span className="text-[13px] font-bold">{user.joined}</span>
                    </div>
                  </td>
                  <td className="px-8 py-8">
                    <span className={`px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-widest border inline-flex items-center gap-1.5 w-fit ${
                      user.status === 'Verified' 
                        ? 'bg-emerald-50 text-emerald-500 border-emerald-100' 
                        : user.status === 'Blocked'
                        ? 'bg-rose-50 text-rose-500 border-rose-100'
                        : 'bg-amber-50 text-amber-500 border-amber-100'
                    }`}>
                      {user.status === 'Verified' && <ShieldCheck size={10} />}
                      {user.status === 'Blocked' && <ShieldAlert size={10} />}
                      {user.status === 'Pending' && <Clock size={10} />}
                      {user.status}
                    </span>
                  </td>
                  <td className="px-12 py-8 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <button 
                        onClick={() => handleEdit(user)} 
                        className="p-3 bg-slate-50 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-xl transition-all shadow-sm"
                        title="Edit User Actions"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button 
                        onClick={() => handleRemove(user)} 
                        className="p-3 bg-slate-50 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all shadow-sm"
                        title="Remove Account"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

export default UsersSection;
