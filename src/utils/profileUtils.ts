export const getAvatarFallback = (name: string) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'User')}&background=097DDD&color=fff`;

export const resolveAvatarUrl = (name: string, profileImage?: string | null) =>
  profileImage?.trim() ? profileImage : getAvatarFallback(name);

export const syncProfileCache = (data: {
  name?: string;
  profileImage?: string;
}) => {
  if (data.name) localStorage.setItem('userName', data.name);
  if (data.profileImage !== undefined) {
    if (data.profileImage) {
      localStorage.setItem('userProfileImage', data.profileImage);
    } else {
      localStorage.removeItem('userProfileImage');
    }
  }
  window.dispatchEvent(new Event('profile-updated'));
};

export const getCachedProfile = () => {
  const name = localStorage.getItem('userName') || 'User';
  const profileImage = localStorage.getItem('userProfileImage') || '';
  return {
    name,
    avatar: resolveAvatarUrl(name, profileImage),
    profileImage,
  };
};
