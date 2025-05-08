const LoadingOverlay = ({ loading }) => {
  return (
    <div>
      {loading && (
        <div id='loading-overlay'>
          <div id='spinner'></div>
        </div>
      )}
    </div>
  )
}

export default LoadingOverlay
