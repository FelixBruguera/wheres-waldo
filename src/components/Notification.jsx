const Notification = ({ content, style }) => {
  return (
    <div
      className={`fixed right-2 bottom-2 py-3 px-5 rounded-xl bg-accent text-white font-bold ${style}`}
    >
      {content}
    </div>
  )
}

export default Notification
