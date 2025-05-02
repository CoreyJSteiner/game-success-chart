const LoadingOverlay = ({ loading }) => {
  return (
    <div>
      {loading && (
        <div className='loading-overlay' id='loadingOverlay'>
          <div className='spinner'></div>
        </div>
      )}
    </div>
  )
}

export default LoadingOverlay
