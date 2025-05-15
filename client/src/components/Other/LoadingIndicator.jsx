import { ThreeDot } from "react-loading-indicators";

function LoadingIndicator() {
  return (
    <div className="loading-indicator">
      <ThreeDot width={50} height={50} color="#000" count={3} />
    </div>
  );
}

export default LoadingIndicator;
