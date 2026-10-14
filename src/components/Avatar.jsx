import { UserIcon } from './Icons.jsx';
import useAvatarStore from '../store/useAvatarStore.jsx';

function Avatar({ avatar="", online, size = 38 }) {
  const avatars = useAvatarStore(state => state.avatars);
  // console.log(avatars?.[avatar])
  return (
    <div className="avatar" style={{ width: size, height: size, fontSize: size * 0.34 }}>
      <div style={{ position: 'absolute', bottom: '-10px', left: '50%', transform: 'translateX(-50%)' }}>
        {avatar ? avatars?.[avatar]?.icon : <UserIcon size={40} />}
      </div>
      {online && <span className="avatar__status" />}
    </div>
  );
}

export default Avatar;
