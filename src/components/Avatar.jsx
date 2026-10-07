import { UserIcon } from './Icons.jsx';


function Avatar({ initials="", online, size = 38 }) {
  return (
    <div className="avatar" style={{ width: size, height: size, fontSize: size * 0.34 }}>
      <div style={{ position: 'absolute', bottom: '-10px', left: '50%', transform: 'translateX(-50%)' }}>
        <UserIcon size={40} />
      </div>
      {online && <span className="avatar__status" />}
    </div>
  );
}

export default Avatar;
