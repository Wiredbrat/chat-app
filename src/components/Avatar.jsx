function Avatar({ initials, online, size = 38 }) {
  return (
    <div className="avatar" style={{ width: size, height: size, fontSize: size * 0.34 }}>
      {initials}
      {online && <span className="avatar__status" />}
    </div>
  );
}

export default Avatar;
