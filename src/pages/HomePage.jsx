const HomePage = () => {
  const handleScan = () => {
    if (
      window.webkit &&
      window.webkit.messageHandlers &&
      window.webkit.messageHandlers.camera
    ) {
      window.webkit.messageHandlers.camera.postMessage("start");
    } else {
      console.log("Not running in WebView or message handler missing");
    }
  };

  return (
    <>
      <button onClick={handleScan}>Scan</button>
    </>
  );
};

export default HomePage;
